
"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, IndianRupee, Award } from "lucide-react";

export default function Counter() {
  const counters = [
    {
      id: 1,
      target: 10000,
      label: "Admissions Done",
      icon: <GraduationCap className="w-7 h-7 text-[#0056B3]" />,
    },
    {
      id: 2,
      target: 150,
      label: "Academic Partners",
      icon: <Users className="w-7 h-7 text-[#F58220]" />,
    },
    {
      id: 3,
      target: 37,
      label: "Highest Salary Package",
      icon: <IndianRupee className="w-7 h-7 text-[#0056B3]" />,
      suffix: " LPA+",
      fromBottom: true, // ✅ special animation
    },
    {
      id: 4,
      target: 10000,
      label: "Alumni Network",
      icon: <Award className="w-7 h-7 text-[#0056B3]" />,
    },
  ];

  const [counts, setCounts] = useState(counters.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;

    const timers = counters.map((counter, i) => {
      let start = counter.fromBottom ? -counter.target : 0; // ✅ bottom se start
      const increment = counter.target / steps;

      const timer = setInterval(() => {
        start += increment;
        setCounts((prev) => {
          const updated = [...prev];
          updated[i] =
            start >= counter.target ? counter.target : Math.max(0, start);
          return updated;
        });

        if (start >= counter.target) clearInterval(timer);
      }, stepTime);

      return timer;
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section className="bg-white dark:bg-white py-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {counters.map((counter, i) => (
          <div
            key={counter.id}
            className="bg-white dark:bg-white rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.04] shadow-sm"
          >
            <div className="flex justify-center mb-2">{counter.icon}</div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-black mb-1">
              {counter.id === 3
                ? `${Math.floor(counts[i])}${counter.suffix}`
                : counter.target >= 1000
                ? `${Math.floor(counts[i] / 1000)}K+`
                : `${Math.floor(counts[i])}+`}
            </h3>

            <p className="text-gray-800 text-sm md:text-base font-semibold">
              {counter.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
