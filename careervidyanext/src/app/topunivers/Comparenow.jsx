"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className="relative w-full">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] md:text-[11px] font-semibold text-[#05347f] z-10">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] px-3 py-2.5 md:py-2 text-[13px] bg-white outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
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
  noSpamText = "✓ No Spam",
}) => (
  <div className="relative w-full">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] md:text-[11px] font-semibold text-[#05347f] z-10">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border border-[#05347f] px-3 py-2.5 md:py-2 text-[13px] outline-none focus:ring-1 focus:ring-blue-500 ${
        showNoSpam ? "pr-24 md:pr-36" : ""
      }`}
    />
    {showNoSpam && (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] md:text-[11px] text-green-600 border border-green-500 rounded-full px-1.5 py-[1px] bg-white whitespace-nowrap">
        {noSpamText}
      </span>
    )}
  </div>
);

/* ================= MAIN COMPONENT ================= */
// ✅ added selectedUnis prop
const Signup = ({ onClose, selectedUnis = [] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", city: "", state: "",
    course: "", branch: "", gender: "", subsidyCoupon: "",
    addresses: "", dob: "", otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [subsidyOptions, setSubsidyOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/v1/states");
        setStates(res.data.states || []);
      } catch (err) { console.error("States fetch error", err); }
    };
    fetchStates();
  }, []);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((prev) => ({ ...prev, state, city: "" }));
    if (state) {
      api.get(`/api/v1/districts/${state}`).then(res => setDistricts(res.data.districts || []));
    } else {
      setDistricts([]);
    }
  };

  useEffect(() => {
    api.get("/api/v1/course").then(res => {
      let list = res.data.courses || res.data.data || res.data || [];
      setCourses(list);
    });
  }, []);

  const handleCourseChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, course: name, branch: "" }));
    const selected = courses.find((c) => c.name === name);
    setSpecializations(selected?.specializations || []);
  };

  useEffect(() => {
    api.get("/api/v1/offer/type/subsidy").then(res => {
      let list = res.data.data || res.data || [];
      setSubsidyOptions(list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpSent) {
      if (!formData.otp) return alert("Enter OTP");
      try {
        setLoading(true);
        const res = await api.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        
        // Token save karna mat bhulna agar API de raha hai
        if(res.data.token) localStorage.setItem("usertoken", res.data.token);

        alert("Registration Successful");
        
        // ✅ Redirect logic with University IDs
        if (selectedUnis && selectedUnis.length > 0) {
          const ids = selectedUnis.map(u => u._id).join(",");
          router.push(`/comparedetail?ids=${ids}`);
        } else {
          router.push("/comparedetail");
        }
        
        onClose?.();
      } catch (err) { 
        alert("Invalid OTP or Registration failed"); 
      } finally { 
        setLoading(false); 
      }
    } else {
      try {
        setLoading(true);
        await api.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        setOtpSent(true);
        alert("OTP Sent Successfully");
      } catch { alert("User already exists or error sending OTP"); } finally { setLoading(false); }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] p-2 md:p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-[850px] rounded-2xl p-4 md:p-8 relative overflow-y-auto max-h-[95vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500  cursor-pointer  hover:text-black">
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <Image src="/images/n12.png" alt="Logo" width={90} height={45} className="w-[80px] md:w-[90px]" />
          <div>
            <p className="text-sm md:text-base font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
            <p className="text-[11px] md:text-[12px] text-gray-500">Student's Trusted Education Guidance Platform</p>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max gap-3 text-[10px] md:text-[11px] font-bold text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
            <span>✅ No-Cost EMI</span> | <span>🎓 Govt-Approved</span> | <span>💼 100% Placement</span> | <span>📞 Free Counselling</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FloatingInput label="Email Address" name="email" value={formData.email} onChange={handleChange} showNoSpam />
            <FloatingInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} showNoSpam />
            <FloatingSelect label="State" name="state" value={formData.state} onChange={handleStateChange} options={states} />
            <FloatingSelect label="City / District" name="city" value={formData.city} onChange={handleChange} options={districts} />
            <FloatingSelect label="Course" name="course" value={formData.course} onChange={handleCourseChange} options={courses.map((c) => c.name)} />
            <FloatingSelect label="Specialization" name="branch" value={formData.branch} onChange={handleChange} options={specializations} />
            <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["male", "female", "other"]} />
            <FloatingInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            <FloatingSelect label="Subsidy Option" name="subsidyCoupon" value={formData.subsidyCoupon} onChange={handleChange} options={subsidyOptions} />
          </div>

          <FloatingInput label="Full Address" name="addresses" value={formData.addresses} onChange={handleChange} />

          {otpSent && (
            <div className="animate-pulse">
              <FloatingInput label="Enter 6-Digit OTP" name="otp" value={formData.otp} onChange={handleChange} />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#f15a24]  cursor-pointer hover:bg-[#d64d1d] text-white py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Processing..." : otpSent ? "VERIFY & REGISTER" : "COMPARE BEST UNIVERSITIES"}
          </button>
        </form>

        <p className="text-center text-xs md:text-sm mt-5">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>

        <div className="text-center text-[10px] md:text-[11px] text-gray-500 mt-4 bg-gray-50 py-2 rounded-lg border border-dashed border-gray-300">
          🔒 Your data is encrypted and 100% secure.
        </div>
      </div>
    </div>
  );
};

export default Signup;