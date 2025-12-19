



"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import Link from "next/link"; // ❌ Not needed anymore
import api from "@/utlis/api.js";

export default function UniversitiesPage() {
  // State to store the list of universities fetched from API
  const [universities, setUniversities] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to control how many universities to display initially and on "View More"
  const [displayLimit, setDisplayLimit] = useState(18);

  // Function to fetch universities from the API
  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");
      // Safely set universities or empty array if data is missing
      setUniversities(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch universities when the component mounts
  useEffect(() => {
    fetchUniversities();
  }, []);

  // Show loading message while fetching
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading universities...
      </div>
    );
  }

  // Show message if no universities found
  if (universities.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        No universities found.
      </div>
    );
  }

  // Handler for "View More" button
  const handleViewMore = () => {
    setDisplayLimit(prevLimit => prevLimit + 6); 
  };

  return (
    <section className="py-16 bg-white text-center">
      {/* Page heading */}
      <h2 className="text-4xl font-bold mb-8 text-gray-900">
        Explore over 100 online universities & Compare on 30+ factors
      </h2>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Grid container for university cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
          {universities.slice(0, displayLimit).map((uni) => {
            // Determine image URL: either full URL, API URL, or fallback
            const imageUrl = uni.universityImage
              ? uni.universityImage.startsWith("http")
                ? uni.universityImage
                : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
              : "/fallback.png";

            const courseCount = uni.courses?.length || 0; // optional: number of courses

            return (
              <div
                key={uni._id}
                className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center w-full max-w-[150px] h-[180px]"
              >
                {/* University logo */}
                <div className="relative w-24 h-12 mb-2">
                  <Image
                    src={imageUrl}
                    alt={uni.name || "University"}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* University name */}
                <p className="text-gray-700 font-semibold text-xs text-center leading-tight mb-1">
                  {uni.name}
                </p>
                {/* Optional: display number of courses */}
                {/* <p className="text-xs text-gray-500">{courseCount} Courses</p> */}
              </div>
            );
          })}
        </div>
      </div>

      {/* "View More" button */}
      {universities.length > displayLimit && (
        <button 
          className="mt-10 bg-[#0056B3] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#003d82] transition"
          onClick={handleViewMore}
        >
          VIEW MORE UNIVERSITIES →
        </button>
      )}
    </section>
  );
}
