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
import Register from "../coupons/Register";

// Single uniform color for all coupon ticket strips
const UNIFORM_STRIP_BG = "linear-gradient(180deg, #1E40AF, #1E3A8A)";

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
  coupon.university?.name ||
  coupon.university?.universityName ||
  "Career Vidya";

/**
 * University model mein logo field ka actual naam universityImage hai.
 * Relative image paths ko API base URL ke saath resolve karte hain.
 */
const getLogo = (coupon) => {
  const university = coupon?.university;

  const image =
    university?.universityImage ||
    university?.universityLogo ||
    university?.logo ||
    university?.logoUrl ||
    university?.image ||
    university?.imageUrl ||
    "";

  if (typeof image !== "string" || !image.trim()) {
    return "";
  }

  const imageUrl = image.trim();

  // Already absolute URL or data URL
  if (/^(https?:\/\/|data:)/i.test(imageUrl)) {
    return imageUrl;
  }

  // Public API base URL, e.g. https://api.careervidya.in
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  const imagePath = imageUrl.replace(/^\/+/, "");

  return baseUrl
    ? `${baseUrl}/${imagePath}`
    : `/${imagePath}`;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState("loading");
  const [copiedCode, setCopiedCode] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [failedLogos, setFailedLogos] = useState({});

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
      <Header />
      <Register />
      {/* Hero Section */}
      <section className="cv-coupon-hero">
        <div className="mx-auto max-w-7xl px-4 py-7 text-center sm:px-6 sm:py-9">
          <div className="cv-hero-icon cv-icon-gradient mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
            <TicketPercent size={24} />
          </div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 sm:text-sm">
            Special Student Offers
          </p>

          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl md:text-3xl">
            {selectedCourse === "All Courses"
              ? "Coupons & Exclusive Offers"
              : selectedCourse}
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-slate-600 sm:text-sm">
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
          className="cv-back-button mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
        >
          <ArrowLeft size={15} />
          Go Back
        </button>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="cv-filter-panel rounded-xl bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
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
            <label className="cv-search-box mb-5 flex items-center gap-2 rounded-full px-3.5 py-2.5">
              <Search
                size={17}
                className="shrink-0 text-slate-500"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search coupons..."
                aria-label="Search coupons"
                className="w-full min-w-0 border-0 bg-transparent text-xs text-slate-800 outline-none"
              />
            </label>

            {/* Course filters */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-900">
                Courses
              </h3>

              <div className="space-y-3">
                {courseOptions.map((course) => (
                  <label
                    key={course}
                    className="cv-filter-option flex cursor-pointer items-start gap-2.5 text-xs text-slate-700"
                  >
                    <input
                      type="radio"
                      name="coupon-course"
                      checked={selectedCourse === course}
                      onChange={() => setSelectedCourse(course)}
                      className="cv-radio mt-0.5 shrink-0"
                    />

                    <span className="leading-4">{course}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sidebar note */}
            <div className="cv-sidebar-note mt-6 rounded-lg p-3.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Gift size={16} />
                Save on your future
              </div>

              <p className="text-[11px] leading-4 text-slate-600">
                Select a course to find coupons available for that
                program.
              </p>
            </div>
          </aside>

          {/* Coupon list */}
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Available Coupons
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Find an offer that works for you.
                </p>
              </div>

              {status === "ready" && (
                <span className="cv-count-badge rounded-full px-2.5 py-1 text-xs font-bold">
                  {filteredCoupons.length}{" "}
                  {filteredCoupons.length === 1 ? "Offer" : "Offers"}
                </span>
              )}
            </div>

            {/* Loading */}
            {status === "loading" && (
              <div
                className="space-y-4"
                aria-busy="true"
                aria-label="Loading coupons"
              >
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
                <AlertCircle
                  className="mx-auto mb-2 text-red-500"
                  size={30}
                />

                <h3 className="text-sm font-bold text-slate-900">
                  Coupons could not be loaded
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Please check your connection and try again.
                </p>

                <button
                  type="button"
                  onClick={loadCoupons}
                  className="cv-apply-button mt-4 rounded-md px-4 py-2 text-xs font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {status === "ready" && filteredCoupons.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                <TicketPercent
                  className="mx-auto mb-3 text-slate-400"
                  size={36}
                />

                <h3 className="text-base font-bold text-slate-800">
                  No coupons found
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Try another course or search for a different coupon.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCourse("All Courses");
                  }}
                  className="cv-text-link mt-3 text-xs font-bold"
                >
                  View all coupons
                </button>
              </div>
            )}

            {/* Coupon cards (Smaller and Uniform color) */}
            {status === "ready" && filteredCoupons.length > 0 && (
              <div className="space-y-4">
                {filteredCoupons.map((coupon) => {
                  const logo = getLogo(coupon);
                  const university = getUniversityName(coupon);
                  const isCopied = copiedCode === coupon.code;
                  const logoKey = coupon._id || coupon.code;
                  const logoFailed = failedLogos[logoKey];

                  return (
                    <article
                      key={logoKey}
                      className="cv-coupon-card relative flex min-w-0 flex-col overflow-hidden rounded-xl bg-white sm:flex-row"
                    >
                      {/* Ticket strip - Uniform Color */}
                      <div
                        className="cv-ticket-strip relative flex shrink-0 items-center justify-center px-3 py-2 sm:w-[56px] sm:px-0 sm:py-4"
                        style={{
                          background: UNIFORM_STRIP_BG,
                        }}
                      >
                        <span className="text-xs font-extrabold tracking-widest text-white sm:[writing-mode:vertical-rl] sm:rotate-180">
                          {coupon.code}
                        </span>
                      </div>

                      {/* University logo and name - Compact */}
                      <div className="cv-coupon-brand flex min-w-0 items-center gap-3 px-3 py-3 sm:w-[160px] sm:shrink-0 sm:flex-col sm:justify-center sm:px-2 sm:py-4">
                        <div className="cv-logo-frame flex h-[50px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white p-1.5 sm:h-[65px] sm:w-full sm:max-w-[120px]">
                          {logo && !logoFailed ? (
                            <img
                              src={logo}
                              alt={`${university} logo`}
                              className="h-full w-full object-contain"
                              loading="lazy"
                              onError={() => {
                                console.error(
                                  "University logo failed to load:",
                                  logo
                                );

                                setFailedLogos((previous) => ({
                                  ...previous,
                                  [logoKey]: true,
                                }));
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-0.5 text-blue-900">
                              <GraduationCap
                                size={24}
                                className="text-orange-600"
                              />
                              <span className="text-center text-[10px] font-bold">
                                {university || "Career Vidya"}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="min-w-0 break-words text-xs font-semibold text-slate-700 sm:text-center">
                          {university}
                        </p>
                      </div>

                      {/* Coupon information */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 pb-3 sm:px-4 sm:py-4">
                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">
                            {coupon.title ||
                              `${courseName(coupon)} Coupon`}{" "}
                            worth {discountLabel(coupon)}
                          </h3>

                          <Sparkles
                            size={14}
                            className="shrink-0 text-blue-700"
                          />
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="cv-benefit-pill text-[11px] px-2.5 py-1">
                            <GraduationCap size={13} />
                            {courseName(coupon)}
                          </span>

                          <span className="cv-benefit-pill text-[11px] px-2.5 py-1">
                            <Tag size={12} />
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% discount`
                              : `${inr(coupon.discountValue)} discount`}
                          </span>

                          {coupon.maxDiscountAmount ? (
                            <span className="cv-benefit-pill text-[11px] px-2.5 py-1">
                              Max savings {inr(coupon.maxDiscountAmount)}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Active offer
                          </span>

                          {coupon.remainingUses != null &&
                          coupon.remainingUses >= 0 ? (
                            <span>
                              {coupon.remainingUses} uses remaining
                            </span>
                          ) : null}
                        </div>

                        {/* Coupon code */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-dashed border-blue-300 bg-blue-50 px-2.5 py-1.5 text-xs font-bold tracking-wider text-blue-900">
                            {coupon.code}
                          </span>

                          <button
                            type="button"
                            onClick={() => copyCoupon(coupon.code)}
                            className="cv-copy-button inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-bold"
                          >
                            {isCopied ? (
                              <>
                                <Check size={13} />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                Copy Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Apply button with Login Check */}
                      <div className="flex shrink-0 items-center justify-end border-t border-slate-100 px-3 py-3 sm:w-[150px] sm:justify-center sm:border-l sm:border-t-0 sm:px-3">
                        <button
                          type="button"
                          className="cv-apply-button inline-flex w-full items-center justify-center rounded-lg px-3.5 py-2 text-xs font-semibold sm:w-auto"
                          onClick={() => {
                            try {
                              sessionStorage.setItem("selectedSubsidyCoupon", coupon.code);
                            } catch (error) {
                              console.error("Unable to save coupon:", error);
                            }

                            // Check if user is logged in
                            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                            const isLoggedIn = Boolean(token);

                            if (isLoggedIn) {
                              copyCoupon(coupon.code);
                              alert(`Coupon Code "${coupon.code}" applied successfully!`);
                            } else {
                              window.dispatchEvent(
                                new CustomEvent("open-coupon-register", {
                                  detail: { couponCode: coupon.code },
                                })
                              );
                            }
                          }}
                        >
                          Apply Coupon
                        </button>
                      </div>

                      {/* Brand badge */}
                      <span className="cv-powered-badge absolute right-0 top-0 hidden rounded-bl-lg px-2 py-0.5 text-[10px] sm:block">
                        Powered by Career Vidya
                      </span>
                    </article>
                  );
                })}
              </div>
            )}

            <p className="mt-5 text-center text-[11px] leading-4 text-slate-500">
              Coupon availability and discount eligibility are subject
              to the applicable offer terms.
            </p>
          </section>
        </div>
      </div>

      {/* Page styling */}
      <style jsx global>{`
        .cv-coupons {
          background: var(--cv-neutral-light);
          color: var(--cv-neutral-dark);
          font-family: var(--font-poppins), ui-sans-serif, system-ui,
            sans-serif;
        }

        .cv-coupon-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: var(--cv-grad-hero);
          border-top: 1px solid var(--cv-neutral-border);
          border-bottom: 2px solid var(--cv-accent);
        }

        .cv-filter-panel {
          border: 1px solid var(--cv-neutral-border);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .cv-search-box {
          border: 1px solid #e5e7eb;
          background: #f3f4f6;
        }

        .cv-search-box:focus-within {
          border-color: var(--cv-primary-dark);
          box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.08);
        }

        .cv-search-box input {
          background: transparent !important;
          color: var(--cv-neutral-dark) !important;
        }

        .cv-filter-option:hover {
          color: var(--cv-primary-dark);
        }

        .cv-radio {
          accent-color: var(--cv-primary-dark);
          width: 14px;
          height: 14px;
        }

        .cv-sidebar-note {
          background: var(--cv-primary-light);
          border: 1px solid #dbeafe;
        }

        .cv-back-button {
          background: #ffffff;
          color: var(--cv-primary-dark);
          border: 1px solid var(--cv-primary-dark);
          transition: background 0.2s ease;
        }

        .cv-back-button:hover {
          background: var(--cv-primary-light);
        }

        .cv-count-badge {
          color: var(--cv-primary-dark);
          background: var(--cv-primary-light);
        }

        .cv-coupon-card {
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .cv-coupon-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
        }

        .cv-ticket-strip {
          min-height: 50px;
        }

        .cv-benefit-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          background: var(--cv-primary-light);
          color: var(--cv-neutral-dark);
          line-height: 1.3;
        }

        .cv-copy-button {
          background: var(--cv-accent-light);
          color: var(--cv-accent-dark);
          border: 1px solid #fed7aa;
          transition: background 0.2s ease;
        }

        .cv-copy-button:hover {
          background: #ffedd5;
        }

        .cv-apply-button {
          background: var(--cv-primary-dark);
          color: #ffffff;
          transition: background 0.2s ease, transform 0.1s ease;
          box-shadow: 0 2px 4px rgba(30, 64, 175, 0.15);
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

        @media (min-width: 640px) {
          .cv-ticket-strip {
            border-radius: 12px 0 0 12px;
          }

          .cv-ticket-strip::after {
            content: "";
            position: absolute;
            right: -1px;
            top: 0;
            bottom: 0;
            width: 7px;
            background: radial-gradient(
              circle at 0 7px,
              var(--cv-neutral-white) 0 4px,
              transparent 4.5px
            );
            background-size: 7px 14px;
            background-repeat: repeat-y;
          }

          .cv-coupon-brand {
            border-right: 1px dashed #e2e8f0;
          }
        }
      `}</style>

      <Footer />
    </main>
  );
}