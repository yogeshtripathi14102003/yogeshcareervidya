"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import Header from "../layout/Header";
import api from "@/utlis/api.js";
import Link from "next/link";
import Footer from "../layout/Footer";
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

  /* Fetch Courses */
  useEffect(() => {
    if (!mounted) return;

    setLoading(true);

    api
      .get("/api/v1/course")
      .then((res) => {
        setCourses(res.data?.courses || []);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [mounted]);

  /* Fetch Universities */
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

  /* Filters */
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      return (
        (category === "All" || c.category === category) &&
        (c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [courses, category, search]);

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [universities, search]);

  /* Course Card */
  const CourseCard = ({ course }) => (
    <Link href={`/course/${course.slug || course._id}`}>
      <div className="bg-white border rounded-lg h-[130px] flex flex-col justify-between shadow-sm hover:shadow-lg transition cursor-pointer">
        <div className="flex justify-center mt-2">
          <img
            src={course.courseLogo?.url || "/placeholder.png"}
            className="w-12 h-12 object-contain"
            alt={course.name}
          />
        </div>

        <h3 className="text-sm font-semibold text-center px-2 line-clamp-2">
          {course.name}
        </h3>

        <button
          className="text-white text-sm py-1.5 rounded-b-lg"
          style={{ background: BLUE }}
        >
          Know More
        </button>
      </div>
    </Link>
  );

  /* University Card */
  const UniversityCard = ({ u }) => {
    const imageUrl = u.universityImage
      ? u.universityImage.startsWith("http")
        ? u.universityImage
        : `${process.env.NEXT_PUBLIC_API_URL}/${u.universityImage}`
      : "/fallback.png";

    return (
      <Link href={`/university/${u.slug || u._id}`}>
        <div className="bg-white border rounded-lg h-[130px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition cursor-pointer">
          <img
            src={imageUrl}
            className="w-16 h-16 object-contain mb-2"
            alt={u.name}
          />

          <p className="text-sm font-semibold text-center px-2 line-clamp-2">
            {u.name}
          </p>
        </div>
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <>
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ========== SIDEBAR FILTER ========== */}
        <aside className="bg-white border rounded-lg p-4 shadow-sm h-fit sticky top-24">

          <h3 className="font-bold text-lg mb-4" style={{ color: BLUE }}>
            Filters
          </h3>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-3 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg"
            />

            {search && (
              <X
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setSearch("")}
              />
            )}
          </div>

          {/* Categories */}
          <div>
            <p className="font-semibold mb-2">Course Type</p>

            <div className="flex flex-col gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`px-3 py-2 rounded text-sm text-left transition
                  ${
                    category === c.key
                      ? "text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={
                    category === c.key
                      ? { background: BLUE }
                      : {}
                  }
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <section className="lg:col-span-3">

          {/* Courses */}
          <h2 className="text-2xl font-bold mb-4" style={{ color: BLUE }}>
            Courses 
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[130px] bg-gray-200 rounded-lg animate-pulse"
                />
              ))
            ) : (
              filteredCourses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))
            )}
          </div>

          {/* Universities */}
          <h2
            className="text-2xl font-bold mt-12 mb-4"
            style={{ color: BLUE }}
          >
            Universities ({filteredUniversities.length})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {loadingUni ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[130px] bg-gray-200 rounded-lg animate-pulse"
                />
              ))
            ) : (
              filteredUniversities.map((u) => (
                <UniversityCard key={u._id} u={u} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}