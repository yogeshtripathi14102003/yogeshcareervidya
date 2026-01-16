"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

import VisitorList from "@/app/admin/components/VisitorList.jsx";
import ViewVisitorModal from "@/app/admin/components/ViewVisitorModal.jsx";

export default function VisitorDashboard() {
  const [total, setTotal] = useState(0);
  const [daily, setDaily] = useState([]);
  const [showList, setShowList] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const fetchStats = async () => {
    try {
      const [totalRes, dailyRes] = await Promise.all([
        api.get("/api/v1/total"),
        api.get("/api/v1/daily"),
      ]);
      setTotal(totalRes.data?.totalVisitors || 0);
      setDaily(dailyRes.data?.dailyVisitors || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📊 Visitor Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Total Visits" value={total} />
        <Stat title="Today Visits" value={daily.length ? daily[0].count : 0} />
        <Stat title="Days Tracked" value={daily.length} />
      </div>

      <button onClick={() => setShowList(!showList)} className="px-4 py-2 bg-blue-600 text-white rounded">
        {showList ? "Hide Visitors" : "View Visitors"}
      </button>

      {showList && <VisitorList onView={setSelectedVisitor} />}
      {selectedVisitor && <ViewVisitorModal visitorId={selectedVisitor} onClose={() => setSelectedVisitor(null)} />}

      <div className="bg-white p-6 shadow rounded">
        <h2 className="font-semibold mb-4">📈 Daily Visits</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-5 shadow rounded">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);
