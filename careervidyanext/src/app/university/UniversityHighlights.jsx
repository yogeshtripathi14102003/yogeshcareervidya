
// "use client";

// import { CheckCircle2 } from "lucide-react";
// import { cleanHtml } from "@/utlis/cleanHtml.js";

// export default function UniversityHighlights({ data }) {
//     const highlights = data?.highlights;
//     const universityName = data?.name || "This University";

//     if (!highlights || !highlights.points || highlights.points.length === 0)
//         return null;

//     return (
//         <div className="bg-gradient-to-br from-[#0b3a6f] to-[#0056D2] rounded-2xl p-8 text-white shadow-xl">
//             <div className="mb-6">
//                 <h2 className="text-2xl md:text-3xl font-bold mb-2">
//                     {highlights.heading || `${universityName} Key Highlights`}
//                 </h2>
//                 <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {highlights.points.map((point, index) => (
//                     <div
//                         key={index}
//                         className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-all"
//                     >
//                         <CheckCircle2
//                             className="text-yellow-400 mt-1 flex-shrink-0"
//                             size={20}
//                         />
//                         <p
//                             className="text-sm md:text-base font-medium leading-relaxed"
//                             dangerouslySetInnerHTML={{
//                                 __html: cleanHtml(point),
//                             }}
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import { CheckCircle2 } from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function UniversityHighlights({ data }) {
  const highlights = data?.highlights;
  const universityName = data?.name || "This University";

  if (!highlights || !highlights.points || highlights.points.length === 0)
    return null;

  return (
    <div
      className="rounded-2xl p-8 shadow-xl"
      style={{
        background: "var(--cv-grad-navy)", // ✅ Navy → Purple gradient
      }}
    >
      {/* Heading section */}
      <div className="mb-6">
        {/* ✅ White heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2 !text-white">
          {highlights.heading || `${universityName} Key Highlights`}
        </h2>

        {/* ✅ Orange underline (was yellow) */}
        <div
          className="w-16 h-1 rounded-full"
          style={{ background: "var(--cv-accent)" }}
        ></div>
      </div>

      {/* Points grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.points.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-sm transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")
            }
          >
            {/* ✅ Orange check icon (was yellow) */}
            <CheckCircle2
              className="mt-1 flex-shrink-0"
              style={{ color: "var(--cv-accent)" }}
              size={20}
            />
            <p
              className="text-sm md:text-base font-medium leading-relaxed !text-white"
              dangerouslySetInnerHTML={{
                __html: cleanHtml(point),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}