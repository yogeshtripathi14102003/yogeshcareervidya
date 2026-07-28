"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Bot,
  Award,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Services Data
const SERVICES = [
  {
    id: "counselling",
    title: " Career Counselling",
    icon: GraduationCap,
    badge: "Students & Freshers",
    heading: "Expert Career Guidance for Students & Freshers",
    desc: "Unsure about which stream or college to choose? Get personalized 1-on-1 sessions with top industry mentors and clear all your doubts with complete clarity.",
    ctaText: "Book Free Session",
    ctaHref: "/counselling",
  },
  {
    id: "ai-test",
    title: "AI Career Assessment",
    icon: Bot,
    badge: "Fast Assessment",
    heading: "Discover Your Ideal Career Path in 2 Minutes",
    desc: "Our AI-powered assessment analyzes your strengths, interests, and skill gaps to recommend the highest-growth career paths tailored specifically for you.",
    ctaText: "Start AI Test",
    ctaHref: "http://localhost:3001/candidate/auth/login",
  },
  {
    id: "resume",
    title: "ATS Resume Builder",
    icon: Briefcase,
    badge: "Job Seekers",
    heading: "Create Job-Ready Resumes That Get Shortlisted",
    desc: "Stand out to top recruiters with ATS-optimized templates, smart content suggestions, and instant feedback to fast-track your job applications.",
    ctaText: "Build Resume Now",
    ctaHref: "http://localhost:3001/candidate/auth/login",
  },
  {
    id: "universities",
    title: "Top Universities",
    icon: Building2,
    badge: "Institution Finder",
    heading: "Compare & Apply to 1,500+ Top Institutions",
    desc: "Explore detailed rankings, fee structures, placement reports, and authentic student reviews to pick the perfect university with full confidence.",
    ctaText: "Explore Universities",
    ctaHref: "/topunivers",
  },
  {
    id: "scholarships",
    title: "Scholarships & Aid",
    icon: Award,
    badge: "Financial Aid",
    heading: "Unlock Exclusive Partner Scholarships",
    desc: "Save on tuition fees. Explore merit-based and need-based financial aid options specially curated to support your academic journey.",
    ctaText: "Find Scholarships",
    ctaHref: "/scholarships",
  },
];

// Stats Data
const STATS = [
  {
    num: "1,00,000+",
    label: "Students Guided",
  },
  {
    num: "1,500+",
    label: "Partner Universities",
  },
  {
    num: "12K+",
    label: "Alumni Network",
  },
];

export default function FeaturedServicesBanner() {
  const [activeTab, setActiveTab] = useState(SERVICES[0]);

  return (
    <section className="w-full bg-[#FAF9F6] py-12 sm:py-16 lg:py-20 font-sans text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8 lg:p-12">

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">

            {/* ================= LEFT COLUMN ================= */}
            <div className="flex flex-col gap-3 lg:col-span-5">

              {/* Section Label */}
              <span className="mb-1 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Select your path
              </span>

              {/* Service Buttons */}
              {SERVICES.map((service) => {
                const Icon = service.icon;
                const isActive = activeTab.id === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveTab(service)}
                    className={`
                      flex w-full cursor-pointer items-center gap-4
                      rounded-xl border px-4 py-3
                      text-left transition-all duration-200
                      sm:px-5
                      ${
                        isActive
                          ? "border-[#C85103] bg-[#C85103] text-white shadow-md -translate-y-0.5"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        flex shrink-0 items-center justify-center
                        rounded-xl p-1.5 transition-colors
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "border border-orange-100 bg-orange-50 text-[#C85103]"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Title */}
                    <span className="text-sm font-bold tracking-tight sm:text-base">
                      {service.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="flex h-full flex-col justify-between space-y-8 lg:col-span-7 lg:pl-4">

              {/* Content */}
              <div className="space-y-5">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200/60 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#C85103]">
                  <CheckCircle2 className="h-3.5 w-3.5 !text-[#C85103]" />

                  <span>{activeTab.badge}</span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {activeTab.heading}
                </h2>

                {/* Description */}
                <p className="max-w-xl text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
                  {activeTab.desc}
                </p>

                {/* CTA */}
                <div className="pt-3">

                  <a
                    href={activeTab.ctaHref}
                    className="
                      inline-flex items-center gap-1.5
                      rounded-xl
                      bg-[#C85103]
                      px-6 py-2.5
                      text-sm font-bold tracking-wide
                      !text-white
                      shadow-md
                      transition-all duration-200
                      hover:bg-[#b04502]
                      hover:shadow-lg
                      active:scale-[0.98]
                    "
                  >
                    <span className="!text-white">
                      {activeTab.ctaText}
                    </span>

                    <ArrowRight className="h-4 w-4 !text-white" />
                  </a>

                </div>
              </div>

              {/* ================= STATS ================= */}
              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6 sm:gap-6 sm:pt-8">

                {STATS.map((stat, i) => (
                  <div key={i} className="space-y-1">

                    <div className="text-lg font-black tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                      {stat.num}
                    </div>

                    <div className="text-[10px] font-medium leading-normal text-slate-500 sm:text-xs">
                      {stat.label}
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}