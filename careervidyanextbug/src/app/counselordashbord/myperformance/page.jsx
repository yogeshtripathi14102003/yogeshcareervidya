"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  Clock, Hourglass, Phone, PhoneCall, CalendarCheck,
  Award, XCircle, TrendingUp, Timer, CheckCircle2, CalendarDays,
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

  const fmtTime = (d) => (d ? new Date(d).toLocaleString() : "—");

  if (loading && !data) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading your performance…</div>;
  }
  if (!data) {
    return <div className="p-8 text-center text-sm text-gray-400">No data available yet.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800">📈 My Performance</h1>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded px-2 py-1" />
          <span className="text-gray-400">to</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded px-2 py-1" />
          <button onClick={fetchAnalytics} className="bg-indigo-600 text-white px-3 py-1.5 rounded">
            Apply
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 flex gap-4">
        <span>Last login: {fmtTime(data.loginTime)}</span>
        <span>Last logout: {fmtTime(data.logoutTime)}</span>
      </div>

      {hours && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <CalendarDays size={13} /> Working Hours
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={<Clock size={18} />} label="Working Hours" value={`${data.workingHours}h`} />
        <Stat icon={<Hourglass size={18} />} label="Idle Time" value={`${data.idleMinutes} min`} />
        <Stat icon={<Phone size={18} />} label="Total Leads" value={data.totalLeads} />
        <Stat icon={<PhoneCall size={18} />} label="Calls Done" value={data.callsDone} />
        <Stat icon={<CalendarCheck size={18} />} label="Pending Calls" value={data.pendingCalls} />
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
        "Calls Done" is approximated from leads with at least one follow-up logged — a dedicated call log isn't tracked yet.
      </p>
    </div>
  );
}

const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);
