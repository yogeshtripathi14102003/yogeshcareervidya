// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image"; 
// import { X, Send } from "lucide-react";
// import api from "@/utlis/api";

// export default function QueryPopup() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     city: "",
//     course: "",
//     branch: "",
//     message: "",
//   });

//   /* Popup delay */
//   useEffect(() => {
//     const timer = setTimeout(() => setShowPopup(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   /* Fetch courses safely from backend */
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");

//         const courseArray =
//           Array.isArray(res.data)
//             ? res.data
//             : Array.isArray(res.data?.data)
//             ? res.data.data
//             : Array.isArray(res.data?.courses)
//             ? res.data.courses
//             : [];

//         setCourses(courseArray);
//       } catch (err) {
//         console.error("Course fetch error", err);
//         setCourses([]);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "course") {
//       const selected = courses.find((c) => c.name === value);

//       setSpecializations(selected?.specializations || []);

//       setFormData((prev) => ({
//         ...prev,
//         course: value,
//         branch: "",
//       }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/api/v1/getintouch", formData);
//       alert("✅ Query submitted successfully!");
//       setFormData({
//         name: "",
//         email: "",
//         mobile: "",
//         city: "",
//         course: "",
//         branch: "",
//         message: "",
//       });
//       setShowPopup(false);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong!");
//     }
//   };

//   if (!showPopup) return null;

//   return (
//     <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3 backdrop-blur-sm overflow-y-auto">
//       <div className="bg-white w-full max-w-3xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row relative animate-slideUpMobile md:animate-fadeIn">

//         {/* Close Button */}
//         <button
//           onClick={() => setShowPopup(false)}
//           className="cursor-pointer absolute top-3 right-3 z-[110] bg-white/90 md:bg-gray-100 w-9 h-9 flex items-center justify-center rounded-full shadow-md text-gray-500 hover:text-blue-600 transition-colors"
//         >
//           <X size={20} />
//         </button>

//         {/* Left Panel */}
//         <div className="bg-[#05347f] text-white w-full md:w-1/3 p-6 flex flex-col justify-center items-center text-center gap-4">
          
//           {/* ✅ FIXED: Circular Image Container */}
//           <div className="flex items-center justify-center mb-1">
//             <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/80 shadow-lg bg-white/10">
//               <img
//                 src="/images/sss.webp"
//                 alt="help"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           <h3 className="text-base font-bold">Kindly Share your query</h3>

//           <ul className="flex flex-col gap-3 text-[12px] text-white font-medium text-left w-full px-2">
//             <li className="flex items-center gap-2">
//               <span className="text-[18px]">🎯</span>
//               <span>100% Free Career Counselling</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <span className="text-[18px]">💼</span>
//               <span>100% Placement Assistance</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <span className="text-[18px]">🏦</span>
//               <span>Education Loan Facility</span>
//             </li>
//             <li className="flex items-center gap-2">
//               <span className="text-[18px]">🎓</span>
//               <span>Scholarship (Varies)</span>
//             </li>
//           </ul>
//         </div>

//         {/* Right Form */}
//         <div className="w-full md:w-2/3 p-4 md:p-6 text-gray-900">
//           <div className="flex items-center gap-3 mb-3">
//             <Image
//               src="/images/n12.png"
//               alt="Career Vidya"
//               width={85}
//               height={42}
//             />
//             <div>
//               <p className="text-sm font-bold text-[#253b7a]">
//                 #VidyaHaiTohSuccessHai
//               </p>
//               <p className="text-[12px] text-gray-500">
//                 Student's Trusted Education Guidance Platform
//               </p>
//             </div>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-3"
//           >
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Your Name"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <div className="relative">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 required
//                 className="w-full border rounded-lg p-2 pr-36 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-green-600 border border-green-500 rounded-full px-2 py-[2px] bg-white flex items-center gap-1">
//                 ✓ We Do Not Spam
//               </span>
//             </div>

//             <div className="relative">
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 placeholder="Mobile No"
//                 required
//                 className="w-full border rounded-lg p-2 pr-36 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-green-600 border border-green-500 rounded-full px-2 py-[2px] bg-white flex items-center gap-1">
//                 ✓ We Do Not Spam
//               </span>
//             </div>

//             <select
//               name="course"
//               value={formData.course}
//               onChange={handleChange}
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
//             >
//               <option value="">Course</option>
//               {courses.map((course) => (
//                 <option key={course._id} value={course.name}>
//                   {course.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               name="branch"
//               value={formData.branch}
//               onChange={handleChange}
//               required
//               disabled={!specializations.length}
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
//             >
//               <option value="">Branch</option>
//               {specializations.map((sp, i) => (
//                 <option key={i} value={sp}>
//                   {sp}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               placeholder="City"
//               required
//               className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               placeholder="How can we help you?"
//               required
//               rows="2"
//               className="md:col-span-2 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />

//             <div className="md:col-span-2">
//               <button
//                 type="submit"
//                 className="w-full bg-[#05347f] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center gap-2"
//               >
//                 <span>Send Message</span>
//                 <Send size={16} />
//               </button>
//               <p className="text-center text-[10px] text-gray-600 mt-2">
//                 🔒 All your information is safe and secure with us.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes slideUpMobile {
//           from {
//             opacity: 0;
//             transform: translateY(30%);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//         .animate-slideUpMobile {
//           animation: slideUpMobile 0.4s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image"; 
// import { X, Send, User, Phone, Mail, MapPin, GraduationCap, MessageSquare, ShieldCheck } from "lucide-react";
// import api from "@/utlis/api";

// export default function QueryPopup() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     city: "",
//     course: "",
//     branch: "",
//     message: "",
//   });

//   /* Popup delay */
//   useEffect(() => {
//     const timer = setTimeout(() => setShowPopup(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   /* Fetch courses safely from backend */
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");

//         const courseArray =
//           Array.isArray(res.data)
//             ? res.data
//             : Array.isArray(res.data?.data)
//             ? res.data.data
//             : Array.isArray(res.data?.courses)
//             ? res.data.courses
//             : [];

//         setCourses(courseArray);
//       } catch (err) {
//         console.error("Course fetch error", err);
//         setCourses([]);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "course") {
//       const selected = courses.find((c) => c.name === value);

//       setSpecializations(selected?.specializations || []);

//       setFormData((prev) => ({
//         ...prev,
//         course: value,
//         branch: "",
//       }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/api/v1/getintouch", formData);
//       alert("✅ Query submitted successfully!");
//       setFormData({
//         name: "",
//         email: "",
//         mobile: "",
//         city: "",
//         course: "",
//         branch: "",
//         message: "",
//       });
//       setShowPopup(false);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Something went wrong!");
//     }
//   };

//   if (!showPopup) return null;

//   return (
//     <div className="fixed inset-0 z-[100] bg-[#2a3a5e]/70 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
//       <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden animate-slideUpMobile md:animate-fadeIn border-2 border-[#d35400]">

//         {/* Close Button */}
//         <button
//           onClick={() => setShowPopup(false)}
//           aria-label="Close"
//           className="cursor-pointer absolute top-2.5 right-2.5 z-[110] bg-white border border-gray-200 w-8 h-8 flex items-center justify-center rounded-full shadow-sm text-gray-500 hover:text-[#f47b20] hover:border-[#f47b20]/40 transition-colors"
//         >
//           <X size={16} />
//         </button>

//         {/* ─── Left Panel ─── */}
//         <div className="hidden md:flex bg-[#eaf3fd] w-full md:w-[38%] p-5 flex-col justify-between relative">

//           <div>
//             {/* Badge */}
//             <div className="inline-flex items-center gap-1.5 bg-[#f47b20] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
//               <Phone size={10} fill="white" />
//               <span>Free Career Guidance</span>
//             </div>

//             {/* Heading */}
//             <h2 className="mt-4 text-[20px] leading-tight font-bold text-[#0a2a5e]">
//               Talk to Our
//             </h2>
//             <h2 className="text-[20px] leading-tight font-bold text-[#f47b20]">
//               Career Counsellor
//             </h2>

//             {/* Subtitle */}
//             <p className="mt-2 text-[12px] text-gray-600 leading-relaxed">
//               Personalized guidance for courses, fees &amp; admissions.
//             </p>
//           </div>

//           {/* Logo */}
//           <div className="my-3">
//             <Image
//               src="/images/n12.png"
//               alt="Career Vidya"
//               width={105}
//               height={50}
//               className="object-contain"
//             />
//           </div>

//           {/* Illustration */}
//           <div className="flex justify-center items-end">
//             <Image
//               src="/images/inquiry.png"
//               alt="Counselling"
//               width={165}
//               height={165}
//               className="object-contain"
//             />
//           </div>
//         </div>

//         {/* ─── Right Panel (Form) ─── */}
//         <div className="w-full md:w-[62%] bg-white p-4 md:p-5 flex flex-col justify-center text-gray-900 overflow-y-auto">

//           {/* Heading */}
//           <h3 className="text-[18px] md:text-[20px] font-bold text-[#0a2a5e]">
//             Share your query
//           </h3>
//           <p className="text-[12px] text-gray-500 mt-0.5 mb-3.5">
//             Fill in your details and we will get back to you.
//           </p>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-2.5"
//           >
//             {/* Name */}
//             <div className="relative">
//               <User
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2a5e]/60 pointer-events-none"
//               />
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Your Name"
//                 required
//                 className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] placeholder-gray-400 focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition"
//               />
//             </div>

//             {/* Email */}
//             <div className="relative">
//               <Mail
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2a5e]/60 pointer-events-none"
//               />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 required
//                 className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] placeholder-gray-400 focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition"
//               />
//             </div>

//             {/* Mobile */}
//             <div className="relative">
//               <Phone
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2a5e]/60 pointer-events-none"
//               />
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 placeholder="Mobile No"
//                 required
//                 className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] placeholder-gray-400 focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition"
//               />
//             </div>

//             {/* City */}
//             <div className="relative">
//               <MapPin
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2a5e]/60 pointer-events-none"
//               />
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 placeholder="City"
//                 required
//                 className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] placeholder-gray-400 focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition"
//               />
//             </div>

//             {/* Course */}
//             <div className="relative">
//               <GraduationCap
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2a5e]/60 pointer-events-none z-10"
//               />
//               <select
//                 name="course"
//                 value={formData.course}
//                 onChange={handleChange}
//                 required
//                 className="w-full appearance-none border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-[13px] text-gray-700 bg-white focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition"
//               >
//                 <option value="">Course</option>
//                 {courses.map((course) => (
//                   <option key={course._id} value={course.name}>
//                     {course.name}
//                   </option>
//                 ))}
//               </select>
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a2a5e] pointer-events-none text-[10px]">
//                 ▼
//               </span>
//             </div>

//             {/* Branch */}
//             <div className="relative">
//               <GraduationCap
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2a5e]/60 pointer-events-none z-10"
//               />
//               <select
//                 name="branch"
//                 value={formData.branch}
//                 onChange={handleChange}
//                 required
//                 disabled={!specializations.length}
//                 className="w-full appearance-none border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-[13px] text-gray-700 bg-white focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
//               >
//                 <option value="">Branch</option>
//                 {specializations.map((sp, i) => (
//                   <option key={i} value={sp}>
//                     {sp}
//                   </option>
//                 ))}
//               </select>
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a2a5e] pointer-events-none text-[10px]">
//                 ▼
//               </span>
//             </div>

//             {/* Message */}
//             <div className="relative md:col-span-2">
//               <MessageSquare
//                 size={14}
//                 className="absolute left-3 top-3 text-[#0a2a5e]/60 pointer-events-none"
//               />
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 placeholder="How can we help you?"
//                 required
//                 rows="2"
//                 className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] placeholder-gray-400 focus:ring-2 focus:ring-[#f47b20]/40 focus:border-[#f47b20] outline-none transition resize-none"
//               />
//             </div>

//             {/* Submit + Privacy */}
//             <div className="md:col-span-2">
//               <button
//                 type="submit"
//                 className="cursor-pointer w-full bg-[#d35400] hover:bg-[#b84500] text-white py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition shadow-sm"
//               >
//                 <span>Send Message</span>
//                 <Send size={14} />
//               </button>

//               <p className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mt-2">
//                 <ShieldCheck size={12} className="text-[#0a2a5e]" />
//                 Your privacy is completely safe with us.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes slideUpMobile {
//           from {
//             opacity: 0;
//             transform: translateY(30%);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//         .animate-slideUpMobile {
//           animation: slideUpMobile 0.4s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/utlis/api";
import { toast } from "sonner";

const SESSION_KEY = "cv_query_popup_shown";

const INITIAL_FORM = {
  name: "",
  email: "",
  mobile: "",
  city: "",
  course: "",
  branch: "",
  message: "",
};

/* Orange ring logo (desktop + mobile) */
function CircleLogo({ className = "" }) {
  return (
    <div
      className={`w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden ${className}`}
      style={{
        border: "3px solid var(--cv-accent)",
        boxShadow: "0 4px 14px rgba(193, 83, 4, 0.25)",
      }}
    >
      <Image
        src="/images/n12.png"
        alt="Career Vidya"
        width={120}
        height={58}
        priority
        className="object-contain w-[88%] h-auto scale-110"
      />
    </div>
  );
}

/* One reusable field: label + icon + input/select/textarea */
function Field({
  label,
  name,
  icon: Icon,
  as = "input",
  className = "",
  children,
  ...props
}) {
  const id = `qp-${name}`;
  const Tag = as;
  const isSelect = as === "select";

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[12px] font-semibold mb-1"
        style={{ color: "var(--cv-neutral-dark)" }}
      >
        {label}
        {props.required && (
          <span style={{ color: "var(--cv-accent)" }}> *</span>
        )}
      </label>

      <div className="relative">
        <Icon
          size={14}
          className={`absolute left-3 pointer-events-none z-10 ${
            as === "textarea" ? "top-3" : "top-1/2 -translate-y-1/2"
          }`}
          style={{ color: "var(--cv-neutral-mid)" }}
        />
        <Tag
          id={id}
          name={name}
          className={`qp-field w-full rounded-lg pl-9 py-2 text-[13px] outline-none transition ${
            isSelect ? "appearance-none pr-8 disabled:opacity-50" : "pr-3"
          } ${as === "textarea" ? "resize-none" : ""}`}
          {...props}
        >
          {children}
        </Tag>
        {isSelect && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]"
            style={{ color: "var(--cv-neutral-mid)" }}
          >
            ▼
          </span>
        )}
      </div>
    </div>
  );
}

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  /* Show once per session (flag is set only when the popup actually opens) */
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "true");
      setShowPopup(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => setShowPopup(false), []);

  /* Close on Esc + lock background scroll while open */
  useEffect(() => {
    if (!showPopup) return;

    const onKey = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showPopup, handleClose]);

  /* Courses */
  const { data: courses = [] } = useQuery({
    queryKey: ["query-popup-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/course");
      const d = res.data;
      return Array.isArray(d)
        ? d
        : Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d?.courses)
        ? d.courses
        : [];
    },
    staleTime: 30 * 60 * 1000,
    enabled: showPopup,
  });

  /* Derived — no extra state needed */
  const specializations =
    courses.find((c) => c.name === formData.course)?.specializations || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "course" ? { branch: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.post("/api/v1/getintouch", formData);
      toast.success("Query submitted successfully! ✅");
      setFormData(INITIAL_FORM);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! Please try again. ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 overflow-y-auto"
      style={{
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
      }}
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Share your query"
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden animate-slideUpMobile md:animate-fadeIn"
        style={{ border: "2px solid var(--cv-accent)" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="qp-close cursor-pointer absolute top-2.5 right-2.5 z-[110] bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-colors"
        >
          <X size={16} />
        </button>

        {/* LEFT PANEL (desktop) */}
        <div
          className="hidden md:flex w-[38%] p-5 flex-col justify-between"
          style={{ background: "var(--cv-primary-light)" }}
        >
          <div>
            <CircleLogo className="mb-4 ml-1.5 mt-1.5" />

            <h2
              className="mt-4 text-[20px] leading-tight font-bold"
              style={{ color: "var(--cv-primary)" }}
            >
              Talk to Our
            </h2>
            <h2
              className="text-[20px] leading-tight font-bold"
              style={{ color: "var(--cv-accent)" }}
            >
              Career Advisor
            </h2>

            <p
              className="mt-2 text-[12px] leading-relaxed"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              Personalized guidance for courses, fees &amp; admissions.
            </p>
          </div>

          <div className="flex justify-center items-end mt-3">
            <Image
              src="/images/inquiry.png"
              alt="Counselling"
              width={165}
              height={165}
              className="object-contain"
            />
          </div>
        </div>

        {/* RIGHT PANEL (form) */}
        <div
          className="w-full md:w-[62%] bg-white p-4 md:p-5 overflow-y-auto"
          style={{ color: "var(--cv-neutral-dark)" }}
        >
          <div className="flex md:hidden justify-center mb-3">
            <CircleLogo />
          </div>

          <h3
            className="text-[18px] md:text-[20px] font-bold"
            style={{ color: "var(--cv-primary)" }}
          >
            Share your query
          </h3>
          <p
            className="text-[12px] mt-0.5 mb-3.5"
            style={{ color: "var(--cv-neutral-mid)" }}
          >
            Fill in your details and we will get back to you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-2.5"
          >
            <Field
              label="Full name"
              name="name"
              icon={User}
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              required
            />

            <Field
              label="Email address"
              name="email"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@gmail.com"
              autoComplete="email"
              required
            />

            <Field
              label="Mobile number"
              name="mobile"
              icon={Phone}
              type="tel"
              inputMode="numeric"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit number"
              autoComplete="tel-national"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              title="Enter a valid 10-digit mobile number"
              required
            />

            <Field
              label="City"
              name="city"
              icon={MapPin}
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. New Delhi"
              autoComplete="address-level2"
              required
            />

            <Field
              label="Course interested in"
              name="course"
              icon={GraduationCap}
              as="select"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </Field>

            <Field
              label="Branch / specialization"
              name="branch"
              icon={BookOpen}
              as="select"
              value={formData.branch}
              onChange={handleChange}
              disabled={!specializations.length}
              required
            >
              <option value="">
                {specializations.length
                  ? "Select a branch"
                  : "Choose a course first"}
              </option>
              {specializations.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </Field>

            <Field
              label="Your message"
              name="message"
              icon={MessageSquare}
              as="textarea"
              rows={2}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. I want to know about MBA fees and admission dates"
              className="md:col-span-2"
              required
            />

            <div className="md:col-span-2 mt-1">
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer w-full text-white py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "var(--cv-grad-cta)",
                  boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <Send size={14} />
                  </>
                )}
              </button>

              <p
                className="flex items-center justify-center gap-1.5 text-[10px] mt-2"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                <ShieldCheck size={12} style={{ color: "var(--cv-primary)" }} />
                Your details are safe with us and never shared.
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .qp-field {
          border: 1.5px solid var(--cv-neutral-border);
          border-left: 4px solid var(--cv-primary);
          border-radius: 10px;
          color: var(--cv-neutral-dark);
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .qp-field::placeholder {
          color: #9ca3af;
          font-size: 12px;
        }
        .qp-field:hover:not(:disabled) {
          border-color: var(--cv-accent);
          border-left-color: var(--cv-accent);
        }
        .qp-field:focus {
          border-color: var(--cv-accent);
          border-left-color: var(--cv-accent);
          background: #fffaf5;
          box-shadow: 0 0 0 3px rgba(193, 83, 4, 0.15),
            0 2px 8px rgba(193, 83, 4, 0.12);
        }
        .qp-field:user-invalid {
          border-color: #dc2626;
          border-left-color: #dc2626;
          background: #fef2f2;
        }
        .qp-field:disabled {
          background: #f3f4f6;
          border-left-color: var(--cv-neutral-border);
        }
        .qp-close {
          border: 1px solid var(--cv-neutral-border);
          color: var(--cv-neutral-mid);
        }
        .qp-close:hover {
          color: var(--cv-accent);
          border-color: var(--cv-accent);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideUpMobile {
          from {
            opacity: 0;
            transform: translateY(30%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUpMobile {
          animation: slideUpMobile 0.4s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn,
          .animate-slideUpMobile {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}