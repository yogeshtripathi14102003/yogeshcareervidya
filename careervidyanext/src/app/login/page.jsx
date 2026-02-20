


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api"; // सुनिश्चित करें कि स्पेलिंग सही है (utils/api)
// import Cookies from "js-cookie";

// const LoginPage = () => {
//   const [loginMode, setLoginMode] = useState("email");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // 1. पेज लोड होते ही चेक करें अगर यूजर पहले से लॉगिन है (Redirect Loop Protection)
//   useEffect(() => {
//     const adminToken = Cookies.get("admintoken");
//     const userToken = Cookies.get("usertoken"); // Fixed name
    
//     if (adminToken) {
//       router.replace("/admin");
//     } else if (userToken) {
//       router.replace("/user");
//     }
//   }, [router]);

//   // 2. OTP भेजने का फंक्शन
//   const handleSendOtp = async () => {
//     if (!identifier) return alert("Please enter your email or phone number.");
//     try {
//       setLoading(true);
//       await api.post("/api/v1/send-otp", { 
//         emailOrPhone: identifier, 
//         purpose: "login" 
//       });
//       alert("OTP sent successfully!");
//       setOtpSent(true);
//     } catch (error) {
//       alert(error.response?.data?.msg || "Failed to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. OTP Verify और Login का फंक्शन
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) return alert("Please enter the OTP first.");
    
//     try {
//       setLoading(true);
//       const res = await api.post("/api/v1/verify-otp", { 
//         emailOrPhone: identifier, 
//         otp, 
//         purpose: "login" 
//       });

//       const token = res.data.accessToken;
//       const userRole = res.data.student?.role; // student object से रोल निकाला

//       if (userRole === "admin") {
//         // Admin के लिए टोकन सेट करें
//         localStorage.setItem("admintoken", token);
//         Cookies.set("admintoken", token, { expires: 1, path: '/' });
//         router.push("/admin");
//       } else {
//         // User के लिए टोकन सेट करें (Middleware से मैच करने के लिए usertoken नाम रखा)
//         localStorage.setItem("usertoken", token);
//         Cookies.set("usertoken", token, { expires: 1, path: '/' });
//         router.push("/user");
//       }

//       alert("Login successful!");
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.msg || "Invalid OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black flex flex-col md:flex-row overflow-hidden">
//       {/* Left Section - Branding */}
//       <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start bg-gray-50">
//         <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
//         <h2 className="text-2xl font-semibold mb-6">Welcome Back to Career Vidya</h2>
//         <p className="mb-4">Log in to access your personalized dashboard:</p>
//         <ul className="list-disc list-inside mb-6 space-y-2 text-gray-600">
//           <li>Exam Alerts: Timely updates. Smart decisions.</li>
//           <li>Mock Tests: Practice. Perform. Perfect.</li>
//           <li>AI Predictions: Data-driven college matches.</li>
//           <li>Counselling: Personal guidance. Real results.</li>
//         </ul>
//       </div>

//       {/* Right Section - Login Form */}
//       <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center">
//         <div className="w-full max-w-md">
//           <form className="space-y-4" onSubmit={handleVerifyOtp}>
//             <div className="flex space-x-6 mb-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="loginMode"
//                   checked={loginMode === "email"}
//                   onChange={() => setLoginMode("email")}
//                   className="mr-2 w-4 h-4 accent-[#1E90FF]"
//                   disabled={otpSent}
//                 />
//                 <span className="text-sm font-medium">Email</span>
//               </label>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="loginMode"
//                   checked={loginMode === "phone"}
//                   onChange={() => setLoginMode("phone")}
//                   className="mr-2 w-4 h-4 accent-[#1E90FF]"
//                   disabled={otpSent}
//                 />
//                 <span className="text-sm font-medium">Phone Number</span>
//               </label>
//             </div>

//             <input
//               type={loginMode === "email" ? "email" : "tel"}
//               placeholder={loginMode === "email" ? "Enter Email" : "Enter Phone (e.g. +91...)"}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               required
//               disabled={otpSent}
//             />

//             <div className="flex gap-3">
//               {otpSent && (
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//               )}
              
//               {!otpSent ? (
//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   className="w-full p-3 bg-[#FFA500] text-white font-semibold rounded-lg hover:bg-[#e69500] transition disabled:bg-gray-400"
//                   disabled={loading}
//                 >
//                   {loading ? "Sending..." : "Send OTP"}
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   className="w-1/2 p-3 bg-[#1E90FF] text-white font-semibold rounded-lg hover:bg-[#1874cc] transition disabled:bg-gray-400"
//                   disabled={loading}
//                 >
//                   {loading ? "Verifying..." : "Login"}
//                 </button>
//               )}
//             </div>

//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
//               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
//             </div>

//             <button type="button" className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-1.6 3.92-4.16 3.92-2.32 0-4.24-1.92-4.24-4.28s1.92-4.28 4.24-4.28c1.36 0 2.24.56 2.72 1.04l2.48-2.48C19.92 6.4 17.52 5.2 14.56 5.2c-4.48 0-8.08 3.6-8.08 8.08s3.6 8.08 8.08 8.08c4.64 0 7.76-3.28 7.76-7.84 0-.56-.08-1.04-.16-1.52h-7.68z"></path>
//               </svg>
//               Google
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-600">
//             Don’t have an account?{" "}
//             <Link href="/signup" className="text-[#1E90FF] font-semibold hover:underline">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Cookies from "js-cookie"; 
// import api from "@/utlis/api.js";

// const LoginPage = () => {
//   const [loginMode, setLoginMode] = useState("email");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   /* ================= SEND OTP ================= */
//   const handleSendOtp = async () => {
//     if (!identifier) return alert("Please enter your Email or Phone Number");

//     try {
//       setLoading(true);
//       const response = await api.post("/api/v1/send-otp", {
//         emailOrPhone: identifier,
//         purpose: "login",
//       });
      
//       alert(response.data.msg || "OTP Sent Successfully ✅");
//       setOtpSent(true);
//     } catch (error) {
//       console.error("OTP Error:", error);
//       alert(error.response?.data?.msg || "Failed to send OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= VERIFY OTP & LOGIN ================= */
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) return alert("Please enter the OTP");

//     try {
//       setLoading(true);

//       const res = await api.post("/api/v1/verify-otp", {
//         emailOrPhone: identifier,
//         otp,
//         purpose: "login",
//       });

//       const { accessToken, student } = res.data;
//       const role = student.role;

//       // 1. LocalStorage Sync (Dashboard ke liye 'admintoken' ya 'usertoken' naam zaroori hai)
//       const tokenKey = (role === "admin" || role === "subadmin") ? "admintoken" : "usertoken";
//       localStorage.setItem(tokenKey, accessToken);
//       localStorage.setItem("user", JSON.stringify(student));
//       localStorage.setItem("accessToken", accessToken); // Backwards compatibility

//       // 2. Cookie Logic (Environment Aware)
//       const isLocal = window.location.hostname === "localhost";
//       const cookieOptions = { 
//         expires: 7, 
//         path: "/", 
//         secure: !isLocal, 
//         domain: isLocal ? undefined : ".careervidya.in",
//         sameSite: 'lax'
//       };

//       // Middleware ke liye Role aur Token dono cookies set karein
//       Cookies.set("userRole", role, cookieOptions);
//       Cookies.set(tokenKey, accessToken, cookieOptions);

//       // 3. Redirection Logic
//       // window.location.href ka use karna behtar hai taaki server-side cookies refresh ho jayein
//       setTimeout(() => {
//         const targetPath = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
//         window.location.href = targetPath;
//       }, 200); 

//     } catch (error) {
//       console.error("Verification Error:", error);
//       alert(error.response?.data?.msg || "Invalid OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
//       <div className="w-full md:w-1/2 p-10 bg-blue-600 text-white flex flex-col justify-center">
//         <div className="max-w-md mx-auto">
//           <h1 className="text-5xl font-extrabold mb-6">Career Vidya</h1>
//           <h2 className="text-3xl font-semibold mb-4">Welcome Back 👋</h2>
//           <p className="text-blue-100 text-lg mb-8">Access your personalized dashboard and track your career progress.</p>
//           <ul className="space-y-4">
//             <li className="flex items-center gap-3"><span className="bg-blue-500 p-2 rounded-full">✓</span> Personal Counselling</li>
//             <li className="flex items-center gap-3"><span className="bg-blue-500 p-2 rounded-full">✓</span> Verified Universities</li>
//             <li className="flex items-center gap-3"><span className="bg-blue-500 p-2 rounded-full">✓</span> Placement Support</li>
//           </ul>
//         </div>
//       </div>

//       <div className="w-full md:w-1/2 p-8 flex justify-center items-center bg-white">
//         <div className="w-full max-w-md shadow-2xl p-8 rounded-2xl border border-gray-100">
//           <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Account</h3>
//           <form className="space-y-5" onSubmit={handleVerifyOtp}>
//             <div className="flex justify-center bg-gray-100 p-1 rounded-xl mb-4">
//               <button type="button" className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${loginMode === 'email' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} onClick={() => !otpSent && setLoginMode("email")}>Email</button>
//               <button type="button" className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${loginMode === 'phone' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} onClick={() => !otpSent && setLoginMode("phone")}>Phone</button>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{loginMode === "email" ? "Email Address" : "Phone Number"}</label>
//               <input type={loginMode === "email" ? "email" : "tel"} placeholder={loginMode === "email" ? "example@mail.com" : "+91 XXXXX XXXXX"} value={identifier} onChange={(e) => setIdentifier(e.target.value)} disabled={otpSent} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-50" />
//             </div>
//             {otpSent && (
//               <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-Digit OTP</label>
//                 <input type="text" maxLength={6} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 border-blue-500 outline-none text-center tracking-widest font-bold" />
//                 <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-blue-600 mt-2 hover:underline">Change Email/Phone?</button>
//               </div>
//             )}
//             {!otpSent ? (
//               <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition active:scale-95 disabled:opacity-70">{loading ? "Sending..." : "Send OTP"}</button>
//             ) : (
//               <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition active:scale-95 disabled:opacity-70">{loading ? "Verifying..." : "Login Now"}</button>
//             )}
//           </form>
//           <p className="mt-8 text-center text-sm text-gray-500">New to Career Vidya? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie"; 
import api from "@/utlis/api.js";
import { ArrowRight, Mail, Phone, Lock, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans antialiased text-slate-900 relative">
      
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" 
        style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 w-full max-w-[450px]">
        
        {/* Branding Area */}
     {/* Branding Area */}
<div className="flex flex-col items-center mb-8 text-center">
   {/* <div className="flex items-center gap-2 mb-3">

      <div className="w-auto h-12 flex items-center justify-center overflow-hidden" style={{ borderRadius: '2px' }}>
         <img 
            src="/images/n12.png" // Aapne logo ka jo bhi path rakha ho (e.g., /public/logo.png)
            alt="Career Vidya Logo" 
            className="h-full w-full object-contain"
         />
      </div>

      <span className="text-xl font-black tracking-tighter uppercase text-[#0056b3]">Career Vidya</span>
   </div> */}
   
   <div className="bg-blue-50 text-blue-700 text-[9px] font-bold px-3 py-1 uppercase tracking-[0.2em] border border-blue-100" style={{ borderRadius: '2px' }}>
     Student's Trusted Guidance Platform
   </div>
</div>

        {/* Main Login Card */}
        <div className="bg-white border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 md:p-10" style={{ borderRadius: '2px' }}>
          
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
        <div className="mt-8 flex items-center justify-center gap-2 bg-slate-100/50 py-2 px-4 w-fit mx-auto" style={{ borderRadius: '2px' }}>
           <ShieldCheck size={14} className="text-slate-400" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">All your information is safe and secure with us.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;