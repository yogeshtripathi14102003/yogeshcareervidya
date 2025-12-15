"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, IndianRupee, Award } from "lucide-react";

// Common styles for the icon container
const ICON_CONTAINER_CLASS = "w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full bg-[#0056B3] flex items-center justify-center mr-3 shadow-md";
const ICON_COLOR_CLASS = "text-white w-5 h-5 md:w-6 md:h-6";

export default function Counter() {
  const counters = [
    {
      id: 1,
      target: 10000,
      label: "Admissions Done",
      icon: <GraduationCap className={ICON_COLOR_CLASS} />,
    },
    {
      id: 2,
      target: 150,
      label: "Academic Partners",
      icon: <Users className={ICON_COLOR_CLASS} />,
    },
    {
      id: 3,
      target: 37,
      label: "Highest Salary Package",
      icon: <IndianRupee className={ICON_COLOR_CLASS} />,
      suffix: " LPA+",
    },
    {
      id: 4,
      target: 10000,
      label: "Alumni Network",
      icon: <Award className={ICON_COLOR_CLASS} />,
    },
  ];

  const [counts, setCounts] = useState(counters.map(() => 0));

  // Counter animation logic 
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

  const formatNumber = (count, target, suffix, isLPA) => {
    const flooredCount = Math.floor(count);

    if (isLPA) {
      return `${flooredCount}${suffix}`;
    }

    if (target >= 1000) {
      const displayK = Math.floor(flooredCount / 100) / 10; 
      return `${displayK}K+`;
    }

    return `${flooredCount}+`;
  };

  return (
    <section className="bg-white py-8 md:py-12"> {/* Background always white */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 px-3">
        {counters.map((counter, i) => {
          const isLPA = counter.id === 3;
          return (
            <div
              key={counter.id}
              className="bg-white rounded-xl p-3 md:p-5 flex items-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" // Cards bg always white
            >
              <div className={ICON_CONTAINER_CLASS}>
                {counter.icon}
              </div>

              <div className="text-left">
                <h3 className="text-lg md:text-2xl font-bold tracking-tight tabular-nums text-black mb-0 leading-tight">
                  {formatNumber(
                    counts[i],
                    counter.target,
                    counter.suffix,
                    isLPA
                  )}
                </h3>

                <p className="text-xs md:text-sm font-light leading-snug text-black">
                  {counter.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
