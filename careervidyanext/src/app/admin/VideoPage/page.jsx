"use client";

import { useEffect, useState } from "react";
import VideoCard from "@/app/admin/components/VideoCard.jsx";
import api from "@/utlis/api.js";// ✅ Import api

export default function VideoPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    videoUrl: "",
    category: "",
  });

  // ================= GET VIDEOS =================
  const fetchVideos = async () => {
    try {
      const res = await api.get("/api/v1/videos"); // ✅ No full URL
      const data = res.data;

      if (data.success) {
        setVideos(data.videos);
      }

    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD VIDEO =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      alert("Title required");
      return;
    }

    if (!form.youtubeUrl && !form.videoUrl) {
      alert("Add YouTube or Local URL");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/v1/videos/add", form); // ✅ Use api

      const data = res.data;

      if (data.success) {
        alert("Video Added ✅");

        setForm({
          title: "",
          youtubeUrl: "",
          videoUrl: "",
          category: "",
        });

        fetchVideos();

      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log("Submit Error:", err.response?.data || err.message);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">
        Video Manager
      </h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">
          Add New Video
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="youtubeUrl"
          placeholder="YouTube URL"
          value={form.youtubeUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="videoUrl"
          placeholder="Local Video URL"
          value={form.videoUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Add Video"}
        </button>
      </form>

      {/* ================= LIST ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              refresh={fetchVideos}
            />
          ))
        ) : (
          <p className="text-gray-500">No videos found</p>
        )}
      </div>

    </div>
  );
}