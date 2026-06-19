"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import Header from "@/app/layout/Header.jsx";

const TeamHomePage = () => {
  const [teamList, setTeamList] = useState([]);
  const API_ROUTE = "/api/v1/manage";

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get(`${API_ROUTE}/`);
        const incomingData = response.data;
        if (Array.isArray(incomingData)) {
          setTeamList(incomingData);
        } else if (incomingData && Array.isArray(incomingData.data)) {
          setTeamList(incomingData.data);
        } else if (incomingData && typeof incomingData === "object") {
          const possibleArray = Object.values(incomingData).find((val) =>
            Array.isArray(val)
          );
          setTeamList(possibleArray || []);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    fetchTeam();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, "/");
    return `https://api.careervidya.in/${cleanPath}`;
  };

  return (
    <>
      <Header />
      <div
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#111827",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* HERO */}
        <section
          style={{
            padding: "90px 20px",
            textAlign: "center",
            background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
            color: "#ffffff",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <span
              style={{
                background: "rgba(59,130,246,0.2)",
                color: "#60a5fa",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              Our Team
            </span>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                marginTop: "20px",
                marginBottom: "16px",
                lineHeight: "1.2",
              }}
            >
              Meet the Experts Behind Our Vision
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: "1.6" }}>
              Passionate innovators dedicated to delivering the highest quality experiences.
            </p>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 20px" }}
        >
          {teamList.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>Loading team...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "70px" }}>
              {teamList.map((member, index) => {
                const imgUrl = getImageUrl(member.image);
                const isFirst2 = index < 2; // सिर्फ पहले 2 का side description
                const isEven = index % 2 === 0;

                const imageBlock = (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: isFirst2 ? "260px" : "auto",
                    }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={member.name}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/240x280?text=No+Photo";
                        }}
                        style={{
                          width: isFirst2 ? "240px" : "180px",
                          height: isFirst2 ? "280px" : "180px",
                          borderRadius: isFirst2 ? "16px" : "50%",
                          objectFit: "cover",
                          objectPosition: "top",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
                          border: "4px solid #ffffff",
                          background: "#e5e7eb",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: isFirst2 ? "240px" : "180px",
                          height: isFirst2 ? "280px" : "180px",
                          borderRadius: isFirst2 ? "16px" : "50%",
                          background: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                          fontWeight: "600",
                          fontSize: "1rem",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>
                );

                const textBlock = (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: isFirst2 ? "left" : "center",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: isFirst2 ? "1.6rem" : "1.3rem",
                        fontWeight: "700",
                        color: "#1e40af",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {member.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 16px 0",
                      }}
                    >
                      {member.designation}
                    </p>

                    {isFirst2 && (
                      <>
                        <div
                          style={{
                            width: "40px",
                            height: "3px",
                            background: "#3b82f6",
                            borderRadius: "2px",
                            marginBottom: "16px",
                          }}
                        />
                        <p
                          style={{
                            fontSize: "0.97rem",
                            color: "#4b5563",
                            lineHeight: "1.75",
                            margin: "0",
                          }}
                        >
                          {member.description || "No description provided."}
                        </p>
                      </>
                    )}
                  </div>
                );

                // पहले 2: side-by-side layout (alternate left/right)
                if (isFirst2) {
                  return (
                    <div
                      key={member._id}
                      style={{
                        display: "flex",
                        flexDirection: isEven ? "row" : "row-reverse",
                        alignItems: "center",
                        gap: "50px",
                        flexWrap: "wrap",
                      }}
                    >
                      {imageBlock}
                      {textBlock}
                    </div>
                  );
                }

                // बाकी: center grid layout
                return null; // grid section में handle होगा
              })}

              {/* बाकी members — grid */}
              {teamList.length > 2 && (
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "40px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#111827",
                        margin: "0 0 8px 0",
                      }}
                    >
                      More Team Members
                    </h2>
                    <div
                      style={{
                        width: "50px",
                        height: "3px",
                        background: "#3b82f6",
                        borderRadius: "2px",
                        margin: "0 auto",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "50px 30px",
                    }}
                  >
                    {teamList.slice(2).map((member) => {
                      const imgUrl = getImageUrl(member.image);
                      return (
                        <div
                          key={member._id}
                          style={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={member.name}
                              onError={(e) => {
                                e.target.src =
                                  "https://placehold.co/160x160?text=No+Photo";
                              }}
                              style={{
                                width: "160px",
                                height: "160px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                objectPosition: "top",
                                marginBottom: "16px",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
                                border: "4px solid #ffffff",
                                outline: "2px solid #dbeafe",
                                background: "#e5e7eb",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "160px",
                                height: "160px",
                                borderRadius: "50%",
                                background: "#e5e7eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#9ca3af",
                                fontWeight: "600",
                                marginBottom: "16px",
                              }}
                            >
                              No Image
                            </div>
                          )}
                          <h3
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: "700",
                              color: "#1e40af",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {member.name}
                          </h3>
                          <p
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: "600",
                              color: "#374151",
                              margin: "0",
                            }}
                          >
                            {member.designation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default TeamHomePage;