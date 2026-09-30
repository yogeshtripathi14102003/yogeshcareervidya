


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api.js";
// import { useAuth } from "@/context/AuthContext.jsx";
// import { trackEvent } from "@/utlis/analytics.js";
// import { ArrowRight, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";

// const LoginPage = () => {
//   const [loginMode, setLoginMode] = useState("email");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();
//   const { login } = useAuth();

//   /* ================= SEND OTP (Original Logic) ================= */
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

//   /* ================= VERIFY OTP & LOGIN (Original Logic) ================= */
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

//       login({ accessToken, user: student, role });
//       trackEvent("login_click", { method: "otp" });

//       const params = new URLSearchParams(window.location.search);
//       const redirectParam = params.get("redirect");
//       const defaultPath = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
//       const targetPath = redirectParam && redirectParam.startsWith("/") ? redirectParam : defaultPath;

//       setTimeout(() => {
//         window.location.href = targetPath;
//       }, 150);

//     } catch (error) {
//       console.error("Verification Error:", error);
//       alert(error.response?.data?.msg || "Invalid OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//     <Header />
//     <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans antialiased text-slate-900 relative">
      
//       {/* Background Subtle Pattern */}
//       <div className="absolute inset-0 z-0 opacity-[0.02]" 
//         style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
//       </div>

//       <div className="relative z-10 w-full max-w-[450px]">
        
//         {/* Branding Area */}
//      {/* Branding Area */}
// <div className="flex flex-col items-center mb-8 text-center">
//    {/* <div className="flex items-center gap-2 mb-3">

//       <div className="w-auto h-12 flex items-center justify-center overflow-hidden" style={{ borderRadius: '2px' }}>
//          <img 
//             src="/images/n12.png" // Aapne logo ka jo bhi path rakha ho (e.g., /public/logo.png)
//             alt="Career Vidya Logo" 
//             className="h-full w-full object-contain"
//          />
//       </div>

//       <span className="text-xl font-black tracking-tighter uppercase text-[#0056b3]">Career Vidya</span>
//    </div> */}
   
//    <div className="bg-blue-50 text-blue-700 text-[9px] font-bold px-3 py-1 uppercase tracking-[0.2em] border border-blue-100" style={{ borderRadius: '2px' }}>
//      Student's Trusted Guidance Platform
//    </div>
// </div>

//         {/* Main Login Card */}
//         <div className="bg-white border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 md:p-10" style={{ borderRadius: '2px' }}>
          
//           <div className="mb-8">
//             <h1 className="text-xl font-bold tracking-tight text-slate-900"> Login</h1>
//             <p className="text-slate-400 text-sm mt-1">Please select your preferred login method.</p>
//           </div>

//           {/* Login Switcher */}
//           <div className="flex border-b border-slate-100 mb-8">
//             {['email', 'phone'].map((mode) => (
//               <button
//                 key={mode}
//                 type="button"
//                 onClick={() => !otpSent && setLoginMode(mode)}
//                 className={`pb-3 pr-8 text-[11px] font-bold uppercase tracking-widest transition-all ${
//                   loginMode === mode ? 'text-[#0056b3] border-b-2 border-[#0056b3]' : 'text-slate-400 hover:text-slate-600'
//                 }`}
//               >
//                 {mode === 'email' ? 'Email Auth' : 'Mobile Auth'}
//               </button>
//             ))}
//           </div>

//           <form className="space-y-6" onSubmit={handleVerifyOtp}>
//             {/* Identifier Input */}
//             <div className="space-y-2">
//               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
//                 {loginMode === "email" ? "Registered Email" : "Mobile Number"}
//               </label>
//               <div className="relative group">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0056b3] transition-colors">
//                   {loginMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
//                 </div>
//                 <input
//                   type={loginMode === "email" ? "email" : "tel"}
//                   placeholder={loginMode === "email" ? "Enter your email" : "Enter mobile number"}
//                   value={identifier}
//                   onChange={(e) => setIdentifier(e.target.value)}
//                   disabled={otpSent}
//                   required
//                   className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-10 text-sm outline-none focus:border-[#0056b3] focus:bg-white transition-all placeholder:text-slate-300 shadow-sm disabled:opacity-70"
//                   style={{ borderRadius: '2px' }}
//                 />
//               </div>
//             </div>

//             {/* OTP Section */}
//             {otpSent && (
//               <div className="animate-in fade-in slide-in-from-top-3 duration-500">
//                 <div className="flex justify-between items-center mb-2 px-1">
//                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verification Code</label>
//                   <button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-bold text-[#0056b3] hover:underline">Edit Info</button>
//                 </div>
//                 <input
//                   type="text"
//                   maxLength={6}
//                   placeholder="0 0 0 0 0 0"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                   className="w-full bg-slate-50 border-2 border-blue-50 p-3.5 text-center text-xl tracking-[0.8em] font-black focus:border-[#0056b3] outline-none transition-all shadow-inner"
//                   style={{ borderRadius: '2px' }}
//                 />
//               </div>
//             )}

//             {/* Action Buttons */}
//             {!otpSent ? (
//               <button
//                 type="button"
//                 onClick={handleSendOtp}
//                 disabled={loading}
//                 className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-70"
//                 style={{ borderRadius: '2px' }}
//               >
//                 {loading ? "Requesting..." : "Send OTP"}
//                 <ArrowRight size={14} />
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-black text-white p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
//                 style={{ borderRadius: '2px' }}
//               >
//                 <Lock size={14} />
//                 {loading ? "Verifying..." : "Secure Login"}
//               </button>
//             )}
//           </form>

//           {/* Footer Info */}
//           <div className="mt-8 pt-6 border-t border-slate-50 text-center">
//             <p className="text-slate-500 text-sm font-medium">
//               New to Career Vidya? 
//               <Link href="/signup" className="text-[#0056b3] ml-2 font-bold hover:underline transition-colors">Create Account</Link>
//             </p>
//           </div>
//         </div>

//         {/* Safe Badge */}
//         <div className="mt-8 flex items-center justify-center gap-2 bg-slate-100/50 py-2 px-4 w-fit mx-auto" style={{ borderRadius: '2px' }}>
//            <ShieldCheck size={14} className="text-slate-400" />
//            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">All your information is safe and secure with us.</span>
//         </div>
//       </div>
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default LoginPage;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { trackEvent } from "@/utlis/analytics.js";
import { ArrowRight, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  /* ═══════════ SEND OTP (Logic same) ═══════════ */
  const handleSendOtp = async () => {
    if (!identifier) {
      toast.error("Please enter your Email or Phone Number");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/v1/send-otp", {
        emailOrPhone: identifier,
        purpose: "login",
      });

      toast.success(response.data.msg || "OTP Sent Successfully ✅");
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(
        error.response?.data?.msg || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════ VERIFY OTP & LOGIN (Logic same) ═══════════ */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/v1/verify-otp", {
        emailOrPhone: identifier,
        otp,
        purpose: "login",
      });

      const { accessToken, student } = res.data;
      const role = student.role;

      login({ accessToken, user: student, role });
      trackEvent("login_click", { method: "otp" });

      toast.success("Login successful! Redirecting...");

      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect");
      const defaultPath =
        role === "admin" || role === "subadmin" ? "/admin" : "/user";
      const targetPath =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : defaultPath;

      setTimeout(() => {
        window.location.href = targetPath;
      }, 300);
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div
        className="min-h-screen flex items-center justify-center p-6 antialiased relative"
        style={{ background: "var(--cv-neutral-light)" }}
      >
        {/* Background Subtle Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#1E3A8A 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 w-full max-w-[450px]">

          {/* ═══════════ BRANDING ═══════════ */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div
              className="text-[9px] font-bold px-3 py-1 uppercase tracking-[0.2em] border"
              style={{
                background: "var(--cv-primary-light)",
                color: "var(--cv-primary)",
                borderColor: "var(--cv-primary-light)",
                borderRadius: "4px",
              }}
            >
              Student's Trusted Guidance Platform
            </div>
          </div>

          {/* ═══════════ LOGIN CARD ═══════════ */}
          <div
            className="bg-white border p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]"
            style={{
              borderColor: "var(--cv-neutral-border)",
              borderRadius: "12px",
            }}
          >

            {/* Header */}
            <div className="mb-8">
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--cv-neutral-dark)" }}
              >
                Login
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                Please select your preferred login method.
              </p>
            </div>

            {/* ═══════════ LOGIN SWITCHER ═══════════ */}
            <div
              className="flex mb-8"
              style={{ borderBottom: "1px solid var(--cv-neutral-border)" }}
            >
              {["email", "phone"].map((mode) => {
                const isActive = loginMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => !otpSent && setLoginMode(mode)}
                    className="pb-3 pr-8 text-[11px] font-bold uppercase tracking-widest transition-all"
                    style={{
                      color: isActive
                        ? "var(--cv-primary)"
                        : "var(--cv-neutral-mid)",
                      borderBottom: isActive
                        ? "2px solid var(--cv-primary)"
                        : "2px solid transparent",
                    }}
                  >
                    {mode === "email" ? "Email Auth" : "Mobile Auth"}
                  </button>
                );
              })}
            </div>

            <form className="space-y-6" onSubmit={handleVerifyOtp}>

              {/* ═══════════ IDENTIFIER INPUT ═══════════ */}
              <div className="space-y-2">
                <label
                  className="block text-[10px] font-bold uppercase tracking-widest px-1"
                  style={{ color: "var(--cv-neutral-mid)" }}
                >
                  {loginMode === "email" ? "Registered Email" : "Mobile Number"}
                </label>

                <div className="relative group">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    {loginMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
                  </div>

                  <input
                    type={loginMode === "email" ? "email" : "tel"}
                    placeholder={
                      loginMode === "email"
                        ? "Enter your email"
                        : "Enter mobile number"
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={otpSent}
                    required
                    className="w-full p-3.5 pl-10 text-sm outline-none transition-all disabled:opacity-70"
                    style={{
                      background: otpSent ? "#f1f5f9" : "#f8fafc",
                      border: "1px solid var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                      borderRadius: "8px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                      e.target.style.background = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-neutral-border)";
                      e.target.style.background = otpSent ? "#f1f5f9" : "#f8fafc";
                    }}
                  />
                </div>
              </div>

              {/* ═══════════ OTP SECTION ═══════════ */}
              {otpSent && (
                <div className="animate-in fade-in slide-in-from-top-3 duration-500">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[10px] font-bold hover:underline transition-colors"
                      style={{ color: "var(--cv-accent)" }}
                    >
                      Edit Info
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full p-3.5 text-center text-xl tracking-[0.8em] font-black outline-none transition-all"
                    style={{
                      background: "var(--cv-primary-light)",
                      border: "2px solid var(--cv-primary-light)",
                      color: "var(--cv-neutral-dark)",
                      borderRadius: "8px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cv-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--cv-primary-light)";
                    }}
                  />
                </div>
              )}

              {/* ═══════════ ACTION BUTTONS ═══════════ */}
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                  style={{
                    background: "var(--cv-grad-cta)",
                    color: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 8px 20px rgba(193, 83, 4, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "var(--cv-grad-cta-hover)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--cv-grad-cta)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {loading ? "Requesting..." : "Send OTP"}
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                  style={{
                    background: "var(--cv-grad-cta)",
                    color: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 8px 20px rgba(193, 83, 4, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "var(--cv-grad-cta-hover)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--cv-grad-cta)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Lock size={14} />
                  {loading ? "Verifying..." : "Secure Login"}
                </button>
              )}
            </form>

            {/* ═══════════ FOOTER INFO ═══════════ */}
            <div
              className="mt-8 pt-6 text-center"
              style={{ borderTop: "1px solid var(--cv-neutral-border)" }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                New to Career Vidya?{" "}
                <Link
                  href="/signup"
                  className="ml-2 font-bold hover:underline transition-colors"
                  style={{ color: "var(--cv-primary)" }}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* ═══════════ SAFE BADGE ═══════════ */}
          <div
            className="mt-8 flex items-center justify-center gap-2 py-2 px-4 w-fit mx-auto"
            style={{
              background: "var(--cv-neutral-light)",
              borderRadius: "8px",
            }}
          >
            <ShieldCheck size={14} style={{ color: "var(--cv-neutral-mid)" }} />
            <span
              className="text-[10px] font-bold uppercase tracking-tight italic"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              All your information is safe and secure with us.
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;