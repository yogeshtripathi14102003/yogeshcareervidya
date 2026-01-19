"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api";
import { useRouter } from "next/navigation"; // Dashboard redirect ke liye

const AuthModal = ({ onClose, universityName }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Update description if universityName changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, description: universityName || "" }));
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
          purpose: "register"
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
          purpose: "register"
        });
        alert("Registration successful!");
        onClose?.();
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
        onClose?.();
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

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-[700px] overflow-hidden relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold z-10"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 flex items-center">
          <div className="w-1/4">
             <img src="/images/n12.png" alt="Career Vidya" className="max-h-12 w-auto" />
          </div>
          <div className="w-2/4 text-center">
             <h2 className="text-[#05347f] font-bold text-lg leading-tight">#VidyaHaiTohSuccessHai</h2>
             <p className="text-gray-500 text-[10px] md:text-xs">Students’ most trusted guide for education</p>
          </div>
          <div className="w-1/4"></div>
        </div>

        {/* USP SECTION */}
        <div className="bg-white border-b border-gray-100 p-3">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] md:text-[13px] font-semibold text-green-700">
                <div className="flex items-center gap-1"><span>✅</span> <span>No-Cost EMI Available</span></div>
                <div className="h-4 w-[1px] bg-green-300 hidden md:block"></div>
                <div className="flex items-center gap-1"><span>🎓</span> <span>Govt-Approved Universities</span></div>
                <div className="h-4 w-[1px] bg-green-300 hidden md:block"></div>
                <div className="flex items-center gap-1"><span>💼</span> <span>EMI Facility | Loan Facility</span></div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => switchTab("signup")}
            className={`flex-1 p-4 font-bold text-center transition ${
              activeTab === "signup" ? "text-[#05347f] border-b-2 border-[#05347f]" : "text-gray-400"
            }`}
          >
            SIGNUP
          </button>
          <button
            onClick={() => switchTab("login")}
            className={`flex-1 p-4 font-bold text-center transition ${
              activeTab === "login" ? "text-[#05347f] border-b-2 border-[#05347f]" : "text-gray-400"
            }`}
          >
            LOGIN
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {activeTab === "signup" ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <input type="text" name="name" placeholder="Name" className="inputBox" onChange={handleChange} required />
              <div className="flex space-x-3">
                <select name="gender" className="inputBox flex-1" onChange={handleChange} value={formData.gender}>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  name="description"
                  placeholder="Short Description"
                  className="inputBox flex-1 bg-gray-50 cursor-not-allowed"
                  value={formData.description}
                  readOnly
                />
              </div>

              <div className="relative">
                <div className="flex space-x-2 items-center">
                  <span className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">+91</span>
                  <input type="tel" name="mobileNumber" placeholder="Mobile Number" className="inputBox flex-1" onChange={handleChange} required />
                </div>
                <span className="absolute right-1/26 -translate-x-1/2 -bottom-2 bg-white px-3 py-[0px] text-xs text-green-600 border border-green-400 rounded-full z-10">✔ We Do Not Spam</span>
              </div>

              <div className="relative">
                <input type="email" name="email" placeholder="Email" className="inputBox" onChange={handleChange} required />
                <span className="absolute right-1/26 -translate-x-1/2 -bottom-2 bg-white px-3 py-[0px] text-xs text-green-600 border border-green-400 rounded-full z-10">✔ We Do Not Spam</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="course" placeholder="Course" className="inputBox" onChange={handleChange} />
                <input type="text" name="branch" placeholder="Branch" className="inputBox" onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="state" placeholder="State" className="inputBox" onChange={handleChange} />
                <input type="text" name="city" placeholder="City" className="inputBox" onChange={handleChange} />
              </div>

              <textarea name="addresses" placeholder="Address" className="inputBox h-20" onChange={handleChange}></textarea>

              {otpSent && (
                <input type="text" name="otp" placeholder="Enter OTP" className="inputBox border-2 border-[#1E90FF] text-center font-bold tracking-widest" onChange={handleChange} required />
              )}

              <button type="submit" disabled={loading} className="w-full p-3 rounded-md font-bold text-white bg-[#bf5004]">
                {loading ? "Processing..." : !otpSent ? "SEND OTP" : "VERIFY & REGISTER"}
              </button>
              <p className="text-center text-[12px] mt-2">Already have an account? <span className="text-blue-600 font-bold cursor-pointer" onClick={() => switchTab("login")}>Login</span></p>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleLoginVerifyOtp : handleLoginSendOtp} className="space-y-4 py-4">
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  placeholder="Email or Phone"
                  className="inputBox"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                />
                {!otpSent && (
                  <span className="absolute right-1/26 -translate-x-1/2 -bottom-2 bg-white px-3 py-[0px] text-xs text-green-600 border border-green-400 rounded-full">✔ We Do Not Spam</span>
                )}
              </div>

              {otpSent && (
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    className="inputBox border-2 border-[#1E90FF] text-center font-bold"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full p-3 rounded-md font-bold text-white bg-[#bf5004]">
                {loading ? "Processing..." : otpSent ? "VERIFY & LOGIN" : "SEND OTP"}
              </button>

              <p className="text-center font-bold text-[14px] mt-2">
                Don’t have an account? <span className="text-blue-600 font-bold cursor-pointer" onClick={() => switchTab("signup")}>Create Account</span>
              </p>
            </form>
          )}

          <p className="bg-green-50 text-center text-[10px] text-gray-400 mt-6 py-1 uppercase tracking-wider rounded">Secure SSL Encryption Enabled</p>
        </div>
      </div>

      <style jsx>{`
        .inputBox { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; outline: none; font-size: 14px; }
        .inputBox:focus { border-color: rgba(255, 146, 30, 1); box-shadow: 0 0 0 2px rgba(189, 116, 6, 0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AuthModal;



// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import api from "@/utlis/api";
// import { X, ChevronDown, ShieldCheck, User, Smartphone, Mail } from "lucide-react";

// const AuthModal = ({ onClose }) => {
//   const [activeTab, setActiveTab] = useState("signup"); 
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "", mobileNumber: "", email: "", otp: "",
//     city: "", state: "", course: "", gender: "",
//     addresses: "", branch: "", offerId: "", dob: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateSignup = () => {
//     const required = ["name", "mobileNumber", "email", "city", "state", "course", "gender", "addresses", "branch", "dob"];
//     for (let f of required) if (!formData[f]) { alert(`Please fill ${f}`); return false; }
//     return true;
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (!otpSent) {
//       if (!validateSignup()) return;
//       setLoading(true);
//       try {
//         await api.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
//         setOtpSent(true);
//         alert("OTP Sent!");
//       } catch (err) { alert("Error sending OTP"); }
//       finally { setLoading(false); }
//     } else {
//       setLoading(true);
//       try {
//         await api.post("/api/v1/verify-otp", { ...formData, purpose: "register" });
//         alert("Account Created!");
//         onClose();
//       } catch (err) { alert("Invalid OTP"); }
//       finally { setLoading(false); }
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!formData.email && !formData.mobileNumber) return alert("Enter Email or Phone");
//     setLoading(true);
//     try {
//       await api.post("/api/v1/login", { emailOrPhone: formData.email || formData.mobileNumber });
//       alert("Login logic triggered");
//       onClose();
//     } catch (err) { alert("Login Failed"); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="fixed inset-0  flex justify-center items-center z-[999] p-4 backdrop-blur-sm" onClick={onClose}>
//       <div 
//         className="bg-[#2a2a2a] rounded-lg shadow-2xl w-full max-w-[950px] overflow-hidden border border-white/5 animate-scaleIn relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#252525]">
//           <h2 className="text-2xl font-bold text-white tracking-tight uppercase">
//             {activeTab === "signup" ? (
//               <>Create <span className="text-orange-500">A</span>ccount</>
//             ) : (
//               <>User <span className="text-orange-500">L</span>ogin</>
//             )}
//           </h2>
//           <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1.5 transition-all active:scale-90">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-8 overflow-y-auto max-h-[80vh]">
//           {activeTab === "signup" ? (
//             /* --- SIGNUP FORM --- */
//             <form onSubmit={handleSignup} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="quote-input" />
//                 <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="quote-input" />
//                 <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Phone number" className="quote-input" />
//                 <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="quote-input" />
//                 <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="quote-input" />
//                 <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="quote-input text-gray-400" />
//                 <div className="relative">
//                   <select name="gender" value={formData.gender} onChange={handleChange} className="quote-input appearance-none">
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
//                 </div>
//                 <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" className="quote-input" />
//                 <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Target Course" className="quote-input" />
//                 <input type="text" name="offerId" value={formData.offerId} onChange={handleChange} placeholder="Offer ID (Optional)" className="quote-input" />
//               </div>
//               <textarea name="addresses" value={formData.addresses} onChange={handleChange} placeholder="Full Address" rows={2} className="quote-input resize-none" />

//               {otpSent && (
//                 <div className="animate-slideUp bg-orange-500/10 p-4 rounded-lg border border-orange-500/30">
//                   <div className="flex items-center gap-2 text-orange-500 mb-2 font-bold text-xs uppercase">
//                     <ShieldCheck size={16} /> Enter OTP
//                   </div>
//                   <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="••••••" className="quote-input text-center tracking-[10px] font-bold text-xl border-orange-500" />
//                 </div>
//               )}

//               <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3.5 rounded-md font-bold uppercase w-full md:w-auto transition-all shadow-lg shadow-orange-900/20">
//                 {loading ? "Processing..." : otpSent ? "Complete Signup" : "Send OTP"}
//               </button>

//               <p className="text-gray-500 text-[10px] font-bold text-center pt-4 uppercase tracking-widest">
//                 ALREADY A MEMBER? <button type="button" onClick={() => setActiveTab("login")} className="text-orange-500 hover:underline">LOGIN NOW</button>
//               </p>
//             </form>
//           ) : (
//             /* --- LOGIN FORM --- */
//             <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-6 py-10">
//               <div className="space-y-4">
//                 <div className="relative">
//                   {/* <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} /> */}
//                   <input type="text" name="email" placeholder="Email or Mobile Number" className="quote-input pl-12" onChange={handleChange} required />
//                 </div>
//               </div>

//               <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-md font-bold uppercase tracking-widest text-sm w-full transition-all shadow-lg shadow-orange-900/20">
//                 {loading ? "Logging in..." : "Login"}
//               </button>

//               <p className="text-gray-500 text-[10px] font-bold text-center uppercase tracking-widest">
//                 NEW USER? <button type="button" onClick={() => setActiveTab("signup")} className="text-orange-500 hover:underline">CREATE ACCOUNT</button>
//               </p>
//             </form>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         .quote-input {
//           width: 100%; background-color: #383838; border: 1px solid #4a4a4a; border-radius: 6px;
//           padding: 12px 16px; color: white; font-size: 14px; outline: none; transition: all 0.2s;
//         }
//         .quote-input:focus { border-color: #f97316; background-color: #404040; }
//         @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//         .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
//         @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-slideUp { animation: slideUp 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// export default AuthModal;