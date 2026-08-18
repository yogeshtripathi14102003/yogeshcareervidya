
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api.js";

const APPROVAL_LIST = ["UGC", "AICTE", "NAAC"];
const PAGE_SIZE = 5; // how many cards each "Load More" click reveals
const MAX_COMPARE = 3; // cap so the comparison drawer stays readable

// Manual fee-range chips in the sidebar. `max: Infinity` means "no ceiling".
const FEE_RANGES = [
  { key: "u50k", label: "Under ₹50K", min: 0, max: 50000 },
  { key: "50k-1l", label: "₹50K – ₹1L", min: 50000, max: 100000 },
  { key: "1l-3l", label: "₹1L – ₹3L", min: 100000, max: 300000 },
  { key: "3lplus", label: "₹3L+", min: 300000, max: Infinity },
];

const SORT_OPTIONS = [
  { key: "relevance", label: "Relevance" },
  { key: "feesLow", label: "Fees: Low to High" },
  { key: "feesHigh", label: "Fees: High to Low" },
];

// University's image field is a plain string (sometimes relative), unlike
// the course's courseLogo.url object — this resolves it to a full URL.
const resolveUniversityImage = (uni) => {
  const raw = uni?.universityImage;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return `${process.env.NEXT_PUBLIC_API_URL}/${raw.replace(/^\/+/, "")}`;
};

// Fee fields sometimes arrive as numbers, sometimes as strings like "₹50,000"
// or "50000/-" — this coerces any of those into a clean number, or null.
const toNumber = (val) => {
  if (val == null || val === "") return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  if (cleaned === "") return null;
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};

const feeValueOf = (obj) => toNumber(obj?.fees ?? obj?.minFees ?? obj?.avgFees ?? obj?.maxFees);

// Does [min1,max1] overlap [min2,max2]? Used so a university whose fee
// range straddles the selected budget (e.g. ₹40K–₹2L against a ₹50K–₹1L
// filter) still counts as a match, instead of only checking exact endpoints.
const rangesOverlap = (min1, max1, min2, max2) => min1 <= max2 && max1 >= min2;

// Shows a real logo image if a URL is available, otherwise falls back to
// a colored circle with the entity's first initial — never a broken image.
const Avatar = ({ src, name, size = 44, radius = 12 }) => {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  if (src) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: radius,
          position: "relative", flexShrink: 0, overflow: "hidden",
          border: "1px solid #EEF1F6", background: "#fff",
        }}
      >
        <Image
          src={src}
          alt={name || "logo"}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "contain", padding: 4 }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius,
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
        color: "#1D4ED8", fontWeight: 800, fontSize: size * 0.4,
        border: "1px solid #DBEAFE",
      }}
    >
      {initial}
    </div>
  );
};

// Modern-minimal "Load More" button — subtle border, soft shadow on hover.
const LoadMoreButton = ({ onClick, remaining }) => (
  <button
    onClick={onClick}
    className="load-more-btn"
    style={{
      width: "100%", marginTop: 4, padding: "11px 16px", borderRadius: 12,
      border: "1px solid #E5E9F2", background: "#fff", color: "#374151",
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    }}
  >
    Load more
    <span style={{ color: "#9CA3AF", fontWeight: 500 }}>({remaining} more)</span>
  </button>
);

// Small round checkbox used to add a card to the comparison tray. Stops the
// click from bubbling into the parent <Link>, so it never triggers navigation.
const CompareToggle = ({ checked, disabled, onToggle }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) onToggle();
    }}
    title={disabled ? `You can compare up to ${MAX_COMPARE} at a time` : "Add to compare"}
    style={{
      width: 22, height: 22, borderRadius: 7, flexShrink: 0, cursor: disabled ? "not-allowed" : "pointer",
      border: `1.5px solid ${checked ? "#4338CA" : "#D1D5DB"}`,
      background: checked ? "#4338CA" : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: disabled ? 0.4 : 1,
    }}
  >
    {checked && (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </button>
);

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]); // universities
  const [courseResults, setCourseResults] = useState([]); // courses (own collection, own slug)
  const [loading, setLoading] = useState(false);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [selectedFeeRange, setSelectedFeeRange] = useState(null); // key from FEE_RANGES
  const [sortBy, setSortBy] = useState("relevance");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Per-column "Load More" pagination — each column reveals PAGE_SIZE more
  // cards at a time, independently of the other column.
  const [uniVisibleCount, setUniVisibleCount] = useState(PAGE_SIZE);
  const [courseVisibleCount, setCourseVisibleCount] = useState(PAGE_SIZE);

  // Comparison tray — pick up to MAX_COMPARE universities/courses and see
  // them side by side in the slide-up drawer.
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // controls slide-in on mount and slide-out before navigating away
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const placeholders = ["Find University...", "Find College...", "Find Course..."];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => router.back(), 280);
  };

  const resetPagination = () => {
    setUniVisibleCount(PAGE_SIZE);
    setCourseVisibleCount(PAGE_SIZE);
  };

  const getSmartFilters = (query) => {
    const lowerQuery = query.toLowerCase();
    let detectedFees = null;
    let cleanQuery = lowerQuery;
    const feeMatch = lowerQuery.match(/(?:under|below|less than|upto)\s?(\d+k?)/);
    if (feeMatch) {
      let value = feeMatch[1];
      detectedFees = value.includes("k")
        ? parseInt(value.replace("k", "")) * 1000
        : parseInt(value);
      cleanQuery = lowerQuery.replace(feeMatch[0], "").trim();
    }
    return { detectedFees, cleanQuery };
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setCourseResults([]);
      setLoading(false);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      const { cleanQuery } = getSmartFilters(searchQuery);
      resetPagination();
      fetchResults(cleanQuery || searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchResults = async (q) => {
    setLoading(true);
    try {
      const [uniRes, courseRes] = await Promise.all([
        api.get(`/api/v1/university/search/all?query=${q}`),
        api.get(`/api/v1/course/search?query=${q}`),
      ]);
      setSearchResults(uniRes.data.data || []);
      setCourseResults(courseRes.data.data || []);
    } catch {
      setSearchResults([]);
      setCourseResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Effective fee window: a manually picked chip wins; otherwise fall back
  // to whatever the typed query implied (e.g. "MBA under 50k").
  const { detectedFees } = getSmartFilters(searchQuery);
  const activeFeeRange = FEE_RANGES.find((r) => r.key === selectedFeeRange);
  const effectiveFeeWindow = activeFeeRange
    ? { min: activeFeeRange.min, max: activeFeeRange.max }
    : detectedFees
    ? { min: 0, max: detectedFees }
    : null;

  // Universities column — trust the backend's own relevance matching, then
  // layer the approval + fee filters and sorting on top locally.
  let filteredResults = searchResults
    .filter((result) => {
      if (selectedApprovals.length > 0) {
        const universityApprovals = result.approvals?.map((a) => a.name.toUpperCase()) || [];
        const hasApprovals = selectedApprovals.every((val) => universityApprovals.includes(val.toUpperCase()));
        if (!hasApprovals) return false;
      }
      return true;
    })
    .map((result) => {
      const matchedCourses =
        result.courses?.filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
      return { ...result, matchedCourses };
    })
    .filter((result) => {
      if (!effectiveFeeWindow) return true;

      // Build every fee "range" this university could be judged on: each
      // matched course is a point range, and the university's own
      // min/max/avg fees form either a real range or a point range.
      const candidateRanges = [];
      result.matchedCourses.forEach((c) => {
        const fee = toNumber(c.fees) ?? toNumber(c.minFees) ?? toNumber(c.maxFees);
        if (fee != null) candidateRanges.push([fee, fee]);
      });
      const uniMin = toNumber(result.minFees);
      const uniMax = toNumber(result.maxFees);
      const uniAvg = toNumber(result.avgFees);
      if (uniMin != null || uniMax != null) {
        candidateRanges.push([uniMin ?? uniMax, uniMax ?? uniMin]);
      } else if (uniAvg != null) {
        candidateRanges.push([uniAvg, uniAvg]);
      }

      if (candidateRanges.length === 0) return true; // no fee data — don't punish it
      return candidateRanges.some(([lo, hi]) =>
        rangesOverlap(lo, hi, effectiveFeeWindow.min, effectiveFeeWindow.max)
      );
    });

  if (sortBy !== "relevance") {
    filteredResults = [...filteredResults].sort((a, b) => {
      const feeA = feeValueOf(a.matchedCourses?.[0]) ?? feeValueOf(a) ?? Infinity;
      const feeB = feeValueOf(b.matchedCourses?.[0]) ?? feeValueOf(b) ?? Infinity;
      return sortBy === "feesLow" ? feeA - feeB : feeB - feeA;
    });
  }

  // Courses column — comes straight from /api/v1/course/search (real slugs)
  let filteredCourses = courseResults.filter((course) => {
    if (!effectiveFeeWindow) return true;
    const fee = toNumber(course.fees) ?? toNumber(course.minFees) ?? toNumber(course.maxFees) ?? toNumber(course.avgFees);
    if (fee == null) return true; // no fee data on this course — don't punish it
    return rangesOverlap(fee, fee, effectiveFeeWindow.min, effectiveFeeWindow.max);
  });

  if (sortBy !== "relevance") {
    filteredCourses = [...filteredCourses].sort((a, b) => {
      const feeA = feeValueOf(a) ?? Infinity;
      const feeB = feeValueOf(b) ?? Infinity;
      return sortBy === "feesLow" ? feeA - feeB : feeB - feeA;
    });
  }

  const totalResults = filteredResults.length + filteredCourses.length;

  const visibleUniResults = filteredResults.slice(0, uniVisibleCount);
  const visibleCourses = filteredCourses.slice(0, courseVisibleCount);
  const uniRemaining = filteredResults.length - visibleUniResults.length;
  const courseRemaining = filteredCourses.length - visibleCourses.length;

  const toggleApproval = (appr) => {
    setSelectedApprovals((prev) => (prev.includes(appr) ? prev.filter((a) => a !== appr) : [...prev, appr]));
    resetPagination();
  };

  const toggleFeeRange = (key) => {
    setSelectedFeeRange((prev) => (prev === key ? null : key));
    resetPagination();
  };

  const changeSort = (key) => {
    setSortBy(key);
    resetPagination();
  };

  const isInCompare = (id) => compareItems.some((c) => c.id === id);
  // Compare tray is locked to one type at a time — a University can only be
  // compared against other Universities, a Course only against other Courses.
  const compareTypeLock = compareItems[0]?.type ?? null;
  const isCompareBlockedForType = (type) => compareTypeLock !== null && compareTypeLock !== type;
  const toggleCompare = (item) => {
    setCompareItems((prev) => {
      if (prev.some((c) => c.id === item.id)) return prev.filter((c) => c.id !== item.id);
      if (prev.length > 0 && prev[0].type !== item.type) return prev; // different type — blocked, use Clear first
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, item];
    });
  };
  const clearCompare = () => {
    setCompareItems([]);
    setIsCompareOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

        .font-display { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes slideDownIn { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-24px); } }
        .page-enter { opacity: 0; transform: translateY(-24px); }
        .page-enter.is-visible { animation: slideDownIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .page-enter.is-closing { animation: slideUpOut 0.28s cubic-bezier(0.4,0,1,1) forwards; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card-enter { animation: fadeUp 0.35s ease forwards; }

        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 600px 100%; animation: shimmer 1.4s infinite; border-radius: 16px;
        }

        @keyframes slideUpTray { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .compare-tray { animation: slideUpTray 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }

        @keyframes drawerUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .compare-drawer { animation: drawerUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards; }

        .search-input:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .result-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .result-card { transition: all 0.2s ease; }
        .filter-chip { transition: all 0.15s ease; }
        .load-more-btn { transition: all 0.15s ease; }
        .load-more-btn:hover { border-color: #DBEAFE; background: #F8FAFF; box-shadow: 0 4px 14px rgba(37,99,235,0.08); color: #1D4ED8; }
        .feature-tile:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(0,0,0,0.06); }
        .feature-tile { transition: all 0.2s ease; }
        .sort-select:focus { outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .idle-link { transition: all 0.15s ease; }
        .idle-link:hover { border-color: #BFDBFE; background: #F8FAFF; }
      `}</style>

      <div
        className={`page-enter ${isClosing ? "is-closing" : isVisible ? "is-visible" : ""}`}
        style={{ minHeight: "100vh", background: "#F4F6FB" }}
      >

        {/* ── HEADER ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E5E9F2", padding: "12px 0",
        }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={handleBack}
              style={{
                width: 40, height: 40, borderRadius: 10, border: "1px solid #E5E9F2",
                background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0, color: "#374151",
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                className="search-input"
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "11px 42px 11px 44px",
                  borderRadius: 12, border: "1.5px solid #E5E9F2", background: "#F8FAFC",
                  fontSize: 15, color: "#111827", outline: "none", transition: "border-color 0.2s",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "#F3F4F6", border: "none", borderRadius: "50%",
                    width: 22, height: 22, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#6B7280",
                  }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Breadcrumb */}
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "8px 20px 0" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
              {" / "}
              <span style={{ color: "#6B7280", fontWeight: 600 }}>
                {searchQuery.trim() !== "" ? `Search "${searchQuery}"` : "Search"}
              </span>
            </p>
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px 100px" }}>

          {searchQuery.trim() !== "" ? (
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

              {/* ── SIDEBAR ── */}
              <aside style={{ width: 232, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E9F2", padding: "18px 16px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", margin: "0 0 14px 0", textTransform: "uppercase" }}>
                    Filter by Approval
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {APPROVAL_LIST.map((appr) => {
                      const active = selectedApprovals.includes(appr);
                      return (
                        <label
                          key={appr}
                          className="filter-chip"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                            border: `1.5px solid ${active ? "#BFDBFE" : "#F0F2F7"}`,
                            background: active ? "#EFF6FF" : "#FAFBFC",
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600, color: active ? "#1D4ED8" : "#4B5563" }}>{appr}</span>
                          <input type="checkbox" checked={active} onChange={() => toggleApproval(appr)}
                            style={{ accentColor: "#2563EB", width: 15, height: 15 }} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E9F2", padding: "18px 16px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", margin: "0 0 14px 0", textTransform: "uppercase" }}>
                    Fees Range
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {FEE_RANGES.map((range) => {
                      const active = selectedFeeRange === range.key;
                      return (
                        <button
                          key={range.key}
                          onClick={() => toggleFeeRange(range.key)}
                          className="filter-chip"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                            border: `1.5px solid ${active ? "#BFDBFE" : "#F0F2F7"}`,
                            background: active ? "#EFF6FF" : "#FAFBFC",
                          }}
                        >
                          <span className="font-mono" style={{ fontSize: 12.5, fontWeight: 600, color: active ? "#1D4ED8" : "#4B5563" }}>
                            {range.label}
                          </span>
                          {active && (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#1D4ED8" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {detectedFees && !activeFeeRange && (
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: "10px 0 0 0", lineHeight: 1.5 }}>
                      Using budget from your search: ≤ ₹{detectedFees.toLocaleString()}
                    </p>
                  )}
                </div>

                <div style={{
                  background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", borderRadius: 16,
                  border: "1px solid #C7D2FE", padding: "16px",
                }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#3730A3", margin: "0 0 4px 0" }}>Comparing colleges?</p>
                  <p style={{ fontSize: 11.5, color: "#4338CA", margin: 0, lineHeight: 1.5 }}>
                    Tap the checkbox on any card to line it up against others, side by side.
                  </p>
                </div>
              </aside>

              {/* ── RESULTS ── */}
              <main style={{ flex: 1, minWidth: 0 }}>

                {/* Result meta row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                    Showing <strong className="font-mono" style={{ color: "#111827" }}>{totalResults}</strong> results for{" "}
                    <strong style={{ color: "#2563EB" }}>"{searchQuery}"</strong>
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {detectedFees && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: "#065F46", background: "#D1FAE5",
                        border: "1px solid #A7F3D0", padding: "4px 10px", borderRadius: 8,
                      }}>
                        BUDGET ≤ ₹{detectedFees.toLocaleString()}
                      </span>
                    )}
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => changeSort(e.target.value)}
                      style={{
                        fontSize: 12.5, fontWeight: 600, color: "#374151", padding: "7px 10px",
                        borderRadius: 9, border: "1px solid #E5E9F2", background: "#fff", cursor: "pointer",
                      }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.key} value={opt.key}>Sort: {opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 110 }} />)}
                  </div>

                ) : totalResults > 0 ? (
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

                    {/* ── LEFT: UNIVERSITIES ── */}
                    <div style={{ flex: "1 1 340px", minWidth: 280 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                        Universities
                      </p>

                      {filteredResults.length === 0 ? (
                        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px dashed #E5E9F2", padding: "40px 16px", textAlign: "center" }}>
                          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>No matching universities</p>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {visibleUniResults.map((result, idx) => {
                            const compareId = `uni-${result._id}`;
                            const primaryFee = feeValueOf(result.matchedCourses?.[0]) ?? feeValueOf(result);
                            return (
                              <Link
                                key={result._id}
                                href={`/university/${result.slug || result._id}`}
                                className="result-card card-enter"
                                style={{
                                  textDecoration: "none", display: "block", background: "#fff",
                                  borderRadius: 16, border: "1px solid #E5E9F2", padding: "18px 20px",
                                  animationDelay: `${idx * 0.05}s`,
                                }}
                              >
                                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                                  <Avatar src={resolveUniversityImage(result)} name={result.name} size={46} radius={12} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                      <h2 style={{
                                        fontSize: 15.5, fontWeight: 700, color: "#111827", margin: "0 0 3px 0",
                                        overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                      }}>
                                        {result.name}
                                      </h2>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                        <span style={{
                                          fontSize: 9.5, fontWeight: 800, color: "#1D4ED8", background: "#EFF6FF",
                                          border: "1px solid #BFDBFE", padding: "3px 8px", borderRadius: 6,
                                          letterSpacing: "0.06em", whiteSpace: "nowrap",
                                        }}>
                                          UNIVERSITY
                                        </span>
                                        <CompareToggle
                                          checked={isInCompare(compareId)}
                                          disabled={!isInCompare(compareId) && (compareItems.length >= MAX_COMPARE || isCompareBlockedForType("University"))}
                                          onToggle={() => toggleCompare({
                                            id: compareId, type: "University", name: result.name,
                                            fee: primaryFee, sub: result.location || "India",
                                          })}
                                        />
                                      </div>
                                    </div>
                                    <p style={{ fontSize: 12.5, color: "#6B7280", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {result.location || "India"}
                                    </p>
                                  </div>
                                </div>

                                {result.matchedCourses?.length > 0 ? (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                                    {result.matchedCourses.slice(0, 2).map((c) => (
                                      <div key={c._id || c.name} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "8px 12px",
                                      }}>
                                        <span style={{
                                          fontSize: 11.5, fontWeight: 600, color: "#065F46",
                                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8,
                                        }}>
                                          {c.name}
                                        </span>
                                        {(c.fees || c.minFees) && (
                                          <span className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: "#065F46", whiteSpace: "nowrap" }}>
                                            ₹{(c.fees || c.minFees).toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (result.minFees || result.maxFees || result.avgFees) ? (
                                  <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    background: "#F8FAFC", border: "1px solid #EEF1F6", borderRadius: 10, padding: "8px 12px", marginBottom: 10,
                                  }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>Total Fees</span>
                                    <span className="font-mono" style={{ fontSize: 13.5, fontWeight: 800, color: "#065F46" }}>
                                      {result.minFees && result.maxFees && result.minFees !== result.maxFees
                                        ? `₹${result.minFees.toLocaleString()} – ₹${result.maxFees.toLocaleString()}`
                                        : `₹${(result.minFees || result.maxFees || result.avgFees).toLocaleString()}`}
                                    </span>
                                  </div>
                                ) : null}

                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                                  {result.approvals?.slice(0, 4).map((a, i) => (
                                    <span key={i} style={{
                                      fontSize: 10.5, fontWeight: 700, color: "#374151", background: "#F3F4F6",
                                      border: "1px solid #E5E7EB", padding: "3px 9px", borderRadius: 6,
                                    }}>
                                      {a.name}
                                    </span>
                                  ))}
                                </div>
                              </Link>
                            );
                          })}

                          {uniRemaining > 0 && (
                            <LoadMoreButton remaining={uniRemaining} onClick={() => setUniVisibleCount((prev) => prev + PAGE_SIZE)} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── RIGHT: COURSES (own collection, real slugs) ── */}
                    <div style={{ flex: "1 1 340px", minWidth: 280 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                        Matching Courses
                      </p>

                      {filteredCourses.length === 0 ? (
                        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px dashed #E5E9F2", padding: "40px 16px", textAlign: "center" }}>
                          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>No matching courses</p>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {visibleCourses.map((course, idx) => {
                            const compareId = `course-${course._id}`;
                            const fee = feeValueOf(course);
                            return (
                              <Link
                                key={course._id}
                                href={`/course/${course.slug}`}
                                className="result-card card-enter"
                                style={{
                                  textDecoration: "none", display: "block", background: "#fff",
                                  borderRadius: 14, border: "1px solid #E5E9F2", padding: "14px 16px",
                                  animationDelay: `${idx * 0.05}s`,
                                }}
                              >
                                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                  <Avatar src={course.courseLogo?.url} name={course.name} size={42} radius={10} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                                      <span style={{
                                        fontSize: 13.5, fontWeight: 700, color: "#1F2937",
                                        overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                      }}>
                                        {course.name}
                                      </span>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                        {fee != null && (
                                          <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", whiteSpace: "nowrap" }}>
                                            ₹{fee.toLocaleString()}
                                          </span>
                                        )}
                                        <CompareToggle
                                          checked={isInCompare(compareId)}
                                          disabled={!isInCompare(compareId) && (compareItems.length >= MAX_COMPARE || isCompareBlockedForType("Course"))}
                                          onToggle={() => toggleCompare({
                                            id: compareId, type: "Course", name: course.name,
                                            fee, sub: course.category || course.universities?.[0]?.name || "—",
                                          })}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                                      {course.category && (
                                        <span style={{
                                          fontSize: 10.5, fontWeight: 700, color: "#7C3AED", background: "#F5F3FF",
                                          border: "1px solid #DDD6FE", padding: "2px 8px", borderRadius: 6,
                                        }}>
                                          {course.category}
                                        </span>
                                      )}
                                      {course.duration && (
                                        <span style={{
                                          fontSize: 10.5, fontWeight: 600, color: "#374151", background: "#F3F4F6",
                                          border: "1px solid #E5E7EB", padding: "2px 8px", borderRadius: 6,
                                        }}>
                                          {course.duration}
                                        </span>
                                      )}
                                      {course.tag && (
                                        <span style={{
                                          fontSize: 10.5, fontWeight: 700, color: "#B45309", background: "#FFFBEB",
                                          border: "1px solid #FDE68A", padding: "2px 8px", borderRadius: 6,
                                        }}>
                                          {course.tag}
                                        </span>
                                      )}
                                    </div>

                                    {course.universities?.[0]?.name && (
                                      <p style={{ fontSize: 11.5, color: "#9CA3AF", margin: "6px 0 0 0" }}>
                                        {course.universities[0].name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}

                          {courseRemaining > 0 && (
                            <LoadMoreButton remaining={courseRemaining} onClick={() => setCourseVisibleCount((prev) => prev + PAGE_SIZE)} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                ) : (
                  <div style={{ background: "#fff", borderRadius: 20, border: "1.5px dashed #E5E9F2", padding: "64px 20px", textAlign: "center" }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", margin: "0 auto 20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 6px 0" }}>No results found</h3>
                    <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0 }}>Try different keywords or remove filters</p>
                  </div>
                )}
              </main>
            </div>

          ) : (
            /* ── EMPTY / IDLE STATE — expanded so the page has real weight before you type ── */
            <div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 20px 40px", textAlign: "center" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", background: "#EFF6FF", marginBottom: 24,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
                  Search for your future
                </h2>
                <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 320, lineHeight: 1.6, margin: "0 0 28px 0" }}>
                  Enter a university name, course, or your budget like{" "}
                  <strong style={{ color: "#2563EB" }}>"MBA under 50k"</strong>
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                  {["MBA", "B.Tech", "Law", "Medical", "NAAC A+"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      style={{
                        padding: "8px 16px", borderRadius: 20, border: "1.5px solid #BFDBFE",
                        background: "#EFF6FF", color: "#1D4ED8", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick-stats strip */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12,
                background: "#fff", border: "1px solid #E5E9F2", borderRadius: 18, padding: "22px 20px", marginBottom: 20,
              }}>
                {[
                  { value: "500+", label: "Universities listed" },
                  { value: "2,000+", label: "Courses indexed" },
                  { value: "4", label: "Approval bodies tracked" },
                  { value: `${MAX_COMPARE}`, label: "Colleges you can compare at once" },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "6px 4px" }}>
                    <p className="font-mono" style={{ fontSize: 22, fontWeight: 700, color: "#1D4ED8", margin: "0 0 4px 0" }}>{stat.value}</p>
                    <p style={{ fontSize: 11.5, color: "#6B7280", margin: 0, lineHeight: 1.4 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Why search here */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 4px" }}>
                  Why search here
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                  {[
                    { title: "Verified approvals", desc: "Every UGC / AICTE / NAAC / NBA tag is pulled from the university's own record.", color: "#1D4ED8", bg: "#EFF6FF" },
                    { title: "Real fee data", desc: "Fees shown are per-university, per-course — not a generic average.", color: "#065F46", bg: "#ECFDF5" },
                    { title: "Compare instantly", desc: "Shortlist up to three options and view them side by side before you decide.", color: "#4338CA", bg: "#EEF2FF" },
                  ].map((f) => (
                    <div key={f.title} className="feature-tile" style={{
                      background: "#fff", border: "1px solid #E5E9F2", borderRadius: 16, padding: "18px 16px",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, background: f.bg, color: f.color,
                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontWeight: 800, fontSize: 14,
                      }}>
                        ✓
                      </div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>{f.title}</p>
                      <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── INTERNAL LINKS — gives crawlers real outlinks from this page's idle state ── */}
              <div style={{ marginTop: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 4px" }}>
                  Or browse directly
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <Link
                    href="/university"
                    className="idle-link"
                    style={{
                      padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E9F2",
                      background: "#fff", color: "#111827", fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    All Universities
                  </Link>
                  <Link
                    href="/course"
                    className="idle-link"
                    style={{
                      padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E9F2",
                      background: "#fff", color: "#111827", fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    All Courses
                  </Link>
                  <Link
                    href="/explore"
                    className="idle-link"
                    style={{
                      padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E9F2",
                      background: "#fff", color: "#111827", fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    Explore
                  </Link>
                  <Link
                    href="/career"
                    className="idle-link"
                    style={{
                      padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E9F2",
                      background: "#fff", color: "#111827", fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    Career Guidance
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FLOATING COMPARE TRAY ── */}
        {compareItems.length > 0 && !isCompareOpen && (
          <div className="compare-tray" style={{
            position: "fixed", bottom: 20, left: "50%", zIndex: 60,
            background: "#111827", borderRadius: 16, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
            maxWidth: "calc(100vw - 32px)",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {compareItems.map((item) => (
                <span key={item.id} style={{
                  fontSize: 11.5, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.12)",
                  padding: "5px 10px", borderRadius: 8, whiteSpace: "nowrap", maxWidth: 120,
                  overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {item.name}
                </span>
              ))}
            </div>
            <button onClick={() => setIsCompareOpen(true)} style={{
              fontSize: 12.5, fontWeight: 700, color: "#111827", background: "#fff",
              border: "none", borderRadius: 9, padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap",
            }}>
              Compare ({compareItems.length})
            </button>
            <button onClick={clearCompare} style={{
              fontSize: 12, fontWeight: 600, color: "#9CA3AF", background: "transparent",
              border: "none", cursor: "pointer",
            }}>
              Clear
            </button>
          </div>
        )}

        {/* ── COMPARE DRAWER ── */}
        {isCompareOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(17,24,39,0.35)" }} onClick={() => setIsCompareOpen(false)}>
            <div
              className="compare-drawer"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff",
                borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: "20px 24px 28px",
                maxWidth: 1120, margin: "0 auto", boxShadow: "0 -12px 40px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: 0 }}>Compare</h3>
                <button onClick={() => setIsCompareOpen(false)} style={{
                  width: 30, height: 30, borderRadius: 9, border: "1px solid #E5E9F2", background: "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280",
                }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: `repeat(${compareItems.length}, minmax(160px, 1fr))`, gap: 14 }}>
                {compareItems.map((item) => (
                  <div key={item.id} style={{ border: "1px solid #E5E9F2", borderRadius: 14, padding: "14px 16px" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: item.type === "University" ? "#1D4ED8" : "#7C3AED",
                      background: item.type === "University" ? "#EFF6FF" : "#F5F3FF", padding: "2px 8px",
                      borderRadius: 6, letterSpacing: "0.05em",
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "8px 0 4px 0", lineHeight: 1.3 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px 0" }}>{item.sub}</p>
                    <div style={{ borderTop: "1px solid #F0F2F7", paddingTop: 10 }}>
                      <p style={{ fontSize: 10.5, color: "#9CA3AF", margin: "0 0 2px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Fees</p>
                      <p className="font-mono" style={{ fontSize: 15, fontWeight: 800, color: "#065F46", margin: 0 }}>
                        {item.fee != null ? `₹${item.fee.toLocaleString()}` : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default function SearchPageClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4F6FB" }} />}>
      <SearchContent />
    </Suspense>
  );
}