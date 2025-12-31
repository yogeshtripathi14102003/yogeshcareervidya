"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function VisitorDashboard() {
  const [total, setTotal] = useState(0);
  const [unique, setUnique] = useState(0);
  const [daily, setDaily] = useState([]);

  /* ---------- Fetch Visitors ---------- */
  const fetchVisitors = async () => {
    try {
      const [t, u, d] = await Promise.all([
        api.get("/api/v1/total"),
        api.get("/api/v1/unique"),
        api.get("/api/v1/daily"),
      ]);

      setTotal(t.data?.totalVisitors || 0);
      setUnique(u.data?.uniqueVisitors || 0);
      setDaily(d.data?.dailyVisitors || []);
    } catch (error) {
      console.error("Visitor fetch error:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📊 Visitor Analytics</h1>

      {/* ---------- Stats ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Total Visitors" value={total} />
        <Stat title="Unique Visitors" value={unique} />
        <Stat
          title="Today Visits"
          value={daily.length > 0 ? daily[0].count : 0}
        />
      </div>

      {/* ---------- Chart ---------- */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="font-semibold mb-4">📈 Daily Visitors</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------- Small Card ---------- */
const Stat = ({ title, value }) => (
  <div className="bg-white p-5 shadow rounded">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);
