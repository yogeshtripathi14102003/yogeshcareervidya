"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";  // ✅ Add this at the top

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className="relative w-full">
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
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-green-600 border border-green-500 rounded-full px-2 py-[2px] bg-white whitespace-nowrap">
        {noSpamText}
      </span>
    )}
  </div>
);

/* ================= MAIN COMPONENT ================= */
const Signup = ({ onClose }) => {
      const router = useRouter();
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
      } catch (err) {
        console.error("States fetch error", err);
      }
    };
    fetchStates();
  }, []);

  const fetchDistricts = async (state) => {
    if (!state) {
      setDistricts([]);
      return;
    }
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
    setFormData((prev) => ({
      ...prev,
      state,
      city: "",
    }));
    fetchDistricts(state);
  };

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
    setFormData((prev) => ({
      ...prev,
      course: selectedCourseName,
      branch: "",
    }));
    const selectedCourse = courses.find((c) => c.name === selectedCourseName);
    setSpecializations(selectedCourse?.specializations || []);
  };

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

  const validateForm = () => {
    const required = [
      "name",
      "email",
      "mobileNumber",
      "city",
      "state",
      "course",
      "branch",
      "gender",
      "subsidyCoupon",
      "addresses",
      "dob",
    ];
    for (let field of required) {
      if (!formData[field]) {
        alert(`Please fill ${field}`);
        return false;
      }
    }
    return true;
  };

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
       router.push("/topunivers/comparedetail");
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
    <div
      className="fixed inset-0 bg-black/90 flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[800px] rounded-xl p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <Image src="/images/n12.png" alt="Career Vidya" width={85} height={42} />
          <div>
            <p className="text-sm font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
            <p className="text-[12px] text-gray-500">
              Student's Trusted Education Guidance Platform
            </p>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto">
          <div className="flex min-w-max gap-2 text-[11px] font-bold text-green-700">
            <span>✅ No-Cost EMI Available</span>|
            <span>🎓 Govt-Approved Universities</span>|
            <span>💼 100% Placement Assistance</span>|
            <span>📞 Free Expert Counselling</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput label="Name" name="name" value={formData.name} onChange={handleChange} />

          <div className="grid grid-cols-3 gap-3">
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

          <div className="grid grid-cols-3 gap-3">

            
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
            <FloatingInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
           <FloatingSelect
              label="Subsidy"
              name="subsidyCoupon"
              value={formData.subsidyCoupon}
              onChange={handleChange}
              options={subsidyOptions}
            />
          
          </div>

          <div className="grid gap-4">
            <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />
          </div>

          {otpSent && <FloatingInput label="OTP" name="otp" value={formData.otp} onChange={handleChange} />}

          <button className="w-full bg-orange-500 text-white py-2 rounded font-bold">
            {loading ? "Please wait..." : otpSent ? "Verify & Register" : "Compare Best Universities"}
          </button>
        </form>

        <p className="text-center text-xs mt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        </p>

        <p className="text-center text-[11px] text-gray-600 mt-[2px] bg-gray-100 px-2 py-1 rounded">
          🔒 All your information is safe and secure with us.
        </p>
      </div>
    </div>
  );
};

export default Signup;
