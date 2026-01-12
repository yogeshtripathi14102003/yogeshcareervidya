"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";

export default function BlogListingPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await api.get("/api/v1/blog");
                setBlogs(res.data.data || []);
            } catch (err) {
                console.error("Error fetching blogs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading blogs...</p>;
    if (!blogs.length) return <p className="text-center mt-10">No blogs found</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
                Our Blogs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {blogs.map((blog) => {
                    // Image URL logic
                    const blogImageUrl = blog.image?.url
                        ? blog.image.url.startsWith("http")
                            ? blog.image.url
                            : `${api.defaults.baseURL}/${blog.image.url.replace(/^\/+/, "")}`
                        : "/fallback-blog.png";

                    return (
                        <Link
                            key={blog._id}
                            href={`/blog/${blog.slug}`}
                            className="group border rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col items-center bg-white"
                        >
                            {/* 1. Image Only */}
                            <div className="relative w-full h-44 mb-4 overflow-hidden rounded-lg">
                                <Image
                                    src={blogImageUrl}
                                    alt={blog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* 2. Name (Title) Only */}
                            <h3 className="text-md font-semibold text-center text-slate-800 group-hover:text-blue-600 line-clamp-2 px-2">
                                {blog.title}
                            </h3>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}