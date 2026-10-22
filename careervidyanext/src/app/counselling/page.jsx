
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Map,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

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
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
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
      console.error(
        "OTP Verification Failed:",
        error.response?.data || error.message
      );
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  const inputClass =
    "w-full min-w-0 rounded-lg border border-[var(--cv-neutral-border)] bg-white px-3.5 py-3 text-sm text-[var(--cv-neutral-dark)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[var(--cv-primary)] focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-xs font-semibold tracking-wide text-slate-600";

  return (
    <>
      <Header />

      <main className="w-full overflow-x-clip bg-[var(--background)] px-3 py-7 sm:px-5 sm:py-10 md:py-12">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--cv-neutral-border)] bg-white shadow-[0_12px_45px_rgba(15,23,42,0.08)] lg:rounded-3xl">
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">

            {/* Left information panel */}
            <section className="relative flex flex-col justify-between overflow-hidden bg-[image:var(--cv-grad-hero)] p-5 sm:p-7 md:p-9 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-blue-100/60"
              />

              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--cv-primary)] shadow-sm">
                  <Sparkles size={14} className="text-[var(--cv-accent)]" />
                  Your future starts here
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--cv-neutral-dark)] sm:text-4xl">
                  Welcome to
                  <span className="mt-1 block text-[var(--cv-primary)]">
                    Career<span className="text-[var(--cv-accent)]">Vidya</span>
                  </span>
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-[var(--cv-neutral-mid)] sm:text-base sm:leading-7">
                  Take the next step towards your dream career with the right
                  courses, expert guidance and smarter education decisions.
                </p>

                <div className="my-6 h-1 w-16 rounded-full bg-[image:var(--cv-grad-horizontal)]" />

                <h2 className="text-base font-bold text-[var(--cv-neutral-dark)] sm:text-lg">
                  Your journey. Your goals. Your success.
                </h2>

                <div className="mt-5 space-y-4">
                  {[
                    {
                      title: "Exam Alerts",
                      description: "Stay updated with important opportunities.",
                    },
                    {
                      title: "Mock Tests",
                      description: "Practice and prepare with confidence.",
                    },
                    {
                      title: "AI Predictions",
                      description: "Discover suitable education options.",
                    },
                    {
                      title: "Expert Counselling",
                      description: "Get guidance for your next step.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[var(--cv-accent)] shadow-sm ring-1 ring-orange-100">
                        <CheckCircle2 size={16} />
                      </span>

                      <div>
                        <h3 className="text-sm font-semibold text-[var(--cv-neutral-dark)]">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-xs leading-5 text-[var(--cv-neutral-mid)] sm:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-7 flex items-center gap-3 rounded-xl border border-white/80 bg-white/70 p-3.5 sm:mt-9">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cv-primary-light)] text-[var(--cv-primary)]">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--cv-neutral-dark)]">
                    Simple registration
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--cv-neutral-mid)]">
                    Verify your OTP to complete registration.
                  </p>
                </div>
              </div>
            </section>

            {/* Right signup form */}
            <section className="min-w-0 bg-white p-5 sm:p-7 md:p-9 lg:p-10">
              <div className="mx-auto w-full max-w-lg">
                <div className="mb-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--cv-primary-light)] text-[var(--cv-primary)]">
                    <UserRound size={22} />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-[var(--cv-neutral-dark)] sm:text-3xl">
                    Create your account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--cv-neutral-mid)]">
                    {otpSent
                      ? "Enter the OTP to verify and complete your registration."
                      : "Fill in your details to get started with CareerVidya."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full name */}
                  <div>
                    <label className={labelClass} htmlFor="signup-name">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserRound
                        size={17}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="signup-name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        required
                      />
                    </div>
                  </div>

                  {/* Email and mobile */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="signup-email">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="signup-email"
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="signup-mobile">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="signup-mobile"
                          type="tel"
                          name="mobileNumber"
                          placeholder="Mobile number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* City and state */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="signup-city">
                        City
                      </label>
                      <div className="relative">
                        <MapPin
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="signup-city"
                          type="text"
                          name="city"
                          placeholder="Your city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="signup-state">
                        State
                      </label>
                      <div className="relative">
                        <Map
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="signup-state"
                          type="text"
                          name="state"
                          placeholder="Your state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course and gender */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="signup-course">
                        Interested Course
                      </label>
                      <div className="relative">
                        <GraduationCap
                          size={17}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="signup-course"
                          type="text"
                          name="course"
                          placeholder="e.g. MBA, B.Tech"
                          value={formData.course}
                          onChange={handleChange}
                          className={`${inputClass} pl-10`}
                          required
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="signup-gender">
                        Gender
                      </label>
                      <select
                        id="signup-gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass} htmlFor="signup-address">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin
                        size={17}
                        className="pointer-events-none absolute left-3 top-3 text-slate-400"
                      />
                      <input
                        id="signup-address"
                        type="text"
                        name="addresses"
                        placeholder="Enter your address"
                        value={formData.addresses}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        required
                      />
                    </div>
                  </div>

                  {/* OTP */}
                  {otpSent && (
                    <div className="rounded-xl border border-blue-100 bg-[var(--cv-primary-light)] p-4">
                      <label
                        className="mb-2 block text-sm font-semibold text-[var(--cv-primary)]"
                        htmlFor="signup-otp"
                      >
                        Verification OTP
                      </label>
                      <input
                        id="signup-otp"
                        type="text"
                        name="otp"
                        placeholder="Enter your OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        className={`${inputClass} border-blue-200 bg-white`}
                        required
                      />
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Please enter the OTP you received to verify your
                        registration.
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="cv-btn-cta flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Please wait...
                      </>
                    ) : (
                      <>
                        {otpSent ? "Verify OTP" : "Send OTP"}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm leading-6 text-[var(--cv-neutral-mid)]">
                    Already have a CareerVidya account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[var(--cv-primary)] transition hover:text-[var(--cv-accent-dark)] hover:underline"
                    >
                      Login to continue
                    </Link>
                  </p>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Counter />
      <FLOW />
      <Footer />
    </>
  );
};

export default Signup;
