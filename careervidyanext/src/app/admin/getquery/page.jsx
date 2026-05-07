

"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js"; 
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  // ✅ Select All
  const toggleSelectAll = () => {
    if (selected.length === filteredQueries.length) {
      setSelected([]);
    } else {
      setSelected(filteredQueries.map((q) => q._id));
    }
  };

  // ✅ Delete single item
  const handleSingleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      setDeleting(true);
      await api.delete(`/api/v1/getintouch/${id}`);
      setQueries((prev) => prev.filter((q) => q._id !== id));
      alert("Query deleted successfully!");
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Bulk delete
  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      alert("Select at least one query!");
      return;
    }

    if (!confirm(`Delete ${selected.length} selected quer${
        selected.length > 1 ? "ies" : "y"
      }?`)
    )
      return;

    try {
      setDeleting(true);
      await Promise.all(
        selected.map((id) => api.delete(`/api/v1/getintouch/${id}`))
      );
      setQueries((prev) => prev.filter((q) => !selected.includes(q._id)));
      setSelected([]);
      alert("Selected queries deleted!");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Excel Download Function
  const downloadExcel = () => {
    const exportData = filteredQueries.map((q, i) => ({
      SNo: i + 1,
      Name: q.name,
      City: q.city,
      Email: q.email,
      Mobile: q.mobile,
      Message: q.message,
      Date: new Date(q.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Queries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `GetInTouch_${Date.now()}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Get In Touch Queries
      </h1>

      {/* Search + Filters + Buttons */}
      <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between mb-6 gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search name, email, mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-[30%]"
        />

        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <div>
            <label className="text-sm mr-2">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="text-sm mr-2">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Download Excel */}
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          📥 Download Excel
        </button>

        {/* Bulk Delete */}
        <button
          onClick={handleBulkDelete}
          disabled={deleting || selected.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selected.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {deleting ? "Deleting..." : `Delete (${selected.length})`}
        </button>
      </div>

      {/* Table */}
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
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredQueries.map((q, index) => (
                <tr
                  key={q._id}
                  className={`border-b hover:bg-gray-50 ${
                    selected.includes(q._id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      onChange={() => toggleSelect(q._id)}
                      checked={selected.includes(q._id)}
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
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
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
