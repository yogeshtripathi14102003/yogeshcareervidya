"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Getuseroffer from "@/app/admin/components/GetuserOffer.jsx";
import NotificationManager from "@/app/admin/components/NotificationManager.jsx"; // ✅ Import it

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOfferComponent, setShowOfferComponent] = useState(false);
  const [showStudentsTable, setShowStudentsTable] = useState(false);
  const [showNotificationManager, setShowNotificationManager] = useState(false); // ✅ NEW

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/students");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/api/v1/students/${id}`);
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student.");
    }
  };

  // Download Excel
  const downloadExcel = () => {
    if (students.length === 0) {
      alert("No students available");
      return;
    }

    const excelData = students.map((s) => ({
      Name: s.name || "—",
      Email: s.email || "—",
      Phone: s.mobileNumber || "—",
      Address: s.addresses || "—",
      Course: s.course || "—",
      City: s.city || "—",
      State: s.state || "—",
      Gender: s.gender || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "students.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">
          🎓 Student Management
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowOfferComponent(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            🎁 Offer Applied Students
          </button>

          <button
            onClick={() => setShowStudentsTable((prev) => !prev)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
          >
            👀 {showStudentsTable ? "Hide Users" : "View All Users"}
          </button>

          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            ⬇ Download Excel
          </button>

          {/* ✅ Notification Manager Button */}
          <button
            onClick={() =>
              setShowNotificationManager((prev) => !prev)
            }
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg"
          >
            🔔 Notification Manager
          </button>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      {showStudentsTable && (
        <div className="bg-white shadow rounded-xl overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3">Course</th>
                <th className="p-3">City</th>
                <th className="p-3">State</th>
                <th className="p-3">Gender</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{s.name || "—"}</td>
                    <td className="p-3">{s.email || "—"}</td>
                    <td className="p-3">{s.mobileNumber || "—"}</td>
                    <td className="p-3">{s.addresses || "—"}</td>
                    <td className="p-3">{s.course || "—"}</td>
                    <td className="p-3">{s.city || "—"}</td>
                    <td className="p-3">{s.state || "—"}</td>
                    <td className="p-3">{s.gender || "—"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(s._id)}
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
      )}

      {/* OFFER COMPONENT */}
      {showOfferComponent && (
        <Getuseroffer onClose={() => setShowOfferComponent(false)} />
      )}

      {/* ✅ NOTIFICATION MANAGER COMPONENT */}
      {showNotificationManager && <NotificationManager />}
    </div>
  );
}
