
"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/utlis/api.js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PerformanceReport = () => {
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) {
        setLeads(res.data.data);

        // Extract unique counselors safely
        const unique = [...new Map(
          res.data.data
            .filter(l => l.assignedTo && l.assignedTo._id) // only leads with assignedTo
            .map(l => [l.assignedTo._id, l.assignedTo])
        ).values()];
        setCounselors(unique);

        if (unique.length > 0) setSelectedCounselor(unique[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  // Leads filtered by selected counselor
  const filteredLeads = useMemo(() => {
    if (!selectedCounselor) return [];
    return leads.filter(l => l.assignedTo?._id === selectedCounselor);
  }, [leads, selectedCounselor]);

  // Monthly stats grouped by month
  const monthlyStats = useMemo(() => {
    const stats = {};
    filteredLeads.forEach(l => {
      const date = new Date(l.createdAt);
      const key = `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
      if (!stats[key]) stats[key] = { total: 0 };
      stats[key].total += 1;
      stats[key][l.status || "New"] = (stats[key][l.status || "New"] || 0) + 1;
    });
    return Object.keys(stats).map(month => ({ month, ...stats[month] }));
  }, [filteredLeads]);

  const totalLeads = filteredLeads.length;
  const admissions = filteredLeads.filter(l => l.status === "Admission Done").length;
  const conversion = totalLeads ? ((admissions / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <h1 className="text-lg font-bold mb-4">Counselor Performance Report</h1>

      {/* Counselor Selector */}
      <select
        className="border rounded px-2 py-1 mb-4 text-sm"
        value={selectedCounselor || ""}
        onChange={(e) => setSelectedCounselor(e.target.value)}
      >
        {counselors.map(c =>
          c?._id ? <option key={c._id} value={c._id}>{c.name}</option> : null
        )}
      </select>

      {/* Summary Cards */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="bg-white p-3 rounded-xl shadow border w-32 text-center">
          <p className="text-xs text-slate-500">Total Leads</p>
          <p className="font-bold text-lg">{totalLeads}</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow border w-32 text-center">
          <p className="text-xs text-slate-500">Admissions</p>
          <p className="font-bold text-lg">{admissions}</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow border w-32 text-center">
          <p className="text-xs text-slate-500">Conversion</p>
          <p className="font-bold text-lg">{conversion}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Bar Chart: Leads per Status */}
        <div className="bg-white p-3 rounded-xl shadow border h-[220px]">
          <h3 className="text-sm font-bold mb-2">Monthly Leads Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip wrapperStyle={{ fontSize: '10px' }} />
              {["New", "Follow-up", "Admission Done"].map((status, idx) => (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="a"
                  fill={["#3b82f6", "#10b981", "#facc15"][idx]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Admissions Trend */}
        <div className="bg-white p-3 rounded-xl shadow border h-[220px]">
          <h3 className="text-sm font-bold mb-2">Admissions Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="Admission Done" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white p-3 rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[400px]">
          <thead className="bg-slate-50">
            <tr className="text-slate-500 text-xs">
              <th className="p-2">Name</th>
              <th>Status</th>
              <th>Follow Up</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(l => (
              <tr key={l._id} className="hover:bg-slate-50 text-[12px]">
                <td className="p-2">{l.name}</td>
                <td>{l.status || "New"}</td>
                <td>{l.followUpDate ? new Date(l.followUpDate).toLocaleString() : "-"}</td>
                <td>{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-400 italic">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceReport;
