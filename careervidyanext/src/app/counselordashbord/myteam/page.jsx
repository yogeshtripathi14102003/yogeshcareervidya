

// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import { useAuth } from "@/context/AuthContext.jsx";
// import * as XLSX from "xlsx";
// import {
//   Users, Phone, Mail, ChevronDown, ChevronUp, Eye,
//   Award, Clock, TrendingUp, Search, X, Download,
//   AlertTriangle, CheckCircle2, Timer, CalendarCheck,
//   UserPlus, PhoneCall, FileSpreadsheet, Filter,
//   BarChart3, CalendarDays
// } from "lucide-react";

// /* ================= HELPERS ================= */
// const fmtTime = (d) =>
//   d
//     ? new Date(d).toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : "—";

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const getTodayIST = () =>
//   new Date().toLocaleDateString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });

// const STATUS_COLORS = {
//   "New": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
//   "Hot Lead": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
//   "Follow-up": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
//   "Details Shared": { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF" },
//   "Admission Done": { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
//   "Not Picked": { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
//   "Not Interested": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
// };

// const getStatusStyle = (status) =>
//   STATUS_COLORS[status] || { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" };

// export default function MyTeamPage() {
//   const { user } = useAuth();
//   const [team, setTeam] = useState([]);
//   const [memberStats, setMemberStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState(null);
//   const [memberLeads, setMemberLeads] = useState({});
//   const [leadsLoading, setLeadsLoading] = useState(false);

//   // ✅ NEW: search + filter + report
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [reportLoading, setReportLoading] = useState(false);

//   useEffect(() => {
//     if (!user?.isTeamLead) {
//       setLoading(false);
//       return;
//     }
//     fetchTeam();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   const fetchTeam = async () => {
//     try {
//       const res = await api.get("/api/v1/counselor/team/my-team");
//       const members = res.data.data || [];
//       setTeam(members);

//       // Per-member stats
//       const statsEntries = await Promise.all(
//         members.map(async (m) => {
//           try {
//             const [statsRes, hoursRes] = await Promise.all([
//               api.get(`/api/v1/counselor/analytics/${m._id}`),
//               api.get(`/api/v1/counselor/analytics/hours-summary/${m._id}`),
//             ]);
//             return [m._id, { ...statsRes.data?.data, hours: hoursRes.data?.data }];
//           } catch {
//             return [m._id, null];
//           }
//         })
//       );
//       setMemberStats(Object.fromEntries(statsEntries));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpand = async (memberId) => {
//     if (expanded === memberId) {
//       setExpanded(null);
//       return;
//     }
//     setExpanded(memberId);

//     if (!memberLeads[memberId]) {
//       setLeadsLoading(true);
//       try {
//         const res = await api.get("/api/v1/counselor-leads", {
//           params: { id: memberId, limit: "all" },
//         });
//         setMemberLeads((prev) => ({ ...prev, [memberId]: res.data.data || [] }));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLeadsLoading(false);
//       }
//     }
//   };

//   // ✅ NEW: Generate Excel report for one member
//   const generateMemberReport = async (member) => {
//     setReportLoading(true);
//     try {
//       const res = await api.get("/api/v1/counselor-leads", {
//         params: {
//           id: member._id,
//           limit: "all",
//           status: statusFilter || undefined,
//           fromDate: fromDate || undefined,
//           toDate: toDate || undefined,
//         },
//       });

//       const leads = res.data.data || [];
//       if (leads.length === 0) {
//         alert("No leads found for this report");
//         return;
//       }

//       // Sheet 1: Leads
//       const leadsData = leads.map((lead) => {
//         const latestRemark =
//           lead.historyByDate?.[0]?.entries?.[0]?.remark || lead.remark || "";
//         return {
//           "Lead Name": lead.name || "",
//           Phone: lead.phone || lead.mobile || "",
//           Email: lead.email || "",
//           Course: lead.course || "",
//           City: lead.city || "",
//           State: lead.state || "",
//           Status: lead.status || "",
//           "Remark Count": lead.remarkCount || 0,
//           "Latest Remark": latestRemark,
//           "Next Follow-up": lead.followUpDate
//             ? new Date(lead.followUpDate).toLocaleString("en-IN", {
//                 timeZone: "Asia/Kolkata",
//               })
//             : "—",
//           "Created At": fmtDate(lead.createdAt),
//           "Last Updated": fmtTime(lead.updatedAt),
//         };
//       });

//       // Sheet 2: Summary
//       const stats = memberStats[member._id] || {};
//       const summaryData = [
//         ["Counselor", member.name],
//         ["Email", member.email],
//         ["Phone", member.phone || "—"],
//         ["Status", member.status],
//         ["", ""],
//         ["REPORT DATE", getTodayIST()],
//         ["", ""],
//         ["PERFORMANCE METRICS", ""],
//         ["Total Leads", stats.totalLeads || 0],
//         ["Calls Done", stats.callsDone || 0],
//         ["Pending Calls", stats.pendingCalls || 0],
//         ["Overdue Calls", stats.overdueCalls || 0],
//         ["Fresh / Uncontacted", stats.freshUncontacted || 0],
//         ["Follow-ups Logged", stats.followUps || 0],
//         ["Admissions", stats.admissions || 0],
//         ["Lost Leads", stats.lostLeads || 0],
//         ["Conversion Rate", `${stats.conversionRate || 0}%`],
//         ["Avg Response Time", stats.avgResponseMinutes != null ? `${stats.avgResponseMinutes} min` : "—"],
//         ["Avg Resolution Time", stats.avgResolutionHours != null ? `${stats.avgResolutionHours} hrs` : "—"],
//         ["", ""],
//         ["WORKING HOURS", ""],
//         ["Today", stats.hours?.today != null ? `${stats.hours.today}h` : "—"],
//         ["This Week", stats.hours?.thisWeek != null ? `${stats.hours.thisWeek}h` : "—"],
//         ["This Month", stats.hours?.thisMonth != null ? `${stats.hours.thisMonth}h` : "—"],
//         ["All Time", stats.hours?.allTime != null ? `${stats.hours.allTime}h` : "—"],
//         ["", ""],
//         ["ACTIVITY", ""],
//         ["Last Login", fmtTime(member.lastLogin)],
//         ["Last Logout", fmtTime(member.lastLogout)],
//       ];

//       // Sheet 3: Status Breakdown
//       const statusCounts = leads.reduce((acc, l) => {
//         const s = l.status || "Unknown";
//         acc[s] = (acc[s] || 0) + 1;
//         return acc;
//       }, {});
//       const statusData = Object.entries(statusCounts).map(([status, count]) => ({
//         Status: status,
//         Count: count,
//       }));

//       // Build workbook
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");
//       XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leadsData), "Leads");
//       XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(statusData), "Status Breakdown");

//       const fname = `${member.name.replace(/\s+/g, "_")}_Report_${new Date()
//         .toISOString()
//         .slice(0, 10)}.xlsx`;
//       XLSX.writeFile(wb, fname);
//     } catch (err) {
//       console.error("Report error:", err);
//       alert("Report generate karne me error aaya");
//     } finally {
//       setReportLoading(false);
//     }
//   };

//   // ✅ NEW: Generate team-wide report
//   const generateTeamReport = async () => {
//     setReportLoading(true);
//     try {
//       const wb = XLSX.utils.book_new();

//       // Sheet 1: Team Overview
//       const overview = team.map((m) => {
//         const s = memberStats[m._id] || {};
//         return {
//           Name: m.name,
//           Email: m.email,
//           Phone: m.phone || "—",
//           Status: m.status,
//           Online: m.isOnline ? "Yes" : "No",
//           "Total Leads": s.totalLeads || 0,
//           "Calls Done": s.callsDone || 0,
//           Pending: s.pendingCalls || 0,
//           Overdue: s.overdueCalls || 0,
//           "Fresh/Uncontacted": s.freshUncontacted || 0,
//           Admissions: s.admissions || 0,
//           Lost: s.lostLeads || 0,
//           "Conversion %": s.conversionRate || 0,
//           "Today Hours": s.hours?.today ?? 0,
//           "Week Hours": s.hours?.thisWeek ?? 0,
//           "Month Hours": s.hours?.thisMonth ?? 0,
//           "Last Login": fmtTime(m.lastLogin),
//         };
//       });
//       XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(overview), "Team Overview");

//       // Sheet 2+: One sheet per member with their leads
//       for (const m of team) {
//         try {
//           const res = await api.get("/api/v1/counselor-leads", {
//             params: { id: m._id, limit: "all" },
//           });
//           const leads = res.data.data || [];
//           if (leads.length === 0) continue;

//           const rows = leads.map((l) => ({
//             Name: l.name || "",
//             Phone: l.phone || "",
//             Course: l.course || "",
//             City: l.city || "",
//             Status: l.status || "",
//             Remarks: l.remarkCount || 0,
//             "Last Update": fmtTime(l.updatedAt),
//           }));

//           // Sheet name max 31 chars
//           const sheetName = (m.name || "Member").substring(0, 31);
//           XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), sheetName);
//         } catch (e) {
//           console.error(`Error for ${m.name}:`, e);
//         }
//       }

//       const fname = `Team_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
//       XLSX.writeFile(wb, fname);
//     } catch (err) {
//       console.error("Team report error:", err);
//       alert("Team report generate karne me error aaya");
//     } finally {
//       setReportLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
//   }

//   if (!user?.isTeamLead) {
//     return (
//       <div className="p-8 text-center">
//         <Users className="mx-auto text-gray-300 mb-3" size={40} />
//         <p className="text-gray-500 text-sm">
//           You're not currently set as a Team Lead. Ask an admin if you believe this is wrong.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-6">
//       {/* ── Header ── */}
//       <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
//         <div className="flex items-center gap-2">
//           <Users className="text-indigo-600" size={22} />
//           <h1 className="text-xl font-bold text-slate-800">My Team</h1>
//           <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
//             {team.length} member{team.length > 1 ? "s" : ""}
//           </span>
//         </div>
//         <button
//           onClick={generateTeamReport}
//           disabled={reportLoading}
//           className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold disabled:opacity-50 transition-all active:scale-95"
//         >
//           <FileSpreadsheet size={14} />
//           {reportLoading ? "Generating..." : "Team Report"}
//         </button>
//       </div>
//       <p className="text-xs text-gray-500 mb-5">
//         View-only — you can see your team's leads, but editing stays with each counselor (or admin).
//       </p>

//       {/* ── Filters Bar ── */}
//       <div className="bg-white border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search member by name, email, phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-9 pr-3 py-1.5 border rounded text-xs bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400"
//           />
//         </div>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border rounded px-2 py-1.5 text-xs bg-white outline-none"
//         >
//           <option value="">All Statuses</option>
//           <option>New</option>
//           <option>Hot Lead</option>
//           <option>Follow-up</option>
//           <option>Details Shared</option>
//           <option>Admission Done</option>
//           <option>Not Picked</option>
//           <option>Not Interested</option>
//         </select>

//         <div className="flex items-center gap-1 text-xs">
//           <CalendarDays size={12} className="text-gray-400" />
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1.5 text-xs bg-white outline-none"
//           />
//           <span className="text-gray-400">to</span>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border rounded px-2 py-1.5 text-xs bg-white outline-none"
//           />
//         </div>

//         {(searchTerm || statusFilter || fromDate || toDate) && (
//           <button
//             onClick={() => {
//               setSearchTerm("");
//               setStatusFilter("");
//               setFromDate("");
//               setToDate("");
//             }}
//             className="flex items-center gap-1 border px-2 py-1.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100"
//           >
//             <X size={11} /> Clear
//           </button>
//         )}
//       </div>

//       {team.length === 0 ? (
//         <div className="border rounded-xl p-8 text-center text-sm text-gray-400">
//           No counselors are assigned to your team yet.
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {team
//             .filter((m) => {
//               if (!searchTerm) return true;
//               const t = searchTerm.toLowerCase();
//               return (
//                 m.name?.toLowerCase().includes(t) ||
//                 m.email?.toLowerCase().includes(t) ||
//                 m.phone?.toString().includes(t)
//               );
//             })
//             .map((member) => {
//               const stats = memberStats[member._id] || {};
//               const leads = memberLeads[member._id] || [];
//               const filteredLeads = leads.filter((l) => {
//                 if (statusFilter && l.status !== statusFilter) return false;
//                 if (fromDate) {
//                   const d = new Date(l.createdAt);
//                   if (d < new Date(`${fromDate}T00:00:00+05:30`)) return false;
//                 }
//                 if (toDate) {
//                   const d = new Date(l.createdAt);
//                   if (d > new Date(`${toDate}T23:59:59.999+05:30`)) return false;
//                 }
//                 return true;
//               });

//               const totalPending =
//                 (stats.pendingCalls || 0) +
//                 (stats.overdueCalls || 0) +
//                 (stats.freshUncontacted || 0);

//               return (
//                 <div key={member._id} className="border rounded-xl overflow-hidden bg-white">
//                   {/* ── Member Header (click to expand) ── */}
//                   <div
//                     onClick={() => toggleExpand(member._id)}
//                     className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left cursor-pointer"
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <p className="font-bold text-sm text-slate-800">{member.name}</p>
//                         <span
//                           className={`w-2 h-2 rounded-full ${
//                             member.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-300"
//                           }`}
//                         />
//                         <span
//                           className={`text-[10px] font-bold ${
//                             member.isOnline ? "text-green-600" : "text-gray-400"
//                           }`}
//                         >
//                           {member.isOnline ? "Online" : "Offline"}
//                         </span>
//                         <span
//                           className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
//                             member.status === "active"
//                               ? "bg-green-50 text-green-700 border border-green-200"
//                               : "bg-gray-100 text-gray-500 border border-gray-200"
//                           }`}
//                         >
//                           {member.status}
//                         </span>
//                         {totalPending > 0 && (
//                           <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
//                             ⚠️ {totalPending} action
//                           </span>
//                         )}
//                       </div>

//                       <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
//                         <span className="flex items-center gap-1">
//                           <Mail size={11} /> {member.email}
//                         </span>
//                         {member.phone && (
//                           <span className="flex items-center gap-1">
//                             <Phone size={11} /> {member.phone}
//                           </span>
//                         )}
//                       </div>

//                       <p className="text-[10px] text-gray-400 mt-1">
//                         Last login: {fmtTime(member.lastLogin)}
//                         {member.lastLogout && ` · Last logout: ${fmtTime(member.lastLogout)}`}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           generateMemberReport(member);
//                         }}
//                         disabled={reportLoading}
//                         title="Download member report"
//                         className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 disabled:opacity-50 transition"
//                       >
//                         <Download size={11} /> Report
//                       </button>
//                       {expanded === member._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                     </div>
//                   </div>

//                   {/* ── Stats Row (always visible) ── */}
//                   {stats.totalLeads !== undefined && (
//                     <div className="px-4 pb-3 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs border-t pt-2 bg-slate-50/50">
//                       <MiniStat
//                         icon={<Clock size={11} />}
//                         label="Today"
//                         value={`${stats.hours?.today ?? 0}h`}
//                         color="blue"
//                       />
//                       <MiniStat
//                         icon={<AlertTriangle size={11} />}
//                         label="Pending"
//                         value={stats.pendingCalls || 0}
//                         color="amber"
//                       />
//                       <MiniStat
//                         icon={<Award size={11} />}
//                         label="Admissions"
//                         value={stats.admissions || 0}
//                         color="green"
//                       />
//                       <MiniStat
//                         icon={<TrendingUp size={11} />}
//                         label="Conversion"
//                         value={`${stats.conversionRate || 0}%`}
//                         color="indigo"
//                       />
//                       <MiniStat
//                         icon={<Users size={11} />}
//                         label="Total Leads"
//                         value={stats.totalLeads || 0}
//                         color="slate"
//                       />
//                     </div>
//                   )}

//                   {/* ── Expanded Detail View ── */}
//                   {expanded === member._id && (
//                     <div className="border-t bg-slate-50 p-4 space-y-4">
//                       {/* Action Required Section */}
//                       {stats.totalLeads !== undefined && (
//                         <div>
//                           <h3 className="text-[11px] font-black uppercase text-amber-700 mb-2 flex items-center gap-1">
//                             <AlertTriangle size={12} /> Action Required
//                           </h3>
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                             <ActionCard
//                               icon={<CalendarCheck size={14} />}
//                               label="Pending Calls"
//                               value={stats.pendingCalls || 0}
//                               color="amber"
//                             />
//                             <ActionCard
//                               icon={<Timer size={14} />}
//                               label="Overdue Calls"
//                               value={stats.overdueCalls || 0}
//                               color="red"
//                             />
//                             <ActionCard
//                               icon={<UserPlus size={14} />}
//                               label="Fresh / Uncontacted"
//                               value={stats.freshUncontacted || 0}
//                               color="blue"
//                             />
//                           </div>
//                         </div>
//                       )}

//                       {/* Performance Metrics */}
//                       {stats.totalLeads !== undefined && (
//                         <div>
//                           <h3 className="text-[11px] font-black uppercase text-slate-600 mb-2 flex items-center gap-1">
//                             <BarChart3 size={12} /> Performance Metrics
//                           </h3>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                             <MiniStat label="Calls Done" value={stats.callsDone || 0} color="blue" />
//                             <MiniStat label="Follow-ups" value={stats.followUps || 0} color="indigo" />
//                             <MiniStat label="Lost Leads" value={stats.lostLeads || 0} color="red" />
//                             <MiniStat
//                               label="Avg Response"
//                               value={stats.avgResponseMinutes != null ? `${stats.avgResponseMinutes}m` : "—"}
//                               color="slate"
//                             />
//                             <MiniStat
//                               label="Avg Resolution"
//                               value={stats.avgResolutionHours != null ? `${stats.avgResolutionHours}h` : "—"}
//                               color="slate"
//                             />
//                             <MiniStat label="Week Hours" value={`${stats.hours?.thisWeek ?? 0}h`} color="blue" />
//                             <MiniStat label="Month Hours" value={`${stats.hours?.thisMonth ?? 0}h`} color="blue" />
//                             <MiniStat label="All Time" value={`${stats.hours?.allTime ?? 0}h`} color="slate" />
//                           </div>
//                         </div>
//                       )}

//                       {/* Leads List */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <h3 className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1">
//                             <PhoneCall size={12} /> Leads
//                             <span className="ml-1 font-bold text-slate-400 normal-case">
//                               ({filteredLeads.length} / {leads.length})
//                             </span>
//                           </h3>
//                           <button
//                             onClick={() => generateMemberReport(member)}
//                             disabled={reportLoading}
//                             className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
//                           >
//                             <Download size={10} /> Export filtered leads
//                           </button>
//                         </div>

//                         {leadsLoading && leads.length === 0 ? (
//                           <p className="text-xs text-gray-400">Loading leads…</p>
//                         ) : filteredLeads.length === 0 ? (
//                           <p className="text-xs text-gray-400">
//                             {leads.length === 0
//                               ? "No leads assigned yet."
//                               : "No leads match the current filters."}
//                           </p>
//                         ) : (
//                           <div className="overflow-x-auto bg-white border rounded-lg">
//                             <table className="w-full text-xs">
//                               <thead className="bg-slate-50 border-b">
//                                 <tr className="text-left text-gray-500 text-[10px] uppercase font-black">
//                                   <th className="p-2">Name</th>
//                                   <th className="p-2">Phone</th>
//                                   <th className="p-2">Status</th>
//                                   <th className="p-2">City</th>
//                                   <th className="p-2">Course</th>
//                                   <th className="p-2 text-center">Remarks</th>
//                                   <th className="p-2">Last Update</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y divide-slate-100">
//                                 {filteredLeads.map((lead) => {
//                                   const ss = getStatusStyle(lead.status);
//                                   return (
//                                     <tr key={lead._id} className="hover:bg-blue-50/20">
//                                       <td className="p-2 font-bold text-slate-800">{lead.name}</td>
//                                       <td className="p-2">
//                                         <a
//                                           href={`tel:${lead.phone}`}
//                                           className="text-blue-600 hover:underline font-semibold"
//                                         >
//                                           {lead.phone}
//                                         </a>
//                                       </td>
//                                       <td className="p-2">
//                                         <span
//                                           className="px-1.5 py-0.5 rounded text-[9px] font-black border uppercase"
//                                           style={{
//                                             background: ss.bg,
//                                             color: ss.text,
//                                             borderColor: ss.border,
//                                           }}
//                                         >
//                                           {lead.status}
//                                         </span>
//                                       </td>
//                                       <td className="p-2 text-slate-600">{lead.city || "—"}</td>
//                                       <td className="p-2 text-slate-600">{lead.course || "—"}</td>
//                                       <td className="p-2 text-center">
//                                         <span className="bg-slate-100 text-slate-700 font-black text-[10px] px-1.5 py-0.5 rounded">
//                                           {lead.remarkCount || 0}
//                                         </span>
//                                       </td>
//                                       <td className="p-2 text-slate-500 text-[10px]">
//                                         {lead.updatedAtIST || fmtTime(lead.updatedAt)}
//                                       </td>
//                                     </tr>
//                                   );
//                                 })}
//                               </tbody>
//                             </table>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= SUB-COMPONENTS ================= */

// const MiniStat = ({ icon, label, value, color = "slate" }) => {
//   const colorMap = {
//     blue: "text-blue-600",
//     green: "text-green-600",
//     amber: "text-amber-600",
//     red: "text-red-600",
//     indigo: "text-indigo-600",
//     slate: "text-slate-600",
//   };
//   return (
//     <div className="flex items-center gap-1.5">
//       {icon && <span className={colorMap[color]}>{icon}</span>}
//       <span className="text-gray-500 font-semibold">{label}:</span>
//       <span className={`font-black ${colorMap[color]}`}>{value}</span>
//     </div>
//   );
// };

// const ActionCard = ({ icon, label, value, color = "amber" }) => {
//   const colorMap = {
//     amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-600" },
//     red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-600" },
//     blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-600" },
//   };
//   const c = colorMap[color] || colorMap.amber;
//   return (
//     <div className={`${c.bg} ${c.border} border rounded-lg p-2.5 flex items-center gap-2`}>
//       <div className={c.icon}>{icon}</div>
//       <div className="flex-1 min-w-0">
//         <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wide truncate">
//           {label}
//         </p>
//         <p className={`text-lg font-black ${c.text} leading-tight`}>{value}</p>
//       </div>
//     </div>
//   );
// };

"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import * as XLSX from "xlsx";
import {
  Users, Phone, Mail, ChevronDown, ChevronUp,
  Award, Clock, TrendingUp, Search, X, Download,
  AlertTriangle, Timer, CalendarCheck,
  UserPlus, PhoneCall, FileSpreadsheet,
  BarChart3, CalendarDays, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ================= HELPERS ================= */
const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const getTodayIST = () =>
  new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_COLORS = {
  "New": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Hot Lead": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Follow-up": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "Details Shared": { bg: "#FAF5FF", text: "#7E22CE", border: "#E9D5FF" },
  "Admission Done": { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
  "Not Picked": { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  "Not Interested": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
};

const getStatusStyle = (status) =>
  STATUS_COLORS[status] || { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" };

const LEADS_PER_PAGE = 40; // ✅ Har page pe 40 leads

export default function MyTeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [memberStats, setMemberStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [memberLeads, setMemberLeads] = useState({});
  const [leadsLoading, setLeadsLoading] = useState(false);

  // ✅ Pagination state — per member (object me store)
  const [leadPages, setLeadPages] = useState({}); // { memberId: pageNumber }

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (!user?.isTeamLead) {
      setLoading(false);
      return;
    }
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTeam = async () => {
    try {
      const res = await api.get("/api/v1/counselor/team/my-team");
      const members = res.data.data || [];
      setTeam(members);

      const statsEntries = await Promise.all(
        members.map(async (m) => {
          try {
            const [statsRes, hoursRes] = await Promise.all([
              api.get(`/api/v1/counselor/analytics/${m._id}`),
              api.get(`/api/v1/counselor/analytics/hours-summary/${m._id}`),
            ]);
            return [m._id, { ...statsRes.data?.data, hours: hoursRes.data?.data }];
          } catch {
            return [m._id, null];
          }
        })
      );
      setMemberStats(Object.fromEntries(statsEntries));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (memberId) => {
    if (expanded === memberId) {
      setExpanded(null);
      return;
    }
    setExpanded(memberId);

    // ✅ Page 1 pe reset karo jab expand ho
    setLeadPages((prev) => ({ ...prev, [memberId]: 1 }));

    if (!memberLeads[memberId]) {
      setLeadsLoading(true);
      try {
        const res = await api.get("/api/v1/counselor-leads", {
          params: { id: memberId, limit: "all" },
        });
        setMemberLeads((prev) => ({ ...prev, [memberId]: res.data.data || [] }));
      } catch (err) {
        console.error(err);
      } finally {
        setLeadsLoading(false);
      }
    }
  };

  // ✅ Filter change hone pe saare members ke page reset karo
  const resetAllPages = () => {
    const reset = {};
    team.forEach((m) => {
      reset[m._id] = 1;
    });
    setLeadPages(reset);
  };

  useEffect(() => {
    resetAllPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, fromDate, toDate]);

  const generateMemberReport = async (member) => {
    setReportLoading(true);
    try {
      const res = await api.get("/api/v1/counselor-leads", {
        params: {
          id: member._id,
          limit: "all",
          status: statusFilter || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        },
      });

      const leads = res.data.data || [];
      if (leads.length === 0) {
        alert("No leads found for this report");
        return;
      }

      const leadsData = leads.map((lead) => {
        const latestRemark =
          lead.historyByDate?.[0]?.entries?.[0]?.remark || lead.remark || "";
        return {
          "Lead Name": lead.name || "",
          Phone: lead.phone || lead.mobile || "",
          Email: lead.email || "",
          Course: lead.course || "",
          City: lead.city || "",
          State: lead.state || "",
          Status: lead.status || "",
          "Remark Count": lead.remarkCount || 0,
          "Latest Remark": latestRemark,
          "Next Follow-up": lead.followUpDate
            ? new Date(lead.followUpDate).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })
            : "—",
          "Created At": fmtDate(lead.createdAt),
          "Last Updated": fmtTime(lead.updatedAt),
        };
      });

      const stats = memberStats[member._id] || {};
      const summaryData = [
        ["Counselor", member.name],
        ["Email", member.email],
        ["Phone", member.phone || "—"],
        ["Status", member.status],
        ["", ""],
        ["REPORT DATE", getTodayIST()],
        ["", ""],
        ["PERFORMANCE METRICS", ""],
        ["Total Leads", stats.totalLeads || 0],
        ["Calls Done", stats.callsDone || 0],
        ["Pending Calls", stats.pendingCalls || 0],
        ["Overdue Calls", stats.overdueCalls || 0],
        ["Fresh / Uncontacted", stats.freshUncontacted || 0],
        ["Follow-ups Logged", stats.followUps || 0],
        ["Admissions", stats.admissions || 0],
        ["Lost Leads", stats.lostLeads || 0],
        ["Conversion Rate", `${stats.conversionRate || 0}%`],
        ["Avg Response Time", stats.avgResponseMinutes != null ? `${stats.avgResponseMinutes} min` : "—"],
        ["Avg Resolution Time", stats.avgResolutionHours != null ? `${stats.avgResolutionHours} hrs` : "—"],
        ["", ""],
        ["WORKING HOURS", ""],
        ["Today", stats.hours?.today != null ? `${stats.hours.today}h` : "—"],
        ["This Week", stats.hours?.thisWeek != null ? `${stats.hours.thisWeek}h` : "—"],
        ["This Month", stats.hours?.thisMonth != null ? `${stats.hours.thisMonth}h` : "—"],
        ["All Time", stats.hours?.allTime != null ? `${stats.hours.allTime}h` : "—"],
        ["", ""],
        ["ACTIVITY", ""],
        ["Last Login", fmtTime(member.lastLogin)],
        ["Last Logout", fmtTime(member.lastLogout)],
      ];

      const statusCounts = leads.reduce((acc, l) => {
        const s = l.status || "Unknown";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        Status: status,
        Count: count,
      }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leadsData), "Leads");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(statusData), "Status Breakdown");

      const fname = `${member.name.replace(/\s+/g, "_")}_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fname);
    } catch (err) {
      console.error("Report error:", err);
      alert("Report generate karne me error aaya");
    } finally {
      setReportLoading(false);
    }
  };

  const generateTeamReport = async () => {
    setReportLoading(true);
    try {
      const wb = XLSX.utils.book_new();

      const overview = team.map((m) => {
        const s = memberStats[m._id] || {};
        return {
          Name: m.name,
          Email: m.email,
          Phone: m.phone || "—",
          Status: m.status,
          Online: m.isOnline ? "Yes" : "No",
          "Total Leads": s.totalLeads || 0,
          "Calls Done": s.callsDone || 0,
          Pending: s.pendingCalls || 0,
          Overdue: s.overdueCalls || 0,
          "Fresh/Uncontacted": s.freshUncontacted || 0,
          Admissions: s.admissions || 0,
          Lost: s.lostLeads || 0,
          "Conversion %": s.conversionRate || 0,
          "Today Hours": s.hours?.today ?? 0,
          "Week Hours": s.hours?.thisWeek ?? 0,
          "Month Hours": s.hours?.thisMonth ?? 0,
          "Last Login": fmtTime(m.lastLogin),
        };
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(overview), "Team Overview");

      for (const m of team) {
        try {
          const res = await api.get("/api/v1/counselor-leads", {
            params: { id: m._id, limit: "all" },
          });
          const leads = res.data.data || [];
          if (leads.length === 0) continue;

          const rows = leads.map((l) => ({
            Name: l.name || "",
            Phone: l.phone || "",
            Course: l.course || "",
            City: l.city || "",
            Status: l.status || "",
            Remarks: l.remarkCount || 0,
            "Last Update": fmtTime(l.updatedAt),
          }));

          const sheetName = (m.name || "Member").substring(0, 31);
          XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), sheetName);
        } catch (e) {
          console.error(`Error for ${m.name}:`, e);
        }
      }

      const fname = `Team_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fname);
    } catch (err) {
      console.error("Team report error:", err);
      alert("Team report generate karne me error aaya");
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
  }

  if (!user?.isTeamLead) {
    return (
      <div className="p-8 text-center">
        <Users className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-500 text-sm">
          You're not currently set as a Team Lead. Ask an admin if you believe this is wrong.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <div className="flex items-center gap-2">
          <Users className="text-indigo-600" size={22} />
          <h1 className="text-xl font-bold text-slate-800">My Team</h1>
          <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
            {team.length} member{team.length > 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={generateTeamReport}
          disabled={reportLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold disabled:opacity-50 transition-all active:scale-95"
        >
          <FileSpreadsheet size={14} />
          {reportLoading ? "Generating..." : "Team Report"}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        View-only — you can see your team's leads, but editing stays with each counselor (or admin).
      </p>

      {/* ── Filters Bar ── */}
      <div className="bg-white border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search member by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border rounded text-xs bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1.5 text-xs bg-white outline-none"
        >
          <option value="">All Statuses</option>
          <option>New</option>
          <option>Hot Lead</option>
          <option>Follow-up</option>
          <option>Details Shared</option>
          <option>Admission Done</option>
          <option>Not Picked</option>
          <option>Not Interested</option>
        </select>

        <div className="flex items-center gap-1 text-xs">
          <CalendarDays size={12} className="text-gray-400" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-xs bg-white outline-none"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1.5 text-xs bg-white outline-none"
          />
        </div>

        {(searchTerm || statusFilter || fromDate || toDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setFromDate("");
              setToDate("");
            }}
            className="flex items-center gap-1 border px-2 py-1.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100"
          >
            <X size={11} /> Clear
          </button>
        )}
      </div>

      {team.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-sm text-gray-400">
          No counselors are assigned to your team yet.
        </div>
      ) : (
        <div className="space-y-3">
          {team
            .filter((m) => {
              if (!searchTerm) return true;
              const t = searchTerm.toLowerCase();
              return (
                m.name?.toLowerCase().includes(t) ||
                m.email?.toLowerCase().includes(t) ||
                m.phone?.toString().includes(t)
              );
            })
            .map((member) => {
              const stats = memberStats[member._id] || {};
              const leads = memberLeads[member._id] || [];

              // ✅ Filtered leads
              const filteredLeads = leads.filter((l) => {
                if (statusFilter && l.status !== statusFilter) return false;
                if (fromDate) {
                  const d = new Date(l.createdAt);
                  if (d < new Date(`${fromDate}T00:00:00+05:30`)) return false;
                }
                if (toDate) {
                  const d = new Date(l.createdAt);
                  if (d > new Date(`${toDate}T23:59:59.999+05:30`)) return false;
                }
                return true;
              });

              // ✅ Pagination calculations
              const totalPages = Math.max(1, Math.ceil(filteredLeads.length / LEADS_PER_PAGE));
              const currentPage = Math.min(leadPages[member._id] || 1, totalPages);
              const startIdx = (currentPage - 1) * LEADS_PER_PAGE;
              const endIdx = startIdx + LEADS_PER_PAGE;
              const paginatedLeads = filteredLeads.slice(startIdx, endIdx);

              const totalPending =
                (stats.pendingCalls || 0) +
                (stats.overdueCalls || 0) +
                (stats.freshUncontacted || 0);

              const setPage = (p) =>
                setLeadPages((prev) => ({ ...prev, [member._id]: p }));

              return (
                <div key={member._id} className="border rounded-xl overflow-hidden bg-white">
                  {/* ── Member Header ── */}
                  <div
                    onClick={() => toggleExpand(member._id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm text-slate-800">{member.name}</p>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            member.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-bold ${
                            member.isOnline ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {member.isOnline ? "Online" : "Offline"}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            member.status === "active"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {member.status}
                        </span>
                        {totalPending > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            ⚠️ {totalPending} action
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail size={11} /> {member.email}
                        </span>
                        {member.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={11} /> {member.phone}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-400 mt-1">
                        Last login: {fmtTime(member.lastLogin)}
                        {member.lastLogout && ` · Last logout: ${fmtTime(member.lastLogout)}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateMemberReport(member);
                        }}
                        disabled={reportLoading}
                        title="Download member report"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 disabled:opacity-50 transition"
                      >
                        <Download size={11} /> Report
                      </button>
                      {expanded === member._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* ── Stats Row ── */}
                  {stats.totalLeads !== undefined && (
                    <div className="px-4 pb-3 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs border-t pt-2 bg-slate-50/50">
                      <MiniStat
                        icon={<Clock size={11} />}
                        label="Today"
                        value={`${stats.hours?.today ?? 0}h`}
                        color="blue"
                      />
                      <MiniStat
                        icon={<AlertTriangle size={11} />}
                        label="Pending"
                        value={stats.pendingCalls || 0}
                        color="amber"
                      />
                      <MiniStat
                        icon={<Award size={11} />}
                        label="Admissions"
                        value={stats.admissions || 0}
                        color="green"
                      />
                      <MiniStat
                        icon={<TrendingUp size={11} />}
                        label="Conversion"
                        value={`${stats.conversionRate || 0}%`}
                        color="indigo"
                      />
                      <MiniStat
                        icon={<Users size={11} />}
                        label="Total Leads"
                        value={stats.totalLeads || 0}
                        color="slate"
                      />
                    </div>
                  )}

                  {/* ── Expanded Detail View ── */}
                  {expanded === member._id && (
                    <div className="border-t bg-slate-50 p-4 space-y-4">
                      {/* Action Required */}
                      {stats.totalLeads !== undefined && (
                        <div>
                          <h3 className="text-[11px] font-black uppercase text-amber-700 mb-2 flex items-center gap-1">
                            <AlertTriangle size={12} /> Action Required
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <ActionCard
                              icon={<CalendarCheck size={14} />}
                              label="Pending Calls"
                              value={stats.pendingCalls || 0}
                              color="amber"
                            />
                            <ActionCard
                              icon={<Timer size={14} />}
                              label="Overdue Calls"
                              value={stats.overdueCalls || 0}
                              color="red"
                            />
                            <ActionCard
                              icon={<UserPlus size={14} />}
                              label="Fresh / Uncontacted"
                              value={stats.freshUncontacted || 0}
                              color="blue"
                            />
                          </div>
                        </div>
                      )}

                      {/* Performance */}
                      {stats.totalLeads !== undefined && (
                        <div>
                          <h3 className="text-[11px] font-black uppercase text-slate-600 mb-2 flex items-center gap-1">
                            <BarChart3 size={12} /> Performance Metrics
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <MiniStat label="Calls Done" value={stats.callsDone || 0} color="blue" />
                            <MiniStat label="Follow-ups" value={stats.followUps || 0} color="indigo" />
                            <MiniStat label="Lost Leads" value={stats.lostLeads || 0} color="red" />
                            <MiniStat
                              label="Avg Response"
                              value={stats.avgResponseMinutes != null ? `${stats.avgResponseMinutes}m` : "—"}
                              color="slate"
                            />
                            <MiniStat
                              label="Avg Resolution"
                              value={stats.avgResolutionHours != null ? `${stats.avgResolutionHours}h` : "—"}
                              color="slate"
                            />
                            <MiniStat label="Week Hours" value={`${stats.hours?.thisWeek ?? 0}h`} color="blue" />
                            <MiniStat label="Month Hours" value={`${stats.hours?.thisMonth ?? 0}h`} color="blue" />
                            <MiniStat label="All Time" value={`${stats.hours?.allTime ?? 0}h`} color="slate" />
                          </div>
                        </div>
                      )}

                      {/* ✅ Leads List with Pagination */}
                      <div>
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <h3 className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1">
                            <PhoneCall size={12} /> Leads
                            <span className="ml-1 font-bold text-slate-400 normal-case">
                              ({filteredLeads.length} filtered / {leads.length} total)
                            </span>
                          </h3>
                          <button
                            onClick={() => generateMemberReport(member)}
                            disabled={reportLoading}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <Download size={10} /> Export filtered leads
                          </button>
                        </div>

                        {leadsLoading && leads.length === 0 ? (
                          <p className="text-xs text-gray-400">Loading leads…</p>
                        ) : filteredLeads.length === 0 ? (
                          <p className="text-xs text-gray-400">
                            {leads.length === 0
                              ? "No leads assigned yet."
                              : "No leads match the current filters."}
                          </p>
                        ) : (
                          <>
                            <div className="overflow-x-auto bg-white border rounded-lg">
                              <table className="w-full text-xs">
                                <thead className="bg-slate-50 border-b">
                                  <tr className="text-left text-gray-500 text-[10px] uppercase font-black">
                                    <th className="p-2 w-8">#</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Phone</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">City</th>
                                    <th className="p-2">Course</th>
                                    <th className="p-2 text-center">Remarks</th>
                                    <th className="p-2">Last Update</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {paginatedLeads.map((lead, idx) => {
                                    const ss = getStatusStyle(lead.status);
                                    return (
                                      <tr key={lead._id} className="hover:bg-blue-50/20">
                                        <td className="p-2 text-slate-400 font-bold">
                                          {startIdx + idx + 1}
                                        </td>
                                        <td className="p-2 font-bold text-slate-800">{lead.name}</td>
                                        <td className="p-2">
                                          <a
                                            href={`tel:${lead.phone}`}
                                            className="text-blue-600 hover:underline font-semibold"
                                          >
                                            {lead.phone}
                                          </a>
                                        </td>
                                        <td className="p-2">
                                          <span
                                            className="px-1.5 py-0.5 rounded text-[9px] font-black border uppercase"
                                            style={{
                                              background: ss.bg,
                                              color: ss.text,
                                              borderColor: ss.border,
                                            }}
                                          >
                                            {lead.status}
                                          </span>
                                        </td>
                                        <td className="p-2 text-slate-600">{lead.city || "—"}</td>
                                        <td className="p-2 text-slate-600">{lead.course || "—"}</td>
                                        <td className="p-2 text-center">
                                          <span className="bg-slate-100 text-slate-700 font-black text-[10px] px-1.5 py-0.5 rounded">
                                            {lead.remarkCount || 0}
                                          </span>
                                        </td>
                                        <td className="p-2 text-slate-500 text-[10px]">
                                          {lead.updatedAtIST || fmtTime(lead.updatedAt)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* ✅ Pagination Controls */}
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between mt-3 bg-white border rounded-lg px-3 py-2">
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  Showing {startIdx + 1}–{Math.min(endIdx, filteredLeads.length)} of{" "}
                                  {filteredLeads.length}
                                </span>

                                <div className="flex items-center gap-1">
                                  <button
                                    disabled={currentPage === 1}
                                    onClick={() => setPage(currentPage - 1)}
                                    className="p-1.5 border rounded bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                  >
                                    <ChevronLeft size={14} />
                                  </button>

                                  {/* Page numbers */}
                                  {getPageNumbers(currentPage, totalPages).map((p, i) =>
                                    p === "..." ? (
                                      <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-xs">
                                        …
                                      </span>
                                    ) : (
                                      <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`min-w-[28px] px-2 py-1 rounded text-[11px] font-bold border transition-all ${
                                          p === currentPage
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    )
                                  )}

                                  <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage(currentPage + 1)}
                                    className="p-1.5 border rounded bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                  >
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

const MiniStat = ({ icon, label, value, color = "slate" }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600",
    indigo: "text-indigo-600",
    slate: "text-slate-600",
  };
  return (
    <div className="flex items-center gap-1.5">
      {icon && <span className={colorMap[color]}>{icon}</span>}
      <span className="text-gray-500 font-semibold">{label}:</span>
      <span className={`font-black ${colorMap[color]}`}>{value}</span>
    </div>
  );
};

const ActionCard = ({ icon, label, value, color = "amber" }) => {
  const colorMap = {
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-600" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-600" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-600" },
  };
  const c = colorMap[color] || colorMap.amber;
  return (
    <div className={`${c.bg} ${c.border} border rounded-lg p-2.5 flex items-center gap-2`}>
      <div className={c.icon}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wide truncate">
          {label}
        </p>
        <p className={`text-lg font-black ${c.text} leading-tight`}>{value}</p>
      </div>
    </div>
  );
};

/* ✅ NEW: Page numbers with ellipsis — smart pagination */
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}