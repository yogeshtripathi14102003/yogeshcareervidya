"use client";

import React from "react";
import Link from "next/link";
import Getintuch from "../components/getintuch";
import Header from  "../layout/Header";
import { Target, Heart, Briefcase } from "lucide-react";
import ContactBanner from "../components/ContactBanner ";
import  Footer from "../layout/Footer";
 import Counter from "../components/counter/page";

export default function AboutUs() {
  const infoCards = [
    {
      icon: <Target className="w-10 h-10 mb-3" />,
      title: "Our Mission",
      description:
        "To make quality online and offline education accessible, comparable, and stress-free for every learner in India through clarity, credibility, and commitment.",
    },
    {
      icon: <Heart className="w-10 h-10 mb-3" />,
      title: "Our Values",
      description:
        "We believe in honesty, transparency, and student-first guidance—ensuring clarity in every educational decision.",
    },
    {
      icon: <Briefcase className="w-10 h-10 mb-3" />,
      title: "What We Do",
      description:
        "We guide students with verified course data, expert mentorship, and technology-driven comparison tools to simplify career choices.",
    },
  ];

  return (
    <>
      {/* Header */}
      <Header />

      {/* Banner Section */}
<div className="relative overflow-hidden w-auto md:h-[60vh] h-[40vh] bg-white">
  {/* Background Image - Kaafi halki rakhi hai taaki dark text clear ho */}
  <img
    src="/images/office.webp"
    alt="About Us Banner"
    className="w-full h-full object-cover object-center opacity-30" 
  />

  {/* Text Overlay */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="max-w-3xl px-6 text-center">
      {/* text-slate-900 (dark navy blue style) use kiya hai */}
      <h6 className="text-slate-900 text-xl md:text-3xl font-medium leading-relaxed tracking-tight">
        We are a team of creative thinkers and problem solvers, driven by passion and teamwork. 
        Together, we transform ideas into impactful digital learning solutions, 
        delivering quality education with trust, innovation, and excellence.
      </h6>
    </div>
  </div>
</div>
      {/* Counter Section */}
      <Counter />

      {/* Main Section */}
      <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {infoCards.map((card, index) => (
              <div
                key={index}
                className="group p-6 border border-blue-200 rounded-2xl 
                           bg-gradient-to-br from-[#ffffff] to-[#eef6ff]
                           hover:shadow-2xl hover:-translate-y-1
                           hover:bg-gradient-to-tr hover:from-[#FF7A00]/20 hover:via-white hover:to-[#0056A4]/20
                           transition-all duration-500 ease-in-out"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-[#0056A4] group-hover:text-[#FF7A00] transition-colors duration-300">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0056A4] mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Banner + Get in Touch */}
        <div className="mt-16">
          <ContactBanner />
          <Getintuch />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
