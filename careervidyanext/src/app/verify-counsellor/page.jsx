"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiInfo, FiCheckCircle, FiShield, FiX, FiMail, FiPhone, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "sonner";
import api from "@/utlis/api.js"; // Ensure this path is correct for your project
import Header from "../layout/Header.jsx"; // Ensure this path is correct for your project
export default function VerifyAdvisorPage() {
  // ── Modal State ──
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Login Logic State ──
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Handlers ──
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Reset state when opening
    setOtpSent(false);
    setIdentifier("");
    setOtp("");
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSendOtp = async () => {
    if (!identifier) {
      toast.error("Please enter your Email or Phone Number");
      return;
    }
    try {
      setLoading(true);
      // Replace with your actual API call
      await api.post("/api/v1/send-otp", { emailOrPhone: identifier, purpose: "login" });
      toast.success("OTP Sent Successfully ✅");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/v1/verify-otp", {
        emailOrPhone: identifier,
        otp,
        purpose: "login",
      });
      
      // Assuming your API returns token and user data
      // const { accessToken, student } = res.data;
      // login({ accessToken, user: student, role: student.role });
      
      toast.success("Login successful! You can now verify your advisor.");
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[var(--cv-neutral-dark)]">
      {/* ── HEADER ── */}
    <Header />

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-4 py-12 lg:py-24 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        
        {/* Left Side: Illustration */}
        <div className="relative w-full max-w-[350px] lg:max-w-[450px]">
          <div className="relative z-10">
             {/* Ensure you have this image in /public */}
            <Image 
              src="/verify-advisor-illustration.png" 
              alt="Verified Advisor Illustration" 
              width={500} 
              height={500} 
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div className="absolute -top-4 -right-4 text-[var(--cv-primary)] opacity-10">
             <FiCheckCircle size={60} />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 max-w-[600px] text-center lg:text-left">
          
          {/* Heading Section */}
          <div className="mb-6">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--cv-neutral-dark)]">
                Verify your advisor
              </h1>
              <FiInfo className="text-[var(--cv-neutral-mid)] mt-1 cursor-pointer" size={20} />
            </div>
            
            <p className="text-[var(--cv-neutral-mid)] text-lg leading-relaxed">
              Beware of scammers! Verify your interactions with genuine Career Vidya Advisors to stay safe.
            </p>
          </div>

          {/* Call to Action Card */}
          <div className="bg-white border border-[var(--cv-neutral-border)] rounded-xl p-6 lg:p-8 shadow-lg relative overflow-hidden">
            {/* Top Gradient Border using your CSS variable */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--cv-grad-horizontal)" }}></div>

            <div className="flex flex-col gap-5">
              <p className="text-[var(--cv-neutral-dark)] font-medium text-lg">
                Check if you have spoken to a genuine <span className="text-[var(--cv-primary)] font-bold">Career Vidya</span> advisor
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 
                  BUTTON: Uses your orange gradient CSS class. 
                  Clicking it opens the Modal. 
                */}
                <button 
                  onClick={handleOpenModal}
                  className="cv-btn-cta px-8 py-3 text-lg w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Sign In to Verify Your Advisor
                  <FiArrowRight />
                </button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-1 text-sm text-[var(--cv-neutral-mid)]">
                <FiShield className="text-green-600" />
                <span>100% Secure & Confidential</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-xs text-[var(--cv-neutral-mid)]">
            By proceeding, you agree to our <Link href="/Terms&Conditions" className="underline hover:text-[var(--cv-primary)]">Terms of Service</Link> and <Link href="/PrivacyPolicy" className="underline hover:text-[var(--cv-primary)]">Privacy Policy</Link>.
          </p>

        </div>
      </main>

      {/* ═══════════════════════════════════════════════
          LOGIN MODAL (Overlay)
         ═══════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-[450px] bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-[var(--cv-neutral-mid)] hover:text-[var(--cv-neutral-dark)] p-1"
            >
              <FiX size={24} />
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-[var(--cv-neutral-dark)]">Login</h2>
                <p className="text-sm text-[var(--cv-neutral-mid)] mt-1">
                  Please select your preferred login method.
                </p>
              </div>

              {/* Login Switcher */}
              <div className="flex mb-6 border-b border-[var(--cv-neutral-border)]">
                {["email", "phone"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => !otpSent && setLoginMode(mode)}
                    className={`pb-3 pr-8 text-xs font-bold uppercase tracking-widest transition-all ${
                      loginMode === mode 
                        ? "text-[var(--cv-primary)] border-b-2 border-[var(--cv-primary)]" 
                        : "text-[var(--cv-neutral-mid)] border-b-2 border-transparent"
                    }`}
                  >
                    {mode === "email" ? "Email Auth" : "Mobile Auth"}
                  </button>
                ))}
              </div>

              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                {/* Input Field */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cv-neutral-mid)]">
                    {loginMode === "email" ? "Registered Email" : "Mobile Number"}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cv-neutral-mid)]">
                      {loginMode === "email" ? <FiMail size={16} /> : <FiPhone size={16} />}
                    </div>
                    <input
                      type={loginMode === "email" ? "email" : "tel"}
                      placeholder={loginMode === "email" ? "Enter your email" : "Enter mobile number"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={otpSent}
                      required
                      className="w-full p-3.5 pl-10 text-sm outline-none transition-all border border-[var(--cv-neutral-border)] rounded-lg focus:border-[var(--cv-primary)] bg-slate-50 focus:bg-white disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* OTP Field */}
                {otpSent && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--cv-neutral-mid)]">
                        Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[10px] font-bold text-[var(--cv-accent)] hover:underline"
                      >
                        Edit Info
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="0 0 0 0 0 0"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full p-3.5 text-center text-xl tracking-[0.8em] font-black outline-none border border-[var(--cv-primary-light)] rounded-lg bg-[var(--cv-primary-light)] focus:border-[var(--cv-primary)] focus:bg-white text-[var(--cv-neutral-dark)]"
                    />
                  </div>
                )}

                {/* Buttons */}
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full p-4 font-bold text-xs uppercase tracking-widest text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--cv-grad-cta)",
                      boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
                    }}
                  >
                    {loading ? "Requesting..." : "Send OTP"}
                    <FiArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-4 font-bold text-xs uppercase tracking-widest text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{
                      background: "var(--cv-grad-cta)",
                      boxShadow: "0 4px 12px rgba(193, 83, 4, 0.3)",
                    }}
                  >
                    <FiLock size={14} />
                    {loading ? "Verifying..." : "Secure Login"}
                  </button>
                )}
              </form>

              {/* Footer */}
              <div className="mt-6 pt-5 text-center border-t border-[var(--cv-neutral-border)]">
                <p className="text-sm font-medium text-[var(--cv-neutral-mid)]">
                  New to Career Vidya?{" "}
                  <Link href="/signup" className="ml-1 font-bold text-[var(--cv-primary)] hover:underline">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}