"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utlis/api.js"; // Ensure this path is correct

export default function CourseCardSection() { // Or export default function Home() if this is your homepage
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define filteredCourses. Since no filter logic is shown, we use the first 10 courses.
  // We can treat the first 10 courses as the "filtered" list for display.
  const filteredCourses = courses.slice(0, 10); 

  // Fetch data on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Use the API endpoint that returns ALL courses
        const res = await api.get("/api/v1/course");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <p className="text-center p-10">Loading featured courses...</p>;
  }

  if (filteredCourses.length === 0) {
    return <p className="text-center p-10 text-gray-500">No courses available.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Course Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
        {/* The error is solved because filteredCourses is now defined */}
        {filteredCourses.map((course) => (
          <Link
            key={course._id}
            href={`/course/${course.slug}`}
            className="block bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={course.courseLogo?.url || "/placeholder.jpg"}
              alt={course.name}
              className="w-full h-40 object-contain mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {course.name}
            </h2>
            <p className="text-sm text-gray-600">{course.category}</p>
            <p className="text-sm text-gray-500">{course.duration}</p>
            <div className="text-xs text-blue-600 mt-1">
              {course.specialization?.join(", ")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}