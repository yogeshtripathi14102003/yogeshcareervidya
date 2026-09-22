


// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import api from "@/utlis/api.js";
// import { useAuth } from "@/context/AuthContext.jsx";
// import * as XLSX from "xlsx";
// import { FaWhatsapp, FaFileExcel, FaPhoneAlt, FaUserAlt } from "react-icons/fa";
// import StudentAdmission from "@/app/counselordashbord/components/StudentAdmission.jsx";
// import LeadTimelineModal from "@/app/counselordashbord/components/LeadTimelineModal.jsx";
// import {
//   Search, X, Save,
//   ChevronLeft, ChevronRight, MapPin, BookOpen, Smartphone, Calendar,
//   TrendingUp, Clock
// } from "lucide-react";

// /* ================= HELPERS ================= */
// const formatForInput = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// };

// const isToday = (dateString) => {
//   if (!dateString) return false;
//   return new Date(dateString).toDateString() === new Date().toDateString();
// };

// // ✅ UPDATED: historyByDate se check karta hai (remark string parse nahi karta)
// const isRemarkUpdatedToday = (lead) => {
//   if (!lead?.historyByDate || !Array.isArray(lead.historyByDate)) return false;
//   const todayIST = new Date().toLocaleDateString("en-CA", {
//     timeZone: "Asia/Kolkata",
//   });
//   return lead.historyByDate.some((day) => day.date === todayIST);
// };

// // ✅ NEW: latest remark nikalo historyByDate se
// const getLatestRemark = (lead) => {
//   if (!lead?.historyByDate?.length) return lead?.remark || "";
//   const latestDay = lead.historyByDate[0];
//   return latestDay.entries?.[0]?.remark || lead?.remark || "";
// };

// const formatDateLabel = (dateStr) => {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const STATUS = [
//   "New",
//   "Not Interested",
//   "Details Shared",
//   "Follow-up",
//   "Hot Lead",
//   "University Issue",
//   "Fee Issue",
//   "Distance Issue",
//   "Language Issue",
//   "Not Picked",
//   "Admission Done",
// ];

// // Color map for today's status badges
// const STATUS_COLORS = {
//   "New": { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
//   "Not Interested": { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
//   "Details Shared": { bg: "#e0e7ff", text: "#4338ca", border: "#a5b4fc" },
//   "Follow-up": { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
//   "Hot Lead": { bg: "#fce7f3", text: "#be185d", border: "#f9a8d4" },
//   "University Issue": { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
//   "Fee Issue": { bg: "#fff7ed", text: "#c2410c", border: "#fdba74" },
//   "Distance Issue": { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
//   "Language Issue": { bg: "#fdf4ff", text: "#7e22ce", border: "#d8b4fe" },
//   "Not Picked": { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
//   "Admission Done": { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
// };

// const LeadsPage = () => {
//   const { user: authUser } = useAuth();
//   const [leads, setLeads] = useState([]);
//   const [totalLeads, setTotalLeads] = useState(0);
//   const [stats, setStats] = useState([]);
//   const [todayStats, setTodayStats] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 30;

//   // Date Filters
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [appliedFrom, setAppliedFrom] = useState("");
//   const [appliedTo, setAppliedTo] = useState("");

//   /* ================= FETCH LEADS ================= */
//   const fetchMyLeads = useCallback(async () => {
//     setLoading(true);
//     try {
//       const counselorId = authUser?._id;
//       if (!counselorId) return;

//       const params = {
//         id: counselorId,
//         page: currentPage,
//         limit: itemsPerPage,
//         searchTerm: searchTerm.trim(),
//         status: filterStatus || undefined,
//         fromDate: appliedFrom || undefined,
//         toDate: appliedTo || undefined,
//       };

//       const res = await api.get("/api/v1/counselor-leads", { params });

//       if (res.data.success) {
//         setLeads(res.data.data || []);
//         setTotalLeads(res.data.total || 0);
//         setStats(res.data.stats || []);
//         setTodayStats(res.data.todayStats || []);
//       }
//     } catch (err) {
//       console.error("Fetch error", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchTerm, filterStatus, appliedFrom, appliedTo, authUser]);

//   useEffect(() => {
//     fetchMyLeads();
//   }, [fetchMyLeads]);

//   /* ================= APPLY / CLEAR FILTER ================= */
//   const handleApplyFilter = () => {
//     setAppliedFrom(fromDate);
//     setAppliedTo(toDate);
//     setCurrentPage(1);
//   };

//   const handleClearFilter = () => {
//     setFromDate("");
//     setToDate("");
//     setAppliedFrom("");
//     setAppliedTo("");
//     setCurrentPage(1);
//   };

//   /* ================= EXPORT EXCEL ================= */
//   const handleExportExcel = async () => {
//     setLoading(true);
//     try {
//       const counselorId = authUser?._id;

//       const params = {
//         id: counselorId,
//         limit: "all",
//         searchTerm: searchTerm.trim(),
//         status: filterStatus || undefined,
//         fromDate: appliedFrom || undefined,
//         toDate: appliedTo || undefined,
//       };

//       const res = await api.get("/api/v1/counselor-leads", { params });

//       if (res.data.success && res.data.data.length > 0) {
//         const allLeads = res.data.data;
//         const dataToExport = allLeads.map((lead) => {
//           // ✅ Latest remark historyByDate se
//           const latestRemark = getLatestRemark(lead);
//           return {
//             "Lead Name": lead.name || "",
//             "Phone Number": lead.phone || lead.mobile || lead.contactNo || "",
//             Course: lead.course || "",
//             City: lead.city || "",
//             Status: lead.status === "Not Picked" ? "Dead Lead" : lead.status,
//             "Remark Count": lead.remarkCount || 0,
//             "Latest Remark": latestRemark || "",
//             "Next Follow-up": lead.followUpDate
//               ? new Date(lead.followUpDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
//               : "N/A",
//             "Created At": new Date(lead.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
//             "Last Updated (IST)": lead.updatedAtIST || "",
//           };
//         });

//         const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "MyLeads");

//         const rangeLabel =
//           appliedFrom && appliedTo
//             ? `${appliedFrom}_to_${appliedTo}`
//             : "All";

//         XLSX.writeFile(workbook, `Leads_${filterStatus || "All"}_${rangeLabel}.xlsx`);
//       } else {
//         alert("No Data found to download !");
//       }
//     } catch (err) {
//       console.error("Export error", err);
//       alert("Export failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UPDATE LEAD ================= */
//   const updateLeadAPI = async (id, data) => {
//     try {
//       // ✅ data me sirf: { status, remark, followUpDate }
//       // ❌ followUpHistory KABHI mat bhejo — backend khud $push karega
//       const res = await api.put(`/api/v1/leads/${id}`, data);
//       if (res.data.success) {
//         fetchMyLeads();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Update failed");
//     }
//   };

//   const totalPages = Math.ceil(totalLeads / itemsPerPage);

//   // Today's total updated leads
//   const todayTotal = todayStats.reduce((sum, s) => sum + (s.count || 0), 0);

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen text-gray-800">

//       {/* ── Top Bar ── */}
//       <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center justify-between">
//         {/* Date Range Filter */}
//         <div className="flex items-center gap-2 text-xs flex-wrap">
//           <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase">
//             <Calendar size={14} /> Date Range:
//           </div>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border p-1.5 rounded bg-gray-50 outline-none text-xs cursor-pointer focus:ring-1 focus:ring-blue-400"
//           />
//           <span className="text-gray-400 text-xs font-semibold">to</span>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border p-1.5 rounded bg-gray-50 outline-none text-xs cursor-pointer focus:ring-1 focus:ring-blue-400"
//           />
//           <button
//             onClick={handleApplyFilter}
//             disabled={!fromDate || !toDate}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
//           >
//             Apply
//           </button>
//           {(appliedFrom || appliedTo) && (
//             <button
//               onClick={handleClearFilter}
//               className="flex items-center gap-1 border px-2.5 py-1.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
//             >
//               <X size={11} /> Clear
//             </button>
//           )}
//           {appliedFrom && appliedTo && (
//             <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
//               {formatDateLabel(appliedFrom)} – {formatDateLabel(appliedTo)}
//             </span>
//           )}
//         </div>

//         {/* Export Button */}
//         <button
//           onClick={handleExportExcel}
//           disabled={loading}
//           className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-all active:scale-95 shadow-md disabled:opacity-50"
//         >
//           <FaFileExcel /> {loading ? "Processing..." : "Export Excel"}
//         </button>
//       </div>

//       {/* ── Overall Stats Grid ── */}
//       <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-11 gap-2 mb-4">
//         <Stat
//           title="Total"
//           value={totalLeads}
//           color="#1d4ed8"
//           isActive={filterStatus === ""}
//           onClick={() => { setFilterStatus(""); setCurrentPage(1); }}
//         />
//         {STATUS.map((s) => (
//           <Stat
//             key={s}
//             title={s === "Not Picked" ? "Dead Lead" : s}
//             value={stats.find((item) => item._id === s)?.count || 0}
//             color={s === "Not Picked" ? "#dc2626" : "#4b5563"}
//             isActive={filterStatus === s}
//             onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
//           />
//         ))}
//       </div>

//       {/* ══════════════════════════════════════════
//           ── AAJ KI REPORT (Today's Report) ──
//       ══════════════════════════════════════════ */}
//       <div className="bg-white border rounded-lg shadow-sm mb-4 overflow-hidden">
//         <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600">
//           <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
//             <TrendingUp size={15} />
//             Today Report — Status Changes
//           </div>
//           <div className="flex items-center gap-1.5 text-violet-100 text-[10px] font-bold">
//             <Clock size={11} />
//             {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//             {" · "}
//             <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-black">
//               {todayTotal} Total Updates
//             </span>
//           </div>
//         </div>

//         <div className="p-3 flex flex-wrap gap-2">
//           {todayTotal === 0 ? (
//             <p className="text-xs text-gray-400 font-bold py-1 px-2">
//               Today no status changes have been made. 🛠️
//             </p>
//           ) : (
//             STATUS.map((s) => {
//               const count = todayStats.find((item) => item._id === s)?.count || 0;
//               if (count === 0) return null;
//               const clr = STATUS_COLORS[s] || { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
//               return (
//                 <TodayStatBadge
//                   key={s}
//                   label={s === "Not Picked" ? "Dead Lead" : s}
//                   count={count}
//                   colors={clr}
//                 />
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* ── Search & Pagination ── */}
//       <div className="bg-white p-3 rounded shadow-sm mb-4 border flex flex-wrap items-center justify-between gap-4">
//         <div className="flex-1 relative max-w-md">
//           <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or phone..."
//             value={searchTerm}
//             onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//             className="w-full pl-9 pr-3 py-1.5 border rounded text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-blue-400"
//           />
//         </div>
//         <div className="flex items-center gap-2 font-bold text-xs">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="p-1.5 border rounded bg-gray-50 disabled:opacity-30 hover:bg-white transition-colors"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <span className="px-2 min-w-[100px] text-center">
//             Page {currentPage} of {totalPages || 1}
//           </span>
//           <button
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="p-1.5 border rounded bg-gray-50 disabled:opacity-30 hover:bg-white transition-colors"
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>

//       {/* ── Legend ── */}
//       <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-gray-500 px-1">
//         <div className="flex items-center gap-1.5">
//           <span className="w-3 h-3 rounded-sm bg-rose-200 border border-rose-400 inline-block"></span>
//           Today Follow-up
//         </div>
//         <div className="flex items-center gap-1.5">
//           <span className="w-3 h-3 rounded-sm bg-green-200 border border-green-400 inline-block"></span>
//           Remark Updated Today
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div
//         className={`bg-white rounded shadow-sm overflow-x-auto border transition-opacity duration-300 ${
//           loading ? "opacity-40 pointer-events-none" : "opacity-100"
//         }`}
//       >
//         <table className="w-full min-w-[1100px] border-collapse text-[11px]">
//           <thead className="bg-slate-50 text-slate-500 border-b uppercase font-bold">
//             <tr>
//               <th className="p-3 text-left w-64">Lead Details</th>
//               <th className="text-left w-48">Course & Location</th>
//               <th className="text-left w-32">Status</th>
//               <th className="text-left w-64">Remark & Follow-up</th>
//               <th className="text-left w-40">Next Follow-up</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100 font-medium">
//             {leads.length > 0 ? (
//               leads.map((l) => (
//                 <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="p-10 text-center text-gray-400 font-bold text-sm">
//                   No leads found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// /* ================= SUB-COMPONENTS ================= */

// const Stat = ({ title, value, color, onClick, isActive }) => (
//   <div
//     onClick={onClick}
//     className={`bg-white border-l-4 p-2.5 rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${
//       isActive ? "ring-2 ring-blue-600 scale-105 shadow-md" : "border-gray-200"
//     }`}
//     style={{ borderLeftColor: color }}
//   >
//     <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{title}</p>
//     <p className="text-lg font-black text-gray-800 leading-none mt-1">{value}</p>
//   </div>
// );

// const TodayStatBadge = ({ label, count, colors }) => (
//   <div
//     className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-[11px] shadow-sm"
//     style={{
//       backgroundColor: colors.bg,
//       color: colors.text,
//       borderColor: colors.border,
//     }}
//   >
//     <span className="uppercase tracking-wide">{label}</span>
//     <span
//       className="text-xs font-black px-1.5 py-0.5 rounded-md"
//       style={{ backgroundColor: colors.border, color: colors.text }}
//     >
//       {count}
//     </span>
//   </div>
// );

// const LeadRow = ({ lead, onSave }) => {
//   const [localStatus, setLocalStatus] = useState(lead.status);
//   const [localRemark, setLocalRemark] = useState("");
//   const [localDate, setLocalDate] = useState(formatForInput(lead.followUpDate));

//   const [showAdmission, setShowAdmission] = useState(false);
//   const [showTimeline, setShowTimeline] = useState(false);

//   // ✅ Latest remark from historyByDate
//   const latestRemark = getLatestRemark(lead);

//   const phoneNumber = lead.phone || lead.mobile || lead.contactNo;
//   const hasChange =
//     localStatus !== lead.status ||
//     localRemark.trim() !== "" ||
//     localDate !== formatForInput(lead.followUpDate);

//   // ✅ Updated: historyByDate based check
//   const remarkUpdatedToday = isRemarkUpdatedToday(lead);

//   const rowClass = isToday(lead.followUpDate)
//     ? "bg-rose-50/60 border-l-4 border-rose-400"
//     : remarkUpdatedToday
//     ? "bg-green-50 border-l-4 border-green-400"
//     : "";

//   const handleUpdate = () => {
//     if (localStatus === "Not Picked") {
//       const createdDate = new Date(lead.createdAt);
//       const diffDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
//       if (diffDays < 10) {
//         alert(`Avi 10 days Nahi Huy please follwup kre. CONVERT HOGA APP kra Skte ho`);
//         return;
//       }
//     }

//     // ✅ Backend ko sirf remark + status + followUpDate bhejo
//     // ❌ followUpHistory KABHI mat bhejo — backend khud $push karega
//     onSave(lead._id, {
//       status: localStatus,
//       remark: localRemark.trim() || undefined, // khali ho to bhejo hi nahi
//       followUpDate: localDate ? new Date(localDate).toISOString() : null,
//     });
//     setLocalRemark("");
//   };

//   return (
//     <>
//       <tr className={`hover:bg-blue-50/40 transition-colors ${rowClass}`}>
//         {/* Lead Details */}
//         <td className="p-3 border-r border-gray-50">
//           <div className="flex flex-col gap-1.5">
//             <span className="font-bold text-gray-900 text-[12px] uppercase flex items-center gap-1.5">
//               <FaUserAlt size={10} className="text-slate-400" /> {lead.name || ""}
//             </span>
//             <div className="flex items-center gap-2">
//               {phoneNumber && (
//                 <>
//                   <a
//                     href={`tel:${phoneNumber}`}
//                     className="text-[10px] text-blue-600 font-bold hover:underline bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1"
//                   >
//                     <FaPhoneAlt size={9} /> {phoneNumber}
//                   </a>
//                   <a
//                     href={`https://wa.me/${phoneNumber.toString().replace(/\D/g, "")}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-emerald-500 hover:scale-110 transition-transform"
//                   >
//                     <FaWhatsapp size={16} />
//                   </a>
//                 </>
//               )}
//             </div>
//             {lead.source && (
//               <span
//                 className="text-[9px] font-bold uppercase tracking-wide w-fit px-1.5 py-0.5 rounded-full"
//                 style={{
//                   background: lead.source.startsWith("Website") ? "#e0f2fe" : lead.source === "Manual Upload" || lead.source === "Imported Lead" ? "#f1f5f9" : "#fef3c7",
//                   color: lead.source.startsWith("Website") ? "#0369a1" : lead.source === "Manual Upload" || lead.source === "Imported Lead" ? "#475569" : "#92400e",
//                 }}
//               >
//                 {lead.source}
//               </span>
//             )}
//           </div>
//         </td>

//         {/* Course & Location */}
//         <td className="p-3 border-r border-gray-50">
//           <div className="flex flex-col gap-1.5">
//             {lead.course && (
//               <div className="flex items-center gap-1 text-indigo-700 font-black uppercase text-[10px]">
//                 <BookOpen size={11} /> {lead.course}
//               </div>
//             )}
//             {lead.city && (
//               <div className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[9px]">
//                 <MapPin size={10} /> {lead.city}
//               </div>
//             )}
//           </div>
//         </td>

//         {/* Status */}
//         <td className="border-r border-gray-50 px-2">
//           <select
//             value={localStatus}
//             onChange={(e) => setLocalStatus(e.target.value)}
//             className="border rounded p-1 text-[10px] font-bold w-full bg-white outline-none"
//           >
//             {STATUS.map((s) => (
//               <option key={s} value={s}>
//                 {s === "Not Picked" ? "Dead Lead" : s}
//               </option>
//             ))}
//           </select>
//         </td>

//         {/* Remark */}
//         <td className="p-2 border-r border-gray-50">
//           <div className="flex flex-col gap-1">
//             {remarkUpdatedToday && (
//               <span className="text-[8px] font-black text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded w-fit">
//                 ✅ Updated Today
//               </span>
//             )}

//             {/* ✅ NEW: Remark Count Badge */}
//             <span className="text-[9px] font-black text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded w-fit">
//               {lead.remarkCount || 0} Updates
//             </span>

//             {/* ✅ Latest Remark from historyByDate */}
//             <div className="text-[9px] text-blue-800 font-semibold bg-blue-50/50 p-1 rounded border border-blue-100 max-h-12 overflow-y-auto whitespace-pre-wrap">
//               {latestRemark || "No remarks"}
//             </div>

//             <input
//               type="text"
//               value={localRemark}
//               onChange={(e) => setLocalRemark(e.target.value)}
//               placeholder="Add new remark..."
//               className="w-full p-1.5 text-[10px] bg-white border border-gray-300 rounded outline-none"
//             />
//           </div>
//         </td>

//         {/* Next Follow-up */}
//         <td className="border-r border-gray-50 px-2">
//           <input
//             type="datetime-local"
//             value={localDate}
//             onChange={(e) => setLocalDate(e.target.value)}
//             className="border rounded p-1 text-[10px] font-semibold w-full outline-none bg-white"
//           />
//         </td>

//         {/* Actions */}
//         <td className="p-3 text-center">
//           <div className="flex gap-2 justify-center">
//             <button
//               disabled={!hasChange}
//               onClick={handleUpdate}
//               className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold disabled:opacity-20 active:scale-90 shadow-sm"
//             >
//               <Save size={13} />
//             </button>
//             <button
//               onClick={() => setShowAdmission(true)}
//               className="bg-orange-500 text-white px-3 py-1.5 rounded-md font-bold active:scale-90 shadow-sm"
//             >
//               View
//             </button>
//             <button
//               onClick={() => setShowTimeline(true)}
//               title="Activity Timeline"
//               className="bg-indigo-500 text-white px-3 py-1.5 rounded-md font-bold active:scale-90 shadow-sm"
//             >
//               <Clock size={13} />
//             </button>
//           </div>
//         </td>
//       </tr>

//       {/* Activity Timeline Modal */}
//       {showTimeline && (
//         <tr>
//           <td colSpan="6" className="p-0 border-none">
//             <LeadTimelineModal leadId={lead._id} onClose={() => setShowTimeline(false)} />
//           </td>
//         </tr>
//       )}

//       {/* Student Admission Modal */}
//       {showAdmission && (
//         <tr>
//           <td colSpan="6" className="p-0 border-none">
//             <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
//               <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col relative">
//                 <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
//                   <h3 className="font-black text-slate-700 uppercase flex items-center gap-2">
//                     <Smartphone size={18} className="text-blue-600" /> Student Profile
//                   </h3>
//                   <button
//                     onClick={() => setShowAdmission(false)}
//                     className="text-slate-400 hover:text-red-500"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//                 <div className="p-6 overflow-y-auto">
//                   <StudentAdmission lead={lead} onClose={() => setShowAdmission(false)} />
//                 </div>
//               </div>
//             </div>
//           </td>
//         </tr>
//       )}
//     </>
//   );
// };

// export default LeadsPage;


"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import * as XLSX from "xlsx";
import { FaWhatsapp, FaFileExcel, FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import StudentAdmission from "@/app/counselordashbord/components/StudentAdmission.jsx";
import LeadTimelineModal from "@/app/counselordashbord/components/LeadTimelineModal.jsx";
import {
  Search, X, Save,
  ChevronLeft, ChevronRight, MapPin, BookOpen, Smartphone, Calendar,
  TrendingUp, Clock, RefreshCw
} from "lucide-react";

/* ================= HELPERS ================= */
const todayISTString = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const formatISTDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
  const d = new Date(dateString).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  return d === todayISTString();
};

const isRemarkUpdatedToday = (lead) => {
  if (!lead?.historyByDate || !Array.isArray(lead.historyByDate)) return false;
  return lead.historyByDate.some((day) => day.date === todayISTString());
};

const getLatestRemark = (lead) => {
  if (!lead?.historyByDate?.length) return lead?.remark || "";
  const latestDay = lead.historyByDate[0];
  return latestDay.entries?.[0]?.remark || lead?.remark || "";
};

const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const STATUS = [
  "New", "Not Interested", "Details Shared", "Follow-up",
  "Hot Lead", "University Issue", "Fee Issue", "Distance Issue",
  "Language Issue", "Not Picked", "Admission Done",
];

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
  const { user: authUser } = useAuth();
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [stats, setStats] = useState([]);
  const [todayStats, setTodayStats] = useState([]);
  const [todayDateIST, setTodayDateIST] = useState(todayISTString());
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

  // ✅ Track if it's the first load
  const isFirstLoad = useRef(true);

  /* ================= FETCH LEADS ================= */
  const fetchMyLeads = useCallback(async () => {
    setLoading(true);
    try {
      const counselorId = authUser?._id;
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
        setTodayStats(res.data.todayStats || []);
        setTodayDateIST(res.data.todayDateIST || todayISTString());
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, [currentPage, searchTerm, filterStatus, appliedFrom, appliedTo, authUser]);

  // ✅ Fetch on mount + when filters change
  useEffect(() => {
    fetchMyLeads();
  }, [fetchMyLeads]);

  /* ================= UPDATE LEAD (LOCAL) ================= */
  // ✅ KEY: Update karte waqt poori list refresh NA karo
  // Sirf us lead ko locally update karo — apni jagah rahe
  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);

      if (res.data.success) {
        // ✅ Update response se naya lead lo
        const updatedLead = res.data.data;

        // ✅ Sirf us lead ko update karo — list ka order nahi badlega
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === id
              ? {
                  ...lead,
                  ...updatedLead,
                  // ✅ Preserve computed fields jo backend bhejta hai
                  remarkCount:
                    updatedLead.remarkCount ??
                    (updatedLead.followUpHistory?.length || 0),
                  historyByDate:
                    updatedLead.historyByDate || lead.historyByDate,
                  updatedAtIST: updatedLead.updatedAtIST || lead.updatedAtIST,
                }
              : lead
          )
        );

        // ✅ Stats + todayStats locally update karo (refresh nahi)
        updateStatsLocally(id, updatedLead, data);

        // ✅ Success feedback
        console.log(`✅ Lead ${id} updated locally`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= LOCAL STATS UPDATE ================= */
  // ✅ Stats ko locally update karo bina refresh ke
  const updateStatsLocally = (leadId, updatedLead, updateData) => {
    // Find old lead
    const oldLead = leads.find((l) => l._id === leadId);
    if (!oldLead) return;

    const oldStatus = oldLead.status;
    const newStatus = updateData.status || oldLead.status;

    // ✅ Status change hua?
    if (oldStatus !== newStatus) {
      setStats((prevStats) => {
        const updated = [...prevStats];
        const oldStat = updated.find((s) => s._id === oldStatus);
        const newStat = updated.find((s) => s._id === newStatus);

        if (oldStat) oldStat.count = Math.max(0, oldStat.count - 1);
        if (newStat) newStat.count += 1;
        else updated.push({ _id: newStatus, count: 1 });

        return updated;
      });

      // ✅ Today stats bhi update karo (agar aaj ka update hai)
      setTodayStats((prevStats) => {
        const updated = [...prevStats];
        const oldStat = updated.find((s) => s._id === oldStatus);
        const newStat = updated.find((s) => s._id === newStatus);

        if (oldStat) oldStat.count = Math.max(0, oldStat.count - 1);
        if (newStat) newStat.count += 1;
        else updated.push({ _id: newStatus, count: 1 });

        return updated;
      });
    }
  };

  /* ================= MANUAL REFRESH ================= */
  const handleManualRefresh = () => {
    fetchMyLeads();
  };

  /* ================= APPLY / CLEAR FILTER ================= */
  const handleApplyFilter = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setCurrentPage(1);
    // Filter change pe fetch automatic hoga (useEffect se)
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
      const counselorId = authUser?._id;

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
        const dataToExport = allLeads.map((lead) => {
          const latestRemark = getLatestRemark(lead);
          return {
            "Lead Name": lead.name || "",
            "Phone Number": lead.phone || lead.mobile || lead.contactNo || "",
            Course: lead.course || "",
            City: lead.city || "",
            Status: lead.status === "Not Picked" ? "Dead Lead" : lead.status,
            "Remark Count": lead.remarkCount || 0,
            "Latest Remark": latestRemark || "",
            "Next Follow-up": lead.followUpDate
              ? new Date(lead.followUpDate).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })
              : "N/A",
            "Created At": new Date(lead.createdAt).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
            "Last Updated (IST)": lead.updatedAtIST || "",
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MyLeads");

        const rangeLabel =
          appliedFrom && appliedTo
            ? `${appliedFrom}_to_${appliedTo}`
            : "All";

        XLSX.writeFile(workbook, `Leads_${filterStatus || "All"}_${rangeLabel}.xlsx`);
      } else {
        alert("No Data found to download !");
      }
    } catch (err) {
      console.error("Export error", err);
      alert("Export failed!");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalLeads / itemsPerPage);
  const todayTotal = useMemo(
    () => todayStats.reduce((sum, s) => sum + (s.count || 0), 0),
    [todayStats]
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">

      {/* ── Top Bar ── */}
      <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center justify-between">
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

        <div className="flex items-center gap-2">
          {/* ✅ Manual Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            title="Refresh list"
            className="flex items-center gap-1.5 bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleExportExcel}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-all active:scale-95 shadow-md disabled:opacity-50"
          >
            <FaFileExcel /> {loading ? "Processing..." : "Export"}
          </button>
        </div>
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

      {/* ── Today Report ── */}
      <div className="bg-white border rounded-lg shadow-sm mb-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600">
          <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
            <TrendingUp size={15} />
            Today Report — Status Changes
          </div>
          <div className="flex items-center gap-1.5 text-violet-100 text-[10px] font-bold">
            <Clock size={11} />
            {todayDateIST
              ? new Date(todayDateIST + "T00:00:00+05:30").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : formatISTDate(new Date())}
            {" · "}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-black">
              {todayTotal} Total Updates
            </span>
          </div>
        </div>

        <div className="p-3 flex flex-wrap gap-2">
          {todayTotal === 0 ? (
            <p className="text-xs text-gray-400 font-bold py-1 px-2">
              Aaj abhi tak koi status change nahi hua. 🛠️
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
        <div className="flex items-center gap-1.5 text-blue-600">
          <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-400 inline-block"></span>
          Update hone pe list order same rehta hai
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
  const [showTimeline, setShowTimeline] = useState(false);

  const latestRemark = getLatestRemark(lead);
  const phoneNumber = lead.phone || lead.mobile || lead.contactNo;

  const hasChange =
    localStatus !== lead.status ||
    localRemark.trim() !== "" ||
    localDate !== formatForInput(lead.followUpDate);

  const remarkUpdatedToday = isRemarkUpdatedToday(lead);

  const rowClass = isToday(lead.followUpDate)
    ? "bg-rose-50/60 border-l-4 border-rose-400"
    : remarkUpdatedToday
    ? "bg-green-50 border-l-4 border-green-400"
    : "";

  // ✅ Sync local state when lead prop changes (after backend update)
  useEffect(() => {
    setLocalStatus(lead.status);
    setLocalDate(formatForInput(lead.followUpDate));
  }, [lead.status, lead.followUpDate]);

  const handleUpdate = () => {
    if (localStatus === "Not Picked") {
      const createdDate = new Date(lead.createdAt);
      const diffDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 10) {
        alert(`Avi 10 days Nahi Huy please follwup kre. CONVERT HOGA APP kra Skte ho`);
        return;
      }
    }

    onSave(lead._id, {
      status: localStatus,
      remark: localRemark.trim() || undefined,
      followUpDate: localDate ? new Date(localDate).toISOString() : null,
    });
    setLocalRemark("");
  };

  return (
    <>
      <tr className={`hover:bg-blue-50/40 transition-colors ${rowClass}`}>
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
            {lead.source && (
              <span
                className="text-[9px] font-bold uppercase tracking-wide w-fit px-1.5 py-0.5 rounded-full"
                style={{
                  background: lead.source.startsWith("Website") ? "#e0f2fe" : lead.source === "Manual Upload" || lead.source === "Imported Lead" ? "#f1f5f9" : "#fef3c7",
                  color: lead.source.startsWith("Website") ? "#0369a1" : lead.source === "Manual Upload" || lead.source === "Imported Lead" ? "#475569" : "#92400e",
                }}
              >
                {lead.source}
              </span>
            )}
          </div>
        </td>

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

        <td className="p-2 border-r border-gray-50">
          <div className="flex flex-col gap-1">
            {remarkUpdatedToday && (
              <span className="text-[8px] font-black text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.5 rounded w-fit">
                ✅ Updated Today
              </span>
            )}
            <span className="text-[9px] font-black text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded w-fit">
              {lead.remarkCount || (lead.followUpHistory?.length || 0)} Updates
            </span>
            <div className="text-[9px] text-blue-800 font-semibold bg-blue-50/50 p-1 rounded border border-blue-100 max-h-12 overflow-y-auto whitespace-pre-wrap">
              {latestRemark || "No remarks"}
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

        <td className="border-r border-gray-50 px-2">
          <input
            type="datetime-local"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className="border rounded p-1 text-[10px] font-semibold w-full outline-none bg-white"
          />
        </td>

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
            <button
              onClick={() => setShowTimeline(true)}
              title="Activity Timeline"
              className="bg-indigo-500 text-white px-3 py-1.5 rounded-md font-bold active:scale-90 shadow-sm"
            >
              <Clock size={13} />
            </button>
          </div>
        </td>
      </tr>

      {showTimeline && (
        <tr>
          <td colSpan="6" className="p-0 border-none">
            <LeadTimelineModal leadId={lead._id} onClose={() => setShowTimeline(false)} />
          </td>
        </tr>
      )}

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