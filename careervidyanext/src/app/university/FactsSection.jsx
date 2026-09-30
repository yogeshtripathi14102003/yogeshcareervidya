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
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function FactsSection({ data }) {
  const facts = data?.facts;

  if (!facts || (!facts.factsHeading && !facts.factsPoints?.length))
    return null;

  return (
    <section
      className="rounded-2xl p-8 shadow-sm"
      style={{
        background: "#fff",
        border: "1px solid var(--cv-neutral-border)",
      }}
    >
      {/* Heading — Navy */}
      {facts.factsHeading && (
        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "var(--cv-primary)" }}
        >
          {facts.factsHeading}
        </h2>
      )}

      {/* Subheading — Grey */}
      {facts.factsSubHeading && (
        <p
          className="text-base md:text-lg mb-5"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          {facts.factsSubHeading}
        </p>
      )}

      {/* Facts points */}
      <div className="flex flex-col gap-4">
        {facts.factsPoints?.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Navy check icon */}
            <CheckCircle
              className="min-w-[22px] mt-1"
              style={{ color: "var(--cv-primary)" }}
              size={22}
            />
            {/* Dark text */}
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--cv-neutral-dark)" }}
              dangerouslySetInnerHTML={{
                __html: cleanHtml(point),
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}