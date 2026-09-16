

// "use client";

// import { CheckCircle2 } from "lucide-react";

// // ✅ FIX: was self-fetching /a pi/v1/university/slug/{slug} again — same
// // data the parent (UniversityDetail) already has via `data` prop. Removed
// // useEffect/api call/loading state entirely; renders synchronously from
// // props so this section is present in the initial SSR HTML.
// //
// // ✅ FIX: fallback heading was the literal string "Key Highlights" with no
// // variation. If any university's admin panel leaves `highlights.heading`
// // empty, every such page renders the exact same H2 text — a duplicate-H2
// // SEO flag. Fallback now includes the university name.
// export default function UniversityHighlights({ data }) {
//     const highlights = data?.highlights;
//     const universityName = data?.name || "This University";

//     if (!highlights || !highlights.points || highlights.points.length === 0) return null;

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
//                         <CheckCircle2 className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
//                         <p className="text-sm md:text-base font-medium leading-relaxed">
//                             {point}
//                         </p>
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
        <div className="bg-gradient-to-br from-[#0b3a6f] to-[#0056D2] rounded-2xl p-8 text-white shadow-xl">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {highlights.heading || `${universityName} Key Highlights`}
                </h2>
                <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.points.map((point, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-all"
                    >
                        <CheckCircle2
                            className="text-yellow-400 mt-1 flex-shrink-0"
                            size={20}
                        />
                        <p
                            className="text-sm md:text-base font-medium leading-relaxed"
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