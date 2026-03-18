"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Image from "next/image";
import Link from "next/link";
import BlogHeader from "../layout/BlogHeader.jsx";
import Footer from "@/app/layout/Footer.jsx";

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
    return (
      <div className="py-40 text-center text-lg font-semibold">
        Loading blogs...
      </div>
    );
  }

  const latestBlog = blogs[0];
  const sideBlog = blogs[1];
  const bottomBlogs = blogs.slice(2, 5);

  return (
    <>
      <BlogHeader />

      <div className="w-full bg-slate-50">

        {/* HERO SECTION */}
        <section className="bg-slate-100 py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Explore the Latest Blogs on Technology and Innovation
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Discover blogs that bring you the latest insights, trends,
            and strategies to stay ahead in the digital world.
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

        {/* BLOG CONTENT */}
        <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">

          {/* FIRST ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LATEST BLOG */}
            {latestBlog && (
              <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden flex h-[380px] hover:shadow-xl transition">

                {/* IMAGE */}
                <div className="relative w-[55%] h-full">
                  <Image
                    src={latestBlog.image?.url || "/placeholder.jpg"}
                    alt={latestBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* TEXT */}
                <div className="w-[45%] p-6 flex flex-col justify-center">

                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Latest Post
                  </p>

                  <Link href={`/Blog/${latestBlog.slug}`}>
                    <h2 className="text-xl font-bold text-[#04458b] mt-1 hover:underline">
                      {latestBlog.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-slate-600 mt-3 line-clamp-3">
                    {latestBlog.overview?.points?.[0]}
                  </p>

                  <p className="mt-4 text-xs text-slate-500">
                    {latestBlog.author?.name} |{" "}
                    {new Date(latestBlog.createdAt).toDateString()}
                  </p>

                </div>
              </div>
            )}

            {/* SIDE BLOG */}
            {sideBlog && (
              <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition">

                <div className="relative h-[200px]">
                  <Image
                    src={sideBlog.image?.url || "/placeholder.jpg"}
                    alt={sideBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5">

                  <Link href={`/Blog/${sideBlog.slug}`}>
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


          {/* SECOND ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {bottomBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition"
              >

                <div className="relative h-[200px]">
                  <Image
                    src={blog.image?.url || "/placeholder.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5">

                  <Link href={`/Blog/${blog.slug}`}>
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

      <Footer />
    </>
  );
}