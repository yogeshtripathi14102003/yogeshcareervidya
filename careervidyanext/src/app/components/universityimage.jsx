



"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/utlis/api.js";

const INITIAL_LIMIT = 18;
const STEP = 6;
const DETAIL_PAGE_LIMIT = 0;

// Priority universities
const PRIORITY_UNIS = [
  "op-jindal-global-online",
  "gla-online",
  "dy-patil-university-online-mumbai",
  "chandigarh-university-online",
  "kurukshetra-university-online",
  "amity-university-online",
];

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");
      let data = res.data?.data || [];

      // Priority sorting
      data.sort((a, b) => {
        const aIndex = PRIORITY_UNIS.indexOf(a.slug);
        const bIndex = PRIORITY_UNIS.indexOf(b.slug);

        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
      });

      setUniversities(data);
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading universities...
      </div>
    );
  }

  const handleViewMore = () => {
    setDisplayLimit((prev) => prev + STEP);
  };

  const handleViewLess = () => {
    setDisplayLimit(INITIAL_LIMIT);
  };

  return (
    <section className="py-12 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-[#002147] leading-tight">
            Explore over 100 online universities & Compare on 30+ factors
          </h2>
          <div className="w-14 h-1 bg-[#0056B3] mt-3 rounded-full"></div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">

          {universities.slice(0, displayLimit).map((uni, index) => {

            const imageUrl = uni.universityImage
              ? uni.universityImage.startsWith("http")
                ? uni.universityImage
                : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
              : "/fallback.png";

            const cardContent = (
              <>
                {/* Logo */}
                <div className="relative w-full h-11 mb-1">
                  <Image
                    src={imageUrl}
                    alt={uni.name || "University"}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Name */}
                <p className="text-gray-800 font-semibold text-[12px] text-center leading-tight">
                  {uni.name}
                </p>
              </>
            );

            // Clickable logic
            const isClickable =
              PRIORITY_UNIS.includes(uni.slug) || index < DETAIL_PAGE_LIMIT;

            const cardClass = `
              bg-white border border-gray-200 rounded-lg p-3 shadow-sm
              flex flex-col items-center justify-center
              w-full h-[140px]
              transition
            `;

            return isClickable ? (
              <Link
                key={uni._id}
                href={`/university/${uni.slug}`}
                className={`${cardClass} cursor-pointer hover:shadow-md`}
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={uni._id}
                className={`${cardClass} cursor-default`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          {displayLimit < universities.length && (
            <button
              onClick={handleViewMore}
              className="bg-[#c15304] text-white px-7 py-2 rounded-lg
                         font-semibold shadow-md hover:opacity-95 transition"
            >
              VIEW MORE →
            </button>
          )}

          {displayLimit > INITIAL_LIMIT && (
            <button
              onClick={handleViewLess}
              className="bg-[#c15304] text-white px-7 py-2 rounded-lg
                         font-semibold shadow-md hover:opacity-95 transition"
            >
              VIEW LESS ↑
            </button>
          )}
        </div>

      </div>
    </section>
  );
}