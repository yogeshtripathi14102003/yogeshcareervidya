


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, User, Mail, Phone, GraduationCap, MapPin,
         ArrowRight, Tag, MessageSquare, Sparkles,
         Lock, CalendarCheck, Check, Sparkle } from "lucide-react";
import api from "@/utlis/api";
import "./TopHeader.css";

// 3 से घटाकर सिर्फ 2 स्टेप्स कर दिए हैं
const STEPS = ["Personal & Course Details", "Select Consultation Slot"];

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const [backendSlots, setBackendSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [uniqueDays, setUniqueDays] = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", city: "",
    course: "", branch: "", message: "",
  });

  const [pickedDay, setPickedDay] = useState(null);
  const [pickedTime, setPickedTime] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // 2 स्टेप्स के हिसाब से प्रोग्रेस बार कैलकुलेशन
  const progress = step === 1 ? 50 : 100;

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
        const res = await api.get("/api/v1/slot/available");

        if (res.data?.success) {
          const slotsData = res.data.data || [];
          setBackendSlots(slotsData);

          const daysMap = {};
          slotsData.forEach((slot) => {
            if (!daysMap[slot.date]) daysMap[slot.date] = 0;
            daysMap[slot.date] += 1;
          });

          const daysList = Object.keys(daysMap).map((date) => ({
            label: date,
            count: daysMap[date],
          }));

          setUniqueDays(daysList);

          if (daysList.length > 0) {
            setPickedDay(daysList[0].label);
          }
        }
      } catch (err) {
        console.error("Slots fetch error:", err);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchCourses();
    fetchAvailableSlots();
  }, [showPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    setPickedTime(slotObj.time);
    setSelectedSlotId(slotObj._id);
  };

  const handleNext = async () => {
    // स्टेप 1 वैलिडेशन: चेक करें कि क्या सभी जरूरी इनपुट्स भर दिए गए हैं
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.mobile || !formData.city || !formData.course) {
        alert("Please fill in all the required details before proceeding.");
        return;
      }
      setStep(2);
      return;
    }

    // स्टेप 2 वैलिडेशन और सबमिशन
    if (!selectedSlotId) {
      alert("Please select a time slot to lock your booking.");
      return;
    }

    try {
      await api.put(`/api/v1/slot/book/${selectedSlotId}`, {
        studentName:   formData.name,
        studentEmail:  formData.email,
        studentMobile: formData.mobile,
        course:        formData.course,
        branch:        formData.branch,
        description:   formData.message,
      });

      await api.post("/api/v1/getintouch", {
        ...formData,
        slot: `${pickedDay} ${pickedTime}`,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error booking the slot. Please try again.");
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setPickedTime(null);
      setSelectedSlotId(null);
    }, 300);
  };

  return (
    <>
      {/* Top header nav */}
      <div className="topheader-container">
        <div className="topheader-inner">
          <div className="topheader-center">
            <button
              className="cta-counseling-btn relative flex items-center justify-center gap-2"
              onClick={() => setShowPopup(true)}
            >
              Get Free Career Counseling
              <span className="relative flex h-4 w-9">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
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
              <Link href="/Blog" className="top-link">Blog</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-md animate-fadeOverlay"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Main White Canvas Container */}
          <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden relative shadow-[0_25px_60px_-15px_rgba(5,52,127,0.3)] border border-slate-100 animate-scaleUp p-0.5">
            
            {/* Top Highlight Strip */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600"></div>

            {/* Dark High-Contrast Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-orange-600 text-slate-900 hover:text-white transition-all duration-200 border border-slate-200 shadow-sm"
            >
              <X size={15} strokeWidth={2.5} />
            </button>

            {/* Inner Content Block */}
            <div className="p-8 pt-9 flex flex-col min-h-[520px]">
              
              {!submitted && (
                <>
                  {/* Header Block - Deep Black text for striking contrast */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 px-3 py-1 rounded-full text-orange-800 font-extrabold tracking-wide text-[10px] uppercase shadow-xs">
                      <Sparkles size={11} className="animate-spin-slow text-orange-600" />
                      Free Expert Mentorship
                    </div>
                    <h3 className="text-2xl font-black text-slate-950 tracking-tight mt-3">
                      Lock Your <span className="bg-gradient-to-r from-[#05347f] to-blue-600 bg-clip-text text-transparent">Dream Career</span> Slot
                    </h3>
                    <p className="text-xs text-slate-900 mt-1 font-semibold">
                      Talk directly to top university advisors. 100% Free Session.
                    </p>
                  </div>

                  {/* High Contrast Stepper Box */}
                  <div className="mb-6 bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#05347f] text-white flex items-center justify-center text-xs font-black shadow-sm">
                        {step}
                      </div>
                      <span className="text-xs font-black text-slate-950">{STEPS[step - 1]}</span>
                    </div>
                    
                    <div className="flex-1 max-w-[140px] bg-slate-300 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#05347f] to-blue-500 h-full transition-all duration-300 ease-out rounded-full" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 tracking-wider">STEP {step}/2</span>
                  </div>
                </>
              )}

              {/* Dynamic Step Panels */}
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-5 my-auto text-center py-6 animate-fadeIn">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-green-500/20 relative">
                    <CalendarCheck size={36} />
                    <span className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full shadow border-2 border-white animate-pulse">
                      <Sparkle size={12} className="text-slate-900" />
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-950">Booking Confirmed! 🎉</h4>
                    <p className="text-xs text-slate-950 max-w-xs mx-auto mt-1.5 leading-relaxed font-semibold">
                      Awesome! Your career accelerator session is scheduled. Check your phone & inbox for instructions.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-2xl p-5 text-xs space-y-3 w-full max-w-xs shadow-xl relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-slate-300 font-medium">Chosen Day</span> 
                      <span className="font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded border border-amber-500">{pickedDay}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-slate-300 font-medium">Time Window</span> 
                      <span className="font-black text-white bg-white/10 px-2 py-0.5 rounded">{pickedTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">Session Mode</span> 
                      <span className="font-extrabold text-blue-400">Live Video Call</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-black text-slate-950 tracking-wide uppercase bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-md">Hotline Support: 9289712364</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  
                  {/* STEP 1: Combined Info Panel (Pure Crisp White Backgrounds) */}
                  {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group/input">
                          <User size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input
                            type="text" name="name" value={formData.name} onChange={handleChange}
                            placeholder="Your Full Name" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                        <div className="relative group/input">
                          <Mail size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            placeholder="Email Address" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group/input">
                          <Phone size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input
                            type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                            placeholder="Mobile Number" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                        <div className="relative group/input">
                          <MapPin size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input
                            type="text" name="city" value={formData.city} onChange={handleChange}
                            placeholder="Current City" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group/input">
                          <GraduationCap size={16} className="absolute left-4 top-3.5 text-slate-950 z-10 group-focus-within/input:text-[#05347f] transition-colors" />
                          <select
                            name="course" value={formData.course} onChange={handleChange} required disabled={coursesLoading}
                            className="w-full pl-12 pr-8 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl appearance-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 font-bold cursor-pointer disabled:opacity-60"
                          >
                            <option value="" className="text-slate-950 font-bold">{coursesLoading ? "Loading courses…" : "Target Course"}</option>
                            {courses.map((c) => (
                              <option key={c._id} value={c.name || c._id} className="text-slate-950 font-bold">{c.name || c.title || c._id}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-4.5 w-2 h-2 border-r-2 border-b-2 border-slate-950 pointer-events-none transform rotate-45 group-focus-within/input:border-[#05347f]"></div>
                        </div>

                        <div className="relative group/input">
                          <Tag size={16} className="absolute left-4 top-3.5 text-slate-950 z-10 group-focus-within/input:text-[#05347f] transition-colors" />
                          <select
                            name="branch" value={formData.branch} onChange={handleChange} required disabled={!specializations.length}
                            className="w-full pl-12 pr-8 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl appearance-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                          >
                            <option value="" className="text-slate-950 font-bold">
                              {!formData.course ? "Select course first" : specializations.length ? "Specialization / Branch" : "No specializations"}
                            </option>
                            {specializations.map((sp, i) => (
                              <option key={i} value={sp} className="text-slate-950 font-bold">{sp}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-4.5 w-2 h-2 border-r-2 border-b-2 border-slate-950 pointer-events-none transform rotate-45 group-focus-within/input:border-[#05347f]"></div>
                        </div>
                      </div>

                      <div className="relative group/input">
                        <MessageSquare size={16} className="absolute left-4 top-4 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                        <textarea
                          name="message" value={formData.message} onChange={handleChange} rows={2} required
                          placeholder="What is your biggest confusion or career goal right now?"
                          className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl resize-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 placeholder-slate-500 font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Time Slot Picker Panel */}
                  {step === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      {slotsLoading ? (
                        <div className="text-center py-12 text-sm text-slate-950 flex flex-col items-center justify-center gap-3">
                          <div className="w-6 h-6 border-2 border-slate-300 border-t-[#05347f] rounded-full animate-spin"></div>
                          <span className="font-bold">Finding freshly available slots...</span>
                        </div>
                      ) : uniqueDays.length === 0 ? (
                        <div className="text-center py-8 text-sm text-amber-950 bg-amber-50 border-2 border-amber-300 rounded-xl font-bold">
                          No direct slots open right now. Go ahead and book to receive a VIP instant callback.
                        </div>
                      ) : (
                        <>
                          {/* Segmented Day Picker - Bold Contrasts */}
                          <div className="grid grid-cols-2 gap-3">
                            {uniqueDays.map(({ label, count }) => (
                              <button 
                                key={label} type="button"
                                onClick={() => { setPickedDay(label); setPickedTime(null); setSelectedSlotId(null); }}
                                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden ${
                                  pickedDay === label
                                    ? "bg-slate-950 border-slate-950 text-white shadow-md scale-[1.01]"
                                    : "bg-white border-slate-300 text-slate-950 hover:border-slate-400"
                                }`}
                              >
                                <div className="font-black text-sm tracking-tight">{label}</div>
                                <div className={`text-xs font-black mt-1 ${pickedDay === label ? "text-amber-400" : "text-orange-600"}`}>
                                  🔥 {count} Available Slots
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Time Grid with Pure White Base */}
                          <div className="grid grid-cols-3 gap-2.5 pt-2">
                            {backendSlots
                              .filter((slot) => slot.date === pickedDay && !slot.isBooked)
                              .map((slot) => (
                                <button 
                                  key={slot._id} type="button"
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`py-3 rounded-xl border-2 text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 ${
                                    pickedTime === slot.time
                                      ? "bg-[#05347f] border-[#05347f] text-white shadow-md scale-[1.03]"
                                      : "bg-white border-slate-300 text-slate-950 hover:border-slate-400"
                                  }`}
                                >
                                  {pickedTime === slot.time && <Check size={13} strokeWidth={3} />}
                                  {slot.time}
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Form Trigger Actions Footer */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t-2 border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-950">
                      <Lock size={13} className="text-slate-950" />
                      100% Secure & Private
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {step > 1 && (
                        <button 
                          type="button" onClick={() => setStep((s) => s - 1)}
                          className="px-4 py-2.5 text-xs font-black text-slate-950 hover:text-red-600 transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button 
                        type="button" onClick={handleNext}
                        className="flex items-center gap-1.5 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-black transition-all shadow-[0_4px_14px_rgba(235,94,40,0.3)] active:scale-[0.97]"
                      >
                        {step === 2 ? "Confirm My Slot" : "Choose Your Time Slot"}
                        <ArrowRight size={13} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Micro-Animations & Core Layout Fixes */}
          <style jsx>{`
            @keyframes fadeOverlay {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { opacity: 0; transform: scale(0.96) translateY(12px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.99) translateY(4px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-fadeOverlay { animation: fadeOverlay 0.2s ease-out forwards; }
            .animate-scaleUp { animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
            .animate-spin-slow { animation: spin 4s linear infinite; }
          `}</style>
        </div>
      )}
    </>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   X, User, Mail, Phone, GraduationCap, MapPin, Check,
//   ArrowRight, Tag, MessageSquare, ShieldCheck,
//   Users, Award, Clock, Lock, CalendarCheck, Sparkles 
// } from "lucide-react";
// import api from "@/utlis/api";
// import "./TopHeader.css";

// const STEPS = [
//   { name: "Personal", desc: "Your identity" },
//   { name: "Preference", desc: "Your goals" },
//   { name: "Slot", desc: "Choose timing" }
// ];

// export default function QueryPopup() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [step, setStep] = useState(1);
//   const [submitted, setSubmitted] = useState(false);

//   const [courses, setCourses] = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(false);
//   const [specializations, setSpecializations] = useState([]);

//   const [backendSlots, setBackendSlots] = useState([]);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [uniqueDays, setUniqueDays] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "", email: "", mobile: "", city: "",
//     course: "", branch: "", message: "",
//   });

//   const [pickedDay, setPickedDay] = useState(null);
//   const [pickedTime, setPickedTime] = useState(null);
//   const [selectedSlotId, setSelectedSlotId] = useState(null);

//   // Validation configurations to keep CTA highly relevant
//   const isStep1Valid = formData.name && formData.email && formData.mobile && formData.city;
//   const isStep2Valid = formData.course && formData.branch && formData.message;
//   const isStep3Valid = selectedSlotId !== null;

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
//             daysMap[slot.date] += 1;
//           });

//           const daysList = Object.keys(daysMap).map((date) => ({
//             label: date,
//             count: daysMap[date],
//           }));

//           setUniqueDays(daysList);
//           if (daysList.length > 0) {
//             setPickedDay(daysList[0].label);
//           }
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
//     setPickedTime(slotObj.time);
//     setSelectedSlotId(slotObj._id);
//   };

//   const handleNext = async () => {
//     if (step === 1 && !isStep1Valid) return;
//     if (step === 2 && !isStep2Valid) return;

//     if (step < 3) {
//       setStep((s) => s + 1);
//       return;
//     }

//     if (!selectedSlotId) return;

//     try {
//       await api.put(`/api/v1/slot/book/${selectedSlotId}`, {
//         studentName:   formData.name,
//         studentEmail:  formData.email,
//         studentMobile: formData.mobile,
//         course:        formData.course,
//         branch:        formData.branch,
//         description:   formData.message,
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
//       {/* Top Navigation Strip */}
//       <div className="topheader-container shadow-sm border-b border-slate-100">
//         <div className="topheader-inner">
//           <div className="topheader-center">
//             <button
//               className="cta-counseling-btn relative flex items-center justify-center gap-2 group overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium px-4 py-1.5 rounded-full transition-all hover:shadow-md active:scale-95"
//               onClick={() => setShowPopup(true)}
//             >
//               <Sparkles size={14} className="animate-spin text-amber-200" style={{ animationDuration: '3s' }} />
//               Get Free Career Counseling
//               <span className="relative flex h-2 w-2 ml-1">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
//               </span>
//             </button>
//           </div>
//           <div className="topheader-right">
//             <nav className="top-nav-links">
//               <Link href="/Aboutus" className="top-link hover:text-[#05347f] transition-colors">About</Link>
//               <span className="separator text-slate-300">|</span>
//               <Link href="/contactus" className="top-link hover:text-[#05347f] transition-colors">Contact</Link>
//               <span className="separator text-slate-300">|</span>
//               <Link href="/Blog" className="top-link hover:text-[#05347f] transition-colors">Blog</Link>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Main Popup Modal overlay */}
//       <AnimatePresence>
//         {showPopup && (
//           <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95, y: 15 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 10 }}
//               transition={{ type: "spring", duration: 0.4 }}
//               className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex overflow-hidden relative border border-slate-100 min-h-[480px]"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={handleClose}
//                 className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all shadow-sm cursor-pointer"
//               >
//                 <X size={16} />
//               </button>

//               {/* Unique Aesthetic Sidebar */}
//               <div className="bg-gradient-to-b from-[#05347f] to-[#032254] text-white w-72 flex-shrink-0 p-8 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                
//                 <div className="flex flex-col gap-8 relative z-10">
//                   <div className="flex items-center gap-2">
//                     <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//                     <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">Career Vidya</span>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-2xl font-bold leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
//                       Secure Your <br />
//                       <span className="text-amber-400 underline decoration-amber-400/30 decoration-wavy">Free Expert</span> <br />
//                       Session
//                     </h3>
//                     <p className="text-xs text-blue-200/70 mt-3 leading-relaxed">
//                       Sync up with top platform counselors to build your direct layout path toward global degree validation.
//                     </p>
//                   </div>

//                   <div className="space-y-3.5 mt-2">
//                     {[
//                       [ShieldCheck, "100% Free Consultation"],
//                       [Users, "50,000+ Profiles Audited"],
//                       [Award, "UGC & AICTE Approved Track"],
//                       [Clock, "30-Min High Impact Sync"],
//                     ].map(([Icon, text], idx) => (
//                       <motion.div 
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.1 }}
//                         key={text} 
//                         className="flex items-center gap-3 text-xs text-blue-100/80"
//                       >
//                         <div className="p-1 rounded-md bg-white/10 text-amber-400">
//                           <Icon size={14} />
//                         </div>
//                         <span className="font-medium">{text}</span>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-auto pt-6 border-t border-white/10">
//                   <div className="flex items-center justify-between text-[11px] text-blue-200/40">
//                     <span>© 2026 Registration</span>
//                     <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">v2.4</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Dynamic Content Panel */}
//               <div className="flex-1 flex flex-col bg-slate-50/50">
//                 {submitted ? (
//                   <motion.div 
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="flex flex-col items-center justify-center gap-6 p-10 text-center h-full my-auto"
//                   >
//                     <div className="relative">
//                       <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-inner text-emerald-600">
//                         <CalendarCheck size={32} />
//                       </div>
//                       <span className="absolute -top-1 -right-1 flex h-4 w-4">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
//                       </span>
//                     </div>

//                     <div>
//                       <h4 className="text-xl font-bold text-slate-800 mb-1">Session Confirmed!</h4>
//                       <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
//                         Excellent choices! Your booking pipeline is saved. An email containing entry links has been dispatched.
//                       </p>
//                     </div>

//                     <div className="bg-white border border-slate-100 rounded-xl p-5 text-sm shadow-sm space-y-2 w-full max-w-sm text-left">
//                       <div className="flex justify-between"><span className="text-slate-400">Selected Day:</span> <strong className="text-slate-700">{pickedDay}</strong></div>
//                       <div className="flex justify-between"><span className="text-slate-400">Time Slot:</span> <strong className="text-slate-700">{pickedTime}</strong></div>
//                       <div className="flex justify-between"><span className="text-slate-400">Meeting Mode:</span> <span className="text-emerald-600 font-medium">Digital (Google Meet)</span></div>
//                     </div>

//                     <p className="text-xs text-slate-400">Need immediate adjustments? Direct Line: <span className="text-[#05347f] font-medium">9289712364</span></p>
//                   </motion.div>
//                 ) : (
//                   <div className="p-8 flex flex-col gap-6 h-full justify-between">
                    
//                     {/* Stepper Wizard Progress bar */}
//                     <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
//                       {STEPS.map((s, i) => {
//                         const n = i + 1;
//                         const done = n < step;
//                         const active = n === step;
//                         return (
//                           <div key={s.name} className="flex items-center flex-1 last:flex-none">
//                             <div className="flex items-center gap-2.5">
//                               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm
//                                 ${done ? "bg-emerald-500 text-white" 
//                                 : active ? "bg-[#05347f] text-white ring-4 ring-blue-100" 
//                                 : "bg-slate-100 text-slate-400 border border-slate-200"}`}
//                               >
//                                 {done ? <Check size={14} strokeWidth={3} /> : n}
//                               </div>
//                               <div className="hidden sm:block text-left">
//                                 <p className={`text-xs font-semibold leading-none ${active ? "text-[#05347f]" : done ? "text-emerald-600" : "text-slate-400"}`}>{s.name}</p>
//                                 <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
//                               </div>
//                             </div>
//                             {i < STEPS.length - 1 && (
//                               <div className="flex-1 h-0.5 mx-4 bg-slate-100 rounded">
//                                 <div 
//                                   className="h-full bg-emerald-500 transition-all duration-500" 
//                                   style={{ width: done ? "100%" : "0%" }}
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {/* Step Fields Wrapper with Motion slide animations */}
//                     <div className="flex-1 flex flex-col justify-center">
//                       <AnimatePresence mode="wait">
//                         {step === 1 && (
//                           <motion.div
//                             key="step1"
//                             initial={{ opacity: 0, x: 15 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -15 }}
//                             className="space-y-4"
//                           >
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                               {[
//                                 { icon: User, name: "name", placeholder: "Full Name", type: "text" },
//                                 { icon: MapPin, name: "city", placeholder: "City / Location", type: "text" },
//                                 { icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
//                                 { icon: Phone, name: "mobile", placeholder: "Mobile Number", type: "tel" },
//                               ].map(({ icon: Icon, name, placeholder, type }) => (
//                                 <div key={name} className="relative group">
//                                   <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#05347f] transition-colors pointer-events-none" />
//                                   <input
//                                     type={type} name={name}
//                                     value={formData[name]} onChange={handleChange}
//                                     placeholder={placeholder} required
//                                     className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm text-slate-800 placeholder-slate-400"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           </motion.div>
//                         )}

//                         {step === 2 && (
//                           <motion.div
//                             key="step2"
//                             initial={{ opacity: 0, x: 15 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -15 }}
//                             className="space-y-4"
//                           >
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                               <div className="relative">
//                                 <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
//                                 <select
//                                   name="course" value={formData.course} onChange={handleChange} required
//                                   disabled={coursesLoading}
//                                   className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl appearance-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-500/5 outline-none text-slate-700 cursor-pointer disabled:opacity-60 shadow-sm"
//                                 >
//                                   <option value="">{coursesLoading ? "Fetching Courses..." : "Choose Course Target"}</option>
//                                   {courses.map((c) => (
//                                     <option key={c._id} value={c.name || c._id}>{c.name || c.title || c._id}</option>
//                                   ))}
//                                 </select>
//                               </div>

//                               <div className="relative">
//                                 <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
//                                 <select
//                                   name="branch" value={formData.branch} onChange={handleChange} required
//                                   disabled={!specializations.length}
//                                   className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl appearance-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-500/5 outline-none text-slate-700 cursor-pointer disabled:opacity-50 shadow-sm"
//                                 >
//                                   <option value="">
//                                     {!formData.course ? "Awaiting Course Entry" 
//                                     : specializations.length ? "Select Specialization" 
//                                     : "No Subcategories Found"}
//                                   </option>
//                                   {specializations.map((sp, i) => (
//                                     <option key={i} value={sp}>{sp}</option>
//                                   ))}
//                                 </select>
//                               </div>

//                               <div className="col-span-1 sm:col-span-2 relative">
//                                 <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
//                                 <textarea
//                                   name="message" value={formData.message} onChange={handleChange} rows={3} required
//                                   placeholder="Briefly state your core query or expectations..."
//                                   className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl resize-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-500/5 outline-none text-slate-800 shadow-sm placeholder-slate-400"
//                                 />
//                               </div>
//                             </div>
//                           </motion.div>
//                         )}

//                         {step === 3 && (
//                           <motion.div
//                             key="step3"
//                             initial={{ opacity: 0, x: 15 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -15 }}
//                             className="space-y-4"
//                           >
//                             {slotsLoading ? (
//                               <div className="text-center py-8 text-sm text-slate-400 flex flex-col items-center gap-2">
//                                 <span className="w-6 h-6 border-2 border-[#05347f] border-t-transparent rounded-full animate-spin" />
//                                 Fetching dynamic slots calendar...
//                               </div>
//                             ) : uniqueDays.length === 0 ? (
//                               <div className="text-center py-6 text-sm text-amber-700 bg-amber-50/50 border border-amber-100 rounded-xl">
//                                 System slots depleted for the active cycle. Try back shortly!
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {/* Horizontal Day Grid */}
//                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
//                                   {uniqueDays.map(({ label, count }) => (
//                                     <button 
//                                       key={label} type="button"
//                                       onClick={() => { setPickedDay(label); setPickedTime(null); setSelectedSlotId(null); }}
//                                       className={`p-3 rounded-xl border text-left transition-all cursor-pointer shadow-sm
//                                         ${pickedDay === label
//                                           ? "bg-[#05347f] border-[#05347f] text-white ring-4 ring-blue-500/10"
//                                           : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
//                                     >
//                                       <div className="font-semibold text-sm truncate">{label}</div>
//                                       <div className={`text-[11px] mt-0.5 ${pickedDay === label ? "text-blue-200" : "text-slate-400"}`}>
//                                         {count} slots open
//                                       </div>
//                                     </button>
//                                   ))}
//                                 </div>

//                                 {/* Available Hours Layout */}
//                                 <div className="grid grid-cols-3 gap-2.5 pt-2">
//                                   {backendSlots
//                                     .filter((slot) => slot.date === pickedDay && !slot.isBooked)
//                                     .map((slot) => (
//                                       <button 
//                                         key={slot._id} type="button"
//                                         onClick={() => handleSlotSelect(slot)}
//                                         className={`py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center shadow-sm
//                                           ${pickedTime === slot.time
//                                             ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/10"
//                                             : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
//                                       >
//                                         {slot.time}
//                                       </button>
//                                     ))}
//                                 </div>
//                               </div>
//                             )}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>

//                     {/* Bottom Dynamic Interactive Footer */}
//                     <div className="flex items-center justify-between pt-4 border-t border-slate-100 bg-white -mx-8 -mb-8 px-8 pb-6 rounded-b-2xl">
//                       <div className="flex items-center gap-1.5 text-xs text-slate-400">
//                         <Lock size={13} className="text-slate-300" />
//                         <span>Data Secure Layer End-to-End</span>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         {step > 1 && (
//                           <button 
//                             type="button" 
//                             onClick={() => setStep((s) => s - 1)}
//                             className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-50"
//                           >
//                             Back
//                           </button>
//                         )}
//                         <button 
//                           type="button" 
//                           onClick={handleNext}
//                           disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
//                           className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-md
//                             ${((step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)) 
//                               ? "bg-slate-300 cursor-not-allowed shadow-none" 
//                               : "bg-[#c15304] hover:bg-[#a34503] active:scale-95"}`}
//                         >
//                           <span>{step === 3 ? "Complete Booking" : "Continue"}</span>
//                           <ArrowRight size={14} />
//                         </button>
//                       </div>
//                     </div>

//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }