"use client";

import React from "react";
import Image from "next/image";
import Getintuch from "../components/getintuch";
import Header from "../layout/Header";
import { Target, Heart, Briefcase, ShieldCheck, Users2, TrendingUp, Clock3 } from "lucide-react";
import ContactBanner from "../components/ContactBanner ";
import Footer from "../layout/Footer";
import Counter from "../components/counter/page";

export default function AboutContent() {
  const infoCards = [
    {
      icon: <Target className="w-10 h-10 mb-3" />,
      title: "Our Mission",
      description: "To make quality online and offline education accessible, comparable, and stress-free for every learner in India through clarity, credibility, and commitment.",
    },
    {
      icon: <Heart className="w-10 h-10 mb-3" />,
      title: "Our Values",
      description: "We believe in honesty, transparency, and student-first guidance—ensuring clarity in every educational decision.",
    },
    {
      icon: <Briefcase className="w-10 h-10 mb-3" />,
      title: "What We Do",
      description: "We guide students with verified course data, expert mentorship, and technology-driven comparison tools to simplify career choices.",
    },
  ];

  const trustPoints = [
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Verified Information",
      description: "Every course and university listing is fact-checked, so you always make decisions on accurate data.",
    },
    {
      icon: <Users2 className="w-7 h-7" />,
      title: "Expert Mentorship",
      description: "Our counsellors have guided thousands of students to the right course and career path.",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Career-First Approach",
      description: "We focus on outcomes—placements, growth, and long-term career value, not just admissions.",
    },
    {
      icon: <Clock3 className="w-7 h-7" />,
      title: "Always Available",
      description: "From your first query to graduation, our support team is with you at every step.",
    },
  ];

  return (
    <>
      <Header />

      {/* JSON-LD Structured Data: invisible to UI, helps Google understand the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Career Vidya",
            url: "https://careervidya.in/aboutus",
            mainEntity: {
              "@type": "EducationalOrganization",
              name: "Career Vidya",
              url: "https://careervidya.in",
              logo: "https://careervidya.in/images/logo.png",
              sameAs: [
                "https://www.facebook.com/Career-Vidya",
                "https://www.instagram.com/career_vidya/",
                "https://x.com/CareerVidya",
                "https://youtube.com/@careervidya02",
              ],
            },
          }),
        }}
      />

    {/* Banner Section - Full Image Without Crop */}
<section className="relative w-full bg-white overflow-hidden">
  <Image
    src="/images/office.jpeg"
    alt="Career Vidya team providing professional education guidance"
    width={1920}
    height={700}
    priority
    sizes="100vw"
    className="w-full h-auto object-contain"
  />

  {/* Light overlay for text readability */}
  <div className="absolute inset-0 bg-white/20" />

  {/* Banner Content */}
  <div className="absolute inset-0 flex items-center justify-center">
    {/* <div className="max-w-4xl px-6 text-center">
      <h1 className="text-3xl md:text-5xl font-black text-[#0056B3] uppercase mb-4 drop-shadow-sm">
        About Career Vidya
      </h1>

      <h2 className="text-base md:text-xl font-medium text-slate-800 italic drop-shadow-sm">
        Transforming ideas into impactful digital learning solutions with
        trust, innovation, and excellence.
      </h2>
    </div> */}
  </div>
</section>

      <Counter />

      <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {infoCards.map((card, index) => (
              <div
                key={index}
                className="group p-6 border border-blue-200 rounded-2xl bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-[#0056A4] group-hover:text-[#FF7A00] transition-colors duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#0056A4] mb-2">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Students Trust Us */}
        <section className="mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-bold tracking-widest text-[#FF7A00] uppercase mb-2">
                Why Career Vidya
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#0056A4]">
                Why Students Trust Us
              </h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Thousands of students rely on us every year to make one of the most important decisions of their lives.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0056A4] to-[#0077CC] text-white flex items-center justify-center mb-4">
                    {point.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#0056A4] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <ContactBanner />
          <Getintuch />
        </section>
      </main>

      <Footer />
    </>
  );
}