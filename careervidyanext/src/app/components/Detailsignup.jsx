"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/utlis/api";

// Enhanced input styling for clear border and focus effect
const inputStyle =
  "w-full p-2 border border-gray-300 rounded-md transition-all duration-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none";

const Signup = () => {
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
  const [expanded, setExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    try {
      setLoading(true);
      const payload = {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      };
      await api.post("/api/v1/send-otp", payload);
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
      // NOTE: Assuming your backend returns a token or success response.
      await api.post("/api/v1/verify-otp", payload);
      alert("Registration successful!");
      // Optionally navigate to a dashboard or login page here
    } catch (error) {
      console.error("OTP Verification Failed:", error.response?.data || error.message);
      alert("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-[95%] md:w-[900px] overflow-hidden flex flex-col md:flex-row mx-auto my-6">
      
      {/* Left Side - MOBILE VIEW ME CHHUPAYA GAYA */}
      <div className="w-full md:w-1/2 p-8 bg-gradient-to-r from-[#F0F8FF] to-[#E6F0FF] flex-col justify-center items-start text-[#333333] hidden md:flex">
        <h1 className="text-4xl font-bold text-[#05347f] mb-4">Career Vidya</h1>
        <h2 className="text-2xl font-semibold mb-6">Unlock Your Future with Career Vidya</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Exam Alerts – Timely updates</li>
          <li>Mock Tests – Practice. Perform Perfect.</li>
          <li>AI Predictions – Data-driven college matches</li>
          <li>Counselling – Personal guidance. Real results.</li>
        </ul>
      </div>

      {/* Right Side - MOBILE VIEW ME POORI CHAUDAI LI GAI */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-md relative">

          <h2 className="text-2xl font-bold text-center mb-4 text-[#05347f]">
            Apply Online Course Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">


            {/* FIRST FIELDS — Always Visible */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
              required
            />

            <div className="flex space-x-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-1/2 ${inputStyle}`}
                required
              />
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`w-1/2 ${inputStyle}`}
                required
              />
            </div>

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className={inputStyle}
              required
            />


            {/* Remaining fields — Visible ONLY After Expand */}
            {expanded && (
              <div className="space-y-4 animate-fadeIn">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />

                <div className="flex space-x-4">
                  <input
                    type="text"
                    name="course"
                    placeholder="Course"
                    value={formData.course}
                    onChange={handleChange}
                    className={`w-1/2 ${inputStyle}`}
                    required
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-1/2 ${inputStyle}`}
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
                  className={inputStyle}
                  required
                />

                {otpSent && (
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                )}
              </div>
            )}

            {/* Submit Button — Visible only after expand */}
            {expanded && (
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 rounded-md text-white font-semibold transition-colors duration-200 
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : !otpSent
                    ? "bg-[#FFA500] hover:bg-[#FF8C00]"
                    : "bg-[#1E90FF] hover:bg-[#0077c9]"
                }`}
              >
                {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify OTP"}
              </button>
            )}

            {/* Login Link */}
            {expanded && (
              <p className="mt-4 text-center text-[#1E90FF]">
                Already have a Career Vidya account?{" "}
                <Link href="/login" className="font-semibold hover:underline">Login to continue</Link>
              </p>
            )}
          </form>
        </div>

        {/* Expand Button — ONLY this shows first */}
        {!expanded && (
          <div className="relative h-14 w-full">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="bg-[#05347f] w-12 h-12 rounded-full flex justify-center items-center 
              text-white text-3xl shadow-lg hover:shadow-xl transition-all duration-300 
              absolute bottom-0 left-1/2 -translate-x-1/2"
            >
              ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;