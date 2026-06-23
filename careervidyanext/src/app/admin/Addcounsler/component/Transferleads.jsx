"use client";
import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";
import {
  Users,
  Loader2,
  Trash2,
  Filter,
  RefreshCw,
  Search,
  AlertCircle,
  ArrowRightLeft,
  X,
  Calendar,
  CheckCircle2
} from "lucide-react";

const LeadScheduler = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [selectedCounselorId, setSelectedCounselorId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Transfer Modal State
  const [transferModal, setTransferModal] = useState(null); // { fromCounselorId, fromCounselorName, status, maxCount }
  const [transferTarget, setTransferTarget] = useState("");
  const [transferCount, setTransferCount] = useState("");
  const [transferMode, setTransferMode] = useState("all"); // "all" | "day" | "month"
  const [transferDate, setTransferDate] = useState("");
  const [transferMonth, setTransferMonth] = useState("");
  const [transferYear, setTransferYear] = useState(String(new Date().getFullYear()));
  const [transferring, setTransferring] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

  const statuses = [
    "New", "Not Interested", "Details Shared", "Follow-up", "Hot Lead",
    "University Issue", "Fee Issue", "Distance Issue", "Language Issue",
    "Not Picked", "Admission Done"
  ];

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];

  // Memoized Fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Backend ko limit: "all" dena zaroori hai taaki filters accurate rahein
      const [resLeads, resCounselors] = await Promise.all([
        api.get("/api/v1/leads", { params: { limit: "all" } }),
        api.get("/api/v1/counselor")
      ]);

      if (resLeads.data.success) {
        // Sirf wahi leads jo assigned hain
        const leadsData = resLeads.data.data || [];
        setAssignedLeads(leadsData.filter(l => l.assignedTo || l.counselorId));
      }
      if (resCounselors.data.success) {
        setCounselors(resCounselors.data.data);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteByStatus = async (statusName, counselorId) => {
    if (!confirm(`Kya aap sure hain? Is counselor ki saari "${statusName}" leads delete ho jayengi!`)) return;

    setLoading(true);
    try {
      const res = await api.delete(`/api/v1/leads/bulk-delete`, {
        params: { status: statusName, counselorId }
      });
      if (res.data.success) {
        fetchData(); // Reload data after delete
      }
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TRANSFER LOGIC ================= */
  const openTransferModal = (statusName, counselorId, counselorName, maxCount) => {
    setTransferModal({ fromCounselorId: counselorId, fromCounselorName: counselorName, status: statusName, maxCount });
    setTransferTarget("");
    setTransferCount("");
    setTransferMode("all");
    setTransferDate("");
    setTransferMonth("");
    setTransferYear(String(new Date().getFullYear()));
    setTransferResult(null);
  };

  const closeTransferModal = () => {
    if (transferring) return;
    setTransferModal(null);
    setTransferResult(null);
  };

  const submitTransfer = async () => {
    if (!transferTarget) {
      alert("Target counselor select karo");
      return;
    }
    if (transferMode === "day" && !transferDate) {
      alert("Date select karo");
      return;
    }
    if (transferMode === "month" && (!transferMonth || !transferYear)) {
      alert("Month aur year select karo");
      return;
    }

    const payload = {
      fromCounselorId: transferModal.fromCounselorId,
      toCounselorId: transferTarget,
      status: transferModal.status,
    };
    if (transferCount) payload.count = parseInt(transferCount);
    if (transferMode === "day") payload.targetDate = transferDate;
    if (transferMode === "month") {
      payload.month = parseInt(transferMonth);
      payload.year = parseInt(transferYear);
    }

    setTransferring(true);
    setTransferResult(null);
    try {
      const res = await api.post(`/api/v1/leads/transfer`, payload);
      if (res.data.success) {
        setTransferResult({ ok: true, message: res.data.message, total: res.data.totalTransferred });
        fetchData();
      } else {
        setTransferResult({ ok: false, message: res.data.message || "Transfer failed" });
      }
    } catch (err) {
      setTransferResult({ ok: false, message: err.response?.data?.message || "Transfer failed" });
    } finally {
      setTransferring(false);
    }
  };

  /* ================= REAL-TIME FILTER & GROUPING LOGIC ================= */
  const getFilteredData = () => {
    let filtered = [...assignedLeads];

    // 1. Counselor Filter
    if (selectedCounselorId !== "all") {
      filtered = filtered.filter(l => {
        const cid = l.assignedTo?._id || l.assignedTo || l.counselorId?._id || l.counselorId;
        return String(cid) === String(selectedCounselorId);
      });
    }

    // 2. Status Filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(l => l.status === selectedStatus);
    }

    // 3. Grouping for UI (Counselor Wise)
    return filtered.reduce((acc, lead) => {
      const counselorObj = lead.assignedTo || lead.counselorId;
      const cid = counselorObj?._id || counselorObj;

      if (!cid) return acc;

      if (!acc[cid]) {
        acc[cid] = {
          name: counselorObj?.name || "Unknown Counselor",
          statusCounts: {},
          total: 0
        };
      }

      const s = lead.status || "New";
      acc[cid].statusCounts[s] = (acc[cid].statusCounts[s] || 0) + 1;
      acc[cid].total += 1;
      return acc;
    }, {});
  };

  const displayData = getFilteredData();
  const hasData = Object.keys(displayData).length > 0;

  // Counselors list excluding the "from" counselor, for the transfer target dropdown
  const transferTargetOptions = transferModal
    ? counselors.filter(c => String(c._id) !== String(transferModal.fromCounselorId))
    : [];

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 text-slate-800">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <Users className="text-indigo-600" /> Lead Scheduler & Cleanup
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage, transfer, and cleanup leads assigned to counselors.</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold text-sm uppercase">
            <Filter size={16} />
            <span>Advance Filtering</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Counselor Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Select Counselor</label>
              <select
                className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
                value={selectedCounselorId}
                onChange={(e) => setSelectedCounselorId(e.target.value)}
              >
                <option value="all">All Counselors</option>
                {counselors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Status Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Select Status</label>
              <select
                className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Display All Statuses</option>
                {statuses.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-3">
              <button
                onClick={() => {setSelectedCounselorId("all"); setSelectedStatus("all");}}
                className="h-10 px-4 text-sm text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl flex items-center gap-2 transition-colors border border-transparent"
              >
                <RefreshCw size={16}/> Reset
              </button>
              <button
                onClick={fetchData}
                className="h-10 px-4 text-sm bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-black transition-all shadow-md active:scale-95"
              >
                Sync Data
              </button>
            </div>
          </div>
        </div>

        {/* Display Cards */}
        {hasData ? (
          <div className="grid grid-cols-1 gap-8">
            {Object.entries(displayData).map(([cid, data]) => (
              <div key={cid} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                {/* Counselor Header */}
                <div className="bg-slate-900 p-4 px-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                      {data.name.charAt(0)}
                    </div>
                    <h3 className="text-white font-extrabold uppercase text-sm tracking-wide">{data.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Total Leads</span>
                    <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-lg font-black">{data.total}</span>
                  </div>
                </div>

                {/* Status Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {statuses.map(status => {
                      const count = data.statusCounts[status] || 0;

                      // Hide card if filter is active and doesn't match
                      if (selectedStatus !== "all" && status !== selectedStatus) return null;

                      return (
                        <div
                          key={status}
                          className={`group p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                            count > 0
                            ? 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                            : 'bg-slate-50 border-transparent opacity-40 grayscale'
                          }`}
                        >
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2">{status}</p>
                            <p className={`text-2xl font-black ${count > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
                              {count}
                            </p>
                          </div>

                          {count > 0 && (
                            <div className="mt-3 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => openTransferModal(status, cid, data.name, count)}
                                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 py-1.5 rounded-lg border border-transparent hover:border-indigo-100 transition-all"
                              >
                                <ArrowRightLeft size={12} /> TRANSFER
                              </button>
                              <button
                                onClick={() => deleteByStatus(status, cid)}
                                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-red-500 hover:bg-red-50 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all"
                              >
                                <Trash2 size={12} /> CLEANUP
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <AlertCircle size={48} className="text-slate-300 mb-4" />
             <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching leads found</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
          <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Synchronizing...</p>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <ArrowRightLeft size={16} className="text-indigo-400" />
                <h3 className="font-extrabold uppercase text-sm tracking-wide">Transfer Leads</h3>
              </div>
              <button onClick={closeTransferModal} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Moving <span className="font-black text-slate-800">"{transferModal.status}"</span> leads from{" "}
                  <span className="font-black text-slate-800">{transferModal.fromCounselorName}</span>{" "}
                  <span className="text-slate-400">({transferModal.maxCount} available)</span>
                </p>
              </div>

              {!transferResult ? (
                <>
                  {/* Target Counselor */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Transfer To</label>
                    <select
                      className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                    >
                      <option value="">Select counselor...</option>
                      {transferTargetOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Count */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                      How Many? <span className="text-slate-300 font-medium normal-case">(blank = all {transferModal.maxCount})</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={transferModal.maxCount}
                      placeholder={`Up to ${transferModal.maxCount}`}
                      value={transferCount}
                      onChange={(e) => setTransferCount(e.target.value)}
                      className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
                    />
                  </div>

                  {/* Date Filter Mode */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                      <Calendar size={12} /> Date Range
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "all", label: "All Time" },
                        { key: "day", label: "Specific Day" },
                        { key: "month", label: "Specific Month" },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setTransferMode(opt.key)}
                          className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                            transferMode === opt.key
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {transferMode === "day" && (
                      <input
                        type="date"
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                        className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all mt-2"
                      />
                    )}

                    {transferMode === "month" && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <select
                          value={transferMonth}
                          onChange={(e) => setTransferMonth(e.target.value)}
                          className="border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
                        >
                          <option value="">Month</option>
                          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                        <input
                          type="number"
                          placeholder="Year"
                          value={transferYear}
                          onChange={(e) => setTransferYear(e.target.value)}
                          className="border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={submitTransfer}
                    disabled={transferring || !transferTarget}
                    className="w-full h-11 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
                  >
                    {transferring ? (
                      <><Loader2 size={16} className="animate-spin" /> Transferring...</>
                    ) : (
                      <><ArrowRightLeft size={16} /> Confirm Transfer</>
                    )}
                  </button>
                </>
              ) : (
                /* Result State */
                <div className="text-center py-4 space-y-3">
                  {transferResult.ok ? (
                    <>
                      <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                      <p className="font-black text-slate-800 text-sm">{transferResult.total} leads transferred</p>
                      <p className="text-slate-400 text-xs font-medium">{transferResult.message}</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={40} className="text-red-500 mx-auto" />
                      <p className="font-black text-slate-800 text-sm">Transfer failed</p>
                      <p className="text-slate-400 text-xs font-medium">{transferResult.message}</p>
                    </>
                  )}
                  <button
                    onClick={closeTransferModal}
                    className="w-full h-10 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm mt-2"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScheduler;