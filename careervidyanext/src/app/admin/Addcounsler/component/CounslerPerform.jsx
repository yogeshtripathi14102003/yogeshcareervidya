
// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import api from "@/utlis/api.js";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// const PerformanceReport = () => {
//   const [leads, setLeads] = useState([]);
//   const [counselors, setCounselors] = useState([]);
//   const [selectedCounselor, setSelectedCounselor] = useState(null);

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const res = await api.get("/api/v1/leads");
//       if (res.data.success) {
//         setLeads(res.data.data);

//         // Extract unique counselors safely
//         const unique = [...new Map(
//           res.data.data
//             .filter(l => l.assignedTo && l.assignedTo._id) // only leads with assignedTo
//             .map(l => [l.assignedTo._id, l.assignedTo])
//         ).values()];
//         setCounselors(unique);

//         if (unique.length > 0) setSelectedCounselor(unique[0]._id);
//       }
//     } catch (err) {
//       console.error("Failed to fetch leads:", err);
//     }
//   };

//   // Leads filtered by selected counselor
//   const filteredLeads = useMemo(() => {
//     if (!selectedCounselor) return [];
//     return leads.filter(l => l.assignedTo?._id === selectedCounselor);
//   }, [leads, selectedCounselor]);

//   // Monthly stats grouped by month
//   const monthlyStats = useMemo(() => {
//     const stats = {};
//     filteredLeads.forEach(l => {
//       const date = new Date(l.createdAt);
//       const key = `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
//       if (!stats[key]) stats[key] = { total: 0 };
//       stats[key].total += 1;
//       stats[key][l.status || "New"] = (stats[key][l.status || "New"] || 0) + 1;
//     });
//     return Object.keys(stats).map(month => ({ month, ...stats[month] }));
//   }, [filteredLeads]);

//   const totalLeads = filteredLeads.length;
//   const admissions = filteredLeads.filter(l => l.status === "Admission Done").length;
//   const conversion = totalLeads ? ((admissions / totalLeads) * 100).toFixed(1) : 0;

//   return (
//     <div className="p-4 bg-slate-50 min-h-screen">
//       <h1 className="text-lg font-bold mb-4">Counselor Performance Report</h1>

//       {/* Counselor Selector */}
//       <select
//         className="border rounded px-2 py-1 mb-4 text-sm"
//         value={selectedCounselor || ""}
//         onChange={(e) => setSelectedCounselor(e.target.value)}
//       >
//         {counselors.map(c =>
//           c?._id ? <option key={c._id} value={c._id}>{c.name}</option> : null
//         )}
//       </select>

//       {/* Summary Cards */}
//       <div className="flex gap-3 mb-4 flex-wrap">
//         <div className="bg-white p-3 rounded-xl shadow border w-32 text-center">
//           <p className="text-xs text-slate-500">Total Leads</p>
//           <p className="font-bold text-lg">{totalLeads}</p>
//         </div>
//         <div className="bg-white p-3 rounded-xl shadow border w-32 text-center">
//           <p className="text-xs text-slate-500">Admissions</p>
//           <p className="font-bold text-lg">{admissions}</p>
//         </div>
//         <div className="bg-white p-3 rounded-xl shadow border w-32 text-center">
//           <p className="text-xs text-slate-500">Conversion</p>
//           <p className="font-bold text-lg">{conversion}%</p>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//         {/* Bar Chart: Leads per Status */}
//         <div className="bg-white p-3 rounded-xl shadow border h-[220px]">
//           <h3 className="text-sm font-bold mb-2">Monthly Leads Status</h3>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={monthlyStats}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" fontSize={10} />
//               <YAxis fontSize={10} />
//               <Tooltip wrapperStyle={{ fontSize: '10px' }} />
//               {["New", "Follow-up", "Admission Done"].map((status, idx) => (
//                 <Bar
//                   key={status}
//                   dataKey={status}
//                   stackId="a"
//                   fill={["#3b82f6", "#10b981", "#facc15"][idx]}
//                 />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Line Chart: Admissions Trend */}
//         <div className="bg-white p-3 rounded-xl shadow border h-[220px]">
//           <h3 className="text-sm font-bold mb-2">Admissions Trend</h3>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={monthlyStats}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" fontSize={10} />
//               <YAxis fontSize={10} />
//               <Tooltip wrapperStyle={{ fontSize: '10px' }} />
//               <Line type="monotone" dataKey="Admission Done" stroke="#facc15" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Detailed Table */}
//       <div className="bg-white p-3 rounded-xl shadow border overflow-x-auto">
//         <table className="w-full text-sm text-left min-w-[400px]">
//           <thead className="bg-slate-50">
//             <tr className="text-slate-500 text-xs">
//               <th className="p-2">Name</th>
//               <th>Status</th>
//               <th>Follow Up</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLeads.map(l => (
//               <tr key={l._id} className="hover:bg-slate-50 text-[12px]">
//                 <td className="p-2">{l.name}</td>
//                 <td>{l.status || "New"}</td>
//                 <td>{l.followUpDate ? new Date(l.followUpDate).toLocaleString() : "-"}</td>
//                 <td>{new Date(l.createdAt).toLocaleDateString()}</td>
//               </tr>
//             ))}
//             {filteredLeads.length === 0 && (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center text-slate-400 italic">No data</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PerformanceReport;


"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { Users, Calendar, Search, Award, TrendingUp } from "lucide-react";

const FinalAdmissionReport = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState(""); // University Search

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/v1/ad"); 
      if (res.data.success) setAdmissions(res.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const { finalReport, uniList, grandTotals, currentMonthName } = useMemo(() => {
    const selDateObj = new Date(selectedDate);
    const selMonth = selDateObj.getMonth();
    const selYear = selDateObj.getFullYear();
    const monthName = selDateObj.toLocaleString('default', { month: 'long' });

    // 1. Get Unique Counselors & Universities
    const allCounselors = [...new Set(admissions.map(item => item.counselorName).filter(Boolean))].sort();
    const allUnis = [...new Set(admissions.map(item => item.universityName?.toUpperCase()).filter(Boolean))].sort();

    // Filter Universities based on Search
    const filteredUnis = allUnis.filter(u => u.includes(searchTerm.toUpperCase()));

    const counselorMap = {};
    allCounselors.forEach(name => {
      counselorMap[name] = { 
        name, 
        dailyStats: {}, 
        dailyRowTotal: 0, 
        monthlyTotal: 0 
      };
      allUnis.forEach(u => counselorMap[name].dailyStats[u] = { ref: 0 });
    });

    // 2. Process Data
    admissions.forEach(item => {
      const itemDate = new Date(item.admissionDate || item.createdAt);
      const itemDateStr = itemDate.toISOString().split('T')[0];
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();
      const cName = item.counselorName;
      const uName = item.universityName?.toUpperCase();

      if (cName && counselorMap[cName]) {
        // Monthly Calculation
        if (itemMonth === selMonth && itemYear === selYear) {
          counselorMap[cName].monthlyTotal += 1;
        }

        // Daily Calculation
        if (itemDateStr === selectedDate && uName) {
          counselorMap[cName].dailyStats[uName].ref += 1;
          counselorMap[cName].dailyRowTotal += 1;
        }
      }
    });

    return { 
      finalReport: Object.values(counselorMap), 
      uniList: filteredUnis,
      currentMonthName: monthName,
      grandTotals: {
        daily: Object.values(counselorMap).reduce((s, r) => s + r.dailyRowTotal, 0),
        monthly: Object.values(counselorMap).reduce((s, r) => s + r.monthlyTotal, 0)
      }
    };
  }, [admissions, selectedDate, searchTerm]);

  if (loading) return <div className="p-20 text-center font-bold text-emerald-800 animate-pulse">Processing Report Data...</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-[100%] mx-auto bg-white shadow-2xl border border-emerald-900 overflow-hidden rounded-md">
        
        {/* CONTROL PANEL */}
        <div className="bg-[#1e3a1e] p-4 flex flex-wrap justify-between items-center gap-4 border-b border-emerald-800">
          <div className="flex items-center gap-3 text-white">
            <Award className="text-yellow-400" size={24} />
            <h1 className="text-lg font-bold uppercase tracking-tighter">
              Performance Matrix: {currentMonthName}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box for 100+ Universities */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
              <input 
                type="text"
                placeholder="Find University..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 text-xs rounded border-none outline-none w-44 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-2 border border-white/20">
              <Calendar className="text-white" size={14} />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* DATA TABLE WITH STICKY SCROLL */}
        <div className="overflow-x-auto max-h-[75vh] relative">
          <table className="w-full text-center border-collapse table-fixed min-w-max">
            <thead className="sticky top-0 z-40">
              <tr className="bg-[#dcfce7] text-emerald-900 text-[10px] font-black uppercase">
                <th className="sticky left-0 z-50 bg-[#dcfce7] border border-emerald-800 p-3 w-12">Sr.</th>
                <th className="sticky left-12 z-50 bg-[#dcfce7] border border-emerald-800 p-3 text-left w-48 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Counselor Name</th>
                
                {uniList.map(uni => (
                  <th key={uni} className="border border-emerald-800 p-2 w-28">{uni}</th>
                ))}
                
                <th className="sticky right-0 z-50 bg-emerald-100 border border-emerald-800 p-3 w-24">Daily</th>
                <th className="sticky right-24 z-50 bg-orange-500 text-white border border-emerald-800 p-3 w-28 shadow-[-2px_0_5px_rgba(0,0,0,0.1)]">Month Total</th>
              </tr>
            </thead>

            <tbody className="text-[12px] font-bold text-slate-700">
              {finalReport.map((row, index) => (
                <tr key={index} className="hover:bg-yellow-50 transition-colors border-b border-slate-200">
                  <td className="sticky left-0 z-20 bg-gray-50 border border-emerald-800 p-2">{index + 1}</td>
                  <td className="sticky left-12 z-20 bg-white border border-emerald-800 text-left px-4 font-bold text-emerald-900 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    {row.name}
                  </td>
                  
                  {uniList.map(uni => (
                    <td key={uni} className="border border-emerald-800 bg-white text-emerald-700">
                      {row.dailyStats[uni]?.ref || "-"}
                    </td>
                  ))}
                  
                  <td className="sticky right-24 z-20 bg-emerald-50 border border-emerald-800 font-black text-emerald-900 text-sm">
                    {row.dailyRowTotal}
                  </td>
                  <td className="sticky right-0 z-20 bg-orange-50 border border-emerald-800 font-black text-orange-600 text-base shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">
                    {row.monthlyTotal}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* GRAND TOTAL FOOTER */}
            <tfoot className="sticky bottom-0 z-40">
              <tr className="bg-[#1e3a1e] text-white font-black text-sm">
                <td colSpan={2} className="sticky left-0 z-50 bg-[#1e3a1e] border border-emerald-800 p-4 text-right pr-10 italic uppercase">Total Fleet Stats</td>
                
                {uniList.map(uni => (
                  <td key={uni} className="border border-emerald-800 bg-emerald-900">
                    {finalReport.reduce((s, r) => s + r.dailyStats[uni].ref, 0)}
                  </td>
                ))}
                
                <td className="sticky right-24 z-50 bg-emerald-800 border border-emerald-800 text-xl">{grandTotals.daily}</td>
                <td className="sticky right-0 z-50 bg-orange-600 border border-emerald-800 text-2xl">{grandTotals.monthly}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-[98%] mx-auto">
        <div className="bg-white p-4 border-l-4 border-emerald-600 shadow-sm rounded flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Today's Total</p><h2 className="text-2xl font-black text-emerald-800">{grandTotals.daily}</h2></div>
          <TrendingUp className="text-emerald-200" size={40} />
        </div>
        <div className="bg-white p-4 border-l-4 border-orange-500 shadow-sm rounded flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">{currentMonthName} Achievement</p><h2 className="text-2xl font-black text-orange-600">{grandTotals.monthly}</h2></div>
          <Users className="text-orange-100" size={40} />
        </div>
      </div>
    </div>
  );
};

export default FinalAdmissionReport;
