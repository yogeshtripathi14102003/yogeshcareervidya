// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import { Upload, Users, Shuffle, Save } from "lucide-react";

// const LeadScheduler = () => {
//   const [file, setFile] = useState(null);
//   const [leads, setLeads] = useState([]); // unassigned leads
//   const [assignedLeads, setAssignedLeads] = useState([]); // already assigned
//   const [counselors, setCounselors] = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [assignments, setAssignments] = useState({});
//   const [loading, setLoading] = useState(false);

//   // ========== LOAD DATA ==========
//   useEffect(() => {
//     fetchLeads();
//     fetchCounselors();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const res = await api.get("/api/v1/leads");
//       if (res.data.success) {
//         const allLeads = res.data.data;

//         // Separate unassigned and assigned
//         const unassigned = allLeads
//           .filter((l) => !l.assignedTo)
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
//         const assigned = allLeads.filter((l) => l.assignedTo);

//         setLeads(unassigned);
//         setAssignedLeads(assigned);
//       }
//     } catch {
//       alert("Failed to fetch leads");
//     }
//   };

//   const fetchCounselors = async () => {
//     try {
//       const res = await api.get("/api/v1/counselor");
//       if (res.data.success) setCounselors(res.data.data);
//     } catch {
//       alert("Failed to fetch counselors");
//     }
//   };

//   // Helper: get counselor name by ID
//   const getCounselorName = (id) => {
//     const c = counselors.find((c) => c._id === id);
//     return c ? c.name : "Unknown";
//   };

//   // ========== HANDLE FILE ==========
//   const handleFile = (e) => setFile(e.target.files[0]);

//   const uploadExcel = async () => {
//     if (!file) return alert("Select a file first");
//     setLoading(true);
//     try {
//       const form = new FormData();
//       form.append("file", file);
//       await api.post("/api/v1/leads/upload", form);
//       await fetchLeads(); // refresh unassigned and assigned leads
//       alert("Uploaded successfully");
//     } catch {
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ========== SELECT LEADS ==========
//   const toggleLead = (id) => {
//     setSelectedLeads((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const selectAll = () => setSelectedLeads(leads.map((l) => l._id));
//   const clearSelection = () => {
//     setSelectedLeads([]);
//     setAssignments({});
//   };

//   // ========== AUTO DISTRIBUTE ==========
//   const autoDistribute = () => {
//     if (!selectedLeads.length) return alert("Select leads first");

//     const per = Math.floor(selectedLeads.length / counselors.length);
//     let rem = selectedLeads.length % counselors.length;

//     const temp = {};
//     counselors.forEach((c) => {
//       temp[c._id] = per;
//       if (rem > 0) {
//         temp[c._id]++;
//         rem--;
//       }
//     });

//     setAssignments(temp);
//   };

//   // ========== MANUAL CHANGE ==========
//   const changeCount = (id, val) => {
//     if (val < 0) return;
//     setAssignments({ ...assignments, [id]: Number(val) });
//   };

//   const totalAssigned = Object.values(assignments).reduce((a, b) => a + b, 0);

//   // ========== SAVE ASSIGNMENTS ==========
//   const saveDistribution = async () => {
//     if (totalAssigned !== selectedLeads.length)
//       return alert("Assigned count mismatch");

//     setLoading(true);
//     try {
//       await api.post("/api/v1/leads/assign-selected", {
//         leadIds: selectedLeads,
//         assignments,
//       });
//       alert("Leads assigned successfully");
//       clearSelection();
//       fetchLeads(); // refresh after assignment
//     } catch {
//       alert("Assignment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-100 p-6 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER */}
//         <div className="bg-white p-4 rounded-xl shadow mb-5 flex items-center gap-3">
//           <Users className="text-indigo-600" />
//           <h1 className="text-lg font-bold">Lead Scheduler</h1>
//         </div>

//         {/* UPLOAD EXCEL */}
//         <div className="bg-white p-5 rounded-xl shadow mb-5 flex items-center gap-3">
//           <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
//           <button
//             onClick={uploadExcel}
//             disabled={loading}
//             className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
//           >
//             <Upload size={18} /> Upload
//           </button>
//         </div>

//         {/* UNASSIGNED LEADS */}
//         <div className="bg-white p-5 rounded-xl shadow mb-5">
//           <div className="flex justify-between mb-3">
//             <h3 className="font-semibold">Unassigned Leads</h3>
//             <div className="flex gap-2">
//               <button onClick={selectAll} className="text-sm text-indigo-600">
//                 Select All
//               </button>
//               <button onClick={clearSelection} className="text-sm text-red-500">
//                 Clear
//               </button>
//             </div>
//           </div>

//           <div className="max-h-[300px] overflow-y-auto border rounded">
//             {leads.map((l) => (
//               <div key={l._id} className="flex items-center gap-3 border-b p-2">
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
//               </div>
//             ))}
//           </div>

//           <p className="text-sm mt-2 text-gray-600">
//             Selected: <b>{selectedLeads.length}</b>
//           </p>
//         </div>

//         {/* ASSIGN TO COUNSELORS */}
//         {selectedLeads.length > 0 && (
//           <div className="bg-white p-5 rounded-xl shadow mb-6">
//             <div className="flex justify-between mb-3">
//               <h3 className="font-semibold">Assign To Counselors</h3>
//               <button
//                 onClick={autoDistribute}
//                 className="text-sm text-indigo-600 flex gap-1"
//               >
//                 <Shuffle size={14} /> Auto
//               </button>
//             </div>

//             <p className="text-sm mb-3">
//               Assigned: <b>{totalAssigned}</b> / {selectedLeads.length}
//             </p>

//             <div className="overflow-x-auto">
//               <table className="w-full border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Leads</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {counselors.map((c) => (
//                     <tr key={c._id} className="border-b text-center">
//                       <td>{c.name}</td>
//                       <td>{c.email}</td>
//                       <td>
//                         <input
//                           type="number"
//                           min="0"
//                           value={assignments[c._id] || 0}
//                           onChange={(e) => changeCount(c._id, e.target.value)}
//                           className="border rounded w-20 p-1 text-center"
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={saveDistribution}
//                 disabled={loading}
//                 className="bg-green-600 text-white px-5 py-2 rounded flex gap-2"
//               >
//                 <Save size={18} /> Assign Leads
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ALREADY ASSIGNED LEADS */}
//         {assignedLeads.length > 0 && (
//           <div className="bg-white p-5 rounded-xl shadow mb-5">
//             <h3 className="font-semibold mb-3">Already Assigned Leads</h3>
//             <div className="max-h-[200px] overflow-y-auto border rounded">
//               {assignedLeads.map((l) => (
//                 <div
//                   key={l._id}
//                   className="flex items-center gap-3 border-b p-2 opacity-70"
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium">{l.name}</p>
//                     <p className="text-xs text-gray-500">
//                       {l.phone} | {l.course}
//                     </p>
//                   </div>
//                   <span className="text-sm text-gray-700">
//                     Assigned to: <b>{getCounselorName(l.assignedTo)}</b>
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
import { Upload, Users, Shuffle, Save } from "lucide-react";

const LeadScheduler = () => {
  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]); // unassigned leads
  const [assignedLeads, setAssignedLeads] = useState([]); // already assigned
  const [counselors, setCounselors] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignments, setAssignments] = useState({}); // {counselorId: count}
  const [leadAssignments, setLeadAssignments] = useState({}); // {leadId: counselorId}
  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    fetchLeads();
    fetchCounselors();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) {
        const allLeads = res.data.data;

        const unassigned = allLeads
          .filter((l) => !l.assignedTo)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
        const assigned = allLeads.filter((l) => l.assignedTo);

        setLeads(unassigned);
        setAssignedLeads(assigned);
      }
    } catch {
      alert("Failed to fetch leads");
    }
  };

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) setCounselors(res.data.data);
    } catch {
      alert("Failed to fetch counselors");
    }
  };

  const getCounselorName = (id) => {
    const c = counselors.find((c) => c._id === id);
    return c ? c.name : "Unknown";
  };

  // Handle file
  const handleFile = (e) => setFile(e.target.files[0]);

  const uploadExcel = async () => {
    if (!file) return alert("Select a file first");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post("/api/v1/leads/upload", form);
      await fetchLeads();
      alert("Uploaded successfully");
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Select leads
  const toggleLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const selectAll = () => setSelectedLeads(leads.map((l) => l._id));
  const clearSelection = () => {
    setSelectedLeads([]);
    setAssignments({});
    setLeadAssignments({});
  };

  // Auto distribute counts
  const autoDistribute = () => {
    if (!selectedLeads.length) return alert("Select leads first");
    const per = Math.floor(selectedLeads.length / counselors.length);
    let rem = selectedLeads.length % counselors.length;
    const newAssignments = {};
    counselors.forEach((c) => {
      newAssignments[c._id] = per;
      if (rem > 0) {
        newAssignments[c._id]++;
        rem--;
      }
    });
    setAssignments(newAssignments);

    // Assign leads sequentially
    const newLeadAssignments = {};
    let i = 0;
    selectedLeads.forEach((leadId) => {
      const counselorId = counselors[i % counselors.length]._id;
      newLeadAssignments[leadId] = counselorId;
      i++;
    });
    setLeadAssignments(newLeadAssignments);
  };

  // Update lead assignment manually
  const assignLead = (leadId, counselorId) => {
    setLeadAssignments({
      ...leadAssignments,
      [leadId]: counselorId,
    });
  };

  // Total assigned check
  const totalAssigned = Object.keys(leadAssignments).length;

  const saveDistribution = async () => {
    if (totalAssigned !== selectedLeads.length)
      return alert("Assigned count mismatch");
    setLoading(true);
    try {
      await api.post("/api/v1/leads/assign-selected", {
        leadIds: selectedLeads,
        assignments: leadAssignments, // leadId -> counselorId
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
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow mb-5 flex items-center gap-3">
          <Users className="text-indigo-600" />
          <h1 className="text-lg font-bold">Lead Scheduler</h1>
        </div>

        {/* Upload */}
        <div className="bg-white p-5 rounded-xl shadow mb-5 flex items-center gap-3">
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
          <button
            onClick={uploadExcel}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
          >
            <Upload size={18} /> Upload
          </button>
        </div>

        {/* Unassigned leads */}
        <div className="bg-white p-5 rounded-xl shadow mb-5">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Unassigned Leads</h3>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-sm text-indigo-600">
                Select All
              </button>
              <button onClick={clearSelection} className="text-sm text-red-500">
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto border rounded">
            {leads.map((l) => (
              <div key={l._id} className="flex items-center gap-3 border-b p-2">
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
                    className="border rounded p-1 text-sm"
                  >
                    <option value="">Select Counselor</option>
                    {counselors.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm mt-2 text-gray-600">
            Selected: <b>{selectedLeads.length}</b>
          </p>
        </div>

        {/* Actions */}
        {selectedLeads.length > 0 && (
          <div className="flex justify-end mb-5 gap-2">
            <button
              onClick={autoDistribute}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-1"
            >
              <Shuffle size={16} /> Auto Distribute
            </button>
            <button
              onClick={saveDistribution}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded flex gap-1"
            >
              <Save size={16} /> Assign Leads
            </button>
          </div>
        )}

        {/* Already assigned leads */}
        {assignedLeads.length > 0 && (
          <div className="bg-white p-5 rounded-xl shadow mb-5">
            <h3 className="font-semibold mb-3">Already Assigned Leads</h3>
            <div className="max-h-[200px] overflow-y-auto border rounded">
              {assignedLeads.map((l) => (
                <div
                  key={l._id}
                  className="flex items-center gap-3 border-b p-2 opacity-70"
                >
                  <div className="flex-1">
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-gray-500">{l.phone} | {l.course}</p>
                  </div>
                  <span className="text-sm text-gray-700">
                    Assigned to: <b>{getCounselorName(l.assignedTo)}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadScheduler;
