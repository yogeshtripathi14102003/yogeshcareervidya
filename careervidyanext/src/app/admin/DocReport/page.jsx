// // "use client";

// // import React, { useEffect, useState, useMemo } from "react";
// // import api from "@/utlis/api.js";

// // import {
// //   Award,
// //   Calendar,
// //   Search,
// //   Download,
// // } from "lucide-react";

// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";

// // const FinalAdmissionReport = () => {
// //   const [admissions, setAdmissions] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [selectedDate, setSelectedDate] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   const [searchTerm, setSearchTerm] = useState("");

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       const res = await api.get("/api/v1/ad");
// //       if (res.data.success) {
// //         setAdmissions(res.data.data);
// //       }
// //     } catch (err) {
// //       console.error("API Error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const {
// //     finalReport,
// //     uniList,
// //     grandTotals,
// //     currentMonthName,
// //   } = useMemo(() => {

// //     const selDateObj = new Date(selectedDate);
// //     const selMonth = selDateObj.getMonth();
// //     const selYear = selDateObj.getFullYear();
// //     const monthName = selDateObj.toLocaleString("default", { month: "long" });

// //     const allCounselors = [
// //       ...new Set(admissions.map((i) => i.counselorName).filter(Boolean)),
// //     ].sort();

// //     const dateWiseUnis = new Set();
// //     admissions.forEach((item) => {
// //       const itemDate = new Date(item.admissionDate || item.createdAt).toISOString().split("T")[0];
// //       if (itemDate === selectedDate && item.universityName) {
// //         dateWiseUnis.add(item.universityName.toUpperCase());
// //       }
// //     });

// //     let allUnis = [...dateWiseUnis].sort();
// //     if (searchTerm) {
// //       allUnis = allUnis.filter((u) => u.includes(searchTerm.toUpperCase()));
// //     }

// //     const counselorMap = {};
// //     const counselorUniversities = {};

// //     allCounselors.forEach((name) => {
// //       counselorMap[name] = {
// //         name,
// //         dailyStats: {},
// //         dailyRowTotal: 0,
// //         monthlyTotal: 0,
// //         leadTotal: 0,
// //         referralTotal: 0,
// //         totalDocs: 0,
// //         verifiedDocs: 0,
// //         pendingDocs: 0,
// //         rejectedDocs: 0,
// //       };
// //       counselorUniversities[name] = new Set();
// //       allUnis.forEach((u) => {
// //         counselorMap[name].dailyStats[u] = 0;
// //       });
// //     });

// //     admissions.forEach((item) => {
// //       const dateObj = new Date(item.admissionDate || item.createdAt);
// //       const itemDate = dateObj.toISOString().split("T")[0];
// //       const itemMonth = dateObj.getMonth();
// //       const itemYear = dateObj.getFullYear();
// //       const counselor = item.counselorName;
// //       const uni = item.universityName?.toUpperCase();

// //       if (!counselor || !counselorMap[counselor]) return;

// //       if (uni) counselorUniversities[counselor].add(uni);

// //       const isReferral = item.refrelname && item.refrelname.trim() !== "";

// //       /* Doc counts — scoped to admission date month (not createdAt) */
// //       const admDateObj   = new Date(item.admissionDate || item.createdAt);
// //       const admItemMonth = admDateObj.getMonth();
// //       const admItemYear  = admDateObj.getFullYear();
// //       const docs         = item.documents || [];

// //       if (admItemMonth === selMonth && admItemYear === selYear) {
// //         counselorMap[counselor].monthlyTotal++;

// //         /* 1 admission = 1 unit — chahe kitni bhi images/files hon */
// //         const hasAnyDoc    = docs.length > 0;
// //         const allVerified  = hasAnyDoc && docs.every((d) => d.status === "done");
// //         const hasPending   = docs.some((d) => d.status === "pending");
// //         const hasRejected  = docs.some((d) => d.status === "rejected");

// //         if (hasAnyDoc)   counselorMap[counselor].totalDocs++;
// //         if (allVerified) counselorMap[counselor].verifiedDocs++;
// //         if (hasPending)  counselorMap[counselor].pendingDocs++;
// //         if (hasRejected) counselorMap[counselor].rejectedDocs++;
// //       }

// //       if (itemDate === selectedDate && uni && counselorMap[counselor].dailyStats[uni] !== undefined) {
// //         counselorMap[counselor].dailyStats[uni]++;
// //         counselorMap[counselor].dailyRowTotal++;
// //         if (isReferral) counselorMap[counselor].referralTotal++;
// //         else            counselorMap[counselor].leadTotal++;
// //       }
// //     });

// //     const finalData = Object.values(counselorMap)
// //       .map((row) => ({
// //         ...row,
// //         universities: counselorUniversities[row.name] ? [...counselorUniversities[row.name]] : [],
// //       }))
// //       .filter(() => true); // show all counselors including 0 admissions

// //     const grandDaily    = finalData.reduce((s, r) => s + r.dailyRowTotal,  0);
// //     const grandMonthly  = finalData.reduce((s, r) => s + r.monthlyTotal,   0);
// //     const grandLead     = finalData.reduce((s, r) => s + r.leadTotal,      0);
// //     const grandReferral = finalData.reduce((s, r) => s + r.referralTotal,  0);
// //     const grandTotal    = finalData.reduce((s, r) => s + r.totalDocs,      0);
// //     const grandVerified = finalData.reduce((s, r) => s + r.verifiedDocs,   0);
// //     const grandPending  = finalData.reduce((s, r) => s + r.pendingDocs,    0);
// //     const grandRejected = finalData.reduce((s, r) => s + r.rejectedDocs,   0);

// //     return {
// //       finalReport: finalData,
// //       uniList: allUnis,
// //       currentMonthName: monthName,
// //       grandTotals: {
// //         daily: grandDaily, monthly: grandMonthly,
// //         lead: grandLead, referral: grandReferral,
// //         totalDocs: grandTotal, verifiedDocs: grandVerified,
// //         pendingDocs: grandPending, rejectedDocs: grandRejected,
// //       },
// //     };
// //   }, [admissions, selectedDate, searchTerm]);

// //   const downloadExcel = () => {
// //     const data = [];
// //     finalReport.forEach((row, index) => {
// //       const rowData = {
// //         Sr: index + 1,
// //         Counselor: row.name,
// //         Universities: row.universities.join(", "),
// //         "Total Lead": row.leadTotal,
// //         "Total Referral": row.referralTotal,
// //       };
// //       uniList.forEach((u) => {
// //         rowData[`${u} (L/R)`] = row.dailyStats[u] || 0;
// //       });
// //       rowData["Daily Total"]    = row.dailyRowTotal;
// //       rowData["Monthly Total"]  = row.monthlyTotal;
// //       rowData["Total Docs"]     = row.totalDocs;
// //       rowData["Verified Docs"]  = row.verifiedDocs;
// //       rowData["Pending Docs"]   = row.pendingDocs;
// //       rowData["Rejected Docs"]  = row.rejectedDocs;
// //       data.push(rowData);
// //     });
// //     const ws = XLSX.utils.json_to_sheet(data);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
// //     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
// //     saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Admission_Report_${selectedDate}.xlsx`);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="p-20 text-center font-bold text-emerald-700 animate-pulse">
// //         Loading Report...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 bg-gray-100 min-h-screen">
// //       <div className="bg-white shadow-xl rounded-md overflow-hidden">

// //         {/* HEADER */}
// //         <div className="bg-[#1e3a1e] p-4 flex flex-wrap gap-3 justify-between">
// //           <h1 className="text-white font-bold flex items-center gap-2">
// //             <Award className="text-yellow-400" size={20} />
// //             Performance - {currentMonthName}
// //           </h1>
// //           <div className="flex flex-wrap gap-2 items-center">
// //             <div className="relative">
// //               <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search University"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="pl-7 pr-3 py-1.5 text-xs rounded"
// //               />
// //             </div>
// //             <div className="flex items-center bg-white/10 px-2 py-1 rounded">
// //               <Calendar size={14} className="text-white mr-1" />
// //               <input
// //                 type="date"
// //                 value={selectedDate}
// //                 onChange={(e) => setSelectedDate(e.target.value)}
// //                 className="bg-transparent text-white text-xs outline-none"
// //               />
// //             </div>
// //             <button
// //               onClick={downloadExcel}
// //               className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
// //             >
// //               <Download size={14} />
// //               Excel
// //             </button>
// //           </div>
// //         </div>

// //         {/* TABLE */}
// //         <div className="overflow-x-auto max-h-[75vh]">
// //           <table className="w-full text-center border-collapse min-w-max">
// //             <thead className="sticky top-0 bg-green-100 z-10">
// //               <tr className="text-xs font-bold">
// //                 <th className="border p-2">Sr</th>
// //                 <th className="border p-2 text-left">Counselor</th>
// //                 <th className="border p-2 text-left bg-blue-100">Universities</th>
// //                 {uniList.map((u) => (
// //                   <th key={u} className="border p-2">{u} (L/R)</th>
// //                 ))}
// //                 <th className="border p-2 bg-blue-200">Lead</th>
// //                 <th className="border p-2 bg-purple-200">Referral</th>
// //                 <th className="border p-2 bg-green-200">Daily</th>
// //                 <th className="border p-2 bg-orange-200">Month</th>
// //                 {/* NEW DOC COLUMNS */}
// //                 <th className="border p-2 bg-slate-200">Total Docs</th>
// //                 <th className="border p-2 bg-emerald-200">✅ Verified</th>
// //                 <th className="border p-2 bg-yellow-200">⏳ Pending</th>
// //                 <th className="border p-2 bg-red-200">❌ Rejected</th>
// //               </tr>
// //             </thead>
// //             <tbody className="text-xs font-semibold">
// //               {finalReport.map((row, i) => (
// //                 <tr key={i} className="hover:bg-yellow-50">
// //                   <td className="border p-1">{i + 1}</td>
// //                   <td className="border p-1 text-left font-bold text-emerald-800">{row.name}</td>
// //                   <td className="border p-1 text-left text-[10px] text-blue-700">
// //                     {row.universities.length ? row.universities.join(", ") : "-"}
// //                   </td>
// //                   {uniList.map((u) => (
// //                     <td key={u} className="border p-1 text-indigo-700 font-bold">
// //                       {row.dailyStats[u] || 0}
// //                     </td>
// //                   ))}
// //                   <td className="border p-1 bg-blue-50 font-bold">{row.leadTotal}</td>
// //                   <td className="border p-1 bg-purple-50 font-bold">{row.referralTotal}</td>
// //                   <td className="border p-1 bg-green-50 font-bold">{row.dailyRowTotal}</td>
// //                   <td className="border p-1 bg-orange-50 font-bold">{row.monthlyTotal}</td>
// //                   {/* NEW DOC CELLS */}
// //                   <td className="border p-1 bg-slate-50 font-bold text-slate-700">{row.totalDocs}</td>
// //                   <td className="border p-1 bg-emerald-50 font-bold text-emerald-700">{row.verifiedDocs}</td>
// //                   <td className="border p-1 bg-yellow-50 font-bold text-yellow-600">
// //                     {row.pendingDocs > 0
// //                       ? <span className="inline-flex items-center gap-1">{row.pendingDocs} <span className="text-[9px] text-yellow-500">●</span></span>
// //                       : 0}
// //                   </td>
// //                   <td className="border p-1 bg-red-50 font-bold text-red-600">{row.rejectedDocs}</td>
// //                 </tr>
// //               ))}
// //             </tbody>

// //             {/* GRAND TOTAL ROW */}
// //             {finalReport.length > 0 && (
// //               <tfoot>
// //                 <tr className="text-xs font-bold bg-[#1e3a1e] text-white sticky bottom-0">
// //                   <td className="border p-2" colSpan={3 + uniList.length}>GRAND TOTAL</td>
// //                   <td className="border p-2 bg-blue-800">{grandTotals.lead}</td>
// //                   <td className="border p-2 bg-purple-800">{grandTotals.referral}</td>
// //                   <td className="border p-2 bg-green-800">{grandTotals.daily}</td>
// //                   <td className="border p-2 bg-orange-800">{grandTotals.monthly}</td>
// //                   <td className="border p-2 bg-slate-700">{grandTotals.totalDocs}</td>
// //                   <td className="border p-2 bg-emerald-800">{grandTotals.verifiedDocs}</td>
// //                   <td className="border p-2 bg-yellow-700">{grandTotals.pendingDocs}</td>
// //                   <td className="border p-2 bg-red-800">{grandTotals.rejectedDocs}</td>
// //                 </tr>
// //               </tfoot>
// //             )}

// //           </table>
// //         </div>
// //       </div>

// //       {/* STATS */}
// //       <div className="grid md:grid-cols-4 gap-4 mt-5">
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">Today Lead</p>
// //           <h2 className="text-2xl font-bold text-blue-600">{grandTotals.lead}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">Today Referral</p>
// //           <h2 className="text-2xl font-bold text-purple-600">{grandTotals.referral}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">Today Total</p>
// //           <h2 className="text-2xl font-bold text-emerald-700">{grandTotals.daily}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">{currentMonthName}</p>
// //           <h2 className="text-2xl font-bold text-orange-600">{grandTotals.monthly}</h2>
// //         </div>
// //       </div>

// //       {/* DOC STATS */}
// //       <div className="grid md:grid-cols-4 gap-4 mt-3">
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-slate-400">
// //           <p className="text-xs text-gray-400">Total Docs (Month)</p>
// //           <h2 className="text-2xl font-bold text-slate-700">{grandTotals.totalDocs}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-emerald-500">
// //           <p className="text-xs text-gray-400">✅ Verified</p>
// //           <h2 className="text-2xl font-bold text-emerald-600">{grandTotals.verifiedDocs}</h2>
// //           {grandTotals.totalDocs > 0 && (
// //             <p className="text-xs text-gray-400 mt-1">
// //               {Math.round((grandTotals.verifiedDocs / grandTotals.totalDocs) * 100)}% complete
// //             </p>
// //           )}
// //         </div>
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-yellow-400">
// //           <p className="text-xs text-gray-400">⏳ Pending</p>
// //           <h2 className="text-2xl font-bold text-yellow-600">{grandTotals.pendingDocs}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-red-500">
// //           <p className="text-xs text-gray-400">❌ Rejected</p>
// //           <h2 className="text-2xl font-bold text-red-600">{grandTotals.rejectedDocs}</h2>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default FinalAdmissionReport;


// // "use client";

// // import React, { useEffect, useState, useMemo } from "react";
// // import api from "@/utlis/api.js";

// // import {
// //   Award,
// //   Calendar,
// //   Search,
// //   Download,
// // } from "lucide-react";

// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";

// // const FinalAdmissionReport = () => {
// //   const [admissions, setAdmissions] = useState([]);
// //   const [activeCounselors, setActiveCounselors] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [selectedDate, setSelectedDate] = useState(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   const [searchTerm, setSearchTerm] = useState("");

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       const [admRes, cRes] = await Promise.all([
// //         api.get("/api/v1/ad"),
// //         api.get("/api/v1/counselor", { params: { status: "active", limit: 1000 } }),
// //       ]);
// //       if (admRes.data.success) setAdmissions(admRes.data.data);
// //       if (cRes.data.success)   setActiveCounselors(cRes.data.data.map((c) => c.name).filter(Boolean));
// //     } catch (err) {
// //       console.error("API Error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const {
// //     finalReport,
// //     uniList,
// //     grandTotals,
// //     currentMonthName,
// //   } = useMemo(() => {

// //     const selDateObj = new Date(selectedDate);
// //     const selMonth = selDateObj.getMonth();
// //     const selYear = selDateObj.getFullYear();
// //     const monthName = selDateObj.toLocaleString("default", { month: "long" });

// //     /* Use active counselors from API — inactive wale yahan nahi aayenge */
// //     const allCounselors = activeCounselors.length
// //       ? [...new Set(activeCounselors)].sort()
// //       : [...new Set(admissions.map((i) => i.counselorName).filter(Boolean))].sort();

// //     const dateWiseUnis = new Set();
// //     admissions.forEach((item) => {
// //       const itemDate = new Date(item.admissionDate || item.createdAt).toISOString().split("T")[0];
// //       if (itemDate === selectedDate && item.universityName) {
// //         dateWiseUnis.add(item.universityName.toUpperCase());
// //       }
// //     });

// //     let allUnis = [...dateWiseUnis].sort();
// //     if (searchTerm) {
// //       allUnis = allUnis.filter((u) => u.includes(searchTerm.toUpperCase()));
// //     }

// //     const counselorMap = {};
// //     const counselorUniversities = {};

// //     allCounselors.forEach((name) => {
// //       counselorMap[name] = {
// //         name,
// //         dailyStats: {},
// //         dailyRowTotal: 0,
// //         monthlyTotal: 0,
// //         leadTotal: 0,
// //         referralTotal: 0,
// //         totalDocs: 0,
// //         verifiedDocs: 0,
// //         pendingDocs: 0,
// //         rejectedDocs: 0,
// //       };
// //       counselorUniversities[name] = new Set();
// //       allUnis.forEach((u) => {
// //         counselorMap[name].dailyStats[u] = 0;
// //       });
// //     });

// //     admissions.forEach((item) => {
// //       const dateObj = new Date(item.admissionDate || item.createdAt);
// //       const itemDate = dateObj.toISOString().split("T")[0];
// //       const itemMonth = dateObj.getMonth();
// //       const itemYear = dateObj.getFullYear();
// //       const counselor = item.counselorName;
// //       const uni = item.universityName?.toUpperCase();

// //       if (!counselor || !counselorMap[counselor]) return;

// //       if (uni) counselorUniversities[counselor].add(uni);

// //       const isReferral = item.refrelname && item.refrelname.trim() !== "";

// //       /* Doc counts — scoped to admission date month (not createdAt) */
// //       const admDateObj   = new Date(item.admissionDate || item.createdAt);
// //       const admItemMonth = admDateObj.getMonth();
// //       const admItemYear  = admDateObj.getFullYear();
// //       const docs         = item.documents || [];

// //       if (admItemMonth === selMonth && admItemYear === selYear) {
// //         counselorMap[counselor].monthlyTotal++;

// //         /* 1 admission = 1 unit — chahe kitni bhi images/files hon */
// //         const hasAnyDoc    = docs.length > 0;
// //         const allVerified  = hasAnyDoc && docs.every((d) => d.status === "done");
// //         const hasPending   = docs.some((d) => d.status === "pending");
// //         const hasRejected  = docs.some((d) => d.status === "rejected");

// //         if (hasAnyDoc)   counselorMap[counselor].totalDocs++;
// //         if (allVerified) counselorMap[counselor].verifiedDocs++;
// //         if (hasPending)  counselorMap[counselor].pendingDocs++;
// //         if (hasRejected) counselorMap[counselor].rejectedDocs++;
// //       }

// //       if (itemDate === selectedDate && uni && counselorMap[counselor].dailyStats[uni] !== undefined) {
// //         counselorMap[counselor].dailyStats[uni]++;
// //         counselorMap[counselor].dailyRowTotal++;
// //         if (isReferral) counselorMap[counselor].referralTotal++;
// //         else            counselorMap[counselor].leadTotal++;
// //       }
// //     });

// //     const finalData = Object.values(counselorMap)
// //       .map((row) => ({
// //         ...row,
// //         universities: counselorUniversities[row.name] ? [...counselorUniversities[row.name]] : [],
// //       }))
// //       .filter(() => true); // show all counselors including 0 admissions

// //     const grandDaily    = finalData.reduce((s, r) => s + r.dailyRowTotal,  0);
// //     const grandMonthly  = finalData.reduce((s, r) => s + r.monthlyTotal,   0);
// //     const grandLead     = finalData.reduce((s, r) => s + r.leadTotal,      0);
// //     const grandReferral = finalData.reduce((s, r) => s + r.referralTotal,  0);
// //     const grandTotal    = finalData.reduce((s, r) => s + r.totalDocs,      0);
// //     const grandVerified = finalData.reduce((s, r) => s + r.verifiedDocs,   0);
// //     const grandPending  = finalData.reduce((s, r) => s + r.pendingDocs,    0);
// //     const grandRejected = finalData.reduce((s, r) => s + r.rejectedDocs,   0);

// //     return {
// //       finalReport: finalData,
// //       uniList: allUnis,
// //       currentMonthName: monthName,
// //       grandTotals: {
// //         daily: grandDaily, monthly: grandMonthly,
// //         lead: grandLead, referral: grandReferral,
// //         totalDocs: grandTotal, verifiedDocs: grandVerified,
// //         pendingDocs: grandPending, rejectedDocs: grandRejected,
// //       },
// //     };
// //   }, [admissions, activeCounselors, selectedDate, searchTerm]);

// //   const downloadExcel = () => {
// //     const data = [];
// //     finalReport.forEach((row, index) => {
// //       const rowData = {
// //         Sr: index + 1,
// //         Counselor: row.name,
// //         Universities: row.universities.join(", "),
// //         "Total Lead": row.leadTotal,
// //         "Total Referral": row.referralTotal,
// //       };
// //       uniList.forEach((u) => {
// //         rowData[`${u} (L/R)`] = row.dailyStats[u] || 0;
// //       });
// //       rowData["Daily Total"]    = row.dailyRowTotal;
// //       rowData["Monthly Total"]  = row.monthlyTotal;
// //       rowData["Total Docs"]     = row.totalDocs;
// //       rowData["Verified Docs"]  = row.verifiedDocs;
// //       rowData["Pending Docs"]   = row.pendingDocs;
// //       rowData["Rejected Docs"]  = row.rejectedDocs;
// //       data.push(rowData);
// //     });
// //     const ws = XLSX.utils.json_to_sheet(data);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
// //     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
// //     saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Admission_Report_${selectedDate}.xlsx`);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="p-20 text-center font-bold text-emerald-700 animate-pulse">
// //         Loading Report...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 bg-gray-100 min-h-screen">
// //       <div className="bg-white shadow-xl rounded-md overflow-hidden">

// //         {/* HEADER */}
// //         <div className="bg-[#1e3a1e] p-4 flex flex-wrap gap-3 justify-between">
// //           <h1 className="text-white font-bold flex items-center gap-2">
// //             <Award className="text-yellow-400" size={20} />
// //             Performance - {currentMonthName}
// //           </h1>
// //           <div className="flex flex-wrap gap-2 items-center">
// //             <div className="relative">
// //               <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search University"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="pl-7 pr-3 py-1.5 text-xs rounded"
// //               />
// //             </div>
// //             <div className="flex items-center bg-white/10 px-2 py-1 rounded">
// //               <Calendar size={14} className="text-white mr-1" />
// //               <input
// //                 type="date"
// //                 value={selectedDate}
// //                 onChange={(e) => setSelectedDate(e.target.value)}
// //                 className="bg-transparent text-white text-xs outline-none"
// //               />
// //             </div>
// //             <button
// //               onClick={downloadExcel}
// //               className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
// //             >
// //               <Download size={14} />
// //               Excel
// //             </button>
// //           </div>
// //         </div>

// //         {/* TABLE */}
// //         <div className="overflow-x-auto max-h-[75vh]">
// //           <table className="w-full text-center border-collapse min-w-max">
// //             <thead className="sticky top-0 bg-green-100 z-10">
// //               <tr className="text-xs font-bold">
// //                 <th className="border p-2">Sr</th>
// //                 <th className="border p-2 text-left">Counselor</th>
// //                 <th className="border p-2 text-left bg-blue-100">Universities</th>
// //                 {uniList.map((u) => (
// //                   <th key={u} className="border p-2">{u} (L/R)</th>
// //                 ))}
// //                 <th className="border p-2 bg-blue-200">Lead</th>
// //                 <th className="border p-2 bg-purple-200">Referral</th>
// //                 <th className="border p-2 bg-green-200">Daily</th>
// //                 <th className="border p-2 bg-orange-200">Month</th>
// //                 {/* NEW DOC COLUMNS */}
// //                 <th className="border p-2 bg-slate-200">Total Docs</th>
// //                 <th className="border p-2 bg-emerald-200">✅ Verified</th>
// //                 <th className="border p-2 bg-yellow-200">⏳ Pending</th>
// //                 <th className="border p-2 bg-red-200">❌ Rejected</th>
// //               </tr>
// //             </thead>
// //             <tbody className="text-xs font-semibold">
// //               {finalReport.map((row, i) => (
// //                 <tr key={i} className="hover:bg-yellow-50">
// //                   <td className="border p-1">{i + 1}</td>
// //                   <td className="border p-1 text-left font-bold text-emerald-800">{row.name}</td>
// //                   <td className="border p-1 text-left text-[10px] text-blue-700">
// //                     {row.universities.length ? row.universities.join(", ") : "-"}
// //                   </td>
// //                   {uniList.map((u) => (
// //                     <td key={u} className="border p-1 text-indigo-700 font-bold">
// //                       {row.dailyStats[u] || 0}
// //                     </td>
// //                   ))}
// //                   <td className="border p-1 bg-blue-50 font-bold">{row.leadTotal}</td>
// //                   <td className="border p-1 bg-purple-50 font-bold">{row.referralTotal}</td>
// //                   <td className="border p-1 bg-green-50 font-bold">{row.dailyRowTotal}</td>
// //                   <td className="border p-1 bg-orange-50 font-bold">{row.monthlyTotal}</td>
// //                   {/* NEW DOC CELLS */}
// //                   <td className="border p-1 bg-slate-50 font-bold text-slate-700">{row.totalDocs}</td>
// //                   <td className="border p-1 bg-emerald-50 font-bold text-emerald-700">{row.verifiedDocs}</td>
// //                   <td className="border p-1 bg-yellow-50 font-bold text-yellow-600">
// //                     {row.pendingDocs > 0
// //                       ? <span className="inline-flex items-center gap-1">{row.pendingDocs} <span className="text-[9px] text-yellow-500">●</span></span>
// //                       : 0}
// //                   </td>
// //                   <td className="border p-1 bg-red-50 font-bold text-red-600">{row.rejectedDocs}</td>
// //                 </tr>
// //               ))}
// //             </tbody>

// //             {/* GRAND TOTAL ROW */}
// //             {finalReport.length > 0 && (
// //               <tfoot>
// //                 <tr className="text-xs font-bold bg-[#1e3a1e] text-white sticky bottom-0">
// //                   <td className="border p-2" colSpan={3 + uniList.length}>GRAND TOTAL</td>
// //                   <td className="border p-2 bg-blue-800">{grandTotals.lead}</td>
// //                   <td className="border p-2 bg-purple-800">{grandTotals.referral}</td>
// //                   <td className="border p-2 bg-green-800">{grandTotals.daily}</td>
// //                   <td className="border p-2 bg-orange-800">{grandTotals.monthly}</td>
// //                   <td className="border p-2 bg-slate-700">{grandTotals.totalDocs}</td>
// //                   <td className="border p-2 bg-emerald-800">{grandTotals.verifiedDocs}</td>
// //                   <td className="border p-2 bg-yellow-700">{grandTotals.pendingDocs}</td>
// //                   <td className="border p-2 bg-red-800">{grandTotals.rejectedDocs}</td>
// //                 </tr>
// //               </tfoot>
// //             )}

// //           </table>
// //         </div>
// //       </div>

// //       {/* STATS */}
// //       <div className="grid md:grid-cols-4 gap-4 mt-5">
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">Today Lead</p>
// //           <h2 className="text-2xl font-bold text-blue-600">{grandTotals.lead}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">Today Referral</p>
// //           <h2 className="text-2xl font-bold text-purple-600">{grandTotals.referral}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">Today Total</p>
// //           <h2 className="text-2xl font-bold text-emerald-700">{grandTotals.daily}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded">
// //           <p className="text-xs text-gray-400">{currentMonthName}</p>
// //           <h2 className="text-2xl font-bold text-orange-600">{grandTotals.monthly}</h2>
// //         </div>
// //       </div>

// //       {/* DOC STATS */}
// //       <div className="grid md:grid-cols-4 gap-4 mt-3">
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-slate-400">
// //           <p className="text-xs text-gray-400">Total Docs (Month)</p>
// //           <h2 className="text-2xl font-bold text-slate-700">{grandTotals.totalDocs}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-emerald-500">
// //           <p className="text-xs text-gray-400">✅ Verified</p>
// //           <h2 className="text-2xl font-bold text-emerald-600">{grandTotals.verifiedDocs}</h2>
// //           {grandTotals.totalDocs > 0 && (
// //             <p className="text-xs text-gray-400 mt-1">
// //               {Math.round((grandTotals.verifiedDocs / grandTotals.totalDocs) * 100)}% complete
// //             </p>
// //           )}
// //         </div>
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-yellow-400">
// //           <p className="text-xs text-gray-400">⏳ Pending</p>
// //           <h2 className="text-2xl font-bold text-yellow-600">{grandTotals.pendingDocs}</h2>
// //         </div>
// //         <div className="bg-white p-4 shadow rounded border-l-4 border-red-500">
// //           <p className="text-xs text-gray-400">❌ Rejected</p>
// //           <h2 className="text-2xl font-bold text-red-600">{grandTotals.rejectedDocs}</h2>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default FinalAdmissionReport;


// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import api from "@/utlis/api.js";

// import {
//   Award,
//   Calendar,
//   Search,
//   Download,
// } from "lucide-react";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const FinalAdmissionReport = () => {
//   const [admissions, setAdmissions] = useState([]);
//   const [activeCounselors, setActiveCounselors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [admRes, cRes] = await Promise.all([
//         api.get("/api/v1/ad"),
//         api.get("/api/v1/counselor", { params: { status: "active", limit: 1000 } }),
//       ]);
//       if (admRes.data.success) setAdmissions(admRes.data.data);
//       if (cRes.data.success)
//         setActiveCounselors(
//           cRes.data.data
//             .filter((c) => c.status === "active" || c.status === "Active")
//             .map((c) => c.name)
//             .filter(Boolean)
//         );
//     } catch (err) {
//       console.error("API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const {
//     finalReport,
//     uniList,
//     grandTotals,
//     currentMonthName,
//   } = useMemo(() => {

//     const selDateObj = new Date(selectedDate);
//     const selMonth = selDateObj.getMonth();
//     const selYear = selDateObj.getFullYear();
//     const monthName = selDateObj.toLocaleString("default", { month: "long" });

//     /* Use active counselors from API — inactive wale yahan nahi aayenge */
//     const allCounselors = activeCounselors.length
//       ? [...new Set(activeCounselors)].sort()
//       : [...new Set(admissions.map((i) => i.counselorName).filter(Boolean))].sort();

//     const dateWiseUnis = new Set();
//     admissions.forEach((item) => {
//       const itemDate = new Date(item.admissionDate || item.createdAt).toISOString().split("T")[0];
//       if (itemDate === selectedDate && item.universityName) {
//         dateWiseUnis.add(item.universityName.toUpperCase());
//       }
//     });

//     let allUnis = [...dateWiseUnis].sort();
//     if (searchTerm) {
//       allUnis = allUnis.filter((u) => u.includes(searchTerm.toUpperCase()));
//     }

//     const counselorMap = {};
//     const counselorUniversities = {};

//     allCounselors.forEach((name) => {
//       counselorMap[name] = {
//         name,
//         dailyStats: {},
//         dailyRowTotal: 0,
//         monthlyTotal: 0,
//         leadTotal: 0,
//         referralTotal: 0,
//         totalDocs: 0,
//         verifiedDocs: 0,
//         pendingDocs: 0,
//         rejectedDocs: 0,
//       };
//       counselorUniversities[name] = new Set();
//       allUnis.forEach((u) => {
//         counselorMap[name].dailyStats[u] = 0;
//       });
//     });

//     admissions.forEach((item) => {
//       const dateObj = new Date(item.admissionDate || item.createdAt);
//       const itemDate = dateObj.toISOString().split("T")[0];
//       const itemMonth = dateObj.getMonth();
//       const itemYear = dateObj.getFullYear();
//       const counselor = item.counselorName;
//       const uni = item.universityName?.toUpperCase();

//       if (!counselor || !counselorMap[counselor]) return;

//       if (uni) counselorUniversities[counselor].add(uni);

//       const isReferral = item.refrelname && item.refrelname.trim() !== "";

//       /* Doc counts — scoped to admission date month (not createdAt) */
//       const admDateObj   = new Date(item.admissionDate || item.createdAt);
//       const admItemMonth = admDateObj.getMonth();
//       const admItemYear  = admDateObj.getFullYear();
//       const docs         = item.documents || [];

//       if (admItemMonth === selMonth && admItemYear === selYear) {
//         counselorMap[counselor].monthlyTotal++;

//         /* 1 admission = 1 unit — chahe kitni bhi images/files hon */
//         const hasAnyDoc    = docs.length > 0;
//         const allVerified  = hasAnyDoc && docs.every((d) => d.status === "done");
//         const hasPending   = docs.some((d) => d.status === "pending");
//         const hasRejected  = docs.some((d) => d.status === "rejected");

//         if (hasAnyDoc)   counselorMap[counselor].totalDocs++;
//         if (allVerified) counselorMap[counselor].verifiedDocs++;
//         if (hasPending)  counselorMap[counselor].pendingDocs++;
//         if (hasRejected) counselorMap[counselor].rejectedDocs++;
//       }

//       if (itemDate === selectedDate && uni && counselorMap[counselor].dailyStats[uni] !== undefined) {
//         counselorMap[counselor].dailyStats[uni]++;
//         counselorMap[counselor].dailyRowTotal++;
//         if (isReferral) counselorMap[counselor].referralTotal++;
//         else            counselorMap[counselor].leadTotal++;
//       }
//     });

//     const finalData = Object.values(counselorMap)
//       .map((row) => ({
//         ...row,
//         universities: counselorUniversities[row.name] ? [...counselorUniversities[row.name]] : [],
//       }))
//       .filter(() => true); // show all counselors including 0 admissions

//     const grandDaily    = finalData.reduce((s, r) => s + r.dailyRowTotal,  0);
//     const grandMonthly  = finalData.reduce((s, r) => s + r.monthlyTotal,   0);
//     const grandLead     = finalData.reduce((s, r) => s + r.leadTotal,      0);
//     const grandReferral = finalData.reduce((s, r) => s + r.referralTotal,  0);
//     const grandTotal    = finalData.reduce((s, r) => s + r.totalDocs,      0);
//     const grandVerified = finalData.reduce((s, r) => s + r.verifiedDocs,   0);
//     const grandPending  = finalData.reduce((s, r) => s + r.pendingDocs,    0);
//     const grandRejected = finalData.reduce((s, r) => s + r.rejectedDocs,   0);

//     return {
//       finalReport: finalData,
//       uniList: allUnis,
//       currentMonthName: monthName,
//       grandTotals: {
//         daily: grandDaily, monthly: grandMonthly,
//         lead: grandLead, referral: grandReferral,
//         totalDocs: grandTotal, verifiedDocs: grandVerified,
//         pendingDocs: grandPending, rejectedDocs: grandRejected,
//       },
//     };
//   }, [admissions, activeCounselors, selectedDate, searchTerm]);

//   const downloadExcel = () => {
//     const data = [];
//     finalReport.forEach((row, index) => {
//       const rowData = {
//         Sr: index + 1,
//         Counselor: row.name,
//         Universities: row.universities.join(", "),
//         "Total Lead": row.leadTotal,
//         "Total Referral": row.referralTotal,
//       };
//       uniList.forEach((u) => {
//         rowData[`${u} (L/R)`] = row.dailyStats[u] || 0;
//       });
//       rowData["Daily Total"]    = row.dailyRowTotal;
//       rowData["Monthly Total"]  = row.monthlyTotal;
//       rowData["Total Docs"]     = row.totalDocs;
//       rowData["Verified Docs"]  = row.verifiedDocs;
//       rowData["Pending Docs"]   = row.pendingDocs;
//       rowData["Rejected Docs"]  = row.rejectedDocs;
//       data.push(rowData);
//     });
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Admission_Report_${selectedDate}.xlsx`);
//   };

//   if (loading) {
//     return (
//       <div className="p-20 text-center font-bold text-emerald-700 animate-pulse">
//         Loading Report...
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="bg-white shadow-xl rounded-md overflow-hidden">

//         {/* HEADER */}
//         <div className="bg-[#1e3a1e] p-4 flex flex-wrap gap-3 justify-between">
//           <h1 className="text-white font-bold flex items-center gap-2">
//             <Award className="text-yellow-400" size={20} />
//             Performance - {currentMonthName}
//           </h1>
//           <div className="flex flex-wrap gap-2 items-center">
//             <div className="relative">
//               <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search University"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-7 pr-3 py-1.5 text-xs rounded"
//               />
//             </div>
//             <div className="flex items-center bg-white/10 px-2 py-1 rounded">
//               <Calendar size={14} className="text-white mr-1" />
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="bg-transparent text-white text-xs outline-none"
//               />
//             </div>
//             <button
//               onClick={downloadExcel}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
//             >
//               <Download size={14} />
//               Excel
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto max-h-[75vh]">
//           <table className="w-full text-center border-collapse min-w-max">
//             <thead className="sticky top-0 bg-green-100 z-10">
//               <tr className="text-xs font-bold">
//                 <th className="border p-2">Sr</th>
//                 <th className="border p-2 text-left">Counselor</th>
//                 <th className="border p-2 text-left bg-blue-100">Universities</th>
//                 {uniList.map((u) => (
//                   <th key={u} className="border p-2">{u} (L/R)</th>
//                 ))}
//                 <th className="border p-2 bg-blue-200">Lead</th>
//                 <th className="border p-2 bg-purple-200">Referral</th>
//                 <th className="border p-2 bg-green-200">Daily</th>
//                 <th className="border p-2 bg-orange-200">Month</th>
//                 {/* NEW DOC COLUMNS */}
//                 <th className="border p-2 bg-slate-200">Total Docs</th>
//                 <th className="border p-2 bg-emerald-200">✅ Verified</th>
//                 <th className="border p-2 bg-yellow-200">⏳ Pending</th>
//                 <th className="border p-2 bg-red-200">❌ Rejected</th>
//               </tr>
//             </thead>
//             <tbody className="text-xs font-semibold">
//               {finalReport.map((row, i) => (
//                 <tr key={i} className="hover:bg-yellow-50">
//                   <td className="border p-1">{i + 1}</td>
//                   <td className="border p-1 text-left font-bold text-emerald-800">{row.name}</td>
//                   <td className="border p-1 text-left text-[10px] text-blue-700">
//                     {row.universities.length ? row.universities.join(", ") : "-"}
//                   </td>
//                   {uniList.map((u) => (
//                     <td key={u} className="border p-1 text-indigo-700 font-bold">
//                       {row.dailyStats[u] || 0}
//                     </td>
//                   ))}
//                   <td className="border p-1 bg-blue-50 font-bold">{row.leadTotal}</td>
//                   <td className="border p-1 bg-purple-50 font-bold">{row.referralTotal}</td>
//                   <td className="border p-1 bg-green-50 font-bold">{row.dailyRowTotal}</td>
//                   <td className="border p-1 bg-orange-50 font-bold">{row.monthlyTotal}</td>
//                   {/* NEW DOC CELLS */}
//                   <td className="border p-1 bg-slate-50 font-bold text-slate-700">{row.totalDocs}</td>
//                   <td className="border p-1 bg-emerald-50 font-bold text-emerald-700">{row.verifiedDocs}</td>
//                   <td className="border p-1 bg-yellow-50 font-bold text-yellow-600">
//                     {row.pendingDocs > 0
//                       ? <span className="inline-flex items-center gap-1">{row.pendingDocs} <span className="text-[9px] text-yellow-500">●</span></span>
//                       : 0}
//                   </td>
//                   <td className="border p-1 bg-red-50 font-bold text-red-600">{row.rejectedDocs}</td>
//                 </tr>
//               ))}
//             </tbody>

//             {/* GRAND TOTAL ROW */}
//             {finalReport.length > 0 && (
//               <tfoot>
//                 <tr className="text-xs font-bold bg-[#1e3a1e] text-white sticky bottom-0">
//                   <td className="border p-2" colSpan={3 + uniList.length}>GRAND TOTAL</td>
//                   <td className="border p-2 bg-blue-800">{grandTotals.lead}</td>
//                   <td className="border p-2 bg-purple-800">{grandTotals.referral}</td>
//                   <td className="border p-2 bg-green-800">{grandTotals.daily}</td>
//                   <td className="border p-2 bg-orange-800">{grandTotals.monthly}</td>
//                   <td className="border p-2 bg-slate-700">{grandTotals.totalDocs}</td>
//                   <td className="border p-2 bg-emerald-800">{grandTotals.verifiedDocs}</td>
//                   <td className="border p-2 bg-yellow-700">{grandTotals.pendingDocs}</td>
//                   <td className="border p-2 bg-red-800">{grandTotals.rejectedDocs}</td>
//                 </tr>
//               </tfoot>
//             )}

//           </table>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="grid md:grid-cols-4 gap-4 mt-5">
//         <div className="bg-white p-4 shadow rounded">
//           <p className="text-xs text-gray-400">Today Lead</p>
//           <h2 className="text-2xl font-bold text-blue-600">{grandTotals.lead}</h2>
//         </div>
//         <div className="bg-white p-4 shadow rounded">
//           <p className="text-xs text-gray-400">Today Referral</p>
//           <h2 className="text-2xl font-bold text-purple-600">{grandTotals.referral}</h2>
//         </div>
//         <div className="bg-white p-4 shadow rounded">
//           <p className="text-xs text-gray-400">Today Total</p>
//           <h2 className="text-2xl font-bold text-emerald-700">{grandTotals.daily}</h2>
//         </div>
//         <div className="bg-white p-4 shadow rounded">
//           <p className="text-xs text-gray-400">{currentMonthName}</p>
//           <h2 className="text-2xl font-bold text-orange-600">{grandTotals.monthly}</h2>
//         </div>
//       </div>

//       {/* DOC STATS */}
//       <div className="grid md:grid-cols-4 gap-4 mt-3">
//         <div className="bg-white p-4 shadow rounded border-l-4 border-slate-400">
//           <p className="text-xs text-gray-400">Total Docs (Month)</p>
//           <h2 className="text-2xl font-bold text-slate-700">{grandTotals.totalDocs}</h2>
//         </div>
//         <div className="bg-white p-4 shadow rounded border-l-4 border-emerald-500">
//           <p className="text-xs text-gray-400">✅ Verified</p>
//           <h2 className="text-2xl font-bold text-emerald-600">{grandTotals.verifiedDocs}</h2>
//           {grandTotals.totalDocs > 0 && (
//             <p className="text-xs text-gray-400 mt-1">
//               {Math.round((grandTotals.verifiedDocs / grandTotals.totalDocs) * 100)}% complete
//             </p>
//           )}
//         </div>
//         <div className="bg-white p-4 shadow rounded border-l-4 border-yellow-400">
//           <p className="text-xs text-gray-400">⏳ Pending</p>
//           <h2 className="text-2xl font-bold text-yellow-600">{grandTotals.pendingDocs}</h2>
//         </div>
//         <div className="bg-white p-4 shadow rounded border-l-4 border-red-500">
//           <p className="text-xs text-gray-400">❌ Rejected</p>
//           <h2 className="text-2xl font-bold text-red-600">{grandTotals.rejectedDocs}</h2>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default FinalAdmissionReport;


"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/utlis/api.js";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

/* ── Google Drive API Config ── */
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const GOOGLE_API_KEY   = process.env.NEXT_PUBLIC_GOOGLE_API_KEY   || "YOUR_GOOGLE_API_KEY";
const DRIVE_SCOPE      = "https://www.googleapis.com/auth/drive.file";

/* ── Normalize counselor name ── */
const normName = (str) => (str || "").trim().toLowerCase().replace(/\s+/g, " ");

const statusColor = {
  pending:  { bg: "#FFF8E1", text: "#F59E0B", border: "#FDE68A", label: "Pending" },
  done:     { bg: "#ECFDF5", text: "#10B981", border: "#6EE7B7", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#EF4444", border: "#FECACA", label: "Rejected" },
};

const fileIcon = (type) => {
  if (!type) return "📎";
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("doc")) return "📝";
  return "🖼️";
};

const toSecureUrl = (url) => {
  if (!url) return url;
  return url.replace(/^http:\/\//i, "https://");
};

const MONTH_NAMES  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatMonthLabel = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
};

const getAdmissionMonth = (adm) => {
  const raw  = adm.admissionDate || adm.createdAt;
  const date = raw ? new Date(raw) : null;
  if (!date || isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

/* ══════════════════════════════════════
   GOOGLE DRIVE HELPERS
══════════════════════════════════════ */

/* Load Google API scripts */
const loadGapiScript = () =>
  new Promise((res) => {
    if (window.gapi) { res(); return; }
    const s = document.createElement("script");
    s.src = "https://apis.google.com/js/api.js";
    s.onload = res;
    document.head.appendChild(s);
  });

const loadGisScript = () =>
  new Promise((res) => {
    if (window.google?.accounts) { res(); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = res;
    document.head.appendChild(s);
  });

/* Get OAuth token */
const getDriveToken = () =>
  new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope:     DRIVE_SCOPE,
      callback:  (resp) => {
        if (resp.error) reject(new Error(resp.error));
        else resolve(resp.access_token);
      },
    });
    client.requestAccessToken({ prompt: "consent" });
  });

/* Create a folder in Drive; returns folder ID */
const createDriveFolder = async (token, name, parentId = null) => {
  const meta = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    ...(parentId ? { parents: [parentId] } : {}),
  };
  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify(meta),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Folder creation failed");
  return data.id;
};

/* Check if folder with that name already exists under parent */
const findDriveFolder = async (token, name, parentId = null) => {
  const q = parentId
    ? `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`
    : `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.files?.[0]?.id || null;
};

/* Get or create folder (idempotent) */
const getOrCreateFolder = async (token, name, parentId = null) => {
  const existing = await findDriveFolder(token, name, parentId);
  if (existing) return existing;
  return createDriveFolder(token, name, parentId);
};

/* Upload a file (Blob) to Drive inside folderId */
const uploadFileToDrive = async (token, blob, fileName, mimeType, folderId) => {
  const meta     = JSON.stringify({ name: fileName, parents: [folderId] });
  const form     = new FormData();
  form.append("metadata", new Blob([meta], { type: "application/json" }));
  form.append("file",     new Blob([blob],  { type: mimeType }));
  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.id;
};

/* Convert a single PDF page to JPEG blob using Canvas */
const pdfPageToJpegBlob = (pdfJsPage, scale = 1.5) =>
  new Promise(async (resolve, reject) => {
    try {
      const viewport = pdfJsPage.getViewport({ scale });
      const canvas   = document.createElement("canvas");
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      await pdfJsPage.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      canvas.toBlob(resolve, "image/jpeg", 0.88);
    } catch (e) { reject(e); }
  });

/* Load PDF.js lazily */
const loadPdfJs = async () => {
  if (window.pdfjsLib) return window.pdfjsLib;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src   = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return window.pdfjsLib;
};

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function AdmissionsOnlyPanel() {
  const [admissions, setAdmissions]         = useState([]);
  const [loading, setLoading]               = useState(false);
  const [selected, setSelected]             = useState(null);
  const [verifyModal, setVerifyModal]       = useState(null);
  const [verifyStatus, setVerifyStatus]     = useState("done");
  const [verifyRemark, setVerifyRemark]     = useState("");
  const [verifying, setVerifying]           = useState(false);
  const [toast, setToast]                   = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  /* Drive upload */
  const [driveUploading, setDriveUploading] = useState(false);
  const [driveProgress, setDriveProgress]   = useState("");

  /* Rejected Summary Modal */
  const [rejectedModal, setRejectedModal]     = useState(false);
  const [rejectedFilter, setRejectedFilter]   = useState({ counselor: "all", month: "all" });
  const [rejCalendarOpen, setRejCalendarOpen] = useState(false);
  const rejCalendarRef                        = useRef(null);

  /* Drill-down filter state */
  const [filterCounselor, setFilterCounselor] = useState("");
  const [filterMonth, setFilterMonth]         = useState("all");
  const [filterStatus, setFilterStatus]       = useState("all");
  const [searchText, setSearchText]           = useState("");
  const [calendarOpen, setCalendarOpen]       = useState(false);
  const calendarRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setCalendarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  useEffect(() => {
    if (!rejCalendarOpen) return;
    const handler = (e) => {
      if (rejCalendarRef.current && !rejCalendarRef.current.contains(e.target)) setRejCalendarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [rejCalendarOpen]);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/ad", { params: { limit: 5000 } });
      if (res.data.success) setAdmissions(res.data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  /* Refresh admissions when rejected modal opens so status is always live */
  useEffect(() => {
    if (rejectedModal) fetchAdmissions();
  }, [rejectedModal, fetchAdmissions]);

  /* ══════════════════════════════════════
     SHARE TO DRIVE
     Folder structure:
       AdmissionsApp/
         {Session: counselorName - Month Year}/
           {StudentName}/
             doc1_page1.jpg
             doc1_page2.jpg
             doc2_page1.jpg
             ...
  ══════════════════════════════════════ */
  const shareStudentToDrive = async (adm) => {
    const docs = (adm.documents || []).filter((d) => d.fileUrl);
    if (docs.length === 0) { showToast("❌ Koi document nahi hai upload karne ke liye!"); return; }

    setDriveUploading(true);
    setDriveProgress("🔐 Google se connect ho rahe hain...");

    try {
      await loadGapiScript();
      await loadGisScript();
      const token = await getDriveToken();

      /* Determine session year → fixed Drive folder */
      const admMonth   = getAdmissionMonth(adm);
      const admYear    = admMonth ? admMonth.split("-")[0] : String(new Date().getFullYear());
      const monthLabel = admMonth ? formatMonthLabel(admMonth) : "Unknown Month";
      const sessionName = `${(adm.counselorName || "Unknown").trim()} - ${monthLabel}`;

      /* Hardcoded session root folder IDs */
      const SESSION_FOLDERS = {
        "2026": "1SUbw7jmuhrxMAtvkeOA733xP0xK4dOUb",
        "2025": "1eU63HebOlUeOjqusz_I1ooFKsu-dZMbi",
      };

      const sessionRootId = SESSION_FOLDERS[admYear];
      if (!sessionRootId) {
        throw new Error(`${admYear} ka session folder configure nahi hai. Abhi sirf 2025 aur 2026 supported hain.`);
      }

      setDriveProgress("📁 Student folder bana rahe hain...");

      /* Session root (fixed) → Counselor-Month subfolder → Student */
      const counselorMonthId = await getOrCreateFolder(token, sessionName, sessionRootId);
      const studentId        = await getOrCreateFolder(token, adm.studentName?.trim() || "Unknown Student", counselorMonthId);

      const pdfjs = await loadPdfJs();

      let totalUploaded = 0;

      for (let di = 0; di < docs.length; di++) {
        const doc = docs[di];
        const fileNameBase = doc.fileName?.replace(/\.[^.]+$/, "") || `file_${di + 1}`;
        const fileType     = (doc.fileType || "").toLowerCase();
        const fileName     = (doc.fileName || "").toLowerCase();
        const isPdf        = fileType.includes("pdf") || fileName.endsWith(".pdf");
        const isImage      = fileType.includes("image") || fileName.match(/\.(jpg|jpeg|png)$/);

        setDriveProgress(`📥 File ${di + 1}/${docs.length}: ${doc.fileName} fetch ho rahi hai...`);

        try {
          const res = await fetch(toSecureUrl(doc.fileUrl));
          if (!res.ok) throw new Error("Fetch failed");
          const arrayBuffer = await res.arrayBuffer();

          if (isPdf) {
            /* Convert each page to JPG */
            setDriveProgress(`🖼️ PDF → JPG convert ho raha hai: ${doc.fileName}`);
            const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            for (let pi = 1; pi <= pdfDoc.numPages; pi++) {
              const page     = await pdfDoc.getPage(pi);
              const jpgBlob  = await pdfPageToJpegBlob(page, 1.8);
              const imgName  = `${fileNameBase}_page${pi}.jpg`;
              setDriveProgress(`☁️ Upload: ${imgName} (${pi}/${pdfDoc.numPages})`);
              await uploadFileToDrive(token, jpgBlob, imgName, "image/jpeg", studentId);
              totalUploaded++;
            }
          } else if (isImage) {
            /* Upload image directly */
            const ext      = fileName.endsWith(".png") ? "png" : "jpg";
            const mime     = ext === "png" ? "image/png" : "image/jpeg";
            const imgName  = `${fileNameBase}.${ext}`;
            setDriveProgress(`☁️ Upload: ${imgName}`);
            await uploadFileToDrive(token, new Blob([arrayBuffer], { type: mime }), imgName, mime, studentId);
            totalUploaded++;
          }
        } catch (err) {
          console.error(`Skipped: ${doc.fileName}`, err);
          showToast(`⚠️ Skip: ${doc.fileName}`);
        }
      }

      setDriveProgress("");
      showToast(`✅ ${totalUploaded} images Drive mein upload ho gayi! ${admYear} Session → ${sessionName} → ${adm.studentName}`);
    } catch (err) {
      setDriveProgress("");
      if (err.message?.includes("popup")) {
        showToast("⚠️ Popup block hua — browser mein popup allow karo");
      } else {
        showToast("❌ Drive upload fail: " + err.message);
      }
      console.error(err);
    } finally {
      setDriveUploading(false);
    }
  };

  /* ══════════════════════════════════════
     REJECTED SUMMARY DATA
  ══════════════════════════════════════ */
  const rejectedSummaryRows = (() => {
    const rows = [];
    admissions.forEach((adm) => {
      (adm.documents || []).forEach((doc) => {
        if (doc.status !== "rejected") return;
        rows.push({
          counselorName: adm.counselorName?.trim() || "—",
          studentName:   adm.studentName?.trim()   || "—",
          fileName:      doc.fileName               || "—",
          adminRemark:   doc.adminRemark             || "No remark",
          month:         getAdmissionMonth(adm)      || "unknown",
          uploadedAt:    doc.uploadedAt,
        });
      });
    });
    return rows;
  })();

  const rejectedCounselors = [...new Set(rejectedSummaryRows.map((r) => r.counselorName))].sort();
  const rejectedMonths     = [...new Set(rejectedSummaryRows.map((r) => r.month))].sort().reverse();

  const filteredRejected = rejectedSummaryRows.filter((r) => {
    if (rejectedFilter.counselor !== "all" && r.counselorName !== rejectedFilter.counselor) return false;
    if (rejectedFilter.month     !== "all" && r.month          !== rejectedFilter.month)     return false;
    return true;
  });

  /* Group by month for display */
  const rejectedByMonth = filteredRejected.reduce((acc, r) => {
    const key = r.month;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  /* ── Existing helpers ── */
  const downloadAllDocsAsSinglePDF = async (studentName, documents) => {
    const allFiles = (documents || []).filter((d) => d.fileUrl);
    if (allFiles.length === 0) { showToast("❌ Koi document nahi mila!"); return; }
    setDownloadingPdf(true);
    showToast("📄 Documents merge ho rahe hain...");
    try {
      const masterPdf = await PDFDocument.create();
      let successfulFiles = 0;
      for (const doc of allFiles) {
        try {
          const secureUrl  = toSecureUrl(doc.fileUrl);
          const response   = await fetch(secureUrl);
          if (!response.ok) throw new Error("Fetch failed");
          const arrayBuffer = await response.arrayBuffer();
          const fileType    = doc.fileType?.toLowerCase() || "";
          const isPdf       = fileType.includes("pdf") || doc.fileName.toLowerCase().endsWith(".pdf");
          const isImage     = fileType.includes("image") || doc.fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/);
          if (isPdf) {
            const srcPdf      = await PDFDocument.load(arrayBuffer);
            const copiedPages = await masterPdf.copyPages(srcPdf, srcPdf.getPageIndices());
            copiedPages.forEach((page) => masterPdf.addPage(page));
            successfulFiles++;
          } else if (isImage) {
            const image = doc.fileName.toLowerCase().endsWith(".png") || fileType.includes("png")
              ? await masterPdf.embedPng(arrayBuffer)
              : await masterPdf.embedJpg(arrayBuffer);
            const page = masterPdf.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            successfulFiles++;
          }
        } catch (err) { console.error(`Skipped: ${doc.fileName}`, err); }
      }
      if (successfulFiles === 0) throw new Error("Koi file process nahi ho saki.");
      const pdfBytes = await masterPdf.save();
      const blob     = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `${studentName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_combined_documents.pdf`);
      showToast(`✅ ${successfulFiles} files merge karke download ho gaya!`);
    } catch (err) { showToast("❌ Merge fail: " + err.message); }
    finally { setDownloadingPdf(false); }
  };

  const deleteDoc = async (admissionId, docId) => {
    if (!window.confirm("Is document ko delete karna chahte hain?")) return;
    try {
      const res = await api.delete(`/api/v1/ad/${admissionId}/documents/${docId}`);
      if (res.data.success) {
        showToast("🗑️ Document delete ho gaya");
        fetchAdmissions();
        if (selected?._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
  };

  const verifyDoc = async () => {
    if (verifyStatus === "rejected" && !verifyRemark.trim()) { showToast("❌ Rejection reason zaroori hai"); return; }
    setVerifying(true);
    try {
      const res = await api.put(
        `/api/v1/ad/${verifyModal.admissionId}/documents/${verifyModal.docId}/verify`,
        { status: verifyStatus, adminRemark: verifyRemark }
      );
      if (res.data.success) {
        showToast(verifyStatus === "done" ? "✅ Approved!" : "❌ Rejected");
        setVerifyModal(null); setVerifyRemark(""); setVerifyStatus("done");
        fetchAdmissions();
        if (selected) {
          const r2 = await api.get(`/api/v1/ad/${selected._id}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
    setVerifying(false);
  };

  const verifyAll = async (admissionId, status, remark = "") => {
    if (status === "rejected" && !remark.trim()) { showToast("Remark zaroori hai"); return; }
    try {
      const res = await api.put(`/api/v1/ad/${admissionId}/documents/verify-all`, { status, adminRemark: remark });
      if (res.data.success) {
        showToast("✅ Docs updated!");
        fetchAdmissions();
        if (selected?._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
  };

  /* ── Filter pipeline ── */
  const handleCounselorChange = (val) => { setFilterCounselor(val.trim()); setFilterMonth("all"); setFilterStatus("all"); setSearchText(""); setCalendarOpen(false); };
  const handleMonthChange     = (val) => { setFilterMonth(val); setFilterStatus("all"); setCalendarOpen(false); };
  const handleStatusChange    = (val) => setFilterStatus(val);
  const clearAllFilters = () => { setFilterCounselor(""); setFilterMonth("all"); setFilterStatus("all"); setSearchText(""); setCalendarOpen(false); };

  const counselors = [...new Map(
    admissions.filter((a) => a.counselorName?.trim()).map((a) => [normName(a.counselorName), a.counselorName.trim()])
  ).values()];

  const afterCounselor = filterCounselor ? admissions.filter((a) => normName(a.counselorName) === normName(filterCounselor)) : admissions;
  const afterMonth     = filterMonth !== "all" ? afterCounselor.filter((a) => getAdmissionMonth(a) === filterMonth) : afterCounselor;
  const filteredAdmissions = afterMonth.filter((a) => {
    if (searchText) {
      const q = searchText.toLowerCase();
      if (!a.studentName?.toLowerCase().includes(q) && !a.email?.toLowerCase().includes(q) && !a.phone?.includes(searchText)) return false;
    }
    const docs = a.documents || [];
    if (filterStatus === "has_pending"  && !docs.some((d) => d.status === "pending"))                    return false;
    if (filterStatus === "all_done"     && !(docs.length > 0 && docs.every((d) => d.status === "done"))) return false;
    if (filterStatus === "has_rejected" && !docs.some((d) => d.status === "rejected"))                   return false;
    if (filterStatus === "no_docs"      && docs.length !== 0)                                            return false;
    return true;
  });

  const statusCounts = {
    total:        afterMonth.length,
    has_pending:  afterMonth.filter((a) => (a.documents||[]).some((d) => d.status === "pending")).length,
    all_done:     afterMonth.filter((a) => (a.documents||[]).length > 0 && (a.documents||[]).every((d) => d.status === "done")).length,
    has_rejected: afterMonth.filter((a) => (a.documents||[]).some((d) => d.status === "rejected")).length,
    no_docs:      afterMonth.filter((a) => (a.documents||[]).length === 0).length,
  };

  const admissionMonths = [...new Set(afterCounselor.map((a) => getAdmissionMonth(a)).filter(Boolean))].sort().reverse();
  const monthsByYear    = admissionMonths.reduce((acc, ym) => { const [y] = ym.split("-"); if (!acc[y]) acc[y] = []; acc[y].push(ym); return acc; }, {});

  const primaryStats = {
    totalAdmissions:  afterMonth.length,
    totalPendingDocs: afterMonth.reduce((acc, a) => acc + (a.documents||[]).filter((d) => d.status === "pending").length, 0),
    totalDocs:        afterMonth.reduce((acc, a) => acc + (a.documents||[]).length, 0),
    verifiedStudents: afterMonth.filter((a) => (a.documents||[]).length > 0 && (a.documents||[]).every((d) => d.status === "done")).length,
  };

  const monthDisabled      = !filterCounselor;
  const statusDisabled     = filterMonth === "all";
  const activeFiltersExist = filterCounselor || filterStatus !== "all" || filterMonth !== "all" || searchText;

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Drive Upload Progress Overlay */}
      {driveUploading && (
        <div style={s.progressOverlay}>
          <div style={s.progressBox}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>☁️</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1E293B", marginBottom: 8 }}>Google Drive Upload</div>
            <div style={{ fontSize: 13, color: "#64748B", textAlign: "center", lineHeight: 1.6 }}>{driveProgress}</div>
            <div style={s.progressBarTrack}>
              <div style={s.progressBarFill} />
            </div>
          </div>
        </div>
      )}

      <div style={s.mainFull}>

        {/* ════════════ LIST VIEW ════════════ */}
        {!selected ? (
          <div>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>👨‍🎓 Admissions Management</h1>

              {/* ── Rejected Summary Button ── */}
              <button
                onClick={() => setRejectedModal(true)}
                style={s.rejectedSummaryBtn}
              >
                ❌ Rejected Summary
                {rejectedSummaryRows.length > 0 && (
                  <span style={s.rejBadge}>{rejectedSummaryRows.length}</span>
                )}
              </button>

              <button onClick={fetchAdmissions} style={s.refreshBtn}>🔄 Refresh</button>
            </div>

            {/* Drill-down hint */}
            <div style={s.drillHint}>
              <span style={{ ...s.drillStep, background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE" }}>1 · Select Counselor</span>
              <span style={s.drillArrow}>→</span>
              <span style={{ ...s.drillStep, background: monthDisabled ? "#F1F5F9" : "#ECFDF5", color: monthDisabled ? "#94A3B8" : "#059669", border: `1px solid ${monthDisabled ? "#E2E8F0" : "#6EE7B7"}` }}>2 · Pick Month</span>
              <span style={s.drillArrow}>→</span>
              <span style={{ ...s.drillStep, background: statusDisabled ? "#F1F5F9" : "#FFF8E1", color: statusDisabled ? "#94A3B8" : "#D97706", border: `1px solid ${statusDisabled ? "#E2E8F0" : "#FDE68A"}` }}>3 · Filter Status</span>
            </div>

            {/* Filter row */}
            <div style={s.filtersRow}>
              <input style={s.searchInput} placeholder="🔍 Student name, email, phone..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              <select style={{ ...s.select, borderColor: filterCounselor ? "#6366F1" : "#E5E7EB", fontWeight: filterCounselor ? 600 : 400 }} value={filterCounselor} onChange={(e) => handleCounselorChange(e.target.value)}>
                <option value="">👤 All Counselors</option>
                {counselors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <div ref={calendarRef} style={{ position: "relative", flex: 1, minWidth: 185 }}>
                <button disabled={monthDisabled} onClick={() => !monthDisabled && setCalendarOpen((o) => !o)} style={{ ...s.select, width: "100%", textAlign: "left", cursor: monthDisabled ? "not-allowed" : "pointer", borderColor: filterMonth !== "all" ? "#10B981" : monthDisabled ? "#F1F5F9" : "#E5E7EB", fontWeight: filterMonth !== "all" ? 600 : 400, background: monthDisabled ? "#F8FAFC" : "#fff", color: monthDisabled ? "#94A3B8" : "#111827", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
                  <span>{filterMonth !== "all" ? `📅 ${formatMonthLabel(filterMonth)}` : monthDisabled ? "📅 Pick counselor first" : "📅 All Months"}</span>
                  <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 8 }}>▾</span>
                </button>
                {calendarOpen && !monthDisabled && (
                  <div style={s.calendarDropdown}>
                    <div style={s.calendarHeader}>📅 {filterCounselor} — select month</div>
                    {admissionMonths.length === 0 ? (
                      <div style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", padding: "16px 0" }}>No admissions for this counselor</div>
                    ) : Object.keys(monthsByYear).sort().reverse().map((year) => (
                      <div key={year} style={{ marginBottom: 14 }}>
                        <div style={s.calendarYear}>{year}</div>
                        <div style={s.calendarGrid}>
                          {monthsByYear[year].map((ym) => {
                            const mIdx = parseInt(ym.split("-")[1], 10) - 1;
                            const isActive = filterMonth === ym;
                            const cnt = afterCounselor.filter((a) => getAdmissionMonth(a) === ym).length;
                            return (
                              <button key={ym} onClick={() => handleMonthChange(ym)} style={{ ...s.calendarCell, borderColor: isActive ? "#10B981" : "#E5E7EB", background: isActive ? "#ECFDF5" : "#fff", color: isActive ? "#059669" : "#374151", fontWeight: isActive ? 700 : 400 }}>
                                <div>{MONTH_SHORT[mIdx]}</div>
                                <div style={{ fontSize: 10, color: isActive ? "#059669" : "#94A3B8", marginTop: 2 }}>{cnt}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {filterMonth !== "all" && <button onClick={() => handleMonthChange("all")} style={s.calendarClearBtn}>Clear month ✕</button>}
                  </div>
                )}
              </div>

              <select disabled={statusDisabled} style={{ ...s.select, borderColor: filterStatus !== "all" ? "#F59E0B" : statusDisabled ? "#F1F5F9" : "#E5E7EB", fontWeight: filterStatus !== "all" ? 600 : 400, cursor: statusDisabled ? "not-allowed" : "pointer", background: statusDisabled ? "#F8FAFC" : "#fff", color: statusDisabled ? "#94A3B8" : "#111827" }} value={filterStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                <option value="all">📋 All Status ({statusCounts.total})</option>
                <option value="has_pending">⏳ Pending Docs ({statusCounts.has_pending})</option>
                <option value="all_done">✅ All Approved ({statusCounts.all_done})</option>
                <option value="has_rejected">❌ Has Rejected ({statusCounts.has_rejected})</option>
                <option value="no_docs">📭 No Docs Yet ({statusCounts.no_docs})</option>
              </select>
            </div>

            {/* Active filter chips */}
            {activeFiltersExist && (
              <div style={s.activeFiltersRow}>
                <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Active:</span>
                {filterCounselor && <span style={s.filterChipPrimary}>👤 {filterCounselor}<button onClick={() => handleCounselorChange("")} style={s.chipX}>✕</button></span>}
                {filterMonth !== "all" && <span style={s.filterChipGreen}>📅 {formatMonthLabel(filterMonth)}<button onClick={() => handleMonthChange("all")} style={s.chipX}>✕</button></span>}
                {filterStatus !== "all" && <span style={s.filterChipSecondary}>{filterStatus === "has_pending" ? "⏳ Pending" : filterStatus === "all_done" ? "✅ Approved" : filterStatus === "has_rejected" ? "❌ Rejected" : "📭 No Docs"}<button onClick={() => handleStatusChange("all")} style={s.chipX}>✕</button></span>}
                {searchText && <span style={s.filterChipSecondary}>🔍 "{searchText}"<button onClick={() => setSearchText("")} style={s.chipX}>✕</button></span>}
                <button onClick={clearAllFilters} style={s.clearAllChip}>Clear All ✕</button>
              </div>
            )}

            {/* Stats strip */}
            {filterCounselor && filterMonth !== "all" && (
              <div style={s.monthStatStrip}>
                <div style={s.monthStatItem}><span style={{ fontSize: 20, fontWeight: 800, color: "#6366F1" }}>{primaryStats.totalAdmissions}</span><span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Total Admissions</span></div>
                <div style={s.monthStatDivider} />
                <div style={s.monthStatItem}><span style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{primaryStats.totalPendingDocs}</span><span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Pending Docs</span></div>
                <div style={s.monthStatDivider} />
                <div style={s.monthStatItem}><span style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{primaryStats.verifiedStudents}</span><span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Fully Verified</span></div>
                <div style={s.monthStatDivider} />
                <div style={s.monthStatItem}><span style={{ fontSize: 20, fontWeight: 800, color: "#334155" }}>{primaryStats.totalDocs}</span><span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Total Docs</span></div>
                <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ ...s.monthBadge, background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE" }}>👤 {filterCounselor}</span>
                  <span style={{ ...s.monthBadge, background: "#ECFDF5", color: "#059669", border: "1px solid #6EE7B7" }}>📅 {formatMonthLabel(filterMonth)}</span>
                </div>
              </div>
            )}

            <div style={s.resultCount}>{filteredAdmissions.length} admission(s) found{activeFiltersExist && <span style={{ color: "#6366F1", fontWeight: 600 }}> (filtered)</span>}</div>

            {loading ? (
              <div style={s.loading}>Loading Admissions Data...</div>
            ) : filteredAdmissions.length === 0 ? (
              <div style={s.empty}>{filterCounselor && filterMonth !== "all" ? `"${filterCounselor}" ke liye ${formatMonthLabel(filterMonth)} mein koi admission nahi mila` : filterCounselor ? `"${filterCounselor}" counselor ke liye koi admission nahi mila` : "Koi admission nahi mila — filters clear karo"}</div>
            ) : (
              <div style={s.admissionListStack}>
                {filteredAdmissions.map((adm) => {
                  const docs     = adm.documents || [];
                  const pending  = docs.filter((d) => d.status === "pending").length;
                  const done     = docs.filter((d) => d.status === "done").length;
                  const rejected = docs.filter((d) => d.status === "rejected").length;
                  return (
                    <div key={adm._id} style={s.admListItem} onClick={() => setSelected(adm)}>
                      <div style={s.admListLeft}>
                        <div style={s.admAvatar}>{adm.studentName?.[0]?.toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={s.admName}>{adm.studentName}</div>
                          <div style={s.admMeta}>Counselor: <span style={{ fontWeight: 600, color: "#475569" }}>{adm.counselorName?.trim()}</span></div>
                          {(adm.admissionDate || adm.createdAt) && (
                            <div style={s.admMonthTag}>📅 {new Date(adm.admissionDate || adm.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                          )}
                        </div>
                      </div>
                      <div style={s.admListMid}>
                        <div style={s.admListInfoItem}><span>📚 Course:</span> <strong>{adm.course || "—"}</strong></div>
                        <div style={s.admListInfoItem}><span>📱 Phone:</span> <strong>{adm.phone}</strong></div>
                      </div>
                      <div style={s.admListRight}>
                        <div style={s.docPills}>
                          <span style={{ ...s.pill, background: "#FFF8E1", color: "#F59E0B" }}>⏳ {pending}</span>
                          <span style={{ ...s.pill, background: "#ECFDF5", color: "#10B981" }}>✅ {done}</span>
                          <span style={{ ...s.pill, background: "#FEF2F2", color: "#EF4444" }}>❌ {rejected}</span>
                          <span style={{ ...s.pill, background: "#EEF2FF", color: "#6366F1" }}>📁 {docs.length}</span>
                        </div>
                        {pending > 0 && <span style={s.pendingDot}>{pending}</span>}
                        <span style={s.listArrow}>➔</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        ) : (
          /* ════════════ DETAIL VIEW ════════════ */
          <div>
            <div style={s.pageHeader}>
              <button onClick={() => setSelected(null)} style={s.backBtn}>← Back To List</button>
              <h1 style={s.pageTitle}>{selected.studentName}</h1>
            </div>

            <div style={{ ...s.card, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[["Course", selected.course], ["University", selected.universityName], ["Branch", selected.branch], ["Email", selected.email], ["Phone", selected.phone], ["Counselor", selected.counselorName], ["Aadhar Number", selected.adhraNumber]].map(([k, v]) => v ? (
                  <div key={k} style={{ minWidth: 150 }}>
                    <div style={s.infoLabel}>{k}</div>
                    <div style={s.infoVal}>{v}</div>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* Actions Bar */}
            <div style={s.bulkActions}>
              <span style={s.bulkLabel}>Actions:</span>
              {(selected.documents || []).some((d) => d.status === "pending") && (
                <button onClick={() => verifyAll(selected._id, "done")} style={{ ...s.bulkBtn, background: "#10B981", color: "#fff" }}>✅ Approve All Pending</button>
              )}
              <button onClick={() => downloadAllDocsAsSinglePDF(selected.studentName, selected.documents)} disabled={downloadingPdf} style={{ ...s.bulkBtn, background: "#6366F1", color: "#fff", opacity: downloadingPdf ? 0.7 : 1, cursor: downloadingPdf ? "not-allowed" : "pointer" }}>
                📥 {downloadingPdf ? "Merging..." : "Download Combined PDF"}
              </button>

              {/* ── SHARE TO DRIVE BUTTON ── */}
              <button
                onClick={() => shareStudentToDrive(selected)}
                disabled={driveUploading}
                style={{
                  ...s.bulkBtn,
                  background:  driveUploading ? "#94A3B8" : "linear-gradient(135deg, #4285F4, #34A853)",
                  color:       "#fff",
                  opacity:     driveUploading ? 0.7 : 1,
                  cursor:      driveUploading ? "not-allowed" : "pointer",
                  display:     "flex", alignItems: "center", gap: 6,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                {driveUploading ? "Uploading..." : "Share to Drive"}
              </button>
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>
                Documents ({(selected.documents || []).length})
                {(selected.documents || []).filter((d) => d.status === "pending").length > 0 && (
                  <span style={s.pendingInlineTag}>⏳ {(selected.documents || []).filter((d) => d.status === "pending").length} pending</span>
                )}
              </h2>
              {(selected.documents || []).length === 0 ? (
                <div style={s.noDocState}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                  <div style={{ fontWeight: 600, color: "#94A3B8", fontSize: 15 }}>Koi document upload nahi hua</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", marginTop: 4 }}>Is student ne abhi tak koi bhi file submit nahi ki hai.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(selected.documents || []).map((doc) => {
                    const sc        = statusColor[doc.status] || statusColor.pending;
                    const isApproved = doc.status === "done";
                    return (
                      <div key={doc._id} style={{
                        ...s.docRow,
                        background:   isApproved ? "#F0FDF4" : "#F8FAFC",
                        border:       isApproved ? "1px solid #BBF7D0" : "1px solid #F1F5F9",
                        opacity:      isApproved ? 0.88 : 1,
                      }}>
                        <span style={{ fontSize: 24 }}>{isApproved ? "✅" : fileIcon(doc.fileType)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...s.docName, color: isApproved ? "#166534" : "#1E293B" }}>{doc.fileName}</div>
                          <div style={s.docMeta}>
                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString("hi-IN") : ""}
                            {isApproved && " • ✅ Approved"}
                            {doc.adminRemark && !isApproved ? ` • 💬 ${doc.adminRemark}` : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {doc.fileUrl && <a href={toSecureUrl(doc.fileUrl)} target="_blank" rel="noreferrer" style={s.viewFileBtn}>👁️ View</a>}
                          <span style={{ ...s.statusBadge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                          {!isApproved ? (
                            <button
                              onClick={() => { setVerifyModal({ admissionId: selected._id, docId: doc._id, fileName: doc.fileName }); setVerifyStatus("done"); setVerifyRemark(""); }}
                              style={s.verifyBtn}
                            >
                              Verify
                            </button>
                          ) : (
                            <button
                              onClick={() => { setVerifyModal({ admissionId: selected._id, docId: doc._id, fileName: doc.fileName }); setVerifyStatus("rejected"); setVerifyRemark(""); }}
                              style={{ ...s.verifyBtn, background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5" }}
                            >
                              ↩ Reject
                            </button>
                          )}
                          <button onClick={() => deleteDoc(selected._id, doc._id)} style={s.deleteBtn}>🗑️ Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════════════ VERIFY MODAL ════════════ */}
      {verifyModal && (
        <div style={s.modalOverlay} onClick={() => setVerifyModal(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Document Verify Karo</h3>
            <p style={{ margin: "0 0 16px", color: "#94A3B8", fontSize: 13 }}>📄 {verifyModal.fileName}</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {["done", "rejected"].map((st) => (
                <button key={st} onClick={() => setVerifyStatus(st)} style={{ ...s.statusToggle, background: verifyStatus === st ? (st === "done" ? "#10B981" : "#EF4444") : "#F1F5F9", color: verifyStatus === st ? "#fff" : "#64748B" }}>
                  {st === "done" ? "✅ Approve" : "❌ Reject"}
                </button>
              ))}
            </div>
            {verifyStatus === "rejected" && (
              <div style={{ marginBottom: 16 }}>
                <label style={s.modalLabel}>Rejection Reason *</label>
                <textarea style={s.textarea} rows={3} placeholder="e.g. Image blurry hai..." value={verifyRemark} onChange={(e) => setVerifyRemark(e.target.value)} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setVerifyModal(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={verifyDoc} disabled={verifying} style={{ ...s.confirmBtn, background: verifyStatus === "done" ? "#10B981" : "#EF4444", opacity: verifying ? 0.7 : 1 }}>
                {verifying ? "Processing..." : verifyStatus === "done" ? "✅ Approve" : "❌ Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ REJECTED SUMMARY MODAL ════════════ */}
      {rejectedModal && (
        <div style={s.modalOverlay} onClick={() => setRejectedModal(false)}>
          <div style={{ ...s.modal, maxWidth: 780, width: "95%", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1E293B" }}>❌ Rejected Documents Summary</h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94A3B8" }}>{filteredRejected.length} rejected document(s)</p>
              </div>
              <button onClick={() => setRejectedModal(false)} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 18, color: "#64748B" }}>✕</button>
            </div>

            {/* Live data note */}
            <div style={{ fontSize: 11, color: "#10B981", background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 6, padding: "4px 10px", marginBottom: 10, display: "inline-flex", alignItems: "center", gap: 5, alignSelf: "flex-start" }}>
              🔴 Live — deleted/approved docs yahan nahi dikhenge
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "stretch" }}>

              {/* Counselor select */}
              <select
                style={{ ...s.select, flex: 1, minWidth: 160, borderColor: rejectedFilter.counselor !== "all" ? "#6366F1" : "#E5E7EB", fontWeight: rejectedFilter.counselor !== "all" ? 600 : 400 }}
                value={rejectedFilter.counselor}
                onChange={(e) => setRejectedFilter((p) => ({ ...p, counselor: e.target.value, month: "all" }))}
              >
                <option value="all">👤 All Counselors</option>
                {rejectedCounselors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Month — calendar picker */}
              {(() => {
                /* Months available for selected counselor (or all) */
                const availMonths = rejectedFilter.counselor === "all"
                  ? rejectedMonths
                  : [...new Set(
                      rejectedSummaryRows
                        .filter((r) => r.counselorName === rejectedFilter.counselor)
                        .map((r) => r.month)
                    )].sort().reverse();

                const rejMonthsByYear = availMonths.reduce((acc, ym) => {
                  const [y] = ym.split("-");
                  if (!acc[y]) acc[y] = [];
                  acc[y].push(ym);
                  return acc;
                }, {});

                return (
                  <div ref={rejCalendarRef} style={{ position: "relative", flex: 1, minWidth: 185 }}>
                    <button
                      onClick={() => setRejCalendarOpen((o) => !o)}
                      style={{
                        ...s.select,
                        width: "100%", height: "100%",
                        textAlign: "left", cursor: "pointer",
                        borderColor: rejectedFilter.month !== "all" ? "#10B981" : "#E5E7EB",
                        fontWeight:  rejectedFilter.month !== "all" ? 600 : 400,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        userSelect: "none",
                        color: "#111827",
                      }}
                    >
                      <span>
                        {rejectedFilter.month !== "all"
                          ? `📅 ${formatMonthLabel(rejectedFilter.month)}`
                          : "📅 All Months"}
                      </span>
                      <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 8 }}>▾</span>
                    </button>

                    {rejCalendarOpen && (
                      <div style={{ ...s.calendarDropdown, zIndex: 300 }}>
                        <div style={s.calendarHeader}>
                          📅 {rejectedFilter.counselor !== "all" ? rejectedFilter.counselor : "All Counselors"} — month chunein
                        </div>

                        {availMonths.length === 0 ? (
                          <div style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", padding: "16px 0" }}>
                            Koi rejected doc nahi is counselor ke liye
                          </div>
                        ) : (
                          Object.keys(rejMonthsByYear).sort().reverse().map((year) => (
                            <div key={year} style={{ marginBottom: 14 }}>
                              <div style={s.calendarYear}>{year}</div>
                              <div style={s.calendarGrid}>
                                {rejMonthsByYear[year].map((ym) => {
                                  const mIdx    = parseInt(ym.split("-")[1], 10) - 1;
                                  const isAct   = rejectedFilter.month === ym;
                                  /* Count rejected docs in this month */
                                  const cnt = rejectedSummaryRows.filter((r) =>
                                    r.month === ym &&
                                    (rejectedFilter.counselor === "all" || r.counselorName === rejectedFilter.counselor)
                                  ).length;
                                  return (
                                    <button
                                      key={ym}
                                      onClick={() => { setRejectedFilter((p) => ({ ...p, month: ym })); setRejCalendarOpen(false); }}
                                      style={{
                                        ...s.calendarCell,
                                        borderColor: isAct ? "#EF4444" : "#E5E7EB",
                                        background:  isAct ? "#FEF2F2" : "#fff",
                                        color:       isAct ? "#DC2626" : "#374151",
                                        fontWeight:  isAct ? 700 : 400,
                                      }}
                                    >
                                      <div>{MONTH_SHORT[mIdx]}</div>
                                      <div style={{ fontSize: 10, color: isAct ? "#DC2626" : "#94A3B8", marginTop: 2 }}>{cnt}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}

                        {rejectedFilter.month !== "all" && (
                          <button
                            onClick={() => { setRejectedFilter((p) => ({ ...p, month: "all" })); setRejCalendarOpen(false); }}
                            style={s.calendarClearBtn}
                          >
                            Clear month ✕
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {(rejectedFilter.counselor !== "all" || rejectedFilter.month !== "all") && (
                <button
                  onClick={() => { setRejectedFilter({ counselor: "all", month: "all" }); setRejCalendarOpen(false); }}
                  style={{ ...s.clearAllChip, alignSelf: "center", marginLeft: 0 }}
                >
                  Clear ✕
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filteredRejected.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                  <div style={{ fontWeight: 600 }}>Koi rejected document nahi mila!</div>
                </div>
              ) : (
                Object.keys(rejectedByMonth).sort().reverse().map((ym) => (
                  <div key={ym} style={{ marginBottom: 20 }}>
                    {/* Month header */}
                    <div style={s.rejMonthHeader}>
                      <span>📅 {formatMonthLabel(ym)}</span>
                      <span style={s.rejMonthCount}>{rejectedByMonth[ym].length} rejected</span>
                    </div>
                    {/* Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {rejectedByMonth[ym].map((row, idx) => (
                        <div key={idx} style={s.rejRow}>
                          <div style={s.rejAvatar}>{row.studentName[0]?.toUpperCase()}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={s.rejStudentName}>{row.studentName}</span>
                              <span style={s.rejCounselorChip}>👤 {row.counselorName}</span>
                            </div>
                            <div style={s.rejFileName}>📄 {row.fileName}</div>
                            <div style={s.rejRemark}>💬 {row.adminRemark}</div>
                          </div>
                          <div style={s.rejDate}>
                            {row.uploadedAt ? new Date(row.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const s = {
  page:                { display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Outfit', sans-serif" },
  mainFull:            { flex: 1, padding: "32px 40px", overflowY: "auto", width: "100%" },
  pageHeader:          { display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" },
  pageTitle:           { fontSize: 24, fontWeight: 800, color: "#1E293B", margin: 0 },
  refreshBtn:          { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginLeft: "auto" },
  backBtn:             { background: "#EEF2FF", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: "#6366F1", fontWeight: 600, fontFamily: "inherit" },

  rejectedSummaryBtn:  { display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA", borderRadius: 9, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" },
  rejBadge:            { background: "#DC2626", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 },

  drillHint:           { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  drillStep:           { fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "4px 12px" },
  drillArrow:          { fontSize: 12, color: "#CBD5E1" },
  filtersRow:          { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  searchInput:         { flex: 2, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit" },
  select:              { flex: 1, minWidth: 160, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" },
  calendarDropdown:    { position: "absolute", top: "110%", left: 0, zIndex: 200, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", padding: "16px", minWidth: 290 },
  calendarHeader:      { fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #F1F5F9" },
  calendarYear:        { fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 6, letterSpacing: 1 },
  calendarGrid:        { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 4 },
  calendarCell:        { padding: "7px 4px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "center" },
  calendarClearBtn:    { marginTop: 10, width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 },
  activeFiltersRow:    { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" },
  filterChipPrimary:   { display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  filterChipGreen:     { display: "inline-flex", alignItems: "center", gap: 6, background: "#ECFDF5", color: "#059669", border: "1px solid #6EE7B7", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  filterChipSecondary: { display: "inline-flex", alignItems: "center", gap: 6, background: "#FFF8E1", color: "#D97706", border: "1px solid #FDE68A", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  chipX:               { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "inherit", padding: "0 2px", lineHeight: 1, opacity: 0.7 },
  clearAllChip:        { marginLeft: "auto", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  resultCount:         { fontSize: 13, color: "#94A3B8", marginBottom: 14 },
  monthStatStrip:      { display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 20px", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  monthStatItem:       { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90, padding: "0 16px" },
  monthStatDivider:    { width: 1, height: 36, background: "#E2E8F0", flexShrink: 0 },
  monthBadge:          { borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600 },
  admissionListStack:  { display: "flex", flexDirection: "column", gap: 10 },
  admListItem:         { background: "#fff", borderRadius: 12, padding: "16px 24px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 },
  admListLeft:         { display: "flex", alignItems: "center", gap: 14, flex: "1", minWidth: 200 },
  admListMid:          { display: "flex", gap: 40, flex: "1.5", flexWrap: "wrap" },
  admListInfoItem:     { fontSize: 14, color: "#64748B" },
  admListRight:        { display: "flex", alignItems: "center", gap: 16 },
  listArrow:           { color: "#94A3B8", fontSize: 14, paddingLeft: 4 },
  admAvatar:           { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 },
  admName:             { fontWeight: 700, fontSize: 16, color: "#1E293B" },
  admMeta:             { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  admMonthTag:         { display: "inline-flex", alignItems: "center", marginTop: 4, background: "#EEF2FF", color: "#6366F1", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 600 },
  pendingDot:          { background: "#F59E0B", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  docPills:            { display: "flex", gap: 6, flexWrap: "wrap" },
  pill:                { padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  card:                { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 16 },
  cardTitle:           { fontSize: 17, fontWeight: 700, color: "#1E293B", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 },
  docRow:              { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" },
  docName:             { fontSize: 14, fontWeight: 500, color: "#1E293B" },
  docMeta:             { fontSize: 12, color: "#94A3B8", marginTop: 3 },
  statusBadge:         { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" },
  verifyBtn:           { background: "#6366F1", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", flexShrink: 0 },
  deleteBtn:           { background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", flexShrink: 0 },
  viewFileBtn:         { background: "#F1F5F9", color: "#374151", borderRadius: 8, padding: "5px 10px", fontSize: 12, textDecoration: "none", flexShrink: 0 },
  bulkActions:         { display: "flex", alignItems: "center", gap: 12, background: "#FFF8E1", borderRadius: 10, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap" },
  bulkLabel:           { fontSize: 14, fontWeight: 600, color: "#92400E" },
  bulkBtn:             { border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
  infoLabel:           { fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  infoVal:             { fontSize: 14, color: "#1E293B", fontWeight: 500, marginTop: 2 },
  noDocState:          { textAlign: "center", padding: "36px 20px", background: "#F8FAFC", borderRadius: 10, border: "1.5px dashed #E2E8F0" },
  pendingInlineTag:    { background: "#FFF8E1", color: "#D97706", border: "1px solid #FDE68A", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 },
  modalOverlay:        { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal:               { background: "#fff", borderRadius: 16, padding: 28, width: "90%", maxWidth: 420, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
  modalLabel:          { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  textarea:            { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" },
  statusToggle:        { flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" },
  cancelBtn:           { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit" },
  confirmBtn:          { flex: 2, padding: 10, borderRadius: 10, border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
  empty:               { textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 15 },
  loading:             { textAlign: "center", padding: "40px 20px", color: "#94A3B8" },
  toast:               { position: "fixed", bottom: 24, right: 24, background: "#1E293B", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },

  /* Drive Progress */
  progressOverlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  progressBox:         { background: "#fff", borderRadius: 16, padding: "32px 36px", minWidth: 320, maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  progressBarTrack:    { width: "100%", height: 6, background: "#E2E8F0", borderRadius: 99, marginTop: 20, overflow: "hidden" },
  progressBarFill:     { width: "60%", height: "100%", background: "linear-gradient(90deg,#4285F4,#34A853)", borderRadius: 99, animation: "progressPulse 1.5s ease-in-out infinite" },

  /* Rejected Summary */
  rejMonthHeader:      { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FEF2F2", borderRadius: 8, padding: "8px 14px", marginBottom: 8, fontWeight: 700, fontSize: 13, color: "#DC2626" },
  rejMonthCount:       { background: "#DC2626", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 },
  rejRow:              { display: "flex", alignItems: "flex-start", gap: 10, background: "#fff", border: "1px solid #FEE2E2", borderRadius: 10, padding: "12px 14px" },
  rejAvatar:           { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#EF4444,#F87171)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0 },
  rejStudentName:      { fontWeight: 700, fontSize: 14, color: "#1E293B" },
  rejCounselorChip:    { background: "#EEF2FF", color: "#4F46E5", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600 },
  rejFileName:         { fontSize: 12, color: "#64748B", marginTop: 3 },
  rejRemark:           { fontSize: 12, color: "#DC2626", marginTop: 4, background: "#FEF2F2", borderRadius: 6, padding: "4px 8px" },
  rejDate:             { fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap", marginLeft: "auto", paddingTop: 2 },
};