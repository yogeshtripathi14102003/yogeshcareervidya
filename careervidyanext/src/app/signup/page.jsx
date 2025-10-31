"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/utlis/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    courese: "",
    gender: "",
    addresses: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validate all required fields
  const validateAllFields = () => {
    const requiredFields = [
      "name",
      "mobileNumber",
      "email",
      "city",
      "state",
      "courese",
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

  // 🔹 STEP 1: Send OTP
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

  // 🔹 STEP 2: Verify OTP & Register
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
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        state: formData.state,
        courese: formData.courese,
        gender: formData.gender,
        addresses: formData.addresses,
      };

      const res = await api.post("/api/v1/verify-otp", payload);
      console.log("OTP Verified & User Registered:", res.data);
      alert("Registration successful!");
      setOtpSent(false);
    } catch (error) {
      console.error("OTP Verification Failed:", error.response?.data || error.message);
      alert("Invalid OTP. Please try again.");
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Submit based on OTP stage
  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFF5F5] to-[#FFE4E1] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side Info */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start text-[#333333]">
        <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
        <h2 className="text-2xl font-semibold mb-6">Unlock Your Future with Career Vidya</h2>
        <p className="mb-4">Register now and get exclusive access to:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Exam & Admission Alerts</li>
          <li>Mock Tests & Sample Papers</li>
          <li>AI-Based College Prediction Tools</li>
          <li>1-on-1 Counselling from Experts</li>
        </ul>
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
              required
            />

            {/* Email + Mobile */}
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

            {/* City + State */}
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

            {/* Course + Gender */}
            <div className="flex space-x-4">
              <input
                type="text"
                name="courese"
                placeholder="Course"
                value={formData.courese}
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

            {/* Address */}
            <input
              type="text"
              name="addresses"
              placeholder="Address"
              value={formData.addresses}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
              required
            />

            {/* OTP Input */}
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

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 rounded-md text-white transition ${
                !otpSent ? "bg-[#FFA500]" : "bg-[#1E90FF]"
              } hover:opacity-90`}
            >
              {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify OTP"}
            </button>
          </form>

          <p className="mt-4 text-center text-[#1E90FF]">
            Already have a Career Vidya account?{" "}
            <Link href="/login">Login to continue</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
