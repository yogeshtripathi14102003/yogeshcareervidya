"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ================= LOGIN CHECK ================= */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("usertoken"); 
};

/* ================= PDF DOWNLOAD WITH NAME ================= */
const downloadPdfWithName = async (url, fileName) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    alert("Unable to download syllabus");
    console.error(error);
  }
};

/* ================= VIDEO MODAL ================= */
function VideoModal({ videoUrl, onClose }) {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/embed/")) return url;
    let id = "";
    if (url.includes("watch?v=")) id = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1];
    else if (url.includes("shorts/")) id = url.split("shorts/")[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          ✕
        </button>
        <iframe
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Course Preview Video"
        />
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function CourseOverview({ course }) {
  const [showSignup, setShowSignup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!course?.overview?.length) return null;

  const handleSyllabusClick = async () => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }
    if (!course?.syllabusPdf?.url) {
      alert("Syllabus not available");
      return;
    }
    await downloadPdfWithName(
      course.syllabusPdf.url,
      `${course.courseName || "Course"}-Full-Syllabus.pdf`
    );
  };

  // SEO Schema - Isse Google ko data samajhne mein aasani hogi
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.courseName || "Online Course",
    "description": course.overview[0]?.description || "Professional course overview",
    "provider": {
      "@type": "Organization",
      "name": "Career Vidya",
      "url": "https://careervidya.in"
    }
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <section className="w-full bg-white pt-10">
        <div className="max-w-[1800px] lg:w-[90%] mx-auto px-6">
          {course.overview.map((item, i) => (
            <article
              key={i}
              className={`flex flex-col lg:flex-row items-center gap-10 mb-16 ${
                i % 2 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE SECTION - Standard img for 100% visibility */}
              <div className="w-full lg:w-1/2">
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={`${course.courseName} - ${item.heading}`} // SEO Alt Tag
                    className="w-full max-h-[350px] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[250px] bg-slate-100 flex items-center justify-center rounded-xl text-slate-400 italic">
                    Preview Coming Soon
                  </div>
                )}
              </div>

              {/* CONTENT SECTION */}
              <div className="w-full lg:w-1/2">
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Course Module {i + 1}
                </span>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#002147] mt-2">
                  {item.heading}
                </h2>

                {/* DESCRIPTION - Wahi purana size (text-slate-600 mt-4 mb-6) */}
                <p className="text-slate-600 mt-4 mb-6 text-justify">
                  {item.description}
                </p>

                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={handleSyllabusClick}
                    className="bg-[#c15304] text-white px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95"
                  >
                    Get Full Syllabus
                  </button>

                  {item.videoLink && (
                    <button
                      onClick={() => setSelectedVideo(item.videoLink)}
                      className="flex items-center gap-2 font-bold text-[#002147] group"
                    >
                      <span className="group-hover:text-blue-600 transition-colors">▶ Watch Video</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={course.courseName}
        />
      )}
    </>
  );
}