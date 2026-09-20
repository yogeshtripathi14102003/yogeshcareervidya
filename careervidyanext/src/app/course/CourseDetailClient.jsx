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

import React, { useEffect, useState } from "react";
import Image from "next/image";

import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import { startCourseView, endCourseView } from "@/utlis/analytics.js";

import Detailsignup from "@/app/course/Detailsignup.jsx";
import Getintuch from "@/app/components/getintuch.jsx";
import Offerdcourse from "@/app/course/Offerdcourse.jsx";
import UniversityCards from "@/app/course/UniversityCards.jsx";
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
import CourseFAQ from "@/app/course/CourseFAQ.jsx";
import AdmissionProcess from "@/app/course/AdmissionProcess.jsx";
import SpecializationDetails from "@/app/course/SpecializationDetails.jsx";
import CourseTestimonials from "@/app/course/CourseTestimonials.jsx";
import PlacementSupport from "@/app/course/PlacementSupport.jsx";
import CourseStickyNav from "@/app/course/CourseStickyNav.jsx";

// ============ HELPERS ============
function decodeHtmlEntities(value) {
  if (typeof value !== "string") return value;
  let result = value;
  for (let i = 0; i < 3; i++) {
    const decoded = result.replace(
      /&(#x?[0-9a-f]+|nbsp|amp|lt|gt|quot|apos|#39|#160);/gi,
      (match, entity) => {
        const lower = entity.toLowerCase();
        if (lower === "nbsp" || lower === "#160") return " ";
        if (lower === "amp") return "&";
        if (lower === "lt") return "<";
        if (lower === "gt") return ">";
        if (lower === "quot") return '"';
        if (lower === "apos" || lower === "#39") return "'";
        if (lower.startsWith("#x")) {
          const code = parseInt(lower.substring(2), 16);
          if (!Number.isNaN(code)) return String.fromCodePoint(code);
        }
        if (lower.startsWith("#")) {
          const code = parseInt(lower.substring(1), 10);
          if (!Number.isNaN(code)) return String.fromCodePoint(code);
        }
        return match;
      }
    );
    if (decoded === result) break;
    result = decoded;
  }
  return result;
}

function normalizeRichText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") return value;

  let text = value;
  text = decodeHtmlEntities(text);
  text = text
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/div>\s*<div[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/td>\s*<td[^>]*>/gi, " | ")
    .replace(/<\/th>\s*<th[^>]*>/gi, " | ")
    .replace(/<\/tr>/gi, "\n");
  text = text.replace(/<[^>]*>/g, "");
  text = decodeHtmlEntities(text);
  text = text.replace(/\u00a0/g, " ");
  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

function normalizeOverview(overview) {
  if (!Array.isArray(overview)) return overview;
  return overview.map((item) => {
    if (!item || typeof item !== "object") return item;
    return {
      ...item,
      heading: typeof item.heading === "string" ? normalizeRichText(item.heading) : item.heading,
      subHeading: typeof item.subHeading === "string" ? normalizeRichText(item.subHeading) : item.subHeading,
      description: typeof item.description === "string" ? normalizeRichText(item.description) : item.description,
      subDescription: typeof item.subDescription === "string" ? normalizeRichText(item.subDescription) : item.subDescription,
    };
  });
}

function normalizeWhyChooseUs(data) {
  if (!Array.isArray(data)) return data;
  return data.map((item) => {
    if (!item || typeof item !== "object") return item;
    return {
      ...item,
      description: typeof item.description === "string" ? normalizeRichText(item.description) : item.description,
      heading: typeof item.heading === "string" ? normalizeRichText(item.heading) : item.heading,
      subHeading: typeof item.subHeading === "string" ? normalizeRichText(item.subHeading) : item.subHeading,
    };
  });
}

// ============ MAIN ============
export default function CourseDetailClient({ course }) {
  // ✅ STATE — activeTab (must be here)
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    startCourseView({ courseId: course?._id, courseSlug: course?.slug });
    return () => endCourseView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?._id]);

  useEffect(() => {
    if (activeTab !== "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const skipDetailSignupSlugs = [
    "mtech-master-of-technology",
    "btech-bachelors-of-technology",
    "1-year-online-mba",
  ];

  const normalizedOverview = normalizeOverview(course?.overview);
  const normalizedWhyChooseUs = normalizeWhyChooseUs(course?.whyChooseUs);

  const safeCourse = {
    ...course,
    overview: normalizedOverview,
    whyChooseUs: normalizedWhyChooseUs,
  };

  const safeFaqs = Array.isArray(course?.faqs)
    ? course.faqs
    : Array.isArray(course?.FAQ)
    ? course.FAQ
    : Array.isArray(course?.faq)
    ? course.faq
    : [];

  // ✅ NAV SECTIONS
  const navSections = [
    { id: "overview", label: "Overview", show: normalizedOverview?.length > 0 },
    { id: "why-choose", label: "Why Choose", show: normalizedWhyChooseUs?.length > 0 },
    { id: "universities", label: "Universities", show: course?.universities?.length > 0 },
    // { id: "highlights", label: "Highlights", show: course?.goodThings?.length > 0 },
    // { id: "key-highlights", label: "Key Features", show: course?.keyHighlights?.length > 0 },
    { id: "admission", label: "Admission", show: course?.admissionProcess?.length > 0 },
    { id: "syllabus", label: "Syllabus", show: course?.syllabus?.length > 0 },
    { id: "specializations", label: "Specializations", show: course?.specializations?.length > 0 || course?.specializationDetails?.length > 0 },
    { id: "offered-courses", label: "Programs", show: course?.offeredCourses?.length > 0 },
    { id: "eligibility", label: "Eligibility", show: course?.onlineEligibility?.length > 0 },
    { id: "fees", label: "Fees", show: course?.feeStructureSidebar?.length > 0 || course?.detailedFees?.length > 0 || course?.emiOptions?.enabled || course?.scholarships?.length > 0 },
    // { id: "worth-it", label: "Worth It", show: !!course?.onlineCourseWorthIt },
    { id: "jobs", label: "Careers", show: course?.jobOpportunities?.length > 0 },
    // { id: "recruiters", label: "Recruiters", show: course?.topRecruiters?.length > 0 },
    { id: "placement", label: "Placement", show: !!course?.placementSupport },
    { id: "testimonials", label: "Testimonials", show: course?.courseTestimonials?.length > 0 },
    { id: "faq", label: "FAQs", show: safeFaqs.length > 0 },
  ].filter((s) => s.show);

  // ✅ SHOW SECTION HELPER
  const showSection = (id) => activeTab === "all" || activeTab === id;

  return (
    <>
      <Header />

      {/* ✅ STICKY NAV — with activeTab + onTabChange */}
      <CourseStickyNav
        sections={navSections}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <style jsx global>{`
        .course-content-safe {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
        }
        .course-content-safe img { max-width: 100%; height: auto; }
      `}</style>

      <main className="min-h-screen bg-white" itemScope itemType="https://schema.org/Course">
        <h1 className="sr-only" itemProp="name">{course?.name}</h1>

        {activeTab === "all" && !skipDetailSignupSlugs.includes(course?.slug) && <Detailsignup />}

        {/* 1. OVERVIEW */}
        {showSection("overview") && normalizedOverview?.length > 0 && (
          <div className="course-content-safe">
            <CourseOverview course={safeCourse} />
          </div>
        )}

        {/* 2. WHY CHOOSE US */}
        {showSection("why-choose") && normalizedWhyChooseUs?.length > 0 && (
          <section className="relative w-full py-12 bg-white overflow-hidden">
            <div className="max-w-[1800px] w-full px-6 mx-auto">
              <header className="text-center mb-8">
                <h2 className="text-3xl md:text-2xl font-black text-[#002147] mb-3">
                  Why {course?.name}?
                </h2>
                <div aria-hidden="true" className="w-16 h-1 bg-[#002147] mx-auto rounded-full" />
              </header>

              <div className="space-y-8">
                {normalizedWhyChooseUs.map((item, i) => (
                  <article
                    key={i}
                    className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
                  >
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-2 min-w-0">
                      <p className="course-content-safe text-gray-600 text-sm md:text-base leading-relaxed text-justify font-medium">
                        {item?.description || ""}
                      </p>
                    </div>
                    <div className="w-full lg:w-1/2 group min-w-0">
                      <div className="relative h-[250px] md:h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                        {item?.image?.url ? (
                          <Image src={item.image.url} alt="Why Choose" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-4" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                            <p className="text-sm font-semibold text-[#002147]">Coming Soon</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. UNIVERSITIES */}
        {showSection("universities") && course?.universities?.length > 0 && (
          <UniversityCards universities={course.universities} courseTitle={course?.name} />
        )}

        {/* 4. GOOD THINGS */}
        {showSection("highlights") && course?.goodThings?.length > 0 && (
          <section className="w-full py-12 md:py-16 bg-white border-t border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
              <header className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] leading-tight mb-3">
                  {course?.name} Program Highlights
                </h2>
                <div aria-hidden="true" className="w-16 h-1 bg-[#002147] mx-auto rounded-full" />
              </header>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 list-none p-0 m-0">
                {course.goodThings.map((g, i) => (
                  <li key={i} className="flex items-start gap-3 py-3 border-b border-slate-100">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#c15304]/10 text-[#c15304] text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed font-medium">
                      {typeof g === "string" ? normalizeRichText(g) : g}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {activeTab === "all" && !skipDetailSignupSlugs.includes(course?.slug) && <Detailsignup />}

        {/* 5. KEY HIGHLIGHTS */}
        {showSection("key-highlights") && course?.keyHighlights?.length > 0 && (
          <CourseKeyHighlights course={safeCourse} />
        )}

        {/* 6. ADMISSION PROCESS */}
        {showSection("admission") && course?.admissionProcess?.length > 0 && (
          <AdmissionProcess steps={course.admissionProcess} courseTitle={course?.name} />
        )}

        {/* 7. SYLLABUS */}
        {showSection("syllabus") && course?.syllabus?.length > 0 && (
          <section className="mt-10 w-full flex justify-center bg-white py-10">
            <div className="w-full max-w-[1800px] px-4 md:px-10">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl font-extrabold mb-8 text-center text-[#002D62]">
                  Course Subjects / Syllabus
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                      <tr className="bg-[#002D62] text-white">
                        <th colSpan={2} className="text-center py-4 text-lg font-semibold border border-[#002D62]">
                          Comprehensive Course Syllabus
                        </th>
                      </tr>
                    </thead>
                    <tbody>
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
                                    {Array.isArray(sem1.subjects) &&
                                      sem1.subjects.map((sub, j) => (
                                        <li key={j} className="text-[13px] md:text-sm font-medium break-words">
                                          {typeof sub === "string" ? normalizeRichText(sub) : sub}
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </td>
                              <td className="border border-gray-300 p-6 align-top bg-white">
                                {sem2 && (
                                  <ul className="list-disc ml-5 space-y-2 text-gray-700">
                                    {Array.isArray(sem2.subjects) &&
                                      sem2.subjects.map((sub, j) => (
                                        <li key={j} className="text-[13px] md:text-sm font-medium break-words">
                                          {typeof sub === "string" ? normalizeRichText(sub) : sub}
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

        {/* 8. SPECIALIZATIONS */}
        {showSection("specializations") && (
          <>
            {Array.isArray(course?.specializations) && course.specializations.length > 0 && (
              <section className="mt-10 w-full flex justify-center bg-white py-10">
                <div className="w-full max-w-[1600px] px-4 md:px-10">
                  <h2 className="text-2xl font-bold mb-8 text-[#002147]">
                    Top Specializations for {course?.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {course.specializations.map((sp, i) => (
                      <div key={i} className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                        <span className="text-gray-900 font-bold text-sm md:text-base pr-3 leading-tight break-words">
                          {typeof sp === "string" ? normalizeRichText(sp) : sp}
                        </span>
                        <span className="w-9 h-9 min-w-[36px] bg-[#1E90FF] text-white rounded-full flex justify-center items-center shadow-md">
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
            {course?.specializationDetails?.length > 0 && (
              <SpecializationDetails specializations={course.specializationDetails} courseTitle={course?.name} />
            )}
          </>
        )}

        {/* 9. OFFERED COURSES */}
        {showSection("offered-courses") && (
          <Offerdcourse offeredCourses={course?.offeredCourses} courseName={course?.name} />
        )}

        {/* 10. CAREER VIDYA BENEFITS — only All tab */}
        {activeTab === "all" && course?.Careervidyabenifit?.length > 0 && (
          <Careervidyabenifit courseBenifit={course.Careervidyabenifit} courseTitle={course?.name} />
        )}

        {/* 11. ONLINE ELIGIBILITY */}
        {showSection("eligibility") && course?.onlineEligibility?.length > 0 && (
          <OnlineCourseEligibility onlineEligibility={course.onlineEligibility} courseTitle={course?.name} />
        )}

        {/* 12. FEE STRUCTURE */}
        {showSection("fees") &&
          (course?.feeStructureSidebar?.length > 0 ||
            course?.detailedFees?.length > 0 ||
            course?.emiOptions?.enabled ||
            course?.scholarships?.length > 0) && (
            <FeeStructure
              courseTitle={course?.name}
              feeStructureSidebar={course.feeStructureSidebar}
              detailedFees={course.detailedFees}
              emiOptions={course.emiOptions}
              scholarships={course.scholarships}
            />
          )}

        {/* 13. WORTH IT */}
        {showSection("worth-it") && course?.onlineCourseWorthIt && (
          <CourseWorthIt onlineCourseWorthIt={course.onlineCourseWorthIt} courseTitle={course?.name} />
        )}

        {/* 14. JOBS */}
        {showSection("jobs") && course?.jobOpportunities?.length > 0 && (
          <JobOpportunities jobOpportunities={course.jobOpportunities} courseTitle={course?.name} />
        )}

        {/* 15. RECRUITERS */}
        {showSection("recruiters") && course?.topRecruiters?.length > 0 && (
          <TopRecruiters topRecruiters={course.topRecruiters} courseTitle={course?.name} />
        )}

        {/* 16. PLACEMENT */}
        {showSection("placement") && course?.placementSupport && (
          <PlacementSupport placementSupport={course.placementSupport} courseTitle={course?.name} />
        )}

        {/* 17. TESTIMONIALS */}
        {showSection("testimonials") && course?.courseTestimonials?.length > 0 && (
          <CourseTestimonials testimonials={course.courseTestimonials} courseTitle={course?.name} />
        )}

        {/* 18. FAQ */}
        {showSection("faq") && safeFaqs.length > 0 && (
          <CourseFAQ faqs={safeFaqs} courseTitle={course?.name} />
        )}
      </main>

      <Studentimageslider />
      <Getintuch />
      <Footer />
      <DiscountPopup />
    </>
  );
}