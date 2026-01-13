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

// ================= VIDEO MODAL COMPONENT =================
function VideoModal({ videoUrl, onClose }) {
  const getEmbedUrl = (url) => {
    try {
      if (!url) return null;
      
      let videoId = "";
      
      // Handle standard and mobile links
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } 
      // Handle short links (youtu.be)
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } 
      // Handle YouTube Shorts
      else if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("shorts/")[1].split("?")[0];
      }
      // Handle already embed links
      else if (url.includes("youtube.com/embed/")) {
        return url;
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
    } catch (error) {
      return url;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg"
        >
          ✕
        </button>
        
        <iframe
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Career Vidya Video"
        ></iframe>
      </div>
    </div>
  );
}

// ================= MAIN COURSE OVERVIEW =================
export default function CourseOverview({ course }) {
  const [showSignup, setShowSignup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!course?.overview?.length) return null;

  return (
    <>
      <section className="w-full bg-white overflow-hidden pt-10">
        <div className="max-w-[1800px] lg:w-[90%] mx-auto px-6">
          
          {/* Careervidya Intro Line */}
          <div className="mb-12 border-l-4 border-blue-600 pl-6">
            {/* <h1 className="text-3xl md:text-4xl font-black text-[#002147] mb-2 uppercase tracking-tight">
              Grow with <span className="text-blue-600">Career Vidya</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium italic">
              Empowering learners with industry-recognized online programs and expert career guidance.
            </p> */}
          </div>

          {course.overview.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col lg:flex-row items-center w-full min-h-[350px] bg-white mb-16 gap-10 ${
                i % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE SIDE */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                {item.image?.url ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.image.url}
                      alt={item.heading}
                      className="w-full h-auto max-h-[350px] object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[250px] bg-slate-50 flex items-center justify-center rounded-2xl">
                    <span className="text-slate-400 font-bold">Preview Coming Soon</span>
                  </div>
                )}
              </div>

              {/* CONTENT SIDE */}
              <div className="w-full lg:w-1/2">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 block">
                    Course Module {i + 1}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#002147] mb-4">
                    {item.heading}
                  </h2>
                  <p className="text-slate-600 text-base leading-relaxed mb-8">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowSignup(true)}
                      className="bg-[#002147] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all text-sm"
                    >
                      Get Full Syllabus
                    </button>

                    {item.videoLink && (
                      <button
                        onClick={() => setSelectedVideo(item.videoLink)}
                        className="flex items-center gap-3 text-[#002147] font-bold hover:text-blue-600 transition-all group"
                      >
                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          ▶
                        </span>
                        Watch Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODALS */}
      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSuccess={() => setShowSignup(false)}
          courseName={course?.courseName}
        />
      )}
    </>
  );
}