"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/layout/Header";
import Footer from "../layout/Footer";
import Getintuch from "../components/getintuch";

export default function JobsClient({ initialJobs }) {
  const router = useRouter();
  const [jobs] = useState(initialJobs);
  const [loading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const allDepartments = [
    "Counselor", "Human Resource", "Assistant Manager", "Software Development",
    "Sales & Growth", "Frontend Development", "Backend Development", "DevOps",
    "Management", "Finance & Accounts", "Digital Marketing", "Software Testing", "IT Support",
  ];

  const openDetail = (job) => {
    const id = job.jobId || job.id || job._id;
    router.push(`/career/${id}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job?.title?.toLowerCase() || "";
    const dept = job?.department?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();
    const matchSearch = title.includes(searchTerm) || dept.includes(searchTerm);
    const matchDept = selectedDept === "" || job.department === selectedDept;
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
      <div className="relative overflow-hidden w-auto md:h-[70vh] h-[30vh]">
        <img src="/images/career1.jpeg" alt="Contact Banner" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">Accelerate your career with Careervidya</h1>
          <p className="mt-4 text-white text-sm md:text-lg drop-shadow-md max-w-2xl">
            Unlock Your True Potential With Expert Guidance And Industry-focused Learning. Turn Your Dreams Into Real Success With Careervidya By Your Side
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 uppercase tracking-wide">Join us today and become part of this incredible journey!</p>
        <h1 className="text-4xl font-bold text-[#0A4FA3] mt-2">Find your dream job</h1>
        <p className="text-xs text-gray-500 mt-2 max-w-2xl mx-auto">At Careervidya, every team member is part of our family. We foster a culture of inclusivity and collaboration.</p>
        <p className="text-xs font-semibold text-[#0A4FA3] mt-3">TOTAL OPENINGS: {filteredJobs.length}</p>
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-[#1666B0] p-6 rounded-lg text-white flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Search Keyword</label>
            <input placeholder="Job title or skill..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 rounded bg-white text-black text-sm w-64 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Department</label>
            <select className="px-3 py-2 rounded bg-white text-black text-sm w-64 outline-none cursor-pointer" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="">All Departments</option>
              {allDepartments.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 mb-20 min-h-[300px]">
        <div className="space-y-10">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-500 font-medium">No job openings found for this selection.</p>
              <button onClick={() => {setSearch(""); setSelectedDept("");}} className="text-indigo-600 text-sm underline mt-2">Clear all filters</button>
            </div>
          ) : (
            Object.keys(grouped).map((dept) => (
              <div key={dept} className="animate-fadeIn">
                <h2 className="text-[#0A4FA3] text-sm font-bold mb-4 border-l-4 border-[#0A4FA3] pl-2">{dept.toUpperCase()} ({grouped[dept].length} {grouped[dept].length > 1 ? 'Jobs' : 'Job'})</h2>
                <div className="grid gap-4">
                  {grouped[dept].map((job) => (
                    <div key={job._id} className="bg-[#F1F7FC] border border-transparent hover:border-indigo-300 hover:shadow-md transition-all p-5 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div onClick={() => openDetail(job)} className="cursor-pointer flex-1">
                        <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">{job.title} <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-normal">{job.jobId}</span></h3>
                        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600 mt-2">
                          <span className="flex items-center gap-1">📍 {job.location}</span>
                          <span className="flex items-center gap-1">💼 {job.experience}</span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">💰 ₹{job.salaryRange}</span>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                        <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-tighter mb-1">Full Time</span>
                        <button onClick={() => openDetail(job)} className="bg-[#0A4FA3] cursor-pointer text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-[#083d7e] transition-colors">Apply Now</button>
                      </div>
                    </div>
                  ))}
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