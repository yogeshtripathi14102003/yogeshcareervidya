
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import api from "@/utlis/api";
import { X, ShieldCheck, CheckCircle2 } from "lucide-react";

/* ================= FLOATING SELECT (STANDARD UI) ================= */
const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className="relative w-full group">
    <label className="absolute -top-2 left-2.5 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider text-[#05347f] z-10 transition-all group-focus-within:text-orange-500">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none focus:border-[#05347f] focus:ring-1 focus:ring-[#05347f]/20 transition-all bg-white appearance-none cursor-pointer"
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);

/* ================= FLOATING INPUT (STANDARD UI) ================= */
const FloatingInput = ({ label, name, type = "text", value, onChange, showNoSpam = false }) => (
  <div className="relative w-full group">
    <label className="absolute -top-2 left-2.5 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider text-[#05347f] z-10 transition-all group-focus-within:text-orange-500">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none focus:border-[#05347f] focus:ring-1 focus:ring-[#05347f]/20 transition-all"
    />
    {showNoSpam && (
      <div className="flex justify-end mt-1">
        <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
          <CheckCircle2 size={10} /> WE DO NOT SPAM
        </span>
      </div>
    )}
  </div>
);

/* ================= MAIN COMPONENT ================= */
const AuthModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", city: "", state: "", course: "", branch: "", gender: "", subsidyCoupon: "", addresses: "", dob: "", otp: "",
  });

  const [loginData, setLoginData] = useState({ identifier: "", otp: "" });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [subsidyOptions, setSubsidyOptions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [sRes, cRes, subRes] = await Promise.all([
          api.get("/api/v1/states"),
          api.get("/api/v1/course"),
          api.get("/api/v1/offer/type/subsidy")
        ]);
        setStates(sRes.data.states || []);
        setCourses(cRes.data.courses || cRes.data.data || []);
        setSubsidyOptions((subRes.data.data || []).map(i => `${i.provider} ₹${i.amount}`));
      } catch (e) { console.error(e); }
    };
    init();
  }, []);

  const handleStateChange = async (e) => {
    const s = e.target.value;
    setFormData(p => ({ ...p, state: s, city: "" }));
    try {
      const res = await api.get(`/api/v1/districts/${s}`);
      setDistricts(res.data.districts || []);
    } catch { setDistricts([]); }
  };

  const handleCourseChange = (e) => {
    const name = e.target.value;
    setFormData(p => ({ ...p, course: name, branch: "" }));
    const selected = courses.find(c => c.name === name);
    setSpecializations(selected?.specializations || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifier = activeTab === "login" ? loginData.identifier : (formData.email || formData.mobileNumber);
    const purpose = activeTab === "login" ? "login" : "register";

    if (!otpSent) {
      try {
        setLoading(true);
        await api.post("/api/v1/send-otp", { emailOrPhone: identifier, purpose });
        setOtpSent(true);
      } catch (err) { alert(err.response?.data?.msg || "Action Failed"); }
      finally { setLoading(false); }
    } else {
      try {
        setLoading(true);
        const payload = activeTab === "login" 
          ? { emailOrPhone: loginData.identifier, otp: loginData.otp, purpose: "login" }
          : { ...formData, emailOrPhone: identifier, purpose: "register" };

        const res = await api.post("/api/v1/verify-otp", payload);
        const accessToken = res.data.accessToken;
        const student = res.data.student || res.data.user || res.data.data;
        const role = student?.role || "user";
        const tokenKey = (role === "admin" || role === "subadmin") ? "admintoken" : "usertoken";

        localStorage.setItem(tokenKey, accessToken);
        localStorage.setItem("user", JSON.stringify(student));
        Cookies.set(tokenKey, accessToken, { expires: 7, path: "/" });

        window.location.href = (role === "admin" || role === "subadmin") ? "/admin" : "/user";
      } catch (err) { alert("Verification Failed. Check OTP."); }
      finally { setLoading(false); }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header Section */}
        <div className="p-6 pb-2">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-sm">
              <Image src="/images/n12.png" alt="Career Vidya" width={70} height={35} className="object-contain" />
            </div>
            <div>
              <p className="text-[15px] font-black text-[#05347f] leading-tight">#VidyaHaiTohSuccessHai</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mt-0.5">Official Student Portal</p>
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-full px-4 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex gap-4 text-[9px] font-bold text-emerald-700">
              <span className="flex items-center gap-1"><CheckCircle2 size={10}/> NO-COST EMI</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={10}/> GOVT-APPROVED</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={10}/> 100% PLACEMENT</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 mt-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => {setActiveTab("login"); setOtpSent(false);}}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-[#05347f] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => {setActiveTab("signup"); setOtpSent(false);}}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'signup' ? 'bg-white text-[#05347f] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 pt-6 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "login" ? (
              <div className="space-y-6 py-2">
                <FloatingInput 
                  label="Email or Mobile" 
                  value={loginData.identifier} 
                  onChange={e => setLoginData({...loginData, identifier: e.target.value})} 
                  disabled={otpSent}
                />
                {otpSent && (
                  <FloatingInput 
                    label="Verification OTP" 
                    value={loginData.otp} 
                    onChange={e => setLoginData({...loginData, otp: e.target.value})} 
                  />
                )}
              </div>
            ) : (
              <div className="space-y-6 py-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <FloatingInput label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <FloatingInput label="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} showNoSpam />
                  <FloatingInput label="Mobile Number" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} showNoSpam />
                  <FloatingSelect label="State" value={formData.state} onChange={handleStateChange} options={states} />
                  <FloatingSelect label="City/District" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} options={districts} />
                  <FloatingSelect label="Course" value={formData.course} onChange={handleCourseChange} options={courses.map(c => c.name)} />
                  <FloatingSelect label="Specialization" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} options={specializations} />
                  <FloatingSelect label="Gender" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} options={["male", "female", "other"]} />
                  <FloatingInput label="Date of Birth" type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  <FloatingSelect label="Subsidy Coupon" value={formData.subsidyCoupon} onChange={e => setFormData({...formData, subsidyCoupon: e.target.value})} options={subsidyOptions} />
                </div>
                <FloatingInput label="Complete Home Address" value={formData.addresses} onChange={e => setFormData({...formData, addresses: e.target.value})} />
                {otpSent && <FloatingInput label="Verify OTP" value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} />}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3.5 rounded-xl font-bold text-[14px] transition-all shadow-lg shadow-orange-200 active:scale-[0.98] disabled:opacity-70 uppercase tracking-wide">
              {loading ? "Please wait..." : otpSent ? "Verify & Proceed" : "Submit Details"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
           <ShieldCheck size={16} className="text-slate-400" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Encrypted & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;