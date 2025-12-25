"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

export default function UniversitiesFetchComponent({ onSelect }) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDetails, setSelectedDetails] = useState([]);

  // Fetch universities from API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        const data = res.data.data || res.data.universities || [];

        // Format approvals consistently
        const formatted = data.map((u) => ({
          ...u,
          approvals: Array.isArray(u.approvals)
            ? u.approvals.map((a) =>
                typeof a === "string"
                  ? { name: a, logo: null }
                  : { name: a.name, logo: a.logo || null }
              )
            : [],
        }));

        setUniversities(formatted);
      } catch (err) {
        setError("Failed to fetch universities");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filter universities by search term
  const filtered = universities.filter((u) => {
    const name = u.universityName || u.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Handle select/deselect
  const toggleSelect = (uni) => {
    let updated;
    const isSelected = selectedDetails.some((item) => item._id === uni._id);

    if (isSelected) {
      updated = selectedDetails.filter((item) => item._id !== uni._id);
    } else {
      updated = [...selectedDetails, uni];
    }

    setSelectedDetails(updated);

    if (onSelect) {
      const formattedForBackend = updated.map((u) => ({
        name: u.universityName || u.name,
        approvals: Array.isArray(u.approvals)
          ? u.approvals.map((a) => ({ name: a.name, logo: a.logo || null }))
          : [],
      }));

      onSelect(formattedForBackend);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-6xl mx-auto space-y-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800">Select Universities</h2>

      <input
        type="text"
        placeholder="🔍 Search university by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
      />

      {loading && <p className="text-center text-purple-600">Loading universities...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Universities Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto p-2">
        {filtered.map((uni) => {
          const isSelected = selectedDetails.some((item) => item._id === uni._id);
          return (
            <label
              key={uni._id}
              className={`border-2 rounded-xl p-4 flex items-center gap-4 cursor-pointer ${
                isSelected ? "border-purple-600 bg-purple-50" : "border-gray-100 bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(uni)}
                className="w-5 h-5 accent-purple-600"
              />
              <div className="flex items-center gap-3">
                {uni.logo && (
                  <img
                    src={uni.logo}
                    alt="logo"
                    className="w-10 h-10 object-contain border rounded bg-white"
                  />
                )}
                <div>
                  <p className="font-semibold text-sm">{uni.universityName || uni.name}</p>
                  <p className="text-xs text-gray-500">{uni.location || "Location N/A"}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Selected Universities Table */}
      {selectedDetails.length > 0 && (
        <div className="mt-8 border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-3">Logo</th>
                <th className="p-3">University</th>
                <th className="p-3">Approvals</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {selectedDetails.map((uni) => (
                <tr key={uni._id} className="border-t">
                  <td className="p-3">
                    {uni.logo ? (
                      <img src={uni.logo} alt="logo" className="w-10 h-10 object-contain" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 font-medium">{uni.universityName || uni.name}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(uni.approvals) && uni.approvals.length > 0 ? (
                        uni.approvals.map((app, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold"
                          >
                            {app.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{uni.location || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
