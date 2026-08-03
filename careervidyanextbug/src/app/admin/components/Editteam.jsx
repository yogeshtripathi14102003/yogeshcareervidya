"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js";

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const primaryButton = {
  ...buttonStyle,
  backgroundColor: "#0da3cc",
  color: "#fff",
};

const secondaryButton = {
  ...buttonStyle,
  backgroundColor: "#ccc",
  color: "#000",
};

export default function EditTeamMember({ member, onEditSuccess }) {
  const [formData, setFormData] = useState({
    name: member.name || "",
    designation: member.designation || "",
    description: member.description || "",
    experience: member.experience?.toString() || "",
    expertise: member.expertise || "",
    location: member.location || "",
    fee: member.fee?.toString() || "",
    education: member.education || "",
    mobileNumber: member.mobileNumber || "",
    highlights: member.highlights || [],
    languages: member.languages || [],
    image: null,
  });

  const [preview, setPreview] = useState(member.image || null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      description: member.description || "",
      experience: member.experience?.toString() || "",
      expertise: member.expertise || "",
      location: member.location || "",
      fee: member.fee?.toString() || "",
      education: member.education || "",
      mobileNumber: member.mobileNumber || "",
      highlights: member.highlights || [],
      languages: member.languages || [],
      image: null,
    });
    setPreview(member.image || null);
  }, [member]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setError("");

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(file ? URL.createObjectURL(file) : preview);
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
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("description", formData.description);
      data.append("experience", formData.experience);
      data.append("expertise", formData.expertise);
      data.append("location", formData.location);
      data.append("mobileNumber", formData.mobileNumber);
      data.append("fee", formData.fee || 0);
      data.append("education", formData.education || "");
      data.append("highlights", JSON.stringify(formData.highlights.filter(Boolean)));
      data.append("languages", JSON.stringify(formData.languages.filter(Boolean)));

      if (formData.image) data.append("image", formData.image);

      await api.put(`/api/v1/team/${member._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Team member updated successfully");
      setShowModal(false);
      onEditSuccess && onEditSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Edit Button */}
      <button onClick={() => setShowModal(true)} style={primaryButton}>
        Edit
      </button>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "8px",
              width: "420px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3>Edit {member.name}</h3>

            <form onSubmit={handleSubmit}>
              <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
              <input name="designation" value={formData.designation} onChange={handleChange} style={inputStyle} />
              <input name="expertise" value={formData.expertise} onChange={handleChange} style={inputStyle} />
              <input name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
              <input name="experience" value={formData.experience} onChange={handleChange} style={inputStyle} />
              <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} style={inputStyle} />
              <input name="fee" value={formData.fee} onChange={handleChange} style={inputStyle} />
              <input name="education" value={formData.education} onChange={handleChange} style={inputStyle} />
              <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: 80 }} />

              {/* Highlights */}
              <h4>Highlights</h4>
              {formData.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 5 }}>
                  <input value={h} onChange={(e) => handleArrayChange("highlights", i, e.target.value)} style={inputStyle} />
                  <button type="button" onClick={() => removeField("highlights", i)} style={secondaryButton}>❌</button>
                </div>
              ))}
              <button type="button" onClick={() => addField("highlights")} style={primaryButton}>➕ Add Highlight</button>

              {/* Languages */}
              <h4 style={{ marginTop: 10 }}>Languages</h4>
              {formData.languages.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 5 }}>
                  <input value={l} onChange={(e) => handleArrayChange("languages", i, e.target.value)} style={inputStyle} />
                  <button type="button" onClick={() => removeField("languages", i)} style={secondaryButton}>❌</button>
                </div>
              ))}
              <button type="button" onClick={() => addField("languages")} style={primaryButton}>➕ Add Language</button>

              <input type="file" name="image" onChange={handleChange} style={{ marginTop: 10 }} />

              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 15 }}>
                <button type="button" onClick={() => setShowModal(false)} style={secondaryButton}>Cancel</button>
                <button type="submit" style={primaryButton} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
