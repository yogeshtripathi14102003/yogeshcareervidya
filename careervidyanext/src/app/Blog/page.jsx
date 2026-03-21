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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

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

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    if(page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
  };

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

        {/* BLOG GRID */}
        <section className="max-w-7xl mx-auto px-4 py-16">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {currentBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className={`bg-white rounded-xl shadow overflow-hidden hover:shadow-xl transition ${
                  index === 0 && currentPage === 1 ? "border-2 border-blue-500" : ""
                }`}
              >
                <div className="relative h-[200px]">
                  <Image
                    src={blog.image?.url || "/placeholder.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover object-top"
                    priority={index === 0 && currentPage === 1}
                  />
                </div>

                <div className="p-5">
                  {index === 0 && currentPage === 1 && (
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      Latest Post
                    </p>
                  )}

                  <Link href={`/Blog/${blog.slug}`}>
                    <h3 className="font-bold text-lg hover:text-blue-600 line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {blog.overview?.points?.[0]}
                  </p>

                  <p className="text-sm text-slate-500 mt-3">
                    {blog.author?.name} |{" "}
                    {new Date(blog.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            ))}

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}

        </section>
      </div>

      <Footer />
    </>
  );
}