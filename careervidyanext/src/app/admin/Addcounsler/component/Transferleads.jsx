// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import api from "@/utlis/api.js";
// import {
//   Users,
//   Loader2,
//   Trash2,
//   Filter,
//   RefreshCw,
//   Search,
//   AlertCircle,
//   ArrowRightLeft,
//   X,
//   Calendar,
//   CheckCircle2
// } from "lucide-react";

// const LeadScheduler = () => {
//   const [assignedLeads, setAssignedLeads] = useState([]);
//   const [counselors, setCounselors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Filters State
//   const [selectedCounselorId, setSelectedCounselorId] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");

//   // Transfer Modal State
//   const [transferModal, setTransferModal] = useState(null); // { fromCounselorId, fromCounselorName, status, maxCount }
//   const [transferTarget, setTransferTarget] = useState("");
//   const [transferCount, setTransferCount] = useState("");
//   const [transferMode, setTransferMode] = useState("all"); // "all" | "day" | "month"
//   const [transferDate, setTransferDate] = useState("");
//   const [transferMonth, setTransferMonth] = useState("");
//   const [transferYear, setTransferYear] = useState(String(new Date().getFullYear()));
//   const [transferring, setTransferring] = useState(false);
//   const [transferResult, setTransferResult] = useState(null);

//   const statuses = [
//     "New", "Not Interested", "Details Shared", "Follow-up", "Hot Lead",
//     "University Issue", "Fee Issue", "Distance Issue", "Language Issue",
//     "Not Picked", "Admission Done"
//   ];

//   const months = [
//     { value: 1, label: "January" }, { value: 2, label: "February" },
//     { value: 3, label: "March" }, { value: 4, label: "April" },
//     { value: 5, label: "May" }, { value: 6, label: "June" },
//     { value: 7, label: "July" }, { value: 8, label: "August" },
//     { value: 9, label: "September" }, { value: 10, label: "October" },
//     { value: 11, label: "November" }, { value: 12, label: "December" },
//   ];

//   // Memoized Fetch function
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Backend ko limit: "all" dena zaroori hai taaki filters accurate rahein
//       const [resLeads, resCounselors] = await Promise.all([
//         api.get("/api/v1/leads", { params: { limit: "all" } }),
//         api.get("/api/v1/counselor")
//       ]);

//       if (resLeads.data.success) {
//         // Sirf wahi leads jo assigned hain
//         const leadsData = resLeads.data.data || [];
//         setAssignedLeads(leadsData.filter(l => l.assignedTo || l.counselorId));
//       }
//       if (resCounselors.data.success) {
//         setCounselors(resCounselors.data.data);
//       }
//     } catch (err) {
//       console.error("Error loading data:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const deleteByStatus = async (statusName, counselorId) => {
//     if (!confirm(`Kya aap sure hain? Is counselor ki saari "${statusName}" leads delete ho jayengi!`)) return;

//     setLoading(true);
//     try {
//       const res = await api.delete(`/api/v1/leads/bulk-delete`, {
//         params: { status: statusName, counselorId }
//       });
//       if (res.data.success) {
//         fetchData(); // Reload data after delete
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= TRANSFER LOGIC ================= */
//   const openTransferModal = (statusName, counselorId, counselorName, maxCount) => {
//     setTransferModal({ fromCounselorId: counselorId, fromCounselorName: counselorName, status: statusName, maxCount });
//     setTransferTarget("");
//     setTransferCount("");
//     setTransferMode("all");
//     setTransferDate("");
//     setTransferMonth("");
//     setTransferYear(String(new Date().getFullYear()));
//     setTransferResult(null);
//   };

//   const closeTransferModal = () => {
//     if (transferring) return;
//     setTransferModal(null);
//     setTransferResult(null);
//   };

//   const submitTransfer = async () => {
//     if (!transferTarget) {
//       alert("Target counselor select karo");
//       return;
//     }
//     if (transferMode === "day" && !transferDate) {
//       alert("Date select karo");
//       return;
//     }
//     if (transferMode === "month" && (!transferMonth || !transferYear)) {
//       alert("Month aur year select karo");
//       return;
//     }

//     const payload = {
//       fromCounselorId: transferModal.fromCounselorId,
//       toCounselorId: transferTarget,
//       status: transferModal.status,
//     };
//     if (transferCount) payload.count = parseInt(transferCount);
//     if (transferMode === "day") payload.targetDate = transferDate;
//     if (transferMode === "month") {
//       payload.month = parseInt(transferMonth);
//       payload.year = parseInt(transferYear);
//     }

//     setTransferring(true);
//     setTransferResult(null);
//     try {
//       const res = await api.post(`/api/v1/leads/transfer`, payload);
//       if (res.data.success) {
//         setTransferResult({ ok: true, message: res.data.message, total: res.data.totalTransferred });
//         fetchData();
//       } else {
//         setTransferResult({ ok: false, message: res.data.message || "Transfer failed" });
//       }
//     } catch (err) {
//       setTransferResult({ ok: false, message: err.response?.data?.message || "Transfer failed" });
//     } finally {
//       setTransferring(false);
//     }
//   };

//   /* ================= REAL-TIME FILTER & GROUPING LOGIC ================= */
//   const getFilteredData = () => {
//     let filtered = [...assignedLeads];

//     // 1. Counselor Filter
//     if (selectedCounselorId !== "all") {
//       filtered = filtered.filter(l => {
//         const cid = l.assignedTo?._id || l.assignedTo || l.counselorId?._id || l.counselorId;
//         return String(cid) === String(selectedCounselorId);
//       });
//     }

//     // 2. Status Filter
//     if (selectedStatus !== "all") {
//       filtered = filtered.filter(l => l.status === selectedStatus);
//     }

//     // 3. Grouping for UI (Counselor Wise)
//     return filtered.reduce((acc, lead) => {
//       const counselorObj = lead.assignedTo || lead.counselorId;
//       const cid = counselorObj?._id || counselorObj;

//       if (!cid) return acc;

//       if (!acc[cid]) {
//         acc[cid] = {
//           name: counselorObj?.name || "Unknown Counselor",
//           statusCounts: {},
//           total: 0
//         };
//       }

//       const s = lead.status || "New";
//       acc[cid].statusCounts[s] = (acc[cid].statusCounts[s] || 0) + 1;
//       acc[cid].total += 1;
//       return acc;
//     }, {});
//   };

//   const displayData = getFilteredData();
//   const hasData = Object.keys(displayData).length > 0;

//   // Counselors list excluding the "from" counselor, for the transfer target dropdown
//   const transferTargetOptions = transferModal
//     ? counselors.filter(c => String(c._id) !== String(transferModal.fromCounselorId))
//     : [];

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 md:p-6 text-slate-800">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
//             <Users className="text-indigo-600" /> Lead Scheduler & Cleanup
//           </h1>
//           <p className="text-slate-500 text-sm font-medium">Manage, transfer, and cleanup leads assigned to counselors.</p>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
//           <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold text-sm uppercase">
//             <Filter size={16} />
//             <span>Advance Filtering</span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Counselor Selection */}
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Select Counselor</label>
//               <select
//                 className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
//                 value={selectedCounselorId}
//                 onChange={(e) => setSelectedCounselorId(e.target.value)}
//               >
//                 <option value="all">All Counselors</option>
//                 {counselors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//               </select>
//             </div>

//             {/* Status Selection */}
//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Select Status</label>
//               <select
//                 className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//               >
//                 <option value="all">Display All Statuses</option>
//                 {statuses.map(st => <option key={st} value={st}>{st}</option>)}
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-end gap-3">
//               <button
//                 onClick={() => {setSelectedCounselorId("all"); setSelectedStatus("all");}}
//                 className="h-10 px-4 text-sm text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl flex items-center gap-2 transition-colors border border-transparent"
//               >
//                 <RefreshCw size={16}/> Reset
//               </button>
//               <button
//                 onClick={fetchData}
//                 className="h-10 px-4 text-sm bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-black transition-all shadow-md active:scale-95"
//               >
//                 Sync Data
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Display Cards */}
//         {hasData ? (
//           <div className="grid grid-cols-1 gap-8">
//             {Object.entries(displayData).map(([cid, data]) => (
//               <div key={cid} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
//                 {/* Counselor Header */}
//                 <div className="bg-slate-900 p-4 px-6 flex justify-between items-center">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
//                       {data.name.charAt(0)}
//                     </div>
//                     <h3 className="text-white font-extrabold uppercase text-sm tracking-wide">{data.name}</h3>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-slate-400 text-[10px] font-bold uppercase">Total Leads</span>
//                     <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-lg font-black">{data.total}</span>
//                   </div>
//                 </div>

//                 {/* Status Grid */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                     {statuses.map(status => {
//                       const count = data.statusCounts[status] || 0;

//                       // Hide card if filter is active and doesn't match
//                       if (selectedStatus !== "all" && status !== selectedStatus) return null;

//                       return (
//                         <div
//                           key={status}
//                           className={`group p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
//                             count > 0
//                             ? 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
//                             : 'bg-slate-50 border-transparent opacity-40 grayscale'
//                           }`}
//                         >
//                           <div>
//                             <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2">{status}</p>
//                             <p className={`text-2xl font-black ${count > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
//                               {count}
//                             </p>
//                           </div>

//                           {count > 0 && (
//                             <div className="mt-3 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
//                               <button
//                                 onClick={() => openTransferModal(status, cid, data.name, count)}
//                                 className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 py-1.5 rounded-lg border border-transparent hover:border-indigo-100 transition-all"
//                               >
//                                 <ArrowRightLeft size={12} /> TRANSFER
//                               </button>
//                               <button
//                                 onClick={() => deleteByStatus(status, cid)}
//                                 className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-red-500 hover:bg-red-50 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all"
//                               >
//                                 <Trash2 size={12} /> CLEANUP
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
//              <AlertCircle size={48} className="text-slate-300 mb-4" />
//              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching leads found</p>
//           </div>
//         )}
//       </div>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
//           <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
//           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Synchronizing...</p>
//         </div>
//       )}

//       {/* Transfer Modal */}
//       {transferModal && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
//           <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">

//             {/* Modal Header */}
//             <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-white">
//                 <ArrowRightLeft size={16} className="text-indigo-400" />
//                 <h3 className="font-extrabold uppercase text-sm tracking-wide">Transfer Leads</h3>
//               </div>
//               <button onClick={closeTransferModal} className="text-slate-400 hover:text-white transition-colors">
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* Summary */}
//               <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
//                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
//                   Moving <span className="font-black text-slate-800">"{transferModal.status}"</span> leads from{" "}
//                   <span className="font-black text-slate-800">{transferModal.fromCounselorName}</span>{" "}
//                   <span className="text-slate-400">({transferModal.maxCount} available)</span>
//                 </p>
//               </div>

//               {!transferResult ? (
//                 <>
//                   {/* Target Counselor */}
//                   <div className="space-y-1.5">
//                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Transfer To</label>
//                     <select
//                       className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
//                       value={transferTarget}
//                       onChange={(e) => setTransferTarget(e.target.value)}
//                     >
//                       <option value="">Select counselor...</option>
//                       {transferTargetOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                     </select>
//                   </div>

//                   {/* Count */}
//                   <div className="space-y-1.5">
//                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
//                       How Many? <span className="text-slate-300 font-medium normal-case">(blank = all {transferModal.maxCount})</span>
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max={transferModal.maxCount}
//                       placeholder={`Up to ${transferModal.maxCount}`}
//                       value={transferCount}
//                       onChange={(e) => setTransferCount(e.target.value)}
//                       className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
//                     />
//                   </div>

//                   {/* Date Filter Mode */}
//                   <div className="space-y-1.5">
//                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
//                       <Calendar size={12} /> Date Range
//                     </label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {[
//                         { key: "all", label: "All Time" },
//                         { key: "day", label: "Specific Day" },
//                         { key: "month", label: "Specific Month" },
//                       ].map(opt => (
//                         <button
//                           key={opt.key}
//                           onClick={() => setTransferMode(opt.key)}
//                           className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
//                             transferMode === opt.key
//                               ? "bg-indigo-600 text-white border-indigo-600"
//                               : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300"
//                           }`}
//                         >
//                           {opt.label}
//                         </button>
//                       ))}
//                     </div>

//                     {transferMode === "day" && (
//                       <input
//                         type="date"
//                         value={transferDate}
//                         onChange={(e) => setTransferDate(e.target.value)}
//                         className="w-full border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all mt-2"
//                       />
//                     )}

//                     {transferMode === "month" && (
//                       <div className="grid grid-cols-2 gap-2 mt-2">
//                         <select
//                           value={transferMonth}
//                           onChange={(e) => setTransferMonth(e.target.value)}
//                           className="border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
//                         >
//                           <option value="">Month</option>
//                           {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
//                         </select>
//                         <input
//                           type="number"
//                           placeholder="Year"
//                           value={transferYear}
//                           onChange={(e) => setTransferYear(e.target.value)}
//                           className="border-slate-200 border p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold transition-all"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* Submit */}
//                   <button
//                     onClick={submitTransfer}
//                     disabled={transferring || !transferTarget}
//                     className="w-full h-11 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
//                   >
//                     {transferring ? (
//                       <><Loader2 size={16} className="animate-spin" /> Transferring...</>
//                     ) : (
//                       <><ArrowRightLeft size={16} /> Confirm Transfer</>
//                     )}
//                   </button>
//                 </>
//               ) : (
//                 /* Result State */
//                 <div className="text-center py-4 space-y-3">
//                   {transferResult.ok ? (
//                     <>
//                       <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
//                       <p className="font-black text-slate-800 text-sm">{transferResult.total} leads transferred</p>
//                       <p className="text-slate-400 text-xs font-medium">{transferResult.message}</p>
//                     </>
//                   ) : (
//                     <>
//                       <AlertCircle size={40} className="text-red-500 mx-auto" />
//                       <p className="font-black text-slate-800 text-sm">Transfer failed</p>
//                       <p className="text-slate-400 text-xs font-medium">{transferResult.message}</p>
//                     </>
//                   )}
//                   <button
//                     onClick={closeTransferModal}
//                     className="w-full h-10 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm mt-2"
//                   >
//                     Close
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeadScheduler;

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

  // Leads ka data 2026 se shuru hota hai, aur backend sirf single-day ya
  // single-month range accept karta hai. "All Time" ke liye, Jan 2026 se
  // current month tak har month ke liye alag call karte hain aur results
  // sum kar dete hain.
  const ALL_TIME_START_YEAR = 2026;
  const ALL_TIME_START_MONTH = 1;

  const getAllTimeMonthList = () => {
    const now = new Date();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth() + 1; // JS months are 0-indexed
    const monthList = [];

    let y = ALL_TIME_START_YEAR;
    let m = ALL_TIME_START_MONTH;
    while (y < endYear || (y === endYear && m <= endMonth)) {
      monthList.push({ month: m, year: y });
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }
    return monthList;
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

    const basePayload = {
      fromCounselorId: transferModal.fromCounselorId,
      toCounselorId: transferTarget,
      status: transferModal.status,
    };

    const overallCap = transferCount ? parseInt(transferCount) : null;

    setTransferring(true);
    setTransferResult(null);

    try {
      // ── "All Time": loop month-by-month from Jan 2026 to the current month ──
      if (transferMode === "all") {
        const monthList = getAllTimeMonthList();
        let totalTransferred = 0;
        let lastMessage = "";

        for (const { month: m, year: y } of monthList) {
          // Agar user ne count diya tha aur wo already pura ho gaya, to ruk jao
          if (overallCap !== null && totalTransferred >= overallCap) break;

          const payload = { ...basePayload, month: m, year: y };
          const remaining = overallCap !== null ? overallCap - totalTransferred : null;
          if (remaining !== null) payload.count = remaining;

          const res = await api.post(`/api/v1/leads/transfer`, payload);
          if (res.data.success) {
            totalTransferred += res.data.totalTransferred || 0;
            lastMessage = res.data.message;
          } else {
            // Ek month fail hua to baaki process rok kar error dikhao
            setTransferResult({
              ok: false,
              message: `${res.data.message || "Transfer failed"} (month ${m}/${y} par)`,
            });
            setTransferring(false);
            fetchData();
            return;
          }
        }

        setTransferResult({
          ok: true,
          message: totalTransferred > 0 ? lastMessage : "No matching leads found to transfer",
          total: totalTransferred,
        });
        fetchData();
        return;
      }

      // ── "Specific day" or "Specific month": single call, same as before ──
      const payload = { ...basePayload };
      if (overallCap !== null) payload.count = overallCap;
      if (transferMode === "day") payload.targetDate = transferDate;
      if (transferMode === "month") {
        payload.month = parseInt(transferMonth);
        payload.year = parseInt(transferYear);
      }

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
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-[fadeIn_0.15s_ease-out]"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeTransferModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 flex items-start justify-between border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <ArrowRightLeft size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">Transfer Leads</h3>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">Move leads between counselors</p>
                </div>
              </div>
              <button
                onClick={closeTransferModal}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors -mt-1 -mr-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto">
              {!transferResult ? (
                <>
                  {/* Summary */}
                  <div className="flex items-center gap-3 bg-indigo-50/60 rounded-xl p-3.5 border border-indigo-100">
                    <span className="bg-white text-indigo-600 text-xs font-black px-2.5 py-1 rounded-lg border border-indigo-200 shrink-0">
                      {transferModal.status}
                    </span>
                    <p className="text-[12.5px] text-slate-600 font-medium leading-snug">
                      <span className="font-black text-slate-900">{transferModal.maxCount}</span> lead{transferModal.maxCount === 1 ? "" : "s"} from{" "}
                      <span className="font-black text-slate-900">{transferModal.fromCounselorName}</span>
                    </p>
                  </div>

                  {/* Target Counselor */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-0.5">Transfer to</label>
                    <select
                      className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-bold text-slate-800 transition-all"
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                    >
                      <option value="">Select a counselor...</option>
                      {transferTargetOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Count */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-0.5">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Number of leads</label>
                      <span className="text-[11px] text-slate-400 font-semibold">max {transferModal.maxCount}</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max={transferModal.maxCount}
                      placeholder={`All ${transferModal.maxCount} leads`}
                      value={transferCount}
                      onChange={(e) => setTransferCount(e.target.value)}
                      className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium transition-all"
                    />
                  </div>

                  {/* Date Filter Mode */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-0.5 flex items-center gap-1.5">
                      <Calendar size={12} /> Date range
                    </label>

                    <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                      {[
                        { key: "all", label: "All time" },
                        { key: "day", label: "Specific day" },
                        { key: "month", label: "Specific month" },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setTransferMode(opt.key)}
                          className={`py-2 rounded-lg text-[11.5px] font-bold transition-all ${
                            transferMode === opt.key
                              ? "bg-white text-indigo-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
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
                        className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-bold text-slate-800 transition-all"
                      />
                    )}

                    {transferMode === "month" && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={transferMonth}
                          onChange={(e) => setTransferMonth(e.target.value)}
                          className="border border-slate-200 px-3.5 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-bold text-slate-800 transition-all"
                        >
                          <option value="">Month</option>
                          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                        <input
                          type="number"
                          placeholder="Year"
                          value={transferYear}
                          onChange={(e) => setTransferYear(e.target.value)}
                          className="border border-slate-200 px-3.5 py-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm font-bold text-slate-800 transition-all"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Result State */
                <div className="text-center py-6 space-y-3">
                  {transferResult.ok ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                      </div>
                      <p className="font-black text-slate-900 text-base">{transferResult.total} lead{transferResult.total === 1 ? "" : "s"} transferred</p>
                      <p className="text-slate-400 text-[13px] font-medium px-4">{transferResult.message}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <AlertCircle size={32} className="text-red-500" />
                      </div>
                      <p className="font-black text-slate-900 text-base">Transfer failed</p>
                      <p className="text-slate-400 text-[13px] font-medium px-4">{transferResult.message}</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0">
              {!transferResult ? (
                <button
                  onClick={submitTransfer}
                  disabled={transferring || !transferTarget}
                  className="w-full h-11 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-sm"
                >
                  {transferring ? (
                    <><Loader2 size={16} className="animate-spin" /> Transferring...</>
                  ) : (
                    <><ArrowRightLeft size={16} /> Confirm transfer</>
                  )}
                </button>
              ) : (
                <button
                  onClick={closeTransferModal}
                  className="w-full h-11 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all text-sm active:scale-[0.98]"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScheduler;