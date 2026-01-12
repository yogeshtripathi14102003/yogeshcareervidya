// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import api from "@/utlis/api";
// import { X } from "lucide-react";

// /* ================= FLOATING INPUT ================= */
// const FloatingInput = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   showSpam,
// }) => {
//   return (
//     <div className="relative w-full">
//       <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
//         {label}
//       </label>

//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#05347f]/20"
//       />

//       {showSpam && (
//        <span className="absolute right-3 -top-2 rounded-full border border-green-500 bg-green-50 px-2 py-0.5 text-[10px] text-green-600 pointer-events-none">
//   ✔ We Do Not Spam
// </span>

//       )}
//     </div>
//   );
// };

// /* ================= FLOATING SELECT ================= */
// const FloatingSelect = ({ label, name, value, onChange }) => {
//   return (
//     <div className="relative w-full">
//       <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
//         {label}
//       </label>

//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none cursor-pointer"
//       >
//         <option value="">Select</option>
//         <option>male</option>
//         <option>female</option>
//         <option>other</option>
//       </select>
//     </div>
//   );
// };

// /* ================= MAIN COMPONENT ================= */
// const Signup = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     city: "",
//     state: "",
//     course: "",
//     gender: "",
//     addresses: "",
//     branch: "",
//     otp: "",
//     specialization: "",
//     dob: "",
//     subsidyCoupon: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const validateAllFields = () => {
//     const fields = [
//       "name",
//       "email",
//       "mobileNumber",
//       "city",
//       "state",
//       "course",
//       "gender",
//       "addresses",
//       "branch",
//       "dob",
//     ];
//     for (let f of fields) {
//       if (!formData[f]) {
//         alert(`Please fill ${f}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!validateAllFields()) return;

//     try {
//       setLoading(true);
//       await api.post("/api/v1/send-otp", {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       setOtpSent(true);
//       alert("OTP Sent To Your Email Successfully");
//     } catch {
//       alert("user already existing Please Login  ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) return alert("Enter OTP");

//     try {
//       setLoading(true);
//       await api.post("/api/v1/verify-otp", {
//         ...formData,
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       });
//       alert("Registration successful");
//       onClose?.();
//     } catch {
//       alert("Invalid OTP");
       
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     otpSent ? handleVerifyOtp(e) : handleSendOtp(e);
//   };

//   return (
//     /* ===== FIXED CONTAINER (NO CROP) ===== */
//     <div
//       className="fixed inset-0 z-[100] bg-black/90 
//                  flex items-start justify-center 
//                  overflow-y-auto py-6 px-3"
//       onClick={onClose}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl my-auto"
//       >
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"
//         >
//           <X size={18} />
//         </button>

//         {/* LOGO */}
//         <div className="flex items-center gap-3 mb-3">
//           <Image src="/images/n12.png" alt="Career Vidya" width={85} height={42} />
//           <div>
//             <p className="text-sm font-bold text-[#253b7a]">
//               #VidyaHaiTohSuccessHai
//             </p>
//             <p className="text-[12px] text-gray-500">
//               Students’ most trusted guide for education
//             </p>
//           </div>
//         </div>

//         {/* USP */}
//         <div className="mb-4 overflow-x-auto">
//           <div className="flex min-w-max gap-2 text-[11px] font-bold text-green-700">
//             <span>✅ No-Cost EMI from ₹4,999</span>| 
//             <span>🎓 Govt-Approved Universities</span>| 
//             <span>💼 100% Placement Assistance</span>| 
//             <span>📞 Free Expert Counselling</span>
//           </div>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <FloatingInput label="Name" name="name" value={formData.name} onChange={handleChange} />

//           <div className="grid sm:grid-cols-2 gap-4">
//             <FloatingInput label="Email" name="email" value={formData.email} onChange={handleChange} showSpam />
//             <FloatingInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} showSpam />
//           </div>

//           <FloatingInput label="City" name="city" value={formData.city} onChange={handleChange} />
//           <FloatingInput label="State" name="state" value={formData.state} onChange={handleChange} />

//           <div className="grid sm:grid-cols-2 gap-4">
//             <FloatingInput label="Course" name="course" value={formData.course} onChange={handleChange} />
//             <FloatingInput label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
//           </div>

//           <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} />

//           <div className="grid sm:grid-cols-2 gap-4">
//             <FloatingInput label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
//             <FloatingInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//           </div>

//           <FloatingInput label="Subsidy Coupon (Optional)" name="subsidyCoupon" value={formData.subsidyCoupon} onChange={handleChange} />
//           <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />

//           {otpSent && (
//             <FloatingInput label="OTP" name="otp" value={formData.otp} onChange={handleChange} />
//           )}

//           <button
//             disabled={loading}
//             className={`w-full py-2.5 rounded-md text-white font-bold text-sm ${
//               otpSent ? "bg-blue-700" : "bg-orange-500"
//             }`}
//           >
//             {loading ? "Please wait..." : otpSent ? "Verify & Register" : "Send OTP"}
//           </button>

//           <p className="text-center text-[11px] text-gray-600">
//             🔒 All your information is safe and secure with us.
//           </p>
//         </form>

//         <p className="mt-4 text-center text-xs text-gray-500">
//           Already have an account?{" "}
//           <Link href="/login" className="text-blue-600 font-bold">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";
import { X } from "lucide-react";

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({ label, name, type = "text", value, onChange, showSpam }) => (
  <div className="relative w-full">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#05347f]/20"
    />
    {showSpam && (
      <span className="absolute right-3 -top-2 rounded-full border border-green-500 bg-green-50 px-2 py-0.5 text-[10px] text-green-600 pointer-events-none">
        ✔ We Do Not Spam
      </span>
    )}
  </div>
);

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
      className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none cursor-pointer"
    >
      <option value="">Select</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    city: "",
    subsidyCoupon: "", // subsidy selection
    state: "",
    course: "",
    gender: "",
    addresses: "",
    branch: "",
    otp: "",
    specialization: "",
    dob: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subcityOptions, setSubcityOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= FETCH SUBSIDY OPTIONS ================= */
  useEffect(() => {
    const fetchSubsidies = async () => {
      try {
        const res = await api.get("/api/v1/offer/type/subsidy");

        // Check if backend returns array directly
        const dataArray = Array.isArray(res.data) ? res.data : res.data?.data;

        if (dataArray && dataArray.length) {
          const options = dataArray.map(
            (item, idx) => `${idx + 1}. ${item.provider}  ₹${item.amount}  ${item.eligibility}`
          );
          setSubcityOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch subsidy options:", err);
      }
    };
    fetchSubsidies();
  }, []);

  /* ================= VALIDATION ================= */
  const validateAllFields = () => {
    const fields = [
      "name",
      "email",
      "mobileNumber",
      "city",
      "subsidyCoupon", // require selection
      "state",
      "course",
      "gender",
      "addresses",
      "branch",
      "dob",
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
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP Sent To Your Email Successfully");
    } catch {
      alert("User already existing. Please Login");
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
      await api.post("/api/v1/verify-otp", {
        ...formData,
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      alert("Registration successful");
      onClose?.();
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    otpSent ? handleVerifyOtp(e) : handleSendOtp(e);
  };

  /* ================= RENDER ================= */
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center overflow-y-auto py-6 px-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl my-auto"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-3">
          <Image src="/images/n12.png" alt="Career Vidya" width={85} height={42} />
          <div>
            <p className="text-sm font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
            <p className="text-[12px] text-gray-500">
              Students’ most trusted guide for education
            </p>
          </div>
        </div>

        {/* USP */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex min-w-max gap-2 text-[11px] font-bold text-green-700">
            <span>✅ No-Cost EMI Available</span>|
            <span>🎓 Govt-Approved Universities</span>|
            <span>💼 100% Placement Assistance</span>|
            <span>📞 Free Expert Counselling</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput label="Name" name="name" value={formData.name} onChange={handleChange} />

          <div className="grid sm:grid-cols-2 gap-4">
            <FloatingInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              showSpam
            />
            <FloatingInput
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              showSpam
            />
          </div>

          <FloatingInput label="City" name="city" value={formData.city} onChange={handleChange} />

          <FloatingInput label="State" name="state" value={formData.state} onChange={handleChange} />

          <div className="grid sm:grid-cols-2 gap-4">
            <FloatingInput label="Course" name="course" value={formData.course} onChange={handleChange} />
            <FloatingInput label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
          </div>

          <FloatingSelect
  label="Gender"
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  options={["male", "female", "other"]}
/>
  

          <div className="grid sm:grid-cols-2 gap-4">
            <FloatingInput
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
            <FloatingInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          </div>

          {/* Subsidy Dropdown */}
      <FloatingSelect
  label="Subsidy"
  name="subsidyCoupon" // <-- update this
  value={formData.subsidyCoupon}
  onChange={handleChange}
  options={subcityOptions}
/>


          <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />

          {otpSent && <FloatingInput label="OTP" name="otp" value={formData.otp} onChange={handleChange} />}

          <button
            disabled={loading}
            className={`w-full py-2.5 rounded-md text-white font-bold text-sm ${
              otpSent ? "bg-blue-700" : "bg-orange-500"
            }`}
          >
            {loading ? "Please wait..." : otpSent ? "Verify & Register" : "Send OTP"}
          </button>

          <p className="text-center text-[11px] text-gray-600 mt-[2px] bg-gray-100 px-2 py-1 rounded">
            🔒 All your information is safe and secure with us.
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
