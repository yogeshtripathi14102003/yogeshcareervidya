"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  ResponsiveContainer,
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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const [graphData, setGraphData] = useState({
    students: [],
    queries: [],
  });

  // ---------- DATE HELPER ----------
  const getDate = useCallback((item) => {
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
  }, []);

  // ---------- FETCH STATS ----------
  const fetchApplicationStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("admintoken");

      const res = await api.get("/api/v1/resume/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applications = res.data?.data || [];

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
  }, []);

  // ---------- FETCH GRAPH ----------
  const fetchGraphData = useCallback(async () => {
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
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
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
        count: queries.filter((q) => {
          const d = getDate(q);
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
  }, [getDate]);

  // ---------- USE EFFECT ----------
  useEffect(() => {
    fetchApplicationStats();
    fetchGraphData();
  }, [fetchApplicationStats, fetchGraphData]);

  // ---------- CHART DATA ----------
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

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <Card title="Total Applications" value={stats.total} color="bg-blue-500" />
        <Card title="Pending" value={stats.pending} color="bg-yellow-500" />
        <Card title="Accepted" value={stats.accepted} color="bg-green-500" />
        <Card title="Rejected" value={stats.rejected} color="bg-red-500" />
      </div>

      {/* LINE CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        <ChartBox title="Monthly Students Registration">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData.students}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RTooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Monthly Queries">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData.queries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RTooltip />
              <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      {/* BAR + PIE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <ChartBox title="Applications Overview">
          <Bar data={barData} />
        </ChartBox>

        <ChartBox title="Application Status Distribution">
          <Pie data={pieData} />
        </ChartBox>

      </div>
    </div>
  );
}

// ---------- REUSABLE COMPONENTS ----------
const Card = ({ title, value, color }) => (
  <div className={`${color} text-white p-4 rounded-lg shadow-lg`}>
    <h2>{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </div>
);