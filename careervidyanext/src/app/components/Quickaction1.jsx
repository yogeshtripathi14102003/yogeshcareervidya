"use client";

import React from "react";
import { Star, Play, ArrowRight } from "lucide-react";

/* ============ DATA ============ */

const UNIVERSITIES = [
  { name: "Amity University", programs: "B.Tech, MBA, BBA", fees: "₹2 - 6 LPA", placement: "92%", rating: "4.5" },
  // { name: "UPES", programs: "B.Tech, MBA", fees: "₹3 - 8 LPA", placement: "88%", rating: "4.3" },
  { name: "Chandigarh University", programs: "B.Tech, MBA, BCA", fees: "₹1.5 - 5 LPA", placement: "90%", rating: "4.4" },
  { name: "Sharda University", programs: "B.Tech, MBA, BBA", fees: "₹2 - 7 LPA", placement: "85%", rating: "4.2" },
];

const TESTIMONIALS = [
  {
    quote:
      "CareerVidya helped me choose the right course and guided me throughout my journey.",
    name: "Rahul Sharma",
    title: "MBA Graduate • Business Analyst",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    quote:
      "The AI course guidance and career advice gave me total clarity on my future.",
    name: "Priya Verma",
    title: "BCA Graduate • Software Engineer",
    image: "https://i.pravatar.cc/100?img=47",
  },
  {
    quote:
      "Got my dream job with the help of great guidance and a strong resume.",
    name: "Arjun Singh",
    title: "B.Tech • Data Analyst",
    image: "https://i.pravatar.cc/100?img=33",
  },
];

/* ============ COMPONENT ============ */

export default function CompareAndTestimonials() {
  return (
    <section className="w-full bg-[#FAF9F6] py-10 sm:py-14 lg:py-16 font-sans text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* ================= COMPARE UNIVERSITIES ================= */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">

          {/* Left: heading + CTA */}
          <div className="space-y-4 lg:col-span-4">
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              Compare Before You Decide
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
              Compare top universities on fees, courses, placements & more.
              Make the right choice for your future.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C85103] px-6 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-200 hover:bg-[#C85103] hover:shadow-lg active:scale-[0.98]"
            >
              Compare Universities
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right: image + comparison table */}
          <div className="relative lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-0 sm:rounded-2xl sm:border sm:border-slate-200/80 sm:bg-white sm:p-3 sm:shadow-sm">

              {/* City image */}
              <div className="relative h-40 overflow-hidden rounded-2xl sm:col-span-2 sm:h-auto sm:rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60"
                  alt="University campus skyline"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:col-span-3 sm:rounded-xl sm:border-0 sm:p-2 sm:shadow-none">
                <table className="w-full min-w-[420px] border-collapse text-left">
                  <thead>
                    <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      <th className="px-2 py-2">University</th>
                      <th className="px-2 py-2">Programs</th>
                      <th className="px-2 py-2">Fees (Range)</th>
                      <th className="px-2 py-2">Placement</th>
                      <th className="px-2 py-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UNIVERSITIES.map((u, i) => (
                      <tr
                        key={i}
                        className="border-t border-slate-100 text-xs text-slate-600 sm:text-[13px]"
                      >
                        <td className="px-2 py-2.5 font-bold text-slate-900">{u.name}</td>
                        <td className="px-2 py-2.5">{u.programs}</td>
                        <td className="px-2 py-2.5">{u.fees}</td>
                        <td className="px-2 py-2.5">{u.placement}</td>
                        <td className="px-2 py-2.5">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {u.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REAL STUDENTS TESTIMONIALS ================= */}
        <div className="space-y-8 sm:space-y-10">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Real Students. Real Careers. Real Results.
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Video testimonial card */}
            <div className="relative flex min-h-[220px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] p-6 text-center shadow-sm">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <button
                type="button"
                aria-label="Play testimonials video"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#7C3AED] shadow-lg transition-transform hover:scale-105"
              >
                <Play className="h-5 w-5 fill-current" />
              </button>
              <p className="text-sm font-semibold text-white">
                Watch our Success Stories
                <br />
                Video Testimonials
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}