"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { CheckCircle2 } from "lucide-react";

// Default export ensures it can be imported without {}
export default function UniversityHighlights({ slug }) {
    const [highlights, setHighlights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Memory leak se bachne ke liye
        if (slug) {
            api.get(`/api/v1/university/slug/${slug}`)
                .then((res) => {
                    if (isMounted && res.data?.data?.highlights) {
                        setHighlights(res.data.data.highlights);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching highlights:", err);
                    setLoading(false);
                });
        }
        return () => { isMounted = false };
    }, [slug]);

    if (loading) return <div className="p-5 text-gray-400">Loading Highlights...</div>;
    if (!highlights || !highlights.points || highlights.points.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-[#0b3a6f] to-[#0056D2] rounded-2xl p-8 text-white shadow-xl">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {highlights.heading || "Key Highlights"}
                </h2>
                <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.points.map((point, index) => (
                    <div 
                        key={index} 
                        className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-all"
                    >
                        <CheckCircle2 className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                        <p className="text-sm md:text-base font-medium leading-relaxed">
                            {point}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}