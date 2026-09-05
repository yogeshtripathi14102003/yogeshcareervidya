// "use client";

// import { useState, useRef } from "react";
// import { X, GraduationCap } from "lucide-react";

// export default function CareerVidyaPremiumWidget() {
//   const [showPreview] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const videoRef = useRef(null);

//   const toggleModal = () => {
//     setIsOpen((prev) => !prev);

//     if (!isOpen) {
//       setTimeout(() => {
//         videoRef.current?.play();
//       }, 150);
//     }
//   };

//   return (
//     <>
//       {/* =====================================================
//           SMALL FLOATING VIDEO
//       ===================================================== */}
//       {showPreview && !isOpen && (
//         <div
//           onClick={toggleModal}
//           style={bubbleWrapperStyle}
//           aria-label="Open career advice video"
//         >
//           <div style={bubbleContainer}>
//             <video
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="auto"
//               style={previewVideoStyle}
//             >
//               <source src="/video/v2.mp4" type="video/mp4" />
//             </video>

//             {/* Play Overlay */}
//             <div style={previewOverlay}>
//               <div style={playCircle}>
//                 <span style={playTriangle}></span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           EXPANDED MODAL
//       ===================================================== */}
//       {isOpen && (
//         <div style={modalOverlay}>
//           <div style={glassCardStyle}>
//             {/* =========================
//                 CLOSE BUTTON
//             ========================= */}
//             <button
//               onClick={toggleModal}
//               style={closeBtnStyle}
//               aria-label="Close video"
//             >
//               <X size={19} strokeWidth={2.5} />
//             </button>

//             {/* =========================
//                 VIDEO
//             ========================= */}
//             <div style={videoSectionStyle}>
//               <video
//                 ref={videoRef}
//                 controls
//                 playsInline
//                 preload="auto"
//                 style={videoStyle}
//               >
//                 <source src="/video/v2.mp4" type="video/mp4" />
//               </video>
//             </div>

//             {/* =========================
//                 CONTENT
//             ========================= */}
//             <div style={contentAreaStyle}>
//               <h3 style={titleStyle}>
//                 Need Expert Career Advice?
//               </h3>

//               {/* Orange Divider */}
//               <div style={dividerStyle}>
//                 <span style={dividerLine}></span>
//                 <span style={dividerDot}></span>
//                 <span style={dividerLine}></span>
//               </div>

//               <p style={descStyle}>
//                 Get personalized 1-on-1 guidance from our expert mentor
//                 <br className="desktopBreak" />
//                 and plan your future the right way.
//               </p>

//               {/* CTA */}
//               <button
//                 onClick={() => {
//                   window.location.href = "/teamexpand";
//                 }}
//                 style={premiumCtaBtn}
//               >
//                 <GraduationCap size={19} />
//                 Book Free Counselling
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Responsive CSS */}
//       <style jsx>{`
//         @media (max-width: 600px) {
//           .desktopBreak {
//             display: none;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// /* =========================================================
//    SMALL FLOATING VIDEO
// ========================================================= */

// const bubbleWrapperStyle = {
//   position: "fixed",
//   bottom: "40px",
//   right: "30px",

//   zIndex: 9999,
//   cursor: "pointer",
// };

// const bubbleContainer = {
//   position: "relative",

//   width: "135px",
//   height: "175px",

//   borderRadius: "14px",

//   overflow: "hidden",

//   background: "#000",

//   border: "3px solid #ec7425",

//   boxShadow:
//     "0 12px 35px rgba(0,0,0,0.28), 0 0 0 1px rgba(236,116,37,0.15)",

//   transition: "transform 0.25s ease, box-shadow 0.25s ease",
// };

// const previewVideoStyle = {
//   width: "100%",
//   height: "100%",

//   /*
//    * Preview mein bhi crop avoid karne ke liye
//    */
//   objectFit: "contain",

//   background: "#000",

//   display: "block",
// };

// const previewOverlay = {
//   position: "absolute",

//   inset: "0",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   pointerEvents: "none",

//   background: "linear-gradient(transparent 55%, rgba(0,0,0,0.25))",
// };

// const playCircle = {
//   width: "48px",
//   height: "48px",

//   borderRadius: "50%",

//   background: "rgba(0,0,0,0.55)",

//   border: "2px solid rgba(255,255,255,0.95)",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
// };

// const playTriangle = {
//   width: "0",
//   height: "0",

//   borderTop: "8px solid transparent",
//   borderBottom: "8px solid transparent",
//   borderLeft: "12px solid #fff",

//   marginLeft: "3px",
// };

// /* =========================================================
//    MODAL OVERLAY
// ========================================================= */

// const modalOverlay = {
//   position: "fixed",

//   inset: "0",

//   zIndex: 10000,

//   display: "flex",

//   alignItems: "flex-start",

//   justifyContent: "center",

//   paddingTop: "5vh",
//   paddingBottom: "30px",

//   paddingLeft: "20px",
//   paddingRight: "20px",

//   background: "rgba(10, 15, 25, 0.68)",

//   backdropFilter: "blur(7px)",
//   WebkitBackdropFilter: "blur(7px)",

//   overflowY: "auto",
// };

// /* =========================================================
//    LARGE PREMIUM CARD
// ========================================================= */

// const glassCardStyle = {
//   position: "relative",

//   /*
//    * Width increased
//    */
//   width: "560px",

//   maxWidth: "96vw",

//   background: "#fff",

//   borderRadius: "22px",

//   overflow: "hidden",

//   /*
//    * Premium orange border
//    */
//   border: "3px solid #ec7425",

//   boxShadow:
//     "0 30px 80px rgba(0,0,0,0.4), 0 0 35px rgba(236,116,37,0.15)",

//   animation: "premiumPopup 0.25s ease-out",
// };

// /* =========================================================
//    VIDEO SECTION
// ========================================================= */

// const videoSectionStyle = {
//   width: "100%",

//   /*
//    * Video ko proper aspect ratio mein space
//    */
//   aspectRatio: "16 / 9",

//   background: "#000",

//   /*
//    * Orange separator/border
//    */
//   borderBottom: "3px solid #ec7425",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   overflow: "hidden",
// };

// const videoStyle = {
//   width: "100%",
//   height: "100%",

//   /*
//    * IMPORTANT:
//    * Video crop nahi hogi.
//    * Puri video visible rahegi.
//    */
//   objectFit: "contain",

//   background: "#000",

//   display: "block",
// };

// /* =========================================================
//    CLOSE BUTTON
// ========================================================= */

// const closeBtnStyle = {
//   position: "absolute",

//   top: "14px",
//   right: "14px",

//   zIndex: 20,

//   width: "38px",
//   height: "38px",

//   borderRadius: "50%",

//   background: "rgba(255,255,255,0.96)",

//   border: "2px solid #ec7425",

//   color: "#1f2937",

//   cursor: "pointer",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   boxShadow: "0 4px 14px rgba(0,0,0,0.25)",

//   transition: "all 0.2s ease",
// };

// /* =========================================================
//    CONTENT AREA
// ========================================================= */

// const contentAreaStyle = {
//   padding: "25px 25px 28px",

//   textAlign: "center",

//   display: "flex",

//   flexDirection: "column",

//   alignItems: "center",

//   background: "#fff",
// };

// /* =========================================================
//    TITLE
// ========================================================= */

// const titleStyle = {
//   margin: "0",

//   fontSize: "23px",

//   lineHeight: "1.25",

//   fontWeight: "750",

//   color: "#172033",

//   letterSpacing: "-0.3px",
// };

// /* =========================================================
//    ORANGE DIVIDER
// ========================================================= */

// const dividerStyle = {
//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "10px",

//   margin: "11px 0 13px",
// };

// const dividerLine = {
//   display: "block",

//   width: "55px",

//   height: "2px",

//   background: "#ec7425",

//   borderRadius: "10px",
// };

// const dividerDot = {
//   width: "9px",
//   height: "9px",

//   borderRadius: "50%",

//   background: "#ec7425",

//   display: "block",
// };

// /* =========================================================
//    DESCRIPTION
// ========================================================= */

// const descStyle = {
//   margin: "0 0 21px",

//   fontSize: "14px",

//   lineHeight: "1.65",

//   color: "#4b5563",

//   maxWidth: "480px",
// };

// /* =========================================================
//    CTA BUTTON
// ========================================================= */

// const premiumCtaBtn = {
//   width: "100%",

//   maxWidth: "290px",

//   minHeight: "48px",

//   padding: "12px 22px",

//   background:
//     "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",

//   color: "#fff",

//   border: "none",

//   borderRadius: "30px",

//   fontWeight: "650",

//   cursor: "pointer",

//   fontSize: "14px",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "9px",

//   boxShadow: "0 8px 22px rgba(37,99,235,0.28)",

//   transition: "all 0.2s ease",
// };


// "use client";

// import { useState, useRef } from "react";
// import { X, GraduationCap } from "lucide-react";

// export default function CareerVidyaPremiumWidget() {
//   const [showPreview] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const videoRef = useRef(null);

//   const toggleModal = () => {
//     setIsOpen((prev) => !prev);

//     if (!isOpen) {
//       setTimeout(() => {
//         videoRef.current?.play();
//       }, 150);
//     }
//   };

//   return (
//     <>
//       {/* =====================================================
//           SMALL FLOATING VIDEO PREVIEW
//       ===================================================== */}
//       {showPreview && !isOpen && (
//         <div
//           onClick={toggleModal}
//           style={bubbleWrapperStyle}
//           aria-label="Open career advice video"
//         >
//           <div style={bubbleContainer}>
//             <video
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="auto"
//               style={previewVideoStyle}
//             >
//               <source src="/video/home.mp4" type="video/mp4" />
//             </video>

//             {/* Play Overlay */}
//             <div style={previewOverlay}>
//               <div style={playCircle}>
//                 <span style={playTriangle}></span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           EXPANDED CENTER CARD
//       ===================================================== */}
//       {isOpen && (
//         <div style={modalOverlay}>
//           <div style={glassCardStyle}>

//             {/* Close Button */}
//             <button
//               onClick={toggleModal}
//               style={closeBtnStyle}
//               aria-label="Close video"
//             >
//               <X size={18} strokeWidth={2.5} />
//             </button>

//             {/* =================================================
//                 VIDEO SECTION
//             ================================================= */}
//             <div style={videoSectionStyle}>
//               <video
//                 ref={videoRef}
//                 controls
//                 playsInline
//                 preload="auto"
//                 style={videoStyle}
//               >
//                 <source src="/video/home.mp4" type="video/mp4" />
//               </video>
//             </div>

//             {/* =================================================
//                 CONTENT SECTION
//             ================================================= */}
//             <div style={contentAreaStyle}>

//               <h3 style={titleStyle}>
//                 Need Expert Career Advice?
//               </h3>

//               {/* Orange Divider */}
//               <div style={dividerStyle}>
//                 <span style={dividerLine}></span>

//                 <span style={dividerDot}></span>

//                 <span style={dividerLine}></span>
//               </div>

//               <p style={descStyle}>
//                 Get personalized guidance to plan your career
//                 with confidence.
//               </p>

//               {/* CTA */}
//               <button
//                 onClick={() => {
//                   window.location.href = "/teamexpand";
//                 }}
//                 style={premiumCtaBtn}
//               >
//                 <GraduationCap size={17} />

//                 Book Free Counselling
//               </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* Responsive */}
//       <style jsx>{`
//         @media (max-width: 600px) {
//           .desktopBreak {
//             display: none;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// /* =========================================================
//    SMALL FLOATING VIDEO
// ========================================================= */

// const bubbleWrapperStyle = {
//   position: "fixed",

//   bottom: "40px",
//   right: "30px",

//   zIndex: 9999,

//   cursor: "pointer",
// };

// const bubbleContainer = {
//   position: "relative",

//   width: "135px",
//   height: "175px",

//   borderRadius: "12px",

//   overflow: "hidden",

//   background: "#000",

//   border: "2px solid #ec7425",

//   boxShadow: "0 12px 30px rgba(0,0,0,0.25)",

//   transition: "transform 0.2s ease",
// };

// const previewVideoStyle = {
//   width: "100%",
//   height: "100%",

//   /*
//    * Small preview ko completely fill karega
//    */
//   objectFit: "cover",

//   display: "block",

//   background: "#000",
// };

// const previewOverlay = {
//   position: "absolute",

//   inset: "0",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   pointerEvents: "none",

//   background:
//     "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))",
// };

// const playCircle = {
//   width: "46px",
//   height: "46px",

//   borderRadius: "50%",

//   background: "rgba(0,0,0,0.55)",

//   border: "2px solid rgba(255,255,255,0.95)",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
// };

// const playTriangle = {
//   width: "0",
//   height: "0",

//   borderTop: "8px solid transparent",

//   borderBottom: "8px solid transparent",

//   borderLeft: "12px solid #fff",

//   marginLeft: "3px",
// };

// /* =========================================================
//    MODAL OVERLAY
// ========================================================= */

// const modalOverlay = {
//   position: "fixed",

//   inset: "0",

//   zIndex: 10000,

//   display: "flex",

//   alignItems: "flex-start",

//   justifyContent: "center",

//   /*
//    * Card thoda upar
//    */
//   paddingTop: "7vh",

//   paddingBottom: "30px",

//   paddingLeft: "20px",
//   paddingRight: "20px",

//   background: "rgba(10,15,25,0.62)",

//   backdropFilter: "blur(6px)",

//   WebkitBackdropFilter: "blur(6px)",

//   overflowY: "auto",
// };

// /* =========================================================
//    EXPANDED CARD
//    SAME SIZE AS PREVIOUS VERSION
// ========================================================= */

// const glassCardStyle = {
//   position: "relative",

//   /*
//    * SAME 440px WIDTH
//    */
//   width: "440px",

//   maxWidth: "95vw",

//   background: "#fff",

//   borderRadius: "20px",

//   overflow: "hidden",

//   /*
//    * PREMIUM ORANGE BORDER
//    */
//   border: "3px solid #ec7425",

//   boxShadow:
//     "0 25px 70px rgba(0,0,0,0.35), 0 0 25px rgba(236,116,37,0.15)",
// };

// /* =========================================================
//    VIDEO SECTION
// ========================================================= */

// const videoSectionStyle = {
//   width: "100%",

//   /*
//    * SAME HEIGHT AS BEFORE
//    */
//   height: "500px",

//   background: "#000",

//   borderBottom: "3px solid #ec7425",

//   overflow: "hidden",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",
// };

// const videoStyle = {
//   /*
//    * Full container width
//    */
//   width: "100%",

//   /*
//    * Container ke andar rahega
//    */
//   height: "100%",

//   /*
//    * IMPORTANT:
//    * Video crop nahi hogi.
//    */
//   objectFit: "contain",

//   display: "block",

//   background: "#000",
// };

// /* =========================================================
//    CLOSE BUTTON
// ========================================================= */

// const closeBtnStyle = {
//   position: "absolute",

//   top: "12px",

//   right: "12px",

//   zIndex: 20,

//   width: "34px",

//   height: "34px",

//   borderRadius: "50%",

//   background: "rgba(255,255,255,0.95)",

//   border: "2px solid #ec7425",

//   color: "#1f2937",

//   cursor: "pointer",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
// };

// /* =========================================================
//    CONTENT
// ========================================================= */

// const contentAreaStyle = {
//   padding: "20px 22px 23px",

//   textAlign: "center",

//   display: "flex",

//   flexDirection: "column",

//   alignItems: "center",

//   background: "#fff",
// };

// /* =========================================================
//    TITLE
// ========================================================= */

// const titleStyle = {
//   margin: "0",

//   fontSize: "20px",

//   lineHeight: "1.3",

//   fontWeight: "700",

//   color: "#172033",
// };

// /* =========================================================
//    DIVIDER
// ========================================================= */

// const dividerStyle = {
//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "8px",

//   margin: "9px 0 10px",
// };

// const dividerLine = {
//   width: "45px",

//   height: "2px",

//   background: "#ec7425",

//   borderRadius: "10px",
// };

// const dividerDot = {
//   width: "8px",

//   height: "8px",

//   borderRadius: "50%",

//   background: "#ec7425",
// };

// /* =========================================================
//    DESCRIPTION
// ========================================================= */

// const descStyle = {
//   margin: "0 0 16px",

//   fontSize: "13px",

//   lineHeight: "1.5",

//   color: "#64748b",

//   maxWidth: "390px",
// };

// /* =========================================================
//    CTA BUTTON
// ========================================================= */

// const premiumCtaBtn = {
//   width: "100%",

//   maxWidth: "250px",

//   padding: "11px 18px",

//   background: "#1a73e8",

//   color: "#fff",

//   border: "none",

//   borderRadius: "30px",

//   fontWeight: "600",

//   cursor: "pointer",

//   fontSize: "13px",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "8px",

//   boxShadow: "0 6px 18px rgba(26,115,232,0.25)",
// };






// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   X,
//   Minus,
//   GraduationCap,
//   ChevronDown,
//   Send,
//   CheckCircle,
// } from "lucide-react";
// import api from "@/utlis/api";

// export default function CareerVidyaPremiumWidget() {
//   /* =========================================================
//      VIDEO STATES
//   ========================================================= */

//   const [showPreview, setShowPreview] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const videoRef = useRef(null);

//   /* =========================================================
//      FORM STATES
//   ========================================================= */

//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     course: "",
//     branch: "",
//     email: "This is EQ leads",
//     city: "NA",
//     message: "NA",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   /* =========================================================
//      FETCH COURSES
//   ========================================================= */

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");

//         const courseArray = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data ||
//             res.data?.courses ||
//             [];

//         setCourses(courseArray);
//       } catch (error) {
//         console.error("Course fetch error:", error);
//       }
//     };

//     fetchCourses();
//   }, []);

//   /* =========================================================
//      OPEN / CLOSE VIDEO
//   ========================================================= */

//   const toggleVideo = () => {
//     setIsOpen((prev) => !prev);

//     if (!isOpen) {
//       setTimeout(() => {
//         videoRef.current?.play();
//       }, 150);
//     }
//   };

//   const closeVideo = () => {
//     setIsOpen(false);

//     if (videoRef.current) {
//       videoRef.current.pause();
//     }
//   };

//   /* =========================================================
//      OPEN COUNSELLING FORM
//   ========================================================= */

//   const openCounsellingForm = () => {
//     setIsFormOpen(true);
//     setSubmitSuccess(false);
//   };

//   /* =========================================================
//      CLOSE COUNSELLING FORM
//   ========================================================= */

//   const closeCounsellingForm = () => {
//     setIsFormOpen(false);
//     setSubmitSuccess(false);
//   };

//   /* =========================================================
//      FORM CHANGE
//   ========================================================= */

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "course") {
//       const selectedCourse = courses.find(
//         (course) => course.name === value
//       );

//       setSpecializations(
//         selectedCourse?.specializations || []
//       );

//       setFormData((prev) => ({
//         ...prev,
//         course: value,
//         branch: "",
//       }));

//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /* =========================================================
//      FORM SUBMIT
//   ========================================================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     try {
//       setIsSubmitting(true);

//       await api.post(
//         "/api/v1/getintouch",
//         formData
//       );

//       setSubmitSuccess(true);

//       setFormData({
//         name: "",
//         mobile: "",
//         course: "",
//         branch: "",
//         email: "This is EQ leads",
//         city: "NA",
//         message: "NA",
//       });

//       setSpecializations([]);

//       setTimeout(() => {
//         setIsFormOpen(false);
//         setSubmitSuccess(false);
//       }, 1800);
//     } catch (error) {
//       console.error(
//         "Counselling submission error:",
//         error
//       );

//       alert(
//         "Submission failed. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       {/* =====================================================
//           SMALL FLOATING VIDEO
//       ===================================================== */}

//       {showPreview && !isOpen && (
//         <div
//           style={bubbleWrapperStyle}
//           aria-label="Career advice video"
//         >
//           <div style={bubbleContainer}>

//             {/* MINUS / HIDE BUTTON */}

//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowPreview(false);
//               }}
//               style={hideBtnStyle}
//               aria-label="Hide career advice video"
//               title="Hide"
//             >
//               <Minus
//                 size={15}
//                 strokeWidth={2.5}
//               />
//             </button>

//             {/* VIDEO */}

//             <div
//               onClick={toggleVideo}
//               style={videoClickAreaStyle}
//             >
//               <video
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//                 preload="auto"
//                 style={previewVideoStyle}
//               >
//                 <source
//                   src="/video/home.mp4"
//                   type="video/mp4"
//                 />
//               </video>

//               {/* PLAY OVERLAY */}

//               <div style={previewOverlay}>
//                 <div style={playCircle}>
//                   <span
//                     style={playTriangle}
//                   ></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           EXPANDED VIDEO CARD
//       ===================================================== */}

//       {isOpen && (
//         <div style={modalOverlay}>

//           <div style={glassCardStyle}>

//             {/* CLOSE VIDEO */}

//             <button
//               onClick={closeVideo}
//               style={closeBtnStyle}
//               aria-label="Close video"
//             >
//               <X
//                 size={18}
//                 strokeWidth={2.5}
//               />
//             </button>

//             {/* VIDEO */}

//             <div style={videoSectionStyle}>
//               <video
//                 ref={videoRef}
//                 controls
//                 playsInline
//                 preload="auto"
//                 style={videoStyle}
//               >
//                 <source
//                   src="/video/home.mp4"
//                   type="video/mp4"
//                 />
//               </video>
//             </div>

//             {/* CONTENT */}

//             <div style={contentAreaStyle}>

//               <h3 style={titleStyle}>
//                 Need Expert Career Advice?
//               </h3>

//               {/* DIVIDER */}

//               <div style={dividerStyle}>
//                 <span
//                   style={dividerLine}
//                 ></span>

//                 <span
//                   style={dividerDot}
//                 ></span>

//                 <span
//                   style={dividerLine}
//                 ></span>
//               </div>

//               <p style={descStyle}>
//                 Get personalized guidance to
//                 plan your career with confidence.
//               </p>

//               {/* BOOK BUTTON */}

//               <button
//                 onClick={openCounsellingForm}
//                 style={premiumCtaBtn}
//               >
//                 <GraduationCap
//                   size={17}
//                 />

//                 Book Free Counselling
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           COUNSELLING FORM MODAL
//       ===================================================== */}

//       {isFormOpen && (
//         <div style={formOverlay}>

//           <div style={formModal}>

//             {/* CLOSE FORM */}

//             <button
//               onClick={closeCounsellingForm}
//               style={formCloseBtn}
//               aria-label="Close counselling form"
//             >
//               <X
//                 size={19}
//                 color="#333"
//               />
//             </button>

//             {/* =================================================
//                 LEFT IMAGE
//             ================================================= */}

//             <div style={formImageSection}>

//               <div style={formImageWrapper}>
//                 <img
//                   src="/images/book1.jpg"
//                   alt="Career counselling"
//                   style={formImage}
//                 />

//                 <div
//                   style={imageOverlay}
//                 >
//                   <h3 style={imageTitle}>
//                     Plan Your Career
//                   </h3>

//                   <p
//                     style={imageDescription}
//                   >
//                     Get expert guidance and
//                     make the right career choice.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* =================================================
//                 RIGHT FORM
//             ================================================= */}

//             <div style={formSection}>

//               {/* LOGO */}

//               <div style={logoWrapper}>
//                 <img
//                   src="/images/n12.png"
//                   alt="CareerVidya"
//                   style={logoImage}
//                 />
//               </div>

//               {/* HEADING */}

//               <h2 style={formTitle}>
//                 Book Free Counselling
//               </h2>

//               <p style={formSubtitle}>
//                 Speak with our career expert
//                 and get personalized guidance.
//               </p>

//               {/* BADGES */}

//               <div style={badgesWrapper}>

//                 <span style={badge}>
//                   ✓ No-Cost EMI
//                 </span>

//                 <span style={badgeDivider}>
//                   |
//                 </span>

//                 <span style={badge}>
//                   🎓 Govt-Approved
//                 </span>

//                 <span style={badgeDivider}>
//                   |
//                 </span>

//                 <span style={badge}>
//                   💼 Placement Support
//                 </span>

//               </div>

//               {/* SUCCESS */}

//               {submitSuccess ? (
//                 <div
//                   style={successContainer}
//                 >
//                   <CheckCircle
//                     size={52}
//                     color="#16a34a"
//                   />

//                   <h3
//                     style={successTitle}
//                   >
//                     Thank You!
//                   </h3>

//                   <p
//                     style={successText}
//                   >
//                     Your counselling request
//                     has been submitted successfully.
//                   </p>
//                 </div>
//               ) : (

//                 /* FORM */

//                 <form
//                   onSubmit={handleSubmit}
//                   style={formStyle}
//                 >

//                   {/* NAME */}

//                   <label
//                     style={labelStyle}
//                   >
//                     Full Name *
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your name"
//                     required
//                     style={inputStyle}
//                   />

//                   {/* MOBILE */}

//                   <label
//                     style={labelStyle}
//                   >
//                     Phone Number *
//                   </label>

//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={(e) => {
//                       const value =
//                         e.target.value.replace(
//                           /\D/g,
//                           ""
//                         );

//                       if (
//                         value.length <= 10
//                       ) {
//                         setFormData(
//                           (prev) => ({
//                             ...prev,
//                             mobile: value,
//                           })
//                         );
//                       }
//                     }}
//                     placeholder="Enter mobile number"
//                     maxLength={10}
//                     required
//                     style={inputStyle}
//                   />

//                   {/* COURSE */}

//                   <label
//                     style={labelStyle}
//                   >
//                     Course *
//                   </label>

//                   <div
//                     style={selectWrapper}
//                   >
//                     <select
//                       name="course"
//                       value={formData.course}
//                       onChange={handleChange}
//                       required
//                       style={selectStyle}
//                     >
//                       <option value="">
//                         Select Course
//                       </option>

//                       {courses.map(
//                         (course) => (
//                           <option
//                             key={
//                               course._id ||
//                               course.id ||
//                               course.name
//                             }
//                             value={course.name}
//                           >
//                             {course.name}
//                           </option>
//                         )
//                       )}
//                     </select>

//                     <ChevronDown
//                       size={16}
//                       style={selectArrow}
//                     />
//                   </div>

//                   {/* BRANCH */}

//                   <label
//                     style={labelStyle}
//                   >
//                     Branch *
//                   </label>

//                   <div
//                     style={selectWrapper}
//                   >
//                     <select
//                       name="branch"
//                       value={formData.branch}
//                       onChange={handleChange}
//                       required
//                       disabled={
//                         !specializations.length
//                       }
//                       style={{
//                         ...selectStyle,
//                         color:
//                           !specializations.length
//                             ? "#999"
//                             : "#222",
//                       }}
//                     >
//                       <option value="">
//                         {specializations.length
//                           ? "Select Branch"
//                           : "Select Course First"}
//                       </option>

//                       {specializations.map(
//                         (specialization, index) => (
//                           <option
//                             key={index}
//                             value={
//                               specialization
//                             }
//                           >
//                             {specialization}
//                           </option>
//                         )
//                       )}
//                     </select>

//                     <ChevronDown
//                       size={16}
//                       style={selectArrow}
//                     />
//                   </div>

//                   {/* SUBMIT */}

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     style={{
//                       ...submitButtonStyle,
//                       opacity:
//                         isSubmitting
//                           ? 0.7
//                           : 1,
//                       cursor:
//                         isSubmitting
//                           ? "not-allowed"
//                           : "pointer",
//                     }}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span
//                           style={
//                             loaderStyle
//                           }
//                         ></span>

//                         SUBMITTING...
//                       </>
//                     ) : (
//                       <>
//                         <span>
//                           SUBMIT
//                         </span>

//                         <Send
//                           size={14}
//                         />
//                       </>
//                     )}
//                   </button>

//                 </form>
//               )}

//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           RESPONSIVE CSS
//       ===================================================== */}

//       <style jsx>{`

//         @media (max-width: 700px) {

//           .career-form-modal {
//             flex-direction: column !important;
//             width: 94vw !important;
//             max-height: 92vh !important;
//             overflow-y: auto !important;
//           }

//           .career-form-image {
//             display: none !important;
//           }

//           .career-form-section {
//             width: 100% !important;
//             padding: 25px 18px 28px !important;
//           }

//         }

//         @media (max-width: 480px) {

//           .career-floating-widget {
//             right: 15px !important;
//             bottom: 25px !important;
//           }

//           .career-floating-card {
//             width: 115px !important;
//             height: 155px !important;
//           }

//         }

//       `}</style>
//     </>
//   );
// }

// /* =========================================================
//    SMALL FLOATING VIDEO
// ========================================================= */

// const bubbleWrapperStyle = {
//   position: "fixed",
//   bottom: "40px",
//   right: "30px",
//   zIndex: 9999,
//   cursor: "pointer",
// };

// const bubbleContainer = {
//   position: "relative",

//   width: "135px",
//   height: "175px",

//   borderRadius: "12px",

//   overflow: "hidden",

//   background: "#000",

//   border: "2px solid #ec7425",

//   boxShadow:
//     "0 12px 30px rgba(0,0,0,0.25)",
// };

// const videoClickAreaStyle = {
//   position: "absolute",
//   inset: "0",
// };

// const previewVideoStyle = {
//   width: "100%",
//   height: "100%",
//   objectFit: "cover",
//   display: "block",
//   background: "#000",
// };

// /* =========================================================
//    MINUS / HIDE BUTTON
// ========================================================= */

// const hideBtnStyle = {
//   position: "absolute",

//   top: "7px",
//   right: "7px",

//   zIndex: 20,

//   width: "26px",
//   height: "26px",

//   padding: "0",

//   borderRadius: "50%",

//   background: "rgba(0,0,0,0.65)",

//   border:
//     "1px solid rgba(255,255,255,0.9)",

//   color: "#fff",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   cursor: "pointer",

//   boxShadow:
//     "0 2px 8px rgba(0,0,0,0.3)",

//   backdropFilter: "blur(4px)",
// };

// /* =========================================================
//    PLAY OVERLAY
// ========================================================= */

// const previewOverlay = {
//   position: "absolute",

//   inset: "0",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   pointerEvents: "none",

//   background:
//     "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))",
// };

// const playCircle = {
//   width: "46px",
//   height: "46px",

//   borderRadius: "50%",

//   background:
//     "rgba(0,0,0,0.55)",

//   border:
//     "2px solid rgba(255,255,255,0.95)",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   boxShadow:
//     "0 4px 16px rgba(0,0,0,0.3)",
// };

// const playTriangle = {
//   width: "0",
//   height: "0",

//   borderTop:
//     "8px solid transparent",

//   borderBottom:
//     "8px solid transparent",

//   borderLeft:
//     "12px solid #fff",

//   marginLeft: "3px",
// };

// /* =========================================================
//    VIDEO MODAL OVERLAY
// ========================================================= */

// const modalOverlay = {
//   position: "fixed",

//   inset: "0",

//   zIndex: 10000,

//   display: "flex",

//   alignItems: "flex-start",
//   justifyContent: "center",

//   paddingTop: "7vh",

//   paddingBottom: "30px",

//   paddingLeft: "20px",
//   paddingRight: "20px",

//   background:
//     "rgba(10,15,25,0.62)",

//   backdropFilter: "blur(6px)",

//   WebkitBackdropFilter:
//     "blur(6px)",

//   overflowY: "auto",
// };

// /* =========================================================
//    VIDEO CARD
// ========================================================= */

// const glassCardStyle = {
//   position: "relative",

//   width: "440px",

//   maxWidth: "95vw",

//   background: "#fff",

//   borderRadius: "20px",

//   overflow: "hidden",

//   border:
//     "3px solid #ec7425",

//   boxShadow:
//     "0 25px 70px rgba(0,0,0,0.35), 0 0 25px rgba(236,116,37,0.15)",
// };

// /* =========================================================
//    VIDEO SECTION
// ========================================================= */

// const videoSectionStyle = {
//   width: "100%",

//   height: "500px",

//   background: "#000",

//   borderBottom:
//     "3px solid #ec7425",

//   overflow: "hidden",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",
// };

// const videoStyle = {
//   width: "100%",

//   height: "100%",

//   objectFit: "contain",

//   display: "block",

//   background: "#000",
// };

// /* =========================================================
//    VIDEO CLOSE BUTTON
// ========================================================= */

// const closeBtnStyle = {
//   position: "absolute",

//   top: "12px",
//   right: "12px",

//   zIndex: 20,

//   width: "34px",
//   height: "34px",

//   borderRadius: "50%",

//   background:
//     "rgba(255,255,255,0.95)",

//   border:
//     "2px solid #ec7425",

//   color: "#1f2937",

//   cursor: "pointer",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   boxShadow:
//     "0 3px 12px rgba(0,0,0,0.2)",
// };

// /* =========================================================
//    VIDEO CONTENT
// ========================================================= */

// const contentAreaStyle = {
//   padding:
//     "20px 22px 23px",

//   textAlign: "center",

//   display: "flex",

//   flexDirection: "column",

//   alignItems: "center",

//   background: "#fff",
// };

// const titleStyle = {
//   margin: "0",

//   fontSize: "20px",

//   lineHeight: "1.3",

//   fontWeight: "700",

//   color: "#172033",
// };

// const dividerStyle = {
//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "8px",

//   margin:
//     "9px 0 10px",
// };

// const dividerLine = {
//   width: "45px",

//   height: "2px",

//   background: "#ec7425",

//   borderRadius: "10px",
// };

// const dividerDot = {
//   width: "8px",

//   height: "8px",

//   borderRadius: "50%",

//   background: "#ec7425",
// };

// const descStyle = {
//   margin:
//     "0 0 16px",

//   fontSize: "13px",

//   lineHeight: "1.5",

//   color: "#64748b",

//   maxWidth: "390px",
// };

// const premiumCtaBtn = {
//   width: "100%",

//   maxWidth: "250px",

//   padding:
//     "11px 18px",

//   background: "#1a73e8",

//   color: "#fff",

//   border: "none",

//   borderRadius: "30px",

//   fontWeight: "600",

//   cursor: "pointer",

//   fontSize: "13px",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "8px",

//   boxShadow:
//     "0 6px 18px rgba(26,115,232,0.25)",
// };

// /* =========================================================
//    COUNSELLING FORM OVERLAY
// ========================================================= */

// const formOverlay = {
//   position: "fixed",

//   inset: "0",

//   zIndex: 11000,

//   background:
//     "rgba(0,0,0,0.72)",

//   backdropFilter: "blur(5px)",

//   WebkitBackdropFilter:
//     "blur(5px)",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   padding: "15px",

//   overflowY: "auto",
// };

// /* =========================================================
//    FORM MODAL
// ========================================================= */

// const formModal = {
//   position: "relative",

//   width: "100%",

//   maxWidth: "750px",

//   background: "#fff",

//   borderRadius: "8px",

//   display: "flex",

//   flexDirection: "row",

//   overflow: "hidden",

//   boxShadow:
//     "0 25px 60px rgba(0,0,0,0.4)",

//   border:
//     "2px solid #ec7425",
// };

// /* =========================================================
//    FORM CLOSE
// ========================================================= */

// const formCloseBtn = {
//   position: "absolute",

//   top: "10px",
//   right: "10px",

//   width: "32px",
//   height: "32px",

//   borderRadius: "50%",

//   border: "none",

//   background:
//     "rgba(255,255,255,0.95)",

//   display: "flex",

//   alignItems: "center",
//   justifyContent: "center",

//   cursor: "pointer",

//   zIndex: 30,

//   boxShadow:
//     "0 2px 8px rgba(0,0,0,0.15)",
// };

// /* =========================================================
//    FORM IMAGE
// ========================================================= */

// const formImageSection = {
//   width: "40%",

//   padding: "15px",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   background: "#fff",
// };

// const formImageWrapper = {
//   position: "relative",

//   width: "100%",

//   minHeight: "400px",

//   borderRadius: "10px",

//   overflow: "hidden",
// };

// const formImage = {
//   position: "absolute",

//   inset: "0",

//   width: "100%",

//   height: "100%",

//   objectFit: "cover",
// };

// const imageOverlay = {
//   position: "absolute",

//   inset: "0",

//   display: "flex",

//   flexDirection: "column",

//   alignItems: "center",

//   justifyContent: "flex-end",

//   textAlign: "center",

//   padding: "25px 15px",

//   background:
//     "linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)",

//   color: "#fff",
// };

// const imageTitle = {
//   margin: "0 0 7px",

//   fontSize: "22px",

//   fontWeight: "700",
// };

// const imageDescription = {
//   margin: "0",

//   fontSize: "13px",

//   lineHeight: "1.5",
// };

// /* =========================================================
//    FORM SECTION
// ========================================================= */

// const formSection = {
//   width: "60%",

//   padding: "28px 40px 30px",

//   textAlign: "center",

//   background: "#fff",
// };

// const logoWrapper = {
//   display: "flex",

//   justifyContent: "center",

//   marginBottom: "7px",
// };

// const logoImage = {
//   width: "80px",

//   height: "80px",

// };

// const formTitle = {
//   margin: "3px 0 4px",

//   fontSize: "21px",

//   fontWeight: "700",

//   color: "#172033",
// };

// const formSubtitle = {
//   margin: "0 0 10px",

//   fontSize: "12px",

//   color: "#64748b",

//   lineHeight: "1.4",
// };

// /* =========================================================
//    BADGES
// ========================================================= */

// const badgesWrapper = {
//   display: "flex",

//   flexWrap: "wrap",

//   justifyContent: "center",

//   alignItems: "center",

//   gap: "5px",

//   marginBottom: "10px",

//   fontSize: "9px",

//   fontWeight: "700",

//   color: "#15803d",
// };

// const badge = {
//   whiteSpace: "nowrap",
// };

// const badgeDivider = {
//   color: "#aaa",
// };

// /* =========================================================
//    FORM
// ========================================================= */

// const formStyle = {
//   width: "100%",

//   textAlign: "left",
// };

// const labelStyle = {
//   display: "block",

//   fontSize: "11px",

//   fontWeight: "600",

//   marginBottom: "4px",

//   marginTop: "9px",

//   color: "#171717",
// };

// const inputStyle = {
//   width: "100%",

//   padding: "10px 11px",

//   borderRadius: "6px",

//   border:
//     "1px solid #e2e8f0",

//   background: "#f8fafc",

//   fontSize: "13px",

//   outline: "none",

//   boxSizing: "border-box",

//   color: "#222",
// };

// const selectWrapper = {
//   position: "relative",

//   width: "100%",
// };

// const selectStyle = {
//   width: "100%",

//   padding: "10px 35px 10px 11px",

//   borderRadius: "6px",

//   border:
//     "1px solid #e2e8f0",

//   background: "#f8fafc",

//   fontSize: "13px",

//   outline: "none",

//   appearance: "none",

//   WebkitAppearance: "none",

//   boxSizing: "border-box",

//   color: "#222",

//   cursor: "pointer",
// };

// const selectArrow = {
//   position: "absolute",

//   right: "11px",

//   top: "50%",

//   transform: "translateY(-50%)",

//   color: "#666",

//   pointerEvents: "none",
// };

// /* =========================================================
//    SUBMIT BUTTON
// ========================================================= */

// const submitButtonStyle = {
//   marginTop: "18px",

//   width: "50%",

//   minHeight: "42px",

//   padding: "10px 14px",

//   background: "#05347f",

//   color: "#fff",

//   border: "none",

//   borderRadius: "5px",

//   fontWeight: "700",

//   cursor: "pointer",

//   display: "flex",

//   alignItems: "center",

//   justifyContent: "center",

//   gap: "8px",

//   fontSize: "12px",

//   boxShadow:
//     "0 4px 12px rgba(5,52,127,0.25)",
// };

// /* =========================================================
//    LOADER
// ========================================================= */

// const loaderStyle = {
//   width: "14px",

//   height: "14px",

//   border:
//     "2px solid rgba(255,255,255,0.4)",

//   borderTop:
//     "2px solid #fff",

//   borderRadius: "50%",

//   display: "inline-block",

//   animation:
//     "spin 0.7s linear infinite",
// };

// /* =========================================================
//    SUCCESS
// ========================================================= */

// const successContainer = {
//   minHeight: "300px",

//   display: "flex",

//   flexDirection: "column",

//   alignItems: "center",

//   justifyContent: "center",

//   textAlign: "center",
// };

// const successTitle = {
//   margin: "12px 0 5px",

//   fontSize: "22px",

//   color: "#15803d",
// };

// const successText = {
//   margin: "0",

//   fontSize: "13px",

//   color: "#64748b",

//   lineHeight: "1.5",

//   maxWidth: "300px",
// };

"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Minus,
  GraduationCap,
  ChevronDown,
  Send,
  CheckCircle,
} from "lucide-react";
import api from "@/utlis/api";

export default function CareerVidyaPremiumWidget() {
  /* =========================================================
     VIDEO STATES
  ========================================================= */

  const [showPreview, setShowPreview] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const videoRef = useRef(null);

  /* =========================================================
     FORM STATES
  ========================================================= */

  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    course: "",
    branch: "",
    email: "This is EQ leads",
    city: "NA",
    message: "NA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* =========================================================
     FETCH COURSES
  ========================================================= */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");

        const courseArray = Array.isArray(res.data)
          ? res.data
          : res.data?.data ||
            res.data?.courses ||
            [];

        setCourses(courseArray);
      } catch (error) {
        console.error("Course fetch error:", error);
      }
    };

    fetchCourses();
  }, []);

  /* =========================================================
     OPEN VIDEO
  ========================================================= */

  const openVideo = () => {
    setIsOpen(true);

    setTimeout(() => {
      videoRef.current?.play();
    }, 150);
  };

  /* =========================================================
     CLOSE VIDEO
  ========================================================= */

  const closeVideo = () => {
    setIsOpen(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  /* =========================================================
     OPEN FORM
  ========================================================= */

  const openCounsellingForm = () => {
    setIsFormOpen(true);
    setSubmitSuccess(false);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeCounsellingForm = () => {
    setIsFormOpen(false);
    setSubmitSuccess(false);
  };

  /* =========================================================
     COURSE / BRANCH CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      const selectedCourse = courses.find(
        (course) =>
          course.name === value ||
          course.title === value
      );

      const branches =
        selectedCourse?.specializations ||
        selectedCourse?.branches ||
        selectedCourse?.specialization ||
        [];

      setSpecializations(
        Array.isArray(branches)
          ? branches
          : []
      );

      setFormData((prev) => ({
        ...prev,
        course: value,
        branch: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (formData.mobile.length !== 10) {
      alert(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post(
        "/api/v1/getintouch",
        formData
      );

      setSubmitSuccess(true);

      setFormData({
        name: "",
        mobile: "",
        course: "",
        branch: "",
        email: "This is EQ leads",
        city: "NA",
        message: "NA",
      });

      setSpecializations([]);

      setTimeout(() => {
        setIsFormOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Counselling submission error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =====================================================
          SMALL FLOATING VIDEO
      ===================================================== */}

      {showPreview && !isOpen && (
        <div style={bubbleWrapperStyle}>
          <div style={bubbleContainer}>

            {/* HIDE / MINUS BUTTON */}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(false);
              }}
              style={hideBtnStyle}
              aria-label="Hide career advice video"
              title="Hide"
            >
              <Minus
                size={15}
                strokeWidth={2.5}
              />
            </button>

            {/* VIDEO CLICK AREA */}

            <div
              onClick={openVideo}
              style={videoClickAreaStyle}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={previewVideoStyle}
              >
                <source
                  src="/video/home.mp4"
                  type="video/mp4"
                />
              </video>

              {/* PLAY BUTTON */}

              <div style={previewOverlay}>
                <div style={playCircle}>
                  <span
                    style={playTriangle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          EXPANDED VIDEO CARD
      ===================================================== */}

      {isOpen && (
        <div style={modalOverlay}>
          <div style={glassCardStyle}>

            {/* CLOSE */}

            <button
              onClick={closeVideo}
              style={closeBtnStyle}
              aria-label="Close video"
            >
              <X
                size={18}
                strokeWidth={2.5}
              />
            </button>

            {/* VIDEO */}

            <div style={videoSectionStyle}>
              <video
                ref={videoRef}
                controls
                playsInline
                preload="auto"
                style={videoStyle}
              >
                <source
                  src="/video/home.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            {/* CONTENT */}

            <div style={contentAreaStyle}>

              <h3 style={titleStyle}>
                Need Expert Career Advice?
              </h3>

              <div style={dividerStyle}>
                <span
                  style={dividerLine}
                />

                <span
                  style={dividerDot}
                />

                <span
                  style={dividerLine}
                />
              </div>

              <p style={descStyle}>
                Get personalized guidance to plan
                your career with confidence.
              </p>

              <button
                onClick={openCounsellingForm}
                style={premiumCtaBtn}
              >
                <GraduationCap
                  size={17}
                />

                Book Free Counselling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          COUNSELLING FORM
      ===================================================== */}

      {isFormOpen && (
        <div style={formOverlay}>

          <div
            style={formModal}
            className="career-form-modal"
          >

            {/* CLOSE FORM */}

            <button
              onClick={closeCounsellingForm}
              style={formCloseBtn}
              aria-label="Close counselling form"
            >
              <X
                size={19}
                strokeWidth={2.5}
              />
            </button>

            {/* =================================================
                LEFT IMAGE
            ================================================= */}

            <div
              style={formImageSection}
              className="career-form-image"
            >
              <div style={formImageWrapper}>

                <img
                  src="/images/book1.jpg"
                  alt="Career Counselling"
                  style={formImage}
                />

                <div style={imageOverlay}>

                  <h3 style={imageTitle}>
                    Plan Your Career
                  </h3>

                  <p
                    style={imageDescription}
                  >
                    Get expert guidance and make
                    the right career choice.
                  </p>

                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT FORM
            ================================================= */}

            <div
              style={formSection}
              className="career-form-section"
            >

              {/* =================================================
                  BRAND HEADER
              ================================================= */}

              <div style={formHeaderStyle}>

                {/* LOGO + TEXT */}

                <div style={brandRowStyle}>

                  <img
                    src="/images/n12.png"
                    alt="CareerVidya"
                    style={logoImage}
                  />

                  <div
                    style={brandDivider}
                  />

                  <div style={brandText}>

                    <span
                      style={brandTextTop}
                    >
                      Expert Guidance
                    </span>

                    <span
                      style={brandTextBottom}
                    >
                      For Your Career
                    </span>

                  </div>
                </div>

                {/* HEADING */}

                <h2 style={formTitle}>
                  Book Free Counselling
                </h2>

                <p style={formSubtitle}>
                  Speak with our career expert
                  and get personalized guidance
                  for your future.
                </p>

              </div>

              {/* =================================================
                  TRUST BADGES
              ================================================= */}

              <div
                style={badgesWrapper}
              >
                <span style={badge}>
                  ✓ No-Cost EMI
                </span>

                <span
                  style={badgeDivider}
                >
                  |
                </span>

                <span style={badge}>
                  🎓 Govt-Approved
                </span>

                <span
                  style={badgeDivider}
                >
                  |
                </span>

                <span style={badge}>
                  💼 Placement Support
                </span>
              </div>

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {submitSuccess ? (
                <div
                  style={
                    successContainer
                  }
                >
                  <CheckCircle
                    size={55}
                    color="#16a34a"
                  />

                  <h3
                    style={
                      successTitle
                    }
                  >
                    Thank You!
                  </h3>

                  <p
                    style={
                      successText
                    }
                  >
                    Your counselling request
                    has been submitted successfully.
                  </p>
                </div>
              ) : (

                /* =================================================
                    FORM
                ================================================= */

                <form
                  onSubmit={handleSubmit}
                  style={formStyle}
                >

                  {/* NAME */}

                  <label
                    style={labelStyle}
                  >
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    style={inputStyle}
                  />

                  {/* MOBILE */}

                  <label
                    style={labelStyle}
                  >
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      if (
                        value.length <= 10
                      ) {
                        setFormData(
                          (prev) => ({
                            ...prev,
                            mobile: value,
                          })
                        );
                      }
                    }}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    required
                    style={inputStyle}
                  />

                  {/* COURSE */}

                  <label
                    style={labelStyle}
                  >
                    Course *
                  </label>

                  <div
                    style={selectWrapper}
                  >
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      style={selectStyle}
                    >
                      <option value="">
                        Select Course
                      </option>

                      {courses.map(
                        (course, index) => {
                          const courseName =
                            course.name ||
                            course.title;

                          return (
                            <option
                              key={
                                course._id ||
                                course.id ||
                                index
                              }
                              value={
                                courseName
                              }
                            >
                              {courseName}
                            </option>
                          );
                        }
                      )}
                    </select>

                    <ChevronDown
                      size={17}
                      style={
                        selectArrow
                      }
                    />
                  </div>

                  {/* BRANCH */}

                  <label
                    style={labelStyle}
                  >
                    Branch *
                  </label>

                  <div
                    style={selectWrapper}
                  >
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      disabled={
                        !specializations.length
                      }
                      style={{
                        ...selectStyle,

                        color:
                          !specializations.length
                            ? "#999"
                            : "#222",

                        cursor:
                          !specializations.length
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      <option value="">
                        {specializations.length
                          ? "Select Branch"
                          : "Select Course First"}
                      </option>

                      {specializations.map(
                        (
                          specialization,
                          index
                        ) => {

                          const value =
                            typeof specialization ===
                            "string"
                              ? specialization
                              : specialization?.name ||
                                specialization?.title ||
                                "";

                          return (
                            <option
                              key={index}
                              value={value}
                            >
                              {value}
                            </option>
                          );
                        }
                      )}
                    </select>

                    <ChevronDown
                      size={17}
                      style={
                        selectArrow
                      }
                    />
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      ...submitButtonStyle,

                      opacity:
                        isSubmitting
                          ? 0.7
                          : 1,

                      cursor:
                        isSubmitting
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          style={
                            loaderStyle
                          }
                        />

                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        SUBMIT

                        <Send
                          size={14}
                        />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RESPONSIVE CSS
      ===================================================== */}

      <style jsx>{`

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 700px) {

          .career-form-modal {
            width: 94vw !important;
            max-width: 94vw !important;

            max-height: 92vh !important;

            overflow-y: auto !important;

            display: flex !important;

            flex-direction: column !important;
          }

          .career-form-image {
            display: none !important;
          }

          .career-form-section {
            width: 100% !important;

            box-sizing: border-box !important;

            padding: 25px 20px 28px !important;
          }
        }

        @media (max-width: 480px) {

          .career-floating-widget {
            right: 15px !important;
            bottom: 25px !important;
          }

          .career-floating-card {
            width: 115px !important;
            height: 155px !important;
          }

          .career-brand-row {
            gap: 8px !important;
          }

          .career-logo {
            width: 130px !important;
            height: 44px !important;
          }

          .career-brand-text-top,
          .career-brand-text-bottom {
            font-size: 9px !important;
          }

          .career-form-title {
            font-size: 19px !important;
          }
        }

      `}</style>
    </>
  );
}

/* =========================================================
   FLOATING VIDEO
========================================================= */

const bubbleWrapperStyle = {
  position: "fixed",

  bottom: "40px",
  right: "30px",

  zIndex: 9999,

  cursor: "pointer",
};

const bubbleContainer = {
  position: "relative",

  width: "135px",
  height: "175px",

  borderRadius: "12px",

  overflow: "hidden",

  background: "#000",

  border: "2px solid #ec7425",

  boxShadow:
    "0 12px 30px rgba(0,0,0,0.25)",

  boxSizing: "border-box",
};

const videoClickAreaStyle = {
  position: "absolute",

  inset: "0",

  cursor: "pointer",
};

const previewVideoStyle = {
  width: "100%",
  height: "100%",

  objectFit: "cover",

  display: "block",

  background: "#000",
};

/* =========================================================
   HIDE BUTTON
========================================================= */

const hideBtnStyle = {
  position: "absolute",

  top: "7px",
  right: "7px",

  zIndex: 30,

  width: "27px",
  height: "27px",

  padding: "0",

  borderRadius: "50%",

  background:
    "rgba(0,0,0,0.68)",

  border:
    "1px solid rgba(255,255,255,0.95)",

  color: "#fff",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.3)",

  backdropFilter: "blur(4px)",
};

/* =========================================================
   PLAY OVERLAY
========================================================= */

const previewOverlay = {
  position: "absolute",

  inset: "0",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  pointerEvents: "none",

  background:
    "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))",
};

const playCircle = {
  width: "46px",
  height: "46px",

  borderRadius: "50%",

  background:
    "rgba(0,0,0,0.55)",

  border:
    "2px solid rgba(255,255,255,0.95)",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  boxShadow:
    "0 4px 16px rgba(0,0,0,0.3)",
};

const playTriangle = {
  width: "0",
  height: "0",

  borderTop:
    "8px solid transparent",

  borderBottom:
    "8px solid transparent",

  borderLeft:
    "12px solid #fff",

  marginLeft: "3px",
};

/* =========================================================
   VIDEO MODAL
========================================================= */

const modalOverlay = {
  position: "fixed",

  inset: "0",

  zIndex: 10000,

  display: "flex",

  alignItems: "flex-start",

  justifyContent: "center",

  paddingTop: "7vh",

  paddingBottom: "30px",

  paddingLeft: "20px",
  paddingRight: "20px",

  background:
    "rgba(10,15,25,0.62)",

  backdropFilter: "blur(6px)",

  WebkitBackdropFilter:
    "blur(6px)",

  overflowY: "auto",

  boxSizing: "border-box",
};

/* =========================================================
   VIDEO CARD
========================================================= */

const glassCardStyle = {
  position: "relative",

  width: "440px",

  maxWidth: "95vw",

  background: "#fff",

  borderRadius: "20px",

  overflow: "hidden",

  border:
    "3px solid #ec7425",

  boxShadow:
    "0 25px 70px rgba(0,0,0,0.35), 0 0 25px rgba(236,116,37,0.15)",
};

/* =========================================================
   VIDEO SECTION
========================================================= */

const videoSectionStyle = {
  width: "100%",

  height: "500px",

  background: "#000",

  borderBottom:
    "3px solid #ec7425",

  overflow: "hidden",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",
};

const videoStyle = {
  width: "100%",

  height: "100%",

  /*
   * IMPORTANT:
   * contain = video crop nahi hogi
   */
  objectFit: "contain",

  display: "block",

  background: "#000",
};

/* =========================================================
   VIDEO CLOSE
========================================================= */

const closeBtnStyle = {
  position: "absolute",

  top: "12px",
  right: "12px",

  zIndex: 20,

  width: "34px",
  height: "34px",

  borderRadius: "50%",

  background:
    "rgba(255,255,255,0.95)",

  border:
    "2px solid #ec7425",

  color: "#1f2937",

  cursor: "pointer",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  boxShadow:
    "0 3px 12px rgba(0,0,0,0.2)",
};

/* =========================================================
   VIDEO CONTENT
========================================================= */

const contentAreaStyle = {
  padding:
    "20px 22px 23px",

  textAlign: "center",

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  background: "#fff",
};

const titleStyle = {
  margin: "0",

  fontSize: "20px",

  lineHeight: "1.3",

  fontWeight: "700",

  color: "#172033",
};

const dividerStyle = {
  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  margin:
    "9px 0 10px",
};

const dividerLine = {
  width: "45px",

  height: "2px",

  background: "#ec7425",

  borderRadius: "10px",
};

const dividerDot = {
  width: "8px",

  height: "8px",

  borderRadius: "50%",

  background: "#ec7425",
};

const descStyle = {
  margin:
    "0 0 16px",

  fontSize: "13px",

  lineHeight: "1.5",

  color: "#64748b",

  maxWidth: "390px",
};

const premiumCtaBtn = {
  width: "100%",

  maxWidth: "250px",

  padding:
    "11px 18px",

  background: "#1a73e8",

  color: "#fff",

  border: "none",

  borderRadius: "30px",

  fontWeight: "600",

  cursor: "pointer",

  fontSize: "13px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  boxShadow:
    "0 6px 18px rgba(26,115,232,0.25)",
};

/* =========================================================
   FORM OVERLAY
========================================================= */

const formOverlay = {
  position: "fixed",

  inset: "0",

  zIndex: 11000,

  background:
    "rgba(0,0,0,0.72)",

  backdropFilter: "blur(5px)",

  WebkitBackdropFilter:
    "blur(5px)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  padding: "15px",

  overflowY: "auto",

  boxSizing: "border-box",
};

/* =========================================================
   FORM MODAL
========================================================= */

const formModal = {
  position: "relative",

  width: "100%",

  maxWidth: "750px",

  background: "#fff",

  borderRadius: "9px",

  display: "flex",

  flexDirection: "row",

  overflow: "hidden",

  boxShadow:
    "0 25px 60px rgba(0,0,0,0.4)",

  border:
    "2px solid #ec7425",

  boxSizing: "border-box",
};

/* =========================================================
   FORM CLOSE
========================================================= */

const formCloseBtn = {
  position: "absolute",

  top: "10px",
  right: "10px",

  width: "32px",
  height: "32px",

  borderRadius: "50%",

  border: "none",

  background:
    "rgba(255,255,255,0.95)",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",

  zIndex: 30,

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.15)",
};

/* =========================================================
   FORM IMAGE
========================================================= */

const formImageSection = {
  width: "40%",

  padding: "15px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  background: "#fff",

  boxSizing: "border-box",
};

const formImageWrapper = {
  position: "relative",

  width: "100%",

  height: "400px",

  borderRadius: "10px",

  overflow: "hidden",
};

const formImage = {
  position: "absolute",

  inset: "0",

  width: "100%",

  height: "100%",

  objectFit: "cover",
};

const imageOverlay = {
  position: "absolute",

  inset: "0",

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  justifyContent: "flex-end",

  textAlign: "center",

  padding: "25px 15px",

  background:
    "linear-gradient(to top, rgba(0,0,0,0.78), transparent 65%)",

  color: "#fff",
};

const imageTitle = {
  margin:
    "0 0 7px",

  fontSize: "22px",

  fontWeight: "700",
};

const imageDescription = {
  margin: "0",

  fontSize: "13px",

  lineHeight: "1.5",
};

/* =========================================================
   FORM RIGHT SECTION
========================================================= */

const formSection = {
  width: "60%",

  padding:
    "25px 40px 30px",

  textAlign: "center",

  background: "#fff",

  boxSizing: "border-box",
};

/* =========================================================
   BRAND HEADER
========================================================= */

const formHeaderStyle = {
  textAlign: "center",

  marginBottom: "8px",
};

const brandRowStyle = {
  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "12px",

  marginBottom: "8px",
};

const logoImage = {
  width: "85px",

  height: "85px",


  display: "block",
};

const brandDivider = {
  width: "1px",

  height: "34px",

  background: "#d9dee7",

  flexShrink: 0,
};

const brandText = {
  display: "flex",

  flexDirection: "column",

  alignItems: "flex-start",

  textAlign: "left",

  lineHeight: "1.25",
};

const brandTextTop = {
  fontSize: "11px",

  fontWeight: "700",

  color: "#ec7425",

  textTransform: "uppercase",

  letterSpacing: "0.4px",
};

const brandTextBottom = {
  fontSize: "11px",

  fontWeight: "600",

  color: "#475569",
};

/* =========================================================
   FORM TITLE
========================================================= */

const formTitle = {
  margin:
    "0 0 4px",

  fontSize: "21px",

  lineHeight: "1.3",

  fontWeight: "700",

  color: "#172033",
};

const formSubtitle = {
  margin:
    "0 auto 9px",

  fontSize: "11.5px",

  lineHeight: "1.45",

  color: "#64748b",

  maxWidth: "350px",
};

/* =========================================================
   BADGES
========================================================= */

const badgesWrapper = {
  display: "flex",

  flexWrap: "wrap",

  justifyContent: "center",

  alignItems: "center",

  gap: "5px",

  marginBottom: "8px",

  fontSize: "9px",

  fontWeight: "700",

  color: "#15803d",
};

const badge = {
  whiteSpace: "nowrap",
};

const badgeDivider = {
  color: "#aaa",
};

/* =========================================================
   FORM
========================================================= */

const formStyle = {
  width: "100%",

  textAlign: "left",
};

const labelStyle = {
  display: "block",

  fontSize: "11px",

  fontWeight: "600",

  marginBottom: "4px",

  marginTop: "9px",

  color: "#171717",
};

const inputStyle = {
  width: "100%",

  padding:
    "10px 11px",

  borderRadius: "6px",

  border:
    "1px solid #dce3ec",

  background: "#fff",

  fontSize: "13px",

  outline: "none",

  boxSizing: "border-box",

  color: "#222",
};

const selectWrapper = {
  position: "relative",

  width: "100%",
};

const selectStyle = {
  width: "100%",

  padding:
    "10px 35px 10px 11px",

  borderRadius: "6px",

  border:
    "1px solid #dce3ec",

  background: "#fff",

  fontSize: "13px",

  outline: "none",

  appearance: "none",

  WebkitAppearance: "none",

  boxSizing: "border-box",

  color: "#222",

  cursor: "pointer",
};

const selectArrow = {
  position: "absolute",

  right: "11px",

  top: "50%",

  transform:
    "translateY(-50%)",

  color: "#666",

  pointerEvents: "none",
};

/* =========================================================
   SUBMIT BUTTON
========================================================= */

const submitButtonStyle = {
  marginTop: "18px",

  width: "50%",

  minHeight: "42px",

  padding:
    "10px 14px",

  background: "#05347f",

  color: "#fff",

  border: "none",

  borderRadius: "5px",

  fontWeight: "700",

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  fontSize: "12px",

  boxShadow:
    "0 4px 12px rgba(5,52,127,0.25)",
};

/* =========================================================
   LOADER
========================================================= */

const loaderStyle = {
  width: "14px",

  height: "14px",

  border:
    "2px solid rgba(255,255,255,0.4)",

  borderTop:
    "2px solid #fff",

  borderRadius: "50%",

  display: "inline-block",

  animation:
    "spin 0.7s linear infinite",
};

/* =========================================================
   SUCCESS
========================================================= */

const successContainer = {
  minHeight: "300px",

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  justifyContent: "center",

  textAlign: "center",
};

const successTitle = {
  margin:
    "12px 0 5px",

  fontSize: "22px",

  color: "#15803d",
};

const successText = {
  margin: "0",

  fontSize: "13px",

  color: "#64748b",

  lineHeight: "1.5",

  maxWidth: "300px",
};