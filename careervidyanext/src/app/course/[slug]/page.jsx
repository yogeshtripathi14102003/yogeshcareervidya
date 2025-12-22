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
  <section className="w-full bg-white overflow-hidden">
    {/* Increased container width for desktop */}
    <div className="max-w-[1400px] lg:w-[90%] mx-auto">
      {course.overview.map((item, i) => (
        <div
          key={i}
          className={`flex flex-col lg:flex-row items-center w-full min-h-[350px] bg-white ${
            i % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* IMAGE SIDE - 50% Width */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            {item.image?.url ? (
              <div className="w-full h-full flex items-center justify-center p-4 lg:p-6">
                <img
                  src={item.image.url}
                  alt={item.heading}
                  className="w-full h-auto max-h-[250px] lg:max-h-none lg:h-[350px] object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-[200px] lg:h-[350px] bg-slate-50 flex items-center justify-center">
                <span className="text-slate-400 font-bold">Image Placeholder</span>
              </div>
            )}
          </div>

          {/* CONTENT SIDE - 50% Width */}
          <div className="w-full lg:w-1/2 px-6 md:px-16 lg:px-10 py-6 lg:py-4">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="inline-block px-3 py-1 mb-3 bg-blue-100/80 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-widest">
                Career Vidya Insight
              </div>

              <h2 className="text-2xl md:text-2xl font-extrabold text-[#002147] mb-3 leading-tight">
                {item.heading}
              </h2>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-start">
                <a
                  href={course?.syllabusFile?.url || "#"}
                  className="w-full sm:w-auto bg-[#002147] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all text-center text-sm"
                >
                  Get Full Syllabus
                </a>

                {item.videoLink && (
                  <a
                    href={item.videoLink}
                    className="flex items-center gap-3 text-[#002147] font-bold hover:text-blue-600 transition-colors py-1 group text-sm"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                      ▶
                    </span>
                    Watch Details
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

{/* WHY CHOOSE US - NO-CROP IMAGE STYLE */}
{course.whyChooseUs?.length > 0 && (
  <section className="relative w-full py-12 bg-white overflow-hidden">
    <div className="max-w-7xl w-full px-6 mx-auto">
      
      {/* Heading - Reduced margin from mb-12 to mb-8 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-2xl font-black text-[#002147] mb-3">
          Why {course.name}
        </h2>
        <div className="w-16 h-1 bg-[#002147] mx-auto rounded-full"></div>
      </div>

      {/* Reduced space-y from 12 to 8 */}
      <div className="space-y-8">
        {course.whyChooseUs.map((item, i) => (
          <div 
            key={i} 
            className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
              i % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* TEXT CONTENT - Reduced padding */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-2">
              <div className="relative">
                <span className="absolute -top-8 -left-6 text-7xl text-slate-100 font-serif leading-none select-none -z-10">“</span>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify font-medium">
                  {item.description}
                </p>
              </div>
              
              <div className="mt-4 flex items-center gap-4 text-[#002147] font-bold">
                <span className="h-[2px] w-10 bg-[#002147]"></span>
                <span className="uppercase text-[10px] tracking-widest">Career Vidya Excellence</span>
              </div>
            </div>

            {/* IMAGE BLOCK - Fixed Cropping Issue */}
            {item.image?.url && (
              <div className="w-full lg:w-1/2 group">
                {/* Changed h-full to h-auto or fixed max-h to prevent cropping */}
                <div className="relative h-[250px] md:h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                  <img
                    src={item.image.url}
                    alt="Why Choose Us"
                    /* Added max-h-full to ensure it never bleeds out or crops */
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

 {/* TOP UNIVERSITIES - FORCED WHITE MODE */}
{course.topUniversities?.length > 0 && (
  <section className="mt-10 w-full flex justify-center bg-white py-10">
    <div className="w-full max-w-6xl px-4">
      <h2 className="text-2xl md:text-2xl font-bold mb-6 text-[#002147]">
        Top Affordable Universities for {course.name}
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

{/* PROGRAM HIGHLIGHTS - FULL WIDTH BG WITH BALANCED CARDS */}
{course.goodThings?.length > 0 && (
  <section className="w-full py-16 bg-white border-t border-slate-100">
    {/* Background full width rahega, lekin content 7xl tak limit rahega taki stretch na ho */}
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      
      {/* Header */}
      <div className="mb-10 border-b border-slate-100 pb-6">
        <h2 className="text-2xl md:text-2xl font-bold text-[#002147] tracking-tight">
          Key Highlights
        </h2>
      </div>

      {/* Grid: 'grid-cols-auto' jaisa behavior dene ke liye humne xl:grid-cols-4 rakha hai */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {course.goodThings.map((g, i) => (
          <div 
            key={i} 
            /* h-full lagaya hai taki agar ek card me text zyada ho to baaki card chote na dikhen */
            className="group p-6 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex flex-col gap-3">
              {/* Feature Label: Dark & Bold */}
              <span className="text-xs font-black text-black tracking-widest uppercase">
                Feature {i + 1 < 20 ? `0${i + 1}` : i + 1}
              </span>
              
              {/* Description Text: Original Gray */}
              <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
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
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#002147] leading-tight">
         What You’ll Learn & Gain {course.courseName} In India
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
