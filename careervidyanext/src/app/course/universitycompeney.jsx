"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";

const UniversityTable = ({ courseName = "Online Courses" }) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        setUniversities(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching universities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  if (loading) {
    return <div className="text-center py-10 font-medium">Loading Universities...</div>;
  }

  return (
    <section className="w-full flex justify-center bg-white py-10 font-sans">
      <div className="w-full max-w-[1400px] px-4 md:px-10">
        
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#002147]">
          Top Affordable Universities for {courseName}
        </h2>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="w-full border-collapse bg-white table-fixed">
            <thead>
              <tr className="bg-[#002D62]">
                <th
                  colSpan={2}
                  className="text-white text-center py-6 text-xl font-semibold border-b border-[#002D62]"
                >
                  Top Universities for  {courseName}
                </th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-300">
                <th className="p-5 text-left font-bold text-gray-800 border-r border-gray-300 w-[30%] lg:w-[25%]">
                  University Name
                </th>
                <th className="p-5 text-left font-bold text-gray-800 w-[70%] lg:w-[75%]">
                  Accreditations & Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {universities.slice(0, 10).map((uni, index) => {
                const rawPoints = uni.approvals || uni.recognition?.recognitionPoints || [];
                const approvalsText = Array.isArray(rawPoints)
                  ? rawPoints
                      .map((item) => (typeof item === "object" ? item.name || item.label : item))
                      .filter(Boolean)
                      .join(" | ")
                  : rawPoints;

                // LOGIC: Sirf pehli 6 (index 0-5) par click hoga
                const isClickable = index < 6;

                return (
                  <tr 
                    key={uni._id || index} 
                    className="border-b border-gray-200 hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="p-6 border-r border-gray-200 font-bold">
                      {isClickable ? (
                        <a 
                          href={`/university/${uni.slug || uni._id}`}
                          className="text-blue-700 hover:text-blue-900 cursor-pointer block text-[15px] hover:underline decoration-blue-300"
                        >
                          {uni.name}
                        </a>
                      ) : (
                        // Color wahi Blue rakha hai, bas link (a tag) hata diya
                        <span className="text-blue-700 block text-[15px] cursor-default">
                          {uni.name}
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-gray-700 leading-relaxed text-[13px] font-semibold uppercase tracking-tight">
                      {approvalsText || "UGC-DEB | AICTE | NIRF | NAAC A+"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm italic">
            * Data based on latest university recognition and accreditation points.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UniversityTable;