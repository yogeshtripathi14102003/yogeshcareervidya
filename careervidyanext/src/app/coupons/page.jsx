"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TicketPercent,
  Copy,
  Check,
  Clock,
  Tag,
  Sparkles,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import api from "@/utlis/api";

// Cards ke colors baari-baari se lagte hain
const COLORS = [
  "from-blue-600 to-indigo-700",
  "from-orange-500 to-orange-600",
  "from-emerald-600 to-teal-700",
];

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const discountLabel = (c) =>
  c.discountType === "percentage" ? `${c.discountValue}%` : inr(c.discountValue);

const courseName = (c) => c.course?.title || c.course?.name || "this course";

const expiryText = (daysLeft) => {
  if (daysLeft <= 0) return "Ends today";
  if (daysLeft === 1) return "Ends tomorrow";
  return `${daysLeft} days left`;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [copiedCode, setCopiedCode] = useState("");

  const loadCoupons = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.get("/api/v1/coupons/public");
      setCoupons(Array.isArray(res.data?.data) ? res.data.data : []);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch {
      window.prompt("Copy your coupon code:", code);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <TicketPercent size={34} />
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-600">
            Special Offers
          </p>

          <h1 className="text-3xl font-extrabold text-blue-900 sm:text-4xl">
            Coupons & Discounts
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Explore exciting offers on courses and career programs. Copy your
            coupon code and save on eligible purchases.
          </p>
        </div>

        {/* Offer banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white sm:p-8">
          <Sparkles className="absolute right-6 top-6 text-orange-300" size={36} />

          <p className="mb-2 text-sm font-medium text-blue-100">
            Exclusive Student Offers
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">Learn More. Pay Less.</h2>

          <p className="mt-2 max-w-lg text-sm text-blue-100">
            Find the right program for your future and make the most of
            available discounts.
          </p>
        </div>

        {/* List heading */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-800">Available Coupons</h2>

          {status === "ready" && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              {coupons.length} {coupons.length === 1 ? "Offer" : "Offers"}
            </span>
          )}
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
            <p className="font-semibold text-red-700">Coupons could not be loaded.</p>
            <p className="mt-1 text-sm text-red-600">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={loadCoupons}
              className="mt-4 rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "ready" && coupons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <TicketPercent className="mx-auto mb-3 text-slate-400" size={34} />
            <p className="font-semibold text-slate-700">No coupons available right now.</p>
            <p className="mt-1 text-sm text-slate-500">
              New offers are added regularly, please check back soon.
            </p>
          </div>
        )}

        {/* Coupons */}
        {status === "ready" && coupons.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon, index) => (
              <article
                key={coupon._id || coupon.code}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Discount section */}
                <div className={`bg-gradient-to-r ${COLORS[index % COLORS.length]} p-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                      {expiryText(coupon.daysLeft)}
                    </span>
                    <Tag size={22} />
                  </div>

                  <h3 className="mt-5 text-4xl font-extrabold">
                    {discountLabel(coupon)} OFF
                  </h3>

                  <p className="mt-1 text-sm text-white/90">
                    {coupon.university?.name || "Special offer"}
                  </p>
                </div>

                {/* Details */}
                <div className="p-5">
                  <p className="min-h-12 text-sm leading-6 text-slate-600">
                    {coupon.discountType === "percentage"
                      ? `Get ${coupon.discountValue}% off on ${courseName(coupon)}`
                      : `Get a flat ${inr(coupon.discountValue)} off on ${courseName(coupon)}`}
                    {coupon.university?.name ? ` at ${coupon.university.name}.` : "."}
                    {coupon.maxDiscountAmount
                      ? ` Maximum discount ${inr(coupon.maxDiscountAmount)}.`
                      : ""}
                  </p>

                  <div className="my-4 flex items-start justify-between gap-3 border-y border-dashed border-slate-200 py-3 text-sm">
                    <span className="flex shrink-0 items-center gap-1.5 text-slate-500">
                      <GraduationCap size={16} />
                      Course
                    </span>
                    <span className="text-right font-bold text-slate-800">
                      {courseName(coupon)}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <Clock size={15} />
                      Valid until {formatDate(coupon.validUntil)}
                    </span>

                    {coupon.remainingUses !== null && coupon.remainingUses <= 10 && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 font-semibold text-orange-700">
                        Only {coupon.remainingUses} left
                      </span>
                    )}
                  </div>

                  {/* Coupon code */}
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 p-3">
                    <span className="break-all font-extrabold tracking-wider text-blue-900">
                      {coupon.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyCoupon(coupon.code)}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-900"
                      aria-label={`Copy ${coupon.code} coupon code`}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check size={15} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-8 text-center text-xs leading-5 text-slate-500">
          Offers are subject to eligibility and applicable terms. Please verify
          the coupon before making a purchase.
        </p>
      </div>
    </main>
  );
}