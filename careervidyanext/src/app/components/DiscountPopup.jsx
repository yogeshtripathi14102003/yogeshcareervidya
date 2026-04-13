

"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import Image from "next/image";
import API from "@/utlis/api.js";

/* ================= FLOATING INPUT (Sari fields rakhi hain) ================= */
const FloatingInput = ({ label, name, type = "text", value, onChange, readOnly, insideText }) => (
  <div className="relative w-full mb-3">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    />
    {insideText && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-green-700">
        {insideText}
      </span>
    )}
    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
      {label}
    </label>
  </div>
);

const FloatingSelect = ({ label, name, value, onChange }) => (
  <div className="relative w-full mb-3">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px]"
    >
      <option value="">Select</option>
      <option>male</option>
      <option>female</option>
      <option>other</option>
    </select>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const CelebrationSignupPopup = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [offer, setOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", city: "", state: "",
    course: "", gender: "", addresses: "", branch: "", otp: "",
    dob: "", subsidyCoupon: "",
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(async () => {
      try {
        const res = await API.get("/api/v1/offer/type/offer");
        const latest = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setOffer(latest);
        setShowPopup(true);
        const seconds = Math.max(Math.floor((new Date(latest.validTill) - new Date()) / 1000), 0);
        setTimeLeft(seconds);
      } catch (err) { console.error("Offer API error", err); }
    }, 10000);
    return () => clearTimeout(timer);
  }, [mounted]);

  useEffect(() => {
    if (!showPopup || !offer || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showPopup, offer]);

  useEffect(() => {
    if (!showSuccessPopup) return;
    const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  if (!mounted || !offer) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetClick = () => {
    setShowSignup(true);
    setFormData((p) => ({
      ...p,
      subsidyCoupon: `${offer.couponCode} - ${offer.discountPercentage}%`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpSent) {
      if (!formData.otp) return alert("Enter OTP");
      try {
        setLoading(true);
        await API.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        setShowPopup(false);
        setShowSuccessPopup(true);
      } catch { alert("Invalid OTP"); } finally { setLoading(false); }
    } else {
      try {
        setLoading(true);
        await API.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        setOtpSent(true);
        alert("OTP Sent Successfully");
      } catch { alert("OTP error"); } finally { setLoading(false); }
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)} />

          <div className={`relative w-full ${showSignup ? 'max-w-lg' : 'max-w-[360px]'} rounded-3xl shadow-2xl bg-white overflow-hidden transition-all duration-300 border-t-4 border-blue-500`}>
            <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 cursor-pointer text-white z-20 opacity-70 hover:opacity-100">
              <X size={24} />
            </button>

            {!showSignup ? (
              /* --- VIEW 1: COMPACT OFFER CARD (WITH DUAL GRADIENTS) --- */
              <div className="relative p-7 text-center overflow-hidden flex flex-col items-center">
                
                {/* Dual Gradient Overlays for Top/Bottom half color change */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-blue-900 to-blue-800 opacity-90"></div>
                
                {/* Subtle light pulse from center */}
                <div className="absolute -inset-10 z-0 bg-[radial-gradient(circle_at_center,_white/10,_transparent_40%)]"></div>

                <div className="relative z-10 w-full">
                  <h2 className="text-[32px] font-black italic text-white uppercase italic tracking-tight leading-none">GetAdmission</h2>
                  <p className="text-[10px] font-bold text-white/70 tracking-[0.25em] uppercase mb-8">Empowering Your Future</p>
                  
                  <div className="flex flex-col items-center mb-8">
                    {/* Multicolored vibrant percentage with bold weights */}
                    <div className="flex items-baseline justify-center">
                      <span className="text-[96px] font-black text-white leading-none tracking-tighter shadow-black">
                        {offer.discountPercentage}
                      </span>
                      <div className="flex flex-col items-start ml-2">
                         <span className="text-[36px] font-bold text-green-300/80 leading-none">%</span>
                         <span className="text-[28px] font-bold text-red-300/90 leading-none">OFF</span>
                      </div>
                    </div>
                  </div>

                  {/* Clean white button in high contrast */}
                  <button
                    onClick={handleGetClick}
                    className="bg-white text-[#000080] cursor-pointer w-full max-w-[140px] py-1.5 rounded-lg text-[18px] font-black flex items-center justify-center gap-2 mx-auto shadow-2xl transition-all hover:scale-105 active:scale-95 group uppercase"
                  >
                    GET NOW <Zap className="fill-[#000080]" size={20} />
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                      Valid for: <span className="text-white font-mono">{hours}H {minutes}M {seconds}S</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* --- VIEW 2: FULL DETAIL FORM (POORI FIELDS KE SAATH - Unchanged) --- */
              <div className="p-6 max-h-[90vh] overflow-y-auto bg-white">
                <div className="flex items-center gap-3 mb-5 border-b pb-4">
                  <Image src="/images/n12.png" alt="logo" width={80} height={40} />
                  <div>
                    <p className="text-sm font-bold text-[#000080]">#VidyaHaiTohSuccessHai</p>
                    <p className="text-[10px] text-gray-400 font-medium">Student's Trusted Education Guidance Platform</p>
                  </div>
                </div>

                <form className="space-y-1">
                  <FloatingInput label="Full Name*" name="name" value={formData.name} onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingInput label="Email*" name="email" value={formData.email} onChange={handleChange} />
                    <FloatingInput label="Mobile*" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingInput label="State*" name="state" value={formData.state} onChange={handleChange} />
                    <FloatingInput label="City*" name="city" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingInput label="Course*" name="course" value={formData.course} onChange={handleChange} />
                    <FloatingInput label="Branch*" name="branch" value={formData.branch} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingSelect label="Gender*" name="gender" value={formData.gender} onChange={handleChange} />
                    <FloatingInput type="date" label="DOB*" name="dob" value={formData.dob} onChange={handleChange} />
                  </div>
                  <FloatingInput label="Coupon" name="subsidyCoupon" value={formData.subsidyCoupon} readOnly insideText="ACTIVE" />
                  <FloatingInput label="Full Address" name="addresses" value={formData.addresses} onChange={handleChange} />
                  
                  {otpSent && <FloatingInput label="Enter OTP" name="otp" value={formData.otp} onChange={handleChange} />}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 mt-3 rounded-xl text-white font-bold bg-[#000080] hover:bg-blue-900 transition-all shadow-lg active:scale-95"
                  >
                    {loading ? "Processing..." : otpSent ? "Verify & Register" : "Send OTP to Apply"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TANKU WALA MESSAGE (SUCCESS POPUP - Unchanged) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-10 text-center border-t-8 border-[#000080] animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-[#000080] mb-2">Thank You!</h3>
            <p className="text-sm text-gray-600">Your admission offer is applied successfully. Our advisor will call you within 24 hours.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationSignupPopup;