"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Getuseroffer from "@/app/admin/components/GetuserOffer.jsx";
import NotificationManager from "@/app/admin/components/NotificationManager.jsx";
import Getuseruniversity from "@/app/admin/components/Getuseruniversity.jsx";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showOfferComponent, setShowOfferComponent] = useState(false);
  const [showStudentsTable, setShowStudentsTable] = useState(false);
  const [showNotificationManager, setShowNotificationManager] = useState(false);
  const [showUniversityComponent, setShowUniversityComponent] = useState(false);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/students");
      const data = res.data.students || [];
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let data = [...students];

    // 🔍 Search filter (name / email / mobile)
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.mobileNumber?.includes(q)
      );
    }

    // 📅 Date range filter (createdAt)
    if (fromDate) {
      data = data.filter(
        (s) => new Date(s.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      data = data.filter(
        (s) => new Date(s.createdAt) <= new Date(toDate)
      );
    }

    setFilteredStudents(data);
  }, [search, fromDate, toDate, students]);

  /* ================= DELETE ================= */
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

  /* ================= EXCEL DOWNLOAD ================= */
  const downloadExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students available");
      return;
    }

    const excelData = filteredStudents.map((s) => ({
      Name: s.name || "—",
      Email: s.email || "—",
      Phone: s.mobileNumber || "—",
      Address: s.addresses || "—",
      Course: s.course || "—",
      City: s.city || "—",
      State: s.state || "—",
      Gender: s.gender || "—",
      Date: s.createdAt
        ? new Date(s.createdAt).toLocaleDateString()
        : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "students.xlsx"
    );
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
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            🎁 Offer Applied Students
          </button>

          <button
            onClick={() => setShowStudentsTable((p) => !p)}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
          >
            👀 {showStudentsTable ? "Hide Users" : "View All Users"}
          </button>

          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            ⬇ Download Excel
          </button>

          <button
            onClick={() => setShowNotificationManager((p) => !p)}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg"
          >
            🔔 Notification Manager
          </button>

          <button
            onClick={() => setShowUniversityComponent((p) => !p)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            🏫 University Component
          </button>
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      {showStudentsTable && (
        <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search name / email / mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <button
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
            }}
            className="bg-gray-200 rounded-lg px-4 py-2"
          >
            ❌ Clear
          </button>
        </div>
      )}

      {/* STUDENTS TABLE */}
      {showStudentsTable && (
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Course</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.mobileNumber}</td>
                    <td className="p-3">{s.course}</td>
                    <td className="p-3">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
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

      {/* ================= MODALS ================= */}
      {showOfferComponent && (
        <Getuseroffer onClose={() => setShowOfferComponent(false)} />
      )}

      {showNotificationManager && (
        <NotificationManager onClose={() => setShowNotificationManager(false)} />
      )}

      {showUniversityComponent && (
        <Getuseruniversity onClose={() => setShowUniversityComponent(false)} />
      )}
    </div>
  );
}
