"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/utlis/api";
import { X, ArrowRight, Mail, Phone, Lock, ShieldCheck } from "lucide-react";

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className="relative w-full">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f] z-10">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px]"
    >
      <option value="">Select</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  showNoSpam = false,
  noSpamText = "✓ We Do Not Spam",
}) => (
  <div className="relative w-full">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f] z-10">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none"
    />
    {showNoSpam && (
      <div className="flex justify-end -mt-0.5">
        <span className="text-[9px] text-green-600 font-medium px-1 leading-none bg-white whitespace-nowrap uppercase tracking-tighter">
          {noSpamText}
        </span>
      </div>
    )}
  </div>
);

/* ================= MAIN AUTH MODAL ================= */
const AuthModal = ({ onClose, defaultTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // "login" | "register"
  const router = useRouter();

  /* ===== LOGIN STATE ===== */
  const [loginMode, setLoginMode] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  /* ===== REGISTER STATE ===== */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    course: "",
    branch: "",
    gender: "",
    subsidyCoupon: "",
    addresses: "",
    dob: "",
    otp: "",
  });
  const [registerOtpSent, setRegisterOtpSent] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [subsidyOptions, setSubsidyOptions] = useState([]);

  /* ===== REGISTER: INPUT CHANGE ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ===== REGISTER: FETCH STATES ===== */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/v1/states");
        setStates(res.data.states || []);
      } catch (err) {
        console.error("States fetch error", err);
      }
    };
    fetchStates();
  }, []);

  /* ===== REGISTER: FETCH DISTRICTS ===== */
  const fetchDistricts = async (state) => {
    if (!state) { setDistricts([]); return; }
    try {
      const res = await api.get(`/api/v1/districts/${state}`);
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error("Districts fetch error", err);
      setDistricts([]);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((prev) => ({ ...prev, state, city: "" }));
    fetchDistricts(state);
  };

  /* ===== REGISTER: FETCH COURSES ===== */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");
        let courseList = [];
        if (Array.isArray(res.data)) courseList = res.data;
        else if (Array.isArray(res.data.data)) courseList = res.data.data;
        else if (Array.isArray(res.data.courses)) courseList = res.data.courses;
        setCourses(courseList);
      } catch (err) {
        console.error("Course fetch error", err);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseChange = (e) => {
    const selectedCourseName = e.target.value;
    setFormData((prev) => ({ ...prev, course: selectedCourseName, branch: "" }));
    const selectedCourse = courses.find((c) => c.name === selectedCourseName);
    setSpecializations(selectedCourse?.specializations || []);
  };

  /* ===== REGISTER: FETCH SUBSIDY ===== */
  useEffect(() => {
    const fetchSubsidy = async () => {
      try {
        const res = await api.get("/api/v1/offer/type/subsidy");
        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.data?.data)) list = res.data.data;
        setSubsidyOptions(
          list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`)
        );
      } catch (err) {
        console.error("Subsidy fetch error", err);
      }
    };
    fetchSubsidy();
  }, []);

  /* ===== REGISTER: VALIDATION ===== */
  const validateForm = () => {
    const required = [
      "name", "email", "mobileNumber", "city", "state",
      "course", "branch", "gender", "subsidyCoupon", "addresses", "dob",
    ];
    for (let field of required) {
      if (!formData[field]) {
        alert(`Please fill ${field}`);
        return false;
      }
    }
    return true;
  };

  /* ===== REGISTER: SEND OTP ===== */
  const handleRegisterSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setRegisterLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setRegisterOtpSent(true);
      alert("OTP Sent Successfully");
    } catch {
      alert("User already exists");
    } finally {
      setRegisterLoading(false);
    }
  };

  /* ===== REGISTER: VERIFY OTP ===== */
  const handleRegisterVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Enter OTP");
    try {
      setRegisterLoading(true);
      await api.post("/api/v1/verify-otp", {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      alert("Registration Successful");
      onClose?.();
    } catch {
      alert("Invalid OTP");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    registerOtpSent ? handleRegisterVerifyOtp(e) : handleRegisterSendOtp(e);
  };

  /* ===== LOGIN: SEND OTP ===== */
  const handleLoginSendOtp = async () => {
    if (!identifier) return alert("Please enter your Email or Phone Number");
    try {
      setLoginLoading(true);
      const response = await api.post("/api/v1/send-otp", {
        emailOrPhone: identifier,
        purpose: "login",
      });
      alert(response.data.msg || "OTP Sent Successfully ✅");
      setLoginOtpSent(true);
    } catch (error) {
      console.error("OTP Error:", error);
      alert(error.response?.data?.msg || "Failed to send OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ===== LOGIN: VERIFY OTP ===== */
  const handleLoginVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP");
    try {
      setLoginLoading(true);
      const res = await api.post("/api/v1/verify-otp", {
        emailOrPhone: identifier,
        otp,
        purpose: "login",
      });
      const { accessToken, student } = res.data;
      const role = student.role;
      const tokenKey = (role === "admin" || role === "subadmin") ? "admintoken" : "usertoken";
      localStorage.setItem(tokenKey, accessToken);
      localStorage.setItem("user", JSON.stringify(student));
      localStorage.setItem("accessToken", accessToken);
      const isLocal = window.location.hostname === "localhost";
      const cookieOptions = {
        expires: 7,
        path: "/",
        secure: !isLocal,
        domain: isLocal ? undefined : ".careervidya.in",
        sameSite: "lax",
      };
      Cookies.set("userRole", role, cookieOptions);
      Cookies.set(tokenKey, accessToken, cookieOptions);
      setTimeout(() => {
        const targetPath = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
        window.location.href = targetPath;
      }, 200);
    } catch (error) {
      console.error("Verification Error:", error);
      alert(error.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ===== RENDER ===== */
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <div
      //iske ander width change karni hai thodi
        className="bg-white w-full max-w-2xl rounded-xl relative overflow-hidden"
        style={{ maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="cursor-pointer absolute top-3 right-3 z-10">
          <X />
        </button>

        {/* Header */}
        <div className="px-6 pt-2 pb-0">
          <div className="flex items-center gap-3 mb-3">
            <Image src="/images/n12.png" alt="Career Vidya" width={85} height={42} />
            <div>
              <p className="text-sm font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
              <p className="text-[12px] text-gray-500">Student's Trusted Education Guidance Platform</p>
            </div>
          </div>

          {/* Trust badges */}
        <div className=" overflow-x-auto selection:bg-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div className="flex min-w-max gap-2 text-[11px] font-bold text-green-700">
        <span>✅ No-Cost EMI Available</span>|
        <span>🎓 Govt-Approved Universities</span>|
        <span>💼 100% Placement Assistance</span>|
        <span>📞 Free Expert Counselling</span>
    </div>
</div>

          {/* Tab Switcher */}
          <div className="flex ">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`pb-3 px-6 text-[12px] font-bold uppercase tracking-widest transition-all ${
                activeTab === "login"
                  ? "text-[#0056b3] "
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`pb-3 px-6 text-[12px] font-bold uppercase tracking-widest transition-all ${
                activeTab === "register"
                  ? "text-[#0056b3] "
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(95vh - 200px)" }}>

          {/* ============ LOGIN TAB ============ */}
          {activeTab === "login" && (
            <div>
              {/* Login mode switcher */}
              <div className="flex border-b border-slate-100 mb-6">
                {["email", "phone"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => !loginOtpSent && setLoginMode(mode)}
                    className={`pb-3 pr-8 text-[11px] font-bold uppercase tracking-widest transition-all ${
                      loginMode === mode
                        ? "text-[#0056b3] border-b-2 border-[#0056b3]"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {mode === "email" ? "Email Auth" : "Mobile Auth"}
                  </button>
                ))}
              </div>

              <form className="space-y-5" onSubmit={handleLoginVerifyOtp}>
                {/* Identifier */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                    {loginMode === "email" ? "Registered Email" : "Mobile Number"}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0056b3] transition-colors">
                      {loginMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
                    </div>
                    <input
                      type={loginMode === "email" ? "email" : "tel"}
                      placeholder={loginMode === "email" ? "Enter your email" : "Enter mobile number"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={loginOtpSent}
                      required
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-10 text-sm outline-none focus:border-[#0056b3] focus:bg-white transition-all placeholder:text-slate-300 disabled:opacity-70 rounded-md"
                    />
                  </div>
                </div>

                {/* OTP Input */}
                {loginOtpSent && (
                  <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Verification Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setLoginOtpSent(false)}
                        className="text-[10px] font-bold text-[#0056b3] hover:underline"
                      >
                        Edit Info
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="0 0 0 0 0 0"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-blue-50 p-3.5 text-center text-xl tracking-[0.8em] font-black focus:border-[#0056b3] outline-none transition-all rounded-md"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                {!loginOtpSent ? (
                  <button
                    type="button"
                    onClick={handleLoginSendOtp}
                    disabled={loginLoading}
                    className="cursor-pointer w-full bg-[#ff6b00] hover:bg-[#e66000] text-white p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded disabled:opacity-70"
                  >
                    {loginLoading ? "Requesting..." : "Send OTP"}
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="cursor-pointer w-full bg-slate-900 hover:bg-black text-white p-4 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all rounded disabled:opacity-70"
                  >
                    <Lock size={14} />
                    {loginLoading ? "Verifying..." : "Secure Login"}
                  </button>
                )}
              </form>

              <p className="text-center text-xs mt-4 text-[#000] font-bold">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </div>
          )}

          {/* ============ REGISTER TAB ============ */}
          {activeTab === "register" && (
            <div>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    showNoSpam
                    noSpamText="✓ We Do Not Spam"
                  />
                  <FloatingInput
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    showNoSpam
                    noSpamText="✓ We Do Not Spam"
                  />
                  <FloatingSelect
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    options={states}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FloatingSelect
                    label="City / District"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    options={districts}
                  />
                  <FloatingSelect
                    label="Course"
                    name="course"
                    value={formData.course}
                    onChange={handleCourseChange}
                    options={courses.map((c) => c.name)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FloatingSelect
                    label="Specialization"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    options={specializations}
                  />
                  <FloatingSelect
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={["male", "female", "other"]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  <FloatingSelect
                    label="Subsidy"
                    name="subsidyCoupon"
                    value={formData.subsidyCoupon}
                    onChange={handleChange}
                    options={subsidyOptions}
                  />
                </div>

                <FloatingInput
                  label="Address"
                  name="addresses"
                  value={formData.addresses}
                  onChange={handleChange}
                />

                {registerOtpSent && (
                  <FloatingInput
                    label="OTP"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                )}

                <button className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded font-bold">
                  {registerLoading
                    ? "Please wait..."
                    : registerOtpSent
                    ? "Verify & Register"
                    : "Submit"}
                </button>
              </form>

              <p className="text-center text-xs mt-3 text-[#000] font-bold">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          )}

          {/* Bottom trust badge */}
          <p className="text-center text-[12px] text-gray-600 mt-4 bg-gray-100 px-2 py-1 rounded flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-gray-400" />
            All your information is safe and secure with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
