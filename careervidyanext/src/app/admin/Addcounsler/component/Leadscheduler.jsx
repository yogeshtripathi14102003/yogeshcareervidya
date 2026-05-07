"use client";
import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";
import { Upload, Users, Shuffle, Save, Loader2, ListChecks, CheckCircle, XCircle, AlertCircle } from "lucide-react";

/* ── Module-level cache — lives as long as the browser tab is open ──────────
   Counselors almost never change mid-session, so fetch once and reuse.
   Leads cache cleared after upload/save so fresh data always shows.
────────────────────────────────────────────────────────────────────────────── */
const _cache = {
  counselors: null,        // null = not fetched yet
  promise: null,           // ongoing fetch (prevents duplicate parallel calls)
};

const getCounselorsOnce = () => {
  if (_cache.counselors)  return Promise.resolve(_cache.counselors); // instant, no API
  if (_cache.promise)     return _cache.promise;                     // reuse in-flight request
  _cache.promise = api.get("/api/v1/counselor")
    .then((res) => {
      if (res?.data?.success && Array.isArray(res.data.data)) {
        _cache.counselors = res.data.data.filter((c) => c.status === "active");
      }
      return _cache.counselors || [];
    })
    .finally(() => { _cache.promise = null; });
  return _cache.promise;
};


/* ── Toast ─────────────────────────────────────────────────────────────────── */
const Toast = ({ toasts, remove }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map((t) => (
      <div key={t.id} onClick={() => remove(t.id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold cursor-pointer
          ${t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-500" : "bg-amber-500"}`}>
        {t.type === "success" ? <CheckCircle size={16} /> : t.type === "error" ? <XCircle size={16} /> : <AlertCircle size={16} />}
        {t.message}
      </div>
    ))}
  </div>
);

const SkeletonRow = () => (
  <div className="flex gap-3 items-center p-3 animate-pulse">
    <div className="w-4 h-4 bg-gray-200 rounded" />
    <div className="flex-1 space-y-1">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-2 bg-gray-100 rounded w-1/4" />
    </div>
  </div>
);

/* ── Main ───────────────────────────────────────────────────────────────────── */
const LeadScheduler = () => {
  const [file, setFile]                       = useState(null);
  const [leads, setLeads]                     = useState([]);
  const [assignedLeads, setAssignedLeads]     = useState([]);
  const [counselors, setCounselors]           = useState([]);
  const [selectedLeads, setSelectedLeads]     = useState([]);
  const [leadAssignments, setLeadAssignments] = useState({});
  const [autoCounts, setAutoCounts]           = useState({});
  const [loading, setLoading]                 = useState(false);
  const [toasts, setToasts]                   = useState([]);

  // FIX: Separate loading flags — each section renders as soon as its data arrives
  const [leadsLoading, setLeadsLoading]           = useState(true);
  const [counselorsLoading, setCounselorsLoading] = useState(true);

  /* ── Toast ── */
  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  /* ── FIX: Fire both APIs independently — whichever comes first renders first ── */
  useEffect(() => {
    // LEADS — fires immediately, renders when done
    setLeadsLoading(true);
    api.get("/api/v1/leads?limit=all&unassignedOnly=true")
      .then((res) => {
        if (res.data.success) {
          const all = res.data.data;
          setLeads(all.filter((l) => !l.assignedTo));
          setAssignedLeads(all.filter((l) => l.assignedTo));
        }
      })
      .catch(() => toast("Failed to load leads", "error"))
      .finally(() => setLeadsLoading(false)); // leads section unlocks independently

    // COUNSELORS — uses cache, zero API call if already fetched this session
    setCounselorsLoading(true);
    getCounselorsOnce()
      .then((active) => {
        setCounselors(active);
        if (active.length === 0) toast("No active counselors found", "warning");
      })
      .catch(() => toast("Failed to load counselors", "error"))
      .finally(() => setCounselorsLoading(false));
  }, []);

  /* ── Refresh leads only (after upload / save) ── */
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await api.get("/api/v1/leads?limit=all&unassignedOnly=true");
      if (res.data.success) {
        const all = res.data.data;
        setLeads(all.filter((l) => !l.assignedTo));
        setAssignedLeads(all.filter((l) => l.assignedTo));
      }
    } catch {
      toast("Failed to refresh leads", "error");
    } finally {
      setLeadsLoading(false);
    }
  };

  /* ── Upload ── */
  const uploadExcel = async () => {
    if (!file) return toast("Please select a file", "warning");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/api/v1/leads/upload", form);
      const { total = 0, skipped = 0 } = res.data || {};
      toast(`${total} leads uploaded${skipped ? `, ${skipped} skipped` : ""}`, "success");
      fetchLeads();
      setFile(null);
      const inp = document.getElementById("lead-file-input");
      if (inp) inp.value = "";
    } catch (err) {
      toast(err?.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Selection ── */
  const toggleLead     = (id) => setSelectedLeads((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const selectAll      = () => setSelectedLeads(leads.map((l) => l._id));
  const clearSelection = () => { setSelectedLeads([]); setLeadAssignments({}); setAutoCounts({}); };
  const assignLead     = (id, cid) => setLeadAssignments((p) => ({ ...p, [id]: cid }));

  /* ── Auto distribute ── */
  const autoDistribute = () => {
    if (!selectedLeads.length)  return toast("Select leads first", "warning");
    if (!counselors.length)     return toast("No active counselors", "warning");
    const unique = selectedLeads.filter((id) => !assignedLeads.some((al) => al._id === id));
    if (!unique.length)         return toast("All selected leads already assigned!", "warning");

    const newAssign = {};
    let idx = 0;
    counselors.forEach((c) => {
      const count = Number(autoCounts[c._id] || 0);
      for (let i = 0; i < count && idx < unique.length; i++) newAssign[unique[idx++]] = c._id;
    });
    const remaining      = unique.slice(idx);
    const autoCounselors = counselors.filter((c) => {
      const v = autoCounts[c._id];
      return v === "" || v === undefined || (Number(v) === 0 && v !== "0");
    });
    remaining.forEach((lid, i) => {
      if (autoCounselors.length) newAssign[lid] = autoCounselors[i % autoCounselors.length]._id;
    });
    setLeadAssignments(newAssign);
    toast(`${Object.keys(newAssign).length} leads distributed`, "success");
  };

  /* ── Assign by count ── */
  const assignByCount = () => {
    if (!Object.keys(autoCounts).length) return toast("Enter counts first", "warning");
    const pool = [...leads];
    const newAssign = {};
    counselors.forEach((c) => {
      const count = Number(autoCounts[c._id] || 0);
      for (let i = 0; i < count; i++) {
        if (!pool.length) break;
        newAssign[pool.shift()._id] = c._id;
      }
    });
    if (!Object.keys(newAssign).length) return toast("No leads assigned — check counts", "warning");
    setSelectedLeads(Object.keys(newAssign));
    setLeadAssignments(newAssign);
    toast(`${Object.keys(newAssign).length} leads assigned by count`, "success");
  };

  /* ── Save ── */
  const saveDistribution = async () => {
    if (!selectedLeads.length) return toast("No leads selected", "warning");
    const counts = {};
    Object.values(leadAssignments).forEach((cid) => { if (cid) counts[cid] = (counts[cid] || 0) + 1; });
    if (!Object.keys(counts).length || Object.keys(leadAssignments).length !== selectedLeads.length)
      return toast("Assign all selected leads before saving", "warning");

    setLoading(true);
    try {
      await api.post("/api/v1/leads/assign-selected", { leadIds: selectedLeads, assignments: counts });
      toast("Leads assigned successfully!", "success");
      clearSelection();
      fetchLeads();
    } catch {
      toast("Assignment failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Toast toasts={toasts} remove={removeToast} />
      <div className="max-w-7xl mx-auto">

        {/* Header — counts update live as each API responds */}
        <div className="bg-white p-4 mb-4 rounded shadow flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Users className="text-indigo-600" />
            <h1 className="text-xl font-bold">Lead Scheduler</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Unassigned</p>
              {leadsLoading
                ? <Loader2 className="animate-spin text-indigo-400 ml-auto" size={18} />
                : <p className="text-xl font-black text-indigo-600 leading-none">{leads.length}</p>}
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Active Counselors</p>
              {counselorsLoading
                ? <Loader2 className="animate-spin text-green-400 ml-auto" size={18} />
                : <p className="text-xl font-black text-green-600 leading-none">{counselors.length}</p>}
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white p-4 mb-4 rounded shadow flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input id="lead-file-input" type="file" accept=".xls,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
            {file && <p className="text-xs text-indigo-500 mt-1 font-semibold">📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
          </div>
          <button onClick={uploadExcel} disabled={loading || !file}
            className="bg-indigo-600 text-white px-6 py-2 rounded flex gap-2 font-bold hover:bg-indigo-700 disabled:opacity-50 items-center">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Upload Excel
          </button>
          <p className="text-[10px] text-gray-400 w-full">✅ Blank fields (city, email, course etc.) are OK — only phone is required</p>
        </div>

        {/* Assignment Counts — skeleton while counselors load */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <ListChecks size={18} className="text-indigo-500" /> Assignment Counts
          </h3>
          {counselorsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => <div key={i} className="border p-2 rounded bg-gray-50 animate-pulse h-14" />)}
            </div>
          ) : counselors.length === 0 ? (
            <p className="text-sm text-amber-600 font-semibold italic">⚠️ No active counselors found. Activate counselors first.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {counselors.map((c) => (
                <div key={c._id} className="border p-2 rounded bg-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase truncate mb-1">{c.name}</p>
                  <input type="number" min="0" placeholder="0"
                    value={autoCounts[c._id] || ""}
                    onChange={(e) => setAutoCounts((p) => ({ ...p, [c._id]: e.target.value }))}
                    className="w-full border rounded px-2 py-1 text-sm font-bold text-indigo-600 focus:outline-indigo-500" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leads List — skeleton while leads load */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-slate-800">
              Unassigned Leads
              {selectedLeads.length > 0 && (
                <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  {selectedLeads.length} selected
                </span>
              )}
            </h3>
            <div className="flex gap-4 text-xs font-bold uppercase">
              <button onClick={selectAll} className="text-indigo-600 hover:underline">Select All</button>
              <button onClick={clearSelection} className="text-red-500 hover:underline">Clear</button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto border rounded divide-y">
            {leadsLoading ? (
              [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
            ) : leads.length > 0 ? (
              leads.map((l, index) => {
                const isDuplicate = assignedLeads.some((al) => al.phone === l.phone || al._id === l._id);
                return (
                  <div key={l._id} className={`flex gap-3 items-center p-3 hover:bg-gray-50 ${isDuplicate ? "bg-red-50 opacity-70" : ""}`}>
                    <input type="checkbox" checked={selectedLeads.includes(l._id)} onChange={() => toggleLead(l._id)}
                      disabled={isDuplicate} className="w-4 h-4 accent-indigo-600" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">
                        {index + 1}. {l.name || <span className="text-gray-400 italic">No Name</span>}
                        {isDuplicate && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded">ALREADY ASSIGNED</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        {l.phone}{l.course ? ` | ${l.course}` : ""}{l.city ? ` | ${l.city}` : ""}
                      </p>
                    </div>
                    {selectedLeads.includes(l._id) && !isDuplicate && (
                      <select value={leadAssignments[l._id] || ""} onChange={(e) => assignLead(l._id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs font-semibold bg-white">
                        <option value="">Select Counselor</option>
                        {counselorsLoading
                          ? <option disabled>Loading...</option>
                          : counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)
                        }
                      </select>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-gray-400 italic">No unassigned leads found.</div>
            )}
          </div>
        </div>

        {/* Preview */}
        {Object.keys(leadAssignments).length > 0 && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded shadow-sm">
            <h3 className="font-bold text-indigo-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Shuffle size={16} /> Assignment Preview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {counselors.map((c) => {
                const assignedToThis = Object.entries(leadAssignments).filter(([, cid]) => cid === c._id);
                if (!assignedToThis.length) return null;
                const indices = assignedToThis.map(([lid]) => leads.findIndex((l) => l._id === lid) + 1).sort((a, b) => a - b);
                const range   = indices.length > 1 ? `${indices[0]} – ${indices[indices.length - 1]}` : `${indices[0]}`;
                return (
                  <div key={c._id} className="bg-white p-2 rounded border border-indigo-100 text-center">
                    <p className="font-black text-[10px] text-gray-700 truncate mb-1">{c.name}</p>
                    <div className="text-[10px] text-indigo-700 font-bold bg-indigo-50 py-1 rounded">Total: {assignedToThis.length}</div>
                    <p className="text-[9px] text-gray-400 mt-1">#{range}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        {!leadsLoading && leads.length > 0 && (
          <div className="flex justify-end gap-3 pb-10 flex-wrap">
            <button onClick={autoDistribute} className="bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded flex gap-2 text-sm font-bold items-center hover:bg-indigo-50 transition-colors">
              <Shuffle size={16} /> Auto Distribute
            </button>
            <button onClick={assignByCount} className="bg-orange-50 text-orange-700 border border-orange-200 px-6 py-2 rounded flex gap-2 text-sm font-bold items-center hover:bg-orange-100 transition-colors">
              🎯 By Count
            </button>
            <button onClick={saveDistribution} disabled={loading || selectedLeads.length === 0}
              className="bg-green-600 text-white px-8 py-2 rounded flex gap-2 text-sm font-bold items-center hover:bg-green-700 shadow-md disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Confirm & Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadScheduler;