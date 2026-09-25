"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaArrowRight, FaSpinner } from "react-icons/fa";

// ============================================================
// 🔌 API CONFIG (api.js integrated)
// ============================================================
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_VERSION = "/api/v1";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ============================================================
// 📡 CALLBACK API ENDPOINTS
// ============================================================
const callbackAPI = {
  create: async (payload) => {
    const { data } = await apiClient.post("/callback/request", payload);
    return data;
  },
  getAll: async () => {
    const { data } = await apiClient.get("/callback/all");
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/callback/${id}`);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await apiClient.put(`/callback/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await apiClient.delete(`/callback/${id}`);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await apiClient.patch(`/callback/${id}/status`, {
      status,
    });
    return data;
  },
};

// ============================================================
// 🏠 MAIN PAGE
// ============================================================
export default function HomePage() {
  return <RequestCallbackSection />;
}

/* ============================================================
   📝 REQUEST CALL BACK SECTION (Image jaisa exact)
============================================================ */
function RequestCallbackSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    course: "",
    state: "",
    fullAddress: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.mobileNumber ||
      !formData.course ||
      !formData.state ||
      !formData.fullAddress ||
      !formData.gender
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        course: formData.course,
        state: formData.state,
        fullAddress: formData.fullAddress,
        gender: formData.gender,
        inquiryType: "Request Call Back",
      };

      const data = await callbackAPI.create(payload);

      toast.success(
        data?.message || "Request submitted! We'll call you back soon 🎉"
      );

      // Reset
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        course: "",
        state: "",
        fullAddress: "",
        gender: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* ========== LEFT SIDE - Illustration ========== */}
        <div className="flex justify-center items-center order-2 lg:order-1">
          <img
            src="/images/inquiry-illustration.png"
            alt="Request Call Back Illustration"
            className="w-full max-w-md lg:max-w-xl h-auto object-contain"
          />
        </div>

        {/* ========== RIGHT SIDE - Form Card ========== */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Request Call Back
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Fill the form and our team will call you back shortly.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Full Name"
                  name="fullName"
                  placeholder="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 2: Mobile + Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  placeholder="mobile"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Course"
                  name="course"
                  placeholder="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 3: Gender + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={["Male", "Female", "Other"]}
                  placeholder="select gender"
                  required
                />
                <FormField
                  label="State"
                  name="state"
                  placeholder="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 4: Full Address */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="fullAddress"
                  placeholder="address"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base sm:text-lg py-3.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Request Call Back <FaArrowRight className="text-sm" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   🔤 REUSABLE FORM FIELD
============================================================ */
function FormField({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
      />
    </div>
  );
}

/* ============================================================
   🔽 REUSABLE SELECT
============================================================ */
function SelectField({ label, options, placeholder, required, ...props }) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...props}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all appearance-none cursor-pointer bg-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}