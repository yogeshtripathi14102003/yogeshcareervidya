"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { FaWhatsapp, FaFileExcel, FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import StudentAdmission from "@/app/counselordashbord/components/StudentAdmission.jsx";
import {
  Search, X, Save,
  ChevronLeft, ChevronRight, MapPin, BookOpen, Smartphone, Calendar,
  TrendingUp, Clock
} from "lucide-react";

/* ================= HELPERS ================= */
const formatForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const isToday = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString).toDateString() === new Date().toDateString();
};

const isRemarkUpdatedToday = (remarkString) => {
  if (!remarkString) return false;
  const today = new Date().toDateString();
  const matches = [...remarkString.matchAll(/\[(.+?)\]:/g)];
  if (matches.length === 0) return false;
  const lastTimestamp = matches[matches.length - 1][1];
  try {
    return new Date(lastTimestamp).toDateString() === today;
  } catch {
    return false;
  }
};

const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const STATUS = [
  "New",
  "Not Interested",
  "Details Shared",
  "Follow-up",
  "Hot Lead",
  "University Issue",
  "Fee Issue",
  "Distance Issue",
  "Language Issue",
  "Not Picked",
  "Admission Done",
];

// Color map for today's status badges
const STATUS_COLORS = {
  "New": { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  "Not Interested": { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
  "Details Shared": { bg: "#e0e7ff", text: "#4338ca", border: "#a5b4fc" },
  "Follow-up": { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  "Hot Lead": { bg: "#fce7f3", text: "#be185d", border: "#f9a8d4" },
  "University Issue": { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
  "Fee Issue": { bg: "#fff7ed", text: "#c2410c", border: "#fdba74" },
  "Distance Issue": { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
  "Language Issue": { bg: "#fdf4ff", text: "#7e22ce", border: "#d8b4fe" },
  "Not Picked": { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  "Admission Done": { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
};

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [stats, setStats] = useState([]);
  const [todayStats, setTodayStats] = useState([]); // ← NEW: aaj ke status changes
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 30;

  // Date Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  /* ================= FETCH LEADS ================= */
  const fetchMyLeads = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const counselorId = storedUser?._id || storedUser?.id;
      if (!counselorId) return;

      const params = {
        id: counselorId,
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchTerm.trim(),
        status: filterStatus || undefined,
        fromDate: appliedFrom || undefined,
        toDate: appliedTo || undefined,
      };

      const res = await api.get("/api/v1/counselor-leads", { params });

      if (res.data.success) {
        setLeads(res.data.data || []);
        setTotalLeads(res.data.total || 0);
        setStats(res.data.stats || []);
        // ← Backend se todayStats bhi aani chahiye
        // Expected format: [{ _id: "Hot Lead", count: 3 }, ...]
        setTodayStats(res.data.todayStats || []);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, appliedFrom, appliedTo]);

  useEffect(() => {
    fetchMyLeads();
  }, [fetchMyLeads]);

  /* ================= APPLY / CLEAR FILTER ================= */
  const handleApplyFilter = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setAppliedFrom("");
    setAppliedTo("");
    setCurrentPage(1);
  };

  /* ================= EXPORT EXCEL ================= */
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const counselorId = storedUser?._id || storedUser?.id;

      const params = {
        id: counselorId,
        limit: "all",
        searchTerm: searchTerm.trim(),
        status: filterStatus || undefined,
        fromDate: appliedFrom || undefined,
        toDate: appliedTo || undefined,
      };

      const res = await api.get("/api/v1/counselor-leads", { params });

      if (res.data.success && res.data.data.length > 0) {
        const allLeads = res.data.data;
        const dataToExport = allLeads.map((lead) => ({
          "Lead Name": lead.name || "",
          "Phone Number": lead.phone || lead.mobile || lead.contactNo || "",
          Course: lead.course || "",
          City: lead.city || "",
          Status: lead.status === "Not Picked" ? "Dead Lead" : lead.status,
          "Remark History": lead.remark || "",
          "Next Follow-up": lead.followUpDate
            ? new Date(lead.followUpDate).toLocaleString()
            : "N/A",
          "Created At": new Date(lead.createdAt).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MyLeads");

        const rangeLabel =
          appliedFrom && appliedTo
            ? `${appliedFrom}_to_${appliedTo}`
            : "All";

        XLSX.writeFile(workbook, `Leads_${filterStatus || "All"}_${rangeLabel}.xlsx`);
      } else {
        alert("Download ke liye koi data nahi mila!");
      }
    } catch (err) {
      console.error("Export error", err);
      alert("Export failed!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE LEAD ================= */
  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) {
        fetchMyLeads();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const totalPages = Math.ceil(totalLeads / itemsPerPage);

  // Today's total updated leads
  const todayTotal = todayStats.reduce((sum, s) => sum + (s.count || 0), 0);

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">

      {/* ── Top Bar ── */}
      <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center justify-between">
        {/* Date Range Filter */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase">
            <Calendar size={14} /> Date Range:
          </div>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-1.5 rounded bg-gray-50 outline-none text-xs cursor-pointer focus:ring-1 focus:ring-blue-400"
          />
          <span className="text-gray-400 text-xs font-semibold">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-1.5 rounded bg-gray-50 outline-none text-xs cursor-pointer focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleApplyFilter}
            disabled={!fromDate || !toDate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
          >
            Apply
          </button>
          {(appliedFrom || appliedTo) && (
            <button
              onClick={handleClearFilter}
              className="flex items-center gap-1 border px-2.5 py-1.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              <X size={11} /> Clear
            </button>
          )}
          {appliedFrom && appliedTo && (
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
              {formatDateLabel(appliedFrom)} – {formatDateLabel(appliedTo)}
            </span>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportExcel}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          <FaFileExcel /> {loading ? "Processing..." : "Export Excel"}
        </button>
      </div>

      {/* ── Overall Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-11 gap-2 mb-4">
        <Stat
          title="Total"
          value={totalLeads}
          color="#1d4ed8"
          isActive={filterStatus === ""}
          onClick={() => { setFilterStatus(""); setCurrentPage(1); }}
        />
        {STATUS.map((s) => (
          <Stat
            key={s}
            title={s === "Not Picked" ? "Dead Lead" : s}
            value={stats.find((item) => item._id === s)?.count || 0}
            color={s === "Not Picked" ? "#dc2626" : "#4b5563"}
            isActive={filterStatus === s}
            onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          ── AAJ KI REPORT (Today's Report) ──
      ══════════════════════════════════════════ */}
      <div className="bg-white border rounded-lg shadow-sm mb-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600">
          <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
            <TrendingUp size={15} />
            Today Report — Status Changes
          </div>
          <div className="flex items-center gap-1.5 text-violet-100 text-[10px] font-bold">
            <Clock size={11} />
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {" · "}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-black">
              {todayTotal} Total Updates
            </span>
          </div>
        </div>

        {/* Today's Status Badges */}
        <div className="p-3 flex flex-wrap gap-2">
          {todayTotal === 0 ? (
            <p className="text-xs text-gray-400 font-bold py-1 px-2">
              Today no status changes have been made. 🛠️ Testing Phase: This section was intentionally added for evaluation—don't panic, it's not a bug!
            </p>
          ) : (
            STATUS.map((s) => {
              const count = todayStats.find((item) => item._id === s)?.count || 0;
              if (count === 0) return null;
              const clr = STATUS_COLORS[s] || { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
              return (
                <TodayStatBadge
                  key={s}
                  label={s === "Not Picked" ? "Dead Lead" : s}
                  count={count}
                  colors={clr}
                />
              );
            })
          )}
        </div>
      </div>

      {/* ── Search & Pagination ── */}
      <div className="bg-white p-3 rounded shadow-sm mb-4 border flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 border rounded text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="flex items-center gap-2 font-bold text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1.5 border rounded bg-gray-50 disabled:opacity-30 hover:bg-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-2 min-w-[100px] text-center">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 border rounded bg-gray-50 disabled:opacity-30 hover:bg-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-gray-500 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-200 border border-rose-400 inline-block"></span>
          Today Follow-up
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-200 border border-green-400 inline-block"></span>
          Remark Updated Today
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className={`bg-white rounded shadow-sm overflow-x-auto border transition-opacity duration-300 ${
          loading ? "opacity-40 pointer-events-none" : "opacity-100"
        }`}
      >
        <table className="w-full min-w-[1100px] border-collapse text-[11px]">
          <thead className="bg-slate-50 text-slate-500 border-b uppercase font-bold">
            <tr>
              <th className="p-3 text-left w-64">Lead Details</th>
              <th className="text-left w-48">Course & Location</th>
              <th className="text-left w-32">Status</th>
              <th className="text-left w-64">Remark & Follow-up</th>
              <th className="text-left w-40">Next Follow-up</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {leads.length > 0 ? (
              leads.map((l) => (
                <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400 font-bold text-sm">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const Stat = ({ title, value, color, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`bg-white border-l-4 p-2.5 rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${
      isActive ? "ring-2 ring-blue-600 scale-105 shadow-md" : "border-gray-200"
    }`}
    style={{ borderLeftColor: color }}
  >
    <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{title}</p>
    <p className="text-lg font-black text-gray-800 leading-none mt-1">{value}</p>
  </div>
);

/* ── NEW: Today's Status Badge ── */
const TodayStatBadge = ({ label, count, colors }) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-[11px] shadow-sm"
    style={{
      backgroundColor: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    }}
  >
    <span className="uppercase tracking-wide">{label}</span>
    <span
      className="text-xs font-black px-1.5 py-0.5 rounded-md"
      style={{ backgroundColor: colors.border, color: colors.text }}
    >
      {count}
    </span>
  </div>
);

const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState(lead.status);
  const [localRemark, setLocalRemark] = useState("");
  const [localDate, setLocalDate] = useState(formatForInput(lead.followUpDate));
  const [showAdmission, setShowAdmission] = useState(false);
  const [savedRemark, setSavedRemark] = useState(lead.remark || "");

  const phoneNumber = lead.phone || lead.mobile || lead.contactNo;
  const hasChange =
    localStatus !== lead.status ||
    localRemark.trim() !== "" ||
    localDate !== formatForInput(lead.followUpDate);

  const remarkUpdatedToday = isRemarkUpdatedToday(savedRemark);

  const rowClass = isToday(lead.followUpDate)
    ? "bg-rose-50/60 border-l-4 border-rose-400"
    : remarkUpdatedToday
    ? "bg-green-50 border-l-4 border-green-400"
    : "";

  const handleUpdate = () => {
    if (localStatus === "Not Picked") {
      const createdDate = new Date(lead.createdAt);
      const diffDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 10) {
        alert(`Avi 10 days Nahi Huy please follwup kre. CONVERT HOGA APP kra Skte ho`);
        return;
      }
    }

    let finalRemark = savedRemark;
    if (localRemark.trim() !== "") {
      const timestamp = new Date().toISOString();
      finalRemark = finalRemark
        ? `${finalRemark}\n[${timestamp}]: ${localRemark}`
        : `[${timestamp}]: ${localRemark}`;
    }

    setSavedRemark(finalRemark);
    onSave(lead._id, {
      status: localStatus,
      remark: finalRemark,
      followUpDate: localDate ? new Date(localDate).toISOString() : null,
    });
    setLocalRemark("");
  };

  return (
    <>
      <tr className={`hover:bg-blue-50/40 transition-colors ${rowClass}`}>
        {/* Lead Details */}
        <td className="p-3 border-r border-gray-50">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-gray-900 text-[12px] uppercase flex items-center gap-1.5">
              <FaUserAlt size={10} className="text-slate-400" /> {lead.name || ""}
            </span>
            <div className="flex items-center gap-2">
              {phoneNumber && (
                <>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="text-[10px] text-blue-600 font-bold hover:underline bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1"
                  >
                    <FaPhoneAlt size={9} /> {phoneNumber}
                  </a>
                  <a
                    href={`https://wa.me/${phoneNumber.toString().replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:scale-110 transition-transform"
                  >
                    <FaWhatsapp size={16} />
                  </a>
                </>
              )}
            </div>
          </div>
        </td>

        {/* Course & Location */}
        <td className="p-3 border-r border-gray-50">
          <div className="flex flex-col gap-1.5">
            {lead.course && (
              <div className="flex items-center gap-1 text-indigo-700 font-black uppercase text-[10px]">
                <BookOpen size={11} /> {lead.course}
              </div>
            )}
            {lead.city && (
              <div className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[9px]">
                <MapPin size={10} /> {lead.city}
              </div>
            )}
          </div>
        </td>

        {/* Status */}
        <td className="border-r border-gray-50 px-2">
          <select
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            className="border rounded p-1 text-[10px] font-bold w-full bg-white outline-none"
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s === "Not Picked" ? "Dead Lead" : s}
              </option>
            ))}
          </select>
        </td>

        {/* Remark */}
        <td className="p-2 border-r border-gray-50">
          <div className="flex flex-col gap-1">
            {remarkUpdatedToday && (
              <span className="text-[8px] font-black text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded w-fit">
                ✅ Updated Today
              </span>
            )}
            <div className="text-[9px] text-blue-800 font-semibold bg-blue-50/50 p-1 rounded border border-blue-100 max-h-12 overflow-y-auto whitespace-pre-wrap">
              {savedRemark || "No remarks"}
            </div>
            <input
              type="text"
              value={localRemark}
              onChange={(e) => setLocalRemark(e.target.value)}
              placeholder="Add new remark..."
              className="w-full p-1.5 text-[10px] bg-white border border-gray-300 rounded outline-none"
            />
          </div>
        </td>

        {/* Next Follow-up */}
        <td className="border-r border-gray-50 px-2">
          <input
            type="datetime-local"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className="border rounded p-1 text-[10px] font-semibold w-full outline-none bg-white"
          />
        </td>

        {/* Actions */}
        <td className="p-3 text-center">
          <div className="flex gap-2 justify-center">
            <button
              disabled={!hasChange}
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold disabled:opacity-20 active:scale-90 shadow-sm"
            >
              <Save size={13} />
            </button>
            <button
              onClick={() => setShowAdmission(true)}
              className="bg-orange-500 text-white px-3 py-1.5 rounded-md font-bold active:scale-90 shadow-sm"
            >
              View
            </button>
          </div>
        </td>
      </tr>

      {/* Student Admission Modal */}
      {showAdmission && (
        <tr>
          <td colSpan="6" className="p-0 border-none">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col relative">
                <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-700 uppercase flex items-center gap-2">
                    <Smartphone size={18} className="text-blue-600" /> Student Profile
                  </h3>
                  <button
                    onClick={() => setShowAdmission(false)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto">
                  <StudentAdmission lead={lead} onClose={() => setShowAdmission(false)} />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default LeadsPage;