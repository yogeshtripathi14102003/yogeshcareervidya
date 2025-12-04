"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/utlis/api";

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
    dateOfBirth: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateInputType, setDateInputType] = useState("text");

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
      "dateOfBirth",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`⚠ Please fill the "${field}" field before continuing.`);
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
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      alert("OTP sent successfully! Check your email or phone.");
      setOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert("Please enter OTP to continue.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/v1/verify-otp", {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      alert("Registration successful! Now you can login.");
      onClose?.();
    } catch (err) {
      alert("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[95%] max-w-[500px] overflow-hidden relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-2xl font-bold"
        >
          ✕
        </button>

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Fill your details to register
          </h2>
        </div>

        <p className="px-5 pt-3 text-sm text-gray-600">
          Already a User?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

        <div className="p-5 pt-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="inputBox w-full"
            />

            {/* Gender + DOB */}
            <div className="flex space-x-4">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="inputBox w-full"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type={dateInputType}
                name="dateOfBirth"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onFocus={() => setDateInputType("date")}
                onBlur={() => setDateInputType(formData.dateOfBirth ? "date" : "text")}
                className="inputBox w-full"
              />
            </div>

            {/* Mobile */}
            <div className="flex space-x-2 items-center">
              <span className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                +91
              </span>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="inputBox w-full"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="inputBox w-full"
            />

            {/* Course */}
            <input
              type="text"
              name="course"
              placeholder="Select a course"
              value={formData.course}
              onChange={handleChange}
              className="inputBox w-full"
            />

            {/* State + City */}
            <div className="flex space-x-4">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="inputBox w-full"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="inputBox w-full"
              />
            </div>

            {/* Subsidy Info */}
            {/* <div className="relative border border-gray-300 rounded-md p-3 text-sm text-gray-600 bg-gray-50 flex justify-between items-center">
              <span>💰 Subsidy Benefits * Upto ₹20,000</span>
              <span>Select Option ∨</span>
            </div> */}

            {/* OTP Input */}
            {otpSent && (
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="inputBox w-full border-2 border-[#1E90FF] focus:border-[#0070c0]"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-md font-bold text-white transition ${
                !otpSent ? "bg-[#1E90FF] hover:bg-blue-700" : "bg-[#FFA500] hover:bg-orange-600"
              }`}
            >
              {loading ? "Please wait..." : !otpSent ? "SEND OTP" : "VERIFY OTP & REGISTER"}
            </button>

            <p className="text-center text-xs text-gray-500 pt-2">
              Your personal information is secure with us.
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .inputBox {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.15s;
        }
        .inputBox:focus {
          border-color: #1e90ff;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signup;
