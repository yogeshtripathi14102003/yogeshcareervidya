"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { FaWhatsapp } from "react-icons/fa";
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
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= CONSTANTS ================= */
const STATUS = [
  "New", "Not Interested", "Details Shared", "Follow-up", "Hot Lead",
  "University Issue", "Fee Issue", "Distance Issue", "Language Issue",
  "Not Picked", "Admission Done",
];

const MONTHS = [
  { val: "01", label: "January" }, { val: "02", label: "February" },
  { val: "03", label: "March" }, { val: "04", label: "April" },
  { val: "05", label: "May" }, { val: "06", label: "June" },
  { val: "07", label: "July" }, { val: "08", label: "August" },
  { val: "09", label: "September" }, { val: "10", label: "October" },
  { val: "11", label: "November" }, { val: "12", label: "December" },
];

/* ================= HELPERS ================= */
const formatForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const isToday = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString).toDateString() === new Date().toDateString();
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

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) setLeads(res.data.data);
    } catch (err) {
      console.error("Load error", err);
    }
  };

  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) {
        const updatedLead = res.data.data;
        setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, ...updatedLead } : l)));
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const myLeads = leads.filter((l) => {
    if (!currentUser) return false;
    return l.assignedTo === currentUser._id || l.assignedTo?._id === currentUser._id;
  });

  const filteredLeads = myLeads.filter((l) => {
    const createdAt = new Date(l.createdAt);
    const leadDateOnly = l.createdAt?.slice(0, 10);
    const leadMonth = (createdAt.getMonth() + 1).toString().padStart(2, "0");
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

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterMonth, filterYear, fromDate, toDate]);

  const exportToCSV = () => {
    const headers = ["Date", "Name", "Phone", "Status", "Course", "Remark", "City", "Email"];
    const rows = filteredLeads.map((l) => {
      // Excel mein "Not Picked" ko "Dead Lead" dikhane ke liye
      const statusForExcel = l.status === "Not Picked" ? "Dead Lead" : l.status;
      return [
        l.createdAt?.slice(0, 10), l.name, l.phone, statusForExcel, l.course,
        l.remark?.replace(/,/g, " "), l.city, l.email,
      ];
    });
    const csv = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Leads_Report.csv`;
    link.click();
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Filters Header */}
      <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <Filter size={16} /> <span className="text-xs uppercase">Reports:</span>
        </div>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="border p-1.5 rounded text-xs outline-none">
          <option value="">Full Year</option>
          {MONTHS.map((m) => <option key={m.val} value={m.val}>{m.label}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="border p-1.5 rounded text-xs outline-none">
          <option value="2025">2025</option><option value="2026">2026</option>
        </select>
        <button onClick={exportToCSV} className="bg-green-600 text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-2 ml-auto">
          <Download size={14} /> Download Report
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-11 gap-2 mb-4">
        <Stat title="Total" value={myLeads.length} color="#2563eb" isActive={filterStatus === ""} onClick={() => setFilterStatus("")} />
        {STATUS.map((s, i) => (
          <Stat 
            key={s} 
            title={s === "Not Picked" ? "Dead Lead" : s} 
            value={myLeads.filter(l => l.status === s).length} 
            color={["#22c55e", "#f97316", "#ef4444", "#a855f7", "#06b6d4", "#ec4899", "#8b5cf6", "#facc15", "#14b8a6", "#ef4444", "#2563eb"][i % 11]} 
            isActive={filterStatus === s} 
            onClick={() => setFilterStatus(s)} 
          />
        ))}
      </div>

      {/* Search Bar */}
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
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-1.5 rounded text-xs" />
          <span className="text-gray-400 text-[10px] font-bold uppercase mx-1">TO</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-1.5 rounded text-xs" />
        </div>

        <button
          onClick={() => { setSearchTerm(""); setFromDate(""); setToDate(""); setFilterStatus(""); setFilterMonth(""); }}
          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
        >
          <X size={18} />
        </button>

        <button onClick={() => setShowReminderModal(true)} className={`p-2 rounded-full text-white ml-auto ${reminders.length > 0 ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}>
          <Bell size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-x-auto border border-gray-100">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 border-b uppercase">
            <tr>
              <th className="p-3 text-left">Student Info</th>
              <th className="text-left">Details</th>
              <th className="text-left">Status</th>
              <th className="text-left">Remark History</th>
              <th className="text-left">Follow-Up</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentLeads.length > 0 ? (
              currentLeads.map((l) => (
                <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
              ))
            ) : (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 mt-4 border rounded shadow-sm">
          <div className="text-xs text-gray-500 font-medium">
            Showing <span className="text-blue-600 font-bold">{indexOfFirstItem + 1}</span> to <span className="text-blue-600 font-bold">{Math.min(indexOfLastItem, filteredLeads.length)}</span> of <span className="font-bold">{filteredLeads.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                const pg = index + 1;
                if (pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                  return (
                    <button key={pg} onClick={() => handlePageChange(pg)} className={`min-w-[32px] px-2 py-1 text-xs font-bold rounded border ${currentPage === pg ? "bg-blue-600 text-white shadow-md border-blue-600" : "text-gray-600 hover:bg-blue-50"}`}>
                      {pg}
                    </button>
                  );
                }
                if (pg === currentPage - 2 || pg === currentPage + 2) return <span key={pg} className="px-1 text-gray-400">...</span>;
                return null;
              })}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 border rounded hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showReminderModal && <ReminderModal reminders={reminders} close={() => setShowReminderModal(false)} />}
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const Stat = ({ title, value, color, onClick, isActive }) => (
  <div onClick={onClick} className={`bg-white border-l-[3px] p-2.5 rounded shadow-sm cursor-pointer transition-all ${isActive ? "ring-2 ring-blue-500" : ""}`} style={{ borderLeftColor: color }}>
    <p className="text-[9px] text-gray-500 font-black uppercase truncate">{title}</p>
    <p className="text-xl font-bold text-gray-800 leading-none">{value}</p>
  </div>
);

const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState(lead.status);
  const [localRemark, setLocalRemark] = useState("");
  const [localDate, setLocalDate] = useState(formatForInput(lead.followUpDate));
  const [showAdmission, setShowAdmission] = useState(false);

  const isTodayReminder = isToday(lead.followUpDate);
  const hasChange = localStatus !== lead.status || localRemark !== "" || localDate !== formatForInput(lead.followUpDate);

  const handleUpdate = () => {
    const daysPassed = Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24));

    // UI par humne "Not Picked" ko "Dead Lead" dikhaya hai, value wahi hai
    if (localStatus === "Not Picked" && daysPassed < 10) {
      alert(`Access Denied: "Dead Lead" status ko set karne ke liye lead kam se kam 10 din purani honi chahiye. (Abhi: ${daysPassed} din)`);
      return;
    }

    onSave(lead._id, { 
        status: localStatus, 
        remark: localRemark, 
        followUpDate: localDate ? new Date(localDate).toISOString() : null 
    }); 
    setLocalRemark("");
  };

  return [
    <tr key={`main-${lead._id}`} className={`hover:bg-blue-50/40 transition-colors ${isTodayReminder ? "bg-red-50/40" : ""}`}>
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-bold text-sm text-gray-800">{lead.name}</span>
          <div className="flex items-center gap-2">
            <a href={`tel:${lead.phone}`} className="text-[11px] text-blue-600 font-semibold">{lead.phone}</a>
            <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-500"><FaWhatsapp size={14} /></a>
          </div>
        </div>
      </td>
      <td className="py-2">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-600 flex items-center gap-1"><MapPin size={10} /> {lead.city}</span>
          <span className="text-[10px] text-indigo-500 font-bold uppercase">{lead.course}</span>
        </div>
      </td>
      <td className="py-2">
        <select value={localStatus} onChange={(e) => setLocalStatus(e.target.value)} className="border rounded px-1.5 py-1 text-[10px] outline-none">
          {STATUS.map(s => (
            <option key={s} value={s}>{s === "Not Picked" ? "Dead Lead" : s}</option>
          ))}
        </select>
      </td>
      <td className="p-2 max-w-[180px]">
        <div className="text-[9px] bg-gray-50 p-1.5 rounded text-gray-500 mb-1 truncate border">{lead.remark || "No history"}</div>
        <input type="text" value={localRemark} onChange={(e) => setLocalRemark(e.target.value)} placeholder="Quick remark..." className="border rounded w-full p-1 text-[10px] outline-none" />
      </td>
      <td className="py-2">
        <input type="datetime-local" value={localDate} onChange={(e) => setLocalDate(e.target.value)} className={`border rounded p-1 text-[10px] outline-none`} />
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button disabled={!hasChange} onClick={handleUpdate} className="bg-blue-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold disabled:opacity-20 flex items-center gap-1 shadow-sm">
            <Save size={12} /> Update
          </button>
          <button onClick={() => setShowAdmission(true)} className="bg-orange-500 text-white px-2.5 py-1.5 rounded text-[10px] font-bold shadow-sm">View</button>
        </div>
      </td>
    </tr>,
    showAdmission && (
      <tr key={`modal-${lead._id}`}>
        <td colSpan="6" className="p-0 border-none">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex justify-center items-center z-[70] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative">
              <div className="bg-white border-b p-4 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-lg text-gray-800">Student Admission Details</h3>
                <button onClick={() => setShowAdmission(false)} className="p-1.5 hover:text-red-500 rounded-full text-gray-400 transition-colors"><X size={22} /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                <StudentAdmission lead={lead} onClose={() => setShowAdmission(false)} />
              </div>
            </div>
          </div>
        </td>
      </tr>
    )
  ];
};

const ReminderModal = ({ reminders, close }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-2xl relative">
      <button onClick={close} className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors"><XCircle size={22} /></button>
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600"><Bell size={20} /> Today's Reminders</h2>
      <div className="max-h-[350px] overflow-y-auto">
        {reminders.length === 0 ? <p className="text-center py-10 text-gray-400 text-sm">No reminders today.</p> : (
          <ul className="space-y-2.5">
            {reminders.map(r => (
              <li key={r._id} className="border-l-4 border-red-500 bg-red-50/50 p-3 rounded-r border shadow-sm">
                <p className="font-bold text-gray-800 text-sm">{r.leadName}</p>
                <p className="text-[10px] font-black text-red-600 uppercase">{new Date(r.reminderTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
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