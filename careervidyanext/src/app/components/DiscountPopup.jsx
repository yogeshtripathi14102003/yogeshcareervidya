

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

/* ================= MAIN ================= */
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

  /* ================= MOUNT ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= OFFER FETCH ================= */
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

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!showPopup || !offer || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showPopup, offer]);

  /* ================= SUCCESS POPUP AUTO CLOSE ================= */
  useEffect(() => {
    if (!showSuccessPopup) return;

    const timer = setTimeout(() => {
      setShowSuccessPopup(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  // ❗ FIXED: DO NOT UNMOUNT ON showPopup=false
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

  /* ================= VALIDATION ================= */
  const validateAllFields = () => {
    const fields = [
      "name",
      "email",
      "mobileNumber",
      "city",
      "state",
      "course",
      "gender",
      "addresses",
      "branch",
      "dob",
      "subsidyCoupon",
    ];
    for (let f of fields) {
      if (!formData[f]) {
        alert(`Please fill ${f}`);
        return false;
      }
    }
    return true;
  };

  /* ================= SEND OTP ================= */
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

  /* ================= VERIFY OTP ================= */
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
      alert("Registration successful");
      setShowPopup(false);
      setShowSuccessPopup(true); // ✅ INSTANT POPUP
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
      {/* ================= MAIN POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowPopup(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl shadow-xl bg-white overflow-hidden">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-black"
            >
              <X />
            </button>

            {!showSignup ? (
              <div className="p-6 text-center bg-[#E14D56] text-white">
                <h2 className="text-4xl font-bold italic">GetAdmission</h2>
                <p className="text-lg mt-2 font-bold">Early Bird Offer Live!</p>

                <div className="flex justify-center items-end gap-1 mt-4">
                  <span className="text-8xl font-bold text-yellow-300">
                    {offer.discountPercentage}
                  </span>
                  <span className="text-4xl text-yellow-300">%</span>
                </div>

                <button
                  onClick={handleGetClick}
                  className="bg-[#5D5FEF] py-3 px-10 rounded-full text-lg font-black flex gap-2 mx-auto mt-6"
                >
                  GET <Zap />
                </button>

                <p className="text-xs mt-4">
                  Valid for {hours}h {minutes}m {seconds}s
                </p>
              </div>
            ) : (
              <div className="p-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/images/n12.png" alt="logo" width={80} height={40} />
                   <div>
            <p className="text-sm font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
            <p className="text-[12px] text-gray-500">
               Student's Trusted Education Guidance Platform
           </p>
          </div>
                </div>
                 
                <form className="space-y-3">
                  <FloatingInput label="Name*" name="name" value={formData.name} onChange={handleChange} />

                  <div className="grid sm:grid-cols-2 gap-3">
                    <FloatingInput label="Email*" name="email" value={formData.email} onChange={handleChange} />
                    <FloatingInput label="Mobile Number*" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                  </div>

   <FloatingInput label="State*" name="state" value={formData.state} onChange={handleChange} />
                  <FloatingInput label="City*" name="city" value={formData.city} onChange={handleChange} />
               

                  <div className="grid sm:grid-cols-2 gap-3">
                    <FloatingInput label="Course" name="course" value={formData.course} onChange={handleChange} />
                    <FloatingInput label="Branch*" name="branch" value={formData.branch} onChange={handleChange} />
                  </div>

                  <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} />

                  
                
                    <FloatingInput type="date" label="Date of Birth*" name="dob" value={formData.dob} onChange={handleChange} />
                

                  <FloatingInput
                    label="Subsidy Coupon"
                    name="subsidyCoupon"
                    value={formData.subsidyCoupon}
                    readOnly
                    insideText={`${offer.discountPercentage}% OFF`}
                  />

                  <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />

                  {otpSent && (
                    <FloatingInput label="OTP" name="otp" value={formData.otp} onChange={handleChange} />
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 rounded-md text-white font-bold bg-orange-500"
                  >
                    {loading ? "Please wait..." : otpSent ? "Verify & Register" : "Send OTP"}
                  </button>
                      <p className="text-center text-[11px] text-gray-600 mt-[2px] bg-gray-100 px-2 py-1 rounded">
    🔒 All your information is safe and secure with us.
  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 " />
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="text-green-600 text-5xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-[#253b7a] mb-2">
              Your offer applied successfully.  
            </h3>
            <p className="text-sm text-gray-600">
              A Career Vidya academic advisor will connect you within 12-24 hours  
              <br />
             
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationSignupPopup;


