"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js"; // centralized axios instance

export default function GetInTouchTable() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Fetch all queries
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await api.get("/api/v1/getintouch");
        setQueries(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching queries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  // ✅ Filter by search and date range
  const filteredQueries = queries.filter((q) => {
    const term = search.toLowerCase();
    const created = new Date(q.createdAt);

    const matchesSearch =
      q.name.toLowerCase().includes(term) ||
      q.email.toLowerCase().includes(term) ||
      q.mobile.toLowerCase().includes(term);

    const matchesDate =
      (!fromDate || created >= new Date(fromDate)) &&
      (!toDate || created <= new Date(toDate));

    return matchesSearch && matchesDate;
  });

  // ✅ Select toggle
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Select all toggle
  const toggleSelectAll = () => {
    if (selected.length === filteredQueries.length) {
      setSelected([]);
    } else {
      setSelected(filteredQueries.map((q) => q._id));
    }
  };

  // ✅ Delete single query
  const handleSingleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this query?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/api/v1/getintouch/${id}`);
      setQueries((prev) => prev.filter((q) => q._id !== id));
      alert("✅ Query deleted successfully!");
    } catch (err) {
      console.error("Error deleting query:", err);
      alert("❌ Failed to delete query!");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Bulk delete
  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      alert("⚠️ Please select at least one query to delete.");
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selected.length} selected quer${
        selected.length > 1 ? "ies" : "y"
      }?`
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await Promise.all(selected.map((id) => api.delete(`/api/v1/getintouch/${id}`)));
      setQueries((prev) => prev.filter((q) => !selected.includes(q._id)));
      setSelected([]);
      alert("✅ Selected queries deleted successfully!");
    } catch (err) {
      console.error("Error deleting selected queries:", err);
      alert("❌ Failed to delete some queries.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Get In Touch Queries
      </h1>

      {/* 🔍 Search + Date Filter + Bulk Delete */}
      <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between mb-6 gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by name, email, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-[30%] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date filters */}
        <div className="flex items-center gap-2">
          <div>
            <label className="text-sm text-gray-600 mr-2">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bulk Delete Button */}
        <button
          onClick={handleBulkDelete}
          disabled={deleting || selected.length === 0}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            deleting
              ? "bg-gray-400 cursor-not-allowed"
              : selected.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 transition"
          }`}
        >
          {deleting
            ? "Deleting..."
            : selected.length === 0
            ? "Delete Selected"
            : `Delete (${selected.length})`}
        </button>
      </div>

      {/* 🧾 Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : filteredQueries.length === 0 ? (
        <p className="text-center text-gray-500">No queries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      selected.length === filteredQueries.length &&
                      filteredQueries.length > 0
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((q, index) => (
                <tr
                  key={q._id}
                  className={`border-b hover:bg-gray-50 transition ${
                    selected.includes(q._id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(q._id)}
                      onChange={() => toggleSelect(q._id)}
                    />
                  </td>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{q.name}</td>
                  <td className="px-4 py-3">{q.city}</td>
                  <td className="px-4 py-3">{q.email}</td>
                  <td className="px-4 py-3">{q.mobile}</td>
                  <td className="px-4 py-3">{q.message}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSingleDelete(q._id)}
                      disabled={deleting}
                      className={`px-3 py-1 rounded-md text-white ${
                        deleting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 transition"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
