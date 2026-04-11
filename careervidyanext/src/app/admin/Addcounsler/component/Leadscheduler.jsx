"use client";
import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Upload, Users, Shuffle, Save, Loader2, ListChecks } from "lucide-react";

const LeadScheduler = () => {
  /* ================= STATES ================= */
  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leadAssignments, setLeadAssignments] = useState({});
  const [autoCounts, setAutoCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewCounselor, setViewCounselor] = useState(null);
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchLeads();
    fetchCounselors();
  }, []);

  const fetchLeads = async () => {
    try {
      // YAHAN CHANGE KIYA HAI: limit=all lagaya hai
      const res = await api.get("/api/v1/leads?limit=all");
      if (res.data.success) {
        const all = res.data.data;
        setLeads(all.filter((l) => !l.assignedTo));
        setAssignedLeads(all.filter((l) => l.assignedTo));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        const activeCounselors = res.data.data.filter((c) => c.status === "active" || c.isActive === true);
        setCounselors(activeCounselors);
      }
    } catch (err) {
      alert("Failed to fetch counselors");
    }
  };

  /* ================= FILE UPLOAD ================= */ 
  const handleFile = (e) => setFile(e.target.files[0]);

  const uploadExcel = async () => {
    if (!file) return alert("Please select file");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post("/api/v1/leads/upload", form);
      alert("File uploaded");
      fetchLeads();
      setFile(null);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELECT LEADS ================= */
  const toggleLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedLeads(leads.map((l) => l._id));
  const clearSelection = () => {
    setSelectedLeads([]);
    setLeadAssignments({});
    setAutoCounts({});
  };

  const autoDistribute = () => {
    if (!selectedLeads.length) return alert("Select leads first");
    if (!counselors.length) return alert("No counselors");

    const newAssign = {};
    let currentIndex = 0;

    const uniqueSelectedLeads = selectedLeads.filter(id => 
      !assignedLeads.some(al => al._id === id)
    );

    if (uniqueSelectedLeads.length === 0) return alert("All selected leads are already assigned!");

    const totalLeads = uniqueSelectedLeads.length;

    counselors.forEach(c => {
      const count = Number(autoCounts[c._id] || 0);
      if (count > 0) {
        for (let i = 0; i < count && currentIndex < totalLeads; i++) {
          newAssign[uniqueSelectedLeads[currentIndex]] = c._id;
          currentIndex++;
        }
      }
    });

    const remainingLeads = uniqueSelectedLeads.slice(currentIndex);
    const activeAutoCounselors = counselors.filter(c => {
      const count = autoCounts[c._id];
      return count === "" || count === undefined || (Number(count) === 0 && count !== "0");
    }).filter(c => autoCounts[c._id] !== "0");

    if (remainingLeads.length > 0 && activeAutoCounselors.length > 0) {
      remainingLeads.forEach((leadId, idx) => {
        const counselor = activeAutoCounselors[idx % activeAutoCounselors.length];
        newAssign[leadId] = counselor._id;
      });
    }

    setLeadAssignments(newAssign);
  };

  const assignByCount = () => {
    if (!Object.keys(autoCounts).length) return alert("Enter counts first");
    let currentLeads = [...leads];
    let newAssign = {};

    counselors.forEach((c) => {
      let count = Number(autoCounts[c._id] || 0);
      for (let i = 0; i < count; i++) {
        if (!currentLeads.length) break;
        const lead = currentLeads.shift();
        newAssign[lead._id] = c._id;
      }
    });

    if (!Object.keys(newAssign).length) return alert("No leads assigned");
    setSelectedLeads(Object.keys(newAssign));
    setLeadAssignments(newAssign);
  };

  const assignLead = (id, cid) => {
    setLeadAssignments((prev) => ({ ...prev, [id]: cid }));
  };

  /* ================= SAVE ================= */
  const saveDistribution = async () => {
    if (!selectedLeads.length) return alert("No leads selected");
    const counts = {};
    Object.values(leadAssignments).forEach((cid) => {
      if (!cid) return;
      counts[cid] = (counts[cid] || 0) + 1;
    });

    if (Object.keys(counts).length === 0 || Object.keys(leadAssignments).length !== selectedLeads.length) {
      return alert("Assign all selected leads");
    }

    setLoading(true);
    try {
      await api.post("/api/v1/leads/assign-selected", {
        leadIds: selectedLeads,
        assignments: counts,
      });
      alert("Leads assigned successfully");
      clearSelection();
      fetchLeads();
    } catch {
      alert("Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-4 mb-4 rounded shadow flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Users className="text-indigo-600" />
            <h1 className="text-xl font-bold">Lead Scheduler</h1>
          </div>
          {/* Naya Counter Display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Total Available</p>
              <p className="text-xl font-black text-indigo-600 leading-none">{leads.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 mb-4 rounded shadow flex gap-3 items-center">
          <div className="flex-1">
            <input type="file" accept=".xls,.xlsx" onChange={handleFile} className="text-sm" />
          </div>
          <button onClick={uploadExcel} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded flex gap-2 font-bold hover:bg-indigo-700">
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />} Upload Excel
          </button>
        </div>

        {leads.length > 0 && (
          <div className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <ListChecks size={18} className="text-indigo-500"/> Assignment Counts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {counselors.map((c) => (
                <div key={c._id} className="border p-2 rounded bg-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase truncate mb-1">{c.name}</p>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={autoCounts[c._id] || ""}
                    onChange={(e) => setAutoCounts((p) => ({ ...p, [c._id]: e.target.value }))}
                    className="w-full border rounded px-2 py-1 text-sm font-bold text-indigo-600 focus:outline-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-slate-800">Unassigned Leads List</h3>
            <div className="flex gap-4 text-xs font-bold uppercase">
              <button onClick={selectAll} className="text-indigo-600 hover:underline">Select All</button>
              <button onClick={clearSelection} className="text-red-500 hover:underline">Clear</button>
            </div>
          </div>
          {/* Table height thodi badha di hai taaki 40 se zyada leads dikhein */}
          <div className="max-h-[500px] overflow-y-auto border rounded divide-y">
            {leads.length > 0 ? (
              leads.map((l, index) => {
                const isDuplicate = assignedLeads.some(al => al.phone === l.phone || al._id === l._id);
                return (
                  <div key={l._id} className={`flex gap-3 items-center p-3 hover:bg-gray-50 ${isDuplicate ? 'bg-red-50 opacity-70' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={selectedLeads.includes(l._id)} 
                      onChange={() => toggleLead(l._id)} 
                      disabled={isDuplicate}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">
                        {index + 1}. {l.name} 
                        {isDuplicate && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded">ALREADY ASSIGNED</span>}
                      </p>
                      <p className="text-xs text-gray-500">{l.phone} | {l.course || 'No Course'}</p>
                    </div>
                    {selectedLeads.includes(l._id) && !isDuplicate && (
                      <select
                        value={leadAssignments[l._id] || ""}
                        onChange={(e) => assignLead(l._id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs font-semibold bg-white"
                      >
                        <option value="">Select Counselor</option>
                        {counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-gray-400 italic">No leads found in database.</div>
            )}
          </div>
        </div>

        {/* ================= LIVE PREVIEW SECTION ================= */}
        {Object.keys(leadAssignments).length > 0 && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded shadow-sm">
            <h3 className="font-bold text-indigo-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Shuffle size={16} /> Assignment Preview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {counselors.map((c) => {
                const assignedToThis = Object.entries(leadAssignments).filter(([_, cid]) => cid === c._id);
                if (assignedToThis.length === 0) return null;

                const leadIndices = assignedToThis.map(([lid]) => {
                  const foundIdx = leads.findIndex(l => l._id === lid);
                  return foundIdx !== -1 ? foundIdx + 1 : '?';
                }).sort((a, b) => a - b);

                const rangeDisplay = leadIndices.length > 1 
                  ? `${leadIndices[0]} to ${leadIndices[leadIndices.length - 1]}`
                  : `${leadIndices[0]}`;

                return (
                  <div key={c._id} className="bg-white p-2 rounded border border-indigo-100 text-center">
                    <p className="font-black text-[10px] text-gray-700 truncate mb-1">{c.name}</p>
                    <div className="text-[10px] text-indigo-700 font-bold bg-indigo-50 py-1 rounded">
                      Total: {assignedToThis.length}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1">Idx: {rangeDisplay}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {leads.length > 0 && (
          <div className="flex justify-end gap-3 pb-10">
            <button onClick={autoDistribute} className="bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded flex gap-2 text-sm font-bold items-center hover:bg-indigo-50 transition-colors">
              <Shuffle size={16} /> Auto Distribute
            </button>
            <button onClick={assignByCount} className="bg-orange-50 text-orange-700 border border-orange-200 px-6 py-2 rounded flex gap-2 text-sm font-bold items-center hover:bg-orange-100 transition-colors">
              🎯 By Count
            </button>
            <button onClick={saveDistribution} disabled={loading || selectedLeads.length === 0} className="bg-green-600 text-white px-8 py-2 rounded flex gap-2 text-sm font-bold items-center hover:bg-green-700 shadow-md disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
              Confirm & Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadScheduler;