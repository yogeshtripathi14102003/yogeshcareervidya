"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Pencil, Trash2 } from "lucide-react";
import EditUniversityPage from "../components/Edituniversity";

export default function GetUniversityData() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editUni, setEditUni] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ SAFE IMAGE URL (NO fallback image)
  const getImage = (imageObj) => {
    const url = imageObj?.url || imageObj;

    if (!url) return null;
    if (typeof url === "string" && url.startsWith("http")) return url;

    if (BASE_URL && typeof url === "string") {
      return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
    }

    return null;
  };

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/university");
      setUniversities(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      setDeleting(id);
      await api.delete(`/api/v1/university/${id}`);
      fetchUniversities();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#0056B3]">
        🎓 University List
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-[#0056B3] text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Approvals</th>
              <th className="p-3">Recognition</th>
              <th className="p-3">Admission</th>
              <th className="p-3">Courses</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {universities.map((uni, i) => {
              const imageUrl = getImage(uni.universityImage);

              return (
                <tr key={uni._id} className="border-t">
                  <td className="p-3">{i + 1}</td>

                  <td className="p-3">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        className="h-14 w-14 rounded-full object-cover border"
                        alt={uni.name || "University"}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full border bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>

                  <td className="p-3 font-medium">{uni.name}</td>
                  <td className="p-3">{uni.approvals?.length || 0} approvals</td>
                  <td className="p-3">
                    {uni.recognition?.recognitionHeading || "N/A"}
                  </td>
                  <td className="p-3">
                    {uni.admission?.admissionHeading || "N/A"}
                  </td>
                  <td className="p-3">{uni.courses?.length || 0}</td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setEditUni(uni)}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(uni._id)}
                        disabled={deleting === uni._id}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editUni && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative shadow-lg max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-red-600 font-bold"
              onClick={() => setEditUni(null)}
            >
              X
            </button>

            <EditUniversityPage
              params={{ id: editUni._id }}
              onClose={() => setEditUni(null)}
              onUpdated={fetchUniversities}
            />
          </div>
        </div>
      )}
    </div>
  );
}
