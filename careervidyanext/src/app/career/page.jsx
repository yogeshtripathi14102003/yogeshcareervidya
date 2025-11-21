

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/layout/Header";
import api from "@/utlis/api";
import Footer from "../layout/Footer";
import Getintuch from "../components/getintuch";
export default function Jobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    api
      .get("/api/v1/addjob")
      .then((res) => {
        let jobList = res.data.data || res.data.jobs || res.data || [];
        if (!Array.isArray(jobList)) jobList = [];
        setJobs(jobList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 👉 Job Detail Route
  const openDetail = (job) => {
    const id = job.jobId || job.id || job._id;
    router.push(`/career/${id}`);
  };

  // 👉 Department List
  const deptList = [
    ...new Set(
      jobs
        .map((j) => j?.department)
        .filter((d) => d && d.trim() !== "")
    ),
  ];

  // 👉 Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const title = job?.title?.toLowerCase() || "";
    const dept = job?.department?.toLowerCase() || "";

    const matchSearch =
      title.includes(search.toLowerCase()) ||
      dept.includes(search.toLowerCase());

    const matchDept =
      selectedDept === "" || job.department === selectedDept;

    return matchSearch && matchDept;
  });

  // 👉 Group by Department
  const grouped = filteredJobs.reduce((acc, job) => {
    const dept = job?.department || "Others";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(job);
    return acc;
  }, {});

  return (
    <>
      <Header />

      {/* ===========================
            TITLE SECTION
      ============================ */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          JOIN US TODAY AND BECOME PART OF THIS INCREDIBLE JOURNEY!
        </p>

        <h1 className="text-4xl font-bold text-[#0A4FA3] mt-2">
          Find your dream job
        </h1>

        <p className="text-xs text-gray-500 mt-2 max-w-2xl mx-auto">
          At Careervidya, every team member is part of our family.
          We take pride in fostering a culture that values inclusivity,
          transparency, and collaboration.
        </p>

        <p className="text-xs font-semibold text-[#0A4FA3] mt-3">
          TOTAL OPENINGS: {filteredJobs.length}
        </p>
      </div>

      {/* ===========================
            SEARCH + FILTER BOX
      ============================ */}
      <div className="max-w-6xl mx-auto mt-10 flex">
        <div className="bg-[#1666B0] w-[450px] p-6 rounded-lg text-white flex flex-col gap-4">
          <input
            placeholder=" Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded bg-white text-black text-sm w-60"
          />

          <select
            className="px-3 py-2 rounded bg-white text-black text-sm w-60"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">Choose Department</option>
            {deptList.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===========================
            JOB LIST SECTION
      ============================ */}
    {/* ===========================
      JOB LIST SECTION
============================ */}
<div className="max-w-6xl mx-auto mt-10 mb-20">   {/* 👈 Added mb-20 */}
  {loading && <p className="text-center">Loading...</p>}

  <div className="space-y-10">
    {/* No Jobs */}
    {Object.keys(grouped).length === 0 && !loading && (
      <p className="text-center text-gray-500">No jobs found</p>
    )}


          {/* Grouped Jobs */}
          {Object.keys(grouped).map((dept) => (
            <div key={dept}>
              <h2 className="text-[#0A4FA3] text-sm font-semibold mb-3">
                {dept} ({grouped[dept].length} Job)
              </h2>

              <div className="space-y-4">
                {grouped[dept].map((job) => (
                  <div
                    key={job._id}
                    className="
                      bg-[#F1F7FC]
                      border border-gray-200
                      p-4 rounded-md
                      flex items-center justify-between
                    "
                  >
                    {/* LEFT SIDE */}
                    <div
                      onClick={() => openDetail(job)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {job.title}{" "}
                        <span className="text-gray-500">
                          (Job ID: {job.jobId || job._id})
                        </span>
                      </h3>

                      <div className="flex items-center gap-8 text-xs text-gray-600 mt-2">
                        <span>📍 {job.location}</span>
                        <span>⏳ {job.experience || "0-1 years"}</span>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right text-xs">
                      <span className="text-gray-600 block mb-2">Full time</span>

                      <button
                        onClick={() => openDetail(job)}
                        className="text-[#0A4FA3] font-medium flex items-center gap-1"
                      >
                        Apply Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Getintuch />
      <Footer />
    </>
  );
}
