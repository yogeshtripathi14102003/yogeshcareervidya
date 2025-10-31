"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Addplacedstudent from "../components/Addplacedstudent";

export default function OurStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await api.get("/api/v1/ourstudent");
      if (res.data.success) setStudents(res.data.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Add Student (from popup)
  const handleStudentAdded = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/api/v1/ourstudent/${id}`); // ✅ fixed URL
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setMessage("✅ Student deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting student:", err);
      setMessage("❌ Failed to delete student.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Filter students by search
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Student Management
      </h2>

      {/* ✅ Popup Add Form */}
      <Addplacedstudent onStudentAdded={handleStudentAdded} />

      {/* ✅ Notification Message */}
      {message && (
        <div
          className={`text-center py-2 rounded-md font-medium ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* ✅ Search Bar */}
      <div className="flex justify-between items-center mt-6">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-1/3 focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading students...</p>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Student Image</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Company Logo</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-16 h-16 object-cover mx-auto rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2 border font-medium text-gray-800">
                      {student.name}
                    </td>
                    <td className="px-4 py-2 border text-gray-600">
                      {student.company}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <img
                        src={student.companyLogo}
                        alt={student.company}
                        className="w-12 h-12 object-contain mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
