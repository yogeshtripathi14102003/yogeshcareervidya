"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/utlis/api"; // ✅ optional axios instance

export default function QueryPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    queryType: "",
  });

  // ✅ Automatically open after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // show after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/query", formData);
      alert("✅ Query submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        queryType: "",
      });
      setShowPopup(false);
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
    }
  };

  if (!showPopup) return null; // hide until time delay

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl flex w-[90%] max-w-3xl relative overflow-hidden">
        {/* ===== Left Blue Panel ===== */}
        <div className="bg-[#0096D6] text-white w-1/3 p-6 flex flex-col justify-center items-center text-center">
          <img
            src="/images/callcenter.png"
            alt="help"
            className="w-16 h-16 mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">May I help you?</h3>
          <p className="text-sm leading-snug">
            Fill up your details <br /> for enquiry
          </p>
        </div>

        {/* ===== Right Form Section ===== */}
        <div className="w-2/3 p-8 relative">
          {/* Close Button */}
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
              name="phone"
              value={formData.phone}
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

            {/* Query Type */}
            <div className="col-span-2 space-y-2 mt-2">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="queryType"
                  value="admission"
                  checked={formData.queryType === "admission"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Query related to Admission
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="queryType"
                  value="other"
                  checked={formData.queryType === "other"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Query related to Other
              </label>
            </div>

            {/* Submit Button */}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
