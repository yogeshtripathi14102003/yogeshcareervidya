"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Link from "next/link"; // ADDED: For linking the courses
import Image from "next/image";
import { Star, Plus, Download, MessageSquare, Play, ChevronRight, Check, Info } from 'lucide-react';
import Header from "@/app/layout/Header";
import Applictionpopup from "@/app/university/Applictionpopup";
// ✅ Corrected Imports for Custom Components
import UniversityCertificate from "@/app/components/UniversityCertificate"; 
import AdmissionProcess from "@/app/components/AdmissionProcess"; // Assumed correct path/name
import FactsSection from "@/app/university/FactsSection"; // If you have a separate FactsSection component
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// --- Helper Functions ---

// Helper function to extract YouTube video ID or thumbnail URL
const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/))([^&?]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

// Helper function to handle image paths
const getImagePath = (path, name) => {
    if (!path) return "/fallback-logo.png";
    // Check if the path is already a full URL (http/https)
    return path.startsWith("http") ? path : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

// Helper function to pair courses into rows for a two-column table layout
const getCourseRows = (courses) => {
    const rows = [];
    if (!courses) return rows;
    for (let i = 0; i < courses.length; i += 2) {
        // Ensure the second item is null if it's the last course
        rows.push([courses[i], courses[i + 1] ? courses[i + 1] : null]);
    }
    return rows;
};

// STATIC FALLBACK FACTS
const STATIC_ONLINE_FACTS = [
    "<strong>UGC Approved Degrees:</strong> All online degrees are approved by the University Grants Commission (UGC) of India, ensuring full recognition.",
    "<strong>Equal Value:</strong> An online degree holds the same value and acceptance as a traditional on-campus degree for jobs and higher education.",
    "<strong>Flexible Schedule:</strong> Study anytime, anywhere, allowing you to balance your education with work and personal life.",
    "<strong>Top Faculty:</strong> Access to lectures and study materials created by the university's top faculty members.",
    "<strong>Affordability:</strong> Online programs are typically more cost-effective than their on-campus equivalents, saving on commuting and accommodation.",
    "<strong>Global Recognition:</strong> Degrees are accepted by top recruiters in both the government and private sectors worldwide."
];

// --- Main Component ---

export default function UniversityDetail() {
    const params = useParams();
    const slug = params.slug;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('about'); // For active menu item
const [popupOpen, setPopupOpen] = useState(false);
const [popupType, setPopupType] = useState("apply");

    useEffect(() => {
        if (slug) {
            // Fetch university details using the API utility
            api.get(`/api/v1/university/slug/${slug}`)
                .then((res) => {
                    const fetchedData = res.data.data;
                    setData(fetchedData);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching university details:", err);
                    setData(null); // Set to null on error to show 'not found' message
                    setLoading(false);
                });
        }
    }, [slug]);

    if (loading) return <div className="p-10 text-center">Loading university details...</div>;
    if (!data) return <div className="p-10 text-center">University not found.</div>;

    // --- Data Preparation ---
    const videoThumbnailUrl = getYouTubeThumbnail(data.youtubeLink); 
    const courseRows = getCourseRows(data.courses);

    const dynamicHighlights = data.highlights;
    const highlightsPoints = dynamicHighlights?.points; 
    const explicitFacts = data.factsPoints; 
    const legacyFacts = data.facts; 
    
    // Logic to select which facts to display (dynamic > explicit > legacy > static fallback)
    const factsToDisplay = 
        (highlightsPoints && highlightsPoints.length > 0) ? highlightsPoints :
        (explicitFacts && explicitFacts.length > 0) ? explicitFacts : 
        (legacyFacts && legacyFacts.length > 0) ? legacyFacts : 
        STATIC_ONLINE_FACTS;
        
    const isStaticFallback = !(highlightsPoints && highlightsPoints.length > 0) && 
                             !(explicitFacts && explicitFacts.length > 0) && 
                             !(legacyFacts && legacyFacts.length > 0);
                             
    const displayFactsHeading = dynamicHighlights?.heading || data.factsHeading || `${data.name} Online Facts`;

    // Menu items list
    const menuItems = [
        { id: 'about', title: 'About University' },
        { id: 'courses', title: 'Courses & Programs' },
        { id: 'facts', title: 'University Facts & Highlights' },
        { id: 'recognition', title: 'Recognition & Certificate' }, 
        { id: 'approvals', title: 'Regulatory Approvals' },
        { id: 'admission', title: 'Admission Procedure' },
    ];
    
    // Function to handle scroll and set active menu item
    const handleScroll = (id) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // --- Render ---

    return (
        <> 
        <Header />
        <div className="max-w-7xl mx-auto p-6">

            {/* -------------------- BREADCRUMB -------------------- */}
            <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-2">
                    <li><Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link></li>
                    <li>
                        <div className="flex items-center">
                            <ChevronRight size={16} className="text-gray-400 mx-2" />
                            <Link href="/online-universities" className="text-gray-500 hover:text-blue-600">Online University</Link>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <ChevronRight size={16} className="text-gray-400 mx-2" />
                            <span className="text-gray-800 font-medium">{data.name}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* -------------------- HEADER & VIDEO -------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-1">
                    <h1 className="text-4xl font-extrabold mb-2">{data.name}</h1>
                    <div className="flex items-center mb-4 text-sm">
                        <Star fill="#ffc107" color="#ffc107" size={16} className="mr-1" />
                        <span className="text-blue-600 font-semibold">(667 Reviews)</span>
                    </div>

                    <div className="flex items-center space-x-4 mb-8">
                        {data.approvals?.slice(0, 4).map((approval, index) => ( // Show only the first 4 logos
                            <div key={index} className="w-12 h-12 relative" title={approval.name}>
                                <Image
                                    src={getImagePath(approval.logo, 'small_approval_logo')}
                                    alt={approval.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                        <div className="w-12 h-12 flex items-center justify-center text-sm text-gray-500 border rounded-full">
                            <Info size={16} />
                        </div>
                    </div>

                 {/* -------------------- APPLY / TALK BUTTONS -------------------- */}
<div className="space-y-4">
    <button
        className="flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition"
        onClick={() => { 
            setPopupType("apply"); 
            setPopupOpen(true); 
        }}
    >
        Apply to University <span className="ml-2">→</span>
    </button>
    <button
        className="flex items-center justify-center w-full bg-white border border-blue-600 text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition"
        onClick={() => { 
            setPopupType("talk"); 
            setPopupOpen(true); 
        }}
    >
        <MessageSquare size={18} className="mr-2" /> Talk to University
    </button>
</div>

{/* -------------------- OTHER ACTIONS -------------------- */}
<div className="flex justify-between mt-4 space-x-2 text-sm text-gray-600">
    <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition">
        <Plus size={16} className="mr-1" /> Add to Compare
    </button>
    <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition">
        <Download size={16} className="mr-1" /> Download Brochure
    </button>
</div>

{/* -------------------- APPLICATION POPUP -------------------- */}
{popupOpen && (
    <Applictionpopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        type={popupType} // "apply" or "talk"
        universityName={data.name} // pass university name
    />
)}

                </div>

                <div className="lg:col-span-2 relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                    {videoThumbnailUrl ? (
                        <a href={data.youtubeLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                            <Image
                                src={videoThumbnailUrl}
                                alt={`Video: ${data.name}`}
                                fill
                                sizes="66vw"
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-300 hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play size={80} fill="#ff0000" color="#ff0000" className="opacity-90 hover:opacity-100 transition" />
                            </div>
                        </a>
                    ) : (
                        <Image 
                            src={getImagePath(data.universityImage, 'university_main_image')} 
                            alt={data.name} 
                            fill 
                            sizes="66vw" 
                            style={{ objectFit: 'cover' }} 
                        />
                    )}
                    <div className="absolute top-4 left-4 p-2 bg-white/80 rounded-lg backdrop-blur-sm text-xs font-bold">
                        {data.name} Online
                    </div>
                </div>
            </div>

            <hr className="my-8" />

            {/* -------------------- NAVIGATION & CONTENT -------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* --- SIDEBAR MENU (Sticky) --- */}
                <div className="lg:col-span-1 sticky top-6 self-start p-4 border rounded-xl shadow-sm bg-white h-fit">
                    <div className="text-xs font-bold text-gray-500 mb-2">TABLE OF CONTENTS</div>
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => { e.preventDefault(); handleScroll(item.id); }} // Prevent default anchor jump
                                    className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm transition ${
                                        activeSection === item.id
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.title}
                                    <ChevronRight size={14} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="lg:col-span-3">
                    
                    {/* -------------------- SECTION 1: ABOUT -------------------- */}
                    <h2 id="about" className="text-3xl font-bold text-gray-800 mb-4 pt-4">About {data.name} Online</h2>
                    <div className="text-gray-700 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: data.description || "No detailed description available." }} />

                    {/* Quick Facts Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h4 className="text-base font-bold text-yellow-800 mb-2 flex items-center">Online Degree Acceptance <span className="ml-2">→</span></h4>
                            <p className="text-sm text-yellow-700">Online degrees earned from a government-approved university, just like a regular degree, are accepted by top recruiters worldwide.</p>
                        </div>
                        <div className="bg-orange-100 p-4 rounded-lg">
                            <h4 className="text-base font-bold text-orange-800 mb-2 flex items-center">Value of Online Degree <span className="ml-2">→</span></h4>
                            <p className="text-sm text-orange-700">Holds similar recognition as a regular degree for jobs or higher education.</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h4 className="text-base font-bold text-green-800 mb-2 flex items-center">Quality of Education <span className="ml-2">→</span></h4>
                            <p className="text-sm text-green-700">Online programs maintain the same standards as on-campus programs.</p>
                        </div>
                    </div>

                    {/* -------------------- SECTION 2: COURSES -------------------- */}
                    <h3 id="courses" className="text-xl font-bold text-white bg-blue-700 p-3 text-center rounded-t-lg">Explorer Online Learning Courses In India</h3>
                    <table className="w-full text-sm border-collapse border border-gray-300 mb-12">
                        <tbody>
                            {courseRows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {row.map((course, idx) => (
                                        <td 
                                            key={idx} 
                                            className="p-3 border border-gray-300 text-blue-600 font-medium hover:underline"
                                        >
                                            {course ? (
                                                <Link 
                                                    href={`/course/${course.slug}`} // ✅ Course link added
                                                    className="cursor-pointer block"
                                                >
                                                    {`${course.name} Online`}
                                                </Link>
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="bg-gray-100 hover:bg-gray-200">
                                <td className="p-3 border border-gray-300 text-center text-blue-600 font-semibold hover:underline">
                                    <Link href="/online-courses">
                                        Explorer more online and distance courses in India!
                                    </Link>
                                </td>
                                <td className="p-3 border border-gray-300 text-center text-blue-600 font-semibold hover:underline">
                                    <Link href="/approved-universities">
                                        Click here for all approved distance and online university in India!
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* -------------------- SECTION 3: FACTS / HIGHLIGHTS -------------------- */}
                    <h2 id="facts" className="text-3xl font-bold text-gray-800 mb-4 pt-4">
                        {displayFactsHeading}
                        {isStaticFallback && <span className="text-base text-gray-500 font-normal ml-2">(General Online Facts)</span>}
                    </h2>
                    {data.factsSubHeading && <p className="text-lg text-gray-600 mb-4">{data.factsSubHeading}</p>}
                    <ul className={`list-none space-y-3 mb-12 ${isStaticFallback ? 'p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg' : ''}`}>
                        {factsToDisplay.map((fact, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                                <Check size={18} className="text-blue-600 flex-shrink-0 mt-1 mr-2" />
                                <span dangerouslySetInnerHTML={{ __html: fact }} />
                            </li>
                        ))}
                    </ul>

                    {/* -------------------- SECTION 5: APPROVALS -------------------- */}
                    <h2 id="approvals" className="text-3xl font-bold text-gray-800 mb-4 pt-4">{data.name} Regulatory Approvals</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        The university is officially approved and recognized by the following regulatory bodies.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
                        {data.approvals?.map((approval, index) => (
                            <div key={index} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg h-32 text-center">
                                <div className="w-16 h-16 relative mb-2">
                                    <Image src={getImagePath(approval.logo)} alt={approval.name} fill className="object-contain" />
                                </div>
                                <div className="text-xs font-medium text-gray-700">{approval.name}</div>
                            </div>
                        ))}
                    </div>

                    {/* -------------------- SECTION 4: RECOGNITION & CERTIFICATE -------------------- */}
                    <div id="recognition" className="pt-8"> 
                        <UniversityCertificate slug={data.slug} />
                    </div>
                    
                    {/* -------------------- SECTION 6: ADMISSION PROCEDURE -------------------- */}
                    <div id="admission" className="pt-8">
                        <AdmissionProcess slug={data.slug} />
                    </div>
                                        {/* -------------------- SECTION 7: Factes  -------------------- */}
                      <div id="admission" className="pt-8">
                        <FactsSection  slug={data.slug} />
                    </div>

                </div>
            </div>
        </div>
        </>
    );
}