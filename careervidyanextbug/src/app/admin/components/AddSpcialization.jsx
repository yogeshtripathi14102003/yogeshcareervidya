"use client";

import { useEffect, useState } from "react";
import API from "@/utlis/api.js";
import GetCourseForSpecialization from "@/app/admin/getonelyonline/getcourseforspecialization.jsx";

export default function AddProgram() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    courseId: "",
    name: "",
    duration: "",
    category: "",
    tag: "",
    specializations: [],
    seo: {
      title: "",
      description: "",
      keywords: "",
      canonicalUrl: "",
    },
    goodThings: [],
    faqs: [],
  });

  const [files, setFiles] = useState({
    programLogo: null,
    syllabusPdf: null,
  });

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/api/v1/course");

        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setCourses(list);
      } catch (err) {
        console.error("Fetch courses error:", err);
      }
    };

    fetchCourses();
  }, []);

  /* ================= HANDLERS ================= */
  const handleCourseSelect = (e) => {
    setForm((prev) => ({
      ...prev,
      courseId: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  };

  const updateItem = (key, index, value) => {
    const arr = [...form[key]];
    arr[index] = value;
    setForm((prev) => ({ ...prev, [key]: arr }));
  };

  const addItem = (key) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  };

  const removeItem = (key, index) => {
    const arr = form[key].filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, [key]: arr }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("courseId", form.courseId);
      fd.append("name", form.name);
      fd.append("duration", form.duration);
      fd.append("category", form.category);
      fd.append("tag", form.tag);
      fd.append("specializations", JSON.stringify(form.specializations));
      fd.append("goodThings", JSON.stringify(form.goodThings));
      fd.append("faqs", JSON.stringify(form.faqs));
      fd.append(
        "seo",
        JSON.stringify({
          ...form.seo,
          keywords: form.seo.keywords.split(","),
        })
      );

      if (files.programLogo) fd.append("programLogo", files.programLogo);
      if (files.syllabusPdf) fd.append("syllabusPdf", files.syllabusPdf);

      await API.post("/api/v1/program", fd);

      alert("✅ Program created successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Error creating program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">Add Program</h2>

      {/* COURSE SELECT */}
      <div>
        <label className="font-semibold text-sm">Select Course</label>
        <select
          value={form.courseId}
          onChange={handleCourseSelect}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* FETCH COURSE DETAILS */}
      <GetCourseForSpecialization
        courseId={form.courseId}
        onLoad={(course) =>
          setForm((prev) => ({
            ...prev,
            name: course.name || "",
            duration: course.duration || "",
            category: course.category || "",
            specializations: course.specializations || [],
          }))
        }
      />

      {/* AUTO FIELDS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          value={form.name}
          readOnly
          className="p-2 border rounded bg-gray-100"
          placeholder="Program Name"
        />
        <input
          value={form.duration}
          readOnly
          className="p-2 border rounded bg-gray-100"
          placeholder="Duration"
        />
      </div>

      {/* MANUAL */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <input
          name="tag"
          value={form.tag}
          onChange={handleChange}
          placeholder="Tag"
          className="p-2 border rounded"
        />
      </div>

      {/* SPECIALIZATIONS */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Specializations</h3>
        {form.specializations.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={s}
              onChange={(e) =>
                updateItem("specializations", i, e.target.value)
              }
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => removeItem("specializations", i)}
              className="text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("specializations")}
          className="text-blue-600 text-sm font-semibold"
        >
          + Add Specialization
        </button>
      </div>

      {/* FILES */}
      <div className="flex gap-4">
        <input
          type="file"
          onChange={(e) =>
            setFiles({ ...files, programLogo: e.target.files[0] })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setFiles({ ...files, syllabusPdf: e.target.files[0] })
          }
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold"
      >
        {loading ? "Saving..." : "Create Program"}
      </button>
    </div>
  );
}
