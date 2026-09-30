"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api.js";

const APPROVAL_LIST = ["UGC", "AICTE", "NAAC"];
const PAGE_SIZE = 5;
const MAX_COMPARE = 3;

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

const resolveUniversityImage = (uni) => {
  const raw = uni?.universityImage;
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return `${process.env.NEXT_PUBLIC_API_URL}/${raw.replace(/^\/+/, "")}`;
};

const toNumber = (val) => {
  if (val == null || val === "") return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  if (cleaned === "") return null;
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
};

const feeValueOf = (obj) =>
  toNumber(obj?.fees ?? obj?.minFees ?? obj?.avgFees ?? obj?.maxFees);

const rangesOverlap = (min1, max1, min2, max2) =>
  min1 <= max2 && max1 >= min2;

/* ═══════════════ AVATAR ═══════════════ */
const Avatar = ({ src, name, size = 44, radius = 12 }) => {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  if (src) {
    return (
      <div
        className="rounded-xl overflow-hidden bg-white border shrink-0"
        style={{
          width: size,
          height: size,
          borderColor: "var(--cv-neutral-border)",
        }}
      >
        <Image
          src={src}
          alt={name || "logo"}
          width={size}
          height={size}
          className="object-contain p-1 w-full h-full"
        />
      </div>
    );
  }
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--cv-primary-light)",
        color: "var(--cv-primary)",
        border: "1px solid var(--cv-primary-light)",
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
};

/* ═══════════════ LOAD MORE ═══════════════ */
const LoadMoreButton = ({ onClick, remaining }) => (
  <button
    onClick={onClick}
    className="load-more-btn w-full mt-2 py-2.5 px-4 rounded-xl border text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all"
    style={{
      borderColor: "var(--cv-neutral-border)",
      background: "#fff",
      color: "var(--cv-neutral-dark)",
    }}
  >
    Load more
    <span style={{ color: "var(--cv-neutral-mid)", fontWeight: 500 }}>
      ({remaining} more)
    </span>
  </button>
);

/* ═══════════════ COMPARE TOGGLE ═══════════════ */
const CompareToggle = ({ checked, disabled, onToggle }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) onToggle();
    }}
    title={
      disabled
        ? `You can compare up to ${MAX_COMPARE} at a time`
        : "Add to compare"
    }
    className="w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0 transition-all"
    style={{
      cursor: disabled ? "not-allowed" : "pointer",
      border: `1.5px solid ${checked ? "var(--cv-primary)" : "var(--cv-neutral-border)"}`,
      background: checked ? "var(--cv-primary)" : "#fff",
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

/* ═══════════════ SUSPENSE FALLBACK ═══════════════ */
const SearchFallback = () => (
  <div
    className="min-h-screen p-6"
    style={{ background: "var(--cv-neutral-light)" }}
  >
    <div className="max-w-6xl mx-auto">
      <p
        className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3 ml-1"
        style={{ color: "var(--cv-neutral-mid)" }}
      >
        Browse directly
      </p>
      <nav className="flex flex-wrap gap-2.5">
        {[
          { href: "/university", label: "All Universities" },
          { href: "/course", label: "All Courses" },
          { href: "/explore", label: "Explore" },
          { href: "/career", label: "Career Guidance" },
          { href: "/", label: "Home" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2.5 rounded-xl bg-white text-[13px] font-semibold no-underline transition-all"
            style={{
              border: "1px solid var(--cv-neutral-border)",
              color: "var(--cv-neutral-dark)",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  </div>
);

/* ═══════════════ MAIN CONTENT ═══════════════ */
const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [courseResults, setCourseResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [selectedFeeRange, setSelectedFeeRange] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const [uniVisibleCount, setUniVisibleCount] = useState(PAGE_SIZE);
  const [courseVisibleCount, setCourseVisibleCount] = useState(PAGE_SIZE);

  const [compareItems, setCompareItems] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // ✅ Turant visible — koi delay nahi
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const placeholders = [
    "Find University...",
    "Find College...",
    "Find Course...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => router.back(), 220);
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

  const { detectedFees } = getSmartFilters(searchQuery);
  const activeFeeRange = FEE_RANGES.find((r) => r.key === selectedFeeRange);
  const effectiveFeeWindow = activeFeeRange
    ? { min: activeFeeRange.min, max: activeFeeRange.max }
    : detectedFees
    ? { min: 0, max: detectedFees }
    : null;

  let filteredResults = searchResults
    .filter((result) => {
      if (selectedApprovals.length > 0) {
        const universityApprovals =
          result.approvals?.map((a) => a.name.toUpperCase()) || [];
        const hasApprovals = selectedApprovals.every((val) =>
          universityApprovals.includes(val.toUpperCase())
        );
        if (!hasApprovals) return false;
      }
      return true;
    })
    .map((result) => {
      const matchedCourses =
        result.courses?.filter((course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
      return { ...result, matchedCourses };
    })
    .filter((result) => {
      if (!effectiveFeeWindow) return true;
      const candidateRanges = [];
      result.matchedCourses.forEach((c) => {
        const fee =
          toNumber(c.fees) ?? toNumber(c.minFees) ?? toNumber(c.maxFees);
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
      if (candidateRanges.length === 0) return true;
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

  let filteredCourses = courseResults.filter((course) => {
    if (!effectiveFeeWindow) return true;
    const fee =
      toNumber(course.fees) ??
      toNumber(course.minFees) ??
      toNumber(course.maxFees) ??
      toNumber(course.avgFees);
    if (fee == null) return true;
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
    setSelectedApprovals((prev) =>
      prev.includes(appr) ? prev.filter((a) => a !== appr) : [...prev, appr]
    );
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
  const compareTypeLock = compareItems[0]?.type ?? null;
  const isCompareBlockedForType = (type) =>
    compareTypeLock !== null && compareTypeLock !== type;

  const toggleCompare = (item) => {
    setCompareItems((prev) => {
      if (prev.some((c) => c.id === item.id))
        return prev.filter((c) => c.id !== item.id);
      if (prev.length > 0 && prev[0].type !== item.type) return prev;
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
        /* ═══════════════════════════════════════════
           POPUP OVERLAY — FULL SCREEN
           ═══════════════════════════════════════════ */
        .popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: var(--cv-neutral-light);
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 0;
          overflow-y: auto;
        }
        .popup-overlay.is-visible { animation: overlayIn 0.22s ease forwards; }
        .popup-overlay.is-closing { animation: overlayOut 0.2s ease forwards; }

        /* ═══════════════════════════════════════════
           POPUP CARD — FULL SCREEN
           ═══════════════════════════════════════════ */
        .popup-card {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          background: #fff;
          border-radius: 0;
          overflow: hidden;
          position: relative;
          box-shadow: none;
          margin: 0;
        }
        .popup-card.is-visible { animation: popupIn 0.32s cubic-bezier(0.16,1,0.3,1) forwards; }
        .popup-card.is-closing { animation: popupOut 0.22s cubic-bezier(0.4,0,1,1) forwards; }

        /* ═══════════════════════════════════════════
           ANIMATIONS — Fast + subtle
           ═══════════════════════════════════════════ */
        @keyframes popupIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes popupOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.98); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes overlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* ═══════════════════════════════════════════
           CARD ENTRANCE — staggered fade up
           ═══════════════════════════════════════════ */
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter { opacity: 0; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ═══════════════════════════════════════════
           SIDEBAR ENTRANCE
           ═══════════════════════════════════════════ */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sidebar-enter { animation: slideInLeft 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ═══════════════════════════════════════════
           SKELETON SHIMMER
           ═══════════════════════════════════════════ */
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px;
        }

        /* ═══════════════════════════════════════════
           COMPARE TRAY + DRAWER
           ═══════════════════════════════════════════ */
        @keyframes slideUpTray {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .compare-tray { animation: slideUpTray 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }

        @keyframes drawerUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .compare-drawer { animation: drawerUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ═══════════════════════════════════════════
           SEARCH INPUT — focus pulse
           ═══════════════════════════════════════════ */
        .search-input {
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
        }
        .search-input:focus {
          box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.12);
          border-color: var(--cv-primary) !important;
          transform: scale(1.005);
        }

        /* ═══════════════════════════════════════════
           RESULT CARD HOVER
           ═══════════════════════════════════════════ */
        .result-card { transition: all 0.25s ease; }
        .result-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(30, 58, 138, 0.1);
          border-color: var(--cv-primary-light) !important;
        }

        /* ═══════════════════════════════════════════
           FILTER CHIP
           ═══════════════════════════════════════════ */
        .filter-chip { transition: all 0.15s ease; }
        .filter-chip:hover { border-color: var(--cv-primary-light) !important; }

        /* ═══════════════════════════════════════════
           LOAD MORE
           ═══════════════════════════════════════════ */
        .load-more-btn { transition: all 0.15s ease; }
        .load-more-btn:hover {
          border-color: var(--cv-primary-light) !important;
          background: var(--cv-primary-light) !important;
          color: var(--cv-primary) !important;
          box-shadow: 0 4px 14px rgba(30, 58, 138, 0.08);
        }

        /* ═══════════════════════════════════════════
           FEATURE TILE
           ═══════════════════════════════════════════ */
        .feature-tile { transition: all 0.2s ease; }
        .feature-tile:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(30, 58, 138, 0.08);
          border-color: var(--cv-primary-light) !important;
        }

        /* ═══════════════════════════════════════════
           SORT SELECT
           ═══════════════════════════════════════════ */
        .sort-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.12);
          border-color: var(--cv-primary) !important;
        }

        /* ═══════════════════════════════════════════
           IDLE LINKS
           ═══════════════════════════════════════════ */
        .idle-link { transition: all 0.15s ease; }
        .idle-link:hover {
          border-color: var(--cv-primary) !important;
          background: var(--cv-primary-light) !important;
          color: var(--cv-primary) !important;
        }

        /* ═══════════════════════════════════════════
           TAG BUTTONS
           ═══════════════════════════════════════════ */
        .tag-btn { transition: all 0.15s ease; }
        .tag-btn:hover {
          background: var(--cv-primary) !important;
          color: #fff !important;
          border-color: var(--cv-primary) !important;
        }

        /* ═══════════════════════════════════════════
           COMPARE TRAY BUTTON
           ═══════════════════════════════════════════ */
        .compare-tray-btn { transition: all 0.15s ease; }
        .compare-tray-btn:hover {
          background: var(--cv-primary-light) !important;
          color: var(--cv-primary) !important;
        }
      `}</style>

      {/* ═══ POPUP OVERLAY — FULL SCREEN ═══ */}
      <div
        className={`popup-overlay ${
          isClosing ? "is-closing" : isVisible ? "is-visible" : ""
        }`}
      >
        {/* ═══ POPUP CARD — FULL SCREEN ═══ */}
        <div
          className={`popup-card ${
            isClosing ? "is-closing" : isVisible ? "is-visible" : ""
          }`}
        >
          {/* Close button (top-right) */}
          <button
            onClick={handleBack}
            className="absolute top-4 right-4 z-[60] w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--cv-primary-light)] hover:text-[var(--cv-primary)]"
            style={{
              background: "var(--cv-neutral-light)",
              border: "1px solid var(--cv-neutral-border)",
              color: "var(--cv-neutral-mid)",
            }}
            aria-label="Close"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ═══ HEADER ═══ */}
          <header
            className="sticky top-0 z-50 py-3 px-5"
            style={{
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid var(--cv-neutral-border)",
            }}
          >
            <div className="max-w-6xl mx-auto flex items-center gap-3.5 pr-12">
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  background: "#fff",
                  color: "var(--cv-neutral-dark)",
                  cursor: "pointer",
                }}
                aria-label="Back"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>

              <div className="flex-1 relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--cv-neutral-mid)" }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  className="search-input w-full px-10 py-3 rounded-xl text-[15px] outline-none transition-all"
                  value={searchQuery}
                  autoFocus
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  style={{
                    border: "1.5px solid var(--cv-neutral-border)",
                    background: "#F8FAFC",
                    color: "var(--cv-neutral-dark)",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: "var(--cv-neutral-border)",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--cv-neutral-mid)",
                    }}
                    aria-label="Clear"
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="max-w-6xl mx-auto mt-2">
              <p className="text-xs m-0" style={{ color: "var(--cv-neutral-mid)" }}>
                <Link href="/" className="no-underline" style={{ color: "var(--cv-neutral-mid)" }}>
                  Home
                </Link>
                {" / "}
                <span style={{ color: "var(--cv-neutral-dark)", fontWeight: 600 }}>
                  {searchQuery.trim() !== ""
                    ? `Search "${searchQuery}"`
                    : "Search"}
                </span>
              </p>
            </div>
          </header>

          {/* ═══ BODY ═══ */}
          <div className="max-w-6xl mx-auto px-5 py-6 pb-24">
            {searchQuery.trim() !== "" ? (
              <div className="flex gap-7 items-start flex-wrap">
                {/* ═══ SIDEBAR ═══ */}
                <aside className="sidebar-enter w-[240px] shrink-0 flex flex-col gap-4">
                  {/* Approval Filter */}
                  <div
                    className="bg-white rounded-2xl p-4"
                    style={{ border: "1px solid var(--cv-neutral-border)" }}
                  >
                    <p
                      className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3.5 mt-0"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      Filter by Approval
                    </p>
                    <div className="flex flex-col gap-2">
                      {APPROVAL_LIST.map((appr) => {
                        const active = selectedApprovals.includes(appr);
                        return (
                          <label
                            key={appr}
                            className="filter-chip flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer"
                            style={{
                              border: `1.5px solid ${active ? "var(--cv-primary)" : "var(--cv-neutral-border)"}`,
                              background: active ? "var(--cv-primary-light)" : "#FAFBFC",
                            }}
                          >
                            <span
                              className="text-[13px] font-semibold"
                              style={{
                                color: active ? "var(--cv-primary)" : "var(--cv-neutral-dark)",
                              }}
                            >
                              {appr}
                            </span>
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => toggleApproval(appr)}
                              className="w-4 h-4 cursor-pointer"
                              style={{ accentColor: "var(--cv-primary)" }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fee Filter */}
                  <div
                    className="bg-white rounded-2xl p-4"
                    style={{ border: "1px solid var(--cv-neutral-border)" }}
                  >
                    <p
                      className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3.5 mt-0"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      Fees Range
                    </p>
                    <div className="flex flex-col gap-2">
                      {FEE_RANGES.map((range) => {
                        const active = selectedFeeRange === range.key;
                        return (
                          <button
                            key={range.key}
                            onClick={() => toggleFeeRange(range.key)}
                            className="filter-chip flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-left"
                            style={{
                              border: `1.5px solid ${active ? "var(--cv-primary)" : "var(--cv-neutral-border)"}`,
                              background: active ? "var(--cv-primary-light)" : "#FAFBFC",
                            }}
                          >
                            <span
                              className="text-[12.5px] font-semibold"
                              style={{
                                color: active ? "var(--cv-primary)" : "var(--cv-neutral-dark)",
                              }}
                            >
                              {range.label}
                            </span>
                            {active && (
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--cv-primary)" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {detectedFees && !activeFeeRange && (
                      <p
                        className="text-[11px] mt-2.5 mb-0 leading-relaxed"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        Using budget from your search: ≤ ₹
                        {detectedFees.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Info card */}
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: "var(--cv-primary-light)",
                      border: "1px solid var(--cv-primary-light)",
                    }}
                  >
                    <p
                      className="text-[12.5px] font-bold mb-1 mt-0"
                      style={{ color: "var(--cv-primary)" }}
                    >
                      Comparing colleges?
                    </p>
                    <p
                      className="text-[11.5px] m-0 leading-relaxed"
                      style={{ color: "var(--cv-primary)" }}
                    >
                      Tap the checkbox on any card to line it up against others, side by side.
                    </p>
                  </div>
                </aside>

                {/* ═══ RESULTS ═══ */}
                <main className="flex-1 min-w-0">
                  {/* Meta row */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                    <p
                      className="text-[13px] m-0"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      Showing{" "}
                      <strong style={{ color: "var(--cv-neutral-dark)" }}>
                        {totalResults}
                      </strong>{" "}
                      results for{" "}
                      <strong style={{ color: "var(--cv-primary)" }}>
                        "{searchQuery}"
                      </strong>
                    </p>

                    <div className="flex items-center gap-2">
                      {detectedFees && (
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                          style={{
                            color: "var(--cv-accent)",
                            background: "var(--cv-accent-light)",
                            border: "1px solid var(--cv-accent-light)",
                          }}
                        >
                          BUDGET ≤ ₹{detectedFees.toLocaleString()}
                        </span>
                      )}
                      <select
                        className="sort-select text-[12.5px] font-semibold px-2.5 py-2 rounded-lg cursor-pointer outline-none"
                        value={sortBy}
                        onChange={(e) => changeSort(e.target.value)}
                        style={{
                          border: "1px solid var(--cv-neutral-border)",
                          background: "#fff",
                          color: "var(--cv-neutral-dark)",
                        }}
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            Sort: {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex flex-col gap-3.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 110 }} />
                      ))}
                    </div>
                  ) : totalResults > 0 ? (
                    <div className="flex gap-5 items-start flex-wrap">
                      {/* UNIVERSITIES */}
                      <div className="flex-1 min-w-[280px]">
                        <p
                          className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3 mt-0"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          Universities
                        </p>

                        {filteredResults.length === 0 ? (
                          <div
                            className="bg-white rounded-2xl p-10 text-center"
                            style={{ border: "1.5px dashed var(--cv-neutral-border)" }}
                          >
                            <p
                              className="text-[13px] m-0"
                              style={{ color: "var(--cv-neutral-mid)" }}
                            >
                              No matching universities
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3.5">
                            {visibleUniResults.map((result, idx) => {
                              const compareId = `uni-${result._id}`;
                              const primaryFee =
                                feeValueOf(result.matchedCourses?.[0]) ??
                                feeValueOf(result);
                              return (
                                <Link
                                  key={`${result._id}-${searchQuery}`}
                                  href={`/university/${result.slug || result._id}`}
                                  className="result-card card-enter block bg-white rounded-2xl p-5 no-underline"
                                  style={{
                                    border: "1px solid var(--cv-neutral-border)",
                                    animationDelay: `${idx * 0.05}s`,
                                  }}
                                >
                                  <div className="flex gap-3 items-start mb-3">
                                    <Avatar
                                      src={resolveUniversityImage(result)}
                                      name={result.name}
                                      size={46}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start gap-2">
                                        <h2
                                          className="text-[15.5px] font-bold m-0 mb-0.5 line-clamp-2"
                                          style={{ color: "var(--cv-neutral-dark)" }}
                                        >
                                          {result.name}
                                        </h2>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <span
                                            className="text-[9.5px] font-extrabold tracking-[0.06em] px-2 py-0.5 rounded-md whitespace-nowrap"
                                            style={{
                                              color: "var(--cv-primary)",
                                              background: "var(--cv-primary-light)",
                                              border: "1px solid var(--cv-primary-light)",
                                            }}
                                          >
                                            UNIVERSITY
                                          </span>
                                          <CompareToggle
                                            checked={isInCompare(compareId)}
                                            disabled={
                                              !isInCompare(compareId) &&
                                              (compareItems.length >= MAX_COMPARE ||
                                                isCompareBlockedForType("University"))
                                            }
                                            onToggle={() =>
                                              toggleCompare({
                                                id: compareId,
                                                type: "University",
                                                name: result.name,
                                                fee: primaryFee,
                                                sub: result.location || "India",
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                      <p
                                        className="text-[12.5px] m-0 flex items-center gap-1"
                                        style={{ color: "var(--cv-neutral-mid)" }}
                                      >
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {result.location || "India"}
                                      </p>
                                    </div>
                                  </div>

                                  {result.matchedCourses?.length > 0 ? (
                                    <div className="flex flex-col gap-1.5 mb-2.5">
                                      {result.matchedCourses.slice(0, 2).map((c) => (
                                        <div
                                          key={c._id || c.name}
                                          className="flex items-center justify-between px-3 py-2 rounded-lg"
                                          style={{
                                            background: "#ECFDF5",
                                            border: "1px solid #A7F3D0",
                                          }}
                                        >
                                          <span
                                            className="text-[11.5px] font-semibold truncate mr-2"
                                            style={{ color: "#065F46" }}
                                          >
                                            {c.name}
                                          </span>
                                          {(c.fees || c.minFees) && (
                                            <span
                                              className="text-[13px] font-extrabold whitespace-nowrap"
                                              style={{ color: "#065F46" }}
                                            >
                                              ₹{(c.fees || c.minFees).toLocaleString()}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (result.minFees || result.maxFees || result.avgFees) ? (
                                    <div
                                      className="flex items-center justify-between px-3 py-2 rounded-lg mb-2.5"
                                      style={{
                                        background: "var(--cv-neutral-light)",
                                        border: "1px solid var(--cv-neutral-border)",
                                      }}
                                    >
                                      <span
                                        className="text-[11px] font-semibold"
                                        style={{ color: "var(--cv-neutral-mid)" }}
                                      >
                                        Total Fees
                                      </span>
                                      <span
                                        className="text-[13.5px] font-extrabold"
                                        style={{ color: "var(--cv-accent)" }}
                                      >
                                        {result.minFees &&
                                        result.maxFees &&
                                        result.minFees !== result.maxFees
                                          ? `₹${result.minFees.toLocaleString()} – ₹${result.maxFees.toLocaleString()}`
                                          : `₹${(result.minFees || result.maxFees || result.avgFees).toLocaleString()}`}
                                      </span>
                                    </div>
                                  ) : null}

                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {result.approvals?.slice(0, 4).map((a, i) => (
                                      <span
                                        key={i}
                                        className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-md"
                                        style={{
                                          color: "var(--cv-neutral-dark)",
                                          background: "var(--cv-neutral-light)",
                                          border: "1px solid var(--cv-neutral-border)",
                                        }}
                                      >
                                        {a.name}
                                      </span>
                                    ))}
                                  </div>
                                </Link>
                              );
                            })}

                            {uniRemaining > 0 && (
                              <LoadMoreButton
                                remaining={uniRemaining}
                                onClick={() =>
                                  setUniVisibleCount((prev) => prev + PAGE_SIZE)
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* COURSES */}
                      <div className="flex-1 min-w-[280px]">
                        <p
                          className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3 mt-0"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          Matching Courses
                        </p>

                        {filteredCourses.length === 0 ? (
                          <div
                            className="bg-white rounded-2xl p-10 text-center"
                            style={{ border: "1.5px dashed var(--cv-neutral-border)" }}
                          >
                            <p
                              className="text-[13px] m-0"
                              style={{ color: "var(--cv-neutral-mid)" }}
                            >
                              No matching courses
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5">
                            {visibleCourses.map((course, idx) => {
                              const compareId = `course-${course._id}`;
                              const fee = feeValueOf(course);
                              return (
                                <Link
                                  key={`${course._id}-${searchQuery}`}
                                  href={`/course/${course.slug}`}
                                  className="result-card card-enter block bg-white rounded-2xl p-4 no-underline"
                                  style={{
                                    border: "1px solid var(--cv-neutral-border)",
                                    animationDelay: `${idx * 0.05}s`,
                                  }}
                                >
                                  <div className="flex gap-3 items-start">
                                    <Avatar
                                      src={course.courseLogo?.url}
                                      name={course.name}
                                      size={42}
                                      radius={10}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start gap-2 mb-1">
                                        <span
                                          className="text-[13.5px] font-bold line-clamp-2"
                                          style={{ color: "var(--cv-neutral-dark)" }}
                                        >
                                          {course.name}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                          {fee != null && (
                                            <span
                                              className="text-[13px] font-bold whitespace-nowrap"
                                              style={{ color: "var(--cv-primary)" }}
                                            >
                                              ₹{fee.toLocaleString()}
                                            </span>
                                          )}
                                          <CompareToggle
                                            checked={isInCompare(compareId)}
                                            disabled={
                                              !isInCompare(compareId) &&
                                              (compareItems.length >= MAX_COMPARE ||
                                                isCompareBlockedForType("Course"))
                                            }
                                            onToggle={() =>
                                              toggleCompare({
                                                id: compareId,
                                                type: "Course",
                                                name: course.name,
                                                fee,
                                                sub:
                                                  course.category ||
                                                  course.universities?.[0]?.name ||
                                                  "—",
                                              })
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-1.5 items-center">
                                        {course.category && (
                                          <span
                                            className="text-[10.5px] font-bold px-2 py-0.5 rounded-md"
                                            style={{
                                              color: "var(--cv-primary)",
                                              background: "var(--cv-primary-light)",
                                              border: "1px solid var(--cv-primary-light)",
                                            }}
                                          >
                                            {course.category}
                                          </span>
                                        )}
                                        {course.duration && (
                                          <span
                                            className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                                            style={{
                                              color: "var(--cv-neutral-dark)",
                                              background: "var(--cv-neutral-light)",
                                              border: "1px solid var(--cv-neutral-border)",
                                            }}
                                          >
                                            {course.duration}
                                          </span>
                                        )}
                                        {course.tag && (
                                          <span
                                            className="text-[10.5px] font-bold px-2 py-0.5 rounded-md"
                                            style={{
                                              color: "var(--cv-accent)",
                                              background: "var(--cv-accent-light)",
                                              border: "1px solid var(--cv-accent-light)",
                                            }}
                                          >
                                            {course.tag}
                                          </span>
                                        )}
                                      </div>

                                      {course.universities?.[0]?.name && (
                                        <p
                                          className="text-[11.5px] mt-1.5 mb-0"
                                          style={{ color: "var(--cv-neutral-mid)" }}
                                        >
                                          {course.universities[0].name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}

                            {courseRemaining > 0 && (
                              <LoadMoreButton
                                remaining={courseRemaining}
                                onClick={() =>
                                  setCourseVisibleCount((prev) => prev + PAGE_SIZE)
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-white rounded-3xl p-16 text-center"
                      style={{ border: "1.5px dashed var(--cv-neutral-border)" }}
                    >
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                        style={{ background: "var(--cv-accent-light)" }}
                      >
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--cv-accent)" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3
                        className="text-[17px] font-bold mb-1.5 mt-0"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        No results found
                      </h3>
                      <p
                        className="text-[14px] m-0"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        Try different keywords or remove filters
                      </p>
                    </div>
                  )}
                </main>
              </div>
            ) : (
              /* ═══ IDLE STATE ═══ */
              <div className="card-enter">
                <div className="flex flex-col items-center justify-center px-5 pt-14 pb-10 text-center">
                  <div
                    className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
                    style={{ background: "var(--cv-primary-light)" }}
                  >
                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="var(--cv-primary)" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2
                    className="text-[24px] font-extrabold mb-2.5 mt-0 tracking-tight"
                    style={{ color: "var(--cv-neutral-dark)" }}
                  >
                    Search for your future
                  </h2>
                  <p
                    className="text-[14px] max-w-[320px] leading-relaxed mb-7 mt-0"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    Enter a university name, course, or your budget like{" "}
                    <strong style={{ color: "var(--cv-primary)" }}>
                      "MBA under 50k"
                    </strong>
                  </p>

                  <div className="flex gap-2.5 flex-wrap justify-center">
                    {["MBA", "B.Tech", "Law", "Medical", "NAAC A+"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="tag-btn px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all"
                        style={{
                          border: "1.5px solid var(--cv-primary)",
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div
                  className="grid gap-3 bg-white rounded-3xl p-6 mb-5"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                >
                  {[
                    { value: "500+", label: "Universities listed" },
                    { value: "2,000+", label: "Courses indexed" },
                    { value: "4", label: "Approval bodies tracked" },
                    {
                      value: `${MAX_COMPARE}`,
                      label: "Colleges you can compare at once",
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center py-1.5">
                      <p
                        className="text-[22px] font-bold m-0 mb-1"
                        style={{ color: "var(--cv-primary)" }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-[11.5px] m-0 leading-snug"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Why search here */}
                <div>
                  <p
                    className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3 ml-1 mt-0"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    Why search here
                  </p>
                  <div
                    className="grid gap-3.5"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
                  >
                    {[
                      {
                        title: "Verified approvals",
                        desc: "Every UGC / AICTE / NAAC / NBA tag is pulled from the university's own record.",
                      },
                      {
                        title: "Real fee data",
                        desc: "Fees shown are per-university, per-course — not a generic average.",
                      },
                      {
                        title: "Compare instantly",
                        desc: "Shortlist up to three options and view them side by side before you decide.",
                      },
                    ].map((f) => (
                      <div
                        key={f.title}
                        className="feature-tile bg-white rounded-2xl p-4"
                        style={{ border: "1px solid var(--cv-neutral-border)" }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 text-[14px] font-bold"
                          style={{
                            background: "var(--cv-primary-light)",
                            color: "var(--cv-primary)",
                          }}
                        >
                          ✓
                        </div>
                        <p
                          className="text-[13.5px] font-bold mb-1 mt-0"
                          style={{ color: "var(--cv-neutral-dark)" }}
                        >
                          {f.title}
                        </p>
                        <p
                          className="text-[12px] m-0 leading-relaxed"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal links */}
                <div className="mt-7">
                  <p
                    className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3 ml-1 mt-0"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    Or browse directly
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { href: "/university", label: "All Universities" },
                      { href: "/course", label: "All Courses" },
                      { href: "/explore", label: "Explore" },
                      { href: "/career", label: "Career Guidance" },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="idle-link px-4 py-2.5 rounded-xl bg-white text-[13px] font-semibold no-underline transition-all"
                        style={{
                          border: "1px solid var(--cv-neutral-border)",
                          color: "var(--cv-neutral-dark)",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ═══ FLOATING COMPARE TRAY ═══ */}
          {compareItems.length > 0 && !isCompareOpen && (
            <div
              className="compare-tray fixed bottom-5 left-1/2 z-[60] flex items-center gap-3 px-3.5 py-3 rounded-2xl max-w-[calc(100vw-32px)]"
              style={{
                background: "var(--cv-neutral-dark)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
              }}
            >
              <div className="flex gap-1.5">
                {compareItems.map((item) => (
                  <span
                    key={item.id}
                    className="text-[11.5px] font-bold text-white px-2.5 py-1 rounded-lg whitespace-nowrap max-w-[120px] truncate"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setIsCompareOpen(true)}
                className="compare-tray-btn text-[12.5px] font-bold px-3.5 py-2 rounded-lg whitespace-nowrap transition-all"
                style={{
                  color: "var(--cv-neutral-dark)",
                  background: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Compare ({compareItems.length})
              </button>
              <button
                onClick={clearCompare}
                className="text-[12px] font-semibold"
                style={{
                  color: "var(--cv-neutral-mid)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* ═══ COMPARE DRAWER ═══ */}
          {isCompareOpen && (
            <div
              className="fixed inset-0 z-[70]"
              style={{ background: "rgba(15,23,42,0.35)" }}
              onClick={() => setIsCompareOpen(false)}
            >
              <div
                className="compare-drawer absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-6 pt-5 pb-7 max-w-6xl mx-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ boxShadow: "0 -12px 40px rgba(0,0,0,0.15)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-[17px] font-extrabold m-0"
                    style={{ color: "var(--cv-neutral-dark)" }}
                  >
                    Compare
                  </h3>
                  <button
                    onClick={() => setIsCompareOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      background: "#fff",
                      color: "var(--cv-neutral-mid)",
                    }}
                    aria-label="Close"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div
                  className="grid gap-3.5"
                  style={{
                    gridTemplateColumns: `repeat(${compareItems.length}, minmax(160px, 1fr))`,
                  }}
                >
                  {compareItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl p-4"
                      style={{ border: "1px solid var(--cv-neutral-border)" }}
                    >
                      <span
                        className="text-[10px] font-extrabold tracking-[0.05em] px-2 py-0.5 rounded-md"
                        style={{
                          color: "var(--cv-primary)",
                          background: "var(--cv-primary-light)",
                        }}
                      >
                        {item.type.toUpperCase()}
                      </span>
                      <p
                        className="text-[14px] font-bold mt-2 mb-1 leading-snug"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-[12px] mt-0 mb-2.5"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        {item.sub}
                      </p>
                      <div
                        className="pt-2.5"
                        style={{ borderTop: "1px solid var(--cv-neutral-border)" }}
                      >
                        <p
                          className="text-[10.5px] tracking-[0.05em] uppercase mt-0 mb-0.5"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          Fees
                        </p>
                        <p
                          className="text-[15px] font-extrabold m-0"
                          style={{ color: "var(--cv-accent)" }}
                        >
                          {item.fee != null
                            ? `₹${item.fee.toLocaleString()}`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function SearchPageClient() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}