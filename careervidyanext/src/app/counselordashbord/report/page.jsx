// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import api from "@/utlis/api.js";
// import {
//   Search, X, Save, Table as TableIcon, PieChart, Clock, Calendar,
//   CheckCircle, UserCheck, Target, BarChart3, TrendingUp, Award
// } from "lucide-react";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, BarChart, Bar, Cell
// } from "recharts";

// /* ================= HELPERS ================= */
// const formatForInput = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   const offset = date.getTimezoneOffset() * 60000;
//   const local = new Date(date.getTime() - offset);
//   return local.toISOString().slice(0, 16);
// };

// const getAvatarColor = (name) => {
//   const colors = [
//     'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 
//     'bg-violet-100 text-violet-600', 'bg-amber-100 text-amber-600', 
//     'bg-rose-100 text-rose-600', 'bg-cyan-100 text-cyan-600'
//   ];
//   const index = name ? name.charCodeAt(0) % colors.length : 0;
//   return colors[index];
// };

// /* ================= REPORT VIEW ================= */
// const LeadsReportView = ({ leads, selectedDate, stats, activeTab }) => {
//   const chartData = useMemo(() => {
//     const daily = {};
//     const statusMap = {};
    
//     leads.forEach((l) => {
//       const d = l.createdAt ? new Date(l.createdAt).toISOString().split("T")[0] : 'N/A';
//       daily[d] = (daily[d] || 0) + 1;
//       const s = l.status || "New Lead";
//       statusMap[s] = (statusMap[s] || 0) + 1;
//     });

//     const COLORS = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#a855f7", "#06b6d4"];

//     return {
//       daily: Object.keys(daily).map(k => ({ name: k, count: daily[k] })).sort((a,b) => new Date(a.name) - new Date(b.name)).slice(-10),
//       status: Object.keys(statusMap).map((k, i) => ({
//         name: k,
//         value: statusMap[k],
//         color: COLORS[i % COLORS.length]
//       }))
//     };
//   }, [leads]);

//   const isAdmissionView = activeTab === "admission";
//   const performanceReached = isAdmissionView ? stats.monthAdmissions >= 15 : stats.followUpConverted > 0;

//   // Conversion rate based on handled follow-ups
//   const conversionRate = stats.dateFollowups > 0 
//     ? Math.round((stats.followUpConverted / (stats.followUpConverted + stats.dateFollowups)) * 100) 
//     : (stats.followUpConverted > 0 ? 100 : 0);

//   const getPerformanceFeedback = () => {
//     if (stats.dateFollowups === 0 && stats.followUpConverted === 0) return { msg: "No activity recorded for this period.", color: "text-slate-500", bg: "bg-slate-50", icon: <Clock size={20}/> };
//     if (conversionRate === 100) return { msg: "Exceptional! 100% Conversion achieved. Outstanding work! 🌟", color: "text-emerald-700", bg: "bg-emerald-100", icon: <Award size={20}/> };
//     if (conversionRate >= 50) return { msg: "Strong Performance! You are maintaining a healthy conversion rate. 🚀", color: "text-blue-700", bg: "bg-blue-100", icon: <TrendingUp size={20}/> };
//     return { msg: "Performance Gap Detected. Increase engagement to meet targets! 💪", color: "text-amber-700", bg: "bg-amber-50", icon: <Target size={20}/> };
//   };

//   const feedback = getPerformanceFeedback();

//   return (
//     <div className="space-y-6 mt-4 animate-in fade-in duration-500 font-inter">
//       <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center shadow-sm transition-all ${
//         performanceReached 
//         ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
//         : "bg-amber-50 border-amber-100 text-amber-700"
//       }`}>
//         <div className="flex gap-4 mb-4 flex-wrap justify-center">
//             <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 min-w-[120px]">
//                 <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
//                   {isAdmissionView ? "Monthly Objective" : "Pending Follow-ups"}
//                 </p>
//                 <p className="text-2xl font-semibold text-slate-800">{isAdmissionView ? "15" : stats.dateFollowups}</p>
//             </div>
//             <div className={`${performanceReached ? 'bg-emerald-600' : 'bg-blue-600'} px-5 py-3 rounded-2xl shadow-lg text-white min-w-[120px]`}>
//                 <p className="text-[9px] font-semibold opacity-80 uppercase tracking-wide">
//                   {isAdmissionView ? "Achieved Admissions" : "Closed Today"}
//                 </p>
//                 <p className="text-2xl font-semibold">{isAdmissionView ? stats.monthAdmissions : stats.followUpConverted}</p>
//             </div>
//         </div>

//         <h2 className="text-xl md:text-2xl font-semibold tracking-tight max-w-2xl">
//           {performanceReached 
//             ? "Do More Admission get Reward  🚀" 
//             : "Action Required: Strategize and increase efforts to reach your admission goals. "}
//         </h2>
//       </div>

//       <div className={`p-6 rounded-3xl border border-slate-200 shadow-sm ${feedback.bg} transition-all`}>
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-4">
//             <div className={`p-4 rounded-2xl bg-white shadow-sm ${feedback.color}`}>
//               {feedback.icon}
//             </div>
//             <div>
//               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conversion Efficiency</p>
//               <h3 className={`text-2xl font-bold ${feedback.color}`}>{conversionRate}% Success Rate</h3>
//             </div>
//           </div>
//           <div className="flex-1 w-full max-w-md">
//             <div className="flex justify-between mb-2">
//               <span className="text-[10px] font-bold text-slate-500">KPI PROGRESS</span>
//               <span className={`text-[10px] font-bold ${feedback.color}`}>{stats.followUpConverted} Leads Converted</span>
//             </div>
//             <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
//               <div 
//                 className={`h-full transition-all duration-1000 ${conversionRate >= 100 ? 'bg-emerald-500' : conversionRate >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
//                 style={{ width: `${Math.min(conversionRate, 100)}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//         <p className={`mt-4 text-sm font-medium text-center md:text-left ${feedback.color}`}>
//           {feedback.msg}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
//           <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
//             <BarChart3 size={14} className="text-blue-600" /> Lead Pipeline Distribution
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData.status}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} />
//                 <YAxis fontSize={9} axisLine={false} tickLine={false} />
//                 <Tooltip cursor={{fill: '#f8fafc'}} />
//                 <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
//                   {chartData.status.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
//           <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
//             <TrendingUp size={14} className="text-emerald-600" /> Acquisition Trends
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData.daily}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis dataKey="name" fontSize={9} />
//                 <YAxis fontSize={9} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: "#2563eb", stroke: "#fff" }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================= MAIN DASHBOARD ================= */
// const LeadsPage = () => {
//   const [leads, setLeads] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [view, setView] = useState("table");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(""); 
//   const [activeTab, setActiveTab] = useState("all");

//   const statuses = [
//     "Details Shared", "Follow-up", "Hot Lead", "University Issue", 
//     "Fee Issue", "Distance Issue", "Language Issue", "Not Picked", "Admission Done"
//   ];

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) setCurrentUser(user);
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await api.get("/api/v1/leads");
//       if (res.data.success) setLeads(res.data.data);
//     } catch (err) { console.error(err); }
//   };

//   const updateLead = async (id, data) => {
//     try {
//       const res = await api.put(`/api/v1/leads/${id}`, data);
//       if (res.data.success) fetchData();
//     } catch (err) { alert("Operational Error: Failed to update lead."); }
//   };

//   const stats = useMemo(() => {
//     const myLeads = leads.filter(l => l.assignedTo === currentUser?._id || l.assignedTo?._id === currentUser?._id);
//     const targetDate = selectedDate || new Date().toISOString().split("T")[0];
//     const currentMonth = targetDate.slice(0, 7);

//     return {
//       total: myLeads.length,
//       // Only count follow-ups that are NOT admissions
//       dateFollowups: myLeads.filter(l => l.followUpDate?.startsWith(targetDate) && l.status !== "Admission Done").length,
//       dateAssigned: myLeads.filter(l => l.createdAt?.startsWith(targetDate) && l.status !== "Admission Done").length,
//       followUpConverted: myLeads.filter(l => 
//         l.followUpDate?.startsWith(targetDate) && l.status === "Admission Done"
//       ).length,
//       monthAdmissions: myLeads.filter(l => 
//         l.status === "Admission Done" && l.followUpDate?.startsWith(currentMonth)
//       ).length,
//     };
//   }, [leads, currentUser, selectedDate]);

//   const filteredLeads = useMemo(() => {
//     return leads.filter(l => {
//       const isMine = l.assignedTo === currentUser?._id || l.assignedTo?._id === currentUser?._id;
//       const matchesSearch = !searchTerm || 
//         l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         l.phone?.includes(searchTerm);
//       const matchesStatus = !filterStatus || l.status === filterStatus;

//       const targetDate = selectedDate;
//       const currentMonth = (targetDate || new Date().toISOString()).slice(0, 7);

//       if (!targetDate && activeTab === "all") return isMine && matchesSearch && matchesStatus;

//       let matchesTab = true;
      
//       // LOGIC: If status is Admission Done, it should ONLY appear in the 'admission' tab
//       if (activeTab === "followup") {
//         matchesTab = l.followUpDate?.startsWith(targetDate) && l.status !== "Admission Done";
//       }
//       else if (activeTab === "assigned") {
//         matchesTab = l.createdAt?.startsWith(targetDate) && l.status !== "Admission Done";
//       }
//       else if (activeTab === "admission") {
//         matchesTab = l.status === "Admission Done" && l.followUpDate?.startsWith(currentMonth);
//       }
//       else if (activeTab === "all") {
//         matchesTab = true; // Show all for 'all' tab if date is selected
//       }

//       return isMine && matchesSearch && matchesStatus && matchesTab;
//     });
//   }, [leads, searchTerm, filterStatus, selectedDate, activeTab, currentUser]);

//   return (
//     <div className="p-4 bg-[#fcfdfe] min-h-screen font-inter text-slate-900">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2"><Target className="text-blue-600"/> CRM Dashboard</h1>
//           <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide opacity-70">
//             {activeTab === "admission" ? "Monthly Admissions Performance" : (selectedDate ? `Data for: ${selectedDate}` : "Comprehensive Lifetime Records")}
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//             <div className="relative">
//                 <Calendar className="absolute left-3 top-2.5 text-blue-500" size={14} />
//                 <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 ring-blue-100 cursor-pointer" />
//             </div>
//             <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//                 <button onClick={() => setView("table")} className={`px-5 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${view === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><TableIcon size={14} /> Table View</button>
//                 <button onClick={() => setView("report")} className={`px-5 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${view === 'report' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><PieChart size={14} /> Analytics</button>
//             </div>
//         </div>
//       </div>

//       {/* KPI STAT CARDS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <StatCard title="Total Portfolio" value={stats.total} color="blue" icon={<UserCheck size={18}/>} 
//           onClick={() => {setActiveTab("all"); setSelectedDate("");}} active={activeTab === "all" && !selectedDate} clickable />
        
//         <StatCard title="Daily Follow-ups" value={stats.dateFollowups} color="red" icon={<Clock size={18}/>} 
//           onClick={() => {setActiveTab("followup"); if(!selectedDate) setSelectedDate(new Date().toISOString().split("T")[0])}} 
//           active={activeTab === "followup"} clickable />
        
//         <StatCard title="New Assignments" value={stats.dateAssigned} color="amber" icon={<Calendar size={18}/>} 
//           onClick={() => {setActiveTab("assigned"); if(!selectedDate) setSelectedDate(new Date().toISOString().split("T")[0])}} 
//           active={activeTab === "assigned"} clickable />
        
//         <StatCard title="Monthly Conversions" value={stats.monthAdmissions} color="green" icon={<CheckCircle size={18}/>} 
//           onClick={() => {setActiveTab("admission");}} 
//           active={activeTab === "admission"} clickable />
//       </div>

//       {/* SEARCH/FILTER */}
//       <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3 items-center mb-5">
//         <div className="relative flex-1 min-w-[250px]">
//           <Search className="absolute left-4 top-3 text-slate-400" size={16} />
//           <input type="text" placeholder="Search by name or contact..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-xs font-medium text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//         <select className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-600 outline-none min-w-[160px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//           <option value="">All Statuses</option>
//           {statuses.map(s => <option key={s} value={s}>{s}</option>)}
//         </select>
//         {(searchTerm || filterStatus || selectedDate) && (
//           <button onClick={() => {setSearchTerm(""); setFilterStatus(""); setSelectedDate(""); setActiveTab("all");}} className="text-[10px] font-medium text-red-500 px-4 py-2.5 bg-red-50 rounded-xl hover:bg-red-100 transition-all uppercase tracking-wide">Reset Filters</button>
//         )}
//       </div>

//       {/* RENDER */}
//       {view === "table" ? (
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-slate-50/50 border-b border-slate-100">
//                 <tr className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
//                   <th className="p-5">Student Information</th>
//                   <th className="p-5">Pipeline Status</th>
//                   <th className="p-5">Interaction History</th>
//                   <th className="p-5">Scheduled Follow-up</th>
//                   <th className="p-5 text-center">Update</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {filteredLeads.length > 0 ? (
//                   filteredLeads.map((l) => (
//                     <LeadRow key={l._id} lead={l} onSave={updateLead} statuses={statuses} />
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="p-10 text-center text-slate-400 text-xs font-medium">No records found for the selected criteria.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <LeadsReportView leads={filteredLeads} selectedDate={selectedDate} stats={stats} activeTab={activeTab} />
//       )}
//     </div>
//   );
// };

// /* ================= ROW COMPONENT ================= */
// const LeadRow = ({ lead, onSave, statuses }) => {
//   const [status, setStatus] = useState(lead.status);
//   const [remark, setRemark] = useState("");
//   const [date, setDate] = useState(formatForInput(lead.followUpDate));
//   const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== "Admission Done";

//   return (
//     <tr className={`hover:bg-slate-50/80 transition-all ${isOverdue ? 'bg-red-50/30' : ''}`}>
//       <td className="p-5">
//         <div className="flex items-start gap-3">
//           <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-medium text-[12px] shrink-0 shadow-sm ${getAvatarColor(lead.name)}`}>{lead.name ? lead.name[0] : "?"}</div>
//           <div className="flex flex-col gap-1">
//             <p className="text-[13px] font-medium text-slate-800 leading-tight">{lead.name}</p>
//             <p className="text-[10px] text-slate-500 font-medium">{lead.phone}</p>
//           </div>
//         </div>
//       </td>
//       <td className="p-5">
//         <select value={status} onChange={(e) => setStatus(e.target.value)} className={`text-[10px] font-medium px-3 py-2 rounded-xl border outline-none min-w-[140px] shadow-sm transition-all ${status === 'Admission Done' ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
//           {statuses.map(s => <option key={s} value={s}>{s}</option>)}
//         </select>
//       </td>
//       <td className="p-5 max-w-[220px]">
//         <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2"><p className="text-[9px] text-slate-500 font-medium italic line-clamp-1">Last Remark: {lead.remark || "None"}</p></div>
//         <input type="text" placeholder="Enter status update..." value={remark} onChange={(e) => setRemark(e.target.value)} className="w-full text-[11px] font-medium py-1.5 border-b-2 border-slate-100 outline-none bg-transparent transition-all" />
//       </td>
//       <td className="p-5">
//         <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={`text-[10px] font-medium p-2.5 rounded-xl border outline-none shadow-sm ${isOverdue ? 'text-red-600 bg-red-50' : 'bg-white'}`} />
//       </td>
//       <td className="p-5 text-center">
//         <button onClick={() => { onSave(lead._id, { status, remark, followUpDate: date }); setRemark(""); }} disabled={status === lead.status && remark === "" && date === formatForInput(lead.followUpDate)} className="p-3 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:active:scale-100"><Save size={16} /></button>
//       </td>
//     </tr>
//   );
// };

// /* ================= STAT CARD ================= */
// const StatCard = ({ title, value, color, icon, onClick, active, clickable }) => {
//   const themes = { blue: "text-blue-600 bg-blue-50 border-blue-100", red: "text-red-600 bg-red-50 border-red-100", amber: "text-amber-600 bg-amber-50 border-amber-100", green: "text-green-600 bg-green-50 border-green-100" };
//   return (
//     <div onClick={onClick} className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${clickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''} ${active ? 'ring-4 ring-blue-500/10 border-blue-500 bg-white scale-[1.02]' : 'bg-white shadow-sm border-slate-100'}`}>
//       <div className={`p-3 rounded-2xl ${themes[color]}`}>{icon}</div>
//       <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{title}</p><p className="text-xl font-semibold text-slate-800 leading-tight">{value}</p></div>
//     </div>
//   );
// };

// export default LeadsPage;


"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";

import {
  Search,
  Save,
  Table as TableIcon,
  PieChart,
  Clock,
  Calendar,
  CheckCircle,
  UserCheck,
  Target,
  BarChart3,
  TrendingUp,
  Award,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

/* ================= HELPERS ================= */

const formatForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset);
  return local.toISOString().slice(0, 16);
};

/* ================= REPORT VIEW ================= */

const LeadsReportView = ({ leads, stats }) => {
  const chartData = useMemo(() => {
    const daily = {};
    const statusMap = {};

    leads.forEach((l) => {
      const d = l.createdAt
        ? new Date(l.createdAt).toISOString().split("T")[0]
        : "N/A";

      daily[d] = (daily[d] || 0) + 1;

      const s = l.status || "New Lead";
      statusMap[s] = (statusMap[s] || 0) + 1;
    });

    const COLORS = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#a855f7", "#06b6d4"];

    return {
      daily: Object.keys(daily)
        .map((k) => ({ name: k, count: daily[k] }))
        .sort((a, b) => new Date(a.name) - new Date(b.name))
        .slice(-10),

      status: Object.keys(statusMap).map((k, i) => ({
        name: k,
        value: statusMap[k],
        color: COLORS[i % COLORS.length],
      })),
    };
  }, [leads]);

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">
          Performance Summary
        </h2>
        <p className="text-sm text-slate-600">
          Total Admissions: {stats.totalAdmissions}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 mb-4 flex gap-2 items-center">
            <BarChart3 size={14} /> Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.status}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.status.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 mb-4 flex gap-2 items-center">
            <TrendingUp size={14} /> Daily Leads
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN ================= */

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [view, setView] = useState("table");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const statuses = [
    "Details Shared",
    "Follow-up",
    "Hot Lead",
    "University Issue",
    "Fee Issue",
    "Distance Issue",
    "Language Issue",
    "Not Picked",
    "Admission Done",
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCurrentUser(user);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) setLeads(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLead = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) fetchData();
    } catch (err) {
      alert("Update failed");
    }
  };

  /* ================= STATS (Modified: Removed Month Logic) ================= */

  const stats = useMemo(() => {
    const myLeads = leads.filter(
      (l) =>
        l.assignedTo === currentUser?._id ||
        l.assignedTo?._id === currentUser?._id
    );

    const targetDate = selectedDate || new Date().toISOString().split("T")[0];

    return {
      total: myLeads.length,

      dateFollowups: myLeads.filter(
        (l) =>
          l.followUpDate?.startsWith(targetDate) &&
          l.status !== "Admission Done"
      ).length,

      dateAssigned: myLeads.filter(
        (l) =>
          l.createdAt?.startsWith(targetDate) &&
          l.status !== "Admission Done"
      ).length,

      totalAdmissions: myLeads.filter(
        (l) => l.status === "Admission Done"
      ).length,
    };
  }, [leads, currentUser, selectedDate]);

  /* ================= FILTER ================= */

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const isMine =
        l.assignedTo === currentUser?._id ||
        l.assignedTo?._id === currentUser?._id;

      const matchesSearch =
        !searchTerm ||
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.includes(searchTerm);

      const matchesStatus = !filterStatus || l.status === filterStatus;

      return isMine && matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, filterStatus, currentUser]);

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold flex gap-2 items-center">
          <Target className="text-blue-600" />
          CRM Dashboard
        </h1>

        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          />
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1 rounded ${view === "table" ? "bg-white shadow text-blue-600" : ""}`}
            >
              <TableIcon size={14} />
            </button>
            <button
              onClick={() => setView("report")}
              className={`px-3 py-1 rounded ${view === "report" ? "bg-white shadow text-blue-600" : ""}`}
            >
              <PieChart size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS (Updated: Removed Monthly Conversion Card) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={<UserCheck size={18} />}
        />
        <StatCard
          title="Daily Follow-ups"
          value={stats.dateFollowups}
          icon={<Clock size={18} />}
        />
        <StatCard
          title="New Assigned"
          value={stats.dateAssigned}
          icon={<Calendar size={18} />}
        />
        <StatCard
          title="Total Admissions"
          value={stats.totalAdmissions}
          icon={<Award size={18} />}
        />
      </div>

      {/* SEARCH */}
      <div className="bg-white p-3 rounded-xl shadow mb-5 flex gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE / REPORT */}
      {view === "table" ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="text-left">Status</th>
                <th className="text-left">Remark</th>
                <th className="text-left">Follow Up</th>
                <th className="text-left">Save</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <LeadRow key={l._id} lead={l} statuses={statuses} onSave={updateLead} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <LeadsReportView leads={filteredLeads} stats={stats} />
      )}
    </div>
  );
};

/* ================= COMPONENTS ================= */

const LeadRow = ({ lead, onSave, statuses }) => {
  const [status, setStatus] = useState(lead.status);
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState(formatForInput(lead.followUpDate));

  return (
    <tr className="border-b">
      <td className="p-3 font-medium">{lead.name}</td>
      <td>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1 text-xs"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Add remark"
          className="border rounded px-2 py-1 text-xs w-full max-w-[150px]"
        />
      </td>
      <td>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1 text-xs"
        />
      </td>
      <td>
        <button
          onClick={() => onSave(lead._id, { status, remark, followUpDate: date })}
          className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={14} />
        </button>
      </td>
    </tr>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center">
    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

export default LeadsPage;