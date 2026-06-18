"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";

const TeamHomePage = () => {
  const [teamList, setTeamList] = useState([]);
  const API_ROUTE = "/api/v1/manage";

  // Fetch team data on component mount
  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Error fetching team data for homepage:", error);
      }
    };

    fetchTeam();
  }, []);

  // Format image path safely
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, "/");
    return `https://api.careervidya.in/${cleanPath}`;
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#111827", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ padding: "90px 20px", textAlign: "center", background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)", color: "#ffffff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
            Our Team
          </span>
          <h1 style={{ fontSize: "3.2rem", fontWeight: "800", marginTop: "20px", marginBottom: "20px", lineHeight: "1.2", letterSpacing: "-0.02em" }}>
            Meet the Experts Behind Our Vision
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#94a3b8", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto" }}>
            We are a group of passionate innovators, dedicated to delivering the highest quality experiences and driving success.
          </p>
        </div>
      </section>

      {/* 2. TEAM GRID SECTION */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px" }}>
        
        {teamList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <p style={{ fontSize: "1.1rem" }}>Loading team ecosystem...</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "40px" }}>
            {teamList.map((member) => {
              const imgUrl = getImageUrl(member.image);
              
              return (
                <div 
                  key={member._id} 
                  style={{ 
                    background: "#ffffff", 
                    borderRadius: "20px", 
                    overflow: "hidden", 
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.03)", 
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                  }}
                >
                  {/* Decorative Banner Background */}
                  <div style={{ height: "120px", background: "linear-gradient(45deg, #3b82f6, #2563eb)", position: "relative" }}></div>
                  
                  {/* Enlarged Profile Image Wrapper */}
                  <div style={{ marginTop: "-65px", position: "relative", zIndex: "2", display: "flex", justifyContent: "center" }}>
                    {imgUrl ? (
                      <img 
                        src={imgUrl} 
                        alt={member.name} 
                        onError={(e) => { e.target.src = "https://placehold.co/150x150?text=No+Photo"; }}
                        style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "6px solid #ffffff", boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }} 
                      />
                    ) : (
                      <div style={{ width: "130px", height: "130px", borderRadius: "50%", background: "#f3f4f6", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#9ca3af", fontWeight: "600", border: "6px solid #ffffff", boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}>
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Profile Details Body */}
                  <div style={{ padding: "28px 24px", flexGrow: 1 }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#111827", margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>
                      {member.name}
                    </h3>
                    
                    <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px 0" }}>
                      {member.designation}
                    </p>
                    
                    <p style={{ fontSize: "0.95rem", color: "#4b5563", lineHeight: "1.6", margin: "0" }}>
                      {member.description || "No description provided."}
                    </p>
                  </div>

                  {/* Clean Professional Footer */}
                  <div style={{ padding: "18px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "center", gap: "20px" }}>
                    <a href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}>LinkedIn</a>
                    <span style={{ color: "#cbd5e1" }}>|</span>
                    <a href="#" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem", fontWeight: "500" }}>Contact</a>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};

export default TeamHomePage;