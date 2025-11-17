"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("OTP sent (Simulated).");
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Please enter the OTP first.");
    setLoading(true);
    setTimeout(() => {
      console.log("Registration successful (Simulated)!");
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-[#D50000]/20">
      <h2 className="text-xl md:text-2xl font-bold text-[#D50000] mb-6 text-center">
        APPLY FOR ONLINE MBA
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
          required
        />

        <div className="flex space-x-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
            required
          />
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
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
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
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
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
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
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
          required
        />

        {otpSent && (
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#D50000]"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-md text-white font-semibold transition ${
            !otpSent ? "bg-[#D50000]" : "bg-black"
          } hover:opacity-90`}
        >
          {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify OTP"}
        </button>
      </form>

      <p className="mt-4 text-center text-[#D50000] text-sm">
        Already registered?{" "}
        <Link href="/login" className="underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

// --- MAIN PAGE SECTION ---
export default function OnlineMBAPannerCU({
  image = "/images/cu_building.jpg",
}) {
  const backgroundStyle = { backgroundImage: `url(${image})` };

  return (
    <div className="relative w-full min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-[#D50000]/80 via-white to-black/70 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-25" style={backgroundStyle} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#D50000]/30 via-white/40 to-black/20"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 max-w-6xl w-full items-center py-12">
        {/* Left: Info */}
        <div className="text-[#D50000] p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Online MBA</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">
            Chandigarh University
          </h2>

          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg inline-block">
            <p className="text-[#D50000] font-bold text-lg">
              🎓 Enroll now for CU Online MBA —{" "}
              <Link
                href="/contact"
                className="text-black underline hover:text-[#D50000]"
              >
                Contact us
              </Link>{" "}
              for admission details.
            </p>
          </div>

          <p className="mt-4 text-black font-semibold">
            🎓 Your MBA Journey Starts Here — 100% Online, 100% Career-Focused.
          </p>
             <p className="mt-4 text-black font-semibold">
            💳 No Cost EMI Options Available
          </p>

          {/* Accreditation Logos */}
        <div className="mt-6 flex flex-wrap justify-start items-center gap-4">
  <div className="bg-white shadow-md rounded-lg p-2 transition-transform duration-300 hover:scale-105">
    <img
      src="/images/n2.png"
      alt="QS World University Ranking"
      className="h-10 md:h-12 object-contain"
    />
  </div>
  <div className="bg-white shadow-md rounded-lg p-2 transition-transform duration-300 hover:scale-105">
    <img
      src="/images/n3.png"
      alt="UGC Approved Program"
      className="h-10 md:h-12 object-contain"
    />
  </div>
  {/* <div className="bg-white shadow-md rounded-lg p-2 transition-transform duration-300 hover:scale-105">
    <img
      src="/images/n1.png"
      alt="Harvard Business Publishing Education"
      className="h-10 md:h-12 object-contain"
    />
  </div> */}
</div>


       
        </div>

        {/* Right: Form */}
        <div className="flex items-center justify-center">
          <SignUpFormCU />
        </div>
      </div>
    </div>
  );
}
