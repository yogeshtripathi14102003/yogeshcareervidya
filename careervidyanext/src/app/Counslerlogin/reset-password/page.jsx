// "use client";

// import React, { Suspense, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api.js";
// import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

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
//     <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex justify-center items-center p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Enter the code we sent you and choose a new password.
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-2 rounded mb-4 flex gap-2 items-center text-sm">
//             <AlertCircle size={18} />
//             {error}
//           </div>
//         )}

//         {done ? (
//           <div className="bg-green-50 text-green-700 p-3 rounded-lg flex gap-2 items-center text-sm">
//             <CheckCircle2 size={18} />
//             Password reset! Redirecting you to login…
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="email"
//                 placeholder="Registered email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//               />
//             </div>

//             <div className="relative">
//               <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 maxLength={6}
//                 placeholder="6-digit code"
//                 required
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                 className="pl-10 w-full border rounded-lg p-2 tracking-[0.3em] font-mono focus:ring-2 focus:ring-indigo-400 outline-none"
//               />
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="password"
//                 placeholder="New password (min 8 characters)"
//                 required
//                 minLength={8}
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//               />
//             </div>

//             <div className="relative">
//               <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
//               <input
//                 type="password"
//                 placeholder="Confirm new password"
//                 required
//                 minLength={8}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="pl-10 w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
//             >
//               {loading ? "Resetting..." : "Reset Password"}
//               {!loading && <ArrowRight size={18} />}
//             </button>
//           </form>
//         )}

//         <div className="text-center mt-4">
//           <Link
//             href="/Counslerlogin"
//             className="text-sm text-gray-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
//           >
//             <ArrowLeft size={14} /> Back to login
//           </Link>
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
import Image from "next/image";
import api from "@/utlis/api.js";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Calculator,
  Rocket,
  GraduationCap,
  TrendingUp,
  Atom,
  Compass,
  FlaskConical,
  Lightbulb,
  Share2,
  BookOpen,
} from "lucide-react";

const floatingIcons = [
  { Icon: Calculator, top: "20%", left: "24%" },
  { Icon: Rocket, top: "20%", left: "38%" },
  { Icon: GraduationCap, top: "28%", left: "48%" },
  { Icon: TrendingUp, top: "29%", left: "17%" },
  { Icon: Atom, top: "50%", left: "50%" },
  { Icon: Compass, top: "51%", left: "16%" },
  { Icon: FlaskConical, top: "72%", left: "17%" },
  { Icon: Lightbulb, top: "80%", left: "24%" },
  { Icon: Share2, top: "80%", left: "38%" },
  { Icon: BookOpen, top: "72%", left: "48%" },
];

const BrandPanel = () => (
  <div
    className="relative hidden md:flex md:w-1/2 lg:w-[58%] items-center justify-center overflow-hidden"
    style={{
      background: "linear-gradient(160deg, #16225c 0%, #142163 45%, #1a2470 100%)",
      clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)",
    }}
  >
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-[420px] h-[420px] rounded-full border border-white/10 flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full border border-dashed border-white/15 flex items-center justify-center">
          <div className="w-[180px] h-[180px] rounded-full bg-white/5 blur-2xl" />
        </div>
      </div>
    </div>

    {floatingIcons.map(({ Icon, top, left }, idx) => (
      <div
        key={idx}
        className="absolute w-12 h-12 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/80"
        style={{ top, left }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
    ))}

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
        <h2 className="text-white text-xl font-bold leading-tight">Counselor Portal</h2>
        <p className="text-indigo-200 text-sm">Guidance &amp; Admission Console</p>
      </div>
    </div>
  </div>
);

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
    <div className="min-h-screen w-full flex bg-white overflow-hidden">

      <BrandPanel />

      <div className="w-full md:w-1/2 lg:w-[42%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a2470]">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-1">
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Registered email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="pl-11 w-full border border-gray-300 rounded-lg py-3 tracking-[0.3em] font-mono focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="New password (min 8 characters)"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 w-full border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-[#1a2470]/40 focus:border-[#1a2470] outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold tracking-wide flex justify-center items-center gap-2 disabled:opacity-60 transition"
                style={{ background: "linear-gradient(90deg, #1a2470 0%, #3d2f8f 100%)" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link
              href="/Counslerlogin"
              className="text-sm text-gray-500 hover:text-[#1a2470] font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to login
            </Link>
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