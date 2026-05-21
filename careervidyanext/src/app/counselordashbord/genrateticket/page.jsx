"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/utlis/api.js";
import {
  AlertCircle,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Tag,
  Bell,
  History,
  Radio,
  X,
} from "lucide-react";

export default function RaiseTicketPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    issue: "",
    goals: "",
    urgency: "Medium",
  });
  const [myTickets, setMyTickets] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]); // broadcast from admin
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [dismissedGlobal, setDismissedGlobal] = useState([]); // dismissed broadcasts
  const [dismissedTicket, setDismissedTicket] = useState([]); // dismissed ticket replies

  // ─── Load user from localStorage ────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  // ─── Fetch this counselor's tickets + global broadcasts ──────────
  const fetchMyTickets = async (counselorId) => {
    try {
      if (!counselorId) return;

      // counselorId filter → only this counselor's tickets
      const res = await api.get(`/api/v1/tickat?counselorId=${counselorId}`);

      if (res.data.success) {
        setMyTickets(res.data.data);

        // Backend can return globalMessages alongside tickets
        // If you use a dedicated broadcast endpoint, fetch separately:
        // const gRes = await api.get("/api/v1/tickat/global-messages");
        // setGlobalMessages(gRes.data.data || []);

        // ── Using inline response (Option B — fallback) ──────────
        // Deduplicate global messages embedded inside ticket objects
        const allGlobal = (res.data.data || [])
          .flatMap((t) => t.globalMessages || [])
          .filter(
            (msg, i, arr) =>
              arr.findIndex((m) => (m._id || m.timestamp) === (msg._id || msg.timestamp)) === i
          )
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setGlobalMessages(allGlobal);
      }
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchMyTickets(user._id);
  }, [user]);

  // ─── Ticket-specific admin notifications ────────────────────────
  // Only tickets that have adminMessages AND haven't been dismissed
  const ticketNotifications = useMemo(() => {
    return myTickets
      .filter(
        (t) =>
          t.adminMessages?.length > 0 &&
          !dismissedTicket.includes(t._id)
      )
      .map((t) => ({
        ticketId: t._id,
        subject: t.subject,
        lastMsg: t.adminMessages[t.adminMessages.length - 1],
        totalReplies: t.adminMessages.length,
      }));
  }, [myTickets, dismissedTicket]);

  // ─── Global broadcast notifications (not yet dismissed) ─────────
  const visibleGlobal = useMemo(() => {
    return globalMessages.filter(
      (msg) => !dismissedGlobal.includes(msg._id || msg.timestamp)
    );
  }, [globalMessages, dismissedGlobal]);

  // ─── Form handlers ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      setStatus({ type: "error", msg: "User not logged in!" });
      return;
    }
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        subject: formData.subject,
        counselorId: user._id,        // ← schema ke saath match karta hai
        description: {
          issue: formData.issue,
          goals: formData.goals,
          urgency: formData.urgency,
        },
      };

      const res = await api.post("/api/v1/tickat", payload);
      if (res.data.success) {
        setStatus({ type: "success", msg: "Ticket raised successfully!" });
        setFormData({ subject: "", issue: "", goals: "", urgency: "Medium" });
        fetchMyTickets(user._id);
      }
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to submit ticket.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* ══════════════════════════════════════════════════════════
            NOTIFICATION BANNERS — shown at very top
        ═══════════════════════════════════════════════════════════ */}

        {/* 1. BROADCAST BANNER — admin ne sabhi ko bheja */}
        {visibleGlobal.length > 0 && (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <Radio size={16} className="animate-pulse" />
                Admin Broadcast
              </div>
              <button
                onClick={() =>
                  setDismissedGlobal((prev) => [
                    ...prev,
                    ...visibleGlobal.map((m) => m._id || m.timestamp),
                  ])
                }
                className="text-amber-400 hover:text-amber-700"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {visibleGlobal.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className="bg-white border border-amber-100 rounded p-2.5 flex justify-between items-start gap-3"
                >
                  <p className="text-xs text-gray-700 flex-1">{msg.message}</p>
                  <span className="text-[9px] text-amber-400 whitespace-nowrap">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. TICKET-SPECIFIC REPLY BANNER — admin ne is counselor ki ticket pe reply kiya */}
        {ticketNotifications.length > 0 && (
          <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Bell size={16} className="animate-bounce" />
                Admin replied on your tickets
              </div>
              <button
                onClick={() =>
                  setDismissedTicket((prev) => [
                    ...prev,
                    ...ticketNotifications.map((n) => n.ticketId),
                  ])
                }
                className="text-indigo-300 hover:text-indigo-700"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {ticketNotifications.map((note) => (
                <div
                  key={note.ticketId}
                  className="bg-white border border-indigo-100 rounded p-2.5 flex justify-between items-start gap-3"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase truncate">
                      Ticket: {note.subject}
                    </span>
                    <span className="text-xs text-gray-700 mt-0.5">
                      {note.lastMsg?.message}
                    </span>
                    {note.totalReplies > 1 && (
                      <span className="text-[9px] text-indigo-300 mt-0.5">
                        +{note.totalReplies - 1} more {note.totalReplies - 1 === 1 ? "reply" : "replies"} — see below
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">
                      {new Date(note.lastMsg?.timestamp).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() =>
                        setDismissedTicket((prev) => [...prev, note.ticketId])
                      }
                      className="text-[9px] text-indigo-300 hover:text-indigo-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            MAIN CONTENT — form + ticket history
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Raise Ticket Form ─────────────────────────── */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="bg-indigo-600 p-4 text-white font-bold text-md flex items-center gap-2">
              <MessageSquare size={18} />
              Raise a Ticket
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {status.msg && (
                <div
                  className={`flex items-center gap-2 p-3 rounded text-xs font-medium border ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  {status.msg}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Short title..."
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent 🔥</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Explain your issue
                </label>
                <textarea
                  name="issue"
                  rows="4"
                  required
                  value={formData.issue}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md text-sm resize-none outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-300 transition-all"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send size={15} />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── RIGHT: Ticket History ───────────────────────────── */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} />
                History ({myTickets.length})
              </h2>
              <button
                onClick={() => user?._id && fetchMyTickets(user._id)}
                className="text-xs text-indigo-500 hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
              {myTickets.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed rounded-xl text-gray-400 text-sm italic">
                  No tickets found in your history
                </div>
              ) : (
                myTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Status bar on left edge */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        ticket.status === "Resolved"
                          ? "bg-green-500"
                          : "bg-yellow-400"
                      }`}
                    />

                    {/* Ticket header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-indigo-500 mb-1">
                          <Tag size={13} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            ID: {ticket._id?.slice(-6)}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-md">
                          {ticket.subject}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            ticket.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`text-[9px] font-medium ${
                            ticket.description?.urgency === "Urgent"
                              ? "text-red-500 animate-pulse"
                              : "text-gray-400"
                          }`}
                        >
                          Priority: {ticket.description?.urgency}
                        </span>
                      </div>
                    </div>

                    {/* Issue description */}
                    <div className="bg-gray-50 p-3 rounded-md mb-3 text-sm text-gray-600 border-l-2 border-gray-200 italic">
                      {ticket.description?.issue}
                    </div>

                    {/* ── Admin replies specific to THIS ticket ────── */}
                    {ticket.adminMessages?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
                          <History size={12} />
                          Admin replies on this ticket ({ticket.adminMessages.length})
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                          {ticket.adminMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex gap-3 items-start"
                            >
                              <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 shrink-0">
                                <MessageSquare size={13} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs text-indigo-900 font-medium break-words">
                                  {msg.message}
                                </span>
                                <span className="text-[9px] text-gray-400 mt-1 uppercase">
                                  {new Date(
                                    msg.timestamp || ticket.updatedAt
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Created date */}
                    <p className="text-[9px] text-gray-300 mt-3">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}