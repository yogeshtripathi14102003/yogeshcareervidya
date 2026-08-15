// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Search, SlidersHorizontal, MapPin, Briefcase, Send } from "lucide-react";
// import Header from "@/app/layout/Header";
// import Footer from "../layout/Footer";
// import Getintuch from "../components/getintuch";

// export default function JobsClient({ initialJobs }) {
//   const router = useRouter();

//   const [jobs] = useState(initialJobs || []);
//   const [search, setSearch] = useState("");
//   const [selectedDept, setSelectedDept] = useState("");

//   // Hydration error fix karne ke liye mounted state
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const allDepartments = [
//     "Counselor",
//     "Human Resource",
//     "Assistant Manager",
//     "Software Development",
//     "Sales & Growth",
//     "Frontend Development",
//     "Backend Development",
//     "DevOps",
//     "Management",
//     "Finance & Accounts",
//     "Digital Marketing",
//     "Software Testing",
//     "IT Support",
//   ];

//   // 👇 Ensures experience always shows with "years" next to the number,
//   // without duplicating it if the backend already sends "years"/"yrs".
//   const formatExperience = (exp) => {
//     if (!exp) return "0 - 1 years";
//     const value = String(exp).trim();
//     if (/year|yr/i.test(value)) return value;
//     return `${value} years`;
//   };

//   const openDetail = (job) => {
//     const id = job.jobId || job.id || job._id;
//     router.push(`/career/${id}`);
//   };

//   const filteredJobs = jobs.filter((job) => {
//     const title = job?.title?.toLowerCase() || "";
//     const dept = job?.department?.toLowerCase() || "";
//     const searchTerm = search.toLowerCase();

//     const matchSearch =
//       title.includes(searchTerm) || dept.includes(searchTerm);

//     const matchDept =
//       selectedDept === "" || job.department === selectedDept;

//     return matchSearch && matchDept;
//   });

//   const grouped = filteredJobs.reduce((acc, job) => {
//     const dept = job?.department || "Others";
//     if (!acc[dept]) acc[dept] = [];
//     acc[dept].push(job);
//     return acc;
//   }, {});

//   return (
//     <>
//       <Header />

//       {/* Banner */}
//       <div className="relative w-full">
//         <img
//           src="/images/career1.jpeg"
//           alt="Career Banner"
//           className="w-full h-auto object-contain"
//         />
//       </div>

//       {/* Intro content */}
//       <div className="text-center mt-12 px-4 max-w-3xl mx-auto">
//         <p className="text-sm md:text-base font-semibold tracking-wide text-gray-700 uppercase">
//           Join us today and become part of this incredible journey!
//         </p>
//         <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A4FA3] mt-3">
//           Find your dream job
//         </h1>
//         <p className="text-gray-500 mt-4 leading-relaxed">
//           At Careervidya, every team member is part of our family. We take
//           pride in fostering a culture that values inclusivity, transparency,
//           and the joy of collaboration. Together, we create extraordinary
//           solutions.
//         </p>
//       </div>

//       {/* Total openings */}
//       <div className="text-center mt-8">
//         <span className="text-lg font-bold text-[#0A4FA3] underline underline-offset-4">
//           TOTAL OPENINGS: {filteredJobs.length}
//         </span>
//       </div>

//       {/* Content: sidebar + jobs */}
//       <div className="max-w-6xl mx-auto mt-8 mb-20 px-4 flex flex-col md:flex-row gap-8">
//         {/* LEFT: Filter sidebar */}
//         <aside className="md:w-72 md:sticky md:top-24 md:self-start">
//           <div className="bg-[#0A4FA3] rounded-2xl p-5 flex flex-col gap-4">
//             <div className="flex items-center gap-2">
//               <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2">
//                 <Search className="w-4 h-4 text-gray-400 shrink-0" />
//                 <input
//                   placeholder="Search"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full ml-2 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
//                 />
//               </div>
//               <button
//                 type="button"
//                 aria-label="Filters"
//                 className="bg-white/10 border border-white/30 rounded-lg p-2 text-white hover:bg-white/20 transition"
//               >
//                 <SlidersHorizontal className="w-4 h-4" />
//               </button>
//             </div>

//             <select
//               value={selectedDept}
//               onChange={(e) => setSelectedDept(e.target.value)}
//               className="w-full px-3 py-2 rounded-lg text-sm outline-none text-white bg-transparent border border-white/40"
//             >
//               <option value="" className="text-gray-800">
//                 Choose Department
//               </option>
//               {allDepartments.map((d) => (
//                 <option key={d} value={d} className="text-gray-800">
//                   {d}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </aside>

//         {/* RIGHT: Job listings */}
//         <div className="flex-1">
//           {Object.keys(grouped).length === 0 ? (
//             <p className="text-center text-gray-500 text-lg mt-10">
//               No job openings found 😕
//             </p>
//           ) : (
//             Object.keys(grouped).map((dept) => (
//               <div key={dept} className="mb-8">
//                 <h2 className="text-lg font-bold text-[#0A4FA3] mb-3">
//                   {dept}
//                 </h2>

//                 <div className="flex flex-col gap-4">
//                   {grouped[dept].map((job) => {
//                     const jobId = job.jobId || job.id || job._id;
//                     return (
//                       <div
//                         key={job._id}
//                         className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-md transition"
//                       >
//                         {/* LEFT */}
//                         <div
//                           onClick={() => openDetail(job)}
//                           className="cursor-pointer flex-1"
//                         >
//                           <div className="flex flex-wrap items-baseline gap-2">
//                             <h3 className="text-base md:text-lg font-bold text-[#0A4FA3]">
//                               {job.title}
//                             </h3>
//                             {jobId && (
//                               <span className="text-xs text-gray-500">
//                                 (Job ID : {jobId})
//                               </span>
//                             )}
//                           </div>

//                           <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
//                             <span className="flex items-center gap-1.5">
//                               <span className="bg-blue-100 text-blue-600 rounded-full p-1 flex items-center justify-center">
//                                 <MapPin className="w-3.5 h-3.5" />
//                               </span>
//                               {job.location || "Not specified"}
//                             </span>
//                             <span className="flex items-center gap-1.5">
//                               <span className="bg-blue-100 text-blue-600 rounded-full p-1 flex items-center justify-center">
//                                 <Briefcase className="w-3.5 h-3.5" />
//                               </span>
//                               {formatExperience(job.experience)}
//                             </span>
//                           </div>
//                         </div>

//                         {/* RIGHT */}
//                         <div className="flex flex-col items-end gap-2 shrink-0">
//                           <span className="text-sm font-bold italic text-gray-800">
//                             {job.type || "Full time"}
//                           </span>

//                           <button
//                             onClick={() => openDetail(job)}
//                             className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-[#0A4FA3] font-medium px-4 py-1.5 rounded-full transition text-sm"
//                           >
//                             Apply Now
//                             <Send className="w-3.5 h-3.5" />
//                           </button>

//                           {isMounted && job.createdAt && (
//                             <span className="text-xs text-gray-400">
//                               {new Date(job.createdAt).toLocaleDateString()}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       <Getintuch />
//       <Footer />
//     </>
//   );
// }


"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  Send,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  FileText,
  Lock,
  ArrowRight,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/app/layout/Header";
import Footer from "../layout/Footer";
import Getintuch from "../components/getintuch";

const FEATURES = [
  { icon: ShieldCheck, title: "Verified Employers", desc: "100% verified job postings" },
  { icon: Sparkles, title: "Smart Job Matching", desc: "Get jobs that fit your profile" },
  { icon: FileText, title: "Career Resources", desc: "Expert tips & guidance" },
  { icon: Lock, title: "Secure & Easy", desc: "Safe & simple process" },
];

const JOBS_PER_PAGE = 6;

export default function JobsClient({ initialJobs }) {
  const router = useRouter();

  const [jobs] = useState(initialJobs || []);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter reset behavior on search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDept, selectedLocation]);

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

  const allLocations = useMemo(() => {
    const set = new Set(
      jobs.map((j) => j.location).filter(Boolean).map((l) => l.trim())
    );
    return Array.from(set).sort();
  }, [jobs]);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const title = job?.title?.toLowerCase() || "";
      const dept = job?.department?.toLowerCase() || "";
      const searchTerm = search.toLowerCase();

      const matchSearch =
        title.includes(searchTerm) || dept.includes(searchTerm);

      const matchDept =
        selectedDept === "" || job.department === selectedDept;

      const matchLocation =
        selectedLocation === "" ||
        (job.location || "").toLowerCase() === selectedLocation.toLowerCase();

      return matchSearch && matchDept && matchLocation;
    });
  }, [jobs, search, selectedDept, selectedLocation]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // Group current page jobs by department
  const groupedPaginatedJobs = useMemo(() => {
    return paginatedJobs.reduce((acc, job) => {
      const dept = job?.department || "Other Roles";
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(job);
      return acc;
    }, {});
  }, [paginatedJobs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const listElement = document.getElementById("job-openings-section");
      if (listElement) {
        listElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      <Header />

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[440px] flex items-center justify-center overflow-hidden bg-slate-950">
        <img
          src="/images/career1.jpeg"
          alt="Career Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A4FA3]/40 via-blue-900/20 to-purple-950/40 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            Careervidya Careers
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mt-6 drop-shadow-md leading-tight">
            Discover Your Next Chapter
          </h1>

          <p className="text-slate-300 mt-4 max-w-2xl text-base md:text-lg font-normal leading-relaxed hidden sm:block">
            Join a vibrant ecosystem built on innovation, transparency, and personal growth. Explore open opportunities below.
          </p>
        </div>
      </section>

      {/* FLOATING SEARCH BAR */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-300/60 border border-slate-100 p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A4FA3]/20 border border-slate-200/80 rounded-xl px-3.5 py-3 transition">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A4FA3]/20 border border-slate-200/80 rounded-xl px-3.5 py-3 transition">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="">All Locations</option>
                {allLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A4FA3]/20 border border-slate-200/80 rounded-xl px-3.5 py-3 transition">
              <LayoutGrid className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {allDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                className="w-full bg-[#0A4FA3] hover:bg-[#083d7f] active:scale-[0.98] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#0A4FA3]/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main id="job-openings-section" className="max-w-5xl mx-auto px-4 py-12 scroll-mt-6">
        {/* SECTION HEADER & COUNTER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-6 mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#0A4FA3] tracking-widest uppercase">
              Current Openings
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Explore Available Positions
            </h2>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[#0A4FA3] text-sm font-bold w-fit shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
            </span>
            {filteredJobs.length} {filteredJobs.length === 1 ? "Opening" : "Openings"}
          </div>
        </div>

        {/* JOB LISTINGS */}
        <section className="space-y-10 min-h-[400px]">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching jobs found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                We couldn't find any positions matching your search criteria. Try modifying your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedDept("");
                  setSelectedLocation("");
                }}
                className="mt-5 text-sm font-semibold text-[#0A4FA3] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            Object.entries(groupedPaginatedJobs).map(([dept, deptJobs]) => (
              <div key={dept} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {dept}
                  </h3>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="grid gap-4">
                  {deptJobs.map((job) => {
                    const jobId = job.jobId || job.id || job._id;
                    return (
                      <div
                        key={jobId}
                        onClick={() => openDetail(job)}
                        className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0A4FA3] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0A4FA3] transition-colors">
                              {job.title}
                            </h4>
                            {jobId && (
                              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                                #{jobId}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-slate-600">
                            <span className="flex items-center gap-1.5 font-medium">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {job.location || "Not specified"}
                            </span>

                            <span className="flex items-center gap-1.5 font-medium">
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              {formatExperience(job.experience)}
                            </span>

                            {isMounted && job.createdAt && (
                              <span className="flex items-center gap-1.5 text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-3 shrink-0">
                          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                            {job.type || "Full time"}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(job);
                            }}
                            className="inline-flex items-center gap-2 bg-[#0A4FA3]/10 hover:bg-[#0A4FA3] text-[#0A4FA3] hover:text-white font-semibold text-xs md:text-sm px-4 py-2 rounded-xl transition-all duration-200"
                          >
                            <span>Apply Now</span>
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 pt-6 gap-4">
            <p className="text-xs md:text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * JOBS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-800">{filteredJobs.length}</span> positions
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? "bg-[#0A4FA3] text-white shadow-md shadow-[#0A4FA3]/25 scale-105"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* FEATURE STRIP */}
        <section className="mt-20 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0A4FA3] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Getintuch />
      <Footer />
    </div>
  );
}