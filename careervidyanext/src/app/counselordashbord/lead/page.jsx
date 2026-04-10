"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";
import { FaWhatsapp, FaFileExcel } from "react-icons/fa";
import StudentAdmission from "@/app/counselordashbord/components/StudentAdmission.jsx";
import * as XLSX from "xlsx";
import {
  Search, X, Save, Filter,
  ChevronLeft, ChevronRight, RefreshCw
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

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const fetchMyLeads = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const counselorId = storedUser?._id || storedUser?.id;

      if (!counselorId) return;

      const res = await api.get("/api/v1/counselor-leads", {
        params: {
          id: counselorId,
          page: currentPage,
          limit: itemsPerPage,
          searchTerm,
          status: filterStatus,
          fromDate: fromDate || (filterMonth ? `${filterYear}-${filterMonth}-01` : ""),
          toDate: toDate
        }
      });

      if (res.data.success) {
        setLeads(res.data.data);
        setTotalLeads(res.data.total);
        setStats(res.data.stats || []);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, fromDate, toDate, filterMonth, filterYear]);

  useEffect(() => {
    fetchMyLeads();
  }, [fetchMyLeads]);

  // --- EXCEL DOWNLOAD LOGIC ---
  const downloadExcel = () => {
    if (leads.length === 0) return alert("Download ke liye koi data nahi hai!");
    
    const excelData = leads.map((l) => ({
      "Lead Date": new Date(l.createdAt).toLocaleDateString(),
      "Name": l.name,
      "Phone": l.phone,
      "Email": l.email || "N/A",
      "Course": l.course,
      "City": l.city,
      "Status": l.status === "Not Picked" ? "Dead Lead" : l.status,
      "Remark": l.remark || "",
      "Last Follow-up": l.followUpDate ? new Date(l.followUpDate).toLocaleString() : "No Date"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Leads");
    XLSX.writeFile(workbook, `Counselor_Leads_${new Date().toLocaleDateString()}.xlsx`);
  };

  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) {
        setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, ...res.data.data } : l)));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const totalPages = Math.ceil(totalLeads / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Pagination Component */
  const PaginationControls = ({ isTop = false }) => (
    <div className={`flex items-center gap-3 ${isTop ? "justify-end" : "justify-center mt-6 mb-10 flex-col"}`}>
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1} 
          onClick={() => handlePageChange(currentPage - 1)} 
          className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50 disabled:opacity-30 text-xs font-bold transition-all"
        >
          <ChevronLeft size={16}/>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border rounded-md text-[11px] font-bold shadow-sm">
          <span className="text-blue-600">Page {currentPage}</span>
          <span className="text-gray-400">of</span>
          <span>{totalPages}</span>
        </div>

        <button 
          disabled={currentPage === totalPages} 
          onClick={() => handlePageChange(currentPage + 1)} 
          className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50 disabled:opacity-30 text-xs font-bold transition-all"
        >
          <ChevronRight size={16}/>
        </button>
      </div>
      {!isTop && <span className="text-[11px] text-gray-400 italic font-medium">Showing {leads.length} leads</span>}
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Top Filter Bar with Download */}
      <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Filter size={16} /> <span className="text-xs uppercase">Filter:</span>
            </div>
            <select value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }} className="border p-1.5 rounded text-xs outline-none bg-gray-50">
            <option value="">Full Year</option>
            {MONTHS.map((m) => <option key={m.val} value={m.val}>{m.label}</option>)}
            </select>
            <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }} className="border p-1.5 rounded text-xs outline-none bg-gray-50">
            <option value="2025">2025</option><option value="2026">2026</option>
            </select>
            {loading && <RefreshCw size={16} className="animate-spin text-blue-600" />}
        </div>

        <button 
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <FaFileExcel size={14} /> Download Lead (Excel)
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-11 gap-2 mb-4">
        <Stat title="Total" value={totalLeads} color="#2563eb" isActive={filterStatus === ""} onClick={() => setFilterStatus("")} />
        {STATUS.map((s) => {
          const count = stats.find(item => item._id === s)?.count || 0;
          return (
            <Stat 
              key={s} 
              title={s === "Not Picked" ? "Dead Lead" : s} 
              value={count} 
              color={s === "Not Picked" ? "#ef4444" : "#64748b"} 
              isActive={filterStatus === s} 
              onClick={() => { setFilterStatus(s); setCurrentPage(1); }} 
            />
          )
        })}
      </div>

      {/* Search Bar & TOP PAGINATION */}
      <div className="bg-white p-3 rounded shadow-sm mb-4 flex flex-wrap gap-2 items-center justify-between border">
        <div className="flex flex-1 items-center gap-2 min-w-[300px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} className="border p-1.5 rounded text-xs bg-gray-50" />
          <button onClick={() => { setSearchTerm(""); setFilterStatus(""); setFromDate(""); setFilterMonth(""); }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><X size={18} /></button>
        </div>
        
        {totalPages > 1 && <PaginationControls isTop={true} />}
      </div>

      {/* Table Section */}
      <div className={`bg-white rounded shadow-sm overflow-x-auto border ${loading ? "opacity-60" : ""}`}>
        <table className="w-full min-w-[1000px] border-collapse text-[11px]">
          <thead className="bg-gray-100 text-gray-600 border-b uppercase font-bold">
            <tr>
              <th className="p-3 text-left">Student Info</th>
              <th className="text-left">Details</th>
              <th className="text-left">Status</th>
              <th className="text-left">Remark</th>
              <th className="text-left">Follow-Up</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {leads.map((l) => (
              <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
            ))}
            {leads.length === 0 && !loading && <tr><td colSpan="6" className="p-10 text-center text-gray-400 text-sm">No leads found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* BOTTOM PAGINATION */}
      {totalPages > 1 && <PaginationControls isTop={false} />}
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const Stat = ({ title, value, color, onClick, isActive }) => (
  <div onClick={onClick} className={`bg-white border-l-[4px] p-2.5 rounded shadow-sm cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-md ${isActive ? "ring-2 ring-blue-500" : ""}`} style={{ borderLeftColor: color }}>
    <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{title}</p>
    <p className="text-xl font-black text-gray-800 leading-none mt-1">{value}</p>
  </div>
);

const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState(lead.status);
  const [localRemark, setLocalRemark] = useState("");
  const [localDate, setLocalDate] = useState(formatForInput(lead.followUpDate));
  const [showAdmission, setShowAdmission] = useState(false);

  const createdAt = new Date(lead.createdAt);
  const diffDays = Math.ceil(Math.abs(new Date() - createdAt) / (1000 * 60 * 60 * 24));
  const isDeadRestricted = localStatus === "Not Picked" && diffDays < 10;
  const hasChange = localStatus !== lead.status || localRemark !== "" || localDate !== formatForInput(lead.followUpDate);

  const handleUpdate = () => {
    if (isDeadRestricted) {
      alert(`Error: Dead Lead status sirf 10 din ke baad hi select kar sakte hain.`);
      return;
    }
    onSave(lead._id, { 
      status: localStatus, 
      remark: localRemark, 
      followUpDate: localDate ? new Date(localDate).toISOString() : null 
    }); 
    setLocalRemark(""); 
  };

  return (
    <>
      <tr className={`hover:bg-blue-50/50 transition-colors ${isToday(lead.followUpDate) ? "bg-red-50/60" : ""}`}>
        <td className="p-3 border-r border-gray-50">
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm uppercase">{lead.name}</span>
            {/* <span className={`text-[9px] font-bold px-1 w-fit rounded mt-0.5 ${diffDays >= 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
               Age: {diffDays} Days
            </span> */}
            <div className="flex items-center gap-2 mt-1.5">
              <a href={`tel:${lead.phone}`} className="text-blue-600 font-bold hover:underline">{lead.phone}</a>
              <a href={`https://wa.me/${lead.phone}`} target="_blank" className="text-green-500 hover:scale-110 transition-transform"><FaWhatsapp size={15} /></a>
            </div>
          </div>
        </td>
        <td className="border-r border-gray-50">
          <div className="flex flex-col">
            <span className="text-gray-500 font-semibold">{lead.city || "Unknown City"}</span>
            <span className="text-indigo-600 font-black uppercase text-[9px] tracking-wider">{lead.course}</span>
          </div>
        </td>
        <td className="border-r border-gray-50">
          <select 
            value={localStatus} 
            onChange={(e) => setLocalStatus(e.target.value)} 
            className={`border rounded p-1 text-[10px] font-bold outline-none bg-white shadow-sm ${isDeadRestricted ? "text-red-500 border-red-200" : "text-gray-700"}`}
          >
            {STATUS.map(s => {
               const isDisabled = s === "Not Picked" && diffDays < 10;
               const label = s === "Not Picked" ? "Dead Lead" : s;
               return (
                <option key={s} value={s} disabled={isDisabled} className={isDisabled ? "text-gray-300" : "text-black"}>
                  {s === "Not Picked" && isDisabled ? `Dead Lead (${10-diffDays}d left)` : label}
                </option>
               )
            })}
          </select>
        </td>
        <td className="p-2 max-w-[200px] border-r border-gray-50">
          <div className="text-[9px] text-gray-400 truncate mb-1 border-b pb-1 italic">{lead.remark || "No history"}</div>
          <input type="text" value={localRemark} onChange={(e) => setLocalRemark(e.target.value)} placeholder="Add new remark..." className="w-full p-1 text-[10px] outline-none bg-gray-50 rounded border border-transparent focus:border-blue-300 focus:bg-white transition-all" />
        </td>
        <td className="border-r border-gray-50">
          <input type="datetime-local" value={localDate} onChange={(e) => setLocalDate(e.target.value)} className="border rounded p-1 text-[10px] font-medium outline-none bg-white shadow-sm" />
        </td>
        <td className="p-3 text-center">
          <div className="flex gap-2 justify-center">
            <button 
                disabled={!hasChange || isDeadRestricted} 
                onClick={handleUpdate} 
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold disabled:opacity-20 flex items-center gap-1 shadow-sm hover:bg-blue-700 transition-colors"
            >
                <Save size={12}/> Save
            </button>
            <button onClick={() => setShowAdmission(true)} className="bg-orange-500 text-white px-3 py-1.5 rounded-md font-bold shadow-sm hover:bg-orange-600 transition-colors">View</button>
          </div>
        </td>
      </tr>

      {/* Admission Modal */}
      {showAdmission && (
        <tr>
          <td colSpan="6" className="p-0 border-none">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
                  <h3 className="font-black text-gray-700 uppercase tracking-tight">Lead Management Detail</h3>
                  <button onClick={() => setShowAdmission(false)} className="bg-white p-1 rounded-full text-gray-400 hover:text-red-500 hover:shadow transition-all"><X size={24}/></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
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

export default LeadsPage;