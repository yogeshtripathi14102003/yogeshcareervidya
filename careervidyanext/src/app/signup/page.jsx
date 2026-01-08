// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import api from "@/utlis/api";
// import { X, GraduationCap, CheckCircle2 } from "lucide-react";

// const Signup = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     otp: "",
//     city: "",
//     state: "",
//     course: "",
//     gender: "",
//     addresses: "",
//       branch:"",
//   description: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateAllFields = () => {
//     const requiredFields = ["name", "mobileNumber", "email", "city", "state", "course", "gender", "addresses", "branch"];
//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         alert(`Please fill the "${field}" field before sending OTP.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!validateAllFields()) return;
//     try {
//       setLoading(true);
//       const payload = { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" };
//       await api.post("/api/v1/send-otp", payload);
//       alert("OTP sent successfully!");
//       setOtpSent(true);
//     } catch (error) {
//       alert("Failed to send OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) {
//       alert("Please enter OTP.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const payload = { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" };
//       await api.post("/api/v1/verify-otp", payload);
//       alert("Registration successful!");
//       onClose?.();
//     } catch (error) {
//       alert("Invalid OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     if (!otpSent) handleSendOtp(e);
//     else handleVerifyOtp(e);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-[100] p-4 backdrop-blur-sm cursor-pointer" onClick={onClose}>
//       {/* Container with overflow-hidden and rounded corners on ALL sides */}
//       <div 
//         className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-[850px] flex flex-col md:flex-row relative animate-fadeIn cursor-default max-h-[90vh] overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* CLOSE BUTTON - Fixed to top-right corner */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-all p-2 bg-white/90 md:bg-white/20 backdrop-blur-md rounded-full cursor-pointer z-[110] shadow-md md:shadow-none active:scale-90"
//         >
//           <X size={20} />
//         </button>

//         {/* Left Section - Blue Part */}
//         <div className="w-full md:w-[32%] p-6 bg-[#05347f] text-white flex flex-col justify-center relative min-h-[120px] md:min-h-full">
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-2 md:mb-4">
//               <GraduationCap size={28} className="text-yellow-400" />
//               <h1 className="text-lg font-bold">Career Vidya</h1>
//             </div>
//             <h2 className="text-sm font-semibold mb-2 opacity-90 hidden md:block">Unlock Your Future</h2>
//             <ul className="space-y-2 hidden md:block">
//               {["Exam Alerts", "Mock Tests", "AI Predictions"].map((item, index) => (
//                 <li key={index} className="flex items-center gap-2 text-[11px] opacity-80">
//                   <CheckCircle2 size={12} className="text-green-400" />
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Right Section - Form Part */}
//         <div className="w-full md:w-[68%] p-6 md:p-8 overflow-y-auto">
//           <div className="max-w-md mx-auto">
//             <div className="mb-4">
//               <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Signup</h3>
//               <p className="text-gray-500 text-[10px]">Create an account to get started.</p>
//             </div>

//             <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
//               <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputStyle" />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
//                 <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="inputStyle" />
//                 <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="inputStyle" />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
//                 <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="inputStyle" />
//                 <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="inputStyle" />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
//                 <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} className="inputStyle" />
//                 <input type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} className="inputStyle" />
//                 <select name="gender" value={formData.gender} onChange={handleChange} className="inputStyle cursor-pointer">
//                   <option value="">Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <input type="text" name="addresses" placeholder="Address" value={formData.addresses} onChange={handleChange} className="inputStyle" />

//               {otpSent && (
//                 <div className="animate-slideUp">
//                   <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} className="inputStyle border-blue-400 bg-blue-50/50" />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-2.5 rounded-lg text-white font-bold text-xs transition-all shadow-md cursor-pointer active:scale-95 mt-1 ${
//                   !otpSent ? "bg-[#FFA500] hover:bg-orange-600 shadow-orange-100" : "bg-[#05347f] hover:bg-blue-800 shadow-blue-100"
//                 } disabled:opacity-50`}
//               >
//                 {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify & Register"}
//               </button>
//             </form>

//             <p className="mt-4 text-center text-[11px] text-gray-500">
//               Already have account? <Link href="/login" className="text-blue-600 font-bold hover:underline cursor-pointer">Login</Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .inputStyle {
//           width: 100%;
//           padding: 7px 12px;
//           border: 1px solid #d1d5db;
//           border-radius: 6px;
//           outline: none;
//           background: white;
//           font-size: 13px;
//           transition: all 0.2s ease;
//         }
//         .inputStyle:focus {
//           border-color: #05347f;
//           box-shadow: 0 0 0 2px rgba(5, 52, 127, 0.1);
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.98); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
//         .animate-slideUp { animation: slideUp 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// export default Signup;




// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import api from "@/utlis/api"; 
// import { X, Bell, BookOpen, Target, Users, ChevronDown } from "lucide-react";

// // --- Compact Styled Components ---
// const InputBox = ({ className = "", ...props }) => (
//     <input
//         {...props}
//         className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white/90 text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400 ${className}`}
//     />
// );

// const SelectBox = ({ className = "", options, placeholder, ...props }) => (
//     <div className={`relative ${className}`}>
//         <select
//             {...props}
//             className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white/90 text-slate-600 shadow-sm focus:ring-2 focus:ring-indigo-500 appearance-none outline-none transition-all text-sm"
//         >
//             <option value="" disabled hidden>{placeholder}</option>
//             {options.map(option => (
//                 <option key={option} value={option.toLowerCase()}>{option}</option>
//             ))}
//         </select>
//         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//     </div>
// );

// const Signup = ({ onClose }) => {
//     const [formData, setFormData] = useState({
//         name: "", mobileNumber: "", email: "", otp: "", city: "", state: "", course: "", gender: "", addresses: "",
//     });

//     const [otpSent, setOtpSent] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const courses = ["B.Tech", "MBBS", "B.Com", "B.Sc", "Other"];
//     const states = ["Delhi", "Maharashtra", "Karnataka", "Gujarat", "Other"];

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Logic remains same as your original code
//         if (!otpSent) {
//             setLoading(true);
//             setOtpSent(true); // Simplified for UI display
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
//             {/* Modal Container: Height and Width Reduced */}
//             <div 
//                 className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-w-3xl w-full max-h-[85vh] relative animate-in fade-in zoom-in duration-300"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Close Button */}
//                 <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition z-50 text-slate-400">
//                     <X className="w-5 h-5" />
//                 </button>

//                 {/* Left Section - Compact Info Panel */}
//                 <div className="md:w-[35%] bg-gradient-to-br from-[#1e293b] to-[#334155] p-6 text-white flex flex-col justify-center relative overflow-hidden">
//                     <div className="relative z-10">
//                         <h1 className="text-2xl font-black tracking-tight mb-1">Career Vidya</h1>
//                         <p className="text-indigo-300 font-medium text-xs mb-8">Unlock Your Future</p>
                        
//                         <ul className="space-y-5">
//                             <li className="flex items-center gap-3">
//                                 <Bell className="w-4 h-4 text-indigo-300 shrink-0" />
//                                 <div><p className="font-bold text-[11px] uppercase tracking-wider">Exam Alerts</p></div>
//                             </li>
//                             <li className="flex items-center gap-3">
//                                 <BookOpen className="w-4 h-4 text-indigo-300 shrink-0" />
//                                 <div><p className="font-bold text-[11px] uppercase tracking-wider">Mock Tests</p></div>
//                             </li>
//                             <li className="flex items-center gap-3">
//                                 <Target className="w-4 h-4 text-indigo-300 shrink-0" />
//                                 <div><p className="font-bold text-[11px] uppercase tracking-wider">AI Predictions</p></div>
//                             </li>
//                             <li className="flex items-center gap-3">
//                                 <Users className="w-4 h-4 text-indigo-300 shrink-0" />
//                                 <div><p className="font-bold text-[11px] uppercase tracking-wider">Counselling</p></div>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Right Section - Form Panel */}
//                 <div className="md:w-[65%] p-6 md:p-8 bg-slate-50/50 overflow-y-auto">
//                     <div className="max-w-sm mx-auto">
//                         <h3 className="text-xl font-bold text-slate-800 mb-6">Create Account</h3>
                        
//                         <form onSubmit={handleSubmit} className="space-y-3">
//                             <InputBox type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 <InputBox type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} />
//                                 <InputBox type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                                 <InputBox type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
//                                 <SelectBox name="state" value={formData.state} onChange={handleChange} options={states} placeholder="State" />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                                 <SelectBox name="course" value={formData.course} onChange={handleChange} options={courses} placeholder="Course" />
//                                 <SelectBox name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} placeholder="Gender" />
//                             </div>

//                             <textarea 
//                                 name="addresses"
//                                 placeholder="Full Address" 
//                                 rows="2"
//                                 value={formData.addresses}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm text-slate-800"
//                             ></textarea>

//                             {otpSent && (
//                                 <InputBox type="text" name="otp" placeholder="Enter 6-Digit OTP" value={formData.otp} onChange={handleChange} className="border-indigo-300 bg-indigo-50/30" />
//                             )}

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full py-3 rounded-xl text-white font-bold tracking-wider shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-[1.01] transition-all mt-2 text-xs uppercase"
//                             >
//                                 {loading ? "Processing..." : otpSent ? "Verify & Register" : "Send OTP"}
//                             </button>
//                         </form>

//                         <p className="mt-6 text-center text-xs text-slate-500">
//                             Already have an account?{" "}
//                             <Link href="/login" className="text-indigo-600 font-bold hover:underline">
//                                 Login here
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;



"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";
import { X } from "lucide-react";

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  showSpam,
}) => {
  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] placeholder:font-semibold placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#05347f]/20"
      />

      {showSpam && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-green-500 bg-green-50 px-2 py-0.5 text-[10px] text-green-600 pointer-events-none">
          ✔ We Do Not Spam
        </span>
      )}
    </div>
  );
};

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange }) => {
  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none cursor-pointer"
      >
        <option value="">Select</option>
        <option>male</option>
        <option>female</option>
        <option>other</option>
      </select>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    course: "",
    gender: "",
    addresses: "",
    branch: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateAllFields = () => {
    const fields = [
      "name",
      "email",
      "mobileNumber",
      "city",
      "state",
      "course",
      "gender",
      "addresses",
      "branch",
    ];
    for (let f of fields) {
      if (!formData[f]) {
        alert(`Please fill ${f}`);
        return false;
      }
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP sent successfully");
    } catch {
      alert("OTP sending failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Enter OTP");

    try {
      setLoading(true);
      await api.post("/api/v1/verify-otp", {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      alert("Registration successful");
      onClose?.();
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    otpSent ? handleVerifyOtp(e) : handleSendOtp(e);
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* ===== LOGO + TAGLINE ===== */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src="/images/n12.png" // put logo in /public
            alt="Career Vidya"
            width={85}
            height={42}
          />
          <div>
           <p className="text-sm font-bold overflow-hidden whitespace-nowrap text-[#253b7a]">
  <span
    className="inline-block"
    style={{
      animation: "slideText 10s linear infinite",
    }}
  >
    #VidyaHaiTohSuccessHai
  </span>

  <style jsx>{`
    @keyframes slideText {
      0% {
        transform: translateX(100%);
        color: #05347f;
      }
      50% {
        color: #04184eff; /* logo highlight color */
      }
      100% {
        transform: translateX(-100%);
        color: #05347f;
      }
    }
  `}</style>
</p>

            <p className="text-[12px] text-gray-500">
           Students’ most trusted guide for education
            </p>
          </div>
        </div>

       {/* ===== HORIZONTAL USP SCROLL ===== */}
<div className="mb-4 overflow-x-auto">
  <div className="flex  min-w-max pb-1">

    <span className="whitespace-nowrap px-2 py-1 text-[11px] font-bold text-green-700">
      ✅ No-Cost EMI from ₹4,999
    </span>

    <span className="px-1 text-green-700 font-bold">|</span>

    <span className="whitespace-nowrap px-2 py-1 text-[11px] font-bold text-green-700">
      🎓 Govt-Approved Universities
    </span>

    <span className="px-1 text-green-700 font-bold">|</span>

    <span className="whitespace-nowrap px-2 py-1 text-[11px] font-bold text-green-700">
      💼 100 % Placement Assistance
    </span>
  
    {/* <span className="whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-[11px] font-medium text-orange-700">
      🔒 100% Secure Data
    </span> */}
  <span className="whitespace-nowrap px-2 py-1 text-[11px] font-bold text-green-700">
      📞Free Expert  Counselling
    </span> 
  </div>
</div>


        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput label="Name" name="name" value={formData.name} onChange={handleChange} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingInput label="Email" name="email" value={formData.email} onChange={handleChange} showSpam />
            <FloatingInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} showSpam />
          </div>

          <FloatingInput label="City" name="city" value={formData.city} onChange={handleChange} />
          <FloatingInput label="State" name="state" value={formData.state} onChange={handleChange} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingInput label="Course" name="course" value={formData.course} onChange={handleChange} />
            <FloatingInput label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
          </div>

          <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} />

          <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />

          {otpSent && (
            <FloatingInput label="OTP" name="otp" value={formData.otp} onChange={handleChange} />
          )}

          <button
            disabled={loading}
            className={`w-full py-2.5 rounded-md text-white font-bold text-sm ${
              otpSent ? "bg-blue-700" : "bg-orange-500"
            }`}
          >
            {loading ? "Please wait..." : otpSent ? "Verify & Register" : "Send OTP"}
          </button>

          <p className="mt-3 text-center text-[11px] text-gray-600">
            🔒 All your information is safe and secure with us.
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
