"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js"; // fixed spelling
import { Send, CheckCircle, Clock, User } from "lucide-react";

export default function AdminTiket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState({ id: "", text: "" });
  const [notifyAllText, setNotifyAllText] = useState(""); // State for Notify All

  // Fetch all tickets
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

  // Notify single counselor
  const handleNotify = async (ticketId) => {
    if (!activeNote.text.trim()) return alert("Please type a message");

    try {
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
    }
  };

  // Notify all counselors
  const handleNotifyAll = async () => {
    if (!notifyAllText.trim()) return alert("Please type a message");

    try {
      // Loop through all tickets and send message to each counselor
      const sendAll = tickets.map((ticket) =>
        api.patch(`/api/v1/tickat/${ticket._id}/notify`, {
          message: notifyAllText,
        })
      );
      await Promise.all(sendAll);

      alert("Message sent to all counselors!");
      setNotifyAllText("");
      fetchTickets();
    } catch (err) {
      alert("Failed to send message to all counselors");
    }
  };

  // Resolve Ticket
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

  if (loading)
    return (
      <div className="p-20 text-center text-gray-500 animate-pulse">
        Loading tickets...
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Counselor Tickets</h2>
        <button
          onClick={fetchTickets}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh List
        </button>
      </div>

      {/* Notify All Counselors */}
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <p className="text-[10px] font-bold text-blue-800 mb-2 uppercase">
          Notify All Counselors
        </p>
        <textarea
          className="w-full border p-2 text-sm rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Send message to all counselors..."
          rows="3"
          value={notifyAllText}
          onChange={(e) => setNotifyAllText(e.target.value)}
        />
        <button
          onClick={handleNotifyAll}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700 transition"
        >
          Send to All
        </button>
      </div>

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
              <div className="p-4 bg-gray-50/50 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {ticket.status === "Resolved" ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Clock className="text-amber-500 animate-pulse" size={20} />
                  )}
                  <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    ticket.description?.urgency === "Urgent"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {ticket.description?.urgency || "Medium"}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1 uppercase text-[10px]">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {ticket.description?.issue}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      <User size={14} />
                      <span>
                        Counselor:{" "}
                        <strong>{ticket.counselorId?.name || "N/A"}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notify Single */}
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-800 mb-2 uppercase">
                    Admin Instructions
                  </p>
                  <textarea
                    className="w-full border p-2 text-sm rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Send message to counselor..."
                    rows="2"
                    value={activeNote.id === ticket._id ? activeNote.text : ""}
                    onChange={(e) =>
                      setActiveNote({ id: ticket._id, text: e.target.value })
                    }
                  />
                  <button
                    disabled={ticket.status === "Resolved"}
                    onClick={() => handleNotify(ticket._id)}
                    className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded text-xs font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
                  >
                    Send Ping
                  </button>
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
                  <div className="text-green-600 font-bold text-xs">✓ Resolved</div>
                )}
              </div>

              {/* Last Admin Ping */}
              {ticket.adminMessages?.length > 0 && (
                <div className="p-3 bg-white border-t">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
                    Last Admin Ping:
                  </p>
                  <div className="text-[11px] italic text-gray-600 border-l-2 border-blue-200 pl-2">
                    "{ticket.adminMessages[ticket.adminMessages.length - 1].message}"
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
