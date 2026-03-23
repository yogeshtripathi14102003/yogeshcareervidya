"use client";
import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Upload, Users, Shuffle, Save, Loader2 } from "lucide-react";

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
      const res = await api.get("/api/v1/leads");
      if (res.data.success) {
        const all = res.data.data;
        setLeads(all.filter((l) => !l.assignedTo));
        setAssignedLeads(all.filter((l) => l.assignedTo));
      }
    } catch (err) {
      alert("Failed to fetch leads");
    }
  };

const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        // Sirf active counselors ko filter karke set karein
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

  // 1. Duplicate Prevention: Sirf wo leads jo pehle se assigned nahi hain
  const uniqueSelectedLeads = selectedLeads.filter(id => 
    !assignedLeads.some(al => al._id === id)
  );

  if (uniqueSelectedLeads.length === 0) return alert("All selected leads are already assigned!");

  const totalLeads = uniqueSelectedLeads.length;

  // 2. Logic for Specific Counts (Jinke aage number likha hai > 0)
  counselors.forEach(c => {
    const count = Number(autoCounts[c._id] || 0);
    if (count > 0) {
      for (let i = 0; i < count && currentIndex < totalLeads; i++) {
        newAssign[uniqueSelectedLeads[currentIndex]] = c._id;
        currentIndex++;
      }
    }
  });

  // 3. Logic for Remaining (Round Robin)
  const remainingLeads = uniqueSelectedLeads.slice(currentIndex);

  // Filter: Sirf wo counselors jo na toh "0" hain aur na hi unka koi specific count poora hua hai
  // Agar field empty hai toh wo round robin mein aayenge, agar "0" hai toh skip honge.
  const activeAutoCounselors = counselors.filter(c => {
    const count = autoCounts[c._id];
    // Agar input khali hai (undefined or "") toh round-robin mein rakho
    // Agar input "0" hai toh skip kar do
    return count === "" || count === undefined || (Number(count) === 0 && count !== "0");
    // Simple logic: Agar user ne manually "0" likha hai toh remove kar do
  }).filter(c => autoCounts[c._id] !== "0");

  if (remainingLeads.length > 0) {
    if (activeAutoCounselors.length > 0) {
      remainingLeads.forEach((leadId, idx) => {
        const counselor = activeAutoCounselors[idx % activeAutoCounselors.length];
        newAssign[leadId] = counselor._id;
      });
    } else if (currentIndex < totalLeads) {
      // Agar leads bachi hain par koi counselor available nahi hai
      console.log("Some leads remained unassigned due to '0' count filters.");
    }
  }

  setLeadAssignments(newAssign);
};



  /* ================= ASSIGN BY COUNT ================= */
  const assignByCount = () => {
    if (!Object.keys(autoCounts).length) return alert("Enter counts first");
    let remainingLeads = [...leads];
    let newAssign = {};

    counselors.forEach((c) => {
      let count = Number(autoCounts[c._id] || 0);
      for (let i = 0; i < count; i++) {
        if (!remainingLeads.length) break;
        const lead = remainingLeads.shift();
        newAssign[lead._id] = c._id;
      }
    });

    if (!Object.keys(newAssign).length) return alert("No leads assigned");
    setSelectedLeads(Object.keys(newAssign));
    setLeadAssignments(newAssign);
    alert("Assigned by count. Click Assign to save.");
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

  /* ================= GROUPING & FILTERING ================= */
  const grouped = assignedLeads.reduce((acc, l) => {
    const cid = l.assignedTo?._id || l.assignedTo;
    if (!cid) return acc;
    if (!acc[cid]) {
      acc[cid] = { name: l.assignedTo?.name || l.assignedToName, leads: [] };
    }
    acc[cid].leads.push(l);
    return acc;
  }, {});

  const filteredLeads = grouped[viewCounselor]?.leads.filter((l) => {
    const leadDate = new Date(l.createdAt);
    const fromDate = filterDates.from ? new Date(filterDates.from) : null;
    const toDate = filterDates.to ? new Date(filterDates.to) : null;
    if (fromDate && leadDate < fromDate) return false;
    if (toDate && leadDate > toDate) return false;
    return true;
  }) || [];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-4 mb-4 rounded shadow flex gap-2 items-center">
          <Users className="text-indigo-600" />
          <h1 className="text-xl font-bold">Lead Scheduler</h1>
        </div>

        <div className="bg-white p-4 mb-4 rounded shadow flex gap-3">
          <input type="file" accept=".xls,.xlsx" onChange={handleFile} />
          <button onClick={uploadExcel} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />} Upload
          </button>
        </div>

        {leads.length > 0 && (
          <div className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="font-semibold mb-3">Assignment Counts</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {counselors.map((c) => (
                <div key={c._id} className="flex justify-between border p-2 rounded">
                  <span>{c.name}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 to skip"
                    value={autoCounts[c._id] || ""}
                    onChange={(e) => setAutoCounts((p) => ({ ...p, [c._id]: e.target.value }))}
                    className="w-20 border rounded px-2"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Unassigned Leads</h3>
            <div className="flex gap-3 text-sm">
              <button onClick={selectAll} className="text-indigo-600">Select All</button>
              <button onClick={clearSelection} className="text-red-500">Clear</button>
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto border rounded">
            {leads.map((l, index) => {
              // Duplicate Check logic: Kya ye lead assignedLeads array mein hai?
              const isDuplicate = assignedLeads.some(al => al.phone === l.phone || al._id === l._id);
              
              return (
                <div key={l._id} className={`flex gap-3 items-center border-b p-2 ${isDuplicate ? 'bg-red-50 opacity-70' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedLeads.includes(l._id)} 
                    onChange={() => toggleLead(l._id)} 
                    disabled={isDuplicate}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {index + 1}. {l.name} 
                      {isDuplicate && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">ALREADY ASSIGNED</span>}
                    </p>
                    <p className="text-xs text-gray-500">{l.phone} | {l.course}</p>
                  </div>
                  {selectedLeads.includes(l._id) && !isDuplicate && (
                    <select
                      value={leadAssignments[l._id] || ""}
                      onChange={(e) => assignLead(l._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="">Select Counselor</option>
                      {counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= LIVE PREVIEW SECTION ================= */}
        {Object.keys(leadAssignments).length > 0 && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-4 rounded shadow-sm">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2 text-sm">
              <Shuffle size={16} /> Assignment Preview (Live Distribution)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {counselors.map((c) => {
                const assignedToThis = Object.entries(leadAssignments).filter(([_, cid]) => cid === c._id);
                if (assignedToThis.length === 0) return null;

                // Index range nikalne ke liye logic
                const leadIndices = assignedToThis.map(([lid]) => {
                  const foundIdx = leads.findIndex(l => l._id === lid);
                  return foundIdx !== -1 ? foundIdx + 1 : '?';
                }).sort((a, b) => a - b);

                const rangeDisplay = leadIndices.length > 1 
                  ? `${leadIndices[0]} to ${leadIndices[leadIndices.length - 1]}`
                  : `${leadIndices[0]}`;

                return (
                  <div key={c._id} className="bg-white p-2 rounded border border-indigo-100 shadow-sm text-center">
                    <p className="font-bold text-xs text-gray-700 truncate">{c.name}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 rounded mt-1">
                      Leads: {rangeDisplay}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Total: {assignedToThis.length}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {leads.length > 0 && (
          <div className="flex justify-end gap-3 mb-5">
            <button onClick={autoDistribute} className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-1 text-sm items-center">
              <Shuffle size={16} /> Auto
            </button>
            <button onClick={assignByCount} className="bg-orange-600 text-white px-4 py-2 rounded flex gap-1 text-sm items-center">🎯 By Count</button>
            <button onClick={saveDistribution} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded flex gap-1 text-sm items-center">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Assign
            </button>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default LeadScheduler;