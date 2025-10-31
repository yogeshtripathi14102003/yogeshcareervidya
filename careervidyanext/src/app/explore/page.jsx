// "use client";
// import { useState } from "react";
// import { Search, X } from "lucide-react";
// import Header from "../layout/Header";

// export default function ExplorePage() {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");

//   const categories = [
//     { title: "All", subtitle: "Show All Programs" },
//     { title: "PG Courses", subtitle: "After Graduation" },
//     { title: "Executive Education", subtitle: "Working Professionals & CXOs*" },
//     { title: "Doctorate/Ph.D.", subtitle: "Get Dr. Title (After UG + Work Ex)" },
//     { title: "UG Courses", subtitle: "After 12TH" },
//     { title: "Job Guarantee", subtitle: "100% Placement*" },
//     { title: "Study Abroad", subtitle: "Pathway/Hybrid Mode" },
//   ];

//   const programs = [
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "PG Courses" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "PG Courses" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "PG Courses" },
//     { title: "Executive MBA for Working Professionals", subtitle: "12 - 24 Months", compare: "Compare 13 Universities", category: "Executive Education" },
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "UG Courses" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "UG Courses" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "UG Courses" },
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "Job Guarantee" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "Job Guarantee" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "Job Guarantee" },
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "Study Abroad" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "Study Abroad" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "Study Abroad" },
//     { title: "Executive MBA for Working Professionals", subtitle: "12 - 24 Months", compare: "Compare 13 Universities", category: "Executive Education" },
//   ];

//   const filteredPrograms = programs.filter((program) => {
//     const matchesCategory = activeCategory === "All" || program.category?.toLowerCase() === activeCategory.toLowerCase();
//     const matchesSearch =
//       !searchQuery ||
//       program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       program.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       program.compare.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   return (
//     <main className="min-h-screen bg-white px-4 md:px-10 py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar */}
//         <aside className="w-full md:w-1/4">
//           <h2 className="text-lg font-semibold mb-4">Search career vidya</h2>
//           <div className="h-64 md:h-96 overflow-y-auto">
//             <div className="flex flex-col gap-3">
//               {categories.map((cat, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setActiveCategory(cat.title)}
//                   className={`text-left px-4 py-2 rounded-md border flex justify-between items-center cursor-pointer ${
//                     activeCategory === cat.title
//                       ? "bg-blue-600 text-white"
//                       : "hover:bg-blue-50 text-gray-700"
//                   }`}
//                 >
//                   <span>{cat.title}</span>
//                   <span
//                     className={`text-xs ${
//                       activeCategory === cat.title ? "text-blue-100" : "text-blue-600"
//                     }`}
//                   >
//                     {cat.subtitle}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <section className="flex-1 w-full">
//           {/* Search Bar */}
//           <div className="sticky top-0 z-10 bg-white mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder='Search "University"'
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full border rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-400"
//               />
//               {/* Clear Button */}
//               {searchQuery && (
//                 <button
//                   onClick={handleClearSearch}
//                   className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Results Count */}
//           <p className="text-sm text-gray-600 mb-4">
//             Showing {filteredPrograms.length} {activeCategory} programs
//             {searchQuery && ` matching "${searchQuery}"`}
//           </p>

//           {/* Program Cards */}
//           <div className="h-96 overflow-y-auto">
//             {filteredPrograms.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 {filteredPrograms.map((p, i) => (
//                   <div
//                     key={i}
//                     className="border rounded-xl p-4 hover:shadow-md transition"
//                   >
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-semibold text-gray-800">{p.title}</h3>
//                       {p.highlight && (
//                         <span className="text-xs font-bold text-green-600">
//                           ⚡ {p.highlight}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-sm text-blue-600 font-medium mb-1">
//                       {p.subtitle}
//                     </p>
//                     <p className="text-sm text-gray-700">{p.compare}</p>
//                     <a
//                       href="#"
//                       className="text-blue-600 text-sm font-medium mt-2 inline-block"
//                     >
//                       View Specialisations →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-8">No programs found matching your filters.</p>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }
   


"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import Header from "../layout/Header";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { title: "All", subtitle: "Show All Programs" },
    { title: "PG Courses", subtitle: "After Graduation" },
    { title: "Executive Education", subtitle: "Working Professionals & CXOs*" },
    { title: "Doctorate/Ph.D.", subtitle: "Get Dr. Title (After UG + Work Ex)" },
    { title: "UG Courses", subtitle: "After 12TH" },
    { title: "Job Guarantee", subtitle: "100% Placement*" },
    { title: "Study Abroad", subtitle: "Pathway/Hybrid Mode" },
  ];

  const programs = [
    { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "PG Courses" },
    { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "PG Courses" },
    { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "PG Courses" },
    { title: "Executive MBA for Working Professionals", subtitle: "12 - 24 Months", compare: "Compare 13 Universities", category: "Executive Education" },
    { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "UG Courses" },
    { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "UG Courses" },
    { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "UG Courses" },
    { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "Job Guarantee" },
    { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "Job Guarantee" },
    { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "Job Guarantee" },
    { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "Study Abroad" },
    { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "Study Abroad" },
    { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "Study Abroad" },
    { title: "Executive MBA for Working Professionals", subtitle: "12 - 24 Months", compare: "Compare 13 Universities", category: "Executive Education" },
  ];

  const filteredPrograms = programs.filter((program) => {
    const matchesCategory = activeCategory === "All" || program.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.compare.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-white px-4 md:px-10 py-8">
      {/* Add Header here */}
      <Header />

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <h2 className="text-lg font-semibold mb-4">Search career vidya</h2>
          <div className="h-64 md:h-96 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat.title)}
                  className={`text-left px-4 py-2 rounded-md border flex justify-between items-center cursor-pointer ${
                    activeCategory === cat.title
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-50 text-gray-700"
                  }`}
                >
                  <span>{cat.title}</span>
                  <span
                    className={`text-xs ${activeCategory === cat.title ? "text-blue-100" : "text-blue-600"}`}
                  >
                    {cat.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 w-full">
          {/* Search Bar */}
          <div className="sticky top-0 z-10 bg-white mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder='Search "University"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              />
              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredPrograms.length} {activeCategory} programs
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Program Cards */}
          <div className="h-96 overflow-y-auto">
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredPrograms.map((p, i) => (
                  <div
                    key={i}
                    className="border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">{p.title}</h3>
                      {p.highlight && (
                        <span className="text-xs font-bold text-green-600">
                          ⚡ {p.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-1">{p.subtitle}</p>
                    <p className="text-sm text-gray-700">{p.compare}</p>
                    <a
                      href="#"
                      className="text-blue-600 text-sm font-medium mt-2 inline-block"
                    >
                      View Specialisations →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No programs found matching your filters.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
