// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { X, User, Mail, Phone, GraduationCap, MapPin,
//          ArrowRight, Tag, MessageSquare, Sparkles,
//          Lock, CalendarCheck, Check, Sparkle } from "lucide-react";
// import api from "@/utlis/api";
// import "./TopHeader.css";

// const STEPS = ["Personal & Course Details", "Select Consultation Slot"];

// export default function QueryPopup() {
//   const [showPopup, setShowPopup]         = useState(false);
//   const [step, setStep]                   = useState(1);
//   const [submitted, setSubmitted]         = useState(false);

//   const [courses, setCourses]             = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(false);
//   const [specializations, setSpecializations] = useState([]);

//   const [backendSlots, setBackendSlots]   = useState([]);
//   const [slotsLoading, setSlotsLoading]   = useState(false);
//   const [uniqueDays, setUniqueDays]       = useState([]);

//   const [formData, setFormData] = useState({
//     name: "", email: "", mobile: "", city: "",
//     course: "", branch: "", message: "",
//   });

//   const [pickedDay, setPickedDay]         = useState(null);
//   const [pickedTime, setPickedTime]       = useState(null);
//   const [selectedSlotId, setSelectedSlotId] = useState(null);

//   const progress = step === 1 ? 50 : 100;

//   useEffect(() => {
//     if (!showPopup) return;

//     const fetchCourses = async () => {
//       setCoursesLoading(true);
//       try {
//         const res = await api.get("/api/v1/course");
//         const list =
//           Array.isArray(res.data)            ? res.data
//           : Array.isArray(res.data?.data)    ? res.data.data
//           : Array.isArray(res.data?.courses) ? res.data.courses
//           : [];
//         setCourses(list);
//       } catch (err) {
//         console.error("Course fetch error:", err);
//         setCourses([]);
//       } finally {
//         setCoursesLoading(false);
//       }
//     };

//     const fetchAvailableSlots = async () => {
//       setSlotsLoading(true);
//       try {
//         const res = await api.get("/api/v1/slot/available");

//         if (res.data?.success) {
//           const slotsData = res.data.data || [];
//           setBackendSlots(slotsData);

//           const daysMap = {};
//           slotsData.forEach((slot) => {
//             if (!daysMap[slot.date]) daysMap[slot.date] = 0;
//             daysMap[slot.date] += slot.remainingSeats;
//           });

//           const daysList = Object.keys(daysMap).map((date) => ({
//             label: date,
//             count: daysMap[date],
//           }));

//           setUniqueDays(daysList);
//           if (daysList.length > 0) setPickedDay(daysList[0].label);
//         }
//       } catch (err) {
//         console.error("Slots fetch error:", err);
//       } finally {
//         setSlotsLoading(false);
//       }
//     };

//     fetchCourses();
//     fetchAvailableSlots();
//   }, [showPopup]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "course") {
//       const selectedCourse = courses.find(
//         (c) => (c.name || c._id?.toString()) === value
//       );
//       const specs    = selectedCourse?.specializations || [];
//       const specList = specs.map((s) =>
//         typeof s === "string" ? s : s?.name || s?.title || String(s)
//       );
//       setSpecializations(specList);
//       setFormData((p) => ({ ...p, course: value, branch: "" }));
//       return;
//     }

//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSlotSelect = (slotObj) => {
//     setPickedTime(slotObj.time);
//     setSelectedSlotId(slotObj._id);
//   };

//   const handleNext = async () => {
//     if (step === 1) {
//       if (!formData.name || !formData.email || !formData.mobile || !formData.city || !formData.course) {
//         alert("Please fill in all the required details before proceeding.");
//         return;
//       }
//       setStep(2);
//       return;
//     }

//     if (!selectedSlotId) {
//       alert("Please select a time slot to lock your booking.");
//       return;
//     }

//     try {
//       await api.put(`/api/v1/slot/book/${selectedSlotId}`, {
//         studentName:   formData.name,
//         studentEmail:  formData.email,
//         studentMobile: formData.mobile,
//         course:        formData.course,
//         branch:        formData.branch,
//         description:   formData.message,
//         city:          formData.city,
//       });

//       await api.post("/api/v1/getintouch", {
//         ...formData,
//         slot: `${pickedDay} ${pickedTime}`,
//       });

//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error booking the slot. Please try again.");
//     }
//   };

//   const handleClose = () => {
//     setShowPopup(false);
//     setTimeout(() => {
//       setStep(1);
//       setSubmitted(false);
//       setPickedTime(null);
//       setSelectedSlotId(null);
//     }, 300);
//   };

//   return (
//     <>
//       {/* Top header nav */}
//       <div className="topheader-container">
//         <div className="topheader-inner">
//           <div className="topheader-center">
//             <button
//               className="cta-counseling-btn relative flex items-center justify-center gap-2"
//               onClick={() => setShowPopup(true)}
//             >
//               Get Free Career Counseling
//               <span className="relative flex h-4 w-9">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex items-center justify-center rounded-md bg-red-600 text-[10px] font-bold text-white px-1 uppercase tracking-wider">
//                   New
//                 </span>
//               </span>
//             </button>
//           </div>
//           <div className="topheader-right">
//             <nav className="top-nav-links">
//               <Link href="/Aboutus" className="top-link">About</Link>
//               <span className="separator">|</span>
//               <Link href="/contactus" className="top-link">Contact</Link>
//               <span className="separator">|</span>
//               <Link href="/blog" className="top-link">Blog</Link>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Popup Overlay */}
//       {showPopup && (
//         <div
//           className="fixed inset-0 z-[99999] bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-md animate-fadeOverlay"
//           onClick={(e) => e.target === e.currentTarget && handleClose()}
//         >
//           <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden relative shadow-[0_25px_60px_-15px_rgba(30,58,138,0.3)] border border-slate-100 animate-scaleUp p-0.5">

//             {/* ✅ Top gradient bar — 3-color gradient */}
//             <div
//               className="absolute top-0 inset-x-0 h-1.5"
//               style={{ background: "var(--cv-grad-horizontal)" }}
//             ></div>

//             <button
//               onClick={handleClose}
//               className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-[var(--cv-accent)] text-slate-900 hover:text-white transition-all duration-200 border border-slate-200 shadow-sm"
//             >
//               <X size={15} strokeWidth={2.5} />
//             </button>

//             <div className="p-8 pt-9 flex flex-col min-h-[520px]">

//               {!submitted && (
//                 <>
//                   <div className="mb-6">
//                     {/* ✅ Badge — Accent color */}
//                     <div
//                       className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold tracking-wide text-[10px] uppercase shadow-sm border"
//                       style={{
//                         background: "var(--cv-accent-light)",
//                         borderColor: "var(--cv-accent)",
//                         color: "var(--cv-accent-dark)",
//                       }}
//                     >
//                       <Sparkles
//                         size={11}
//                         className="animate-spin-slow"
//                         style={{ color: "var(--cv-accent)" }}
//                       />
//                       Free Expert Mentorship
//                     </div>

//                     {/* ✅ Heading — Primary gradient text on "Dream Career" */}
//                     <h3 className="text-2xl font-black text-slate-950 tracking-tight mt-3">
//                       Lock Your{" "}
//                       <span
//                         style={{
//                           background: "var(--cv-grad-horizontal)",
//                           WebkitBackgroundClip: "text",
//                           WebkitTextFillColor: "transparent",
//                           backgroundClip: "text",
//                         }}
//                       >
//                         Dream Career
//                       </span>{" "}
//                       Slot
//                     </h3>
//                     <p className="text-xs text-slate-900 mt-1 font-semibold">
//                       Talk directly to top university advisors. 100% Free Session.
//                     </p>
//                   </div>

//                   <div className="mb-6 bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-2">
//                       {/* ✅ Step number — Primary */}
//                       <div
//                         className="w-6 h-6 rounded-lg text-white flex items-center justify-center text-xs font-black shadow-sm"
//                         style={{ background: "var(--cv-primary)" }}
//                       >
//                         {step}
//                       </div>
//                       <span className="text-xs font-black text-slate-950">{STEPS[step - 1]}</span>
//                     </div>
//                     <div className="flex-1 max-w-[140px] bg-slate-300 h-2 rounded-full overflow-hidden">
//                       {/* ✅ Progress bar — Primary gradient */}
//                       <div
//                         className="h-full transition-all duration-300 ease-out rounded-full"
//                         style={{
//                           width: `${progress}%`,
//                           background: "var(--cv-grad-horizontal)",
//                         }}
//                       />
//                     </div>
//                     <span className="text-[10px] font-black text-slate-900 tracking-wider">
//                       STEP {step}/2
//                     </span>
//                   </div>
//                 </>
//               )}

//               {submitted ? (
//                 <div className="flex flex-col items-center justify-center gap-5 my-auto text-center py-6 animate-fadeIn">
//                   <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-green-500/20 relative">
//                     <CalendarCheck size={36} />
//                     <span className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full shadow border-2 border-white animate-pulse">
//                       <Sparkle size={12} className="text-slate-900" />
//                     </span>
//                   </div>
//                   <div>
//                     <h4 className="text-2xl font-black text-slate-950">Booking Confirmed! 🎉</h4>
//                     <p className="text-xs text-slate-950 max-w-xs mx-auto mt-1.5 leading-relaxed font-semibold">
//                       Awesome! Your career accelerator session is scheduled. Check your phone & inbox for instructions.
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-green-950 to-green-900 text-white rounded-2xl p-5 text-xs space-y-3 w-full max-w-xs shadow-xl relative overflow-hidden">
//                     <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
//                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
//                       <span className="text-slate-300 font-medium">Chosen Day</span>
//                       <span className="font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded border border-amber-500">{pickedDay}</span>
//                     </div>
//                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
//                       <span className="text-slate-300 font-medium">Time Window</span>
//                       <span className="font-black text-white bg-white/10 px-2 py-0.5 rounded">{pickedTime}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-slate-300 font-medium">Session Mode</span>
//                       <span className="font-extrabold text-blue-400">Live Video Call</span>
//                     </div>
//                   </div>
//                   <p className="text-[11px] font-black text-slate-950 tracking-wide uppercase bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-md">
//                     Hotline Support: 9289712364
//                   </p>
//                 </div>
//               ) : (
//                 <div className="flex-1 flex flex-col justify-between">

//                   {/* STEP 1 */}
//                   {step === 1 && (
//                     <div className="space-y-4 animate-fadeIn">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="relative group/input">
//                           <User size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#1E3A8A] transition-colors z-10" />
//                           <input type="text" name="name" value={formData.name} onChange={handleChange}
//                             placeholder="Your Full Name" required
//                             className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
//                           />
//                         </div>
//                         <div className="relative group/input">
//                           <Mail size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#1E3A8A] transition-colors z-10" />
//                           <input type="email" name="email" value={formData.email} onChange={handleChange}
//                             placeholder="Email Address" required
//                             className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="relative group/input">
//                           <Phone size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#1E3A8A] transition-colors z-10" />
//                           <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
//                             placeholder="Mobile Number" required
//                             className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
//                           />
//                         </div>
//                         <div className="relative group/input">
//                           <MapPin size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#1E3A8A] transition-colors z-10" />
//                           <input type="text" name="city" value={formData.city} onChange={handleChange}
//                             placeholder="Current City" required
//                             className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="relative group/input">
//                           <GraduationCap size={16} className="absolute left-4 top-3.5 text-slate-950 z-10 group-focus-within/input:text-[#1E3A8A] transition-colors" />
//                           <select name="course" value={formData.course} onChange={handleChange} required disabled={coursesLoading}
//                             className="w-full pl-12 pr-8 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl appearance-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 font-bold cursor-pointer disabled:opacity-60"
//                           >
//                             <option value="">{coursesLoading ? "Loading courses…" : "Target Course"}</option>
//                             {courses.map((c) => (
//                               <option key={c._id} value={c.name || c._id}>{c.name || c.title || c._id}</option>
//                             ))}
//                           </select>
//                           <div className="absolute right-4 top-4.5 w-2 h-2 border-r-2 border-b-2 border-slate-950 pointer-events-none transform rotate-45"></div>
//                         </div>

//                         <div className="relative group/input">
//                           <Tag size={16} className="absolute left-4 top-3.5 text-slate-950 z-10 group-focus-within/input:text-[#1E3A8A] transition-colors" />
//                           <select name="branch" value={formData.branch} onChange={handleChange} disabled={!specializations.length}
//                             className="w-full pl-12 pr-8 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl appearance-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 font-bold cursor-pointer disabled:opacity-50"
//                           >
//                             <option value="">
//                               {!formData.course ? "Select course first" : specializations.length ? "Specialization / Branch" : "No specializations"}
//                             </option>
//                             {specializations.map((sp, i) => (
//                               <option key={i} value={sp}>{sp}</option>
//                             ))}
//                           </select>
//                           <div className="absolute right-4 top-4.5 w-2 h-2 border-r-2 border-b-2 border-slate-950 pointer-events-none transform rotate-45"></div>
//                         </div>
//                       </div>

//                       <div className="relative group/input">
//                         <MessageSquare size={16} className="absolute left-4 top-4 text-slate-950 group-focus-within/input:text-[#1E3A8A] transition-colors z-10" />
//                         <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
//                           placeholder="What is your biggest confusion or career goal right now?"
//                           className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl resize-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 placeholder-slate-500 font-bold"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* STEP 2 */}
//                   {step === 2 && (
//                     <div className="space-y-4 animate-fadeIn">
//                       {slotsLoading ? (
//                         <div className="text-center py-12 text-sm text-slate-950 flex flex-col items-center justify-center gap-3">
//                           <div className="w-6 h-6 border-2 border-slate-300 border-t-[#1E3A8A] rounded-full animate-spin"></div>
//                           <span className="font-bold">Finding freshly available slots...</span>
//                         </div>
//                       ) : uniqueDays.length === 0 ? (
//                         <div className="text-center py-8 text-sm text-amber-950 bg-amber-50 border-2 border-amber-300 rounded-xl font-bold">
//                           No direct slots open right now. Go ahead and book to receive a VIP instant callback.
//                         </div>
//                       ) : (
//                         <>
//                           {/* Day Picker */}
//                           <div className="grid grid-cols-2 gap-3">
//                             {uniqueDays.map(({ label, count }) => (
//                               <button key={label} type="button"
//                                 onClick={() => { setPickedDay(label); setPickedTime(null); setSelectedSlotId(null); }}
//                                 className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden ${
//                                   pickedDay === label
//                                     ? "bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md scale-[1.01]"
//                                     : "bg-white border-slate-300 text-slate-950 hover:border-slate-400"
//                                 }`}
//                               >
//                                 <div className="font-black text-sm tracking-tight">{label}</div>
//                                 <div className={`text-xs font-black mt-1 ${pickedDay === label ? "text-amber-400" : "text-orange-600"}`}>
//                                   🔥 {count} Seat{count !== 1 ? "s" : ""} Left
//                                 </div>
//                               </button>
//                             ))}
//                           </div>

//                           {/* Time Grid */}
//                           <div className="grid grid-cols-3 gap-2.5 pt-2">
//                             {backendSlots
//                               .filter((slot) => slot.date === pickedDay && slot.remainingSeats > 0)
//                               .map((slot) => (
//                                 <button key={slot._id} type="button"
//                                   onClick={() => handleSlotSelect(slot)}
//                                   className={`py-3 rounded-xl border-2 text-xs font-black transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
//                                     pickedTime === slot.time
//                                       ? "bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md scale-[1.03]"
//                                       : "bg-white border-slate-300 text-slate-950 hover:border-slate-400"
//                                   }`}
//                                 >
//                                   <span className="flex items-center gap-1">
//                                     {pickedTime === slot.time && <Check size={11} strokeWidth={3} />}
//                                     {slot.time}
//                                   </span>
//                                   <span className={`text-[10px] font-bold ${pickedTime === slot.time ? "text-blue-200" : "text-slate-400"}`}>
//                                     {slot.remainingSeats} left
//                                   </span>
//                                 </button>
//                               ))}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Footer */}
//                   <div className="flex items-center justify-between mt-8 pt-4 border-t-2 border-slate-100">
//                     <div className="flex items-center gap-1 text-xs font-bold text-slate-950">
//                       <Lock size={13} className="text-slate-950" />
//                       100% Secure & Private
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {step > 1 && (
//                         <button type="button" onClick={() => setStep((s) => s - 1)}
//                           className="px-4 py-2.5 text-xs font-black text-slate-950 hover:text-red-600 transition-colors"
//                         >
//                           Back
//                         </button>
//                       )}
//                       <button
//                         type="button"
//                         onClick={handleNext}
//                         className="cta-confirm-btn flex items-center gap-1.5 px-6 py-3.5 text-white rounded-xl text-xs font-black active:scale-[0.97]"
//                       >
//                         {step === 2 ? "Confirm My Slot" : "Choose Your Time Slot"}
//                         <ArrowRight size={13} strokeWidth={3} />
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               )}
//             </div>
//           </div>

//           <style jsx>{`
//             @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
//             @keyframes scaleUp { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
//             @keyframes fadeIn { from { opacity: 0; transform: scale(0.99) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
//             .animate-fadeOverlay { animation: fadeOverlay 0.2s ease-out forwards; }
//             .animate-scaleUp { animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
//             .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
//             .animate-spin-slow { animation: spin 4s linear infinite; }
//           `}</style>
//         </div>
//       )}
//     </>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   X,
//   User,
//   Mail,
//   Phone,
//   GraduationCap,
//   MapPin,
//   ArrowRight,
//   ArrowLeft,
//   Tag,
//   MessageSquare,
//   Lock,
//   CalendarCheck,
//   Check,
//   ChevronDown,
//   Loader2,
//   AlertCircle,
//   Clock,
//   Video,
//   BadgeCheck,
// } from "lucide-react";
// import api from "@/utlis/api";
// import "./TopHeader.css";

// const STEPS = ["Your Details", "Pick a Slot"];

// export default function QueryPopup() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [step, setStep] = useState(1);
//   const [submitted, setSubmitted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const [courses, setCourses] = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(false);
//   const [specializations, setSpecializations] = useState([]);

//   const [backendSlots, setBackendSlots] = useState([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [uniqueDays, setUniqueDays] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     city: "",
//     course: "",
//     branch: "",
//     message: "",
//   });

//   const [pickedDay, setPickedDay] = useState(null);
//   const [pickedTime, setPickedTime] = useState(null);
//   const [selectedSlotId, setSelectedSlotId] = useState(null);

//   useEffect(() => {
//     if (!showPopup) return;

//     const fetchCourses = async () => {
//       setCoursesLoading(true);
//       try {
//         const res = await api.get("/api/v1/course");
//         const list = Array.isArray(res.data)
//           ? res.data
//           : Array.isArray(res.data?.data)
//           ? res.data.data
//           : Array.isArray(res.data?.courses)
//           ? res.data.courses
//           : [];
//         setCourses(list);
//       } catch (err) {
//         console.error("Course fetch error:", err);
//         setCourses([]);
//       } finally {
//         setCoursesLoading(false);
//       }
//     };

//     const fetchAvailableSlots = async () => {
//       setSlotsLoading(true);
//       try {
//         const res = await api.get("/api/v1/slot/available");

//         if (res.data?.success) {
//           const slotsData = res.data.data || [];
//           setBackendSlots(slotsData);

//           const daysMap = {};
//           slotsData.forEach((slot) => {
//             if (!daysMap[slot.date]) daysMap[slot.date] = 0;
//             daysMap[slot.date] += slot.remainingSeats;
//           });

//           const daysList = Object.keys(daysMap).map((date) => ({
//             label: date,
//             count: daysMap[date],
//           }));

//           setUniqueDays(daysList);
//           if (daysList.length > 0) setPickedDay(daysList[0].label);
//         }
//       } catch (err) {
//         console.error("Slots fetch error:", err);
//       } finally {
//         setSlotsLoading(false);
//       }
//     };

//     fetchCourses();
//     fetchAvailableSlots();
//   }, [showPopup]);

//   // Popup khula ho to body scroll lock + Escape se close
//   useEffect(() => {
//     if (!showPopup) return;

//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const onKey = (e) => {
//       if (e.key === "Escape") handleClose();
//     };
//     window.addEventListener("keydown", onKey);

//     return () => {
//       document.body.style.overflow = prevOverflow;
//       window.removeEventListener("keydown", onKey);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showPopup]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setErrorMsg("");

//     if (name === "course") {
//       const selectedCourse = courses.find(
//         (c) => (c.name || c._id?.toString()) === value
//       );
//       const specs = selectedCourse?.specializations || [];
//       const specList = specs.map((s) =>
//         typeof s === "string" ? s : s?.name || s?.title || String(s)
//       );
//       setSpecializations(specList);
//       setFormData((p) => ({ ...p, course: value, branch: "" }));
//       return;
//     }

//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSlotSelect = (slotObj) => {
//     setErrorMsg("");
//     setPickedTime(slotObj.time);
//     setSelectedSlotId(slotObj._id);
//   };

//   const handleNext = async () => {
//     if (submitting) return;

//     if (step === 1) {
//       if (
//         !formData.name ||
//         !formData.email ||
//         !formData.mobile ||
//         !formData.city ||
//         !formData.course
//       ) {
//         setErrorMsg("Please fill in all the required details to continue.");
//         return;
//       }
//       setErrorMsg("");
//       setStep(2);
//       return;
//     }

//     if (!selectedSlotId) {
//       setErrorMsg("Please select a time slot to confirm your booking.");
//       return;
//     }

//     setSubmitting(true);
//     setErrorMsg("");

//     try {
//       await api.put(`/api/v1/slot/book/${selectedSlotId}`, {
//         studentName: formData.name,
//         studentEmail: formData.email,
//         studentMobile: formData.mobile,
//         course: formData.course,
//         branch: formData.branch,
//         description: formData.message,
//         city: formData.city,
//       });

//       await api.post("/api/v1/getintouch", {
//         ...formData,
//         slot: `${pickedDay} ${pickedTime}`,
//       });

//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
//       setErrorMsg(
//         err.response?.data?.message ||
//           "Error booking the slot. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     setShowPopup(false);
//     setTimeout(() => {
//       setStep(1);
//       setSubmitted(false);
//       setPickedTime(null);
//       setSelectedSlotId(null);
//       setErrorMsg("");
//     }, 300);
//   };

//   // Common input styles (brand tokens)
//   const inputCls =
//     "box-border block h-11 w-full min-w-0 rounded-lg border border-neutral-border bg-white pl-10 pr-3 text-base text-neutral-dark outline-none transition placeholder:text-neutral-mid focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm";
//   const iconCls =
//     "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-mid transition-colors group-focus-within/input:text-accent";

//   const visibleTimes = backendSlots.filter(
//     (slot) => slot.date === pickedDay && slot.remainingSeats > 0
//   );

//   return (
//     <>
//       {/* Top header nav */}
//       <div className="topheader-container">
//         <div className="topheader-inner">
//           <div className="topheader-center">
//             <button
//               className="cta-counseling-btn relative flex items-center justify-center gap-2"
//               onClick={() => setShowPopup(true)}
//             >
//               Get Free Career Counseling
//               <span className="relative flex h-4 w-9">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex items-center justify-center rounded-md bg-red-600 text-[10px] font-bold text-white px-1 uppercase tracking-wider">
//                   New
//                 </span>
//               </span>
//             </button>
//           </div>
//           <div className="topheader-right">
//             <nav className="top-nav-links">
//               <Link href="/Aboutus" className="top-link">About</Link>
//               <span className="separator">|</span>
//               <Link href="/contactus" className="top-link">Contact</Link>
//               <span className="separator">|</span>
//               <Link href="/blog" className="top-link">Blog</Link>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div
//           className="animate-fadeOverlay fixed inset-0 z-[99999] flex items-end justify-center bg-neutral-dark/60 backdrop-blur-sm sm:items-center sm:p-4"
//           onClick={(e) => e.target === e.currentTarget && handleClose()}
//         >
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="slot-title"
//             className="animate-scaleUp relative flex max-h-[94dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4)] sm:max-h-[90dvh] sm:rounded-2xl md:max-w-4xl md:flex-row"
//           >
//             {/* Close button */}
//             <button
//               type="button"
//               onClick={handleClose}
//               aria-label="Close"
//               className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-light p-0 text-neutral-mid shadow-sm transition hover:bg-accent hover:text-white"
//             >
//               <X size={16} />
//             </button>

//             {/* ============ LEFT PANEL (desktop / landscape) ============ */}
//             <aside className="relative hidden w-72 shrink-0 flex-col justify-between overflow-hidden bg-primary p-7 text-white md:flex lg:w-80">
//               <div
//                 aria-hidden="true"
//                 className="absolute inset-x-0 top-0 h-1"
//                 style={{ background: "var(--cv-grad-horizontal)" }}
//               />
//               <div
//                 aria-hidden="true"
//                 className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5"
//               />

//               <div className="relative">
//                 <div className="cv-icon-gradient h-12 w-12">
//                   <CalendarCheck size={22} />
//                 </div>

//                 <h3
//                   id="slot-title"
//                   className="m-0 mt-5 text-xl font-bold leading-snug"
//                   style={{ color: "#ffffff" }}
//                 >
//                   Book Your Free Counseling
//                 </h3>
//                 <p className="m-0 mt-2 text-sm leading-6 text-white/75">
//                   Talk directly to top university advisors. 100% free session.
//                 </p>

//                 {/* Vertical steps */}
//                 {!submitted && (
//                   <ol className="m-0 mt-8 list-none space-y-5 p-0">
//                     {STEPS.map((label, i) => {
//                       const n = i + 1;
//                       const active = step === n;
//                       const done = step > n;
//                       return (
//                         <li key={label} className="flex items-center gap-3">
//                           <span
//                             className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
//                               done
//                                 ? "bg-emerald-500 text-white"
//                                 : active
//                                 ? "bg-accent text-white ring-4 ring-accent/25"
//                                 : "bg-white/15 text-white/70"
//                             }`}
//                           >
//                             {done ? <Check size={14} strokeWidth={3} /> : n}
//                           </span>
//                           <span
//                             className={`text-sm ${
//                               active
//                                 ? "font-semibold text-white"
//                                 : "text-white/70"
//                             }`}
//                           >
//                             {label}
//                           </span>
//                         </li>
//                       );
//                     })}
//                   </ol>
//                 )}

//                 <ul className="m-0 mt-8 list-none space-y-2.5 p-0 text-xs text-white/80">
//                   <li className="flex items-center gap-2">
//                     <BadgeCheck size={15} className="shrink-0 text-accent" />
//                     Unbiased expert guidance
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <Video size={15} className="shrink-0 text-accent" />
//                     Live video call session
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <Lock size={15} className="shrink-0 text-accent" />
//                     100% secure &amp; private
//                   </li>
//                 </ul>
//               </div>

//               <p className="relative m-0 mt-8 text-xs text-white/70">
//                 Need help? Call{" "}
//                 <a
//                   href="tel:+919289712364"
//                   className="font-semibold text-white hover:underline"
//                 >
//                   +91 9289712364
//                 </a>
//               </p>
//             </aside>
//             {/* ============ RIGHT PANEL ============ */}
//             <div className="flex min-h-0 min-w-0 flex-1 flex-col">
//               {/* Mobile top bar + header */}
//               <div
//                 className="h-1 w-full shrink-0 md:hidden"
//                 style={{ background: "var(--cv-grad-horizontal)" }}
//               />
//               <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pr-14 pt-4 md:hidden">
//                 <div className="cv-icon-gradient h-10 w-10 shrink-0">
//                   <CalendarCheck size={19} />
//                 </div>
//                 <div className="min-w-0">
//                   <h3 className="m-0 text-base font-bold leading-tight text-neutral-dark">
//                     Book Your Free Counseling
//                   </h3>
//                   <p className="m-0 mt-0.5 text-xs text-neutral-mid">
//                     100% free session with advisors.
//                   </p>
//                 </div>
//               </div>

//               {/* Mobile steps */}
//               {!submitted && (
//                 <div className="shrink-0 px-5 pb-3 md:hidden">
//                   <div className="flex items-center gap-2">
//                     {STEPS.map((label, i) => {
//                       const n = i + 1;
//                       const active = step === n;
//                       const done = step > n;
//                       return (
//                         <div
//                           key={label}
//                           className={`flex items-center gap-2 ${
//                             i === 0 ? "" : "min-w-0 flex-1"
//                           }`}
//                         >
//                           {i > 0 && (
//                             <div
//                               className="h-0.5 flex-1 rounded-full"
//                               style={{
//                                 background:
//                                   step >= n
//                                     ? "var(--cv-grad-horizontal)"
//                                     : "var(--cv-neutral-border)",
//                               }}
//                             />
//                           )}
//                           <div className="flex shrink-0 items-center gap-2">
//                             <span
//                               className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
//                                 done || active
//                                   ? "bg-primary text-white"
//                                   : "bg-neutral-border text-neutral-mid"
//                               }`}
//                             >
//                               {done ? <Check size={13} strokeWidth={3} /> : n}
//                             </span>
//                             <span
//                               className={`text-xs ${
//                                 active
//                                   ? "font-semibold text-neutral-dark"
//                                   : "text-neutral-mid"
//                               }`}
//                             >
//                               {label}
//                             </span>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//               {/* Desktop heading for right panel */}
//               {!submitted && (
//                 <div className="hidden shrink-0 px-7 pb-3 pt-6 pr-14 md:block">
//                   <p className="m-0 text-xs font-semibold uppercase tracking-wider text-accent-dark">
//                     Step {step} of 2
//                   </p>
//                   <h4 className="m-0 mt-1 text-lg font-bold text-neutral-dark">
//                     {step === 1
//                       ? "Tell us about yourself"
//                       : "Choose a convenient slot"}
//                   </h4>
//                 </div>
//               )}
//               {/* Body (scrollable) */}
//               <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-neutral-border px-5 py-5 md:border-t-0 md:px-7 md:pt-2">
//                 {errorMsg && (
//                   <div
//                     role="alert"
//                     className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
//                   >
//                     <AlertCircle size={15} className="mt-0.5 shrink-0" />
//                     <span className="min-w-0">{errorMsg}</span>
//                   </div>
//                 )}
//                 {/* SUCCESS */}
//                 {submitted ? (
//                   <div className="animate-fadeIn flex flex-col items-center py-6 text-center md:py-10">
//                     <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                       <Check size={32} strokeWidth={2.5} />
//                     </div>
//                     <h4 className="m-0 text-xl font-bold text-neutral-dark">
//                       Booking Confirmed!
//                     </h4>
//                     <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-neutral-mid">
//                       Your counseling session is scheduled. Check your phone
//                       and inbox for the details.
//                     </p>

//                     <div className="mt-5 w-full max-w-xs divide-y divide-neutral-border rounded-xl border border-neutral-border text-left">
//                       <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
//                         <span className="text-neutral-mid">Day</span>
//                         <span className="font-semibold text-neutral-dark">
//                           {pickedDay}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
//                         <span className="text-neutral-mid">Time</span>
//                         <span className="font-semibold text-neutral-dark">
//                           {pickedTime}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
//                         <span className="text-neutral-mid">Mode</span>
//                         <span className="font-semibold text-primary">
//                           Live Video Call
//                         </span>
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={handleClose}
//                       className="cv-btn-cta mt-6 min-h-11 w-full max-w-xs px-6 text-sm"
//                     >
//                       Done
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     {/* STEP 1 */}
//                     {step === 1 && (
//                       <div className="animate-fadeIn space-y-3.5">
//                         <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 [&>*]:min-w-0">
//                           <div className="group/input relative">
//                             <User size={16} className={iconCls} />
//                             <input
//                               type="text"
//                               name="name"
//                               value={formData.name}
//                               onChange={handleChange}
//                               placeholder="Full Name *"
//                               className={inputCls}
//                             />
//                           </div>
//                           <div className="group/input relative">
//                             <Mail size={16} className={iconCls} />
//                             <input
//                               type="email"
//                               name="email"
//                               value={formData.email}
//                               onChange={handleChange}
//                               placeholder="Email Address *"
//                               className={inputCls}
//                             />
//                           </div>
//                           <div className="group/input relative">
//                             <Phone size={16} className={iconCls} />
//                             <input
//                               type="tel"
//                               name="mobile"
//                               value={formData.mobile}
//                               onChange={handleChange}
//                               placeholder="Mobile Number *"
//                               className={inputCls}
//                             />
//                           </div>
//                           <div className="group/input relative">
//                             <MapPin size={16} className={iconCls} />
//                             <input
//                               type="text"
//                               name="city"
//                               value={formData.city}
//                               onChange={handleChange}
//                               placeholder="Current City *"
//                               className={inputCls}
//                             />
//                           </div>
//                           <div className="group/input relative">
//                             <GraduationCap size={16} className={iconCls} />
//                             <select
//                               name="course"
//                               value={formData.course}
//                               onChange={handleChange}
//                               disabled={coursesLoading}
//                               className={`${inputCls} cursor-pointer appearance-none pr-9 disabled:opacity-60`}
//                             >
//                               <option value="">
//                                 {coursesLoading
//                                   ? "Loading courses…"
//                                   : "Target Course *"}
//                               </option>
//                               {courses.map((c) => (
//                                 <option key={c._id} value={c.name || c._id}>
//                                   {c.name || c.title || c._id}
//                                 </option>
//                               ))}
//                             </select>
//                             <ChevronDown
//                               size={16}
//                               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-mid"
//                             />
//                           </div>
//                           <div className="group/input relative">
//                             <Tag size={16} className={iconCls} />
//                             <select
//                               name="branch"
//                               value={formData.branch}
//                               onChange={handleChange}
//                               disabled={!specializations.length}
//                               className={`${inputCls} cursor-pointer appearance-none pr-9 disabled:opacity-50`}
//                             >
//                               <option value="">
//                                 {!formData.course
//                                   ? "Select course first"
//                                   : specializations.length
//                                   ? "Specialization / Branch"
//                                   : "No specializations"}
//                               </option>
//                               {specializations.map((sp, i) => (
//                                 <option key={i} value={sp}>
//                                   {sp}
//                                 </option>
//                               ))}
//                             </select>
//                             <ChevronDown
//                               size={16}
//                               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-mid"
//                             />
//                           </div>
//                         </div>
//                         <div className="group/input relative">
//                           <MessageSquare
//                             size={16}
//                             className="pointer-events-none absolute left-3 top-3.5 text-neutral-mid transition-colors group-focus-within/input:text-accent"
//                           />
//                           <textarea
//                             name="message"
//                             value={formData.message}
//                             onChange={handleChange}
//                             rows={2}
//                             placeholder="Your career goal or biggest confusion (optional)"
//                             className="box-border block w-full min-w-0 resize-none rounded-lg border border-neutral-border bg-white py-3 pl-10 pr-3 text-base text-neutral-dark outline-none transition placeholder:text-neutral-mid focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm"
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {/* STEP 2 */}
//                     {step === 2 && (
//                       <div className="animate-fadeIn">
//                         {slotsLoading ? (
//                           <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-neutral-mid">
//                             <Loader2
//                               size={24}
//                               className="animate-spin text-accent"
//                             />
//                             Finding available slots...
//                           </div>
//                         ) : uniqueDays.length === 0 ? (
//                           <div className="rounded-lg border border-accent/30 bg-accent-light px-4 py-6 text-center text-sm leading-6 text-accent-dark">
//                             No direct slots open right now. Go ahead and book
//                             to receive an instant callback.
//                           </div>
//                         ) : (
//                           <div className="grid grid-cols-1 gap-5 md:grid-cols-[190px_1fr] md:gap-6">
//                             {/* Day */}
//                             <div className="min-w-0">
//                               <p className="m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-mid">
//                                 Select Day
//                               </p>
//                               <div className="grid grid-cols-2 gap-2.5 md:grid-cols-1">
//                                 {uniqueDays.map(({ label, count }) => {
//                                   const active = pickedDay === label;
//                                   return (
//                                     <button
//                                       key={label}
//                                       type="button"
//                                       onClick={() => {
//                                         setPickedDay(label);
//                                         setPickedTime(null);
//                                         setSelectedSlotId(null);
//                                         setErrorMsg("");
//                                       }}
//                                       className={`min-w-0 rounded-xl border p-3 text-left transition ${
//                                         active
//                                           ? "border-primary bg-primary text-white shadow-md"
//                                           : "border-neutral-border bg-white text-neutral-dark hover:border-accent"
//                                       }`}
//                                     >
//                                       <div className="truncate text-sm font-semibold">
//                                         {label}
//                                       </div>
//                                       <div
//                                         className={`mt-1 text-xs ${
//                                           active
//                                             ? "text-orange-200"
//                                             : "text-accent-dark"
//                                         }`}
//                                       >
//                                         {count} seat{count !== 1 ? "s" : ""} left
//                                       </div>
//                                     </button>
//                                   );
//                                 })}
//                               </div>
//                             </div>

//                             {/* Time */}
//                             <div className="min-w-0">
//                               <p className="m-0 mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-mid">
//                                 <Clock size={13} />
//                                 Select Time
//                               </p>

//                               {visibleTimes.length === 0 ? (
//                                 <p className="m-0 rounded-lg border border-dashed border-neutral-border px-3 py-6 text-center text-xs text-neutral-mid">
//                                   No time slots available for this day.
//                                 </p>
//                               ) : (
//                                 <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
//                                   {visibleTimes.map((slot) => {
//                                     const active = pickedTime === slot.time;
//                                     return (
//                                       <button
//                                         key={slot._id}
//                                         type="button"
//                                         onClick={() => handleSlotSelect(slot)}
//                                         className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border py-2.5 text-xs transition ${
//                                           active
//                                             ? "border-primary bg-primary text-white shadow-md"
//                                             : "border-neutral-border bg-white text-neutral-dark hover:border-accent hover:bg-accent-light"
//                                         }`}
//                                       >
//                                         <span className="flex items-center gap-1 font-semibold">
//                                           {active && (
//                                             <Check size={12} strokeWidth={3} />
//                                           )}
//                                           {slot.time}
//                                         </span>
//                                         <span
//                                           className={`text-[10px] ${
//                                             active
//                                               ? "text-blue-100"
//                                               : "text-neutral-mid"
//                                           }`}
//                                         >
//                                           {slot.remainingSeats} left
//                                         </span>
//                                       </button>
//                                     );
//                                   })}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//               {/* Footer */}
//               {!submitted && (
//                 <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-border bg-white px-5 py-3.5 md:px-7">
//                   <div className="hidden items-center gap-1.5 text-xs text-neutral-mid lg:flex">
//                     <Lock size={13} />
//                     100% secure &amp; private
//                   </div>
//                   <div className="flex w-full items-center gap-2 lg:w-auto lg:justify-end">
//                     {step > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setErrorMsg("");
//                           setStep((s) => s - 1);
//                         }}
//                         disabled={submitting}
//                         className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-neutral-border bg-white px-4 text-sm font-medium text-neutral-mid transition hover:bg-neutral-light hover:text-neutral-dark disabled:opacity-50"
//                       >
//                         <ArrowLeft size={15} />
//                         Back
//                       </button>
//                     )}
//                     <button
//                       type="button"
//                       onClick={handleNext}
//                       disabled={submitting}
//                       className="cv-btn-cta inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-6 text-sm lg:flex-none"
//                     >
//                       {submitting ? (
//                         <>
//                           <Loader2 size={16} className="animate-spin" />
//                           Booking...
//                         </>
//                       ) : (
//                         <>
//                           {step === 2 ? "Confirm My Slot" : "Choose Time Slot"}
//                           <ArrowRight size={15} />
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <style jsx>{`
//             @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
//             @keyframes scaleUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
//             @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
//             .animate-fadeOverlay { animation: fadeOverlay 0.2s ease-out forwards; }
//             .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
//             .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
//           `}</style>
//         </div>
//       )}
//     </>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X, User, Mail, Phone, GraduationCap, MapPin,
  ArrowRight, ArrowLeft, Tag, MessageSquare,
  Lock, CalendarCheck, Check, ChevronDown, Loader2,
  AlertCircle, Clock, Video, BadgeCheck,
} from "lucide-react";
import api from "@/utlis/api";
import "./TopHeader.css";

const STEPS = ["Your Details", "Pick a Slot"];

export default function QueryPopup() {
  const [showPopup, setShowPopup]     = useState(false);
  const [step, setStep]               = useState(1);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");

  const [courses, setCourses]                 = useState([]);
  const [coursesLoading, setCoursesLoading]   = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const [backendSlots, setBackendSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [uniqueDays, setUniqueDays]     = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", city: "",
    course: "", branch: "", message: "",
  });

  const [pickedDay, setPickedDay]           = useState(null);
  const [pickedTime, setPickedTime]         = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  /* ============================================================
     FETCH COURSES + SLOTS
  ============================================================ */
  useEffect(() => {
    if (!showPopup) return;

    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await api.get("/api/v1/course");
        const list =
          Array.isArray(res.data)            ? res.data
          : Array.isArray(res.data?.data)    ? res.data.data
          : Array.isArray(res.data?.courses) ? res.data.courses
          : [];
        setCourses(list);
      } catch (err) {
        console.error("Course fetch error:", err);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    const fetchAvailableSlots = async () => {
      setSlotsLoading(true);
      try {
        console.log("🔵 Fetching slots...");
        const res = await api.get("/api/v1/slot/available");

        console.log("🟢 RAW RESPONSE:", res);
        console.log("🟢 res.data:", res.data);
        console.log("🟢 res.data.data:", res.data?.data);
        console.log("🟢 Is Array?", Array.isArray(res.data));

        /* -------- HAR POSSIBLE SHAPE HANDLE -------- */
        let slotsData = [];
        if (Array.isArray(res.data)) {
          slotsData = res.data;
        } else if (Array.isArray(res.data?.data)) {
          slotsData = res.data.data;
        } else if (Array.isArray(res.data?.slots)) {
          slotsData = res.data.slots;
        } else if (Array.isArray(res.data?.availableSlots)) {
          slotsData = res.data.availableSlots;
        } else if (Array.isArray(res.data?.results)) {
          slotsData = res.data.results;
        } else if (Array.isArray(res.data?.data?.slots)) {
          slotsData = res.data.data.slots;
        } else {
          console.warn("⚠️ Unknown response shape:", res.data);
        }

        console.log("🟢 EXTRACTED SLOTS:", slotsData);
        setBackendSlots(slotsData);

        /* -------- GROUP BY DAY -------- */
        const daysMap = {};
        slotsData.forEach((slot) => {
          console.log("🔹 Slot:", slot);

          // Har possible field name try karo
          const seats =
            slot.remainingSeats ??
            slot.seats ??
            slot.availableSeats ??
            slot.capacity ??
            0;

          const date =
            slot.date ??
            slot.slotDate ??
            slot.day ??
            null;

          if (date && seats > 0) {
            if (!daysMap[date]) daysMap[date] = 0;
            daysMap[date] += seats;
          }
        });

        const daysList = Object.keys(daysMap).map((date) => ({
          label: date,
          count: daysMap[date],
        }));

        console.log("🟢 UNIQUE DAYS:", daysList);

        setUniqueDays(daysList);
        if (daysList.length > 0) setPickedDay(daysList[0].label);
      } catch (err) {
        console.error("🔴 SLOTS FETCH ERROR:", err);
        console.error("🔴 Error response:", err.response);
        console.error("🔴 Error status:", err.response?.status);
        console.error("🔴 Error data:", err.response?.data);
        setBackendSlots([]);
        setUniqueDays([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchCourses();
    fetchAvailableSlots();
  }, [showPopup]);

  /* --------- Body scroll lock + ESC --------- */
  useEffect(() => {
    if (!showPopup) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup]);

  /* ============================================================
     HANDLERS
  ============================================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg("");

    if (name === "course") {
      const selectedCourse = courses.find(
        (c) => (c.name || c._id?.toString()) === value
      );
      const specs = selectedCourse?.specializations || [];
      const specList = specs.map((s) =>
        typeof s === "string" ? s : s?.name || s?.title || String(s)
      );
      setSpecializations(specList);
      setFormData((p) => ({ ...p, course: value, branch: "" }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSlotSelect = (slotObj) => {
    setErrorMsg("");
    setPickedTime(slotObj.time || slotObj.slotTime || "");
    setSelectedSlotId(slotObj._id || slotObj.id);
  };

  const handleNext = async () => {
    if (submitting) return;

    if (step === 1) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.mobile ||
        !formData.city ||
        !formData.course
      ) {
        setErrorMsg("Please fill in all the required details to continue.");
        return;
      }
      setErrorMsg("");
      setStep(2);
      return;
    }

    if (!selectedSlotId) {
      setErrorMsg("Please select a time slot to confirm your booking.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      await api.put(`/api/v1/slot/book/${selectedSlotId}`, {
        studentName:   formData.name,
        studentEmail:  formData.email,
        studentMobile: formData.mobile,
        course:        formData.course,
        branch:        formData.branch,
        description:   formData.message,
        city:          formData.city,
      });

      await api.post("/api/v1/getintouch", {
        ...formData,
        slot: `${pickedDay} ${pickedTime}`,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
        "Error booking the slot. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setPickedTime(null);
      setSelectedSlotId(null);
      setErrorMsg("");
    }, 300);
  };

  /* ============================================================
     DERIVED
  ============================================================ */
  const visibleTimes = backendSlots.filter((slot) => {
    const seatCount =
      slot.remainingSeats ?? slot.seats ?? slot.availableSeats ?? 0;
    const slotDate = slot.date ?? slot.slotDate ?? slot.day;
    return slotDate === pickedDay && seatCount > 0;
  });

  const inputCls =
    "box-border block h-11 w-full min-w-0 rounded-lg border border-neutral-border bg-white pl-10 pr-3 text-base text-neutral-dark outline-none transition placeholder:text-neutral-mid focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm font-semibold";
  const iconCls =
    "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-mid transition-colors group-focus-within/input:text-accent";

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="topheader-container">
        <div className="topheader-inner">
          <div className="topheader-center">
            <button
              className="cta-counseling-btn relative flex items-center justify-center gap-2"
              onClick={() => setShowPopup(true)}
            >
              Get Free Career Counseling
              <span className="relative flex h-4 w-9">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex items-center justify-center rounded-md bg-red-600 text-[10px] font-bold text-white px-1 uppercase tracking-wider">
                  New
                </span>
              </span>
            </button>
          </div>
          <div className="topheader-right">
            <nav className="top-nav-links">
              <Link href="/Aboutus" className="top-link">About</Link>
              <span className="separator">|</span>
              <Link href="/contactus" className="top-link">Contact</Link>
              <span className="separator">|</span>
              <Link href="/blog" className="top-link">Blog</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div
          className="animate-fadeOverlay fixed inset-0 z-[99999] flex items-end justify-center bg-neutral-dark/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="slot-title"
            className="animate-scaleUp relative flex max-h-[94dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4)] sm:max-h-[90dvh] sm:rounded-2xl md:max-w-4xl md:flex-row"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-light p-0 text-neutral-mid shadow-sm transition hover:bg-accent hover:text-white"
            >
              <X size={16} />
            </button>

            {/* -------- LEFT PANEL (desktop) -------- */}
            <aside className="relative hidden w-72 shrink-0 flex-col justify-between overflow-hidden bg-primary p-7 text-white md:flex lg:w-80">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: "var(--cv-grad-horizontal)" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5"
              />
              <div className="relative">
                <div className="cv-icon-gradient h-12 w-12">
                  <CalendarCheck size={22} />
                </div>
                <h3
                  id="slot-title"
                  className="m-0 mt-5 text-xl font-bold leading-snug"
                  style={{ color: "#fff" }}
                >
                  Book Your Free Counseling
                </h3>
                <p className="m-0 mt-2 text-sm leading-6 text-white/75">
                  Talk directly to top university advisors. 100% free session.
                </p>

                {!submitted && (
                  <ol className="m-0 mt-8 list-none space-y-5 p-0">
                    {STEPS.map((label, i) => {
                      const n = i + 1;
                      const active = step === n;
                      const done = step > n;
                      return (
                        <li key={label} className="flex items-center gap-3">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
                              done
                                ? "bg-emerald-500 text-white"
                                : active
                                ? "bg-accent text-white ring-4 ring-accent/25"
                                : "bg-white/15 text-white/70"
                            }`}
                          >
                            {done ? <Check size={14} strokeWidth={3} /> : n}
                          </span>
                          <span
                            className={`text-sm ${
                              active
                                ? "font-semibold text-white"
                                : "text-white/70"
                            }`}
                          >
                            {label}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <ul className="m-0 mt-8 list-none space-y-2.5 p-0 text-xs text-white/80">
                  <li className="flex items-center gap-2">
                    <BadgeCheck size={15} className="shrink-0 text-accent" />
                    Unbiased expert guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <Video size={15} className="shrink-0 text-accent" />
                    Live video call session
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock size={15} className="shrink-0 text-accent" />
                    100% secure &amp; private
                  </li>
                </ul>
              </div>

              <p className="relative m-0 mt-8 text-xs text-white/70">
                Need help? Call{" "}
                <a
                  href="tel:+919289712364"
                  className="font-semibold text-white hover:underline"
                >
                  +91 9289712364
                </a>
              </p>
            </aside>

            {/* -------- RIGHT PANEL -------- */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div
                className="h-1 w-full shrink-0 md:hidden"
                style={{ background: "var(--cv-grad-horizontal)" }}
              />

              <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pr-14 pt-4 md:hidden">
                <div className="cv-icon-gradient h-10 w-10 shrink-0">
                  <CalendarCheck size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="m-0 text-base font-bold leading-tight text-neutral-dark">
                    Book Your Free Counseling
                  </h3>
                  <p className="m-0 mt-0.5 text-xs text-neutral-mid">
                    100% free session with advisors.
                  </p>
                </div>
              </div>

              {/* Mobile steps */}
              {!submitted && (
                <div className="shrink-0 px-5 pb-3 md:hidden">
                  <div className="flex items-center gap-2">
                    {STEPS.map((label, i) => {
                      const n = i + 1;
                      const active = step === n;
                      const done = step > n;
                      return (
                        <div
                          key={label}
                          className={`flex items-center gap-2 ${
                            i === 0 ? "" : "min-w-0 flex-1"
                          }`}
                        >
                          {i > 0 && (
                            <div
                              className="h-0.5 flex-1 rounded-full"
                              style={{
                                background:
                                  step >= n
                                    ? "var(--cv-grad-horizontal)"
                                    : "var(--cv-neutral-border)",
                              }}
                            />
                          )}
                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                done || active
                                  ? "bg-primary text-white"
                                  : "bg-neutral-border text-neutral-mid"
                              }`}
                            >
                              {done ? <Check size={13} strokeWidth={3} /> : n}
                            </span>
                            <span
                              className={`text-xs ${
                                active
                                  ? "font-semibold text-neutral-dark"
                                  : "text-neutral-mid"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Desktop heading */}
              {!submitted && (
                <div className="hidden shrink-0 px-7 pb-3 pt-6 pr-14 md:block">
                  <p className="m-0 text-xs font-semibold uppercase tracking-wider text-accent-dark">
                    Step {step} of 2
                  </p>
                  <h4 className="m-0 mt-1 text-lg font-bold text-neutral-dark">
                    {step === 1
                      ? "Tell us about yourself"
                      : "Choose a convenient slot"}
                  </h4>
                </div>
              )}

              {/* -------- BODY -------- */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-neutral-border px-5 py-5 md:border-t-0 md:px-7 md:pt-2">
                {errorMsg && (
                  <div
                    role="alert"
                    className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
                  >
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span className="min-w-0">{errorMsg}</span>
                  </div>
                )}

                {/* SUCCESS */}
                {submitted ? (
                  <div className="animate-fadeIn flex flex-col items-center py-6 text-center md:py-10">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={32} strokeWidth={2.5} />
                    </div>
                    <h4 className="m-0 text-xl font-bold text-neutral-dark">
                      Booking Confirmed!
                    </h4>
                    <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-neutral-mid">
                      Your counseling session is scheduled. Check your phone
                      and inbox for the details.
                    </p>

                    <div className="mt-5 w-full max-w-xs divide-y divide-neutral-border rounded-xl border border-neutral-border text-left">
                      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        <span className="text-neutral-mid">Day</span>
                        <span className="font-semibold text-neutral-dark">
                          {pickedDay}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        <span className="text-neutral-mid">Time</span>
                        <span className="font-semibold text-neutral-dark">
                          {pickedTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        <span className="text-neutral-mid">Mode</span>
                        <span className="font-semibold text-primary">
                          Live Video Call
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="cv-btn-cta mt-6 min-h-11 w-full max-w-xs px-6 text-sm"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ============ STEP 1 ============ */}
                    {step === 1 && (
                      <div className="animate-fadeIn space-y-3.5">
                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 [&>*]:min-w-0">
                          <div className="group/input relative">
                            <User size={16} className={iconCls} />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Full Name *"
                              className={inputCls}
                            />
                          </div>
                          <div className="group/input relative">
                            <Mail size={16} className={iconCls} />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email Address *"
                              className={inputCls}
                            />
                          </div>
                          <div className="group/input relative">
                            <Phone size={16} className={iconCls} />
                            <input
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              placeholder="Mobile Number *"
                              className={inputCls}
                            />
                          </div>
                          <div className="group/input relative">
                            <MapPin size={16} className={iconCls} />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="Current City *"
                              className={inputCls}
                            />
                          </div>
                          <div className="group/input relative">
                            <GraduationCap size={16} className={iconCls} />
                            <select
                              name="course"
                              value={formData.course}
                              onChange={handleChange}
                              disabled={coursesLoading}
                              className={`${inputCls} cursor-pointer appearance-none pr-9 disabled:opacity-60`}
                            >
                              <option value="">
                                {coursesLoading
                                  ? "Loading courses…"
                                  : "Target Course *"}
                              </option>
                              {courses.map((c) => (
                                <option key={c._id} value={c.name || c._id}>
                                  {c.name || c.title || c._id}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-mid"
                            />
                          </div>
                          <div className="group/input relative">
                            <Tag size={16} className={iconCls} />
                            <select
                              name="branch"
                              value={formData.branch}
                              onChange={handleChange}
                              disabled={!specializations.length}
                              className={`${inputCls} cursor-pointer appearance-none pr-9 disabled:opacity-50`}
                            >
                              <option value="">
                                {!formData.course
                                  ? "Select course first"
                                  : specializations.length
                                  ? "Specialization / Branch"
                                  : "No specializations"}
                              </option>
                              {specializations.map((sp, i) => (
                                <option key={i} value={sp}>
                                  {sp}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-mid"
                            />
                          </div>
                        </div>

                        <div className="group/input relative">
                          <MessageSquare
                            size={16}
                            className="pointer-events-none absolute left-3 top-3.5 text-neutral-mid transition-colors group-focus-within/input:text-accent"
                          />
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Your career goal or biggest confusion (optional)"
                            className="box-border block w-full min-w-0 resize-none rounded-lg border border-neutral-border bg-white py-3 pl-10 pr-3 text-base text-neutral-dark outline-none transition placeholder:text-neutral-mid focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    {/* ============ STEP 2 ============ */}
                    {step === 2 && (
                      <div className="animate-fadeIn">
                        {slotsLoading ? (
                          <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-neutral-mid">
                            <Loader2
                              size={24}
                              className="animate-spin text-accent"
                            />
                            Finding available slots...
                          </div>
                        ) : uniqueDays.length === 0 ? (
                          <div className="rounded-lg border border-accent/30 bg-accent-light px-4 py-6 text-center text-sm leading-6 text-accent-dark">
                            <p className="m-0 font-semibold">
                              No direct slots open right now.
                            </p>
                            <p className="m-0 mt-1 text-xs">
                              Go ahead and book to receive an instant callback.
                            </p>
                            <p className="m-0 mt-2 text-[10px] opacity-70">
                              (Check console for debug info)
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-5 md:grid-cols-[190px_1fr] md:gap-6">
                            {/* DAY PICKER */}
                            <div className="min-w-0">
                              <p className="m-0 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-mid">
                                Select Day
                              </p>
                              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-1">
                                {uniqueDays.map(({ label, count }) => {
                                  const active = pickedDay === label;
                                  return (
                                    <button
                                      key={label}
                                      type="button"
                                      onClick={() => {
                                        setPickedDay(label);
                                        setPickedTime(null);
                                        setSelectedSlotId(null);
                                        setErrorMsg("");
                                      }}
                                      className={`min-w-0 rounded-xl border p-3 text-left transition ${
                                        active
                                          ? "border-primary bg-primary text-white shadow-md"
                                          : "border-neutral-border bg-white text-neutral-dark hover:border-accent"
                                      }`}
                                    >
                                      <div className="truncate text-sm font-semibold">
                                        {label}
                                      </div>
                                      <div
                                        className={`mt-1 text-xs ${
                                          active
                                            ? "text-orange-200"
                                            : "text-accent-dark"
                                        }`}
                                      >
                                        {count} seat{count !== 1 ? "s" : ""} left
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* TIME PICKER */}
                            <div className="min-w-0">
                              <p className="m-0 mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-mid">
                                <Clock size={13} />
                                Select Time
                              </p>

                              {visibleTimes.length === 0 ? (
                                <p className="m-0 rounded-lg border border-dashed border-neutral-border px-3 py-6 text-center text-xs text-neutral-mid">
                                  No time slots available for this day.
                                </p>
                              ) : (
                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                  {visibleTimes.map((slot) => {
                                    const active =
                                      selectedSlotId ===
                                      (slot._id || slot.id);
                                    const slotTime =
                                      slot.time || slot.slotTime || "";
                                    const slotSeats =
                                      slot.remainingSeats ??
                                      slot.seats ??
                                      slot.availableSeats ??
                                      0;
                                    return (
                                      <button
                                        key={slot._id || slot.id}
                                        type="button"
                                        onClick={() => handleSlotSelect(slot)}
                                        className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border py-2.5 text-xs transition ${
                                          active
                                            ? "border-primary bg-primary text-white shadow-md"
                                            : "border-neutral-border bg-white text-neutral-dark hover:border-accent hover:bg-accent-light"
                                        }`}
                                      >
                                        <span className="flex items-center gap-1 font-semibold">
                                          {active && (
                                            <Check
                                              size={12}
                                              strokeWidth={3}
                                            />
                                          )}
                                          {slotTime}
                                        </span>
                                        <span
                                          className={`text-[10px] ${
                                            active
                                              ? "text-blue-100"
                                              : "text-neutral-mid"
                                          }`}
                                        >
                                          {slotSeats} left
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* -------- FOOTER -------- */}
              {!submitted && (
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-border bg-white px-5 py-3.5 md:px-7">
                  <div className="hidden items-center gap-1.5 text-xs text-neutral-mid lg:flex">
                    <Lock size={13} />
                    100% secure &amp; private
                  </div>
                  <div className="flex w-full items-center gap-2 lg:w-auto lg:justify-end">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg("");
                          setStep((s) => s - 1);
                        }}
                        disabled={submitting}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-neutral-border bg-white px-4 text-sm font-medium text-neutral-mid transition hover:bg-neutral-light hover:text-neutral-dark disabled:opacity-50"
                      >
                        <ArrowLeft size={15} />
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={submitting}
                      className="cv-btn-cta inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-6 text-sm lg:flex-none"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>
                          {step === 2 ? "Confirm My Slot" : "Choose Time Slot"}
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fadeOverlay { animation: fadeOverlay 0.2s ease-out forwards; }
            .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
          `}</style>
        </div>
      )}
    </>
  );
}