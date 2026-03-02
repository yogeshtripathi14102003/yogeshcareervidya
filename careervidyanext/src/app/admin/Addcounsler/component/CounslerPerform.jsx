
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

import {
  Users,
  Calendar,
  Search,
  Award,
  TrendingUp,
  Download,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FinalAdmissionReport = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/v1/ad");

      if (res.data.success) {
        setAdmissions(res.data.data);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= REPORT =================
  const {
    finalReport,
    uniList,
    grandTotals,
    currentMonthName,
  } = useMemo(() => {
    const selDateObj = new Date(selectedDate);

    const selMonth = selDateObj.getMonth();
    const selYear = selDateObj.getFullYear();

    const monthName = selDateObj.toLocaleString("default", {
      month: "long",
    });

    // -------- Counselors --------
    const allCounselors = [
      ...new Set(admissions.map((i) => i.counselorName).filter(Boolean)),
    ].sort();

    // -------- Universities (Date Wise) --------
    const dateWiseUnis = new Set();

    admissions.forEach((item) => {
      const itemDate = new Date(
        item.admissionDate || item.createdAt
      )
        .toISOString()
        .split("T")[0];

      if (itemDate === selectedDate && item.universityName) {
        dateWiseUnis.add(item.universityName.toUpperCase());
      }
    });

    let allUnis = [...dateWiseUnis].sort();

    // -------- Search Filter --------
    if (searchTerm) {
      allUnis = allUnis.filter((u) =>
        u.includes(searchTerm.toUpperCase())
      );
    }

    // -------- Maps --------
    const counselorMap = {};
    const counselorUniversities = {};

    allCounselors.forEach((name) => {
      counselorMap[name] = {
        name,
        dailyStats: {},
        dailyRowTotal: 0,
        monthlyTotal: 0,
      };

      counselorUniversities[name] = new Set();

      allUnis.forEach((u) => {
        counselorMap[name].dailyStats[u] = { ref: 0 };
      });
    });

    // -------- Process Data --------
    admissions.forEach((item) => {
      const dateObj = new Date(
        item.admissionDate || item.createdAt
      );

      const itemDate = dateObj.toISOString().split("T")[0];

      const itemMonth = dateObj.getMonth();
      const itemYear = dateObj.getFullYear();

      const counselor = item.counselorName;
      const uni = item.universityName?.toUpperCase();

      if (!counselor || !uni) return;
      if (!counselorMap[counselor]) return;

      // Save University
      counselorUniversities[counselor].add(uni);

      // Monthly
      if (itemMonth === selMonth && itemYear === selYear) {
        counselorMap[counselor].monthlyTotal++;
      }

      // Daily
      if (
        itemDate === selectedDate &&
        counselorMap[counselor].dailyStats[uni]
      ) {
        counselorMap[counselor].dailyStats[uni].ref++;
        counselorMap[counselor].dailyRowTotal++;
      }
    });

    // -------- Final Data --------
    const finalData = Object.values(counselorMap).map((row) => ({
      ...row,
      universities: counselorUniversities[row.name]
        ? [...counselorUniversities[row.name]]
        : [],
    }));

    // -------- Totals --------
    const grandDaily = finalData.reduce(
      (s, r) => s + r.dailyRowTotal,
      0
    );

    const grandMonthly = finalData.reduce(
      (s, r) => s + r.monthlyTotal,
      0
    );

    return {
      finalReport: finalData,
      uniList: allUnis,

      currentMonthName: monthName,

      grandTotals: {
        daily: grandDaily,
        monthly: grandMonthly,
      },
    };
  }, [admissions, selectedDate, searchTerm]);

  // ================= EXCEL =================
  const downloadExcel = () => {
    const data = [];

    finalReport.forEach((row, index) => {
      const rowData = {
        Sr: index + 1,
        Counselor: row.name,
        Universities: row.universities.join(", "),
      };

      uniList.forEach((u) => {
        rowData[u] = row.dailyStats[u]?.ref || 0;
      });

      rowData["Daily Total"] = row.dailyRowTotal;
      rowData["Monthly Total"] = row.monthlyTotal;

      data.push(rowData);
    });

    const totalRow = {
      Sr: "",
      Counselor: "TOTAL",
      Universities: "",
    };

    uniList.forEach((u) => {
      totalRow[u] = finalReport.reduce(
        (s, r) => s + r.dailyStats[u].ref,
        0
      );
    });

    totalRow["Daily Total"] = grandTotals.daily;
    totalRow["Monthly Total"] = grandTotals.monthly;

    data.push(totalRow);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Daily Report");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `Admission_Report_${selectedDate}.xlsx`);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-emerald-700 animate-pulse">
        Loading Report...
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-4 bg-gray-100 min-h-screen">

      <div className="bg-white shadow-xl rounded-md overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#1e3a1e] p-4 flex flex-wrap gap-3 justify-between">

          <h1 className="text-white font-bold flex items-center gap-2">
            <Award className="text-yellow-400" size={20} />
            Performance - {currentMonthName}
          </h1>

          <div className="flex flex-wrap gap-2 items-center">

            {/* SEARCH */}
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />

              <input
                type="text"
                placeholder="Search University"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs rounded"
              />
            </div>

            {/* DATE */}
            <div className="flex items-center bg-white/10 px-2 py-1 rounded">
              <Calendar size={14} className="text-white mr-1" />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs outline-none"
              />
            </div>

            {/* DOWNLOAD */}
            <button
              onClick={downloadExcel}
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
            >
              <Download size={14} />
              Excel
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto max-h-[75vh]">

          <table className="w-full text-center border-collapse min-w-max">

            <thead className="sticky top-0 bg-green-100 z-10">

              <tr className="text-xs font-bold">

                <th className="border p-2">Sr</th>

                <th className="border p-2 text-left">Counselor</th>

                <th className="border p-2 text-left bg-blue-100">
                  Universities
                </th>

                {uniList.map((u) => (
                  <th key={u} className="border p-2">
                    {u}
                  </th>
                ))}

                <th className="border p-2 bg-green-200">
                  Daily
                </th>

                <th className="border p-2 bg-orange-200">
                  Month
                </th>

              </tr>

            </thead>

            <tbody className="text-xs font-semibold">

              {finalReport.map((row, i) => (
                <tr key={i} className="hover:bg-yellow-50">

                  <td className="border p-1">{i + 1}</td>

                  <td className="border p-1 text-left font-bold text-emerald-800">
                    {row.name}
                  </td>

                  <td className="border p-1 text-left text-[10px] text-blue-700">
                    {row.universities.length
                      ? row.universities.join(", ")
                      : "-"}
                  </td>

                  {uniList.map((u) => (
                    <td key={u} className="border p-1">
                      {row.dailyStats[u]?.ref || "-"}
                    </td>
                  ))}

                  <td className="border p-1 bg-green-50 font-bold">
                    {row.dailyRowTotal}
                  </td>

                  <td className="border p-1 bg-orange-50 font-bold">
                    {row.monthlyTotal}
                  </td>

                </tr>
              ))}

            </tbody>

            <tfoot className="bg-[#1e3a1e] text-white font-bold">

              <tr>

                <td colSpan={3} className="border p-2 text-right">
                  TOTAL
                </td>

                {uniList.map((u) => (
                  <td key={u} className="border p-2">
                    {finalReport.reduce(
                      (s, r) => s + r.dailyStats[u].ref,
                      0
                    )}
                  </td>
                ))}

                <td className="border p-2 text-lg">
                  {grandTotals.daily}
                </td>

                <td className="border p-2 text-lg">
                  {grandTotals.monthly}
                </td>

              </tr>

            </tfoot>

          </table>

        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-4 mt-5">

        <div className="bg-white p-4 shadow rounded flex justify-between">

          <div>
            <p className="text-xs text-gray-400">Today</p>

            <h2 className="text-2xl font-bold text-emerald-700">
              {grandTotals.daily}
            </h2>
          </div>

          <TrendingUp size={40} className="text-emerald-200" />
        </div>

        <div className="bg-white p-4 shadow rounded flex justify-between">

          <div>
            <p className="text-xs text-gray-400">
              {currentMonthName}
            </p>

            <h2 className="text-2xl font-bold text-orange-600">
              {grandTotals.monthly}
            </h2>
          </div>

          <Users size={40} className="text-orange-200" />
        </div>

      </div>

    </div>
  );
};

export default FinalAdmissionReport;