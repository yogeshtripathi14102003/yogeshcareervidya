

"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  Clock, Hourglass, Phone, PhoneCall, CalendarCheck,
  Award, XCircle, TrendingUp, Timer, CheckCircle2, CalendarDays,
  AlertTriangle, UserPlus
} from "lucide-react";

export default function MyPerformancePage() {
  const [data, setData] = useState(null);
  const [hours, setHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchHoursSummary = async () => {
    try {
      const res = await api.get("/api/v1/counselor/analytics/hours-summary/me");
      setHours(res.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/counselor/analytics/me", {
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
    fetchHoursSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ IST formatted time
  const fmtTime = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  // ✅ IST me aaj ki date
  const getTodayIST = () =>
    new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading && !data) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        Loading your performance…
      </div>
    );
  }
  if (!data) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No data available yet.
      </div>
    );
  }

  // Aaj ka total pending (sabhi buckets ka sum)
  const totalPending =
    (data.pendingCalls || 0) +
    (data.overdueCalls || 0) +
    (data.freshUncontacted || 0);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">📈 My Performance</h1>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            {getTodayIST()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={fetchAnalytics}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Info note */}
      <p className="text-[11px] text-gray-400">
        Date filter applies to <b>performance metrics</b> (total leads, admissions,
        calls done). <b>Pending Calls</b> always shows the full pool — independent
        of the date filter.
      </p>

      <div className="text-xs text-gray-500 flex gap-4">
        <span>Last login: {fmtTime(data.loginTime)}</span>
        <span>Last logout: {fmtTime(data.logoutTime)}</span>
      </div>

      {/* ── Working Hours ── */}
      {hours && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <CalendarDays size={13} /> Working Hours (IST)
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              ["Today", hours.today],
              ["This Week", hours.thisWeek],
              ["This Month", hours.thisMonth],
              ["All Time", hours.allTime],
            ].map(([label, value]) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-indigo-600">{value}h</p>
                <p className="text-[11px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          ── ACTION REQUIRED (Inline Section) ──
      ══════════════════════════════════════════ */}
      <div className="bg-white border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle size={13} /> Action Required
          </h2>
          {totalPending > 0 && (
            <span className="text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {totalPending} total
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Calls */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0">
              <CalendarCheck size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wide">
                Pending Calls
              </p>
              <p className="text-2xl font-black text-amber-700 leading-tight">
                {data.pendingCalls || 0}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Open leads with follow-up due
              </p>
            </div>
          </div>

          {/* Overdue Calls */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0">
              <Timer size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wide">
                Overdue Calls
              </p>
              <p className="text-2xl font-black text-red-700 leading-tight">
                {data.overdueCalls || 0}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Follow-up date already passed
              </p>
            </div>
          </div>

          {/* Fresh / Uncontacted */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
              <UserPlus size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wide">
                Fresh / Uncontacted
              </p>
              <p className="text-2xl font-black text-blue-700 leading-tight">
                {data.freshUncontacted || 0}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                No follow-up logged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ── MAIN PERFORMANCE METRICS ──
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={<Clock size={18} />} label="Working Hours" value={`${data.workingHours}h`} />
        <Stat icon={<Hourglass size={18} />} label="Idle Time" value={`${data.idleMinutes} min`} />
        <Stat icon={<Phone size={18} />} label="Total Leads" value={data.totalLeads} />
        <Stat icon={<PhoneCall size={18} />} label="Calls Done" value={data.callsDone} />
        <Stat icon={<Timer size={18} />} label="Follow-ups Logged" value={data.followUps} />
        <Stat icon={<Award size={18} />} label="Admissions" value={data.admissions} />
        <Stat icon={<XCircle size={18} />} label="Lost Leads" value={data.lostLeads} />
        <Stat icon={<TrendingUp size={18} />} label="Conversion Rate" value={`${data.conversionRate}%`} />
        <Stat
          icon={<CheckCircle2 size={18} />}
          label="Avg Response Time"
          value={data.avgResponseMinutes != null ? `${data.avgResponseMinutes} min` : "—"}
        />
        <Stat
          icon={<CheckCircle2 size={18} />}
          label="Avg Resolution Time"
          value={data.avgResolutionHours != null ? `${data.avgResolutionHours} hrs` : "—"}
        />
      </div>

      <p className="text-[11px] text-gray-400">
        "Calls Done" is approximated from leads with at least one follow-up logged — a
        dedicated call log isn't tracked yet.
      </p>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);