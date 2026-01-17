// "use client";

// import { useState } from "react";
// import Signup from "@/app/signup/page.jsx";

// export default function CourseOverview({ course }) {
//   const [showSignup, setShowSignup] = useState(false);

//   if (!course?.overview?.length) return null;

//   return (
//     <>
//       {/* ================= OVERVIEW SECTION ================= */}
//       <section className="w-full bg-white overflow-hidden">
//         <div className="max-w-[1800px] lg:w-[90%] mx-auto">
//           {course.overview.map((item, i) => (
//             <div
//               key={i}
//               className={`flex flex-col lg:flex-row items-center w-full min-h-[350px] bg-white ${
//                 i % 2 !== 0 ? "lg:flex-row-reverse" : ""
//               }`}
//             >
//               {/* IMAGE SIDE */}
//               <div className="w-full lg:w-1/2 flex items-center justify-center">
//                 {item.image?.url ? (
//                   <div className="w-full h-full flex items-center justify-center p-4 lg:p-6">
//                     <img
//                       src={item.image.url}
//                       alt={item.heading}
//                       className="w-full h-auto max-h-[250px] lg:h-[350px] object-contain transition-transform duration-500 hover:scale-105"
//                     />
//                   </div>
//                 ) : (
//                   <div className="w-full h-[200px] lg:h-[350px] bg-slate-50 flex items-center justify-center">
//                     <span className="text-slate-400 font-bold">
//                       Image Placeholder
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* CONTENT SIDE */}
//               <div className="w-full lg:w-1/2 px-6 md:px-16 lg:px-10 py-6 lg:py-4">
//                 <div className="max-w-2xl mx-auto lg:mx-0">
//                   <div className="inline-block px-3 py-1 mb-3 bg-blue-100/80 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-widest">
//                     Career Vidya Insight
//                   </div>

//                   <h2 className="text-2xl font-extrabold text-[#002147] mb-3">
//                     {item.heading}
//                   </h2>

//                   <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
//                     {item.description}
//                   </p>

//                   {/* ACTION BUTTONS */}
//                   <div className="flex flex-col sm:flex-row gap-4 items-center justify-start">
                    
//                     {/* ✅ SYLLABUS BUTTON (SIGNUP FLOW) */}
//                     <button
//                       type="button"
//                       onClick={() => setShowSignup(true)}
//                       className="w-full sm:w-auto bg-[#002147] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all text-center text-sm"
//                     >
//                       Get Full Syllabus
//                     </button>

//                     {/* VIDEO LINK */}
//                     {item.videoLink && (
//                       <a
//                         href={item.videoLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-3 text-[#002147] font-bold hover:text-blue-600 transition-colors py-1 group text-sm"
//                       >
//                         <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
//                           ▶
//                         </span>
//                         Watch Details
//                       </a>
//                     )}
//                   </div>

//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ================= SIGNUP POPUP ================= */}
//       {showSignup && (
//         <Signup
//           onClose={() => setShowSignup(false)}
//           onSuccess={() => {
//             setShowSignup(false);
//             if (course?.syllabusFile?.url) {
//               window.open(course.syllabusFile.url, "_blank");
//             }
//           }}
//           courseName={course?.courseName}
//         />
//       )}
//     </>
//   );
// }



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
          className="absolute top-4 right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full"
        >
          ✕
        </button>

        <iframe
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
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
      `${course.courseName}-Full-Syllabus.pdf`
    );
  };

  return (
    <>
      <section className="w-full bg-white pt-10">
        <div className="max-w-[1800px] lg:w-[90%] mx-auto px-6">
          {course.overview.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col lg:flex-row items-center gap-10 mb-16 ${
                i % 2 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="w-full lg:w-1/2">
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.heading}
                    className="w-full max-h-[350px] object-contain"
                  />
                ) : (
                  <div className="h-[250px] bg-slate-100 flex items-center justify-center rounded-xl">
                    Preview Coming Soon
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="w-full lg:w-1/2">
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Course Module {i + 1}
                </span>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#002147] mt-2">
                  {item.heading}
                </h2>

                <p className="text-slate-600 mt-4 mb-6">
                  {item.description}
                </p>

                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={handleSyllabusClick}
                    className="bg-[#002147] text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Get Full Syllabus
                  </button>

                  {item.videoLink && (
                    <button
                      onClick={() => setSelectedVideo(item.videoLink)}
                      className="flex items-center gap-2 font-bold text-[#002147]"
                    >
                      ▶ Watch Video
                    </button>
                  )}
                </div>
              </div>
            </div>
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
