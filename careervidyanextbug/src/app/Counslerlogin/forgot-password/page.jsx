"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/counselor/forgot-password", { email });
      setSent(true);
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
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your registered email — we'll send you a reset code.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-700 p-3 rounded-lg flex gap-2 items-start text-sm">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>
                If that email is registered, a 6-digit code has been sent. It's valid for 5 minutes.
              </span>
            </div>
            <button
              onClick={() => router.push(`/Counslerlogin/reset-password?email=${encodeURIComponent(email)}`)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-indigo-700"
            >
              Enter Code <ArrowRight size={18} />
            </button>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Code"}
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

export default ForgotPasswordPage;
