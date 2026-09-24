"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/utlis/api.js";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaVenusMars,
  FaBook,
  FaMapMarkerAlt,
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

export default function RequestCallbackForm() {
  const [inquiryType, setInquiryType] = useState("Request Call Back");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.mobileNumber ||
      !formData.gender ||
      !formData.course ||
      !formData.state ||
      !formData.fullAddress
    ) {
      toast.error("Please fill all required fields!");
      return;
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
      // ✅ Using centralized api.js
      const payload = { ...formData, inquiryType };
      const data = await callbackAPI.create(payload);

      toast.success(
        data.message || "Request submitted! We'll contact you soon 🎉"
      );

      // Reset
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
      setInquiryType("Request Call Back");
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Get in Touch
          </h1>
          <p className="text-white/80 mt-2 text-sm sm:text-base">
            Fill the form and our team will reach out to you shortly
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-white/20 backdrop-blur-md rounded-xl p-1 mb-6">
          {["Request Call Back", "Book Counselling"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setInquiryType(type)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
                inquiryType === type
                  ? "bg-white text-indigo-700 shadow-lg scale-[1.02]"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={<FaUser />}
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              icon={<FaEnvelope />}
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              icon={<FaPhoneAlt />}
              name="mobileNumber"
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <p className="text-white/90 font-semibold text-sm mb-3">
              Academic & Location Details
            </p>
            <div className="h-px bg-white/20 mb-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField
              icon={<FaVenusMars />}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              placeholder="Gender"
            />
            <SelectField
              icon={<FaBook />}
              name="course"
              value={formData.course}
              onChange={handleChange}
              options={[
                "B.Tech",
                "M.Tech",
                "BBA",
                "MBA",
                "B.Com",
                "M.Com",
                "BCA",
                "MCA",
                "Other",
              ]}
              placeholder="Course"
            />
            <SelectField
              icon={<FaMapMarkerAlt />}
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={[
                "Delhi",
                "Uttar Pradesh",
                "Maharashtra",
                "Karnataka",
                "Tamil Nadu",
                "Gujarat",
                "Rajasthan",
                "Other",
              ]}
              placeholder="State"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-4 text-white/60">
              <FaHome />
            </div>
            <textarea
              name="fullAddress"
              placeholder="Full Address"
              value={formData.fullAddress}
              onChange={handleChange}
              rows={3}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/70 transition-all resize-none"
            />
          </div>

          {/* Show only for Book Counselling */}
          {inquiryType === "Book Counselling" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              <InputField
                icon={<FaCalendarAlt />}
                name="preferredDate"
                type="date"
                placeholder="Preferred Date"
                value={formData.preferredDate}
                onChange={handleChange}
              />
              <InputField
                icon={<FaClock />}
                name="preferredTime"
                type="time"
                placeholder="Preferred Time"
                value={formData.preferredTime}
                onChange={handleChange}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-white text-indigo-700 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane /> Submit Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============ Reusable Input ============
function InputField({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/70 transition-all"
      />
    </div>
  );
}

// ============ Reusable Select ============
function SelectField({ icon, options, placeholder, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10">
        {icon}
      </div>
      <select
        {...props}
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/70 transition-all appearance-none cursor-pointer"
      >
        <option value="" disabled className="text-gray-800">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-gray-800">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
        ▼
      </div>
    </div>
  );
}