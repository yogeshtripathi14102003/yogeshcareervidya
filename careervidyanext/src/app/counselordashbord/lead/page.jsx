"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import StudentAdmission from "@/app/counselordashbord/components/StudentAdmission.jsx";
import {
  Search,
  X,
  Calendar,
  Save,
  Mail,
  MapPin,
  Bell,
  XCircle,
  Download,
  Filter,
} from "lucide-react";

/* ================= STATUS CONSTANTS ================= */

const STATUS = [
  "New",
  "Not Interested",

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
const MONTHS = [
  { val: "01", label: "January" }, { val: "02", label: "February" },
  { val: "03", label: "March" }, { val: "04", label: "April" },
  { val: "05", label: "May" }, { val: "06", label: "June" },
  { val: "07", label: "July" }, { val: "08", label: "August" },
  { val: "09", label: "September" }, { val: "10", label: "October" },
  { val: "11", label: "November" }, { val: "12", label: "December" }
];

/* ================= HELPERS ================= */

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

/* ================= MAIN COMPONENT ================= */

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState(""); 
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [reminders, setReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) setLeads(res.data.data);
    } catch (err) {
      console.error("Lead load error", err);
    }
  };

  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) fetchLeads();
    } catch (err) {
      alert("Update failed");
    }
  };

  const myLeads = leads.filter((l) => {
    if (!currentUser) return false;
    return (
      l.assignedTo === currentUser._id ||
      l.assignedTo?._id === currentUser._id
    );
  });

  const filteredLeads = myLeads.filter((l) => {
    const createdAt = new Date(l.createdAt);
    const leadDateOnly = l.createdAt?.slice(0, 10);
    const leadMonth = (createdAt.getMonth() + 1).toString().padStart(2, '0');
    const leadYear = createdAt.getFullYear().toString();
    const search = searchTerm.toLowerCase();

    if (filterMonth && leadMonth !== filterMonth) return false;
    if (filterYear && leadYear !== filterYear) return false;
    if (fromDate && leadDateOnly < fromDate) return false;
    if (toDate && leadDateOnly > toDate) return false;
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

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Phone", "Status", "Course", "Remark"];
    const rows = filteredLeads.map(l => [
      l.createdAt?.slice(0, 10),
      l.name,
      l.phone,
      l.status,
      l.course,
      l.remark?.replace(/,/g, " ")
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.body.appendChild(document.createElement('a'));
    link.href = url;
    link.download = `Leads_Report_${filterMonth || 'All'}_${filterYear}.csv`;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">

      {/* ================= REPORT FILTER BAR ================= */}
      <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Filter size={16} />
            <span className="text-xs uppercase tracking-wider">Reports:</span>
        </div>
        <select 
          value={filterMonth} 
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border p-1.5 rounded text-xs bg-gray-50 outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Full Year</option>
          {MONTHS.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
        </select>

        <select 
          value={filterYear} 
          onChange={(e) => setFilterYear(e.target.value)}
          className="border p-1.5 rounded text-xs bg-gray-50 outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <button 
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-2 transition-all ml-auto"
        >
          <Download size={14} /> Download Report
        </button>
      </div>
      
      {/* ================= CLICKABLE STATUS CARDS (RESPONSIVE) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10 gap-2 mb-4">
        <Stat
          title="Total Leads"
          value={myLeads.length}
          color="#2563eb"
          isActive={filterStatus === ""}
          onClick={() => setFilterStatus("")}
        />

        {STATUS.map((status, index) => {
          const count = myLeads.filter((l) => l.status === status).length;
          const colors = ["#22c55e", "#f97316", "#ef4444", "#a855f7", "#06b6d4", "#84cc16", "#eab308", "#f43f5e", "#6366f1"];
          return (
            <Stat
              key={status}
              title={status}
              value={count}
              color={colors[index % colors.length]}
              isActive={filterStatus === status}
              onClick={() => setFilterStatus(status)}
            />
          );
        })}
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-3 rounded shadow-sm mb-4 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex gap-1 items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-1.5 rounded text-xs"
          />
          <span className="text-gray-400 text-[10px] font-bold">TO</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-1.5 rounded text-xs"
          />
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setFromDate("");
            setToDate("");
            setFilterStatus("");
            setFilterMonth("");
          }}
          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Clear Filters"
        >
          <X size={18} />
        </button>

        <button
          onClick={() => setShowReminderModal(true)}
          className={`p-2 rounded-full text-white transition-all shadow-md ml-auto ${
            reminders.length > 0 ? "bg-red-500 animate-pulse scale-105" : "bg-gray-400"
          }`}
        >
          <Bell size={16} />
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded shadow-sm overflow-x-auto border border-gray-100">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 border-b uppercase">
            <tr>
              <th className="p-3 text-left">Student Information</th>
              <th className="text-left">Details</th>
              <th className="text-left">Current Status</th>
              <th className="text-left">Remark History</th>
              <th className="text-left">Next Follow-Up</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((l) => (
                <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400 text-sm">
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}
      {showReminderModal && (
        <ReminderModal
          reminders={reminders}
          close={() => setShowReminderModal(false)}
        />
      )}
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const Stat = ({ title, value, color, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`bg-white border-l-[3px] p-2.5 rounded shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-95 ${
      isActive ? "ring-2 ring-blue-500 ring-offset-1" : "border-gray-100"
    }`}
    style={{ borderLeftColor: color }}
  >
    <p className="text-[9px] text-gray-500 font-black uppercase tracking-tight truncate mb-0.5" title={title}>
      {title}
    </p>
    <p className="text-xl font-bold text-gray-800 leading-none">{value}</p>
  </div>
);

const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState("");
  const [localRemark, setLocalRemark] = useState("");
  const [localDate, setLocalDate] = useState("");
  const [showAdmission, setShowAdmission] = useState(false);

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
    <>
      <tr className={`hover:bg-blue-50/40 transition-colors ${isTodayReminder ? "bg-red-50/40" : ""}`}>
        <td className="p-3">
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-800 leading-tight">{lead.name}</span>
            <a
  href={`tel:${lead.phone}`}
  className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
>
  {lead.phone}
</a>

            <span className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5">
              <Mail size={8} /> {lead.email || "No Email"}
            </span>
          </div>
        </td>
        <td className="py-2">
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[11px] text-gray-600">
              <MapPin size={10} className="text-gray-400" /> {lead.city}
            </span>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight">{lead.course}</span>
          </div>
        </td>
        <td className="py-2">
          <select
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            className="border rounded px-1.5 py-1 text-[10px] bg-white focus:border-blue-500 outline-none shadow-sm font-medium"
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="p-2 max-w-[180px]">
          <div className="text-[9px] bg-gray-50 p-1.5 rounded text-gray-500 mb-1 truncate border border-gray-100" title={lead.remark}>
            {lead.remark || "No previous history"}
          </div>
          <input
            type="text"
            value={localRemark}
            onChange={(e) => setLocalRemark(e.target.value)}
            placeholder="Quick remark..."
            className="border rounded w-full p-1 text-[10px] focus:ring-1 focus:ring-blue-400 outline-none"
          />
        </td>
        <td className="py-2">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className={isTodayReminder ? "text-red-600 animate-pulse" : "text-gray-300"} />
            <input
              type="datetime-local"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              className={`border rounded p-1 text-[10px] outline-none ${isTodayReminder ? "border-red-300 bg-red-50" : "text-gray-600"}`}
            />
          </div>
        </td>
        <td className="p-3 text-center">
          <div className="flex items-center justify-center gap-1.5">
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
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded text-[10px] font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-sm"
            >
              <Save size={12} /> Update
            </button>
            <button
              onClick={() => setShowAdmission(true)}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold transition-all shadow-sm"
            >
              View
            </button>
          </div>
        </td>
      </tr>

      {showAdmission && (
        <tr>
          <td colSpan="6" className="p-0 border-none">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex justify-center items-center z-[70] p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <div className="bg-white border-b p-4 flex justify-between items-center shrink-0">
                  <h3 className="font-bold text-lg text-gray-800">Student Admission Details</h3>
                  <button 
                    onClick={() => setShowAdmission(false)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-400 transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto">
                  <StudentAdmission lead={lead} onClose={() => setShowAdmission(false)} />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const ReminderModal = ({ reminders, close }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white p-5 rounded-xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200">
      <button onClick={close} className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors">
        <XCircle size={22} />
      </button>
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
        <Bell size={20} /> Today's Reminders
      </h2>
      <div className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
        {reminders.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm italic">All caught up! No reminders today.</p>
        ) : (
          <ul className="space-y-2.5">
            {reminders.map((r) => (
              <li key={r._id} className="border-l-4 border-red-500 bg-red-50/50 p-3 rounded-r shadow-sm border">
                <p className="font-bold text-gray-800 text-sm">{r.leadName}</p>
                <p className="text-[10px] font-black text-red-600 uppercase mb-1">
                  {new Date(r.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-600 italic">"{r.note}"</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

export default LeadsPage;