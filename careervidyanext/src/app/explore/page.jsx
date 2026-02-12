

"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import Header from "../layout/Header";
import api from "@/utlis/api.js";
import Link from "next/link";

/* ---------- COLORS ---------- */
const BLUE = "#0056B3";

export default function ExplorePage() {
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUni, setLoadingUni] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mounted, setMounted] = useState(false);

  const categories = [
    { key: "All", title: "All Courses" },
    { key: "PG", title: "PG Courses" },
    { key: "UG", title: "UG Courses" },
    { key: "ExecutiveEducation", title: "Executive Education" },
    { key: "Doctorate", title: "Doctorate" },
  ];

  useEffect(() => setMounted(true), []);

  /* ---------- FETCH COURSES ---------- */
  useEffect(() => {
    if (!mounted) return;
    setLoading(true);

    api
      .get("/api/v1/course")
      .then((res) => {
        const data = res.data?.courses || [];
        setCourses([...data].reverse());
      })
      .finally(() => setLoading(false));
  }, [mounted]);

  /* ---------- FETCH UNIVERSITIES (SAME AS UNIVERSITY PAGE) ---------- */
  useEffect(() => {
    if (!mounted) return;
    setLoadingUni(true);

    api
      .get("/api/v1/university")
      .then((res) => {
        setUniversities(res.data?.data || []);
      })
      .catch(() => setUniversities([]))
      .finally(() => setLoadingUni(false));
  }, [mounted]);

  /* ---------- FILTERED COURSES ---------- */
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchCategory =
        category === "All" || c.category === category;

      const matchSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [courses, category, search]);

  /* ---------- FILTERED UNIVERSITIES ---------- */
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [universities, search]);

  /* ---------- COURSE CARD (UNCHANGED) ---------- */
  const CourseCard = ({ course, index }) => {
    const clickable = index < 25;

    const card = (
      <div
        className={`bg-white border rounded-lg h-[160px] flex flex-col justify-between shadow-sm
        ${clickable ? "hover:shadow-lg cursor-pointer" : "opacity-70"}`}
      >
        <div className="flex justify-center mt-3">
          <img
            src={course.courseLogo?.url || "/placeholder.png"}
            className="w-8 h-8"
            alt={course.name}
          />
        </div>

        <h3 className="text-sm font-semibold text-center px-2 line-clamp-2">
          {course.name}
        </h3>

        <button
          disabled={!clickable}
          className="text-white text-sm py-2"
          style={{ background: BLUE }}
        >
          Know More
        </button>
      </div>
    );

    return clickable ? (
      <Link href={`/course/${course.slug || course._id}`}>
        {card}
      </Link>
    ) : (
      card
    );
  };

  /* ---------- UNIVERSITY CARD (UI SAME, ONLY CLICK LOGIC) ---------- */
  const UniversityCard = ({ u, index }) => {
    const clickable = index < 8;

    const imageUrl = u.universityImage
      ? u.universityImage.startsWith("http")
        ? u.universityImage
        : `${process.env.NEXT_PUBLIC_API_URL}/${u.universityImage.replace(/^\/+/, "")}`
      : "/fallback.png";

    const card = (
      <div
        className={`bg-white border rounded-lg h-[160px] shadow-sm
        flex flex-col items-center justify-center
        ${clickable ? "hover:shadow-lg cursor-pointer" : "opacity-70"}`}
      >
        <img
          src={imageUrl}
          alt={u.name}
          className="w-12 h-12 object-contain mb-3"
        />
        <p className="text-sm font-semibold text-center px-2 line-clamp-2">
          {u.name}
        </p>
      </div>
    );

    return clickable ? (
      <Link href={`/university/${u.slug || u._id}`}>
        {card}
      </Link>
    ) : (
      card
    );
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 mt-6">

        {/* ---------- SEARCH BAR ---------- */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course or university..."
            className="w-full pl-10 pr-10 py-2 border rounded-lg"
          />
          {search && (
            <X
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setSearch("")}
            />
          )}
        </div>

        {/* ---------- CATEGORY FILTER ---------- */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold
              ${category === c.key ? "text-white" : "text-gray-700"}`}
              style={category === c.key ? { background: BLUE } : {}}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* ---------- COURSES ---------- */}
        <h2 className="text-2xl font-bold mb-4" style={{ color: BLUE }}>
          Courses ({filteredCourses.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-[160px] bg-gray-100 animate-pulse" />
            ))
          ) : (
            filteredCourses.map((c, i) => (
              <CourseCard key={c._id} course={c} index={i} />
            ))
          )}
        </div>

        {/* ---------- UNIVERSITIES (ALL SHOW, ONLY TOP 8 CLICKABLE) ---------- */}
        <h2 className="text-2xl font-bold mt-12 mb-4" style={{ color: BLUE }}>
          Universities ({filteredUniversities.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loadingUni ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-[160px] bg-gray-100 animate-pulse" />
            ))
          ) : (
            filteredUniversities.map((u, i) => (
              <UniversityCard key={u._id} u={u} index={i} />
            ))
          )}
        </div>

      </div>
    </main>
  );
}
