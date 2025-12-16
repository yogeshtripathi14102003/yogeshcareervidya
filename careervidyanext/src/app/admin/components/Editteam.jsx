"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js";

// 🎨 Reusable input style for consistency
const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

export default function EditTeamMember({ member, onEditSuccess }) {
  const [formData, setFormData] = useState({
    name: member.name || "",
    designation: member.designation || "",
    description: member.description || "",
    experience: member.experience?.toString() || "", // Convert number to string
    
    // --- NEW FIELDS from Mongoose Model ---
    expertise: member.expertise || "",      // Required
    location: member.location || "",        // Required (formerly 'state' in previous FE, but 'location' in model)
    fee: member.fee?.toString() || "",      // Optional (Convert number to string)
    education: member.education || "",      // Optional
    mobileNumber: member.mobileNumber || "",// Required (Unique)
    // --- END NEW FIELDS ---
    
    image: null, // New file object
  });
  const [preview, setPreview] = useState(member.image || null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  // Update formData if member prop changes (for when the component is reused)
  useEffect(() => {
    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      description: member.description || "",
      experience: member.experience?.toString() || "",
      
      // Initialize new fields
      expertise: member.expertise || "",
      location: member.location || "",
      fee: member.fee?.toString() || "",
      education: member.education || "",
      mobileNumber: member.mobileNumber || "",
      
      image: null,
    });
    setPreview(member.image || null);
    setError("");
    setLoading(false);
  }, [member]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setError(""); // Clear error on new input

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(file ? URL.createObjectURL(file) : member.image || null);
    } else if (name === "experience" || name === "fee") {
      // Allow only non-negative numbers for Experience and Fee
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        setError(`${name} must be a non-negative number.`);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate all REQUIRED fields (Name, Designation, Experience, Expertise, Location, Mobile Number)
    if (
      !formData.name ||
      !formData.designation ||
      !formData.experience ||
      !formData.expertise ||
      !formData.location ||
      !formData.mobileNumber
    ) {
      setError("Please fill all required fields: Name, Designation, Experience, Expertise, Location, and Mobile Number.");
      setLoading(false);
      return;
    }

    const experienceNum = formData.experience ? Number(formData.experience) : null;
    const feeNum = formData.fee ? Number(formData.fee) : null; // Get numeric fee

    // Validate numeric fields
    if (experienceNum === null || experienceNum < 0) {
      setError("Experience must be a non-negative number.");
      setLoading(false);
      return;
    }
    if (formData.fee !== "" && (feeNum === null || feeNum < 0)) {
       setError("Fee must be a non-negative number.");
       setLoading(false);
       return;
    }


    const data = new FormData();
    // Required base fields
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("experience", experienceNum);

    // Conditionally appended base fields (Optional/Defaults)
    data.append("description", formData.description || ""); // Description is optional
    if (formData.image) data.append("image", formData.image);

    // --- Append NEW/UPDATED Fields ---
    data.append("expertise", formData.expertise); // Required
    data.append("location", formData.location);   // Required
    data.append("mobileNumber", formData.mobileNumber); // Required
    data.append("fee", feeNum || 0);               // Optional (defaults to 0)
    data.append("education", formData.education || "Not Specified"); // Optional (defaults to "Not Specified")

    try {
      await api.put(`/api/v1/team/${member._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("✅ Team member updated successfully!");
      
      // Reset state based on the *updated* member data (or refetch if necessary)
      // For now, we rely on onEditSuccess to trigger a parent refresh, and reset local form data
      
      setShowModal(false);
      if (onEditSuccess) onEditSuccess();

    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      console.error("Error updating team member:", err.response?.data || err);
       if (serverMessage.includes('duplicate key error') && serverMessage.includes('mobileNumber')) {
        setError("Error: The provided Mobile Number already exists. It must be unique.");
      } else {
        setError(`Error updating team member: ${serverMessage}`);
      }
    } finally {
        setLoading(false);
    }
  };

  // Function to reset the form state to the member's original data
  const resetFormState = () => {
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
        image: null,
    });
    setPreview(member.image || null);
    setError("");
    setShowModal(false);
  }

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
          fontWeight: 'bold',
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
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              width: "400px", // Adjusted width for more fields
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <h5 style={{ fontSize: '1.2rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Edit **{member.name}**'s Details
            </h5>
            
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
                placeholder="Expertise *"
                value={formData.expertise}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              
              {/* Location (NEW & REQUIRED) */}
              <input
                type="text"
                name="location"
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

              {/* Mobile Number (NEW & REQUIRED) */}
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number (Unique) *"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Fee (NEW & Optional) */}
              <input
                type="number"
                name="fee"
                placeholder="Session Fee (Optional)"
                value={formData.fee}
                onChange={handleChange}
                min="0"
                style={inputStyle}
              />

              {/* Education (NEW & Optional) */}
              <input
                type="text"
                name="education"
                placeholder="Education/Qualification (Optional)"
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

              {/* Image Input (Optional) */}
              <label style={{ display: 'block', fontSize: '14px', color: '#333', marginBottom: '5px', fontWeight: '500' }}>
                Update Profile Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{...inputStyle, border: 'none', padding: '0 0 10px 0'}}
              />
              
              {/* Image Preview */}
              {preview && (
                <div style={{ marginBottom: "15px", textAlign: 'center' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        width={80}
                        height={80}
                        style={{
                            borderRadius: "50%",
                            border: "2px solid #3b5998",
                            objectFit: 'cover'
                        }}
                    />
                    <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>Current/New Image</p>
                </div>
              )}
              
              {/* Error */}
              {error && <p style={{ color: "#d9534f", marginBottom: "10px", fontSize: '14px', padding: '8px', backgroundColor: '#f9eaea', borderRadius: '4px' }}>❌ {error}</p>}
              
              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={resetFormState} // Use reset function
                  disabled={loading}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#f0ad4e",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
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
                    fontWeight: 'bold',
                    marginLeft: '10px'
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}