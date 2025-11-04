"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, Star } from "lucide-react";

export default function Counter() {
  const counters = [
    { id: 1, target: 10000, label: "Admissions Done", icon: <GraduationCap className="w-6 h-6 text-[#0056B3]" /> },
    { id: 2, target: 150, label: "Academic Partners", icon: <Users className="w-6 h-6 text-[#F58220]" /> },
    { id: 3, target: 8, label: "Highest Salary Package (LPA)", icon: <Star className="w-6 h-6 text-[#0056B3] fill-[#F58220]" /> },
    { id: 4, target: 8000, label: "Alumni Network", icon: <Users className="w-6 h-6 text-[#0056B3]" /> },
  ];

  const [counts, setCounts] = useState(counters.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;

    const timers = counters.map((counter, i) => {
      let start = 0;
      const increment = counter.target / steps;

      const timer = setInterval(() => {
        start += increment;
        setCounts((prev) => {
          const updated = [...prev];
          updated[i] = start >= counter.target ? counter.target : start;
          return updated;
        });
        if (start >= counter.target) clearInterval(timer);
      }, stepTime);
      return timer;
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section className="bg-white py-8">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">
        Our <span className="text-[#0056B3] italic">Achievements at a Glance</span>
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {counters.map((counter, i) => (
          <div
            key={counter.id}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 text-center border border-gray-200 hover:scale-[1.03]"
            style={{
              borderTopRightRadius: "25px",
              borderBottomLeftRadius: "25px",
              borderImage: "linear-gradient(45deg, #0056B3, #F58220) 1",
              borderWidth: "1.5px",
              borderStyle: "solid",
            }}
          >
            <div className="flex justify-center mb-2">{counter.icon}</div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {counter.target >= 1000
                ? `${Math.floor(counts[i] / 1000)}K+`
                : counter.target === 8
                ? `${counts[i].toFixed(0)} Lakh`
                : `${Math.floor(counts[i])}+`}
            </h3>

            <p className="text-gray-700 text-xs font-semibold leading-tight">
              {counter.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
