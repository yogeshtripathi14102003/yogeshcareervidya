


"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";

const APPROVAL_LIST = ["UGC", "AICTE", "NAAC", "NBA"];

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApprovals, setSelectedApprovals] = useState([]);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = ["Find University...", "Find College...", "Find Course..."];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getSmartFilters = (query) => {
    const lowerQuery = query.toLowerCase();
    let detectedFees = null;
    let cleanQuery = lowerQuery;
    const feeMatch = lowerQuery.match(/(?:under|below|less than|upto)\s?(\d+k?)/);
    if (feeMatch) {
      let value = feeMatch[1];
      detectedFees = value.includes("k") ? parseInt(value.replace("k", "")) * 1000 : parseInt(value);
      cleanQuery = lowerQuery.replace(feeMatch[0], "").trim();
    }
    return { detectedFees, cleanQuery };
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const { cleanQuery } = getSmartFilters(searchQuery);
      fetchResults(cleanQuery || searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchResults = async (q) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/university/search/all?query=${q}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = searchResults
    .map((result) => {
      const { detectedFees } = getSmartFilters(searchQuery);
      const matchedCourses = result.courses?.filter((course) => {
        const matchesCourseName = course.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFee = detectedFees ? (course.fees || course.minFees || 0) <= detectedFees : true;
        return matchesCourseName && matchesFee;
      }) || [];

      if (selectedApprovals.length > 0) {
        const universityApprovals = result.approvals?.map((a) => a.name.toUpperCase()) || [];
        const hasApprovals = selectedApprovals.every((val) => universityApprovals.includes(val.toUpperCase()));
        if (!hasApprovals) return null;
      }

      const matchesUniversityName = result.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesUniversityName && matchedCourses.length === 0) return null;

      return { ...result, matchedCourses };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F9FAFB]"> {/* Light gray background for contrast */}
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="relative flex-1">
            <input
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full rounded-xl pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-gray-900 transition-all shadow-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {searchQuery.trim() !== "" ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  FILTER BY APPROVAL
                </h3>
                <div className="space-y-2">
                  {APPROVAL_LIST.map((appr) => (
                    <label key={appr} className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer border transition-all ${selectedApprovals.includes(appr) ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100 hover:border-gray-300"}`}>
                      <span className={`text-sm font-medium ${selectedApprovals.includes(appr) ? "text-blue-700" : "text-gray-600"}`}>{appr}</span>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        checked={selectedApprovals.includes(appr)}
                        onChange={() => setSelectedApprovals(prev => prev.includes(appr) ? prev.filter(a => a !== appr) : [...prev, appr])}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">{filteredResults.length}</span> results</p>
                {getSmartFilters(searchQuery).detectedFees && (
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                    BUDGET: UNDER ₹{getSmartFilters(searchQuery).detectedFees.toLocaleString()}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="grid gap-4">
                  {filteredResults.map((result) => (
                    <div key={result._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group">
                      <Link href={`/university/${result.slug || result._id}`} className="block">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{result.name}</h2>
                            <p className="text-sm text-gray-500 font-medium">{result.location || "India"}</p>
                          </div>
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">UNIVERSITY</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <span className="font-bold text-gray-900">₹{result.minFees?.toLocaleString() || "N/A"}</span>
                            <span className="text-xs text-gray-500">min fees</span>
                          </div>
                          <div className="flex gap-2">
                            {result.approvals?.map((a, i) => (
                              <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">{a.name}</span>
                            ))}
                          </div>
                        </div>
                      </Link>

                      {result.matchedCourses.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Matching Courses</p>
                          <div className="grid gap-2">
                            {result.matchedCourses.map((course) => (
                              <div key={course._id || course.name} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-sm font-semibold text-gray-800">{course.name}</span>
                                <span className="text-sm font-bold text-blue-600">₹{course.fees?.toLocaleString() || "Request"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
                  <div className="text-4xl mb-4">😕</div>
                  <h3 className="text-lg font-bold text-gray-900">No universities found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </main>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Search for your future</h2>
            <p className="text-gray-500 mt-2 max-w-xs">Enter a university name, course, or even your budget (e.g. "MBA under 50k")</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchContent />
    </Suspense>
  );
}