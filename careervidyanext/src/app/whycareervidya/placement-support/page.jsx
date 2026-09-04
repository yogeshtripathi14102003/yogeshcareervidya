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

  alternates: {
    canonical: PAGE_URL,
  },

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

  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   DATA
========================================================= */

const stats = [
  {
    number: "15K+",
    title: "Admissions Done",
    icon: "graduation",
  },
  {
    number: "150+",
    title: "Academic Partners",
    icon: "users",
  },
  {
    number: "37 LPA+",
    title: "Highest Salary Package",
    icon: "rupee",
  },
  {
    number: "12K+",
    title: "Alumni Network",
    icon: "award",
  },
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
  {
    no: "01",
    title: "Discover",
    text: "Understand your strengths, interests and career direction.",
  },
  {
    no: "02",
    title: "Prepare",
    text: "Build your resume, communication skills and interview confidence.",
  },
  {
    no: "03",
    title: "Connect",
    text: "Explore professionals, industries and relevant opportunities.",
  },
  {
    no: "04",
    title: "Apply",
    text: "Discover suitable jobs and prepare for recruitment processes.",
  },
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
      next: {
        revalidate: 300,
      },
    });

    if (!res?.ok) return [];

    const data = res.data?.data || res.data || [];

    const seen = new Set();

    return data
      .filter((student) => student?.companyLogo)
      .filter((student) => {
        if (seen.has(student.companyLogo)) {
          return false;
        }

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

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

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
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Placement",
        item: PAGE_URL,
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpage),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faq),
        }}
      />
    </>
  );
}

/* =========================================================
   CAREER METRIC ICONS
========================================================= */

function MetricIcon({ type }) {
  if (type === "graduation") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
        <path d="M7 10.5V15c2.8 2.2 7.2 2.2 10 0v-4.5" />
        <path d="M21 8.5V14" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 19.5V21" />
        <circle cx="10" cy="8" r="3.5" />
        <path d="M16.5 11a3.5 3.5 0 1 0 0-7" />
        <path d="M17 15a4.5 4.5 0 0 1 3 4.25V21" />
      </svg>
    );
  }

  if (type === "rupee") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M7 5h10" />
        <path d="M7 9h10" />
        <path d="M9 5c3.5 0 6 1.5 6 4s-2.5 4-6 4h-2l7 6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="m9 12-1 8 4-2 4 2-1-8" />
    </svg>
  );
}

/* =========================================================
   COMPACT CAREER METRIC CARD
========================================================= */

function StatCard({ number, title, icon }) {
  return (
    <div
      className="
        group
        flex
        min-h-[92px]
        items-center
        gap-4
        rounded-[16px]
        border
        border-slate-100
        bg-white
        px-5
        py-4
        shadow-[0_8px_24px_rgba(15,23,42,0.08)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-100
        hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]
      "
    >
      {/* BLUE ICON */}

      <div
        className="
          flex
          h-[56px]
          w-[56px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#0568c9]
          text-white
          shadow-[0_5px_12px_rgba(5,104,201,0.25)]
          transition-transform
          duration-300
          group-hover:scale-105
        "
      >
        <MetricIcon type={icon} />
      </div>

      {/* TEXT */}

      <div className="min-w-0">
        <div
          className="
            text-[26px]
            font-bold
            leading-none
            tracking-[-0.5px]
            text-slate-950
          "
        >
          {number}
        </div>

        <div
          className="
            mt-2
            text-[14px]
            font-medium
            leading-[1.1]
            text-slate-700
          "
        >
          {title}
        </div>
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
            BREADCRUMB
        ====================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="border-b border-slate-100 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 transition hover:text-blue-600"
                >
                  Home
                </Link>
              </li>

              <li className="text-slate-300">/</li>

              <li className="font-medium text-slate-600">
                Placement Support
              </li>
            </ol>
          </div>
        </nav>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#07152f]">
          <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute bottom-[-160px] right-[-100px] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-6 md:py-14 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
              {/* HERO CONTENT */}

              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-blue-200 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  Career-focused placement support
                </div>

                <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight text-white sm:text-[40px] lg:text-[46px]">
                  Turn Your Degree
                  <span className="block bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                    Into Career Opportunities
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-[15px] leading-6 text-slate-300 md:text-base">
                  Get practical career and placement support
                  through resume building, mock interviews,
                  professional guidance, networking and relevant
                  job opportunities.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/explore"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Explore Courses →
                  </Link>

                  <Link
                    href="/contactus"
                    className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    Talk to Our Team
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                  <span>✓ Resume Support</span>
                  <span>✓ Interview Preparation</span>
                  <span>✓ Career Guidance</span>
                  <span>✓ Job Opportunities</span>
                </div>
              </div>

              {/* HERO DASHBOARD */}

              <div className="relative mx-auto w-full max-w-md lg:ml-auto">
                <div className="absolute inset-0 rounded-[2rem] bg-blue-500/20 blur-3xl" />

                <div className="relative rounded-[1.7rem] border border-white/10 bg-white/[0.07] p-2.5 backdrop-blur-xl">
                  <div className="rounded-[1.3rem] bg-[#091936] p-5 shadow-2xl md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
                          Career Dashboard
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-white">
                          Your Career Journey
                        </h2>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                        ✦
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">
                          Career readiness
                        </span>

                        <span className="font-semibold text-blue-300">
                          85%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      {[
                        "Professional profile",
                        "Interview preparation",
                        "Industry exposure",
                        "Career opportunities",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.035] p-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-[10px] font-semibold text-blue-300">
                            0{index + 1}
                          </span>

                          <span className="text-xs font-medium text-slate-300">
                            {item}
                          </span>

                          <span className="ml-auto text-xs text-emerald-400">
                            ✓
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-blue-500/10 p-3">
                        <p className="text-xl font-bold text-white">
                          200+
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Hiring Partners
                        </p>
                      </div>

                      <div className="rounded-xl bg-indigo-500/10 p-3">
                        <p className="text-xl font-bold text-white">
                          37 LPA+
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Highest Package
                        </p>
                      </div>
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

        <section
          aria-label="Career metrics"
          className="relative z-20 -mt-6 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <StatCard
                  key={item.title}
                  number={item.number}
                  title={item.title}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-blue-100/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-3 shadow-xl">
                <div className="rounded-[1.4rem] bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-200">
                        CareerVidya
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-white">
                        Career
                        <br />
                        Readiness
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl text-white">
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
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl bg-white/[0.08] p-3"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-[10px] font-semibold text-blue-100">
                          {index + 1}
                        </span>

                        <span className="text-xs font-medium text-blue-50">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                Career Readiness
              </span>

              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-[36px]">
                More Than a Degree.
                <span className="block text-blue-700">
                  A Path Toward Your Career.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-base">
                Completing a degree is only one part of your
                professional journey. Building the right profile,
                communication skills, interview confidence and
                industry awareness can make a meaningful
                difference.
              </p>

              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-base">
                CareerVidya brings these elements together through
                structured career and placement assistance designed
                to help learners prepare for their next professional
                step.
              </p>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Career Guidance",
                  "Resume Assistance",
                  "Mock Interviews",
                  "Job Referrals",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      ✓
                    </span>

                    <span className="text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CAREER JOURNEY
        ====================================================== */}

        <section
          className="bg-[#f6f9fd] py-20 md:py-24"
          aria-labelledby="career-journey-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                The Career Journey
              </span>

              <h2
                id="career-journey-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                A Simple Path From Learning to Opportunity
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                Build the right foundation, prepare for the market
                and approach your career journey with greater
                confidence.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {journey.map((item, index) => (
                <article
                  key={item.no}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700">
                      {item.no}
                    </span>

                    {index !== journey.length - 1 && (
                      <span className="hidden text-slate-300 lg:block">
                        →
                      </span>
                    )}
                  </div>

                  <h3 className="mt-7 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>

                  <div className="mt-6 h-0.5 w-8 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-14" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PLACEMENT SERVICES
        ====================================================== */}

        <section
          className="bg-[#07152f] py-20 md:py-24"
          aria-labelledby="placement-services-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-400">
                  Placement Support
                </span>

                <h2
                  id="placement-services-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-white md:text-[36px]"
                >
                  Everything You Need to Become Career-Ready
                </h2>
              </div>

              <p className="max-w-md text-[15px] leading-7 text-slate-400">
                Practical career support focused on building your
                profile, confidence and access to relevant
                opportunities.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.number}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.07] md:p-7"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition duration-500 group-hover:scale-150" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-300">
                        {service.number}
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-300">
                        {service.icon}
                      </span>
                    </div>

                    <h3 className="mt-8 text-xl font-semibold text-white">
                      {service.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                      {service.text}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-300">
                      Career support

                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
            {/* FEATURE 1 */}

            <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="mb-5 inline-flex h-9 items-center rounded-full bg-blue-50 px-3 text-xs font-bold text-blue-700">
                  01 / INDUSTRY EXPOSURE
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-[34px]">
                  Build Your Network Beyond the Classroom
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                  Professional growth becomes easier when you
                  understand how industries work. Networking
                  opportunities can help you interact with
                  professionals, understand workplace expectations
                  and expand your professional connections.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Professional Networking",
                    "Industry Exposure",
                    "Career Insights",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-blue-100/50 blur-xl" />

                <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-slate-50 p-4 shadow-lg">
                  <div className="relative h-64 md:h-72">
                    <Image
                      src="/images/freebu.png"
                      alt="CareerVidya industry networking and career support"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* FEATURE 2 */}

            <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className="order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-slate-50 p-4 shadow-lg">
                  <div className="relative h-64 md:h-72">
                    <Image
                      src="/images/networking.jpg"
                      alt="CareerVidya practical projects and career development"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="mb-5 inline-flex h-9 items-center rounded-full bg-blue-50 px-3 text-xs font-bold text-blue-700">
                  02 / PRACTICAL EXPERIENCE
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-[34px]">
                  Turn Knowledge Into Practical Experience
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                  Practical projects help learners connect academic
                  concepts with real-world challenges while
                  developing skills that can strengthen their
                  professional profile.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Live Projects",
                    "Practical Learning",
                    "Skill Development",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* FEATURE 3 */}

            <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="mb-5 inline-flex h-9 items-center rounded-full bg-blue-50 px-3 text-xs font-bold text-blue-700">
                  03 / PERSONALIZED GUIDANCE
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-[34px]">
                  Find a Career Direction That Fits You
                </h2>

                <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                  Get guidance to better understand possible career
                  directions, professional expectations and
                  opportunities based on your interests and
                  professional goals.
                </p>

                <Link
                  href="/contactus"
                  className="mt-6 inline-flex rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-800"
                >
                  Speak With Our Team →
                </Link>
              </div>

              <div>
                <div className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-slate-50 p-4 shadow-lg">
                  <div className="relative h-64 md:h-72">
                    <Image
                      src="/images/i5.jpeg"
                      alt="CareerVidya personalized career guidance"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* =====================================================
            HIRING PARTNERS
        ====================================================== */}

        {logos.length > 0 && (
          <section
            className="bg-[#f6f9fd] py-20 md:py-24"
            aria-labelledby="hiring-partners-heading"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-[1.8rem] border border-slate-200 bg-white p-7 shadow-sm md:p-10">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                      Employer Network
                    </span>

                    <h2
                      id="hiring-partners-heading"
                      className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[34px]"
                    >
                      Companies in Our Hiring Network
                    </h2>

                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
                      Explore companies represented across our
                      placement and career ecosystem.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                    200+ Hiring Partners
                  </span>
                </div>

                <div className="relative mt-10 overflow-hidden">
                  <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />

                  <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

                  <div className="placement-logo-scroll flex w-max gap-4">
                    {[...logos, ...logos, ...logos].map(
                      (logo, index) => (
                        <div
                          key={`${logo.logo}-${index}`}
                          className="group flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md md:w-40"
                        >
                          <Image
                            src={getImageUrl(logo.logo)}
                            alt={
                              logo.company
                                ? `${logo.company} hiring partner`
                                : "CareerVidya hiring partner"
                            }
                            width={150}
                            height={60}
                            className="max-h-10 w-auto object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                            unoptimized
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            WHY CAREERVIDYA
        ====================================================== */}

        <section
          className="bg-white py-20 md:py-24"
          aria-labelledby="why-careervidya-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                Why CareerVidya
              </span>

              <h2
                id="why-careervidya-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                A Career Support System Built Around You
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-slate-600 md:text-base">
                From building your professional profile to
                preparing for opportunities, get support across
                important stages of your career journey.
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
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-blue-700 shadow-sm">
                      0{index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>
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

        <section
          className="bg-[#f6f9fd] py-20 md:py-24"
          aria-labelledby="student-experiences-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                Student Experiences
              </span>

              <h2
                id="student-experiences-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                Hear From Our Learners
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                Explore learner experiences and placement
                highlights from the CareerVidya ecosystem.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm md:p-7">
              <TestimonialsSlider />
            </div>

            <div className="mt-16">
              <div className="mx-auto mb-8 max-w-xl text-center">
                <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                  Placement Highlights
                </span>

                <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-[34px]">
                  Real Career Milestones
                </h2>
              </div>

              <div className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-sm md:p-7">
                <Studentimageslider />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ
        ====================================================== */}

        <section
          className="bg-white py-20 md:py-24"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
                Frequently Asked Questions
              </span>

              <h2
                id="faq-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-[36px]"
              >
                Placement Support FAQs
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-slate-600">
                Common questions about placement assistance and
                career support.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 transition open:bg-white open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1 text-sm font-semibold text-slate-900 md:text-base">
                      {faq.q}
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-blue-700 shadow-sm transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="px-5 pb-5 pl-[68px]">
                    <p className="text-sm leading-6 text-slate-600">
                      {faq.a}
                    </p>
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
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
              ✦
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-[40px]">
              Ready to Take the Next Step?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-400 md:text-base">
              Explore career-oriented programs or connect with
              our team to understand the available career and
              placement support.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
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
                  Career
                  <span className="text-blue-500">
                    Vidya
                  </span>
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                  Career-focused education, professional
                  development and placement assistance for learners
                  preparing for their next career opportunity.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Explore
                </h3>

                <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                  <li>
                    <Link
                      href="/"
                      className="transition hover:text-white"
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/explore"
                      className="transition hover:text-white"
                    >
                      Online Courses
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/placement"
                      className="transition hover:text-white"
                    >
                      Placement
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/Aboutus"
                      className="transition hover:text-white"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Support
                </h3>

                <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                  <li>
                    <Link
                      href="/contactus"
                      className="transition hover:text-white"
                    >
                      Contact Us
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/PrivacyPolicy"
                      className="transition hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/Terms&Conditions"
                      className="transition hover:text-white"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Contact
                </h3>

                <div className="mt-4 space-y-3 text-sm text-slate-500">
                  <p>
                    H-160, Sector 63,
                    <br />
                    Noida - 201305
                  </p>

                  <a
                    href="mailto:info@careervidya.in"
                    className="block transition hover:text-white"
                  >
                    info@careervidya.in
                  </a>

                  <a
                    href="tel:+919289712364"
                    className="block transition hover:text-white"
                  >
                    +91 9289712364
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 md:flex-row">
              <p>
                © {new Date().getFullYear()} CareerVidya. All
                rights reserved.
              </p>

              <p>
                Career-focused education & placement support
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* =====================================================
          LOGO ANIMATION
      ====================================================== */}

      <style>{`
        @keyframes placementLogoScroll {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-33.333333%);
          }
        }

        .placement-logo-scroll {
          animation: placementLogoScroll 32s linear infinite;
          will-change: transform;
        }

        .placement-logo-scroll:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .placement-logo-scroll {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}