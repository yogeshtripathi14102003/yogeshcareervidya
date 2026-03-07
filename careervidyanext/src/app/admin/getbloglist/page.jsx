// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import { Pencil, Trash2 } from "lucide-react";
// import Link from "next/link";

// export default function BlogList() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH BLOGS ================= */
//   const fetchBlogs = async () => {
//     try {
//       const { data } = await api.get("/api/v1/blog");

//       console.log("API Response:", data);

//       // Backend response -> { success: true, data: blogs }
//       const blogsArray = data?.data || [];

//       setBlogs(blogsArray);
//     } catch (error) {
//       console.error("Failed to fetch blogs:", error);
//       setBlogs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DELETE BLOG ================= */
//   const deleteBlog = async (id) => {
//     const confirmDelete = confirm(
//       "Are you sure you want to delete this blog?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await api.delete(`/api/v1/blog/${id}`);

//       // remove blog from UI instantly
//       setBlogs((prev) => prev.filter((blog) => blog._id !== id));

//       alert("Blog deleted successfully");
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Failed to delete blog");
//     }
//   };

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-slate-50">
//       <h1 className="text-3xl font-bold mb-6">Admin Blog List</h1>

//       {/* ================= LOADING ================= */}
//       {loading ? (
//         <p className="text-center mt-10 text-gray-500">
//           Loading blogs...
//         </p>
//       ) : blogs.length === 0 ? (
//         <p className="text-center mt-10 text-gray-500">
//           No blogs found.
//         </p>
//       ) : (
//         <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-100">
//                 <th className="px-4 py-2 border">Title</th>
//                 <th className="px-4 py-2 border">Category</th>
//                 <th className="px-4 py-2 border">Author</th>
//                 <th className="px-4 py-2 border">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {blogs.map((blog) => (
//                 <tr
//                   key={blog._id}
//                   className="border-b hover:bg-slate-50"
//                 >
//                   <td className="px-4 py-2">{blog.title}</td>

//                   <td className="px-4 py-2">
//                     {blog.category || "N/A"}
//                   </td>

//                   <td className="px-4 py-2">
//                     {blog.author?.name || "N/A"}
//                   </td>

//                   <td className="px-4 py-2 flex gap-3">
//                     <Link href={`/admin/blogs/edit/${blog._id}`}>
//                       <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
//                         <Pencil size={16} />
//                         Edit
//                       </button>
//                     </Link>

//                     <button
//                       onClick={() => deleteBlog(blog._id)}
//                       className="text-red-600 hover:text-red-800 flex items-center gap-1"
//                     >
//                       <Trash2 size={16} />
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import { Pencil, Trash2, Search, X } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get("/api/v1/blog");
      const blogList = data?.data || [];
      setBlogs(blogList);
      setFilteredBlogs(blogList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* SEARCH & FILTER */
  useEffect(() => {
    let filtered = blogs;
    if (search) {
      filtered = filtered.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((b) => b.category === category);
    }
    setFilteredBlogs(filtered);
    setPage(1); // Reset to first page on filter
  }, [search, category, blogs]);

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await api.delete(`/api/v1/blog/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  /* EDIT HANDLERS */
  const handleEditClick = (blog) => {
    setEditingBlog({ ...blog });
    setIsEditModalOpen(true);
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/api/v1/blog/${editingBlog._id}`, editingBlog);
      // Update local state
      setBlogs((prev) =>
        prev.map((b) => (b._id === editingBlog._id ? editingBlog : b))
      );
      setIsEditModalOpen(false);
      alert("Blog updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating blog");
    }
  };

  const exportExcel = () => {
    const data = filteredBlogs.map((b) => ({
      Title: b.title,
      Category: b.category,
      Author: b.author?.name,
      Status: b.is_verified ? "Published" : "Draft",
      Views: b.reads || 0,
    }));
    const sheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Blogs");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "blogs.xlsx");
  };

  const start = (page - 1) * limit;
  const paginated = filteredBlogs.slice(start, start + limit);
  const totalPages = Math.ceil(filteredBlogs.length / limit);
  const categories = [...new Set(blogs.map((b) => b.category))];

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Blog Management</h1>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <div className="flex items-center bg-white border px-3 py-2 rounded shadow-sm focus-within:ring-2 ring-blue-500">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search blogs..."
            className="ml-2 outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded bg-white shadow-sm outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={exportExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition-colors"
        >
          Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-sm">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="6" className="text-center p-12 text-slate-400">Loading data...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-12 text-slate-400">No blogs found.</td></tr>
            ) : (
              paginated.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={blog.image?.url || "https://via.placeholder.com/150"}
                      className="w-12 h-12 object-cover rounded-md shadow-sm border"
                      alt={blog.title}
                    />
                  </td>
                  <td className="p-4 font-medium text-slate-700">{blog.title}</td>
                  <td className="p-4 text-slate-500">{blog.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      blog.is_verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {blog.is_verified ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{blog.reads || 0}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleEditClick(blog)}>
                        <Pencil size={18} className="text-blue-600 hover:text-blue-800" />
                      </button>
                      <button onClick={() => deleteBlog(blog._id)}>
                        <Trash2 size={18} className="text-red-600 hover:text-red-800" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border rounded-md transition-colors ${
                page === i + 1 ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setIsEditModalOpen(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Edit Blog Details</h2>
            
            <form onSubmit={handleUpdateBlog} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-600">Blog Title</label>
                <input
                  className="w-full border rounded p-2 outline-none focus:ring-2 ring-blue-500"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-600">Category</label>
                <input
                  className="w-full border rounded p-2 outline-none focus:ring-2 ring-blue-500"
                  value={editingBlog.category}
                  onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={editingBlog.is_verified}
                  onChange={(e) => setEditingBlog({...editingBlog, is_verified: e.target.checked})}
                />
                <label htmlFor="status" className="text-sm font-semibold text-slate-600 cursor-pointer">
                  Verified / Published
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}