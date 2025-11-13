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

  // ✅ Redirect if already logged in
  useEffect(() => {
    const adminToken = Cookies.get("admintoken");
    const userToken = Cookies.get("token");
    if (adminToken) router.push("/admin");
    if (userToken) router.push("");
  }, [router]);

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    if (!identifier) {
      alert("Please enter your email or phone number.");
      return;
    }
    try {
      setLoading(true);
      const payload = { emailOrPhone: identifier, purpose: "login" };
      const res = await api.post("/api/v1/send-otp", payload);
      console.log("OTP Sent:", res.data);
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter the OTP first.");
      return;
    }

    try {
      setLoading(true);
      const payload = { emailOrPhone: identifier, otp, purpose: "login" };
      const res = await api.post("/api/v1/verify-otp", payload);
      console.log("Login successful:", res.data);

      const token = res.data.accessToken;
      const userRole = res.data.student.role;

      // ✅ Save token based on role
      if (userRole === "admin") {
        localStorage.setItem("admintoken", token);
        Cookies.set("admintoken", token, { expires: 1 });
        router.push("/admin");
      } else {
        localStorage.setItem("token", token);
        Cookies.set("token", token, { expires: 1 });
        router.push("/user_dashbordy");
      }

      alert("Login successful!");
      setOtpSent(false);
      setOtp("");
      setIdentifier("");
    } catch (error) {
      console.error("OTP Verification Failed:", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFF5F5] to-[#FFE4E1] flex flex-col md:flex-row overflow-hidden">
      {/* Left Section */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start text-[#333333]">
        <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
        <h2 className="text-2xl font-semibold mb-6">Welcome Back to Career Vidya</h2>
        <p className="mb-4">Log in to access your personalized dashboard:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
         <li>Exam Alerts Timely updates Smart decisions</li>
            <li>Mock Tests Practice. Perform Perfect.</li>
            <li>AI Predictions Data-driven college matches</li>
            <li>Counselling Personal guidance.Real results.</li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-6">
            <button className="px-4 py-2 text-[#1E90FF] border border-[#1E90FF] rounded-full hover:bg-[#1E90FF] hover:text-white">
              Login
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div className="flex space-x-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="loginMode"
                  value="email"
                  checked={loginMode === "email"}
                  onChange={() => setLoginMode("email")}
                  className="mr-2"
                  disabled={otpSent}
                />
                Email
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="loginMode"
                  value="phone"
                  checked={loginMode === "phone"}
                  onChange={() => setLoginMode("phone")}
                  className="mr-2"
                  disabled={otpSent}
                />
                Phone Number
              </label>
            </div>

            <input
              type={loginMode === "email" ? "email" : "tel"}
              placeholder={loginMode === "email" ? "Enter Email" : "Enter Phone (+91...)"} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={otpSent}
            />

            <div className="flex space-x-4">
              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              )}
              {!otpSent ? (
                <button
                  type="button"
                  className="w-full p-2 bg-[#FFA500] text-white rounded-md hover:bg-[#87CEEB]"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-1/2 p-2 bg-[#1E90FF] text-white rounded-md hover:bg-[#87CEEB]"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Login"}
                </button>
              )}
            </div>

            <button className="w-full mt-6 px-4 py-2 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25h-11v4.26h6.46c-.28 1.49-1.13 2.75-2.41 3.6v3h3.88c2.28-2.1 3.59-5.19 3.59-8.61z" />
                <path d="M12.25 24c3.32 0 6.11-1.09 8.15-2.96l-3.88-3c-1.08.73-2.47 1.16-4.27 1.16-3.29 0-6.07-2.23-7.06-5.23h-3v3.24c2.04 4.04 6.23 6.75 11.06 6.75z" />
                <path d="M5.19 14.04c-.41-1.23-1.63-2.25-3.06-2.91v-3.24h3v3.24z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-4 text-center text-[#1E90FF]">
            Don’t have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
