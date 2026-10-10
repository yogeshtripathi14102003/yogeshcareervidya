// "use client";

// import React from "react";
// import Image from "next/image";
// import Getintuch from "../components/getintuch";
// import Header from "../layout/Header";
// import { Target, Heart, Briefcase, ShieldCheck, Users2, TrendingUp, Clock3 } from "lucide-react";
// import ContactBanner from "../components/ContactBanner ";
// import Footer from "../layout/Footer";
// import Counter from "../components/counter/page";

// export default function AboutContent() {
//   const infoCards = [
//     {
//       icon: <Target className="w-10 h-10 mb-3" />,
//       title: "Our Mission",
//       description: "To make quality online and offline education accessible, comparable, and stress-free for every learner in India through clarity, credibility, and commitment.",
//     },
//     {
//       icon: <Heart className="w-10 h-10 mb-3" />,
//       title: "Our Values",
//       description: "We believe in honesty, transparency, and student-first guidance—ensuring clarity in every educational decision.",
//     },
//     {
//       icon: <Briefcase className="w-10 h-10 mb-3" />,
//       title: "What We Do",
//       description: "We guide students with verified course data, expert mentorship, and technology-driven comparison tools to simplify career choices.",
//     },
//   ];

//   const trustPoints = [
//     {
//       icon: <ShieldCheck className="w-7 h-7" />,
//       title: "Verified Information",
//       description: "Every course and university listing is fact-checked, so you always make decisions on accurate data.",
//     },
//     {
//       icon: <Users2 className="w-7 h-7" />,
//       title: "Expert Mentorship",
//       description: "Our counsellors have guided thousands of students to the right course and career path.",
//     },
//     {
//       icon: <TrendingUp className="w-7 h-7" />,
//       title: "Career-First Approach",
//       description: "We focus on outcomes—placements, growth, and long-term career value, not just admissions.",
//     },
//     {
//       icon: <Clock3 className="w-7 h-7" />,
//       title: "Always Available",
//       description: "From your first query to graduation, our support team is with you at every step.",
//     },
//   ];

//   return (
//     <>
//       <Header />

//       {/* JSON-LD Structured Data: invisible to UI, helps Google understand the page */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "AboutPage",
//             name: "About Career Vidya",
//             url: "https://careervidya.in/aboutus",
//             mainEntity: {
//               "@type": "EducationalOrganization",
//               name: "Career Vidya",
//               url: "https://careervidya.in",
//               logo: "https://careervidya.in/images/logo.png",
//               sameAs: [
//                 "https://www.facebook.com/Career-Vidya",
//                 "https://www.instagram.com/career_vidya/",
//                 "https://x.com/CareerVidya",
//                 "https://youtube.com/@careervidya02",
//               ],
//             },
//           }),
//         }}
//       />

//       {/* Banner Section */}
//       <section className="relative w-full md:h-[60vh] h-[40vh] bg-white overflow-hidden">
//         <Image
//           src="/images/offce.png"
//           alt="Career Vidya team providing professional education guidance"
//           fill
//           priority
//           sizes="100vw"
//           className="object-cover object-center opacity-50"
//         />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="max-w-3xl px-6 text-center">
//             <h1 className="text-3xl md:text-5xl font-black text-[#0056B3] uppercase mb-4">
//               About Career Vidya
//             </h1>
//             <h2 className="text-lg md:text-xl font-medium text-slate-800 italic">
//               Transforming ideas into impactful digital learning solutions with trust, innovation, and excellence.
//             </h2>
//           </div>
//         </div>
//       </section>

//       <Counter />

//       <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-6xl">
//           <div className="grid md:grid-cols-3 gap-8">
//             {infoCards.map((card, index) => (
//               <div
//                 key={index}
//                 className="group p-6 border border-blue-200 rounded-2xl bg-white hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className="text-[#0056A4] group-hover:text-[#FF7A00] transition-colors duration-300">
//                     {card.icon}
//                   </div>
//                   <h3 className="text-xl font-semibold text-[#0056A4] mb-2">{card.title}</h3>
//                   <p className="text-gray-600 leading-relaxed">{card.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Why Students Trust Us */}
//         <section className="mt-20">
//           <div className="mx-auto max-w-6xl">
//             <div className="text-center max-w-2xl mx-auto mb-12">
//               <span className="inline-block text-xs font-bold tracking-widest text-[#FF7A00] uppercase mb-2">
//                 Why Career Vidya
//               </span>
//               <h2 className="text-2xl md:text-4xl font-extrabold text-[#0056A4]">
//                 Why Students Trust Us
//               </h2>
//               <p className="text-gray-500 mt-3 leading-relaxed">
//                 Thousands of students rely on us every year to make one of the most important decisions of their lives.
//               </p>
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {trustPoints.map((point, index) => (
//                 <div
//                   key={index}
//                   className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
//                 >
//                   <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0056A4] to-[#0077CC] text-white flex items-center justify-center mb-4">
//                     {point.icon}
//                   </div>
//                   <h3 className="text-base font-bold text-[#0056A4] mb-2">
//                     {point.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {point.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="mt-16">
//           <ContactBanner />
//           <Getintuch />
//         </section>
//       </main>

//       <Footer />
//     </>
//   );
// }


"use client";

import React from "react";
import Getintuch from "../components/getintuch";
import Header from "../layout/Header";
import {
  Target,
  Heart,
  Briefcase,
  ShieldCheck,
  Users2,
  TrendingUp,
  Clock3,
} from "lucide-react";
import ContactBanner from "../components/ContactBanner ";
import Footer from "../layout/Footer";
import Counter from "../components/counter/page";

export default function AboutContent() {
  const infoCards = [
    {
      icon: <Target className="w-10 h-10" />,
      title: "Our Mission",
      description:
        "To make quality online and offline education accessible, comparable, and stress-free for every learner in India through clarity, credibility, and commitment.",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Our Values",
      description:
        "We believe in honesty, transparency, and student-first guidance—ensuring clarity in every educational decision.",
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: "What We Do",
      description:
        "We guide students with verified course data, expert mentorship, and technology-driven comparison tools to simplify career choices.",
    },
  ];

  const trustPoints = [
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Verified Information",
      description:
        "Every course and university listing is fact-checked, so you always make decisions on accurate data.",
    },
    {
      icon: <Users2 className="w-7 h-7" />,
      title: "Expert Mentorship",
      description:
        "Our counsellors have guided thousands of students to the right course and career path.",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Career-First Approach",
      description:
        "We focus on outcomes—placements, growth, and long-term career value, not just admissions.",
    },
    {
      icon: <Clock3 className="w-7 h-7" />,
      title: "Always Available",
      description:
        "From your first query to graduation, our support team is with you at every step.",
    },
  ];

  return (
    <>
      <Header />

      {/* SEO Structured Data */}
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

      {/* Hero Section */}
      <section className="relative isolate flex min-h-[200px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-white to-[#FFF7ED] sm:min-h-[230px] md:min-h-[260px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl sm:h-56 sm:w-56"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-orange-200/40 blur-3xl sm:h-60 sm:w-60"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-7 text-center sm:px-6 sm:py-9 md:py-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold tracking-wider text-[#1E40AF] shadow-sm backdrop-blur-sm sm:px-4 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#F97316]" />
            ABOUT CAREER VIDYA
          </span>

          <h1 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[#1E3A8A] sm:text-3xl md:text-4xl lg:text-5xl">
            About Career Vidya
          </h1>

          <p className="mx-auto max-w-3xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Transforming ideas into impactful digital learning solutions with
            trust, innovation, and excellence.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#F97316] sm:w-20"
          />
        </div>
      </section>

      {/* Counter Section */}
      <section className="w-full py-2 sm:py-3">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Counter />
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full bg-gray-50 px-4 py-7 sm:px-6 sm:py-9">
        <div className="mx-auto w-full max-w-7xl">
          {/* Mission, Values and What We Do */}
          <section aria-label="About Career Vidya" className="w-full">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {infoCards.map((card) => (
                <article
                  key={card.title}
                  className="group flex h-full w-full rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  <div className="flex w-full flex-col items-center text-center">
                    <div className="mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF] transition-colors duration-300 group-hover:bg-orange-50 group-hover:text-[#F97316] sm:h-16 sm:w-16">
                      {React.cloneElement(card.icon, {
                        className: "h-8 w-8 sm:h-9 sm:w-9",
                      })}
                    </div>

                    <h2 className="mb-2 text-lg font-bold text-[#1E3A8A] sm:text-xl">
                      {card.title}
                    </h2>

                    <p className="text-sm leading-6 text-slate-600 sm:leading-7">
                      {card.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Why Students Trust Us */}
          <section className="mt-10 w-full sm:mt-12">
            <div className="mx-auto mb-6 w-full text-center sm:mb-8">
              <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#F97316] sm:text-sm">
                Why Career Vidya
              </span>

              <h2 className="text-2xl font-extrabold leading-tight text-[#1E3A8A] sm:text-3xl md:text-4xl">
                Why Students Trust Us
              </h2>

              <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Thousands of students rely on us every year to make one of the
                most important decisions of their lives.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustPoints.map((point) => (
                <article
                  key={point.title}
                  className="group w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg sm:p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-sm transition-all duration-300 group-hover:from-[#1E40AF] group-hover:to-[#F97316] sm:h-14 sm:w-14">
                    {point.icon}
                  </div>

                  <h3 className="mb-2 text-base font-bold text-[#1E3A8A] sm:text-lg">
                    {point.title}
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {point.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Contact Sections */}
          <section className="mt-8 w-full space-y-6 sm:mt-10 sm:space-y-7">
            <ContactBanner />
            <Getintuch />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
