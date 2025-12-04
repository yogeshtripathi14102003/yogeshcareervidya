"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";

export default function UniversitiesPage() {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await api.get("/api/v1/university"); // fetch all universities
                setUniversities(res.data.data || []);
            } catch (err) {
                console.error("Error fetching universities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading universities...</p>;
    if (!universities.length) return <p className="text-center mt-10">No universities found</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-8 text-center">
                Explore Universities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {universities.map((uni) => {
                    const imageUrl = uni.universityImage
                        ? uni.universityImage.startsWith("http")
                            ? uni.universityImage
                            : `${api.defaults.baseURL}/${uni.universityImage.replace(/^\/+/, "")}`
                        : "/fallback.png";

                    return (
                        <Link
                            key={uni._id}
                            // ✅ FIX: Ensure this path matches your University Detail route setup (e.g., app/university/[slug]/page.js)
                            href={`/university/${uni.slug}`} 
                            className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center"
                        >
                            <div className="relative w-full h-40 mb-4">
                                <Image
                                    src={imageUrl}
                                    alt={uni.name}
                                    fill
                                    className="object-contain rounded"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-center">{uni.name}</h3>
                            <p className="text-gray-500 mt-1 text-sm">{uni.courses?.length || 0} Courses</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}