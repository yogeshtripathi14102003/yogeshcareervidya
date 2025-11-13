"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/utlis/api"; // ✅ Make sure this points to your axios instance

const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    course: "",
    gender: "",
    addresses: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate before sending OTP
  const validateAllFields = () => {
    const requiredFields = [
      "name",
      "mobileNumber",
      "email",
      "city",
      "state",
      "course",
      "gender",
      "addresses",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the "${field}" field before sending OTP.`);
        return false;
      }
    }
    return true;
  };

  // ✅ Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    try {
      setLoading(true);
      const payload = {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      };
      const res = await api.post("/api/v1/send-otp", payload);
      console.log("OTP Sent:", res.data);
      alert("OTP sent successfully! Please check your email or phone.");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert("Please enter the OTP first.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        emailOrPhone: formData.email || formData.mobileNumber,
        otp: formData.otp,
        purpose: "register",
        ...formData,
      };

      const res = await api.post("/api/v1/verify-otp", payload);
      console.log("OTP Verified & User Registered:", res.data);
      alert("Registration successful!");
      onClose?.(); // ✅ close popup after success
    } catch (error) {
      console.error("OTP Verification Failed:", error.response?.data || error.message);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  return (
    // ✅ Background overlay (click outside to close)
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Popup card */}
      <div
        className="bg-white rounded-2xl shadow-xl w-[95%] md:w-[900px] overflow-hidden flex flex-col md:flex-row relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Left Side Info */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-r from-[#F0F8FF] to-[#E6F0FF] flex flex-col justify-center items-start text-[#333333]">
          <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
          <h2 className="text-2xl font-semibold mb-6">
            Unlock Your Future with Career Vidya
          </h2>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Exam Alerts Timely updates Smart decisions</li>
            <li>Mock Tests Practice. Perform Perfect.</li>
            <li>AI Predictions Data-driven college matches</li>
            <li>Counselling Personal guidance.Real results.</li>
          </ul>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center relative">
          {/* Close Button (works ✅) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>

          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                required
              />

              <div className="flex space-x-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                  required
                />
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  name="course"
                  placeholder="Course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                required
              />

              {otpSent && (
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full p-2 rounded-md text-white transition ${
                  !otpSent ? "bg-[#FFA500]" : "bg-[#1E90FF]"
                } hover:opacity-90`}
              >
                {loading
                  ? "Please wait..."
                  : !otpSent
                  ? "Send OTP"
                  : "Verify OTP"}
              </button>
            </form>

            <p className="mt-4 text-center text-[#1E90FF]">
              Already have a Career Vidya account?{" "}
              <Link href="/login">Login to continue</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signup;
