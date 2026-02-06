

// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import { Upload, Users, Shuffle, Save, Loader2 } from "lucide-react";

// const LeadScheduler = () => {
//   const [file, setFile] = useState(null);

//   const [leads, setLeads] = useState([]);
//   const [assignedLeads, setAssignedLeads] = useState([]);

//   const [counselors, setCounselors] = useState([]);

//   const [selectedLeads, setSelectedLeads] = useState([]);

//   // leadId -> counselorId
//   const [leadAssignments, setLeadAssignments] = useState({});

//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD DATA ================= */

//   useEffect(() => {
//     fetchLeads();
//     fetchCounselors();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const res = await api.get("/api/v1/leads");

//       if (res.data.success) {
//         const all = res.data.data;

//         const unassigned = all
//           .filter((l) => !l.assignedTo)
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         const assigned = all.filter((l) => l.assignedTo);

//         setLeads(unassigned);
//         setAssignedLeads(assigned);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch leads");
//     }
//   };

//   const fetchCounselors = async () => {
//     try {
//       const res = await api.get("/api/v1/counselor");

//       if (res.data.success) {
//         setCounselors(res.data.data);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch counselors");
//     }
//   };

//   /* ================= FILE UPLOAD ================= */

//   const handleFile = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadExcel = async () => {
//     if (!file) return alert("Select file first");

//     setLoading(true);

//     try {
//       const form = new FormData();
//       form.append("file", file);

//       await api.post("/api/v1/leads/upload", form);

//       alert("Uploaded successfully");

//       setFile(null);

//       fetchLeads();
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SELECTION ================= */

//   const toggleLead = (id) => {
//     setSelectedLeads((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   const selectAll = () => {
//     setSelectedLeads(leads.map((l) => l._id));
//   };

//   const clearSelection = () => {
//     setSelectedLeads([]);
//     setLeadAssignments({});
//   };

//   /* ================= AUTO DISTRIBUTE ================= */

//   const autoDistribute = () => {
//     if (!selectedLeads.length)
//       return alert("Select leads first");

//     if (!counselors.length)
//       return alert("No counselors available");

//     const newAssign = {};

//     selectedLeads.forEach((leadId, i) => {
//       const counselorId =
//         counselors[i % counselors.length]._id;

//       newAssign[leadId] = counselorId;
//     });

//     setLeadAssignments(newAssign);
//   };

//   /* ================= MANUAL ASSIGN ================= */

//   const assignLead = (leadId, counselorId) => {
//     setLeadAssignments((prev) => ({
//       ...prev,
//       [leadId]: counselorId,
//     }));
//   };

//   /* ================= SAVE ================= */

//   const saveDistribution = async () => {
//     if (!selectedLeads.length)
//       return alert("No leads selected");

//     // Convert to counselorId -> count
//     const counts = {};

//     Object.values(leadAssignments).forEach((cid) => {
//       if (!cid) return;

//       counts[cid] = (counts[cid] || 0) + 1;
//     });

//     if (
//       Object.keys(counts).length === 0 ||
//       Object.keys(leadAssignments).length !== selectedLeads.length
//     ) {
//       return alert("Assign counselor to all leads");
//     }

//     setLoading(true);

//     try {
//       await api.post("/api/v1/leads/assign-selected", {
//         leadIds: selectedLeads,
//         assignments: counts,
//       });

//       alert("Leads assigned successfully");

//       clearSelection();
//       fetchLeads();
//     } catch (err) {
//       console.error(err);
//       alert("Assignment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-white p-4 rounded-xl shadow mb-5 flex gap-2 items-center">
//           <Users className="text-indigo-600" />
//           <h1 className="text-xl font-bold">
//             Lead Scheduler
//           </h1>
//         </div>

//         {/* UPLOAD */}
//         <div className="bg-white p-5 rounded-xl shadow mb-5 flex gap-3 items-center">
//           <input
//             type="file"
//             accept=".xls,.xlsx"
//             onChange={handleFile}
//           />

//           <button
//             disabled={loading}
//             onClick={uploadExcel}
//             className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
//           >
//             {loading ? (
//               <Loader2 className="animate-spin" />
//             ) : (
//               <Upload size={18} />
//             )}
//             Upload
//           </button>
//         </div>

//         {/* UNASSIGNED */}
//         <div className="bg-white p-5 rounded-xl shadow mb-5">

//           <div className="flex justify-between mb-3">
//             <h3 className="font-semibold">
//               Unassigned Leads
//             </h3>

//             <div className="flex gap-3 text-sm">
//               <button
//                 onClick={selectAll}
//                 className="text-indigo-600"
//               >
//                 Select All
//               </button>

//               <button
//                 onClick={clearSelection}
//                 className="text-red-500"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           <div className="max-h-[320px] overflow-y-auto border rounded">

//             {leads.map((l) => (
//               <div
//                 key={l._id}
//                 className="flex items-center gap-3 border-b p-2"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedLeads.includes(l._id)}
//                   onChange={() => toggleLead(l._id)}
//                 />

//                 <div className="flex-1">
//                   <p className="font-medium">{l.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {l.phone} | {l.course}
//                   </p>
//                 </div>

//                 {selectedLeads.includes(l._id) && (
//                   <select
//                     value={leadAssignments[l._id] || ""}
//                     onChange={(e) =>
//                       assignLead(l._id, e.target.value)
//                     }
//                     className="border rounded px-2 py-1 text-sm"
//                   >
//                     <option value="">
//                       Select Counselor
//                     </option>

//                     {counselors.map((c) => (
//                       <option
//                         key={c._id}
//                         value={c._id}
//                       >
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//             ))}
//           </div>

//           <p className="text-sm mt-2 text-gray-600">
//             Selected:{" "}
//             <b>{selectedLeads.length}</b>
//           </p>
//         </div>

//         {/* ACTIONS */}
//         {selectedLeads.length > 0 && (
//           <div className="flex justify-end gap-3 mb-5">

//             <button
//               onClick={autoDistribute}
//               className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-1"
//             >
//               <Shuffle size={16} />
//               Auto
//             </button>

//             <button
//               disabled={loading}
//               onClick={saveDistribution}
//               className="bg-green-600 text-white px-4 py-2 rounded flex gap-1"
//             >
//               <Save size={16} />
//               Assign
//             </button>

//           </div>
//         )}

//         {/* ASSIGNED */}
//         {assignedLeads.length > 0 && (
//           <div className="bg-white p-5 rounded-xl shadow">

//             <h3 className="font-semibold mb-3">
//               Assigned Leads
//             </h3>

//             <div className="max-h-[250px] overflow-y-auto border rounded">

//               {assignedLeads.map((l) => (
//                 <div
//                   key={l._id}
//                   className="flex items-center gap-3 border-b p-2 opacity-80"
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium">{l.name}</p>
//                     <p className="text-xs text-gray-500">
//                       {l.phone} | {l.course}
//                     </p>
//                   </div>

//                   <span className="text-sm">
//                     Assigned to:{" "}
//                     <b>
//                       {l.assignedToName ||
//                         l.assignedTo?.name ||
//                         "N/A"}
//                     </b>
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default LeadScheduler;




"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  Upload,
  Users,
  Shuffle,
  Save,
  Loader2,
} from "lucide-react";

const LeadScheduler = () => {
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
      if (res.data.success) setCounselors(res.data.data);
    } catch (err) {
      alert("Failed to fetch counselors");
    }
  };

  /* ================= FILE UPLOAD ================= */
  const handleFile = (e) => setFile(e.target.files[0]);

  const uploadExcel = async () => {
    if (!file) return alert("Select file");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post("/api/v1/leads/upload", form);
      alert("Uploaded");
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
    setSelectedLeads((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };
  const selectAll = () => setSelectedLeads(leads.map((l) => l._id));
  const clearSelection = () => {
    setSelectedLeads([]);
    setLeadAssignments({});
    setAutoCounts({});
  };

  /* ================= AUTO DISTRIBUTE ================= */
  const autoDistribute = () => {
    if (!selectedLeads.length) return alert("Select leads first");
    if (!counselors.length) return alert("No counselors");

    const total = selectedLeads.length;
    let index = 0;
    const newAssign = {};
    const hasCustom = Object.values(autoCounts).some((v) => v && Number(v) > 0);

    if (hasCustom) {
      counselors.forEach((c) => {
        const count = Number(autoCounts[c._id] || 0);
        for (let i = 0; i < count; i++) {
          if (index >= total) break;
          newAssign[selectedLeads[index]] = c._id;
          index++;
        }
      });
    }

    while (index < total) {
      const c = counselors[index % counselors.length];
      newAssign[selectedLeads[index]] = c._id;
      index++;
    }

    setLeadAssignments(newAssign);
  };

  /* ================= MANUAL ASSIGN ================= */
  const assignLead = (id, cid) => {
    setLeadAssignments((p) => ({ ...p, [id]: cid }));
  };

  /* ================= SAVE DISTRIBUTION ================= */
  const saveDistribution = async () => {
    if (!selectedLeads.length) return alert("No leads");

    const counts = {};
    Object.values(leadAssignments).forEach((cid) => {
      if (!cid) return;
      counts[cid] = (counts[cid] || 0) + 1;
    });

    if (
      Object.keys(counts).length === 0 ||
      Object.keys(leadAssignments).length !== selectedLeads.length
    ) {
      return alert("Assign all leads");
    }

    setLoading(true);
    try {
      await api.post("/api/v1/leads/assign-selected", {
        leadIds: selectedLeads,
        assignments: counts,
      });
      alert("Assigned");
      clearSelection();
      fetchLeads();
    } catch {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GROUP ASSIGNED LEADS ================= */
  const grouped = assignedLeads.reduce((acc, l) => {
    const cid = l.assignedTo?._id || l.assignedTo;
    if (!cid) return acc;
    if (!acc[cid]) {
      acc[cid] = {
        name: l.assignedTo?.name || l.assignedToName,
        leads: [],
      };
    }
    acc[cid].leads.push(l);
    return acc;
  }, {});

  /* ================= FILTERED LEADS FOR MODAL ================= */
  const filteredLeads =
    grouped[viewCounselor]?.leads.filter((l) => {
      const leadDate = new Date(l.createdAt);
      const fromDate = filterDates.from ? new Date(filterDates.from) : null;
      const toDate = filterDates.to ? new Date(filterDates.to) : null;
      if (fromDate && leadDate < fromDate) return false;
      if (toDate && leadDate > toDate) return false;
      return true;
    }) || [];

  /* ================= UI ================= */
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white p-4 mb-4 rounded shadow flex gap-2 items-center">
          <Users className="text-indigo-600" />
          <h1 className="text-xl font-bold">Lead Scheduler</h1>
        </div>

        {/* UPLOAD */}
        <div className="bg-white p-4 mb-4 rounded shadow flex gap-3">
          <input type="file" accept=".xls,.xlsx" onChange={handleFile} />
          <button
            onClick={uploadExcel}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
            Upload
          </button>
        </div>

        {/* AUTO COUNTS */}
        {selectedLeads.length > 0 && (
          <div className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="font-semibold mb-3">Auto Assign Settings</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {counselors.map((c) => (
                <div key={c._id} className="flex justify-between border p-2 rounded">
                  <span>{c.name}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Count"
                    value={autoCounts[c._id] || ""}
                    onChange={(e) =>
                      setAutoCounts((p) => ({ ...p, [c._id]: e.target.value }))
                    }
                    className="w-20 border rounded px-2"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs mt-2 text-gray-500">Blank = Equal Distribution</p>
          </div>
        )}

        {/* UNASSIGNED LEADS */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Unassigned Leads</h3>
            <div className="flex gap-3 text-sm">
              <button onClick={selectAll} className="text-indigo-600">
                Select All
              </button>
              <button onClick={clearSelection} className="text-red-500">
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto border rounded">
            {leads.map((l) => (
              <div key={l._id} className="flex gap-3 items-center border-b p-2">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(l._id)}
                  onChange={() => toggleLead(l._id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.phone} | {l.course}</p>
                </div>
                {selectedLeads.includes(l._id) && (
                  <select
                    value={leadAssignments[l._id] || ""}
                    onChange={(e) => assignLead(l._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select Counselor</option>
                    {counselors.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {selectedLeads.length > 0 && (
          <div className="flex justify-end gap-3 mb-5">
            <button
              onClick={autoDistribute}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-1"
            >
              <Shuffle size={16} /> Auto
            </button>
            <button
              onClick={saveDistribution}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded flex gap-1"
            >
              <Save size={16} /> Assign
            </button>
          </div>
        )}

        {/* COUNSELOR SUMMARY */}
        {assignedLeads.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Counselor Summary</h3>
            <div className="space-y-2">
              {Object.entries(grouped).map(([cid, d]) => (
                <div key={cid} className="flex justify-between items-center border p-3 rounded bg-gray-50">
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-sm text-gray-600">Total: {d.leads.length}</p>
                  </div>
                  <button
                    onClick={() => {
                      setViewCounselor(cid);
                      setFilterDates({ from: "", to: "" });
                    }}
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL */}
        {viewCounselor && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl rounded p-5 max-h-[90vh] overflow-hidden flex flex-col">
              {/* HEADER */}
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold text-lg">{grouped[viewCounselor]?.name}</h3>
                <button
                  onClick={() => setViewCounselor(null)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* DATE FILTER */}
              <div className="flex gap-2 mb-3 items-center">
                <label className="text-sm">From:</label>
                <input
                  type="date"
                  value={filterDates.from || ""}
                  onChange={(e) =>
                    setFilterDates((p) => ({ ...p, from: e.target.value }))
                  }
                  className="border px-2 py-1 rounded"
                />
                <label className="text-sm">To:</label>
                <input
                  type="date"
                  value={filterDates.to || ""}
                  onChange={(e) =>
                    setFilterDates((p) => ({ ...p, to: e.target.value }))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>

              {/* TOTAL FILTERED LEADS */}
              <div className="mb-2 text-sm text-gray-600">Total Leads: {filteredLeads.length}</div>

              {/* LEADS LIST WITH SCROLL */}
              <div className="flex-1 overflow-y-auto border rounded p-2">
                {filteredLeads.map((l) => (
                  <div key={l._id} className="border-b p-2">
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-gray-500">
                      {l.phone} | {l.course} | {new Date(l.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadScheduler;
