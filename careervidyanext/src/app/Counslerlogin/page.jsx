


// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import api from "@/utlis/api.js";
// import { useAuth } from "@/context/AuthContext.jsx";
// import { trackEvent } from "@/utlis/analytics.js";

// import {
//   User,
//   Lock,
//   GraduationCap,
//   BookOpen,
//   Compass,
//   Award,
//   Users,
//   ClipboardCheck,
//   MessageSquareText,
//   Building2,
//   Target,
//   Lightbulb,
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


//   // floating icon layout — position (%) + icon, matches the reference layout
//   const floatingIcons = [
//     GraduationCap,
//     Building2,
//     Award,
//     BookOpen,
//     Compass,
//     Users,
//     ClipboardCheck,
//     Target,
//     MessageSquareText,
//     Lightbulb,
//   ];

//   const RING_RADIUS = 210; // matches the w-[420px] h-[420px] outer circle below

//   return (
//     <div className="min-h-screen w-full flex bg-white overflow-hidden">

//       {/* ===================== LEFT PANEL ===================== */}
//       <div
//         className="relative hidden md:flex md:w-1/2 lg:w-[58%] items-center justify-center overflow-hidden"
//         style={{
//           background: "linear-gradient(160deg, #16225c 0%, #142163 45%, #1a2470 100%)",
//           clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)",
//         }}
//       >

//         {/* dotted background texture */}
//         <div
//           className="absolute inset-0 opacity-30"
//           style={{
//             backgroundImage:
//               "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
//             backgroundSize: "22px 22px",
//           }}
//         />

//         {/* concentric circles */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//           <div className="w-[420px] h-[420px] rounded-full border border-white/10 flex items-center justify-center">
//             <div className="w-[300px] h-[300px] rounded-full border border-dashed border-white/15 flex items-center justify-center">
//               <div className="w-[180px] h-[180px] rounded-full bg-white/5 blur-2xl" />
//             </div>
//           </div>
//         </div>

//         {/* floating icon bubbles — evenly placed around the outer ring */}
//         {floatingIcons.map((Icon, idx) => {
//           const angle = (idx / floatingIcons.length) * 2 * Math.PI - Math.PI / 2; // start from top
//           const x = Math.cos(angle) * RING_RADIUS;
//           const y = Math.sin(angle) * RING_RADIUS;
//           return (
//             <div
//               key={idx}
//               className="absolute w-12 h-12 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/80"
//               style={{
//                 top: `calc(50% + ${y}px)`,
//                 left: `calc(50% + ${x}px)`,
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               <Icon size={20} strokeWidth={1.5} />
//             </div>
//           );
//         })}

//         {/* logo + heading */}
//         <div className="absolute top-8 left-8 flex items-center gap-3 z-10">

//           <div className="bg-white rounded-xl p-2 w-16 h-16 flex items-center justify-center shadow-md">
//             <Image
//               src="/images/n12.png"
//               alt="Career Vidya"
//               width={48}
//               height={48}
//               className="object-contain"
//             />
//           </div>

//           <div>
//             <h2 className="text-white text-xl font-bold leading-tight">
//               Counselor Portal
//             </h2>
//             <p className="text-indigo-200 text-sm">
//               Guidance &amp; Admission Console
//             </p>
//           </div>

//         </div>

//       </div>

//       {/* ===================== RIGHT PANEL ===================== */}
//       <div className="w-full md:w-1/2 lg:w-[42%] flex items-center justify-center p-6 bg-white">

//         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

//           {/* HEADER */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-[#1a2470]">
//               Sign In
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Login using your Counselor ID
//             </p>
//           </div>

//           {/* ERROR */}
//           {error && (
//             <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center text-sm">
//               <AlertCircle size={18} />
//               {error}
//             </div>
//           )}

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* USERID */}
//             <div className="relative">
//               <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 name="userid"
//                 placeholder="User Name"
//                 required
//                 value={formData.userid}
//                 onChange={handleChange}
//                 className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
//               />
//             </div>

//             {/* PASSWORD */}
//             <div className="relative">
//               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
//               />
//             </div>

//             {/* BUTTON */}
//             <button
//               disabled={loading}
//               className="w-full text-white py-3 rounded-lg font-semibold tracking-wide disabled:opacity-60 transition"
//               style={{
//                 background: "linear-gradient(90deg, #1a2470 0%, #3d2f8f 100%)",
//               }}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>

//           </form>

//           {/* FOOTER LINKS */}
//           <div className="text-center mt-6 space-y-2">
//             <p className="text-sm text-gray-500">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/Counslerlogin/register"
//                 className="text-orange-500 font-semibold hover:underline"
//               >
//                 Create Account
//               </Link>
//             </p>
//             <Link
//               href="/Counslerlogin/forgot-password"
//               className="block text-sm text-orange-500 font-semibold hover:underline"
//             >
//               Forgot Password ?
//             </Link>
//           </div>

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
  TrendingUp,
  Calculator,
  Compass,
  Lightbulb,
  FlaskConical,
  BookOpen,
  Settings,
  Atom,
  GraduationCap,
  Rocket,
  AlertCircle,
} from "lucide-react";

// Exact Icon positions surrounding the central India map graphics
const leftIcons = [
  { Icon: TrendingUp, top: "32%", left: "8%" },
  { Icon: Calculator, top: "35%", left: "16%" },
  { Icon: Compass, top: "48%", left: "11%" },
  { Icon: Lightbulb, top: "60%", left: "15%" },
  { Icon: FlaskConical, top: "65%", left: "7%" },
];

const rightIcons = [
  { Icon: Rocket, top: "32%", left: "32%" },
  { Icon: GraduationCap, top: "36%", left: "40%" },
  { Icon: Atom, top: "50%", left: "37%" },
  { Icon: Settings, top: "61%", left: "32%" },
  { Icon: BookOpen, top: "67%", left: "39%" },
];

const BrandPanel = () => {
  return (
    <div
      className="relative hidden md:flex md:w-[62%] lg:w-[65%] items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 25% 50%, #033f94 0%, #001f5c 60%, #000a2a 100%)",
        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
      }}
    >
      {/* Background Matrix Dot Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#00d2ff 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Top Left Logo & Brand Header */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
        <div className="bg-white rounded-xl p-2 w-14 h-14 flex items-center justify-center shadow-lg border border-white/20">
          <Image
            src="/images/n12.png"
            alt="Career Vidya"
            width={42}
            height={42}
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-white text-lg font-bold leading-tight">Counselor Portal</h2>
          <p className="text-cyan-200 text-xs tracking-wide">Guidance &amp; Admission Console</p>
        </div>
      </div>

      {/* Top Holographic Concentric Rings */}
      <div className="absolute top-[8%] left-[25%] -translate-x-1/2 w-[380px] h-[130px] pointer-events-none">
        <div className="w-full h-full rounded-[100%] border-2 border-[#00d2ff]/60 shadow-[0_0_20px_#00d2ff_inset] flex items-center justify-center">
          <div className="w-[82%] h-[82%] rounded-[100%] border border-dashed border-[#00d2ff]/70 flex items-center justify-center">
            <div className="w-[60%] h-[60%] rounded-[100%] border border-[#00d2ff]/40" />
          </div>
        </div>
      </div>

      {/* Bottom Holographic Concentric Rings */}
      <div className="absolute bottom-[8%] left-[25%] -translate-x-1/2 w-[380px] h-[130px] pointer-events-none">
        <div className="w-full h-full rounded-[100%] border-2 border-[#00d2ff]/60 shadow-[0_0_20px_#00d2ff_inset] flex items-center justify-center">
          <div className="w-[82%] h-[82%] rounded-[100%] border border-dashed border-[#00d2ff]/70 flex items-center justify-center">
            <div className="w-[60%] h-[60%] rounded-[100%] border border-[#00d2ff]/40" />
          </div>
        </div>
      </div>

      {/* Dotted India Map Vector Graphics */}
      <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-[240px] h-[300px] pointer-events-none opacity-90 flex items-center justify-center">
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <defs>
            <pattern id="dot-pattern-login" x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.8" fill="#00d2ff" />
            </pattern>
          </defs>
          <path
            fill="url(#dot-pattern-login)"
            d="M 90,10 L 110,15 L 120,30 L 140,40 L 160,45 L 175,60 L 190,70 L 180,85 L 160,80 L 150,95 L 130,90 L 115,100 L 110,120 L 120,135 L 110,150 L 100,180 L 90,210 L 85,230 L 80,210 L 70,180 L 60,160 L 55,140 L 40,125 L 35,105 L 45,90 L 30,85 L 20,70 L 40,65 L 50,50 L 70,45 L 80,30 Z"
          />
        </svg>
      </div>

      {/* Left Outer Glowing Badges */}
      {leftIcons.map(({ Icon, top, left }, idx) => (
        <div
          key={`left-${idx}`}
          className="absolute w-10 h-10 rounded-full border-2 border-[#00d2ff] bg-[#001740]/90 backdrop-blur-md flex items-center justify-center text-[#00d2ff] shadow-[0_0_12px_#00d2ff] transition-transform hover:scale-110"
          style={{ top, left }}
        >
          <Icon size={18} strokeWidth={2} />
        </div>
      ))}

      {/* Right Outer Glowing Badges */}
      {rightIcons.map(({ Icon, top, left }, idx) => (
        <div
          key={`right-${idx}`}
          className="absolute w-10 h-10 rounded-full border-2 border-[#00d2ff] bg-[#001740]/90 backdrop-blur-md flex items-center justify-center text-[#00d2ff] shadow-[0_0_12px_#00d2ff] transition-transform hover:scale-110"
          style={{ top, left }}
        >
          <Icon size={18} strokeWidth={2} />
        </div>
      ))}
    </div>
  );
};

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/v1/counselor/login", formData);

      if (res.data.success) {
        login({
          accessToken: res.data.accessToken,
          user: res.data.data,
          role: "counselor",
        });
        trackEvent("login_click", { method: "password", role: "counselor" });

        // Redirect to Dashboard
        router.push("/counselordashbord");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      <BrandPanel />

      {/* Right Side Form Container */}
      <div className="w-full md:w-[38%] lg:w-[35%] flex items-center justify-center p-6 bg-white z-10">
        <div className="w-full max-w-[350px] bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.18)] border border-gray-100 p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1a1c6e] tracking-tight">Sign In</h1>
            <p className="text-gray-400 text-xs mt-1">
              Login using your Counselor ID
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-2.5 rounded border border-red-200 mb-4 flex gap-2 items-center text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="userid"
                placeholder="User Name"
                required
                value={formData.userid}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-none px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a1c6e]"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-none px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a1c6e]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1c1d73] hover:bg-[#121352] text-white py-2.5 rounded-none font-semibold text-xs transition-colors flex items-center justify-center gap-1 mt-3 shadow-sm disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/Counslerlogin/register"
                className="text-[#d97706] font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
            <div>
              <Link
                href="/Counslerlogin/forgot-password"
                className="text-xs text-[#d97706] font-semibold hover:underline"
              >
                Forgot Password ?
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;