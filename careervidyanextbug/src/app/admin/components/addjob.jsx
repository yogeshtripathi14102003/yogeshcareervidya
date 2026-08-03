"use client";

import React, { useState } from "react";

export default function Addjob({ onAdd, onEdit, initialData, onClose }) {
  // Model ke enum values yahan define kar di takki dropdown ban sake
  const departments = [
    "Counselor",
    "Human Resource",
    "Assistant Manager",
    "Software Development",
    "Sales & Growth",
    "Frontend Development",
    "Backend Development",
    "DevOps",
    "Management",
    "Finance & Accounts",
    "Digital Marketing",
    "Software Testing",
    "IT Support",
  ];

  const [formData, setFormData] = useState({
    jobId: initialData?.jobId || null,
    title: initialData?.title || "",
    description: initialData?.description || "",
    salaryRange: initialData?.salaryRange || "",
    requirements: initialData?.requirements || [],
    hrEmail: initialData?.hrEmail || "",
    position: initialData?.position || "",
    location: initialData?.location || "",
    department: initialData?.department || "", // Will be controlled by select
    experience: initialData?.experience || "",
  });

  const [requirementInput, setRequirementInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = () => {
    if (!requirementInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, requirementInput],
    }));
    setRequirementInput("");
  };

  const handleRemoveRequirement = (i) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, index) => index !== i),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.jobId) {
      await onEdit(formData.jobId, formData);
    } else {
      await onAdd(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          {formData.jobId ? "Edit Job Post" : "Add Job Post"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <input
            type="text"
            name="position"
            placeholder="Position (e.g. Senior Associate)"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          {/* --- FIXED DEPARTMENT SELECT --- */}
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          >
            <option value="" disabled>Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <input
            type="email"
            name="hrEmail"
            placeholder="HR Email"
            value={formData.hrEmail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience (e.g. 1-2 years)"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          <input
            type="number"
            name="salaryRange"
            placeholder="Salary Range (CTC in Numbers)"
            value={formData.salaryRange}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />

          {/* Requirements Section */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add requirement"
                className="w-full p-2 border rounded outline-none"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {formData.requirements.map((req, i) => (
                <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded text-sm">
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(i)}
                    className="text-red-500 font-bold ml-2"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow-md transition"
            >
              {formData.jobId ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}