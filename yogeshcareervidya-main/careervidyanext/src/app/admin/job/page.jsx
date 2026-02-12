"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api";
import Addjob from "../components/addjob";

export default function JobPostPage() {
  const [jobPosts, setJobPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/v1/addjob");
      setJobPosts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const handleAddJob = async (data) => {
    try {
      await api.post("/api/v1/addjob", data);
      fetchJobs();
    } catch (err) {
      console.error("Error adding job", err.response?.data || err.message);
    }
  };

  const handleEditJob = async (jobId, data) => {
    try {
      await api.put(`/api/v1/addjob/${jobId}`, data);
      fetchJobs();
    } catch (err) {
      console.error("Error editing job", err.response?.data || err.message);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job post?")) return;

    try {
      await api.delete(`/api/v1/addjob/${jobId}`);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  const filteredPosts = jobPosts.filter((post) => {
    const title = post?.title?.toLowerCase() || "";
    const desc = post?.description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return title.includes(search) || desc.includes(search);
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Job Posts</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search job..."
          className="border p-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => {
            setEditingPost(null);
            setIsFormOpen(true);
          }}
          className="bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Add Job
        </button>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Salary</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.jobId}>
              <td className="border p-2">{post.title}</td>
              <td className="border p-2">{post.description}</td>
              <td className="border p-2">₹{post.salaryRange}</td>

              <td className="border p-2 flex gap-2 justify-center">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setEditingPost(post);
                    setIsFormOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(post.jobId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <Addjob
          initialData={editingPost}
          onAdd={handleAddJob}
          onEdit={handleEditJob}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
