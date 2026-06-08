"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, User, Mail, Phone, GraduationCap, MapPin,
         ArrowRight, Tag, MessageSquare, ShieldCheck,
         Users, Award, Clock, Lock, CalendarCheck } from "lucide-react";
import api from "@/utlis/api";
import "./TopHeader.css";

const STEPS = ["Personal", "Preference", "Slot"];

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Backend से कोर्सेज डेटा
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // ✅ Selected course की specializations
  const [specializations, setSpecializations] = useState([]);

  // 🎯 बैकएंड से डायनामिक स्लॉट्स का स्टेट
  const [backendSlots, setBackendSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [uniqueDays, setUniqueDays] = useState([]); // यूनीक दिनों की लिस्ट रखने के लिए

  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", city: "",
    course: "", branch: "", message: "",
  });

  // 🎯 सिलेक्टेड स्लॉट ट्रैकिंग
  const [pickedDay, setPickedDay] = useState(null); // e.g., "Tue, Jun 10"
  const [pickedTime, setPickedTime] = useState(null); // e.g., "11:00 AM"
  const [selectedSlotId, setSelectedSlotId] = useState(null); // बुकिंग के लिए सबसे जरूरी ID

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  // ✅ Popup open होने पर कोर्सेज और अवेलेबल स्लॉट्स दोनों फेच करो
  useEffect(() => {
    if (!showPopup) return;
    
    // 1. कोर्सेज फेच करें
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await api.get("/api/v1/course");
        const list =
          Array.isArray(res.data)             ? res.data
          : Array.isArray(res.data?.data)     ? res.data.data
          : Array.isArray(res.data?.courses)  ? res.data.courses
          : [];
        setCourses(list);
      } catch (err) {
        console.error("Course fetch error:", err);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    // 2. 🎯 बैकएंड से फ्री स्लॉट्स फेच करें
    const fetchAvailableSlots = async () => {
      setSlotsLoading(true);
      try {
        // आपके एक्सप्रेस बैकएंड का एंडपॉइंट (api.js में /api/v1/slots/available होता है)
        const res = await api.get("/api/v1/slots/available");
        
        if (res.data && res.data.success) {
          const slotsData = res.data.data || [];
          setBackendSlots(slotsData);

          // स्लॉट्स में से यूनीक दिनों (Dates) का पता लगाएँ
          const daysMap = {};
          slotsData.forEach((slot) => {
            if (!daysMap[slot.date]) {
              daysMap[slot.date] = 0;
            }
            daysMap[slot.date] += 1; // उस दिन कितने फ्री स्लॉट्स हैं काउंट करें
          });

          const daysList = Object.keys(daysMap).map((date) => ({
            label: date,
            count: daysMap[date],
          }));

          setUniqueDays(daysList);

          // डिफ़ॉल्ट रूप से पहला दिन सिलेक्ट कर लें
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

  // 🎯 स्लॉट चुनने पर उसकी ID और टाइम सेट करें
  const handleSlotSelect = (slotObj) => {
    setPickedTime(slotObj.time);
    setSelectedSlotId(slotObj._id);
  };

  const handleNext = async () => {
    if (step < 3) { 
      setStep((s) => s + 1); 
      return; 
    }

    // स्टेप 3 पर वैलिडेट करें कि छात्र ने टाइम चुना है या नहीं
    if (!selectedSlotId) {
      alert("Please select a time slot.");
      return;
    }

    try {
      // 🎯 1. पहले स्लॉट बुक करें और छात्र का पूरा डेटा पास करें
      await api.put(`/api/v1/slots/book/${selectedSlotId}`, {
        studentName: formData.name,
        studentEmail: formData.email,
        studentMobile: formData.mobile,
        course: formData.course,
        branch: formData.branch,
        description: formData.message,
      });

      // 2. आपका पुराना getintouch लीड जनरेशन भी बैकअप के लिए पैरेलल चलता रहेगा
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
  
  {/* 🌟 Live Blinking "New" Badge */}
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

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex overflow-hidden relative animate-fadeIn border border-slate-100">

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all shadow-sm"
            >
              <X size={16} />
            </button>

            {/* ── Sidebar ── */}
            <div className="bg-[#05347f] text-white w-66 flex-shrink-0 p-7 flex-col justify-between hidden md:flex">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
                  <span className="text-sm font-medium tracking-wide">Career Vidya</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium leading-snug">
                    Book Your <span className="text-amber-400">Free Career </span><br />Counseling Session
                  </h3>
                  <p className="text-xs text-blue-200/60 mt-2 leading-relaxed">
                    Talk to an expert advisor. Get clarity on courses, universities & career paths.
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-xs text-blue-100/75">
                  {[
                    [ShieldCheck, "100% free, no obligation"],
                    [Users,       "50,000+ students counseled"],
                    [Award,       "UGC-approved universities only"],
                    [Clock,       "30-min session, online"],
                  ].map(([Icon, text]) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon size={14} className="text-amber-400 flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-white/50 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-blue-200/25">© 2026 Career Vidya</p>
            </div>

            {/* ── Form Panel ── */}
            <div className="flex-1 flex flex-col">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-5 p-10 text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                    <CalendarCheck size={28} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-slate-800 mb-1">Slot booked!</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Your free session is confirmed.<br />
                      Check your email and mobile for details.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-6 py-4 text-sm text-slate-500 space-y-1 w-full max-w-xs">
                    <div><b className="text-slate-700">Day:</b> {pickedDay}</div>
                    <div><b className="text-slate-700">Time:</b> {pickedTime}</div>
                    <div><b className="text-slate-700">Mode:</b> Online (link via email)</div>
                  </div>
                  <p className="text-xs text-slate-400">Need to reschedule? Call us at 9289712364</p>
                </div>
              ) : (
                <div className="p-7 flex flex-col gap-5 h-full">

                  {/* Step indicators */}
                  <div className="flex items-center gap-1">
                    {STEPS.map((s, i) => {
                      const n = i + 1;
                      const done = n < step;
                      const active = n === step;
                      return (
                        <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                          <div className={`flex items-center gap-1.5 text-xs font-medium
                            ${done ? "text-green-700" : active ? "text-[#05347f]" : "text-slate-400"}`}>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] flex-shrink-0
                              ${done   ? "border-green-600 bg-green-50 text-green-700"
                              : active ? "border-[#05347f] text-[#05347f]"
                              :          "border-slate-300 text-slate-400"}`}>
                              {done ? "✓" : n}
                            </div>
                            {s}
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className="flex-1 h-px bg-slate-200 mx-2"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 1 — Personal */}
                  {step === 1 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Your details</p>
                        <p className="text-xs text-slate-500">We'll use these to confirm your booking</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {[
                          { icon: User,   name: "name",   placeholder: "Full name",      type: "text"  },
                          { icon: MapPin, name: "city",   placeholder: "City",           type: "text"  },
                          { icon: Mail,   name: "email",  placeholder: "Email address",  type: "email" },
                          { icon: Phone,  name: "mobile", placeholder: "Mobile number",  type: "tel"   },
                        ].map(({ icon: Icon, name, placeholder, type }) => (
                          <div key={name} className="relative flex items-center">
                            <Icon size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input
                              type={type} name={name}
                              value={formData[name]} onChange={handleChange}
                              placeholder={placeholder} required
                              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] focus:bg-white focus:ring-2 focus:ring-[#05347f]/10 outline-none transition-all text-slate-800"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Preference */}
                  {step === 2 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">What are you looking for?</p>
                        <p className="text-xs text-slate-500">Help us match you with the right advisor</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">

                        {/* Course dropdown — backend data */}
                        <div className="relative flex items-center">
                          <GraduationCap size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
                          <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            disabled={coursesLoading}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:border-[#05347f] focus:bg-white focus:ring-2 focus:ring-[#05347f]/10 outline-none text-slate-700 cursor-pointer disabled:opacity-60"
                          >
                            <option value="">
                              {coursesLoading ? "Loading courses…" : "Select course"}
                            </option>
                            {courses.map((c) => (
                              <option key={c._id} value={c.name || c._id}>
                                {c.name || c.title || c._id}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Specialization dropdown — from selected course */}
                        <div className="relative flex items-center">
                          <Tag size={14} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
                          <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            required
                            disabled={!specializations.length}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:border-[#05347f] focus:bg-white focus:ring-2 focus:ring-[#05347f]/10 outline-none text-slate-700 cursor-pointer disabled:opacity-50"
                          >
                            <option value="">
                              {!formData.course
                                ? "Select course first"
                                : specializations.length
                                ? "Select specialization"
                                : "No specializations"}
                            </option>
                            {specializations.map((sp, i) => (
                              <option key={i} value={sp}>{sp}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2 relative">
                          <MessageSquare size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                          <textarea
                            name="message" value={formData.message}
                            onChange={handleChange} rows={2} required
                            placeholder="Tell us your goal or question…"
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none focus:border-[#05347f] focus:bg-white focus:ring-2 focus:ring-[#05347f]/10 outline-none text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Dynamically Fetched Slot picker */}
                  {step === 3 && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Pick a slot</p>
                        <p className="text-xs text-slate-500">Available slots this week</p>
                      </div>

                      {slotsLoading ? (
                        <div className="text-center py-6 text-xs text-slate-400">Loading available slots...</div>
                      ) : uniqueDays.length === 0 ? (
                        <div className="text-center py-6 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl">
                          No available slots at the moment. Please try again later.
                        </div>
                      ) : (
                        <>
                          {/* Days Tab Selection */}
                          <div className="grid grid-cols-4 gap-2">
                            {uniqueDays.map(({ label, count }) => (
                              <button key={label} type="button"
                                onClick={() => { setPickedDay(label); setPickedTime(null); setSelectedSlotId(null); }}
                                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer
                                  ${pickedDay === label
                                    ? "bg-[#05347f] border-[#05347f] text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-[#05347f]/40"}`}>
                                <div className="font-medium text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{label}</div>
                                <div className={`mt-0.5 ${pickedDay === label ? "text-blue-200" : "text-slate-400"}`}>
                                  {count} slots free
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Times List based on selected Day */}
                          <div className="grid grid-cols-3 gap-2">
                            {backendSlots
                              .filter((slot) => slot.date === pickedDay && !slot.isBooked)
                              .map((slot) => (
                                <button key={slot._id} type="button"
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer
                                    ${pickedTime === slot.time
                                      ? "bg-[#05347f] border-[#05347f] text-white"
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-[#05347f]/40"}`}>
                                  {slot.time}
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Lock size={12} />
                      Your data is safe with us
                    </div>
                    <div className="flex items-center gap-3">
                      {step > 1 && (
                        <button type="button" onClick={() => setStep((s) => s - 1)}
                          className="text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                          Back
                        </button>
                      )}
                      <button type="button" onClick={handleNext}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#c15304] hover:bg-[#a34503] text-white rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95">
                        {step === 3 ? "Book slot" : "Continue"}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity:0; transform:scale(0.97) translateY(4px); }
              to   { opacity:1; transform:scale(1)    translateY(0);   }
            }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
          `}</style>
        </div>
      )}
    </>
  );
}
