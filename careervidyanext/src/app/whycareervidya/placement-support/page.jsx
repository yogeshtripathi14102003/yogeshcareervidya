// src/app/placement/page.jsx

import Image from "next/image";
import Link from "next/link";

import Header from "@/app/layout/Header.jsx";
import Studentimageslider from "@/app/components/Studentimageslider.jsx";
import TestimonialsSlider from "@/app/components/TestimonialsSlider.jsx";
import Getintuch from "@/app/components/getintuch.jsx";

import { serverFetch } from "@/utlis/serverFetch";

/* =========================================================
   CONFIG
========================================================= */

const SITE_URL = "https://careervidya.in";
const PAGE_URL = `${SITE_URL}/whycareervidya/placement-support`;

/* =========================================================
   SEO
========================================================= */

export const metadata = {
  title: "Placement Assistance & Career Support | CareerVidya",
  description:
    "Get career-focused placement assistance with resume building, mock interviews, soft skills, career guidance, networking and job opportunities at CareerVidya.",
  keywords: [
    "placement assistance",
    "placement support",
    "career support",
    "online degree placement",
    "career guidance",
    "resume building",
    "mock interview",
    "job referrals",
    "hiring partners",
    "CareerVidya placement",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Placement Assistance & Career Support | CareerVidya",
    description:
      "Build career confidence with CareerVidya's placement assistance, interview preparation, resume support and career guidance.",
    url: PAGE_URL,
    siteName: "CareerVidya",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Placement Assistance & Career Support | CareerVidya",
    description:
      "Explore placement assistance, career guidance, interview preparation and job opportunities with CareerVidya.",
  },
  robots: { index: true, follow: true },
};

/* =========================================================
   DATA
========================================================= */

const stats = [
  { number: "15K+", title: "Admissions Done", icon: "graduation" },
  { number: "150+", title: "Academic Partners", icon: "users" },
  { number: "37 LPA+", title: "Highest Salary Package", icon: "rupee" },
  { number: "12K+", title: "Alumni Network", icon: "award" },
];

const services = [
  {
    number: "01",
    icon: "↗",
    title: "Resume Building",
    text: "Create a professional and recruiter-friendly resume that highlights your skills, education and experience.",
  },
  {
    number: "02",
    icon: "◎",
    title: "Mock Interviews",
    text: "Practice interview scenarios and improve your communication, confidence and overall interview readiness.",
  },
  {
    number: "03",
    icon: "✦",
    title: "Career Guidance",
    text: "Understand career paths, professional expectations and opportunities that align with your goals.",
  },
  {
    number: "04",
    icon: "→",
    title: "Job Referrals",
    text: "Explore relevant job opportunities and connect with recruitment opportunities through our career ecosystem.",
  },
];

const journey = [
  { no: "01", title: "Discover", text: "Understand your strengths, interests and career direction." },
  { no: "02", title: "Prepare", text: "Build your resume, communication skills and interview confidence." },
  { no: "03", title: "Connect", text: "Explore professionals, industries and relevant opportunities." },
  { no: "04", title: "Apply", text: "Discover suitable jobs and prepare for recruitment processes." },
];

const faqs = [
  {
    q: "What is placement assistance at CareerVidya?",
    a: "CareerVidya's placement assistance is designed to improve career readiness through resume support, mock interviews, soft-skills development, career guidance, networking and access to relevant job opportunities.",
  },
  {
    q: "Does CareerVidya provide placement assistance for online degree students?",
    a: "CareerVidya provides career and placement assistance to eligible learners through services such as resume preparation, interview support, career guidance and access to relevant opportunities.",
  },
  {
    q: "What services are included in placement assistance?",
    a: "Placement assistance may include professional resume building, mock interviews, soft-skills development, career guidance, networking opportunities and job referrals.",
  },
  {
    q: "Does CareerVidya guarantee a job?",
    a: "CareerVidya's placement assistance focuses on career preparation and connecting learners with relevant opportunities. Final selection and hiring decisions are made by individual employers.",
  },
  {
    q: "How can I connect with CareerVidya for career guidance?",
    a: "You can contact CareerVidya through the contact section on this page to understand the available career and placement support based on your educational and professional goals.",
  },
];

/* =========================================================
   GET COMPANY LOGOS
========================================================= */

async function getLogos() {
  try {
    const res = await serverFetch("/api/v1/ourstudent", {
      next: { revalidate: 300 },
    });

    if (!res?.ok) return [];

    const data = res.data?.data || res.data || [];
    const seen = new Set();

    return data
      .filter((student) => student?.companyLogo)
      .filter((student) => {
        if (seen.has(student.companyLogo)) return false;
        seen.add(student.companyLogo);
        return true;
      })
      .map((student) => ({
        logo: student.companyLogo,
        company: student.company,
      }));
  } catch (error) {
    console.error("Placement logo error:", error);
    return [];
  }
}

/* =========================================================
   IMAGE URL
========================================================= */

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

/* =========================================================
   STRUCTURED DATA
========================================================= */

function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "CareerVidya",
    url: SITE_URL,
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: "Placement Assistance & Career Support | CareerVidya",
    description:
      "CareerVidya placement assistance includes resume support, mock interviews, career guidance, networking and job opportunities.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "CareerVidya",
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Placement", item: PAGE_URL },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}

/* =========================================================
   METRIC ICONS
========================================================= */

function MetricIcon({ type }) {
  if (type === "graduation") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
        <path d="M7 10.5V15c2.8 2.2 7.2 2.2 10 0v-4.5" />
        <path d="M21 8.5V14" />
      </svg>
    );
  }
  if (type === "users") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <path d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 19.5V21" />
        <circle cx="10" cy="8" r="3.5" />
        <path d="M16.5 11a3.5 3.5 0 1 0 0-7" />
        <path d="M17 15a4.5 4.5 0 0 1 3 4.25V21" />
      </svg>
    );
  }
  if (type === "rupee") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <path d="M7 5h10" />
        <path d="M7 9h10" />
        <path d="M9 5c3.5 0 6 1.5 6 4s-2.5 4-6 4h-2l7 6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="8" r="5" />
      <path d="m9 12-1 8 4-2 4 2-1-8" />
    </svg>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ number, title, icon }) {
  return (
    <div className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_14px_32px_rgba(249,115,22,0.15)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_5px_12px_rgba(249,115,22,0.3)] transition-transform duration-300 group-hover:scale-105">
        <MetricIcon type={icon} />
      </div>
      <div className="min-w-0">
        <div className="text-[26px] font-bold leading-none tracking-[-0.5px] text-slate-950">{number}</div>
        <div className="mt-2 text-[14px] font-medium leading-[1.1] text-slate-700">{title}</div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function PlacementPage() {
  const logos = await getLogos();

  return (
    <>
      <StructuredData />
      <Header />

      <main className="overflow-hidden bg-white text-slate-800">
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative overflow-hidden bg-[#07152f]">
          <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-[-160px] right-[-100px] h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
              {/* HERO CONTENT */}
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-orange-200 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Career-focused placement support
                </div>

                <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight text-white sm:text-[40px] lg:text-[52px]">
                  Turn Your Degree
                  <span className="block bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                    Into Career Opportunities
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-300 md:text-base">
                  Get practical career and placement support through resume
                  building, mock interviews, professional guidance, networking
                  and relevant job opportunities.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/explore"
                    className="rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#EA580C]"
                  >
                    Explore Courses →
                  </Link>
                  <Link
                    href="/contactus"
                    className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    Talk to Our Team
                  </Link>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                  {["Resume Support", "Interview Prep", "Career Guidance", "Job Opportunities"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <span className="text-orange-400">✓</span> {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* HERO VISUAL */}
              <div className="relative mx-auto w-full max-w-md lg:ml-auto">
                <div className="absolute inset-0 rounded-[2rem] bg-orange-500/20 blur-3xl" />

                <div className="relative space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-lg text-orange-300">
                        ✦
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">
                          Career Dashboard
                        </p>
                        <h2 className="text-base font-semibold text-white">
                          Your Career Journey
                        </h2>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Career readiness</span>
                        <span className="font-semibold text-orange-300">85%</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#F97316] to-amber-300" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                      <p className="text-2xl font-bold text-white">200+</p>
                      <p className="mt-1 text-[11px] text-slate-400">Hiring Partners</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                      <p className="text-2xl font-bold text-white">37 LPA+</p>
                      <p className="mt-1 text-[11px] text-slate-400">Highest Package</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                    <div className="space-y-2">
                      {["Professional profile", "Interview preparation", "Industry exposure"].map((item, i) => (
                        <div key={item} className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/15 text-[10px] font-semibold text-orange-300">
                            0{i + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-300">{item}</span>
                          <span className="ml-auto text-xs text-emerald-400">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CAREER METRICS
        ====================================================== */}
        <section aria-label="Career metrics" className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <StatCard key={item.title} number={item.number} title={item.title} icon={item.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}
        {/* <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-orange-100/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-3 shadow-xl">
                <div className="rounded-[1.4rem] bg-gradient-to-br from-[#F97316] via-[#EA580C] to-amber-600 p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-orange-100">
                        CareerVidya
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white">
                        Career
                        <br />
                        Readiness
                      </h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl text-white">
                      ↗
                    </div>
                  </div>

                  <div className="mt-8 space-y-2.5">
                    {[
                      "Build your professional profile",
                      "Improve interview confidence",
                      "Understand industry expectations",
                      "Explore career opportunities",
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl bg-white/[0.1] p-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-[10px] font-semibold text-orange-50">
                          {index + 1}
                        </span>
                        <span className="text-xs font-medium text-orange-50">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
                Career Readiness
              </span>

              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-[36px]">
                More Than a Degree.
                <span className="block text-[#F97316]">A Path Toward Your Career.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-base">
                Completing a degree is only one part of your professional
                journey. Building the right profile, communication skills,
                interview confidence and industry awareness can make a
                meaningful difference.
              </p>

              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-base">
                CareerVidya brings these elements together through structured
                career and placement assistance designed to help learners
                prepare for their next professional step.
              </p>

              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {["Career Guidance", "Resume Assistance", "Mock Interviews", "Job Referrals"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#FFF9F5] p-3.5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#F97316]">
                      ✓
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* =====================================================
            CAREER JOURNEY
        ====================================================== */}
        <section className="bg-[#FFF9F5] py-16 md:py-24 lg:py-28" aria-labelledby="career-journey-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
                The Career Journey
              </span>
              <h2
                id="career-journey-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                A Simple Path From Learning to Opportunity
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                Build the right foundation, prepare for the market and approach
                your career journey with greater confidence.
              </p>
            </div>

            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 lg:block" />

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {journey.map((item) => (
                  <article key={item.no} className="group relative">
                    <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-orange-200 bg-white text-xs font-bold text-[#F97316] shadow-sm transition group-hover:border-[#F97316] group-hover:bg-[#F97316] group-hover:text-white">
                      {item.no}
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>

                    <div className="mt-5 h-0.5 w-8 rounded-full bg-[#F97316] transition-all duration-300 group-hover:w-14" />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PLACEMENT SERVICES
        ====================================================== */}
     <section className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-28" aria-labelledby="placement-services-heading">
  {/* Soft background accent */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
    <div className="absolute right-[-120px] top-[10%] h-80 w-80 rounded-full bg-orange-100/40 blur-3xl" />
    <div className="absolute bottom-[10%] left-[-120px] h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* HEADER */}
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
          <span className="h-px w-8 bg-[#F97316]" />
          Placement Support
        </span>
        <h2
          id="placement-services-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
        >
          Everything You Need to Become <span className="text-[#F97316]">Career-Ready</span>
        </h2>
      </div>

   
    </div>

    {/* UNIQUE NUMBERED FLOW */}
    <div className="relative mt-16">
      {/* Vertical connector line (desktop) */}
      <div className="absolute left-[27px] top-3 hidden h-[calc(100%-24px)] w-px bg-gradient-to-b from-orange-200 via-orange-300 to-transparent md:block" />

      <div className="space-y-10 md:space-y-14">
        {services.map((service, index) => (
          <div key={service.number} className="group relative flex items-start gap-6 md:gap-8">
            {/* BIG NUMBER CIRCLE */}
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_4px_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F97316] group-hover:ring-[#F97316]">
              <span className="text-sm font-bold text-[#F97316] transition-colors group-hover:text-white">
                {service.number}
              </span>
              {/* Ping dot */}
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#F97316] opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </div>

            {/* CONTENT */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#F97316] md:text-[22px]">
                  {service.title}
                </h3>
                <span className="hidden text-lg text-[#F97316] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:inline">
                  →
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 md:text-[15px]">
                {service.text}
              </p>

              {/* Accent underline */}
              <div className="mt-4 h-0.5 w-10 rounded-full bg-orange-200 transition-all duration-500 group-hover:w-20 group-hover:bg-[#F97316]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* =====================================================
            FEATURES
        ====================================================== */}
      <section className="bg-[#FFF9F5] py-14 md:py-20">
  <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:space-y-20 lg:px-8">
    {/* FEATURE 1 */}
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="mb-4 inline-flex h-8 items-center rounded-full bg-orange-100 px-3 text-[11px] font-bold tracking-wide text-[#EA580C]">
          01 / INDUSTRY EXPOSURE
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">
          Build Your Network Beyond the Classroom
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
          Professional growth becomes easier when you understand how industries
          work. Networking opportunities can help you interact with
          professionals, understand workplace expectations and expand your
          professional connections.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Professional Networking", "Industry Exposure", "Career Insights"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-orange-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
        <div className="relative h-52 md:h-60">
          <Image
            src="/images/built-network.png"
            alt="CareerVidya industry networking and career support"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-3"
          />
        </div>
      </div>
    </article>

    {/* FEATURE 2 */}
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="order-2 lg:order-1">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
          <div className="relative h-52 md:h-60">
            <Image
              src="/images/knowledge-into-prectical.png"
              alt="CareerVidya practical projects and career development"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-3"
            />
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="mb-4 inline-flex h-8 items-center rounded-full bg-orange-100 px-3 text-[11px] font-bold tracking-wide text-[#EA580C]">
          02 / PRACTICAL EXPERIENCE
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">
          Turn Knowledge Into Practical Experience
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
          Practical projects help learners connect academic concepts with
          real-world challenges while developing skills that can strengthen
          their professional profile.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Live Projects", "Practical Learning", "Skill Development"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-orange-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>

    {/* FEATURE 3 */}
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="mb-4 inline-flex h-8 items-center rounded-full bg-orange-100 px-3 text-[11px] font-bold tracking-wide text-[#EA580C]">
          03 / PERSONALIZED GUIDANCE
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">
          Find a Career Direction That Fits You
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
          Get guidance to better understand possible career directions,
          professional expectations and opportunities based on your interests
          and professional goals.
        </p>
        <Link
          href="/contactus"
          className="mt-5 inline-flex rounded-full bg-[#F97316] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#EA580C]"
        >
          Speak With Our Team →
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
        <div className="relative h-52 md:h-60">
          <Image
            src="/images/find-direction.png"
            alt="CareerVidya personalized career guidance"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-3"
          />
        </div>
      </div>
    </article>
  </div>
</section>
        {/* =====================================================
            HIRING PARTNERS
        ====================================================== */}
        {/* {logos.length > 0 && (
          <section className="bg-white py-16 md:py-24 lg:py-28" aria-labelledby="hiring-partners-heading">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-[1.8rem] border border-orange-100 bg-[#FFF9F5] p-7 shadow-sm md:p-10">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
                      Employer Network
                    </span>
                    <h2
                      id="hiring-partners-heading"
                      className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[34px]"
                    >
                      Companies in Our Hiring Network
                    </h2>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
                      Explore companies represented across our placement and
                      career ecosystem.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#F97316] shadow-sm">
                    200+ Hiring Partners
                  </span>
                </div>

                <div className="relative mt-10 overflow-hidden">
                  <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#FFF9F5] to-transparent" />
                  <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#FFF9F5] to-transparent" />

                  <div className="placement-logo-scroll flex w-max gap-4">
                    {[...logos, ...logos, ...logos].map((logo, index) => (
                      <div
                        key={`${logo.logo}-${index}`}
                        className="group flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md md:w-40"
                      >
                        <Image
                          src={getImageUrl(logo.logo)}
                          alt={logo.company ? `${logo.company} hiring partner` : "CareerVidya hiring partner"}
                          width={150}
                          height={60}
                          className="max-h-10 w-auto object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )} */}

        {/* =====================================================
            WHY CAREERVIDYA
        ====================================================== */}
        <section className="bg-white py-16 md:py-24 lg:py-28" aria-labelledby="why-careervidya-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
                Why CareerVidya
              </span>
              <h2
                id="why-careervidya-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                A Career Support System Built Around You
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                From building your professional profile to preparing for
                opportunities, get support across important stages of your
                career journey.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Professional Resume Support",
                  text: "Present your education, skills and experience through a clear and recruiter-friendly resume.",
                },
                {
                  title: "Interview Preparation",
                  text: "Improve your confidence and approach to interviews through practical preparation.",
                },
                {
                  title: "Career Guidance",
                  text: "Understand possible career directions and professional opportunities aligned with your goals.",
                },
                {
                  title: "Opportunity Access",
                  text: "Discover relevant job postings and opportunities through the placement ecosystem.",
                },
              ].map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-[#FFF9F5] p-6 transition duration-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-[#F97316] shadow-sm">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            TESTIMONIALS
        ====================================================== */}
        <section className="bg-[#FFF9F5] py-16 md:py-24 lg:py-28" aria-labelledby="student-experiences-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
                Student Experiences
              </span>
              <h2
                id="student-experiences-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                Hear From Our Learners
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                Explore learner experiences and placement highlights from the
                CareerVidya ecosystem.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm md:p-7">
              <TestimonialsSlider />
            </div>

          
          </div>
        </section>

        {/* =====================================================
            FAQ
        ====================================================== */}
        <section className="bg-white py-16 md:py-24 lg:py-28" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-[#F97316]">
                Frequently Asked Questions
              </span>
              <h2
                id="faq-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                Placement Support FAQs
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                Common questions about placement assistance and career support.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200 bg-[#FFF9F5] transition open:bg-white open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[10px] font-bold text-[#EA580C]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-slate-900 md:text-base">
                      {faq.q}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-[#F97316] shadow-sm transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[68px]">
                    <p className="text-sm leading-6 text-slate-600">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="relative overflow-hidden bg-[#07152f] py-20">
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
              ✦
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-[40px]">
              Ready to Take the Next Step?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-400 md:text-base">
              Explore career-oriented programs or connect with our team to
              understand the available career and placement support.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#EA580C]"
              >
                Explore Courses →
              </Link>
              <Link
                href="/contactus"
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Career Team
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <Getintuch />

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="bg-[#030b1b] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <h2 className="text-xl font-bold">
                  Career<span className="text-[#F97316]">Vidya</span>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                  Career-focused education, professional development and
                  placement assistance for learners preparing for their next
                  career opportunity.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Explore</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                  <li><Link href="/" className="transition hover:text-white">Home</Link></li>
                  <li><Link href="/explore" className="transition hover:text-white">Online Courses</Link></li>
                  <li><Link href="/placement" className="transition hover:text-white">Placement</Link></li>
                  <li><Link href="/Aboutus" className="transition hover:text-white">About Us</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Support</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                  <li><Link href="/contactus" className="transition hover:text-white">Contact Us</Link></li>
                  <li><Link href="/PrivacyPolicy" className="transition hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/Terms&Conditions" className="transition hover:text-white">Terms & Conditions</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Contact</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-500">
                  <p>H-160, Sector 63,<br />Noida - 201305</p>
                  <a href="mailto:info@careervidya.in" className="block transition hover:text-white">
                    info@careervidya.in
                  </a>
                  <a href="tel:+919289712364" className="block transition hover:text-white">
                    +91 9289712364
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 md:flex-row">
              <p>© {new Date().getFullYear()} CareerVidya. All rights reserved.</p>
              <p>Career-focused education & placement support</p>
            </div>
          </div>
        </footer>
      </main>

      {/* =====================================================
          LOGO ANIMATION
      ====================================================== */}
      <style>{`
        @keyframes placementLogoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
        .placement-logo-scroll {
          animation: placementLogoScroll 32s linear infinite;
          will-change: transform;
        }
        .placement-logo-scroll:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .placement-logo-scroll { animation: none; }
        }
      `}</style>
    </>
  );
}