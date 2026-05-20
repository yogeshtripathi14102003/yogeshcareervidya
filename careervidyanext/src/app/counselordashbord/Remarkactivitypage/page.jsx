"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/utlis/api.js";
import {
  MessageSquare, Clock, User, Filter,
  ChevronLeft, ChevronRight, Search,
  RefreshCw, AlertCircle, CheckCircle2
} from "lucide-react";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

/* ═══════════════════════════════════════════
    SAFE HELPERS (Multi-Key Backend Support)
═══════════════════════════════════════════ */

// Sabhi possible key names ko handle karne ke liye fallback helper
const getHistoryArray = (lead) => {
  if (!lead) return [];
  return lead.followUpHistory || lead.remarks || lead.history || [];
};

const normalizeDateStr = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

// Kisi specific date ke remarks filter karne ke liye
const getHistoryForDate = (lead, targetDateStr) => {
  const history = getHistoryArray(lead);
  const targetNormalized = normalizeDateStr(targetDateStr);
  if (!targetNormalized) return [];
  
  return history.filter((h) => {
    const hDate = h?.date || h?.createdAt; 
    return hDate && normalizeDateStr(hDate) === targetNormalized;
  });
};

const getRemarkCount = (lead) => getHistoryArray(lead).length;

// Sabse naya (latest) remark nikalne ke liye
const getLatestHistory = (lead) => {
  const history = getHistoryArray(lead);
  return history.length ? history[history.length - 1] : null;
};

const STATUS_COLORS = {
  "New":            { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Hot Lead":        { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Follow-up":       { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "Details Shared":  { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF" },
  "Admission Done":  { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
  "Not Picked":      { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  "Not Interested":  { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
};

const getStatusStyle = (status) =>
  STATUS_COLORS[status] || { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" };

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

/* ═══════════════════════════════════════════
    MAIN COMPONENT
═══════════════════════════════════════════ */
const RemarkActivityPage = ({ isAdmin = false }) => {
  const [leads, setLeads]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [filterType, setFilterType]   = useState("today"); // today | once | multiple | all
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [counselorId, setCounselorId]     = useState(null);
  const [counselorName, setCounselorName] = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const ITEMS = 20;

  /* ── Auth Layer ── */
  useEffect(() => {
    if (!isAdmin) {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setCounselorId(u._id || u.id || null);
        setCounselorName(u.name || "");
      } catch (e) {
        console.error("Localstorage parsing error:", e);
      }
    }
  }, [isAdmin]);

  /* ── Data Fetching ── */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 1000 };
      if (!isAdmin && counselorId) params.id = counselorId;

      const res = await api.get("/api/v1/counselor-leads", { params });
      if (res.data.success) {
        // Debugging logs taaki data structure console me check ho sake
        if (res.data.data && res.data.data.length > 0) {
          console.log("👉 Full Lead Sample Object:", res.data.data[0]);
        }
        setLeads(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch API error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, counselorId]);

  useEffect(() => {
    if (isAdmin || counselorId) fetchLeads();
  }, [fetchLeads, isAdmin, counselorId]);

  /* ── Advanced Filtering (useMemo Performance Optimizer) ── */
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Search Logic
      const phone = lead.phone || lead.mobile || lead.contactNo || "";
      const matchSearch =
        !searchTerm ||
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toString().includes(searchTerm);
        
      if (!matchSearch) return false;

      // 2. Tab Filter Logic
      const count   = getRemarkCount(lead);
      const todayH  = getHistoryForDate(lead, selectedDate);

      if (filterType === "today")    return todayH.length > 0;
      if (filterType === "once")     return count === 1;
      if (filterType === "multiple") return count >= 2;
      if (filterType === "all")      return count > 0;
      return true;
    });
  }, [leads, searchTerm, filterType, selectedDate]);

  // Pagination bounds logic
  const totalPages = Math.ceil(filteredLeads.length / ITEMS);
  
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS;
    return filteredLeads.slice(start, start + ITEMS);
  }, [filteredLeads, currentPage]);

  /* ── Stats Calculations ── */
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      todayUpdated:   leads.filter((l) => getHistoryForDate(l, todayStr).length > 0).length,
      onceRemark:     leads.filter((l) => getRemarkCount(l) === 1).length,
      multipleRemark: leads.filter((l) => getRemarkCount(l) >= 2).length,
      totalRemarked:  leads.filter((l) => getRemarkCount(l) > 0).length,
      noRemark:       leads.filter((l) => getRemarkCount(l) === 0).length,
    };
  }, [leads]);

  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      {/* ── Top Header Bar ── */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-800">
                {isAdmin ? "All Counselors — Remark Activity" : "My Remark Activity"}
              </h1>
              {!isAdmin && counselorName && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Counselor: <span className="text-blue-600">{counselorName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-2 border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
              className="border rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 bg-white"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-5">

        {/* ── KPI Grid Dashboard ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Updated Today",  val: stats.todayUpdated,   color: "#2563EB", type: "today",    icon: <Clock size={14}/> },
            { label: "1x Remark Only", val: stats.onceRemark,     color: "#D97706", type: "once",     icon: <AlertCircle size={14}/> },
            { label: "2+ Remarks",     val: stats.multipleRemark, color: "#7C3AED", type: "multiple", icon: <CheckCircle2 size={14}/> },
            { label: "Has Any Remark", val: stats.totalRemarked,  color: "#0891B2", type: "all",      icon: <MessageSquare size={14}/> },
            { label: "No Remark Yet",  val: stats.noRemark,       color: "#DC2626", type: null,       icon: <User size={14}/> },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => s.type && (setFilterType(s.type), setCurrentPage(1))}
              className={`bg-white rounded-xl border p-3 shadow-sm transition-all
                ${s.type ? "cursor-pointer hover:shadow-md" : "cursor-default opacity-80"}
                ${filterType === s.type ? "ring-2 ring-offset-1 scale-[1.02] shadow-md" : ""}`}
              style={{ borderLeftWidth: 4, borderLeftColor: s.color }}
            >
              <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>
                {s.icon}
                <span className="text-[9px] font-black uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-2xl font-black text-slate-800">{s.val}</p>
            </div>
          ))}
        </div>

        {/* ── Filters Controllers Panel ── */}
        <div className="bg-white border rounded-xl shadow-sm p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg flex-wrap">
            {[
              { id: "today",    label: "📅 Today's Activity" },
              { id: "once",     label: "1️⃣  Only 1 Remark" },
              { id: "multiple", label: "🔁 2+ Remarks" },
              { id: "all",      label: "📋 All Remarked" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setFilterType(tab.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${filterType === tab.id
                    ? "bg-white shadow text-blue-700"
                    : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or phone..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400 w-52 text-slate-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                >
                  <Filter size={12} />
                </button>
              )}
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              {filteredLeads.length} leads
            </span>
          </div>
        </div>

        {/* ── Main Responsive Table Layout ── */}
        {loading ? (
          <div className="bg-white rounded-xl border p-16 text-center shadow-sm">
            <RefreshCw size={28} className="animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Activity Dashboard...</p>
          </div>
        ) : paginatedLeads.length === 0 ? (
          <div className="bg-white rounded-xl border p-16 text-center shadow-sm">
            <MessageSquare size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">No matching active logs found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] min-w-[860px]">
                <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3 text-left w-10">#</th>
                    <th className="p-3 text-left">Lead Details</th>
                    {isAdmin && <th className="p-3 text-left">Assigned Counselor</th>}
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Total Interaction</th>
                    <th className="p-3 text-left" style={{ minWidth: 280 }}>
                      {filterType === "today"
                        ? `Logs — ${new Date(selectedDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}`
                        : "Last Active Remark"}
                    </th>
                    <th className="p-3 text-left">Planned Follow-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedLeads.map((lead, idx) => {
                    const phone       = lead.phone || lead.mobile || lead.contactNo;
                    const count       = getRemarkCount(lead);
                    const dateHistory = getHistoryForDate(lead, selectedDate);
                    const latest      = getLatestHistory(lead);
                    const ss          = getStatusStyle(lead.status);
                    const followToday =
                      lead.followUpDate &&
                      normalizeDateStr(lead.followUpDate) === normalizeDateStr(new Date());

                    return (
                      <tr
                        key={lead._id || idx}
                        className={`hover:bg-blue-50/20 transition-colors ${followToday ? "bg-amber-50/30" : ""}`}
                      >
                        <td className="p-3 text-slate-400 font-bold">
                          {(currentPage - 1) * ITEMS + idx + 1}
                        </td>

                        <td className="p-3">
                          <div className="font-black text-slate-800 uppercase text-[11px]">
                            {lead.name}
                          </div>
                          {phone && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <a
                                href={`tel:${phone}`}
                                className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[9px] hover:underline"
                              >
                                <FaPhoneAlt size={8} /> {phone}
                              </a>
                              <a
                                href={`https://wa.me/${phone.toString().replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-500 hover:scale-110 transition-transform"
                              >
                                <FaWhatsapp size={14} />
                              </a>
                            </div>
                          )}
                          {lead.city && (
                            <div className="text-[9px] text-slate-400 mt-1 font-semibold uppercase">
                              📍 {lead.city}
                            </div>
                          )}
                        </td>

                        {isAdmin && (
                          <td className="p-3">
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                              {lead.assignedToName || "—"}
                            </span>
                          </td>
                        )}

                        <td className="p-3">
                          <span
                            className="px-2 py-1 rounded-full text-[9px] font-black border whitespace-nowrap uppercase tracking-wide"
                            style={{ background: ss.bg, color: ss.text, borderColor: ss.border }}
                          >
                            {lead.status === "Not Picked" ? "Dead Lead" : lead.status}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border
                              ${count === 0
                                ? "bg-red-50 text-red-500 border-red-100"
                                : count === 1
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-purple-50 text-purple-600 border-purple-100"}`}
                          >
                            <MessageSquare size={9} />
                            {count}x
                          </span>
                        </td>

                        {/* Remark Logs Render System */}
                        <td className="p-3">
                          {filterType === "today" ? (
                            <div className="flex flex-col gap-1 max-h-28 overflow-y-auto pr-1">
                              {dateHistory.length > 0 ? (
                                dateHistory.map((h, i) => (
                                  <div
                                    key={i}
                                    className="bg-blue-50/70 border border-blue-100 rounded-lg p-1.5"
                                  >
                                    <div className="flex items-center justify-between mb-1 gap-2">
                                      <span className="text-[8px] text-blue-500 font-bold">
                                        {fmtDate(h.date || h.createdAt)}
                                      </span>
                                      {h.status && (
                                        <span
                                          className="text-[7px] font-black px-1.5 rounded-full border uppercase"
                                          style={{
                                            background: getStatusStyle(h.status).bg,
                                            color: getStatusStyle(h.status).text,
                                            borderColor: getStatusStyle(h.status).border,
                                          }}
                                        >
                                          {h.status === "Not Picked" ? "Dead" : h.status}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-700 font-semibold leading-relaxed">
                                      {h.remark || h.text || h.comment || "—"}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-300 text-[10px] italic">No active logs on this date</span>
                              )}
                            </div>
                          ) : (
                            latest ? (
                              <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-1.5">
                                <div className="flex items-center justify-between mb-1 gap-2">
                                  <span className="text-[8px] text-slate-400 font-bold">
                                    {fmtDate(latest.date || latest.createdAt)}
                                  </span>
                                  {latest.status && (
                                    <span
                                      className="text-[7px] font-black px-1.5 rounded-full border uppercase"
                                      style={{
                                        background: getStatusStyle(latest.status).bg,
                                        color: getStatusStyle(latest.status).text,
                                        borderColor: getStatusStyle(latest.status).border,
                                      }}
                                    >
                                      {latest.status === "Not Picked" ? "Dead" : latest.status}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-700 font-semibold leading-relaxed">
                                  {latest.remark || latest.text || latest.comment || "—"}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-[10px] italic">No interaction records found</span>
                            )
                          )}
                        </td>

                        <td className="p-3 whitespace-nowrap">
                          {lead.followUpDate ? (
                            <div
                              className={`text-[10px] font-bold rounded-lg px-2 py-1 inline-block
                                ${followToday
                                  ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-sm animate-pulse"
                                  : "bg-slate-100 text-slate-600 border"}`}
                            >
                              {followToday && "🔔 "}
                              {fmtDate(lead.followUpDate)}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-[10px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-3 border-t bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing {(currentPage - 1) * ITEMS + 1}–
                  {Math.min(currentPage * ITEMS, filteredLeads.length)} of {filteredLeads.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-1.5 border rounded bg-white disabled:opacity-30 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-bold min-w-[80px] text-center text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 border rounded bg-white disabled:opacity-30 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemarkActivityPage;