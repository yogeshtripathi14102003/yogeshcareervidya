"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import Reminders from "@/app/counselordashbord/components/Reminders.jsx";

import {
  Search,
  X,
  Calendar,
  Save,
  Mail,
  MapPin,
  Bell,
  XCircle,
} from "lucide-react";

/* ================= STATUS ================= */

const STATUS = [
  "Details Shared",
  "Follow-up",
  "Hot Lead",
  "University Issue",
  "Fee Issue",
  "Distance Issue",
  "Language Issue",
  "Not Picked",
  "Admission Done",
];

/* ================= DATE FIX ================= */

const formatForInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset);

  return local.toISOString().slice(0, 16);
};

const isToday = (dateString) => {
  if (!dateString) return false;

  const d = new Date(dateString);
  const today = new Date();

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

/* ================= MAIN ================= */

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [filterStatus, setFilterStatus] = useState("");

  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  /* INIT */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    fetchLeads();
    fetchReminders();
  }, []);

  /* API */

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");

      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (err) {
      console.log("Lead load error", err);
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await api.get("/api/v1/reminders/today");

      if (res.data.success) {
        setReminders(res.data.data);
      }
    } catch (err) {
      console.log("Reminder error", err);
    }
  };

  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);

      if (res.data.success) {
        fetchLeads();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  /* FILTER MY LEADS */

  const myLeads = leads.filter((l) => {
    if (!currentUser) return false;

    return (
      l.assignedTo === currentUser._id ||
      l.assignedTo?._id === currentUser._id
    );
  });

  /* SEARCH + FILTER */

  const filteredLeads = myLeads.filter((l) => {
    const leadDate = l.createdAt?.slice(0, 10);
    const search = searchTerm.toLowerCase();

    if (fromDate && leadDate < fromDate) return false;
    if (toDate && leadDate > toDate) return false;

    if (filterStatus && l.status !== filterStatus) return false;

    return (
      !searchTerm ||
      l.name?.toLowerCase().includes(search) ||
      l.phone?.includes(search) ||
      l.email?.toLowerCase().includes(search) ||
      l.city?.toLowerCase().includes(search) ||
      l.remark?.toLowerCase().includes(search)
    );
  });

  const hasRemindersToday = reminders.length > 0;

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= STATUS CARDS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">

        {/* TOTAL */}
        <Stat
          title="Total"
          value={myLeads.length}
          color="#2563eb"
        />

        {/* DYNAMIC STATUS */}
        {STATUS.map((status, index) => {

          const count = myLeads.filter(
            (l) => l.status === status
          ).length;

          const colors = [
            "#22c55e",
            "#f97316",
            "#ef4444",
            "#a855f7",
            "#06b6d4",
            "#84cc16",
            "#eab308",
            "#f43f5e",
            "#6366f1",
          ];

          return (
            <Stat
              key={status}
              title={status}
              value={count}
              color={colors[index % colors.length]}
            />
          );
        })}

      </div>

      {/* ================= FILTER ================= */}

      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-3 relative">

        <div className="relative flex-1 min-w-[260px]">

          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded"
          />
        </div>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-1 rounded text-sm"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-1 rounded text-sm"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Status</option>

          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setFromDate("");
            setToDate("");
            setFilterStatus("");
          }}
        >
          <X size={18} />
        </button>

        <button
          onClick={() => setShowReminderModal(true)}
          className={`absolute right-2 top-2 p-2 rounded-full text-white ${
            hasRemindersToday
              ? "bg-red-500 animate-pulse"
              : "bg-gray-400"
          }`}
        >
          <Bell size={18} />
        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded shadow overflow-auto">

        <table className="w-full min-w-[1100px]">

          <thead className="bg-gray-100 text-xs font-bold">

            <tr>
              <th className="p-3">Student</th>
              <th>Location</th>
              <th>Status</th>
              <th>Remark</th>
              <th>Follow-Up</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredLeads.map((l) => (
              <LeadRow
                key={l._id}
                lead={l}
                onSave={updateLeadAPI}
              />
            ))}

          </tbody>

        </table>

      </div>

      {/* ================= REMINDER MODAL ================= */}

      {showReminderModal && (
        <ReminderModal
          reminders={reminders}
          close={() => setShowReminderModal(false)}
        />
      )}

    </div>
  );
};

/* ================= ROW ================= */

const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState("");
  const [localRemark, setLocalRemark] = useState("");
  const [localDate, setLocalDate] = useState("");

  useEffect(() => {
    setLocalStatus(lead.status);
    setLocalDate(formatForInput(lead.followUpDate));
  }, [lead]);

  const isTodayReminder = isToday(lead.followUpDate);

  const hasChange =
    localStatus !== lead.status ||
    localRemark !== "" ||
    localDate !== formatForInput(lead.followUpDate);

  return (
    <tr
      className={`border-b hover:bg-blue-50 ${
        isTodayReminder
          ? "bg-red-50 border-l-4 border-red-500 animate-pulse"
          : ""
      }`}
    >

      {/* STUDENT */}
      <td className="p-3">

        <p className="font-bold">{lead.name}</p>

        <p className="text-xs text-blue-600">
          {lead.phone}
        </p>

        <p className="text-xs text-gray-500 flex gap-1">
          <Mail size={10} /> {lead.email || "N/A"}
        </p>

      </td>

      {/* LOCATION */}
      <td className="text-sm">

        <p className="flex gap-1">
          <MapPin size={12} /> {lead.city}
        </p>

        <p className="text-xs text-gray-400">
          {lead.course}
        </p>

      </td>

      {/* STATUS */}
      <td>

        <select
          value={localStatus}
          onChange={(e) => setLocalStatus(e.target.value)}
          className="border rounded p-1 text-xs"
        >

          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}

        </select>

      </td>

      {/* REMARK */}
      <td className="p-2">

        <p className="text-xs bg-gray-100 p-2 rounded mb-1">
          {lead.remark || "No history"}
        </p>

        <input
          type="text"
          value={localRemark}
          onChange={(e) => setLocalRemark(e.target.value)}
          placeholder="New remark..."
          className="border rounded w-full p-1 text-xs"
        />

      </td>

      {/* DATE */}
      <td>

        <div className="flex items-center gap-1">

          <Calendar
            size={12}
            className={
              isTodayReminder
                ? "text-red-600 animate-bounce"
                : ""
            }
          />

          <input
            type="datetime-local"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className="border rounded px-1 text-xs"
          />

        </div>

      </td>

      {/* ACTION */}
      <td className="text-center">

        <button
          disabled={!hasChange}
          onClick={() => {
            onSave(lead._id, {
              status: localStatus,
              remark: localRemark,
              followUpDate: localDate,
            });

            setLocalRemark("");
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
        >
          <Save size={12} /> Update
        </button>

      </td>

    </tr>
  );
};

/* ================= REMINDER MODAL ================= */

const ReminderModal = ({ reminders, close }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

    <div className="bg-white p-5 rounded w-full max-w-md relative">

      <button
        onClick={close}
        className="absolute top-3 right-3"
      >
        <XCircle size={18} />
      </button>

      <h2 className="font-bold mb-3 flex gap-2">
        <Bell size={18} /> Today Reminders
      </h2>

      {reminders.length === 0 ? (
        <p>No reminders today</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto">

          {reminders.map((r) => (
            <li
              key={r._id}
              className="border p-2 rounded"
            >

              <p className="font-medium">
                {r.leadName}
              </p>

              <p className="text-xs text-gray-500">
                {new Date(r.reminderTime).toLocaleString()}
              </p>

              <p className="text-sm">{r.note}</p>

            </li>
          ))}

        </ul>
      )}

    </div>

  </div>
);

/* ================= STAT CARD ================= */

const Stat = ({ title, value, color }) => (
  <div
    className="bg-white border-l-4 p-3 rounded shadow"
    style={{ borderLeftColor: color }}
  >
    <p className="text-xs text-gray-400 font-bold">
      {title}
    </p>

    <p className="text-xl font-bold">
      {value}
    </p>
  </div>
);

export default LeadsPage;
