"use client";

import { useState } from "react";

export default function ViewTeamMember({ member }) {
  const [showModal, setShowModal] = useState(false);

  // Fallback for missing image
  const defaultImage = "https://via.placeholder.com/150"; // Placeholder image URL
  const imageUrl = member.image || defaultImage;

  return (
    <div>
      {/* Button to trigger modal */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "#3b5998",
          color: "white",
          padding: "5px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          margin: "5px",
        }}
      >
        View 
      </button>

      {/* Modal to display team member details */}
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
              textAlign: "center",
            }}
          >
            <h5>{member.name}'s Details</h5>
            <div style={{ marginBottom: "15px" }}>
              <img
                src={imageUrl}
                alt={member.name}
                width={100}
                style={{
                  borderRadius: "8px",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
              <p>
                <strong>Name:</strong> {member.name}
              </p>
              <p>
                <strong>Designation:</strong> {member.designation}
              </p>
              <p>
                <strong>Description:</strong> {member.description}
              </p>
              <p>
                <strong>Experience:</strong> {member.experience} year
                {member.experience !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "#ccc",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}