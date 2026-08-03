"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { trackEvent } from "@/utlis/analytics.js";

import {
  User,
  Lock,
  LogIn,
  AlertCircle,
} from "lucide-react";

const LoginPage = () => {

  const router = useRouter();
  const { login } = useAuth();

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

      const res = await api.post(
        "/api/v1/counselor/login",
        formData
      );

      if (res.data.success) {

        login({
          accessToken: res.data.accessToken,
          user: res.data.data,
          role: "counselor",
        });
        trackEvent("login_click", { method: "password", role: "counselor" });

        // Redirect to Profile/Dashboard
        router.push("/counselordashbord");

      }

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex justify-center items-center p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">

          <h1 className="text-2xl font-bold text-gray-800">
            Counselor Login
          </h1>

          <p className="text-gray-500 text-sm">
            Login using UserID
          </p>

        </div>


        {/* ERROR */}
        {error && (

          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center">

            <AlertCircle size={18} />
            {error}

          </div>
        )}


        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* USERID */}
          <div className="relative">

            <User className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="text"
              name="userid"
              placeholder="User ID"
              required
              value={formData.userid}
              onChange={handleChange}
              className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

          </div>


          {/* PASSWORD */}
          <div className="relative">

            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

          </div>


          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
          >

            <LogIn size={18} />

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>

        <div className="text-center mt-4">
          <Link
            href="/Counslerlogin/forgot-password"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;
