// import React, { useState } from "react";

// // 🎓 Updated Curriculum Data
// const curriculumData = [
//   {
//     id: 1,
//     title: "Semester 1",
//     modules: [
//       "Business, Society, and Law",
//       "Financial Reporting and Analysis",
//       "Management Practices and Organizational Behavior",
//       "Decision Science",
//       "Managerial Economics",
//       "Marketing Management",
//       "Communication Skills",
//     ],
//   },
//   {
//     id: 2,
//     title: "Semester 2",
//     modules: [
//       "Human Resource Management",
//       "Supply Chain & Logistics Management",
//       "Consumer Psychology",
//       "Business Research Methods",
//       "Financial Management",
//       "Production & Operations Management",
//       "Professional Communication Skills - 1",
//     ],
//   },
//   {
//     id: 3,
//     title: "Semester 3",
//     modules: [
//       "Strategy, Business, and Globalization",
//       "Data Analysis for Business Decisions",
//       "Management Lessons from Ancient India",
//       "Elective as per Specialization",
//       "Elective as per Specialization",
//       "Elective as per Specialization",
//     ],
//   },
//   {
//     id: 4,
//     title: "Semester 4",
//     modules: [
//       "Project Management",
//       "Values and Ethics",
//       "Academic Research Writing / Industry Immersion / International Project / Social Outreach Initiatives / Case Writing / Rural Immersion",
//       "Elective as per Specialization",
//       "Elective as per Specialization",
//     ],
//   },
//   {
//     id: 5,
//     title: "Specialization",
//     modules: [
//       "Marketing",
//       "Human Resource Management (HRM)",
//       "International Business (IB)",
//       "Entrepreneurship",
//       "Finance",
//       "Disaster Management",
//       "Information Technology (IT)",
//       "Logistics & Supply Chain Management",
//       "Retail Management",
//       "Operations Management",
//       "Banking & Insurance",
//       "Hospital Management",
//       "Events Management",
//       "Travel & Tourism Management",
//       "Airlines & Airport Management",
//       "Digital Marketing",
//     ],
//   },
// ];

// const ProgrammeContent = () => {
//   const [openSemester, setOpenSemester] = useState(1);

//   const toggleSemester = (id) => {
//     setOpenSemester(openSemester === id ? null : id);
//   };

//   const getArrowRotation = (id) => {
//     return openSemester === id ? "rotate-180" : "rotate-0";
//   };

//   return (
//     <section className="py-20 bg-gradient-to-br from-[#E6F3FF] via-white to-[#FFF6EF]">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Title */}
//         <h2 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-10 relative inline-block w-fit mx-auto">
//           Programme Content
//           <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#F97316] rounded-full"></span>
//         </h2>

//         {/* Accordion */}
//         <div className="border border-[#1E3A8A]/30 rounded-2xl shadow-lg overflow-hidden bg-white">
//           {curriculumData.map((semester) => (
//             <div
//               key={semester.id}
//               className="border-b border-[#1E3A8A]/10 last:border-b-0"
//             >
//               {/* Accordion Header */}
//               <button
//                 onClick={() => toggleSemester(semester.id)}
//                 className={`w-full text-left p-5 flex justify-between items-center text-lg font-semibold transition-all duration-300 ${
//                   openSemester === semester.id
//                     ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md"
//                     : "bg-white text-[#1E3A8A] hover:bg-[#E6F3FF]"
//                 }`}
//               >
//                 {semester.title}
//                 <svg
//                   className={`w-6 h-6 transform transition-transform duration-300 ${getArrowRotation(
//                     semester.id
//                   )}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   ></path>
//                 </svg>
//               </button>

//               {/* Accordion Content */}
//               {openSemester === semester.id && (
//                 <div className="p-6 bg-white transition-all duration-500">
//                   <div className="flex flex-wrap gap-3">
//                     {semester.modules.map((module, index) => (
//                       <span
//                         key={index}
//                         className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#E6F3FF] to-[#FFF7E6] text-[#1E3A8A] rounded-lg border border-[#1E3A8A]/20 hover:border-[#F97316]/40 transition-colors"
//                       >
//                         {module}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Download Brochure Button */}
//         <div className="text-center mt-12">
//           <button className="bg-gradient-to-r from-[#FFA500] to-[#1E90FF] text-white text-lg font-semibold py-3 px-10 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
//             Download Brochure
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProgrammeContent;

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utlis/api";
import { Sparkles, X } from "lucide-react"; // X icon for closing modal

// --- Curriculum Data ---
const curriculumData = [
  {
    id: 1,
    title: "Semester 1",
    modules: [
      "Business, Society, and Law",
      "Financial Reporting and Analysis",
      "Management Practices and Organizational Behavior",
      "Decision Science",
      "Managerial Economics",
      "Marketing Management",
      "Communication Skills",
    ],
  },
  {
    id: 2,
    title: "Semester 2",
    modules: [
      "Human Resource Management",
      "Supply Chain & Logistics Management",
      "Consumer Psychology",
      "Business Research Methods",
      "Financial Management",
      "Production & Operations Management",
      "Professional Communication Skills - 1",
    ],
  },
  {
    id: 3,
    title: "Semester 3",
    modules: [
      "Strategy, Business, and Globalization",
      "Data Analysis for Business Decisions",
      "Management Lessons from Ancient India",
      "Elective as per Specialization",
      "Elective as per Specialization",
      "Elective as per Specialization",
    ],
  },
  {
    id: 4,
    title: "Semester 4",
    modules: [
      "Project Management",
      "Values and Ethics",
      "Academic Research Writing / Industry Immersion / International Project / Social Outreach Initiatives / Case Writing / Rural Immersion",
      "Elective as per Specialization",
      "Elective as per Specialization",
    ],
  },
  {
    id: 5,
    title: "Specialization",
    modules: [
      "Marketing", "Human Resource Management (HRM)", "International Business (IB)", 
      "Entrepreneurship", "Finance", "Disaster Management", "Information Technology (IT)",
      "Logistics & Supply Chain Management", "Retail Management", "Operations Management",
      "Banking & Insurance", "Hospital Management", "Events Management",
      "Travel & Tourism Management", "Airlines & Airport Management", "Digital Marketing",
    ],
  },
];

// --- Registration Form Component (Internal) ---
const SignUpFormCU = ({ onClose }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", otp: "", city: "",
    state: "", course: "Online MBA", gender: "", addresses: "", branch: "Management",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobileNumber) {
      return alert("Name, Email & Mobile required");
    }
    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", { emailOrPhone: formData.email, purpose: "register" });
      setOtpSent(true);
      alert("OTP Sent Successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "OTP Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Enter OTP");
    try {
      setLoading(true);
      await api.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email, purpose: "register" });
      alert("🎉 Registration Successful! Your brochure is ready.");
      onClose(); // Form success ke baad modal close karein
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border relative">
      <button onClick={onClose} className="absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 hover:text-red-600 transition-colors">
        <X size={24} />
      </button>

      <div className="absolute -top-1 -right-1 bg-yellow-400 text-[9px] px-2 py-1 rotate-12 font-bold">
        HAPPY NEW YEAR 2026 🎊
      </div>

      <h2 className="text-xl font-bold text-[#B30021] mb-4 text-center">
        Apply for Online MBA
      </h2>

      <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="inputField" />
        <div className="flex gap-2">
          <input name="email" placeholder="Email" className="inputField w-1/2" onChange={handleChange} />
          <input name="mobileNumber" placeholder="Mobile" className="inputField w-1/2" onChange={handleChange} />
        </div>
        <div className="flex gap-2">
          <input name="city" placeholder="City" className="inputField w-1/2" onChange={handleChange} />
          <input name="state" placeholder="State" className="inputField w-1/2" onChange={handleChange} />
        </div>
        <div className="flex gap-2">
          <input value="Online MBA" readOnly className="inputField w-1/2 bg-gray-100" />
          <select name="gender" className="inputField w-1/2" onChange={handleChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <input name="addresses" placeholder="Address" className="inputField" onChange={handleChange} />
        {otpSent && (
          <input name="otp" placeholder="Enter OTP" className="inputField text-center tracking-[0.4em] bg-green-50 border-green-500" onChange={handleChange} />
        )}
        <button disabled={loading} className={`w-full py-2.5 rounded-lg text-white font-bold flex justify-center items-center gap-2 ${otpSent ? "bg-green-600" : "bg-[#B30021] hover:bg-red-700"}`}>
          {loading ? "Please wait..." : otpSent ? "VERIFY & APPLY" : "SEND OTP"}
          <Sparkles size={16} />
        </button>
      </form>

      <style jsx>{`
        .inputField { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
        .inputField:focus { border-color: #B30021; outline: none; box-shadow: 0 0 0 2px rgba(179, 0, 33, 0.1); }
      `}</style>
    </div>
  );
};

// --- Main ProgrammeContent Component ---
const ProgrammeContent = () => {
  const [openSemester, setOpenSemester] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const toggleSemester = (id) => setOpenSemester(openSemester === id ? null : id);
  const getArrowRotation = (id) => (openSemester === id ? "rotate-180" : "rotate-0");

  return (
    <section className="py-20 bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFF0F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center text-[#B30021] mb-10 relative block w-fit mx-auto">
          Programme Content
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#FF6F61] rounded-full"></span>
        </h2>

        {/* Accordion */}
        <div className="border border-[#B30021]/30 rounded-2xl shadow-lg overflow-hidden bg-white">
          {curriculumData.map((semester) => (
            <div key={semester.id} className="border-b border-[#B30021]/10 last:border-b-0">
              <button
                onClick={() => toggleSemester(semester.id)}
                className={`w-full text-left p-5 flex justify-between items-center text-lg font-semibold transition-all duration-300 ${
                  openSemester === semester.id
                    ? "bg-gradient-to-r from-[#B30021] to-[#E11E26] text-white shadow-md"
                    : "bg-white text-[#B30021] hover:bg-[#FFF1F1]"
                }`}
              >
                {semester.title}
                <svg className={`w-6 h-6 transform transition-transform duration-300 ${getArrowRotation(semester.id)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {openSemester === semester.id && (
                <div className="p-6 bg-white">
                  <div className="flex flex-wrap gap-3">
                    {semester.modules.map((module, index) => (
                      <span key={index} className="px-4 py-2 text-sm font-medium bg-[#FFF5F5] text-[#B30021] rounded-lg border border-[#B30021]/20">
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download Brochure Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#B30021] to-[#FF6F61] text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            Download Brochure
          </button>
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop (Dark Overlay) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Form Container */}
          <div className="relative z-10 animate-in fade-in zoom-in duration-300">
            <SignUpFormCU onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProgrammeContent;