"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utlis/api"; // API import logic

const SignUpFormCU = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => setIsMounted(true), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ======================
      🔧 LOGIC START
  ====================== */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      };

      const res = await api.post("/api/v1/send-otp", payload);

      if (res?.status === 200) {
        setOtpSent(true);
      } else {
        alert("OTP not sent");
      }
    } catch (error) {
      console.error("SEND OTP ERROR:", error);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Please enter the OTP first.");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      };

      const res = await api.post("/api/v1/verify-otp", payload);

      if (res?.status === 200) {
        alert("Registration successful!");
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };
  /* ======================
      🔧 LOGIC END
  ====================== */

  if (!isMounted) return null;

  return (
    <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-[#1A4CA3]/20">
      <h2 className="text-xl md:text-2xl font-bold text-[#1A4CA3] mb-6 text-center">
        APPLY FOR ONLINE COURSE
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
          required
        />

        <div className="flex space-x-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
            required
          />
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
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
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
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
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
            required
          >
            <option value="">Select Gender</option>
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
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
          required
        />

        {otpSent && (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F58634]"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-md text-white font-semibold transition ${
            !otpSent ? "bg-[#F58634]" : "bg-[#1A4CA3]"
          } hover:opacity-90`}
        >
          {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify OTP"}
        </button>
      </form>

      <p className="mt-4 text-center text-[#1A4CA3] text-sm">
        Already registered?{" "}
        <Link href="/login" className="underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

// MAIN PAGE SECTION
export default function OnlineMBAPannerCU({
  image = "/images/cu_building.jpg",
}) {
  const backgroundStyle = { backgroundImage: `url(${image})` };

  return (
    <div
      className="relative w-full min-h-[50vh] flex items-center justify-center 
      bg-gradient-to-r from-[#F58634]/90 via-white to-[#1A4CA3]/90 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={backgroundStyle}
      />

      <div className="absolute inset-0 bg-gradient-to-r 
          from-[#F58634]/40 via-white/40 to-[#1A4CA3]/40"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] 
          gap-10 max-w-6xl w-full items-center py-12">

        {/* LEFT SECTION */}
        <div className="text-[#1A4CA3] p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-[#F58634]">
            B.Tech Students Working Professionals For 4x Career Growth
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">
            Universities Approved By :
          </h2>

          <div className="mt-6 flex flex-wrap justify-start items-center gap-4">
            <div className="bg-white shadow-md rounded-lg p-2 hover:scale-105 transition-transform">
              <img src="/images/n2.png" alt="N2 Logo" className="h-10 md:h-12" />
            </div>

            <div className="bg-white shadow-md rounded-lg p-2 hover:scale-105 transition-transform">
              <img src="/images/WPaicte.jpeg" alt="AICTE Logo" className="h-10 md:h-12" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg inline-block mt-4">
            <p className="text-[#F58634] font-bold text-lg">
              🎓 Enroll now for Online Course —{" "}
              <Link href="/contactus" className="text-black underline">
                Contact us
              </Link>{" "}
              for admission details.
            </p>
          </div>

          <p className="mt-4 text-black font-semibold">
            🎓 Your Journey Starts Here — 100% Online, 100% Career-Focused.
          </p>

          <p className="mt-4 text-black font-semibold">
            💳 No Cost EMI Options Available
          </p>
        </div>

        {/* RIGHT: FORM */}
        <div className="flex items-center justify-center">
          <SignUpFormCU />
        </div>
      </div>
    </div>
  );
}