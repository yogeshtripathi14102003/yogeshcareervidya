"use client";

import { useState } from "react";
import axios from "axios";

export default function AddUniversityPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universityImage, setUniversityImage] = useState(null);
  const [courses, setCourses] = useState([
    { name: "", logo: null, duration: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ➕ Add another course row
  const addCourse = () => {
    setCourses([...courses, { name: "", logo: null, duration: "" }]);
  };

  // 🧹 Remove a course row
  const removeCourse = (index) => {
    const updated = [...courses];
    updated.splice(index, 1);
    setCourses(updated);
  };

  // 🔄 Handle course input
  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  // 🚀 Submit university
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (universityImage) formData.append("universityImage", universityImage);

      // Append each course
      courses.forEach((course, index) => {
        formData.append(`courses[${index}][name]`, course.name);
        formData.append(`courses[${index}][duration]`, course.duration);
        if (course.logo) {
          formData.append(`courses[${index}][logo]`, course.logo);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/api/university", // 🔁 update URL if needed
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ University added successfully!");
      setName("");
      setDescription("");
      setUniversityImage(null);
      setCourses([{ name: "", logo: null, duration: "" }]);
    } catch (error) {
      setMessage("❌ Error: " + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[#0056B3]">
        Add University
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* University Name */}
        <div>
          <label className="block font-medium mb-1">University Name</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded-lg p-2"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* University Image */}
        <div>
          <label className="block font-medium mb-1">University Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUniversityImage(e.target.files[0])}
          />
        </div>

        {/* Courses Section */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-lg mb-2 text-[#0056B3]">
            Courses
          </h3>

          {courses.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4"
            >
              <div>
                <label className="block text-sm mb-1">Course Name</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={course.name}
                  onChange={(e) =>
                    handleCourseChange(index, "name", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Duration</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={course.duration}
                  onChange={(e) =>
                    handleCourseChange(index, "duration", e.target.value)
                  }
                  placeholder="e.g. 2 Years"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Course Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleCourseChange(index, "logo", e.target.files[0])
                  }
                />
              </div>

              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(index)}
                  className="text-red-500 text-sm underline col-span-full"
                >
                  Remove this course
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCourse}
            className="bg-[#0056B3] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Add Another Course
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
        >
          {loading ? "Saving..." : "Add University"}
        </button>

        {message && (
          <p className="text-center mt-2 text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
