"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Link from "next/link";
import Image from "next/image";
import { Star, Plus, Download, MessageSquare, ChevronRight } from 'lucide-react';
import Header from "@/app/layout/Header";
import Applictionpopup from "@/app/university/Applictionpopup";
import UniversityCertificate from "@/app/components/UniversityCertificate"; 
import AdmissionProcess from "@/app/components/AdmissionProcess"; 
import FactsSection from "@/app/university/FactsSection"; 

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

    if (loading) return <div className="p-10 text-center bg-white text-black font-semibold">Loading Content...</div>;
    if (!data) return <div className="p-10 text-center bg-white text-black font-semibold">University not found.</div>;

    return (
        <div className="bg-white dark:bg-white text-black dark:text-black min-h-screen w-full"> 
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
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-1 leading-tight drop-shadow-lg text-white">
                            {data.name}
                        </h1>
                        
                        <div className="flex items-center mb-3 text-sm">
                            <Star fill="#ffc107" color="#ffc107" size={16} className="mr-1" />
                            <span className="text-yellow-300 font-bold text-lg">(667 Reviews)</span>
                        </div>

                        <div className="mb-4">
                            <div className="relative h-[75px] w-[150px] bg-white rounded-xl shadow-2xl overflow-hidden p-2 border border-white/20">
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
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 min-w-max">
                        {["Overview", "Key Highlight", "Courses", "Eligibility", "Fees", "Admission Process", "Placement", "Review", "Faq"].map((tab, index) => (
                            <button key={index} className={`px-6 py-3 rounded-lg border font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${index === 0 ? "text-orange-500 border-orange-200 bg-orange-50" : "text-gray-600 border-gray-200"}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT (OVERVIEW AS PER IMAGE) --- */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    
                    {/* --- IMAGE STYLE OVERVIEW SECTION --- */}
                    <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 shadow-sm mb-12">
                        <h2 className="text-[#0056D2] text-4xl font-bold mb-8">Overview</h2>
                        <div 
                            className="text-[#4A4A4A] text-[17px] leading-[1.8] space-y-6 font-normal"
                            dangerouslySetInnerHTML={{ __html: data.description || "No description available." }} 
                        />
                    </div>

                    {/* --- COURSES TABLE --- */}
                    <div className="mb-16 shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                        <h3 className="text-xl font-bold text-white bg-blue-700 p-5 text-center uppercase tracking-wide">Explore Online Programs</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <tbody className="bg-white">
                                    {data.courses?.map((course, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-5">
                                                <Link href={`/course/${course.slug}`} className="text-blue-600 font-bold hover:underline flex items-center justify-between">
                                                    <span>{course.name} Online</span>
                                                    <ChevronRight size={14} className="text-gray-400" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-24 pb-20">
                        <UniversityCertificate slug={data.slug} />
                        <AdmissionProcess slug={data.slug} />
                        <FactsSection slug={data.slug} />
                    </div>
                </div>
            </div>

            {popupOpen && (
                <Applictionpopup open={popupOpen} onClose={() => setPopupOpen(false)} type={popupType} universityName={data.name} />
            )}
        </div>
    );
}