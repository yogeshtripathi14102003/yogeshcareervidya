"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Image from "next/image";
import Link from "next/link";
import BlogHeader from "../layout/BlogHeader.jsx";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/v1/blog");
      setBlogs(res.data.data || []);
    } catch (err) {
      console.error("Blog fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-40 text-center text-lg">Loading blogs...</div>;
  }

  const latestBlog = blogs[0];      // ❌ untouched
  const sideBlog = blogs[1];        // ✅ beside latest
  const bottomBlogs = blogs.slice(2, 5); // ✅ only 3 cards

  return (
    <>
      <BlogHeader />

      <div className="w-full bg-slate-50">
        {/* ================= HERO ================= */}
        <section className="bg-slate-100 py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Explore the Latest Blogs on Technology and Innovation
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Discover blogs that bring you the latest insights, trends, and strategies
            to stay ahead in the digital world.
          </p>

          <div className="mt-8 max-w-xl mx-auto flex">
            <input
              placeholder="Search..."
              className="flex-1 px-4 py-3 rounded-l-lg border border-slate-300 outline-none"
            />
            <button className="bg-[#04458b] text-white px-6 rounded-r-lg font-semibold">
              Search
            </button>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">

          {/* ========= ROW 1 ========= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ===== Latest Blog (UNCHANGED) ===== */}
            {latestBlog && (
              <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden flex h-[280px]">
                <div className="relative w-[60%] h-full">
                  <Image
                    src={latestBlog.image?.url || "/placeholder.jpg"}
                    alt={latestBlog.title}
                    fill
                     className="object-contain bg-slate-100"
                  />
                  <div className="absolute inset-0  flex items-end p-4">
                    <h3 className="text-lg font-semibold text-white leading-snug">
                      {latestBlog.title}
                    </h3>
                  </div>
                </div>

                <div className="w-[40%] p-5 flex flex-col justify-center">
                  <p className="text-xs font-semibold text-slate-500 mb-1 uppercase">
                    Latest Post
                  </p>

                  <Link href={`/blog/${latestBlog.slug}`}>
                    <h2 className="text-lg font-bold text-blue-600 hover:underline line-clamp-2">
                      {latestBlog.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {latestBlog.overview?.points?.[0]}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    {latestBlog.author?.name} |{" "}
                    {new Date(latestBlog.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* ===== ONE SIDE CARD ===== */}
            {sideBlog && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="relative h-[180px]">
                  <Image
                    src={sideBlog.image?.url || "/placeholder.jpg"}
                    alt={sideBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <Link href={`/blog/${sideBlog.slug}`}>
                    <h3 className="font-bold text-lg hover:text-blue-600 line-clamp-2">
                      {sideBlog.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-500 mt-2">
                    {sideBlog.author?.name} |{" "}
                    {new Date(sideBlog.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========= ROW 2 (3 CARDS ONLY) ========= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bottomBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="relative h-[180px]">
                  <Image
                    src={blog.image?.url || "/placeholder.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-bold text-lg hover:text-blue-600 line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-500 mt-2">
                    {blog.author?.name} |{" "}
                    {new Date(blog.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>
      </div>
    </>
  );
}
