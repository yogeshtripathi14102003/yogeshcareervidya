"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Detailsignup from "@/app/components/Detailsignup.jsx";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Getintuch from "@/app/components/getintuch.jsx";
import Careervidyabenifit from "@/app/course/Careervidyabenifit";
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
        
        {/* OVERVIEW SECTION - WHITE */}
        {course.overview?.length > 0 && (
          <section className="mt-12">
            {course.overview.map((item, i) => (
              <div
                key={i}
                className="relative grid grid-cols-1 md:grid-cols-3 gap-10 p-10 rounded-2xl shadow-lg mb-12 mx-auto max-w-5xl bg-white"
              >
                {/* DOWNLOAD BUTTON */}
                <div className="absolute top-5 right-5">
                  <a
                    href={course?.syllabusFile?.url || "#"}
                    target="_blank"
                    className="bg-blue-600 text-white px-5 py-2 rounded-full shadow"
                  >
                    📘 Download Syllabus
                  </a>
                </div>

                {/* LEFT IMAGE */}
                <div className="flex justify-center items-center">
                  {item.image?.url && (
                    <img
                      src={item.image.url}
                      alt={item.heading}
                      className="w-full max-h-[320px] object-contain rounded-xl shadow-md p-3 bg-white"
                    />
                  )}
                </div>

                {/* RIGHT CONTENT */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold">{item.heading}</h3>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-6 mt-6">
                    {item.videoLink && (
                      <a
                        href={item.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 font-semibold text-lg"
                      >
                        ▶ Watch Video
                      </a>
                    )}

                    <button
                      onClick={() =>
                        navigator.share
                          ? navigator.share({
                              title: item.heading,
                              text: item.description,
                              url: window.location.href,
                            })
                          : alert("Sharing not supported")
                      }
                      className="bg-green-500 text-white px-5 py-2 rounded-full shadow"
                    >
                      Share 🔗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* WHY CHOOSE US - WHITE */}
        {course.whyChooseUs?.length > 0 && (
          <section className="mt-12 w-full flex justify-center py-12 bg-white">
            <div className="max-w-5xl w-full px-4">

              <h2 className="text-3xl font-bold mb-8 text-center">
                Why Choose Us
              </h2>

              <div className="space-y-10">
                {course.whyChooseUs.map((item, i) => (
                  <div key={i} className="p-6 rounded-xl shadow-md bg-white">

                    <ul className="text-gray-700 text-lg leading-relaxed space-y-2 text-justify">
                      {item.description.split('.').map((point, idx) =>
                        point.trim() && (
                          <li key={idx} className="list-disc ml-5">
                            {point}
                          </li>
                        )
                      )}
                    </ul>

                    {item.image?.url && (
                      <div className="mt-6">
                        <img
                          src={item.image.url}
                          alt=""
                          className="w-full max-h-[320px] object-contain rounded-xl p-3 bg-white"
                        />
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

  {/* TOP UNIVERSITIES - WHITE */}
        {course.topUniversities?.length > 0 && (
          <section className="mt-10 w-full flex justify-center bg-white">
            <div className="w-full max-w-6xl">

              <h2 className="text-2xl font-bold mb-4">
                Top Affordable Universities for Online {course.courseName}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 bg-white">
                  <thead>
                    <tr className="bg-[#002D62]">
                      <th
                        colSpan={2}
                        className="text-white text-center py-3 text-lg font-semibold"
                      >
                        Top Universities for Online {course.courseName}
                      </th>
                    </tr>

                    <tr className="border-b border-gray-300 bg-white">
                      <th className="p-3 text-left font-semibold text-gray-800 border-r border-gray-300">
                        Universities
                      </th>
                      <th className="p-3 text-left font-semibold text-gray-800">
                        Accreditations
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {course.topUniversities.map((u, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-4 border-r border-gray-300">
                          <a className="text-blue-700 underline cursor-pointer">
                            {u.name}
                          </a>
                        </td>

                        <td className="p-4 text-gray-700">{u.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </section>
        )}
        {/* GOOD THINGS - WHITE */}
        {course.goodThings?.length > 0 && (
          <section className="mt-10 w-full flex justify-center py-10 bg-white">
            <div className="w-full max-w-4xl p-6 rounded-xl shadow bg-white">
              <h2 className="text-2xl font-semibold mb-4">
                Program And Highlight
              </h2>

              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                {course.goodThings.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <Detailsignup />

      

        {/* KEY HIGHLIGHTS - WHITE */}
        {course.keyHighlights?.length > 0 && (
          <section className="mt-10 w-full flex justify-center bg-white">

            <div className="w-full max-w-4xl">

              <h2 className="text-3xl font-bold mb-6">
                Key Highlights of Online {course.courseName} In India
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-4">
                  {course.keyHighlights.map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <span className="text-blue-500 text-xl">☑️</span>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl shadow p-6 h-fit border">
                  <h3 className="text-xl font-semibold mb-4">
                    Admission Closing Soon
                  </h3>

                  <p className="text-gray-700 font-medium mb-3">
                    Compare & Enroll NOW
                  </p>

                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <span className="text-blue-500 text-xl">☑️</span>
                      <p className="text-gray-600">
                        Avoid paying 25% Late Fees
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <span className="text-blue-500 text-xl">☑️</span>
                      <p className="text-gray-600">
                        Secure a seat in your dream university
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <span className="text-blue-500 text-xl">☑️</span>
                      <p className="text-gray-600">
                        Avail early benefits
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* SYLLABUS SECTION - WHITE */}
        {course.syllabus?.length > 0 && (
          <section className="mt-10 w-full flex justify-center bg-white">
            <div className="w-full max-w-4xl p-6 rounded-xl shadow bg-white">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Course Subjects / Syllabus
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 bg-white rounded-lg">
                  <thead>
                    <tr className="bg-[#002D62] text-white">
                      <th colSpan={2} className="text-center py-3 text-lg font-semibold">
                        Course Syllabus
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[0, 2].map((startIndex, rowIndex) => {
                      const sem1 = course.syllabus[startIndex];
                      const sem2 = course.syllabus[startIndex + 1];

                      if (!sem1 && !sem2) return null;

                      return (
                        <React.Fragment key={rowIndex}>
                          <tr className="bg-gray-100 border-t">
                            <th className="text-center py-3 font-semibold">
                              {sem1?.semester || ""}
                            </th>

                            <th className="text-center py-3 font-semibold">
                              {sem2?.semester || ""}
                            </th>
                          </tr>

                          <tr>
                            <td className="border p-4 align-top">
                              {sem1 && (
                                <ul className="list-disc ml-6 space-y-2">
                                  {sem1.subjects.map((sub, j) => (
                                    <li key={j}>{sub}</li>
                                  ))}
                                </ul>
                              )}
                            </td>

                            <td className="border p-4 align-top">
                              {sem2 && (
                                <ul className="list-disc ml-6 space-y-2">
                                  {sem2.subjects.map((sub, j) => (
                                    <li key={j}>{sub}</li>
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

      <Careervidyabenifit />
      <Getintuch />
      <Footer />
    </>
  );
}
