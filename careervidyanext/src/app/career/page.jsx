

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Header from "@/app/layout/Header";
// import api from "@/utlis/api";
// import Footer from "../layout/Footer";
// import Getintuch from "../components/getintuch";
// export default function Jobs() {
//   const router = useRouter();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [selectedDept, setSelectedDept] = useState("");

//   useEffect(() => {
//     api
//       .get("/api/v1/addjob")
//       .then((res) => {
//         let jobList = res.data.data || res.data.jobs || res.data || [];
//         if (!Array.isArray(jobList)) jobList = [];
//         setJobs(jobList);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   // 👉 Job Detail Route
//   const openDetail = (job) => {
//     const id = job.jobId || job.id || job._id;
//     router.push(`/career/${id}`);
//   };

//   // 👉 Department List
//   const deptList = [
//     ...new Set(
//       jobs
//         .map((j) => j?.department)
//         .filter((d) => d && d.trim() !== "")
//     ),
//   ];

//   // 👉 Filter Logic
//   const filteredJobs = jobs.filter((job) => {
//     const title = job?.title?.toLowerCase() || "";
//     const dept = job?.department?.toLowerCase() || "";

//     const matchSearch =
//       title.includes(search.toLowerCase()) ||
//       dept.includes(search.toLowerCase());

//     const matchDept =
//       selectedDept === "" || job.department === selectedDept;

//     return matchSearch && matchDept;
//   });

//   // 👉 Group by Department
//   const grouped = filteredJobs.reduce((acc, job) => {
//     const dept = job?.department || "Others";
//     if (!acc[dept]) acc[dept] = [];
//     acc[dept].push(job);
//     return acc;
//   }, {});

//   return (
//     <>
//       <Header />

//       {/* ===========================
//             TITLE SECTION
//       ============================ */}
//       <div className="text-center mt-6">
//         <p className="text-sm text-gray-600">
//           JOIN US TODAY AND BECOME PART OF THIS INCREDIBLE JOURNEY!
//         </p>

//         <h1 className="text-4xl font-bold text-[#0A4FA3] mt-2">
//           Find your dream job
//         </h1>

//         <p className="text-xs text-gray-500 mt-2 max-w-2xl mx-auto">
//           At Careervidya, every team member is part of our family.
//           We take pride in fostering a culture that values inclusivity,
//           transparency, and collaboration.
//         </p>

//         <p className="text-xs font-semibold text-[#0A4FA3] mt-3">
//           TOTAL OPENINGS: {filteredJobs.length}
//         </p>
//       </div>

//       {/* ===========================
//             SEARCH + FILTER BOX
//       ============================ */}
//       <div className="max-w-6xl mx-auto mt-10 flex">
//         <div className="bg-[#1666B0] w-[450px] p-6 rounded-lg text-white flex flex-col gap-4">
//           <input
//             placeholder=" Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-3 py-2 rounded bg-white text-black text-sm w-60"
//           />

//           <select
//             className="px-3 py-2 rounded bg-white text-black text-sm w-60"
//             value={selectedDept}
//             onChange={(e) => setSelectedDept(e.target.value)}
//           >
//             <option value="">Choose Department</option>
//             {deptList.map((d) => (
//               <option key={d}>{d}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ===========================
//             JOB LIST SECTION
//       ============================ */}
//     {/* ===========================
//       JOB LIST SECTION
// ============================ */}
// <div className="max-w-6xl mx-auto mt-10 mb-20">   {/* 👈 Added mb-20 */}
//   {loading && <p className="text-center">Loading...</p>}

//   <div className="space-y-10">
//     {/* No Jobs */}
//     {Object.keys(grouped).length === 0 && !loading && (
//       <p className="text-center text-gray-500">No jobs found</p>
//     )}


//           {/* Grouped Jobs */}
//           {Object.keys(grouped).map((dept) => (
//             <div key={dept}>
//               <h2 className="text-[#0A4FA3] text-sm font-semibold mb-3">
//                 {dept} ({grouped[dept].length} Job)
//               </h2>

//               <div className="space-y-4">
//                 {grouped[dept].map((job) => (
//                   <div
//                     key={job._id}
//                     className="
//                       bg-[#F1F7FC]
//                       border border-gray-200
//                       p-4 rounded-md
//                       flex items-center justify-between
//                     "
//                   >
//                     {/* LEFT SIDE */}
//                     <div
//                       onClick={() => openDetail(job)}
//                       className="cursor-pointer"
//                     >
//                       <h3 className="font-semibold text-gray-800 text-sm">
//                         {job.title}{" "}
//                         <span className="text-gray-500">
//                           (Job ID: {job.jobId || job._id})
//                         </span>
//                       </h3>

//                       <div className="flex items-center gap-8 text-xs text-gray-600 mt-2">
//                         <span>📍 {job.location}</span>
//                         <span>⏳ {job.experience || "0-1 years"}</span>
//                       </div>
//                     </div>

//                     {/* RIGHT SIDE */}
//                     <div className="text-right text-xs">
//                       <span className="text-gray-600 block mb-2">Full time</span>

//                       <button
//                         onClick={() => openDetail(job)}
//                         className="text-[#0A4FA3] font-medium flex items-center gap-1"
//                       >
//                         Apply Now →
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Getintuch />
//       <Footer />
//     </>
//   );
// }


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

  // ✅ 1. Model ke mutabiq saare departments ki list
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

  const openDetail = (job) => {
    const id = job.jobId || job.id || job._id;
    router.push(`/career/${id}`);
  };

  // ✅ 2. Filter Logic: Search aur Department dono ko handle karta hai
  const filteredJobs = jobs.filter((job) => {
    const title = job?.title?.toLowerCase() || "";
    const dept = job?.department?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    const matchSearch = title.includes(searchTerm) || dept.includes(searchTerm);
    const matchDept = selectedDept === "" || job.department === selectedDept;

    return matchSearch && matchDept;
  });

  // ✅ 3. Grouping Logic: 
  // Agar koi department select hai, toh sirf wahi group dikhega
  // Agar select nahi hai, toh wahi departments dikhenge jinme jobs hain
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
        <img
          src="/images/career1.jpeg"
          alt="Contact Banner"
          className="w-full h-full object-cover object-center "
        />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center px-4">
  
  <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
    Accelerate your career with Careervidya
  </h1>

  {/* Sub text niche */}
  <p className="mt-4 text-white text-sm md:text-lg drop-shadow-md max-w-2xl">
Unlock Your True Potential With Expert Guidance And Industry-focused Learning. Turn Your Dreams Into Real Success With Careervidya By Your Side
  </p>

</div>
        
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 uppercase tracking-wide">
          Join us today and become part of this incredible journey!
        </p>
        <h1 className="text-4xl font-bold text-[#0A4FA3] mt-2">
          Find your dream job
        </h1>
        <p className="text-xs text-gray-500 mt-2 max-w-2xl mx-auto">
          At Careervidya, every team member is part of our family. We foster a culture of inclusivity and collaboration.
        </p>
        <p className="text-xs font-semibold text-[#0A4FA3] mt-3">
          TOTAL OPENINGS: {filteredJobs.length}
        </p>
      </div>

      {/* SEARCH + FILTER BOX */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-[#1666B0] p-6 rounded-lg text-white flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Search Keyword</label>
            <input
              placeholder="Job title or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded bg-white text-black text-sm w-64 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Department</label>
            <select
              className="px-3 py-2 rounded bg-white text-black text-sm w-64 outline-none cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {allDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* JOB LIST SECTION */}
      <div className="max-w-6xl mx-auto mt-10 mb-20 min-h-[300px]">
        {loading ? (
          <p className="text-center py-10">Loading jobs...</p>
        ) : (
          <div className="space-y-10">
            {Object.keys(grouped).length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                <p className="text-gray-500 font-medium">No job openings found for this selection.</p>
                <button 
                  onClick={() => {setSearch(""); setSelectedDept("");}}
                  className="text-indigo-600 text-sm underline mt-2"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              Object.keys(grouped).map((dept) => (
                <div key={dept} className="animate-fadeIn">
                  <h2 className="text-[#0A4FA3] text-sm font-bold mb-4 border-l-4 border-[#0A4FA3] pl-2">
                    {dept.toUpperCase()} ({grouped[dept].length} {grouped[dept].length > 1 ? 'Jobs' : 'Job'})
                  </h2>

                  <div className="grid gap-4">
                    {grouped[dept].map((job) => (
                      <div
                        key={job._id}
                        className="bg-[#F1F7FC] border border-transparent hover:border-indigo-300 hover:shadow-md transition-all p-5 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div
                          onClick={() => openDetail(job)}
                          className="cursor-pointer flex-1"
                        >
                          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                            {job.title}
                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-normal">
                              {job.jobId}
                            </span>
                          </h3>

                          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600 mt-2">
                            <span className="flex items-center gap-1">📍 {job.location}</span>
                            <span className="flex items-center gap-1">💼 {job.experience}</span>
                            <span className="flex items-center gap-1 text-green-600 font-medium">💰 ₹{job.salaryRange}</span>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                          <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-tighter mb-1">Full Time</span>
                          <button
                            onClick={() => openDetail(job)}
                            className="bg-[#0A4FA3] text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-[#083d7e] transition-colors"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Getintuch />
      <Footer />
    </>
  );
}