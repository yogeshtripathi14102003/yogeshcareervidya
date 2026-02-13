"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blogs safely
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/v1/blog");
      console.log("API response:", res.data);

      let blogsArray = [];

      if (Array.isArray(res.data)) {
        blogsArray = res.data;
      } else if (Array.isArray(res.data.blogs)) {
        blogsArray = res.data.blogs;
      }

      setBlogs(blogsArray);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete a blog
  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/api/v1/blog/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
      alert("Blog deleted successfully");
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-3xl font-bold mb-6">Admin Blog Listz</h1>

      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading blogs...</p>
      ) : !Array.isArray(blogs) || blogs.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No blogs found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Author</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-2">{blog.title}</td>
                  <td className="px-4 py-2">{blog.category}</td>
                  <td className="px-4 py-2">{blog.author?.name || "N/A"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Link href={`/admin/blogs/edit/${blog._id}`}>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}