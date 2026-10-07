

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import api from "@/utlis/api";
// import { flagCourseView, trackEvent } from "@/utlis/analytics.js";
// import { Check, ShieldCheck, BadgePercent, Lock } from "lucide-react";

// /* ═══════════════════════════════════════════════
//    INPUT STYLE — Global CSS
// ═══════════════════════════════════════════════ */
// const inputStyle =
//   "w-full h-11 px-3 rounded-lg bg-white text-[15px] " +
//   "placeholder:text-gray-400 " +
//   "transition-all duration-150 " +
//   "focus:outline-none " +
//   "focus:ring-2 focus:ring-[var(--cv-primary)]/20";

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     otp: "",
//     city: "",
//     state: "",
//     course: "",
//     branch: "",
//     gender: "",
//     addresses: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [universities, setUniversities] = useState([]);
//   const [expanded, setExpanded] = useState(false);

//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const res = await api.get("/api/v1/university");
//         setUniversities(res.data?.data || []);
//       } catch (err) {
//         console.error("University fetch error", err);
//       }
//     };
//     fetchUniversities();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       setOtpSent(true);
//       alert("OTP sent successfully");
//     } catch {
//       alert("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await api.post("/api/v1/verify-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         otp: formData.otp,
//         purpose: "register",
//         ...formData,
//       });
//       flagCourseView("registered");
//       alert("Registration successful");
//     } catch {
//       alert("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!otpSent) {
//       flagCourseView("applyClicked");
//       trackEvent("apply_click");
//       handleSendOtp(e);
//     } else {
//       handleVerifyOtp(e);
//     }
//   };

//   return (
//     <div
//       className="rounded-2xl shadow-2xl w-[95%] lg:w-[1100px] mx-auto my-6 flex flex-col md:flex-row overflow-hidden"
//       style={{
//         background: "#fff",
//         border: "2px solid var(--cv-primary)",
//         boxShadow: "0 25px 60px -15px rgba(30, 58, 138, 0.3)",
//       }}
//     >
//       {/* ═══════════════════════════════════════════
//           LEFT SIDE
//       ═══════════════════════════════════════════ */}
//       <div
//         className="hidden md:flex md:w-1/2 p-4 lg:p-8 flex-col items-center"
//         style={{
//           background: "var(--cv-primary-light)",
//           borderRight: "1px solid var(--cv-neutral-border)",
//         }}
//       >
//         {/* University logos marquee */}
//         <div className="w-full overflow-hidden mb-6">
//           <div className="flex gap-4 animate-scroll-x">
//             {[...universities, ...universities].map((uni, i) => {
//               const imageUrl = uni.universityImage
//                 ? uni.universityImage.startsWith("http")
//                   ? uni.universityImage
//                   : `${process.env.NEXT_PUBLIC_API_URL}${uni.universityImage}`
//                 : "/fallback.png";

//               return (
//                 <div
//                   key={i}
//                   className="min-w-[80px] lg:min-w-[100px] h-[40px] lg:h-[50px] rounded-xl flex items-center justify-center"
//                   style={{
//                     background: "#fff",
//                     border: "1px solid var(--cv-neutral-border)",
//                     boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)",
//                   }}
//                 >
//                   <div className="relative w-full h-full p-1 overflow-hidden">
//                     <Image
//                       src={imageUrl}
//                       alt={uni.name || "University"}
//                       fill
//                       className="object-contain"
//                       unoptimized
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Main heading — Navy pill style */}
//         <div className="text-center">
//           <h2
//             className="inline-block text-left text-xl font-bold mb-6 leading-snug rounded-lg px-6 py-3"
//             style={{
//               color: "var(--cv-primary)",
//               background: "#fff",
//               boxShadow: "0 4px 12px rgba(30, 58, 138, 0.08)",
//             }}
//           >
//             Your Path to a Successful Career Starts with Career Vidya
//           </h2>
//         </div>

//         {/* Benefits list */}
//         <ul className="space-y-3 lg:space-y-4 text-left font-sans w-full max-w-[360px]">
//           {[
//             "Globally recognized Degree • WES Approved",
//             "100% Placement Assistance",
//             "Free Expert Consultation",
//             "Quick Loan Facility",
//             "Post Admission Support",
//             "Counselling – Personal guidance. Real results.",
//             "Job + Internship Portal",
//           ].map((t, i) => (
//             <li key={i} className="flex items-start gap-3 group">
//               {/* Navy check circle */}
//               <div
//                 className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md"
//                 style={{
//                   background: "var(--cv-primary)",
//                   color: "#fff",
//                 }}
//               >
//                 <Check className="w-3.5 h-3.5" strokeWidth={3} />
//               </div>
//               <span
//                 className="text-sm lg:text-[15px] font-medium leading-tight"
//                 style={{ color: "var(--cv-neutral-dark)" }}
//               >
//                 {t}
//               </span>
//             </li>
//           ))}
//         </ul>

//         {expanded && (
//           <div
//             className="relative w-full max-w-[280px] h-[180px] mt-8 rounded-xl overflow-hidden"
//             style={{
//               background: "#fff",
//               border: "1px solid var(--cv-neutral-border)",
//             }}
//           >
//             <Image
//               src="/images/sir.jpg"
//               alt="CareerVidya - trusted by students across India"
//               fill
//               className="object-contain"
//               unoptimized
//             />
//           </div>
//         )}
//       </div>

//       {/* ═══════════════════════════════════════════
//           RIGHT FORM
//       ═══════════════════════════════════════════ */}
//       <div className="w-full md:w-1/2 p-6 lg:p-8" style={{ background: "#fff" }}>
//         {/* Header */}
//         <div className="text-center mb-6">
//           <h2
//             className="text-xl lg:text-2xl font-bold"
//             style={{ color: "var(--cv-primary)" }}
//           >
//             <span style={{ color: "var(--cv-accent)" }}>Apply</span> for Online
//             Courses
//           </h2>

//           <div className="flex items-center justify-center gap-5 mt-3 text-xs flex-wrap">
//             <span
//               className="flex items-center gap-1.5 font-semibold"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               <BadgePercent className="w-4 h-4" />
//               Online Discount of 15%
//             </span>
//             <span
//               className="flex items-center gap-1.5 font-semibold"
//               style={{ color: "var(--cv-accent)" }}
//             >
//               <ShieldCheck className="w-4 h-4" />
//               Lowest Price Guarantee
//             </span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Row 1: Name + Email */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Field label="Name" half>
//               <input
//                 name="name"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 style={{
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "var(--cv-primary)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "var(--cv-neutral-border)";
//                 }}
//               />
//             </Field>

//             <Field label="Email" half>
//               <input
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 style={{
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "var(--cv-primary)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "var(--cv-neutral-border)";
//                 }}
//               />
//             </Field>
//           </div>

//           {/* Row 2: Mobile + State */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Field label="Mobile Number" half>
//               <input
//                 name="mobileNumber"
//                 placeholder="Enter your mobile number"
//                 value={formData.mobileNumber}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 style={{
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "var(--cv-primary)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "var(--cv-neutral-border)";
//                 }}
//               />
//             </Field>

//             <Field label="State" half>
//               <input
//                 name="state"
//                 placeholder="Enter your state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 style={{
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "var(--cv-primary)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "var(--cv-neutral-border)";
//                 }}
//               />
//             </Field>
//           </div>

//           {/* Continue Button */}
//           {!expanded && (
//             <>
//               <button
//                 type="button"
//                 onClick={() => setExpanded(true)}
//                 className="cv-btn-cta cursor-pointer w-full py-3"
//               >
//                 Continue ↓
//               </button>

//               <p
//                 className="text-center text-xs mt-2"
//                 style={{ color: "var(--cv-neutral-mid)" }}
//               >
//                 Just a few more details and CareerVidya will match you with the
//                 best university for free.
//               </p>
//             </>
//           )}

//           {/* Expanded Form */}
//           {expanded && (
//             <>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Field label="City" half>
//                   <input
//                     name="city"
//                     placeholder="Enter your city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     className={inputStyle}
//                     style={{
//                       border: "1px solid var(--cv-neutral-border)",
//                       color: "var(--cv-neutral-dark)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--cv-primary)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--cv-neutral-border)";
//                     }}
//                   />
//                 </Field>

//                 <Field label="Course" half>
//                   <input
//                     name="course"
//                     placeholder="Enter your course"
//                     value={formData.course}
//                     onChange={handleChange}
//                     className={inputStyle}
//                     style={{
//                       border: "1px solid var(--cv-neutral-border)",
//                       color: "var(--cv-neutral-dark)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--cv-primary)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--cv-neutral-border)";
//                     }}
//                   />
//                 </Field>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Field label="Branch" half>
//                   <input
//                     name="branch"
//                     placeholder="Enter your Branch"
//                     value={formData.branch}
//                     onChange={handleChange}
//                     className={inputStyle}
//                     style={{
//                       border: "1px solid var(--cv-neutral-border)",
//                       color: "var(--cv-neutral-dark)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--cv-primary)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--cv-neutral-border)";
//                     }}
//                   />
//                 </Field>

//                 <Field label="Gender" half>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     className={inputStyle}
//                     style={{
//                       border: "1px solid var(--cv-neutral-border)",
//                       color: "var(--cv-neutral-dark)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--cv-primary)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--cv-neutral-border)";
//                     }}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </Field>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Field label="Address">
//                   <input
//                     name="addresses"
//                     placeholder="Enter your address"
//                     value={formData.addresses}
//                     onChange={handleChange}
//                     className={inputStyle}
//                     style={{
//                       border: "1px solid var(--cv-neutral-border)",
//                       color: "var(--cv-neutral-dark)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--cv-primary)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--cv-neutral-border)";
//                     }}
//                   />
//                 </Field>
//               </div>

//               {otpSent && (
//                 <Field label="OTP">
//                   <input
//                     name="otp"
//                     placeholder="Enter OTP"
//                     value={formData.otp}
//                     onChange={handleChange}
//                     className={inputStyle}
//                     style={{
//                       border: "1px solid var(--cv-neutral-border)",
//                       color: "var(--cv-neutral-dark)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--cv-primary)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--cv-neutral-border)";
//                     }}
//                   />
//                 </Field>
//               )}

//               {/* Assurance box — Navy accent */}
//               <div
//                 className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
//                 style={{
//                   background: "var(--cv-primary-light)",
//                   border: "1px solid var(--cv-primary-light)",
//                 }}
//               >
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     defaultChecked
//                     readOnly
//                     className="w-4 h-4"
//                     style={{ accentColor: "var(--cv-primary)" }}
//                   />
//                   <div>
//                     <p
//                       className="text-sm font-semibold"
//                       style={{ color: "var(--cv-primary)" }}
//                     >
//                       Career Vidya Assured{" "}
//                       <span
//                         className="underline cursor-pointer"
//                         style={{ color: "var(--cv-accent)" }}
//                       >
//                         (Know More)
//                       </span>
//                     </p>
//                     <p
//                       className="text-xs"
//                       style={{ color: "var(--cv-neutral-mid)" }}
//                     >
//                       Get 100% full refund* on cancellation
//                     </p>
//                   </div>
//                 </div>
//                 <ShieldCheck
//                   className="w-7 h-7 flex-shrink-0"
//                   style={{ color: "var(--cv-primary)" }}
//                 />
//               </div>

//               {/* Submit Button — Orange gradient */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="cv-btn-cta cursor-pointer w-full p-3.5 disabled:opacity-60"
//               >
//                 {loading
//                   ? "Please wait..."
//                   : otpSent
//                   ? "Verify OTP"
//                   : "Find Best University →"}
//               </button>

//               {/* Security line */}
//               <p
//                 className="flex items-center justify-center gap-1.5 text-xs font-medium"
//                 style={{ color: "var(--cv-primary)" }}
//               >
//                 <Lock className="w-3.5 h-3.5" />
//                 Your personal information is secure with us
//               </p>

//               {/* Disclaimer */}
//               <p
//                 className="text-[11px] text-center leading-relaxed"
//                 style={{ color: "var(--cv-neutral-mid)" }}
//               >
//                 By continuing, I authorize Career Vidya to contact me regarding
//                 admission, counselling, and course-related updates through
//                 call, SMS, WhatsApp, or email.
//               </p>
//             </>
//           )}
//         </form>
//       </div>

//       <style jsx>{`
//         .animate-scroll-x {
//           animation: scrollX 20s linear infinite;
//         }
//         @keyframes scrollX {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════
//    FIELD COMPONENT
// ═══════════════════════════════════════════════ */
// function Field({ label, children, half }) {
//   return (
//     <div className={`relative ${half ? "w-full sm:w-1/2" : "w-full"}`}>
//       <label
//         className="block mb-1.5 text-xs font-semibold"
//         style={{ color: "var(--cv-primary)" }}
//       >
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { flagCourseView, trackEvent } from "@/utlis/analytics.js";
import { Check, ShieldCheck, BadgePercent, Lock } from "lucide-react";

/* ═══════════════════════════════════════════════
   INPUT STYLE — Global CSS
═══════════════════════════════════════════════ */
const inputStyle =
  "w-full h-11 px-3 rounded-lg bg-white text-[15px] " +
  "placeholder:text-gray-400 " +
  "transition-all duration-150 " +
  "focus:outline-none " +
  "focus:ring-2 focus:ring-[var(--cv-primary)]/20";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    course: "",
    branch: "",
    gender: "",
    addresses: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        setUniversities(res.data?.data || []);
      } catch (err) {
        console.error("University fetch error", err);
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP sent successfully");
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/v1/verify-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        otp: formData.otp,
        purpose: "register",
        ...formData,
      });
      flagCourseView("registered");
      alert("Registration successful");
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      flagCourseView("applyClicked");
      trackEvent("apply_click");
      handleSendOtp(e);
    } else {
      handleVerifyOtp(e);
    }
  };

  return (
    <div
      className="rounded-2xl shadow-2xl w-[95%] lg:w-[1100px] mx-auto my-6 flex flex-col md:flex-row overflow-hidden"
      style={{
        background: "#fff",
        border: "2px solid var(--cv-primary)",
        boxShadow: "0 25px 60px -15px rgba(30, 58, 138, 0.3)",
      }}
    >
      {/* ═══════════════════════════════════════════
          LEFT SIDE
      ═══════════════════════════════════════════ */}
      <div
        className="hidden md:flex md:w-1/2 p-4 lg:p-8 flex-col items-center"
        style={{
          background: "var(--cv-primary-light)",
          borderRight: "1px solid var(--cv-neutral-border)",
        }}
      >
        {/* University logos marquee */}
        <div className="w-full overflow-hidden mb-6">
          <div className="flex gap-4 animate-scroll-x">
            {[...universities, ...universities].map((uni, i) => {
              const imageUrl = uni.universityImage
                ? uni.universityImage.startsWith("http")
                  ? uni.universityImage
                  : `${process.env.NEXT_PUBLIC_API_URL}${uni.universityImage}`
                : "/fallback.png";

              return (
                <div
                  key={i}
                  className="min-w-[80px] lg:min-w-[100px] h-[40px] lg:h-[50px] rounded-xl flex items-center justify-center"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--cv-neutral-border)",
                    boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)",
                  }}
                >
                  <div className="relative w-full h-full p-1 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={uni.name || "University"}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main heading — Navy pill style */}
        <div className="text-center">
          <h2
            className="inline-block text-left text-xl font-bold mb-6 leading-snug rounded-lg px-6 py-3"
            style={{
              color: "var(--cv-primary)",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(30, 58, 138, 0.08)",
            }}
          >
            Your Path to a Successful Career Starts with Career Vidya
          </h2>
        </div>

        {/* Benefits list */}
        <ul className="space-y-3 lg:space-y-4 text-left font-sans w-full max-w-[360px]">
          {[
            "Globally recognized Degree • WES Approved",
            "100% Placement Assistance",
            "Free Expert Consultation",
            "Quick Loan Facility",
            "Post Admission Support",
            "Counselling – Personal guidance. Real results.",
            "Job + Internship Portal",
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-3 group">
              {/* Navy check circle */}
              <div
                className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md"
                style={{
                  background: "var(--cv-primary)",
                  color: "#fff",
                }}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span
                className="text-sm lg:text-[15px] font-medium leading-tight"
                style={{ color: "var(--cv-neutral-dark)" }}
              >
                {t}
              </span>
            </li>
          ))}
        </ul>

        {expanded && (
          <div
            className="relative w-full max-w-[280px] h-[180px] mt-8 rounded-xl overflow-hidden"
            style={{
              background: "#fff",
              border: "1px solid var(--cv-neutral-border)",
            }}
          >
            <Image
              src="/images/sir.jpg"
              alt="CareerVidya - trusted by students across India"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT FORM
      ═══════════════════════════════════════════ */}
      <div className="w-full md:w-1/2 p-6 lg:p-8" style={{ background: "#fff" }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-xl lg:text-2xl font-bold"
            style={{ color: "var(--cv-primary)" }}
          >
            <span style={{ color: "var(--cv-accent)" }}>Apply</span> for Online
            Courses
          </h2>

          <div className="flex items-center justify-center gap-5 mt-3 text-xs flex-wrap">
            <span
              className="flex items-center gap-1.5 font-semibold"
              style={{ color: "var(--cv-primary)" }}
            >
              <BadgePercent className="w-4 h-4" />
              Online Discount of 15%
            </span>
            <span
              className="flex items-center gap-1.5 font-semibold"
              style={{ color: "var(--cv-accent)" }}
            >
              <ShieldCheck className="w-4 h-4" />
              Lowest Price Guarantee
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name + Email */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Field label="Name" half required>
              <input
                name="name"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={inputStyle}
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--cv-primary)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--cv-neutral-border)";
                }}
              />
            </Field>

            <Field label="Email" half required>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--cv-primary)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--cv-neutral-border)";
                }}
              />
            </Field>
          </div>

          {/* Row 2: Mobile + State */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Field label="Mobile Number" half required>
              <input
                type="tel"
                name="mobileNumber"
                required
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={inputStyle}
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--cv-primary)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--cv-neutral-border)";
                }}
              />
            </Field>

            <Field label="State" half required>
              <input
                name="state"
                required
                placeholder="Enter your state"
                value={formData.state}
                onChange={handleChange}
                className={inputStyle}
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--cv-primary)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--cv-neutral-border)";
                }}
              />
            </Field>
          </div>

          {/* Continue Button */}
          {!expanded && (
            <>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="cv-btn-cta cursor-pointer w-full py-3"
              >
                Continue ↓
              </button>

              <p
                className="text-center text-xs mt-2"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                Just a few more details and CareerVidya will match you with the
                best university for free.
              </p>
            </>
          )}

          {/* Expanded Form */}
          {expanded && (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <Field label="City" half required>
                  <input
                    name="city"
                    required
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputStyle}
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                    }}
                  />
                </Field>

                <Field label="Course" half required>
                  <input
                    name="course"
                    required
                    placeholder="Enter your course"
                    value={formData.course}
                    onChange={handleChange}
                    className={inputStyle}
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                    }}
                  />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Field label="Branch" half>
                  <input
                    name="branch"
                    placeholder="Enter your Branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={inputStyle}
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                    }}
                  />
                </Field>

                <Field label="Gender" half required>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputStyle}
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                    }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Field label="Address">
                  <input
                    name="addresses"
                    placeholder="Enter your address"
                    value={formData.addresses}
                    onChange={handleChange}
                    className={inputStyle}
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                    }}
                  />
                </Field>
              </div>

              {otpSent && (
                <Field label="OTP" required>
                  <input
                    name="otp"
                    required
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className={inputStyle}
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                    }}
                  />
                </Field>
              )}

              {/* Assurance box — Navy accent */}
              <div
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "var(--cv-primary-light)",
                  border: "1px solid var(--cv-primary-light)",
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    readOnly
                    className="w-4 h-4"
                    style={{ accentColor: "var(--cv-primary)" }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--cv-primary)" }}
                    >
                      Career Vidya Assured{" "}
                      <span
                        className="underline cursor-pointer"
                        style={{ color: "var(--cv-accent)" }}
                      >
                        (Know More)
                      </span>
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      Get 100% full refund* on cancellation
                    </p>
                  </div>
                </div>
                <ShieldCheck
                  className="w-7 h-7 flex-shrink-0"
                  style={{ color: "var(--cv-primary)" }}
                />
              </div>

              {/* Submit Button — Orange gradient */}
              <button
                type="submit"
                disabled={loading}
                className="cv-btn-cta cursor-pointer w-full p-3.5 disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : otpSent
                  ? "Verify OTP"
                  : "Find Best University →"}
              </button>

              {/* Security line */}
              <p
                className="flex items-center justify-center gap-1.5 text-xs font-medium"
                style={{ color: "var(--cv-primary)" }}
              >
                <Lock className="w-3.5 h-3.5" />
                Your personal information is secure with us
              </p>

              {/* Disclaimer */}
              <p
                className="text-[11px] text-center leading-relaxed"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                By continuing, I authorize Career Vidya to contact me regarding
                admission, counselling, and course-related updates through
                call, SMS, WhatsApp, or email.
              </p>
            </>
          )}
        </form>
      </div>

      <style jsx>{`
        .animate-scroll-x {
          animation: scrollX 20s linear infinite;
        }
        @keyframes scrollX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FIELD COMPONENT (Updated with Red Asterisk)
═══════════════════════════════════════════════ */
function Field({ label, children, half, required }) {
  return (
    <div className={`relative ${half ? "w-full sm:w-1/2" : "w-full"}`}>
      <label
        className="block mb-1.5 text-xs font-semibold"
        style={{ color: "var(--cv-primary)" }}
      >
        {label} {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      {children}
    </div>
  );
}