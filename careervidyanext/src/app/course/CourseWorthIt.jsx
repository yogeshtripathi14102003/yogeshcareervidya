


 
// import React from "react";
// import Image from "next/image";

// export default function CourseWorthIt({ onlineCourseWorthIt, courseTitle }) {
//   const dynamicCourseTitle = courseTitle || "Online Course";

//   if (!onlineCourseWorthIt) {
//     return null;
//   }

//   const { description, topics, image } = onlineCourseWorthIt;

//   return (
//     <section className="w-full flex justify-center py-12 bg-white font-sans overflow-x-hidden">
//       <div className="w-full max-w-[1600px] px-4 md:px-10">
//         {/* Heading */}
//         <div className="mb-8 text-left">
//           <h2 className="text-2xl md:text-4xl font-bold text-[#002147] leading-tight">
//             Is {dynamicCourseTitle} Worth It?
//           </h2>
//           <div className="w-16 h-1 bg-blue-600 mt-4 rounded-full"></div>
//         </div>

//         {/* Description */}
//         {description && (
//           <div
//             className="text-base md:text-lg text-gray-600 mb-12 text-left max-w-5xl leading-relaxed"
//             style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//           >
//             <span dangerouslySetInnerHTML={{ __html: description }} />
//           </div>
//         )}

//         {/* Topics + Image */}
//         <div className="space-y-6">
//           {/* Topics */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {topics?.map((topic, index) => (
//               <div
//                 key={index}
//                 className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-all"
//               >
//                 <div className="flex gap-4">
//                   <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
//                   <div className="text-left min-w-0 flex-1">
//                     <h3
//                       className="text-lg md:text-xl font-bold text-[#002147] mb-2"
//                       style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//                     >
//                       {topic.subHeading}
//                     </h3>

//                     {topic.description && (
//                       <div
//                         className="text-gray-600 text-sm md:text-base leading-relaxed"
//                         style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
//                       >
//                         <span
//                           dangerouslySetInnerHTML={{
//                             __html: topic.description,
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Image BELOW points */}
//           {image?.url && (
//             <div className="relative w-full aspect-[16/9] md:aspect-[21/9] mt-12 rounded-2xl shadow-lg border border-gray-100 bg-white overflow-hidden">
//               <Image
//                 src={image.url}
//                 alt={courseTitle || "Course Illustration"}
//                 fill
//                 sizes="(max-width: 768px) 100vw, (max-width: 1600px) 90vw, 1600px"
//                 className="object-contain"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════
   TEXT WRAP STYLE (reusable)
═══════════════════════════════════════════════ */
const TEXT_WRAP_STYLE = {
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  minWidth: 0,
};

export default function CourseWorthIt({ onlineCourseWorthIt, courseTitle }) {
  const dynamicCourseTitle = courseTitle || "Online Course";

  if (!onlineCourseWorthIt) {
    return null;
  }

  const { description, topics, image } = onlineCourseWorthIt;

  return (
    <section
      className="w-full py-8 md:py-10 font-sans overflow-x-hidden"
      style={{ background: "#fff" }}
    >
      {/* ✅ CONTAINER — Same as Overview */}
      <div className="max-w-[1800px] lg:w-[90%] mx-auto px-4 sm:px-6">
        {/* ═══════════════════════════════════════════
            HEADING — Navy
        ═══════════════════════════════════════════ */}
        <div className="mb-6 md:mb-8 text-left">
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight"
            style={{ color: "var(--cv-primary)", ...TEXT_WRAP_STYLE }}
          >
            Is {dynamicCourseTitle} Worth It?
          </h2>
          <div
            className="w-16 h-1 mt-3 rounded-full"
            style={{ background: "var(--cv-primary)" }}
          ></div>
        </div>

        {/* ═══════════════════════════════════════════
            DESCRIPTION (FULL WIDTH)
        ═══════════════════════════════════════════ */}
        {description && (
          <div
            className="w-full text-base md:text-lg mb-8 md:mb-10 text-left leading-relaxed"
            style={{ color: "var(--cv-neutral-mid)", ...TEXT_WRAP_STYLE }}
          >
            <span dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        )}

        {/* ═══════════════════════════════════════════
            TOPICS + IMAGE
        ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {topics?.map((topic, index) => (
              <div
                key={index}
                className="p-5 md:p-6 rounded-lg shadow-sm transition-all"
                style={{
                  background: "#fff",
                  border: "1px solid var(--cv-neutral-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cv-primary)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(30, 58, 138, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--cv-neutral-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex gap-4">
                  {/* Navy dot */}
                  <div
                    className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "var(--cv-primary)" }}
                  ></div>

                  <div className="text-left flex-1" style={TEXT_WRAP_STYLE}>
                    {/* Topic heading — Navy */}
                    <h3
                      className="text-lg md:text-xl font-bold mb-2"
                      style={{
                        color: "var(--cv-primary)",
                        ...TEXT_WRAP_STYLE,
                      }}
                    >
                      {topic.subHeading}
                    </h3>

                    {/* Topic description — Grey */}
                    {topic.description && (
                      <div
                        className="text-sm md:text-base leading-relaxed"
                        style={{
                          color: "var(--cv-neutral-mid)",
                          ...TEXT_WRAP_STYLE,
                        }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: topic.description,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          {image?.url && (
            <div
              className="relative w-full aspect-[16/9] md:aspect-[21/9] mt-8 md:mt-10 rounded-2xl shadow-lg overflow-hidden"
              style={{
                border: "1px solid var(--cv-neutral-border)",
                background: "#fff",
              }}
            >
              <Image
                src={image.url}
                alt={courseTitle || "Course Illustration"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1600px) 90vw, 1600px"
                className="object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}