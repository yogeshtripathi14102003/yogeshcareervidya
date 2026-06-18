// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import api from "@/utlis/api";
// import { Check } from "lucide-react";

// const inputStyle =
//   "w-full p-2 border border-gray-400 rounded-md bg-white " +
//   "placeholder:text-gray-500 placeholder:font-medium " +
//   "transition-all duration-200 " +
//   "focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] " +
//   "focus:placeholder:text-transparent outline-none";

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     otp: "",
//     city: "",
//     state: "",
//     course: "",
//     branch: "", 
//     gender: "",
//     addresses: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [universities, setUniversities] = useState([]);
//   const [expanded, setExpanded] = useState(false);

//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const res = await api.get("/api/v1/university");
//         setUniversities(res.data?.data || []);
//       } catch (err) {
//         console.error("University fetch error", err);
//       }
//     };
//     fetchUniversities();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       setOtpSent(true);
//       alert("OTP sent successfully");
//     } catch {
//       alert("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await api.post("/api/v1/verify-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         otp: formData.otp,
//         purpose: "register",
//         ...formData,
//       });
//       alert("Registration successful");
//     } catch {
//       alert("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault(); 
//     if (!otpSent) handleSendOtp(e);
//     else handleVerifyOtp(e);
//   };

//   return (
//     /* md: (768px+) par horizontal (row) layout trigger hoga, jo tablet ke liye perfect hai */
//     <div className="bg-white rounded-2xl shadow-xl w-[95%] lg:w-[1100px] mx-auto my-6 border border-gray-100 flex flex-col md:flex-row overflow-hidden">

//       {/* ================= LEFT SIDE ================= */}
//       {/* Tablet (md) aur desktop (lg) dono par dikhega */}
//       <div className="hidden md:flex md:w-1/2 lg:w-1/2 p-4 lg:p-8 flex-col items-center border-r border-gray-100">
//         <div className="w-full overflow-hidden mb-6">
//           <div className="flex gap-4 animate-scroll-x">
//             {[...universities, ...universities].map((uni, i) => {
//               const imageUrl = uni.universityImage
//                 ? uni.universityImage.startsWith("http")
//                   ? uni.universityImage
//                   : `${process.env.NEXT_PUBLIC_API_URL}${uni.universityImage}`
//                 : "/fallback.png";

//               return (
//                 <div key={i} className="min-w-[80px] lg:min-w-[100px] h-[40px] lg:h-[50px] border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
//                   <div className="relative w-full h-full p-1 overflow-hidden">
//                     <Image src={imageUrl} alt={uni.name || "University"} fill className="object-contain" unoptimized />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <h2 className="text-xl lg:text-2xl font-extrabold mb-6 text-center bg-gradient-to-r from-[#05347f] to-[#1E90FF] bg-clip-text text-transparent">
//           Your Path to a Successful Career Starts with Career Vidya
//         </h2>

//         <ul className="space-y-3 lg:space-y-4 text-left font-sans">
//           {[
//             "Globally recognized Degree • WES Approved",
//             "100% Placement Assistance",
//             "College Recommendations Based on profile, goals & eligibility",
//             "Counselling – Personal guidance. Real results.",
//             "24/7 Student Support",
//           ].map((t, i) => (
//             <li key={i} className="flex items-start gap-3 group">
//               <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 group-hover:bg-black transition-colors duration-200">
//                 <Check className="w-3.5 h-3.5 text-slate-700 group-hover:text-white" />
//               </div>
//               <span className="text-slate-800 text-sm lg:text-base font-medium leading-tight">{t}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* ================= RIGHT FORM ================= */}
//       <div className="w-full md:w-1/2 p-6 lg:p-8 bg-white">
//         <h2 className="text-xl lg:text-2xl font-bold text-center mb-6 text-[#05347f]">Apply for Online Courses</h2>

//         <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
//           <Field label="Name">
//             <input name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} className={inputStyle} />
//           </Field>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <Field label="Email" half>
//               <input name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className={inputStyle} />
//             </Field>
//             <Field label="Mobile Number" half>
//               <input name="mobileNumber" placeholder="Enter your mobile number" value={formData.mobileNumber} onChange={handleChange} className={inputStyle} />
//             </Field>
//           </div>

//           <Field label="State">
//             <input name="state" placeholder="Enter your state" value={formData.state} onChange={handleChange} className={inputStyle} />
//           </Field>

//           {!expanded && (
//             <button type="button" onClick={() => setExpanded(true)} className="w-full bg-[#05347f] text-white font-bold py-2 rounded-md">
//               Expand Form ↓
//             </button>
//           )}

//           {expanded && (
//             <>
//               <Field label="City">
//                 <input name="city" placeholder="Enter your city" value={formData.city} onChange={handleChange} className={inputStyle} />
//               </Field>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Field label="Course" half>
//                   <input name="course" placeholder="Enter your course" value={formData.course} onChange={handleChange} className={inputStyle} />
//                 </Field>
//                 <Field label="Branch" half>
//                   <input 
//                     name="branch" 
//                     placeholder="Enter your Branch" 
//                     value={formData.branch} 
//                     onChange={handleChange} 
//                     className={inputStyle} 
//                   />
//                 </Field>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Field label="Gender" half>
//                   <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </Field>
//                 <Field label="Address" half>
//                   <input name="addresses" placeholder="Enter your address" value={formData.addresses} onChange={handleChange} className={inputStyle} />
//                 </Field>
//               </div>

//               {otpSent && (
//                 <Field label="OTP">
//                   <input name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} className={inputStyle} />
//                 </Field>
//               )}

//               <button type="submit" disabled={loading} className="w-full p-3 rounded-md text-white font-semibold bg-[#1E90FF]">
//                 {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
//               </button>
//             </>
//           )}
//         </form>
//       </div>

//       <style jsx>{`
//         .animate-scroll-x { animation: scrollX 20s linear infinite; }
//         @keyframes scrollX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
//       `}</style>
//     </div>
//   );
// }

// function Field({ label, children, half }) {
//   return (
//     /* Yahan sm:w-1/2 kiya hai taaki mobile pe full width rahe aur tablet/desktop pe half */
//     <div className={`relative ${half ? "w-full sm:w-1/2" : "w-full"}`}>
//       <label className="absolute -top-3 left-3 bg-white px-1 text-xs font-bold text-[#4A55A2] z-10">
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { Check, ShieldCheck, BadgePercent, Lock } from "lucide-react";

const inputStyle =
  "w-full h-11 px-3 border border-gray-300 rounded-lg bg-white text-[15px] " +
  "placeholder:text-gray-400 " +
  "transition-all duration-150 " +
  "focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/20 " +
  "outline-none";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    course: "",
    branch: "",
    gender: "",
    addresses: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        setUniversities(res.data?.data || []);
      } catch (err) {
        console.error("University fetch error", err);
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP sent successfully");
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/v1/verify-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        otp: formData.otp,
        purpose: "register",
        ...formData,
      });
      alert("Registration successful");
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  return (
<div className="bg-white rounded-2xl shadow-xl w-[95%] lg:w-[1100px] mx-auto my-6 border-2 border-[#c15304] flex flex-col md:flex-row overflow-hidden">
      {/* ================= LEFT SIDE ================= */}
      <div className="hidden md:flex md:w-1/2 lg:w-1/2 p-4 lg:p-8 flex-col items-center border-r border-gray-100 bg-[#F7FAFF]">
        <div className="w-full overflow-hidden mb-6">
          <div className="flex gap-4 animate-scroll-x">
            {[...universities, ...universities].map((uni, i) => {
              const imageUrl = uni.universityImage
                ? uni.universityImage.startsWith("http")
                  ? uni.universityImage
                  : `${process.env.NEXT_PUBLIC_API_URL}${uni.universityImage}`
                : "/fallback.png";

              return (
                <div
                  key={i}
                  className="min-w-[80px] lg:min-w-[100px] h-[40px] lg:h-[50px] bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm"
                >
                  <div className="relative w-full h-full p-1 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={uni.name || "University"}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

<div className="text-center">
  <h2 className="inline-block text-left text-xl font-bold mb-6 text-[#0B2D58] leading-snug bg-[#dce6f7] rounded-[5px] px-6 py-3">
    Your Path to a Successful Career Starts with Career Vidya
  </h2>
</div>

        <ul className="space-y-3 lg:space-y-4 text-left font-sans w-full max-w-[360px]">
          {[
               "Globally recognized Degree • WES Approved",
              "100% Placement Assistance",
            "Free Expert Consultation",
            "Quick Loan Facility",
            "Post Admission Support",
            "Counselling – Personal guidance. Real results.",
            "Job + Internship Portal",
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md bg-amber-100 text-amber-600">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className="text-slate-800 text-sm lg:text-[15px] font-medium leading-tight">
                {t}
              </span>
            </li>
          ))}
        </ul>

        {expanded && (
          <div className="relative w-full max-w-[280px] h-[180px] mt-8 rounded-xl overflow-hidden bg-white">
            <Image
              src="/images/sir.jpg"
              alt="CareerVidya - trusted by students across India"
              fill
              className="object-contain"
              unoptimized
            />
            
          </div>
        )}
      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="w-full md:w-1/2 p-6 lg:p-8 bg-white">
        <div className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-[#0B2D58]">
            <span className="text-[#c15304]">Apply</span> for Online Courses
          </h2>
          <div className="flex items-center justify-center gap-5 mt-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <BadgePercent className="w-4 h-4" />
              Online Discount of 15% 
            </span>
            <span className="flex items-center gap-1.5 text-[#c15304] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Lowest Price Guarantee
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">

          <Field label="Name" half>
            <input
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
            />
          </Field>
             <Field label="Email" half>
              <input
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
              />
            </Field>
</div>
          <div className="flex flex-col sm:flex-row gap-4">
          
            <Field label="Mobile Number" half>
              <input
                name="mobileNumber"
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={inputStyle}
              />
            </Field>
              <Field label="State" half>
            <input
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
              className={inputStyle}
            />
          </Field>
          </div>

        

          {!expanded && (
            <>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="cursor-pointer w-full bg-[#c15304] hover:bg-[#c15304] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Continue ↓
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Just a few more details and CareerVidya will match you with
                the best university for free.
              </p>
            </>
          )}

          {expanded && (
            <>
                          <div className="flex flex-col sm:flex-row gap-4">

              <Field label="City" half>
                <input
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </Field>
                 <Field label="Course" half>
                  <input
                    name="course"
                    placeholder="Enter your course"
                    value={formData.course}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
             
                <Field label="Branch" half>
                  <input
                    name="branch"
                    placeholder="Enter your Branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </Field>
                 <Field label="Gender" half>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
               
                <Field label="Address" >
                  <input
                    name="addresses"
                    placeholder="Enter your address"
                    value={formData.addresses}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </Field>
              </div>

              {otpSent && (
                <Field label="OTP">
                  <input
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </Field>
              )}

              {/* Assurance box, matches reference's "cAREERVIDYA Assured" block */}
              <div className="flex items-center justify-between gap-3 bg-[#F0F6FF] border border-[#D6E8FF] rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    readOnly
                    className="w-4 h-4 accent-[#1E90FF]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0B2D58]">
                      Career Vidya Assured{" "}
                      <span className="text-[#c15304] underline cursor-pointer">
                        (Know More)
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Get 100% full refund* on cancellation
                    </p>
                  </div>
                </div>
                <ShieldCheck className="w-7 h-7 text-[#1E90FF] flex-shrink-0" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full p-3.5 rounded-lg text-white font-semibold bg-[#c15304]  transition-colors disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : otpSent
                  ? "Verify OTP"
                  : "Find Best University →"}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-medium">
                <Lock className="w-3.5 h-3.5" />
                Your personal information is secure with us
              </p>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                By continuing, I authorize Career Vidya to contact me regarding admission,
  counselling, and course-related updates through call, SMS, WhatsApp, or email.
              </p>
            </>
          )}
        </form>
      </div>

      <style jsx>{`
        .animate-scroll-x {
          animation: scrollX 20s linear infinite;
        }
        @keyframes scrollX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, half }) {
  return (
    <div className={`relative ${half ? "w-full sm:w-1/2" : "w-full"}`}>
      <label className="block mb-1.5 text-xs font-semibold text-[#4A55A2]">
        {label}
      </label>
      {children}
    </div>
  );
}