"use client";
import { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import AddTeamMember from "../components/AddTeamMember";
import ViewTeamMember from "../components/ViewTeam";
import EditTeamMember from "../components/Editteam";

export default function TeamManagement() {
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all team members
  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/team");
      const data = res.data?.data || [];
      setTeam(data);
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // ✅ Delete a team member
  const handleDelete = async (id) => {
    if (!id) {
      alert("Member ID is missing");
      return;
    }

    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await api.delete(`/api/v1/team/${id}`);
      if (res.status === 200 || res.data?.success) {
        alert("✅ Member deleted successfully");
        fetchTeam();
      } else {
        alert("❌ Failed to delete member");
      }
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert("Error deleting member — check console for details.");
    }
  };

  const filteredTeam = team.filter((member) =>
    member.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "50px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#fff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        👥 Team Management
      </h2>

      {/* 🔍 Search + Add */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "30%",
            borderRadius: "6px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <AddTeamMember onAddSuccess={fetchTeam} />
      </div>

      {/* 🧾 Table Section */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      ) : (
        <table
          width="100%"
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            fontSize: "15px",
            width: "100%",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>Image</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Description</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeam.length > 0 ? (
              filteredTeam.map((member) => (
                <tr key={member._id}>
                  <td style={{ textAlign: "center" }}>
                    <img
                      src={
                        member.image?.startsWith("http")
                          ? member.image
                          : `${api.defaults.baseURL}/${member.image}`
                      }
                      alt={member.name}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "600" }}>
                    {member.name}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {member.designation || "N/A"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {member.description || "—"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {member.experience
                      ? `${member.experience} year${
                          member.experience !== 1 ? "s" : ""
                        }`
                      : "N/A"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <ViewTeamMember member={member} />
                    <EditTeamMember member={member} onEditSuccess={fetchTeam} />
                    <button
                      onClick={() => handleDelete(member._id)}
                      style={{
                        backgroundColor: "#b60d0d",
                        color: "#fff",
                        padding: "6px 15px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        margin: "5px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#888",
                  }}
                >
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
