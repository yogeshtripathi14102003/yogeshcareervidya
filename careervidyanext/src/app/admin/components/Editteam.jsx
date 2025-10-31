"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js";

export default function EditTeamMember({ member, onEditSuccess }) {
  const [formData, setFormData] = useState({
    name: member.name || "",
    designation: member.designation || "",
    description: member.description || "",
    experience: member.experience?.toString() || "", // Convert number to string for input
    image: null,
  });
  const [preview, setPreview] = useState(member.image || null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Update formData if member prop changes
  useEffect(() => {
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      description: member.description || "",
      experience: member.experience?.toString() || "",
      image: null,
    });
    setPreview(member.image || null);
  }, [member]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(file ? URL.createObjectURL(file) : member.image || null);
    } else {
      if (name === "experience") {
        if (value === "" || /^[0-9]*$/.test(value)) {
          setFormData({ ...formData, [name]: value });
          setError("");
        } else {
          setError("Experience must be a non-negative number");
        }
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.name || !formData.designation || !formData.description) {
      setError("All fields except image are required");
      return;
    }

    // Validate experience
    const experienceNum = formData.experience ? Number(formData.experience) : null;
    if (formData.experience === "" || experienceNum < 0) {
      setError("Experience must be a non-negative number");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("description", formData.description);
    data.append("experience", experienceNum);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await api.put(`/api/v1/team/${member._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Update response:", response.data);
      alert("Team member updated successfully!");
      setFormData({
        name: member.name || "",
        designation: member.designation || "",
        description: member.description || "",
        experience: member.experience?.toString() || "",
        image: null,
      });
      setPreview(member.image || null);
      setShowModal(false);
      if (onEditSuccess) onEditSuccess();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error occurred";
      console.error("Error updating team member:", err.response?.data || err);
      setError(`Error updating team member: ${errorMessage}`);
    }
  };

  return (
    <div style={{ display: "inline" }}>
      {/* Edit Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "#0da3ccff",
          color: "white",
          padding: "5px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          margin: "5px",
        }}
      >
        Edit 
      </button>

      {/* Edit Modal */}
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "350px",
              border: "2px solid #ccc",
            }}
          >
            <h5>Edit {member.name}'s Details</h5>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <input
                type="number"
                name="experience"
                placeholder="Experience (in years)"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  width={50}
                  style={{ marginBottom: "10px" }}
                />
              )}
              {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
              <button
                type="submit"
                style={{
                  backgroundColor: "#3b5998",
                  color: "white",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setFormData({
                    name: member.name || "",
                    designation: member.designation || "",
                    description: member.description || "",
                    experience: member.experience?.toString() || "",
                    image: null,
                  });
                  setPreview(member.image || null);
                  setError("");
                }}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#ccc",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}