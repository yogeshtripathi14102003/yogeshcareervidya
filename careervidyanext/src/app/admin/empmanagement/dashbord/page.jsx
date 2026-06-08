// "use client";

// import { useEffect, useState } from "react";
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   BarChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Bar,
// } from "recharts";

// import {
//   FiUsers,
//   FiUserCheck,
//   FiUserX,
//   FiBell,
// } from "react-icons/fi";

// const API =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// export default function DashboardPage() {
//   const [stats, setStats] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   async function loadDashboard() {
//     try {
//       setLoading(true);

//       const [statsRes, alertsRes] = await Promise.all([
//         fetch(`${API}/api/v1/employees/stats`),
//         fetch(`${API}/api/v1/employees/alerts?days=30`),
//       ]);

//       const statsData = await statsRes.json();
//       const alertsData = await alertsRes.json();

//       if (statsData.success) {
//         setStats(statsData.data);
//       }

//       if (alertsData.success) {
//         setAlerts(alertsData.data || []);
//       }
//     } catch (err) {
//       console.error("Dashboard Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <div className="text-white text-lg">
//           Loading Dashboard...
//         </div>
//       </div>
//     );
//   }

//   const deptData = Object.entries(
//     stats?.byDepartment || {}
//   ).map(([name, value]) => ({
//     name,
//     value,
//   }));

//   const pieColors = [
//     "#6366f1",
//     "#22c55e",
//     "#f59e0b",
//     "#ef4444",
//     "#06b6d4",
//     "#8b5cf6",
//     "#ec4899",
//   ];

//   return (
//     <div className="min-h-screen bg-slate-950 text-white p-6">

//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">
//           Employee Management Dashboard
//         </h1>

//         <p className="text-slate-400 mt-2">
//           Corporate Employee Analytics & Alerts
//         </p>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mb-8">

//         <StatCard
//           title="Total Employees"
//           value={stats?.total || 0}
//           icon={<FiUsers />}
//           color="from-indigo-500 to-indigo-700"
//         />

//         <StatCard
//           title="Active Employees"
//           value={stats?.active || 0}
//           icon={<FiUserCheck />}
//           color="from-green-500 to-green-700"
//         />

//         <StatCard
//           title="Inactive Employees"
//           value={stats?.inactive || 0}
//           icon={<FiUserX />}
//           color="from-red-500 to-red-700"
//         />

//         <StatCard
//           title="Today's Alerts"
//           value={stats?.todayAlerts || 0}
//           icon={<FiBell />}
//           color="from-yellow-500 to-orange-600"
//         />
//       </div>

//       {/* Secondary Cards */}
//       <div className="grid lg:grid-cols-3 gap-5 mb-8">

//         <MiniCard
//           title="Week Alerts"
//           value={stats?.weekAlerts || 0}
//         />

//         <MiniCard
//           title="Month Alerts"
//           value={stats?.monthAlerts || 0}
//         />

//         <MiniCard
//           title="Departments"
//           value={deptData.length}
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-2 gap-6 mb-8">

//         {/* Department Pie */}
//         <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">

//           <h2 className="font-semibold text-lg mb-5">
//             Department Distribution
//           </h2>

//           <ResponsiveContainer width="100%" height={350}>
//             <PieChart>
//               <Pie
//                 data={deptData}
//                 dataKey="value"
//                 outerRadius={120}
//                 label
//               >
//                 {deptData.map((_, i) => (
//                   <Cell
//                     key={i}
//                     fill={
//                       pieColors[i % pieColors.length]
//                     }
//                   />
//                 ))}
//               </Pie>

//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Bar Chart */}
//         <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">

//           <h2 className="font-semibold text-lg mb-5">
//             Department Analytics
//           </h2>

//           <ResponsiveContainer width="100%" height={350}>
//             <BarChart data={deptData}>
//               <CartesianGrid stroke="#334155" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#6366f1" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Alerts */}
//       <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">

//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-lg font-semibold">
//             Upcoming Alerts
//           </h2>

//           <span className="text-slate-400 text-sm">
//             {alerts.length} records
//           </span>
//         </div>

//         <div className="space-y-3">

//           {alerts.slice(0, 10).map((item, index) => (
//             <div
//               key={index}
//               className="bg-slate-800 rounded-xl p-4 flex items-center justify-between"
//             >
//               <div>
//                 <h3 className="font-medium">
//                   {item.employee?.name}
//                 </h3>

//                 <p className="text-sm text-slate-400">
//                   {item.employee?.designation}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <div className="text-sm">
//                   {item.type === "birthday"
//                     ? "🎂 Birthday"
//                     : "🏆 Anniversary"}
//                 </div>

//                 <div className="text-xs text-slate-400">
//                   {item.daysUntil === 0
//                     ? "Today"
//                     : `${item.daysUntil} days`}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {alerts.length === 0 && (
//             <div className="text-center py-10 text-slate-500">
//               No upcoming alerts
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   icon,
//   color,
// }) {
//   return (
//     <div
//       className={`bg-gradient-to-r ${color}
//       rounded-2xl p-5 shadow-lg`}
//     >
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="text-sm opacity-80">
//             {title}
//           </p>

//           <h2 className="text-3xl font-bold mt-2">
//             {value}
//           </h2>
//         </div>

//         <div className="text-4xl">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MiniCard({ title, value }) {
//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//       <div className="text-slate-400 text-sm">
//         {title}
//       </div>

//       <div className="text-3xl font-bold mt-2">
//         {value}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiUserX, FiBell } from "react-icons/fi";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, XAxis, YAxis, CartesianGrid, Bar,
} from "recharts";
import { serverFetch } from "@/utlis/serverFetch.js";
import api from "@/utlis/api.js"; // ✅ tumhara existing axios instance

const PIE_COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#8b5cf6","#ec4899"];

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/employees/stats"),
      api.get("/api/v1/employees/alerts?days=30"),
    ])
      .then(([s, a]) => {
        setStats(s.data?.data || null);
        setAlerts(a.data?.data || []);
      })
      .catch((e) => setError(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">
        Loading Dashboard…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        Error: {error}
      </div>
    );

  const deptData = Object.entries(stats?.byDepartment || {}).map(([name, value]) => ({ name, value }));
  const today    = alerts.filter((a) => a.daysUntil === 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Employee Management Dashboard</h1>
        <p className="text-slate-400 mt-1">Corporate Employee Analytics & Alerts</p>
      </div>

      {/* Today's Celebrations Banner */}
      {today.length > 0 && (
        <div
          className="mb-8 rounded-2xl p-6 border border-yellow-500/30"
          style={{ background: "linear-gradient(135deg,#1a1a2e,#2d2d50)" }}
        >
          <h2 className="text-yellow-400 font-bold text-lg mb-4">🎉 Celebrating Today!</h2>
          <div className="flex flex-wrap gap-3">
            {today.map((a, i) => (
              <div key={i} className="bg-white/10 rounded-xl px-4 py-3 min-w-[160px]">
                <div className="text-2xl">{a.type === "birthday" ? "🎂" : "🏆"}</div>
                <div className="font-semibold mt-1">{a.employee?.name}</div>
                <div className="text-xs text-slate-400">{a.employee?.department}</div>
                <div className="text-xs text-yellow-400 mt-1 font-semibold">
                  {a.type === "birthday" ? "Birthday 🎈" : `${a.yearsCompleting}yr Anniversary 🎊`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mb-8">
        <StatCard title="Total Employees"  value={stats?.total       || 0} icon={<FiUsers />}     color="from-indigo-500 to-indigo-700" />
        <StatCard title="Active"           value={stats?.active      || 0} icon={<FiUserCheck />} color="from-green-500 to-green-700" />
        <StatCard title="Inactive"         value={stats?.inactive    || 0} icon={<FiUserX />}     color="from-red-500 to-red-700" />
        <StatCard title="Today's Alerts"   value={stats?.todayAlerts || 0} icon={<FiBell />}      color="from-yellow-500 to-orange-600" />
      </div>

      {/* Secondary Cards */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <MiniCard title="Week Alerts"  value={stats?.weekAlerts  || 0} />
        <MiniCard title="Month Alerts" value={stats?.monthAlerts || 0} />
        <MiniCard title="Departments"  value={deptData.length} />
      </div>

      {/* Charts */}
      {deptData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <h2 className="font-semibold text-lg mb-5">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={deptData} dataKey="value" outerRadius={110} label>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <h2 className="font-semibold text-lg mb-5">Department Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Upcoming Alerts */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Upcoming Alerts (30 days)</h2>
          <span className="text-slate-400 text-sm">{alerts.length} records</span>
        </div>
        <div className="space-y-3">
          {alerts.slice(0, 10).map((item, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.type === "birthday" ? "🎂" : "🏆"}</span>
                <div>
                  <h3 className="font-medium">{item.employee?.name}</h3>
                  <p className="text-sm text-slate-400">
                    {item.employee?.department} · {item.employee?.designation}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{item.type === "birthday" ? "Birthday" : "Anniversary"}</div>
                <div className={`text-xs mt-1 font-semibold ${
                  item.daysUntil === 0 ? "text-yellow-400" :
                  item.daysUntil <= 7  ? "text-orange-400" : "text-slate-400"
                }`}>
                  {item.daysUntil === 0 ? "🎉 Today!" : `In ${item.daysUntil} days`}
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-10 text-slate-500">No upcoming alerts</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-2xl p-5 shadow-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

function MiniCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
