

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row relative animate-slideUpMobile md:animate-fadeIn">
        {/* Left Blue Panel */}
        <div className="bg-[#05347f] text-white w-full md:w-1/3 p-6 flex flex-col justify-center items-center text-center">
          <img src="/images/q.jpeg" alt="help" className="w-16 h-16 mb-4" />
          <h3 className="text-lg font-semibold mb-2">May I help you?</h3>
          <p className="text-sm leading-snug">
            Fill up your details <br /> for enquiry
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-2/3 p-6 md:p-8 relative text-gray-900">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile No"
              required
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows="3"
              className="col-span-2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            ></textarea>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-[#05347f] text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(0);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpMobile {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUpMobile {
          animation: slideUpMobile 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
