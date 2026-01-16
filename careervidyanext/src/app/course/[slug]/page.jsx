// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import api from "@/utlis/api.js";
// import Detailsignup from "@/app/course/Detailsignup.jsx";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import Getintuch from "@/app/components/getintuch.jsx";
// // import Careervidyabenifit from "@/app/course/Careervidyabenifit";
// import Offerdcourse from "@/app/course/Offerdcourse.jsx";
// import Universitycompeney from "@/app/course/universitycompeney.jsx";
// import OnlineCourseEligibility from "@/app/course/OnlineCourseEligibility.jsx";
// import FeeStructure from "@/app/course/FeeStructure.jsx";
// import CourseWorthIt from "@/app/course/CourseWorthIt.jsx";
// import JobOpportunities from "@/app/course/JobOpportunities.jsx";
// import TopRecruiters from "@/app/course/TopRecruiters.jsx";
// import CourseKeyHighlights from "@/app/course/CourseKeyHighlights.jsx";
// import CourseOverview from "@/app/course/CourseOverview.jsx";
// import  Universityappro from "@/app/course/Universityappro.jsx";
// import DiscountPopup from "@/app/components/DiscountPopup";
// import Studentimageslider from "@/app/components/Studentimageslider.jsx";
// import LogoSlider from "@/app/components/LogoSlider.jsx";
// export default function CourseDetailPage() {
//   const { slug } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!slug) return;
//     const fetchCourse = async () => {
//       try {
//         const res = await api.get(`/api/v1/course/slug/${slug}`);
//         setCourse(res.data.course);
//       } catch (err) {
//         console.error("❌ Error fetching course:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [slug]);

//   if (loading) return <p className="p-8 text-center">Loading...</p>;
//   if (!course)
//     return (
//       <p className="p-8 text-center text-red-500">
//         ❌ Course not found — please check the slug route.
//       </p>
//     );

//   return (
//     <>
//       <Header />

//       <main className="min-h-screen bg-white">
        
// {/* OVERVIEW SECTION */}
// {course?.overview?.length > 0 && (
//   <CourseOverview course={course} />
// )}
// {/* WHY CHOOSE US - NO-CROP IMAGE STYLE */}
// {course.whyChooseUs?.length > 0 && (
//   <section className="relative w-full py-12 bg-white overflow-hidden">
//     {/* Width increased to 1800px as requested */}
//     <div className="max-w-[1800px] w-full px-6 mx-auto">
      
//       {/* Heading */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl md:text-2xl font-black text-[#002147] mb-3">
//           Why {course.name}
//         </h2>
//         <div className="w-16 h-1 bg-[#002147] mx-auto rounded-full"></div>
//       </div>

//       {/* Main Content Container */}
//       <div className="space-y-8">
//         {course.whyChooseUs.map((item, i) => (
//           <div 
//             key={i} 
//             className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
//               i % 2 !== 0 ? "lg:flex-row-reverse" : ""
//             }`}
//           >
//             {/* TEXT CONTENT */}
//             <div className="w-full lg:w-1/2 flex flex-col justify-center py-2">
//               <div className="relative">
//                 <span className="absolute -top-8 -left-6 text-7xl text-slate-100 font-serif leading-none select-none -z-10">“</span>
//                 <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify font-medium">
//                   {item.description}
//                 </p>
//               </div>
              
//               <div className="mt-4 flex items-center gap-4 text-[#002147] font-bold">
//                 <span className="h-[2px] w-10 bg-[#002147]"></span>
//                 <span className="uppercase text-[10px] tracking-widest">Career Vidya Excellence</span>
//               </div>
//             </div>

//             {/* IMAGE BLOCK */}
//             {item.image?.url && (
//               <div className="w-full lg:w-1/2 group">
//                 <div className="relative h-[250px] md:h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
//                   <img
//                     src={item.image.url}
//                     alt="Why Choose Us"
//                     className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// )}


// <Universitycompeney />


// {/* {Array.isArray(course.universities) &&
//   course.universities.length > 0 && (
//     <Universityappro
//       universities={course.universities}
//       courseName={course.name}   // 👈 slug se aaya hua course name
//     />
// )} */}

// {/* PROGRAM HIGHLIGHTS - FULL WIDTH BG WITH HOVER GRADIENT CARDS */}
// {course.goodThings?.length > 0 && (
//   <section className="w-full py-16 bg-white border-t border-slate-100">
//     <div className="max-w-[1800px] mx-auto px-6 md:px-12">

//       {/* Header */}
//       <div className="mb-10 border-b border-slate-100 pb-6">
//         <h2 className="text-3xl md:text-3xl font-bold text-[#002147] text-center tracking-tight">
//           Key Highlights
//         </h2>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
//         {course.goodThings.map((g, i) => (
//           <div
//             key={i}
//             className="
//               group
//               relative
//               p-8
//               rounded-2xl
//               border border-slate-200
//               bg-white
//               transition-all duration-300
//               flex flex-col h-full

//               hover:bg-gradient-to-br
//               hover:from-[#eef5ff]
//               hover:to-white
//               hover:border-[#2f6fed]
//               hover:shadow-[0_12px_32px_rgba(47,111,237,0.18)]
//             "
//           >
//             {/* Inner glow border (image style) */}
//             <div
//               className="
//                 pointer-events-none
//                 absolute inset-0
//                 rounded-2xl
//                 opacity-0
//                 group-hover:opacity-100
//                 transition-opacity duration-300
//                 ring-1 ring-[#2f6fed]/40
//               "
//             />

//             <div className="relative flex flex-col gap-4">
//               {/* Feature Label */}
//               <div className="flex items-center">
//                 <span className="text-[15px] font-bold text-black">
//                   Feature {i + 1}
//                 </span>
//               </div>

//               {/* Description */}
//               <p className="text-[#002147] text-[16px] leading-relaxed font-normal">
//                 {g}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   </section>
// )}






//         <Detailsignup />

      

//       {/* KEY HIGHLIGHTS - FULL WIDTH 100% */}
// {course?.keyHighlights?.length > 0 && (
//   <CourseKeyHighlights course={course} />
// )}


// {/* SYLLABUS SECTION - FORCED LIGHT MODE */}
// {course.syllabus?.length > 0 && (
//   <section className="mt-10 w-full flex justify-center bg-white py-10">
//     <div className="w-full max-w-[1800px] px-4 md:px-10">
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
//         <h2 className="text-2xl md:text-2xl font-extrabold mb-8 text-center text-[#002D62]">
//           Course Subjects / Syllabus
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300 bg-white">
//             <thead>
//               <tr className="bg-[#002D62] text-white">
//                 <th colSpan={2} className="text-center py-4 text-lg font-semibold border border-[#002D62]">
//                   Comprehensive Course Syllabus
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {[0, 2, 4, 6].map((startIndex, rowIndex) => {
//                 const sem1 = course.syllabus[startIndex];
//                 const sem2 = course.syllabus[startIndex + 1];
//                 if (!sem1 && !sem2) return null;
//                 return (
//                   <React.Fragment key={rowIndex}>
//                     <tr className="bg-gray-50">
//                       <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">
//                         {sem1?.semester || "N/A"}
//                       </th>
//                       <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">
//                         {sem2?.semester || "N/A"}
//                       </th>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 p-6 align-top bg-white">
//                         {sem1 && (
//                           <ul className="list-disc ml-5 space-y-2 text-gray-700">
//                             {sem1.subjects.map((sub, j) => (
//                               <li key={j} className="text-[13px] md:text-sm font-medium leading-tight">
//                                 {sub}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </td>
//                       <td className="border border-gray-300 p-6 align-top bg-white">
//                         {sem2 && (
//                           <ul className="list-disc ml-5 space-y-2 text-gray-700">
//                             {sem2.subjects.map((sub, j) => (
//                               <li key={j} className="text-[13px] md:text-sm font-medium leading-tight">
//                                 {sub}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </td>
//                     </tr>
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </section>
// )}


// {Array.isArray(course?.specializations) && course.specializations.length > 0 ? (
//   <section className="mt-10 w-full flex justify-center bg-white py-10">
//     <div className="w-full max-w-[1600px] px-4 md:px-10">
//       {/* Header - Forced Dark Blue */}
//       <h2 className="text-2xl md:text-2xl font-bold mb-8 text-[#002147]">
//         Top Specializations for Online {course.courseName}
//       </h2>

//       {/* Grid Layout - 1600px wide */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
//         {course.specializations.map((sp, i) => (
//           <div
//             key={i}
//             className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#1E90FF] transition-all cursor-pointer group"
//           >
//             {/* Text - Forced Black Visibility */}
//             <span className="text-gray-900 font-bold text-sm md:text-base pr-3 leading-tight">
//               {sp}
//             </span>

//             {/* New Arrow Icon - Blue Background */}
//             <span className="w-9 h-9 min-w-[36px] bg-[#1E90FF] group-hover:bg-[#002147] text-white rounded-full flex justify-center items-center transition-all shadow-md">
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 width="20" 
//                 height="20" 
//                 viewBox="0 0 24 24" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 strokeWidth="3" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               >
//                 <path d="m9 18 6-6-6-6"/>
//               </svg>
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// ) : (
//   <></>
// )}


//         {/* OFFERED COURSES */}
//         <div id="offered-courses" className="mt-10 bg-white">
//           <Offerdcourse 
//             offeredCourses={course.offeredCourses}
//             courseName={course.name}
//           />
//         </div>

//         {course.onlineEligibility?.length > 0 && (
//           <OnlineCourseEligibility onlineEligibility={course.onlineEligibility} />
//         )}






//         {(course.feeStructureSidebar?.length > 0 || course.detailedFees?.length > 0) && (
//           <FeeStructure 
//             courseTitle={course.name}
//             feeStructureSidebar={course.feeStructureSidebar}
//             detailedFees={course.detailedFees}
//           />
//         )}

//         {course.onlineCourseWorthIt && (
//           <CourseWorthIt
//             onlineCourseWorthIt={course.onlineCourseWorthIt}
//             courseTitle={course.name}
//           />
//         )}

//         {course.jobOpportunities?.length > 0 && (
//           <JobOpportunities
//             jobOpportunities={course.jobOpportunities}
//             courseTitle={course.name}
//           />
//         )}


//         {course.topRecruiters?.length > 0 && (
//           <TopRecruiters
//             topRecruiters={course.topRecruiters}
//             courseTitle={course.name}
//           />
//         )}

//       </main>

//       {/* <Careervidyabenifit /> */}
//        <Studentimageslider />
      
//    <LogoSlider />
//    <Getintuch />
  
//       <Footer />
//       <DiscountPopup />
//     </>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Detailsignup from "@/app/course/Detailsignup.jsx";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Getintuch from "@/app/components/getintuch.jsx";
// import Careervidyabenifit from "@/app/course/Careervidyabenifit";
import Offerdcourse from "@/app/course/Offerdcourse.jsx";
import Universitycompeney from "@/app/course/universitycompeney.jsx";
import OnlineCourseEligibility from "@/app/course/OnlineCourseEligibility.jsx";
import FeeStructure from "@/app/course/FeeStructure.jsx";
import CourseWorthIt from "@/app/course/CourseWorthIt.jsx";
import JobOpportunities from "@/app/course/JobOpportunities.jsx";
import TopRecruiters from "@/app/course/TopRecruiters.jsx";
import CourseKeyHighlights from "@/app/course/CourseKeyHighlights.jsx";
import CourseOverview from "@/app/course/CourseOverview.jsx";
import Universityappro from "@/app/course/Universityappro.jsx";
import DiscountPopup from "@/app/components/DiscountPopup";
import Studentimageslider from "@/app/components/Studentimageslider.jsx";
import LogoSlider from "@/app/components/LogoSlider.jsx";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Slugs for which Universitycompeney should NOT render
  const skipUniversityCompSlugs = [
    "mtech-master-of-technology",
    "btech-bachelors-of-technology",
  ];

  useEffect(() => {
    if (!slug) return;
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/v1/course/slug/${slug}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (!course)
    return (
      <p className="p-8 text-center text-red-500">
        ❌ Course not found — please check the slug route.
      </p>
    );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* OVERVIEW SECTION */}
        {course?.overview?.length > 0 && <CourseOverview course={course} />}

        {/* WHY CHOOSE US - NO-CROP IMAGE STYLE */}
        {course.whyChooseUs?.length > 0 && (
          <section className="relative w-full py-12 bg-white overflow-hidden">
            <div className="max-w-[1800px] w-full px-6 mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-2xl font-black text-[#002147] mb-3">
                  Why {course.name}
                </h2>
                <div className="w-16 h-1 bg-[#002147] mx-auto rounded-full"></div>
              </div>

              <div className="space-y-8">
                {course.whyChooseUs.map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                      i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-2">
                      <div className="relative">
                        <span className="absolute -top-8 -left-6 text-7xl text-slate-100 font-serif leading-none select-none -z-10">
                          “
                        </span>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify font-medium">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-[#002147] font-bold">
                        <span className="h-[2px] w-10 bg-[#002147]"></span>
                        <span className="uppercase text-[10px] tracking-widest">
                          Career Vidya Excellence
                        </span>
                      </div>
                    </div>

                    {item.image?.url && (
                      <div className="w-full lg:w-1/2 group">
                        <div className="relative h-[250px] md:h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                          <img
                            src={item.image.url}
                            alt="Why Choose Us"
                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* UNIVERSITY COMPANY - CONDITIONAL */}
        {!skipUniversityCompSlugs.includes(slug) && <Universitycompeney />}

        {/* PROGRAM HIGHLIGHTS */}
        {course.goodThings?.length > 0 && (
          <section className="w-full py-16 bg-white border-t border-slate-100">
            <div className="max-w-[1800px] mx-auto px-6 md:px-12">
              <div className="mb-10 border-b border-slate-100 pb-6">
                <h2 className="text-3xl md:text-3xl font-bold text-[#002147] text-center tracking-tight">
                  Key Highlights
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {course.goodThings.map((g, i) => (
                  <div
                    key={i}
                    className="
                      group
                      relative
                      p-8
                      rounded-2xl
                      border border-slate-200
                      bg-white
                      transition-all duration-300
                      flex flex-col h-full
                      hover:bg-gradient-to-br
                      hover:from-[#eef5ff]
                      hover:to-white
                      hover:border-[#2f6fed]
                      hover:shadow-[0_12px_32px_rgba(47,111,237,0.18)]
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute inset-0
                        rounded-2xl
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity duration-300
                        ring-1 ring-[#2f6fed]/40
                      "
                    />
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-center">
                        <span className="text-[15px] font-bold text-black">
                          Feature {i + 1}
                        </span>
                      </div>
                      <p className="text-[#002147] text-[16px] leading-relaxed font-normal">
                        {g}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Detailsignup />

        {course?.keyHighlights?.length > 0 && (
          <CourseKeyHighlights course={course} />
        )}

        {course.syllabus?.length > 0 && (
          <section className="mt-10 w-full flex justify-center bg-white py-10">
            <div className="w-full max-w-[1800px] px-4 md:px-10">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-2xl font-extrabold mb-8 text-center text-[#002D62]">
                  Course Subjects / Syllabus
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                      <tr className="bg-[#002D62] text-white">
                        <th
                          colSpan={2}
                          className="text-center py-4 text-lg font-semibold border border-[#002D62]"
                        >
                          Comprehensive Course Syllabus
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {[0, 2, 4, 6].map((startIndex, rowIndex) => {
                        const sem1 = course.syllabus[startIndex];
                        const sem2 = course.syllabus[startIndex + 1];
                        if (!sem1 && !sem2) return null;
                        return (
                          <React.Fragment key={rowIndex}>
                            <tr className="bg-gray-50">
                              <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">
                                {sem1?.semester || "N/A"}
                              </th>
                              <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">
                                {sem2?.semester || "N/A"}
                              </th>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-6 align-top bg-white">
                                {sem1 && (
                                  <ul className="list-disc ml-5 space-y-2 text-gray-700">
                                    {sem1.subjects.map((sub, j) => (
                                      <li
                                        key={j}
                                        className="text-[13px] md:text-sm font-medium leading-tight"
                                      >
                                        {sub}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                              <td className="border border-gray-300 p-6 align-top bg-white">
                                {sem2 && (
                                  <ul className="list-disc ml-5 space-y-2 text-gray-700">
                                    {sem2.subjects.map((sub, j) => (
                                      <li
                                        key={j}
                                        className="text-[13px] md:text-sm font-medium leading-tight"
                                      >
                                        {sub}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {Array.isArray(course?.specializations) &&
        course.specializations.length > 0 ? (
          <section className="mt-10 w-full flex justify-center bg-white py-10">
            <div className="w-full max-w-[1600px] px-4 md:px-10">
              <h2 className="text-2xl md:text-2xl font-bold mb-8 text-[#002147]">
                Top Specializations for Online {course.courseName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {course.specializations.map((sp, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#1E90FF] transition-all cursor-pointer group"
                  >
                    <span className="text-gray-900 font-bold text-sm md:text-base pr-3 leading-tight">
                      {sp}
                    </span>

                    <span className="w-9 h-9 min-w-[36px] bg-[#1E90FF] group-hover:bg-[#002147] text-white rounded-full flex justify-center items-center transition-all shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* OFFERED COURSES */}
        <div id="offered-courses" className="mt-10 bg-white">
          <Offerdcourse
            offeredCourses={course.offeredCourses}
            courseName={course.name}
          />
        </div>

        {course.onlineEligibility?.length > 0 && (
          <OnlineCourseEligibility onlineEligibility={course.onlineEligibility} />
        )}

        {(course.feeStructureSidebar?.length > 0 || course.detailedFees?.length > 0) && (
          <FeeStructure
            courseTitle={course.name}
            feeStructureSidebar={course.feeStructureSidebar}
            detailedFees={course.detailedFees}
          />
        )}

        {course.onlineCourseWorthIt && (
          <CourseWorthIt
            onlineCourseWorthIt={course.onlineCourseWorthIt}
            courseTitle={course.name}
          />
        )}

        {course.jobOpportunities?.length > 0 && (
          <JobOpportunities
            jobOpportunities={course.jobOpportunities}
            courseTitle={course.name}
          />
        )}

        {course.topRecruiters?.length > 0 && (
          <TopRecruiters topRecruiters={course.topRecruiters} courseTitle={course.name} />
        )}
      </main>

      {/* <Careervidyabenifit /> */}
      <Studentimageslider />
      <LogoSlider />
      <Getintuch />
      <Footer />
      <DiscountPopup />
    </>
  );
}
