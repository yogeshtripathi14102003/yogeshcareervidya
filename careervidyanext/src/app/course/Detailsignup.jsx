

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api";
import { Check } from "lucide-react";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
// Autoplay module import kiya gaya hai
import { Pagination, Navigation, Grid, Autoplay } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/grid";

const inputStyle =
  "w-full p-2 border border-gray-400 rounded-md bg-white \
   placeholder:text-gray-500 placeholder:font-medium \
   transition-all duration-200 \
   focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] \
   focus:placeholder:text-transparent outline-none";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    otp: "",
    city: "",
    state: "",
    course: "",
    gender: "",
    addresses: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        setUniversities(res.data?.data || []);
      } catch (err) {
        console.error("University fetch error", err);
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "name", "mobileNumber", "email", "city",
      "state", "course", "gender", "addresses"
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the "${field}" field before sending OTP.`);
        return;
      }
    }

    try {
      setLoading(true);
      await api.post("/api/v1/send-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        purpose: "register",
      });
      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch {
      alert("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert("Please enter the OTP first.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/api/v1/verify-otp", {
        emailOrPhone: formData.email || formData.mobileNumber,
        otp: formData.otp,
        purpose: "register",
        ...formData,
      });
      alert("Registration successful!");
    } catch {
      alert("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!otpSent) handleSendOtp(e);
    else handleVerifyOtp(e);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-[95%] md:w-[1100px] overflow-hidden flex flex-col md:flex-row mx-auto my-6 border border-gray-100">

{/* LEFT SIDE: University Logos + Text (Background White) */}
<div className="hidden md:flex w-1/2 p-8 bg-white flex-col items-center border-r border-gray-100">
  {/* University Logos Slider */}
  <Swiper
    modules={[Pagination, Navigation, Grid, Autoplay]}
    slidesPerView={4}
    slidesPerGroup={1}
    grid={{ rows: 3, fill: "row" }}
    spaceBetween={10}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
    }}
    className="mb-6 w-full"
  >
    {universities.map((uni) => {
      const imageUrl = uni.universityImage
        ? uni.universityImage.startsWith("http")
          ? uni.universityImage
          : `${process.env.NEXT_PUBLIC_API_URL}${uni.universityImage.startsWith("/") ? "" : "/"}${uni.universityImage}`
        : "/fallback.png";

      return (
        <SwiperSlide key={uni._id} className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center h-[50px] w-[100px] shadow-sm">
            <div className="relative w-full h-full p-1">
              <Image
                src={imageUrl}
                alt={uni.name || "University"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </SwiperSlide>
      );
    })}
  </Swiper>

  {/* Main Heading */}
  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 font-sans">
    Unlock Your Future with Career Vidya
  </h2>

  {/* Text List with Check Icons */}
  <ul className="space-y-3 text-[#05347f] text-sm md:text-base text-center font-sans">
    <li className="flex items-center gap-2">
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
        <Check className="w-3.5 h-3.5 text-green-500" />
      </span>
      <span className="text-green-600 font-semibold">  globally recognized Degree  * WES Approved</span>
    </li>
    <li className="flex items-center gap-2">
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
        <Check className="w-3.5 h-3.5 text-green-500" />
      </span>
      <span className="text-green-600 font-semibold"> 100 % Placement Assistance 
</span>
    </li>
    <li className="flex items-center gap-2">
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
        <Check className="w-3.5 h-3.5 text-green-500" />
      </span>
      <span className="text-green-600 font-semibold">24/7 Student Support</span>
    </li>

    {/* Optional extra items */}
    {expanded && (
      <>
        <li className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
            <Check className="w-3.5 h-3.5 text-green-500" />
          </span>
          <span className="text-green-600 font-semibold">
            AI Predictions – Data-driven college matches
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
            <Check className="w-3.5 h-3.5 text-green-500" />
          </span>
          <span className="text-green-600 font-semibold">
            Counselling – Personal guidance. Real results.
          </span>
        </li>
      </>
    )}
  </ul>
</div>


      {/* RIGHT SIDE: Signup Form (Background White) */}
      <div className="w-full md:w-1/2 p-8 bg-white">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#05347f]">Apply Online Course Form</h2>
        <h6 className="font-bold text-center mb-4 text-[#05347f]">  <span>✓</span> Early bird discount  |Alumni Interaction |Loan Facility</h6> 
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Name */}
          <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
          </div>

          {/* Email & Mobile */}
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} className={inputStyle} />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#E8FAF0] text-[#2ECC71] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2ECC71] flex items-center gap-1 whitespace-nowrap">
                <span>✓</span> We Do Not Spam
              </div>
            </div>

            <div className="relative w-1/2">
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Mobile Number</label>
              <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className={inputStyle} />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#E8FAF0] text-[#2ECC71] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2ECC71] flex items-center gap-1 whitespace-nowrap">
                <span>✓</span> We Do Not Spam
              </div>
            </div>
          </div>

          {/* City */}
          <div className="relative mt-6">
            <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">City</label>
            <input name="city" value={formData.city} onChange={handleChange} className={inputStyle} />
          </div>

          {/* Expand Button */}
          {!expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="w-full bg-[#05347f] text-white font-bold py-2 rounded-md mt-4 hover:bg-[#0450a0]"
            >
              Expand Form ↓
            </button>
          )}

          {/* RIGHT Side form expansion logic */}
          {expanded && (
            <>
              <div className="relative">
                <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">State</label>
                <input name="state" value={formData.state} onChange={handleChange} className={inputStyle} />
              </div>

              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Course</label>
                  <input name="course" value={formData.course} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="relative w-1/2">
                  <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                    <option value=""></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Address</label>
                <input name="addresses" value={formData.addresses} onChange={handleChange} className={inputStyle} />
              </div>

              {otpSent && (
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#4A55A2] z-10">Enter OTP</label>
                  <input name="otp" value={formData.otp} onChange={handleChange} className={inputStyle} />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 mt-4 rounded-md text-white font-semibold shadow-md transition-all
                  ${loading ? "bg-gray-400" : !otpSent ? "bg-[#FFA500] hover:bg-[#FF8C00]" : "bg-[#1E90FF] hover:bg-[#0077c9]"}`}
              >
                {loading ? "Please wait..." : !otpSent ? "Send OTP" : "Verify OTP"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;