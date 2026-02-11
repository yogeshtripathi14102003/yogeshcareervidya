"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";

import {
  Plus,
  Trash2,
  Edit3,
  X,
  Lock,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";

import LeadScheduler from "@/app/admin/Addcounsler/component/Leadscheduler.jsx";
import AddCounselor from "@/app/admin/Addcounsler/component/addcounsller.jsx";
import Editcounsler from "@/app/admin/Addcounsler/component/editcounsler.jsx";
import Allcounslerreport from "@/app/admin/Addcounsler/component/Allcounslerreport.jsx";
import AdmissionListView from "@/app/admin/Addcounsler/component/AdmissionListView.jsx";
import Addfessstracture from "@/app/admin/Addcounsler/component/Addfessstracture.jsx";
import AdminTiket from "@/app/admin/Addcounsler/component/AdminTiket.jsx";

/* ================= STATUS OPTIONS ================= */
const STATUS_OPTIONS = ["active", "leave", "Inactive"];

const CounselorsListPage = () => {
  /* ================= AUTH ================= */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const CORRECT_PIN = "1234";

  /* ================= DATA ================= */
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= UI ================= */
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [feesOpen, setFeesOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false); // ✅ ADMIN TICKET MODAL

  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ================= LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === CORRECT_PIN) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Wrong PIN!");
      setPasswordInput("");
    }
  };

  /* ================= FETCH ================= */
  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res?.data?.success && Array.isArray(res.data.data)) {
        setCounselors(res.data.data);
      } else {
        setCounselors([]);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setCounselors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCounselors();
  }, [isAuthenticated]);

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    setSelectedId(id);
    setEditOpen(true);
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, newStatus) => {
    if (!id) return;
    try {
      await api.put(`/api/v1/counselor/${id}`, { status: newStatus });
      setCounselors((prev) =>
        prev.map((c) => (c?._id === id ? { ...c, status: newStatus } : c))
      );
    } catch {
      alert("Status update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this counselor?")) return;
    try {
      await api.delete(`/api/v1/counselor/${id}`);
      fetchCounselors();
    } catch {
      alert("Delete Failed");
    }
  };

  /* ================= FILTER ================= */
  const filteredCounselors = (counselors || []).filter((c) => {
    const matchesSearch =
      c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ================= LOGIN SCREEN ================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <Lock className="mx-auto mb-4 text-indigo-600" size={32} />
          <h2 className="text-xl font-bold text-center mb-4">
            Enter Security PIN
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-3 rounded mb-3 text-center"
              placeholder="Enter PIN"
            />
            {error && (
              <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            )}
            <button className="w-full bg-indigo-600 text-white py-2 rounded">
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* LOGOUT */}
      <button
        onClick={() => setIsAuthenticated(false)}
        className="absolute top-4 right-4 text-sm text-gray-400"
      >
        Lock Page
      </button>

      {/* ================= ADD MODAL ================= */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl relative p-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddOpen(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>
            <AddCounselor />
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl relative">
            <Editcounsler
              counselorId={selectedId}
              onClose={() => setEditOpen(false)}
              onSuccess={fetchCounselors}
            />
          </div>
        </div>
      )}

      {/* ================= SCHEDULER MODAL ================= */}
      {schedulerOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-xl relative p-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSchedulerOpen(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>
            <LeadScheduler />
          </div>
        </div>
      )}

      {/* ================= REPORT MODAL ================= */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl relative p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReportOpen(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Counselor Reports</h2>
            <Allcounslerreport counselors={counselors} />
          </div>
        </div>
      )}

      {/* ================= ADMISSION MODAL ================= */}
      {admissionOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-6xl rounded-xl relative p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAdmissionOpen(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Admission List</h2>
            <AdmissionListView />
          </div>
        </div>
      )}

      {/* ================= FEES MODAL ================= */}
      {feesOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-xl relative p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setFeesOpen(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Admission Fees Structure</h2>
            <Addfessstracture />
          </div>
        </div>
      )}

      {/* ================= ADMIN TICKET MODAL ================= */}
      {ticketOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-xl relative p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setTicketOpen(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Admin Tickets</h2>
            <AdminTiket />
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Counselors</h1>
            <p className="text-gray-500 text-sm">Manage counselors</p>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setAdmissionOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              📋 Admissions
            </button>
            <button
              onClick={() => setFeesOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              💰 Fees
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              <FileSpreadsheet size={18} /> Reports
            </button>
            <button
              onClick={() => setSchedulerOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              <Calendar size={18} /> Schedule
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              <Plus size={18} /> Add
            </button>
            <button
              onClick={() => setTicketOpen(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded"
            >
              🎫 Tickets
            </button>
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="bg-white p-4 rounded mb-4 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search name or email..."
            className="border p-2 rounded flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white shadow rounded overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading data...</p>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCounselors.map((c) => (
                  <tr
                    key={c?._id || Math.random()}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{c?.name || "-"}</td>
                    <td className="p-4 text-gray-600">{c?.email || "-"}</td>
                    <td className="p-4 text-gray-600">{c?.phone || "-"}</td>
                    <td className="p-4">
                      <select
                        value={c?.status || "active"}
                        onChange={(e) => updateStatus(c?._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 flex justify-end gap-4">
                      <button onClick={() => handleEdit(c?._id)} className="text-blue-600">
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c?._id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselorsListPage;
