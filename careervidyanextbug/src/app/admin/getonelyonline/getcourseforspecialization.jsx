"use client";

import { useEffect, useState } from "react";
import API from "@/utlis/api.js";

export default function GetCourseForSpecialization({ courseId, onLoad }) {
  const [specializations, setSpecializations] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setSpecializations([]);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/api/v1/course/${courseId}`);

        const course =
          res.data?.data ||
          res.data?.course ||
          res.data ||
          null;

        if (!course) {
          setSpecializations([]);
          return;
        }

        // ✅ safe assignment
        setSpecializations(course.specializations || []);

        // send full course back to parent
        onLoad?.(course);
      } catch (error) {
        console.error("Course fetch error:", error);
        setSpecializations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, onLoad]);

  if (!courseId) return null;

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Course Specializations</h3>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && specializations.length === 0 && (
        <p className="text-sm text-gray-500">No specializations found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
        {specializations.map((spec, index) => (
          <label
            key={index}
            className="flex items-center gap-2 p-2 bg-white border rounded"
          >
            <input type="checkbox" disabled />
            <span className="text-sm">{spec}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
