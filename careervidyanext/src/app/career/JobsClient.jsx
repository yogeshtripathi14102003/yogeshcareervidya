"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Briefcase, Send } from "lucide-react";
import Header from "@/app/layout/Header";
import Footer from "../layout/Footer";
import Getintuch from "../components/getintuch";

export default function JobsClient({ initialJobs }) {
  const router = useRouter();

  const [jobs] = useState(initialJobs || []);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  // Hydration error fix karne ke liye mounted state
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // 👇 Ensures experience always shows with "years" next to the number,
  // without duplicating it if the backend already sends "years"/"yrs".
  const formatExperience = (exp) => {
    if (!exp) return "0 - 1 years";
    const value = String(exp).trim();
    if (/year|yr/i.test(value)) return value;
    return `${value} years`;
  };

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
      <div className="relative w-full">
        <img
          src="/images/career1.jpeg"
          alt="Career Banner"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Intro content */}
      <div className="text-center mt-12 px-4 max-w-3xl mx-auto">
        <p className="text-sm md:text-base font-semibold tracking-wide text-gray-700 uppercase">
          Join us today and become part of this incredible journey!
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A4FA3] mt-3">
          Find your dream job
        </h1>
        <p className="text-gray-500 mt-4 leading-relaxed">
          At Careervidya, every team member is part of our family. We take
          pride in fostering a culture that values inclusivity, transparency,
          and the joy of collaboration. Together, we create extraordinary
          solutions.
        </p>
      </div>

      {/* Total openings */}
      <div className="text-center mt-8">
        <span className="text-lg font-bold text-[#0A4FA3] underline underline-offset-4">
          TOTAL OPENINGS: {filteredJobs.length}
        </span>
      </div>

      {/* Content: sidebar + jobs */}
      <div className="max-w-6xl mx-auto mt-8 mb-20 px-4 flex flex-col md:flex-row gap-8">
        {/* LEFT: Filter sidebar */}
        <aside className="md:w-72 md:sticky md:top-24 md:self-start">
          <div className="bg-[#0A4FA3] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full ml-2 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
              <button
                type="button"
                aria-label="Filters"
                className="bg-white/10 border border-white/30 rounded-lg p-2 text-white hover:bg-white/20 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none text-white bg-transparent border border-white/40"
            >
              <option value="" className="text-gray-800">
                Choose Department
              </option>
              {allDepartments.map((d) => (
                <option key={d} value={d} className="text-gray-800">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* RIGHT: Job listings */}
        <div className="flex-1">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">
              No job openings found 😕
            </p>
          ) : (
            Object.keys(grouped).map((dept) => (
              <div key={dept} className="mb-8">
                <h2 className="text-lg font-bold text-[#0A4FA3] mb-3">
                  {dept}
                </h2>

                <div className="flex flex-col gap-4">
                  {grouped[dept].map((job) => {
                    const jobId = job.jobId || job.id || job._id;
                    return (
                      <div
                        key={job._id}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-md transition"
                      >
                        {/* LEFT */}
                        <div
                          onClick={() => openDetail(job)}
                          className="cursor-pointer flex-1"
                        >
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3 className="text-base md:text-lg font-bold text-[#0A4FA3]">
                              {job.title}
                            </h3>
                            {jobId && (
                              <span className="text-xs text-gray-500">
                                (Job ID : {jobId})
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <span className="bg-blue-100 text-blue-600 rounded-full p-1 flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5" />
                              </span>
                              {job.location || "Not specified"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="bg-blue-100 text-blue-600 rounded-full p-1 flex items-center justify-center">
                                <Briefcase className="w-3.5 h-3.5" />
                              </span>
                              {formatExperience(job.experience)}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-sm font-bold italic text-gray-800">
                            {job.type || "Full time"}
                          </span>

                          <button
                            onClick={() => openDetail(job)}
                            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-[#0A4FA3] font-medium px-4 py-1.5 rounded-full transition text-sm"
                          >
                            Apply Now
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {isMounted && job.createdAt && (
                            <span className="text-xs text-gray-400">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Getintuch />
      <Footer />
    </>
  );
}