"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  X,
} from "lucide-react";
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";
import Siginup from "@/app/signup/Siginup.jsx";

export default function CareerFinderPage() {
  // --- Form Modal Open/Close State ---
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login status on page mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Open Form Handler
  const handleOpenSignup = () => {
    setIsSignupOpen(true);
  };

  // Close Form Handler (Direct & Force Close)
  const handleCloseSignup = () => {
    setIsSignupOpen(false);
  };

  // Close Modal on 'Escape' Key Press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseSignup();
      }
    };
    if (isSignupOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSignupOpen]);

  // --- Animation Hooks for "Why Students Trust Us" ---
  const trustSectionRef = useRef(null);
  const [trustVisible, setTrustVisible] = useState(false);

  // --- State for FAQ Accordion ---
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // --- Data Sections ---
  const trustFeatures = [
    {
      icon: "/icons/export.png",
      title: "#1 Application Platform for Students",
      description:
        "Simplify your admission journey — apply to top universities in minutes through our trusted and efficient platform.",
    },
    {
      icon: "/icons/gudence.png",
      title: "Learning Flexibility",
      description:
        "Explore programs that allow you to learn anytime, anywhere — perfect for working professionals and students with busy schedules.",
    },
    {
      icon: "/icons/Recommendation.png",
      title: "Course Recommendation",
      description:
        "We match your career aspirations with industry-relevant, accredited programs that enhance employability and growth.",
    },
    {
      icon: "/icons/Assistance.png",
      title: "University Selection Assistance",
      description:
        "Get access to top-ranked and recognized universities offering flexible online and distance programs.",
    },
    {
      icon: "/icons/end.png",
      title: "End-to-End Assistance",
      description:
        "From choosing the right path to completing your program successfully, we’re with you every step of the way.",
    },
    {
      icon: "/icons/callsupport.png",
      title: "24/7 Support",
      description:
        "Career Vidya offers round-the-clock tech support, online mentoring, and tutoring to assist you anytime you need help.",
    },
  ];

  const assessments = [
    {
      id: 1,
      title: "Career Analysis for 11th & 12th Class",
      desc: "Are you a high school student? Looking for a bright future? Take our assessment and know your capacity.",
      bgColor: "bg-primary-light border-primary/10 text-primary",
    },
    {
      id: 2,
      title: "Career Analysis for Graduates",
      desc: "A graduate looking for career clarity? Click on 'Start Now' and find your perfect path.",
      bgColor: "bg-accent-light border-accent/10 text-accent-dark",
    },
    {
      id: 3,
      title: "Career Analysis for Professionals",
      desc: "Are you already a professional but seeking to explore further in your desired field? Don't delay—take our assessment now.",
      bgColor: "bg-primary-light border-primary/10 text-primary",
    },
    {
      id: 4,
      title: "Personality + Interest + EQ Assessment",
      desc: "This assessment helps to discover the passion to find the right career. This tool analyzes your habits, thinking, emotions, creativity, communication, interests, skills, and morals to give you a better understanding of what you're good at and what career path will suit you.",
      bgColor: "bg-accent-light border-accent/10 text-accent-dark",
    },
    {
      id: 5,
      title: "Career Analysis for Homemakers and Sabbatical",
      desc: "Are you looking for a fulfilling career as a dedicated homemaker? Find answers to all your queries and personalized career guidance in a single click.",
      bgColor: "bg-neutral-light border-neutral-border text-neutral-dark",
    },
    {
      id: 6,
      title: "Career Assessment for Graduates",
      desc: "Confused about your career after graduation? Take our expert career assessment to identify the right opportunities aligned with your strengths.",
      bgColor: "bg-accent-light border-accent/10 text-accent-dark",
    },
    {
      id: 7,
      title: "Career Assessment for Professionals",
      desc: "Are you a working professional looking for growth? Take our career assessment and discover the best path to level up your career.",
      bgColor: "bg-white border-neutral-border text-neutral-dark",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Take the Test",
      desc: "Answer scientifically validated situational questions customized for your life stage in 25 minutes.",
    },
    {
      step: "02",
      title: "Get In-Depth Report",
      desc: "Receive an immediate, comprehensive breakdown of your core personality, EQ, interests, and matching traits.",
    },
    {
      step: "03",
      title: "1-on-1 Counseling",
      desc: "Connect with certified expert counselors online to translate your results into an actionable career roadmap.",
    },
    {
      step: "04",
      title: "University Alignment",
      desc: "Get paired with top accredited institutions and programs tailored to your budget and lifestyle constraints.",
    },
  ];

  const stages = [
    {
      title: "Working Professionals",
      desc: "Be your best self at work. Learn what makes you unique and how well-suited you are to your past, current, and future career choices.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: "College Students & Graduates",
      desc: "Unsure about what to do after college? See the range of careers you can pursue with your interests, personality, and education.",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: "Career Changers",
      desc: "Looking to make a career change? Thinking about going back to school? Career Finder will point you in the right direction.",
      img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: "High School Students",
      desc: "Discover your true potential and all of the options you have after high school. Then see which path is right for you.",
      img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop",
    },
  ];

  const faqs = [
    {
      q: "How accurate are these psychometric assessments?",
      a: "Our tests are meticulously structured using internationally recognized framework benchmarks analyzing personality vectors, EQ, and vocational parameters.",
    },
    {
      q: "Will I get personalized guidance after finishing the test?",
      a: "Yes! Your report links directly with our booking module to set up a 1-on-1 discussion session with certified career counselors.",
    },
    {
      q: "Can working professionals shift paths through these metrics?",
      a: "Absolutely. The assessment maps ideal strategic career transitions based on cross-functional skills.",
    },
    {
      q: "How long does the assessment take to finish?",
      a: "On average, it takes between 20 to 25 minutes.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrustVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (trustSectionRef.current) {
      observer.observe(trustSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      <div className="bg-background min-h-screen font-sans text-neutral-dark antialiased relative">
        {/* =========================================================
            SIGNUP MODAL POPUP
            ========================================================= */}
        {isSignupOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleCloseSignup} // Dark area par click karne par band hoga
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-neutral-border max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Form ke andar click karne par modal band nahi hoga
            >
              {/* TOP RIGHT CLOSE BUTTON */}
              <button
                type="button"
                onClick={handleCloseSignup}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors z-50 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Siginup Component with Close Props */}
              <Siginup
                onSuccess={() => {
                  setIsAuthenticated(true);
                  handleCloseSignup();
                }}
                onClose={handleCloseSignup}
              />
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 1: HERO BANNER
            ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-white via-primary-light to-accent-light rounded-[2rem] p-8 md:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-xl border border-primary/10">
            <div className="lg:col-span-7 space-y-6 z-10">
              <span className="inline-block bg-white text-primary text-xs font-extrabold tracking-wider uppercase px-5 py-2 rounded-full shadow-sm border border-primary/10">
                Take Career Suitability Test
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-[2.5rem] font-black tracking-tight leading-[1.15] text-neutral-dark">
                <span className="cv-text-gradient">Shape Your Future</span>
                <br />
                <span className="relative inline-block cv-text-gradient">
                  Career in Just 25 Mins
                  <span className="absolute bottom-1 left-0 w-full h-[3px] cv-divider-gradient rounded-full" />
                </span>
              </h1>

              <p className="text-neutral-mid text-lg md:text-xl max-w-xl font-normal leading-relaxed">
                Make Smart Decisions with our Career Guidance Tools &amp; Expert Career Counselors.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenSignup}
                  className="cv-btn-cta inline-flex items-center gap-2.5 px-6 py-3 rounded-xl group font-bold cursor-pointer"
                >
                  Get Started / Sign Up
                  <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-end h-full min-h-[350px] lg:min-h-[420px] z-10">
              <div className="w-full max-w-[360px] aspect-[4/5] bg-neutral-light rounded-3xl overflow-hidden shadow-xl border border-neutral-border relative">
                <Image
                  src="/images/y4.jpeg"
                  alt="Career Consultation Guidance"
                  fill
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: ASSESSMENTS
            ========================================================= */}
        <section className="bg-neutral-light border-y border-neutral-border py-16">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-neutral-dark tracking-tight">
                Psychometric Career Assessments
              </h2>

              <button
                type="button"
                onClick={handleOpenSignup}
                className="inline-flex items-center gap-2 text-xs font-bold text-accent-dark hover:text-accent transition cursor-pointer"
              >
                Watch Now
                <div className="p-1.5 cv-btn-cta rounded-full">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {assessments.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-2xl border flex flex-col justify-between min-h-[240px] transition-all hover:shadow-md ${item.bgColor}`}
                >
                  <div className="space-y-4">
                    <div className="w-7 h-7 bg-white/90 text-primary rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                      {item.id}
                    </div>
                    <h3 className="font-extrabold text-lg tracking-tight">{item.title}</h3>
                    <p className="opacity-80 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleOpenSignup}
                      className="cv-btn-cta inline-flex items-center gap-1 text-xs px-4 py-2 rounded-lg shadow-sm group cursor-pointer"
                    >
                      Start Now
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: TRUST FEATURES
            ========================================================= */}
        <section
          ref={trustSectionRef}
          className={`py-14 bg-neutral-light transition-all duration-1000 border-b border-neutral-border ${
            trustVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-semibold text-center mb-12 text-neutral-dark">
              <span className="cv-text-gradient font-bold">Why Students Trust Us</span>
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {trustFeatures.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl p-6 shadow-sm hover:border-accent transition-all"
                >
                  <div className="flex justify-start mb-3">
                    <div className="cv-icon-gradient w-10 h-10">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 cv-text-gradient">{item.title}</h3>
                  <p className="text-neutral-mid text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FAQ SECTION
            ========================================================= */}
        <section className="bg-neutral-light border-t border-neutral-border py-20">
          <div className="max-w-4xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <div className="inline-flex p-2 bg-white rounded-xl shadow-sm border border-neutral-border mb-2">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-dark tracking-tight">
                Got Questions? We Have Answers
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={index} className="bg-white border border-neutral-border rounded-xl overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-neutral-dark hover:text-primary transition"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-mid shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-neutral-border">
                        <p className="px-6 py-4 text-xs sm:text-sm text-neutral-mid leading-relaxed bg-neutral-light">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}