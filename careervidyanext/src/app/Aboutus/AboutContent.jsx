"use client";

import React from "react";
import Link from "next/link";
import Getintuch from "../components/getintuch";
import Header from  "../layout/Header";
import { Target, Heart, Briefcase } from "lucide-react";
import ContactBanner from "../components/ContactBanner ";
import  Footer from "../layout/Footer";
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

  return (
    <>
      <Header />

      {/* Banner Section */}
      <section className="relative w-full md:h-[60vh] h-[40vh] bg-white overflow-hidden">
        <img
          src="/images/office.webp"
          alt="Career Vidya team providing professional education guidance"
          className="w-full h-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-[#0056B3] uppercase mb-4">
              About Career Vidya
            </h1>
            <h2 className="text-lg md:text-xl font-medium text-slate-800 italic">
              Transforming ideas into impactful digital learning solutions with trust, innovation, and excellence.
            </h2>
          </div>
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

        <section className="mt-16">
          <ContactBanner />
          <Getintuch />
        </section>
      </main>

      <Footer />
    </>
  );
}