"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js"; // ✅ Axios instance with baseURL

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/students");
      const data = res.data.students || [];
      setStudents(data);

      // 👀 Log first student to verify keys
      if (data.length > 0) console.log("Sample student:", data[0]);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🧠 Delete a student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/api/v1/students/${id}`);
      alert("✅ Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("❌ Failed to delete student.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          🎓 Student Management
        </h1>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Course</th>
              <th className="p-3">City</th>
              <th className="p-3">State</th>
              <th className="p-3">Gender</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student._id}
                  className="border-t hover:bg-gray-50 text-gray-800"
                >
                  <td className="p-3">{student.name || "—"}</td>
                  <td className="p-3">{student.email || "—"}</td>

                  {/* ✅ Handles both mobileNumber and phone */}
                  <td className="p-3">
                    {student.mobileNumber || student.phone || "—"}
                  </td>

                  <td className="p-3">{student.addresses || student.address || "—"}</td>

                  {/* ✅ Handles both courese (typo) and course */}
                  <td className="p-3">
                    {student.courese || student.course || "—"}
                  </td>

                  <td className="p-3">{student.city || "—"}</td>
                  <td className="p-3">{student.state || "—"}</td>
                  <td className="p-3 capitalize">{student.gender || "—"}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
