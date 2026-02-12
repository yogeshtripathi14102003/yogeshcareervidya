"use client";

import Image from "next/image";

/* ================= DATA ================= */
const careervidyaVidyaReasons = [
  { 
    iconSrc: "/images/i1.jpeg", 
    title: "Multiple Online Programmes", 
    description: "Online MBA, BBA, BCA & MCA programmes available" 
  },
  { 
    iconSrc: "/images/I8.jpeg", 
    title: "Top Online Universities", 
    description: "Offered through 6 leading online universities in India" 
  },
  { 
    iconSrc: "/images/i3.jpeg",
    title: "UGC & Government Approved", 
    description: "All programmes are UGC approved & government recognized" 
  },
  { 
    iconSrc: "/images/i2.jpeg", 
    title: "Globally Recognised Degrees", 
    description: "Online degrees are globally valid & industry accepted" 
  },
  { 
    iconSrc: "/images/i7.jpeg", 
    title: "Flexible Learning Model", 
    description: "Suitable for students & working professionals" 
  },
  { 
    iconSrc: "/images/i4.jpeg", 
    title: "Digital Learning Experience", 
    description: "Access to live classes, recorded lectures & digital study material" 
  },
  { 
    iconSrc: "/images/i5.jpeg", 
    title: "Equal Academic Value", 
    description: "Same academic value as regular on campus degrees" 
  },
  { 
    iconSrc: "/images/i6.jpeg", 
    title: "Updated Curriculum Structure", 
    description: "Programmes structured as per latest education guidelines" 
  },
];

/* ================= HELPER ================= */
const toTitleCase = (text) =>
  text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/* ================= COMPONENT ================= */
export default function WhyCareerVidya() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          KEY HIGHLIGHTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {careervidyaVidyaReasons.map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                <Image
                  src={item.iconSrc}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* ✅ TITLE — TEXT SAME, SIZE CHHOTA */}
              <h3 className="font-semibold text-gray-800 text-[15px] whitespace-nowrap mb-2">
                {item.title}
              </h3>

              {/* ✅ DESCRIPTION — EACH WORD CAPITAL */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {toTitleCase(item.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
