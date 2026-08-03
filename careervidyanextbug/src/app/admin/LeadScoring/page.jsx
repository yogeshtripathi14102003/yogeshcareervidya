"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Flame, Sun, Snowflake, Star, RefreshCw } from "lucide-react";

const TIERS = [
  { key: "priority", label: "Priority Lead", icon: Star, color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50" },
  { key: "hot", label: "Hot Lead", icon: Flame, color: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  { key: "warm", label: "Warm Lead", icon: Sun, color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  { key: "cold", label: "Cold Lead", icon: Snowflake, color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
];

export default function LeadScoringPage() {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rescoring, setRescoring] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchBreakdown = async () => {
    try {
      const res = await api.get("/api/v1/leads/score-breakdown");
      setBreakdown(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakdown();
  }, []);

  const rescoreAll = async () => {
    setRescoring(true);
    setMsg("Recalculating scores for every open lead…");
    try {
      const res = await api.post("/api/v1/leads/rescore-all");
      setMsg(`✅ Rescored ${res.data.updated} of ${res.data.totalLeads} open leads`);
      fetchBreakdown();
    } catch (err) {
      setMsg(err.response?.data?.message || "Rescore failed");
    } finally {
      setRescoring(false);
    }
  };

  if (loading || !breakdown) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
  }

  const total = breakdown.total || 1;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🤖 AI Lead Scoring</h1>
        <button
          onClick={rescoreAll}
          disabled={rescoring}
          className="text-sm flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-60"
        >
          <RefreshCw size={14} className={rescoring ? "animate-spin" : ""} /> Rescore All Leads
        </button>
      </div>

      {msg && <p className="text-sm text-indigo-600">{msg}</p>}

      <p className="text-xs text-gray-500">
        Scores are computed from real tracked activity (logins, revisits, applications, uploaded documents) —
        recalculated automatically every 15 minutes, or on demand above.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {TIERS.map((t) => {
          const count = breakdown.data?.[t.key] || 0;
          const pct = Math.round((count / total) * 100);
          const Icon = t.icon;
          return (
            <div key={t.key} className={`${t.bg} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${t.color} text-white p-2 rounded-lg`}>
                  <Icon size={16} />
                </div>
                <span className={`text-2xl font-bold ${t.text}`}>{count}</span>
              </div>
              <p className={`text-sm font-semibold ${t.text}`}>{t.label}</p>
              <div className="w-full bg-white/60 rounded-full h-1.5 mt-2">
                <div className={`${t.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{pct}% of open leads</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border rounded-xl p-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-700 mb-1">What's not scored yet</p>
        <p>
          "Viewed Fees" and "Downloaded Brochure" aren't included — there's no fees-page tracking or brochure
          download button in the current UI to fire those signals from. Everything else in the spec's scoring
          ladder (visits, registration, login, application, document upload, inactivity) is live.
        </p>
      </div>
    </div>
  );
}
