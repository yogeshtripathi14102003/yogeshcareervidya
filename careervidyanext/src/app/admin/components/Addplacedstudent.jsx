"use client";
import { useState } from "react";
import api from "@/utlis/api";

export default function AddStudent({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    image: null,
    companyLogo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("company", formData.company);
      if (formData.image) data.append("image", formData.image);
      if (formData.companyLogo) data.append("companyLogo", formData.companyLogo);

      const res = await api.post("/api/v1/ourstudent", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onStudentAdded(res.data.data);
        setFormData({ name: "", company: "", image: null, companyLogo: null });
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2">Add New Student</h2>
      {error && <p className="text-red-500">{error}</p>}

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

      <div>
        <label className="block font-medium">Student Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Company Logo</label>
        <input
          type="file"
          name="companyLogo"
          accept="image/*"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Add Student"}
      </button>
    </form>
  );
}
