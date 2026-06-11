"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, IndianRupee, Award } from "lucide-react";

export default function Counter() {
  const counters = [
    { id: 1, target: 15000, label: "Admissions Done",        icon: GraduationCap, display: "15K+"    },
    { id: 2, target: 150,   label: "Academic Partners",      icon: Users,         display: "150+"    },
    { id: 3, target: 37,    label: "Highest Salary Package", icon: IndianRupee,   display: "37 LPA+", suffix: " LPA+", isLPA: true },
    { id: 4, target: 12000, label: "Alumni Network",         icon: Award,         display: "12K+"    },
  ];

  const [counts, setCounts] = useState(counters.map((c) => c.target));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;

    setCounts(counters.map(() => 0));

    const timers = counters.map((counter, i) => {
      let start = 0;
      const increment = counter.target / steps;
      const timer = setInterval(() => {
        start += increment;
        setCounts((prev) => {
          const updated = [...prev];
          updated[i] = start >= counter.target ? counter.target : Math.max(0, start);
          return updated;
        });
        if (start >= counter.target) clearInterval(timer);
      }, stepTime);
      return timer;
    });

    return () => timers.forEach(clearInterval);
  }, []);

  const formatNumber = (count, counter) => {
    const n = Math.floor(count);
    if (counter.isLPA) return `${n}${counter.suffix}`;
    if (counter.target >= 1000) return `${Math.floor(n / 100) / 10}K+`;
    return `${n}+`;
  };

  return (
    <section className="bg-white py-0">
      <div className="max-w-7xl mx-auto px-3 py-4 md:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {counters.map((counter, i) => {
            const Icon = counter.icon;
            return (
              <div
                key={counter.id}
                className="bg-white rounded-xl p-3 sm:p-4 md:p-5
                           flex items-center gap-2 sm:gap-3
                           shadow-lg hover:shadow-xl hover:scale-[1.02]
                           transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12
                                flex-shrink-0 rounded-full bg-[#0056B3]
                                flex items-center justify-center shadow-md">
                  <Icon className="text-white w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <div className="text-base sm:text-lg md:text-2xl font-bold
                                  tabular-nums text-black leading-tight truncate">
                    {!isMounted
                      ? counter.display
                      : formatNumber(counts[i], counter)}
                  </div>
                  <p className="text-[11px] sm:text-xs md:text-sm font-light
                                leading-snug text-black mt-0.5">
                    {counter.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}