"use client";
import { useState, useEffect, useRef } from "react";
// Lucide Icons: Added icons for different categories
import { 
    Search, X, 
    BookOpen, University, ArrowRight, 
    GraduationCap, Briefcase, Microscope, 
    Layers, BookMarked
} from "lucide-react"; 
import Header from "../layout/Header"; 
import api from "@/utlis/api.js"; 
import Image from "next/image"; 
import Link from "next/link"; 

// --- Custom Colors/Styles ---
const SCREENSHOT_BLUE = "#0056B3";
const SCREENSHOT_ORANGE = "#F58220";
const BUTTON_BLUE_CLASS = `bg-[${SCREENSHOT_BLUE}] text-white text-sm font-semibold py-2 transition-all hover:opacity-90 w-full`; 

// --- Icon Mapping Utility ---
const IconMap = {
    All: Layers,
    PG: GraduationCap,
    ExecutiveEducation: Briefcase,
    UG: BookMarked,
    Doctorate: Microscope,
    Default: BookOpen,
};

// --- Custom Category Icon Component ---
const CategoryIcon = ({ isSelected, iconKey }) => {
    const Icon = IconMap[iconKey] || IconMap.Default;

    return (
        <div
            className={`p-2.5 rounded flex justify-center items-center transition-all ${
                isSelected
                    ? "bg-gradient-to-r from-[#0056B3] to-[#F58220] text-white" 
                    : "bg-gray-100 text-gray-600"
            }`}
        >
            <Icon className="w-5 h-5" /> 
        </div>
    );
};


export default function ExplorePage() {
    // ---------- STATES ----------
    const [courses, setCourses] = useState([]);
    const [universities, setUniversities] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [loadingUniversities, setLoadingUniversities] = useState(true); 
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // ---------- CATEGORY DATA ----------
    const categories = [
        { key: "All", title: "All Courses", subtitle: "↳ Browse everything", iconKey: "All" },
        { key: "PG", title: "PG Courses", subtitle: "↳ After Graduation", iconKey: "PG" },
        {
            key: "ExecutiveEducation",
            title: "Executive Education",
            subtitle: "↳ For Working Professionals",
            iconKey: "ExecutiveEducation",
        },
        { key: "UG", title: "UG Courses", subtitle: "↳ After 12th", iconKey: "UG" },
        { key: "Doctorate", title: "Doctorate", subtitle: "↳ Get Dr. Title", iconKey: "Doctorate" },
    ];

    // --- ENABLE CLIENT RENDER (Hydration Fix) ---
    useEffect(() => setIsMounted(true), []);

    // --- FETCH COURSES (Updated to handle filtering) ---
    useEffect(() => {
        if (!isMounted) return;
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const categoryParam = selectedCategory === "All" ? "" : `category=${selectedCategory}`;
                const searchParam = searchQuery ? `search=${searchQuery}` : "";
                
                // Note: Assuming API supports combined search and category filtering.
                // If not, client-side filtering below handles it.
                const url = `/api/v1/course?${categoryParam}${categoryParam && searchParam ? '&' : ''}${searchParam}`;
                const res = await api.get(url);
                
                let data = res.data.courses || [];
    
                // Client-side search filtering (Fallback if API doesn't support search param)
                if (searchQuery && res.status !== 200) { 
                    data = data.filter(
                        (course) =>
                            course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
    
                setCourses(data);
            } catch (err) {
                console.error("❌ Error fetching courses:", err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [isMounted, selectedCategory, searchQuery]);
    
    // --- FETCH AND FILTER UNIVERSITIES (Updated to handle filtering) ---
    useEffect(() => {
        if (!isMounted) return;
        const fetchUniversities = async () => {
            setLoadingUniversities(true);
            try {
                // Fetching all universities for simplicity, assuming client-side filtering for search
                // For production, you should update the API call to filter on the server.
                const res = await api.get("/api/v1/university"); 
                let data = res.data?.universities || res.data?.data || []; 
    
                if (searchQuery) {
                    data = data.filter((university) => 
                        university.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        university.location?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
                
                setUniversities(data); 
            } catch (err) {
                console.error("❌ Error fetching universities:", err);
                setUniversities([]); 
            } finally {
                setLoadingUniversities(false);
            }
        };
        fetchUniversities();
    }, [isMounted, searchQuery]); 

    // --- UTILITY FUNCTIONS ---
    const handleClearSearch = () => setSearchQuery("");

    // ---------- COURSE CARD (Updated to use courseLogo from backend) ----------
    const CourseCard = ({ course }) => {
        const courseLink = `/course/${course.slug || course._id}`;
        // 💡 बैकएंड से courseLogo/logo प्रॉप का उपयोग करें
        const courseLogoUrl = course.courseLogo?.url || course.logo?.url;

        return (
            <Link 
                href={courseLink}
                className="relative bg-white border border-gray-200 rounded-lg shadow-sm transition-all flex flex-col justify-between w-full overflow-hidden hover:shadow-lg hover:border-gray-300"
                // height adjusted
                style={{ minHeight: '160px' }} 
            >
                
                
                {/* Top Icon / Logo Area */}
              <div className="flex justify-center mt-3">
                <img
                  src={courseLogoUrl || "/placeholder.png"} // placeholder if missing
                  alt={course.name || "Course Image"}
                  className="w-8 h-8 object-contain"
                />
              </div>

            
                {/* Course Name */}
                <div className="text-center mt-2 mb-4 px-2 flex-grow">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">
                        {course.name || "Course Name"}
                    </h3>
                </div>

                {/* Bottom Button */}
                <button
                    type="button" 
                    className={BUTTON_BLUE_CLASS} 
                    style={{ backgroundColor: SCREENSHOT_BLUE }}
                >
                    Know More
                </button>
            </Link>
        );
    };
    
    // ---------- UNIVERSITY CARD (Fallback Icon Removed and Image Display Fixed) ----------
    const UniversityCard = ({ university }) => {
        const courseCount = university.courses?.length || 0; 
        const universityLink = `/university/${university.slug || university._id}`;
        // 💡 बैकएंड से courseLogo/logo प्रॉप का उपयोग करें
        const imageUrl = university.courseLogo?.url || university.logo?.url; // 'url' property added and named 'imageUrl'

        return (
            <Link
                href={universityLink}
                className="relative bg-white border border-gray-200 rounded-lg shadow-sm transition-all flex flex-col justify-between w-full overflow-hidden hover:shadow-lg hover:border-gray-300"
                // Reduced height
                style={{ minHeight: '160px' }} 
                >
                
                {/* Course Count Badge */}
                <span className="absolute top-2 left-2 bg-white text-gray-700 text-[10px] px-2 py-0.5 font-semibold shadow-sm rounded-full border border-gray-300 z-10">
                    {courseCount} Courses
                </span>
                
                {/* University Icon / Logo (Dynamic - Fallback Icon Removed) */}
                <div className="flex justify-center items-center h-10 mt-5"> {/* Reduced top margin and height */}
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex justify-center items-center text-gray-600 border border-gray-200 overflow-hidden">
                        {/* 💡 Logo URL Check: Render image only if a valid URL exists */}
                        {imageUrl && typeof imageUrl === 'string' && imageUrl.length > 0 ? (
                            // Only render the image if a logo URL is available
                            <img
                                src={imageUrl} // 👈 डायनामिक लोगो URL
                                alt={`${university.name} logo`}
                                // Note: Next/Image is not used here for simplicity as it requires static width/height/layout props
                                className="object-contain w-full h-full p-1"
                            />
                        ) : (
                            // URL उपलब्ध न होने पर खाली div
                            <div className="w-full h-full"></div>
                        )}
                        {/* Fallback Icon is REMOVED */}
                    </div>
                </div>

                {/* University Name and Location */}
                <div className="text-center mt-2 mb-3 px-2 flex-grow"> {/* Reduced margins */}
                    
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">
                        {university.name || "University Name"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {university.location || "Location N/A"}
                    </p>
                </div>

                {/* View Button */}
                <button
                    type="button" 
                    className={`flex items-center justify-center gap-1 ${BUTTON_BLUE_CLASS}`}
                    style={{ backgroundColor: SCREENSHOT_BLUE }}
                >
                    View University <ArrowRight className="w-3 h-3"/>
                </button>
            </Link>
        );
    };


    if (!isMounted) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

    return (
        <main className="min-h-screen bg-white transition-all w-full">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* ---------- SIDEBAR (Categories) ---------- */}
                    <aside className="lg:w-[280px] p-0 lg:p-0"> 
                        
                        <h3 className="text-xl font-bold mb-6 px-4 lg:px-0 text-gray-700" style={{ color: SCREENSHOT_BLUE }}>
                            Categories
                        </h3>

                        {/* MOBILE SCROLL MENU (Updated: `ref` removed as scroll functions were unused) */}
                        <div className="block lg:hidden relative mb-6">
                            <div
                                // useRef removed, using direct class for scrolling
                                className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2"
                            >
                                {categories.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setSelectedCategory(cat.key)}
                                        // 💡 Dynamic color class is tricky in Tailwind JIT, using inline style for safety
                                        className={`whitespace-nowrap px-4 py-2 text-sm font-semibold transition-all rounded-full border ${
                                            selectedCategory === cat.key
                                                ? `text-white border-blue-700` // Tailwind compatible fallback color
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                        style={selectedCategory === cat.key ? { backgroundColor: SCREENSHOT_BLUE, borderColor: SCREENSHOT_BLUE } : {}}
                                    >
                                        {cat.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* DESKTOP CATEGORY LIST */}
                        <div className="hidden lg:block space-y-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`p-3 cursor-pointer border-2 transition-all rounded-lg ${
                                        selectedCategory === cat.key
                                            ? `border-[${SCREENSHOT_ORANGE}] bg-white shadow-sm` 
                                            : "border-transparent hover:bg-gray-50"
                                    }`}
                                    // Inline style to enforce dynamic border color for safety
                                    style={selectedCategory === cat.key ? { borderColor: SCREENSHOT_ORANGE } : {}} 
                                >
                                    <div className="flex items-start gap-3">
                                        <CategoryIcon isSelected={selectedCategory === cat.key} iconKey={cat.iconKey} />
                                        
                                        <div>
                                            <h3
                                                className={`font-semibold text-[16px] leading-snug ${
                                                    selectedCategory === cat.key
                                                        ? `text-[${SCREENSHOT_BLUE}]`
                                                        : "text-gray-800"
                                                }`}
                                                style={selectedCategory === cat.key ? { color: SCREENSHOT_BLUE } : {}}
                                            >
                                                {cat.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line">{cat.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* ---------- MAIN CONTENT (Courses and Universities) ---------- */}
                    <section className="flex-1 w-full">
                        
                        {/* SEARCH BAR */}
                        <div className="sticky top-0 z-10 bg-white mb-8 shadow-lg rounded-xl border border-gray-200 p-2 transform -translate-y-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder='Search for "Course Name" or "University" across all categories...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full border-0 rounded-xl pl-12 pr-10 py-3 text-base focus:ring-4 focus:ring-opacity-50 focus:ring-orange-500 bg-white transition-all shadow-inner"
                                    style={{
                                        boxShadow: searchQuery ? `0 0 0 2px ${SCREENSHOT_ORANGE}30` : 'none',
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* CURRENT CATEGORY DISPLAY */}
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-4 px-2 lg:px-0" style={{ color: SCREENSHOT_BLUE }}>
                            {selectedCategory === "All" ? "All Courses" : categories.find(c => c.key === selectedCategory)?.title || "Courses"}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6 px-2 lg:px-0 font-medium border-b border-gray-100 pb-4">
                            Showing **{courses.length}** {selectedCategory} courses {searchQuery && ` matching "**${searchQuery}**"`}
                        </p>


                        {/* COURSE GRID */}
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full px-2 lg:px-0">
                                {/* Skeleton Loaders */}
                                {[...Array(5)].map((_, i) => (<div key={i} className="bg-gray-100 rounded-lg animate-pulse h-[160px] w-full"></div>))}
                            </div>
                        ) : courses.length === 0 ? (
                            <p className="text-center text-gray-500 py-12 text-lg">No courses found matching your criteria.</p>
                        ) : (
                            // Changed grid for better card design visibility on smaller screens
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full px-2 lg:px-0">
                                {courses.map((course) => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                        )}
                        
                        {/* ------------------ UNIVERSITY SECTION ------------------ */}
                        <div className="mt-12 pt-6 border-t border-gray-100">
                            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 px-2 lg:px-0" style={{ color: SCREENSHOT_BLUE }}>Top Universities</h2>
                            
                            {loadingUniversities ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full px-2 lg:px-0">
                                    {/* Skeleton Loaders */}
                                    {[...Array(5)].map((_, i) => (<div key={i} className="bg-gray-100 rounded-lg animate-pulse h-[160px] w-full"></div>))}
                                </div>
                            ) : universities.length === 0 ? (
                                <p className="text-center text-gray-500 py-12 text-lg">No universities found matching your criteria.</p>
                            ) : (
                                // Changed grid for better card design visibility on smaller screens
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full px-2 lg:px-0">
                                    {universities.map((university) => (
                                        <UniversityCard key={university._id} university={university} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}