"use client";

import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import api from "@/utlis/api";

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    course: "",
    branch: "",
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/getintouch", formData);
      alert("✅ Query submitted successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        city: "",
        course: "",
        branch: "",
        message: "",
      });
      setShowPopup(false);
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-slideUpMobile md:animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 z-[110] bg-white/90 md:bg-gray-100 p-2 rounded-full shadow-md text-gray-500 hover:text-blue-600 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Left Panel */}
        <div className="bg-[#05347f] text-white w-full md:w-1/3 p-8 flex flex-col justify-center items-center text-center">
          <div className="bg-white/10 p-4 rounded-full mb-4">
            <img
              src="/images/may.png"
              alt="help"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
          <h3 className="text-l font-bold mb-2">Share your query</h3>
          <p className="text-sm opacity-80">
            We’re here to guide you at every step. <br className="hidden md:block" />
            
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-2/3 p-6 md:p-10 text-gray-900">
          <h2 className="text-xl font-bold mb-6 text-[#05347f] hidden md:block">
            Quick Enquiry
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile No"
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* NEW FIELD */}
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Course"
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* NEW FIELD */}
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Branch"
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              required
              rows="3"
              className="md:col-span-2 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#05347f] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Message</span>
                <Send size={18} />
              </button>
  <p className="text-center text-[11px]  text-gray-600 mt-[2px] px-2 py-2 rounded">
  🔒 All your information is safe and secure with us.
</p>

            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUpMobile {
          from { opacity: 0; transform: translateY(30%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUpMobile {
          animation: slideUpMobile 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
