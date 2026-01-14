"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";

export default function LocationManager() {
  const [bulkData, setBulkData] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH STATES ================= */
  const fetchStates = async () => {
    try {
      const res = await api.get("/api/v1/states");
      setStates(res.data.states || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load states");
    }
  };

  /* ================= FETCH DISTRICTS ================= */
  const fetchDistricts = async (state) => {
    try {
      const res = await api.get(`/api/v1/districts/${state}`);
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error(err);
      setDistricts([]);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  /* ================= BULK UPLOAD ================= */
  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkData); // validate JSON
      setLoading(true);

      await api.post("/api/v1/bulk-upload", parsed);

      alert("Data uploaded successfully");
      setBulkData("");
      fetchStates();
    } catch (err) {
      console.error(err);
      alert("Invalid JSON or upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATE CHANGE ================= */
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    if (state) fetchDistricts(state);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#05347f]">
        State & District Manager
      </h1>

      {/* ================= BULK UPLOAD ================= */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-lg">Bulk Upload (JSON)</h2>
        <p className="text-sm text-gray-500">
          Example JSON:
        </p>
        <pre className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
{`[
  {
    "state": "Delhi",
    "districts": ["Central Delhi", "East Delhi"]
  },
  {
    "state": "Rajasthan",
    "districts": ["Jaipur", "Jodhpur"]
  }
]`}
        </pre>

        <textarea
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          rows={10}
          className="w-full border rounded p-3 text-sm"
          placeholder="Paste JSON here..."
        />

        <button
          disabled={loading}
          onClick={handleBulkUpload}
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Upload Data"}
        </button>
      </div>

      {/* ================= SELECT STATE ================= */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-lg">View Districts</h2>

        <select
          value={selectedState}
          onChange={handleStateChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select State</option>
          {states.map((state, idx) => (
            <option key={idx} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* ================= DISTRICTS ================= */}
        {districts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {districts.map((dist, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded"
              >
                {dist}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
