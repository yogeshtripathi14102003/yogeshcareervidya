// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api";
// import { CheckCircle } from "lucide-react";

// export default function FactsSection({ slug }) {
//   const [facts, setFacts] = useState(null);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchFacts = async () => {
//       try {
//         const res = await api.get(`/api/v1/university/slug/${slug}`);

//         // ✔ Correct data path
//         setFacts(res.data?.data?.facts);
//       } catch (err) {
//         console.error("Error loading facts:", err);
//       }
//     };

//     fetchFacts();
//   }, [slug]);

//   if (!facts || (!facts.factsHeading && facts.factsPoints.length === 0))
//     return null;

//   return (
//     <section className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
//       {facts.factsHeading && (
//         <h2 className="text-3xl font-bold text-gray-900 mb-3">
//           {facts.factsHeading}
//         </h2>
//       )}

//       {facts.factsSubHeading && (
//         <p className="text-lg text-gray-700 mb-5">{facts.factsSubHeading}</p>
//       )}

//       <div className="flex flex-col gap-4">
//         {facts.factsPoints?.map((point, index) => (
//           <div key={index} className="flex items-start gap-2">
//             <CheckCircle className="text-blue-500 min-w-[22px]" size={22} />
//             <p className="text-gray-800 text-lg leading-relaxed">{point}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import { CheckCircle } from "lucide-react";

// ✅ FIX: was self-fetching /api/v1/university/slug/{slug} again — same
// data the parent (UniversityDetail) already fetched server-side. Removed
// useEffect/api call/state entirely; renders synchronously from the
// `data` prop, so this section is present in the initial SSR HTML.
//
// ✅ FIX: original null-check (`!facts.factsPoints.length`) would throw
// if `facts.factsPoints` was undefined (can't read `.length` of
// undefined) — used optional chaining instead so a missing factsPoints
// array no longer crashes the page.
export default function FactsSection({ data }) {
    const facts = data?.facts;

    if (!facts || (!facts.factsHeading && !facts.factsPoints?.length))
        return null;

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-6 mt-10">
            {facts.factsHeading && (
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {facts.factsHeading}
                </h2>
            )}

            {facts.factsSubHeading && (
                <p className="text-lg text-gray-700 mb-5">{facts.factsSubHeading}</p>
            )}

            <div className="flex flex-col gap-4">
                {facts.factsPoints?.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-blue-500 min-w-[22px]" size={22} />
                        <p className="text-gray-800 text-lg leading-relaxed">{point}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}