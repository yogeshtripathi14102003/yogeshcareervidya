"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Trophy } from "lucide-react";

export default function CounselorLeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("admissions");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/counselor/analytics/leaderboard", {
        params: { sortBy, fromDate: fromDate || undefined, toDate: toDate || undefined },
      });
      setRows(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-amber-500" /> Counselor Leaderboard
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded px-2 py-1" />
          <span className="text-gray-400">to</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded px-2 py-1" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
            <option value="admissions">Sort: Admissions</option>
            <option value="conversion">Sort: Conversion %</option>
          </select>
          <button onClick={fetchLeaderboard} className="bg-indigo-600 text-white px-3 py-1.5 rounded">
            Apply
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">No lead data for this range.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b bg-slate-50">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Counselor</th>
                <th className="py-2 px-4">Total Leads</th>
                <th className="py-2 px-4">Admissions</th>
                <th className="py-2 px-4">Lost</th>
                <th className="py-2 px-4">Conversion %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.counselorId} className="border-b last:border-0">
                  <td className="py-2 px-4 font-bold text-gray-400">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="py-2 px-4">
                    <p className="font-medium">{r.name || "—"}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </td>
                  <td className="py-2 px-4">{r.totalLeads}</td>
                  <td className="py-2 px-4 font-semibold text-green-600">{r.admissions}</td>
                  <td className="py-2 px-4 text-red-500">{r.lostLeads}</td>
                  <td className="py-2 px-4 font-semibold">{r.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
