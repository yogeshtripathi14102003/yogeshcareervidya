
// "use client";

// import React, { Suspense, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import api from "@/utlis/api.js";
// import {
//   Mail,
//   Lock,
//   KeyRound,
//   ArrowRight,
//   AlertCircle,
//   CheckCircle2,
//   ArrowLeft,
//   Calculator,
//   Rocket,
//   GraduationCap,
//   TrendingUp,
//   Atom,
//   Compass,
//   FlaskConical,
//   Lightbulb,
//   Share2,
//   BookOpen,
// } from "lucide-react";

// const floatingIcons = [
//   { Icon: Calculator, top: "20%", left: "24%" },
//   { Icon: Rocket, top: "20%", left: "38%" },
//   { Icon: GraduationCap, top: "28%", left: "48%" },
//   { Icon: TrendingUp, top: "29%", left: "17%" },
//   { Icon: Atom, top: "50%", left: "50%" },
//   { Icon: Compass, top: "51%", left: "16%" },
//   { Icon: FlaskConical, top: "72%", left: "17%" },
//   { Icon: Lightbulb, top: "80%", left: "24%" },
//   { Icon: Share2, top: "80%", left: "38%" },
//   { Icon: BookOpen, top: "72%", left: "48%" },
// ];

// const BrandPanel = () => (
//   <div
//     className="relative hidden md:flex md:w-1/2 lg:w-[58%] items-center justify-center overflow-hidden"
//     style={{
//       background: "linear-gradient(160deg, #16225c 0%, #142163 45%, #1a2470 100%)",
//       clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)",
//     }}
//   >
//     <div
//       className="absolute inset-0 opacity-30"
//       style={{
//         backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
//         backgroundSize: "22px 22px",
//       }}
//     />

//     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//       <div className="w-[420px] h-[420px] rounded-full border border-white/10 flex items-center justify-center">
//         <div className="w-[300px] h-[300px] rounded-full border border-dashed border-white/15 flex items-center justify-center">
//           <div className="w-[180px] h-[180px] rounded-full bg-white/5 blur-2xl" />
//         </div>
//       </div>
//     </div>

//     {floatingIcons.map(({ Icon, top, left }, idx) => (
//       <div
//         key={idx}
//         className="absolute w-12 h-12 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/80"
//         style={{ top, left }}
//       >
//         <Icon size={20} strokeWidth={1.5} />
//       </div>
//     ))}

//     <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
//       <div className="bg-white rounded-xl p-2 w-16 h-16 flex items-center justify-center shadow-md">
//         <Image
//           src="/images/n12.png"
//           alt="Career Vidya"
//           width={48}
//           height={48}
//           className="object-contain"
//         />
//       </div>
//       <div>
//         <h2 className="text-white text-xl font-bold leading-tight">Counselor Portal</h2>
//         <p className="text-indigo-200 text-sm">Guidance &amp; Admission Console</p>
//       </div>
//     </div>
//   </div>
// );

// const ResetPasswordForm = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [email, setEmail] = useState(searchParams.get("email") || "");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [done, setDone] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (newPassword.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/api/v1/counselor/reset-password", { email, otp, newPassword });
//       setDone(true);
//       setTimeout(() => router.push("/Counslerlogin"), 1800);
//     } catch (err) {
//       setError(err?.response?.data?.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex bg-white overflow-hidden">

//       <BrandPanel />

//       <div className="w-full md:w-1/2 lg:w-[42%] flex items-center justify-center p-6 bg-white">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-[#1a2470]">Reset Password</h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Enter the code we sent you and choose a new password.
//             </p>
//           </div>

//           {error && (
//             <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center text-sm">
//               <AlertCircle size={18} />
//               {error}
//             </div>
//           )}

//           {done ? (
//             <div className="bg-green-50 text-green-700 p-3 rounded-lg flex gap-2 items-center text-sm">
//               <CheckCircle2 size={18} />
//               Password reset! Redirecting you to login…
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="email"
//                   placeholder="Registered email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
//                 />
//               </div>

//               <div className="relative">
//                 <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="text"
//                   maxLength={6}
//                   placeholder="6-digit code"
//                   required
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                   className="pl-11 w-full border border-gray-300 rounded-lg py-3 tracking-[0.3em] font-mono focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
//                 />
//               </div>

//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="password"
//                   placeholder="New password (min 8 characters)"
//                   required
//                   minLength={8}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
//                 />
//               </div>

//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="password"
//                   placeholder="Confirm new password"
//                   required
//                   minLength={8}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full text-white py-3 rounded-lg font-semibold tracking-wide flex justify-center items-center gap-2 disabled:opacity-60 transition"
//                 style={{ background: "linear-gradient(90deg, #1a2470 0%, #3d2f8f 100%)" }}
//               >
//                 {loading ? "Resetting..." : "Reset Password"}
//                 {!loading && <ArrowRight size={18} />}
//               </button>
//             </form>
//           )}

//           <div className="text-center mt-6">
//             <Link
//               href="/Counslerlogin"
//               className="text-sm text-gray-500 hover:text-[#1a2470] font-medium inline-flex items-center gap-1"
//             >
//               <ArrowLeft size={14} /> Back to login
//             </Link>
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// };

// export default function ResetPasswordPage() {
//   return (
//     <Suspense fallback={null}>
//       <ResetPasswordForm />
//     </Suspense>
//   );
// }

"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
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
} from "lucide-react";

// Exact Icon positions surrounding the central India map as seen in image
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
      {/* Background Dot Matrix Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#00d2ff 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />

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
            <pattern id="dot-pattern" x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="2.5" cy="2.5" r="1.8" fill="#00d2ff" />
            </pattern>
          </defs>
          <path
            fill="url(#dot-pattern)"
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

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // All logic & state untouched
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
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      <BrandPanel />

      {/* Right Side Form Card (Exact match to reference UI image) */}
      <div className="w-full md:w-[38%] lg:w-[35%] flex items-center justify-center p-6 bg-white z-10">
        <div className="w-full max-w-[350px] bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.18)] border border-gray-100 p-8">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1a1c6e] tracking-tight">Reset Password</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-2.5 rounded border border-red-200 mb-4 flex gap-2 items-center text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {done ? (
            <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 flex gap-2 items-center text-xs font-medium">
              <CheckCircle2 size={16} className="shrink-0 text-green-600" />
              Password reset! Redirecting to login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Registered Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-400 rounded-none px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a1c6e]"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-Digit OTP Code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-gray-400 rounded-none px-3 py-2 text-xs tracking-wider font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a1c6e]"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password (min 8 chars)"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-400 rounded-none px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a1c6e]"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-400 rounded-none px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a1c6e]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1c1d73] hover:bg-[#121352] text-white py-2.5 rounded-none font-semibold text-xs transition-colors flex items-center justify-center gap-1 mt-3"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="text-center mt-5 space-y-2">
            <div>
              <Link
                href="/Counslerlogin"
                className="text-xs text-gray-600 hover:text-[#1c1d73] font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Need assistance?{" "}
              <span className="text-[#d97706] font-semibold cursor-pointer hover:underline">
                Contact Support
              </span>
            </div>
          </div>

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