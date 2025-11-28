"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Pencil, Trash2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import Link from 'next/link'; // 👈 1. Link import किया गया

export default function GetUniversityData() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null); // पुराने कोड से डिलीट स्टेट को वापस लाया गया
  
  // NOTE: कोर्स डेटा लॉजिक को सरल रखने के लिए अभी हटा दिया गया है, 
  // लेकिन यदि आप Expand/Collapse functionality चाहते हैं, 
  // तो आपको पुराने कोड से courses related states और functions (toggleExpand, fetchCourses) को वापस लाना होगा।

  /* -------------------- FETCH UNIVERSITIES -------------------- */
  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");
      setUniversities(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Universities Error:", err);
      // alert("Failed to load universities. Please check the API."); // Production में alert अच्छा नहीं है
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- DELETE UNIVERSITY -------------------- */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      setDeleting(id);
      const res = await api.delete(`/api/v1/university/${id}`);

      if (res.data?.success) {
        alert("University deleted successfully!");
        await fetchUniversities();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete university. Check the backend route.");
    } finally {
      setDeleting(null);
    }
  };


  useEffect(() => {
    fetchUniversities();
  }, []);

  /* -------------------- LOADING STATE -------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading universities...
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#0056B3]">
        🎓 University List
      </h2>

      {universities.length === 0 ? (
        <p className="text-center text-gray-500">No universities found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-[#0056B3] text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">University Name</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-center">Total Courses</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {universities.map((uni, index) => (
                <tr
                  key={uni._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  {/* index */}
                  <td className="py-3 px-4">{index + 1}</td>

                  {/* image */}
                  <td className="py-3 px-4">
                    <img
                      src={
                        uni.universityImage?.startsWith("http")
                          ? uni.universityImage
                          : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage?.replace(
                              /^\/+/,
                              ""
                            )}`
                      }
                      alt={uni.name}
                      className="h-14 w-14 rounded-full object-cover border"
                      onError={(e) => (e.target.src = "/no-image.png")}
                    />
                  </td>

                  {/* name */}
                  <td className="py-3 px-4 font-medium">{uni.name}</td>

                  {/* description */}
                  <td className="py-3 px-4 text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {/* description को 50 characters तक सीमित किया गया */}
                    {uni.description ? `${uni.description.substring(0, 50)}...` : "No description available"} 
                  </td>

                  {/* total courses */}
                  <td className="py-3 px-4 text-center font-semibold">
                    {uni.courses?.length || 0}
                  </td>

                  {/* actions 👈 3. Actions को एक <td> में रैप किया गया */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                        {/* Edit Button with Link 👈 4. Link कंपोनेंट का उपयोग किया गया */}
                        <Link 
                            href={`/admin/universities/edit/${uni._id}`} // 👈 uni._id का उपयोग किया गया
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                            title={`Edit ${uni.name}`}
                        >
                            <Pencil size={18} />
                        </Link>

                        {/* Delete Button */}
                        <button 
                            onClick={() => handleDelete(uni._id)}
                            disabled={deleting === uni._id}
                            className={`p-2 rounded-full hover:bg-red-100 text-red-600 ${
                                deleting === uni._id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            title={`Delete ${uni.name}`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
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