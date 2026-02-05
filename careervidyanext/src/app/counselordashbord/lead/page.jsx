// // "use client";

// // import React, { useEffect, useState } from "react";
// // import api from "@/utlis/api.js";
// // import { GraduationCap, Search, X, Calendar } from "lucide-react";

// // /* ================= STATUS OPTIONS ================= */
// // const STATUS = ["new", "picked", "not-picked", "admission", "closed"];

// // /* ================= MAIN COMPONENT ================= */
// // const LeadsPage = () => {
// //   const [leads, setLeads] = useState([]);
  
// //   /* FILTER STATES */
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");
// //   const [filterStatus, setFilterStatus] = useState("");

// //   /* ================= LOAD LEADS ================= */
// //   useEffect(() => {
// //     fetchLeads();
// //   }, []);

// //   const fetchLeads = async () => {
// //     try {
// //       const res = await api.get("/api/v1/leads"); // calls only assigned leads
// //       if (res.data.success) setLeads(res.data.data);
// //     } catch (err) {
// //       console.log("Error loading leads", err);
// //     }
// //   };

// //   /* ================= UPDATE LEAD ================= */
// //   const updateLead = async (id, data) => {
// //     try {
// //       await api.put(`/api/v1/leads/${id}`, data);
// //       fetchLeads(); // UI refresh
// //     } catch (err) {
// //       console.log("Update error", err);
// //     }
// //   };

// //   /* ================= UNIVERSAL FILTER LOGIC ================= */
// //   const filteredLeads = leads.filter((l) => {
// //     const leadDate = l.createdAt?.slice(0, 10);
// //     const search = searchTerm.toLowerCase();

// //     // Date Range Filter
// //     if (fromDate && leadDate < fromDate) return false;
// //     if (toDate && leadDate > toDate) return false;
    
// //     // Status Filter
// //     if (filterStatus && l.status !== filterStatus) return false;

// //     // Universal Search (Name, Phone, Email, City, or Remark)
// //     const matchesSearch = 
// //       !searchTerm || 
// //       l.name?.toLowerCase().includes(search) ||
// //       l.phone?.includes(search) ||
// //       l.email?.toLowerCase().includes(search) ||
// //       l.city?.toLowerCase().includes(search) ||
// //       l.remarks?.toLowerCase().includes(search);

// //     return matchesSearch;
// //   });

// //   /* ================= COUNTS ================= */
// //   const today = new Date().toISOString().slice(0, 10);
// //   const total = leads.length;
// //   const todayLeads = leads.filter((l) => l.createdAt?.slice(0, 10) === today).length;
// //   const picked = leads.filter((l) => l.status === "picked").length;
// //   const notPicked = leads.filter((l) => l.status === "not-picked").length;
// //   const admission = leads.filter((l) => l.status === "admission").length;
// //   const closed = leads.filter((l) => l.status === "closed").length;

// //   /* ================= UI ================= */
// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
      
// //       {/* STATS CARDS */}
// //       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
// //         <Stat title="Total" value={total} color="bg-blue-500" />
// //         <Stat title="Today" value={todayLeads} color="bg-orange-500" />
// //         <Stat title="Picked" value={picked} color="bg-green-500" />
// //         <Stat title="Not Picked" value={notPicked} color="bg-red-500" />
// //         <Stat title="Admission" value={admission} color="bg-purple-500" />
// //         <Stat title="Closed" value={closed} color="bg-gray-600" />
// //       </div>

// //       {/* COMPACT FILTER BAR */}
// //       <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center gap-4">
        
// //         {/* Universal Search */}
// //         <div className="relative flex-1 min-w-[300px]">
// //           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
// //           <input 
// //             type="text" 
// //             placeholder="Search by name, phone, city, or email..." 
// //             value={searchTerm} 
// //             onChange={(e) => setSearchTerm(e.target.value)} 
// //             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
// //           />
// //         </div>

// //         {/* Date Filters */}
// //         <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border">
// //           <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-transparent p-1 text-sm outline-none" />
// //           <span className="text-gray-400">-</span>
// //           <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-transparent p-1 text-sm outline-none" />
// //         </div>

// //         {/* Status Filter */}
// //         <select 
// //           value={filterStatus} 
// //           onChange={(e) => setFilterStatus(e.target.value)} 
// //           className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
// //         >
// //           <option value="">All Status</option>
// //           {STATUS.map((s) => (<option key={s} value={s}>{s.toUpperCase()}</option>))}
// //         </select>

// //         {/* Reset Button */}
// //         <button
// //           onClick={() => { setSearchTerm(""); setFromDate(""); setToDate(""); setFilterStatus(""); }}
// //           className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
// //           title="Clear Filters"
// //         >
// //           <X size={20} />
// //         </button>
// //       </div>

// //       {/* LEADS TABLE */}
// //       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
// //         <div className="overflow-x-auto">
// //           <table className="w-full min-w-[1200px]">
// //             <thead className="bg-gray-50 border-b border-gray-100">
// //               <tr className="text-left text-gray-500 text-xs uppercase tracking-wider font-semibold">
// //                 <th className="p-4 text-center">Lead Details</th>
// //                 <th>Location</th>
// //                 <th>Course</th>
// //                 <th>Current Status</th>
// //                 <th className="w-1/4">Counselor Remark</th>
// //                 <th>Follow-up Date</th>
// //                 <th className="p-4 text-center">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-50">
// //               {filteredLeads.map((l) => (
// //                 <tr key={l._id} className="hover:bg-blue-50/30 transition-colors">
// //                   <td className="p-4">
// //                     <div className="font-medium text-gray-900">{l.name}</div>
// //                     <div className="text-xs text-gray-500">{l.phone}</div>
// //                     <div className="text-[10px] text-gray-400">{l.email}</div>
// //                   </td>
// //                   <td className="text-sm text-gray-600">{l.city || "N/A"}</td>
// //                   <td className="text-sm font-medium text-gray-700">{l.course}</td>

// //                   {/* STATUS SELECT */}
// //                   <td>
// //                     <select 
// //                       value={l.status} 
// //                       onChange={(e) => updateLead(l._id, { status: e.target.value })} 
// //                       className={`text-xs font-semibold px-2 py-1 rounded-full border ${
// //                         l.status === 'admission' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border-gray-200'
// //                       }`}
// //                     >
// //                       {STATUS.map((s) => (<option key={s} value={s}>{s}</option>))}
// //                     </select>
// //                   </td>

// //                   {/* REMARK INPUT (FIXED ERROR) */}
// //                   <td className="pr-4">
// //                     <input 
// //                       type="text" 
// //                       placeholder="Type remark & click outside..." 
// //                       defaultValue={l.remarks || ""} 
// //                       onBlur={(e) => {
// //                         if (e.target.value !== (l.remarks || "")) {
// //                           updateLead(l._id, { remarks: e.target.value });
// //                         }
// //                       }}
// //                       className="w-full text-sm bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none py-1 transition-all" 
// //                     />
// //                   </td>

// //                   {/* FOLLOW UP DATE */}
// //                   <td>
// //                     <div className="flex items-center gap-1 text-gray-600">
// //                       <Calendar size={14} className="text-gray-400" />
// //                       <input 
// //                         type="datetime-local" 
// //                         value={l.followUpDate ? new Date(l.followUpDate).toISOString().slice(0, 16) : ""} 
// //                         onChange={(e) => updateLead(l._id, { followUpDate: e.target.value })} 
// //                         className="text-xs border-none bg-transparent outline-none focus:ring-1 focus:ring-blue-300 rounded" 
// //                       />
// //                     </div>
// //                   </td>

// //                   {/* ACTIONS */}
// //                   <td className="p-4 text-center">
// //                     <button 
// //                       onClick={() => updateLead(l._id, { status: "admission" })} 
// //                       className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-all shadow-sm"
// //                       title="Mark as Admission"
// //                     >
// //                       <GraduationCap size={18} />
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* EMPTY STATE */}
// //         {filteredLeads.length === 0 && (
// //           <div className="flex flex-col items-center justify-center p-12 text-gray-400">
// //             <Search size={48} className="mb-2 opacity-20" />
// //             <p>No leads found matching your criteria</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // /* ================= STAT CARD COMPONENT ================= */
// // const Stat = ({ title, value, color }) => (
// //   <div className="bg-white shadow-sm border-l-4 rounded-lg p-4 transition-transform hover:scale-105" style={{ borderLeftColor: color }}>
// //     <p className="text-gray-500 text-xs font-bold uppercase mb-1">{title}</p>
// //     <p className="text-2xl font-black text-gray-800">{value}</p>
// //   </div>
// // );

// // export default LeadsPage;





// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api.js"; // Ensure this has baseURL: '/api/v1'
// import { GraduationCap, Search, X, Calendar, Save, MessageSquare, Mail, MapPin } from "lucide-react";
// import Reminders from "@/app/counselordashbord/components/Reminders.jsx";
// /* ================= STATUS OPTIONS ================= */
// const STATUS = ["new", "picked", "not-picked", "admission", "closed"];

// const LeadsPage = () => {
//   const [leads, setLeads] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");

//   /* ================= LOAD LEADS ================= */
//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       // route: router.get("/leads", ctrl.getLeads);
//       const res = await api.get("/api/v1/leads"); 
//       if (res.data.success) setLeads(res.data.data);
//     } catch (err) {
//       console.log("Error loading leads", err);
//     }
//   };

//   /* ================= UPDATE LEAD API ================= */
//   const updateLeadAPI = async (id, data) => {
//     try {
//       // route: router.put("/leads/:id", ctrl.updateLead);
//       const res = await api.put(`/api/v1/leads/${id}`, data);
//       if (res.data.success) {
//         // alert("Updated Successfully!");
//         fetchLeads(); // UI refresh to show new remarks
//       }
//     } catch (err) {
//       console.error("Update error:", err.response?.data || err.message);
//       alert("Failed to update data");
//     }
//   };

//   /* ================= FILTER LOGIC ================= */
//   const filteredLeads = leads.filter((l) => {
//     const leadDate = l.createdAt?.slice(0, 10);
//     const search = searchTerm.toLowerCase();
//     if (fromDate && leadDate < fromDate) return false;
//     if (toDate && leadDate > toDate) return false;
//     if (filterStatus && l.status !== filterStatus) return false;
//     return !searchTerm || 
//       l.name?.toLowerCase().includes(search) ||
//       l.phone?.includes(search) ||
//       l.email?.toLowerCase().includes(search) ||
//       l.city?.toLowerCase().includes(search) ||
//       l.remark?.toLowerCase().includes(search);
//   });

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
      
//       {/* STATS */}
//       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
//         <Stat title="Total" value={leads.length} color="#3b82f6" />
//         <Stat title="Today" value={leads.filter(l => l.createdAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length} color="#f97316" />
//         <Stat title="Picked" value={leads.filter(l => l.status === "picked").length} color="#22c55e" />
//         <Stat title="Non Picked" value={leads.filter(l => l.status === "not-picked").length} color="#ef4444" />
//         <Stat title="Admission" value={leads.filter(l => l.status === "admission").length} color="#a855f7" />
//         <Stat title="Closed" value={leads.filter(l => l.status === "closed").length} color="#6b7280" />
//       </div>

//       {/* SEARCH & FILTERS */}
//       <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center gap-4 border border-gray-100">
//         <div className="relative flex-1 min-w-[300px]">
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search by name, phone, email, city, or remark..." 
//             value={searchTerm} 
//             onChange={(e) => setSearchTerm(e.target.value)} 
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>
//         <div className="flex gap-2 items-center bg-gray-50 p-1 rounded-lg border">
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-transparent p-1 text-xs outline-none" />
//             <span className="text-gray-400">-</span>
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-transparent p-1 text-xs outline-none" />
//         </div>
//         <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded-lg text-sm bg-white outline-none">
//           <option value="">All Status</option>
//           {STATUS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
//         </select>
//         <button onClick={() => {setSearchTerm(""); setFromDate(""); setToDate(""); setFilterStatus("");}} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1300px]">
//             <thead className="bg-gray-100 border-b border-gray-200">
//               <tr className="text-left text-gray-600 text-[11px] uppercase tracking-wider font-bold">
//                 <th className="p-4">Student Info</th>
//                 <th>Location & Course</th>
//                 <th>Status</th>
//                 <th className="w-[350px]">Remark (History & New)</th>
//                 <th>Next Reminder</th>
//                 <th className="text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredLeads.map((l) => (
//                 <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {filteredLeads.length === 0 && <div className="p-10 text-center text-gray-400 italic">No matching leads found.</div>}
//       </div>
//     </div>
//   );
// };

// /* ================= ROW COMPONENT ================= */
// const LeadRow = ({ lead, onSave }) => {
//   const [localStatus, setLocalStatus] = useState(lead.status);
//   const [localRemark, setLocalRemark] = useState(lead.remark || "");
//   const [localDate, setLocalDate] = useState(lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 16) : "");

//   useEffect(() => {
//     setLocalStatus(lead.status);
//     setLocalRemark(lead.remark || "");
//     setLocalDate(lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 16) : "");
//   }, [lead]);

//   return (
//     <tr className="hover:bg-blue-50/20 transition-colors border-b">
//       <td className="p-4">
//         <div className="font-bold text-gray-800">{lead.name}</div>
//         <div className="text-[11px] text-blue-600 font-bold">{lead.phone}</div>
//         <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 italic">
//           <Mail size={10} /> {lead.email || "No Email"}
//         </div>
//       </td>
//       <td className="text-sm">
//         <div className="flex items-center gap-1 text-gray-700 font-medium">
//           <MapPin size={12} className="text-gray-400" /> {lead.city || "N/A"}
//         </div>
//         <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">{lead.course || "General"}</div>
//       </td>
//       <td>
//         <select 
//           value={localStatus} 
//           onChange={(e) => setLocalStatus(e.target.value)}
//           className={`text-[10px] font-bold p-1 border rounded uppercase outline-none ${
//             localStatus === 'admission' ? 'text-green-600 border-green-200 bg-green-50' : 
//             localStatus === 'not-picked' ? 'text-red-600 border-red-200 bg-red-50' : 
//             'bg-white'
//           }`}
//         >
//           {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
//         </select>
//       </td>

//       {/* REMARK SECTION */}
//       <td className="p-3">
//         <div className="flex flex-col gap-1.5">
//             {/* Display History */}
//             <div className="bg-gray-50 p-2 rounded border border-gray-100 text-[11px] text-gray-600 flex gap-2">
//                 <MessageSquare size={12} className="mt-0.5 text-blue-300 shrink-0" />
//                 <span className="italic">{lead.remark || "No previous history..."}</span>
//             </div>
//             {/* Input to Update */}
//             <input 
//               type="text" 
//               value={localRemark}
//               onChange={(e) => setLocalRemark(e.target.value)}
//               placeholder="Type new remark..."
//               className="w-full text-xs border border-gray-200 focus:border-blue-500 rounded p-1.5 outline-none bg-white shadow-sm"
//             />
//         </div>
//       </td>

//       <td>
//         <div className="flex items-center gap-1">
//             <Calendar size={12} className="text-blue-500" />
//             <input 
//               type="datetime-local" 
//               value={localDate}
//               onChange={(e) => setLocalDate(e.target.value)}
//               className="text-[11px] border-none bg-transparent outline-none focus:ring-0"
//             />
//         </div>
//       </td>

//       <td className="p-4 text-center">
//         <div className="flex items-center justify-center gap-2">
//             <button 
//               onClick={() => onSave(lead._id, { status: localStatus, remark: localRemark, followUpDate: localDate })}
//               className="px-3 py-1.5 bg-blue-600 text-white rounded shadow hover:bg-blue-700 flex items-center gap-1 text-[11px] font-bold transition-all"
//             >
//               <Save size={14} /> Update
//             </button>
//             <button 
//               onClick={() => onSave(lead._id, { status: "admission" })}
//               className="p-1.5 text-green-600 hover:bg-green-100 rounded-full transition-colors"
//               title="Quick Admission"
//             >
//               <GraduationCap size={20} />
//             </button>
//         </div>
//       </td>
//     </tr>
//   );
// };

// const Stat = ({ title, value, color }) => (
//   <div className="bg-white shadow-sm border-l-4 rounded-lg p-4" style={{ borderLeftColor: color }}>
//     <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{title}</p>
//     <p className="text-2xl font-black text-gray-800">{value}</p>
//   </div>
// );

// export default LeadsPage;
"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js"; 
import { GraduationCap, Search, X, Calendar, Save, MessageSquare, Mail, MapPin, Bell, XCircle } from "lucide-react";
import Reminders from "@/app/counselordashbord/components/Reminders.jsx"; // your component
const STATUS = ["new", "picked", "not-picked", "admission", "closed"];

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false); // modal visibility

  useEffect(() => {
    fetchLeads();
    fetchReminders();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads"); 
      if (res.data.success) setLeads(res.data.data);
    } catch (err) {
      console.log("Error loading leads", err);
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await api.get("/api/v1/reminders/today"); // API returning today's reminders
      if (res.data.success) setReminders(res.data.data);
    } catch (err) {
      console.log("Error fetching reminders", err);
    }
  };

  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) fetchLeads();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update data");
    }
  };

  const filteredLeads = leads.filter((l) => {
    const leadDate = l.createdAt?.slice(0, 10);
    const search = searchTerm.toLowerCase();
    if (fromDate && leadDate < fromDate) return false;
    if (toDate && leadDate > toDate) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    return !searchTerm || 
      l.name?.toLowerCase().includes(search) ||
      l.phone?.includes(search) ||
      l.email?.toLowerCase().includes(search) ||
      l.city?.toLowerCase().includes(search) ||
      l.remark?.toLowerCase().includes(search);
  });

  const hasRemindersToday = reminders.length > 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Stat title="Total" value={leads.length} color="#3b82f6" />
        <Stat title="Today" value={leads.filter(l => l.createdAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length} color="#f97316" />
        <Stat title="Picked" value={leads.filter(l => l.status === "picked").length} color="#22c55e" />
        <Stat title="Non Picked" value={leads.filter(l => l.status === "not-picked").length} color="#ef4444" />
        <Stat title="Admission" value={leads.filter(l => l.status === "admission").length} color="#a855f7" />
        <Stat title="Closed" value={leads.filter(l => l.status === "closed").length} color="#6b7280" />
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center gap-4 border border-gray-100 relative">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone, email, city, or remark..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 items-center bg-gray-50 p-1 rounded-lg border">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-transparent p-1 text-xs outline-none" />
            <span className="text-gray-400">-</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-transparent p-1 text-xs outline-none" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded-lg text-sm bg-white outline-none">
          <option value="">All Status</option>
          {STATUS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
        <button onClick={() => {setSearchTerm(""); setFromDate(""); setToDate(""); setFilterStatus("");}} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>

        {/* REMINDER BUTTON */}
        <button 
          onClick={() => setShowReminderModal(true)} 
          className={`absolute right-2 top-2 p-2 rounded-full flex items-center justify-center text-white font-bold ${
            hasRemindersToday ? "bg-red-500 animate-pulse" : "bg-gray-400"
          }`}
          title={`${reminders.length} reminder(s) today`}
        >
          <Bell size={20} />
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr className="text-left text-gray-600 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4">Student Info</th>
                <th>Location & Course</th>
                <th>Status</th>
                <th className="w-[350px]">Remark (History & New)</th>
                <th>Next Reminder</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((l) => (
                <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && <div className="p-10 text-center text-gray-400 italic">No matching leads found.</div>}
      </div>

      {/* REMINDER MODAL */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button onClick={() => setShowReminderModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <XCircle size={20}/>
            </button>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bell size={20} /> Today's Reminders
            </h2>
            {reminders.length === 0 ? (
              <p className="text-gray-500 italic">No reminders for today.</p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {reminders.map((r) => (
                  <li key={r._id} className="border p-2 rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{r.leadName || "Unknown Lead"}</p>
                      <p className="text-xs text-gray-500">{new Date(r.reminderTime).toLocaleString()}</p>
                    </div>
                    <span className="text-sm text-gray-700">{r.note || ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= ROW COMPONENT ================= */
const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState(lead.status);
  const [localRemark, setLocalRemark] = useState(lead.remark || "");
  const [localDate, setLocalDate] = useState(lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 16) : "");

  useEffect(() => {
    setLocalStatus(lead.status);
    setLocalRemark(lead.remark || "");
    setLocalDate(lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 16) : "");
  }, [lead]);

  return (
    <tr className="hover:bg-blue-50/20 transition-colors border-b">
      <td className="p-4">
        <div className="font-bold text-gray-800">{lead.name}</div>
        <div className="text-[11px] text-blue-600 font-bold">{lead.phone}</div>
        <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 italic">
          <Mail size={10} /> {lead.email || "No Email"}
        </div>
      </td>
      <td className="text-sm">
        <div className="flex items-center gap-1 text-gray-700 font-medium">
          <MapPin size={12} className="text-gray-400" /> {lead.city || "N/A"}
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">{lead.course || "General"}</div>
      </td>
      <td>
        <select 
          value={localStatus} 
          onChange={(e) => setLocalStatus(e.target.value)}
          className={`text-[10px] font-bold p-1 border rounded uppercase outline-none ${
            localStatus === 'admission' ? 'text-green-600 border-green-200 bg-green-50' : 
            localStatus === 'not-picked' ? 'text-red-600 border-red-200 bg-red-50' : 
            'bg-white'
          }`}
        >
          {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>

      <td className="p-3">
        <div className="flex flex-col gap-1.5">
            <div className="bg-gray-50 p-2 rounded border border-gray-100 text-[11px] text-gray-600 flex gap-2">
                <MessageSquare size={12} className="mt-0.5 text-blue-300 shrink-0" />
                <span className="italic">{lead.remark || "No previous history..."}</span>
            </div>
            <input 
              type="text" 
              value={localRemark}
              onChange={(e) => setLocalRemark(e.target.value)}
              placeholder="Type new remark..."
              className="w-full text-xs border border-gray-200 focus:border-blue-500 rounded p-1.5 outline-none bg-white shadow-sm"
            />
        </div>
      </td>

      <td>
        <div className="flex items-center gap-1">
            <Calendar size={12} className="text-blue-500" />
            <input 
              type="datetime-local" 
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              className="text-[11px] border-none bg-transparent outline-none focus:ring-0"
            />
        </div>
      </td>

      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => onSave(lead._id, { status: localStatus, remark: localRemark, followUpDate: localDate })}
              className="px-3 py-1.5 bg-blue-600 text-white rounded shadow hover:bg-blue-700 flex items-center gap-1 text-[11px] font-bold transition-all"
            >
              <Save size={14} /> Update
            </button>
            <button 
              onClick={() => onSave(lead._id, { status: "admission" })}
              className="p-1.5 text-green-600 hover:bg-green-100 rounded-full transition-colors"
              title="Quick Admission"
            >
              <GraduationCap size={20} />
            </button>
        </div>
      </td>
    </tr>
  );
};

const Stat = ({ title, value, color }) => (
  <div className="bg-white shadow-sm border-l-4 rounded-lg p-4" style={{ borderLeftColor: color }}>
    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{title}</p>
    <p className="text-2xl font-black text-gray-800">{value}</p>
  </div>
);

export default LeadsPage;
