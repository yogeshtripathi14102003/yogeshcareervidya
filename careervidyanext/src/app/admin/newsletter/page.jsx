"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  Users, UserCheck, TrendingUp, MousePointerClick, Search,
  Download, Trash2, Send, Mail, Eye, X, ChevronRight,
} from "lucide-react";

const TABS = [
  { key: "campaigns", label: "Campaigns" },
  { key: "subscribers", label: "Subscribers" },
  { key: "compose", label: "Send New" },
];

export default function NewsletterPage() {
  const [tab, setTab] = useState("campaigns");
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/v1/newsletter/analytics");
      setAnalytics(res.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Newsletter</h1>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} />} label="Total Subscribers" value={analytics.totalSubscribers} />
          <StatCard icon={<UserCheck size={18} />} label="Active & Confirmed" value={analytics.activeSubscribers} accent="text-green-600" />
          <StatCard icon={<TrendingUp size={18} />} label="New This Month" value={analytics.newThisMonth} accent="text-indigo-600" />
          <StatCard
            icon={<MousePointerClick size={18} />}
            label="Avg Open / Click Rate"
            value={`${analytics.avgOpenRate}% / ${analytics.avgClickRate}%`}
            accent="text-purple-600"
          />
        </div>
      )}

      <div className="flex gap-2 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              tab === t.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "campaigns" && <CampaignsTab />}
      {tab === "subscribers" && <SubscribersTab />}
      {tab === "compose" && <ComposeTab onSent={() => { fetchAnalytics(); setTab("campaigns"); }} />}
    </div>
  );
}

const StatCard = ({ icon, label, value, accent = "text-slate-800" }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className={`text-xl font-bold ${accent}`}>{value}</p>
    </div>
  </div>
);

/* ================= CAMPAIGNS ================= */
function CampaignsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/logs");
      setLogs(res.data?.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const openDeliveries = async (campaign) => {
    setSelectedCampaign(campaign);
    try {
      const res = await api.get(`/api/v1/logs/${campaign._id}/deliveries`);
      setDeliveries(res.data?.deliveries || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b bg-slate-50">
            <th className="py-3 px-4">Subject</th>
            <th className="py-3 px-4">Recipients</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Open Rate</th>
            <th className="py-3 px-4">Click Rate</th>
            <th className="py-3 px-4">Sent</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="p-6 text-center text-gray-400">Loading…</td></tr>
          ) : logs.length === 0 ? (
            <tr><td colSpan={7} className="p-6 text-center text-gray-400">No campaigns sent yet.</td></tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">{log.subject}</td>
                <td className="py-3 px-4">{log.totalRecipients}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.status === "sent" ? "bg-green-100 text-green-700"
                      : log.status === "failed" ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {log.status} {log.status !== "pending" && `(${log.successCount}/${log.failedCount} fail)`}
                  </span>
                </td>
                <td className="py-3 px-4">{log.openRate}%</td>
                <td className="py-3 px-4">{log.clickRate}%</td>
                <td className="py-3 px-4 text-xs text-gray-400">
                  {log.sentAt ? new Date(log.sentAt).toLocaleString() : "—"}
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => openDeliveries(log)} className="text-indigo-600 flex items-center gap-1 text-xs">
                    Details <ChevronRight size={13} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-sm">{selectedCampaign.subject} — Delivery Log</h3>
              <button onClick={() => { setSelectedCampaign(null); setDeliveries(null); }}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!deliveries ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : deliveries.length === 0 ? (
                <p className="text-sm text-gray-400">No delivery records.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-400 border-b">
                      <th className="py-1.5">Email</th>
                      <th className="py-1.5">Status</th>
                      <th className="py-1.5">Opened</th>
                      <th className="py-1.5">Clicked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((d) => (
                      <tr key={d._id} className="border-b last:border-0">
                        <td className="py-1.5">{d.email}</td>
                        <td className="py-1.5">
                          <span className={d.status === "sent" ? "text-green-600" : "text-red-500"}>{d.status}</span>
                          {d.error && <span className="text-gray-400 ml-1" title={d.error}>ⓘ</span>}
                        </td>
                        <td className="py-1.5">{d.openedAt ? "✓" : "—"}</td>
                        <td className="py-1.5">{d.clickedAt ? "✓" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SUBSCRIBERS ================= */
function SubscribersTab() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/subscribers", {
        params: { page, limit: 20, search: search || undefined, status: status || undefined },
      });
      setSubscribers(res.data?.subscribers || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSubscribers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await api.delete(`/api/v1/subscribers/${id}`);
      fetchSubscribers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await api.get("/api/v1/subscribers/export", {
        params: { format, status: status || undefined },
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      const disposition = res.headers["content-disposition"];
      const match = disposition?.match(/filename="(.+)"/);
      a.download = match?.[1] || `subscribers.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Export failed. Please try again.");
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email"
              className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-56"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded-lg px-2 py-1.5 text-sm">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Unsubscribed</option>
            <option value="unverified">Unverified</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm">Search</button>
        </form>

        <div className="flex gap-2">
          <button onClick={() => handleExport("xlsx")} className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">
            <Download size={13} /> Excel
          </button>
          <button onClick={() => handleExport("csv")} className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b bg-slate-50">
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Verified</th>
              <th className="py-2 px-4">Subscribed</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Loading…</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No subscribers found.</td></tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s._id} className="border-b last:border-0">
                  <td className="py-2 px-4">{s.email}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{s.verified ? "✓" : "—"}</td>
                  <td className="py-2 px-4 text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleDelete(s._id)} className="text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
          <span className="px-2 py-1">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

/* ================= COMPOSE / SEND ================= */
function ComposeTab({ onSent }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !body) return alert("Please enter both subject & content");
    if (!confirm("Send this newsletter to every active, confirmed subscriber?")) return;

    setSending(true);
    setMsg("");
    try {
      const res = await api.post("/api/v1/send", { subject, body });
      setMsg(res.data?.msg || "Sending started");
      setSubject("");
      setBody("");
      onSent?.();
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
      <h2 className="font-semibold flex items-center gap-2 mb-4">
        <Send size={16} /> Compose Campaign
      </h2>
      {msg && <p className="text-sm text-indigo-600 mb-3">{msg}</p>}
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Subject</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2.5 text-sm"
            placeholder="Enter subject…"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Content (HTML supported)</label>
          <textarea
            className="w-full border rounded-lg p-2.5 text-sm min-h-[220px] font-mono"
            placeholder="Write the newsletter body… you can use basic HTML tags."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <Mail size={11} /> An unsubscribe link and open-tracking pixel are added automatically.
            Any links you include will be tracked for clicks too.
          </p>
        </div>
        <button
          type="submit"
          disabled={sending}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={14} /> {sending ? "Sending…" : "Send Newsletter"}
        </button>
      </form>
    </div>
  );
}
