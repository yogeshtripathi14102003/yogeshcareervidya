// import React, { useState } from "react";

// const featureCards = [
//   { id: 1, iconSrc: "/icons/export.png", title: "Harvard Certified Modules" },
//   { id: 2, iconSrc: "/icons/gudence.png", title: "25% Early Bird Concession" },
//   { id: 3, iconSrc: "/icons/Recommendation.png", title: "300+ Hiring Partners" },
//   { id: 4, iconSrc: "/icons/Assistance.png", title: "Free Industry Experts Session" },
//   { id: 5, iconSrc: "/icons/end.png", title: "24x7 Learner Support" },
//   { id: 6, iconSrc: "/icons/callsupport.png", title: "World-Class LMS Platform" },
//   { id: 7, iconSrc: "/images/21.png", title: "Career & Placement Assistance" },
//   { id: 8, iconSrc: "/images/221.png", title: "Acclaimed Global Faculty" },
// ];

// const learnCards = [
//   { id: 1, iconSrc: "/images/30.png", title: "Leadership & Strategic Thinking" },
//   { id: 2, iconSrc: "/images/29.png", title: "Business Analytics & Data Insights" },
//   { id: 3, iconSrc: "/images/28.png", title: "Managerial Communication" },
//   { id: 4, iconSrc: "/images/27.png", title: "Global Business Perspective" },
// ];

// const pedagogyCards = [
//   { id: 1, iconSrc: "/images/26.png", title: "Live Interactive Classes" },
//   { id: 2, iconSrc: "/images/25.png", title: "Industry Projects" },
//   { id: 3, iconSrc: "/images/24.png", title: "Expert Mentorship" },
//   { id: 4, iconSrc: "/images/23.png", title: "Continuous Assessment" },
// ];

// const ProgrammeOverview = () => {
//   const [activeTab, setActiveTab] = useState("highlights");

//   return (
//     <section className="py-16 bg-gradient-to-b from-[#A80000] via-[#E31E26] to-[#FFFFFF]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         {/* Title */}
//         <h2 className="text-4xl font-bold text-white mb-4 relative mx-auto block w-fit">
//           Programme Overview
//           <span className="absolute left-0 right-0 bottom-0 h-1 bg-black w-full rounded-full"></span>
//         </h2>

//         {/* Description */}
//         <p className="text-center text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
//           The Online MBA Program is a two-year postgraduate degree offering dual
//           specialization options, designed to prepare aspiring leaders and
//           managers for dynamic global business environments. Open to graduates
//           from any academic background, the program delivers an in-depth blend
//           of management theory and practical application through an
//           industry-aligned curriculum.
//         </p>

//         {/* Tabs */}
//         <div className="flex flex-col md:flex-row justify-center mb-12 space-y-4 md:space-y-0 md:space-x-4">
//           {["highlights", "learn", "pedagogy"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-3 px-6 rounded-md text-lg font-semibold transition-all duration-300 ${
//                 activeTab === tab
//                   ? "bg-black text-white shadow-lg scale-105"
//                   : "bg-white text-[#A80000] hover:bg-black hover:text-white"
//               }`}
//             >
//               {tab === "highlights"
//                 ? "Programme Highlights"
//                 : tab === "learn"
//                 ? "You Will Learn"
//                 : "Industry-Led Pedagogy"}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div>
//           {activeTab === "highlights" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featureCards.map((card) => (
//                 <div
//                   key={card.id}
//                   className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-black/20 
//                   transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:bg-[#FCEAEA]"
//                 >
//                   <img
//                     src={card.iconSrc}
//                     alt={card.title}
//                     className="w-16 h-16 mb-4 object-contain"
//                   />
//                   <h3 className="text-lg font-semibold text-[#A80000]">
//                     {card.title}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === "learn" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {learnCards.map((card) => (
//                 <div
//                   key={card.id}
//                   className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start text-left border border-black/20 
//                   transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:bg-[#FCEAEA]"
//                 >
//                   <img
//                     src={card.iconSrc}
//                     alt={card.title}
//                     className="w-12 h-12 mb-3 object-contain"
//                   />
//                   <h3 className="text-lg font-semibold text-[#A80000] mb-2">
//                     {card.title}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === "pedagogy" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {pedagogyCards.map((card) => (
//                 <div
//                   key={card.id}
//                   className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start text-left border border-black/20 
//                   transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:bg-[#FCEAEA]"
//                 >
//                   <img
//                     src={card.iconSrc}
//                     alt={card.title}
//                     className="w-12 h-12 mb-3 object-contain"
//                   />
//                   <h3 className="text-lg font-semibold text-[#A80000] mb-2">
//                     {card.title}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProgrammeOverview;


import React, { useState } from "react";

const featureCards = [
  { id: 1, iconSrc: "/icons/export.png", title: "Harvard Certified Modules" },
  { id: 2, iconSrc: "/icons/gudence.png", title: "25% Early Bird Concession" },
  { id: 3, iconSrc: "/icons/Recommendation.png", title: "300+ Hiring Partners" },
  { id: 4, iconSrc: "/icons/Assistance.png", title: "Free Industry Experts Session" },
  { id: 5, iconSrc: "/icons/end.png", title: "24x7 Learner Support" },
  { id: 6, iconSrc: "/icons/callsupport.png", title: "World-Class LMS Platform" },
  { id: 7, iconSrc: "/images/21.png", title: "Career & Placement Assistance" },
  { id: 8, iconSrc: "/images/221.png", title: "Acclaimed Global Faculty" },
];

const learnCards = [
  { id: 1, iconSrc: "/images/30.png", title: "Leadership & Strategic Thinking" },
  { id: 2, iconSrc: "/images/29.png", title: "Business Analytics & Data Insights" },
  { id: 3, iconSrc: "/images/28.png", title: "Managerial Communication" },
  { id: 4, iconSrc: "/images/27.png", title: "Global Business Perspective" },
];

const pedagogyCards = [
  { id: 1, iconSrc: "/images/26.png", title: "Live Interactive Classes" },
  { id: 2, iconSrc: "/images/25.png", title: "Industry Projects" },
  { id: 3, iconSrc: "/images/24.png", title: "Expert Mentorship" },
  { id: 4, iconSrc: "/images/23.png", title: "Continuous Assessment" },
];

const ProgrammeOverview = () => {
  const [activeTab, setActiveTab] = useState("highlights");

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFF9F9] via-[#FFECEC] to-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold text-[#B30021] mb-4 relative mx-auto block w-fit">
          Programme Overview
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#FF6F61] w-full rounded-full"></span>
        </h2>

        {/* Description */}
        <p className="text-center text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
          The Online MBA Program is a two-year postgraduate degree offering dual
          specialization options, designed to prepare aspiring leaders and
          managers for dynamic global business environments. Open to graduates
          from any academic background, the program delivers an in-depth blend
          of management theory and practical application through an
          industry-aligned curriculum.
        </p>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-center mb-12 space-y-4 md:space-y-0 md:space-x-4">
          {["highlights", "learn", "pedagogy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 rounded-md text-lg font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#B30021] text-white shadow-lg scale-105"
                  : "bg-[#FFF1F1] text-[#B30021] hover:bg-[#B30021]/90 hover:text-white"
              }`}
            >
              {tab === "highlights"
                ? "Programme Highlights"
                : tab === "learn"
                ? "You Will Learn"
                : "Industry-Led Pedagogy"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "highlights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-[#FFD6D6]
                  transition-all duration-500 hover:shadow-xl hover:scale-105 hover:bg-[#FFF1F1]"
                >
                  <img
                    src={card.iconSrc}
                    alt={card.title}
                    className="w-16 h-16 mb-4 object-contain"
                  />
                  <h3 className="text-lg font-semibold text-[#B30021]">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === "learn" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {learnCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start text-left border border-[#FFD6D6]
                  transition-all duration-500 hover:shadow-xl hover:scale-105 hover:bg-[#FFF1F1]"
                >
                  <img
                    src={card.iconSrc}
                    alt={card.title}
                    className="w-12 h-12 mb-3 object-contain"
                  />
                  <h3 className="text-lg font-semibold text-[#B30021] mb-2">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pedagogy" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pedagogyCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start text-left border border-[#FFD6D6]
                  transition-all duration-500 hover:shadow-xl hover:scale-105 hover:bg-[#FFF1F1]"
                >
                  <img
                    src={card.iconSrc}
                    alt={card.title}
                    className="w-12 h-12 mb-3 object-contain"
                  />
                  <h3 className="text-lg font-semibold text-[#B30021] mb-2">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgrammeOverview;
