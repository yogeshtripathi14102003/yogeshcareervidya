"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FaPhoneAlt,
  FaUser,
  FaGraduationCap,
  FaClock,
  FaArrowRight,
  FaShieldAlt,
  FaSpinner,
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaVenusMars,
  FaTimes,
} from "react-icons/fa";
import api from "@/utlis/api.js";

// ============================================================
// 🪟 REQUEST CALLBACK FORM — Modal Popup
// ============================================================
export default function RequestCallbackForm({ isOpen, onClose }) {
  const [view, setView] = useState("callback");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("callback");
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />

      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-3 overflow-y-auto"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#082451]/70 backdrop-blur-sm" />

        {/* Modal - Compact Width & Border Radius */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[760px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,39,100,0.25)] overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 z-50 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 border border-gray-200 text-[#174685] hover:bg-white hover:scale-105 transition-all shadow-sm"
            aria-label="Close"
          >
            <FaTimes className="text-[11px]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[42%_58%]">
            {/* ==================================================
                LEFT SIDE
            ================================================== */}
            <div className="hidden md:flex flex-col bg-[#EEF7FF] p-6 justify-between">
              <div>
                {/* CTA Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#F58220] text-white px-2.5 py-1 rounded-full text-[10px] font-bold mb-3 shadow-sm">
                  <FaPhoneAlt className="text-[8px]" />
                  Free Career Guidance
                </div>

                {/* Heading */}
                <h2 className="text-[22px] leading-snug font-extrabold text-[#173F7A]">
                  Talk to Our <br />
                  <span className="text-[#1264C5]">Career </span>
                  <span className="text-[#F58220]">Counsellor</span>
                </h2>

                <p className="mt-1.5 text-[12px] leading-relaxed text-[#55739E]">
                  Personalized guidance for courses, fees & admissions.
                </p>

                {/* Logo - Text ke niche Shifted */}
                <div className="mt-4">
                  <Image
                    src="/images/n12.png"
                    alt="CareerVidya"
                    width={130}
                    height={45}
                    priority
                    className="w-[110px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* Vector Image */}
              <div className="pt-2 flex justify-center">
                <Image
                  src="/images/inquiry.png"
                  alt="CareerVidya counselling"
                  width={280}
                  height={200}
                  priority
                  className="w-full max-w-[210px] h-auto object-contain"
                />
              </div>
            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}
            <div className="bg-white p-5 sm:p-6 flex items-center">
              <div className="w-full">
                {view === "callback" ? (
                  <CallbackForm
                    onBookCounselling={() => setView("counselling")}
                    onClose={onClose}
                  />
                ) : (
                  <CounsellingForm
                    onBack={() => setView("callback")}
                    onClose={onClose}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   📞 CALLBACK FORM (Compact)
============================================================ */
function CallbackForm({ onBookCounselling, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    preferredTime: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.mobileNumber || !formData.preferredTime) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: "notprovided@carrervidya.com",
        mobileNumber: formData.mobileNumber,
        inquiryType: "Request Call Back",
        gender: "Other",
        course: "Not Specified",
        state: "Not Specified",
        fullAddress: "Not Provided",
        preferredDate: null,
        preferredTime: formData.preferredTime,
      };

      const res = await api.post("/api/v1/callback/request", payload);

      toast.success(
        res.data?.message || "Request submitted! We'll contact you soon 🎉"
      );

      setFormData({
        fullName: "",
        mobileNumber: "",
        preferredTime: "",
      });

      setTimeout(() => onClose?.(), 1200);
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-3">
        <h3 className="text-[20px] font-bold text-[#174685] leading-tight">
          Request a Callback
        </h3>
        <p className="mt-0.5 text-[12px] text-[#6680A5]">
          Select your timing and we will get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <InputField
          icon={<FaUser />}
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <InputField
          icon={<FaPhoneAlt />}
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          type="tel"
          maxLength={10}
        />

        <SelectField
          icon={<FaClock />}
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          placeholder="Preferred Callback Time"
          options={["9 AM - 12 PM", "12 PM - 3 PM", "3 PM - 6 PM", "6 PM - 9 PM"]}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1 bg-[#F58220] hover:bg-[#E87512] text-white font-bold text-[12.5px] py-2.5 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-[12px]" />
              Submitting...
            </>
          ) : (
            <>
              <FaPhoneAlt className="text-[10px]" />
              Request Callback
              <FaArrowRight className="text-[10px]" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[10.5px] text-[#7186A5]">
        <FaShieldAlt className="text-[#174685] text-[11px]" />
        Your privacy is completely safe with us.
      </div>

      {/* Book Free Counselling Option */}
      <button
        type="button"
        onClick={onBookCounselling}
        className="w-full mt-3 border border-[#1264C5] text-[#1264C5] hover:bg-[#1264C5] hover:text-white font-semibold text-[12px] py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5"
      >
        <span>📅</span> Book Free Counselling
      </button>
    </>
  );
}

/* ============================================================
   📅 COUNSELLING FORM (Compact)
============================================================ */
function CounsellingForm({ onBack, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    course: "",
    state: "",
    fullAddress: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      "fullName",
      "email",
      "mobileNumber",
      "gender",
      "course",
      "state",
      "fullAddress",
      "preferredDate",
      "preferredTime",
    ];

    for (const key of required) {
      if (!formData[key]) {
        toast.error("Please fill all fields!");
        return;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/v1/callback/request", {
        ...formData,
        inquiryType: "Book Counselling",
      });

      toast.success(res.data?.message || "Counselling booked! 🎉");

      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        gender: "",
        course: "",
        state: "",
        fullAddress: "",
        preferredDate: "",
        preferredTime: "",
      });

      setTimeout(() => onClose?.(), 1200);
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-2.5">
        <h3 className="text-[19px] font-bold text-[#174685] leading-tight">
          Book Free Counselling
        </h3>
        <p className="mt-0.5 text-[11.5px] text-gray-500">
          Schedule a 1-on-1 session with our expert.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-2 max-h-[60vh] overflow-y-auto pr-1"
      >
        <InputField
          icon={<FaUser />}
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <InputField
          icon={<FaEnvelope />}
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />

        <InputField
          icon={<FaPhoneAlt />}
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          type="tel"
          maxLength={10}
        />

        <div className="grid grid-cols-2 gap-2">
          <SelectField
            icon={<FaVenusMars />}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            options={["Male", "Female", "Other"]}
          />
          <InputField
            icon={<FaGraduationCap />}
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
          />
        </div>

        <InputField
          icon={<FaMapMarkerAlt />}
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
        />

        <textarea
          name="fullAddress"
          placeholder="Full Address"
          value={formData.fullAddress}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 bg-gray-50/50 rounded-md text-[12px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#174685] transition-all resize-none"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full px-2.5 py-2 border border-gray-200 bg-gray-50/50 rounded-md text-[12px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#174685]"
          />
          <input
            type="time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className="w-full px-2.5 py-2 border border-gray-200 bg-gray-50/50 rounded-md text-[12px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#174685]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F58220] hover:bg-[#E87512] text-white font-bold text-[12.5px] py-2.5 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-[12px]" />
              Submitting...
            </>
          ) : (
            "Book Counselling"
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-[11px] text-gray-500 hover:text-[#174685] transition-all flex items-center justify-center gap-1 pt-0.5"
        >
          <FaArrowLeft className="text-[8px]" />
          Back to Request Callback
        </button>
      </form>
    </>
  );
}

/* ============================================================
   🧩 REUSABLE INPUT (Compact)
============================================================ */
function InputField({
  icon,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  maxLength,
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#617EA7] text-[11px] pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full pl-8 pr-3 py-2 border border-[#D6E0EC] bg-white rounded-md text-[12px] text-gray-800 placeholder-[#7388A7] focus:outline-none focus:ring-1 focus:ring-[#174685] focus:border-[#174685] transition-all"
      />
    </div>
  );
}

/* ============================================================
   🧩 REUSABLE SELECT (Compact)
============================================================ */
function SelectField({ icon, name, value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#617EA7] text-[11px] pointer-events-none z-10">
        {icon}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-8 pr-6 py-2 border border-[#D6E0EC] bg-white rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-[#174685] focus:border-[#174685] transition-all appearance-none cursor-pointer ${
          value ? "text-gray-800" : "text-[#7388A7]"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-gray-800">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#617EA7] text-[8px] pointer-events-none">
        ▼
      </div>
    </div>
  );
}