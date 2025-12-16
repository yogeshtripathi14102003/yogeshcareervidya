"use client";

import { useState } from "react";
// Ensure this path is correct:
import api from "@/utlis/api.js"; 

// 🎨 Reusable input style (unchanged)
const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px", // Increased padding slightly for better look
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: 'border-box', // Added for consistent sizing
};

export default function AddTeamMember({ onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    description: "",
    experience: "",
    image: null,
    // --- UPDATED FIELDS FOR NEW MODEL ---
    expertise: "",      // ✅ New REQUIRED field
    location: "",       // ✅ Renamed from 'state' to 'location'
    fee: "",            // Optional
    education: "",      // Optional
    mobileNumber: "",   // Required
  });
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else if (name === "experience" || name === "fee") {
      // Allow only non-negative numbers for Experience and Fee
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        setError("");
      } else {
        // Updated error message to be more descriptive
        setError(`Input for ${name} must be a valid number.`);
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
      // Validation - Check all REQUIRED fields: name, designation, experience, mobileNumber, expertise, location (and image file)
      if (
        !formData.name ||
        !formData.designation ||
        !formData.experience ||
        !formData.mobileNumber || 
        !formData.expertise ||  // ✅ Check new REQUIRED field
        !formData.location ||   // ✅ Check new REQUIRED field (location)
        !formData.image         // Image file is required for upload
      ) {
        setError("Please fill all required fields: Name, Designation, Experience, Mobile Number, Expertise, Location, and upload an image.");
        setLoading(false);
        return;
      }

      // Check for numeric experience
      if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
        setError("Experience must be a non-negative number.");
        setLoading(false);
        return;
      }
      
      // Check for numeric fee if provided
      if (formData.fee !== "" && (isNaN(Number(formData.fee)) || Number(formData.fee) < 0)) {
        setError("Fee must be a non-negative number.");
        setLoading(false);
        return;
      }
      
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("description", formData.description);
      data.append("experience", formData.experience);
      data.append("image", formData.image);
      
      // --- Append New/Renamed Fields ---
      data.append("expertise", formData.expertise);  // ✅ Appended new REQUIRED field
      data.append("location", formData.location);    // ✅ Appended renamed field
      data.append("fee", formData.fee || 0);         
      data.append("education", formData.education || "Not Specified");
      data.append("mobileNumber", formData.mobileNumber); 
      
      // Post request to the API
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
        expertise: "",
        location: "",
        fee: "", 
        education: "",
        mobileNumber: "",
      });
      setPreview(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      const serverMessage = err.response?.data?.message || err.message;
      // Handle unique mobile number constraint error specifically
      if (serverMessage.includes('duplicate key error') && serverMessage.includes('mobileNumber')) {
        setError("Error: The provided Mobile Number already exists. It must be unique.");
      } else {
        setError(serverMessage || "Error adding team member.");
      }
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
      expertise: "",
      location: "",
      fee: "", 
      education: "",
      mobileNumber: "",
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
          padding: "8px 18px", // Slightly increased padding
          border: "none",
          borderRadius: "6px", // Slightly increased border radius
          cursor: "pointer",
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
        }}
      >
        ➕ Add New Member
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
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "400px", // Increased width for better form layout
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              position: "relative",
            }}
          >
            <h3 style={{ marginBottom: "15px", fontSize: '1.25rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Add New Team Member
            </h3>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
              {/* Name (Required) */}
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Designation (Required) */}
              <input
                type="text"
                name="designation"
                placeholder="Designation *"
                value={formData.designation}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              
              {/* Expertise (NEW & REQUIRED) */}
              <input
                type="text"
                name="expertise"
                placeholder="Expertise (e.g., Career Counselor) *"
                value={formData.expertise}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Location (NEW & REQUIRED) */}
              <input
                type="text"
                name="location" // ✅ CORRECTED FIELD NAME
                placeholder="Location (State/City) *"
                value={formData.location}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Experience (Required) */}
              <input
                type="number"
                name="experience"
                placeholder="Experience (in years) *"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                style={inputStyle}
              />

              {/* Mobile Number (REQUIRED) */}
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number (Unique) *"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Fee (Optional) */}
              <input
                type="number"
                name="fee"
                placeholder="Session Fee (Optional)"
                value={formData.fee}
                onChange={handleChange}
                min="0"
                style={inputStyle}
              />

              {/* Education (Optional) */}
              <input
                type="text"
                name="education"
                placeholder="Highest Education/Qualification (Optional)"
                value={formData.education}
                onChange={handleChange}
                style={inputStyle}
              />

              {/* Description (Optional) */}
              <textarea
                name="description"
                placeholder="Description/Bio (Optional)"
                value={formData.description}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  height: "80px",
                  resize: "vertical",
                }}
              />
              
              {/* Image (Required) */}
              <label style={{ display: 'block', fontSize: '14px', color: '#333', marginBottom: '5px', fontWeight: '500' }}>
                Profile Image *
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!preview} // Require only if no image is currently set (better for an edit form, for new form, always required)
                style={{...inputStyle, border: 'none', padding: '0 0 10px 0'}}
              />

              {/* Image Preview */}
              {preview && (
                <div style={{ marginBottom: "10px", textAlign: 'center' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        width={100}
                        height={100}
                        style={{
                            borderRadius: "50%",
                            border: "2px solid #3b5998",
                            objectFit: 'cover'
                        }}
                    />
                </div>
              )}

              {/* Error */}
              {error && (
                <p style={{ color: "#d9534f", fontSize: "14px", marginBottom: "15px", padding: '8px', backgroundColor: '#f9eaea', borderRadius: '4px' }}>
                  ❌ {error}
                </p>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    backgroundColor: "#f0ad4e",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "4px",
                    marginRight: "10px",
                    cursor: "pointer",
                    transition: 'background-color 0.2s',
                    fontWeight: 'bold',
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
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: 'background-color 0.2s',
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}