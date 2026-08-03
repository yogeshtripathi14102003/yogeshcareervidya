"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/counselor/reset-password", { email, otp, newPassword });
      setDone(true);
      setTimeout(() => router.push("/Counslerlogin"), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter the code we sent you and choose a new password.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {done ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg flex gap-2 items-center text-sm">
            <CheckCircle2 size={18} />
            Password reset! Redirecting you to login…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Registered email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="pl-10 w-full border rounded-lg p-2 tracking-[0.3em] font-mono focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="New password (min 8 characters)"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm new password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link
            href="/Counslerlogin"
            className="text-sm text-gray-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
