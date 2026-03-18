"use client";

import React, { useState, useRef } from "react";
import api from "@/utlis/api.js";
import { useRouter } from "next/navigation";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";

export default function ApplyForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expectedSalary: "",
    experience: "",
    noticePeriod: "",
    resume: null,
  });

  const [success, setSuccess] = useState(false);
  const resumeRef = useRef();

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      // Optional size validation (50KB)
      if (file.size > 50 * 1024) {
        alert("File size must be less than 50KB");
        return;
      }

      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      await api.post("/api/v1/resume", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        expectedSalary: "",
        experience: "",
        noticePeriod: "",
        resume: null,
      });

      resumeRef.current.value = "";

    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application.");
    }
  };

  /* ================= SUCCESS SCREEN ================= */
  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
            
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              🎉 Thank You!
            </h2>

            <p className="text-gray-700 mb-4">
              Thank you for applying to <span className="font-semibold">CareerVidya</span>.
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Our team will review your application and get back to you soon.
            </p>

            <button
              onClick={() => router.push("/career")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Back to Jobs
            </button>

          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ================= FORM UI ================= */
  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl"
        >
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => router.back()}
            className="text-blue-600 text-sm mb-4 hover:underline"
          >
            ← Back to Job Page
          </button>

          {/* TITLE */}
          <h2 className="text-2xl font-semibold mb-6">
            Apply for this job
          </h2>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Your Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Your Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Experience *</label>
              <input
                type="number"
                name="experience"
                placeholder="Enter Experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Expected CTC *</label>
              <input
                type="number"
                name="expectedSalary"
                placeholder="Enter Expected CTC"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notice Period *</label>
              <input
                type="number"
                name="noticePeriod"
                placeholder="Enter Notice Period"
                value={formData.noticePeriod}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 text-sm"
                required
              />
            </div>
          </div>

          {/* RESUME UPLOAD */}
          <label className="mt-5 border border-dashed rounded-md p-4 text-center block cursor-pointer hover:bg-gray-50">

            <p className="text-sm font-medium mb-1">
              Upload Resume *
            </p>

            <p className="text-sm text-gray-500 mb-2">
              Max file size 50kb (.pdf, .doc, .docx)
            </p>

            {/* File Status */}
            {formData.resume ? (
              <div className="mt-3 text-green-600 text-sm font-medium">
                ✅ {formData.resume.name}
              </div>
            ) : (
              <div className="mt-3 text-gray-400 text-xs">
                No file selected
              </div>
            )}

            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              ref={resumeRef}
              className="hidden"
              required
            />
          </label>

          {/* CHECKBOX */}
          <div className="flex items-start gap-2 mt-4 text-xs">
            <input type="checkbox" required />
            <p>
              I accept the privacy policy and data processing terms.
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Apply Now
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}