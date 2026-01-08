// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/utlis/api";
// import Cookies from "js-cookie";
// import {
//   Mail,
//   Phone,
//   X,
//   ShieldCheck,
//   ArrowRight,
//   Loader2,
//   UserPlus,
//   CheckCircle2,
//   Lock,
// } from "lucide-react";

// export default function LoginPopup({ onClose, onSuccess, courseName }) {
//   const [loginMode, setLoginMode] = useState("phone");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   /* ================= SEND OTP ================= */
//   const handleSendOtp = async () => {
//     if (!identifier) {
//       return alert(`Please enter your ${loginMode}`);
//     }

//     try {
//       setLoading(true);

//       // 🔥 SAME LOGIC AS LOGIN PAGE
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: identifier,
//         purpose: "login",
//       });

//       setOtpSent(true);
//     } catch (err) {
//       alert(
//         err.response?.data?.msg ||
//           err.response?.data?.message ||
//           "Failed to send OTP"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= VERIFY OTP ================= */
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();

//     if (!otp) return alert("Please enter OTP");

//     try {
//       setLoading(true);

//       // 🔥 SAME LOGIC AS LOGIN PAGE
//       const res = await api.post("/api/v1/verify-otp", {
//         emailOrPhone: identifier,
//         otp,
//         purpose: "login",
//       });

//       const { accessToken, student } = res.data;

//       Cookies.set(
//         student.role === "admin" ? "admintoken" : "token",
//         accessToken,
//         { expires: 1 }
//       );

//       onSuccess
//         ? onSuccess()
//         : router.push(student.role === "admin" ? "/admin" : "/user");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/85 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* MODAL CONTAINER */}
//       <div className="relative bg-white w-full max-w-[750px] min-h-[400px] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
//         {/* LEFT BRANDING SIDE */}
//         <div className="hidden md:flex md:w-[35%] bg-[#094385] p-8 flex-col justify-between text-white">
//           <div>
//             <div className="flex items-center gap-2 mb-6">
//               <img
//                 src="/images/n12.png"
//                 className="h-14 w-40 bg-white p-1 rounded"
//                 alt="Career Vidya"
//               />
//               {/* <span className="font-black text-lg uppercase tracking-tighter">
//                 Career Vidya
//               </span> */}
//             </div>

//             <h2 className="text-l font-black leading-tight mb-4 uppercase">
//               Your Path to <br />
//               <span className="text-orange-500 text-2xl">Success</span>
//             </h2>

//             <ul className="space-y-3">
//               {[
//                 "Top University Courses",
//                 "Special Subsidies",
//                 "EMI Facility",
//                 "Placement Assistance",
//                 "Degree globally recognized",
//                 "Secure Portal",
//               ].map((item, idx) => (
//                 <li
//                   key={idx}
//                   className="flex items-center gap-2 text-[11px] font-black uppercase text-white/90"
//                 >
//                   <CheckCircle2 size={14} className="text-orange-500" /> {item}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="flex items-center gap-2 text-orange-400 font-black text-[12px] uppercase border-t border-white/10 pt-4">
//             <Lock size={12} /> 100% Data Protection
//           </div>
//         </div>

//         {/* RIGHT FORM SIDE */}
//         <div className="flex-1 p-6 md:p-10 bg-white relative flex flex-col justify-center">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 text-black hover:bg-gray-100 rounded-full transition-all border border-gray-200"
//           >
//             <X size={20} />
//           </button>

//           <div className="mb-6">
//             <h3 className="text-2xl font-black text-[#4A55A2] uppercase tracking-tight">
//               Student Login
//             </h3>
//             <p className="text-gray-900 text-xs mt-1 font-black uppercase opacity-70">
//               {courseName
//                 ? `Accessing: ${courseName}`
//                 : "Sign in to your dashboard"}
//             </p>
//           </div>

//           {/* TABS */}
//           <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-fit border border-gray-200">
//             <button
//               onClick={() => {
//                 setLoginMode("phone");
//                 setOtpSent(false);
//               }}
//               className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${
//                 loginMode === "phone"
//                   ? "text-[#4A55A2] shadow-lg"
//                   : "text-gray-500"
//               }`}
//             >
//               PHONE
//             </button>

//             <button
//               onClick={() => {
//                 setLoginMode("email");
//                 setOtpSent(false);
//               }}
//               className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${
//                 loginMode === "email"
//                   ? "bg-white text-[#4A55A2] shadow-sm"
//                   : "text-gray-500"
//               }`}
//             >
//               EMAIL
//             </button>
//           </div>

//           <form onSubmit={handleVerifyOtp} className="space-y-6">
//             <div className="relative group">
//               <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-black text-[#4A55A2] z-10 border-x border-white">
//                 {loginMode.toUpperCase()} ADDRESS
//               </label>

//               <input
//                 type={loginMode === "email" ? "email" : "tel"}
//                 placeholder={
//                   loginMode === "email"
//                     ? "name@example.com"
//                     : "10-digit mobile number"
//                 }
//                 className="w-full bg-white border-2 border-[#4A55A2] rounded-xl px-5 py-4 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-black text-black placeholder:text-[#4A55A2] transition-all shadow-sm"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 disabled={otpSent}
//               />

//               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#e8fff3] border border-[#2ecc71] text-[#27ae60] text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
//                 <CheckCircle2 size={10} /> WE DO NOT SPAM
//               </div>
//             </div>

//             {otpSent && (
//               <div className="pt-4 animate-in slide-in-from-top-2">
//                 <div className="relative">
//                   <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-black text-orange-600 z-10">
//                     ENTER OTP
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full border-2 border-orange-500 bg-orange-50/30 rounded-xl px-4 py-4 text-center font-black tracking-[12px] text-lg text-orange-600 outline-none"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     maxLength={6}
//                   />
//                 </div>
//               </div>
//             )}

//             <button
//               type={otpSent ? "submit" : "button"}
//               onClick={!otpSent ? handleSendOtp : undefined}
//               disabled={loading}
//               className={`w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 text-xs uppercase tracking-[2px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-all ${
//                 otpSent
//                   ? "bg-orange-600 shadow-orange-200"
//                   : "bg-[#094385]"
//               }`}
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" size={18} />
//               ) : (
//                 <>
//                   {otpSent ? "VERIFY & LOGIN" : "GET ACCESS OTP"}{" "}
//                   <ArrowRight size={16} />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-10 pt-6 border-t-2 border-dashed border-gray-100">
//             <p className="text-[10px] text-black font-black flex items-center justify-center gap-2 uppercase tracking-tight text-center">
//               <ShieldCheck size={14} className="text-blue-600" />
//               All your information is secure with us
//             </p>

//             <div className="flex items-center justify-center gap-6 mt-4">
//               <button
//                 onClick={() => router.push("/signupoffer")}
//                 className="text-xs font-black text-[#002147] hover:text-black transition-colors flex items-center gap-1 uppercase underline decoration-2"
//               >
//                 <UserPlus size={14} /> Create Account
//               </button>
//               <div className="h-4 w-[1px] bg-gray-300"></div>
//               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                 SSL 256-BIT
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";

/* ===== Common Field Style ===== */
const inputStyle =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-[#05347f]">
            Vidya hai to Success hai
          </h1>
          <p className="text-[14] text-gray-500">
           CareerVidya India's trusted education platform
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-between text-[14px] text-green-700 mb-4 border-b pb-3">
          <span>✅  No-Cost EMI from ₹4,999</span>
          <span>🎓 Govt-Approved Universities</span>
          <span>💼 
EMI Facility
|
Loan Facility</span>
        </div>

        {/* LOGIN ONLY */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyle}
          />

          <span className="text-[11px] text-green-600 font-medium">
            ✓ We don’t spam
          </span>

          <button className="w-full bg-orange-700 text-white py-2 rounded-md text-sm font-semibold hover:bg-orange-800 transition">
            LOGIN
          </button>

          {/* Signup Link */}
          <p className="text-center text-[14] text-gray-600 mt-1">
            Don’t have an account?{" "}
            <button className="text-blue-600 font-semibold hover:underline">
              Create Account
            </button>
          </p>
        </div>

        {/* SSL Notice */}
        <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-wider bg-green-50 py-1 rounded-md">
          Secure SSL Encryption Enabled
        </p>
      </div>
    </div>
  );
}
