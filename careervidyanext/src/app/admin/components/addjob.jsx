

"use client";

import React, { useState, useEffect } from "react";

export default function Addjob({ onAdd, onEdit, initialData, onClose }) {
  const [formData, setFormData] = useState({
    jobId: initialData?.jobId || null,
    title: initialData?.title || "",
    description: initialData?.description || "",
    salaryRange: initialData?.salaryRange || "",
    requirements: initialData?.requirements || [],
    hrEmail: initialData?.hrEmail || "",
    position: initialData?.position || "",
    location: initialData?.location || "",
    department: initialData?.department || "",
    experience: initialData?.experience || "",  // ✅ Added new field
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
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {formData.jobId ? "Edit Job Post" : "Add Job Post"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">

          {/* Job Title */}
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Position */}
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Department */}
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* HR Email */}
          <input
            type="email"
            name="hrEmail"
            placeholder="HR Email"
            value={formData.hrEmail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Experience – NEW FIELD */}
          <input
            type="text"
            name="experience"
            placeholder="Experience (e.g. 1-2 years)"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Salary */}
          <input
            type="number"
            name="salaryRange"
            placeholder="Salary Range (CTC)"
            value={formData.salaryRange}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Requirements */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add requirement"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>

            <ul className="mt-2">
              {formData.requirements.map((req, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-gray-100 p-2 rounded mt-1"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {formData.jobId ? "Update" : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
