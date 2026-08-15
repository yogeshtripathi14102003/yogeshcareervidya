

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";

import {
  User,
  Lock,
  AlertCircle,
  TrendingUp,
  Calculator,
  Rocket,
  GraduationCap,
  Compass,
  Atom,
  FlaskConical,
  Lightbulb,
  Share2,
  BookOpen,
} from "lucide-react";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/v1/counselor/login", formData);

      if (res.data.success) {
        // Save user
        localStorage.setItem("user", JSON.stringify(res.data.data));

        // Redirect to Profile/Dashboard
        router.push("/counselordashbord");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Icons orbiting the central hologram, positioned like a ring
  const orbitIcons = [
    { Icon: TrendingUp, top: "18%", left: "8%" },
    { Icon: Calculator, top: "8%", left: "32%" },
    { Icon: Rocket, top: "8%", left: "68%" },
    { Icon: GraduationCap, top: "18%", left: "92%" },
    { Icon: Compass, top: "50%", left: "4%" },
    { Icon: Atom, top: "50%", left: "96%" },
    { Icon: FlaskConical, top: "82%", left: "8%" },
    { Icon: Lightbulb, top: "92%", left: "32%" },
    { Icon: Share2, top: "92%", left: "68%" },
    { Icon: BookOpen, top: "82%", left: "92%" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center">
      {/* LEFT DIAGONAL PANEL */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-[62%] bg-gradient-to-br from-[#0b1f4d] via-[#0f2f6e] to-[#153a8a]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
        }}
      >
        {/* subtle dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* LOGO */}
        <div className="relative z-10 flex items-center gap-3 px-10 pt-10">
          <img
            src="/images/n12.png"
            alt="Logo"
            className="h-16 w-16 rounded-md bg-white object-contain p-1 drop-shadow-lg"
          />
          <div className="leading-tight">
            <p className="text-white font-semibold text-lg tracking-wide">
              Counselor Portal
            </p>
            <p className="text-blue-200 text-xs tracking-wide">
              Guidance &amp; Admission Console
            </p>
          </div>
        </div>

        {/* HOLOGRAM / ORBIT GRAPHIC */}
        <div className="relative z-10 mx-auto mt-10 h-[68%] w-[80%] max-w-md">
          {/* concentric rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full border border-blue-300/30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-56 w-56 rounded-full border border-blue-300/25 animate-[spin_18s_linear_infinite]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full border border-dashed border-blue-300/40" />
          </div>

          {/* glowing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-blue-300/30 blur-xl" />
          </div>

          {/* orbiting icon badges */}
          {orbitIcons.map(({ Icon, top, left }, idx) => (
            <div
              key={idx}
              className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-300/40 bg-[#12306e] shadow-[0_0_18px_rgba(56,120,255,0.35)]"
              style={{ top, left }}
            >
              <Icon size={18} className="text-blue-100" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIGN-IN CARD */}
      <div className="relative z-10 ml-auto mr-6 md:mr-24 w-full max-w-sm">
        <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
          {/* HEADER */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#12206e]">Sign In</h1>
            <p className="mt-1 text-sm text-gray-400">
              Login using your Counselor ID
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-sm text-red-600">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* USERID */}
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#12206e]/50"
                size={18}
              />
              <input
                type="text"
                name="userid"
                placeholder="User Name"
                required
                value={formData.userid}
                onChange={handleChange}
                className="w-full rounded-lg border-2 border-[#12206e]/70 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#12206e] focus:ring-2 focus:ring-[#12206e]/20"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#12206e]/50"
                size={18}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border-2 border-[#12206e]/70 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#12206e] focus:ring-2 focus:ring-[#12206e]/20"
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-[#1a1f6e] to-[#2b2f8a] py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER LINKS */}
          <div className="mt-5 space-y-2 text-center text-sm">
            <p className="font-medium text-[#12206e]">
              Don&apos;t have an account?{" "}
              <span className="cursor-pointer font-semibold text-orange-500 hover:underline">
                Create Account
              </span>
            </p>
            <p
              onClick={() =>
                alert("Please contact administrator")
              }
              className="cursor-pointer font-semibold text-orange-500 hover:underline"
            >
              Forgot Password ?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;