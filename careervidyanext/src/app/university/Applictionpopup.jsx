// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import api from "@/utlis/api";
// import { useRouter } from "next/navigation"; // Dashboard redirect ke liye

// const AuthModal = ({ onClose, universityName }) => {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("signup");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     otp: "",
//     city: "",
//     state: "",
//     course: "",
//     gender: "",
//     branch: "",
//     addresses: "",
//     description: universityName || "", // auto-fill university name
//   });

//   // Update description if universityName changes
//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, description: universityName || "" }));
//   }, [universityName]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateSignup = () => {
//     const required = ["name", "mobileNumber", "email", "city", "state", "course", "gender"];
//     for (let f of required) {
//       if (!formData[f]) {
//         alert(`⚠ Please fill the "${f}" field.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   // --- SIGNUP LOGIC ---
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (!otpSent) {
//       if (!validateSignup()) return;
//       setLoading(true);
//       try {
//         await api.post("/api/v1/send-otp", {
//           emailOrPhone: formData.email || formData.mobileNumber,
//           purpose: "register",
//         });
//         alert("OTP sent successfully!");
//         setOtpSent(true);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to send OTP.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setLoading(true);
//       try {
//         await api.post("/api/v1/verify-otp", {
//           ...formData,
//           emailOrPhone: formData.email || formData.mobileNumber,
//           purpose: "register",
//         });
//         alert("Registration successful!");
//         onClose?.();
//       } catch (err) {
//         alert(err.response?.data?.message || "Invalid OTP.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // --- LOGIN LOGIC (Step 1: Send OTP) ---
//   const handleLoginSendOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.email) return alert("Enter Email or Mobile Number");

//     setLoading(true);
//     try {
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: formData.email,
//         purpose: "login",
//       });
//       alert("Login OTP sent successfully!");
//       setOtpSent(true);
//     } catch (err) {
//       alert(err.response?.data?.message || "User not found or error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- LOGIN LOGIC (Step 2: Verify & Redirect) ---
//   const handleLoginVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) return alert("Please enter OTP");

//     setLoading(true);
//     try {
//       const res = await api.post("/api/v1/verify-otp", {
//         emailOrPhone: formData.email,
//         otp: formData.otp,
//         purpose: "login",
//       });

//       alert("Login successful!");

//       // ✅ Safe redirect: first push, then close modal
//       setTimeout(() => {
//         router.push("/user"); // dashboard
//         onClose?.();
//       }, 100);
//     } catch (err) {
//       alert("Invalid OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tab change
//   const switchTab = (tab) => {
//     setActiveTab(tab);
//     setOtpSent(false);
//     setFormData({ ...formData, otp: "" });
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-3"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg shadow-2xl w-full max-w-[480px] overflow-hidden relative animate-fadeIn"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-gray-400 hover:text-gray-800 text-xl font-bold z-10"
//         >
//           ✕
//         </button>

//         {/* HEADER */}
//         <div className="p-2.5 border-b border-gray-100 flex items-center">
//           <div className="w-1/4">
//             <Image
//               src="/images/n12.png"
//               alt="Career Vidya"
//               width={4500}
//               height={4500}
//               className="max-h-8 w-auto object-contain"
//             />
//           </div>
//           <div className="w-2/4 text-center">
//             <h2 className="text-[#05347f] font-bold text-sm leading-tight">
//               #VidyaHaiTohSuccessHai
//             </h2>
//             <p className="text-gray-500 text-[9px] md:text-[10px]">
//               Students’ most trusted guide for education
//             </p>
//           </div>
//           <div className="w-1/4"></div>
//         </div>

//         {/* USP SECTION */}
//         <div className="bg-white border-b border-gray-100 py-1.5 px-2">
//           <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 text-[9px] md:text-[11px] font-semibold text-green-700">
//             <div className="flex items-center gap-1">
//               <span>✅</span> <span>No-Cost EMI Available</span>
//             </div>
//             <div className="h-3 w-[1px] bg-green-300 hidden md:block"></div>
//             <div className="flex items-center gap-1">
//               <span>🎓</span> <span>Govt-Approved Universities</span>
//             </div>
//             <div className="h-3 w-[1px] bg-green-300 hidden md:block"></div>
//             <div className="flex items-center gap-1">
//               <span>💼</span> <span>EMI Facility | Loan Facility</span>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b text-xs">
//           <button
//             onClick={() => switchTab("signup")}
//             className={`flex-1 py-2 font-bold text-center transition ${
//               activeTab === "signup"
//                 ? "text-[#05347f] border-b-2 border-[#05347f]"
//                 : "text-gray-400"
//             }`}
//           >
//             SIGNUP
//           </button>
//           <button
//             onClick={() => switchTab("login")}
//             className={`flex-1 py-2 font-bold text-center transition ${
//               activeTab === "login"
//                 ? "text-[#05347f] border-b-2 border-[#05347f]"
//                 : "text-gray-400"
//             }`}
//           >
//             LOGIN
//           </button>
//         </div>

//         {/* FORM */}
//         <div className="p-3.5 max-h-[75vh] overflow-y-auto no-scrollbar">
//           {activeTab === "signup" ? (
//             <form onSubmit={handleSignup} className="space-y-2.5">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 className="inputBox"
//                 onChange={handleChange}
//                 required
//               />
//               <div className="flex space-x-2">
//                 <select
//                   name="gender"
//                   className="inputBox flex-1"
//                   onChange={handleChange}
//                   value={formData.gender}
//                 >
//                   <option value="">Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>

//                 <input
//                   type="text"
//                   name="description"
//                   placeholder="Short Description"
//                   className="inputBox flex-1 bg-gray-50 cursor-not-allowed"
//                   value={formData.description}
//                   readOnly
//                 />
//               </div>

//               <div className="relative">
//                 <div className="flex space-x-1.5 items-center">
//                   <span className="p-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-xs">
//                     +91
//                   </span>
//                   <input
//                     type="tel"
//                     name="mobileNumber"
//                     placeholder="Mobile Number"
//                     className="inputBox flex-1"
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <span className="absolute right-3 -bottom-1.5 bg-white px-1.5 text-[9px] text-green-600 border border-green-400 rounded-full z-10 leading-tight">
//                   ✔ We Do Not Spam
//                 </span>
//               </div>

//               <div className="relative">
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   className="inputBox"
//                   onChange={handleChange}
//                   required
//                 />
//                 <span className="absolute right-3 -bottom-1.5 bg-white px-1.5 text-[9px] text-green-600 border border-green-400 rounded-full z-10 leading-tight">
//                   ✔ We Do Not Spam
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   type="text"
//                   name="course"
//                   placeholder="Course"
//                   className="inputBox"
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="text"
//                   name="branch"
//                   placeholder="Branch"
//                   className="inputBox"
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   className="inputBox"
//                   onChange={handleChange}
//                 />
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   className="inputBox"
//                   onChange={handleChange}
//                 />
//               </div>

//               <textarea
//                 name="addresses"
//                 placeholder="Address"
//                 className="inputBox h-12 resize-none"
//                 onChange={handleChange}
//               ></textarea>

//               {otpSent && (
//                 <input
//                   type="text"
//                   name="otp"
//                   placeholder="Enter OTP"
//                   className="inputBox border-2 border-[#1E90FF] text-center font-bold tracking-widest"
//                   onChange={handleChange}
//                   required
//                 />
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 rounded-md font-bold text-white bg-[#bf5004] text-xs transition-opacity hover:opacity-90"
//               >
//                 {loading
//                   ? "Processing..."
//                   : !otpSent
//                   ? "SEND OTP"
//                   : "VERIFY & REGISTER"}
//               </button>
//               <p className="text-center text-[11px] mt-1">
//                 Already have an account?{" "}
//                 <span
//                   className="text-blue-600 font-bold cursor-pointer"
//                   onClick={() => switchTab("login")}
//                 >
//                   Login
//                 </span>
//               </p>
//             </form>
//           ) : (
//             <form
//               onSubmit={otpSent ? handleLoginVerifyOtp : handleLoginSendOtp}
//               className="space-y-3 py-2"
//             >
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="email"
//                   placeholder="Email or Phone"
//                   className="inputBox"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={otpSent}
//                 />
//                 {!otpSent && (
//                   <span className="absolute right-3 -bottom-1.5 bg-white px-1.5 text-[9px] text-green-600 border border-green-400 rounded-full leading-tight">
//                     ✔ We Do Not Spam
//                   </span>
//                 )}
//               </div>

//               {otpSent && (
//                 <div className="relative">
//                   <input
//                     type="text"
//                     name="otp"
//                     placeholder="Enter 6-digit OTP"
//                     className="inputBox border-2 border-[#1E90FF] text-center font-bold"
//                     value={formData.otp}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 rounded-md font-bold text-white bg-[#bf5004] text-xs transition-opacity hover:opacity-90"
//               >
//                 {loading
//                   ? "Processing..."
//                   : otpSent
//                   ? "VERIFY & LOGIN"
//                   : "SEND OTP"}
//               </button>

//               <p className="text-center font-bold text-[12px] mt-1">
//                 Don’t have an account?{" "}
//                 <span
//                   className="text-blue-600 font-bold cursor-pointer"
//                   onClick={() => switchTab("signup")}
//                 >
//                   Create Account
//                 </span>
//               </p>
//             </form>
//           )}

//           <p className="bg-green-50 text-center text-[9px] text-gray-400 mt-3 py-1 uppercase tracking-wider rounded">
//             Secure SSL Encryption Enabled
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         .inputBox {
//           width: 100%;
//           padding: 7px 10px;
//           border: 1px solid #ddd;
//           border-radius: 6px;
//           outline: none;
//           font-size: 12px;
//         }
//         .inputBox:focus {
//           border-color: rgba(255, 146, 30, 1);
//           box-shadow: 0 0 0 2px rgba(189, 116, 6, 0.1);
//         }
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.96);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AuthModal;

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { useRouter } from "next/navigation"; // Dashboard redirect ke liye
import { X, ArrowRight, Lock, ShieldCheck, ChevronDown, Check, GraduationCap } from "lucide-react";

/* ═══════════════ ANIMATION SETTINGS ═══════════════ */
const ANIM_MS = 250;
const ZOOM_SCALE = 1.15; // popup zoom
const PAGE_ZOOM = 1.06; // full-screen layer zoom

/* ═══════════════ SHARED STYLES ═══════════════ */
const fieldStyle = {
  border: "1px solid var(--cv-neutral-border, #e3e8eb)",
  background: "var(--cv-surface, #ffffff)",
  color: "var(--cv-neutral-dark, #1f2a30)",
  colorScheme: "light dark",
};

const labelStyle = {
  background: "var(--cv-surface, #ffffff)",
  color: "var(--cv-primary, #51636e)",
};

const fieldClass =
  "w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 placeholder:opacity-50";

const ctaStyle = {
  background: "var(--cv-grad-cta, linear-gradient(180deg, #e0701a, #c15304))",
  color: "#fff",
  boxShadow: "0 8px 20px rgba(193, 83, 4, 0.3)",
};

const mutedText = { color: "var(--cv-neutral-mid, #5b6b75)" };

const BENEFITS = ["No-Cost EMI", "Govt-Approved Universities", "Loan Facility"];

/* ═══════════════ FLOATING INPUT ═══════════════ */
const Field = ({ label, children }) => (
  <div className="relative w-full">
    <label
      className="absolute -top-2 left-3 px-1.5 text-[11px] font-semibold z-10 rounded"
      style={labelStyle}
    >
      {label}
    </label>
    {children}
  </div>
);

const NoSpam = () => (
  <span
    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap"
    style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
  >
    <Check className="w-3 h-3" aria-hidden="true" />
    No spam
  </span>
);

/* ═══════════════ MAIN MODAL ═══════════════ */
const AuthModal = ({ onClose, universityName }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ===== ANIMATION STATE ===== */
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    course: "",
    gender: "",
    branch: "",
    addresses: "",
    description: universityName || "", // auto-fill university name
  });

  /* ===== OPEN ANIMATION ===== */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ===== CLOSE ANIMATION ===== */
  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, ANIM_MS);
  };

  /* ===== ESC KEY ===== */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosing]);

  // Update description if universityName changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, description: universityName || "" }));
  }, [universityName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSignup = () => {
    const required = ["name", "mobileNumber", "email", "city", "state", "course", "gender"];
    for (let f of required) {
      if (!formData[f]) {
        alert(`⚠ Please fill the "${f}" field.`);
        return false;
      }
    }
    return true;
  };

  // --- SIGNUP LOGIC ---
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!validateSignup()) return;
      setLoading(true);
      try {
        await api.post("/api/v1/send-otp", {
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        alert("OTP sent successfully!");
        setOtpSent(true);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to send OTP.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await api.post("/api/v1/verify-otp", {
          ...formData,
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        alert("Registration successful!");
        handleClose();
      } catch (err) {
        alert(err.response?.data?.message || "Invalid OTP.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- LOGIN LOGIC (Step 1: Send OTP) ---
  const handleLoginSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) return alert("Enter Email or Mobile Number");

    setLoading(true);
    try {
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email,
        purpose: "login",
      });
      alert("Login OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "User not found or error.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN LOGIC (Step 2: Verify & Redirect) ---
  const handleLoginVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Please enter OTP");

    setLoading(true);
    try {
      const res = await api.post("/api/v1/verify-otp", {
        emailOrPhone: formData.email,
        otp: formData.otp,
        purpose: "login",
      });

      alert("Login successful!");

      // ✅ Safe redirect: first push, then close modal
      setTimeout(() => {
        router.push("/user"); // dashboard
        handleClose();
      }, 100);
    } catch (err) {
      alert("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Tab change
  const switchTab = (tab) => {
    setActiveTab(tab);
    setOtpSent(false);
    setFormData({ ...formData, otp: "" });
  };

  /* ═══════════ RENDER ═══════════ */
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-3"
      style={{
        background: isVisible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        transform: isVisible ? "scale(1)" : `scale(${PAGE_ZOOM})`,
        backdropFilter: isVisible ? "blur(4px)" : "blur(0px)",
        WebkitBackdropFilter: isVisible ? "blur(4px)" : "blur(0px)",
        transition: `background ${ANIM_MS}ms ease, transform ${ANIM_MS + 100}ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter ${ANIM_MS}ms ease, -webkit-backdrop-filter ${ANIM_MS}ms ease`,
        willChange: "transform, backdrop-filter",
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl relative overflow-hidden shadow-2xl flex flex-col"
        style={{
          maxHeight: "92vh",
          background: "var(--cv-surface, #ffffff)",
          color: "var(--cv-neutral-dark, #1f2a30)",
          transform: isVisible ? "scale(1)" : `scale(${ZOOM_SCALE})`,
          opacity: isVisible ? 1 : 0,
          transition: `transform ${ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${ANIM_MS}ms ease`,
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="cursor-pointer absolute top-3 right-3 z-30 p-1.5 rounded-full transition hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.18)",
            color: "#ffffff",
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ═══════════ HEADER ═══════════ */}
        <div
          className="relative px-5 pt-5 pb-4 overflow-hidden flex-shrink-0"
          style={{
            background:
              "radial-gradient(circle at 90% 0%, rgba(240,138,60,0.35) 0%, transparent 55%), linear-gradient(160deg, #3d4c56 0%, #26323a 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center gap-3 pr-8">
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{
                width: 52,
                height: 52,
                background: "#ffffff",
                border: "3px solid var(--cv-accent, #c15304)",
              }}
            >
              <Image
                src="/images/n12.png"
                alt="Career Vidya"
                width={32}
                height={32}
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight" style={{ color: "#ffffff" }}>
                #VidyaHaiTohSuccessHai
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: "#ffffff", opacity: 0.8 }}>
                Students’ most trusted guide for education
              </p>
            </div>
          </div>

          {/* Benefit chips */}
          <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
            {BENEFITS.map((b) => (
              <span
                key={b}
                className="flex items-center gap-1 text-[10px] font-semibold rounded-full px-2.5 py-1"
                style={{ background: "rgba(255,255,255,0.12)", color: "#ffffff" }}
              >
                <Check className="w-3 h-3" style={{ color: "#f08a3c" }} aria-hidden="true" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════ TABS ═══════════ */}
        <div className="px-5 pt-4 flex-shrink-0">
          <div
            role="tablist"
            className="grid grid-cols-2 p-1 rounded-xl"
            style={{ background: "var(--cv-neutral-light, #f5f7f8)" }}
          >
            {[
              { id: "signup", label: "Sign up" },
              { id: "login", label: "Login" },
            ].map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => switchTab(t.id)}
                  className="cursor-pointer py-2 rounded-lg text-sm font-bold transition"
                  style={
                    active
                      ? {
                          background: "var(--cv-surface, #ffffff)",
                          color: "var(--cv-accent, #c15304)",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                        }
                      : mutedText
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════ FORMS ═══════════ */}
        <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar">
          {activeTab === "signup" ? (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* University badge */}
              {formData.description && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{
                    background: "var(--cv-accent-light, #fdf0e6)",
                    color: "var(--cv-accent-dark, #8f3c03)",
                    border: "1px solid var(--cv-accent, #c15304)",
                  }}
                >
                  <GraduationCap size={15} aria-hidden="true" />
                  <span className="truncate">Applying for: {formData.description}</span>
                </div>
              )}

              <Field label="Full name">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className={fieldClass}
                  style={fieldStyle}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Mobile number">
                  <div className="flex items-stretch gap-1.5">
                    <span
                      className="flex items-center px-2.5 rounded-lg text-xs font-semibold"
                      style={{
                        ...fieldStyle,
                        background: "var(--cv-neutral-light, #f5f7f8)",
                        color: "var(--cv-neutral-mid, #5b6b75)",
                      }}
                    >
                      +91
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        name="mobileNumber"
                        inputMode="numeric"
                        placeholder="10-digit number"
                        className={`${fieldClass} pr-[72px]`}
                        style={fieldStyle}
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                      />
                      <NoSpam />
                    </div>
                  </div>
                </Field>

                <Field label="Email">
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className={`${fieldClass} pr-[72px]`}
                      style={fieldStyle}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <NoSpam />
                  </div>
                </Field>

                <Field label="Gender">
                  <select
                    name="gender"
                    className={`${fieldClass} appearance-none pr-9 cursor-pointer`}
                    style={fieldStyle}
                    onChange={handleChange}
                    value={formData.gender}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={mutedText}
                    aria-hidden="true"
                  />
                </Field>

                <Field label="University">
                  <input
                    type="text"
                    name="description"
                    placeholder="University"
                    className={`${fieldClass} cursor-not-allowed opacity-80`}
                    style={{ ...fieldStyle, background: "var(--cv-neutral-light, #f5f7f8)" }}
                    value={formData.description}
                    readOnly
                  />
                </Field>

                <Field label="Course">
                  <input
                    type="text"
                    name="course"
                    placeholder="e.g. MBA"
                    className={fieldClass}
                    style={fieldStyle}
                    value={formData.course}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="Branch">
                  <input
                    type="text"
                    name="branch"
                    placeholder="Specialization"
                    className={fieldClass}
                    style={fieldStyle}
                    value={formData.branch}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="State">
                  <input
                    type="text"
                    name="state"
                    placeholder="Your state"
                    className={fieldClass}
                    style={fieldStyle}
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Field>

                <Field label="City">
                  <input
                    type="text"
                    name="city"
                    placeholder="Your city"
                    className={fieldClass}
                    style={fieldStyle}
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              <Field label="Address">
                <textarea
                  name="addresses"
                  placeholder="Full address"
                  className={`${fieldClass} h-16 resize-none`}
                  style={fieldStyle}
                  value={formData.addresses}
                  onChange={handleChange}
                ></textarea>
              </Field>

              {otpSent && (
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background: "var(--cv-accent-light, #fdf0e6)",
                    border: "1px solid var(--cv-accent, #c15304)",
                  }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--cv-accent-dark, #8f3c03)" }}
                  >
                    We sent a code to {formData.email || formData.mobileNumber}. Enter it to finish.
                  </p>
                  <input
                    type="text"
                    name="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    className="w-full py-2.5 text-center text-xl tracking-[0.5em] font-black outline-none rounded-lg transition focus:ring-2 focus:ring-orange-500/20"
                    style={{
                      background: "var(--cv-surface, #ffffff)",
                      border: "1px solid var(--cv-neutral-border, #e3e8eb)",
                      color: "var(--cv-neutral-dark, #1f2a30)",
                    }}
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={ctaStyle}
              >
                {loading ? (
                  "Processing..."
                ) : !otpSent ? (
                  <>
                    Send OTP <ArrowRight size={15} />
                  </>
                ) : (
                  <>
                    <Lock size={14} /> Verify & register
                  </>
                )}
              </button>

              <p className="text-center text-xs" style={mutedText}>
                Already have an account?{" "}
                <button
                  type="button"
                  className="cursor-pointer font-bold hover:underline"
                  style={{ color: "var(--cv-accent, #c15304)" }}
                  onClick={() => switchTab("login")}
                >
                  Log in
                </button>
              </p>
            </form>
          ) : (
            <form
              onSubmit={otpSent ? handleLoginVerifyOtp : handleLoginSendOtp}
              className="space-y-4"
            >
              <div>
                <h1 className="text-xl font-extrabold">Welcome back</h1>
                <p className="text-xs mt-1" style={mutedText}>
                  Log in with a one-time code. No password needed.
                </p>
              </div>

              <Field label="Email or phone">
                <div className="relative">
                  <input
                    type="text"
                    name="email"
                    placeholder="you@example.com or 10-digit number"
                    className={`${fieldClass} pr-[72px] disabled:opacity-70`}
                    style={fieldStyle}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={otpSent}
                  />
                  {!otpSent && <NoSpam />}
                </div>
              </Field>

              {otpSent && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={mutedText}>
                    Enter the 6-digit code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    className="w-full py-3 text-center text-xl tracking-[0.5em] font-black outline-none rounded-lg transition focus:ring-2 focus:ring-orange-500/20"
                    style={{
                      background: "var(--cv-primary-light, #e8edf0)",
                      border: "1px solid var(--cv-neutral-border, #e3e8eb)",
                      color: "var(--cv-neutral-dark, #1f2a30)",
                    }}
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={ctaStyle}
              >
                {loading ? (
                  "Processing..."
                ) : otpSent ? (
                  <>
                    <Lock size={14} /> Verify & log in
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight size={15} />
                  </>
                )}
              </button>

              <p className="text-center text-xs" style={mutedText}>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="cursor-pointer font-bold hover:underline"
                  style={{ color: "var(--cv-accent, #c15304)" }}
                  onClick={() => switchTab("signup")}
                >
                  Create account
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer trust badge */}
        <div className="px-5 pb-4 flex-shrink-0">
          <p
            className="flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-lg"
            style={{
              color: "var(--cv-neutral-mid, #5b6b75)",
              background: "var(--cv-neutral-light, #f5f7f8)",
              border: "1px dashed var(--cv-neutral-border, #e3e8eb)",
            }}
          >
            <ShieldCheck size={13} style={{ color: "var(--cv-primary, #51636e)" }} />
            Secure SSL encryption enabled
          </p>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;