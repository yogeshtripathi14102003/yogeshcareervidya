"use client";
import React, { useState } from "react";
import Image from "next/image";
import api from "@/utlis/api";

// --- 1. Full Form Component (सारी Fields के साथ) ---
const SignUpFormCU = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", mobileNumber: "", email: "", otp: "", city: "", 
    state: "", course: "Online MBA", gender: "", addresses: "", branch: "Management",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
      setOtpSent(true);
    } catch (err) { alert("Failed to send OTP."); }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
      alert("Registration Successful!");
    } catch (err) { alert("Registration Failed."); }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/20 relative">
      <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Apply for Online MBA</h2>
      <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <div className="flex gap-2">
          <input name="email" placeholder="Email" onChange={handleChange} className="w-1/2 p-2 border rounded" required />
          <input name="mobileNumber" placeholder="Mobile" onChange={handleChange} className="w-1/2 p-2 border rounded" required />
        </div>
        <div className="flex gap-2">
          <input name="city" placeholder="City" onChange={handleChange} className="w-1/2 p-2 border rounded" required />
          <input name="state" placeholder="State" onChange={handleChange} className="w-1/2 p-2 border rounded" required />
        </div>
        <select name="gender" onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
        <input name="addresses" placeholder="Address" onChange={handleChange} className="w-full p-2 border rounded" required />
        {otpSent && <input name="otp" placeholder="Enter OTP" onChange={handleChange} className="w-full p-2 border-2 border-green-500 rounded text-center" required />}
        <button type="submit" className="w-full py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">
          {loading ? "Processing..." : !otpSent ? "SEND OTP" : "VERIFY & APPLY"}
        </button>
      </form>
    </div>
  );
};

// --- 2. Main Page ---
export default function OnlineMBAPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#F97316] text-white  text-center px-4 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Online MBA – Chandigarh University</h1>
        <p className="text-lg text-gray-100 mb-10 max-w-2xl mx-auto">
          Reshape your career trajectory with an internationally recognized Online MBA Degree.
        </p>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white text-xl font-semibold py-3 px-8 rounded-lg shadow-2xl mx-auto">
          Apply Now
        </button>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-white text-center border-t">
        <div className="flex justify-center items-center gap-4 mb-2">
          <Image src="/images/logoUpdated.png" alt="CU" width={80} height={30} className="object-contain" />
          <Image src="/images/upgrade.png" alt="upGrad" width={80} height={30} className="object-contain" />
        </div>
        <p className="text-xs text-gray-500">© 2026 All Rights Reserved | Online MBA Portal</p>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative">
            <button onClick={() => setShowModal(false)} className="absolute -top-10 right-0 text-white font-bold">✕ Close</button>
            <SignUpFormCU />
          </div>
        </div>
      )}
    </div>
  );
}