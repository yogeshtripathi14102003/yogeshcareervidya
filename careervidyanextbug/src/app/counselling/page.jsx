"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/utlis/api";
import Header from "../layout/Header";
import Counter from "../components/counter/page";
import FLOW from "../components/FLOW.jsx";
import Footer from "../layout/Footer";

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
    <>
      <Header />

      {/* Page Wrapper: Always white */}
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-white p-4">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">

          {/* ===== Left Info Section ===== */}
          <div className="w-full md:w-1/2 p-6 md:p-8 bg-gradient-to-br from-[#E6F0FF] to-[#FFF5E5] flex flex-col justify-center text-[#333333]">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E90FF] mb-3 md:mb-4">Career Vidya</h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-[#FFA500]">
              Unlock Your Future with Career Vidya
            </h2>
            <ul className="list-disc list-inside mb-4 md:mb-6 space-y-1 md:space-y-2 text-[#333333] text-sm md:text-base">
              <li>Exam Alerts — Timely updates for smart decisions</li>
              <li>Mock Tests — Practice. Perform. Perfect.</li>
              <li>AI Predictions — Data-driven college matches</li>
              <li>Counselling — Personal guidance. Real results.</li>
            </ul>
          </div>

          {/* ===== Right Form Section ===== */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">

                {/* Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                  required
                />

                {/* Email & Mobile */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                    required
                  />
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                    required
                  />
                </div>

                {/* City & State */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                    required
                  />
                </div>

                {/* Course & Gender */}
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                  <input
                    type="text"
                    name="course"
                    placeholder="Course"
                    value={formData.course}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                    required
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
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
                  className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                  required
                />

                {/* OTP */}
                {otpSent && (
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className="text-[#333333] placeholder:text-gray-400 w-full p-2 md:p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#1E90FF]"
                  />
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full p-2 md:p-3 rounded-md text-white font-semibold transition ${
                    !otpSent ? "bg-[#FFA500]" : "bg-[#1E90FF]"
                  } hover:opacity-90`}
                >
                  {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify OTP"}
                </button>
              </form>

              <p className="mt-3 md:mt-4 text-center text-[#1E90FF] text-sm md:text-base">
                Already have a Career Vidya account?{" "}
                <Link href="/login" className="text-[#FFA500] hover:underline">
                  Login to continue
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      <Counter />
      <FLOW />
      <Footer />
    </>
  );
};

export default Signup;
