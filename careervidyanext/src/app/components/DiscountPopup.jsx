// "use client";

// import { useState, useEffect } from "react";
// import { X, Zap, CheckCircle2 } from "lucide-react";
// import Image from "next/image";
// import API from "@/utlis/api.js";

// /* ================= FLOATING INPUT (Modern Compact UI) ================= */
// const FloatingInput = ({ label, name, type = "text", value, onChange, readOnly, insideText }) => (
//   <div className="relative w-full mb-4 group">
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       readOnly={readOnly}
//       className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium outline-none transition-all duration-200 
//       ${readOnly 
//         ? "bg-neutral-50 text-neutral-500 border-neutral-100 cursor-not-allowed" 
//         : "bg-white text-neutral-800 focus:border-[#c15304] focus:ring-4 focus:ring-[#c15304]/10"
//       }`}
//     />
//     {insideText && (
//       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 tracking-wider uppercase animate-pulse">
//         {insideText}
//       </span>
//     )}
//     <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-[#c15304] tracking-wide transform transition-all group-focus-within:scale-105">
//       {label}
//     </label>
//   </div>
// );

// const FloatingSelect = ({ label, name, value, onChange }) => (
//   <div className="relative w-full mb-4 group">
//     <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-[#c15304] tracking-wide">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium text-neutral-700 outline-none transition-all duration-200 bg-white focus:border-[#c15304] focus:ring-4 focus:ring-[#c15304]/10 appearance-none cursor-pointer"
//     >
//       <option value="">Select</option>
//       <option>male</option>
//       <option>female</option>
//       <option>other</option>
//     </select>
//     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
//       <svg className="fill-current h-4 w-4 transition-transform group-focus-within:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//         <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
//       </svg>
//     </div>
//   </div>
// );

// /* ================= MAIN COMPONENT ================= */
// const CelebrationSignupPopup = () => {
//   const [mounted, setMounted] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [offer, setOffer] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "", email: "", mobileNumber: "", city: "", state: "",
//     course: "", gender: "", addresses: "", branch: "", otp: "",
//     dob: "", subsidyCoupon: "",
//   });

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const timer = setTimeout(async () => {
//       try {
//         const res = await API.get("/api/v1/offer/type/offer");
//         const latest = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
//         setOffer(latest);
//         setShowPopup(true);
//         const seconds = Math.max(Math.floor((new Date(latest.validTill) - new Date()) / 1000), 0);
//         setTimeLeft(seconds);
//       } catch (err) { console.error("Offer API error", err); }
//     }, 10000);
//     return () => clearTimeout(timer);
//   }, [mounted]);

//   useEffect(() => {
//     if (!showPopup || !offer || timeLeft <= 0) return;
//     const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timeLeft, showPopup, offer]);

//   useEffect(() => {
//     if (!showSuccessPopup) return;
//     const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
//     return () => clearTimeout(timer);
//   }, [showSuccessPopup]);

//   if (!mounted || !offer) return null;

//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleGetClick = () => {
//     setShowSignup(true);
//     setFormData((p) => ({
//       ...p,
//       subsidyCoupon: `${offer.couponCode} - ${offer.discountPercentage}%`,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (otpSent) {
//       if (!formData.otp) return alert("Enter OTP");
//       try {
//         setLoading(true);
//         await API.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
//         setShowPopup(false);
//         setShowSuccessPopup(true);
//       } catch { alert("Invalid OTP"); } finally { setLoading(false); }
//     } else {
//       try {
//         setLoading(true);
//         await API.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
//         setOtpSent(true);
//         alert("OTP Sent Successfully");
//       } catch { alert("OTP error"); } finally { setLoading(false); }
//     }
//   };

//   return (
//     <>
//       {showPopup && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           {/* Backdrop with strong blur */}
//           <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-md transition-opacity" onClick={() => setShowPopup(false)} />

//           <div className={`relative w-full ${showSignup ? 'max-w-4xl' : 'max-w-[400px]'} rounded-3xl shadow-[0_25px_50px_-12px_rgba(193,83,4,0.25)] bg-white overflow-hidden transition-all duration-500 ease-out border border-neutral-100`}>
            
//             {/* Elegant Circle Close Button */}
//             <button 
//               onClick={() => setShowPopup(false)} 
//               className="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 p-2 rounded-full z-30 transition-all duration-200"
//             >
//               <X size={16} />
//             </button>

//             {!showSignup ? (
//               /* --- VIEW 1: PREMIUM COMPACT CARD --- */
//               <div className="relative p-8 text-center overflow-hidden flex flex-col items-center min-h-[440px] justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-[#c15304]">
                
//                 {/* Visual Glow elements */}
//                 <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#c15304]/30 rounded-full filter blur-[60px] pointer-events-none" />
//                 <div className="absolute bottom-0 right-1/4 w-36 h-36 bg-orange-500/20 rounded-full filter blur-[50px] pointer-events-none" />

//                 <div className="relative z-10 w-full flex flex-col items-center">
//                   <span className="bg-white/10 text-orange-300 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
//                     Limited Period Offer
//                   </span>
                  
//                   <h2 className="text-[36px] font-black tracking-tight text-white uppercase italic leading-none drop-shadow-lg">
//                     GetAdmission
//                   </h2>
//                   <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase mt-1.5 mb-8">
//                     Empowering Your Future
//                   </p>
                  
//                   <div className="flex items-baseline justify-center mb-8 bg-white/[0.03] border border-white/5 shadow-inner px-8 py-5 rounded-2xl backdrop-blur-xl w-full max-w-[280px]">
//                     <span className="text-[100px] font-black text-white leading-none tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
//                       {offer.discountPercentage}
//                     </span>
//                     <div className="flex flex-col items-start ml-2">
//                        <span className="text-[36px] font-black text-orange-400 leading-none">%</span>
//                        <span className="text-[22px] font-black text-white/90 tracking-wide leading-none mt-1">OFF</span>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleGetClick}
//                     className="bg-white text-[#c15304] cursor-pointer w-full max-w-[200px] py-3.5 rounded-xl text-[15px] font-black flex items-center justify-center gap-2 mx-auto shadow-[0_10px_25px_-5px_rgba(193,83,4,0.4)] transition-all hover:bg-neutral-50 hover:scale-[1.03] active:scale-[0.98] group uppercase tracking-wider"
//                   >
//                     GET NOW <Zap className="fill-[#c15304] stroke-[#c15304] group-hover:animate-bounce" size={16} />
//                   </button>

//                   <div className="mt-8 flex items-center gap-2.5 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
//                     <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
//                     <p className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
//                       Ends In: <span className="text-white font-mono font-black text-[12px] ml-1">{hours}h : {minutes}m : {seconds}s</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               /* --- VIEW 2: DUAL-PANEL SPLIT DESIGN FORM --- */
//               <div className="flex md:flex-row flex-col max-h-[85vh] md:max-h-[620px]">
                
//                 {/* Left Accent Banner for visual weight */}
//                 <div className="hidden md:flex md:w-[35%] bg-gradient-to-br from-neutral-950 to-[#c15304] p-8 flex-col justify-between relative overflow-hidden">
//                   <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
//                   <div className="relative z-10">
//                     <p className="text-orange-400 font-black text-xs uppercase tracking-widest mb-2">Exclusive Access</p>
//                     <h3 className="text-white font-black text-2xl leading-tight">Unlock Your Educational Journey Today.</h3>
//                   </div>
//                   <div className="relative z-10 border-t border-white/10 pt-4 text-white/60 text-[11px] font-medium leading-relaxed">
//                     Fill the application to auto-apply your special <span className="text-white font-bold">{offer.discountPercentage}% discount</span> bundle instantly.
//                   </div>
//                 </div>

//                 {/* Right Form Container */}
//                 <div className="w-full md:w-[65%] p-6 md:p-8 overflow-y-auto bg-white">
//                   <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
//                     <Image src="/images/n12.png" alt="logo" width={75} height={35} className="object-contain" />
//                     <div>
//                       <p className="text-sm font-black text-[#c15304] tracking-wide">#VidyaHaiTohSuccessHai</p>
//                       <p className="text-[10px] text-neutral-400 font-semibold">Student's Trusted Guidance Platform</p>
//                     </div>
//                   </div>

//                   {/* Horizontal Ribbons */}
//                   <div className="mb-5 overflow-x-auto bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 scrollbar-none">
//                     <div className="flex min-w-max gap-4 text-[10px] font-bold text-neutral-600 uppercase tracking-wider items-center">
//                       <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"><CheckCircle2 size={12}/> No-Cost EMI</span>
//                       <span className="text-neutral-300">|</span>
//                       <span>🎓 Govt-Approved</span>
//                       <span className="text-neutral-300">|</span>
//                       <span>💼 100% Placement assistance</span>
//                     </div>
//                   </div>

//                   <form className="space-y-1">
//                     <FloatingInput label="Full Name*" name="name" value={formData.name} onChange={handleChange} />
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
//                       <FloatingInput label="Email*" name="email" value={formData.email} onChange={handleChange} />
//                       <FloatingInput label="Mobile*" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
//                     </div>
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
//                       <FloatingInput label="State*" name="state" value={formData.state} onChange={handleChange} />
//                       <FloatingInput label="City*" name="city" value={formData.city} onChange={handleChange} />
//                     </div>
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
//                       <FloatingInput label="Course*" name="course" value={formData.course} onChange={handleChange} />
//                       <FloatingInput label="Branch*" name="branch" value={formData.branch} onChange={handleChange} />
//                     </div>
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
//                       <FloatingSelect label="Gender*" name="gender" value={formData.gender} onChange={handleChange} />
//                       <FloatingInput type="date" label="DOB*" name="dob" value={formData.dob} onChange={handleChange} />
//                     </div>
                    
//                     <FloatingInput label="Coupon" name="subsidyCoupon" value={formData.subsidyCoupon} readOnly insideText="ACTIVE" />
//                     <FloatingInput label="Full Address" name="addresses" value={formData.addresses} onChange={handleChange} />
                    
//                     {otpSent && <FloatingInput label="Enter OTP" name="otp" value={formData.otp} onChange={handleChange} />}

//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       disabled={loading}
//                       className="w-full py-4 mt-4 rounded-xl text-white font-black bg-[#c15304] hover:bg-[#a04403] transition-all shadow-[0_8px_20px_-6px_rgba(193,83,4,0.4)] hover:shadow-[0_8px_25px_-3px_rgba(193,83,4,0.5)] active:scale-[0.99] text-xs uppercase tracking-widest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Processing..." : otpSent ? "Verify & Register" : "Send OTP To Apply"}
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* SUCCESS POPUP (Clean Minimalist Aesthetics) */}
//       {showSuccessPopup && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border-t-8 border-[#c15304] transition-all transform scale-100">
//             <div className="w-16 h-16 bg-orange-50 text-[#c15304] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">🎓</div>
//             <h3 className="text-2xl font-black text-neutral-900 mb-1">Thank You!</h3>
//             <p className="text-xs text-neutral-500 leading-relaxed font-medium px-2">Your admission offer is applied successfully. Our corporate advisor will reach out within 24 hours.</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CelebrationSignupPopup;


"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { X, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import API from "@/utlis/api.js";
import { toast } from "sonner";

const DISMISS_KEY = "offerPopupClosed";

const isDismissed = () => {
  try {
    return !!sessionStorage.getItem(DISMISS_KEY);
  } catch {
    return false;
  }
};

const markDismissed = () => {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {}
};

/* ═══════════════ COUNTDOWN (isolated: only this re-renders every second) ═══════════════ */
const Countdown = memo(function Countdown({ validTill }) {
  const calc = () =>
    Math.max(Math.floor((new Date(validTill) - Date.now()) / 1000), 0);

  const [left, setLeft] = useState(calc);

  useEffect(() => {
    setLeft(calc());
    const id = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validTill]);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <>
      {h}h : {m}m : {s}s
    </>
  );
});

/* ═══════════════ FLOATING INPUT ═══════════════ */
const FloatingInput = memo(function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly,
  insideText,
}) {
  return (
    <div className="relative w-full mb-4 group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full rounded-xl px-4 py-3 text-[13px] font-medium outline-none ${
          readOnly ? "cursor-not-allowed" : ""
        }`}
        style={{
          background: readOnly ? "var(--cv-neutral-light)" : "#fff",
          color: "var(--cv-neutral-dark)",
          border: "1.5px solid var(--cv-neutral-border)",
        }}
        onFocus={(e) => {
          if (!readOnly) {
            e.target.style.borderColor = "var(--cv-accent)";
            e.target.style.boxShadow = "0 0 0 4px rgba(249, 115, 22, 0.12)";
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--cv-neutral-border)";
          e.target.style.boxShadow = "none";
        }}
      />
      {insideText && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase"
          style={{
            background: "var(--cv-accent-light)",
            color: "var(--cv-accent)",
            border: "1px solid var(--cv-accent)",
          }}
        >
          {insideText}
        </span>
      )}
      <label
        className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold tracking-wide"
        style={{ color: "var(--cv-accent)" }}
      >
        {label}
      </label>
    </div>
  );
});

/* ═══════════════ FLOATING SELECT ═══════════════ */
const FloatingSelect = memo(function FloatingSelect({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="relative w-full mb-4 group">
      <label
        className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold tracking-wide z-10"
        style={{ color: "var(--cv-accent)" }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl px-4 py-3 text-[13px] font-medium outline-none appearance-none cursor-pointer"
        style={{
          background: "#fff",
          color: "var(--cv-neutral-dark)",
          border: "1.5px solid var(--cv-neutral-border)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--cv-accent)";
          e.target.style.boxShadow = "0 0 0 4px rgba(249, 115, 22, 0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--cv-neutral-border)";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value="">Select</option>
        <option>male</option>
        <option>female</option>
        <option>other</option>
      </select>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"
        style={{ color: "var(--cv-neutral-mid)" }}
      >
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
});

/* ═══════════════ MAIN COMPONENT ═══════════════ */
const CelebrationSignupPopup = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    dob: "",
    subsidyCoupon: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: offer } = useQuery({
    queryKey: ["celebration-offer"],
    queryFn: async () => {
      const res = await API.get("/api/v1/offer/type/offer");
      // copy before sort so the cached response isn't mutated
      return [...res.data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: mounted,
  });

  const closePopup = useCallback(() => {
    setShowPopup(false);
    markDismissed();
  }, []);

  /* Show popup after 10s — only once per session, and only if offer is still valid */
  useEffect(() => {
    if (!mounted || !offer) return;
    if (isDismissed()) return;
    if (new Date(offer.validTill) <= new Date()) return;

    const timer = setTimeout(() => setShowPopup(true), 10000);
    return () => clearTimeout(timer);
  }, [mounted, offer]);

  /* Lock body scroll + close on Escape while popup is open */
  useEffect(() => {
    if (!showPopup) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [showPopup, closePopup]);

  /* Auto-hide success popup */
  useEffect(() => {
    if (!showSuccessPopup) return;
    const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  if (!mounted || !offer) return null;

  const handleGetClick = () => {
    setShowSignup(true);
    setFormData((p) => ({
      ...p,
      subsidyCoupon: `${offer.couponCode} - ${offer.discountPercentage}%`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (otpSent) {
      if (!formData.otp) {
        toast.error("Enter OTP");
        return;
      }
      try {
        setLoading(true);
        await API.post("/api/v1/verify-otp", {
          ...formData,
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        setShowPopup(false);
        markDismissed();
        setShowSuccessPopup(true);
        toast.success("Registration Successful!");
      } catch {
        toast.error("Invalid OTP");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await API.post("/api/v1/send-otp", {
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        setOtpSent(true);
        toast.success("OTP Sent Successfully");
      } catch {
        toast.error("OTP error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Solid overlay (no backdrop-blur — that was the main lag source) */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.8)" }}
            onClick={closePopup}
          />

          <div
            className={`relative w-full ${
              showSignup ? "max-w-4xl" : "max-w-[400px]"
            } rounded-3xl shadow-2xl overflow-hidden`}
            style={{
              background: "#fff",
              boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.35)",
              border: "1px solid var(--cv-neutral-border)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 cursor-pointer p-2 rounded-full z-30 transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "var(--cv-neutral-dark)",
                border: "1px solid var(--cv-neutral-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cv-accent)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.color = "var(--cv-neutral-dark)";
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {!showSignup ? (
              /* ═══════════ VIEW 1: OFFER CARD ═══════════ */
              <div
                className="relative p-8 text-center overflow-hidden flex flex-col items-center min-h-[440px] justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 25% 0%, rgba(249,115,22,0.3) 0%, transparent 45%), radial-gradient(circle at 75% 100%, rgba(249,115,22,0.2) 0%, transparent 40%), linear-gradient(180deg, var(--cv-neutral-dark) 0%, var(--cv-primary) 60%, var(--cv-accent) 100%)",
                }}
              >
                <div className="relative z-10 w-full flex flex-col items-center">
                  <span className="bg-white/10 !text-white border border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Limited Period Offer
                  </span>

                  <h2 className="!text-white text-[36px] font-black tracking-tight uppercase italic leading-none">
                    GetAdmission
                  </h2>
                  <p className="!text-white/80 text-[10px] font-bold tracking-[0.25em] uppercase mt-1.5 mb-8">
                    Empowering Your Future
                  </p>

                  <div className="flex items-baseline justify-center mb-8 bg-white/[0.08] border border-white/10 px-8 py-5 rounded-2xl w-full max-w-[280px]">
                    <span className="!text-white text-[100px] font-black leading-none tracking-tighter">
                      {offer.discountPercentage}
                    </span>
                    <div className="flex flex-col items-start ml-2">
                      <span className="text-[36px] font-black leading-none !text-orange-400">
                        %
                      </span>
                      <span className="!text-white/90 text-[22px] font-black tracking-wide leading-none mt-1">
                        OFF
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleGetClick}
                    className="cursor-pointer w-full max-w-[200px] py-3.5 rounded-xl text-[15px] font-black flex items-center justify-center gap-2 mx-auto transition-transform hover:scale-[1.03] active:scale-[0.98] uppercase tracking-wider"
                    style={{
                      background: "#fff",
                      color: "var(--cv-accent)",
                      boxShadow: "0 10px 25px -5px rgba(193, 83, 4, 0.4)",
                    }}
                  >
                    GET NOW
                    <Zap className="fill-current stroke-current" size={16} />
                  </button>

                  <div className="mt-8 flex items-center gap-2.5 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    <p className="!text-white/90 text-[11px] font-bold uppercase tracking-wider">
                      Ends In:{" "}
                      <span className="!text-white font-mono font-black text-[12px] ml-1">
                        <Countdown validTill={offer.validTill} />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* ═══════════ VIEW 2: SIGNUP FORM ═══════════ */
              <div className="flex md:flex-row flex-col max-h-[85vh] md:max-h-[620px]">
                {/* LEFT BANNER */}
                <div
                  className="hidden md:flex md:w-[35%] p-8 flex-col justify-between relative overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.08) 0%, transparent 35%), radial-gradient(circle at 0% 100%, rgba(249,115,22,0.2) 0%, transparent 40%), linear-gradient(160deg, var(--cv-neutral-dark) 0%, var(--cv-primary) 40%, #7C3AED 80%, var(--cv-accent) 100%)",
                  }}
                >
                  <div className="relative z-10">
                    <p className="!text-white text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-orange-400 rounded-full" />
                      Exclusive Access
                    </p>

                    <h3 className="!text-white font-black text-3xl leading-tight mb-3">
                      Unlock Your
                      <br />
                      <span className="!text-white">Educational</span>
                      <br />
                      Journey Today.
                    </h3>
                    <p className="!text-white/85 text-[12px] leading-relaxed">
                      Get personalized guidance from India's top counsellors.
                    </p>
                  </div>

                  {/* Discount callout */}
                  <div className="relative z-10 my-6">
                    <div
                      className="rounded-2xl p-4 text-center"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <p className="!text-white/70 text-[10px] uppercase font-bold tracking-wider mb-1">
                        Auto-Applied Discount
                      </p>
                      <p className="!text-white text-4xl font-black leading-none">
                        {offer.discountPercentage}
                        <span className="!text-orange-300">%</span>
                      </p>
                      <p className="!text-white/70 text-[10px] uppercase font-bold tracking-wider mt-1">
                        OFF
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-white/15 pt-4 !text-white/75 text-[11px] font-medium leading-relaxed">
                    Fill the application to auto-apply your special{" "}
                    <span className="!text-orange-300 font-bold">
                      {offer.discountPercentage}% discount
                    </span>{" "}
                    bundle instantly.
                  </div>
                </div>

                {/* RIGHT FORM */}
                <div
                  className="w-full md:w-[65%] p-6 md:p-8 overflow-y-auto"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)",
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center gap-3 mb-6 pb-4"
                    style={{
                      borderBottom: "2px dashed var(--cv-neutral-border)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        boxShadow: "0 6px 16px rgba(193, 83, 4, 0.3)",
                      }}
                    >
                      <Image
                        src="/images/n12.png"
                        alt="logo"
                        width={36}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-black tracking-wide"
                        style={{ color: "var(--cv-primary)" }}
                      >
                        #VidyaHaiTohSuccessHai
                      </p>
                      <p
                        className="text-[11px] font-semibold"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        Student's Trusted Guidance Platform
                      </p>
                    </div>
                  </div>

                  {/* Trust Ribbons */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {[
                      { icon: <CheckCircle2 size={12} />, label: "No-Cost EMI" },
                      { icon: "🎓", label: "Govt-Approved" },
                      { icon: "💼", label: "100% Placement" },
                    ].map((chip, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                          border: "1px solid var(--cv-primary-light)",
                        }}
                      >
                        {chip.icon}
                        {chip.label}
                      </span>
                    ))}
                  </div>

                  <form className="space-y-1" onSubmit={handleSubmit}>
                    <FloatingInput
                      label="Full Name*"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingInput
                        label="Email*"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <FloatingInput
                        label="Mobile*"
                        name="mobileNumber"
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingInput
                        label="State*"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      <FloatingInput
                        label="City*"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingInput
                        label="Course*"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                      />
                      <FloatingInput
                        label="Branch*"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingSelect
                        label="Gender*"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      />
                      <FloatingInput
                        type="date"
                        label="DOB*"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>

                    <FloatingInput
                      label="Coupon"
                      name="subsidyCoupon"
                      value={formData.subsidyCoupon}
                      readOnly
                      insideText="ACTIVE"
                    />
                    <FloatingInput
                      label="Full Address"
                      name="addresses"
                      value={formData.addresses}
                      onChange={handleChange}
                    />

                    {otpSent && (
                      <FloatingInput
                        label="Enter OTP"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                      />
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 mt-4 rounded-xl text-white font-black active:scale-[0.99] text-xs uppercase tracking-widest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "var(--cv-grad-cta)",
                        boxShadow: "0 8px 20px -6px rgba(193, 83, 4, 0.4)",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.background =
                            "var(--cv-grad-cta-hover)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 25px -3px rgba(193, 83, 4, 0.5)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--cv-grad-cta)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px -6px rgba(193, 83, 4, 0.4)";
                      }}
                    >
                      {loading
                        ? "Processing..."
                        : otpSent
                        ? "Verify & Register"
                        : "Send OTP To Apply"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ SUCCESS POPUP ═══════════ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(15,23,42,0.5)" }}
            onClick={() => setShowSuccessPopup(false)}
          />
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
            style={{ borderTop: "8px solid var(--cv-accent)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
              style={{
                background: "var(--cv-accent-light)",
                color: "var(--cv-accent)",
              }}
            >
              🎓
            </div>
            <h3
              className="text-2xl font-black mb-1"
              style={{ color: "var(--cv-neutral-dark)" }}
            >
              Thank You!
            </h3>
            <p
              className="text-xs leading-relaxed font-medium px-2"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              Your admission offer is applied successfully. Our corporate
              advisor will reach out within 24 hours.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationSignupPopup;