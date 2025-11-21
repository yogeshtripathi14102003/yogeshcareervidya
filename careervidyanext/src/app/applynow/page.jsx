"use client";

import React, { useState, useRef } from "react";
import api from "@/utlis/api.js";

export default function ApplyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expectedSalary: "",
    experience: "",
    noticePeriod: "",
    resume: null,
    additionalDocument: null,
  });

  const resumeRef = useRef();
  const additionalRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      // ⭐ Correct API endpoint
      const res = await api.post("/api/v1/resume", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Application submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        expectedSalary: "",
        experience: "",
        noticePeriod: "",
        resume: null,
        additionalDocument: null,
      });

      resumeRef.current.value = "";
      additionalRef.current.value = "";

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit application.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-6 w-full md:max-w-[60vw] sm:max-w-[90vw]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Apply Now
        </h2>

        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "text" },
          { label: "Expected Salary (LPA)", name: "expectedSalary", type: "number" },
          { label: "Experience (Years)", name: "experience", type: "number" },
          { label: "Notice Period (Days)", name: "noticePeriod", type: "number" },
        ].map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block mb-1 text-gray-700">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Upload Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            ref={resumeRef}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Additional Document (Optional)</label>
          <input
            type="file"
            name="additionalDocument"
            accept="application/pdf"
            onChange={handleChange}
            ref={additionalRef}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold mt-4"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
