"use client";

import { useState } from "react";
import api from "@/utlis/api.js";

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

export default function AddTeamMember({ onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    description: "",
    experience: "",
    image: null,
    expertise: "",
    location: "",
    fee: "",
    education: "",
    mobileNumber: "",
    highlights: [""],
    languages: [""],
  });

  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeField = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Validate required fields
    const requiredFields = [
      "name",
      "designation",
      "experience",
      "expertise",
      "location",
      "mobileNumber",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill ${field}`);
        setLoading(false);
        return;
      }
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("description", formData.description);
      data.append("experience", Number(formData.experience));
      if (formData.image) data.append("image", formData.image);
      data.append("expertise", formData.expertise);
      data.append("location", formData.location);
      data.append("fee", formData.fee ? Number(formData.fee) : 0);
      data.append("education", formData.education || "Not Specified");
      data.append("mobileNumber", formData.mobileNumber);

      // 🔹 Highlights & Languages
      data.append(
        "highlights",
        JSON.stringify(formData.highlights.filter((h) => h.trim() !== ""))
      );
      data.append(
        "languages",
        JSON.stringify(formData.languages.filter((l) => l.trim() !== ""))
      );

      await api.post("/api/v1/team", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Team member added successfully!");
      if (onAddSuccess) onAddSuccess();

      setFormData({
        name: "",
        designation: "",
        description: "",
        experience: "",
        image: null,
        expertise: "",
        location: "",
        fee: "",
        education: "",
        mobileNumber: "",
        highlights: [""],
        languages: [""],
      });
      setPreview(null);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setError("");
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "#3b5998",
          color: "white",
          padding: "8px 18px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ➕ Add New Member
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "420px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3>Add New Team Member</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Name *"
                onChange={handleChange}
                value={formData.name}
                style={inputStyle}
              />
              <input
                name="designation"
                placeholder="Designation *"
                onChange={handleChange}
                value={formData.designation}
                style={inputStyle}
              />
              <input
                name="expertise"
                placeholder="Expertise *"
                onChange={handleChange}
                value={formData.expertise}
                style={inputStyle}
              />
              <input
                name="location"
                placeholder="Location *"
                onChange={handleChange}
                value={formData.location}
                style={inputStyle}
              />
              <input
                name="experience"
                placeholder="Experience *"
                onChange={handleChange}
                value={formData.experience}
                style={inputStyle}
              />
              <input
                name="mobileNumber"
                placeholder="Mobile Number *"
                onChange={handleChange}
                value={formData.mobileNumber}
                style={inputStyle}
              />
              <input
                name="fee"
                placeholder="Fee"
                onChange={handleChange}
                value={formData.fee}
                style={inputStyle}
              />
              <input
                name="education"
                placeholder="Education"
                onChange={handleChange}
                value={formData.education}
                style={inputStyle}
              />
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={formData.description}
                style={inputStyle}
              />

              {/* 🔹 Highlights */}
              <h4>Highlights</h4>
              {formData.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: "5px" }}>
                  <input
                    value={h}
                    onChange={(e) =>
                      handleArrayChange("highlights", i, e.target.value)
                    }
                    placeholder={`Highlight ${i + 1}`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeField("highlights", i)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addField("highlights")}>
                ➕ Add Highlight
              </button>

              {/* 🔹 Languages */}
              <h4 style={{ marginTop: "10px" }}>Languages</h4>
              {formData.languages.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: "5px" }}>
                  <input
                    value={l}
                    onChange={(e) =>
                      handleArrayChange("languages", i, e.target.value)
                    }
                    placeholder={`Language ${i + 1}`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeField("languages", i)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addField("languages")}>
                ➕ Add Language
              </button>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={inputStyle}
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  width={80}
                  height={80}
                  style={{ borderRadius: "50%" }}
                />
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
