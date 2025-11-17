"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
 import Detailsignup from "@/app/components/Detailsignup.jsx";
 import Header from "@/app/layout/Header.jsx";
 import Footer from "@/app/layout/Footer.jsx";
 import Getintuch from "@/app/components/getintuch.jsx";
export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/v1/course/${slug}`);
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
  
    <main className="min-h-screen ">
      {/* Course Header */}
      {/* <section className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow">
        {course.courseLogo?.url && (
          <img
            src={course.courseLogo.url}
            alt={course.name}
            className="w-40 h-40 object-contain rounded"
          />
        )}

        <div>
          <h1 className="text-3xl font-semibold">{course.name}</h1>
          <p className="text-gray-600">
            {course.category} • {course.duration}
          </p>

          <p className="mt-2 text-blue-600">
            {course.specialization?.join(", ")}
          </p>

          <p className="mt-1 text-gray-500">{course.tag}</p>
        </div>
      </section> */}
 {/*secion  about course overview*/}
{course.overview?.length > 0 && (
  <section className="mt-12">

    {course.overview.map((item, i) => (
      <div
        key={i}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-10 bg-white p-10 rounded-2xl shadow-lg mb-12 mx-auto max-w-5xl"
      >

        {/* 🔵 Top-Right Button Inside the Container */}
        <div className="absolute top-5 right-5">
          <a
            href={course?.syllabusFile?.url || "#"}
            target="_blank"
            className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 text-sm"
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
              className="
                w-full 
                max-h-[320px] 
                object-contain 
                rounded-xl 
                shadow-md 
                bg-gray-50 
                p-3
              "
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

            {/* Watch Video */}
            {item.videoLink && (
              <a
                href={item.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-lg font-semibold text-red-600 hover:opacity-80"
              >
                <span className="text-xl">▶</span> Watch Video
              </a>
            )}

            {/* Share Button */}
            <button
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: item.heading,
                      text: item.description,
                      url: window.location.href,
                    })
                  : alert("Sharing not supported in your browser")
              }
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full shadow hover:bg-green-600"
            >
              <span>Share</span> 🔗
            </button>
          </div>
        </div>
      </div>
    ))}
  </section>
)}


      {/* Why Choose Us */}
{course.whyChooseUs?.length > 0 && (
  <section className="mt-12 w-full flex justify-center bg-sky-100 py-12">
    <div className="max-w-5xl w-full px-4">

      {/* Heading */}
      <h2 className="text-3xl font-bold mb-8 text-center">
        Why Choose Us
      </h2>

      {/* WHITE BOXES INSIDE SKY BG */}
      <div className="space-y-10">
        {course.whyChooseUs.map((item, i) => (
          <div
            key={i}
            className="
              bg-white
              p-6
              rounded-xl
              shadow-md
              flex
              flex-col
              items-center
              text-center
            "
          >
            {/* TEXT */}
            <ul className="text-gray-700 text-lg leading-relaxed font-medium max-w-3xl space-y-2 text-justify">
              {item.description.split('.').map((point, idx) =>
                point.trim() && (
                  <li key={idx} className="list-disc ml-5 text-justify">
                    {point}
                  </li>
                )
              )}
            </ul>

            {/* IMAGE */}
            {item.image?.url && (
              <div className="mt-6">
                <img
                  src={item.image.url}
                  alt=""
                  className="
                    w-full 
                    max-h-[320px] 
                    object-contain 
                    rounded-xl 
                    p-3
                  "
                />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  </section>
)}




      {/* Good Things */}
{course.goodThings?.length > 0 && (
  <section className="mt-10 w-full flex justify-center bg-sky-50 py-10">

    {/* WHITE INNER BOX */}
    <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow">

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

  < Detailsignup />

      {/* Top Universities */}
{course.topUniversities?.length > 0 && (
  <section className="mt-10 w-full flex justify-center">
    <div className="w-full max-w-6xl">

      {/* HEADING */}
      <h2 className="text-2xl font-bold mb-4">
        Top Affordable Universities for Online {course.courseName} Courses:
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">

          {/* TOP BLUE TITLE */}
          <thead>
            <tr className="bg-[#002D62]">
              <th
                colSpan={2}
                className="text-white text-center py-3 text-lg font-semibold"
              >
                Top Universities for Online {course.courseName}  Courses
              </th>
            </tr>

            {/* SUB HEADER */}
            <tr className="bg-[#E8F4FF] border-b border-gray-300">
              <th className="p-3 text-left font-semibold text-gray-800 border-r border-gray-300">
                Universities {course.courseName} 
              </th>
              <th className="p-3 text-left font-semibold text-gray-800">
                University Accreditations
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {course.topUniversities.map((u, i) => (
              <tr
                key={i}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                {/* UNIVERSITY NAME */}
                <td className="p-4 border-r border-gray-300">
                  <a className="text-blue-700 underline cursor-pointer">
                    {u.name}
                  </a>
                </td>

                {/* ACCREDITATIONS */}
                <td className="p-4 text-gray-700">
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






      {/* Key Highlights */}
{course.keyHighlights?.length > 0 && (
  <section className="mt-10 w-full flex justify-center">
    
    {/* CONTAINER WITH REDUCED WIDTH */}
    <div className="w-full max-w-4xl">

      {/* HEADING */}
      <h2 className="text-3xl font-bold mb-6">
        Key Highlights of Online {course.courseName} In India
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE LIST */}
        <div className="lg:col-span-2 space-y-4">
          {course.keyHighlights.map((item, i) => (
            <div key={i} className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">☑️</span>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE BOX */}
        <div className="bg-white rounded-xl shadow p-6 h-fit border">

          <h3 className="text-xl font-semibold mb-4">Admission Closing Soon</h3>

          <p className="text-gray-700 font-medium mb-3">
            Compare & Enroll NOW
          </p>

          <div className="space-y-4">

            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">☑️</span>
              <p className="text-gray-600">
                To avoid paying 25% Late Fees on all the online courses
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">☑️</span>
              <p className="text-gray-600">
                To secure a seat in your dream university
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">☑️</span>
              <p className="text-gray-600">
                To avail of some amazing Early Benefits
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
)}

      {/* Syllabus */}
{course.syllabus?.length > 0 && (
  <section className="mt-10 w-full flex justify-center">
    <div className="w-full max-w-4xl bg-[#E8F4FF] p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Online  Course Subjects/Syllabus
      </h2>

      <p className="text-gray-700 mb-6 text-center">
        Must endeavor the online course curriculum, which can be obtained
        from the general syllabus stated below.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden">
          {/* Blue Header */}
          <thead>
            <tr className="bg-[#002D62] text-white">
              <th colSpan={2} className="text-center py-3 text-lg font-semibold">
                Online  Course Syllabus
              </th>
            </tr>
          </thead>

          <tbody>
            {/* ---------- SEM 1 + SEM 2 TITLES ---------- */}
            <tr className="bg-gray-100 border-t border-gray-300">
              {course.syllabus.slice(0, 2).map((sem, i) => (
                <th
                  key={i}
                  className="text-center py-3 text-lg font-semibold border-l border-gray-300"
                >
                  {sem.semester}
                </th>
              ))}
            </tr>

            {/* ---------- SEM 1 + SEM 2 SUBJECTS ---------- */}
            <tr>
              {course.syllabus.slice(0, 2).map((sem, i) => (
                <td
                  key={i}
                  className="border border-gray-300 align-top p-4"
                >
                  <ul className="list-disc ml-6 text-gray-800 space-y-2">
                    {sem.subjects.map((sub, j) => (
                      <li key={j}>{sub}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* ---------- SEM 3 + SEM 4 TITLES ---------- */}
            <tr className="bg-gray-100 border-t border-gray-300">
              {course.syllabus.slice(2, 4).map((sem, i) => (
                <th
                  key={i}
                  className="text-center py-3 text-lg font-semibold border-l border-gray-300"
                >
                  {sem.semester}
                </th>
              ))}
            </tr>

            {/* ---------- SEM 3 + SEM 4 SUBJECTS ---------- */}
            <tr>
              {course.syllabus.slice(2, 4).map((sem, i) => (
                <td
                  key={i}
                  className="border border-gray-300 align-top p-4"
                >
                  <ul className="list-disc ml-6 text-gray-800 space-y-2">
                    {sem.subjects.map((sub, j) => (
                      <li key={j}>{sub}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
)}


{course.specialization?.length > 0 && (
  <section className="mt-10 flex justify-center">
    {/* MAIN CONTAINER WIDTH SMALLER */}
    <div className="w-full max-w-5xl">

      <h2 className="text-2xl font-semibold mb-6">
        Top Specializations for Online  in 2025
      </h2>

      {/* GRID */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-4
      ">
        {course.specialization.map((sp, i) => (
          <div
            key={i}
            className="
              flex 
              justify-between 
              items-center 
              bg-white 
              p-4 
              rounded-xl 
              shadow 
              hover:shadow-md 
              border 
              w-full
            "
          >
            <span className="text-gray-800 font-medium">{sp}</span>

            <span className="w-8 h-8 flex justify-center items-center bg-teal-500 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17l9-9m0 0H8m8 0v8"
                />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
)}


      
    </main>
    <Getintuch />
    <Footer />
    </>
  );
}
