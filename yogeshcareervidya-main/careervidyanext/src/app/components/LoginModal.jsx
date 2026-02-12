"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = Cookies.get("admintoken");
    const userToken = Cookies.get("usertoken");

    if (adminToken) router.replace("/admin");
    else if (userToken) router.replace("/user");
  }, [router]);

  const handleSendOtp = async () => {
    if (!identifier) return alert("Please enter your email or phone number.");
    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", { emailOrPhone: identifier, purpose: "login" });
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP first.");
    try {
      setLoading(true);
      const res = await api.post("/api/v1/verify-otp", { emailOrPhone: identifier, otp, purpose: "login" });
      const token = res.data.accessToken;
      const userRole = res.data.student?.role;

      if (userRole === "admin") {
        localStorage.setItem("admintoken", token);
        Cookies.set("admintoken", token, { expires: 1, path: '/' });
        router.push("/admin");
      } else {
        localStorage.setItem("usertoken", token);
        Cookies.set("usertoken", token, { expires: 1, path: '/' });
        router.push("/user");
      }

      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-white to-blue-50">
      
      {/* Left Branding */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-start bg-gradient-to-br from-blue-100 to-white">
        <h1 className="text-5xl font-bold text-[#1E90FF] mb-3">Career Vidya</h1>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Welcome Back!</h2>
        <p className="text-gray-700 mb-4">Log in to access your personalized dashboard:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>📢 Exam Alerts: Timely updates</li>
          <li>📝 Mock Tests: Practice & Perform</li>
          <li>🤖 AI Predictions: Smart college matches</li>
          <li>🎓 Personal Counselling: Real results</li>
        </ul>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 p-10 flex justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          
          {/* Mode Selector */}
          <div className="flex justify-center mb-6 gap-6">
            {["email", "phone"].map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginMode"
                  checked={loginMode === mode}
                  onChange={() => setLoginMode(mode)}
                  disabled={otpSent}
                  className="w-4 h-4 accent-[#1E90FF]"
                />
                <span className="capitalize text-sm font-medium">{mode}</span>
              </label>
            ))}
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type={loginMode === "email" ? "email" : "tel"}
              placeholder={loginMode === "email" ? "Enter Email" : "Enter Phone (+91...)"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={otpSent}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
            />

            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
              />
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full p-3 bg-[#FFA500] text-white font-semibold rounded-lg hover:bg-[#e69500] transition disabled:bg-gray-300"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-[#1E90FF] text-white font-semibold rounded-lg hover:bg-[#1874cc] transition disabled:bg-gray-300"
              >
                {loading ? "Verifying..." : "Login"}
              </button>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
            </div>

            <button type="button" className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-1.6 3.92-4.16 3.92-2.32 0-4.24-1.92-4.24-4.28s1.92-4.28 4.24-4.28c1.36 0 2.24.56 2.72 1.04l2.48-2.48C19.92 6.4 17.52 5.2 14.56 5.2c-4.48 0-8.08 3.6-8.08 8.08s3.6 8.08 8.08 8.08c4.64 0 7.76-3.28 7.76-7.84 0-.56-.08-1.04-.16-1.52h-7.68z"></path></svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#1E90FF] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
