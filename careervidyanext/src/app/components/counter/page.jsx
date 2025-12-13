"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, IndianRupee, Award } from "lucide-react";

const ICON_COLOR_CLASS = "text-[#0056B3]";

export default function Counter() {
  const counters = [
    {
      id: 1,
      target: 10000,
      label: "Admissions Done",
      icon: <GraduationCap className={`w-6 h-6 ${ICON_COLOR_CLASS}`} />,
    },
    {
      id: 2,
      target: 150,
      label: "Academic Partners",
      icon: <Users className={`w-6 h-6 ${ICON_COLOR_CLASS}`} />,
    },
    {
      id: 3,
      target: 37,
      label: "Highest Salary Package",
      icon: <IndianRupee className={`w-6 h-6 ${ICON_COLOR_CLASS}`} />,
      suffix: " LPA+",
      fromBottom: true,
    },
    {
      id: 4,
      target: 10000,
      label: "Alumni Network",
      icon: <Award className={`w-6 h-6 ${ICON_COLOR_CLASS}`} />,
    },
  ];

  const [counts, setCounts] = useState(counters.map(() => 0));

  useEffect(() => {
    const duration = 1800;
    const stepTime = 20;
    const steps = duration / stepTime;

    const timers = counters.map((counter, i) => {
      let start = counter.fromBottom ? -counter.target : 0;
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
    <section className="bg-white py-3">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {counters.map((counter, i) => (
          <div
            key={counter.id}
            className="bg-white rounded-xl p-3 text-center transition-all duration-300 hover:scale-[1.03] shadow-sm"
          >
            {/* Icon */}
            <div className="flex justify-center mb-1.5">
              {counter.icon}
            </div>

            {/* Number (EXTRA THIN + SMALLER) */}
            <h3 className="text-2xl md:text-3xl font-extralight tracking-tight tabular-nums text-black mb-0.5">
              {counter.id === 3
                ? `${Math.floor(counts[i])}${counter.suffix}`
                : counter.target >= 1000
                ? `${Math.floor(counts[i] / 1000)}K+`
                : `${Math.floor(counts[i])}+`}
            </h3>

            {/* Label */}
            <p className="text-gray-700 text-xs md:text-sm font-medium">
              {counter.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
