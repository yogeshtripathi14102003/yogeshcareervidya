"use client";

import api from "@/utlis/api.js";

export default function DeleteTeamMember({ member, onDeleteSuccess }) {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;

    try {
      await api.delete(`/api/v1/team/${member._id}`);
      alert("Team member deleted successfully!");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error occurred";
      console.error("Error deleting team member:", err.response?.data || err);
      alert(`Error deleting team member: ${errorMessage}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        color: "red",
        background: "none",
        border: "none",
        cursor: "pointer",
        margin: "0 5px",
      }}
    >
      Delete
    </button>
  );
}