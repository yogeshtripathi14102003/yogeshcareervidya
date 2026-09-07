// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import { startCourseView, endCourseView } from "@/utlis/analytics.js";
// import Detailsignup from "@/app/course/Detailsignup.jsx";
// import Getintuch from "@/app/components/getintuch.jsx";
// import Offerdcourse from "@/app/course/Offerdcourse.jsx";
// import Universitycompeney from "@/app/course/universitycompeney.jsx";
// import OnlineCourseEligibility from "@/app/course/OnlineCourseEligibility.jsx";
// import FeeStructure from "@/app/course/FeeStructure.jsx";
// import CourseWorthIt from "@/app/course/CourseWorthIt.jsx";
// import JobOpportunities from "@/app/course/JobOpportunities.jsx";
// import TopRecruiters from "@/app/course/TopRecruiters.jsx";
// import CourseKeyHighlights from "@/app/course/CourseKeyHighlights.jsx";
// import CourseOverview from "@/app/course/CourseOverview.jsx";
// import DiscountPopup from "@/app/components/DiscountPopup";
// import Studentimageslider from "@/app/components/Studentimageslider.jsx";
// // import LogoSlider from "@/app/components/LogoSlider.jsx";

// export default function CourseDetailClient({ course }) {
//   useEffect(() => {
//     startCourseView({ courseId: course?._id, courseSlug: course?.slug });
//     return () => {
//       endCourseView();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [course?._id]);

//   const skipUniversityCompSlugs = [
//     "mtech-master-of-technology",
//     "btech-bachelors-of-technology",

//     "1-year-online-mba",

//   ];
//   const skipDetailSignupSlugs = [
//     "mtech-master-of-technology",
//     "btech-bachelors-of-technology",
//     "1-year-online-mba",
//   ];

//   return (
//     <>
//       <Header />
//       <style jsx global>{`
//         * {
//           user-select: none;
//           -webkit-user-select: none;
//           -ms-user-select: none;
//         }
//       `}</style>

//       <main className="min-h-screen bg-white">
//          {!skipDetailSignupSlugs.includes(course?.slug) && <Detailsignup />}
//         {/* OVERVIEW SECTION */}
//         {course?.overview?.length > 0 && <CourseOverview course={course} />}

//         {/* WHY CHOOSE US */}
//         {course?.whyChooseUs?.length > 0 && (
//           <section className="relative w-full py-12 bg-white overflow-hidden">
//             <div className="max-w-[1800px] w-full px-6 mx-auto">
//               <div className="text-center mb-8">
//                 <h2 className="text-3xl md:text-2xl font-black text-[#002147] mb-3">
//                   Why {course.name} ?
//                 </h2>
//                 <div className="w-16 h-1 bg-[#002147] mx-auto rounded-full"></div>
//               </div>

//               <div className="space-y-8">
//                 {course.whyChooseUs.map((item, i) => (
//                   <div
//                     key={i}
//                     className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
//                       i % 2 !== 0 ? "lg:flex-row-reverse" : ""
//                     }`}
//                   >
//                     <div className="w-full lg:w-1/2 flex flex-col justify-center py-2">
//                       <div className="relative">
//                         <span className="absolute -top-8 -left-6 text-7xl text-slate-100 font-serif leading-none select-none -z-10">“</span>
//                         <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify font-medium">
//                           {item.description}
//                         </p>
//                       </div>
//                       <div className="mt-4 flex items-center gap-4 text-[#002147] font-bold">
//                         <span className="h-[2px] w-10 bg-[#002147]"></span>
//                         <span className="uppercase text-[10px] tracking-widest">Career Vidya Excellence</span>
//                       </div>
//                     </div>
//                     {item.image?.url && (
//                       <div className="w-full lg:w-1/2 group">
//                         <div className="relative h-[250px] md:h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
//                           <Image src={item.image.url} alt="Why Choose Us" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* UNIVERSITY COMPANY */}
//         {!skipUniversityCompSlugs.includes(course?.slug) && <Universitycompeney />}

//         {/* GOOD THINGS / HIGHLIGHTS */}
//         {course?.goodThings?.length > 0 && (
//           <section className="w-full py-16 bg-white border-t border-slate-100">
//             <div className="max-w-[1800px] mx-auto px-6 md:px-12">
//               <div className="mb-10 border-b border-slate-100 pb-6">
//                 <h2 className="text-3xl font-bold text-[#002147] text-center tracking-tight">
//                   {course.courseName} Program Highlights
//                 </h2>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 items-start">
//                 {course.goodThings.map((g, i) => (
//                   <div key={i} className="group relative p-8 rounded-2xl border border-slate-200 bg-white transition-all duration-300 flex flex-col hover:border-[#2f6fed] hover:shadow-lg">
//                     <div className="relative flex flex-col gap-4">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-[13px] font-bold text-blue-600 uppercase tracking-widest">Key Advantage {i + 1}</h3>
//                       </div>
//                       <p className="text-[#002147] text-[16px] leading-relaxed font-normal text-left">{g}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {!skipDetailSignupSlugs.includes(course?.slug) && <Detailsignup />}

//         {course?.keyHighlights?.length > 0 && <CourseKeyHighlights course={course} />}

//         {/* SYLLABUS TABLE */}
//         {course?.syllabus?.length > 0 && (
//           <section className="mt-10 w-full flex justify-center bg-white py-10">
//             <div className="w-full max-w-[1800px] px-4 md:px-10">
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
//                 <h2 className="text-2xl md:text-2xl font-extrabold mb-8 text-center text-[#002D62]">Course Subjects / Syllabus</h2>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse border border-gray-300 bg-white">
//                     <thead>
//                       <tr className="bg-[#002D62] text-white">
//                         <th colSpan={2} className="text-center py-4 text-lg font-semibold border border-[#002D62]">Comprehensive Course Syllabus</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {[0, 2, 4, 6].map((startIndex, rowIndex) => {
//                         const sem1 = course.syllabus[startIndex];
//                         const sem2 = course.syllabus[startIndex + 1];
//                         if (!sem1 && !sem2) return null;
//                         return (
//                           <React.Fragment key={rowIndex}>
//                             <tr className="bg-gray-50">
//                               <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">{sem1?.semester || "N/A"}</th>
//                               <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">{sem2?.semester || "N/A"}</th>
//                             </tr>
//                             <tr>
//                               <td className="border border-gray-300 p-6 align-top bg-white">
//                                 {sem1 && <ul className="list-disc ml-5 space-y-2 text-gray-700">{sem1.subjects.map((sub, j) => <li key={j} className="text-[13px] md:text-sm font-medium">{sub}</li>)}</ul>}
//                               </td>
//                               <td className="border border-gray-300 p-6 align-top bg-white">
//                                 {sem2 && <ul className="list-disc ml-5 space-y-2 text-gray-700">{sem2.subjects.map((sub, j) => <li key={j} className="text-[13px] md:text-sm font-medium">{sub}</li>)}</ul>}
//                               </td>
//                             </tr>
//                           </React.Fragment>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* SPECIALIZATIONS */}
//         {Array.isArray(course?.specializations) && course.specializations.length > 0 && (
//           <section className="mt-10 w-full flex justify-center bg-white py-10">
//             <div className="w-full max-w-[1600px] px-4 md:px-10">
//               <h2 className="text-2xl md:text-2xl font-bold mb-8 text-[#002147]">Top Specializations for {course.name}</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
//                 {course.specializations.map((sp, i) => (
//                   <div key={i} className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#1E90FF] transition-all cursor-pointer group">
//                     <span className="text-gray-900 font-bold text-sm md:text-base pr-3 leading-tight">{sp}</span>
//                     <span className="w-9 h-9 min-w-[36px] bg-[#1E90FF] group-hover:bg-[#002147] text-white rounded-full flex justify-center items-center transition-all shadow-md">→</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         <Offerdcourse offeredCourses={course.offeredCourses} courseName={course.name} />
//         {course.onlineEligibility?.length > 0 && <OnlineCourseEligibility onlineEligibility={course.onlineEligibility} />}
//         {(course.feeStructureSidebar?.length > 0 || course.detailedFees?.length > 0) && <FeeStructure courseTitle={course.name} feeStructureSidebar={course.feeStructureSidebar} detailedFees={course.detailedFees} />}
//         {course.onlineCourseWorthIt && <CourseWorthIt onlineCourseWorthIt={course.onlineCourseWorthIt} courseTitle={course.name} />}
//         {course.jobOpportunities?.length > 0 && <JobOpportunities jobOpportunities={course.jobOpportunities} courseTitle={course.name} />}
//         {course.topRecruiters?.length > 0 && <TopRecruiters topRecruiters={course.topRecruiters} courseTitle={course.name} />}
//       </main>

//       <Studentimageslider />
//       {/* <LogoSlider /> */}
//       <Getintuch />
//       <Footer />
//       <DiscountPopup />
//     </>
//   );
// }
"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";

import {
  startCourseView,
  endCourseView,
} from "@/utlis/analytics.js";

import Detailsignup from "@/app/course/Detailsignup.jsx";
import Getintuch from "@/app/components/getintuch.jsx";
import Offerdcourse from "@/app/course/Offerdcourse.jsx";
import Universitycompeney from "@/app/course/universitycompeney.jsx";
import OnlineCourseEligibility from "@/app/course/OnlineCourseEligibility.jsx";
import FeeStructure from "@/app/course/FeeStructure.jsx";
import CourseWorthIt from "@/app/course/CourseWorthIt.jsx";
import JobOpportunities from "@/app/course/JobOpportunities.jsx";
import TopRecruiters from "@/app/course/TopRecruiters.jsx";
import CourseKeyHighlights from "@/app/course/CourseKeyHighlights.jsx";
import CourseOverview from "@/app/course/CourseOverview.jsx";
import DiscountPopup from "@/app/components/DiscountPopup";
import Studentimageslider from "@/app/components/Studentimageslider.jsx";
import Careervidyabenifit from "@/app/course/Careervidyabenifit.jsx";

// ======================================================
// HTML ENTITY DECODER
// SSR + CLIENT SAFE
// No document/window usage
// ======================================================

function decodeHtmlEntities(value) {
  if (typeof value !== "string") {
    return value;
  }

  let result = value;

  for (let i = 0; i < 3; i++) {
    const decoded = result.replace(
      /&(#x?[0-9a-f]+|nbsp|amp|lt|gt|quot|apos|#39|#160);/gi,
      (match, entity) => {
        const lower = entity.toLowerCase();

        // Common HTML entities
        if (lower === "nbsp" || lower === "#160") {
          return " ";
        }

        if (lower === "amp") {
          return "&";
        }

        if (lower === "lt") {
          return "<";
        }

        if (lower === "gt") {
          return ">";
        }

        if (lower === "quot") {
          return '"';
        }

        if (lower === "apos" || lower === "#39") {
          return "'";
        }

        // Hexadecimal numeric entity
        if (lower.startsWith("#x")) {
          const code = parseInt(lower.substring(2), 16);

          if (!Number.isNaN(code)) {
            return String.fromCodePoint(code);
          }
        }

        // Decimal numeric entity
        if (lower.startsWith("#")) {
          const code = parseInt(lower.substring(1), 10);

          if (!Number.isNaN(code)) {
            return String.fromCodePoint(code);
          }
        }

        return match;
      }
    );

    if (decoded === result) {
      break;
    }

    result = decoded;
  }

  return result;
}

// ======================================================
// RICH TEXT -> NORMAL TEXT
//
// Handles:
// <p>...</p>
// <strong>...</strong>
// <b>...</b>
// <br>
// <ul>
// <ol>
// <li>
// &nbsp;
// encoded HTML
// ======================================================

function normalizeRichText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value !== "string") {
    return value;
  }

  let text = value;

  // Decode entities first
  text = decodeHtmlEntities(text);

  // Convert common HTML structures into readable text
  text = text
    // Paragraphs
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")

    // Divs
    .replace(/<\/div>\s*<div[^>]*>/gi, "\n")

    // Line breaks
    .replace(/<br\s*\/?>/gi, "\n")

    // List items
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")

    // Tables
    .replace(/<\/td>\s*<td[^>]*>/gi, " | ")
    .replace(/<\/th>\s*<th[^>]*>/gi, " | ")
    .replace(/<\/tr>/gi, "\n");

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Decode again because HTML may have been encoded multiple times
  text = decodeHtmlEntities(text);

  // Replace non-breaking spaces
  text = text.replace(/\u00a0/g, " ");

  // Normalize spaces
  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

// ======================================================
// NORMALIZE OVERVIEW
//
// Supports both:
//
// OLD:
// "The executive One Year MBA..."
//
// NEW EDITOR DATA:
// "<p>The&nbsp;executive&nbsp;<strong>One&nbsp;Year...</strong></p>"
// ======================================================

function normalizeOverview(overview) {
  if (!Array.isArray(overview)) {
    return overview;
  }

  return overview.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }

    return {
      ...item,

      heading:
        typeof item.heading === "string"
          ? normalizeRichText(item.heading)
          : item.heading,

      subHeading:
        typeof item.subHeading === "string"
          ? normalizeRichText(item.subHeading)
          : item.subHeading,

      description:
        typeof item.description === "string"
          ? normalizeRichText(item.description)
          : item.description,

      subDescription:
        typeof item.subDescription === "string"
          ? normalizeRichText(item.subDescription)
          : item.subDescription,
    };
  });
}

// ======================================================
// NORMALIZE WHY CHOOSE US
//
// This also protects this section if editor data
// has been saved there later.
// ======================================================

function normalizeWhyChooseUs(data) {
  if (!Array.isArray(data)) {
    return data;
  }

  return data.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }

    return {
      ...item,

      description:
        typeof item.description === "string"
          ? normalizeRichText(item.description)
          : item.description,

      heading:
        typeof item.heading === "string"
          ? normalizeRichText(item.heading)
          : item.heading,

      subHeading:
        typeof item.subHeading === "string"
          ? normalizeRichText(item.subHeading)
          : item.subHeading,
    };
  });
}

// ======================================================
// COMPONENT
// ======================================================

export default function CourseDetailClient({ course }) {
  useEffect(() => {
    startCourseView({
      courseId: course?._id,
      courseSlug: course?.slug,
    });

    console.log(
      "Careervidyabenifit data:",
      course?.Careervidyabenifit
    );

    return () => {
      endCourseView();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?._id]);

  // ====================================================
  // SKIP RULES
  // ====================================================

  const skipUniversityCompSlugs = [
    "mtech-master-of-technology",
    "btech-bachelors-of-technology",
    "1-year-online-mba",
  ];

  const skipDetailSignupSlugs = [
    "mtech-master-of-technology",
    "btech-bachelors-of-technology",
    "1-year-online-mba",
  ];

  // ====================================================
  // PREPARE SAFE COURSE DATA
  // ====================================================

  const normalizedOverview = normalizeOverview(
    course?.overview
  );

  const normalizedWhyChooseUs = normalizeWhyChooseUs(
    course?.whyChooseUs
  );

  const safeCourse = {
    ...course,

    overview: normalizedOverview,

    whyChooseUs: normalizedWhyChooseUs,
  };

  return (
    <>
      <Header />

      {/* =================================================
          GLOBAL CSS
      ================================================== */}

      <style jsx global>{`
        * {
          user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }

        /*
          Prevent long database content from breaking
          the existing layout.
        */

        .course-content-safe {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
        }

        /*
          Images inside dynamic content
        */

        .course-content-safe img {
          max-width: 100%;
          height: auto;
        }

        /*
          Mobile protection
        */

        @media (max-width: 640px) {
          .course-content-safe {
            max-width: 100%;
            overflow-wrap: anywhere;
            word-break: break-word;
          }
        }
      `}</style>

      <main className="min-h-screen bg-white">

        {/* =================================================
            SEO PRIMARY H1
        ================================================== */}

        <h1 className="sr-only">
          {course?.name}
        </h1>

        {/* =================================================
            DETAIL SIGNUP
        ================================================== */}

        {!skipDetailSignupSlugs.includes(course?.slug) && (
          <Detailsignup />
        )}

        {/* =================================================
            OVERVIEW
        ================================================== */}

        {normalizedOverview?.length > 0 && (
          <div className="course-content-safe">
            <CourseOverview
              course={safeCourse}
            />
          </div>
        )}

        {/* =================================================
            WHY CHOOSE US
        ================================================== */}

        {normalizedWhyChooseUs?.length > 0 && (
          <section className="relative w-full py-12 bg-white overflow-hidden">

            <div className="max-w-[1800px] w-full px-6 mx-auto">

              <div className="text-center mb-8">

                <h2 className="text-3xl md:text-2xl font-black text-[#002147] mb-3">
                  Why {course?.name} ?
                </h2>

                <div className="w-16 h-1 bg-[#002147] mx-auto rounded-full" />

              </div>

              <div className="space-y-8">

                {normalizedWhyChooseUs.map(
                  (item, i) => (

                    <div
                      key={i}
                      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                        i % 2 !== 0
                          ? "lg:flex-row-reverse"
                          : ""
                      }`}
                    >

                      {/* TEXT */}

                      <div className="w-full lg:w-1/2 flex flex-col justify-center py-2 min-w-0">

                        <div className="relative min-w-0">

                          <span className="absolute -top-8 -left-6 text-7xl text-slate-100 font-serif leading-none select-none -z-10">
                            “
                          </span>

                          <p className="course-content-safe text-gray-600 text-sm md:text-base leading-relaxed text-justify font-medium">
                            {item?.description || ""}
                          </p>

                        </div>

                        <div className="mt-4 flex items-center gap-4 text-[#002147] font-bold">

                          <span className="h-[2px] w-10 bg-[#002147]" />

                          <span className="uppercase text-[10px] tracking-widest">
                            Career Vidya Excellence
                          </span>

                        </div>

                      </div>

                      {/* IMAGE */}

                      {item?.image?.url && (
                        <div className="w-full lg:w-1/2 group min-w-0">

                          <div className="relative h-[250px] md:h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">

                            <Image
                              src={item.image.url}
                              alt="Why Choose Us"
                              fill
                              sizes="(min-width: 1024px) 50vw, 100vw"
                              className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                            />

                          </div>

                        </div>
                      )}

                    </div>

                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            UNIVERSITY COMPANY
        ================================================== */}

        {!skipUniversityCompSlugs.includes(course?.slug) && (
          <Universitycompeney />
        )}

        {/* =================================================
            GOOD THINGS / HIGHLIGHTS
        ================================================== */}

        {course?.goodThings?.length > 0 && (

          <section className="w-full py-16 bg-white border-t border-slate-100">

            <div className="max-w-[1800px] mx-auto px-6 md:px-12">

              <div className="mb-10 border-b border-slate-100 pb-6">

                <h2 className="text-3xl font-bold text-[#002147] text-center tracking-tight">
                  {course?.name} Program Highlights
                </h2>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 items-start">

                {course.goodThings.map(
                  (g, i) => (

                    <div
                      key={i}
                      className="group relative p-8 rounded-2xl border border-slate-200 bg-white transition-all duration-300 flex flex-col hover:border-[#2f6fed] hover:shadow-lg"
                    >

                      <div className="relative flex flex-col gap-4">

                        <div className="flex items-center justify-between">

                          <h3 className="text-[13px] font-bold text-blue-600 uppercase tracking-widest">
                            Key Advantage {i + 1}
                          </h3>

                        </div>

                        <p className="text-[#002147] text-[16px] leading-relaxed font-normal text-left break-words">
                          {typeof g === "string"
                            ? normalizeRichText(g)
                            : g}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            SECOND DETAIL SIGNUP
        ================================================== */}

        {!skipDetailSignupSlugs.includes(course?.slug) && (
          <Detailsignup />
        )}

        {/* =================================================
            KEY HIGHLIGHTS
        ================================================== */}

        {course?.keyHighlights?.length > 0 && (
          <CourseKeyHighlights
            course={safeCourse}
          />
        )}

        {/* =================================================
            SYLLABUS
        ================================================== */}

        {course?.syllabus?.length > 0 && (

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

                    <tbody>

                      {[0, 2, 4, 6].map(
                        (startIndex, rowIndex) => {

                          const sem1 =
                            course.syllabus[startIndex];

                          const sem2 =
                            course.syllabus[startIndex + 1];

                          if (!sem1 && !sem2) {
                            return null;
                          }

                          return (

                            <React.Fragment
                              key={rowIndex}
                            >

                              <tr className="bg-gray-50">

                                <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">

                                  {sem1?.semester ||
                                    "N/A"}

                                </th>

                                <th className="text-center py-3 text-sm font-bold text-[#002D62] border border-gray-300 w-1/2">

                                  {sem2?.semester ||
                                    "N/A"}

                                </th>

                              </tr>

                              <tr>

                                <td className="border border-gray-300 p-6 align-top bg-white">

                                  {sem1 && (

                                    <ul className="list-disc ml-5 space-y-2 text-gray-700">

                                      {Array.isArray(
                                        sem1.subjects
                                      ) &&
                                        sem1.subjects.map(
                                          (sub, j) => (

                                            <li
                                              key={j}
                                              className="text-[13px] md:text-sm font-medium break-words"
                                            >
                                              {typeof sub ===
                                              "string"
                                                ? normalizeRichText(
                                                    sub
                                                  )
                                                : sub}
                                            </li>

                                          )
                                        )}

                                    </ul>

                                  )}

                                </td>

                                <td className="border border-gray-300 p-6 align-top bg-white">

                                  {sem2 && (

                                    <ul className="list-disc ml-5 space-y-2 text-gray-700">

                                      {Array.isArray(
                                        sem2.subjects
                                      ) &&
                                        sem2.subjects.map(
                                          (sub, j) => (

                                            <li
                                              key={j}
                                              className="text-[13px] md:text-sm font-medium break-words"
                                            >
                                              {typeof sub ===
                                              "string"
                                                ? normalizeRichText(
                                                    sub
                                                  )
                                                : sub}
                                            </li>

                                          )
                                        )}

                                    </ul>

                                  )}

                                </td>

                              </tr>

                            </React.Fragment>

                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </section>

        )}

        {/* =================================================
            SPECIALIZATIONS
        ================================================== */}

        {Array.isArray(course?.specializations) &&
          course.specializations.length > 0 && (

            <section className="mt-10 w-full flex justify-center bg-white py-10">

              <div className="w-full max-w-[1600px] px-4 md:px-10">

                <h2 className="text-2xl md:text-2xl font-bold mb-8 text-[#002147]">
                  Top Specializations for{" "}
                  {course?.name}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">

                  {course.specializations.map(
                    (sp, i) => (

                      <div
                        key={i}
                        className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#1E90FF] transition-all cursor-pointer group"
                      >

                        <span className="text-gray-900 font-bold text-sm md:text-base pr-3 leading-tight break-words">
                          {typeof sp === "string"
                            ? normalizeRichText(sp)
                            : sp}
                        </span>

                        <span className="w-9 h-9 min-w-[36px] bg-[#1E90FF] group-hover:bg-[#002147] text-white rounded-full flex justify-center items-center transition-all shadow-md">
                          →
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>

          )}

        {/* =================================================
            OFFERED COURSES
        ================================================== */}

        <Offerdcourse
          offeredCourses={
            course?.offeredCourses
          }
          courseName={course?.name}
        />

        {/* =================================================
            CAREER VIDYA BENEFITS
        ================================================== */}

        {course?.Careervidyabenifit?.length > 0 && (

          <Careervidyabenifit
            courseBenifit={
              course.Careervidyabenifit
            }
            courseTitle={course?.name}
          />

        )}

        {/* =================================================
            ONLINE ELIGIBILITY
        ================================================== */}

        {course?.onlineEligibility?.length > 0 && (

          <OnlineCourseEligibility
            onlineEligibility={
              course.onlineEligibility
            }
            courseTitle={course?.name}
          />

        )}

        {/* =================================================
            FEE STRUCTURE
        ================================================== */}

        {(course?.feeStructureSidebar?.length > 0 ||
          course?.detailedFees?.length > 0) && (

          <FeeStructure
            courseTitle={course?.name}
            feeStructureSidebar={
              course.feeStructureSidebar
            }
            detailedFees={
              course.detailedFees
            }
          />

        )}

        {/* =================================================
            COURSE WORTH IT
        ================================================== */}

        {course?.onlineCourseWorthIt && (

          <CourseWorthIt
            onlineCourseWorthIt={
              course.onlineCourseWorthIt
            }
            courseTitle={course?.name}
          />

        )}

        {/* =================================================
            JOB OPPORTUNITIES
        ================================================== */}

        {course?.jobOpportunities?.length > 0 && (

          <JobOpportunities
            jobOpportunities={
              course.jobOpportunities
            }
            courseTitle={course?.name}
          />

        )}

        {/* =================================================
            TOP RECRUITERS
        ================================================== */}

        {course?.topRecruiters?.length > 0 && (

          <TopRecruiters
            topRecruiters={
              course.topRecruiters
            }
            courseTitle={course?.name}
          />

        )}

      </main>

      {/* =================================================
          FOOTER COMPONENTS
      ================================================== */}

      <Studentimageslider />

      <Getintuch />

      <Footer />

      <DiscountPopup />

    </>
  );
}