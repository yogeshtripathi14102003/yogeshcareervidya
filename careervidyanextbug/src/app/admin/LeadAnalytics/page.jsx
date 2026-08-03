"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp, Clock, Hourglass, Target } from "lucide-react";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#a855f7", "#ec4899"];

export default function LeadAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/leads/analytics", {
        params: { fromDate: fromDate || undefined, toDate: toDate || undefined },
      });
      setData(res.data?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !data) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading lead analytics…</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-sm text-gray-400">No data available.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">📊 Lead Analytics</h1>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded px-2 py-1" />
          <span className="text-gray-400">to</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded px-2 py-1" />
          <button onClick={fetchAnalytics} className="bg-indigo-600 text-white px-3 py-1.5 rounded">
            Apply
          </button>
        </div>
      </div>

      {/* ---- Top stat cards ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Target size={18} />} label="Total Leads" value={data.totalLeads} />
        <StatCard icon={<TrendingUp size={18} />} label="Conversion Rate" value={`${data.overallConversionRate}%`} />
        <StatCard
          icon={<Clock size={18} />}
          label="Avg First Response"
          value={data.avgFirstResponseMinutes != null ? `${data.avgFirstResponseMinutes} min` : "—"}
        />
        <StatCard
          icon={<Hourglass size={18} />}
          label="Avg Open Lead Age"
          value={data.avgLeadAgeDays != null ? `${data.avgLeadAgeDays} days` : "—"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---- Lead source breakdown ---- */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-3">Lead Source Breakdown</h2>
          {data.bySource.length === 0 ? (
            <p className="text-sm text-gray-400">No data.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data.bySource} dataKey="total" nameKey="source" outerRadius={80} label>
                    {data.bySource.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <table className="w-full text-xs mt-3">
                <thead>
                  <tr className="text-left text-gray-400 border-b">
                    <th className="py-1">Source</th>
                    <th className="py-1">Total</th>
                    <th className="py-1">Admitted</th>
                    <th className="py-1">Conversion %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bySource.map((s) => (
                    <tr key={s.source} className="border-b last:border-0">
                      <td className="py-1">{s.source}</td>
                      <td className="py-1">{s.total}</td>
                      <td className="py-1">{s.admitted}</td>
                      <td className="py-1">{s.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* ---- Status funnel ---- */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-3">Status Funnel</h2>
          {data.statusFunnel.length === 0 ? (
            <p className="text-sm text-gray-400">No data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.statusFunnel} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="status" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ---- Lost reasons ---- */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-3">Lost Reasons</h2>
        {data.lostReasons.length === 0 ? (
          <p className="text-sm text-gray-400">No lost leads in this range.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.lostReasons.map((r) => (
              <div key={r.reason} className="border rounded-lg p-3 text-sm">
                <p className="font-medium truncate" title={r.reason}>{r.reason}</p>
                <p className="text-2xl font-bold text-red-500">{r.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);
