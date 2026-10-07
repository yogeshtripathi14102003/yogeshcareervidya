"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function WhyStudentsTrustUs() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const features = [
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
        "From choosing the right path to completing your program successfully, we're with you every step of the way.",
    },
    {
      icon: "/icons/callsupport.png",
      title: "24/7 Support",
      description:
        "CareerVidya offers round-the-clock tech support, online mentoring, and tutoring to assist you anytime you need help.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Why Students Trust CareerVidya",
    description:
      "Key features and benefits of using CareerVidya for career counselling and university selection",
    numberOfItems: features.length,
    itemListElement: features.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Thing",
        name: f.title,
        description: f.description,
      },
    })),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Script
        id="why-trust-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        ref={sectionRef}
        aria-label="Why Students Trust CareerVidya"
        className={`py-14 transition-all duration-1000 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        style={{ background: "#F8FAFC" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* ✅ Heading — Primary navy */}
          <h2
            className={`text-2xl md:text-4xl font-semibold text-center mb-12
            transition-all duration-1000 delay-200
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="font-bold" style={{ color: "#1E3A8A" }}>
              Why Students Trust Us
            </span>
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item, index) => (
              <div
                key={index}
                style={{ transitionDelay: `${index * 120}ms` }}
                className={`group relative bg-white rounded-xl p-6
                shadow-sm transition-all duration-700 ease-out
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1E3A8A";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #FFF7ED 0%, #EFF6FF 100%)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(30, 58, 138, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 0, 0, 0.05)";
                }}
              >
                <div className="flex justify-start mb-3">
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={40}
                    height={40}
                    className="object-contain"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>

                {/* ✅ Title — Primary navy */}
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#1E3A8A" }}
                >
                  {item.title}
                </h3>

                {/* ✅ Description — Neutral mid */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#64748B" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}