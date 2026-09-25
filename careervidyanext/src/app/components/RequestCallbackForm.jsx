"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FaTimes, FaSpinner } from "react-icons/fa";
import api from "@/utlis/api.js"; // 👈 aapka existing api.js

// ============================================================
// 🏠 MAIN PAGE
// ============================================================
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
        >
          Open Form
        </button>

        <CallbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}

/* ============================================================
   🪟 MODAL — Left Blue Panel + Right Form
============================================================ */
function CallbackModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-all"
          aria-label="Close"
        >
          <FaTimes className="text-lg" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT — Blue Panel */}
          <div className="bg-[#0B1437] text-white p-6 sm:p-8 lg:p-10">
            <h3 className="text-lg sm:text-xl font-bold mb-6">
              Why register with Career Vidya?
            </h3>

            <ul className="space-y-5 text-sm sm:text-base leading-relaxed text-gray-200">
              <li className="flex gap-3">
                <span className="text-white mt-1.5">•</span>
                <span>
                  <strong className="text-white">25000+</strong> Students
                  Counselled, Absolutely Free of Cost
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-white mt-1.5">•</span>
                <span>
                  Get help from our experts in finding the right college for you
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-white mt-1.5">•</span>
                <span>
                  With totally online Admission Process we help you get college
                  admission without having to step out
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-white mt-1.5">•</span>
                <span>You won't get unwanted calls from third parties</span>
              </li>
            </ul>
          </div>

          {/* RIGHT — Form */}
          <div className="p-6 sm:p-8 lg:p-10">
            <CallbackForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   📝 FORM — Request Call Back / Book Counselling
============================================================ */
function CallbackForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [inquiryType, setInquiryType] = useState("Request Call Back");

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

    // 🔹 Common fields (dono tab ke liye)
    if (!formData.fullName || !formData.email || !formData.mobileNumber) {
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

    // 🔹 Book Counselling ke extra validations
    if (inquiryType === "Book Counselling") {
      if (
        !formData.gender ||
        !formData.course ||
        !formData.state ||
        !formData.fullAddress
      ) {
        toast.error("Please fill all required fields!");
        return;
      }

      if (!formData.preferredDate || !formData.preferredTime) {
        toast.error("Please select preferred date & time!");
        return;
      }
    }

    setLoading(true);

    try {
      // 🔹 Payload — model ke hisaab se
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        inquiryType: inquiryType,

        // Book Counselling ke liye hi bhejna
        gender:
          inquiryType === "Book Counselling" ? formData.gender : "Other",
        course:
          inquiryType === "Book Counselling"
            ? formData.course
            : "Not Specified",
        state:
          inquiryType === "Book Counselling"
            ? formData.state
            : "Not Specified",
        fullAddress:
          inquiryType === "Book Counselling"
            ? formData.fullAddress
            : "Not Provided",
        preferredDate:
          inquiryType === "Book Counselling" ? formData.preferredDate : null,
        preferredTime:
          inquiryType === "Book Counselling" ? formData.preferredTime : null,
      };

      const res = await api.post("/api/v1/callback/request", payload);
      const data = res.data;

      toast.success(
        data?.message || "Request submitted! We'll contact you soon 🎉"
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

      setTimeout(() => onSuccess?.(), 1200);
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const isCounselling = inquiryType === "Book Counselling";

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-snug">
        Get college counselling from experts, free of cost !
      </h2>

      {/* Toggle Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
        {["Request Call Back", "Book Counselling"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setInquiryType(type)}
            className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all ${
              inquiryType === type
                ? "bg-[#3B4FE4] text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 flex-1 overflow-y-auto pr-1"
      >
        {/* Common: Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        {/* Common: Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        {/* Common: Mobile with +91 */}
        <div className="flex gap-2">
          <div className="flex items-center px-3 py-3 border border-gray-300 rounded-md text-gray-700 bg-gray-50 text-sm font-medium">
            +91
          </div>
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            maxLength={10}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Only for Book Counselling — Extra fields */}
        {isCounselling && (
          <div className="space-y-3 animate-fadeIn">
            {/* Gender — Dropdown */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Course — Text Input */}
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            {/* State — Text Input */}
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            {/* Full Address */}
            <textarea
              name="fullAddress"
              placeholder="Full Address"
              value={formData.fullAddress}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#3B4FE4] hover:bg-[#2d3fd0] text-white font-semibold text-base py-3.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Submitting...
            </>
          ) : isCounselling ? (
            "Book Counselling"
          ) : (
            "Request A Callback"
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center pt-2 leading-relaxed">
          By proceeding ahead you expressly agree to the Career Vidya{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}