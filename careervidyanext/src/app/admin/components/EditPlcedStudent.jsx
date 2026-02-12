"use client";
import { useState, useEffect } from "react";
import api from "@/utlis/api";

export default function EditStudent({ student, onStudentUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    image: null,
    companyLogo: null,
  });

  const [preview, setPreview] = useState({
    image: "",
    companyLogo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preload existing student data
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        company: student.company || "",
        image: null,
        companyLogo: null,
      });
      setPreview({
        image: student.image || "",
        companyLogo: student.companyLogo || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreview({ ...preview, [name]: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("company", formData.company);
      if (formData.image) data.append("image", formData.image);
      if (formData.companyLogo) data.append("companyLogo", formData.companyLogo);

      const res = await api.put(`/api/v1/ourstudent/${student._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onStudentUpdated(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2">Edit Student</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Name Field */}
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Company Field */}
      <div>
        <label className="block font-medium">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Student Image */}
      <div>
        <label className="block font-medium">Student Image</label>
        {preview.image && (
          <img
            src={preview.image}
            alt="Student"
            className="w-20 h-20 rounded-full mb-2 object-cover"
          />
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Company Logo */}
      <div>
        <label className="block font-medium">Company Logo</label>
        {preview.companyLogo && (
          <img
            src={preview.companyLogo}
            alt="Company Logo"
            className="w-20 h-20 rounded mb-2 object-cover"
          />
        )}
        <input
          type="file"
          name="companyLogo"
          accept="image/*"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Student"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
