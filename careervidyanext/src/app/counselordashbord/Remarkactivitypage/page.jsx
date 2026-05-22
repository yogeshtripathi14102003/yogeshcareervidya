


"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/utlis/api.js";
import {
  Clock, User, ChevronLeft, ChevronRight, 
  Search, RefreshCw, AlertCircle, PhoneCall, Calendar
} from "lucide-react";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

/* ═══════════════════════════════════════════
    SAFE DATA EXTRACTOR HELPERS
═══════════════════════════════════════════ */

const getLogsArray = (lead) => {
  if (!lead) return [];
  const logs = lead.followUpHistory || lead.remarks || lead.history || lead.activityLog || lead.logs || [];
  return Array.isArray(logs) ? logs : [];
};

const matchDateStrings = (logIsoStr, selectedDateYMD) => {
  if (!logIsoStr || !selectedDateYMD) return false;
  const d = new Date(logIsoStr);
  if (isNaN(d.getTime())) return false;
  
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}` === selectedDateYMD;
};

const matchMonthStrings = (logIsoStr, selectedDateYMD) => {
  if (!logIsoStr || !selectedDateYMD) return false;
  const d = new Date(logIsoStr);
  if (isNaN(d.getTime())) return false;
  
  const targetYearMonth = selectedDateYMD.substring(0, 7);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}` === targetYearMonth;
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
    MAIN DASHBOARD COMPONENT
═══════════════════════════════════════════ */
const RemarkActivityPage = ({ isAdmin = false }) => {
  const [leads, setLeads]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [filterType, setFilterType]   = useState("all"); 
  const [timeScope, setTimeScope]     = useState("day"); 
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [counselorId, setCounselorId]     = useState(null);
  const [counselorName, setCounselorName] = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const ITEMS = 20;

  useEffect(() => {
    if (!isAdmin) {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setCounselorId(u._id || u.id || null);
        setCounselorName(u.name || "");
      } catch (e) {
        console.error("Session fetch error:", e);
      }
    }
  }, [isAdmin]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 5000 };
      if (!isAdmin && counselorId) params.id = counselorId;

      const res = await api.get("/api/v1/counselor-leads", { params });
      if (res.data.success) {
        setLeads(res.data.data || []);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, counselorId]);

  useEffect(() => {
    if (isAdmin || counselorId) fetchLeads();
  }, [fetchLeads, isAdmin, counselorId]);

  /* ── Metric Performance Engine ── */
  const stats = useMemo(() => {
    let scopedCallsCount = 0;
    let leadsTouchedInScope = 0;
    let noRemarkCount = 0; 

    leads.forEach((l) => {
      const logList = getLogsArray(l);
      let leadHasScopeActivity = false;

      // 1. GLOBAL NO-REMARK CHECK (अब इसमें 'Not Interested' को काउंट नहीं किया जाएगा)
      const hasRootRemark = !!(l.remark?.toString().trim() || l.latestRemark?.toString().trim());
      if (logList.length === 0 && !hasRootRemark) {
        if (l.status !== "Not Interested") { // ◄ बदलाव यहाँ है
          noRemarkCount++;
        }
      }

      // 2. LIVE DATE/MONTH ACTIVITY TRACKER
      logList.forEach((log) => {
        const logDate = typeof log === "object" ? (log.date || log.createdAt) : l.updatedAt;
        
        let isMatch = false;
        if (timeScope === "day")         isMatch = matchDateStrings(logDate, selectedDate);
        else if (timeScope === "month")  isMatch = matchMonthStrings(logDate, selectedDate);
        else                             isMatch = true;

        if (isMatch) {
          scopedCallsCount++;
          leadHasScopeActivity = true;
        }
      });

      if (logList.length === 0 && hasRootRemark) {
        let isRootMatch = false;
        if (timeScope === "day")         isRootMatch = matchDateStrings(l.updatedAt, selectedDate);
        else if (timeScope === "month")  isRootMatch = matchMonthStrings(l.updatedAt, selectedDate);
        else                             isRootMatch = true;

        if (isRootMatch) {
          scopedCallsCount++;
          leadHasScopeActivity = true;
        }
      }

      if (leadHasScopeActivity) {
        leadsTouchedInScope++;
      }
    });

    return {
      totalPool:    leads.length,
      totalCalls:   scopedCallsCount, 
      interacted:   leadsTouchedInScope,
      noRemarks:    noRemarkCount, 
      pending:      leads.length - leadsTouchedInScope
    };
  }, [leads, selectedDate, timeScope]);

  /* ── Filter Engine ── */
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const phone = lead.phone || lead.mobile || lead.contactNo || "";
      const matchSearch =
        !searchTerm ||
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toString().includes(searchTerm);
        
      if (!matchSearch) return false;

      const logList = getLogsArray(lead);
      const hasRootRemark = !!(lead.remark?.toString().trim() || lead.latestRemark?.toString().trim());

      // ROUTE A: Absolute Zero Remark Filtering (यहाँ से 'Not Interested' को पूरी तरह हटा दिया गया है)
      if (filterType === "no_remark") {
        if (lead.status === "Not Interested") return false; // ◄ बदलाव यहाँ है
        return logList.length === 0 && !hasRootRemark;
      }

      // ROUTE B: Time & Date Filter Route
      let matchScopeActivity = false;
      logList.forEach((log) => {
        const logDate = typeof log === "object" ? (log.date || log.createdAt) : lead.updatedAt;
        if (timeScope === "day" && matchDateStrings(logDate, selectedDate)) matchScopeActivity = true;
        if (timeScope === "month" && matchMonthStrings(logDate, selectedDate)) matchScopeActivity = true;
        if (timeScope === "lifetime") matchScopeActivity = true;
      });

      if (logList.length === 0 && hasRootRemark) {
        if (timeScope === "day" && matchDateStrings(lead.updatedAt, selectedDate)) matchScopeActivity = true;
        if (timeScope === "month" && matchMonthStrings(lead.updatedAt, selectedDate)) matchScopeActivity = true;
        if (timeScope === "lifetime") matchScopeActivity = true;
      }

      if (filterType === "interacted") return matchScopeActivity;
      if (filterType === "pending")    return !matchScopeActivity;
      
      return true; 
    });
  }, [leads, searchTerm, filterType, selectedDate, timeScope]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS);
  
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS;
    return filteredLeads.slice(start, start + ITEMS);
  }, [filteredLeads, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 pb-10">

      {/* Control Header Layout */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <PhoneCall size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-800">
                {isAdmin ? "Counselors Analysis Panel" : "My Lead Audit Dashboard"}
              </h1>
              {!isAdmin && counselorName && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Counselor: <span className="text-blue-600">{counselorName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border text-[11px] font-bold">
              <button 
                onClick={() => { setTimeScope("day"); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-md transition-all ${timeScope === 'day' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                📅 Date View
              </button>
              <button 
                onClick={() => { setTimeScope("month"); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-md transition-all ${timeScope === 'month' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                📊 Month View
              </button>
              <button 
                onClick={() => { setTimeScope("lifetime"); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-md transition-all ${timeScope === 'lifetime' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                ♾️ Lifetime
              </button>
            </div>

            {timeScope !== "lifetime" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                className="border rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 bg-white"
              />
            )}

            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-2 border rounded-lg text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 flex items-center gap-1 text-xs font-bold bg-white"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Sync
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-5">

        {/* Metric Boxes Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          {[
            { label: "Total Lead Pool", val: stats.totalPool, color: "#64748B", type: "all" },
            { 
              label: timeScope === 'day' ? "Calls (Today )" : timeScope === 'month' ? "Calls (Selected Month)" : "Lifetime Calls", 
              val: stats.totalCalls, color: "#10B981", type: "interacted" 
            },
            { label: "🚫 No Remark Added", val: stats.noRemarks, color: "#EF4444", type: "no_remark" },
            { label: "Untouched Remaining", val: stats.pending, color: "#D97706", type: "pending" },
          ].map((s, idx) => (
            <div
              key={idx}
              onClick={() => s.type && (setFilterType(s.type), setCurrentPage(1))}
              className={`bg-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer hover:shadow-md
                ${filterType === s.type ? "ring-2 ring-offset-1 scale-[1.01] shadow-md" : ""}`}
              style={{ borderLeftWidth: 5, borderLeftColor: s.color }}
            >
              <span className="text-[9px] font-black uppercase tracking-wider block mb-1" style={{ color: s.color }}>
                {s.label}
              </span>
              <p className="text-2xl font-black text-slate-800">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Filter Tab Interface Center */}
        <div className="bg-white border rounded-xl shadow-sm p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg flex-wrap">
            {[
              { id: "all",        label: "📋 Complete Pool" },
              { id: "interacted", label: `✅ Contacted Leads` },
              { id: "no_remark",  label: `🚫 No Remark Added (${stats.noRemarks})` },
              { id: "pending",    label: `⏳ Fresh/No Contact` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setFilterType(tab.id); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${filterType === tab.id
                    ? "bg-white shadow text-blue-700"
                    : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate profiles..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400 w-56 text-slate-700"
            />
          </div>
        </div>

        {/* Table Rendering Space */}
        {loading ? (
          <div className="bg-white rounded-xl border p-16 text-center shadow-sm">
            <RefreshCw size={28} className="animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syncing System Engine...</p>
          </div>
        ) : paginatedLeads.length === 0 ? (
          <div className="bg-white rounded-xl border p-16 text-center shadow-sm">
            <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">No matching active profiles found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] min-w-[800px]">
                <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3 text-left w-10">#</th>
                    <th className="p-3 text-left">Lead Details</th>
                    {isAdmin && <th className="p-3 text-left">Assigned To</th>}
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Interactions Count</th>
                    <th className="p-3 text-left" style={{ minWidth: 340 }}>Remarks History Logs</th>
                    <th className="p-3 text-left">Last System Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedLeads.map((lead, idx) => {
                    const phone     = lead.phone || lead.mobile || lead.contactNo;
                    const logList   = getLogsArray(lead);
                    const ss        = getStatusStyle(lead.status);
                    const hasRootRemark = !!(lead.remark?.toString().trim() || lead.latestRemark?.toString().trim());
                    const totalLogsCount = logList.length === 0 && hasRootRemark ? 1 : logList.length;

                    const logsToRender = filterType === "no_remark" ? [] : logList.filter((log) => {
                      const logDate = typeof log === "object" ? (log.date || log.createdAt) : lead.updatedAt;
                      if (timeScope === "day") return matchDateStrings(logDate, selectedDate);
                      if (timeScope === "month") return matchMonthStrings(logDate, selectedDate);
                      return true;
                    });

                    const rootMatchesScope = filterType !== "no_remark" && logList.length === 0 && hasRootRemark && (
                      timeScope === "day" ? matchDateStrings(lead.updatedAt, selectedDate) :
                      timeScope === "month" ? matchMonthStrings(lead.updatedAt, selectedDate) : true
                    );

                    return (
                      <tr 
                        key={lead._id || idx} 
                        className={`hover:bg-blue-50/10 transition-colors 
                          ${totalLogsCount === 0 ? "bg-red-50/20" : ""} 
                          {(logsToRender.length > 0 || rootMatchesScope) ? "bg-emerald-50/10" : ""}`}
                      >
                        <td className="p-3 text-slate-400 font-bold">
                          {(currentPage - 1) * ITEMS + idx + 1}
                        </td>

                        <td className="p-3">
                          <div className="font-black text-slate-800 uppercase text-[11px]">
                            {lead.name || "Unknown Candidate"}
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
                                className="text-emerald-500 hover:scale-105 transition-transform"
                              >
                                <FaWhatsapp size={14} />
                              </a>
                            </div>
                          )}
                        </td>

                        {isAdmin && (
                          <td className="p-3 font-bold text-indigo-600">
                            {lead.assignedToName || "—"}
                          </td>
                        )}

                        <td className="p-3">
                          <span
                            className="px-2 py-1 rounded-full text-[9px] font-black border uppercase tracking-wide whitespace-nowrap"
                            style={{ background: ss.bg, color: ss.text, borderColor: ss.border }}
                          >
                            {lead.status || "New"}
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border 
                            ${totalLogsCount === 0 ? 'bg-red-100 text-red-700 border-red-200 shadow-sm' : 'bg-slate-50 text-slate-700'}`}
                          >
                            {totalLogsCount} {totalLogsCount === 0 ? "No Remarks 🚫" : "Logs Done"}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col gap-1 max-h-28 overflow-y-auto pr-1">
                            {logsToRender.length > 0 ? (
                              logsToRender.slice().reverse().map((log, i) => {
                                const remarkText = typeof log === "object"
                                  ? (log.remark || log.text || log.comment || log.remarks || "—")
                                  : log;
                                const logDate = typeof log === "object" ? (log.date || log.createdAt) : null;

                                return (
                                  <div key={i} className="bg-slate-50 border rounded p-1.5 border-slate-200">
                                    {logDate && (
                                      <p className="text-[8px] text-slate-400 font-black mb-0.5">⏱️ {fmtDate(logDate)}</p>
                                    )}
                                    <p className="text-[10px] text-slate-800 font-bold leading-tight">{remarkText}</p>
                                  </div>
                                );
                              })
                            ) : rootMatchesScope ? (
                              <div className="bg-emerald-50/50 border border-emerald-100 rounded p-1.5">
                                <p className="text-[8px] text-emerald-600 font-black mb-0.5">⏱️ {fmtDate(lead.updatedAt)}</p>
                                <p className="text-[10px] text-slate-800 font-bold">{lead.remark || lead.latestRemark}</p>
                              </div>
                            ) : (
                              <span className="text-red-400 italic text-[10px] font-bold">🚫 Zero Remarks / Completely Fresh Lead</span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 text-slate-500 font-semibold whitespace-nowrap">
                          {fmtDate(lead.updatedAt || lead.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination UI Block */}
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
                    className="p-1.5 border rounded bg-white disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-black min-w-[80px] text-center text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 border rounded bg-white disabled:opacity-30"
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