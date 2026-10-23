




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
// import { useQuery } from "@tanstack/react-query";
// import api from "@/utlis/api";
// import { toast } from "sonner";

// export default function CareerVidyaPremiumWidget() {
//   /* ═══════════════════════════════════════════════
//      VIDEO STATES
//   ═══════════════════════════════════════════════ */
//   const [showPreview, setShowPreview] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const videoRef = useRef(null);

//   /* ═══════════════════════════════════════════════
//      FORM STATES
//   ═══════════════════════════════════════════════ */
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

//   /* ═══════════════════════════════════════════════
//      ✅ REACT QUERY — Courses
//   ═══════════════════════════════════════════════ */
//   const { data: courses = [] } = useQuery({
//     queryKey: ["widget-courses"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/course");
//       const courseArray = Array.isArray(res.data)
//         ? res.data
//         : res.data?.data || res.data?.courses || [];
//       return courseArray;
//     },
//     staleTime: 5 * 60 * 1000,
//     enabled: isFormOpen,
//   });

//   /* ═══════════════════════════════════════════════
//      VIDEO CONTROLS
//   ═══════════════════════════════════════════════ */
//   const openVideo = () => {
//     setIsOpen(true);
//     setTimeout(() => videoRef.current?.play(), 150);
//   };

//   const closeVideo = () => {
//     setIsOpen(false);
//     if (videoRef.current) videoRef.current.pause();
//   };

//   const openCounsellingForm = () => {
//     setIsFormOpen(true);
//     setSubmitSuccess(false);
//   };

//   const closeCounsellingForm = () => {
//     setIsFormOpen(false);
//     setSubmitSuccess(false);
//   };

//   /* ═══════════════════════════════════════════════
//      COURSE / BRANCH CHANGE
//   ═══════════════════════════════════════════════ */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "course") {
//       const selectedCourse = courses.find(
//         (course) => course.name === value || course.title === value
//       );
//       const branches =
//         selectedCourse?.specializations ||
//         selectedCourse?.branches ||
//         selectedCourse?.specialization ||
//         [];
//       setSpecializations(Array.isArray(branches) ? branches : []);
//       setFormData((prev) => ({ ...prev, course: value, branch: "" }));
//       return;
//     }
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   /* ═══════════════════════════════════════════════
//      SUBMIT FORM
//   ═══════════════════════════════════════════════ */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     if (formData.mobile.length !== 10) {
//       toast.error("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await api.post("/api/v1/getintouch", formData);
//       setSubmitSuccess(true);
//       toast.success("Counselling request submitted successfully!");
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
//       }, 2000);
//     } catch (error) {
//       console.error("Counselling submission error:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       {/* ═══════════════════════════════════════════
//           SMALL FLOATING VIDEO
//       ═══════════════════════════════════════════ */}
//       {showPreview && !isOpen && (
//         <div style={bubbleWrapperStyle}>
//           <div style={bubbleContainer}>
//             {/* HIDE BUTTON */}
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
//               <Minus size={15} strokeWidth={2.5} />
//             </button>

//             {/* VIDEO CLICK AREA */}
//             <div onClick={openVideo} style={videoClickAreaStyle}>
//               <video
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//                 preload="auto"
//                 style={previewVideoStyle}
//               >
//                 <source src="/video/home1.mp4" type="video/mp4" />
//               </video>

//               {/* PLAY BUTTON */}
//               <div style={previewOverlay}>
//                 <div style={playCircle}>
//                   <span style={playTriangle} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════
//           EXPANDED VIDEO CARD
//       ═══════════════════════════════════════════ */}
//       {isOpen && (
//         <div style={modalOverlay}>
//           <div style={glassCardStyle}>
//             {/* CLOSE */}
//             <button
//               onClick={closeVideo}
//               style={closeBtnStyle}
//               aria-label="Close video"
//             >
//               <X size={18} strokeWidth={2.5} />
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
//                 <source src="/video/home1.mp4" type="video/mp4" />
//               </video>
//             </div>

//             {/* CONTENT */}
//             <div style={contentAreaStyle}>
//               <h3 style={titleStyle}>Get Free Expert Career Advice?</h3>

//               <div style={dividerStyle}>
//                 <span style={dividerLine} />
//                 <span style={dividerDot} />
//                 <span style={dividerLine} />
//               </div>

//               <p style={descStyle}>
//                 Get personalized guidance to plan your career with confidence.
//               </p>

//               <button onClick={openCounsellingForm} style={premiumCtaBtn}>
//                 <GraduationCap size={17} />
//                 Book Free Counselling
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════
//           COUNSELLING FORM
//       ═══════════════════════════════════════════ */}
//       {isFormOpen && (
//         <div style={formOverlay}>
//           <div style={formModal} className="career-form-modal">
//             {/* CLOSE FORM */}
//             <button
//               onClick={closeCounsellingForm}
//               style={formCloseBtn}
//               aria-label="Close counselling form"
//             >
//               <X size={19} strokeWidth={2.5} />
//             </button>

//             {/* LEFT IMAGE */}
//             <div style={formImageSection} className="career-form-image">
//               <div style={formImageWrapper}>
//                 <img
//                   src="/images/112.jpeg"
//                   alt="Career Counselling"
//                   style={formImage}
//                 />
//               </div>
//             </div>

//             {/* RIGHT FORM */}
//             <div style={formSection} className="career-form-section">
//               {/* BRAND HEADER */}
//               <div style={formHeaderStyle}>
//                 <div style={brandRowStyle}>
//                   <img
//                     src="/images/n12.png"
//                     alt="CareerVidya"
//                     style={logoImage}
//                   />
//                   <div style={brandDivider} />
//                   <div style={brandText}>
//                     <span style={brandTextTop}>Expert Guidance</span>
//                     <span style={brandTextBottom}>For Your Career</span>
//                   </div>
//                 </div>

//                 <h2 style={formTitle}>Book Free Counselling</h2>
//                 <p style={formSubtitle}>
//                   Speak with our career expert and get personalized guidance
//                   for your future.
//                 </p>
//               </div>

//               {/* TRUST BADGES */}
//               <div style={badgesWrapper}>
//                 <span style={badge}>✓ No-Cost EMI</span>
//                 <span style={badgeDivider}>|</span>
//                 <span style={badge}>🎓 Govt-Approved</span>
//                 <span style={badgeDivider}>|</span>
//                 <span style={badge}>💼 Placement Support</span>
//               </div>

//               {/* SUCCESS OR FORM */}
//               {submitSuccess ? (
//                 <div style={successContainer}>
//                   <CheckCircle size={55} color="#16a34a" />
//                   <h3 style={successTitle}>Thank You!</h3>
//                   <p style={successText}>
//                     Your counselling request has been submitted successfully.
//                   </p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} style={formStyle}>
//                   {/* NAME */}
//                   <label style={labelStyle}>Full Name *</label>
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
//                   <label style={labelStyle}>Phone Number *</label>
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       if (value.length <= 10) {
//                         setFormData((prev) => ({ ...prev, mobile: value }));
//                       }
//                     }}
//                     placeholder="Enter mobile number"
//                     maxLength={10}
//                     inputMode="numeric"
//                     required
//                     style={inputStyle}
//                   />

//                   {/* COURSE */}
//                   <label style={labelStyle}>Course *</label>
//                   <div style={selectWrapper}>
//                     <select
//                       name="course"
//                       value={formData.course}
//                       onChange={handleChange}
//                       required
//                       style={selectStyle}
//                     >
//                       <option value="">Select Course</option>
//                       {courses.map((course, index) => {
//                         const courseName = course.name || course.title;
//                         return (
//                           <option
//                             key={course._id || course.id || index}
//                             value={courseName}
//                           >
//                             {courseName}
//                           </option>
//                         );
//                       })}
//                     </select>
//                     <ChevronDown size={17} style={selectArrow} />
//                   </div>

//                   {/* BRANCH */}
//                   <label style={labelStyle}>Branch *</label>
//                   <div style={selectWrapper}>
//                     <select
//                       name="branch"
//                       value={formData.branch}
//                       onChange={handleChange}
//                       required
//                       disabled={!specializations.length}
//                       style={{
//                         ...selectStyle,
//                         color: !specializations.length ? "#999" : "#222",
//                         cursor: !specializations.length
//                           ? "not-allowed"
//                           : "pointer",
//                       }}
//                     >
//                       <option value="">
//                         {specializations.length
//                           ? "Select Branch"
//                           : "Select Course First"}
//                       </option>
//                       {specializations.map((specialization, index) => {
//                         const value =
//                           typeof specialization === "string"
//                             ? specialization
//                             : specialization?.name ||
//                               specialization?.title ||
//                               "";
//                         return (
//                           <option key={index} value={value}>
//                             {value}
//                           </option>
//                         );
//                       })}
//                     </select>
//                     <ChevronDown size={17} style={selectArrow} />
//                   </div>

//                   {/* SUBMIT */}
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     style={{
//                       ...submitButtonStyle,
//                       opacity: isSubmitting ? 0.7 : 1,
//                       cursor: isSubmitting ? "not-allowed" : "pointer",
//                     }}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span style={loaderStyle} />
//                         SUBMITTING...
//                       </>
//                     ) : (
//                       <>
//                         SUBMIT
//                         <Send size={14} />
//                       </>
//                     )}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════
//           RESPONSIVE CSS
//       ═══════════════════════════════════════════ */}
//       <style jsx>{`
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         @media (max-width: 700px) {
//           .career-form-modal {
//             width: 94vw !important;
//             max-width: 94vw !important;
//             max-height: 92vh !important;
//             overflow-y: auto !important;
//             display: flex !important;
//             flex-direction: column !important;
//           }
//           .career-form-image {
//             display: none !important;
//           }
//           .career-form-section {
//             width: 100% !important;
//             box-sizing: border-box !important;
//             padding: 25px 20px 28px !important;
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
//           .career-brand-row {
//             gap: 8px !important;
//           }
//           .career-logo {
//             width: 130px !important;
//             height: 44px !important;
//           }
//           .career-brand-text-top,
//           .career-brand-text-bottom {
//             font-size: 9px !important;
//           }
//           .career-form-title {
//             font-size: 19px !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// }

// /* ═══════════════════════════════════════════════
//    FLOATING VIDEO STYLES
// ═══════════════════════════════════════════════ */

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
//   border: "2px solid var(--cv-primary)",
//   boxShadow: "0 12px 30px rgba(30, 58, 138, 0.35)",
//   boxSizing: "border-box",
// };

// const videoClickAreaStyle = {
//   position: "absolute",
//   inset: "0",
//   cursor: "pointer",
// };

// const previewVideoStyle = {
//   width: "100%",
//   height: "100%",
//   objectFit: "cover",
//   display: "block",
//   background: "#000",
// };

// const hideBtnStyle = {
//   position: "absolute",
//   top: "7px",
//   right: "7px",
//   zIndex: 30,
//   width: "27px",
//   height: "27px",
//   padding: "0",
//   borderRadius: "50%",
//   background: "rgba(0,0,0,0.68)",
//   border: "1px solid rgba(255,255,255,0.95)",
//   color: "#fff",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
//   backdropFilter: "blur(4px)",
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

// /* ═══════════════════════════════════════════════
//    VIDEO MODAL STYLES
// ═══════════════════════════════════════════════ */

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
//   background: "rgba(15, 23, 42, 0.7)",
//   backdropFilter: "blur(6px)",
//   WebkitBackdropFilter: "blur(6px)",
//   overflowY: "auto",
//   boxSizing: "border-box",
// };

// const glassCardStyle = {
//   position: "relative",
//   width: "440px",
//   maxWidth: "95vw",
//   background: "#fff",
//   borderRadius: "20px",
//   overflow: "hidden",
//   border: "3px solid var(--cv-primary)",
//   boxShadow:
//     "0 25px 70px rgba(30, 58, 138, 0.35), 0 0 25px rgba(30, 58, 138, 0.15)",
// };

// const videoSectionStyle = {
//   width: "100%",
//   height: "500px",
//   background: "#000",
//   borderBottom: "3px solid var(--cv-primary)",
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

// const closeBtnStyle = {
//   position: "absolute",
//   top: "12px",
//   right: "12px",
//   zIndex: 20,
//   width: "34px",
//   height: "34px",
//   borderRadius: "50%",
//   background: "rgba(255,255,255,0.95)",
//   border: "2px solid var(--cv-primary)",
//   color: "var(--cv-neutral-dark)",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
// };

// const contentAreaStyle = {
//   padding: "20px 22px 23px",
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
//   color: "var(--cv-neutral-dark)",
// };

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
//   background: "var(--cv-primary)",
//   borderRadius: "10px",
// };

// const dividerDot = {
//   width: "8px",
//   height: "8px",
//   borderRadius: "50%",
//   background: "var(--cv-primary)",
// };

// const descStyle = {
//   margin: "0 0 16px",
//   fontSize: "13px",
//   lineHeight: "1.5",
//   color: "var(--cv-neutral-mid)",
//   maxWidth: "390px",
// };

// /* CTA — Gradient orange */
// const premiumCtaBtn = {
//   width: "100%",
//   maxWidth: "250px",
//   padding: "11px 18px",
//   background: "var(--cv-grad-cta)",
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
//   boxShadow: "0 6px 18px rgba(193, 83, 4, 0.35)",
// };

// /* ═══════════════════════════════════════════════
//    FORM STYLES
// ═══════════════════════════════════════════════ */

// const formOverlay = {
//   position: "fixed",
//   inset: "0",
//   zIndex: 11000,
//   background: "rgba(15, 23, 42, 0.75)",
//   backdropFilter: "blur(5px)",
//   WebkitBackdropFilter: "blur(5px)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "15px",
//   overflowY: "auto",
//   boxSizing: "border-box",
// };

// const formModal = {
//   position: "relative",
//   width: "100%",
//   maxWidth: "750px",
//   background: "#fff",
//   borderRadius: "9px",
//   display: "flex",
//   flexDirection: "row",
//   overflow: "hidden",
//   boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
//   border: "2px solid var(--cv-primary)",
//   boxSizing: "border-box",
// };

// const formCloseBtn = {
//   position: "absolute",
//   top: "10px",
//   right: "10px",
//   width: "32px",
//   height: "32px",
//   borderRadius: "50%",
//   border: "none",
//   background: "rgba(255,255,255,0.95)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   zIndex: 30,
//   boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
// };

// const formImageSection = {
//   width: "40%",
//   padding: "15px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "#fff",
//   boxSizing: "border-box",
// };

// const formImageWrapper = {
//   position: "relative",
//   width: "100%",
//   height: "400px",
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

// const formSection = {
//   width: "60%",
//   padding: "25px 40px 30px",
//   textAlign: "center",
//   background: "#fff",
//   boxSizing: "border-box",
// };

// const formHeaderStyle = {
//   textAlign: "center",
//   marginBottom: "8px",
// };

// const brandRowStyle = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "12px",
//   marginBottom: "8px",
// };

// const logoImage = {
//   width: "85px",
//   height: "85px",
//   display: "block",
// };

// const brandDivider = {
//   width: "1px",
//   height: "34px",
//   background: "var(--cv-neutral-border)",
//   flexShrink: 0,
// };

// const brandText = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   textAlign: "left",
//   lineHeight: "1.25",
// };

// const brandTextTop = {
//   fontSize: "11px",
//   fontWeight: "700",
//   color: "var(--cv-primary)",
//   textTransform: "uppercase",
//   letterSpacing: "0.4px",
// };

// const brandTextBottom = {
//   fontSize: "11px",
//   fontWeight: "600",
//   color: "var(--cv-neutral-mid)",
// };

// const formTitle = {
//   margin: "0 0 4px",
//   fontSize: "21px",
//   lineHeight: "1.3",
//   fontWeight: "700",
//   color: "var(--cv-neutral-dark)",
// };

// const formSubtitle = {
//   margin: "0 auto 9px",
//   fontSize: "11.5px",
//   lineHeight: "1.45",
//   color: "var(--cv-neutral-mid)",
//   maxWidth: "350px",
// };

// const badgesWrapper = {
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "5px",
//   marginBottom: "8px",
//   fontSize: "9px",
//   fontWeight: "700",
//   color: "var(--cv-primary)",
// };

// const badge = {
//   whiteSpace: "nowrap",
// };

// const badgeDivider = {
//   color: "var(--cv-neutral-border)",
// };

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
//   color: "var(--cv-neutral-dark)",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px 11px",
//   borderRadius: "6px",
//   border: "1px solid var(--cv-neutral-border)",
//   background: "#fff",
//   fontSize: "13px",
//   outline: "none",
//   boxSizing: "border-box",
//   color: "var(--cv-neutral-dark)",
// };

// const selectWrapper = {
//   position: "relative",
//   width: "100%",
// };

// const selectStyle = {
//   width: "100%",
//   padding: "10px 35px 10px 11px",
//   borderRadius: "6px",
//   border: "1px solid var(--cv-neutral-border)",
//   background: "#fff",
//   fontSize: "13px",
//   outline: "none",
//   appearance: "none",
//   WebkitAppearance: "none",
//   boxSizing: "border-box",
//   color: "var(--cv-neutral-dark)",
//   cursor: "pointer",
// };

// const selectArrow = {
//   position: "absolute",
//   right: "11px",
//   top: "50%",
//   transform: "translateY(-50%)",
//   color: "var(--cv-neutral-mid)",
//   pointerEvents: "none",
// };

// /* Submit — Gradient orange */
// const submitButtonStyle = {
//   marginTop: "18px",
//   width: "50%",
//   minHeight: "42px",
//   padding: "10px 14px",
//   background: "var(--cv-grad-cta)",
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
//   boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
// };

// const loaderStyle = {
//   width: "14px",
//   height: "14px",
//   border: "2px solid rgba(255,255,255,0.4)",
//   borderTop: "2px solid #fff",
//   borderRadius: "50%",
//   display: "inline-block",
//   animation: "spin 0.7s linear infinite",
// };

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
//   color: "var(--cv-primary)",
// };

// const successText = {
//   margin: "0",
//   fontSize: "13px",
//   color: "var(--cv-neutral-mid)",
//   lineHeight: "1.5",
//   maxWidth: "300px",
// };




// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   X,
//   Send,
//   PhoneCall,
//   ArrowLeft,
//   ExternalLink,
//   BriefcaseBusiness,
//   ChevronRight,
// } from "lucide-react";
// import api from "@/utlis/api";

// const BOTTOM_OFFSET = 90;
// const AUTO_OPEN_MS = 0; // 0 = only show the welcome bubble. Set e.g. 6000 to open the chat by itself.

// const SITE_URL = "https://careervidya.in/";
// const ABOUT_URL = "https://careervidya.in/Aboutus";
// const APPLY_URL = "https://careervidya.in/counselling";
// const TEAM_URL = "https://careervidya.in/our-Team";
// const JOB_URL = "https://jobportal.careervidya.in/";
// const SUPPORT_PHONE = "9289716667";

// const BRAND = "#1E40AF"; // single accent colour (change here to match your site)
// const BRAND_SOFT = "#EFF4FF";

// const STATES = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
//   "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
//   "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
//   "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
//   "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
//   "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
//   "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
//   "Chandigarh", "Puducherry",
// ];

// const EXPERIENCE_VALUES = [
//   "Fresher",
//   "Less than 1 year",
//   "1-3 years",
//   "3-5 years",
//   "5+ years",
// ];

// /* ---------------- MENUS (pill buttons) ---------------- */

// // 1. Main menu. Every option opens a compulsory form.
// const MAIN_MENU = [
//   { key: "admission", title: " Looking For Admission" },
//   { key: "counselling", title: " Looking For Counselling" },
//   { key: "job", title: " looking from Job Portal" },
//   { key: "existing", title: "Existing Student Support" },
// ];

// // 2. Shown only AFTER the admission form is submitted
// const ADMISSION_INFO_MENU = [
//   { key: "about", title: "About Career Vidya" },
//   { key: "process", title: "Admission Process" },
//   { key: "back", title: "Back to Main Menu" },
// ];

// // 3. Inside "Admission Process"
// const ADMISSION_MENU = [
//   { key: "eligibility", title: "Eligibility Criteria" },
//   { key: "how", title: "How to Apply" },
//   { key: "apply", title: "Apply Now" },
//   { key: "back", title: "Back to Main Menu" },
// ];

// // Existing Student Support types (pick one, then fill the form)
// const SUPPORT_MENU = [
//   { key: "University Examination Queries", title: "University Examination Queries" },
//   { key: "Document Cell", title: "Document Cell" },
//   { key: "Scholarship", title: "Scholarship" },
//   { key: "Fee & Payment Related", title: "Fee & Payment Related" },
//   { key: "Other Query", title: "Other Query" },
// ];

// /* ---------------- TEXT ---------------- */

// const PHONE_LINK = {
//   label: `Call +91 ${SUPPORT_PHONE}`,
//   url: `tel:+91${SUPPORT_PHONE}`,
//   phone: true,
// };

// const L = {
//   greeting1: "Hi! I'm Career Vidya's AI assistant. 👋",
//   greeting2: "What would you like help with?",
//   anythingElse: "Is there anything else I can help you with?",
//   backMenu: "Sure! Here is the main menu.",

//   admIntro:
//     "Sure! Please fill in your details first (2 quick steps). After that, I'll show you more information.",
//   thanks: (n) => `Thanks, ${n}! Now choose your course.`,
//   admDone: "Thank you! Your admission enquiry is submitted. ✅ Our counsellor will contact you shortly.",
//   admNext: "What would you like to know next?",

//   about:
//     "Career Vidya helps students choose the right course and university, with guidance from admission to career.",
//   admissionAsk: "What would you like to know about admission?",
//   eligibility:
//     "Eligibility varies for each program. Please visit the Program page on our website to check the detailed eligibility criteria for your desired course.",
//   howToApply:
//     "Applying is simple:\n1. Check the eligibility for your course\n2. Tap Apply Now and book a counselling session\n3. Our counsellor will guide you through the rest",
//   applyText: "You can apply by booking a counselling session with our team.",

//   counIntro: "Sure! Please share your details and a counsellor will call you.",
//   jobIntro: "Sure! Please fill in this short form and our team will get in touch.",
//   supportAsk: "Please choose your query type.",
//   supportIntro: "Please share your details and your query.",

//   counDone: "Thank you! Your callback request is submitted. ✅",
//   jobDone: "Thank you! Your job enquiry is submitted. ✅ Our team will contact you soon.",
//   existDone: "Thank you! Your query is submitted. ✅ Our support team will reply soon.",
//   err: "Sorry, something went wrong. Please try again.",
//   errDefault: "Unable to submit your details. Please try again.",

//   fullName: "Full name",
//   email: "Email address",
//   emailOpt: "Email (optional)",
//   mobile: "Mobile number (10 digits)",
//   mobileTitle: "Enter a valid 10-digit mobile number",
//   course: "Course",
//   specialization: "Specialization",
//   state: "State",
//   city: "City",
//   cityOpt: "City (optional)",
//   interestedCourse: "Interested course (optional)",
//   queryOpt: "Your query (optional)",
//   query: "Your query",
//   jobRole: "Job role (e.g. Sales, IT, HR)",
//   experience: "Experience",
//   selectCourse: "Select course",
//   selectSpec: "Select specialization",
//   noSpec: "Select a course first",
//   selectState: "Select state",
//   selectExp: "Select experience",

//   notSpecified: "Course not specified",
//   callbackReq: "Callback requested",
// };

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const timeNow = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// /* ---------- Girl avatar (inline SVG, no image file needed) ---------- */
// function Avatar({ size = 34, wave = false }) {
//   const skin = "#F8D5B8";
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 100 100"
//       role="img"
//       aria-label="Career Vidya assistant"
//       style={{ flexShrink: 0, borderRadius: "50%", display: "block" }}
//     >
//       <defs>
//         <clipPath id="cvClip">
//           <circle cx="50" cy="50" r="50" />
//         </clipPath>
//       </defs>
//       <g clipPath="url(#cvClip)">
//         <rect width="100" height="100" fill="#F9A94B" />
//         <path d="M22 52c0-22 12-34 28-34s28 12 28 34v26H22z" fill="#2B1B17" />
//         <path d="M14 100c2-20 16-30 36-30s34 10 36 30z" fill="#1E40AF" />
//         <path d="M42 70l8 10 8-10z" fill="#F3C9A8" />
//         <rect x="43" y="58" width="14" height="16" rx="6" fill="#F3C9A8" />
//         <ellipse cx="50" cy="45" rx="19" ry="21" fill={skin} />
//         <path d="M30 44c0-14 9-22 21-22 11 0 19 7 19 20-8-2-15-8-18-14-3 7-12 13-22 16z" fill="#2B1B17" />
//         <ellipse cx="42" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />
//         <ellipse cx="58" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />
//         <circle cx="42.7" cy="46" r=".7" fill="#fff" />
//         <circle cx="58.7" cy="46" r=".7" fill="#fff" />
//         <circle cx="38" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />
//         <circle cx="62" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />
//         <path d="M44 56c3 3.5 9 3.5 12 0" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round" />
//         <circle cx="50" cy="36" r="1.4" fill="#DC2626" />
//         {/* headset */}
//         <path d="M29 48c-2-20 8-30 21-30s23 10 21 30" stroke="#1E3A8A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
//         <rect x="25" y="46" width="7" height="13" rx="3.5" fill="#1E3A8A" />
//         <rect x="68" y="46" width="7" height="13" rx="3.5" fill="#1E3A8A" />
//         <path d="M71 59c0 8-8 10-15 10" stroke="#1E3A8A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
//         <circle cx="55" cy="69" r="3" fill="#1E3A8A" />
//         {/* waving hand (launcher only) */}
//         {wave && (
//           <g
//             style={{
//               transformOrigin: "84px 80px",
//               animation: "cvWave 1.6s ease-in-out infinite",
//             }}
//             fill={skin}
//             stroke="#E3AE88"
//             strokeWidth=".8"
//           >
//             <rect x="77.5" y="53" width="3.4" height="11" rx="1.7" />
//             <rect x="82.3" y="51" width="3.4" height="12" rx="1.7" />
//             <rect x="87" y="53" width="3.4" height="11" rx="1.7" />
//             <ellipse cx="84" cy="67" rx="6.8" ry="7.5" />
//           </g>
//         )}
//       </g>
//     </svg>
//   );
// }

// // Used inside the chat (header, message icons)
// function BotIcon({ size = 30 }) {
//   return <Avatar size={size} />;
// }

// /* ---------- Fields (defined OUTSIDE the main component so inputs keep focus) ---------- */
// function Field({ label, children }) {
//   return (
//     <label style={fieldLabel}>
//       <span style={fieldCaption}>{label}</span>
//       {children}
//     </label>
//   );
// }

// function TextInput({ label, name, value, onChange, type = "text", required = true, ...rest }) {
//   return (
//     <Field label={label}>
//       <input
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         required={required}
//         style={inputStyle}
//         {...rest}
//       />
//     </Field>
//   );
// }

// const mobileProps = {
//   type: "tel",
//   inputMode: "numeric",
//   autoComplete: "tel",
//   pattern: "[6-9][0-9]{9}",
//   title: L.mobileTitle,
//   minLength: 10,
//   maxLength: 10,
// };

// function Progress({ current, total, label }) {
//   return (
//     <div>
//       <div style={progressText}>
//         Step {current} of {total} · {label}
//       </div>
//       <div style={progressTrack}>
//         <div style={{ ...progressFill, width: `${(current / total) * 100}%` }} />
//       </div>
//     </div>
//   );
// }

// function Chips({ items, onPick }) {
//   return (
//     <div style={chipRow} role="group" aria-label="Options">
//       {items.map((item, index) => (
//         <button
//           key={item.key}
//           type="button"
//           className="cv-chip"
//           onClick={() => onPick(item)}
//           style={{ ...chipStyle, animation: `cvPop .3s ${index * 0.05}s ease backwards` }}
//         >
//           {item.title}
//         </button>
//       ))}
//     </div>
//   );
// }

// function TypingDots() {
//   return (
//     <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
//       <BotIcon size={30} />
//       <div style={{ ...botBubble, display: "flex", alignItems: "center", gap: 5, padding: "14px 14px" }}>
//         {[0, 1, 2].map((dot) => (
//           <span
//             key={dot}
//             style={{
//               width: 7,
//               height: 7,
//               borderRadius: "50%",
//               background: "#94A3B8",
//               animation: `cvDot 1.2s ${dot * 0.16}s infinite`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// const emptyData = {
//   name: "",
//   email: "",
//   mobile: "",
//   course: "",
//   branch: "",
//   state: "",
//   city: "",
//   message: "",
//   role: "",
//   experience: "",
// };

// export default function CareervidyaChatBot() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [step, setStep] = useState("init");
//   const [flow, setFlow] = useState("");
//   const [supportType, setSupportType] = useState("");
//   const [botTyping, setBotTyping] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState("");
//   const [data, setData] = useState(emptyData);
//   const [showTeaser, setShowTeaser] = useState(false);

//   const bodyRef = useRef(null);
//   const started = useRef(false);
//   const busyRef = useRef(false);
//   const mountedRef = useRef(false);

//   useEffect(() => {
//     mountedRef.current = true;

//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         const result = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || res.data?.courses || [];
//         if (mountedRef.current) setCourses(result);
//       } catch (err) {
//         console.error("Course fetch error:", err);
//       }
//     };

//     fetchCourses();
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     if (bodyRef.current) {
//       bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
//     }
//   }, [messages, step, botTyping, open]);

//   const addMsg = (from, text, link) => {
//     setMessages((previous) => [...previous, { from, text, link, time: timeNow() }]);
//   };

//   // Each item is a string, or { text, link: { label, url, phone? } }
//   const botSay = async (items) => {
//     for (const item of items) {
//       const { text, link } = typeof item === "string" ? { text: item } : item;
//       setBotTyping(true);
//       await sleep(Math.min(500 + text.length * 12, 1200));
//       if (!mountedRef.current) return;
//       setBotTyping(false);
//       addMsg("bot", text, link);
//       await sleep(200);
//     }
//   };

//   const startChat = async () => {
//     if (busyRef.current) return;
//     busyRef.current = true;
//     setStep("busy");
//     try {
//       await botSay([L.greeting1, L.greeting2]);
//       setStep("menu");
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   const openChat = () => {
//     setOpen(true);
//     setShowTeaser(false);
//     if (!started.current) {
//       started.current = true;
//       startChat();
//     }
//   };

//   // Welcome bubble pops up next to the avatar after 0.8s.
//   // The chat itself opens by itself only if AUTO_OPEN_MS is set (once per session).
//   useEffect(() => {
//     const t1 = setTimeout(() => setShowTeaser(true), 800);

//     let t2;
//     if (AUTO_OPEN_MS > 0) {
//       let alreadyOpened = false;
//       try {
//         alreadyOpened = !!sessionStorage.getItem("cvAutoOpened");
//       } catch (e) {}

//       if (!alreadyOpened) {
//         t2 = setTimeout(() => {
//           try {
//             sessionStorage.setItem("cvAutoOpened", "1");
//           } catch (e) {}
//           if (!started.current) openChat();
//         }, AUTO_OPEN_MS);
//       }
//     }

//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // One helper for every button tap: show the choice, let the bot reply, then show the next step
//   const choose = async ({ title, replies, next, before }) => {
//     if (busyRef.current || sending) return;

//     busyRef.current = true;
//     addMsg("user", title);
//     before?.();
//     setError("");
//     setStep("busy");

//     try {
//       await botSay(replies);
//       setStep(next);
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   /* ----- Main menu ----- */
//   const handleMain = (item) => {
//     if (item.key === "admission") {
//       return choose({ title: item.title, replies: [L.admIntro], next: "admission1", before: () => setFlow("admission") });
//     }
//     if (item.key === "counselling") {
//       return choose({ title: item.title, replies: [L.counIntro], next: "counselling", before: () => setFlow("counselling") });
//     }
//     if (item.key === "job") {
//       return choose({ title: item.title, replies: [L.jobIntro], next: "job", before: () => setFlow("job") });
//     }
//     return choose({ title: item.title, replies: [L.supportAsk], next: "supportMenu", before: () => setFlow("existing") });
//   };

//   /* ----- After admission form: About Career Vidya / Admission Process ----- */
//   const handleAdmissionInfo = (item) => {
//     if (item.key === "about") {
//       return choose({
//         title: item.title,
//         replies: [{ text: L.about, link: { label: "About Career Vidya", url: ABOUT_URL } }],
//         next: "admissionInfo",
//       });
//     }
//     if (item.key === "process") {
//       return choose({ title: item.title, replies: [L.admissionAsk], next: "admissionMenu" });
//     }
//     return choose({ title: item.title, replies: [L.backMenu], next: "menu", before: () => setFlow("") });
//   };

//   /* ----- Admission Process sub-menu ----- */
//   const handleAdmissionMenu = (item) => {
//     if (item.key === "eligibility") {
//       return choose({
//         title: item.title,
//         replies: [
//           { text: L.eligibility, link: { label: "Visit Career Vidya", url: SITE_URL } },
//           { text: `📞 You can also speak with our Admission Counselor at: +91 ${SUPPORT_PHONE}`, link: PHONE_LINK },
//         ],
//         next: "admissionMenu",
//       });
//     }
//     if (item.key === "how") {
//       return choose({ title: item.title, replies: [L.howToApply], next: "admissionMenu" });
//     }
//     if (item.key === "apply") {
//       return choose({
//         title: item.title,
//         replies: [{ text: L.applyText, link: { label: "Apply Now", url: APPLY_URL } }],
//         next: "admissionMenu",
//       });
//     }
//     return choose({ title: item.title, replies: [L.backMenu], next: "menu", before: () => setFlow("") });
//   };

//   const handleSupportType = (item) =>
//     choose({
//       title: item.title,
//       replies: [L.supportIntro],
//       next: "existing",
//       before: () => setSupportType(item.key),
//     });

//   const onChange = (event) => {
//     const { name, value } = event.target;

//     if (name === "mobile") {
//       setData((p) => ({ ...p, mobile: value.replace(/\D/g, "").slice(0, 10) }));
//       return;
//     }

//     if (name === "course" && flow === "admission") {
//       const selected = courses.find((c) => c.name === value);
//       setSpecializations(
//         Array.isArray(selected?.specializations) ? selected.specializations : []
//       );
//       setData((p) => ({ ...p, course: value, branch: "" }));
//       return;
//     }

//     setData((p) => ({ ...p, [name]: value }));
//   };

//   const handleNext = async (event) => {
//     event.preventDefault();
//     if (busyRef.current) return;

//     addMsg("user", `${data.name}\n${data.email}\n${data.mobile}`);

//     busyRef.current = true;
//     setStep("busy");

//     try {
//       await botSay([L.thanks(data.name.trim().split(" ")[0])]);
//       setStep("admission2");
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   const submitLead = async ({ payload, successMessages, returnStep, nextStep = "menu", followUp = L.anythingElse }) => {
//     if (busyRef.current || sending) return;

//     busyRef.current = true;
//     setSending(true);
//     setError("");
//     setStep("busy");

//     try {
//       await api.post("/api/v1/getintouch", payload);
//       setData(emptyData);
//       setSpecializations([]);
//       await botSay([...successMessages, followUp]);
//       if (nextStep === "menu") setFlow("");
//       setStep(nextStep);
//     } catch (err) {
//       console.error("Chatbot lead submission failed:", err);
//       setError(err?.response?.data?.message || L.errDefault);
//       await botSay([L.err]);
//       setStep(returnStep);
//     } finally {
//       busyRef.current = false;
//       setSending(false);
//     }
//   };

//   const handleAdmissionSubmit = (event) => {
//     event.preventDefault();
//     addMsg(
//       "user",
//       `${data.course}${data.branch ? ` - ${data.branch}` : ""}\n${data.city}, ${data.state}`
//     );
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email,
//         mobile: data.mobile,
//         course: data.course,
//         branch: data.branch || "NA",
//         state: data.state,
//         city: data.city,
//         message: `Chatbot Admission Enquiry | State: ${data.state}`,
//       },
//       successMessages: [L.admDone],
//       returnStep: "admission2",
//       nextStep: "admissionInfo", // the sub-menu appears only after the form is submitted
//       followUp: L.admNext,
//     });
//   };

//   const handleCounsellingSubmit = (event) => {
//     event.preventDefault();
//     addMsg(
//       "user",
//       `${data.name} | ${data.mobile}\n${data.course || L.notSpecified}\n${data.message || L.callbackReq}`
//     );
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email || "Not provided",
//         mobile: data.mobile,
//         course: data.course || "Counselling",
//         branch: "NA",
//         city: data.city || "NA",
//         message: `Chatbot Counselling Enquiry: ${data.message || "Callback requested"}`,
//       },
//       successMessages: [
//         L.counDone,
//         { text: "You can also meet our counsellors here.", link: { label: "Meet our counsellors", url: TEAM_URL } },
//       ],
//       returnStep: "counselling",
//     });
//   };

//   const handleJobSubmit = (event) => {
//     event.preventDefault();
//     addMsg(
//       "user",
//       `${data.name} | ${data.mobile}\n${data.role}\n${data.experience}${data.city ? `, ${data.city}` : ""}`
//     );
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email || "Not provided",
//         mobile: data.mobile,
//         course: "Job Enquiry",
//         branch: data.role || "NA",
//         city: data.city || "NA",
//         message: `Chatbot Job Enquiry | Role: ${data.role} | Experience: ${data.experience}`,
//       },
//       successMessages: [
//         L.jobDone,
//         { text: "You can now browse open jobs on our Job Portal.", link: { label: "Open Job Portal", url: JOB_URL } },
//       ],
//       returnStep: "job",
//     });
//   };

//   const handleExistingSubmit = (event) => {
//     event.preventDefault();
//     addMsg("user", `${data.name} | ${data.mobile}\n${data.message}`);
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email || "Not provided",
//         mobile: data.mobile,
//         course: "Existing Student Support",
//         branch: supportType || "NA",
//         city: data.city || "NA",
//         message: `Chatbot Existing Student Support | Type: ${supportType || "NA"} | ${data.message}`,
//       },
//       successMessages: [L.existDone],
//       returnStep: "existing",
//     });
//   };

//   const goBack = () => {
//     if (sending) return;
//     setError("");
//     if (step === "admission2") {
//       setStep("admission1");
//       return;
//     }
//     if (step === "existing") {
//       setStep("supportMenu");
//       return;
//     }
//     setFlow("");
//     setStep("menu");
//   };

//   const renderForm = ({ progress, fields, submitLabel, icon, onSubmit }) => (
//     <form key={step} onSubmit={onSubmit} style={formBox}>
//       {progress}

//       {fields}

//       {error && (
//         <div role="alert" style={errorStyle}>
//           {error}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={sending}
//         className="cv-btn"
//         style={{ ...primaryBtn, opacity: sending ? 0.65 : 1 }}
//       >
//         {sending ? "Submitting..." : submitLabel}
//         {!sending && (icon || <Send size={17} />)}
//       </button>

//       <button type="button" onClick={goBack} disabled={sending} style={backBtn}>
//         <ArrowLeft size={15} /> Back
//       </button>
//     </form>
//   );

//   const showForms = !botTyping;

//   return (
//     <>
//       <style>{`
//         @keyframes cvPop {
//           from { opacity: 0; transform: translateY(6px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes cvExpand {
//           from { opacity: 0; transform: scale(.85) translateY(16px); }
//           to { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes cvDot {
//           0%,60%,100% { transform: translateY(0); opacity: .4; }
//           30% { transform: translateY(-4px); opacity: 1; }
//         }
//         @keyframes cvBob {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-4px); }
//         }
//         @keyframes cvWave {
//           0%,100% { transform: rotate(0deg); }
//           25% { transform: rotate(-14deg); }
//           75% { transform: rotate(14deg); }
//         }
//         @keyframes cvTeaser {
//           from { opacity: 0; transform: translateX(14px) scale(.9); }
//           to { opacity: 1; transform: translateX(0) scale(1); }
//         }
//         .cv-chat-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
//         .cv-chat-scroll input:focus,
//         .cv-chat-scroll select:focus,
//         .cv-chat-scroll textarea:focus {
//           border-color: ${BRAND} !important;
//           box-shadow: 0 0 0 3px rgba(30,64,175,.12);
//         }
//         .cv-chip { transition: background .15s, color .15s, transform .15s; }
//         .cv-chip:hover { background: ${BRAND} !important; color: #fff !important; }
//         .cv-chip:active { transform: scale(.97); }
//         .cv-btn { transition: filter .15s, transform .15s; }
//         .cv-btn:hover:not(:disabled) { filter: brightness(1.1); }
//         .cv-btn:active:not(:disabled) { transform: scale(.98); }
//         .cv-chat-window button:focus-visible,
//         .cv-chat-window a:focus-visible { outline: 2px solid ${BRAND}; outline-offset: 2px; }
//         @media (max-width: 480px) {
//           .cv-chat-window {
//             right: 8px !important;
//             bottom: 8px !important;
//             width: calc(100vw - 16px) !important;
//             height: min(640px, calc(100dvh - 16px)) !important;
//             border-radius: 16px !important;
//           }
//           .cv-chat-fab { right: 14px !important; bottom: 22px !important; }
//           .cv-chat-teaser { right: 104px !important; bottom: 30px !important; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .cv-chat-fab, .cv-chat-window, .cv-chat-window * { animation: none !important; transition: none !important; }
//         }
//       `}</style>

//       {!open && (
//         <>
//           {showTeaser && (
//             <div className="cv-chat-teaser" style={teaserStyle}>
//               <button
//                 type="button"
//                 onClick={openChat}
//                 style={teaserTextBtn}
//                 aria-label="Open Career Vidya AI assistant"
//               >
//                 Welcome to Career Vidya!!
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowTeaser(false)}
//                 style={teaserClose}
//                 aria-label="Dismiss welcome message"
//               >
//                 <X size={12} strokeWidth={3} />
//               </button>
//               <span style={teaserTail} />
//             </div>
//           )}

//           <button
//             type="button"
//             className="cv-chat-fab"
//             onClick={openChat}
//             style={fabStyle}
//             aria-label="Open Career Vidya AI assistant"
//           >
//             <Avatar size={70} wave />
//           </button>
//         </>
//       )}

//       {open && (
//         <section
//           className="cv-chat-window"
//           style={windowStyle}
//           aria-label="Career Vidya AI Assistant"
//         >
//           <header style={headerStyle}>
//             <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
//               <div style={{ position: "relative", display: "flex" }}>
//                 <BotIcon size={44} />
//                 <span style={headerDot} />
//               </div>
//               <div style={{ minWidth: 0 }}>
//                 <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
//                   Career Vidya <span style={aiTag}>AI</span>
//                 </div>
//                 <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 5 }}>
//                   <span style={statusDot} />
//                   {botTyping ? "Typing..." : "Online"}
//                 </div>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={() => setOpen(false)}
//               style={closeStyle}
//               aria-label="Close chat"
//             >
//               <X size={22} />
//             </button>
//           </header>

//           <div ref={bodyRef} className="cv-chat-scroll" style={bodyStyle} aria-live="polite">
//             {messages.map((message, index) => (
//               <div
//                 key={`${index}-${message.time}`}
//                 style={{
//                   display: "flex",
//                   justifyContent: message.from === "user" ? "flex-end" : "flex-start",
//                   alignItems: "flex-end",
//                   gap: 8,
//                   marginBottom: 12,
//                   animation: "cvPop .25s ease",
//                 }}
//               >
//                 {message.from === "bot" && <BotIcon size={30} />}

//                 <div style={{ maxWidth: "80%", minWidth: 0 }}>
//                   <div style={message.from === "user" ? userBubble : botBubble}>
//                     {message.text}
//                   </div>

//                   {message.link && (
//                     <a
//                       href={message.link.url}
//                       {...(message.link.phone ? {} : { target: "_blank", rel: "noopener noreferrer" })}
//                       className="cv-btn"
//                       style={linkBtn}
//                     >
//                       {message.link.phone ? <PhoneCall size={15} /> : null}
//                       {message.link.label}
//                       {message.link.phone ? null : <ExternalLink size={15} />}
//                     </a>
//                   )}

//                   <div
//                     style={{
//                       ...timeStyle,
//                       textAlign: message.from === "user" ? "right" : "left",
//                     }}
//                   >
//                     {message.time}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {botTyping && <TypingDots />}

//             {step === "menu" && showForms && <Chips items={MAIN_MENU} onPick={handleMain} />}
//             {step === "admissionInfo" && showForms && <Chips items={ADMISSION_INFO_MENU} onPick={handleAdmissionInfo} />}
//             {step === "admissionMenu" && showForms && <Chips items={ADMISSION_MENU} onPick={handleAdmissionMenu} />}
//             {step === "supportMenu" && showForms && <Chips items={SUPPORT_MENU} onPick={handleSupportType} />}

//             {step === "admission1" &&
//               showForms &&
//               renderForm({
//                 progress: <Progress current={1} total={2} label="Your details" />,
//                 submitLabel: "Continue",
//                 icon: <ChevronRight size={18} />,
//                 onSubmit: handleNext,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.email} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
//                   </>
//                 ),
//               })}

//             {step === "admission2" &&
//               showForms &&
//               renderForm({
//                 progress: <Progress current={2} total={2} label="Course and city" />,
//                 submitLabel: "Submit",
//                 onSubmit: handleAdmissionSubmit,
//                 fields: (
//                   <>
//                     <Field label={L.course}>
//                       <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>
//                         <option value="">{L.selectCourse}</option>
//                         {courses.map((course) => (
//                           <option key={course._id || course.name} value={course.name}>
//                             {course.name}
//                           </option>
//                         ))}
//                       </select>
//                     </Field>

//                     <Field label={L.specialization}>
//                       <select
//                         name="branch"
//                         value={data.branch}
//                         onChange={onChange}
//                         disabled={!specializations.length}
//                         required={specializations.length > 0}
//                         style={{ ...inputStyle, opacity: specializations.length ? 1 : 0.6 }}
//                       >
//                         <option value="">
//                           {specializations.length ? L.selectSpec : L.noSpec}
//                         </option>
//                         {specializations.map((s, i) => (
//                           <option key={i} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </Field>

//                     <Field label={L.state}>
//                       <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>
//                         <option value="">{L.selectState}</option>
//                         {STATES.map((s) => (
//                           <option key={s} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </Field>

//                     <TextInput label={L.city} name="city" value={data.city} onChange={onChange} />
//                   </>
//                 ),
//               })}

//             {step === "counselling" &&
//               showForms &&
//               renderForm({
//                 submitLabel: "Request a callback",
//                 icon: <PhoneCall size={17} />,
//                 onSubmit: handleCounsellingSubmit,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
//                     <TextInput label={L.interestedCourse} name="course" value={data.course} onChange={onChange} required={false} />
//                     <Field label={L.queryOpt}>
//                       <textarea
//                         name="message"
//                         value={data.message}
//                         onChange={onChange}
//                         rows={2}
//                         style={{ ...inputStyle, height: 66, padding: 10, resize: "none" }}
//                       />
//                     </Field>
//                   </>
//                 ),
//               })}

//             {step === "job" &&
//               showForms &&
//               renderForm({
//                 submitLabel: "Submit",
//                 icon: <BriefcaseBusiness size={17} />,
//                 onSubmit: handleJobSubmit,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
//                     <TextInput label={L.emailOpt} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} required={false} />
//                     <TextInput label={L.jobRole} name="role" value={data.role} onChange={onChange} />
//                     <Field label={L.experience}>
//                       <select name="experience" value={data.experience} onChange={onChange} required style={inputStyle}>
//                         <option value="">{L.selectExp}</option>
//                         {EXPERIENCE_VALUES.map((value) => (
//                           <option key={value} value={value}>{value}</option>
//                         ))}
//                       </select>
//                     </Field>
//                     <TextInput label={L.cityOpt} name="city" value={data.city} onChange={onChange} required={false} />
//                   </>
//                 ),
//               })}

//             {step === "existing" &&
//               showForms &&
//               renderForm({
//                 submitLabel: "Submit query",
//                 onSubmit: handleExistingSubmit,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
//                     <TextInput label={L.emailOpt} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} required={false} />
//                     <Field label={L.query}>
//                       <textarea
//                         name="message"
//                         value={data.message}
//                         onChange={onChange}
//                         rows={3}
//                         required
//                         style={{ ...inputStyle, height: 78, padding: 10, resize: "none" }}
//                       />
//                     </Field>
//                   </>
//                 ),
//               })}
//           </div>

//           <footer style={footerStyle}>
//             <span>AI assistant · Powered by Career Vidya</span>
//             <a href={`tel:+91${SUPPORT_PHONE}`} style={{ marginLeft: "auto", color: BRAND, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
//               <PhoneCall size={13} /> {SUPPORT_PHONE}
//             </a>
//           </footer>
//         </section>
//       )}
//     </>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const fabStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET,
//   width: 76,
//   height: 76,
//   padding: 0,
//   display: "grid",
//   placeItems: "center",
//   borderRadius: "50%",
//   border: "3px solid #fff",
//   background: "#F9A94B",
//   cursor: "pointer",
//   zIndex: 9998,
//   boxShadow: "0 8px 22px rgba(15,23,42,.28)",
//   animation: "cvBob 3s ease-in-out infinite",
// };

// // White speech bubble next to the avatar, with a tail pointing at it and a small x on top-left
// const teaserStyle = {
//   position: "fixed",
//   right: 112,
//   bottom: BOTTOM_OFFSET + 8,
//   width: "min(210px, calc(100vw - 150px))",
//   background: "#fff",
//   borderRadius: 18,
//   boxShadow: "0 8px 24px rgba(15,23,42,.18)",
//   zIndex: 9998,
//   animation: "cvTeaser .45s cubic-bezier(.2,.8,.2,1)",
// };

// const teaserTextBtn = {
//   display: "block",
//   width: "100%",
//   padding: "14px 18px",
//   border: "none",
//   background: "transparent",
//   color: "#1F2937",
//   fontSize: 16,
//   fontWeight: 500,
//   lineHeight: 1.4,
//   textAlign: "left",
//   cursor: "pointer",
//   fontFamily: "inherit",
//   borderRadius: 18,
// };

// const teaserClose = {
//   position: "absolute",
//   top: -9,
//   left: -9,
//   width: 22,
//   height: 22,
//   padding: 0,
//   borderRadius: "50%",
//   border: "none",
//   background: "#374151",
//   color: "#fff",
//   display: "grid",
//   placeItems: "center",
//   cursor: "pointer",
// };

// const teaserTail = {
//   position: "absolute",
//   right: -6,
//   top: "50%",
//   marginTop: -7,
//   width: 14,
//   height: 14,
//   background: "#fff",
//   transform: "rotate(45deg)",
//   borderRadius: 3,
//   pointerEvents: "none",
// };

// const headerDot = {
//   position: "absolute",
//   right: 0,
//   bottom: 0,
//   width: 12,
//   height: 12,
//   borderRadius: "50%",
//   background: "#22C55E",
//   border: "2px solid #fff",
//   boxSizing: "border-box",
// };

// const windowStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET,
//   width: "min(400px, calc(100vw - 24px))",
//   height: `min(640px, calc(100dvh - ${BOTTOM_OFFSET + 15}px))`,
//   background: "#fff",
//   borderRadius: 18,
//   border: "1px solid #E2E8F0",
//   boxShadow: "0 20px 60px rgba(15,23,42,.22)",
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
//   zIndex: 10001,
//   fontFamily: "inherit",
//   boxSizing: "border-box",
//   transformOrigin: "bottom right",
//   animation: "cvExpand .3s ease",
// };

// const headerStyle = {
//   background: "#fff",
//   borderBottom: "1px solid #E2E8F0",
//   padding: "12px 12px 12px 14px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   gap: 8,
//   flexShrink: 0,
// };

// const aiTag = {
//   marginLeft: 4,
//   padding: "1px 7px",
//   borderRadius: 6,
//   background: BRAND_SOFT,
//   color: BRAND,
//   fontSize: 11,
//   fontWeight: 700,
// };

// const statusDot = {
//   width: 8,
//   height: 8,
//   borderRadius: "50%",
//   background: "#22C55E",
// };

// const closeStyle = {
//   background: "#F1F5F9",
//   border: "none",
//   color: "#334155",
//   width: 38,
//   height: 38,
//   borderRadius: "50%",
//   display: "grid",
//   placeItems: "center",
//   cursor: "pointer",
//   flexShrink: 0,
// };

// const bodyStyle = {
//   flex: 1,
//   minHeight: 0,
//   overflowY: "auto",
//   padding: 14,
//   background: "#F8FAFC",
// };

// const botBubble = {
//   background: "#fff",
//   color: "#0F172A",
//   padding: "10px 13px",
//   borderRadius: "14px 14px 14px 4px",
//   fontSize: 14,
//   border: "1px solid #E2E8F0",
//   lineHeight: 1.5,
//   whiteSpace: "pre-line",
//   overflowWrap: "anywhere",
// };

// const userBubble = {
//   background: BRAND,
//   color: "#fff",
//   padding: "10px 13px",
//   borderRadius: "14px 14px 4px 14px",
//   fontSize: 14,
//   lineHeight: 1.5,
//   whiteSpace: "pre-line",
//   overflowWrap: "anywhere",
// };

// const linkBtn = {
//   display: "inline-flex",
//   alignItems: "center",
//   gap: 7,
//   marginTop: 6,
//   padding: "8px 14px",
//   borderRadius: 999,
//   background: BRAND,
//   color: "#fff",
//   fontSize: 13,
//   fontWeight: 600,
//   textDecoration: "none",
// };

// const timeStyle = {
//   fontSize: 10.5,
//   color: "#94A3B8",
//   marginTop: 3,
// };

// const chipRow = {
//   display: "flex",
//   flexWrap: "wrap",
//   gap: 8,
//   marginLeft: 38,
//   marginBottom: 8,
// };

// const chipStyle = {
//   padding: "9px 16px",
//   background: "#fff",
//   color: BRAND,
//   border: `1.5px solid ${BRAND}`,
//   borderRadius: 999,
//   fontSize: 14,
//   fontWeight: 500,
//   cursor: "pointer",
//   fontFamily: "inherit",
//   lineHeight: 1.3,
// };

// const formBox = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 12,
//   marginLeft: 38,
//   marginBottom: 8,
//   background: "#fff",
//   border: "1px solid #E2E8F0",
//   borderRadius: 14,
//   padding: 14,
//   minWidth: 0,
//   animation: "cvPop .25s ease",
// };

// const progressText = {
//   fontSize: 12,
//   fontWeight: 600,
//   color: "#475569",
//   marginBottom: 6,
// };

// const progressTrack = {
//   height: 5,
//   borderRadius: 3,
//   background: "#E2E8F0",
//   overflow: "hidden",
// };

// const progressFill = {
//   height: "100%",
//   borderRadius: 3,
//   background: BRAND,
//   transition: "width .4s ease",
// };

// const fieldLabel = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 5,
//   width: "100%",
//   minWidth: 0,
// };

// const fieldCaption = {
//   fontSize: 12.5,
//   fontWeight: 600,
//   color: "#334155",
// };

// const inputStyle = {
//   width: "100%",
//   minWidth: 0,
//   height: 42,
//   padding: "0 11px",
//   borderRadius: 10,
//   border: "1px solid #CBD5E1",
//   background: "#fff",
//   color: "#0F172A",
//   fontSize: 14,
//   outline: "none",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
//   transition: "border-color .15s, box-shadow .15s",
// };

// const primaryBtn = {
//   width: "100%",
//   minHeight: 46,
//   padding: "9px 12px",
//   background: BRAND,
//   color: "#fff",
//   border: "none",
//   borderRadius: 10,
//   fontWeight: 600,
//   fontSize: 14,
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 8,
//   textDecoration: "none",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const backBtn = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: 6,
//   padding: 6,
//   border: "none",
//   background: "transparent",
//   color: "#64748B",
//   fontSize: 13,
//   cursor: "pointer",
//   fontFamily: "inherit",
// };

// const errorStyle = {
//   background: "#FEF2F2",
//   color: "#B91C1C",
//   padding: 9,
//   borderRadius: 8,
//   fontSize: 12.5,
//   lineHeight: 1.5,
// };

// const footerStyle = {
//   minHeight: 34,
//   padding: "5px 14px",
//   borderTop: "1px solid #E2E8F0",
//   background: "#fff",
//   color: "#94A3B8",
//   fontSize: 11.5,
//   display: "flex",
//   alignItems: "center",
//   gap: 4,
//   flexShrink: 0,
// };







"use client";



import { useState, useEffect, useRef } from "react";

import {

  X,

  Send,

  PhoneCall,

  ArrowLeft,

  ExternalLink,

  BriefcaseBusiness,

  ChevronRight,

} from "lucide-react";

import api from "@/utlis/api";



const BOTTOM_OFFSET = 90;

const AUTO_OPEN_MS = 0; // 0 = only show the welcome bubble. Set e.g. 6000 to open the chat by itself.



const SITE_URL = "https://careervidya.in/";

const ABOUT_URL = "https://careervidya.in/Aboutus";

const APPLY_URL = "https://careervidya.in/counselling";

const TEAM_URL = "https://careervidya.in/our-Team";

const JOB_URL = "https://jobportal.careervidya.in/";

const SUPPORT_PHONE = "9289716667";



const BRAND = "#1E40AF"; // single accent colour (change here to match your site)

const BRAND_SOFT = "#EFF4FF";



const STATES = [

  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",

  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",

  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",

  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",

  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",

  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",

  "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",

  "Chandigarh", "Puducherry",

];



const EXPERIENCE_VALUES = [

  "Fresher",

  "Less than 1 year",

  "1-3 years",

  "3-5 years",

  "5+ years",

];



/* ---------------- MENUS (pill buttons) ---------------- */



// 1. Main menu. Every option opens a compulsory form.

const MAIN_MENU = [

  { key: "admission", title: " Looking For Admission" },

  { key: "counselling", title: " Looking For Counselling" },

  { key: "job", title: " looking from Job Portal" },

  { key: "existing", title: "Existing Student Support" },

];



// 2. Shown only AFTER the admission form is submitted

const ADMISSION_INFO_MENU = [

  { key: "about", title: "About Career Vidya" },

  { key: "process", title: "Admission Process" },

  { key: "back", title: "Back to Main Menu" },

];



// 3. Inside "Admission Process"

const ADMISSION_MENU = [

  { key: "eligibility", title: "Eligibility Criteria" },

  { key: "how", title: "How to Apply" },

  { key: "apply", title: "Apply Now" },

  { key: "back", title: "Back to Main Menu" },

];



// Existing Student Support types (pick one, then fill the form)

const SUPPORT_MENU = [
  {
    key: "University Examination Queries",
    title: "University Examination Queries",
    number: "01",
    description: "Exam dates, results, admit cards & exam-related help.",
  },
  {
    key: "Document Cell",
    title: "Document Cell",
    number: "02",
    description: "Marksheets, certificates & document requests.",
  },
  {
    key: "Scholarship",
    title: "Scholarship",
    number: "03",
    description: "Scholarship eligibility, status & related queries.",
  },
  {
    key: "Fee & Payment Related",
    title: "Fee & Payment Related",
    number: "04",
    description: "Fee payment, receipts, refunds & payment issues.",
  },
  {
    key: "Other Query",
    title: "Other Query",
    number: "05",
    description: "Any other student support or university query.",
  },
 ];

const SUPPORT_ANSWER_MENU = [
  { key: "supportBack", title: "Back" },
  { key: "mainMenu", title: "Main Menu" },
];



/* ---------------- TEXT ---------------- */




const SUPPORT_ANSWERS = {
  "University Examination Queries": {
    message:
      "For examination-related assistance, please call or WhatsApp our support team. Thank you for contacting Career Vidya.",
    phone: "+91-9289716667",
    whatsapp: "https://wa.me/919289716667",
  },
  "Document Cell": {
    message:
      "For document-related requests such as transcripts, migration certificates and degrees, please call or WhatsApp our Document Cell. Thank you for contacting Career Vidya.",
    phone: "+91-919289716667",
    whatsapp: "https://wa.me/919289716667",
  },
  Scholarship: {
    message:
      "For scholarship eligibility, application status or related assistance, please contact our student support team. They will guide you further.",
    phone: "+91-9289716667",
    whatsapp: "https://wa.me/919289716667",
  },
  "Fee & Payment Related": {
    message:
      "For fee payments, payment confirmation, receipts or refund-related assistance, please contact our student support team with your enrollment details and payment reference, if available.",
    phone: "+91-9289716667",
    whatsapp: "https://wa.me/919289716667",
  },
  "Other Query": {
    message:
      "For any other student query, please contact our student support team and briefly explain your issue. Our team will guide you to the right department.",
    phone: "+91-9289716667",
    whatsapp: "https://wa.me/919289716667",
  },
};

const PHONE_LINK = {

  label: `Call +91 ${SUPPORT_PHONE}`,

  url: `tel:+91${SUPPORT_PHONE}`,

  phone: true,

};



const L = {

  greeting1: "Hi! I'm Career Vidya's AI assistant. 👋",

  greeting2: "What would you like help with?",

  anythingElse: "Is there anything else I can help you with?",

  backMenu: "Sure! Here is the main menu.",



  admIntro:

    "Sure! Please fill in your details first (2 quick steps). After that, I'll show you more information.",

  thanks: (n) => `Thanks, ${n}! Now choose your course.`,

  admDone: "Thank you! Your admission enquiry is submitted. ✅ Our counsellor will contact you shortly.",

  admNext: "What would you like to know next?",



  about:

    "Career Vidya helps students choose the right course and university, with guidance from admission to career.",

  admissionAsk: "What would you like to know about admission?",

  eligibility:

    "Eligibility varies for each program. Please visit the Program page on our website to check the detailed eligibility criteria for your desired course.",

  howToApply:

    "Applying is simple:\n1. Check the eligibility for your course\n2. Tap Apply Now and book a counselling session\n3. Our counsellor will guide you through the rest",

  applyText: "You can apply by booking a counselling session with our team.",



  counIntro: "Sure! Please share your details and a counsellor will call you.",

  jobIntro: "Sure! Please fill in this short form and our team will get in touch.",

  supportAsk: "Please choose your query type.",

  supportIntro: "Please share your details and your query.",



  counDone: "Thank you! Your callback request is submitted. ✅",

  jobDone: "Thank you! Your job enquiry is submitted. ✅ Our team will contact you soon.",

  existDone: "Thank you! Your query is submitted. ✅ Our support team will reply soon.",

  err: "Sorry, something went wrong. Please try again.",

  errDefault: "Unable to submit your details. Please try again.",



  fullName: "Full name",

  email: "Email address",

  emailOpt: "Email (optional)",

  mobile: "Mobile number (10 digits)",

  mobileTitle: "Enter a valid 10-digit mobile number",

  course: "Course",

  specialization: "Specialization",

  state: "State",

  city: "City",

  cityOpt: "City (optional)",

  interestedCourse: "Interested course (optional)",

  queryOpt: "Your query (optional)",

  query: "Your query",

  jobRole: "Job role (e.g. Sales, IT, HR)",

  experience: "Experience",

  selectCourse: "Select course",

  selectSpec: "Select specialization",

  noSpec: "Select a course first",

  selectState: "Select state",

  selectExp: "Select experience",



  notSpecified: "Course not specified",

  callbackReq: "Callback requested",

};



const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



const timeNow = () =>

  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });



/* ---------- Girl avatar (inline SVG, no image file needed) ---------- */

function Avatar({ size = 34, wave = false }) {

  const skin = "#F8D5B8";

  return (

    <svg

      width={size}

      height={size}

      viewBox="0 0 100 100"

      role="img"

      aria-label="Career Vidya assistant"

      style={{ flexShrink: 0, borderRadius: "50%", display: "block" }}

    >

      <defs>

        <clipPath id="cvClip">

          <circle cx="50" cy="50" r="50" />

        </clipPath>

      </defs>

      <g clipPath="url(#cvClip)">

        <rect width="100" height="100" fill="#F9A94B" />

        <path d="M22 52c0-22 12-34 28-34s28 12 28 34v26H22z" fill="#2B1B17" />

        <path d="M14 100c2-20 16-30 36-30s34 10 36 30z" fill="#1E40AF" />

        <path d="M42 70l8 10 8-10z" fill="#F3C9A8" />

        <rect x="43" y="58" width="14" height="16" rx="6" fill="#F3C9A8" />

        <ellipse cx="50" cy="45" rx="19" ry="21" fill={skin} />

        <path d="M30 44c0-14 9-22 21-22 11 0 19 7 19 20-8-2-15-8-18-14-3 7-12 13-22 16z" fill="#2B1B17" />

        <ellipse cx="42" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />

        <ellipse cx="58" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />

        <circle cx="42.7" cy="46" r=".7" fill="#fff" />

        <circle cx="58.7" cy="46" r=".7" fill="#fff" />

        <circle cx="38" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />

        <circle cx="62" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />

        <path d="M44 56c3 3.5 9 3.5 12 0" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round" />

        <circle cx="50" cy="36" r="1.4" fill="#DC2626" />

        {/* headset */}

        <path d="M29 48c-2-20 8-30 21-30s23 10 21 30" stroke="#1E3A8A" strokeWidth="3.2" fill="none" strokeLinecap="round" />

        <rect x="25" y="46" width="7" height="13" rx="3.5" fill="#1E3A8A" />

        <rect x="68" y="46" width="7" height="13" rx="3.5" fill="#1E3A8A" />

        <path d="M71 59c0 8-8 10-15 10" stroke="#1E3A8A" strokeWidth="2.4" fill="none" strokeLinecap="round" />

        <circle cx="55" cy="69" r="3" fill="#1E3A8A" />

        {/* waving hand (launcher only) */}

        {wave && (

          <g

            style={{

              transformOrigin: "84px 80px",

              animation: "cvWave 1.6s ease-in-out infinite",

            }}

            fill={skin}

            stroke="#E3AE88"

            strokeWidth=".8"

          >

            <rect x="77.5" y="53" width="3.4" height="11" rx="1.7" />

            <rect x="82.3" y="51" width="3.4" height="12" rx="1.7" />

            <rect x="87" y="53" width="3.4" height="11" rx="1.7" />

            <ellipse cx="84" cy="67" rx="6.8" ry="7.5" />

          </g>

        )}

      </g>

    </svg>

  );

}



// Used inside the chat (header, message icons)

function BotIcon({ size = 30 }) {

  return <Avatar size={size} />;

}



/* ---------- Fields (defined OUTSIDE the main component so inputs keep focus) ---------- */

function Field({ label, children }) {

  return (

    <label style={fieldLabel}>

      <span style={fieldCaption}>{label}</span>

      {children}

    </label>

  );

}



function TextInput({ label, name, value, onChange, type = "text", required = true, ...rest }) {

  return (

    <Field label={label}>

      <input

        name={name}

        type={type}

        value={value}

        onChange={onChange}

        required={required}

        style={inputStyle}

        {...rest}

      />

    </Field>

  );

}



const mobileProps = {

  type: "tel",

  inputMode: "numeric",

  autoComplete: "tel",

  pattern: "[6-9][0-9]{9}",

  title: L.mobileTitle,

  minLength: 10,

  maxLength: 10,

};



function Progress({ current, total, label }) {

  return (

    <div>

      <div style={progressText}>

        Step {current} of {total} · {label}

      </div>

      <div style={progressTrack}>

        <div style={{ ...progressFill, width: `${(current / total) * 100}%` }} />

      </div>

    </div>

  );

}



function Chips({ items, onPick }) {
  return (
    <div style={chipRow} role="group" aria-label="Options">
      {items.map((item, index) => (
        <div
          key={item.key}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: item.description ? 4 : 0,
            animation: `cvPop .3s ${index * 0.05}s ease backwards`,
          }}
        >
          <button
            type="button"
            className="cv-chip"
            onClick={() => onPick(item)}
            style={chipStyle}
          >
            {item.number ? `${item.number} ` : ""}
            {item.title}
          </button>
          {item.description && (
            <span
              style={{
                display: "block",
                maxWidth: 360,
                paddingLeft: 10,
                color: "#64748B",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {item.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function TypingDots() {

  return (

    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>

      <BotIcon size={30} />

      <div style={{ ...botBubble, display: "flex", alignItems: "center", gap: 5, padding: "14px 14px" }}>

        {[0, 1, 2].map((dot) => (

          <span

            key={dot}

            style={{

              width: 7,

              height: 7,

              borderRadius: "50%",

              background: "#94A3B8",

              animation: `cvDot 1.2s ${dot * 0.16}s infinite`,

            }}

          />

        ))}

      </div>

    </div>

  );

}



const emptyData = {

  name: "",

  email: "",

  mobile: "",

  course: "",

  branch: "",

  state: "",

  city: "",

  message: "",

  role: "",

  experience: "",

};



export default function CareervidyaChatBot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [courses, setCourses] = useState([]);

  const [specializations, setSpecializations] = useState([]);

  const [step, setStep] = useState("init");

  const [flow, setFlow] = useState("");

  const [supportType, setSupportType] = useState("");

  const [botTyping, setBotTyping] = useState(false);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [data, setData] = useState(emptyData);

  const [showTeaser, setShowTeaser] = useState(false);



  const bodyRef = useRef(null);

  const started = useRef(false);

  const busyRef = useRef(false);

  const mountedRef = useRef(false);



  useEffect(() => {

    mountedRef.current = true;



    const fetchCourses = async () => {

      try {

        const res = await api.get("/api/v1/course");

        const result = Array.isArray(res.data)

          ? res.data

          : res.data?.data || res.data?.courses || [];

        if (mountedRef.current) setCourses(result);

      } catch (err) {

        console.error("Course fetch error:", err);

      }

    };



    fetchCourses();

    return () => {

      mountedRef.current = false;

    };

  }, []);



  useEffect(() => {

    if (bodyRef.current) {

      bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });

    }

  }, [messages, step, botTyping, open]);



  const addMsg = (from, text, link) => {

    setMessages((previous) => [...previous, { from, text, link, time: timeNow() }]);

  };



  // Each item is a string, or { text, link: { label, url, phone? } }

  const botSay = async (items) => {

    for (const item of items) {

      const { text, link } = typeof item === "string" ? { text: item } : item;

      setBotTyping(true);

      await sleep(Math.min(500 + text.length * 12, 1200));

      if (!mountedRef.current) return;

      setBotTyping(false);

      addMsg("bot", text, link);

      await sleep(200);

    }

  };



  const startChat = async () => {

    if (busyRef.current) return;

    busyRef.current = true;

    setStep("busy");

    try {

      await botSay([L.greeting1, L.greeting2]);

      setStep("menu");

    } finally {

      busyRef.current = false;

    }

  };



  const openChat = () => {

    setOpen(true);

    setShowTeaser(false);

    if (!started.current) {

      started.current = true;

      startChat();

    }

  };



  // Welcome bubble pops up next to the avatar after 0.8s.

  // The chat itself opens by itself only if AUTO_OPEN_MS is set (once per session).

  useEffect(() => {

    const t1 = setTimeout(() => setShowTeaser(true), 800);



    let t2;

    if (AUTO_OPEN_MS > 0) {

      let alreadyOpened = false;

      try {

        alreadyOpened = !!sessionStorage.getItem("cvAutoOpened");

      } catch (e) {}



      if (!alreadyOpened) {

        t2 = setTimeout(() => {

          try {

            sessionStorage.setItem("cvAutoOpened", "1");

          } catch (e) {}

          if (!started.current) openChat();

        }, AUTO_OPEN_MS);

      }

    }



    return () => {

      clearTimeout(t1);

      clearTimeout(t2);

    };

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);



  // One helper for every button tap: show the choice, let the bot reply, then show the next step

  const choose = async ({ title, replies, next, before }) => {

    if (busyRef.current || sending) return;



    busyRef.current = true;

    addMsg("user", title);

    before?.();

    setError("");

    setStep("busy");



    try {

      await botSay(replies);

      setStep(next);

    } finally {

      busyRef.current = false;

    }

  };



  /* ----- Main menu ----- */

  const handleMain = (item) => {

    if (item.key === "admission") {

      return choose({ title: item.title, replies: [L.admIntro], next: "admission1", before: () => setFlow("admission") });

    }

    if (item.key === "counselling") {

      return choose({ title: item.title, replies: [L.counIntro], next: "counselling", before: () => setFlow("counselling") });

    }

    if (item.key === "job") {

      return choose({ title: item.title, replies: [L.jobIntro], next: "job", before: () => setFlow("job") });

    }

    return choose({ title: item.title, replies: [L.supportAsk], next: "supportMenu", before: () => setFlow("existing") });

  };



  /* ----- After admission form: About Career Vidya / Admission Process ----- */

  const handleAdmissionInfo = (item) => {

    if (item.key === "about") {

      return choose({

        title: item.title,

        replies: [{ text: L.about, link: { label: "About Career Vidya", url: ABOUT_URL } }],

        next: "admissionInfo",

      });

    }

    if (item.key === "process") {

      return choose({ title: item.title, replies: [L.admissionAsk], next: "admissionMenu" });

    }

    return choose({ title: item.title, replies: [L.backMenu], next: "menu", before: () => setFlow("") });

  };



  /* ----- Admission Process sub-menu ----- */

  const handleAdmissionMenu = (item) => {

    if (item.key === "eligibility") {

      return choose({

        title: item.title,

        replies: [

          { text: L.eligibility, link: { label: "Visit Career Vidya", url: SITE_URL } },

          { text: `📞 You can also speak with our Admission Counselor at: +91 ${SUPPORT_PHONE}`, link: PHONE_LINK },

        ],

        next: "admissionMenu",

      });

    }

    if (item.key === "how") {

      return choose({ title: item.title, replies: [L.howToApply], next: "admissionMenu" });

    }

    if (item.key === "apply") {

      return choose({

        title: item.title,

        replies: [{ text: L.applyText, link: { label: "Apply Now", url: APPLY_URL } }],

        next: "admissionMenu",

      });

    }

    return choose({ title: item.title, replies: [L.backMenu], next: "menu", before: () => setFlow("") });

  };



  // Existing Student Support: show a direct answer, not a form.
  const handleSupportType = (item) => {
    const answer = SUPPORT_ANSWERS[item.key];
    if (!answer) return;

    return choose({
      title: item.title,
      replies: [
        {
          text: `${answer.message} Contact: ${answer.phone}`,
          link: {
            label: `Call / WhatsApp ${answer.phone}`,
            url: answer.whatsapp,
          },
        },
      ],
      next: "supportAnswer",
      before: () => setSupportType(item.key),
    });
  };

  const handleSupportAnswerNavigation = (item) => {
    if (item.key === "supportBack") {
      return choose({
        title: item.title,
        replies: [L.supportAsk],
        next: "supportMenu",
      });
    }

    return choose({
      title: item.title,
      replies: [L.backMenu],
      next: "menu",
      before: () => {
        setFlow("");
        setSupportType("");
      },
    });
  };



  const onChange = (event) => {

    const { name, value } = event.target;



    if (name === "mobile") {

      setData((p) => ({ ...p, mobile: value.replace(/\D/g, "").slice(0, 10) }));

      return;

    }



    if (name === "course" && flow === "admission") {

      const selected = courses.find((c) => c.name === value);

      setSpecializations(

        Array.isArray(selected?.specializations) ? selected.specializations : []

      );

      setData((p) => ({ ...p, course: value, branch: "" }));

      return;

    }



    setData((p) => ({ ...p, [name]: value }));

  };



  const handleNext = async (event) => {

    event.preventDefault();

    if (busyRef.current) return;



    addMsg("user", `${data.name}\n${data.email}\n${data.mobile}`);



    busyRef.current = true;

    setStep("busy");



    try {

      await botSay([L.thanks(data.name.trim().split(" ")[0])]);

      setStep("admission2");

    } finally {

      busyRef.current = false;

    }

  };



  const submitLead = async ({ payload, successMessages, returnStep, nextStep = "menu", followUp = L.anythingElse }) => {

    if (busyRef.current || sending) return;



    busyRef.current = true;

    setSending(true);

    setError("");

    setStep("busy");



    try {

      await api.post("/api/v1/getintouch", payload);

      setData(emptyData);

      setSpecializations([]);

      await botSay([...successMessages, followUp]);

      if (nextStep === "menu") setFlow("");

      setStep(nextStep);

    } catch (err) {

      console.error("Chatbot lead submission failed:", err);

      setError(err?.response?.data?.message || L.errDefault);

      await botSay([L.err]);

      setStep(returnStep);

    } finally {

      busyRef.current = false;

      setSending(false);

    }

  };



  const handleAdmissionSubmit = (event) => {

    event.preventDefault();

    addMsg(

      "user",

      `${data.course}${data.branch ? ` - ${data.branch}` : ""}\n${data.city}, ${data.state}`

    );

    return submitLead({

      payload: {

        name: data.name,

        email: data.email,

        mobile: data.mobile,

        course: data.course,

        branch: data.branch || "NA",

        state: data.state,

        city: data.city,

        message: `Chatbot Admission Enquiry | State: ${data.state}`,

      },

      successMessages: [L.admDone],

      returnStep: "admission2",

      nextStep: "admissionInfo", // the sub-menu appears only after the form is submitted

      followUp: L.admNext,

    });

  };



  const handleCounsellingSubmit = (event) => {

    event.preventDefault();

    addMsg(

      "user",

      `${data.name} | ${data.mobile}\n${data.course || L.notSpecified}\n${data.message || L.callbackReq}`

    );

    return submitLead({

      payload: {

        name: data.name,

        email: data.email || "Not provided",

        mobile: data.mobile,

        course: data.course || "Counselling",

        branch: "NA",

        city: data.city || "NA",

        message: `Chatbot Counselling Enquiry: ${data.message || "Callback requested"}`,

      },

      successMessages: [

        L.counDone,

        { text: "You can also meet our counsellors here.", link: { label: "Meet our counsellors", url: TEAM_URL } },

      ],

      returnStep: "counselling",

    });

  };



  const handleJobSubmit = (event) => {

    event.preventDefault();

    addMsg(

      "user",

      `${data.name} | ${data.mobile}\n${data.role}\n${data.experience}${data.city ? `, ${data.city}` : ""}`

    );

    return submitLead({

      payload: {

        name: data.name,

        email: data.email || "Not provided",

        mobile: data.mobile,

        course: "Job Enquiry",

        branch: data.role || "NA",

        city: data.city || "NA",

        message: `Chatbot Job Enquiry | Role: ${data.role} | Experience: ${data.experience}`,

      },

      successMessages: [

        L.jobDone,

        { text: "You can now browse open jobs on our Job Portal.", link: { label: "Open Job Portal", url: JOB_URL } },

      ],

      returnStep: "job",

    });

  };



  const handleExistingSubmit = (event) => {

    event.preventDefault();

    addMsg("user", `${data.name} | ${data.mobile}\n${data.message}`);

    return submitLead({

      payload: {

        name: data.name,

        email: data.email || "Not provided",

        mobile: data.mobile,

        course: "Existing Student Support",

        branch: supportType || "NA",

        city: data.city || "NA",

        message: `Chatbot Existing Student Support | Type: ${supportType || "NA"} | ${data.message}`,

      },

      successMessages: [L.existDone],

      returnStep: "existing",

    });

  };



  const goBack = () => {

    if (sending) return;

    setError("");

    if (step === "admission2") {

      setStep("admission1");

      return;

    }

    if (step === "existing") {

      setStep("supportMenu");

      return;

    }

    setFlow("");

    setStep("menu");

  };



  const renderForm = ({ progress, fields, submitLabel, icon, onSubmit }) => (

    <form key={step} onSubmit={onSubmit} style={formBox}>

      {progress}



      {fields}



      {error && (

        <div role="alert" style={errorStyle}>

          {error}

        </div>

      )}



      <button

        type="submit"

        disabled={sending}

        className="cv-btn"

        style={{ ...primaryBtn, opacity: sending ? 0.65 : 1 }}

      >

        {sending ? "Submitting..." : submitLabel}

        {!sending && (icon || <Send size={17} />)}

      </button>



      <button type="button" onClick={goBack} disabled={sending} style={backBtn}>

        <ArrowLeft size={15} /> Back

      </button>

    </form>

  );



  const showForms = !botTyping;



  return (

    <>

      <style>{`

        @keyframes cvPop {

          from { opacity: 0; transform: translateY(6px); }

          to { opacity: 1; transform: translateY(0); }

        }

        @keyframes cvExpand {

          from { opacity: 0; transform: scale(.85) translateY(16px); }

          to { opacity: 1; transform: scale(1) translateY(0); }

        }

        @keyframes cvDot {

          0%,60%,100% { transform: translateY(0); opacity: .4; }

          30% { transform: translateY(-4px); opacity: 1; }

        }

        @keyframes cvBob {

          0%,100% { transform: translateY(0); }

          50% { transform: translateY(-4px); }

        }

        @keyframes cvWave {

          0%,100% { transform: rotate(0deg); }

          25% { transform: rotate(-14deg); }

          75% { transform: rotate(14deg); }

        }

        @keyframes cvTeaser {

          from { opacity: 0; transform: translateX(14px) scale(.9); }

          to { opacity: 1; transform: translateX(0) scale(1); }

        }

        .cv-chat-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }

        .cv-chat-scroll input:focus,

        .cv-chat-scroll select:focus,

        .cv-chat-scroll textarea:focus {

          border-color: ${BRAND} !important;

          box-shadow: 0 0 0 3px rgba(30,64,175,.12);

        }

        .cv-chip { transition: background .15s, color .15s, transform .15s; }

        .cv-chip:hover { background: ${BRAND} !important; color: #fff !important; }

        .cv-chip:active { transform: scale(.97); }

        .cv-btn { transition: filter .15s, transform .15s; }

        .cv-btn:hover:not(:disabled) { filter: brightness(1.1); }

        .cv-btn:active:not(:disabled) { transform: scale(.98); }

        .cv-chat-window button:focus-visible,

        .cv-chat-window a:focus-visible { outline: 2px solid ${BRAND}; outline-offset: 2px; }

        @media (max-width: 480px) {

          .cv-chat-window {

            right: 8px !important;

            bottom: 8px !important;

            width: calc(100vw - 16px) !important;

            height: min(640px, calc(100dvh - 16px)) !important;

            border-radius: 16px !important;

          }

          .cv-chat-fab { right: 14px !important; bottom: 22px !important; }

          .cv-chat-teaser { right: 104px !important; bottom: 30px !important; }

        }

        @media (prefers-reduced-motion: reduce) {

          .cv-chat-fab, .cv-chat-window, .cv-chat-window * { animation: none !important; transition: none !important; }

        }

      `}</style>



      {!open && (

        <>

          {showTeaser && (

            <div className="cv-chat-teaser" style={teaserStyle}>

              <button

                type="button"

                onClick={openChat}

                style={teaserTextBtn}

                aria-label="Open Career Vidya AI assistant"

              >
                Welcome to Career Vidya!!

              </button>


              <span style={teaserTail} />

            </div>

          )}



          <button

            type="button"

            className="cv-chat-fab"

            onClick={openChat}

            style={fabStyle}

            aria-label="Open Career Vidya AI assistant"

          >

            <Avatar size={70} wave />

          </button>

        </>

      )}



      {open && (

        <section

          className="cv-chat-window"

          style={windowStyle}

          aria-label="Career Vidya AI Assistant"

        >

          <header style={headerStyle}>

            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>

              <div style={{ position: "relative", display: "flex" }}>

                <BotIcon size={44} />

                <span style={headerDot} />

              </div>

              <div style={{ minWidth: 0 }}>

                <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>

                  Career Vidya <span style={aiTag}>AI</span>

                </div>

                <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 5 }}>

                  <span style={statusDot} />

                  {botTyping ? "Typing..." : "Online"}

                </div>

              </div>

            </div>



            <button

              type="button"

              onClick={() => setOpen(false)}

              style={closeStyle}

              aria-label="Close chat"

            >

              <X size={22} />

            </button>

          </header>



          <div ref={bodyRef} className="cv-chat-scroll" style={bodyStyle} aria-live="polite">

            {messages.map((message, index) => (

              <div

                key={`${index}-${message.time}`}

                style={{

                  display: "flex",

                  justifyContent: message.from === "user" ? "flex-end" : "flex-start",

                  alignItems: "flex-end",

                  gap: 8,

                  marginBottom: 12,

                  animation: "cvPop .25s ease",

                }}

              >

                {message.from === "bot" && <BotIcon size={30} />}



                <div style={{ maxWidth: "80%", minWidth: 0 }}>

                  <div style={message.from === "user" ? userBubble : botBubble}>

                    {message.text}

                  </div>



                  {message.link && (

                    <a

                      href={message.link.url}

                      {...(message.link.phone ? {} : { target: "_blank", rel: "noopener noreferrer" })}

                      className="cv-btn"

                      style={linkBtn}

                    >

                      {message.link.phone ? <PhoneCall size={15} /> : null}

                      {message.link.label}

                      {message.link.phone ? null : <ExternalLink size={15} />}

                    </a>

                  )}



                  <div

                    style={{

                      ...timeStyle,

                      textAlign: message.from === "user" ? "right" : "left",

                    }}

                  >

                    {message.time}

                  </div>

                </div>

              </div>

            ))}



            {botTyping && <TypingDots />}



            {step === "menu" && showForms && <Chips items={MAIN_MENU} onPick={handleMain} />}

            {step === "admissionInfo" && showForms && <Chips items={ADMISSION_INFO_MENU} onPick={handleAdmissionInfo} />}

            {step === "admissionMenu" && showForms && <Chips items={ADMISSION_MENU} onPick={handleAdmissionMenu} />}

            {step === "supportMenu" && showForms && <Chips items={SUPPORT_MENU} onPick={handleSupportType} />}
            {step === "supportAnswer" && showForms && (
              <Chips items={SUPPORT_ANSWER_MENU} onPick={handleSupportAnswerNavigation} />
            )}



            {step === "admission1" &&

              showForms &&

              renderForm({

                progress: <Progress current={1} total={2} label="Your details" />,

                submitLabel: "Continue",

                icon: <ChevronRight size={18} />,

                onSubmit: handleNext,

                fields: (

                  <>

                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />

                    <TextInput label={L.email} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} />

                    <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />

                  </>

                ),

              })}



            {step === "admission2" &&

              showForms &&

              renderForm({

                progress: <Progress current={2} total={2} label="Course and city" />,

                submitLabel: "Submit",

                onSubmit: handleAdmissionSubmit,

                fields: (

                  <>

                    <Field label={L.course}>

                      <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>

                        <option value="">{L.selectCourse}</option>

                        {courses.map((course) => (

                          <option key={course._id || course.name} value={course.name}>

                            {course.name}

                          </option>

                        ))}

                      </select>

                    </Field>



                    <Field label={L.specialization}>

                      <select

                        name="branch"

                        value={data.branch}

                        onChange={onChange}

                        disabled={!specializations.length}

                        required={specializations.length > 0}

                        style={{ ...inputStyle, opacity: specializations.length ? 1 : 0.6 }}

                      >

                        <option value="">

                          {specializations.length ? L.selectSpec : L.noSpec}

                        </option>

                        {specializations.map((s, i) => (

                          <option key={i} value={s}>{s}</option>

                        ))}

                      </select>

                    </Field>



                    <Field label={L.state}>

                      <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>

                        <option value="">{L.selectState}</option>

                        {STATES.map((s) => (

                          <option key={s} value={s}>{s}</option>

                        ))}

                      </select>

                    </Field>



                    <TextInput label={L.city} name="city" value={data.city} onChange={onChange} />

                  </>

                ),

              })}



            {step === "counselling" &&

              showForms &&

              renderForm({

                submitLabel: "Request a callback",

                icon: <PhoneCall size={17} />,

                onSubmit: handleCounsellingSubmit,

                fields: (

                  <>

                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />

                    <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />

                    <TextInput label={L.interestedCourse} name="course" value={data.course} onChange={onChange} required={false} />

                    <Field label={L.queryOpt}>

                      <textarea

                        name="message"

                        value={data.message}

                        onChange={onChange}

                        rows={2}

                        style={{ ...inputStyle, height: 66, padding: 10, resize: "none" }}

                      />

                    </Field>

                  </>

                ),

              })}



            {step === "job" &&

              showForms &&

              renderForm({

                submitLabel: "Submit",

                icon: <BriefcaseBusiness size={17} />,

                onSubmit: handleJobSubmit,

                fields: (

                  <>

                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />

                    <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />

                    <TextInput label={L.emailOpt} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} required={false} />

                    <TextInput label={L.jobRole} name="role" value={data.role} onChange={onChange} />

                    <Field label={L.experience}>

                      <select name="experience" value={data.experience} onChange={onChange} required style={inputStyle}>

                        <option value="">{L.selectExp}</option>

                        {EXPERIENCE_VALUES.map((value) => (

                          <option key={value} value={value}>{value}</option>

                        ))}

                      </select>

                    </Field>

                    <TextInput label={L.cityOpt} name="city" value={data.city} onChange={onChange} required={false} />

                  </>

                ),

              })}



            {step === "existing" &&

              showForms &&

              renderForm({

                submitLabel: "Submit query",

                onSubmit: handleExistingSubmit,

                fields: (

                  <>

                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />

                    <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />

                    <TextInput label={L.emailOpt} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} required={false} />

                    <Field label={L.query}>

                      <textarea

                        name="message"

                        value={data.message}

                        onChange={onChange}

                        rows={3}

                        required

                        style={{ ...inputStyle, height: 78, padding: 10, resize: "none" }}

                      />

                    </Field>

                  </>

                ),

              })}

          </div>



          <footer style={footerStyle}>

            <span>AI assistant · Powered by Career Vidya</span>

            <a href={`tel:+91${SUPPORT_PHONE}`} style={{ marginLeft: "auto", color: BRAND, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>

              <PhoneCall size={13} /> {SUPPORT_PHONE}

            </a>

          </footer>

        </section>

      )}

    </>

  );

}



/* ---------------- STYLES ---------------- */



const fabStyle = {

  position: "fixed",

  right: 20,

  bottom: BOTTOM_OFFSET,

  width: 76,

  height: 76,

  padding: 0,

  display: "grid",

  placeItems: "center",

  borderRadius: "50%",

  border: "3px solid #fff",

  background: "#F9A94B",

  cursor: "pointer",

  zIndex: 9998,

  boxShadow: "0 8px 22px rgba(15,23,42,.28)",

  animation: "cvBob 3s ease-in-out infinite",

};



// White speech bubble next to the avatar, with a tail pointing at it and a small x on top-left

const teaserStyle = {

  position: "fixed",

  right: 112,

  bottom: BOTTOM_OFFSET + 8,

  width: "min(210px, calc(100vw - 150px))",

  background: "#fff",

  borderRadius: 18,

  boxShadow: "0 8px 24px rgba(15,23,42,.18)",

  zIndex: 9998,

  animation: "cvTeaser .45s cubic-bezier(.2,.8,.2,1)",

};



const teaserTextBtn = {

  display: "block",

  width: "100%",

  padding: "14px 18px",

  border: "none",

  background: "transparent",

  color: "#1F2937",

  fontSize: 16,

  fontWeight: 500,

  lineHeight: 1.4,

  textAlign: "left",

  cursor: "pointer",

  fontFamily: "inherit",

  borderRadius: 18,

};



const teaserClose = {

  position: "absolute",

  top: -9,

  left: -9,

  width: 22,

  height: 22,

  padding: 0,

  borderRadius: "50%",

  border: "none",

  background: "#374151",

  color: "#fff",

  display: "grid",

  placeItems: "center",

  cursor: "pointer",

};



const teaserTail = {

  position: "absolute",

  right: -6,

  top: "50%",

  marginTop: -7,

  width: 14,

  height: 14,

  background: "#fff",

  transform: "rotate(45deg)",

  borderRadius: 3,

  pointerEvents: "none",

};



const headerDot = {

  position: "absolute",

  right: 0,

  bottom: 0,

  width: 12,

  height: 12,

  borderRadius: "50%",

  background: "#22C55E",

  border: "2px solid #fff",

  boxSizing: "border-box",

};



const windowStyle = {

  position: "fixed",

  right: 20,

  bottom: BOTTOM_OFFSET,

  width: "min(400px, calc(100vw - 24px))",

  height: `min(640px, calc(100dvh - ${BOTTOM_OFFSET + 15}px))`,

  background: "#fff",

  borderRadius: 18,

  border: "1px solid #E2E8F0",

  boxShadow: "0 20px 60px rgba(15,23,42,.22)",

  display: "flex",

  flexDirection: "column",

  overflow: "hidden",

  zIndex: 10001,

  fontFamily: "inherit",

  boxSizing: "border-box",

  transformOrigin: "bottom right",

  animation: "cvExpand .3s ease",

};



const headerStyle = {

  background: "#fff",

  borderBottom: "1px solid #E2E8F0",

  padding: "12px 12px 12px 14px",

  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  gap: 8,

  flexShrink: 0,

};



const aiTag = {

  marginLeft: 4,

  padding: "1px 7px",

  borderRadius: 6,

  background: BRAND_SOFT,

  color: BRAND,

  fontSize: 11,

  fontWeight: 700,

};



const statusDot = {

  width: 8,

  height: 8,

  borderRadius: "50%",

  background: "#22C55E",

};



const closeStyle = {

  background: "#F1F5F9",

  border: "none",

  color: "#334155",

  width: 38,

  height: 38,

  borderRadius: "50%",

  display: "grid",

  placeItems: "center",

  cursor: "pointer",

  flexShrink: 0,

};



const bodyStyle = {

  flex: 1,

  minHeight: 0,

  overflowY: "auto",

  padding: 14,

  background: "#F8FAFC",

};



const botBubble = {

  background: "#fff",

  color: "#0F172A",

  padding: "10px 13px",

  borderRadius: "14px 14px 14px 4px",

  fontSize: 14,

  border: "1px solid #E2E8F0",

  lineHeight: 1.5,

  whiteSpace: "pre-line",

  overflowWrap: "anywhere",

};



const userBubble = {

  background: BRAND,

  color: "#fff",

  padding: "10px 13px",

  borderRadius: "14px 14px 4px 14px",

  fontSize: 14,

  lineHeight: 1.5,

  whiteSpace: "pre-line",

  overflowWrap: "anywhere",

};



const linkBtn = {

  display: "inline-flex",

  alignItems: "center",

  gap: 7,

  marginTop: 6,

  padding: "8px 14px",

  borderRadius: 999,

  background: BRAND,

  color: "#fff",

  fontSize: 13,

  fontWeight: 600,

  textDecoration: "none",

};



const timeStyle = {

  fontSize: 10.5,

  color: "#94A3B8",

  marginTop: 3,

};



const chipRow = {

  display: "flex",

  flexWrap: "wrap",

  gap: 8,

  marginLeft: 38,

  marginBottom: 8,

};



const chipStyle = {

  padding: "9px 16px",

  background: "#fff",

  color: BRAND,

  border: `1.5px solid ${BRAND}`,

  borderRadius: 999,

  fontSize: 14,

  fontWeight: 500,

  cursor: "pointer",

  fontFamily: "inherit",

  lineHeight: 1.3,

};



const formBox = {

  display: "flex",

  flexDirection: "column",

  gap: 12,

  marginLeft: 38,

  marginBottom: 8,

  background: "#fff",

  border: "1px solid #E2E8F0",

  borderRadius: 14,

  padding: 14,

  minWidth: 0,

  animation: "cvPop .25s ease",

};



const progressText = {

  fontSize: 12,

  fontWeight: 600,

  color: "#475569",

  marginBottom: 6,

};



const progressTrack = {

  height: 5,

  borderRadius: 3,

  background: "#E2E8F0",

  overflow: "hidden",

};



const progressFill = {

  height: "100%",

  borderRadius: 3,

  background: BRAND,

  transition: "width .4s ease",

};



const fieldLabel = {

  display: "flex",

  flexDirection: "column",

  gap: 5,

  width: "100%",

  minWidth: 0,

};



const fieldCaption = {

  fontSize: 12.5,

  fontWeight: 600,

  color: "#334155",

};



const inputStyle = {

  width: "100%",

  minWidth: 0,

  height: 42,

  padding: "0 11px",

  borderRadius: 10,

  border: "1px solid #CBD5E1",

  background: "#fff",

  color: "#0F172A",

  fontSize: 14,

  outline: "none",

  boxSizing: "border-box",

  fontFamily: "inherit",

  transition: "border-color .15s, box-shadow .15s",

};



const primaryBtn = {

  width: "100%",

  minHeight: 46,

  padding: "9px 12px",

  background: BRAND,

  color: "#fff",

  border: "none",

  borderRadius: 10,

  fontWeight: 600,

  fontSize: 14,

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: 8,

  textDecoration: "none",

  boxSizing: "border-box",

  fontFamily: "inherit",

};



const backBtn = {

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  gap: 6,

  padding: 6,

  border: "none",

  background: "transparent",

  color: "#64748B",

  fontSize: 13,

  cursor: "pointer",

  fontFamily: "inherit",

};



const errorStyle = {

  background: "#FEF2F2",

  color: "#B91C1C",

  padding: 9,

  borderRadius: 8,

  fontSize: 12.5,

  lineHeight: 1.5,

};



const footerStyle = {

  minHeight: 34,

  padding: "5px 14px",

  borderTop: "1px solid #E2E8F0",

  background: "#fff",

  color: "#94A3B8",

  fontSize: 11.5,

  display: "flex",

  alignItems: "center",

  gap: 4,

  flexShrink: 0,

};