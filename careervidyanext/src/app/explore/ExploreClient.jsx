"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Header from "../layout/Header";
import Link from "next/link";
import Footer from "../layout/Footer";

const BLUE = "#0056B3";

export default function ExploreClient({ initialData }) {
  // ✅ SEO Fix: Initial state mein server data pass kiya
  const [courses] = useState(initialData.initialCourses);
  const [universities] = useState(initialData.initialUnis);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    { key: "All", title: "All Courses" },
    { key: "PG", title: "PG Courses" },
    { key: "UG", title: "UG Courses" },
    { key: "ExecutiveEducation", title: "Executive Education" },
    { key: "Doctorate", title: "Doctorate" },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = category === "All" || c.category === category;
      const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                            c.description?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, category, search]);

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [universities, search]);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* SIDEBAR */}
          <aside className="hidden lg:block text-[#000] border rounded-lg p-4 shadow-sm h-fit sticky top-24">
            <h3 className="font-bold text-lg mb-4" style={{ color: BLUE }}>Filters</h3>
            <div className="relative mb-5">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or universities..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {search && <X className="absolute right-3 top-3 cursor-pointer" onClick={() => setSearch("")} />}
            </div>
            <div>
              <p className="font-semibold mb-2">Course Type</p>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`px-3 py-2 rounded text-sm text-left transition ${category === c.key ? "text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    style={category === c.key ? { background: BLUE } : {}}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN SECTION */}
          <section className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4 text-[#000]" style={{ color: BLUE }}>
              Found {filteredCourses.length} Courses
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course) => (
                <Link key={course._id} href={`/course/${course.slug || course._id}`}>
                  <div className="bg-white border rounded-lg h-[130px] flex flex-col justify-between shadow-sm hover:shadow-lg transition cursor-pointer">
                    <div className="flex justify-center mt-2">
                      <img src={course.courseLogo?.url || "/placeholder.png"} className="w-12 h-12 object-contain" alt={course.name} />
                    </div>
                    <h3 className="text-[11px] md:text-xs font-black text-center px-2 line-clamp-2 uppercase">{course.name}</h3>
                    <div className="text-white text-[10px] text-center py-1.5 rounded-b-lg font-bold" style={{ background: BLUE }}>KNOW MORE</div>
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4 text-[#000]" style={{ color: BLUE }}>
              Universities ({filteredUniversities.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUniversities.map((u) => (
                <Link key={u._id} href={`/university/${u.slug || u._id}`}>
                  <div className="bg-white border rounded-lg h-[130px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition cursor-pointer p-2">
                    <img 
                      src={u.universityImage?.startsWith("http") ? u.universityImage : `${process.env.NEXT_PUBLIC_API_URL}/${u.universityImage}`} 
                      className="w-16 h-10 object-contain mb-2" 
                      alt={u.name} 
                    />
                    <p className="text-[10px] md:text-xs font-bold text-center line-clamp-2 uppercase">{u.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}