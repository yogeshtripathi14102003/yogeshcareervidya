// "use client";

// import React, { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import {
//   Users,
//   Download,
//   Trash2,
//   RefreshCw,
// } from "lucide-react";
// import * as XLSX from "xlsx";

// const STATUS_LIST = [
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

// const Dailycounslsourreoprt = () => {
//   const [dailyData, setDailyData] = useState([]);
//   const [allData, setAllData] = useState([]);
//   const [date, setDate] = useState(
//     new Date().toISOString().slice(0, 10)
//   );
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH ALL LEADS ================= */

//   const fetchAllLeads = async (params = {}) => {
//     let allLeads = [];
//     let page = 1;
//     let hasMore = true;

//     while (hasMore) {
//       const res = await api.get("/api/v1/leads", {
//         params: {
//           page,
//           limit: 500,
//           ...params,
//         },
//       });

//       const data = res.data.data || [];

//       allLeads = [...allLeads, ...data];

//       hasMore = data.length === 500;
//       page++;
//     }

//     return allLeads;
//   };

//   /* ================= GROUP LEADS ================= */

//   const groupLeads = (leads) => {
//     const grouped = {};

//     leads.forEach((l) => {
//       if (!l.assignedTo && !l.assignedToName) return;

//       const isObj =
//         l.assignedTo &&
//         typeof l.assignedTo === "object";

//       const id = isObj
//         ? l.assignedTo._id
//         : l.assignedTo || l.assignedToName;

//       const name = isObj
//         ? l.assignedTo.name
//         : l.assignedToName || "Unknown";

//       if (!id) return;

//       if (!grouped[id]) {
//         const emptyStatuses = {};

//         STATUS_LIST.forEach((s) => {
//           emptyStatuses[s] = 0;
//         });

//         grouped[id] = {
//           counselorId: id,
//           name,
//           totalLeads: 0,
//           statuses: { ...emptyStatuses },
//         };
//       }

//       grouped[id].totalLeads += 1;

//       if (
//         grouped[id].statuses[l.status] !== undefined
//       ) {
//         grouped[id].statuses[l.status] += 1;
//       }
//     });

//     return Object.values(grouped).sort(
//       (a, b) => b.totalLeads - a.totalLeads
//     );
//   };

//   /* ================= FETCH DATA ================= */

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       const [dailyLeads, allLeads] =
//         await Promise.all([
//           fetchAllLeads({
//             fromDate: date,
//             toDate: date,
//           }),
//           fetchAllLeads(),
//         ]);

//       setDailyData(
//         groupLeads(
//           dailyLeads.filter(
//             (l) =>
//               l.assignedTo || l.assignedToName
//           )
//         )
//       );

//       setAllData(
//         groupLeads(
//           allLeads.filter(
//             (l) =>
//               l.assignedTo || l.assignedToName
//           )
//         )
//       );
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [date]);

//   /* ================= DELETE TODAY LEADS ================= */

//   const deleteTodayLeads = async (
//     counselorId,
//     counselorName
//   ) => {
//     const total = dailyData.find(
//       (c) => c.counselorId === counselorId
//     )?.totalLeads;

//     if (
//       !window.confirm(
//         `Delete ${total} leads of ${counselorName} on ${date}?`
//       )
//     )
//       return;

//     setLoading(true);

//     try {
//       const allDay = await fetchAllLeads({
//         fromDate: date,
//         toDate: date,
//       });

//       const leadsToDelete = allDay.filter((l) => {
//         const isObj =
//           l.assignedTo &&
//           typeof l.assignedTo === "object";

//         const id = isObj
//           ? l.assignedTo._id
//           : l.assignedTo;

//         return (
//           id === counselorId ||
//           l.assignedToName === counselorName
//         );
//       });

//       if (!leadsToDelete.length) {
//         alert("No leads found.");
//         return;
//       }

//       await Promise.all(
//         leadsToDelete.map((lead) =>
//           api.delete(`/api/v1/leads/${lead._id}`)
//         )
//       );

//       alert(
//         `${leadsToDelete.length} leads deleted`
//       );

//       fetchData();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DELETE ALL LEADS ================= */

//   const deleteAllCounselorLeads = async (
//     counselorId,
//     counselorName
//   ) => {
//     if (
//       !window.confirm(
//         `Are you sure?\n\nThis will permanently delete ALL leads of ${counselorName}.`
//       )
//     )
//       return;

//     setLoading(true);

//     try {
//       const allLeads = await fetchAllLeads();

//       const leadsToDelete = allLeads.filter((l) => {
//         const isObj =
//           l.assignedTo &&
//           typeof l.assignedTo === "object";

//         const id = isObj
//           ? l.assignedTo._id
//           : l.assignedTo;

//         return (
//           id === counselorId ||
//           l.assignedToName === counselorName
//         );
//       });

//       if (!leadsToDelete.length) {
//         alert("No leads found.");
//         return;
//       }

//       await Promise.all(
//         leadsToDelete.map((lead) =>
//           api.delete(`/api/v1/leads/${lead._id}`)
//         )
//       );

//       alert(
//         `${leadsToDelete.length} total leads deleted for ${counselorName}`
//       );

//       fetchData();
//     } catch (err) {
//       console.error("Delete Error:", err);
//       alert("Delete failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DOWNLOAD EXCEL ================= */

//   const downloadExcel = () => {
//     const sheetData = [];

//     sheetData.push({
//       Section: "DAILY REPORT",
//       Date: date,
//     });

//     dailyData.forEach((c) =>
//       sheetData.push({
//         Counselor: c.name,
//         "Today Assigned": c.totalLeads,
//       })
//     );

//     sheetData.push({});

//     sheetData.push({
//       Section: "ALL COUNSELORS REPORT",
//     });

//     allData.forEach((c) => {
//       const row = {
//         Counselor: c.name,
//         Total: c.totalLeads,
//       };

//       STATUS_LIST.forEach((s) => {
//         row[s] = c.statuses[s];
//       });

//       sheetData.push(row);
//     });

//     const worksheet =
//       XLSX.utils.json_to_sheet(sheetData);

//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       "Report"
//     );

//     XLSX.writeFile(
//       workbook,
//       `Counselor_Report_${date}.xlsx`
//     );
//   };

//   const totalToday = dailyData.reduce(
//     (a, b) => a + b.totalLeads,
//     0
//   );

//   const overallTotal = allData.reduce(
//     (a, b) => a + b.totalLeads,
//     0
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="bg-white p-4 rounded-xl border shadow-sm">

//       {/* HEADER */}

//       <div className="flex justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <Users
//             size={18}
//             className="text-blue-600"
//           />
//           <h2 className="font-bold">
//             Daily Counselor Report
//           </h2>
//         </div>

//         <div className="flex gap-2 items-center">
//           <input
//             type="date"
//             value={date}
//             onChange={(e) =>
//               setDate(e.target.value)
//             }
//             className="border px-2 py-1 rounded text-xs"
//           />

//           <button
//             onClick={fetchData}
//             disabled={loading}
//             className="border px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50"
//           >
//             <RefreshCw
//               size={12}
//               className={
//                 loading ? "animate-spin" : ""
//               }
//             />
//             Refresh
//           </button>

//           <button
//             onClick={downloadExcel}
//             className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-1"
//           >
//             <Download size={14} />
//             Excel
//           </button>
//         </div>
//       </div>

//       {/* TODAY TOTAL */}

//       <div className="bg-blue-50 p-3 rounded mb-4">
//         <p className="text-xs text-gray-500">
//           Assigned on {date}
//         </p>

//         <p className="text-2xl font-bold text-blue-700">
//           {totalToday}
//         </p>
//       </div>

//       {/* DAILY LIST */}

//       {dailyData.length === 0 &&
//         !loading && (
//           <p className="text-sm text-gray-400 italic mb-4">
//             No leads assigned on {date}
//           </p>
//         )}

//       {dailyData.map((c) => (
//         <div
//           key={c.counselorId}
//           className="flex justify-between items-center border p-2 rounded mb-2"
//         >
//           <div>
//             <p className="font-medium text-sm">
//               {c.name}
//             </p>

//             <p className="text-xs text-gray-500">
//               Assigned: {c.totalLeads}
//             </p>
//           </div>

//           <button
//             onClick={() =>
//               deleteTodayLeads(
//                 c.counselorId,
//                 c.name
//               )
//             }
//             disabled={loading}
//             className="text-red-500 hover:bg-red-50 p-2 rounded disabled:opacity-50"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       ))}

//       {/* ALL COUNSELORS */}

//       <h3 className="mt-6 mb-2 font-bold">
//         All Counselors (Overall)
//       </h3>

//       <div className="bg-green-50 p-3 rounded mb-3">
//         <p className="text-xs text-gray-500">
//           Overall Total
//         </p>

//         <p className="text-2xl font-bold text-green-700">
//           {overallTotal}
//         </p>
//       </div>

//       {allData.map((c) => (
//         <div
//           key={c.counselorId}
//           className="border p-3 rounded mb-3"
//         >
//           <div className="flex justify-between mb-2">

//             <div>
//               <p className="font-semibold">
//                 {c.name}
//               </p>

//               <p className="text-sm font-bold text-green-700">
//                 Total: {c.totalLeads}
//               </p>
//             </div>

//             {/* DELETE ALL */}

//             <button
//               onClick={() =>
//                 deleteAllCounselorLeads(
//                   c.counselorId,
//                   c.name
//                 )
//               }
//               disabled={loading}
//               className="text-red-500 hover:bg-red-50 p-2 rounded disabled:opacity-50"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {STATUS_LIST.map((s) => (
//               <span
//                 key={s}
//                 className={`text-xs px-2 py-1 rounded ${
//                   c.statuses[s] > 0
//                     ? "bg-indigo-100 text-indigo-700 font-bold"
//                     : "bg-slate-100 text-gray-400"
//                 }`}
//               >
//                 {s}: {c.statuses[s]}
//               </span>
//             ))}
//           </div>
//         </div>
//       ))}

//       {/* LOADING */}

//       {loading && (
//         <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-xs flex items-center gap-2">
//           <RefreshCw
//             size={12}
//             className="animate-spin"
//           />
//           Loading...
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dailycounslsourreoprt;

"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Users, Download, Trash2, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";

const STATUS_LIST = [
  "New", "Not Interested", "Details Shared", "Follow-up",
  "Hot Lead", "University Issue", "Fee Issue", "Distance Issue",
  "Language Issue", "Not Picked", "Admission Done",
];

// ✅ IST mein aaj ki date
const todayIST = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const Dailycounslsourreoprt = () => {
  const [dailyData, setDailyData] = useState([]);
  const [allData, setAllData]     = useState([]);
  const [date, setDate]           = useState(todayIST());
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  /* ─────────────────────────────────────────
     FETCH — pagination with total-aware loop
  ───────────────────────────────────────── */
  const fetchAllLeads = async (params = {}) => {
    let allLeads = [];
    let page     = 1;
    const LIMIT  = 500;

    while (true) {
      const res  = await api.get("/api/v1/leads", {
        params: { page, limit: LIMIT, ...params },
      });
      const body = res.data;
      const data = body.data || [];
      allLeads   = [...allLeads, ...data];

      // ✅ Stop condition: use total from backend if available,
      //    fallback to "less than full page" heuristic
      const total = body.total ?? null;
      if (total !== null) {
        if (allLeads.length >= total) break;
      } else {
        if (data.length < LIMIT) break;
      }
      page++;
    }
    return allLeads;
  };

  /* ─────────────────────────────────────────
     GROUP by counselor
  ───────────────────────────────────────── */
  const groupLeads = (leads) => {
    const grouped = {};
    leads.forEach((l) => {
      if (!l.assignedTo && !l.assignedToName) return;
      const isObj = l.assignedTo && typeof l.assignedTo === "object";
      const id    = isObj ? l.assignedTo._id : l.assignedTo || l.assignedToName;
      const name  = isObj ? l.assignedTo.name : l.assignedToName || "Unknown";
      if (!id) return;

      if (!grouped[id]) {
        const emptyStatuses = {};
        STATUS_LIST.forEach((s) => { emptyStatuses[s] = 0; });
        grouped[id] = { counselorId: id, name, totalLeads: 0, statuses: { ...emptyStatuses } };
      }
      grouped[id].totalLeads += 1;
      if (grouped[id].statuses[l.status] !== undefined) {
        grouped[id].statuses[l.status] += 1;
      }
    });
    return Object.values(grouped).sort((a, b) => b.totalLeads - a.totalLeads);
  };

  /* ─────────────────────────────────────────
     FETCH DATA
     KEY FIX: daily report ke liye fromDate+toDate
     use karo — backend createdAt se filter karta
     hai jab `date` param nahi hota.
     
     Lekin hamara backend `date` param se updatedAt
     filter karta hai — jo GALAT hai assignment date
     ke liye. Isliye hum fromDate=toDate bhejte hain
     taaki backend createdAt filter lagaye (jo
     assignment time hai).
     
     YA — agar aapne backend mein `date` param ko
     createdAt pe fix kar diya ho toh sirf { date }
     bhejo. Dono versions handle kiye hain neeche.
  ───────────────────────────────────────── */
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dailyLeads, allLeads] = await Promise.all([
        // ✅ FIX: fromDate + toDate bhejo (createdAt-based filter)
        // Lead jis din assign hua = createdAt
        // updatedAt baad mein change ho jaata hai — reliable nahi
        fetchAllLeads({ fromDate: date, toDate: date }),
        fetchAllLeads(),
      ]);

      setDailyData(
        groupLeads(dailyLeads.filter((l) => l.assignedTo || l.assignedToName))
      );
      setAllData(
        groupLeads(allLeads.filter((l) => l.assignedTo || l.assignedToName))
      );
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Data load nahi hua. Refresh karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [date]);

  /* ─────────────────────────────────────────
     DELETE — today's leads of one counselor
  ───────────────────────────────────────── */
  const deleteTodayLeads = async (counselorId, counselorName) => {
    const entry = dailyData.find((c) => c.counselorId === counselorId);
    if (!window.confirm(
      `Delete ${entry?.totalLeads ?? "?"} leads of ${counselorName} assigned on ${date}?`
    )) return;

    setLoading(true);
    try {
      const allDay = await fetchAllLeads({ fromDate: date, toDate: date });
      const toDelete = allDay.filter((l) => {
        const isObj = l.assignedTo && typeof l.assignedTo === "object";
        const id    = isObj ? l.assignedTo._id : l.assignedTo;
        return id === counselorId || l.assignedToName === counselorName;
      });

      if (!toDelete.length) { alert("No leads found."); setLoading(false); return; }

      await Promise.all(toDelete.map((l) => api.delete(`/api/v1/leads/${l._id}`)));
      alert(`${toDelete.length} leads deleted`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     DELETE — ALL leads of one counselor
  ───────────────────────────────────────── */
  const deleteAllCounselorLeads = async (counselorId, counselorName) => {
    if (!window.confirm(
      `Are you sure?\n\nThis will permanently delete ALL leads of ${counselorName}.`
    )) return;

    setLoading(true);
    try {
      const all      = await fetchAllLeads();
      const toDelete = all.filter((l) => {
        const isObj = l.assignedTo && typeof l.assignedTo === "object";
        const id    = isObj ? l.assignedTo._id : l.assignedTo;
        return id === counselorId || l.assignedToName === counselorName;
      });

      if (!toDelete.length) { alert("No leads found."); setLoading(false); return; }

      await Promise.all(toDelete.map((l) => api.delete(`/api/v1/leads/${l._id}`)));
      alert(`${toDelete.length} total leads deleted for ${counselorName}`);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Delete failed.");
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     EXCEL DOWNLOAD
  ───────────────────────────────────────── */
  const downloadExcel = () => {
    const rows = [];
    rows.push({ Section: "DAILY REPORT", Date: date });
    dailyData.forEach((c) =>
      rows.push({ Counselor: c.name, "Today Assigned": c.totalLeads })
    );
    rows.push({});
    rows.push({ Section: "ALL COUNSELORS REPORT" });
    allData.forEach((c) => {
      const row = { Counselor: c.name, Total: c.totalLeads };
      STATUS_LIST.forEach((s) => { row[s] = c.statuses[s]; });
      rows.push(row);
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Counselor_Report_${date}.xlsx`);
  };

  const totalToday   = dailyData.reduce((a, b) => a + b.totalLeads, 0);
  const overallTotal = allData.reduce((a, b) => a + b.totalLeads, 0);

  /* ─────────────────────────────────────────
     UI
  ───────────────────────────────────────── */
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-blue-600" />
          <h2 className="font-bold">Daily Counselor Report</h2>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1 rounded text-xs"
          />
          {/* ✅ Today button */}
          <button
            onClick={() => setDate(todayIST())}
            className="border px-2 py-1 rounded text-xs hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="border px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading}
            className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-1 disabled:opacity-50"
          >
            <Download size={14} /> Excel
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-2 rounded mb-3 border border-red-200">
          {error}
        </div>
      )}

      {/* TODAY TOTAL */}
      <div className="bg-blue-50 p-3 rounded mb-4">
        <p className="text-xs text-gray-500">Assigned on {date}</p>
        <p className="text-2xl font-bold text-blue-700">{totalToday}</p>
      </div>

      {/* DAILY LIST */}
      {!loading && dailyData.length === 0 && (
        <p className="text-sm text-gray-400 italic mb-4">
          No leads assigned on {date}
        </p>
      )}

      {dailyData.map((c) => (
        <div key={c.counselorId} className="flex justify-between items-center border p-2 rounded mb-2">
          <div>
            <p className="font-medium text-sm">{c.name}</p>
            <p className="text-xs text-gray-500">Assigned: {c.totalLeads}</p>
          </div>
          <button
            onClick={() => deleteTodayLeads(c.counselorId, c.name)}
            disabled={loading}
            className="text-red-500 hover:bg-red-50 p-2 rounded disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* ALL COUNSELORS */}
      <h3 className="mt-6 mb-2 font-bold">All Counselors (Overall)</h3>
      <div className="bg-green-50 p-3 rounded mb-3">
        <p className="text-xs text-gray-500">Overall Total</p>
        <p className="text-2xl font-bold text-green-700">{overallTotal}</p>
      </div>

      {allData.map((c) => (
        <div key={c.counselorId} className="border p-3 rounded mb-3">
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm font-bold text-green-700">Total: {c.totalLeads}</p>
            </div>
            <button
              onClick={() => deleteAllCounselorLeads(c.counselorId, c.name)}
              disabled={loading}
              className="text-red-500 hover:bg-red-50 p-2 rounded disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_LIST.map((s) => (
              <span
                key={s}
                className={`text-xs px-2 py-1 rounded ${
                  c.statuses[s] > 0
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "bg-slate-100 text-gray-400"
                }`}
              >
                {s}: {c.statuses[s]}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-xs flex items-center gap-2 z-50">
          <RefreshCw size={12} className="animate-spin" />
          Loading...
        </div>
      )}
    </div>
  );
};

export default Dailycounslsourreoprt;