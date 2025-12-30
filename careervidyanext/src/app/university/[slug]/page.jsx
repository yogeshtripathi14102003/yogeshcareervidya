"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquare, ChevronRight } from 'lucide-react';
import Header from "@/app/layout/Header";
import Applictionpopup from "@/app/university/Applictionpopup";
import UniversityCertificate from "@/app/components/UniversityCertificate"; 
import AdmissionProcess from "@/app/university/AdmissionProcess"; 
import FactsSection from "@/app/university/FactsSection"; 
import FeesStructureSection from "@/app/university/Feesstracture.jsx";
import Eligibility from "@/app/university/Eligibility.jsx";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getImagePath = (path) => {
    if (!path) return "/fallback-logo.png";
    return path.startsWith("http") ? path : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

export default function UniversityDetail() {
    const params = useParams();
    const slug = params.slug;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState("apply");

    const overviewRef = useRef(null);
    const coursesRef = useRef(null);
    const admissionRef = useRef(null);
    const certificateRef = useRef(null);
    const factsRef = useRef(null);
    const feesRef = useRef(null);
    const Eligibilityref = useRef(null);

    useEffect(() => {
        if (slug) {
            api.get(`/api/v1/university/slug/${slug}`)
                .then((res) => {
                    setData(res.data.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching university details:", err);
                    setLoading(false);
                });
        }
    }, [slug]);

    const tabs = ["Overview", "Key Highlight", "Courses", "Eligibility", "Feesstracture", "Admission Process", "Placement", "Review", "Faq"];

    const handleTabClick = (tab) => {
        const refMap = {
            "Overview": overviewRef,
            "Courses": coursesRef,
            "Admission Process": admissionRef,
            "Key Highlight": certificateRef,
            "Placement": factsRef,
            "Feesstracture": feesRef,
            "Eligibility": Eligibilityref,
        };
        if (refMap[tab]?.current) {
            refMap[tab].current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (loading) return <div className="p-10 text-center bg-white text-black font-semibold">Loading Content...</div>;
    if (!data) return <div className="p-10 text-center bg-white text-black font-semibold">University not found.</div>;

    return (
        <div className="bg-white text-black min-h-screen w-full"> 
            <Header />
            
            {/* --- HERO SECTION --- */}
            <section
                className="relative w-full overflow-hidden bg-no-repeat bg-center shadow-lg"
                style={{
                    backgroundImage: `url(${getImagePath(data.background?.backgroundImage)})`,
                    backgroundSize: "100% 100%", 
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 px-6 md:px-20 py-8 lg:py-12 w-full"> 
                    <div className="max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-1 leading-tight text-white">
                            {data.name}
                        </h1>
                        <div className="flex items-center mb-3 text-sm">
                            <Star fill="#ffc107" color="#ffc107" size={16} className="mr-1" />
                            <span className="text-yellow-300 font-bold text-lg">(667 Reviews)</span>
                        </div>
                        <div className="mb-4">
                            <div className="relative h-[75px] w-[150px] bg-white rounded-xl shadow-2xl overflow-hidden p-2">
                                <Image src={getImagePath(data.universityImage)} alt={data.name} fill className="object-contain p-2" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                            {data.approvals?.slice(0, 6).map((approval, index) => (
                                <div key={index} className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg p-1 relative shadow-md">
                                    <Image src={getImagePath(approval.logo)} alt={approval.name} fill className="object-contain" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                            <button className="flex-1 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition shadow-lg text-sm uppercase" onClick={() => { setPopupType("apply"); setPopupOpen(true); }}>Apply Now →</button>
                            <button className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm uppercase flex items-center justify-center" onClick={() => { setPopupType("talk"); setPopupOpen(true); }}>
                                <MessageSquare size={18} className="mr-2" /> Talk to University
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TAB NAVIGATION --- */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 min-w-max">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                className="px-6 py-3 rounded-lg border font-semibold text-sm transition-all text-gray-600 border-gray-200 hover:text-orange-500 hover:border-orange-200"
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

                {/* Overview */}
                <div ref={overviewRef}>
                    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                        <h2 className="text-[#0056D2] text-4xl font-bold mb-8">Overview</h2>
                        <div 
                            className="text-[#4A4A4A] text-[17px] leading-[1.8] space-y-6"
                            dangerouslySetInnerHTML={{ __html: data.description || "No description available." }} 
                        />
                    </div>
                </div>

                {/* Key Highlight */}
                <div ref={certificateRef}>
                    <UniversityCertificate slug={data.slug} />
                </div>

                {/* --- COURSES SECTION (FIXED) --- */}
                <div ref={coursesRef} className="mb-16 shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                    <h3 className="text-xl font-bold text-white bg-[#0b3a6f] p-5 text-center uppercase tracking-wide">
                        Explore Online Programs
                    </h3>
                    <div className="bg-white p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {data.courses?.map((course, index) => (
                                <div 
                                    key={index} 
                                    className={`transition hover:bg-gray-50 border-gray-100 ${index % 2 === 0 ? 'md:border-r' : ''} border-b`}
                                >
                                    <div className="p-5">
                                        {/* Yahan course.courseSlug use kiya hai jo aapke DB mein hai */}
                                        <Link 
                                            href={`/course/${course.courseSlug || course.slug}`} 
                                            className="text-blue-600 font-bold hover:underline flex items-center justify-between"
                                        >
                                            <span>{course.name} Online</span>
                                            <ChevronRight size={14} className="text-gray-400" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fees Structure */}
                <div ref={feesRef}>
                    <FeesStructureSection slug={slug} />
                </div>

                {/* Admission Process */}
                <div ref={admissionRef}>
                    <AdmissionProcess slug={data.slug} />
                </div>

                {/* Eligibility */}
                <div ref={Eligibilityref}>
                    <Eligibility slug={data.slug} />
                </div>

                {/* Placement / Facts */}
                <div ref={factsRef}>
                    <FactsSection slug={data.slug} />
                </div>
            </div>

            {popupOpen && (
                <Applictionpopup open={popupOpen} onClose={() => setPopupOpen(false)} type={popupType} universityName={data.name} />
            )}
        </div>
    );
}