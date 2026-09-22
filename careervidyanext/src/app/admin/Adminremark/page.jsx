// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import api from "@/utlis/api.js";

// import {
//   Search,
//   RefreshCw,
//   Phone,
//   MessageSquare,
//   Users,
//   FileText,
//   CalendarDays,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";

// // ✅ UTC date ko IST mein convert karo
// const toIST = (dateStr) => {
//   if (!dateStr) return "";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
// };

// // ✅ Aaj ki IST date
// const todayIST = () => {
//   return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
// };

// const LeadsPage = () => {
//   const [leads, setLeads] = useState([]);
//   const [counselors, setCounselors] = useState([]);
//   const [selectedCounselor, setSelectedCounselor] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [selectedDate, setSelectedDate] = useState(todayIST());

//   // STATS
//   const [todayRemarkCount, setTodayRemarkCount] = useState(0);
//   const [todayCallCount, setTodayCallCount] = useState(0);
//   const [todayFollowupCount, setTodayFollowupCount] = useState(0);
//   const [todayAdmissionCount, setTodayAdmissionCount] = useState(0);
//   const [notInterestedCount, setNotInterestedCount] = useState(0); // ✅ Not Picked → Not Interested
//   const [detailsSharedCount, setDetailsSharedCount] = useState(0);

//   const fetchLeads = useCallback(async () => {
//     setLoading(true);

//     try {
//       const res = await api.get("/api/v1/leads", {
//         params: {
//           limit: 3000,
//           counselorId: selectedCounselor || undefined,
//           searchTerm: searchTerm || undefined,
//           date: selectedDate,
//         },
//       });

//       if (res.data.success) {
//         const allLeads = res.data.data || [];
//         setLeads(allLeads);

//         setTodayCallCount(allLeads.length);

//         setTodayRemarkCount(
//           allLeads.filter((l) => l.remark && l.remark.trim() !== "").length
//         );

//         setTodayFollowupCount(
//           allLeads.filter((l) => l.status === "Follow-up").length
//         );

//         setTodayAdmissionCount(
//           allLeads.filter((l) => l.status === "Admission Done").length
//         );

//         // ✅ "Not Picked" → "Not Interested"
//         setNotInterestedCount(
//           allLeads.filter((l) => l.status === "Not Interested").length
//         );

//         setDetailsSharedCount(
//           allLeads.filter((l) => l.status === "Details Shared").length
//         );
//       }
//     } catch (err) {
//       console.error("Leads fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedCounselor, searchTerm, selectedDate]);

//   const fetchCounselors = async () => {
//     try {
//       const res = await api.get("/api/v1/counselor");
//       if (res.data.success) {
//         const activeOnly = res.data.data.filter(
//           (c) => c.status === "active" || c.isActive === true
//         );
//         setCounselors(activeOnly);
//       }
//     } catch (err) {
//       console.error("Counselors fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, [fetchLeads]);

//   useEffect(() => {
//     fetchCounselors();
//   }, []);

//   const filteredLeads = leads.filter((l) => {
//     if (!searchTerm) return true;
//     return (
//       l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       l.phone?.includes(searchTerm)
//     );
//   });

//   const selectedCounselorName = selectedCounselor
//     ? counselors.find((c) => c._id === selectedCounselor)?.name || "Counselor"
//     : "All Counselors";

//   return (
//     <div className="min-h-screen bg-slate-100 p-4">

//       {/* HEADER */}
//       <div className="mb-5">
//         <h1 className="text-2xl font-black text-slate-800">Leads Dashboard</h1>
//         <p className="text-sm text-slate-500 mt-1">
//           Showing data for{" "}
//           <span className="font-semibold text-blue-600">{selectedCounselorName}</span>{" "}
//           on{" "}
//           <span className="font-semibold text-blue-600">{selectedDate}</span>
//         </p>
//       </div>

//       {/* FILTER BAR */}
//       <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-center">

//         <select
//           value={selectedCounselor}
//           onChange={(e) => setSelectedCounselor(e.target.value)}
//           className="border rounded-lg px-3 py-2 text-sm outline-none bg-white"
//         >
//           <option value="">All Counselors</option>
//           {counselors.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <div className="relative flex-1 min-w-[250px]">
//           <Search size={16} className="absolute left-3 top-3 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search student name or phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm outline-none"
//           />
//         </div>

//         <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
//           <CalendarDays size={16} className="text-slate-500" />
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="outline-none text-sm"
//           />
//         </div>

//         <button
//           onClick={() => setSelectedDate(todayIST())}
//           className="border border-blue-300 text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
//         >
//           Today
//         </button>

//         <button
//           onClick={fetchLeads}
//           className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
//         >
//           <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
//         </button>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">

//         <div className="bg-white rounded-xl p-4 border shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-xs font-bold text-slate-500 uppercase">Total Calls</p>
//             <Phone size={18} className="text-blue-600" />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">{todayCallCount}</h2>
//         </div>

//         <div className="bg-white rounded-xl p-4 border shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-xs font-bold text-slate-500 uppercase">Follow-up</p>
//             <MessageSquare size={18} className="text-orange-500" />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">{todayFollowupCount}</h2>
//         </div>

//         <div className="bg-white rounded-xl p-4 border shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-xs font-bold text-slate-500 uppercase">Remark Updated</p>
//             <FileText size={18} className="text-emerald-600" />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">{todayRemarkCount}</h2>
//         </div>

//         <div className="bg-white rounded-xl p-4 border shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-xs font-bold text-slate-500 uppercase">Admission</p>
//             <Users size={18} className="text-pink-600" />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">{todayAdmissionCount}</h2>
//         </div>

//         {/* ✅ Not Picked → Not Interested */}
//         <div className="bg-white rounded-xl p-4 border shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-xs font-bold text-slate-500 uppercase">Not Interested</p>
//             <XCircle size={18} className="text-red-500" />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">{notInterestedCount}</h2>
//         </div>

//         <div className="bg-white rounded-xl p-4 border shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-xs font-bold text-slate-500 uppercase">Details Shared</p>
//             <CheckCircle size={18} className="text-green-600" />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">{detailsSharedCount}</h2>
//         </div>

//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

//         <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
//           <div>
//             <h2 className="font-bold text-slate-700">{selectedCounselorName}</h2>
//             <p className="text-xs text-slate-400 mt-0.5">{selectedDate}</p>
//           </div>
//           <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
//             {filteredLeads.length} leads
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-slate-50 border-b">
//               <tr className="text-left text-slate-500">
//                 <th className="p-4">#</th>
//                 <th className="p-4">Student</th>
//                 <th className="p-4">Phone</th>
//                 <th className="p-4">Counselor</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4">Remark</th>
//                 <th className="p-4">Updated (IST)</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="7" className="text-center p-10 text-slate-400">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredLeads.length > 0 ? (
//                 filteredLeads.map((l, index) => (
//                   <tr key={l._id} className="border-b hover:bg-slate-50 transition">

//                     <td className="p-4 text-slate-400 text-xs">{index + 1}</td>
//                     <td className="p-4 font-semibold text-slate-700">{l.name}</td>
//                     <td className="p-4 text-slate-600">{l.phone}</td>
//                     <td className="p-4 text-slate-600">
//                       {l.assignedTo?.name || "Unassigned"}
//                     </td>

//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           l.status === "Admission Done"
//                             ? "bg-green-100 text-green-700"
//                             : l.status === "Follow-up"
//                             ? "bg-orange-100 text-orange-700"
//                             : l.status === "Not Interested"  // ✅ Not Picked → Not Interested
//                             ? "bg-red-100 text-red-700"
//                             : l.status === "Details Shared"
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-slate-100 text-slate-600"
//                         }`}
//                       >
//                         {l.status}
//                       </span>
//                     </td>

//                     <td className="p-4 max-w-[300px] text-slate-600">
//                       {l.remark || (
//                         <span className="text-slate-300 italic">No remark</span>
//                       )}
//                     </td>

//                     <td className="p-4 text-slate-500 text-xs">
//                       {l.updatedAt
//                         ? new Date(l.updatedAt).toLocaleString("en-IN", {
//                             timeZone: "Asia/Kolkata",
//                             day: "2-digit",
//                             month: "short",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })
//                         : "—"}
//                     </td>

//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center p-10">
//                     <div className="text-slate-400 text-sm">
//                       {selectedDate === todayIST()
//                         ? "Aaj abhi tak koi lead update nahi hui"
//                         : `${selectedDate} ko koi lead update nahi mili`}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadsPage;

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import {
  Search, RefreshCw, Phone, MessageSquare, Users,
  FileText, CalendarDays, CheckCircle, XCircle,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  TrendingUp, Award, Clock, Download, AlertTriangle,
  UserPlus, Timer, BarChart3
} from "lucide-react";

/* ================= HELPERS ================= */
const todayIST = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

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

const fmtTimeShort = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

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

const LEADS_PER_PAGE = 20; // Per counselor

/* ================= MAIN ================= */
const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(todayIST());

  // ✅ Expanded counselor state
  const [expandedCounselor, setExpandedCounselor] = useState(null);
  const [counselorPages, setCounselorPages] = useState({}); // { counselorId: page }

  /* ================= FETCH ================= */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/leads", {
        params: {
          limit: 5000,
          counselorId: selectedCounselor || undefined,
          date: selectedDate,
        },
      });

      if (res.data.success) {
        setLeads(res.data.data || []);
      }
    } catch (err) {
      console.error("Leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCounselor, selectedDate]);

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        const activeOnly = res.data.data.filter(
          (c) => c.status === "active" || c.isActive === true
        );
        setCounselors(activeOnly);
      }
    } catch (err) {
      console.error("Counselors fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  /* ================= GROUP BY COUNSELOR ================= */
  const counselorGroups = useMemo(() => {
    // Filter by search
    const filtered = leads.filter((l) => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return (
        l.name?.toLowerCase().includes(t) ||
        l.phone?.includes(t)
      );
    });

    // Group by counselor
    const groups = {};
    filtered.forEach((lead) => {
      const cid = lead.assignedTo?._id || "unassigned";
      if (!groups[cid]) {
        groups[cid] = {
          counselorId: cid,
          counselorName: lead.assignedTo?.name || "Unassigned",
          counselorEmail: lead.assignedTo?.email || "",
          leads: [],
        };
      }
      groups[cid].leads.push(lead);
    });

    // Convert to array + compute stats
    return Object.values(groups).map((g) => {
      const leadsList = g.leads;
      const remarkCount = leadsList.reduce(
        (sum, l) => sum + (l.remarkCount || (l.followUpHistory?.length || 0)),
        0
      );
      const statusCounts = leadsList.reduce((acc, l) => {
        const s = l.status || "Unknown";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});

      return {
        ...g,
        totalLeads: leadsList.length,
        remarkCount,
        statusCounts,
        admissions: statusCounts["Admission Done"] || 0,
        notInterested: statusCounts["Not Interested"] || 0,
        followUps: statusCounts["Follow-up"] || 0,
        detailsShared: statusCounts["Details Shared"] || 0,
        hotLeads: statusCounts["Hot Lead"] || 0,
        lastActivity: leadsList.reduce((latest, l) => {
          const d = new Date(l.updatedAt);
          return !latest || d > latest ? d : latest;
        }, null),
      };
    }).sort((a, b) => b.totalLeads - a.totalLeads);
  }, [leads, searchTerm]);

  /* ================= OVERALL STATS ================= */
  const overallStats = useMemo(() => {
    return {
      activeCounselors: counselorGroups.filter((g) => g.counselorId !== "unassigned").length,
      totalActions: leads.length,
      totalRemarks: leads.reduce(
        (sum, l) => sum + (l.remarkCount || (l.followUpHistory?.length || 0)),
        0
      ),
      totalAdmissions: leads.filter((l) => l.status === "Admission Done").length,
      totalFollowUps: leads.filter((l) => l.status === "Follow-up").length,
      totalNotInterested: leads.filter((l) => l.status === "Not Interested").length,
      totalDetailsShared: leads.filter((l) => l.status === "Details Shared").length,
    };
  }, [leads, counselorGroups]);

  /* ================= EXPORT REPORT ================= */
  const exportReport = async () => {
    setReportLoading(true);
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Counselor Overview
      const overview = counselorGroups.map((g) => ({
        Counselor: g.counselorName,
        Email: g.counselorEmail,
        "Total Leads": g.totalLeads,
        "Remark Count": g.remarkCount,
        Admissions: g.admissions,
        "Follow-ups": g.followUps,
        "Hot Leads": g.hotLeads,
        "Details Shared": g.detailsShared,
        "Not Interested": g.notInterested,
        "Last Activity": fmtTime(g.lastActivity),
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(overview), "Counselor Overview");

      // Sheet 2: All Leads (with counselor column)
      const allLeads = leads.map((l) => ({
        Counselor: l.assignedTo?.name || "Unassigned",
        "Lead Name": l.name || "",
        Phone: l.phone || "",
        Email: l.email || "",
        Course: l.course || "",
        City: l.city || "",
        Status: l.status || "",
        "Remark Count": l.remarkCount || 0,
        "Latest Remark": l.historyByDate?.[0]?.entries?.[0]?.remark || l.remark || "",
        "Updated At": fmtTime(l.updatedAt),
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(allLeads), "All Leads");

      // Sheet 3: Status Breakdown
      const statusCounts = leads.reduce((acc, l) => {
        const s = l.status || "Unknown";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        Status: status,
        Count: count,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(statusData), "Status Breakdown");

      const fname = `Admin_Report_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fname);
    } catch (err) {
      console.error("Report error:", err);
      alert("Report generate karne me error aaya");
    } finally {
      setReportLoading(false);
    }
  };

  /* ================= EXPORT SINGLE COUNSELOR ================= */
  const exportCounselorReport = (group) => {
    try {
      const wb = XLSX.utils.book_new();

      const summary = [
        ["Counselor", group.counselorName],
        ["Email", group.counselorEmail],
        ["", ""],
        ["DATE", selectedDate],
        ["", ""],
        ["Total Leads", group.totalLeads],
        ["Remark Count", group.remarkCount],
        ["Admissions", group.admissions],
        ["Follow-ups", group.followUps],
        ["Hot Leads", group.hotLeads],
        ["Details Shared", group.detailsShared],
        ["Not Interested", group.notInterested],
        ["Last Activity", fmtTime(group.lastActivity)],
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

      const leadsData = group.leads.map((l) => ({
        "Lead Name": l.name || "",
        Phone: l.phone || "",
        Email: l.email || "",
        Course: l.course || "",
        City: l.city || "",
        Status: l.status || "",
        "Remark Count": l.remarkCount || 0,
        "Latest Remark": l.historyByDate?.[0]?.entries?.[0]?.remark || l.remark || "",
        "Updated At": fmtTime(l.updatedAt),
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leadsData), "Leads");

      const fname = `${group.counselorName.replace(/\s+/g, "_")}_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fname);
    } catch (err) {
      console.error("Report error:", err);
      alert("Report generate karne me error aaya");
    }
  };

  /* ================= TOGGLE EXPAND ================= */
  const toggleExpand = (counselorId) => {
    if (expandedCounselor === counselorId) {
      setExpandedCounselor(null);
      return;
    }
    setExpandedCounselor(counselorId);
    setCounselorPages((prev) => ({ ...prev, [counselorId]: 1 }));
  };

  /* ================= RESET PAGES ON FILTER ================= */
  useEffect(() => {
    const reset = {};
    counselorGroups.forEach((g) => {
      reset[g.counselorId] = 1;
    });
    setCounselorPages(reset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedDate, selectedCounselor]);

  const selectedCounselorName = selectedCounselor
    ? counselors.find((c) => c._id === selectedCounselor)?.name || "Counselor"
    : "All Counselors";

  return (
    <div className="min-h-screen bg-slate-100 p-4">

      {/* ── HEADER ── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">📊 Admin — Activity Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-semibold text-blue-600">{selectedCounselorName}</span> ·{" "}
            <span className="font-semibold text-blue-600">{selectedDate}</span>
          </p>
        </div>
        <button
          onClick={exportReport}
          disabled={reportLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-all active:scale-95"
        >
          <Download size={16} />
          {reportLoading ? "Generating..." : "Export Full Report"}
        </button>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-center">
        <select
          value={selectedCounselor}
          onChange={(e) => setSelectedCounselor(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none bg-white"
        >
          <option value="">All Counselors</option>
          {counselors.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search lead name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
          <CalendarDays size={16} className="text-slate-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-sm"
          />
        </div>

        <button
          onClick={() => setSelectedDate(todayIST())}
          className="border border-blue-300 text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
        >
          Today
        </button>

        <button
          onClick={fetchLeads}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── OVERALL STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
        <StatCard
          icon={<Users size={16} />}
          label="Active Counselors"
          value={overallStats.activeCounselors}
          color="indigo"
        />
        <StatCard
          icon={<TrendingUp size={16} />}
          label="Total Actions"
          value={overallStats.totalActions}
          color="blue"
        />
        <StatCard
          icon={<FileText size={16} />}
          label="Remarks Updated"
          value={overallStats.totalRemarks}
          color="emerald"
        />
        <StatCard
          icon={<Award size={16} />}
          label="Admissions"
          value={overallStats.totalAdmissions}
          color="pink"
        />
        <StatCard
          icon={<MessageSquare size={16} />}
          label="Follow-ups"
          value={overallStats.totalFollowUps}
          color="orange"
        />
        <StatCard
          icon={<CheckCircle size={16} />}
          label="Details Shared"
          value={overallStats.totalDetailsShared}
          color="green"
        />
        <StatCard
          icon={<XCircle size={16} />}
          label="Not Interested"
          value={overallStats.totalNotInterested}
          color="red"
        />
      </div>

      {/* ── COUNSELOR ACTIVITY LIST ── */}
      {loading ? (
        <div className="bg-white rounded-xl border p-16 text-center">
          <RefreshCw size={28} className="animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400 uppercase">Loading activity...</p>
        </div>
      ) : counselorGroups.length === 0 ? (
        <div className="bg-white rounded-xl border p-16 text-center">
          <AlertTriangle size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">
            {selectedDate === todayIST()
              ? "Aaj abhi tak koi activity nahi hui"
              : `${selectedDate} ko koi activity nahi mili`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {counselorGroups.map((group) => {
            const isExpanded = expandedCounselor === group.counselorId;
            const currentPage = counselorPages[group.counselorId] || 1;
            const totalPages = Math.max(1, Math.ceil(group.leads.length / LEADS_PER_PAGE));
            const startIdx = (currentPage - 1) * LEADS_PER_PAGE;
            const endIdx = startIdx + LEADS_PER_PAGE;
            const paginatedLeads = group.leads.slice(startIdx, endIdx);

            const setPage = (p) =>
              setCounselorPages((prev) => ({ ...prev, [group.counselorId]: p }));

            return (
              <div key={group.counselorId} className="bg-white border rounded-xl overflow-hidden">

                {/* ── Counselor Header ── */}
                <div
                  onClick={() => toggleExpand(group.counselorId)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-slate-800">
                        {group.counselorName}
                      </p>
                      <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {group.totalLeads} leads
                      </span>
                      {group.remarkCount > 0 && (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          📝 {group.remarkCount} remarks
                        </span>
                      )}
                      {group.admissions > 0 && (
                        <span className="text-[10px] font-black bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                          🏆 {group.admissions} admissions
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5 flex-wrap">
                      {group.counselorEmail && (
                        <span>📧 {group.counselorEmail}</span>
                      )}
                      <span>⏱️ Last: {fmtTimeShort(group.lastActivity)}</span>
                    </div>

                    {/* Mini status pills */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {group.followUps > 0 && (
                        <StatusPill label="Follow-up" count={group.followUps} color="orange" />
                      )}
                      {group.hotLeads > 0 && (
                        <StatusPill label="Hot" count={group.hotLeads} color="pink" />
                      )}
                      {group.detailsShared > 0 && (
                        <StatusPill label="Details" count={group.detailsShared} color="blue" />
                      )}
                      {group.notInterested > 0 && (
                        <StatusPill label="Not Int." count={group.notInterested} color="red" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportCounselorReport(group);
                      }}
                      title="Export this counselor's report"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Download size={11} /> Report
                    </button>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* ── Expanded Detail ── */}
                {isExpanded && (
                  <div className="border-t bg-slate-50 p-4 space-y-3">

                    {/* Leads Table */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1">
                          <Phone size={12} /> Leads Activity
                          <span className="ml-1 font-bold text-slate-400 normal-case">
                            ({group.leads.length} total)
                          </span>
                        </h3>
                      </div>

                      <div className="overflow-x-auto bg-white border rounded-lg">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50 border-b">
                            <tr className="text-left text-gray-500 text-[10px] uppercase font-black">
                              <th className="p-2 w-8">#</th>
                              <th className="p-2">Lead Name</th>
                              <th className="p-2">Phone</th>
                              <th className="p-2">Course</th>
                              <th className="p-2">City</th>
                              <th className="p-2">Status</th>
                              <th className="p-2 text-center">Remarks</th>
                              <th className="p-2">Latest Remark</th>
                              <th className="p-2">Updated</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedLeads.map((lead, idx) => {
                              const ss = getStatusStyle(lead.status);
                              const latestRemark =
                                lead.historyByDate?.[0]?.entries?.[0]?.remark ||
                                lead.remark ||
                                "";
                              const remarkCount =
                                lead.remarkCount ?? (lead.followUpHistory?.length || 0);

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
                                  <td className="p-2 text-slate-600">{lead.course || "—"}</td>
                                  <td className="p-2 text-slate-600">{lead.city || "—"}</td>
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
                                  <td className="p-2 text-center">
                                    <span
                                      className={`font-black text-[10px] px-1.5 py-0.5 rounded ${
                                        remarkCount > 0
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-slate-100 text-slate-400"
                                      }`}
                                    >
                                      {remarkCount}
                                    </span>
                                  </td>
                                  <td className="p-2 max-w-[240px]">
                                    <p className="text-[10px] text-slate-600 truncate">
                                      {latestRemark || <span className="italic text-slate-300">No remark</span>}
                                    </p>
                                  </td>
                                  <td className="p-2 text-slate-500 text-[10px] whitespace-nowrap">
                                    {fmtTimeShort(lead.updatedAt)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-3 bg-white border rounded-lg px-3 py-2">
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Showing {startIdx + 1}–{Math.min(endIdx, group.leads.length)} of{" "}
                            {group.leads.length}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              disabled={currentPage === 1}
                              onClick={() => setPage(currentPage - 1)}
                              className="p-1.5 border rounded bg-white disabled:opacity-30 hover:bg-slate-50"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            {getPageNumbers(currentPage, totalPages).map((p, i) =>
                              p === "..." ? (
                                <span key={`e-${i}`} className="px-1 text-slate-400 text-xs">
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
                              className="p-1.5 border rounded bg-white disabled:opacity-30 hover:bg-slate-50"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
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
};

/* ================= SUB-COMPONENTS ================= */

const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50",
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    pink: "text-pink-600 bg-pink-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
  };
  return (
    <div className="bg-white rounded-xl p-3 border shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
      <h2 className="text-2xl font-black text-slate-800">{value}</h2>
    </div>
  );
};

const StatusPill = ({ label, count, color = "blue" }) => {
  const colorMap = {
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span className={`text-[9px] font-black border px-1.5 py-0.5 rounded-full ${colorMap[color]}`}>
      {label}: {count}
    </span>
  );
};

/* Smart pagination — 1 2 3 … 10 */
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

export default AdminLeadsPage;