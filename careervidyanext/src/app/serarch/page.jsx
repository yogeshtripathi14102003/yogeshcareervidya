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
    }, 1500);
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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="relative flex-1 flex items-center">
            <span className="absolute left-4 text-gray-400 text-xl pointer-events-none">🔍</span>
            <input
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full rounded-xl px-12 py-3.5 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-gray-800 text-lg transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {searchQuery.trim() !== "" ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <aside className="w-full md:w-48 flex-shrink-0">
              <h3 className="font-bold text-xs text-gray-400 uppercase mb-4 tracking-widest">Filters</h3>
              <div className="flex flex-wrap md:flex-col gap-2">
                {APPROVAL_LIST.map((appr) => (
                  <button
                    key={appr}
                    onClick={() => setSelectedApprovals(prev => prev.includes(appr) ? prev.filter(a => a !== appr) : [...prev, appr])}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${selectedApprovals.includes(appr) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-100 hover:border-blue-400"}`}
                  >
                    {appr}
                  </button>
                ))}
              </div>
            </aside>

            {/* Results */}
            <main className="flex-1">
              {getSmartFilters(searchQuery).detectedFees && (
                <div className="mb-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                  <span>💰 Budget: Under ₹{getSmartFilters(searchQuery).detectedFees}</span>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-gray-400 animate-pulse font-medium text-sm">Searching...</div>
                ) : filteredResults.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {filteredResults.map((result) => (
                      <div key={result._id} className="p-5 hover:bg-blue-50/50 transition-all rounded-lg mb-2">
                        {/* University Card Clickable */}
                        <Link href={`/${result.slug || result._id}`} className="block">
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-900">{result.name}</h2>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">University</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1">
                            {result.minFees ? `Starting from ₹${result.minFees}` : "Fees on request"}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.approvals?.map((a, i) => (
                              <span key={i} className="text-[10px] text-gray-400 font-bold uppercase">{a.name}{i !== result.approvals.length - 1 ? "," : ""}</span>
                            ))}
                          </div>
                        </Link>

                        {/* Courses Info (non-clickable) */}
                        {result.matchedCourses.length > 0 && (
                          <div className="mt-2 border-t pt-2 flex flex-col gap-1">
                            {result.matchedCourses.map((course) => (
                              <div
                                key={course._id || course.name}
                                className="text-[12px] px-2 py-1 rounded flex justify-between items-center bg-gray-50"
                              >
                                <span>{course.name}</span>
                                <span className="text-blue-600 font-bold text-[10px]">
                                  {course.fees ? `₹${course.fees}` : "Fees on request"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center text-gray-400 text-sm">No results found</div>
                )}
              </div>
            </main>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-6 opacity-20">🔎</div>
            <h2 className="text-xl font-bold text-gray-300 tracking-tight">Search for Universities or Courses</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
