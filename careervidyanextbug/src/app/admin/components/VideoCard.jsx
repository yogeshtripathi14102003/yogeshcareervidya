"use client";

import api from "@/utlis/api.js";

export default function VideoCard({ video, refresh }) {

  // ================= DELETE VIDEO =================
  const deleteVideo = async () => {
    if (!confirm("Delete this video?")) return;

    try {
      await api.delete(`/api/v1/videos/${video._id}`);

      alert("Video Deleted ✅");
      refresh();

    } catch (err) {
      console.log("Delete Error:", err.response?.data || err.message);
      alert("Delete Failed ❌");
    }
  };

  // ================= YOUTUBE EMBED =================
  const getEmbedUrl = (url) => {
    if (!url) return "";

    let videoId = "";

    // Short link: youtu.be/xxxx
    if (url.includes("youtu.be")) {
      videoId = url.split("/").pop();
    }

    // Normal: watch?v=xxxx
    else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    }

    // Already embed
    else if (url.includes("embed")) {
      return url;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="border rounded shadow p-4 bg-white">

      {/* TITLE */}
      <h3 className="font-semibold text-lg mb-2">
        {video.title}
      </h3>

      {/* VIDEO */}
      {video.videoType === "youtube" ? (

        <iframe
          src={getEmbedUrl(video.youtubeUrl)}
          className="w-full h-48 rounded"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />

      ) : (

        <video
          src={video.videoUrl}
          controls
          className="w-full h-48 rounded"
        />

      )}

      {/* CATEGORY */}
      <p className="text-gray-600 mt-2 text-sm">
        Category: {video.category || "General"}
      </p>

      {/* DELETE BUTTON */}
      <button
        onClick={deleteVideo}
        className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
      >
        Delete
      </button>

    </div>
  );
}