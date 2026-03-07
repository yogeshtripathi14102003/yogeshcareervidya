"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import { useParams, useRouter } from "next/navigation";

export default function EditBlog() {

  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(null);

  const [files, setFiles] = useState({
    coverImage: null,
    authorImage: null,
    contentMedia: {},
  });

  /* ---------------- FETCH BLOG ---------------- */

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/api/v1/blog/${id}`);

      const blog = res.data?.data || res.data;

      setFormData({
        ...blog,
        seo: {
          ...blog.seo,
          keywords: blog.seo?.keywords?.join(", "),
        },
      });

    } catch (error) {
      console.error(error);
      alert("Failed to load blog");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e, path) => {
    const value = e.target.value;

    setFormData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let ref = updated;

      path.forEach((key, i) => {
        if (i === path.length - 1) ref[key] = value;
        else ref = ref[key];
      });

      return updated;
    });
  };

  /* ---------------- UPDATE BLOG ---------------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    const data = new FormData();

    const submissionData = {
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords
          .split(",")
          .map((k) => k.trim()),
      },
    };

    data.append("jsonData", JSON.stringify(submissionData));

    if (files.coverImage) data.append("coverImage", files.coverImage);
    if (files.authorImage) data.append("authorImage", files.authorImage);

    Object.keys(files.contentMedia).forEach((index) => {
      data.append("contentImages", files.contentMedia[index]);
      data.append("contentIndex", index);
    });

    try {

      await api.put(`/api/v1/blog/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Blog Updated Successfully");

      router.push("/admin/blogs");

    } catch (err) {

      console.error(err);

      alert("❌ Update Failed");

    } finally {

      setLoading(false);

    }
  };

  /* ---------------- LOADING ---------------- */

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Blog...
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Edit Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">

          {/* TITLE */}

          <div>
            <label className="font-semibold text-sm">Title</label>
            <input
              className="w-full border p-2 rounded"
              value={formData.title || ""}
              onChange={(e) => handleChange(e, ["title"])}
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="font-semibold text-sm">Category</label>
            <input
              className="w-full border p-2 rounded"
              value={formData.category || ""}
              onChange={(e) => handleChange(e, ["category"])}
            />
          </div>

          {/* COVER IMAGE */}

          <div>

            <label className="font-semibold text-sm">Cover Image</label>

            {formData.coverImage?.url && (
              <img
                src={formData.coverImage.url}
                className="w-40 rounded mt-2 mb-2"
              />
            )}

            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, coverImage: e.target.files[0] })
              }
            />

          </div>

          {/* AUTHOR */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-semibold">Author Name</label>
              <input
                className="w-full border p-2 rounded"
                value={formData.author?.name || ""}
                onChange={(e) => handleChange(e, ["author", "name"])}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Designation</label>
              <input
                className="w-full border p-2 rounded"
                value={formData.author?.designation || ""}
                onChange={(e) =>
                  handleChange(e, ["author", "designation"])
                }
              />
            </div>

          </div>

          {/* SEO */}

          <div className="space-y-3">

            <h3 className="font-bold text-lg">SEO</h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Meta Title"
              value={formData.seo?.meta_title || ""}
              onChange={(e) =>
                handleChange(e, ["seo", "meta_title"])
              }
            />

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Meta Description"
              value={formData.seo?.meta_desc || ""}
              onChange={(e) =>
                handleChange(e, ["seo", "meta_desc"])
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Keywords"
              value={formData.seo?.keywords || ""}
              onChange={(e) =>
                handleChange(e, ["seo", "keywords"])
              }
            />

          </div>

          {/* SUBMIT */}

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>

        </form>

      </div>

    </div>
  );
}