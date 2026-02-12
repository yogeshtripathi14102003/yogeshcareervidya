"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

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
      className={`w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] ${
        showNoSpam ? "pr-36" : ""
      }`}
    />
    {showNoSpam && (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-green-600 border border-green-500 rounded-full px-2 py-[2px] bg-white whitespace-nowrap">
        {noSpamText}
      </span>
    )}
  </div>
);

/* ================= MAIN ================= */
const Signup = ({ onClose }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    gender: "",
    subsidyCoupon: "",
    addresses: "",
    dob: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subsidyOptions, setSubsidyOptions] = useState([]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ================= STATES ================= */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/v1/states");
        setStates(res.data.states || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  const fetchDistricts = async (state) => {
    if (!state) return setDistricts([]);
    try {
      const res = await api.get(`/api/v1/districts/${state}`);
      setDistricts(res.data.districts || []);
    } catch {
      setDistricts([]);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((p) => ({ ...p, state, city: "" }));
    fetchDistricts(state);
  };

  /* ================= SUBSIDY ================= */
  useEffect(() => {
    const fetchSubsidy = async () => {
      try {
        const res = await api.get("/api/v1/offer/type/subsidy");
        const list = res.data?.data || res.data || [];
        setSubsidyOptions(
          list.map(
            (item) => `${item.provider} ₹${item.amount} ${item.eligibility}`
          )
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubsidy();
  }, []);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const required = [
      "name",
      "email",
      "mobileNumber",
      "state",
      "city",
      "gender",
      "subsidyCoupon",
      "addresses",
      "dob",
    ];
    for (let f of required) {
      if (!formData[f]) {
        alert(`Please fill ${f}`);
        return false;
      }
    }
    return true;
  };

  /* ================= OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP Sent Successfully");
    } catch {
      alert("User already exists");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) return alert("Enter OTP");

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSubmit = (e) =>
    otpSent ? handleVerifyOtp(e) : handleSendOtp(e);

  /* ================= UI ================= */
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-2"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[800px] rounded-xl 
                   p-4 sm:p-6 
                   relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 cursor-pointer">
          <X />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <Image src="/images/n12.png" alt="Career Vidya" width={85} height={42} />
          <div>
            <p className="text-sm font-bold text-[#253b7a]">
              #VidyaHaiTohSuccessHai
            </p>
            <p className="text-[12px] text-gray-500">
              Student's Trusted Education Guidance Platform
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FloatingInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              showNoSpam
            />
            <FloatingInput
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              showNoSpam
            />
            <FloatingSelect
              label="State"
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              options={states}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FloatingSelect
              label="City / District"
              name="city"
              value={formData.city}
              onChange={handleChange}
              options={districts}
            />
            <FloatingSelect
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["male", "female", "other"]}
            />
            <FloatingInput
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <FloatingSelect
            label="Subsidy"
            name="subsidyCoupon"
            value={formData.subsidyCoupon}
            onChange={handleChange}
            options={subsidyOptions}
          />

          <FloatingInput
            label="Address"
            name="addresses"
            value={formData.addresses}
            onChange={handleChange}
          />

          {otpSent && (
            <FloatingInput
              label="OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
            />
          )}

          <button
            className="w-full bg-orange-500 text-white py-3 rounded font-bold text-sm sm:text-base"
          >
            {loading
              ? "Please wait..."
              : otpSent
              ? "Verify & Register"
              
              : "Apply Best Universities"}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-600 mt-3 bg-gray-100 px-2 py-1 rounded">
          🔒 All your information is safe and secure with us.
        </p>
      </div>
    </div>
  );
};

export default Signup;
