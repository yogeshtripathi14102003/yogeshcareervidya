"use client";

import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  CartesianGrid,
} from "recharts";

import api from "@/utlis/api.js";

// Register ChartJS
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default function Dashboard() {
  // ---------- APPLICATION STATS ----------
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  // ---------- GRAPH DATA ----------
  const [graphData, setGraphData] = useState({
    students: [],
    queries: [],
  });

  // ------- GET CORRECT DATE FROM ANY FIELD -------
  const getDate = (item) => {
    const keys = [
      "createdAt",
      "created_at",
      "createdDate",
      "created_on",
      "date",
      "timestamp",
    ];
    for (let key of keys) {
      if (item[key]) return new Date(item[key]);
    }
    return null;
  };

  // ---------- FETCH APPLICATION STATS ----------
  const fetchApplicationStats = async () => {
    try {
      const token = localStorage.getItem("admintoken");

      const res = await api.get("/api/v1/resume/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applications = res.data.data || [];

      const pending = applications.filter((x) => x.status === "Pending").length;
      const accepted = applications.filter((x) => x.status === "Hired").length;
      const rejected = applications.filter((x) => x.status === "Rejected").length;

      setStats({
        total: applications.length,
        pending,
        accepted,
        rejected,
      });
    } catch (error) {
      console.log("Error Loading Stats:", error);
    }
  };

  // ---------- FETCH STUDENTS + QUERY GRAPH ----------
  const fetchGraphData = async () => {
    try {
      const [studentsRes, queriesRes] = await Promise.all([
        api.get("/api/v1/students"),
        api.get("/api/v1/getintouch"),
      ]);

      const students =
        studentsRes.data?.data ||
        studentsRes.data?.students ||
        studentsRes.data ||
        [];

      const queries =
        queriesRes.data?.data ||
        queriesRes.data?.queries ||
        queriesRes.data ||
        [];

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const studentGraph = months.map((month, i) => ({
        month,
        count: students.filter((s) => {
          const d = getDate(s);
          return d && d.getMonth() === i;
        }).length,
      }));

      const queryGraph = months.map((month, i) => ({
        month,
        count: queries.filter((s) => {
          const d = getDate(s);
          return d && d.getMonth() === i;
        }).length,
      }));

      setGraphData({
        students: studentGraph,
        queries: queryGraph,
      });
    } catch (error) {
      console.log("Graph Data Error:", error);
    }
  };

  useEffect(() => {
    fetchApplicationStats();
    fetchGraphData();
  }, []);

  // ---------- BAR CHART DATA ----------
  const barData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Applications",
        data: [stats.pending, stats.accepted, stats.rejected],
        backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  // ---------- PIE CHART DATA ----------
  const pieData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [
      {
        data: [stats.pending, stats.accepted, stats.rejected],
        backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="md:p-6 p-3">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* -------- SUMMARY CARDS -------- */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <h2>Total Applications</h2>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
          <h2>Pending</h2>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <h2>Accepted</h2>
          <p className="text-3xl font-bold">{stats.accepted}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <h2>Rejected</h2>
          <p className="text-3xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      {/* -------- GRAPHS -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Students Graph */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4">Monthly Students Registration</h2>
          <LineChart width={450} height={300} data={graphData.students}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RTooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </div>

        {/* Query Graph */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4">Monthly Queries</h2>
          <LineChart width={450} height={300} data={graphData.queries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RTooltip />
            <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </div>
      </div>

      {/* -------- BAR + PIE CHARTS -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4">Applications Overview</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4">Application Status Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}


// "use client";

// /**
//  * Dark Theme Admin Dashboard (Style C - complete single-file page)
//  *
//  * Features:
//  * - Full dark-themed UI (toggle + persisted)
//  * - Smooth gradient background using uploaded image
//  * - Chart.js Bar + Pie (application stats)
//  * - Recharts Area (smooth gradient) for Students & Queries
//  * - Robust API parsing for different possible response shapes
//  * - Responsive layout, Tailwind utility classes
//  * - Safe fallbacks and console logs for debugging
//  *
//  * Usage:
//  * - Drop into your Next.js App Router page (e.g. src/app/admin/page.jsx)
//  * - Ensure tailwind.config.js has: darkMode: "class"
//  * - Ensure api helper at "@/utlis/api.js" is configured (axios instance)
//  * - The page uses these endpoints (adjust if different):
//  *    GET /api/v1/resume/
//  *    GET /api/v1/students
//  *    GET /api/v1/getintouch
//  *
//  * Optional: The uploaded background image path used below:
//  *   /mnt/data/a372de48-15c1-43e6-974d-7d4e28471024.png
//  *
//  */

// import React, { useEffect, useMemo, useState } from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
// import api from "@/utlis/api.js";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip as ReTooltip,
//   CartesianGrid,
//   ResponsiveContainer as ReResponsiveContainer,
// } from "recharts";

// ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

// export default function DarkAdminDashboard() {
//   // THEME
//   const [theme, setTheme] = useState(() => {
//     if (typeof window === "undefined") return "dark";
//     return localStorage.getItem("theme") || "dark"; // default dark for style C
//   });

//   useEffect(() => {
//     if (theme === "dark") document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

//   // STATS
//   const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
//   const [graphData, setGraphData] = useState({ students: [], queries: [] });
//   const [loading, setLoading] = useState({ stats: false, graphs: false });

//   // Helper: normalize API response to array
//   const normalizeArray = (res) => {
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     if (res.data && Array.isArray(res.data)) return res.data;
//     if (res.students && Array.isArray(res.students)) return res.students;
//     if (res.queries && Array.isArray(res.queries)) return res.queries;
//     // if server returns object map { rows: [...] }
//     if (res.rows && Array.isArray(res.rows)) return res.rows;
//     return [];
//   };

//   // Fetch application stats (Chart.js)
//   const fetchApplicationStats = async () => {
//     setLoading((s) => ({ ...s, stats: true }));
//     try {
//       const token = typeof window !== "undefined" ? localStorage.getItem("admintoken") : null;
//       const res = await api.get("/api/v1/resume/", { headers: { Authorization: `Bearer ${token}` } });
//       const apps = normalizeArray(res?.data) || normalizeArray(res);
//       // if apps looks like { data: [...]} the normalizeArray handles it
//       const pending = apps.filter((a) => (a.status || "").toLowerCase() === "pending").length;
//       const accepted = apps.filter((a) => (a.status || "").toLowerCase() === "hired" || (a.status || "").toLowerCase() === "accepted").length;
//       const rejected = apps.filter((a) => (a.status || "").toLowerCase() === "rejected").length;
//       setStats({ total: apps.length, pending, accepted, rejected });
//       localStorage.setItem("totalapplication", apps.length || 0);
//     } catch (err) {
//       console.error("fetchApplicationStats:", err);
//       setStats((s) => ({ ...s }));
//     } finally {
//       setLoading((s) => ({ ...s, stats: false }));
//     }
//   };

//   // Fetch student & getintouch and compute month-wise
//   const fetchGraphData = async () => {
//     setLoading((s) => ({ ...s, graphs: true }));
//     try {
//       const [studentsRes, queriesRes] = await Promise.all([api.get("/api/v1/students"), api.get("/api/v1/getintouch")]);

//       // Responses may vary in shape, pick probable arrays
//       const studentsRaw = normalizeArray(studentsRes?.data) || [];
//       const queriesRaw = normalizeArray(queriesRes?.data) || [];

//       // debug logs (open console)
//       console.debug("studentsRaw:", studentsRaw.length, studentsRaw.slice(0, 3));
//       console.debug("queriesRaw:", queriesRaw.length, queriesRaw.slice(0, 3));

//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//       const studentGraph = months.map((m, i) => {
//         const count = studentsRaw.reduce((acc, s) => {
//           const d = s?.createdAt ? new Date(s.createdAt) : s?.created_at ? new Date(s.created_at) : null;
//           if (!d || Number.isNaN(d.getTime())) return acc;
//           return acc + (d.getMonth() === i ? 1 : 0);
//         }, 0);
//         return { month: m, count };
//       });

//       const queryGraph = months.map((m, i) => {
//         const count = queriesRaw.reduce((acc, q) => {
//           const d = q?.createdAt ? new Date(q.createdAt) : q?.created_at ? new Date(q.created_at) : null;
//           if (!d || Number.isNaN(d.getTime())) return acc;
//           return acc + (d.getMonth() === i ? 1 : 0);
//         }, 0);
//         return { month: m, count };
//       });

//       setGraphData({ students: studentGraph, queries: queryGraph });
//     } catch (err) {
//       console.error("fetchGraphData:", err);
//       // fallback zeroes
//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//       setGraphData({ students: months.map((m) => ({ month: m, count: 0 })), queries: months.map((m) => ({ month: m, count: 0 })) });
//     } finally {
//       setLoading((s) => ({ ...s, graphs: false }));
//     }
//   };

//   useEffect(() => {
//     fetchApplicationStats();
//     fetchGraphData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ChartJS options theme-aware
//   const chartOptions = useMemo(() => {
//     const textColor = theme === "dark" ? "#e5e7eb" : "#111827";
//     const gridColor = theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
//     return {
//       responsive: true,
//       plugins: {
//         legend: { labels: { color: textColor } },
//         tooltip: { mode: "index", intersect: false },
//       },
//       scales: {
//         x: { ticks: { color: textColor }, grid: { color: gridColor } },
//         y: { ticks: { color: textColor }, grid: { color: gridColor } },
//       },
//     };
//   }, [theme]);

//   const barData = useMemo(
//     () => ({
//       labels: ["Pending", "Accepted", "Rejected"],
//       datasets: [{ label: "Applications", data: [stats.pending, stats.accepted, stats.rejected], backgroundColor: ["#facc15", "#22c55e", "#ef4444"] }],
//     }),
//     [stats]
//   );

//   const pieData = useMemo(
//     () => ({
//       labels: ["Pending", "Accepted", "Rejected"],
//       datasets: [{ data: [stats.pending, stats.accepted, stats.rejected], backgroundColor: ["#facc15", "#22c55e", "#ef4444"] }],
//     }),
//     [stats]
//   );

//   // Recharts styling
//   const axisStroke = theme === "dark" ? "#9CA3AF" : "#4B5563";
//   const gridStroke = theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
//   const cardBg = theme === "dark" ? "bg-[#071022] border border-[#112033]" : "bg-white";
//   const pageBgStyle = {
//     backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.85), rgba(2,6,23,0.95)), url("/mnt/data/a372de48-15c1-43e6-974d-7d4e28471024.png")`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   };
//   const textClass = theme === "dark" ? "text-gray-200" : "text-gray-900";

//   // Small helper to download CSV of monthly data (optional handy feature)
//   const downloadCSV = (rows, filename = "report.csv") => {
//     const header = Object.keys(rows[0] || {}).join(",");
//     const lines = rows.map((r) => Object.values(r).join(","));
//     const csv = [header, ...lines].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div style={pageBgStyle} className={`min-h-screen p-6 ${textClass} bg-fixed`}>
//       <div className="max-w-[1200px] mx-auto backdrop-blur-sm bg-black/30 rounded-2xl p-6">
//         {/* header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Admin Dashboard — Dark</h1>
//             <p className="text-sm text-gray-300 mt-1">Overview | Students | Queries | Applications</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => {
//                 // quick refresh
//                 fetchApplicationStats();
//                 fetchGraphData();
//               }}
//               className="text-sm px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
//             >
//               Refresh
//             </button>

//             <button onClick={() => toggleTheme()} className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
//               {theme === "dark" ? "Light Mode" : "Dark Mode"}
//             </button>
//           </div>
//         </div>

//         {/* summary cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <div className="text-xs text-gray-300">Total Applications</div>
//             <div className="flex items-center justify-between mt-2">
//               <div>
//                 <div className="text-2xl font-bold text-white">{stats.total}</div>
//                 <div className="text-xs text-gray-400">Total resume submissions</div>
//               </div>
//             </div>
//           </div>

//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <div className="text-xs text-gray-300">Pending</div>
//             <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.pending}</div>
//           </div>

//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <div className="text-xs text-gray-300">Accepted</div>
//             <div className="text-2xl font-bold text-green-400 mt-2">{stats.accepted}</div>
//           </div>

//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <div className="text-xs text-gray-300">Rejected</div>
//             <div className="text-2xl font-bold text-red-400 mt-2">{stats.rejected}</div>
//           </div>
//         </div>

//         {/* top charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <h3 className="text-white font-semibold mb-3">Applications Overview</h3>
//             <div style={{ minHeight: 220 }}>
//               <Bar data={barData} options={chartOptions} />
//             </div>
//           </div>

//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <h3 className="text-white font-semibold mb-3">Application Status Distribution</h3>
//             <div className="flex items-center justify-center" style={{ minHeight: 220 }}>
//               <div style={{ width: 200, height: 200 }}>
//                 <Pie data={pieData} options={chartOptions} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* area charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-white font-semibold">Monthly Registered Students</h3>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => downloadCSV(graphData.students, "students_monthly.csv")}
//                   className="text-xs px-2 py-1 rounded bg-white/10 text-white"
//                 >
//                   Export CSV
//                 </button>
//               </div>
//             </div>

//             <div style={{ width: "100%", height: 320 }}>
//               <ReResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={graphData.students} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="studentsGrad" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.04} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
//                   <XAxis dataKey="month" stroke={axisStroke} />
//                   <YAxis stroke={axisStroke} />
//                   <ReTooltip contentStyle={{ backgroundColor: theme === "dark" ? "#0b1220" : "#fff" }} />
//                   <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} fill="url(#studentsGrad)" />
//                 </AreaChart>
//               </ReResponsiveContainer>
//             </div>
//           </div>

//           <div className={`p-4 rounded-lg ${cardBg}`}>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-white font-semibold">Monthly Queries (Get In Touch)</h3>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => downloadCSV(graphData.queries, "queries_monthly.csv")}
//                   className="text-xs px-2 py-1 rounded bg-white/10 text-white"
//                 >
//                   Export CSV
//                 </button>
//               </div>
//             </div>

//             <div style={{ width: "100%", height: 320 }}>
//               <ReResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={graphData.queries} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="queriesGrad" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#f97316" stopOpacity={0.04} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
//                   <XAxis dataKey="month" stroke={axisStroke} />
//                   <YAxis stroke={axisStroke} />
//                   <ReTooltip contentStyle={{ backgroundColor: theme === "dark" ? "#0b1220" : "#fff" }} />
//                   <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} fill="url(#queriesGrad)" />
//                 </AreaChart>
//               </ReResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* footer / small notes */}
//         <div className="mt-8 text-xs text-gray-400">
//           <div>Notes: Data pulls from /api/v1/resume/, /api/v1/students and /api/v1/getintouch endpoints.</div>
//           <div>Open browser console for debug logs (studentsRaw / queriesRaw samples).</div>
//         </div>
//       </div>
//     </div>
//   );
// }
