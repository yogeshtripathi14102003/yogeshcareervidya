"use client";

import { useState } from "react";
import  api from "@/utlis/api.js"; // ✅ your axios instance with baseURL

export default function AddTeamMember({ onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    description: "",
    experience: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  // 🧩 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else if (name === "experience") {
      // Allow only numbers
      if (value === "" || /^[0-9]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        setError("");
      } else {
        setError("Experience must be a number");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (
        !formData.name ||
        !formData.designation ||
        !formData.description ||
        !formData.experience ||
        !formData.image
      ) {
        setError("Please fill all fields and upload an image.");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("description", formData.description);
      data.append("experience", formData.experience);
      data.append("image", formData.image);

      // ✅ FIXED: correct backend route
      await api.post("/api/v1/team", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Team member added successfully!");
      if (onAddSuccess) onAddSuccess();

      // Reset
      setFormData({
        name: "",
        designation: "",
        description: "",
        experience: "",
        image: null,
      });
      setPreview(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error adding team member");
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Reset modal
  const handleCancel = () => {
    setShowModal(false);
    setFormData({
      name: "",
      designation: "",
      description: "",
      experience: "",
      image: null,
    });
    setPreview(null);
    setError("");
  };

  return (
    <div>
      {/* Open Modal Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "#3b5998",
          color: "white",
          padding: "5px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Member
      </button>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "320px",
              border: "2px solid #ccc",
              position: "relative",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Add New Member</h3>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Designation */}
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Description */}
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  height: "70px",
                  resize: "none",
                }}
              />

              {/* Experience */}
              <input
                type="number"
                name="experience"
                placeholder="Experience (in years)"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                style={inputStyle}
              />

              {/* Image */}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Image Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  width={80}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
              )}

              {/* Error */}
              {error && (
                <p style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}>
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#ccc",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#999" : "#3b5998",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 Reusable input style
const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "6px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
