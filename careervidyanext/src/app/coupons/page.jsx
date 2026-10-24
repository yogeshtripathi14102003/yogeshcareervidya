
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TicketPercent,
  Copy,
  Check,
  Search,
  Clock,
  Tag,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Gift,
} from "lucide-react";
import api from "@/utlis/api";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const COLORS = [
  "linear-gradient(180deg, #1E40AF, #1E3A8A)",
  "linear-gradient(180deg, #EA580C, #C2410C)",
  "linear-gradient(180deg, #0F766E, #115E59)",
];

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const discountLabel = (coupon) =>
  coupon.discountType === "percentage"
    ? `${coupon.discountValue}%`
    : inr(coupon.discountValue);

const courseName = (coupon) =>
  coupon.course?.title ||
  coupon.course?.name ||
  "Eligible Course";

const getUniversityName = (coupon) =>
  coupon.university?.name || "Career Vidya";

const getLogo = (coupon) =>
  coupon.university?.logo ||
  coupon.university?.logoUrl ||
  coupon.university?.image ||
  "";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState("loading");
  const [copiedCode, setCopiedCode] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const loadCoupons = useCallback(async () => {
    setStatus("loading");

    try {
      const res = await api.get("/api/v1/coupons/public");

      setCoupons(
        Array.isArray(res.data?.data) ? res.data.data : []
      );

      setStatus("ready");
    } catch (error) {
      console.error("Unable to load coupons:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const courseOptions = useMemo(() => {
    const names = coupons
      .map((coupon) => courseName(coupon))
      .filter((name) => name !== "Eligible Course");

    return ["All Courses", ...new Set(names)];
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesCourse =
        selectedCourse === "All Courses" ||
        courseName(coupon) === selectedCourse;

      const searchableText = [
        coupon.code,
        courseName(coupon),
        getUniversityName(coupon),
        coupon.discountValue,
        coupon.discountType,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCourse && searchableText.includes(query);
    });
  }, [coupons, search, selectedCourse]);

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode((current) =>
          current === code ? "" : current
        );
      }, 2000);
    } catch {
      window.prompt("Copy your coupon code:", code);
    }
  };

  return (
    <main className="cv-coupons min-h-screen">
      {/* Header */}
      <Header />
      <section className="cv-coupon-hero">
        <div className="mx-auto max-w-7xl px-4 py-9 text-center sm:px-6 sm:py-12">
          <div className="cv-hero-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
            <TicketPercent size={30} />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 sm:text-sm">
            Special Student Offers
          </p>

          <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
            {selectedCourse === "All Courses"
              ? "Coupons & Exclusive Offers"
              : selectedCourse}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover exclusive coupons to make your education and
            career journey more affordable.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = "/";
            }
          }}
          className="cv-back-button mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          <ArrowLeft size={17} />
          Go Back
        </button>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="cv-filter-panel rounded-2xl bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCourse("All Courses");
                }}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Search */}
            <label className="cv-search-box mb-6 flex items-center gap-2.5 rounded-full px-4 py-3">
              <Search
                size={19}
                className="shrink-0 text-slate-600"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search coupons..."
                aria-label="Search coupons"
                className="w-full min-w-0 border-0 bg-transparent text-sm text-slate-800 outline-none"
              />
            </label>

            {/* Course filters */}
            <div>
              <h3 className="mb-4 text-base font-bold text-slate-900">
                Courses
              </h3>

              <div className="space-y-4">
                {courseOptions.map((course) => (
                  <label
                    key={course}
                    className="cv-filter-option flex cursor-pointer items-start gap-3 text-sm text-slate-700"
                  >
                    <input
                      type="radio"
                      name="coupon-course"
                      checked={selectedCourse === course}
                      onChange={() => setSelectedCourse(course)}
                      className="cv-radio mt-0.5 shrink-0"
                    />

                    <span className="leading-5">{course}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sidebar note */}
            <div className="cv-sidebar-note mt-7 rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2 font-bold text-blue-900">
                <Gift size={19} />
                Save on your future
              </div>

              <p className="text-xs leading-5 text-slate-600">
                Select a course to find coupons available for that
                program.
              </p>
            </div>
          </aside>

          {/* Coupon list */}
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Available Coupons
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Find an offer that works for you.
                </p>
              </div>

              {status === "ready" && (
                <span className="cv-count-badge rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm">
                  {filteredCoupons.length}{" "}
                  {filteredCoupons.length === 1 ? "Offer" : "Offers"}
                </span>
              )}
            </div>

            {/* Loading */}
            {status === "loading" && (
              <div
                className="space-y-5"
                aria-busy="true"
                aria-label="Loading coupons"
              >
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                <AlertCircle
                  className="mx-auto mb-3 text-red-500"
                  size={34}
                />

                <h3 className="font-bold text-slate-900">
                  Coupons could not be loaded
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Please check your connection and try again.
                </p>

                <button
                  type="button"
                  onClick={loadCoupons}
                  className="cv-apply-button mt-5 rounded-lg px-5 py-2.5 text-sm font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {status === "ready" && filteredCoupons.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <TicketPercent
                  className="mx-auto mb-4 text-slate-400"
                  size={42}
                />

                <h3 className="text-lg font-bold text-slate-800">
                  No coupons found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another course or search for a different coupon.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCourse("All Courses");
                  }}
                  className="cv-text-link mt-4 text-sm font-bold"
                >
                  View all coupons
                </button>
              </div>
            )}

            {/* Horizontal ticket cards */}
            {status === "ready" && filteredCoupons.length > 0 && (
              <div className="space-y-5">
                {filteredCoupons.map((coupon, index) => {
                  const logo = getLogo(coupon);
                  const university = getUniversityName(coupon);
                  const isCopied = copiedCode === coupon.code;

                  return (
                    <article
                      key={coupon._id || coupon.code}
                      className="cv-coupon-card relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white sm:flex-row"
                    >
                      {/* Ticket strip */}
                      <div
                        className="cv-ticket-strip relative flex shrink-0 items-center justify-center px-4 py-3 sm:w-[76px] sm:px-0 sm:py-5"
                        style={{
                          background: COLORS[index % COLORS.length],
                        }}
                      >
                        <span className="font-extrabold tracking-widest text-white sm:[writing-mode:vertical-rl] sm:rotate-180">
                          {coupon.code}
                        </span>
                      </div>

                      {/* University / brand */}
                      <div className="cv-coupon-brand flex items-center gap-3 px-4 py-4 sm:w-[205px] sm:shrink-0 sm:flex-col sm:justify-center sm:px-3 sm:py-6">
                        <div className="cv-logo-frame flex h-[58px] w-[145px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
                          {logo ? (
                            <img
                              src={logo}
                              alt={`${university} logo`}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 text-blue-900">
                              <GraduationCap
                                size={27}
                                className="shrink-0 text-orange-600"
                              />

                              <span className="text-sm font-extrabold leading-tight">
                                Career
                                <br />
                                Vidya
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm font-medium text-slate-500 sm:text-center">
                          {university}
                        </p>
                      </div>

                      {/* Coupon information */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 pb-5 sm:px-5 sm:py-6 lg:px-6">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">
                            {coupon.title ||
                              `${courseName(coupon)} Coupon`}
                            {" "}worth{" "}
                            {discountLabel(coupon)}
                          </h3>

                          <Sparkles
                            size={17}
                            className="shrink-0 text-blue-700"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="cv-benefit-pill">
                            <GraduationCap size={15} />
                            {courseName(coupon)}
                          </span>

                          <span className="cv-benefit-pill">
                            <Tag size={14} />
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% discount`
                              : `${inr(coupon.discountValue)} discount`}
                          </span>

                          {coupon.maxDiscountAmount ? (
                            <span className="cv-benefit-pill">
                              Max savings{" "}
                              {inr(coupon.maxDiscountAmount)}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            Active offer
                          </span>

                          {coupon.remainingUses != null &&
                          coupon.remainingUses >= 0 ? (
                            <span>
                              {coupon.remainingUses} uses remaining
                            </span>
                          ) : null}
                        </div>

                        {/* Code */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 font-bold tracking-wider text-blue-900">
                            {coupon.code}
                          </span>

                          <button
                            type="button"
                            onClick={() => copyCoupon(coupon.code)}
                            className="cv-copy-button inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold"
                          >
                            {isCopied ? (
                              <>
                                <Check size={15} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={15} />
                                Copy Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Apply button */}
                      <div className="flex shrink-0 items-center justify-end border-t border-slate-100 px-4 py-4 sm:w-[150px] sm:justify-center sm:border-l sm:border-t-0 sm:px-3">
                        <button
                          type="button"
                          onClick={() => copyCoupon(coupon.code)}
                          className="cv-apply-button inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold sm:w-auto"
                        >
                          {isCopied ? (
                            <>
                              <Check size={16} />
                              Copied
                            </>
                          ) : (
                            "Apply Code"
                          )}
                        </button>
                      </div>

                      {/* Top-right brand badge */}
                      <span className="cv-powered-badge absolute right-0 top-0 hidden rounded-bl-xl px-3 py-1 text-xs sm:block">
                        Powered by Career Vidya
                      </span>
                    </article>
                  );
                })}
              </div>
            )}

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Coupon availability and discount eligibility are subject
              to the applicable offer terms.
            </p>
          </section>
        </div>
      </div>

      {/* Page-specific styling using global brand variables */}
    
<style jsx global>{`
  .cv-coupons {
    background: var(--cv-neutral-light);
    color: var(--cv-neutral-dark);
    font-family: var(--font-poppins), ui-sans-serif, system-ui,
      sans-serif;
  }

  /* ===== Premium CareerVidya Hero ===== */
  .cv-coupon-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background:
      radial-gradient(
        ellipse at 90% 15%,
        rgba(249, 115, 22, 0.23) 0%,
        transparent 34%
      ),
      radial-gradient(
        ellipse at 5% 100%,
        rgba(96, 165, 250, 0.22) 0%,
        transparent 38%
      ),
      linear-gradient(
        125deg,
        var(--cv-primary) 0%,
        #172554 48%,
        var(--cv-primary-dark) 100%
      );
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    border-bottom: 3px solid var(--cv-accent);
  }

  /* Subtle dotted texture */
  .cv-coupon-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.2) 1px,
      transparent 1px
    );
    background-size: 25px 25px;
    opacity: 0.3;
  }

  /* Decorative orange ring */
  .cv-coupon-hero::after {
    content: "";
    position: absolute;
    z-index: -1;
    width: 250px;
    height: 250px;
    top: -145px;
    right: -65px;
    border: 32px solid rgba(249, 115, 22, 0.16);
    border-radius: 50%;
    pointer-events: none;
  }

  .cv-coupon-hero h1 {
    color: #ffffff;
    letter-spacing: -0.035em;
    line-height: 1.2;
    text-shadow: 0 3px 16px rgba(15, 23, 42, 0.16);
  }

  .cv-coupon-hero p {
    color: rgba(255, 255, 255, 0.86);
  }

  .cv-coupon-hero p:first-of-type {
    color: #fed7aa;
    letter-spacing: 0.16em;
  }

  .cv-hero-icon {
    background: var(--cv-grad-cta);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.22);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.25);
  }

  /* ===== Filters ===== */
  .cv-filter-panel {
    border: 1px solid var(--cv-neutral-border);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
  }

  .cv-search-box {
    border: 1px solid #e5e7eb;
    background: #f3f4f6;
    box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.025);
  }

  .cv-search-box:focus-within {
    border-color: var(--cv-primary-dark);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.09);
  }

  .cv-search-box input {
    background: transparent !important;
    color: var(--cv-neutral-dark) !important;
  }

  .cv-search-box input::placeholder {
    color: var(--cv-neutral-mid);
  }

  .cv-filter-option:hover {
    color: var(--cv-primary-dark);
  }

  .cv-radio {
    accent-color: var(--cv-primary-dark);
    width: 15px;
    height: 15px;
  }

  .cv-sidebar-note {
    background: var(--cv-primary-light);
    border: 1px solid #dbeafe;
  }

  /* ===== Back Button ===== */
  .cv-back-button {
    background: #ffffff;
    color: var(--cv-primary-dark);
    border: 1px solid var(--cv-primary-dark);
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
    transition: background 0.2s ease, color 0.2s ease;
  }

  .cv-back-button:hover {
    background: var(--cv-primary-light);
  }

  .cv-count-badge {
    color: var(--cv-primary-dark);
    background: var(--cv-primary-light);
  }

  /* ===== Coupon Cards ===== */
  .cv-coupon-card {
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.055);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .cv-coupon-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 7px 22px rgba(15, 23, 42, 0.09);
  }

  .cv-ticket-strip {
    min-height: 60px;
  }

  .cv-benefit-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    background: var(--cv-primary-light);
    padding: 7px 12px;
    color: var(--cv-neutral-dark);
    font-size: 12px;
    line-height: 1.35;
  }

  /* ===== Copy Button ===== */
  .cv-copy-button {
    background: var(--cv-accent-light);
    color: var(--cv-accent-dark);
    border: 1px solid #fed7aa;
    transition: background 0.2s ease;
  }

  .cv-copy-button:hover {
    background: #ffedd5;
  }

  /* ===== Apply Button ===== */
  .cv-apply-button {
    background: var(--cv-primary-dark);
    color: #ffffff;
    box-shadow: 0 2px 5px rgba(30, 64, 175, 0.2);
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .cv-apply-button:hover {
    background: var(--cv-primary);
  }

  .cv-powered-badge {
    background: #d1fae5;
    color: #0f9f83;
  }

  .cv-text-link {
    color: var(--cv-primary-dark);
  }

  /* ===== Desktop Ticket Layout ===== */
  @media (min-width: 640px) {
    .cv-ticket-strip {
      border-radius: 15px 0 0 15px;
    }

    .cv-ticket-strip::after {
      content: "";
      position: absolute;
      right: -1px;
      top: 0;
      bottom: 0;
      width: 9px;
      background: radial-gradient(
        circle at 0 8px,
        var(--cv-neutral-white) 0 5px,
        transparent 5.5px
      );
      background-size: 9px 18px;
      background-repeat: repeat-y;
    }

    .cv-coupon-brand {
      border-right: 1px dashed #e2e8f0;
    }
  }

  /* ===== Mobile Responsive ===== */
  @media (max-width: 639px) {
    .cv-coupon-hero::after {
      width: 160px;
      height: 160px;
      top: -90px;
      right: -80px;
      border-width: 22px;
    }

    .cv-coupon-hero h1 {
      letter-spacing: -0.025em;
      line-height: 1.3;
    }

    .cv-coupon-card {
      border-radius: 14px;
    }

    .cv-ticket-strip {
      min-height: 44px;
    }

    .cv-benefit-pill {
      font-size: 11px;
      padding: 6px 9px;
    }
  }
`}</style>

<Footer />
    </main>
  );
}
