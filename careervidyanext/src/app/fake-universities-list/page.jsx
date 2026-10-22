
"use client";
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";
import Requesttocallbackhome from  "@/app/components/Requesttocallbackhome";
import React from "react";
import { Landmark, ExternalLink } from "lucide-react";

const universities = [
  { name: "Christ New Testament Deemed University", state: "Andhra Pradesh" },
  { name: "Bible Open University of India", state: "Andhra Pradesh" },
  { name: "Indian Institute of Alternative Medicine", state: "Arunachal Pradesh" },
  { name: "Mountain Institute of Management & Technology", state: "Delhi" },
  { name: "World Peace of United Nations University (WPUNU)", state: "Delhi" },
  { name: "Institute of Management and Engineering", state: "Delhi" },
  { name: "National Institute of Management Solution", state: "Delhi" },
  {
    name: "All India Institute of Public & Physical Health Sciences (AIIPHS) State Government University",
    state: "Delhi",
  },
  { name: "Commercial University Ltd.", state: "Delhi" },
  { name: "United Nations University", state: "Delhi" },
  { name: "Vocational University", state: "Delhi" },
  { name: "ADR-Centric Juridical University", state: "Delhi" },
  { name: "Indian Institute of Science and Engineering", state: "Delhi" },
  { name: "Viswakarma Open University for Self-Employment", state: "Delhi" },
  { name: "Adhyatmik Vishwavidyalaya (Spiritual University)", state: "Delhi" },
  { name: "Magic & Art University", state: "Haryana" },
  {
    name: "Daksha University (Vocational and Life Skill Education)",
    state: "Jharkhand",
  },
  { name: "Global Human Peace University", state: "Karnataka" },
  { name: "Sarva Bharatiya Shiksha Peeth", state: "Karnataka" },
  {
    name: "International Islamic University of Prophetic Medicine (IIUPM)",
    state: "Kerala",
  },
  { name: "St. John's University, Kishanattam", state: "Kerala" },
  { name: "Raja Arabic University", state: "Maharashtra" },
  { name: "National Backward Krushi Vidyapeeth", state: "Maharashtra" },
  { name: "Usha Latchumanan College of Education", state: "Puducherry" },
  { name: "Sree Bodhi Academy of Higher Education", state: "Puducherry" },
  {
    name: "Rajeev Gandhi Institute of Technology & Management",
    state: "Rajasthan",
  },
  { name: "Gandhi Hindi Vidyapith", state: "Uttar Pradesh" },
  {
    name: "Netaji Subhash Chandra Bose University (Open University)",
    state: "Uttar Pradesh",
  },
  { name: "Bhartiya Shiksha Parishad", state: "Uttar Pradesh" },
  { name: "Mahamaya Technical University", state: "Uttar Pradesh" },
  { name: "Indian Institute of Alternative Medicine", state: "West Bengal" },
  {
    name: "Institute of Alternative Medicine and Research",
    state: "West Bengal",
  },
];

const UGC_URL = "https://www.ugc.gov.in/";

export default function FakeUniversitiesPage() {
  return (
    <main
      className="min-h-screen w-full overflow-x-clip"
      style={{
        background: "var(--background)",
        color: "var(--cv-neutral-dark)",
      }}
    >
        <Header />
      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden px-4 pb-8 pt-8 sm:pb-10 sm:pt-12"
        style={{ background: "var(--cv-grad-hero)" }}
      >
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl sm:h-64 sm:w-64"
          style={{ background: "var(--cv-primary-light)" }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full opacity-40 blur-3xl sm:h-56 sm:w-56"
          style={{ background: "var(--cv-accent-light)" }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Label */}
          <div className="mb-4 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm"
              style={{
                borderColor: "var(--cv-neutral-border)",
                color: "var(--cv-primary)",
              }}
            >
              <Landmark size={15} />
              University Recognition Guide
            </span>
          </div>

          {/* Heading */}
          <h1
            className="mx-auto max-w-3xl text-center text-2xl font-bold leading-tight sm:text-3xl md:text-4xl"
            style={{ color: "var(--cv-neutral-dark)" }}
          >
            List of{" "}
            <span className="cv-text-gradient">Fake Universities</span> by UGC
            in 2026
          </h1>

          {/* Gradient divider */}
          <div className="cv-divider-gradient mx-auto mt-4 w-16 sm:mt-5 sm:w-20" />

          {/* Description */}
          <p
            className="mx-auto mt-4 max-w-4xl text-center text-sm leading-6 sm:mt-5 sm:text-base sm:leading-7"
            style={{ color: "var(--cv-neutral-mid)" }}
          >
            Before taking admission, check whether a university is legally
            recognised and authorised to award the qualification you need.
            Refer to official UGC notices and applicable regulatory approvals
            to make an informed decision about your education.
          </p>

          {/* Information tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-lg border bg-white/80 px-3 py-2 text-xs font-medium sm:text-sm"
              style={{
                borderColor: "var(--cv-neutral-border)",
                color: "var(--cv-neutral-dark)",
              }}
            >
              <ExternalLink
                size={14}
                style={{ color: "var(--cv-primary)" }}
              />
              Official UGC Reference
            </span>

            <span
              className="inline-flex items-center gap-2 rounded-lg border bg-white/80 px-3 py-2 text-xs font-medium sm:text-sm"
              style={{
                borderColor: "var(--cv-neutral-border)",
                color: "var(--cv-neutral-dark)",
              }}
            >
              <Landmark size={14} style={{ color: "var(--cv-accent)" }} />
              University Verification
            </span>
          </div>
        </div>
      </section>

      {/* UNIVERSITY LIST */}
      <section className="mx-auto w-full max-w-6xl px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-7">
        {/* DESKTOP TABLE */}
        <div
          className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block"
          style={{ borderColor: "var(--cv-neutral-border)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr
                  style={{
                    background: "var(--cv-neutral-light)",
                    color: "var(--cv-neutral-dark)",
                  }}
                >
                  <th
                    className="w-14 border-b border-r px-3 py-3 text-center font-bold"
                    style={{ borderColor: "var(--cv-neutral-border)" }}
                  >
                    S.No
                  </th>

                  <th
                    className="border-b border-r px-3 py-3 font-bold"
                    style={{ borderColor: "var(--cv-neutral-border)" }}
                  >
                    University Name
                  </th>

                  <th
                    className="w-36 border-b border-r px-3 py-3 font-bold"
                    style={{ borderColor: "var(--cv-neutral-border)" }}
                  >
                    State
                  </th>

                  <th
                    className="w-24 border-b px-3 py-3 text-center font-bold"
                    style={{ borderColor: "var(--cv-neutral-border)" }}
                  >
                    Check
                  </th>
                </tr>
              </thead>

              <tbody>
                {universities.map((university, index) => (
                  <tr
                    key={`${university.name}-${index}`}
                    className="transition-colors hover:bg-blue-50/60"
                  >
                    <td
                      className="border-b border-r px-3 py-3 text-center"
                      style={{
                        borderColor: "var(--cv-neutral-light)",
                        color: "var(--cv-neutral-dark)",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td
                      className="border-b border-r px-3 py-3"
                      style={{ borderColor: "var(--cv-neutral-light)" }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{
                            background: "var(--cv-neutral-light)",
                            color: "var(--cv-neutral-mid)",
                          }}
                        >
                          <Landmark size={16} />
                        </span>

                        <span
                          className="min-w-0 flex-1 font-medium"
                          style={{ color: "var(--cv-primary)" }}
                        >
                          {university.name}
                        </span>

                        <span className="shrink-0 rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                          FAKE
                        </span>
                      </div>
                    </td>

                    <td
                      className="border-b border-r px-3 py-3"
                      style={{
                        borderColor: "var(--cv-neutral-light)",
                        color: "var(--cv-neutral-mid)",
                      }}
                    >
                      {university.state}
                    </td>

                    <td
                      className="border-b px-2 py-3 text-center"
                      style={{ borderColor: "var(--cv-neutral-light)" }}
                    >
                      <a
                        href={UGC_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open UGC website to verify ${university.name}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          background: "var(--cv-primary)",
                        }}
                      >
                        Verify
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARD LAYOUT */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {universities.map((university, index) => (
            <article
              key={`${university.name}-${index}`}
              className="min-w-0 overflow-hidden rounded-xl border bg-white p-3 shadow-sm"
              style={{ borderColor: "var(--cv-neutral-border)" }}
            >
              {/* Number, name and status */}
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    background: "var(--cv-primary-light)",
                    color: "var(--cv-primary)",
                  }}
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start gap-2">
                    <h2
                      className="min-w-0 flex-1 break-words text-sm font-semibold leading-5"
                      style={{ color: "var(--cv-primary)" }}
                    >
                      {university.name}
                    </h2>

                    <span className="shrink-0 rounded-md bg-red-500 px-2 py-1 text-[9px] font-bold tracking-wide text-white">
                      FAKE
                    </span>
                  </div>

                  {/* State */}
                  <div
                    className="mt-2 flex min-w-0 items-start gap-1.5 text-xs leading-5"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    <Landmark size={13} className="mt-0.5 shrink-0" />
                    <span className="break-words">{university.state}</span>
                  </div>
                </div>
              </div>

              {/* Verify button */}
              <div
                className="mt-3 border-t pt-3"
                style={{ borderColor: "var(--cv-neutral-light)" }}
              >
                <a
                  href={UGC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open UGC website to verify ${university.name}`}
                  className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ background: "var(--cv-primary)" }}
                >
                  Verify on UGC Website
                  <ExternalLink size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* DISCLAIMER */}
       
      </section>
      <Requesttocallbackhome />
      <Footer />
    </main>
  );
}
