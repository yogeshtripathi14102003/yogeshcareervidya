"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import TeamSection from "@/app/components/TeamSection.jsx";

export default function ComparePage() {
  const router = useRouter();
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ids = query.get("ids");
    if (!ids) return;

    const idArray = ids.split(",");

    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        const filtered = res.data.data.filter((u) => idArray.includes(u._id));
        setUniversities(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUniversities();
  }, []);

  if (universities.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No universities selected for comparison.
      </div>
    );
  }

  const allCourses = Array.from(
    new Set(
      universities.flatMap(
        (u) => u.courses?.map((c) => c.name || "Unnamed Course") || []
      )
    )
  );

  const formatFees = (fees) => {
    return fees ? `₹${Number(fees).toLocaleString("en-IN")}` : "-";
  };

  return (
    <>
      <Header />

      <div className="p-8 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Comparison Result
        </h1>

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left text-blue-700">
                Parameters
              </th>
              {universities.map((uni) => (
                <th key={uni._id} className="border px-4 py-2 text-center">
                  <div className="flex flex-col items-center">
                    <img
                      src={uni.universityImage}
                      alt={uni.name}
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <span className="font-bold text-sm">{uni.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Approvals */}
            <tr className="bg-gray-50">
              <td className="border px-4 py-2 font-bold text-blue-700">
                Approvals
              </td>
              {universities.map((uni) => (
                <td key={uni._id} className="border px-4 py-2 text-center text-sm">
                  {uni.approvals
                    ?.map((a) => (typeof a === "object" ? a.name : a))
                    .join(", ") || "Verified"}
                </td>
              ))}
            </tr>

            {/* Static Fields */}
            <tr>
              <td className="border px-4 py-2 font-bold text-blue-700">
                Examination Mode
              </td>
              {universities.map((uni) => (
                <td
                  key={uni._id}
                  className="border px-4 py-2 text-center text-green-600 font-semibold"
                >
                  Online
                </td>
              ))}
            </tr>

            <tr className="bg-gray-50">
              <td className="border px-4 py-2 font-bold text-blue-700">
                Placement Assistance
              </td>
              {universities.map((uni) => (
                <td
                  key={uni._id}
                  className="border px-4 py-2 text-center text-green-600 font-semibold"
                >
                  Virtual
                </td>
              ))}
            </tr>

            <tr>
              <td className="border px-4 py-2 font-bold text-blue-700">
                LMS Support
              </td>
              {universities.map((uni) => (
                <td
                  key={uni._id}
                  className="border px-4 py-2 text-center text-green-600 font-semibold"
                >
                  Yes
                </td>
              ))}
            </tr>

            <tr className="bg-gray-50">
              <td className="border px-4 py-2 font-bold text-blue-700">
                EMI Facility
              </td>
              {universities.map((uni) => (
                <td
                  key={uni._id}
                  className="border px-4 py-2 text-center text-green-600 font-semibold"
                >
                  Yes
                </td>
              ))}
            </tr>

            <tr>
              <td className="border px-4 py-2 font-bold text-blue-700">
                Loan Facility
              </td>
              {universities.map((uni) => (
                <td
                  key={uni._id}
                  className="border px-4 py-2 text-center text-green-600 font-semibold"
                >
                  Yes
                </td>
              ))}
            </tr>

            {/* Courses & Fees */}
            {allCourses.map((courseName) => (
              <tr key={courseName} className="bg-gray-50">
                <td className="border px-4 py-2 font-bold text-blue-700">
                  {courseName}
                </td>
                {universities.map((uni) => {
                  const course = uni.courses?.find(
                    (c) => c.name === courseName
                  );
                  return (
                    <td
                      key={uni._id}
                      className="border px-4 py-2 text-center text-sm"
                    >
                      {course
                        ? `${course.duration || "-"} | ${formatFees(
                            course.fees
                          )}`
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TeamSection />
      <Footer />
    </>
  );
}
