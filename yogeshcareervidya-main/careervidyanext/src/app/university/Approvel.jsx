"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js"; // Ensure path is correct

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getImagePath = (path) => {
    if (!path) return "/fallback-logo.png";
    return path.startsWith("http") ? path : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

export default function Approvel({ slug }) {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            api.get(`/api/v1/university/slug/${slug}`)
                .then((res) => {
                    // Yahan se approvals data nikal rahe hain
                    setApprovals(res.data.data.approvals || []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching approvals:", err);
                    setLoading(false);
                });
        }
    }, [slug]);

    if (loading) return <div className="p-5 text-center text-gray-400">Loading Approvals...</div>;
    if (!approvals || approvals.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#0b3a6f] mb-2 uppercase tracking-wide">
                    Accreditations & Approvals
                </h2>
                <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {approvals.map((approval, index) => (
                    <div 
                        key={index} 
                        className="group flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
                    >
                        <div className="relative w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-110">
                            <Image 
                                src={getImagePath(approval.logo)} 
                                alt={approval.name || "Approval"} 
                                fill 
                                className="object-contain"
                            />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-center text-gray-800 uppercase tracking-tighter">
                            {approval.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}