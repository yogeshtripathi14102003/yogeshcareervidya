"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { Send, CheckCircle, Clock, User, Trash2, Bell, Radio } from "lucide-react";

export default function AdminTiket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState({ id: "", text: "" });
  const [notifyAllText, setNotifyAllText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);

  // ─── Fetch Tickets ───────────────────────────────────────────────
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/tickat");
      if (res.data.success) setTickets(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ─── Notify Single Counselor (ticket-specific) ───────────────────
  const handleNotify = async (ticketId) => {
    if (!activeNote.text.trim()) return alert("Please type a message");
    try {
      setSending(true);
      const res = await api.patch(`/api/v1/tickat/${ticketId}/notify`, {
        message: activeNote.text,
      });
      if (res.data.success) {
        alert("Message sent to counselor!");
        setActiveNote({ id: "", text: "" });
        fetchTickets();
      }
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ─── Notify All Counselors (global broadcast) ────────────────────
  // Uses a dedicated broadcast endpoint so it's stored separately
  // from per-ticket adminMessages.
  // If you don't have that endpoint yet, fall back to patching every ticket.
  const handleNotifyAll = async () => {
    if (!notifyAllText.trim()) return alert("Please type a message");
    try {
      setSendingAll(true);

      await api.post("/api/v1/tickat/notify-all", { message: notifyAllText });

      alert("Broadcast sent to all counselors!");
      setNotifyAllText("");
      fetchTickets();
    } catch (err) {
      alert("Failed to broadcast message");
    } finally {
      setSendingAll(false);
    }
  };

  // ─── Resolve Ticket ──────────────────────────────────────────────
  const handleResolve = async (ticketId) => {
    const summary = prompt("Enter resolution summary:");
    if (!summary) return;
    try {
      const res = await api.put(`/api/v1/tickat/${ticketId}/resolve`, {
        summary,
        status: "Resolved",
      });
      if (res.data.success) {
        alert("Ticket marked as Resolved");
        fetchTickets();
      }
    } catch (err) {
      alert("Error resolving ticket");
    }
  };

  // ─── Delete Ticket ───────────────────────────────────────────────
  const handleDelete = async (ticketId) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await api.delete(`/api/v1/tickat/${ticketId}`);
      if (res.data.success) {
        alert("Ticket deleted successfully");
        fetchTickets();
      }
    } catch (err) {
      alert("Error deleting ticket");
    }
  };

  // ─── Loading state ───────────────────────────────────────────────
  if (loading)
    return (
      <div className="p-20 text-center text-gray-500 animate-pulse">
        Loading tickets...
      </div>
    );

  return (
    <div className="w-full space-y-6">

      {/* ── Page header ────────────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Counselor Tickets</h2>
        <button
          onClick={fetchTickets}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh List
        </button>
      </div>

      {/* ── BROADCAST — Notify ALL counselors ──────────────────────── */}
      {/* This message goes into globalMessages (shown in ALL counselor
          dashboards as a top banner, separate from ticket replies) */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={15} className="text-amber-700" />
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
            Broadcast to All Counselors
          </p>
        </div>
        <p className="text-[11px] text-amber-600 mb-3">
          This message will appear as a top notification banner for every counselor.
        </p>
        <textarea
          className="w-full border border-amber-200 p-2 text-sm rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          placeholder="Type broadcast message..."
          rows="3"
          value={notifyAllText}
          onChange={(e) => setNotifyAllText(e.target.value)}
        />
        <button
          onClick={handleNotifyAll}
          disabled={sendingAll}
          className="mt-2 w-full bg-amber-500 text-white py-2 rounded text-xs font-bold hover:bg-amber-600 disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          <Bell size={13} />
          {sendingAll ? "Sending..." : "Send Broadcast to All"}
        </button>
      </div>

      {/* ── Tickets list ───────────────────────────────────────────── */}
      <div className="grid gap-6">
        {tickets.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed rounded-xl text-gray-400">
            No tickets found.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Header */}
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {ticket.status === "Resolved" ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Clock className="text-amber-500 animate-pulse" size={20} />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                    <span className="text-[10px] text-gray-400">
                      ID: {ticket._id?.slice(-6)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(ticket._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

              {/* Body */}
              <div className="p-4 grid md:grid-cols-2 gap-6">
                {/* Left — issue details */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {ticket.description?.issue}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      <User size={13} />
                      Counselor:{" "}
                      <strong className="ml-1">
                        {ticket.counselorId?.name || ticket.counselor?.name || "N/A"}
                      </strong>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        ticket.description?.urgency === "Urgent"
                          ? "bg-red-100 text-red-700 animate-pulse"
                          : ticket.description?.urgency === "High"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ticket.description?.urgency || "Medium"}
                    </span>
                  </div>

                  {/* Previous admin messages on this ticket */}
                  {ticket.adminMessages?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">
                        Previous replies on this ticket
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                        {ticket.adminMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className="bg-indigo-50 border border-indigo-100 rounded p-2"
                          >
                            <p className="text-xs text-indigo-800">{msg.message}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {new Date(
                                msg.timestamp || ticket.updatedAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right — send reply to THIS counselor (ticket-specific) */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 uppercase mb-2 flex items-center gap-1">
                    <Send size={11} />
                    Reply to this counselor only
                  </p>
                  <textarea
                    className="w-full border p-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Send message to this counselor..."
                    rows="3"
                    value={activeNote.id === ticket._id ? activeNote.text : ""}
                    onChange={(e) =>
                      setActiveNote({ id: ticket._id, text: e.target.value })
                    }
                  />
                  <button
                    disabled={ticket.status === "Resolved" || sending}
                    onClick={() => handleNotify(ticket._id)}
                    className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded text-xs font-bold hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-1"
                  >
                    <Send size={12} />
                    {sending && activeNote.id === ticket._id
                      ? "Sending..."
                      : "Send Ping"}
                  </button>
                  {ticket.status === "Resolved" && (
                    <p className="text-[10px] text-gray-400 text-center mt-1">
                      Ticket resolved — replies disabled
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
                <span className="text-[10px] text-gray-400">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                {ticket.status !== "Resolved" ? (
                  <button
                    onClick={() => handleResolve(ticket._id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-green-700"
                  >
                    Resolve Ticket
                  </button>
                ) : (
                  <div className="text-green-600 font-bold text-xs flex items-center gap-1">
                    <CheckCircle size={13} /> Resolved
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


