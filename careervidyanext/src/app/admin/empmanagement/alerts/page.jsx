"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Cake, Trophy, Calendar, Mail } from "lucide-react";
import api from "@/utlis/api.js";

export default function AlertsPage() {
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("all");
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/v1/employees/alerts", { params: { days: 90 } })
      .then((res) => setAllAlerts(res.data?.data || []))
      .catch((e) => setError(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      allAlerts.filter((a) => {
        const dayOk = a.daysUntil <= days;
        const typeOk = type === "all" || a.type === type;
        return dayOk && typeOk;
      }),
    [allAlerts, days, type]
  );

  const today        = filtered.filter((a) => a.daysUntil === 0);
  const thisWeek     = filtered.filter((a) => a.daysUntil > 0 && a.daysUntil <= 7);
  const later        = filtered.filter((a) => a.daysUntil > 7);
  const birthdays    = filtered.filter((a) => a.type === "birthday").length;
  const anniversaries = filtered.filter((a) => a.type === "anniversary").length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={20} className="text-gray-500" />
          <h1 className="text-xl font-semibold text-gray-800">Employee Alerts</h1>
        </div>
        <p className="text-sm text-gray-500 ml-7">Upcoming birthdays & work anniversaries</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
        >
          <option value={7}>Next 7 days</option>
          <option value={30}>Next 30 days</option>
          <option value={60}>Next 60 days</option>
          <option value={90}>Next 90 days</option>
        </select>

        {["all", "birthday", "anniversary"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              type === t
                ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {t === "all" ? "All" : t === "birthday" ? "Birthdays" : "Anniversaries"}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total"         value={filtered.length} icon={<Bell size={16} />}      color="gray" />
        <StatCard title="Birthdays"     value={birthdays}       icon={<Cake size={16} />}      color="amber" />
        <StatCard title="Anniversaries" value={anniversaries}   icon={<Trophy size={16} />}    color="blue" />
        <StatCard title="Today"         value={today.length}    icon={<Calendar size={16} />}  color="green" />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">
          Loading alerts…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">
          No alerts found for this period
        </div>
      ) : (
        <>
          {today.length    > 0 && <Section title="Today"     alerts={today}    />}
          {thisWeek.length > 0 && <Section title="This Week" alerts={thisWeek} />}
          {later.length    > 0 && <Section title="Coming Up" alerts={later}    />}
        </>
      )}
    </div>
  );
}

/* ─── Section ─── */
function Section({ title, alerts }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h2>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
          {alerts.length}
        </span>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
        {alerts.map((a, i) => <AlertCard key={i} alert={a} />)}
      </div>
    </div>
  );
}

/* ─── Alert Card ─── */
function AlertCard({ alert: a }) {
  const isBday = a.type === "birthday";

  const badgeClass =
    a.daysUntil === 0
      ? "bg-green-50 text-green-700 border-green-200"
      : a.daysUntil <= 7
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-gray-100 text-gray-500 border-gray-200";

  const badgeLabel =
    a.daysUntil === 0 ? "Today" : `${a.daysUntil}d`;

  const initials = a.employee?.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarClass = isBday
    ? "bg-amber-100 text-amber-700"
    : "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all">

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${avatarClass}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{a.employee?.name}</p>
            <p className="text-xs text-gray-400 truncate">{a.employee?.designation}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs mb-3">
        {[
          ["ID",         a.employee?.empId],
          ["Department", a.employee?.department],
          ["Date",       a.date],
          ["Type",       isBday ? "Birthday" : "Anniversary"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-gray-400">{k}</span>
            <span className="text-gray-700 font-medium">{v}</span>
          </div>
        ))}
      </div>

      {/* Email */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center gap-1.5">
        <Mail size={11} className="text-gray-300 shrink-0" />
        <p className="text-xs text-gray-400 truncate">{a.employee?.email}</p>
      </div>

      {/* Anniversary years */}
      {!isBday && a.yearsCompleting && (
        <div className="mt-2.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-center text-xs text-blue-600">
          Completing {a.yearsCompleting} year{a.yearsCompleting > 1 ? "s" : ""} with the company
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    gray:  "bg-gray-100 text-gray-500",
    amber: "bg-amber-100 text-amber-600",
    blue:  "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}
