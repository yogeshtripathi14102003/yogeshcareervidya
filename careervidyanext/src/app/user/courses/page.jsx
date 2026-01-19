"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import { BookOpen, Loader2 } from "lucide-react";

export default function CourseApplyPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const res = await api.get("/api/v1/students/applied-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">My Applied Courses</h1>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-lg p-10 bg-white">
          <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
          <h2 className="text-lg font-medium">No Course Found</h2>
          <p className="text-sm text-gray-500 mt-1">
            You haven’t applied to any course yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border rounded-lg p-5 hover:shadow transition"
            >
              <h2 className="font-medium text-gray-800 mb-1">
                {course.courseName}
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                {course.universityName}
              </p>

              <div className="flex justify-between items-center text-xs">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-600">
                  Applied
                </span>
                <span className="text-gray-400">
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
