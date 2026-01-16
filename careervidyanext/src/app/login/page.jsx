// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api";
// import Cookies from "js-cookie";

// const LoginPage = () => {
//   const [loginMode, setLoginMode] = useState("email");
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const adminToken = Cookies.get("admintoken");
//     const userToken = Cookies.get("token");
//     if (adminToken) router.push("/admin");
//     if (userToken) router.push("/user");
//   }, [router]);

//   const handleSendOtp = async () => {
//     if (!identifier) return alert("Please enter your email or phone number.");
//     try {
//       setLoading(true);
//       await api.post("/api/v1/send-otp", { emailOrPhone: identifier, purpose: "login" });
//       alert("OTP sent successfully!");
//       setOtpSent(true);
//     } catch (error) {
//       alert(error.response?.data?.msg || "Failed to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) return alert("Please enter the OTP first.");
//     try {
//       setLoading(true);
//       const res = await api.post("/api/v1/verify-otp", { emailOrPhone: identifier, otp, purpose: "login" });

//       const token = res.data.accessToken;
//       const userRole = res.data.student.role;

//       if (userRole === "admin") {
//         localStorage.setItem("admintoken", token);
//         Cookies.set("admintoken", token, { expires: 1 });
//         router.push("/admin");
//       } else {
//         localStorage.setItem("token", token);
//         Cookies.set("token", token, { expires: 1 });
//         router.push("/user");
//       }

//       alert("Login successful!");
//       setOtpSent(false);
//       setOtp("");
//       setIdentifier("");
//     } catch (error) {
//       alert(error.response?.data?.msg || "Invalid OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black flex flex-col md:flex-row overflow-hidden">
//       {/* Left Section */}
//       <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start">
//         <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
//         <h2 className="text-2xl font-semibold mb-6">Welcome Back to Career Vidya</h2>
//         <p className="mb-4">Log in to access your personalized dashboard:</p>
//         <ul className="list-disc list-inside mb-6 space-y-2">
//           <li>Exam Alerts Timely updates Smart decisions</li>
//           <li>Mock Tests Practice. Perform Perfect.</li>
//           <li>AI Predictions Data-driven college matches</li>
//           <li>Counselling Personal guidance. Real results.</li>
//         </ul>
//       </div>

//       {/* Right Section */}
//       <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center">
//         <div className="w-full max-w-md">
//           <form className="space-y-4" onSubmit={handleVerifyOtp}>
//             <div className="flex space-x-4 mb-2 text-black">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="loginMode"
//                   value="email"
//                   checked={loginMode === "email"}
//                   onChange={() => setLoginMode("email")}
//                   className="mr-2"
//                   disabled={otpSent}
//                 />
//                 Email
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="loginMode"
//                   value="phone"
//                   checked={loginMode === "phone"}
//                   onChange={() => setLoginMode("phone")}
//                   className="mr-2"
//                   disabled={otpSent}
//                 />
//                 Phone Number
//               </label>
//             </div>

//             <input
//               type={loginMode === "email" ? "email" : "tel"}
//               placeholder={loginMode === "email" ? "Enter Email" : "Enter Phone (+91...)"}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF] text-black"
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               required
//               disabled={otpSent}
//             />

//             <div className="flex space-x-4">
//               {otpSent && (
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1E90FF] text-black"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//               )}
//               {!otpSent ? (
//                 <button
//                   type="button"
//                   className="w-full p-2 bg-[#FFA500] text-white rounded-md hover:bg-[#87CEEB]"
//                   onClick={handleSendOtp}
//                   disabled={loading}
//                 >
//                   {loading ? "Sending..." : "Send OTP"}
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   className="w-1/2 p-2 bg-[#1E90FF] text-white rounded-md hover:bg-[#87CEEB]"
//                   disabled={loading}
//                 >
//                   {loading ? "Verifying..." : "Login"}
//                 </button>
//               )}
//             </div>

//             <button className="w-full mt-6 px-4 py-2 bg-white border border-gray-300 rounded-full flex items-center justify-center text-black hover:bg-gray-100">
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25h-11v4.26h6.46c-.28 1.49-1.13 2.75-2.41 3.6v3h3.88c2.28-2.1 3.59-5.19 3.59-8.61z" />
//                 <path d="M12.25 24c3.32 0 6.11-1.09 8.15-2.96l-3.88-3c-1.08.73-2.47 1.16-4.27 1.16-3.29 0-6.07-2.23-7.06-5.23h-3v3.24c2.04 4.04 6.23 6.75 11.06 6.75z" />
//                 <path d="M5.19 14.04c-.41-1.23-1.63-2.25-3.06-2.91v-3.24h3v3.24z" />
//               </svg>
//               Continue with Google
//             </button>
//           </form>

//           <p className="mt-4 text-center text-[#1E90FF]">
//             Don’t have an account? <Link href="/signup">Sign Up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api"; // सुनिश्चित करें कि स्पेलिंग सही है (utils/api)
import Cookies from "js-cookie";

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. पेज लोड होते ही चेक करें अगर यूजर पहले से लॉगिन है (Redirect Loop Protection)
  useEffect(() => {
    const adminToken = Cookies.get("admintoken");
    const userToken = Cookies.get("usertoken"); // Fixed name
    
    if (adminToken) {
      router.replace("/admin");
    } else if (userToken) {
      router.replace("/user");
    }
  }, [router]);

  // 2. OTP भेजने का फंक्शन
  const handleSendOtp = async () => {
    if (!identifier) return alert("Please enter your email or phone number.");
    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", { 
        emailOrPhone: identifier, 
        purpose: "login" 
      });
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 3. OTP Verify और Login का फंक्शन
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP first.");
    
    try {
      setLoading(true);
      const res = await api.post("/api/v1/verify-otp", { 
        emailOrPhone: identifier, 
        otp, 
        purpose: "login" 
      });

      const token = res.data.accessToken;
      const userRole = res.data.student?.role; // student object से रोल निकाला

      if (userRole === "admin") {
        // Admin के लिए टोकन सेट करें
        localStorage.setItem("admintoken", token);
        Cookies.set("admintoken", token, { expires: 1, path: '/' });
        router.push("/admin");
      } else {
        // User के लिए टोकन सेट करें (Middleware से मैच करने के लिए usertoken नाम रखा)
        localStorage.setItem("usertoken", token);
        Cookies.set("usertoken", token, { expires: 1, path: '/' });
        router.push("/user");
      }

      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Branding */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-start bg-gray-50">
        <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
        <h2 className="text-2xl font-semibold mb-6">Welcome Back to Career Vidya</h2>
        <p className="mb-4">Log in to access your personalized dashboard:</p>
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-600">
          <li>Exam Alerts: Timely updates. Smart decisions.</li>
          <li>Mock Tests: Practice. Perform. Perfect.</li>
          <li>AI Predictions: Data-driven college matches.</li>
          <li>Counselling: Personal guidance. Real results.</li>
        </ul>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div className="flex space-x-6 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="loginMode"
                  checked={loginMode === "email"}
                  onChange={() => setLoginMode("email")}
                  className="mr-2 w-4 h-4 accent-[#1E90FF]"
                  disabled={otpSent}
                />
                <span className="text-sm font-medium">Email</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="loginMode"
                  checked={loginMode === "phone"}
                  onChange={() => setLoginMode("phone")}
                  className="mr-2 w-4 h-4 accent-[#1E90FF]"
                  disabled={otpSent}
                />
                <span className="text-sm font-medium">Phone Number</span>
              </label>
            </div>

            <input
              type={loginMode === "email" ? "email" : "tel"}
              placeholder={loginMode === "email" ? "Enter Email" : "Enter Phone (e.g. +91...)"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={otpSent}
            />

            <div className="flex gap-3">
              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              )}
              
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full p-3 bg-[#FFA500] text-white font-semibold rounded-lg hover:bg-[#e69500] transition disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-1/2 p-3 bg-[#1E90FF] text-white font-semibold rounded-lg hover:bg-[#1874cc] transition disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Login"}
                </button>
              )}
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
            </div>

            <button type="button" className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-1.6 3.92-4.16 3.92-2.32 0-4.24-1.92-4.24-4.28s1.92-4.28 4.24-4.28c1.36 0 2.24.56 2.72 1.04l2.48-2.48C19.92 6.4 17.52 5.2 14.56 5.2c-4.48 0-8.08 3.6-8.08 8.08s3.6 8.08 8.08 8.08c4.64 0 7.76-3.28 7.76-7.84 0-.56-.08-1.04-.16-1.52h-7.68z"></path>
              </svg>
              Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#1E90FF] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;