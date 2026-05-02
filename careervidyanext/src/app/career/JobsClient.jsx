"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/layout/Header";
import Footer from "../layout/Footer";
import Getintuch from "../components/getintuch";

export default function JobsClient({ initialJobs }) {
  const router = useRouter();

  const [jobs] = useState(initialJobs || []);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const allDepartments = [
    "Counselor",
    "Human Resource",
    "Assistant Manager",
    "Software Development",
    "Sales & Growth",
    "Frontend Development",
    "Backend Development",
    "DevOps",
    "Management",
    "Finance & Accounts",
    "Digital Marketing",
    "Software Testing",
    "IT Support",
  ];

  const openDetail = (job) => {
    const id = job.jobId || job.id || job._id;
    router.push(`/career/${id}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job?.title?.toLowerCase() || "";
    const dept = job?.department?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    const matchSearch =
      title.includes(searchTerm) || dept.includes(searchTerm);

    const matchDept =
      selectedDept === "" || job.department === selectedDept;

    return matchSearch && matchDept;
  });

  const grouped = filteredJobs.reduce((acc, job) => {
    const dept = job?.department || "Others";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(job);
    return acc;
  }, {});

  return (
    <>
      <Header />

      {/* Banner */}
      <div className="relative w-full h-[35vh] md:h-[60vh]">
        <img
          src="/images/career1.jpeg"
          alt="Career Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-5xl font-bold text-center px-4">
            Accelerate your career with Careervidya
          </h1>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mt-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0A4FA3]">
          Find your dream job
        </h1>
        <p className="text-gray-500 mt-2">
          {filteredJobs.length} Open Positions
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="bg-white shadow-lg border rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <input
            placeholder="Search job or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Departments</option>
            {allDepartments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs */}
      <div className="max-w-6xl mx-auto mt-10 mb-20 px-4">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No job openings found 😕
          </p>
        ) : (
          Object.keys(grouped).map((dept) => (
            <div key={dept} className="mb-10">
              <h2 className="text-xl font-semibold text-[#0A4FA3] mb-4 border-l-4 border-blue-500 pl-3">
                {dept} ({grouped[dept].length})
              </h2>

              <div className="grid gap-5">
                {grouped[dept].map((job) => (
                  <div
                    key={job._id}
                    className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    {/* LEFT */}
                    <div
                      onClick={() => openDetail(job)}
                      className="cursor-pointer flex-1"
                    >
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                        {job.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        📍 {job.location || "Not specified"} • 🧑‍💻{" "}
                        {job.experience || "0-1 yrs"}
                      </p>

                      {/* Salary */}
                      <p className="text-sm mt-2 font-medium text-green-600">
                        💰 {job.salary || "Not Disclosed"}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.type && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {job.type}
                          </span>
                        )}

                        {job.mode && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {job.mode}
                          </span>
                        )}

                        {job.department && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {job.department}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      <button
                        onClick={() => openDetail(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                      >
                        Apply Now
                      </button>

                      <span className="text-xs text-gray-400">
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Getintuch />
      <Footer />
    </>
  );
}