"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import {
  AlertCircle,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Tag,
} from "lucide-react";

export default function RaiseTicketPage() {

  // ===============================
  // GET LOGGED-IN COUNSELOR DATA
  // ===============================
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // ===============================
  // FORM STATE
  // ===============================
  const [formData, setFormData] = useState({
    subject: "",
    issue: "",
    goals: "",
    urgency: "Medium",
  });

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  // ===============================
  // FETCH MY TICKETS
  // ===============================
  const fetchMyTickets = async (counselorId) => {
    try {
      if (!counselorId) return;

      const res = await api.get(
        `/api/v1/tickat?counselorId=${counselorId}`
      );

      if (res.data.success) {
        setMyTickets(res.data.data);
      }
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
  };

  // ===============================
  // LOAD TICKETS AFTER USER LOAD
  // ===============================
  useEffect(() => {
    if (user?._id) {
      fetchMyTickets(user._id);
    }
  }, [user]);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // SUBMIT TICKET
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      setStatus({
        type: "error",
        msg: "User not logged in!",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        subject: formData.subject,

        // SEND COUNSELOR INFO
        counselor: {
          id: user._id,
          name: user.name,
        },

        description: {
          issue: formData.issue,
          goals: formData.goals,
          urgency: formData.urgency,
        },
      };

      const res = await api.post("/api/v1/tickat", payload);

      if (res.data.success) {
        setStatus({
          type: "success",
          msg: "Ticket raised successfully!",
        });

        setFormData({
          subject: "",
          issue: "",
          goals: "",
          urgency: "Medium",
        });

        fetchMyTickets(user._id);
      }
    } catch (err) {
      setStatus({
        type: "error",
        msg:
          err.response?.data?.message ||
          "Failed to submit ticket.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* LEFT: FORM */}
        <div className="w-full md:max-w-md bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="border-b p-5">
            <h1 className="text-lg font-semibold text-gray-800">
              Support Ticket
            </h1>

            {user && (
              <p className="text-xs text-gray-500 mt-1">
                Logged in as:{" "}
                <span className="font-medium">
                  {user.name}
                </span>
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-4"
          >
            {/* STATUS */}
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

            {/* SUBJECT */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                required
                placeholder="Brief summary..."
                value={formData.subject}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
            </div>

            {/* URGENCY */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Urgency
              </label>

              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* ISSUE */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Issue
              </label>

              <textarea
                name="issue"
                rows="4"
                required
                value={formData.issue}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md text-sm resize-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-300"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send size={15} /> Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: TICKETS */}
        <div className="flex-1 w-full">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500 flex items-center gap-2">
              <Clock size={16} /> My Tickets
            </h2>

            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              {myTickets.length}
            </span>
          </div>

          <div className="space-y-3">
            {myTickets.length === 0 ? (
              <div className="text-center py-10 bg-white border rounded text-gray-400 text-sm">
                No tickets found
              </div>
            ) : (
              myTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  {/* HEADER */}
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-2 items-center">
                      <Tag size={14} />

                      <h3 className="font-semibold text-sm">
                        {ticket.subject}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        ticket.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {/* ISSUE */}
                  <p className="text-sm text-gray-500 mb-2">
                    {ticket.description?.issue}
                  </p>

                  {/* ADMIN MSG */}
                  {ticket.adminMessages?.length > 0 && (
                    <div className="border-t pt-2 text-xs">
                      <div className="flex gap-2 text-gray-600">
                        <MessageSquare size={13} />

                        {
                          ticket.adminMessages[
                            ticket.adminMessages.length - 1
                          ]?.message
                        }
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}