"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Detailsignup from "@/app/components/Detailsignup.jsx";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Getintuch from "@/app/components/getintuch.jsx";
// import Careervidyabenifit from "@/app/course/Careervidyabenifit";
import Offerdcourse from "@/app/course/Offerdcourse.jsx";
import OnlineCourseEligibility from "@/app/course/OnlineCourseEligibility.jsx";
import FeeStructure from "@/app/course/FeeStructure.jsx";
import CourseWorthIt from "@/app/course/CourseWorthIt.jsx";
import JobOpportunities from "@/app/course/JobOpportunities.jsx";
import TopRecruiters from "@/app/course/TopRecruiters.jsx";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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
{course.overview?.length > 0 && (
  <section className="w-full max-w-7xl lg:max-w-none mx-auto px-4 lg:px-0 py-10 lg:py-0 bg-[#f8fafc]">
    {course.overview.map((item, i) => (
      <div
        key={i}
        className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 lg:gap-0 mb-16 lg:mb-0 last:mb-0"
      >
        {/* IMAGE CONTAINER - Desktop me koi space nahi, No cropping */}
        <div className="w-full lg:w-1/2 group">
          <div className="relative p-0 lg:p-0">
            {/* Mobile Decoration - Only visible on small screens */}
            <div className="absolute inset-0 bg-blue-600/5 rounded-2xl md:rounded-[2rem] rotate-2 lg:hidden" />

            {item.image?.url ? (
              <div className="relative z-10 w-full overflow-hidden rounded-2xl md:rounded-[2rem] lg:rounded-none shadow-xl lg:shadow-none bg-white">
                <img
                  src={item.image.url}
                  alt={item.heading}
                  /* - aspect-video: mobile par ratio maintain karega
                    - lg:aspect-auto & lg:h-[500px]: desktop par height fix rakhega
                    - lg:object-contain: desktop par image crop nahi hone dega
                  */
                  className="w-full h-auto aspect-video lg:aspect-auto lg:h-[550px] object-cover lg:object-contain transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="relative z-10 w-full aspect-video lg:h-[550px] bg-slate-200 rounded-2xl lg:rounded-none flex items-center justify-center">
                <span className="text-slate-400 font-bold text-sm">Image Placeholder</span>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT SECTION - Mobile: Left Aligned | Desktop: No side space */}
        <div className="w-full lg:w-1/2 px-2 lg:px-20 text-left mt-4 lg:mt-0">
          <div className="inline-block px-3 py-1 mb-3 bg-blue-100/50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Career Vidya Insight
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-[#002147] mb-3 leading-tight">
            {item.heading}
          </h2>

          <p className="text-slate-500 text-sm md:text-lg leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Buttons: Mobile me side-by-side (sm:flex-row) ya Stacked */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
            <a
              href={course?.syllabusFile?.url || "#"}
              className="w-full sm:w-auto bg-[#002147] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-blue-800 transition-all text-center"
            >
              Get Full Syllabus
            </a>

            {item.videoLink && (
              <a
                href={item.videoLink}
                className="flex items-center gap-2 text-[#002147] font-bold hover:text-blue-600 py-2 self-start"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow-sm">
                  ▶
                </span>
                Watch Details
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </section>
)}


{/* WHY CHOOSE US - NO-CROP IMAGE STYLE */}
{course.whyChooseUs?.length > 0 && (
  <section className="relative w-full py-20 bg-white overflow-hidden">
    <div className="max-w-7xl w-full px-6 mx-auto">
      
      {/* Heading */}
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-[#002147] mb-4">
          Why Choose Us
        </h2>
        <div className="w-20 h-1.5 bg-[#002147] mx-auto rounded-full"></div>
      </div>

      <div className="space-y-24">
        {course.whyChooseUs.map((item, i) => (
          <div 
            key={i} 
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
              i % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* TEXT CONTENT */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <span className="absolute -top-12 -left-8 text-9xl text-slate-100 font-serif leading-none select-none -z-10">“</span>
                <p className="text-gray-600 text-lg md:text-xl leading-[1.8] text-justify font-medium">
                  {item.description}
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-4 text-[#002147] font-bold">
                <span className="h-[2px] w-12 bg-[#002147]"></span>
                <span className="uppercase text-sm tracking-widest">Career Vidya Excellence</span>
              </div>
            </div>

            {/* IMAGE BLOCK - ASPECT RATIO PRESERVED */}
            {item.image?.url && (
              <div className="w-full lg:w-1/2 group">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-xl transition-all duration-500">
                  {/* object-contain use kiya hai taki image puri dikhe (crop na ho) */}
                  <img
                    src={item.image.url}
                    alt="Why Choose Us"
                    className="w-full h-auto max-h-[450px] block object-contain mx-auto transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle Floating Tag */}
                  {/* <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-md border-l-4 border-[#002147] z-20">
                     <p className="text-[#002147] font-bold text-xs uppercase tracking-wider">
                       World-Class Mentorship
                     </p>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
)}


 {/* TOP UNIVERSITIES - FORCED WHITE MODE */}
{course.topUniversities?.length > 0 && (
  <section className="mt-10 w-full flex justify-center bg-white py-10">
    <div className="w-full max-w-6xl px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#002147]">
        Top Affordable Universities for Online {course.courseName}
      </h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            {/* Header with Brand Color */}
            <tr className="bg-[#002D62]">
              <th
                colSpan={2}
                className="text-white text-center py-4 text-lg font-semibold border border-[#002D62]"
              >
                Top Universities for Online {course.courseName}
              </th>
            </tr>

            {/* Sub-Header - Forced Light Background */}
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-4 text-left font-bold text-gray-800 border-r border-gray-300 w-1/3">
                Universities
              </th>
              <th className="p-4 text-left font-bold text-gray-800">
                Accreditations
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {course.topUniversities.map((u, i) => (
              <tr 
                key={i} 
                className="border-b border-gray-200 hover:bg-blue-50/30 transition-colors"
              >
                {/* University Name - Forced Blue Link Style */}
                <td className="p-4 border-r border-gray-200 bg-white">
                  <a className="text-blue-700 font-medium underline decoration-blue-300 hover:decoration-blue-700 cursor-pointer">
                    {u.name}
                  </a>
                </td>

                {/* Description - Forced Dark Gray Text */}
                <td className="p-4 text-gray-700 bg-white leading-relaxed">
                  {u.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
)}
{/* PROGRAM HIGHLIGHTS - COMPACT & MINIMALIST */}
{course.goodThings?.length > 0 && (
  <section className="w-full py-16 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      
      {/* Small Header */}
      <div className="mb-10 border-b border-slate-100 pb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#002147] tracking-tight">
          Program Highlights
        </h2>
      </div>

      {/* Compact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {course.goodThings.map((g, i) => (
          <div 
            key={i} 
            className="group p-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              {/* Simple Number Thread */}
              <span className="text-xs font-bold text-blue-500/50 tracking-widest uppercase">
                Feature {i + 1 < 10 ? `0${i + 1}` : i + 1}
              </span>
              
              {/* Gray & Slim Text */}
              <p className="text-gray-600 text-[15px] leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
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

      

      {/* KEY HIGHLIGHTS - FULL WIDTH 100% */}
{course.keyHighlights?.length > 0 && (
  <section className="w-full bg-white py-16 border-y border-slate-100">
    <div className="w-full px-6 md:px-12 lg:px-20">
      
      {/* Heading - Now Full Width Align */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#002147] leading-tight">
          Key Highlights of Online {course.courseName} In India
        </h2>
        <div className="w-20 h-1.5 bg-blue-600 mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Highlights List (Fuller Space) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {course.keyHighlights.map((item, i) => (
            <div key={i} className="group flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-slate-50">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <svg className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side: Admission Card (More Responsive) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-[#002147] rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">
            {/* Decorative Circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
            
            <h3 className="text-2xl font-bold mb-6 relative z-10">
              Admission Closing Soon
            </h3>

            <div className="space-y-5 relative z-10">
              {[
                "Avoid paying 25% Late Fees",
                "Secure a seat in your dream university",
                "Avail early benefits"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-blue-400 text-lg">✦</span>
                  <p className="text-sm font-semibold tracking-wide">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg">
              Enroll Now
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
)}
       {/* SYLLABUS SECTION - FORCED LIGHT MODE APPEARANCE */}
{course.syllabus?.length > 0 && (
  <section className="mt-10 w-full flex justify-center bg-white">
    <div className="w-full max-w-4xl p-6 rounded-xl shadow-lg bg-white border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#002D62]">
        Course Subjects / Syllabus
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-[#002D62] text-white">
              <th colSpan={2} className="text-center py-4 text-lg font-semibold border border-[#002D62]">
                Course Syllabus
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {[0, 2].map((startIndex, rowIndex) => {
              const sem1 = course.syllabus[startIndex];
              const sem2 = course.syllabus[startIndex + 1];

              if (!sem1 && !sem2) return null;

              return (
                <React.Fragment key={rowIndex}>
                  {/* Semester Headers - Fixed Gray/White */}
                  <tr className="bg-gray-50">
                    <th className="text-center py-3 font-bold text-[#002D62] border border-gray-300">
                      {sem1?.semester || ""}
                    </th>
                    <th className="text-center py-3 font-bold text-[#002D62] border border-gray-300">
                      {sem2?.semester || ""}
                    </th>
                  </tr>

                  {/* Subjects List - Forced White Background & Dark Text */}
                  <tr>
                    <td className="border border-gray-300 p-5 align-top bg-white">
                      {sem1 && (
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                          {sem1.subjects.map((sub, j) => (
                            <li key={j} className="text-sm md:text-base">{sub}</li>
                          ))}
                        </ul>
                      )}
                    </td>

                    <td className="border border-gray-300 p-5 align-top bg-white">
                      {sem2 && (
                        <ul className="list-disc ml-6 space-y-2 text-gray-700">
                          {sem2.subjects.map((sub, j) => (
                            <li key={j} className="text-sm md:text-base">{sub}</li>
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
  </section>
)}

  {Array.isArray(course?.specializations) && course.specializations.length > 0 ? (
  <section className="mt-10 flex justify-center bg-white">
    <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6">
        Top Specializations for Online {course.courseName}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {course.specializations.map((sp, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow border"
          >
            <span className="text-gray-800 font-medium">{sp}</span>

            <span className="w-8 h-8 bg-teal-500 rounded-full flex justify-center items-center">
              +
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
) : (
  <></>
)}


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
          <TopRecruiters
            topRecruiters={course.topRecruiters}
            courseTitle={course.name}
          />
        )}

      </main>

      {/* <Careervidyabenifit /> */}
      <Getintuch />
      <Footer />
    </>
  );
}
