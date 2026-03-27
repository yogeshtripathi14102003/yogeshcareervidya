"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function WhyStudentsTrustUs() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const features = [
    {
      icon: "/icons/export.png",
      title: "#1 Application Platform for Students",
      description: "Simplify your admission journey — apply to top universities in minutes through our trusted and efficient platform.",
    },
    {
      icon: "/icons/gudence.png",
      title: "Learning Flexibility",
      description: "Explore programs that allow you to learn anytime, anywhere — perfect for working professionals and students with busy schedules.",
    },
    {
      icon: "/icons/Recommendation.png",
      title: "Course Recommendation",
      description: "We match your career aspirations with industry-relevant, accredited programs that enhance employability and growth.",
    },
    {
      icon: "/icons/Assistance.png",
      title: "University Selection Assistance",
      description: "Get access to top-ranked and recognized universities offering flexible online and distance programs.",
    },
    {
      icon: "/icons/end.png",
      title: "End-to-End Assistance",
      description: "From choosing the right path to completing your program successfully, we’re with you every step of the way.",
    },
    {
      icon: "/icons/callsupport.png",
      title: "24/7 Support",
      description: "Career Vidya offers round-the-clock tech support, online mentoring, and tutoring to assist you anytime you need help.",
    },
  ];

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
    <section
      ref={sectionRef}
      /* ✅ select-none: Isse text copy nahi hoga, par right-click kaam karega */
      className={`py-14 bg-[#f4f4f4] transition-all duration-1000 ease-out select-none
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className={`text-2xl md:text-4xl font-semibold text-center mb-12 text-gray-900
          transition-all duration-1000 delay-200
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Why <span className="text-gray-900 font-bold">Students Trust</span> Us
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`group relative bg-white border border-transparent rounded-xl p-6
              shadow-sm transition-all duration-700 ease-out
              hover:border-[#0056B3]
              hover:bg-gradient-to-br hover:from-[#FFF5EE] hover:to-[#E6F0FF]
              hover:shadow-[0_4px_12px_rgba(0,86,179,0.15)]
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex justify-start mb-3">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  draggable={false}
                  className="object-contain pointer-events-none"
                />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-[#0056B3]">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}