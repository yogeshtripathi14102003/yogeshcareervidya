



// "use client";

// import { useState, useEffect } from "react";
// import { Users, GraduationCap, Star } from "lucide-react";

// export default function Counter() {
//   const counters = [
//     {
//       id: 1,
//       target: 10000,
//       label: "Admissions Done",
//       icon: <GraduationCap className="w-7 h-7 text-[#0056B3]" />,
//     },
//     {
//       id: 2,
//       target: 150,
//       label: "Academic Partners",
//       icon: <Users className="w-7 h-7 text-[#F58220]" />,
//     },
//     {
//       id: 3,
//       target: 37 (LPA),
//       label: "Highest Salary Package ",
//       icon: <Star className="w-7 h-7 text-[#0056B3] fill-[#F58220]" />,
//     },
//     {
//       id: 4,
//       target: 10000,
//       label: "Alumni Network",
//       icon: <Users className="w-7 h-7 text-[#0056B3]" />,
//     },
//   ];

//   const [counts, setCounts] = useState(counters.map(() => 0));

//   useEffect(() => {
//     const duration = 2000;
//     const stepTime = 20;
//     const steps = duration / stepTime;

//     const timers = counters.map((counter, i) => {
//       let start = 0;
//       const increment = counter.target / steps;

//       const timer = setInterval(() => {
//         start += increment;
//         setCounts((prev) => {
//           const updated = [...prev];
//           updated[i] = start >= counter.target ? counter.target : start;
//           return updated;
//         });

//         if (start >= counter.target) clearInterval(timer);
//       }, stepTime);

//       return timer;
//     });

//     return () => timers.forEach(clearInterval);
//   }, []);

//   return (
//     <section className="bg-white py-10">
//       <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
//         {counters.map((counter, i) => (
//           <div
//             key={counter.id}
//             className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 text-center hover:scale-[1.04]"
//           >
//             <div className="flex justify-center mb-3">{counter.icon}</div>

//             {/* 🔥 BIGGER + DARK NUMBER */}
//             <h3 className="text-3xl md:text-4xl font-extrabold text-black mb-1">
//               {counter.target >= 1000
//                 ? `${Math.floor(counts[i] / 1000)}K+`
//                 : `${Math.floor(counts[i])}+`}
//             </h3>

//             {/* Bigger label */}
//             <p className="text-gray-700 text-sm md:text-base font-semibold leading-tight">
//               {counter.label}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, Star } from "lucide-react";

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
      label: "Highest Salary Package (LPA)",
      icon: <Star className="w-7 h-7 text-[#0056B3] fill-[#F58220]" />,
    },
    {
      id: 4,
      target: 10000,
      label: "Alumni Network",
      icon: <Users className="w-7 h-7 text-[#0056B3]" />,
    },
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
    <section className="bg-white dark:bg-white py-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {counters.map((counter, i) => (
          <div
            key={counter.id}
            className="bg-white dark:bg-white rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.04] shadow-sm"
          >
            <div className="flex justify-center mb-2">{counter.icon}</div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-black mb-1">
              {counter.target >= 1000
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
