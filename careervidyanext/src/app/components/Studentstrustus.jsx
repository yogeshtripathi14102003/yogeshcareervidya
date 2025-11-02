"use client";

import Image from "next/image";

export default function WhyStudentsTrustUs() {
  const features = [
    {
      icon: "/icons/all1.png",
      title: "All-in-One Application Platform",
      description:
        "Career Vidya simplifies college applications with one single form that lets you apply to 100+ colleges, plus access to a scholarship database and loan guidance—all centralized in one platform.",
    },
    {
      icon: "/icons/callsupport.png",
      title: "24/7 Support",
      description:
        "Career Vidya offers round-the-clock tech support, online mentoring, and tutoring to assist you at any time.",
    },
    {
      icon: "/icons/export.png",
      title: "Expert Guidance",
      description:
        "Our experienced mentors provide personalized career and education guidance, helping you assess academic options, finances, and align your goals through virtual consultations and customized strategy sessions.",
    },
  ];

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-12">
          Why{" "}
          <span className="text-[#0056B3] font-bold italic">
            Students Trust
          </span>{" "}
          Us
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2"
              style={{
                boxShadow:
                  "0 4px 10px rgba(0, 86, 179, 0.15), 0 6px 20px rgba(255, 102, 0, 0.15)", // blue + orange shadow
              }}
            >
              {/* === Top-right orange accent === */}
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#FF6600] rounded-tr-2xl"></div>

              {/* === Bottom-left blue accent === */}
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#0056B3] rounded-bl-2xl"></div>

              {/* === Icon === */}
              <div className="flex justify-start mb-3">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              {/* === Title === */}
              <h3 className="text-lg font-semibold mb-2 text-[#0056B3]">
                {item.title}
              </h3>

              {/* === Description === */}
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
