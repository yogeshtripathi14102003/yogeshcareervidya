"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import Image from "next/image";
import API from "@/utlis/api.js";

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly,
  insideText,
}) => (
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

/* ================= FLOATING SELECT ================= */
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
    name: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    course: "",
    gender: "",
    addresses: "",
    branch: "",
    otp: "",
    dob: "",
    subsidyCoupon: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(async () => {
      try {
        const res = await API.get("/api/v1/offer/type/offer");
        const latest = res.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        setOffer(latest);
        setShowPopup(true);

        const seconds = Math.max(
          Math.floor((new Date(latest.validTill) - new Date()) / 1000),
          0
        );
        setTimeLeft(seconds);
      } catch (err) {
        console.error("Offer API error", err);
      }
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetClick = () => {
    setShowSignup(true);
    setFormData((p) => ({
      ...p,
      subsidyCoupon: `${offer.couponCode} - ${offer.discountPercentage}%`,
    }));
  };

  const validateAllFields = () => {
    const fields = ["name", "email", "mobileNumber", "state", "city", "course", "branch", "gender", "dob"];
    for (let f of fields) {
      if (!formData[f]) {
        alert(`Please fill ${f}`);
        return false;
      }
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;
    try {
      setLoading(true);
      await API.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP Sent Successfully");
    } catch {
      alert("OTP error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Enter OTP");
    try {
      setLoading(true);
      await API.post("/api/v1/verify-otp", {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setShowPopup(false);
      setShowSuccessPopup(true);
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    otpSent ? handleVerifyOtp(e) : handleSendOtp(e);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPopup(false)} />

          <div className="relative w-full max-w-lg rounded-2xl shadow-2xl bg-white overflow-hidden border-4 border-white">
            <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-gray-700 z-20">
              <X size={24} />
            </button>

            {!showSignup ? (
              /* --- TRICOLOUR THEME SECTION --- */
              <div className="relative p-8 text-center bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#138808] min-h-[400px] flex flex-col justify-center items-center">
                {/* Ashoka Chakra Background Symbol */}
                <div className="absolute opacity-10 pointer-events-none">
                  <div className="w-64 h-64 border-4 border-[#000080] rounded-full flex items-center justify-center">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="absolute w-full h-[1px] bg-[#000080]" style={{ transform: `rotate(${i * 15}deg)` }}></div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-4xl font-black italic text-[#000080] drop-shadow-sm">GetAdmission</h2>
                  <p className="text-lg mt-1 font-bold text-gray-800 tracking-widest uppercase"> Build a Stronger India</p>
                  
                  <div className="mt-6 flex flex-col items-center">
                    <div className="flex items-baseline gap-1">
                      <span className="text-8xl font-black text-[#000080] leading-none">{offer.discountPercentage}</span>
                      <span className="text-4xl font-bold text-[#000080]">% OFF</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mt-2 bg-white/50 px-3 py-1 rounded-full">SPECIAL CELEBRATION OFFER</p>
                  </div>

                  <button
                    onClick={handleGetClick}
                    className="bg-[#000080] hover:bg-blue-900 text-white py-4 px-12 rounded-full text-xl font-black flex items-center gap-2 mx-auto mt-8 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    GET NOW <Zap fill="currentColor" />
                  </button>

                  <p className="text-xs font-bold mt-6 text-gray-700">
                    Valid for: <span className="text-red-600">{hours}h {minutes}m {seconds}s</span>
                  </p>
                </div>
              </div>
            ) : (
              /* --- SIGNUP FORM SECTION --- */
              <div className="p-5 max-h-[85vh] overflow-y-auto bg-white">
                <div className="flex items-center gap-3 mb-4 border-b pb-3">
                  <Image src="/images/n12.png" alt="logo" width={80} height={40} />
                  <div>
                    <p className="text-sm font-bold text-[#000080]">#VidyaHaiTohSuccessHai</p>
                    <p className="text-[11px] text-gray-500">Student's Trusted Education Guidance Platform</p>
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
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 mt-2 rounded-md text-white font-bold bg-[#138808] hover:bg-green-700 transition-colors shadow-lg"
                  >
                    {loading ? "Processing..." : otpSent ? "Verify & Register" : "Send OTP to Apply"}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-2 italic">Secured by GetAdmission Academic Council</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border-t-8 border-green-600">
            <div className="text-6xl mb-4">🇮🇳</div>
            <h3 className="text-xl font-bold text-[#000080] mb-2">Congratulations!</h3>
            <p className="text-sm text-gray-600">Your Republic Day offer is applied. Our advisor will call you within 24 hours.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationSignupPopup;