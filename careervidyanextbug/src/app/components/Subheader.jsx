

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, User, Mail, Phone, GraduationCap, MapPin,
         ArrowRight, Tag, MessageSquare, Sparkles,
         Lock, CalendarCheck, Check, Sparkle } from "lucide-react";
import api from "@/utlis/api";
import "./TopHeader.css";

const STEPS = ["Personal & Course Details", "Select Consultation Slot"];

export default function QueryPopup() {
  const [showPopup, setShowPopup]         = useState(false);
  const [step, setStep]                   = useState(1);
  const [submitted, setSubmitted]         = useState(false);

  const [courses, setCourses]             = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const [backendSlots, setBackendSlots]   = useState([]);
  const [slotsLoading, setSlotsLoading]   = useState(false);
  const [uniqueDays, setUniqueDays]       = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", city: "",
    course: "", branch: "", message: "",
  });

  const [pickedDay, setPickedDay]         = useState(null);
  const [pickedTime, setPickedTime]       = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

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

          // ✅ FIX 1: remainingSeats use karo — naye model mein ek document hai per date+time
          const daysMap = {};
          slotsData.forEach((slot) => {
            if (!daysMap[slot.date]) daysMap[slot.date] = 0;
            daysMap[slot.date] += slot.remainingSeats; // was: += 1
          });

          const daysList = Object.keys(daysMap).map((date) => ({
            label: date,
            count: daysMap[date], // ab yeh remaining seats hai, documents count nahi
          }));

          setUniqueDays(daysList);
          if (daysList.length > 0) setPickedDay(daysList[0].label);
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
      const specs    = selectedCourse?.specializations || [];
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
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.mobile || !formData.city || !formData.course) {
        alert("Please fill in all the required details before proceeding.");
        return;
      }
      setStep(2);
      return;
    }

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
        city:          formData.city,
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
              <Link href="/blog" className="top-link">Blog</Link>
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
          <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden relative shadow-[0_25px_60px_-15px_rgba(5,52,127,0.3)] border border-slate-100 animate-scaleUp p-0.5">
            
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600"></div>

            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-orange-600 text-slate-900 hover:text-white transition-all duration-200 border border-slate-200 shadow-sm"
            >
              <X size={15} strokeWidth={2.5} />
            </button>

            <div className="p-8 pt-9 flex flex-col min-h-[520px]">
              
              {!submitted && (
                <>
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
                  <div className="bg-gradient-to-br from-green-950 to-green-900 text-white rounded-2xl p-5 text-xs space-y-3 w-full max-w-xs shadow-xl relative overflow-hidden">
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
                  <p className="text-[11px] font-black text-slate-950 tracking-wide uppercase bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-md">
                    Hotline Support: 9289712364
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group/input">
                          <User size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input type="text" name="name" value={formData.name} onChange={handleChange}
                            placeholder="Your Full Name" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                        <div className="relative group/input">
                          <Mail size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input type="email" name="email" value={formData.email} onChange={handleChange}
                            placeholder="Email Address" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group/input">
                          <Phone size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                            placeholder="Mobile Number" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                        <div className="relative group/input">
                          <MapPin size={16} className="absolute left-4 top-3.5 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                          <input type="text" name="city" value={formData.city} onChange={handleChange}
                            placeholder="Current City" required
                            className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder-slate-500 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group/input">
                          <GraduationCap size={16} className="absolute left-4 top-3.5 text-slate-950 z-10 group-focus-within/input:text-[#05347f] transition-colors" />
                          <select name="course" value={formData.course} onChange={handleChange} required disabled={coursesLoading}
                            className="w-full pl-12 pr-8 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl appearance-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 font-bold cursor-pointer disabled:opacity-60"
                          >
                            <option value="">{coursesLoading ? "Loading courses…" : "Target Course"}</option>
                            {courses.map((c) => (
                              <option key={c._id} value={c.name || c._id}>{c.name || c.title || c._id}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-4.5 w-2 h-2 border-r-2 border-b-2 border-slate-950 pointer-events-none transform rotate-45"></div>
                        </div>

                        <div className="relative group/input">
                          <Tag size={16} className="absolute left-4 top-3.5 text-slate-950 z-10 group-focus-within/input:text-[#05347f] transition-colors" />
                          <select name="branch" value={formData.branch} onChange={handleChange} disabled={!specializations.length}
                            className="w-full pl-12 pr-8 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl appearance-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                          >
                            <option value="">
                              {!formData.course ? "Select course first" : specializations.length ? "Specialization / Branch" : "No specializations"}
                            </option>
                            {specializations.map((sp, i) => (
                              <option key={i} value={sp}>{sp}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-4.5 w-2 h-2 border-r-2 border-b-2 border-slate-950 pointer-events-none transform rotate-45"></div>
                        </div>
                      </div>

                      <div className="relative group/input">
                        <MessageSquare size={16} className="absolute left-4 top-4 text-slate-950 group-focus-within/input:text-[#05347f] transition-colors z-10" />
                        <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
                          placeholder="What is your biggest confusion or career goal right now?"
                          className="w-full pl-12 pr-4 py-3 text-sm bg-white border-2 border-slate-300 rounded-xl resize-none focus:border-[#05347f] focus:ring-4 focus:ring-blue-100 outline-none text-slate-950 placeholder-slate-500 font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
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
                          {/* Day Picker */}
                          <div className="grid grid-cols-2 gap-3">
                            {uniqueDays.map(({ label, count }) => (
                              <button key={label} type="button"
                                onClick={() => { setPickedDay(label); setPickedTime(null); setSelectedSlotId(null); }}
                                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden ${
                                  pickedDay === label
                                    ? "bg-[#5177b2] border-[#5177b2] text-white shadow-md scale-[1.01]"
                                    : "bg-white border-slate-300 text-slate-950 hover:border-slate-400"
                                }`}
                              >
                                <div className="font-black text-sm tracking-tight">{label}</div>
                                {/* ✅ FIX 1: "X Seats Left" show karo — naye model mein count = remainingSeats */}
                                <div className={`text-xs font-black mt-1 ${pickedDay === label ? "text-amber-400" : "text-orange-600"}`}>
                                  🔥 {count} Seat{count !== 1 ? "s" : ""} Left
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Time Grid */}
                          <div className="grid grid-cols-3 gap-2.5 pt-2">
                            {/* ✅ FIX 2: remainingSeats > 0 filter — isBooked nahi, kyunki slot partially booked ho sakta hai */}
                            {backendSlots
                              .filter((slot) => slot.date === pickedDay && slot.remainingSeats > 0)
                              .map((slot) => (
                                <button key={slot._id} type="button"
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`py-3 rounded-xl border-2 text-xs font-black transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
                                    pickedTime === slot.time
                                      ? "bg-[#05347f] border-[#05347f] text-white shadow-md scale-[1.03]"
                                      : "bg-white border-slate-300 text-slate-950 hover:border-slate-400"
                                  }`}
                                >
                                  <span className="flex items-center gap-1">
                                    {pickedTime === slot.time && <Check size={11} strokeWidth={3} />}
                                    {slot.time}
                                  </span>
                                  {/* ✅ Remaining seats hint */}
                                  <span className={`text-[10px] font-bold ${pickedTime === slot.time ? "text-blue-200" : "text-slate-400"}`}>
                                    {slot.remainingSeats} left
                                  </span>
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t-2 border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-950">
                      <Lock size={13} className="text-slate-950" />
                      100% Secure & Private
                    </div>
                    <div className="flex items-center gap-2">
                      {step > 1 && (
                        <button type="button" onClick={() => setStep((s) => s - 1)}
                          className="px-4 py-2.5 text-xs font-black text-slate-950 hover:text-red-600 transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button type="button" onClick={handleNext}
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

          <style jsx>{`
            @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.99) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
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