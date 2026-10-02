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

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/utlis/api";
import { toast } from "sonner";

const SESSION_KEY = "cv_query_popup_shown";

const inputStyle = {
  border: "1px solid var(--cv-neutral-border)",
  color: "var(--cv-neutral-dark)",
  background: "#fff",
};

const focusIn = (e) => {
  e.target.style.borderColor = "var(--cv-primary)";
  e.target.style.boxShadow = "0 0 0 3px rgba(30,58,138,0.1)";
};

const focusOut = (e) => {
  e.target.style.borderColor = "var(--cv-neutral-border)";
  e.target.style.boxShadow = "none";
};

/* Circular logo (reused on desktop + mobile) */
function CircleLogo({ className = "" }) {
  return (
    <div
      className={`w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden ${className}`}
      style={{
        border: "3px solid var(--cv-primary)",
      
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

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    course: "",
    branch: "",
    message: "",
  });

  /* Popup: sirf ek baar per session */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown === "true") return;

    sessionStorage.setItem(SESSION_KEY, "true");

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  /* React Query: Courses */
  const { data: courses = [] } = useQuery({
    queryKey: ["query-popup-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/course");
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.courses)
        ? res.data.courses
        : [];
    },
    staleTime: 30 * 60 * 1000,
    enabled: showPopup,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      const selected = courses.find((c) => c.name === value);
      setSpecializations(selected?.specializations || []);
      setFormData((prev) => ({ ...prev, course: value, branch: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/getintouch", formData);
      toast.success("Query submitted successfully! ✅");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        city: "",
        course: "",
        branch: "",
        message: "",
      });
      setSpecializations([]);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! ❌");
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
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden animate-slideUpMobile md:animate-fadeIn"
        style={{ border: "2px solid var(--cv-primary)" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="cursor-pointer absolute top-2.5 right-2.5 z-[110] bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-colors"
          style={{
            border: "1px solid var(--cv-neutral-border)",
            color: "var(--cv-neutral-mid)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--cv-accent)";
            e.currentTarget.style.borderColor = "var(--cv-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--cv-neutral-mid)";
            e.currentTarget.style.borderColor = "var(--cv-neutral-border)";
          }}
        >
          <X size={16} />
        </button>

        {/* LEFT PANEL (Desktop) */}
        <div
          className="hidden md:flex w-full md:w-[38%] p-5 flex-col justify-between relative"
          style={{ background: "var(--cv-primary-light)" }}
        >
          <div>
            {/* Circular Logo - Top */}
            <CircleLogo className="mb-4 ml-1.5 mt-1.5" />

            {/* <div
              className="inline-flex items-center gap-1.5 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm"
              style={{ background: "var(--cv-grad-cta)" }}
            >
              <Phone size={10} fill="white" />
              <span>Free Career Guidance</span>
            </div> */}

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

        {/* RIGHT PANEL (Form) */}
        <div
          className="w-full md:w-[62%] bg-white p-4 md:p-5 flex flex-col justify-center overflow-y-auto"
          style={{ color: "var(--cv-neutral-dark)" }}
        >
          {/* Circular Logo - Mobile */}
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
            className="grid grid-cols-1 md:grid-cols-2 gap-2.5"
          >
            {/* Name */}
            <div className="relative">
              <User
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none transition"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none transition"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <Phone
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile No"
                required
                className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none transition"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            {/* City */}
            <div className="relative">
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none transition"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            {/* Course */}
            <div className="relative">
              <GraduationCap
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full appearance-none rounded-lg pl-9 pr-8 py-2 text-[13px] outline-none transition"
                style={inputStyle}
              >
                <option value="">Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                ▼
              </span>
            </div>

            {/* Branch */}
            <div className="relative">
              <GraduationCap
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                disabled={!specializations.length}
                className="w-full appearance-none rounded-lg pl-9 pr-8 py-2 text-[13px] outline-none transition disabled:opacity-50"
                style={inputStyle}
              >
                <option value="">Branch</option>
                {specializations.map((sp, i) => (
                  <option key={i} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                ▼
              </span>
            </div>

            {/* Message */}
            <div className="relative md:col-span-2">
              <MessageSquare
                size={14}
                className="absolute left-3 top-3 pointer-events-none"
                style={{ color: "var(--cv-neutral-mid)" }}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                rows="2"
                className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none transition resize-none"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="cursor-pointer w-full text-white py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{
                  background: "var(--cv-grad-cta)",
                  boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
                }}
              >
                <span>Send Message</span>
                <Send size={14} />
              </button>

              <p
                className="flex items-center justify-center gap-1.5 text-[10px] mt-2"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                <ShieldCheck size={12} style={{ color: "var(--cv-primary)" }} />
                Your privacy is completely safe with us.
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}