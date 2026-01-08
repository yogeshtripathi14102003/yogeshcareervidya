



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api";
import Cookies from "js-cookie";
import { X, ChevronDown, ShieldCheck, CheckCircle, GraduationCap, Wallet } from "lucide-react";

const AuthModal = ({ onClose }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("signup");
  const [otpSent, setOtpSent] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");

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
    branch: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- LOGIC ---------------- */

  const validateSignup = () => {
    const required = ["name", "mobileNumber", "email", "city", "state", "course", "gender", "addresses", "branch"];
    for (let f of required) {
      if (!formData[f]) {
        alert(`Please fill ${f}`);
        return false;
      }
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!validateSignup()) return;
      try {
        setLoading(true);
        await api.post("/api/v1/send-otp", {
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        alert("OTP Sent!");
        setOtpSent(true);
      } catch {
        alert("Failed to send OTP");
      } finally {
        setLoading(false);
      }
    } else {
      if (!formData.otp) return alert("Enter OTP");
      try {
        setLoading(true);
        await api.post("/api/v1/verify-otp", {
          ...formData,
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        alert("Account Created!");
        onClose();
      } catch {
        alert("Invalid OTP");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = formData.email || formData.mobileNumber;
    if (!identifier) return alert("Enter Email or Phone");

    try {
      setLoading(true);
      if (!loginOtpSent) {
        await api.post("/api/v1/send-otp", { emailOrPhone: identifier, purpose: "login" });
        alert("OTP Sent!");
        setLoginOtpSent(true);
      } else {
        const res = await api.post("/api/v1/verify-otp", {
          emailOrPhone: identifier,
          otp: loginOtp,
          purpose: "login",
        });
        const token = res.data.accessToken;
        const role = res.data.student.role;

        if (role === "admin") {
          Cookies.set("admintoken", token, { expires: 1 });
          router.push("/admin");
        } else {
          Cookies.set("token", token, { expires: 1 });
          router.push("/user");
        }
        alert("Login Successful!");
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[999] p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-[850px] overflow-hidden border border-gray-200 animate-scaleIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- USP SECTION (TOP) --- */}
        <div className="bg-green-50 border-b border-green-100 p-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] md:text-[13px] font-semibold text-green-700">
            <div className="flex items-center gap-1.5"><CheckCircle size={14} /> <span>No-Cost EMI from ₹4,999</span></div>
            <div className="h-4 w-[1px] bg-green-200 hidden md:block"></div>
            <div className="flex items-center gap-1.5"><GraduationCap size={16} /> <span>Govt-Approved Universities</span></div>
            <div className="h-4 w-[1px] bg-green-200 hidden md:block"></div>
            <div className="flex items-center gap-1.5"><Wallet size={14} /> <span>EMI | Loan Facility</span></div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            {activeTab === "signup" ? (
              <>Create <span className="text-orange-600">Account</span></>
            ) : (
              <>User <span className="text-orange-600">Login</span></>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]">
          {activeTab === "signup" ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" className="white-input" onChange={handleChange} />
                <input name="email" type="email" placeholder="Email Address" className="white-input" onChange={handleChange} />
                <input name="mobileNumber" type="tel" placeholder="Phone Number" className="white-input" onChange={handleChange} />
                <input name="city" placeholder="City" className="white-input" onChange={handleChange} />
                <input name="state" placeholder="State" className="white-input" onChange={handleChange} />
                <div className="relative">
                  <select name="gender" className="white-input appearance-none" onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <input name="branch" placeholder="Branch" className="white-input" onChange={handleChange} />
                <input name="course" placeholder="Target Course" className="white-input" onChange={handleChange} />
              </div>

              <textarea name="addresses" placeholder="Full Address" className="white-input resize-none" rows={2} onChange={handleChange} />

              {otpSent && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-600 text-xs font-bold mb-2">
                    <ShieldCheck size={16} /> ENTER VERIFICATION CODE
                  </div>
                  <input
                    name="otp"
                    placeholder="Enter OTP"
                    className="white-input text-center font-bold text-lg tracking-widest border-orange-200"
                    onChange={handleChange}
                  />
                </div>
              )}

              <button className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-12 py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-orange-200">
                {loading ? "Processing..." : otpSent ? "Complete Signup" : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-500 pt-2">
                Already a member?{" "}
                <button type="button" onClick={() => {setActiveTab("login"); setOtpSent(false)}} className="text-orange-600 font-bold hover:underline">
                  Login Here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-5 py-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">EMAIL OR PHONE</label>
                <input name="email" placeholder="Enter your credentials" className="white-input" onChange={handleChange} />
              </div>

              {loginOtpSent && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-orange-600 ml-1">OTP SENT TO YOUR DEVICE</label>
                  <input
                    placeholder="Enter 6-digit OTP"
                    className="white-input border-orange-200"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                  />
                </div>
              )}

              <button className="bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-lg font-bold w-full transition-all shadow-lg shadow-orange-200">
                {loading ? "Processing..." : loginOtpSent ? "Secure Login" : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-500">
                New to Career Vidya?{" "}
                <button type="button" onClick={() => {setActiveTab("signup"); setLoginOtpSent(false)}} className="text-orange-600 font-bold hover:underline">
                  Create Account
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .white-input {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
          color: #1f2937;
          transition: all 0.2s;
        }
        .white-input:focus {
          border-color: #f97316;
          background: white;
          outline: none;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .white-input::placeholder {
          color: #9ca3af;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;