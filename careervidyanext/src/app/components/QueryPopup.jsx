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
      setFormData({ name: "", email: "", mobile: "", city: "", message: "" });
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
        
        {/* CLOSE BUTTON - Added cursor-pointer */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 z-[110] bg-white/90 md:bg-gray-100 p-2 rounded-full shadow-md md:shadow-none text-gray-500 hover:text-blue-600 transition-all duration-300 group cursor-pointer"
          aria-label="Close"
        >
          <X size={22} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left Panel */}
        <div className="bg-[#05347f] text-white w-full md:w-1/3 p-8 flex flex-col justify-center items-center text-center">
          <div className="bg-white/10 p-4 rounded-full mb-4">
            <img src="/images/may.png" alt="help" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
          </div>
          <h3 className="text-xl font-bold mb-2">May I help you?</h3>
          <p className="text-sm opacity-80 leading-snug">
            Fill up your details <br className="hidden md:block" /> for quick enquiry
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-2/3 p-6 md:p-10 text-gray-900">
          <h2 className="text-xl font-bold mb-6 text-[#05347f] md:block hidden">Quick Enquiry </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full transition-all"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full transition-all"
            />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile No"
              required
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full transition-all"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full transition-all"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              required
              rows="3"
              className="md:col-span-2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none w-full transition-all"
            ></textarea>

            <div className="md:col-span-2 mt-2">
              {/* SUBMIT BUTTON - Added cursor-pointer */}
              <button
                type="submit"
                className="w-full bg-[#05347f] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Message</span>
                <Send size={18} />
              </button>
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
          0% { opacity: 0; transform: translateY(30%); }
          100% { opacity: 1; transform: translateY(0); }
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