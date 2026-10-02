// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import api from "@/utlis/api";
// import { useAuth } from "@/context/AuthContext.jsx";
// import { trackEvent } from "@/utlis/analytics.js";
// import { X, ArrowRight, Mail, Phone, Lock, ShieldCheck } from "lucide-react";

// /* ================= FLOATING SELECT ================= */
// const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
//   <div className="relative w-full">
//     <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f] z-10">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] bg-white text-slate-900 focus:outline-none"
//     >
//       <option value="" className="bg-white text-slate-900">Select</option>
//       {options.map((opt, i) => (
//         <option key={i} value={opt} className="bg-white text-slate-900">
//           {opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// /* ================= FLOATING INPUT ================= */
// const FloatingInput = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   showNoSpam = false,
//   noSpamText = "✓ We Do Not Spam",
// }) => (
//   <div className="relative w-full">
//     <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f] z-10">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none bg-white text-slate-900 focus:bg-white"
//     />
//     {showNoSpam && (
//       <div className="flex justify-end -mt-0.5">
//         <span className="text-[9px] text-green-600 font-medium px-1 leading-none bg-white whitespace-nowrap uppercase tracking-tighter z-10">
//           {noSpamText}
//         </span>
//       </div>
//     )}
//   </div>
// );

// /* ================= MAIN AUTH MODAL ================= */
// const AuthModal = ({ onClose, defaultTab = "login" }) => {
//   const [activeTab, setActiveTab] = useState(defaultTab); // "login" | "register"
//   const router = useRouter();
//   const { login } = useAuth();

//   /* ===== LOGIN STATE ===== */
//   const [loginMode, setLoginMode] = useState("email");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loginOtpSent, setLoginOtpSent] = useState(false);
//   const [loginLoading, setLoginLoading] = useState(false);

//   /* ===== REGISTER STATE ===== */
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     city: "",
//     state: "",
//     course: "",
//     branch: "",
//     gender: "",
//     subsidyCoupon: "",
//     addresses: "",
//     dob: "",
//     otp: "",
//   });
//   const [registerOtpSent, setRegisterOtpSent] = useState(false);
//   const [registerLoading, setRegisterLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [subsidyOptions, setSubsidyOptions] = useState([]);

//   /* ===== REGISTER: INPUT CHANGE ===== */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   /* ===== REGISTER: FETCH STATES ===== */
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await api.get("/api/v1/states");
//         setStates(res.data.states || []);
//       } catch (err) {
//         console.error("States fetch error", err);
//       }
//     };
//     fetchStates();
//   }, []);

//   /* ===== REGISTER: FETCH DISTRICTS ===== */
//   const fetchDistricts = async (state) => {
//     if (!state) { setDistricts([]); return; }
//     try {
//       const res = await api.get(`/api/v1/districts/${state}`);
//       setDistricts(res.data.districts || []);
//     } catch (err) {
//       console.error("Districts fetch error", err);
//       setDistricts([]);
//     }
//   };

//   const handleStateChange = (e) => {
//     const state = e.target.value;
//     setFormData((prev) => ({ ...prev, state, city: "" }));
//     fetchDistricts(state);
//   };

//   /* ===== REGISTER: FETCH COURSES ===== */
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         let courseList = [];
//         if (Array.isArray(res.data)) courseList = res.data;
//         else if (Array.isArray(res.data.data)) courseList = res.data.data;
//         else if (Array.isArray(res.data.courses)) courseList = res.data.courses;
//         setCourses(courseList);
//       } catch (err) {
//         console.error("Course fetch error", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleCourseChange = (e) => {
//     const selectedCourseName = e.target.value;
//     setFormData((prev) => ({ ...prev, course: selectedCourseName, branch: "" }));
//     const selectedCourse = courses.find((c) => c.name === selectedCourseName);
//     setSpecializations(selectedCourse?.specializations || []);
//   };

//   /* ===== REGISTER: FETCH SUBSIDY ===== */
//   useEffect(() => {
//     const fetchSubsidy = async () => {
//       try {
//         const res = await api.get("/api/v1/offer/type/subsidy");
//         let list = [];
//         if (Array.isArray(res.data)) list = res.data;
//         else if (Array.isArray(res.data?.data)) list = res.data.data;
//         setSubsidyOptions(
//           list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`)
//         );
//       } catch (err) {
//         console.error("Subsidy fetch error", err);
//       }
//     };
//     fetchSubsidy();
//   }, []);

//   /* ===== REGISTER: VALIDATION ===== */
//   const validateForm = () => {
//     const required = [
//       "name", "email", "mobileNumber", "city", "state",
//       "course", "branch", "gender", "subsidyCoupon", "addresses", "dob",
//     ];
//     for (let field of required) {
//       if (!formData[field]) {
//         alert(`Please fill ${field}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   /* ===== REGISTER: SEND OTP ===== */
//   const handleRegisterSendOtp = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       setRegisterLoading(true);
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       setRegisterOtpSent(true);
//       alert("OTP Sent Successfully");
//     } catch {
//       alert("User already exists");
//     } finally {
//       setRegisterLoading(false);
//     }
//   };

//   /* ===== REGISTER: VERIFY OTP ===== */
//   const handleRegisterVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) return alert("Enter OTP");
//     try {
//       setRegisterLoading(true);
//       const res = await api.post("/api/v1/verify-otp", {
//         ...formData,
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });

//       const { accessToken, student } = res.data;
//       if (accessToken && student) {
//         login({ accessToken, user: student, role: student.role });
//         trackEvent("register_click", { method: "otp" });
//       }

//       alert("Registration Successful");
//       onClose?.();
//       window.location.href = "/user";
//     } catch {
//       alert("Invalid OTP");
//     } finally {
//       setRegisterLoading(false);
//     }
//   };

//   const handleRegisterSubmit = (e) => {
//     registerOtpSent ? handleRegisterVerifyOtp(e) : handleRegisterSendOtp(e);
//   };

//   /* ===== LOGIN: SEND OTP ===== */
//   const handleLoginSendOtp = async () => {
//     if (!identifier) return alert("Please enter your Email or Phone Number");
//     try {
//       setLoginLoading(true);
//       const response = await api.post("/api/v1/send-otp", {
//         emailOrPhone: identifier,
//         purpose: "login",
//       });
//       alert(response.data.msg || "OTP Sent Successfully ✅");
//       setLoginOtpSent(true);
//     } catch (error) {
//       console.error("OTP Error:", error);
//       alert(error.response?.data?.msg || "Failed to send OTP. Please try again.");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   /* ===== LOGIN: VERIFY OTP ===== */
//   const handleLoginVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) return alert("Please enter the OTP");
//     try {
//       setLoginLoading(true);
//       const res = await api.post("/api/v1/verify-otp", {
//         emailOrPhone: identifier,
//         otp,
//         purpose: "login",
//       });
//       const { accessToken, student } = res.data;
//       const role = student.role;
//       login({ accessToken, user: student, role });
//       trackEvent("login_click", { method: "otp" });
//       setTimeout(() => {
//         const targetPath = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
//         window.location.href = targetPath;
//       }, 150);
//     } catch (error) {
//       console.error("Verification Error:", error);
//       alert(error.response?.data?.msg || "Invalid OTP. Please try again.");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   /* ===== RENDER ===== */
//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-4"
//       onClick={onClose}
//     >
//       {/* Modal Width Changed to max-w-3xl for better layout spaced */}
//       <div
//         className="bg-white text-slate-900 w-full max-w-3xl rounded-xl relative overflow-hidden shadow-2xl border border-slate-100"
//         style={{ maxHeight: "92vh" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 z-20 text-slate-500 hover:text-slate-800 transition-colors">
//           <X size={20} />
//         </button>

//         {/* Header */}
//         <div className="px-6 pt-5 pb-2 bg-white">
//           <div className="flex items-center gap-4 mb-3">
//             <Image src="/images/n12.png" alt="Career Vidya" width={90} height={44} />
//             <div>
//               <p className="text-sm font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
//               <p className="text-[12px] text-gray-500">Student's Trusted Education Guidance Platform</p>
//             </div>
//           </div>

//           {/* Trust badges */}
//           <div className="overflow-x-auto selection:bg-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-y border-slate-100 py-2 my-2">
//             <div className="flex min-w-max gap-3 text-[11px] font-bold text-green-700">
//               <span>✅ No-Cost EMI Available</span>|
//               <span>🎓 Govt-Approved Universities</span>|
//               <span>💼 100% Placement Assistance</span>|
//               <span>📞 Free Expert Counselling</span>
//             </div>
//           </div>

//           {/* Tab Switcher */}
//           {/* <div className="flex border-b border-slate-100 mt-2">
//             <button
//               type="button"
//               onClick={() => setActiveTab("login")}
//               className={`pb-2.5 px-6 text-[12px] font-bold uppercase tracking-widest transition-all ${
//                 activeTab === "login"
//                   ? "text-[#0056b3] border-b-2 border-[#0056b3]"
//                   : "text-slate-400 hover:text-slate-600"
//               }`}
//             >
//               Login
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab("register")}
//               className={`pb-2.5 px-6 text-[12px] font-bold uppercase tracking-widest transition-all ${
//                 activeTab === "register"
//                   ? "text-[#0056b3] border-b-2 border-[#0056b3]"
//                   : "text-slate-400 hover:text-slate-600"
//               }`}
//             >
//               Register
//             </button>
//           </div> */}
//         </div>

//         {/* Scrollable Body */}
//         <div className="overflow-y-auto px-6 py-4 bg-white" style={{ maxHeight: "calc(92vh - 210px)" }}>

//           {/* ============ LOGIN TAB ============ */}
//           {activeTab === "login" && (
//             <div className="animate-fadeIn">
//               {/* Login mode switcher */}
//               <div className="flex border-b border-slate-100 mb-6">
//                 {["email", "phone"].map((mode) => (
//                   <button
//                     key={mode}
//                     type="button"
//                     onClick={() => !loginOtpSent && setLoginMode(mode)}
//                     className={`pb-2 pr-8 text-[11px] font-bold uppercase tracking-widest transition-all ${
//                       loginMode === mode
//                         ? "text-[#0056b3] border-b-2 border-[#0056b3]"
//                         : "text-slate-400 hover:text-slate-600"
//                     }`}
//                   >
//                     {mode === "email" ? "Email Auth" : "Mobile Auth"}
//                   </button>
//                 ))}
//               </div>

//               <form className="space-y-5" onSubmit={handleLoginVerifyOtp}>
//                 {/* Identifier */}
//                 <div className="space-y-2">
//                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
//                     {loginMode === "email" ? "Registered Email" : "Mobile Number"}
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0056b3] transition-colors">
//                       {loginMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
//                     </div>
//                     <input
//                       type={loginMode === "email" ? "email" : "tel"}
//                       placeholder={loginMode === "email" ? "Enter your email" : "Enter mobile number"}
//                       value={identifier}
//                       onChange={(e) => setIdentifier(e.target.value)}
//                       disabled={loginOtpSent}
//                       required
//                       className="w-full bg-white border border-slate-300 text-slate-900 p-3.5 pl-10 text-sm outline-none focus:border-[#0056b3] focus:bg-white transition-all placeholder:text-slate-400 disabled:opacity-70 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 {/* OTP Input */}
//                 {loginOtpSent && (
//                   <div className="animate-fadeIn">
//                     <div className="flex justify-between items-center mb-2 px-1">
//                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                         Verification Code
//                       </label>
//                       <button
//                         type="button"
//                         onClick={() => setLoginOtpSent(false)}
//                         className="text-[10px] font-bold text-[#0056b3] hover:underline"
//                       >
//                         Edit Info
//                       </button>
//                     </div>
//                     <input
//                       type="text"
//                       maxLength={6}
//                       placeholder="0 0 0 0 0 0"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       required
//                       className="w-full bg-white border border-slate-300 text-slate-900 p-3.5 text-center text-xl tracking-[0.8em] font-black focus:border-[#0056b3] outline-none transition-all rounded-md"
//                     />
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 {!loginOtpSent ? (
//                   <button
//                     type="button"
//                     onClick={handleLoginSendOtp}
//                     disabled={loginLoading}
//                     className="cursor-pointer w-full bg-[#ff6b00] hover:bg-[#e66000] text-white p-3.5 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded dynamic-btn disabled:opacity-70"
//                   >
//                     {loginLoading ? "Requesting..." : "Send OTP"}
//                     <ArrowRight size={14} />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={loginLoading}
//                     className="cursor-pointer w-full bg-slate-900 hover:bg-black text-white p-3.5 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded dynamic-btn disabled:opacity-70"
//                   >
//                     <Lock size={14} />
//                     {loginLoading ? "Verifying..." : "Secure Login"}
//                   </button>
//                 )}
//               </form>

//               <p className="text-center text-xs mt-5 text-slate-800 font-bold">
//                 Don't have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab("register")}
//                   className="text-blue-600 font-bold hover:underline cursor-pointer"
//                 >
//                   Register here
//                 </button>
//               </p>
//             </div>
//           )}

//           {/* ============ REGISTER TAB ============ */}
//           {activeTab === "register" && (
//             <div className="animate-fadeIn">
//               <form onSubmit={handleRegisterSubmit} className="space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <FloatingInput
//                     label="Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                   <FloatingInput
//                     label="Email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     showNoSpam
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <FloatingInput
//                     label="Mobile Number"
//                     name="mobileNumber"
//                     value={formData.mobileNumber}
//                     onChange={handleChange}
//                     showNoSpam
//                   />
//                   <FloatingSelect
//                     label="State"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleStateChange}
//                     options={states}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <FloatingSelect
//                     label="City / District"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     options={districts}
//                   />
//                   <FloatingSelect
//                     label="Course"
//                     name="course"
//                     value={formData.course}
//                     onChange={handleCourseChange}
//                     options={courses.map((c) => c.name)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <FloatingSelect
//                     label="Specialization"
//                     name="branch"
//                     value={formData.branch}
//                     onChange={handleChange}
//                     options={specializations}
//                   />
//                   <FloatingSelect
//                     label="Gender"
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     options={["male", "female", "other"]}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <FloatingInput
//                     label="Date of Birth"
//                     name="dob"
//                     type="date"
//                     value={formData.dob}
//                     onChange={handleChange}
//                   />
//                   <FloatingSelect
//                     label="Subsidy"
//                     name="subsidyCoupon"
//                     value={formData.subsidyCoupon}
//                     onChange={handleChange}
//                     options={subsidyOptions}
//                   />
//                 </div>

//                 <FloatingInput
//                   label="Address"
//                   name="addresses"
//                   value={formData.addresses}
//                   onChange={handleChange}
//                 />

//                 {registerOtpSent && (
//                   <div className="animate-fadeIn">
//                     <FloatingInput
//                       label="OTP"
//                       name="otp"
//                       value={formData.otp}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 )}

//                 <button className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-bold transition-colors text-[13px] uppercase tracking-wider mt-2 shadow-sm">
//                   {registerLoading
//                     ? "Please wait..."
//                     : registerOtpSent
//                     ? "Verify & Register 🚀"
//                     : "Submit Form"}
//                 </button>
//               </form>

//               <p className="text-center text-xs mt-4 text-slate-800 font-bold">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab("login")}
//                   className="text-blue-600 font-bold hover:underline cursor-pointer"
//                 >
//                   Login here
//                 </button>
//               </p>
//             </div>
//           )}

//           {/* Bottom trust badge */}
//           <p className="text-center text-[11px] text-gray-500 mt-5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center justify-center gap-1.5">
//             <ShieldCheck size={14} className="text-emerald-600" />
//             All your information is safe and secure with Career Vidya encryption.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;


// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import api from "@/utlis/api";
// import { useAuth } from "@/context/AuthContext.jsx";
// import { trackEvent } from "@/utlis/analytics.js";
// import { X, ArrowRight, Mail, Phone, Lock, ShieldCheck, UserPlus, LogIn } from "lucide-react";
// import { toast } from "sonner";

// /* ═══════════════ FLOATING SELECT ═══════════════ */
// const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
//   <div className="relative w-full">
//     <label
//       className="absolute -top-2 left-2.5 bg-white px-1 text-[10px] font-semibold z-10"
//       style={{ color: "var(--cv-primary)" }}
//     >
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-md px-2.5 py-1.5 text-[12px] bg-white outline-none"
//       style={{
//         border: "1px solid var(--cv-primary)",
//         color: "var(--cv-neutral-dark)",
//       }}
//     >
//       <option value="">Select</option>
//       {options.map((opt, i) => (
//         <option key={i} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );

// /* ═══════════════ FLOATING INPUT ═══════════════ */
// const FloatingInput = ({
//   label, name, type = "text", value, onChange,
//   showNoSpam = false, noSpamText = "✓ We Do Not Spam",
// }) => (
//   <div className="relative w-full">
//     <label
//       className="absolute -top-2 left-2.5 bg-white px-1 text-[10px] font-semibold z-10"
//       style={{ color: "var(--cv-primary)" }}
//     >
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-md px-2.5 py-1.5 text-[12px] outline-none bg-white"
//       style={{
//         border: "1px solid var(--cv-primary)",
//         color: "var(--cv-neutral-dark)",
//       }}
//     />
//     {showNoSpam && (
//       <div className="flex justify-end -mt-0.5">
//         <span
//           className="text-[8px] font-medium px-1 leading-none bg-white whitespace-nowrap uppercase tracking-tighter z-10"
//           style={{ color: "var(--cv-accent)" }}
//         >
//           {noSpamText}
//         </span>
//       </div>
//     )}
//   </div>
// );

// /* ═══════════════ MAIN AUTH MODAL ═══════════════ */
// const AuthModal = ({ onClose, defaultTab = "login" }) => {
//   const [activeTab, setActiveTab] = useState(defaultTab);
//   const router = useRouter();
//   const { login } = useAuth();

//   /* ===== LOGIN STATE ===== */
//   const [loginMode, setLoginMode] = useState("email");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [loginOtpSent, setLoginOtpSent] = useState(false);
//   const [loginLoading, setLoginLoading] = useState(false);

//   /* ===== REGISTER STATE ===== */
//   const [formData, setFormData] = useState({
//     name: "", email: "", mobileNumber: "", city: "", state: "",
//     course: "", branch: "", gender: "", subsidyCoupon: "",
//     addresses: "", dob: "", otp: "",
//   });
//   const [registerOtpSent, setRegisterOtpSent] = useState(false);
//   const [registerLoading, setRegisterLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [subsidyOptions, setSubsidyOptions] = useState([]);

//   /* ===== INPUT CHANGE ===== */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   /* ===== FETCH STATES ===== */
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await api.get("/api/v1/states");
//         setStates(res.data.states || []);
//       } catch (err) {
//         console.error("States fetch error", err);
//       }
//     };
//     fetchStates();
//   }, []);

//   /* ===== FETCH DISTRICTS ===== */
//   const fetchDistricts = async (state) => {
//     if (!state) { setDistricts([]); return; }
//     try {
//       const res = await api.get(`/api/v1/districts/${state}`);
//       setDistricts(res.data.districts || []);
//     } catch (err) {
//       console.error("Districts fetch error", err);
//       setDistricts([]);
//     }
//   };

//   const handleStateChange = (e) => {
//     const state = e.target.value;
//     setFormData((prev) => ({ ...prev, state, city: "" }));
//     fetchDistricts(state);
//   };

//   /* ===== FETCH COURSES ===== */
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         let courseList = [];
//         if (Array.isArray(res.data)) courseList = res.data;
//         else if (Array.isArray(res.data.data)) courseList = res.data.data;
//         else if (Array.isArray(res.data.courses)) courseList = res.data.courses;
//         setCourses(courseList);
//       } catch (err) {
//         console.error("Course fetch error", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleCourseChange = (e) => {
//     const selectedCourseName = e.target.value;
//     setFormData((prev) => ({ ...prev, course: selectedCourseName, branch: "" }));
//     const selectedCourse = courses.find((c) => c.name === selectedCourseName);
//     setSpecializations(selectedCourse?.specializations || []);
//   };

//   /* ===== FETCH SUBSIDY ===== */
//   useEffect(() => {
//     const fetchSubsidy = async () => {
//       try {
//         const res = await api.get("/api/v1/offer/type/subsidy");
//         let list = [];
//         if (Array.isArray(res.data)) list = res.data;
//         else if (Array.isArray(res.data?.data)) list = res.data.data;
//         setSubsidyOptions(
//           list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`)
//         );
//       } catch (err) {
//         console.error("Subsidy fetch error", err);
//       }
//     };
//     fetchSubsidy();
//   }, []);

//   /* ===== VALIDATION ===== */
//   const validateForm = () => {
//     const required = [
//       "name", "email", "mobileNumber", "city", "state",
//       "course", "branch", "gender", "subsidyCoupon", "addresses", "dob",
//     ];
//     for (let field of required) {
//       if (!formData[field]) {
//         toast.error(`Please fill ${field}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   /* ===== REGISTER: SEND OTP ===== */
//   const handleRegisterSendOtp = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       setRegisterLoading(true);
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       setRegisterOtpSent(true);
//       toast.success("OTP Sent Successfully");
//     } catch {
//       toast.error("User already exists");
//     } finally {
//       setRegisterLoading(false);
//     }
//   };

//   /* ===== REGISTER: VERIFY OTP ===== */
//   const handleRegisterVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) { toast.error("Enter OTP"); return; }
//     try {
//       setRegisterLoading(true);
//       const res = await api.post("/api/v1/verify-otp", {
//         ...formData,
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       const { accessToken, student } = res.data;
//       if (accessToken && student) {
//         login({ accessToken, user: student, role: student.role });
//         trackEvent("register_click", { method: "otp" });
//       }
//       toast.success("Registration Successful");
//       onClose?.();
//       window.location.href = "/user";
//     } catch {
//       toast.error("Invalid OTP");
//     } finally {
//       setRegisterLoading(false);
//     }
//   };

//   const handleRegisterSubmit = (e) => {
//     registerOtpSent ? handleRegisterVerifyOtp(e) : handleRegisterSendOtp(e);
//   };

//   /* ===== LOGIN: SEND OTP ===== */
//   const handleLoginSendOtp = async () => {
//     if (!identifier) { toast.error("Please enter your Email or Phone Number"); return; }
//     try {
//       setLoginLoading(true);
//       const response = await api.post("/api/v1/send-otp", {
//         emailOrPhone: identifier,
//         purpose: "login",
//       });
//       toast.success(response.data.msg || "OTP Sent Successfully ✅");
//       setLoginOtpSent(true);
//     } catch (error) {
//       console.error("OTP Error:", error);
//       toast.error(error.response?.data?.msg || "Failed to send OTP. Please try again.");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   /* ===== LOGIN: VERIFY OTP ===== */
//   const handleLoginVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) { toast.error("Please enter the OTP"); return; }
//     try {
//       setLoginLoading(true);
//       const res = await api.post("/api/v1/verify-otp", {
//         emailOrPhone: identifier,
//         otp,
//         purpose: "login",
//       });
//       const { accessToken, student } = res.data;
//       const role = student.role;
//       login({ accessToken, user: student, role });
//       trackEvent("login_click", { method: "otp" });
//       toast.success("Login successful! Redirecting...");
//       setTimeout(() => {
//         const targetPath = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
//         window.location.href = targetPath;
//       }, 300);
//     } catch (error) {
//       console.error("Verification Error:", error);
//       toast.error(error.response?.data?.msg || "Invalid OTP. Please try again.");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   /* ═══════════ RENDER ═══════════ */
//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-3"
//       onClick={onClose}
//     >
//       {/* ✅ Compact modal — max-w-2xl */}
//       <div
//         className="bg-white w-full max-w-2xl rounded-xl relative overflow-hidden shadow-2xl border"
//         style={{
//           maxHeight: "88vh",
//           borderColor: "var(--cv-neutral-border)",
//           color: "var(--cv-neutral-dark)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="cursor-pointer absolute top-3 right-3 z-30 transition-colors"
//           style={{ color: "var(--cv-neutral-mid)" }}
//           onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cv-neutral-dark)")}
//           onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cv-neutral-mid)")}
//           aria-label="Close"
//         >
//           <X size={18} />
//         </button>

//         {/* ═══════════ HEADER (Compact) ═══════════ */}
//         <div className="px-4 pt-3 pb-1 bg-white relative z-20">
//           <div className="flex items-center gap-3 mb-2">
// <div
//   className="shrink-0 w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden"
//   style={{ border: "2px solid #fdba74" }}
// >
//   <Image
//     src="/images/n12.png"
//     alt="Career Vidya"
//     width={60}
//     height={34}
//     priority
//     className="object-contain w-full h-auto scale-108"
//   />
// </div>            <div>
//               <p className="text-xs font-bold" style={{ color: "var(--cv-primary)" }}>
//                 #VidyaHaiTohSuccessHai
//               </p>
//               <p className="text-[11px]" style={{ color: "var(--cv-neutral-mid)" }}>
//                 Student's Trusted Education Guidance Platform
//               </p>
//             </div>
//           </div>

//           {/* Trust badges — compact */}
//           <div
//             className="overflow-x-auto border-y py-1.5 my-1.5 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//             style={{ borderColor: "var(--cv-neutral-border)" }}
//           >
//             <div
//               className="flex min-w-max gap-2 text-[10px] font-bold"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               <span>✅ No-Cost EMI</span>|
//               <span>🎓 Govt-Approved</span>|
//               <span>💼 Placement Support</span>|
//               <span>📞 Free Counselling</span>
//             </div>
//           </div>
//         </div>

//         {/* ═══════════ SLIDE CONTAINER ═══════════ */}
//         <div
//           className="overflow-hidden relative"
//           style={{ maxHeight: "calc(88vh - 140px)" }}
//         >
//           <div
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{
//               transform: activeTab === "login" ? "translateX(0)" : "translateX(-50%)",
//               width: "200%",
//             }}
//           >

//             {/* ═══ PANEL 1: LOGIN ═══ */}
//             <div
//               className="overflow-y-auto px-4 py-3 bg-white"
//               style={{ width: "50%", maxHeight: "calc(88vh - 140px)" }}
//             >
//               <div>
//                 {/* Login mode switcher */}
//                 <div className="flex mb-3" style={{ borderBottom: "1px solid var(--cv-neutral-border)" }}>
//                   {["email", "phone"].map((mode) => {
//                     const isActive = loginMode === mode;
//                     return (
//                       <button
//                         key={mode}
//                         type="button"
//                         onClick={() => !loginOtpSent && setLoginMode(mode)}
//                         className="pb-1.5 pr-6 text-[10px] font-bold uppercase tracking-widest transition-all"
//                         style={{
//                           color: isActive ? "var(--cv-primary)" : "var(--cv-neutral-mid)",
//                           borderBottom: isActive
//                             ? "2px solid var(--cv-primary)"
//                             : "2px solid transparent",
//                         }}
//                       >
//                         {mode === "email" ? "Email" : "Mobile"}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <form className="space-y-3" onSubmit={handleLoginVerifyOtp}>
//                   {/* Identifier */}
//                   <div className="space-y-1.5">
//                     <label
//                       className="block text-[9px] font-bold uppercase tracking-widest px-1"
//                       style={{ color: "var(--cv-neutral-mid)" }}
//                     >
//                       {loginMode === "email" ? "Registered Email" : "Mobile Number"}
//                     </label>
//                     <div className="relative group">
//                       <div
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors"
//                         style={{ color: "var(--cv-neutral-mid)" }}
//                       >
//                         {loginMode === "email" ? <Mail size={14} /> : <Phone size={14} />}
//                       </div>
//                       <input
//                         type={loginMode === "email" ? "email" : "tel"}
//                         placeholder={
//                           loginMode === "email" ? "Enter email" : "Enter mobile"
//                         }
//                         value={identifier}
//                         onChange={(e) => setIdentifier(e.target.value)}
//                         disabled={loginOtpSent}
//                         required
//                         className="w-full p-2.5 pl-8 text-[12px] outline-none transition-all placeholder:text-slate-400 disabled:opacity-70 rounded-md"
//                         style={{
//                           background: "#fff",
//                           border: "1px solid var(--cv-neutral-border)",
//                           color: "var(--cv-neutral-dark)",
//                         }}
//                         onFocus={(e) => (e.target.style.borderColor = "var(--cv-primary)")}
//                         onBlur={(e) => (e.target.style.borderColor = "var(--cv-neutral-border)")}
//                       />
//                     </div>
//                   </div>

//                   {/* OTP Input */}
//                   {loginOtpSent && (
//                     <div className="animate-fadeIn">
//                       <div className="flex justify-between items-center mb-1.5 px-1">
//                         <label
//                           className="text-[9px] font-bold uppercase tracking-widest"
//                           style={{ color: "var(--cv-neutral-mid)" }}
//                         >
//                           Verification Code
//                         </label>
//                         <button
//                           type="button"
//                           onClick={() => setLoginOtpSent(false)}
//                           className="text-[9px] font-bold hover:underline transition-colors"
//                           style={{ color: "var(--cv-accent)" }}
//                         >
//                           Edit Info
//                         </button>
//                       </div>
//                       <input
//                         type="text"
//                         maxLength={6}
//                         placeholder="0 0 0 0 0 0"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         required
//                         className="w-full p-2.5 text-center text-base tracking-[0.5em] font-black outline-none transition-all rounded-md"
//                         style={{
//                           background: "var(--cv-primary-light)",
//                           border: "1px solid var(--cv-primary-light)",
//                           color: "var(--cv-neutral-dark)",
//                         }}
//                         onFocus={(e) => (e.target.style.borderColor = "var(--cv-primary)")}
//                         onBlur={(e) => (e.target.style.borderColor = "var(--cv-primary-light)")}
//                       />
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   {!loginOtpSent ? (
//                     <button
//                       type="button"
//                       onClick={handleLoginSendOtp}
//                       disabled={loginLoading}
//                       className="cursor-pointer w-full p-2.5 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-70 rounded-md"
//                       style={{
//                         background: "var(--cv-grad-cta)",
//                         color: "#fff",
//                         boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!loginLoading) {
//                           e.currentTarget.style.background = "var(--cv-grad-cta-hover)";
//                           e.currentTarget.style.transform = "translateY(-1px)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = "var(--cv-grad-cta)";
//                         e.currentTarget.style.transform = "translateY(0)";
//                       }}
//                     >
//                       {loginLoading ? "Requesting..." : "Send OTP"}
//                       <ArrowRight size={12} />
//                     </button>
//                   ) : (
//                     <button
//                       type="submit"
//                       disabled={loginLoading}
//                       className="cursor-pointer w-full p-2.5 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-70 rounded-md"
//                       style={{
//                         background: "var(--cv-grad-cta)",
//                         color: "#fff",
//                         boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!loginLoading) {
//                           e.currentTarget.style.background = "var(--cv-grad-cta-hover)";
//                           e.currentTarget.style.transform = "translateY(-1px)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = "var(--cv-grad-cta)";
//                         e.currentTarget.style.transform = "translateY(0)";
//                       }}
//                     >
//                       <Lock size={12} />
//                       {loginLoading ? "Verifying..." : "Secure Login"}
//                     </button>
//                   )}
//                 </form>

//                 {/* Switch to Register */}
//                 <div className="mt-4 pt-3" style={{ borderTop: "1px dashed var(--cv-neutral-border)" }}>
//                   <p
//                     className="text-center text-[11px] font-semibold mb-2"
//                     style={{ color: "var(--cv-neutral-mid)" }}
//                   >
//                     Don't have an account yet?
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => setActiveTab("register")}
//                     className="cursor-pointer w-full p-2 font-bold text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all rounded-md group"
//                     style={{
//                       background: "transparent",
//                       color: "var(--cv-primary)",
//                       border: "1.5px solid var(--cv-primary)",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = "var(--cv-primary)";
//                       e.currentTarget.style.color = "#fff";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "transparent";
//                       e.currentTarget.style.color = "var(--cv-primary)";
//                     }}
//                   >
//                     <UserPlus size={12} />
//                     Create New Account
//                     <ArrowRight
//                       size={12}
//                       className="group-hover:translate-x-1 transition-transform"
//                     />
//                   </button>
//                 </div>

//                 {/* ✅ NEW: Sir image — login side only */}
//                 {/* <div className="mt-3 flex justify-center">
//                   <Image
//                     src="/images/sir.jpg"
//                     alt="Sir"
//                     width={220}
//                     height={220}
//                     className="w-auto h-auto max-h-[180px] object-contain"
//                     priority
//                   />
//                 </div> */}
//               </div>
//             </div>

//             {/* ═══ PANEL 2: REGISTER ═══ */}
//             <div
//               className="overflow-y-auto px-4 py-3 bg-white"
//               style={{ width: "50%", maxHeight: "calc(88vh - 140px)" }}
//             >
//               <div>
//                 <form onSubmit={handleRegisterSubmit} className="space-y-3">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <FloatingInput label="Name" name="name" value={formData.name} onChange={handleChange} />
//                     <FloatingInput label="Email" name="email" value={formData.email} onChange={handleChange} showNoSpam />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <FloatingInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} showNoSpam />
//                     <FloatingSelect label="State" name="state" value={formData.state} onChange={handleStateChange} options={states} />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <FloatingSelect label="City / District" name="city" value={formData.city} onChange={handleChange} options={districts} />
//                     <FloatingSelect label="Course" name="course" value={formData.course} onChange={handleCourseChange} options={courses.map((c) => c.name)} />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <FloatingSelect label="Specialization" name="branch" value={formData.branch} onChange={handleChange} options={specializations} />
//                     <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["male", "female", "other"]} />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <FloatingInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//                     <FloatingSelect label="Subsidy" name="subsidyCoupon" value={formData.subsidyCoupon} onChange={handleChange} options={subsidyOptions} />
//                   </div>

//                   <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />

//                   {registerOtpSent && (
//                     <div className="animate-fadeIn">
//                       <FloatingInput label="OTP" name="otp" value={formData.otp} onChange={handleChange} />
//                     </div>
//                   )}

//                   <button
//                     className="cursor-pointer w-full py-2.5 rounded-md font-bold transition-all text-[12px] uppercase tracking-wider mt-1"
//                     style={{
//                       background: "var(--cv-grad-cta)",
//                       color: "#fff",
//                       boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = "var(--cv-grad-cta-hover)";
//                       e.currentTarget.style.transform = "translateY(-1px)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "var(--cv-grad-cta)";
//                       e.currentTarget.style.transform = "translateY(0)";
//                     }}
//                   >
//                     {registerLoading
//                       ? "Please wait..."
//                       : registerOtpSent
//                       ? "Verify & Register 🚀"
//                       : "Submit Form"}
//                   </button>
//                 </form>

//                 {/* Switch to Login */}
//                 <div className="mt-4 pt-3" style={{ borderTop: "1px dashed var(--cv-neutral-border)" }}>
//                   <p
//                     className="text-center text-[11px] font-semibold mb-2"
//                     style={{ color: "var(--cv-neutral-mid)" }}
//                   >
//                     Already have an account?
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => setActiveTab("login")}
//                     className="cursor-pointer w-full p-2 font-bold text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all rounded-md group"
//                     style={{
//                       background: "transparent",
//                       color: "var(--cv-primary)",
//                       border: "1.5px solid var(--cv-primary)",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = "var(--cv-primary)";
//                       e.currentTarget.style.color = "#fff";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "transparent";
//                       e.currentTarget.style.color = "var(--cv-primary)";
//                     }}
//                   >
//                     <LogIn size={12} />
//                     Back to Login
//                     <ArrowRight
//                       size={12}
//                       className="group-hover:translate-x-1 transition-transform rotate-180"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* ═══════════ FOOTER TRUST BADGE ═══════════ */}
//         <div className="px-4 pb-3 pt-1 bg-white relative z-20">
//           <p
//             className="text-center text-[10px] px-2 py-1.5 rounded-lg flex items-center justify-center gap-1"
//             style={{
//               color: "var(--cv-neutral-mid)",
//               background: "var(--cv-neutral-light)",
//               border: "1px solid var(--cv-neutral-border)",
//             }}
//           >
//             <ShieldCheck size={12} style={{ color: "var(--cv-primary)" }} />
//             All information is safe and secure.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { useAuth } from "@/context/AuthContext.jsx";
import { trackEvent } from "@/utlis/analytics.js";
import {
  X,
  ArrowRight,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";

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
  "w-full rounded-lg px-3 py-3 text-[13px] outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20";

const ctaStyle = {
  background: "var(--cv-grad-cta, linear-gradient(180deg, #e0701a, #c15304))",
  color: "#fff",
  boxShadow: "0 8px 20px rgba(193, 83, 4, 0.3)",
};

const FIELD_LABELS = {
  name: "your name",
  email: "your email",
  mobileNumber: "your mobile number",
  city: "your city",
  state: "your state",
  course: "a course",
  branch: "a specialization",
  gender: "your gender",
  subsidyCoupon: "a subsidy option",
  addresses: "your address",
  dob: "your date of birth",
};

const BENEFITS = [
  "No-cost EMI options",
  "Government-approved universities",
  "Placement support",
  "Free counselling",
];

/* ═══════════════ FLOATING SELECT ═══════════════ */
const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className="relative w-full">
    <label
      className="absolute -top-2 left-3 px-1.5 text-[11px] font-semibold z-10 rounded"
      style={labelStyle}
    >
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`${fieldClass} appearance-none pr-9 cursor-pointer`}
      style={fieldStyle}
    >
      <option value="">Select</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
      style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
      aria-hidden="true"
    />
  </div>
);

/* ═══════════════ FLOATING INPUT ═══════════════ */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  showNoSpam = false,
  ...rest
}) => (
  <div className="relative w-full">
    <label
      className="absolute -top-2 left-3 px-1.5 text-[11px] font-semibold z-10 rounded"
      style={labelStyle}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`${fieldClass} ${showNoSpam ? "pr-20" : ""}`}
      style={fieldStyle}
      {...rest}
    />
    {showNoSpam && (
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap"
        style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
      >
        <Check className="w-3 h-3" aria-hidden="true" />
        No spam
      </span>
    )}
  </div>
);

/* ═══════════════ CIRCULAR LOGO ═══════════════ */
const CircleLogo = ({ size = 72 }) => (
  <div
    className="rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
    style={{
      width: size,
      height: size,
      background: "#ffffff",
      border: "3px solid var(--cv-accent, #c15304)",
    }}
  >
    <Image
      src="/images/n12.png"
      alt="Career Vidya"
      width={size - 24}
      height={size - 24}
      priority
      className="object-contain"
    />
  </div>
);

/* ═══════════════ MAIN AUTH MODAL ═══════════════ */
const AuthModal = ({ onClose, defaultTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { login } = useAuth();

  /* ===== LOGIN STATE ===== */
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  /* ===== REGISTER STATE ===== */
  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", city: "", state: "",
    course: "", branch: "", gender: "", subsidyCoupon: "",
    addresses: "", dob: "", otp: "",
  });
  const [registerOtpSent, setRegisterOtpSent] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [subsidyOptions, setSubsidyOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ===== FETCH STATES ===== */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/v1/states");
        setStates(res.data.states || []);
      } catch (err) {
        console.error("States fetch error", err);
      }
    };
    fetchStates();
  }, []);

  /* ===== FETCH DISTRICTS ===== */
  const fetchDistricts = async (state) => {
    if (!state) {
      setDistricts([]);
      return;
    }
    try {
      const res = await api.get(`/api/v1/districts/${state}`);
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error("Districts fetch error", err);
      setDistricts([]);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((prev) => ({ ...prev, state, city: "" }));
    fetchDistricts(state);
  };

  /* ===== FETCH COURSES ===== */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");
        let courseList = [];
        if (Array.isArray(res.data)) courseList = res.data;
        else if (Array.isArray(res.data.data)) courseList = res.data.data;
        else if (Array.isArray(res.data.courses)) courseList = res.data.courses;
        setCourses(courseList);
      } catch (err) {
        console.error("Course fetch error", err);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseChange = (e) => {
    const selectedCourseName = e.target.value;
    setFormData((prev) => ({ ...prev, course: selectedCourseName, branch: "" }));
    const selectedCourse = courses.find((c) => c.name === selectedCourseName);
    setSpecializations(selectedCourse?.specializations || []);
  };

  /* ===== FETCH SUBSIDY ===== */
  useEffect(() => {
    const fetchSubsidy = async () => {
      try {
        const res = await api.get("/api/v1/offer/type/subsidy");
        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.data?.data)) list = res.data.data;
        setSubsidyOptions(
          list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`)
        );
      } catch (err) {
        console.error("Subsidy fetch error", err);
      }
    };
    fetchSubsidy();
  }, []);

  /* ===== VALIDATION ===== */
  const validateForm = () => {
    const required = [
      "name", "email", "mobileNumber", "state", "city",
      "course", "branch", "gender", "subsidyCoupon", "addresses", "dob",
    ];
    for (let field of required) {
      if (!formData[field]) {
        toast.error(`Please enter ${FIELD_LABELS[field] || field}`);
        return false;
      }
    }
    return true;
  };

  /* ===== REGISTER: SEND OTP ===== */
  const handleRegisterSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setRegisterLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setRegisterOtpSent(true);
      toast.success("OTP Sent Successfully");
    } catch {
      toast.error("User already exists");
    } finally {
      setRegisterLoading(false);
    }
  };

  /* ===== REGISTER: VERIFY OTP ===== */
  const handleRegisterVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("Enter OTP");
      return;
    }
    try {
      setRegisterLoading(true);
      const res = await api.post("/api/v1/verify-otp", {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      const { accessToken, student } = res.data;
      if (accessToken && student) {
        login({ accessToken, user: student, role: student.role });
        trackEvent("register_click", { method: "otp" });
      }
      toast.success("Registration Successful");
      onClose?.();
      window.location.href = "/user";
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    registerOtpSent ? handleRegisterVerifyOtp(e) : handleRegisterSendOtp(e);
  };

  /* ===== LOGIN: SEND OTP ===== */
  const handleLoginSendOtp = async () => {
    if (!identifier) {
      toast.error("Please enter your Email or Phone Number");
      return;
    }
    try {
      setLoginLoading(true);
      const response = await api.post("/api/v1/send-otp", {
        emailOrPhone: identifier,
        purpose: "login",
      });
      toast.success(response.data.msg || "OTP Sent Successfully ✅");
      setLoginOtpSent(true);
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(error.response?.data?.msg || "Failed to send OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ===== LOGIN: VERIFY OTP ===== */
  const handleLoginVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      setLoginLoading(true);
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
      setTimeout(() => {
        const targetPath = role === "admin" || role === "subadmin" ? "/admin" : "/user";
        window.location.href = targetPath;
      }, 300);
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(error.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const switchLoginMode = (mode) => {
    if (loginOtpSent || mode === loginMode) return;
    setLoginMode(mode);
    setIdentifier("");
  };

  /* ═══════════ RENDER ═══════════ */
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] p-3"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl relative overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-[290px_1fr]"
        style={{
          maxHeight: "92vh",
          background: "var(--cv-surface, #ffffff)",
          color: "var(--cv-neutral-dark, #1f2a30)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 z-30 p-1.5 rounded-full transition hover:opacity-80"
          style={{
            background: "var(--cv-neutral-light, #f5f7f8)",
            color: "var(--cv-neutral-mid, #5b6b75)",
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ═══════════ LEFT BRAND PANEL (desktop) ═══════════ */}
        <aside
          className="hidden md:flex flex-col justify-between p-7 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 85% 10%, rgba(240,138,60,0.35) 0%, transparent 50%), linear-gradient(160deg, #3d4c56 0%, #26323a 100%)",
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

          <div className="relative z-10">
            <CircleLogo size={88} />
            <h2
              className="mt-5 text-xl  leading-snug"
              style={{ color: "#ffffff" }}
            >
              #VidyaHaiTohSuccessHai
            </h2>
            <p
              className="mt-2 text-xs leading-relaxed"
              style={{ color: "#ffffff", opacity: 0.85 }}
            >
              Student's trusted education guidance platform.
            </p>

            <ul className="mt-6 space-y-2">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "#ffffff" }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f08a3c" }}
                  >
                    <Check className="w-2.5 h-2.5" style={{ color: "#26323a" }} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-6 flex justify-center">
            <Image
              src="/images/sir.jpg"
              alt="Sir"
              width={220}
              height={220}
              className="w-auto h-auto max-h-[170px] object-contain rounded-xl"
              priority
            />
          </div>
        </aside>

        {/* ═══════════ RIGHT: TABS + FORMS ═══════════ */}
        <div
          className="flex flex-col min-h-0"
          style={{ maxHeight: "92vh" }}
        >
          {/* Mobile brand header */}
          <div className="md:hidden flex items-center gap-3 px-5 pt-5 pr-14">
            <CircleLogo size={56} />
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--cv-primary, #51636e)" }}>
                #VidyaHaiTohSuccessHai
              </p>
              <p className="text-[11px]" style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}>
                Free counselling · Govt-approved
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="px-5 md:px-8 pt-5 md:pt-8">
            <div
              role="tablist"
              className="grid grid-cols-2 p-1 rounded-xl"
              style={{ background: "var(--cv-neutral-light, #f5f7f8)" }}
            >
              {[
                { id: "login", label: "Login" },
                { id: "register", label: "Create account" },
              ].map((t) => {
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className="cursor-pointer py-2.5 rounded-lg text-sm font-bold transition"
                    style={
                      active
                        ? {
                            background: "var(--cv-surface, #ffffff)",
                            color: "var(--cv-accent, #c15304)",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                          }
                        : { color: "var(--cv-neutral-mid, #5b6b75)" }
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5">
            {/* ═══ LOGIN ═══ */}
            {activeTab === "login" && (
              <div>
                <h1 className="text-xl font-extrabold">Welcome back</h1>
                <p className="text-xs mt-1 mb-5" style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}>
                  Log in with a one-time code. No password needed.
                </p>

                {/* Email / Mobile pills */}
                <div className="flex gap-2 mb-4">
                  {[
                    { id: "email", label: "Email", Icon: Mail },
                    { id: "phone", label: "Mobile", Icon: Phone },
                  ].map(({ id, label, Icon }) => {
                    const active = loginMode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => switchLoginMode(id)}
                        disabled={loginOtpSent}
                        className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition disabled:cursor-not-allowed"
                        style={
                          active
                            ? {
                                background: "var(--cv-accent-light, #fdf0e6)",
                                color: "var(--cv-accent-dark, #8f3c03)",
                                border: "1px solid var(--cv-accent, #c15304)",
                              }
                            : {
                                background: "transparent",
                                color: "var(--cv-neutral-mid, #5b6b75)",
                                border: "1px solid var(--cv-neutral-border, #e3e8eb)",
                              }
                        }
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                <form className="space-y-4" onSubmit={handleLoginVerifyOtp}>
                  <div className="relative">
                    <label
                      className="absolute -top-2 left-3 px-1.5 text-[11px] font-semibold z-10 rounded"
                      style={labelStyle}
                    >
                      {loginMode === "email" ? "Registered email" : "Mobile number"}
                    </label>
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
                    >
                      {loginMode === "email" ? <Mail size={15} /> : <Phone size={15} />}
                    </div>
                    <input
                      type={loginMode === "email" ? "email" : "tel"}
                      inputMode={loginMode === "email" ? "email" : "numeric"}
                      placeholder={
                        loginMode === "email" ? "you@example.com" : "10-digit mobile number"
                      }
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={loginOtpSent}
                      required
                      className={`${fieldClass} pl-9 disabled:opacity-70 placeholder:opacity-50`}
                      style={fieldStyle}
                    />
                  </div>

                  {loginOtpSent && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label
                          className="text-xs font-semibold"
                          style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
                        >
                          Enter the 6-digit code
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginOtpSent(false);
                            setOtp("");
                          }}
                          className="cursor-pointer text-xs font-bold hover:underline"
                          style={{ color: "var(--cv-accent, #c15304)" }}
                        >
                          Change {loginMode === "email" ? "email" : "number"}
                        </button>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full py-3 text-center text-xl tracking-[0.5em] font-black outline-none rounded-lg transition focus:ring-2 focus:ring-orange-500/20"
                        style={{
                          background: "var(--cv-primary-light, #e8edf0)",
                          border: "1px solid var(--cv-neutral-border, #e3e8eb)",
                          color: "var(--cv-neutral-dark, #1f2a30)",
                        }}
                      />
                    </div>
                  )}

                  {!loginOtpSent ? (
                    <button
                      type="button"
                      onClick={handleLoginSendOtp}
                      disabled={loginLoading}
                      className="cursor-pointer w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                      style={ctaStyle}
                    >
                      {loginLoading ? "Sending..." : "Send OTP"}
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="cursor-pointer w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                      style={ctaStyle}
                    >
                      <Lock size={14} />
                      {loginLoading ? "Verifying..." : "Verify & log in"}
                    </button>
                  )}
                </form>

                <p
                  className="text-center text-xs mt-6"
                  style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
                >
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="cursor-pointer font-bold hover:underline"
                    style={{ color: "var(--cv-accent, #c15304)" }}
                  >
                    Create a  account
                  </button>
                </p>
              </div>
            )}

            {/* ═══ REGISTER ═══ */}
            {activeTab === "register" && (
              <div>
                <h1 className="text-xl font-extrabold">Create your  account</h1>
                <p className="text-xs mt-1 mb-5" style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}>
                  Tell us a little about yourself so we can guide you better.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingInput label="Full name" name="name" value={formData.name} onChange={handleChange} />
                    <FloatingInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} showNoSpam />
                    <FloatingInput label="Mobile number" name="mobileNumber" type="tel" inputMode="numeric" value={formData.mobileNumber} onChange={handleChange} showNoSpam />
                    <FloatingInput label="Date of birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                    <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["male", "female", "other"]} />
                    <FloatingSelect label="Subsidy" name="subsidyCoupon" value={formData.subsidyCoupon} onChange={handleChange} options={subsidyOptions} />
                    <FloatingSelect label="Course" name="course" value={formData.course} onChange={handleCourseChange} options={courses.map((c) => c.name)} />
                    <FloatingSelect label="Specialization" name="branch" value={formData.branch} onChange={handleChange} options={specializations} />
                    <FloatingSelect label="State" name="state" value={formData.state} onChange={handleStateChange} options={states} />
                    <FloatingSelect label="City / District" name="city" value={formData.city} onChange={handleChange} options={districts} />
                  </div>

                  <FloatingInput label="Full address" name="addresses" value={formData.addresses} onChange={handleChange} />

                  {registerOtpSent && (
                    <div
                      className="rounded-xl p-4 space-y-3"
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
                      <FloatingInput
                        label="6-digit OTP"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        inputMode="numeric"
                        maxLength={6}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="cursor-pointer w-full py-3 rounded-lg font-bold text-sm transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                    style={ctaStyle}
                  >
                    {registerLoading
                      ? "Please wait..."
                      : registerOtpSent
                      ? "Verify & register"
                      : "Send OTP"}
                  </button>
                </form>

                <p
                  className="text-center text-xs mt-6"
                  style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
                >
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="cursor-pointer font-bold hover:underline"
                    style={{ color: "var(--cv-accent, #c15304)" }}
                  >
                    Log in
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Footer trust badge */}
          <div className="px-5 md:px-8 pb-4">
            <p
              className="flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-lg"
              style={{
                color: "var(--cv-neutral-mid, #5b6b75)",
                background: "var(--cv-neutral-light, #f5f7f8)",
                border: "1px dashed var(--cv-neutral-border, #e3e8eb)",
              }}
            >
              <ShieldCheck size={13} style={{ color: "var(--cv-primary, #51636e)" }} />
              All information is safe and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;