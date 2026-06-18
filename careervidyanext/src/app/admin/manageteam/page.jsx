"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js"; // ✅ पाथ सही है

const TeamManagement = () => {
  const [teamList, setTeamList] = useState([]);
  const [formData, setFormData] = useState({ name: "", designation: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null); 
  const [loading, setLoading] = useState(false);

  const API_ROUTE = "/api/v1/manage";

  // 1. GET ALL: डेटा लोड करना
  const fetchTeam = async () => {
    try {
      const response = await api.get(`${API_ROUTE}/`);
      const incomingData = response.data;

      if (Array.isArray(incomingData)) {
        setTeamList(incomingData);
      } else if (incomingData && Array.isArray(incomingData.data)) {
        setTeamList(incomingData.data);
      } else if (incomingData && typeof incomingData === 'object') {
        const possibleArray = Object.values(incomingData).find(val => Array.isArray(val));
        setTeamList(possibleArray || []);
      } else {
        setTeamList([]);
      }
    } catch (error) {
      console.error("Error fetching data :", error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // 2. POST & PUT: सबमिट हैंडलर
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("description", formData.description);
    
    if (imageFile) {
      data.append("image", imageFile); 
    }

    try {
      if (editId) {
        await api.put(`${API_ROUTE}/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Team member updated successfully 🎉");
      } else {
        await api.post(`${API_ROUTE}/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("New team member added successfully 🎉");
      }
      
      resetForm();
      fetchTeam();
    } catch (error) {
      console.error("Operation Error :", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (member) => {
    setEditId(member._id);
    setFormData({
      name: member.name,
      designation: member.designation,
      description: member.description || "",
    });
    // फॉर्म की तरफ स्मूथली स्क्रॉल करने के लिए
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. DELETE: डिलीट ऑपरेशन
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await api.delete(`${API_ROUTE}/${id}`);
        alert("Team member deleted successfully.");
        fetchTeam();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Can't delete team member");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", designation: "", description: "" });
    setImageFile(null);
    setEditId(null);
    const fileInput = document.getElementById("imageInput");
    if (fileInput) fileInput.value = "";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, "/");
    return `https://api.careervidya.in/${cleanPath}`;
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1050px", margin: "0 auto", fontFamily: "'Inter', system-ui, sans-serif", color: "#333", backgroundColor: "#fcfcfd" }}>
      
      {/* मुख्य हेडिंग */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>Team Workspace</h1>
        <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Manage your high-performing team members and roles effortlessly.</p>
      </div>
      
      {/* फॉर्म सेक्शन */}
      <div style={{ background: "#ffffff", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6", marginBottom: "50px" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "18px", background: editId ? "#3b82f6" : "#10b981", borderRadius: "4px" }}></span>
          {editId ? "Update Team Member Details" : "Add New Team Member"}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ gridColumn: "span 1" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. John Doe" style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.95rem", outline: "none", transition: "all 0.2s" }} />
          </div>
          
          <div style={{ gridColumn: "span 1" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required placeholder="e.g. Senior Frontend Engineer" style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.95rem", outline: "none" }} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>Profile Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Briefly describe their role or responsibilities..." style={{ width: "100%", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.95rem", outline: "none", resize: "vertical" }} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>Profile Image</label>
            <div style={{ border: "2px dashed #e5e7eb", padding: "15px", borderRadius: "8px", textAlign: "center", background: "#fafafa" }}>
              <input id="imageInput" type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: "0.9rem", color: "#6b7280" }} />
            </div>
          </div>

          <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "10px" }}>
            <button type="submit" disabled={loading} style={{ padding: "12px 28px", background: editId ? "#3b82f6" : "#10b981", color: "white", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", transition: "opacity 0.2s" }}>
              {loading ? "Processing..." : editId ? "Save Changes" : "Add Member"}
            </button>
            
            {editId && (
              <button type="button" onClick={resetForm} style={{ padding: "12px 24px", background: "#f3f4f6", color: "#4b5563", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* टीम लिस्टिंग सेक्शन */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "2px solid #f3f4f6", paddingBottom: "15px" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#111827" }}>Active Members ({teamList.length})</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {!Array.isArray(teamList) || teamList.length === 0 ? (
          <div style={{ gridColumn: "span 3", textAlign: "center", padding: "40px", background: "#f9fafb", borderRadius: "12px", border: "1px dashed #e5e7eb", color: "#9ca3af" }}>
            No team members found. Add some using the form above!
          </div>
        ) : (
          teamList.map((member) => {
            const imgUrl = getImageUrl(member.image);
            return (
              <div key={member._id} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "24px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", flexDirection: "column", justifyContent: "between", transition: "transform 0.2s, boxShadow 0.2s" }}>
                
                {/* इमेज कंटेनर */}
                <div style={{ position: "relative", display: "inline-block", margin: "0 auto 16px auto" }}>
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt={member.name} 
                      onError={(e) => { e.target.src = "https://placehold.co/120x120?text=No+User"; }}
                      style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "4px solid #f3f4f6" }} 
                    />
                  ) : (
                    <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "#f3f4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: "#9ca3af", fontWeight: "500", border: "4px solid #e5e7eb" }}>No Image</div>
                  )}
                </div>

                {/* टेक्स्ट इंफो */}
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>{member.name}</h3>
                  <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>{member.designation}</p>
                  <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: "1.5", margin: "0 0 20px 0", minHeight: "45px" }}>{member.description || "No description provided."}</p>
                </div>
                
                {/* एक्शन बटन्स */}
                <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #f3f4f6", paddingTop: "15px" }}>
                  <button onClick={() => handleEditClick(member)} style={{ flex: 1, background: "#eff6ff", color: "#2563eb", border: "none", padding: "8px 12px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}>
                    Edit Details
                  </button>
                  <button onClick={() => handleDeleteClick(member._id)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", padding: "8px 14px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamManagement;