// "use client";

// import Image from "next/image";

// const cards = [
//   {
//     id: 1,
//     title: "Web Development",
//     image: "/images/i2.jpeg",
//   },
//   {
//     id: 2,
//     title: "App Development",
//     image: "/images/i6.jpeg",
//   },
//   {
//     id: 3,
//     title: "UI/UX Design",
//     image: "/images/i4.jpeg",
//   },
// ];

// export default function HoverCards() {
//   return (
//     <div className="relative w-full h-[500px]">
//       {/* Background */}
//       <Image
//         src="/images/CU png.png"
//         alt="bg"
//         fill
//         className="object-cover"
//       />

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
//           {cards.map((card) => (
//             <div
//               key={card.id}
//               className="group relative w-[320px] h-[400px] bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer"
//             >
//               {/* TEXT (slides up & hide) */}
//               <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold z-10 transform transition-all duration-500 group-hover:-translate-y-full">
//                 {card.title}
//               </div>

//               {/* IMAGE (slides from bottom) */}
//               <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center p-4">
//                 <Image
//                   src={card.image}
//                   alt={card.title}
//                   fill
//                   className="object-contain"
//                 />
//               </div>

//               {/* optional overlay */}
//               <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie"; 
import api from "@/utlis/api.js";
import { ArrowRight, Mail, Phone, Lock, ShieldCheck, X } from "lucide-react";

// isOpen: popup dikhane ke liye logic
// onClose: popup band karne ke liye function
const LoginPopup = ({ isOpen, onClose }) => {
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (!isOpen) return null; // Agar open nahi hai toh kuch mat dikhao

  /* ================= SEND OTP (Original Logic) ================= */
  const handleSendOtp = async () => {
    if (!identifier) return alert("Please enter your Email or Phone Number");

    try {
      setLoading(true);
      const response = await api.post("/api/v1/send-otp", {
        emailOrPhone: identifier,
        purpose: "login",
      });
      
      alert(response.data.msg || "OTP Sent Successfully ✅");
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Error:", error);
      alert(error.response?.data?.msg || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP & LOGIN (Original Logic) ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP");

    try {
      setLoading(true);

      const res = await api.post("/api/v1/verify-otp", {
        emailOrPhone: identifier,
        otp,
        purpose: "login",
      });

      const { accessToken, student } = res.data;
      const role = student.role;

      const tokenKey = (role === "admin" || role === "subadmin") ? "admintoken" : "usertoken";
      localStorage.setItem(tokenKey, accessToken);
      localStorage.setItem("user", JSON.stringify(student));
      localStorage.setItem("accessToken", accessToken);

      const isLocal = window.location.hostname === "localhost";
      const cookieOptions = { 
        expires: 7, 
        path: "/", 
        secure: !isLocal, 
        domain: isLocal ? undefined : ".careervidya.in",
        sameSite: 'lax'
      };

      Cookies.set("userRole", role, cookieOptions);
      Cookies.set(tokenKey, accessToken, cookieOptions);

      setTimeout(() => {
        const targetPath = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
        window.location.href = targetPath;
      }, 200); 

    } catch (error) {
      console.error("Verification Error:", error);
      alert(error.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      
      {/* Background Overlay to close on click outside */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-[450px] animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
        >
          <X size={28} />
        </button>

        {/* Branding Area */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-blue-50 text-blue-700 text-[9px] font-bold px-3 py-1 uppercase tracking-[0.2em] border border-blue-100" style={{ borderRadius: '2px' }}>
            Student's Trusted Guidance Platform
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white border border-slate-200 shadow-2xl p-8 md:p-10" style={{ borderRadius: '2px' }}>
          
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-slate-900"> Login</h1>
            <p className="text-slate-400 text-sm mt-1">Please select your preferred login method.</p>
          </div>

          {/* Login Switcher */}
          <div className="flex border-b border-slate-100 mb-8">
            {['email', 'phone'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => !otpSent && setLoginMode(mode)}
                className={`pb-3 pr-8 text-[11px] font-bold uppercase tracking-widest transition-all ${
                  loginMode === mode ? 'text-[#0056b3] border-b-2 border-[#0056b3]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {mode === 'email' ? 'Email Auth' : 'Mobile Auth'}
              </button>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            {/* Identifier Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                {loginMode === "email" ? "Registered Email" : "Mobile Number"}
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0056b3] transition-colors">
                  {loginMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
                </div>
                <input
                  type={loginMode === "email" ? "email" : "tel"}
                  placeholder={loginMode === "email" ? "Enter your email" : "Enter mobile number"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={otpSent}
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-10 text-sm outline-none focus:border-[#0056b3] focus:bg-white transition-all placeholder:text-slate-300 shadow-sm disabled:opacity-70"
                  style={{ borderRadius: '2px' }}
                />
              </div>
            </div>

            {/* OTP Section */}
            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-3 duration-500">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verification Code</label>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-bold text-[#0056b3] hover:underline">Edit Info</button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full bg-slate-50 border-2 border-blue-50 p-3.5 text-center text-xl tracking-[0.8em] font-black focus:border-[#0056b3] outline-none transition-all shadow-inner"
                  style={{ borderRadius: '2px' }}
                />
              </div>
            )}

            {/* Action Buttons */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-70"
                style={{ borderRadius: '2px' }}
              >
                {loading ? "Requesting..." : "Send OTP"}
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ borderRadius: '2px' }}
              >
                <Lock size={14} />
                {loading ? "Verifying..." : "Secure Login"}
              </button>
            )}
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New to Career Vidya? 
              <Link href="/signup" className="text-[#0056b3] ml-2 font-bold hover:underline transition-colors">Create Account</Link>
            </p>
          </div>
        </div>

        {/* Safe Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md py-2 px-4 w-fit mx-auto border border-white/20" style={{ borderRadius: '2px' }}>
           <ShieldCheck size={14} className="text-white" />
           <span className="text-[10px] font-bold text-white uppercase tracking-tight italic">All your information is safe and secure.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
