"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

export default function UniversitiesCardSelector({ onSelect }) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUniversities, setSelectedUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        setUniversities(res.data.data || []);
      } catch (err) {
        setError("Failed to fetch universities");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Search filter
  const filtered = universities.filter((u) => {
    const name =
      u?.universityName ||
      u?.name ||
      u?.collegeName ||
      u?.title ||
      "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Checkbox toggle
  const toggleSelect = (id) => {
    let updated;

    if (selectedUniversities.includes(id)) {
      updated = selectedUniversities.filter((x) => x !== id);
    } else {
      updated = [...selectedUniversities, id];
    }

    setSelectedUniversities(updated);

    if (onSelect) onSelect(updated);
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Select Universities</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search university..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto pr-2">
        {filtered.map((uni) => {
          const name =
            uni?.universityName ||
            uni?.name ||
            uni?.collegeName ||
            uni?.title ||
            "Unnamed University";

          return (
            <label
              key={uni._id}
              className="border rounded-lg p-3 flex items-start gap-3 cursor-pointer hover:shadow-md transition bg-gray-50"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedUniversities.includes(uni._id)}
                onChange={() => toggleSelect(uni._id)}
                className="mt-1 w-4 h-4"
              />

              {/* Text */}
              <div>
                <p className="font-medium">{name}</p>
                {uni.location && (
                  <p className="text-sm text-gray-600">{uni.location}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
