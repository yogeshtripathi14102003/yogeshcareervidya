// Getuseruniversity.jsx

"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api"; // your axios instance
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function OfferAppliedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descFilter, setDescFilter] = useState("all"); // all, subsidy, brochure
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

  // Download filtered students as Excel
  const downloadExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students to download!");
      return;
    }

    const excelData = filteredStudents.map((s) => ({
      Name: s.name || "-",
      Email: s.email || "-",
      Mobile: s.mobileNumber || "-",
      Course: s.course || "-",
      Branch: s.branch || "-",
      City: s.city || "-",
      State: s.state || "-",
      Gender: s.gender || "-",
      Description: s.description || "-",
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

  if (loading) {
    return <p className="text-center mt-10">Loading students...</p>;
  }

  if (students.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No students with description found
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📄 Students With Description</h2>

      {/* Filter + Download Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
         
        </div>

        <button
          onClick={downloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ⬇ Download Excel
        </button>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Mobile</th>
              <th className="border p-2 text-left">Course</th>
              <th className="border p-2 text-left">Branch</th>
              <th className="border p-2 text-left">UniversityName</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No students found for selected description
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 border-t">
                  <td className="border p-2">{student.name || "-"}</td>
                  <td className="border p-2">{student.email || "-"}</td>
                  <td className="border p-2">{student.mobileNumber || "-"}</td>
                  <td className="border p-2">{student.course || "-"}</td>
                  <td className="border p-2">{student.branch || "-"}</td>
                  <td className="border p-2 font-semibold text-blue-600">
                    {getDescriptionType(student.description)} ({student.description})
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => setViewStudent(student)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
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

      {/* Student Details Modal */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-lg p-6 relative">
            <button
              onClick={() => setViewStudent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Student Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewStudent.name || "-"}</p>
              <p><strong>Email:</strong> {viewStudent.email || "-"}</p>
              <p><strong>Mobile:</strong> {viewStudent.mobileNumber || "-"}</p>
              <p><strong>Course:</strong> {viewStudent.course || "-"}</p>
              <p><strong>Branch:</strong> {viewStudent.branch || "-"}</p>
              <p><strong>City:</strong> {viewStudent.city || "-"}</p>
              <p><strong>State:</strong> {viewStudent.state || "-"}</p>
              <p><strong>Gender:</strong> {viewStudent.gender || "-"}</p>
              <p><strong>Description:</strong> {viewStudent.description || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
