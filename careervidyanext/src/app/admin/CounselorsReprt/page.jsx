// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import api from "@/utlis/api.js";
// import { FaWhatsapp } from "react-icons/fa";
// import { Search, Download, Filter, Calendar, User, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
// import * as XLSX from "xlsx"; // Added for Excel Export

// const STATUS_COLORS = {
//   "New": "#3b82f6",
//   "Not Interested": "#ef4444",
//   "Details Shared": "#8b5cf6",
//   "Follow-up": "#f59e0b",
//   "Hot Lead": "#f43f5e",
//   "University Issue": "#64748b",
//   "Fee Issue": "#06b6d4",
//   "Distance Issue": "#10b981",
//   "Language Issue": "#ec4899",
//   "Not Picked": "#78350f",
//   "Admission Done": "#22c55e",
// };

// const STATUS_LIST = Object.keys(STATUS_COLORS);
// const ITEMS_PER_PAGE = 40;

// const LeadsPage = () => {
//   const [leads, setLeads] = useState([]);
//   const [counselors, setCounselors] = useState([]);
//   const [selectedCounselor, setSelectedCounselor] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     fetchLeads();
//     fetchCounselors();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterStatus, selectedCounselor, fromDate, toDate]);

//   const fetchLeads = async () => {
//     try {
//       const res = await api.get("/api/v1/leads");
//       if (res.data.success) setLeads(res.data.data);
//     } catch (err) { console.log(err); }
//   };

//   const fetchCounselors = async () => {
//     try {
//       const res = await api.get("/api/v1/counselor");
//       if (res.data.success) {
//         const activeOnly = res.data.data.filter(c => c.status === "active" || c.isActive === true);
//         setCounselors(activeOnly);
//       }
//     } catch (err) { console.log(err); }
//   };

//   // EXPORT TO EXCEL LOGIC
//   const downloadExcel = () => {
//     const dataToExport = finalTableLeads.map(l => ({
//       "Name": l.name || "N/A",
//       "Email": l.email || "N/A",
//       "Phone": l.phone || "N/A",
//       "City": l.city || "N/A",
//       "Course": l.course || "N/A",
//       "Status": l.status || "N/A",
//       "Date": l.createdAt?.slice(0, 10) || "N/A"
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
//     XLSX.writeFile(workbook, `Leads_Export_${new Date().toISOString().slice(0,10)}.xlsx`);
//   };

//   const todayStr = new Date().toISOString().slice(0, 10);
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   const yesterdayStr = yesterday.toISOString().slice(0, 10);

//   const baseCounselorLeads = useMemo(() => {
//     return leads.filter((l) => {
//       if (!selectedCounselor) return true;
//       return l.assignedTo === selectedCounselor || l.assignedTo?._id === selectedCounselor;
//     });
//   }, [leads, selectedCounselor]);

//   const assignmentStats = useMemo(() => {
//     const todayCount = baseCounselorLeads.filter(l => l.createdAt?.slice(0, 10) === todayStr).length;
//     const yesterdayCount = baseCounselorLeads.filter(l => l.createdAt?.slice(0, 10) === yesterdayStr).length;
//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 7);
//     const last7DaysCount = baseCounselorLeads.filter(l => new Date(l.createdAt) >= last7Days).length;
//     return { todayCount, yesterdayCount, last7DaysCount };
//   }, [baseCounselorLeads, todayStr, yesterdayStr]);

//   const filteredLeads = useMemo(() => {
//     return baseCounselorLeads.filter((l) => {
//       const leadDate = l.createdAt?.slice(0, 10);
//       const search = searchTerm.toLowerCase();
//       if (fromDate && leadDate < fromDate) return false;
//       if (toDate && leadDate > toDate) return false;
//       return !searchTerm || l.name?.toLowerCase().includes(search) || l.phone?.includes(search) || l.city?.toLowerCase().includes(search);
//     });
//   }, [baseCounselorLeads, fromDate, toDate, searchTerm]);

//   const finalTableLeads = useMemo(() => {
//     return filteredLeads.filter(l => !filterStatus || l.status === filterStatus);
//   }, [filteredLeads, filterStatus]);

//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return finalTableLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [finalTableLeads, currentPage]);

//   const totalPages = Math.ceil(finalTableLeads.length / ITEMS_PER_PAGE);

//   const chartData = useMemo(() => {
//     return STATUS_LIST.map(status => ({
//       name: status,
//       value: filteredLeads.filter(l => l.status === status).length,
//       fill: STATUS_COLORS[status]
//     })).filter(item => item.value > 0);
//   }, [filteredLeads]);

//   return (
//     <div className="p-4 bg-[#f8fafc] min-h-screen font-sans">
      
//       {/* FILTER BAR */}
//       <div className="bg-white border border-slate-200 p-3 rounded-lg mb-4 flex flex-wrap gap-3 items-center shadow-sm">
//         <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
//           <User size={16} className="text-blue-600" />
//           <select 
//             value={selectedCounselor} 
//             onChange={(e) => setSelectedCounselor(e.target.value)} 
//             className="bg-transparent text-xs font-bold outline-none text-blue-800"
//           >
//             <option value="">ALL COUNSELORS</option>
//             {counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//           </select>
//         </div>
//         <div className="flex items-center gap-1 border rounded px-2 bg-slate-50">
//           <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
//           <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-1.5 bg-transparent text-xs outline-none" />
//         </div>
//         <div className="flex items-center gap-1 border rounded px-2 bg-slate-50">
//           <span className="text-[10px] text-slate-400 font-bold uppercase">To</span>
//           <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-1.5 bg-transparent text-xs outline-none" />
//         </div>
//         <div className="flex-1 min-w-[150px] relative">
//           <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
//           <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-2 py-1.5 border rounded text-xs w-full outline-none focus:border-blue-400" />
//         </div>
        
//         {/* DOWNLOAD BUTTON */}
//         <button 
//           onClick={downloadExcel}
//           className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-900 transition-colors"
//         >
//           <Download size={14} /> EXCEL
//         </button>
//       </div>

//       {/* ASSIGNMENT INSIGHTS */}
//       <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
//         <div className="flex items-center gap-2 mb-4">
//           <TrendingUp size={18} className="text-blue-600" />
//           <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Assignment Insights</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
//             <div>
//               <p className="text-[10px] font-bold text-blue-400 uppercase">Yesterday Assigned</p>
//               <p className="text-2xl font-black text-blue-700">{assignmentStats.yesterdayCount}</p>
//             </div>
//             <div className="text-[10px] bg-blue-100 px-2 py-1 rounded font-bold text-blue-600">PREV DAY</div>
//           </div>
//           <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
//             <div>
//               <p className="text-[10px] font-bold text-emerald-400 uppercase">Today Assigned</p>
//               <p className="text-2xl font-black text-emerald-700">{assignmentStats.todayCount}</p>
//             </div>
//             <div className="text-[10px] bg-emerald-100 px-2 py-1 rounded font-bold text-emerald-600">REAL TIME</div>
//           </div>
//           <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-200">
//             <div>
//               <p className="text-[10px] font-bold text-slate-400 uppercase">Last 7 Days Total</p>
//               <p className="text-2xl font-black text-slate-700">{assignmentStats.last7DaysCount}</p>
//             </div>
//             <div className="text-[10px] bg-slate-200 px-2 py-1 rounded font-bold text-slate-500">WEEKLY</div>
//           </div>
//         </div>
//       </div>

//       {/* DASHBOARD AREA */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
//         <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm h-[280px]">
//           <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Status Distribution</p>
//           <ResponsiveContainer width="100%" height="90%">
//             <PieChart>
//               <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
//                 {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
//               </Pie>
//               <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
//               <Legend iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 h-fit">
//           <Stat title="Total Result" value={filteredLeads.length} onClick={() => setFilterStatus("")} active={filterStatus === ""} color="#64748b" />
//           {STATUS_LIST.map((status) => (
//             <Stat key={status} title={status} value={filteredLeads.filter(l => l.status === status).length} onClick={() => setFilterStatus(status)} active={filterStatus === status} color={STATUS_COLORS[status]} />
//           ))}
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
//         <table className="w-full text-xs text-left">
//           <thead className="bg-slate-50 border-b border-slate-200">
//             <tr className="text-slate-500 font-bold uppercase text-[10px]">
//               <th className="p-3">Date</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">City</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {paginatedLeads.length > 0 ? (
//               paginatedLeads.map((l) => (
//                 <tr key={l._id} className="hover:bg-blue-50/30 transition-colors">
//                   <td className="p-3 text-slate-500">{l.createdAt?.slice(0, 10)}</td>
//                   <td className="p-3 font-semibold text-slate-700">{l.name}</td>
//                   <td className="p-3 flex items-center gap-2">
//                     {l.phone} <a href={`https://wa.me/${l.phone}`} target="_blank" className="text-emerald-500 hover:scale-110 transition-transform"><FaWhatsapp size={14}/></a>
//                   </td>
//                   <td className="p-3">
//                     <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${STATUS_COLORS[l.status]}15`, color: STATUS_COLORS[l.status] }}>{l.status}</span>
//                   </td>
//                   <td className="p-3 text-slate-500">{l.city}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="5" className="p-10 text-center text-slate-400">No leads found.</td></tr>
//             )}
//           </tbody>
//         </table>

//         {/* PAGINATION CONTROLS */}
//         {totalPages > 1 && (
//           <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
//             <p className="text-[10px] text-slate-500 font-medium">
//               Showing <span className="font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, finalTableLeads.length)}</span> of <span className="font-bold">{finalTableLeads.length}</span> leads
//             </p>
//             <div className="flex gap-2">
//               <button 
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(prev => prev - 1)}
//                 className="p-1.5 rounded border bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
//               >
//                 <ChevronLeft size={16} className="text-slate-600" />
//               </button>
//               <div className="flex items-center gap-1">
//                 <span className="text-[10px] font-bold px-2 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
//                 <span className="text-[10px] text-slate-400 mx-1">of</span>
//                 <span className="text-[10px] font-bold px-2 py-1 bg-white border rounded text-slate-600">{totalPages}</span>
//               </div>
//               <button 
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(prev => prev + 1)}
//                 className="p-1.5 rounded border bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
//               >
//                 <ChevronRight size={16} className="text-slate-600" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const Stat = ({ title, value, onClick, active, color }) => (
//   <div onClick={onClick} className={`p-2.5 rounded border transition-all cursor-pointer ${active ? 'bg-white shadow-md ring-1 ring-slate-200' : 'bg-white shadow-sm border-slate-100'}`} style={active ? { borderLeft: `4px solid ${color}` } : { borderLeft: `3px solid ${color}` }}>
//     <p className="text-[9px] font-bold text-slate-400 uppercase truncate mb-0.5">{title}</p>
//     <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
//   </div>
// );

// export default LeadsPage;
"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";
import { FaWhatsapp } from "react-icons/fa";
import { Search, Download, User, TrendingUp, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import * as XLSX from "xlsx";

const STATUS_COLORS = {
  "New": "#3b82f6", "Not Interested": "#ef4444", "Details Shared": "#8b5cf6",
  "Follow-up": "#f59e0b", "Hot Lead": "#f43f5e", "University Issue": "#64748b",
  "Fee Issue": "#06b6d4", "Distance Issue": "#10b981", "Language Issue": "#ec4899",
  "Not Picked": "#78350f", "Admission Done": "#22c55e",
};

const STATUS_LIST = Object.keys(STATUS_COLORS);

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState([]); // Backend aggregate stats
  const [totalLeads, setTotalLeads] = useState(0);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 40;

  // FETCH DATA FROM BACKEND (Optimized)
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/leads", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerm,
          status: filterStatus,
          counselorId: selectedCounselor,
          fromDate,
          toDate
        }
      });
      if (res.data.success) {
        setLeads(res.data.data);
        setTotalLeads(res.data.total);
        setStats(res.data.stats); // Jo Aggregate backend mein likha tha
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, selectedCounselor, fromDate, toDate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) setCounselors(res.data.data);
    } catch (err) { console.log(err); }
  };

  // EXCEL DOWNLOAD (All filtered data fetch karke)
  const downloadExcel = async () => {
    try {
      // Export ke liye bina limit wala data mangwana padega ya current view ka
      const res = await api.get("/api/v1/leads", {
        params: { limit: 1000, status: filterStatus, counselorId: selectedCounselor }
      });
      const dataToExport = res.data.data.map(l => ({
        "Date": l.createdAt?.slice(0, 10),
        "Name": l.name,
        "Phone": l.phone,
        "Status": l.status,
        "Counselor": l.assignedTo?.name || "Unassigned"
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `Admin_Leads_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) { alert("Export failed"); }
  };

  const totalPages = Math.ceil(totalLeads / ITEMS_PER_PAGE);

  // Stats formatted for Chart
  const chartData = stats.map(s => ({
    name: s._id,
    value: s.count,
    fill: STATUS_COLORS[s._id] || "#cbd5e1"
  })).filter(i => i.value > 0);

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen">
      
      {/* FILTER BAR */}
      <div className="bg-white border p-3 rounded-lg mb-4 flex flex-wrap gap-3 items-center shadow-sm">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
          <User size={16} className="text-blue-600" />
          <select 
            value={selectedCounselor} 
            onChange={(e) => { setSelectedCounselor(e.target.value); setCurrentPage(1); }} 
            className="bg-transparent text-xs font-bold outline-none text-blue-800"
          >
            <option value="">ALL COUNSELORS</option>
            {counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} className="border rounded p-1.5 text-xs outline-none" title="From Date" />
        <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }} className="border rounded p-1.5 text-xs outline-none" title="To Date" />

        <div className="flex-1 min-w-[150px] relative">
          <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name, phone, city..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="pl-8 pr-2 py-1.5 border rounded text-xs w-full outline-none" 
          />
        </div>
        
        <button onClick={downloadExcel} className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold"><Download size={14} /> EXCEL</button>
        <button onClick={fetchLeads} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
      </div>

      {/* DASHBOARD AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* PIE CHART */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm h-[280px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Status Distribution</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* STAT CARDS */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 h-fit">
          <Stat 
            title="Total Results" 
            value={totalLeads} 
            onClick={() => setFilterStatus("")} 
            active={filterStatus === ""} 
            color="#64748b" 
          />
          {STATUS_LIST.map((status) => {
            const count = stats.find(s => s._id === status)?.count || 0;
            return (
              <Stat 
                key={status} 
                title={status} 
                value={count} 
                onClick={() => { setFilterStatus(status); setCurrentPage(1); }} 
                active={filterStatus === status} 
                color={STATUS_COLORS[status]} 
              />
            )
          })}
        </div>
      </div>

      {/* TABLE */}
      <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${loading ? 'opacity-50' : ''}`}>
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase text-[10px]">
              <th className="p-3">Date</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Counselor</th>
              <th className="p-3">Status</th>
              <th className="p-3">City</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length > 0 ? (
              leads.map((l) => (
                <tr key={l._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-3 text-slate-500">{l.createdAt?.slice(0, 10)}</td>
                  <td className="p-3 font-semibold text-slate-700">{l.name}</td>
                  <td className="p-3">{l.phone}</td>
                  <td className="p-3 text-blue-600 font-medium">{l.assignedTo?.name || "Not Assigned"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${STATUS_COLORS[l.status]}15`, color: STATUS_COLORS[l.status] }}>{l.status}</span>
                  </td>
                  <td className="p-3 text-slate-500">{l.city}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-10 text-center text-slate-400">No leads found in this page.</td></tr>
            )}
          </tbody>
        </table>

        {/* SERVER-SIDE PAGINATION CONTROLS */}
        <div className="p-3 border-t flex items-center justify-between bg-slate-50">
          <p className="text-[10px] text-slate-500">Total Records: <span className="font-bold">{totalLeads}</span></p>
          <div className="flex gap-2 items-center">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 border rounded disabled:opacity-30 bg-white"><ChevronLeft size={16}/></button>
            <span className="text-xs font-bold">Page {currentPage} of {totalPages || 1}</span>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1 border rounded disabled:opacity-30 bg-white"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, onClick, active, color }) => (
  <div onClick={onClick} className={`p-2.5 rounded border transition-all cursor-pointer bg-white ${active ? 'shadow-md ring-1 ring-blue-200' : 'shadow-sm border-slate-100'}`} style={{ borderLeft: `4px solid ${color}` }}>
    <p className="text-[9px] font-bold text-slate-400 uppercase truncate mb-0.5">{title}</p>
    <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
  </div>
);

export default LeadsPage;