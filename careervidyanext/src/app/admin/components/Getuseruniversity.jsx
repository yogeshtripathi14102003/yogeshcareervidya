// Getuseruniversity.jsx

"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api"; // your axios instance
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { X } from "lucide-react";

export default function OfferAppliedStudents({ onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descFilter, setDescFilter] = useState("all"); // all, subsidy, brochure, other
  const [viewStudent, setViewStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/v1/students");
        // Only include students who have description
        const descStudents = res.data.students.filter(
          (student) => student.description && student.description.trim() !== ""
        );
        setStudents(descStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Determine type from description text
  const getDescriptionType = (desc) => {
    if (!desc) return "-";
    if (desc.toLowerCase().includes("subsidy")) return "Subsidy";
    if (desc.toLowerCase().includes("brochure")) return "Brochure";
    return "Other";
  };

  // Filter based on dropdown
  const filteredStudents = students.filter((student) => {
    if (descFilter === "all") return true;
    return getDescriptionType(student.description).toLowerCase() === descFilter;
  });

  // Download filtered students as Excel — all schema fields
  const downloadExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students to download!");
      return;
    }

    const excelData = filteredStudents.map((s) => ({
      Name: s.name || "-",
      Email: s.email || "-",
      Mobile: s.mobileNumber || "-",
      Gender: s.gender || "-",
      DOB: s.dob ? new Date(s.dob).toLocaleDateString() : "-",
      Course: s.course || "-",
      Branch: s.branch || "-",
      Specialization: s.specialization || "-",
      City: s.city || "-",
      State: s.state || "-",
      Address: s.addresses || "-",
      "Subsidy Coupon": s.subsidyCoupon || "-",
      Role: s.role || "-",
      Description: s.description || "-",
      "Last Activity": s.lastActivity
        ? new Date(s.lastActivity).toLocaleString()
        : "-",
      "Registered On": s.createdAt
        ? new Date(s.createdAt).toLocaleDateString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "students_with_description.xlsx");
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-6 relative my-6">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            <X size={20} />
          </button>
        )}

        <h2 className="text-2xl font-bold mb-4">📄 Students With Description</h2>

        {loading ? (
          <p className="text-center py-10">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No students with description found
          </p>
        ) : (
          <>
            {/* Filter + Download Buttons */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div>
                <label htmlFor="descFilter" className="mr-2 font-semibold text-sm">
                  Filter by Type:
                </label>
                <select
                  id="descFilter"
                  value={descFilter}
                  onChange={(e) => setDescFilter(e.target.value)}
                  className="border rounded p-1.5 text-sm"
                >
                  <option value="all">All</option>
                  <option value="subsidy">Subsidy</option>
                  <option value="brochure">Brochure</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                onClick={downloadExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                ⬇ Download Excel
              </button>
            </div>

            {/* Students Table — compact, all key fields */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full min-w-[1200px] text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Mobile</th>
                    <th className="border p-2 text-left">Gender</th>
                    <th className="border p-2 text-left">DOB</th>
                    <th className="border p-2 text-left">Course</th>
                    <th className="border p-2 text-left">Branch</th>
                    <th className="border p-2 text-left">Specialization</th>
                    <th className="border p-2 text-left">City / State</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Role</th>
                    <th className="border p-2 text-left">Registered</th>
                    <th className="border p-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="p-4 text-center text-gray-500">
                        No students found for selected description
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50 border-t">
                        <td className="border p-2 font-medium">{student.name || "-"}</td>
                        <td className="border p-2">{student.email || "-"}</td>
                        <td className="border p-2 whitespace-nowrap">
                          {student.mobileNumber || "-"}
                        </td>
                        <td className="border p-2 capitalize">{student.gender || "-"}</td>
                        <td className="border p-2 whitespace-nowrap">
                          {student.dob
                            ? new Date(student.dob).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="border p-2">{student.course || "-"}</td>
                        <td className="border p-2">{student.branch || "-"}</td>
                        <td className="border p-2">
                          {student.specialization || "-"}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          {[student.city, student.state]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </td>
                        <td className="border p-2 font-semibold text-blue-600 max-w-[200px] truncate" title={student.description}>
                          {getDescriptionType(student.description)} (
                          {student.description})
                        </td>
                        <td className="border p-2 capitalize">
                          {student.role || "user"}
                        </td>
                        <td className="border p-2 whitespace-nowrap">
                          {student.createdAt
                            ? new Date(student.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => setViewStudent(student)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Student Details Modal — all schema fields */}
        {viewStudent && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-[60] px-4"
            onClick={() => setViewStudent(null)}
          >
            <div
              className="bg-white rounded-xl shadow-lg w-11/12 max-w-lg p-6 relative max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewStudent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4">Student Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p><strong>Name:</strong> {viewStudent.name || "-"}</p>
                <p><strong>Email:</strong> {viewStudent.email || "-"}</p>
                <p><strong>Mobile:</strong> {viewStudent.mobileNumber || "-"}</p>
                <p><strong>Gender:</strong> {viewStudent.gender || "-"}</p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {viewStudent.dob
                    ? new Date(viewStudent.dob).toLocaleDateString()
                    : "-"}
                </p>
                <p><strong>Course:</strong> {viewStudent.course || "-"}</p>
                <p><strong>Branch:</strong> {viewStudent.branch || "-"}</p>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {viewStudent.specialization || "-"}
                </p>
                <p><strong>City:</strong> {viewStudent.city || "-"}</p>
                <p><strong>State:</strong> {viewStudent.state || "-"}</p>
                <p className="sm:col-span-2">
                  <strong>Address:</strong> {viewStudent.addresses || "-"}
                </p>
                <p>
                  <strong>Subsidy Coupon:</strong>{" "}
                  {viewStudent.subsidyCoupon || "-"}
                </p>
                <p><strong>Role:</strong> {viewStudent.role || "user"}</p>
                <p>
                  <strong>System Admin:</strong>{" "}
                  {viewStudent.isSystemAdmin ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Last Activity:</strong>{" "}
                  {viewStudent.lastActivity
                    ? new Date(viewStudent.lastActivity).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <strong>Registered On:</strong>{" "}
                  {viewStudent.createdAt
                    ? new Date(viewStudent.createdAt).toLocaleDateString()
                    : "-"}
                </p>
                <p className="sm:col-span-2">
                  <strong>Description:</strong> {viewStudent.description || "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}