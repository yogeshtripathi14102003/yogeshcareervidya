// import React, { useState } from "react";

// // 🎓 Updated Curriculum Data
// const curriculumData = [
//   {
//     id: 1,
//     title: "Semester 1",
//     modules: [
//       "Business, Society, and Law",
//       "Financial Reporting and Analysis",
//       "Management Practices and Organizational Behavior",
//       "Decision Science",
//       "Managerial Economics",
//       "Marketing Management",
//       "Communication Skills",
//     ],
//   },
//   {
//     id: 2,
//     title: "Semester 2",
//     modules: [
//       "Human Resource Management",
//       "Supply Chain & Logistics Management",
//       "Consumer Psychology",
//       "Business Research Methods",
//       "Financial Management",
//       "Production & Operations Management",
//       "Professional Communication Skills - 1",
//     ],
//   },
//   {
//     id: 3,
//     title: "Semester 3",
//     modules: [
//       "Strategy, Business, and Globalization",
//       "Data Analysis for Business Decisions",
//       "Management Lessons from Ancient India",
//       "Elective as per Specialization",
//       "Elective as per Specialization",
//       "Elective as per Specialization",
//     ],
//   },
//   {
//     id: 4,
//     title: "Semester 4",
//     modules: [
//       "Project Management",
//       "Values and Ethics",
//       "Academic Research Writing / Industry Immersion / International Project / Social Outreach Initiatives / Case Writing / Rural Immersion",
//       "Elective as per Specialization",
//       "Elective as per Specialization",
//     ],
//   },
//   {
//     id: 5,
//     title: "Specialization",
//     modules: [
//       "Marketing",
//       "Human Resource Management (HRM)",
//       "International Business (IB)",
//       "Entrepreneurship",
//       "Finance",
//       "Disaster Management",
//       "Information Technology (IT)",
//       "Logistics & Supply Chain Management",
//       "Retail Management",
//       "Operations Management",
//       "Banking & Insurance",
//       "Hospital Management",
//       "Events Management",
//       "Travel & Tourism Management",
//       "Airlines & Airport Management",
//       "Digital Marketing",
//     ],
//   },
// ];

// const ProgrammeContent = () => {
//   const [openSemester, setOpenSemester] = useState(1);

//   const toggleSemester = (id) => {
//     setOpenSemester(openSemester === id ? null : id);
//   };

//   const getArrowRotation = (id) => {
//     return openSemester === id ? "rotate-180" : "rotate-0";
//   };

//   return (
//     <section className="py-20 bg-gradient-to-br from-[#E6F3FF] via-white to-[#FFF6EF]">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Title */}
//         <h2 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-10 relative inline-block w-fit mx-auto">
//           Programme Content
//           <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#F97316] rounded-full"></span>
//         </h2>

//         {/* Accordion */}
//         <div className="border border-[#1E3A8A]/30 rounded-2xl shadow-lg overflow-hidden bg-white">
//           {curriculumData.map((semester) => (
//             <div
//               key={semester.id}
//               className="border-b border-[#1E3A8A]/10 last:border-b-0"
//             >
//               {/* Accordion Header */}
//               <button
//                 onClick={() => toggleSemester(semester.id)}
//                 className={`w-full text-left p-5 flex justify-between items-center text-lg font-semibold transition-all duration-300 ${
//                   openSemester === semester.id
//                     ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md"
//                     : "bg-white text-[#1E3A8A] hover:bg-[#E6F3FF]"
//                 }`}
//               >
//                 {semester.title}
//                 <svg
//                   className={`w-6 h-6 transform transition-transform duration-300 ${getArrowRotation(
//                     semester.id
//                   )}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </button>

//               {/* Accordion Content */}
//               {openSemester === semester.id && (
//                 <div className="p-6 bg-white transition-all duration-500">
//                   <div className="flex flex-wrap gap-3">
//                     {semester.modules.map((module, index) => (
//                       <span
//                         key={index}
//                         className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#E6F3FF] to-[#FFF7E6] text-[#1E3A8A] rounded-lg border border-[#1E3A8A]/20 hover:border-[#F97316]/40 transition-colors"
//                       >
//                         {module}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Download Brochure Button */}
//         <div className="text-center mt-12">
//           <button className="bg-gradient-to-r from-[#FFA500] to-[#1E90FF] text-white text-lg font-semibold py-3 px-10 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
//             Download Brochure
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProgrammeContent;


import React, { useState } from "react";

const curriculumData = [
  {
    id: 1,
    title: "Semester 1",
    modules: [
      "Business, Society, and Law",
      "Financial Reporting and Analysis",
      "Management Practices and Organizational Behavior",
      "Decision Science",
      "Managerial Economics",
      "Marketing Management",
      "Communication Skills",
    ],
  },
  {
    id: 2,
    title: "Semester 2",
    modules: [
      "Human Resource Management",
      "Supply Chain & Logistics Management",
      "Consumer Psychology",
      "Business Research Methods",
      "Financial Management",
      "Production & Operations Management",
      "Professional Communication Skills - 1",
    ],
  },
  {
    id: 3,
    title: "Semester 3",
    modules: [
      "Strategy, Business, and Globalization",
      "Data Analysis for Business Decisions",
      "Management Lessons from Ancient India",
      "Elective as per Specialization",
      "Elective as per Specialization",
      "Elective as per Specialization",
    ],
  },
  {
    id: 4,
    title: "Semester 4",
    modules: [
      "Project Management",
      "Values and Ethics",
      "Academic Research Writing / Industry Immersion / International Project / Social Outreach Initiatives / Case Writing / Rural Immersion",
      "Elective as per Specialization",
      "Elective as per Specialization",
    ],
  },
  {
    id: 5,
    title: "Specialization",
    modules: [
      "Marketing",
      "Human Resource Management (HRM)",
      "International Business (IB)",
      "Entrepreneurship",
      "Finance",
      "Disaster Management",
      "Information Technology (IT)",
      "Logistics & Supply Chain Management",
      "Retail Management",
      "Operations Management",
      "Banking & Insurance",
      "Hospital Management",
      "Events Management",
      "Travel & Tourism Management",
      "Airlines & Airport Management",
      "Digital Marketing",
    ],
  },
];

const ProgrammeContent = () => {
  const [openSemester, setOpenSemester] = useState(1);
  const toggleSemester = (id) => setOpenSemester(openSemester === id ? null : id);
  const getArrowRotation = (id) => (openSemester === id ? "rotate-180" : "rotate-0");

  return (
    <section className="py-20 bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFF0F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center text-[#B30021] mb-10 relative inline-block w-fit mx-auto">
          Programme Content
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#FF6F61] rounded-full"></span>
        </h2>

        {/* Accordion */}
        <div className="border border-[#B30021]/30 rounded-2xl shadow-lg overflow-hidden bg-white">
          {curriculumData.map((semester) => (
            <div
              key={semester.id}
              className="border-b border-[#B30021]/10 last:border-b-0"
            >
              {/* Header */}
              <button
                onClick={() => toggleSemester(semester.id)}
                className={`w-full text-left p-5 flex justify-between items-center text-lg font-semibold transition-all duration-300 ${
                  openSemester === semester.id
                    ? "bg-gradient-to-r from-[#B30021] to-[#E11E26] text-white shadow-md"
                    : "bg-white text-[#B30021] hover:bg-[#FFF1F1]"
                }`}
              >
                {semester.title}
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${getArrowRotation(
                    semester.id
                  )}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {/* Content */}
              {openSemester === semester.id && (
                <div className="p-6 bg-white transition-all duration-500">
                  <div className="flex flex-wrap gap-3">
                    {semester.modules.map((module, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#FFF5F5] to-[#FFF0F0] text-[#B30021] rounded-lg border border-[#B30021]/20 hover:border-[#FF6F61]/40 transition-colors"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download Brochure */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#B30021] to-[#FF6F61] text-white text-lg font-semibold py-3 px-10 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
            Download Brochure
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProgrammeContent;
