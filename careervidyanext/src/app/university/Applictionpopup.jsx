"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { useRouter } from "next/navigation";

const AuthModal = ({ onClose, universityName }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
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
    branch: "",
    addresses: "",
    description: universityName || "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, description: universityName || "" }));
  }, [universityName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSignup = () => {
    const required = ["name", "mobileNumber", "email", "city", "state", "course", "gender"];
    for (let f of required) {
      if (!formData[f]) {
        alert(`⚠ Please fill the "${f}" field.`);
        return false;
      }
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!validateSignup()) return;
      setLoading(true);
      try {
        await api.post("/api/v1/send-otp", {
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        alert("OTP sent successfully!");
        setOtpSent(true);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to send OTP.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await api.post("/api/v1/verify-otp", {
          ...formData,
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        alert("Registration successful!");
        onClose?.();
      } catch (err) {
        alert(err.response?.data?.message || "Invalid OTP.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoginSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) return alert("Enter Email or Mobile Number");

    setLoading(true);
    try {
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email,
        purpose: "login",
      });
      alert("Login OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "User not found or error.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Please enter OTP");

    setLoading(true);
    try {
      await api.post("/api/v1/verify-otp", {
        emailOrPhone: formData.email,
        otp: formData.otp,
        purpose: "login",
      });

      alert("Login successful!");

      setTimeout(() => {
        router.push("/user");
        onClose?.();
      }, 100);
    } catch (err) {
      alert("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setOtpSent(false);
    setFormData({ ...formData, otp: "" });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-3"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-[520px] overflow-hidden relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className=" cursor-pointer  absolute top-2 right-3 text-gray-400 hover:text-gray-800 text-xl font-bold z-10"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="p-2.5 border-b border-gray-100 flex items-center">
          <div className="w-1/4">
            <Image
              src="/images/n12.png"
              alt="Career Vidya"
              width={200}
              height={50}
              className="max-h-14 w-auto object-contain"
            />
          </div>
          <div className="w-2/4 text-center">
            <h2 className="text-[#05347f] font-bold text-sm leading-tight">
              #VidyaHaiTohSuccessHai
            </h2>
            <p className="text-gray-500 text-[9px] md:text-[10px]">
              Students’ most trusted guide for education
            </p>
          </div>
          <div className="w-1/4"></div>
        </div>

        {/* USP SECTION */}
        <div className="bg-white border-b border-gray-100 py-1.5 px-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 text-[9px] md:text-[11px] font-semibold text-green-700">
            <div className="flex items-center gap-1">
              <span>✅</span> <span>No-Cost EMI Available</span>
            </div>
            <div className="h-3 w-[1px] bg-green-300 hidden md:block"></div>
            <div className="flex items-center gap-1">
              <span>🎓</span> <span>Govt-Approved Universities</span>
            </div>
            <div className="h-3 w-[1px] bg-green-300 hidden md:block"></div>
            <div className="flex items-center gap-1">
              <span>💼</span> <span>EMI | Loan Facility</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b text-xs">
          <button
            onClick={() => switchTab("signup")}
            className={`flex-1 py-2.5 font-bold text-center transition ${
              activeTab === "signup"
                ? "text-[#05347f] border-b-2 border-[#05347f]"
                : "text-gray-400"
            }`}
          >
            SIGNUP
          </button>
          <button
            onClick={() => switchTab("login")}
            className={`flex-1 py-2.5 font-bold text-center transition ${
              activeTab === "login"
                ? "text-[#05347f] border-b-2 border-[#05347f]"
                : "text-gray-400"
            }`}
          >
            LOGIN
          </button>
        </div>

        {/* FORM CONTAINER */}
        <div className="p-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {activeTab === "signup" ? (
            <form onSubmit={handleSignup} className="space-y-2.5">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="inputBox"
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  name="gender"
                  className="inputBox"
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  name="description"
                  placeholder="Short Description"
                  className="inputBox bg-gray-50 cursor-not-allowed text-gray-500"
                  value={formData.description}
                  readOnly
                />
              </div>

              <div className="relative">
                <div className="flex space-x-1.5 items-center">
                  <span className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    className="inputBox flex-1"
                    onChange={handleChange}
                    required
                  />
                </div>
                <span className="absolute right-3 -bottom-1.5 bg-white px-1.5 text-[9px] text-green-600 border border-green-400 rounded-full z-10 leading-tight">
                  ✔ We Do Not Spam
                </span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="inputBox"
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-3 -bottom-1.5 bg-white px-1.5 text-[9px] text-green-600 border border-green-400 rounded-full z-10 leading-tight">
                  ✔ We Do Not Spam
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="course"
                  placeholder="Course"
                  className="inputBox"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="branch"
                  placeholder="Branch"
                  className="inputBox"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  className="inputBox"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="inputBox"
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="addresses"
                placeholder="Address"
                className="inputBox h-14 resize-none"
                onChange={handleChange}
              ></textarea>

              {otpSent && (
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="inputBox border-2 border-[#1E90FF] text-center font-bold tracking-widest"
                  onChange={handleChange}
                  required
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md font-bold text-white bg-[#bf5004] text-xs transition-opacity hover:opacity-90"
              >
                {loading ? "Processing..." : !otpSent ? "SEND OTP" : "VERIFY & REGISTER"}
              </button>
              <p className="text-center text-[11px] mt-1">
                Already have an account?{" "}
                <span
                  className="text-blue-600 font-bold cursor-pointer"
                  onClick={() => switchTab("login")}
                >
                  Login
                </span>
              </p>
            </form>
          ) : (
            <form
              onSubmit={otpSent ? handleLoginVerifyOtp : handleLoginSendOtp}
              className="space-y-3 py-2"
            >
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  placeholder="Email or Phone"
                  className="inputBox"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                />
                {!otpSent && (
                  <span className="absolute right-3 -bottom-1.5 bg-white px-1.5 text-[9px] text-green-600 border border-green-400 rounded-full leading-tight">
                    ✔ We Do Not Spam
                  </span>
                )}
              </div>

              {otpSent && (
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    className="inputBox border-2 border-[#1E90FF] text-center font-bold"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md font-bold text-white bg-[#bf5004] text-xs transition-opacity hover:opacity-90"
              >
                {loading ? "Processing..." : otpSent ? "VERIFY & LOGIN" : "SEND OTP"}
              </button>

              <p className="text-center font-bold text-[12px] mt-1">
                Don’t have an account?{" "}
                <span
                  className="text-blue-600 font-bold cursor-pointer"
                  onClick={() => switchTab("signup")}
                >
                  Create Account
                </span>
              </p>
            </form>
          )}

          <p className="bg-green-50 text-center text-[9px] text-gray-500 mt-3 py-1 uppercase tracking-wider rounded">
            Secure SSL Encryption Enabled
          </p>
        </div>
      </div>

      <style jsx>{`
        .inputBox {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          font-size: 13px;
        }
        .inputBox:focus {
          border-color: rgba(255, 146, 30, 1);
          box-shadow: 0 0 0 2px rgba(189, 116, 6, 0.1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;