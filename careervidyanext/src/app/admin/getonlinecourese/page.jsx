"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api"; // your configured axios instance

export default function CoursesPage() {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    duration: "",
    tag: "",
  });

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // ✅ for search filter
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search term
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/v1/course"); // ✅ corrected endpoint
      setCourses(res.data.courses || []);
      setFilteredCourses(res.data.courses || []); // ✅ initialize filtered data
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle search filtering
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term) ||
        course.duration.toLowerCase().includes(term) ||
        (course.tag && course.tag.toLowerCase().includes(term))
    );

    setFilteredCourses(filtered);
  };

  // 🔹 Submit new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.name || !formData.duration) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/v1/course", formData);
      alert("✅ Course created successfully!");
      setFormData({ category: "", name: "", duration: "", tag: "" });
      fetchCourses();
    } catch (err) {
      console.error("Error creating course:", err);
      alert("❌ Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete course
  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;

    try {
      await api.delete(`/api/v1/course/${id}`);
      alert("✅ Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("❌ Failed to delete course.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        📚 Course Management
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 space-y-4 max-w-lg"
      >
        {/* Category Dropdown */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Category</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
             <option value="Doctorate">Doctorate</option>
              <option value="JobGuarantee">JobGuarantee</option>
               <option value="StudyAbroad">StudyAbroad</option>
              
            <option value="AdvancedDiploma">AdvancedDiploma</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Course Name"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 3 Years"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Tag */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Tag</label>
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            placeholder="e.g., Engineering, Science, MBA"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>

      {/* 🔍 Search Bar */}
      <div className="mb-4 max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="🔍 Search by name, category, duration, or tag..."
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3">Category</th>
              <th className="p-3">Name</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Tag</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No courses found
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t hover:bg-gray-50 text-gray-800"
                >
                  <td className="p-3">{course.category}</td>
                  <td className="p-3">{course.name}</td>
                  <td className="p-3">{course.duration}</td>
                  <td className="p-3">{course.tag || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
