"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utlis/api";
import { Sparkles, GraduationCap, CheckCircle2 } from "lucide-react";

// --- Form Component (Connected to API) ---
const SignUpFormCU = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    course: "Online MBA",
    gender: "",
    addresses: "",
    branch: "Management",
  });

  useEffect(() => setIsMounted(true), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.mobileNumber || !formData.name) {
      return alert("Please fill Name, Email and Mobile Number first.");
    }
    try {
      setLoading(true);
      const payload = { 
        emailOrPhone: formData.email || formData.mobileNumber, 
        purpose: "register" 
      };
      await api.post("/api/v1/send-otp", payload);
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Please enter the OTP.");
    try {
      setLoading(true);
      const payload = { 
        ...formData, 
        emailOrPhone: formData.email || formData.mobileNumber, 
        purpose: "register" 
      };
      await api.post("/api/v1/verify-otp", payload);
      alert("Registration successful! Welcome to Career Vidya.");
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid OTP or Registration Failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white/95 backdrop-blur-lg p-5 md:p-6 rounded-2xl shadow-2xl w-full max-w-md border border-[#D50000]/20 relative overflow-hidden">
      {/* 🎉 Happy New Year Small Badge */}
      <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[9px] font-bold px-2 py-1 rotate-12 shadow-md animate-bounce z-20">
        HAPPY NEW YEAR 2026! 🎊
      </div>

      <h2 className="text-lg md:text-xl font-bold text-[#D50000] mb-4 text-center uppercase tracking-tight">
        Apply for Online MBA
      </h2>

      <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="inputField"
          required
        />

        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            className="inputField w-1/2"
            required
          />
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="inputField w-1/2"
            required
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="inputField w-1/2"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="inputField w-1/2"
            required
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            name="course"
            value={formData.course}
            readOnly
            className="inputField w-1/2 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="inputField w-1/2 cursor-pointer"
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <input
          type="text"
          name="addresses"
          placeholder="Address"
          value={formData.addresses}
          onChange={handleChange}
          className="inputField"
          required
        />

        {otpSent && (
          <div className="animate-in slide-in-from-top duration-300">
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-Digit OTP"
              value={formData.otp}
              onChange={handleChange}
              className="inputField border-green-500 bg-green-50 font-bold tracking-[0.5em] text-center"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg text-white font-bold transition-all shadow-md active:scale-95 flex justify-center items-center gap-2 ${
            !otpSent ? "bg-[#D50000] hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          } disabled:opacity-50 text-sm`}
        >
          {loading ? "Please wait..." : !otpSent ? "SEND OTP" : "VERIFY & APPLY NOW"}
          {!loading && <Sparkles className="w-4 h-4" />}
        </button>
      </form>

      <p className="mt-3 text-center text-gray-500 text-[11px]">
        Already registered?{" "}
        <Link href="/login" className="text-[#D50000] font-bold underline">
          Login here
        </Link>
      </p>

      <style jsx>{`
        .inputField {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        .inputField:focus {
          border-color: #D50000;
          box-shadow: 0 0 0 3px rgba(213, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

// --- Main Page Section (Compact Height & White Logo BG) ---
export default function OnlineMBAPannerCU({ image = "/images/cu_building.jpg" }) {
  const backgroundStyle = { backgroundImage: `url(${image})` };

  return (
    <div className="relative w-full min-h-[50vh] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={backgroundStyle} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#D50000]/90 via-[#D50000]/30 to-black/80"></div>

      {/* New Year Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-5 left-10 text-white animate-pulse">✨</div>
        <div className="absolute bottom-10 right-1/4 text-white animate-bounce">🎊</div>
        <div className="absolute top-1/2 left-5 text-white animate-pulse">⭐</div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 max-w-7xl w-full items-center px-6 py-6">
        
        {/* Left Side: Content */}
        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-3 border border-white/20">
            <GraduationCap className="text-yellow-400 w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">UGC Approved Program</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 leading-tight">
            Master of <span className="text-yellow-400">Business</span> Administration
          </h1>
          <h2 className="text-lg md:text-2xl font-light opacity-90 mb-6 border-l-4 border-yellow-400 pl-4">
            Chandigarh University Online
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-6">
            {[
              "100% Online Mode",
              "No Cost EMI Options",
              "Placement Assistance",
              "Global Curriculum"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="text-green-400 w-4 h-4 shrink-0" />
                <span className="font-semibold text-sm md:text-base whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>

          {/* Accreditation Logos with White Background */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
              <img src="/images/n2.png" alt="QS Ranking" className="h-7 md:h-10 object-contain" />
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
              <img src="/images/n3.png" alt="UGC Approved" className="h-7 md:h-10 object-contain" />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex justify-center lg:justify-end">
          <SignUpFormCU />
        </div>
      </div>
    </div>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import api from "@/utlis/api";
// import { Sparkles, GraduationCap, CheckCircle2 } from "lucide-react";

// // --- Form Component ---
// const SignUpFormCU = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     otp: "",
//     city: "",
//     state: "",
//     course: "Online MBA",
//     gender: "",
//     addresses: "",
//     branch: "Management",
//   });

//   useEffect(() => setIsMounted(true), []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.email || !formData.mobileNumber || !formData.name) {
//       return alert("Please fill Name, Email and Mobile Number first.");
//     }
//     try {
//       setLoading(true);
//       const payload = { 
//         emailOrPhone: formData.email || formData.mobileNumber, 
//         purpose: "register" 
//       };
//       await api.post("/api/v1/send-otp", payload);
//       alert("OTP sent successfully!");
//       setOtpSent(true);
//     } catch (error) {
//       alert(error?.response?.data?.message || "Failed to send OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) return alert("Please enter the OTP.");
//     try {
//       setLoading(true);
//       const payload = { 
//         ...formData, 
//         emailOrPhone: formData.email || formData.mobileNumber, 
//         purpose: "register" 
//       };
//       await api.post("/api/v1/verify-otp", payload);
//       alert("Registration successful! Welcome to Career Vidya.");
//     } catch (error) {
//       alert(error?.response?.data?.message || "Invalid OTP or Registration Failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isMounted) return null;

//   return (
//     <div className="bg-white p-5 md:p-7 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
//       <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[9px] font-bold px-2 py-1 rotate-12 shadow-sm animate-bounce z-20">
//         HAPPY NEW YEAR 2026! 🎊
//       </div>

//       <h2 className="text-lg md:text-xl font-bold text-[#D50000] mb-5 text-center uppercase tracking-tight">
//         Apply for Online MBA
//       </h2>

//       <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3">
//         <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="inputField" required />
        
//         <div className="flex gap-2">
//           <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} className="inputField w-1/2" required />
//           <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="inputField w-1/2" required />
//         </div>

//         <div className="flex gap-2">
//           <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="inputField w-1/2" required />
//           <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="inputField w-1/2" required />
//         </div>

//         <div className="flex gap-2">
//           <input type="text" name="course" value={formData.course} readOnly className="inputField w-1/2 bg-gray-50 text-gray-500" />
//           <select name="gender" value={formData.gender} onChange={handleChange} className="inputField w-1/2" required>
//             <option value="">Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         <input type="text" name="addresses" placeholder="Address" value={formData.addresses} onChange={handleChange} className="inputField" required />

//         {otpSent && (
//           <div className="animate-in slide-in-from-top duration-300">
//             <input type="text" name="otp" placeholder="Enter 6-Digit OTP" value={formData.otp} onChange={handleChange} className="inputField border-green-500 bg-green-50 font-bold tracking-[0.5em] text-center" required />
//           </div>
//         )}

//         <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-bold transition-all shadow-md active:scale-95 flex justify-center items-center gap-2 ${!otpSent ? "bg-[#D50000] hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} disabled:opacity-50 text-sm tracking-wider`}>
//           {loading ? "Processing..." : !otpSent ? "SEND OTP" : "VERIFY & APPLY NOW"}
//           {!loading && <Sparkles className="w-4 h-4" />}
//         </button>
//       </form>

//       <p className="mt-4 text-center text-gray-400 text-[11px]">
//         Already registered? <Link href="/login" className="text-[#D50000] font-bold underline">Login here</Link>
//       </p>

//       <style jsx>{`
//         .inputField {
//           width: 100%;
//           padding: 10px 12px;
//           border: 1px solid #e5e7eb;
//           border-radius: 8px;
//           outline: none;
//           font-size: 13px;
//           transition: border 0.2s;
//         }
//         .inputField:focus {
//           border-color: #D50000;
//         }
//       `}</style>
//     </div>
//   );
// };

// // --- Main Banner Section ---
// export default function OnlineMBAPannerCU({ image = "/images/cu_building.jpg" }) {
//   const backgroundStyle = { backgroundImage: `url(${image})` };

//   return (
//     <div className="relative w-full min-h-[50vh] flex items-center justify-center bg-white overflow-hidden">
//       <div className="absolute inset-0 bg-cover bg-center opacity-10" style={backgroundStyle} />
//       <div className="absolute inset-0 bg-gradient-to-r from-red-500/90 via-white to-gray-200/50"></div>

//       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 max-w-7xl w-full items-center px-6 py-8">
        
//         {/* Left Side */}
//         <div className="text-gray-900">
//           <div className="inline-flex items-center gap-2 bg-white/80 shadow-sm px-3 py-1 rounded-full mb-4 border border-red-100">
//             <GraduationCap className="text-[#D50000] w-4 h-4" />
//             <span className="text-[10px] font-bold text-[#D50000] tracking-widest uppercase">UGC Approved</span>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-black mb-1 leading-tight text-[#D50000]">
//             Online MBA
//           </h1>
//           <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-6">
//             Chandigarh University
//           </h2>

//           <div className="space-y-3 mb-8">
//             <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg inline-block border border-red-50">
//                <span className="text-sm font-bold text-gray-800">🎓 Enroll now for CU Online MBA — <Link href="/contact" className="underline hover:text-red-600">Contact us</Link> for details.</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="text-[#D50000] w-5 h-5" />
//               <span className="font-semibold text-gray-700">100% Online, 100% Career-Focused</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="text-[#D50000] w-5 h-5" />
//               <span className="font-semibold text-gray-700">No Cost EMI Options Available</span>
//             </div>
//           </div>

//           {/* Accreditation Logos with WHITE Background */}
//           <div className="flex flex-wrap gap-4 mt-6">
//             <div className="bg-white shadow-md border border-gray-200 rounded-lg p-2.5 flex items-center justify-center">
//               <img src="/images/n3.png" alt="UGC Approved" className="h-10 md:h-12 object-contain" />
//             </div>
//             <div className="bg-white shadow-md border border-gray-200 rounded-lg p-2.5 flex items-center justify-center">
//               <img src="/images/n1.png" alt="Harvard Business Publishing" className="h-10 md:h-12 object-contain" />
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex justify-center lg:justify-end">
//           <SignUpFormCU />
//         </div>
//       </div>
//     </div>
//   );
// }