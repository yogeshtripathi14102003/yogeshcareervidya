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
      <div className="relative overflow-hidden w-auto md:h-[70vh] h-[30vh]">
        <img
          src="/images/career1.jpeg"
          alt="Career Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold">
            Accelerate your career with Careervidya
          </h1>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mt-6">
        <h1 className="text-3xl font-bold text-[#0A4FA3]">
          Find your dream job
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          TOTAL OPENINGS: {filteredJobs.length}
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-[#1666B0] p-6 rounded-lg text-white flex flex-wrap gap-4">
          <input
            placeholder="Search job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded text-black"
          />

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded text-black"
          >
            <option value="">All Departments</option>
            {allDepartments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs */}
      <div className="max-w-6xl mx-auto mt-10 mb-20">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500">
            No job openings found
          </p>
        ) : (
          Object.keys(grouped).map((dept) => (
            <div key={dept} className="mb-8">
              <h2 className="font-bold text-[#0A4FA3] mb-3">
                {dept} ({grouped[dept].length})
              </h2>

              {grouped[dept].map((job) => (
                <div
                  key={job._id}
                  className="border p-4 rounded mb-3 flex justify-between"
                >
                  <div onClick={() => openDetail(job)}>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.location} | {job.experience}
                    </p>
                  </div>

                  <button
                    onClick={() => openDetail(job)}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <Getintuch />
      <Footer />
    </>
  );
}