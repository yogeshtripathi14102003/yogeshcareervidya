"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utlis/api.js";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams(); // ✅ Dynamic route e.g. /edit-course/123

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    duration: "",
    tag: "",
  });
  const [specializations, setSpecializations] = useState([""]);
  const [courseLogo, setCourseLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  // ✅ Fetch existing course details
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/course/${id}`);
      const course = res.data.course;

      setFormData({
        category: course.category || "",
        name: course.name || "",
        duration: course.duration || "",
        tag: course.tag || "",
      });

      setSpecializations(course.specialization?.length ? course.specialization : [""]);
      setPreviewLogo(course.courseLogo?.url || null);
    } catch (err) {
      console.error("Error fetching course:", err);
      alert("❌ Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setCourseLogo(e.target.files[0]);

  const handleSpecializationChange = (index, value) => {
    const updated = [...specializations];
    updated[index] = value;
    setSpecializations(updated);
  };

  const addSpecialization = () => setSpecializations([...specializations, ""]);
  const removeSpecialization = (index) =>
    setSpecializations(specializations.filter((_, i) => i !== index));

  // ✅ Update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      specializations.forEach((spec) => payload.append("specialization", spec));

      if (courseLogo) payload.append("courseLogo", courseLogo);

      await api.put(`/api/v1/course/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Course updated successfully!");
      router.push("/courses"); // redirect back
    } catch (err) {
      console.error("Error updating course:", err);
      alert("❌ Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Close (cross) button handler
  const handleClose = () => router.push("/courses");

  return (
    <main className="relative min-h-screen bg-gray-50 p-8">
      {/* ✅ Cross Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
        title="Close"
      >
        ✕
      </button>

      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        ✏️ Edit Course
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white shadow rounded-xl p-6 space-y-6"
        >
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              >
                <option value="">Select</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="Doctorate">Doctorate</option>
                <option value="JobGuarantee">Job Guarantee</option>
              </select>
            </div>

            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div>
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div>
              <label>Tag</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div>
              <label>Course Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded-md"
              />
              {previewLogo && (
                <img
                  src={previewLogo}
                  alt="Current Logo"
                  className="mt-2 w-24 h-24 object-contain rounded"
                />
              )}
            </div>
          </div>

          {/* Specializations */}
          <section>
            <h2 className="font-semibold text-lg mb-2">Specializations</h2>
            {specializations.map((spec, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleSpecializationChange(i, e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSpecialization(i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecialization}
              className="text-blue-600"
            >
              + Add
            </button>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Course"}
          </button>
        </form>
      )}
    </main>
  );
}
