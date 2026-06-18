

// "use client";

// import { useState, useEffect } from "react";
// import { X, Zap } from "lucide-react";
// import Image from "next/image";
// import API from "@/utlis/api.js";

// /* ================= FLOATING INPUT (Sari fields rakhi hain) ================= */
// const FloatingInput = ({ label, name, type = "text", value, onChange, readOnly, insideText }) => (
//   <div className="relative w-full mb-3">
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       readOnly={readOnly}
//       className={`w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none ${
//         readOnly ? "bg-gray-100" : "bg-white"
//       }`}
//     />
//     {insideText && (
//       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-green-700">
//         {insideText}
//       </span>
//     )}
//     <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
//       {label}
//     </label>
//   </div>
// );

// const FloatingSelect = ({ label, name, value, onChange }) => (
//   <div className="relative w-full mb-3">
//     <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px]"
//     >
//       <option value="">Select</option>
//       <option>male</option>
//       <option>female</option>
//       <option>other</option>
//     </select>
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
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)} />

//           <div className={`relative w-full ${showSignup ? 'max-w-lg' : 'max-w-[360px]'} rounded-3xl shadow-2xl bg-white overflow-hidden transition-all duration-300 border-t-4 border-blue-500`}>
//             <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 cursor-pointer text-white z-20 opacity-70 hover:opacity-100">
//               <X size={24} />
//             </button>

//             {!showSignup ? (
//               /* --- VIEW 1: COMPACT OFFER CARD (WITH DUAL GRADIENTS) --- */
//               <div className="relative p-7 text-center overflow-hidden flex flex-col items-center">
                
//                 {/* Dual Gradient Overlays for Top/Bottom half color change */}
//                 <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-blue-900 to-blue-800 opacity-90"></div>
                
//                 {/* Subtle light pulse from center */}
//                 <div className="absolute -inset-10 z-0 bg-[radial-gradient(circle_at_center,_white/10,_transparent_40%)]"></div>

//                 <div className="relative z-10 w-full">
//                   <h2 className="text-[32px] font-black italic text-white uppercase italic tracking-tight leading-none">GetAdmission</h2>
//                   <p className="text-[10px] font-bold text-white/70 tracking-[0.25em] uppercase mb-8">Empowering Your Future</p>
                  
//                   <div className="flex flex-col items-center mb-8">
//                     {/* Multicolored vibrant percentage with bold weights */}
//                     <div className="flex items-baseline justify-center">
//                       <span className="text-[96px] font-black text-white leading-none tracking-tighter shadow-black">
//                         {offer.discountPercentage}
//                       </span>
//                       <div className="flex flex-col items-start ml-2">
//                          <span className="text-[36px] font-bold text-green-300/80 leading-none">%</span>
//                          <span className="text-[28px] font-bold text-red-300/90 leading-none">OFF</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Clean white button in high contrast */}
//                   <button
//                     onClick={handleGetClick}
//                     className="bg-white text-[#000080] cursor-pointer w-full max-w-[140px] py-1.5 rounded-lg text-[18px] font-black flex items-center justify-center gap-2 mx-auto shadow-2xl transition-all hover:scale-105 active:scale-95 group uppercase"
//                   >
//                     GET NOW <Zap className="fill-[#000080]" size={20} />
//                   </button>

//                   <div className="mt-8 flex items-center justify-center gap-2">
//                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
//                     <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
//                       Valid for: <span className="text-white font-mono">{hours}H {minutes}M {seconds}S</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               /* --- VIEW 2: FULL DETAIL FORM (POORI FIELDS KE SAATH - Unchanged) --- */
//               <div className="p-6 max-h-[90vh] overflow-y-auto bg-white">
//                 <div className="flex items-center gap-3 mb-5 border-b pb-4">
//                   <Image src="/images/n12.png" alt="logo" width={80} height={40} />
//                   <div>
//                     <p className="text-sm font-bold text-[#000080]">#VidyaHaiTohSuccessHai</p>
//                     <p className="text-[10px] text-gray-400 font-medium">Student's Trusted Education Guidance Platform</p>
//                   </div>
                  
//                 </div>
//   <div className="mb-4 overflow-x-auto">
//           <div className="flex min-w-max gap-2 text-[11px] font-bold text-green-700">
//             <span>✅ No-Cost EMI Available</span>|
//             <span>🎓 Govt-Approved Universities</span>|
//             <span>💼 100% Placement Assistance</span>|
//             <span>📞 Free Expert Counselling</span>
//           </div>
//         </div>
//                 <form className="space-y-1">
//                   <FloatingInput label="Full Name*" name="name" value={formData.name} onChange={handleChange} />
//                   <div className="grid grid-cols-2 gap-3">
//                     <FloatingInput label="Email*" name="email" value={formData.email} onChange={handleChange} />
//                     <FloatingInput label="Mobile*" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <FloatingInput label="State*" name="state" value={formData.state} onChange={handleChange} />
//                     <FloatingInput label="City*" name="city" value={formData.city} onChange={handleChange} />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <FloatingInput label="Course*" name="course" value={formData.course} onChange={handleChange} />
//                     <FloatingInput label="Branch*" name="branch" value={formData.branch} onChange={handleChange} />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <FloatingSelect label="Gender*" name="gender" value={formData.gender} onChange={handleChange} />
//                     <FloatingInput type="date" label="DOB*" name="dob" value={formData.dob} onChange={handleChange} />
//                   </div>
//                   <FloatingInput label="Coupon" name="subsidyCoupon" value={formData.subsidyCoupon} readOnly insideText="ACTIVE" />
//                   <FloatingInput label="Full Address" name="addresses" value={formData.addresses} onChange={handleChange} />
                  
//                   {otpSent && <FloatingInput label="Enter OTP" name="otp" value={formData.otp} onChange={handleChange} />}

//                   <button
//                     type="button"
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="w-full py-4 mt-3 rounded-xl text-white font-bold bg-[#000080] hover:bg-blue-900 transition-all shadow-lg active:scale-95"
//                   >
//                     {loading ? "Processing..." : otpSent ? "Verify & Register" : "Send OTP To Apply"}
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* TANKU WALA MESSAGE (SUCCESS POPUP - Unchanged) */}
//       {showSuccessPopup && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-10 text-center border-t-8 border-[#000080] animate-in zoom-in duration-300">
//             <div className="text-6xl mb-4">🎓</div>
//             <h3 className="text-2xl font-bold text-[#000080] mb-2">Thank You!</h3>
//             <p className="text-sm text-gray-600">Your admission offer is applied successfully. Our advisor will call you within 24 hours.</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CelebrationSignupPopup;


"use client";

import { useState, useEffect } from "react";
import { X, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import API from "@/utlis/api.js";

/* ================= FLOATING INPUT (Modern Compact UI) ================= */
const FloatingInput = ({ label, name, type = "text", value, onChange, readOnly, insideText }) => (
  <div className="relative w-full mb-4 group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium outline-none transition-all duration-200 
      ${readOnly 
        ? "bg-neutral-50 text-neutral-500 border-neutral-100 cursor-not-allowed" 
        : "bg-white text-neutral-800 focus:border-[#c15304] focus:ring-4 focus:ring-[#c15304]/10"
      }`}
    />
    {insideText && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 tracking-wider uppercase animate-pulse">
        {insideText}
      </span>
    )}
    <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-[#c15304] tracking-wide transform transition-all group-focus-within:scale-105">
      {label}
    </label>
  </div>
);

const FloatingSelect = ({ label, name, value, onChange }) => (
  <div className="relative w-full mb-4 group">
    <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-[#c15304] tracking-wide">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] font-medium text-neutral-700 outline-none transition-all duration-200 bg-white focus:border-[#c15304] focus:ring-4 focus:ring-[#c15304]/10 appearance-none cursor-pointer"
    >
      <option value="">Select</option>
      <option>male</option>
      <option>female</option>
      <option>other</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
      <svg className="fill-current h-4 w-4 transition-transform group-focus-within:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const CelebrationSignupPopup = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [offer, setOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", city: "", state: "",
    course: "", gender: "", addresses: "", branch: "", otp: "",
    dob: "", subsidyCoupon: "",
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(async () => {
      try {
        const res = await API.get("/api/v1/offer/type/offer");
        const latest = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setOffer(latest);
        setShowPopup(true);
        const seconds = Math.max(Math.floor((new Date(latest.validTill) - new Date()) / 1000), 0);
        setTimeLeft(seconds);
      } catch (err) { console.error("Offer API error", err); }
    }, 10000);
    return () => clearTimeout(timer);
  }, [mounted]);

  useEffect(() => {
    if (!showPopup || !offer || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showPopup, offer]);

  useEffect(() => {
    if (!showSuccessPopup) return;
    const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  if (!mounted || !offer) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetClick = () => {
    setShowSignup(true);
    setFormData((p) => ({
      ...p,
      subsidyCoupon: `${offer.couponCode} - ${offer.discountPercentage}%`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpSent) {
      if (!formData.otp) return alert("Enter OTP");
      try {
        setLoading(true);
        await API.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        setShowPopup(false);
        setShowSuccessPopup(true);
      } catch { alert("Invalid OTP"); } finally { setLoading(false); }
    } else {
      try {
        setLoading(true);
        await API.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        setOtpSent(true);
        alert("OTP Sent Successfully");
      } catch { alert("OTP error"); } finally { setLoading(false); }
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with strong blur */}
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-md transition-opacity" onClick={() => setShowPopup(false)} />

          <div className={`relative w-full ${showSignup ? 'max-w-4xl' : 'max-w-[400px]'} rounded-3xl shadow-[0_25px_50px_-12px_rgba(193,83,4,0.25)] bg-white overflow-hidden transition-all duration-500 ease-out border border-neutral-100`}>
            
            {/* Elegant Circle Close Button */}
            <button 
              onClick={() => setShowPopup(false)} 
              className="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 p-2 rounded-full z-30 transition-all duration-200"
            >
              <X size={16} />
            </button>

            {!showSignup ? (
              /* --- VIEW 1: PREMIUM COMPACT CARD --- */
              <div className="relative p-8 text-center overflow-hidden flex flex-col items-center min-h-[440px] justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-[#c15304]">
                
                {/* Visual Glow elements */}
                <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#c15304]/30 rounded-full filter blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-36 h-36 bg-orange-500/20 rounded-full filter blur-[50px] pointer-events-none" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  <span className="bg-white/10 text-orange-300 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
                    Limited Period Offer
                  </span>
                  
                  <h2 className="text-[36px] font-black tracking-tight text-white uppercase italic leading-none drop-shadow-lg">
                    GetAdmission
                  </h2>
                  <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase mt-1.5 mb-8">
                    Empowering Your Future
                  </p>
                  
                  <div className="flex items-baseline justify-center mb-8 bg-white/[0.03] border border-white/5 shadow-inner px-8 py-5 rounded-2xl backdrop-blur-xl w-full max-w-[280px]">
                    <span className="text-[100px] font-black text-white leading-none tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                      {offer.discountPercentage}
                    </span>
                    <div className="flex flex-col items-start ml-2">
                       <span className="text-[36px] font-black text-orange-400 leading-none">%</span>
                       <span className="text-[22px] font-black text-white/90 tracking-wide leading-none mt-1">OFF</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGetClick}
                    className="bg-white text-[#c15304] cursor-pointer w-full max-w-[200px] py-3.5 rounded-xl text-[15px] font-black flex items-center justify-center gap-2 mx-auto shadow-[0_10px_25px_-5px_rgba(193,83,4,0.4)] transition-all hover:bg-neutral-50 hover:scale-[1.03] active:scale-[0.98] group uppercase tracking-wider"
                  >
                    GET NOW <Zap className="fill-[#c15304] stroke-[#c15304] group-hover:animate-bounce" size={16} />
                  </button>

                  <div className="mt-8 flex items-center gap-2.5 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    <p className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                      Ends In: <span className="text-white font-mono font-black text-[12px] ml-1">{hours}h : {minutes}m : {seconds}s</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* --- VIEW 2: DUAL-PANEL SPLIT DESIGN FORM --- */
              <div className="flex md:flex-row flex-col max-h-[85vh] md:max-h-[620px]">
                
                {/* Left Accent Banner for visual weight */}
                <div className="hidden md:flex md:w-[35%] bg-gradient-to-br from-neutral-950 to-[#c15304] p-8 flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  <div className="relative z-10">
                    <p className="text-orange-400 font-black text-xs uppercase tracking-widest mb-2">Exclusive Access</p>
                    <h3 className="text-white font-black text-2xl leading-tight">Unlock Your Educational Journey Today.</h3>
                  </div>
                  <div className="relative z-10 border-t border-white/10 pt-4 text-white/60 text-[11px] font-medium leading-relaxed">
                    Fill the application to auto-apply your special <span className="text-white font-bold">{offer.discountPercentage}% discount</span> bundle instantly.
                  </div>
                </div>

                {/* Right Form Container */}
                <div className="w-full md:w-[65%] p-6 md:p-8 overflow-y-auto bg-white">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
                    <Image src="/images/n12.png" alt="logo" width={75} height={35} className="object-contain" />
                    <div>
                      <p className="text-sm font-black text-[#c15304] tracking-wide">#VidyaHaiTohSuccessHai</p>
                      <p className="text-[10px] text-neutral-400 font-semibold">Student's Trusted Guidance Platform</p>
                    </div>
                  </div>

                  {/* Horizontal Ribbons */}
                  <div className="mb-5 overflow-x-auto bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 scrollbar-none">
                    <div className="flex min-w-max gap-4 text-[10px] font-bold text-neutral-600 uppercase tracking-wider items-center">
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"><CheckCircle2 size={12}/> No-Cost EMI</span>
                      <span className="text-neutral-300">|</span>
                      <span>🎓 Govt-Approved</span>
                      <span className="text-neutral-300">|</span>
                      <span>💼 100% Placement assistance</span>
                    </div>
                  </div>

                  <form className="space-y-1">
                    <FloatingInput label="Full Name*" name="name" value={formData.name} onChange={handleChange} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingInput label="Email*" name="email" value={formData.email} onChange={handleChange} />
                      <FloatingInput label="Mobile*" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingInput label="State*" name="state" value={formData.state} onChange={handleChange} />
                      <FloatingInput label="City*" name="city" value={formData.city} onChange={handleChange} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingInput label="Course*" name="course" value={formData.course} onChange={handleChange} />
                      <FloatingInput label="Branch*" name="branch" value={formData.branch} onChange={handleChange} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                      <FloatingSelect label="Gender*" name="gender" value={formData.gender} onChange={handleChange} />
                      <FloatingInput type="date" label="DOB*" name="dob" value={formData.dob} onChange={handleChange} />
                    </div>
                    
                    <FloatingInput label="Coupon" name="subsidyCoupon" value={formData.subsidyCoupon} readOnly insideText="ACTIVE" />
                    <FloatingInput label="Full Address" name="addresses" value={formData.addresses} onChange={handleChange} />
                    
                    {otpSent && <FloatingInput label="Enter OTP" name="otp" value={formData.otp} onChange={handleChange} />}

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 mt-4 rounded-xl text-white font-black bg-[#c15304] hover:bg-[#a04403] transition-all shadow-[0_8px_20px_-6px_rgba(193,83,4,0.4)] hover:shadow-[0_8px_25px_-3px_rgba(193,83,4,0.5)] active:scale-[0.99] text-xs uppercase tracking-widest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : otpSent ? "Verify & Register" : "Send OTP To Apply"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS POPUP (Clean Minimalist Aesthetics) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border-t-8 border-[#c15304] transition-all transform scale-100">
            <div className="w-16 h-16 bg-orange-50 text-[#c15304] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">🎓</div>
            <h3 className="text-2xl font-black text-neutral-900 mb-1">Thank You!</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium px-2">Your admission offer is applied successfully. Our corporate advisor will reach out within 24 hours.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationSignupPopup;