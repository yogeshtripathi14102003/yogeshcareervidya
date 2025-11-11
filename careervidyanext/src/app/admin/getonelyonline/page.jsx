"use client";

import Editcourse from "../components/Editcourse.jsx";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourseId, setEditCourseId] = useState(null);

  // ✅ Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/v1/course");
      if (response.data?.courses) setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Delete Course API
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/api/v1/course/${id}`);
      alert("✅ Course deleted successfully!");
      fetchCourses(); // refresh list
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("❌ Failed to delete course.");
    }
  };

  // ✅ Close Edit Modal
  const handleCloseEdit = () => setEditCourseId(null);

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Course List</h1>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Logo</th>
              <th className="px-4 py-2 border">Course Name</th>
              <th className="px-4 py-2 border">Subjects</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id} className="text-center hover:bg-gray-50">
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

                  <td className="border px-4 py-2 font-medium">{course.name}</td>

                  <td className="border px-4 py-2 text-sm text-gray-600">
                    {course.specialization?.length > 0
                      ? course.specialization.join(", ")
                      : "—"}
                  </td>

                  <td className="border px-4 py-2 flex items-center justify-center gap-3">
                    {/* ✅ Edit */}
                    <button
                      onClick={() => setEditCourseId(course._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>

                    {/* ✅ Delete */}
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

      {/* ✅ Edit Modal */}
      {editCourseId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <Editcourse
            courseId={editCourseId}
            onClose={handleCloseEdit}     // ✅ Proper close handler
            onUpdated={fetchCourses}      // ✅ Refresh after update
          />
        </div>
      )}
    </div>
  );
}
