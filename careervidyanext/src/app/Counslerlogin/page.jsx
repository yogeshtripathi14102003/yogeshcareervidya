// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api.js";
// import { useAuth } from "@/context/AuthContext.jsx";
// import { trackEvent } from "@/utlis/analytics.js";

// import {
//   User,
//   Lock,
//   LogIn,
//   AlertCircle,
// } from "lucide-react";

// const LoginPage = () => {

//   const router = useRouter();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     userid: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");


//   /* ================= CHANGE ================= */
//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };


//   /* ================= LOGIN ================= */
//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     setLoading(true);
//     setError("");

//     try {

//       const res = await api.post(
//         "/api/v1/counselor/login",
//         formData
//       );

//       if (res.data.success) {

//         login({
//           accessToken: res.data.accessToken,
//           user: res.data.data,
//           role: "counselor",
//         });
//         trackEvent("login_click", { method: "password", role: "counselor" });

//         // Redirect to Profile/Dashboard
//         router.push("/counselordashbord");

//       }

//     } catch (err) {

//       setError(
//         err?.response?.data?.message ||
//         "Login failed"
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex justify-center items-center p-4">

//       <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

//         {/* HEADER */}
//         <div className="text-center mb-6">

//           <h1 className="text-2xl font-bold text-gray-800">
//             Counselor Login
//           </h1>

//           <p className="text-gray-500 text-sm">
//             Login using UserID
//           </p>

//         </div>


//         {/* ERROR */}
//         {error && (

//           <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center">

//             <AlertCircle size={18} />
//             {error}

//           </div>
//         )}


//         {/* FORM */}
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4"
//         >

//           {/* USERID */}
//           <div className="relative">

//             <User className="absolute left-3 top-3 text-gray-400" size={18} />

//             <input
//               type="text"
//               name="userid"
//               placeholder="User ID"
//               required
//               value={formData.userid}
//               onChange={handleChange}
//               className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//             />

//           </div>


//           {/* PASSWORD */}
//           <div className="relative">

//             <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//             />

//           </div>


//           {/* BUTTON */}
//           <button
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
//           >

//             <LogIn size={18} />

//             {loading ? "Logging in..." : "Login"}

//           </button>

//         </form>

//         <div className="text-center mt-4">
//           <Link
//             href="/Counslerlogin/forgot-password"
//             className="text-sm text-indigo-600 hover:underline font-medium"
//           >
//             Forgot password?
//           </Link>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default LoginPage;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { trackEvent } from "@/utlis/analytics.js";

import {
  User,
  Lock,
  GraduationCap,
  BookOpen,
  Compass,
  Award,
  Users,
  ClipboardCheck,
  MessageSquareText,
  Building2,
  Target,
  Lightbulb,
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


  // floating icon layout — position (%) + icon, matches the reference layout
  const floatingIcons = [
    GraduationCap,
    Building2,
    Award,
    BookOpen,
    Compass,
    Users,
    ClipboardCheck,
    Target,
    MessageSquareText,
    Lightbulb,
  ];

  const RING_RADIUS = 210; // matches the w-[420px] h-[420px] outer circle below

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">

      {/* ===================== LEFT PANEL ===================== */}
      <div
        className="relative hidden md:flex md:w-1/2 lg:w-[58%] items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #16225c 0%, #142163 45%, #1a2470 100%)",
          clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)",
        }}
      >

        {/* dotted background texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* concentric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[420px] h-[420px] rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-[300px] h-[300px] rounded-full border border-dashed border-white/15 flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full bg-white/5 blur-2xl" />
            </div>
          </div>
        </div>

        {/* floating icon bubbles — evenly placed around the outer ring */}
        {floatingIcons.map((Icon, idx) => {
          const angle = (idx / floatingIcons.length) * 2 * Math.PI - Math.PI / 2; // start from top
          const x = Math.cos(angle) * RING_RADIUS;
          const y = Math.sin(angle) * RING_RADIUS;
          return (
            <div
              key={idx}
              className="absolute w-12 h-12 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/80"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Icon size={20} strokeWidth={1.5} />
            </div>
          );
        })}

        {/* logo + heading */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">

          <div className="bg-white rounded-xl p-2 w-16 h-16 flex items-center justify-center shadow-md">
            <Image
              src="/images/n12.png"
              alt="Career Vidya"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-white text-xl font-bold leading-tight">
              Counselor Portal
            </h2>
            <p className="text-indigo-200 text-sm">
              Guidance &amp; Admission Console
            </p>
          </div>

        </div>

      </div>

      {/* ===================== RIGHT PANEL ===================== */}
      <div className="w-full md:w-1/2 lg:w-[42%] flex items-center justify-center p-6 bg-white">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a2470]">
              Sign In
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Login using your Counselor ID
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERID */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="userid"
                placeholder="User Name"
                required
                value={formData.userid}
                onChange={handleChange}
                className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold tracking-wide disabled:opacity-60 transition"
              style={{
                background: "linear-gradient(90deg, #1a2470 0%, #3d2f8f 100%)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* FOOTER LINKS */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/Counslerlogin/register"
                className="text-orange-500 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
            <Link
              href="/Counslerlogin/forgot-password"
              className="block text-sm text-orange-500 font-semibold hover:underline"
            >
              Forgot Password ?
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;
