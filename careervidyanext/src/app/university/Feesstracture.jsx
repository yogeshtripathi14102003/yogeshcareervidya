"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Link from "next/link";

export default function FeesStructureStyledTable({ slug, courseTitle }) {
  const [courses, setCourses] = useState([]);
  const [universityName, setUniversityName] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/v1/university/slug/${slug}`);

        setCourses(res.data?.data?.courses || []);
        setUniversityName(res.data?.data?.name || "");
      } catch (error) {
        console.error("Fees table error:", error);
      }
    };

    fetchData();
  }, [slug]);

  if (!courses.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
      {/* Top Blue Heading */}
      <div className="bg-[#0b3a6f] text-white text-center py-4 rounded-t-lg">
        <h2 className="text-xl md:text-2xl font-semibold">
          {universityName} Fees Structure{" "}
          {courseTitle && (
            <span className="font-normal">
              for {courseTitle}
            </span>
          )}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-t-0 rounded-b-lg">
        <table className="w-full border-collapse">
          <thead className="bg-[#eaf4ff]">
            <tr>
              <th className="text-left p-4 border text-lg font-semibold">
                University Name
              </th>
              <th className="text-left p-4 border text-lg font-semibold">
                Duration
              </th>
              <th className="text-left p-4 border text-lg font-semibold">
                Course Fees
              </th>
              <th className="text-left p-4 border text-lg font-semibold">
                Detailed Fee Structure
              </th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* University Name */}
                <td className="p-4 border">
                  <Link
                    href="#"
                    className="text-blue-600 font-medium underline"
                  >
                    {course.name}
                  </Link>
                </td>

                {/* Duration */}
                <td className="p-4 border text-gray-800 font-medium">
                  {course.duration || "N/A"}
                </td>

                {/* Fees */}
                <td className="p-4 border font-medium text-gray-900">
                  {course.fees || "—"}
                </td>

                {/* Fee Details */}
                <td className="p-4 border text-gray-700 leading-relaxed">
                  {course.details || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
