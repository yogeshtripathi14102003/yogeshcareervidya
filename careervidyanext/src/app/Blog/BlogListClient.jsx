"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogHeader from "../layout/BlogHeader.jsx";
import Footer from "@/app/layout/Footer.jsx";

export default function BlogListClient({ initialBlogs }) {
  const [blogs] = useState(initialBlogs);
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const handleSearch = () => {
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <BlogHeader />
      <div className="w-full bg-slate-50">
        <section className="bg-slate-100 py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Explore the Latest Blogs on Technology and Innovation</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">

            Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.

          </p>
          <div className="mt-8 max-w-xl mx-auto flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search..."
              className="flex-1 px-4 py-3 rounded-l-lg border outline-none text-black"
            />
            <button onClick={handleSearch} className="bg-[#04458b] text-white px-6 rounded-r-lg">Search</button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          {currentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBlogs.map((blog, index) => (
                <div key={blog._id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="relative h-[200px]">
                    <Image src={blog.image?.url || "/placeholder.jpg"} alt={blog.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <Link href={`/Blog/${blog.slug}`}>
                      <h3 className="font-bold text-lg hover:text-blue-600">{blog.title}</h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-3">{blog.author?.name} | {new Date(blog.createdAt).toDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">No blogs found.</div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-3">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 bg-gray-200 rounded">Next</button>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}