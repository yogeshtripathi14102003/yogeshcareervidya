"use client";

import Editcourse from "../components/Editcourse.jsx";
import Addspcilazation from "@/app/admin/components/AddSpcialization.jsx"; 
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";
import { Eye } from "lucide-react"; // ✅ Import Eye icon

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [editCourseId, setEditCourseId] = useState(null);
  const [specializationCourseId, setSpecializationCourseId] = useState(null);

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/v1/course");
      if (response.data?.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete Course
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/api/v1/course/${id}`);
      alert("✅ Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("❌ Failed to delete course");
    }
  };

  // Close Edit Modal
  const handleCloseEdit = () => setEditCourseId(null);

  // Close Specialization Modal
  const handleCloseSpecialization = () => setSpecializationCourseId(null);

  if (loading) {
    return <p className="text-center mt-10">Loading courses...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Course List</h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Logo</th>
              <th className="px-4 py-2 border">Course Name</th>
              <th className="px-4 py-2 border">Specializations</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id} className="text-center hover:bg-gray-50">
                  {/* Course Logo */}
                  <td className="border px-4 py-2">
                    {course.courseLogo?.url ? (
                      <Image
                        src={course.courseLogo.url}
                        alt={course.name}
                        width={60}
                        height={60}
                        className="mx-auto rounded-md object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>

                  {/* Course Name */}
                  <td className="border px-4 py-2 font-medium">{course.name}</td>

                  {/* Specializations */}
                  <td className="border px-4 py-2 text-sm text-gray-600">
                    {course.specializations?.length > 0
                      ? course.specializations.join(", ")
                      : "—"}
                  </td>

                  {/* Actions */}
                  <td className="border px-4 py-2 flex items-center justify-center gap-3">
                    {/* Edit */}
                    <button
                      onClick={() => setEditCourseId(course._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>

                    {/* View Specializations (Icon only) */}
                    <button
                      onClick={() => setSpecializationCourseId(course._id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded"
                    >
                      <Eye size={18} /> {/* 👁️ Eye icon */}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-6 text-gray-500 text-center">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT COURSE MODAL */}
      {editCourseId && (
        <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
          <div className="min-h-screen flex justify-center items-center p-6">
            <Editcourse
              courseId={editCourseId}
              onClose={handleCloseEdit}
              onUpdated={fetchCourses}
            />
          </div>
        </div>
      )}

      {/* VIEW SPECIALIZATION MODAL */}
      {specializationCourseId && (
        <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
          <div className="min-h-screen flex justify-center items-center p-6">
            <Addspcilazation
              courseId={specializationCourseId}
              onClose={handleCloseSpecialization}
              onUpdated={fetchCourses}
            />
          </div>
        </div>
      )}
    </div>
  );
}
