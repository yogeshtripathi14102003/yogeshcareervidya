"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx"; 
import { FaWhatsapp, FaFileExcel, FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import StudentAdmission from "@/app/counselordashbord/components/StudentAdmission.jsx";
import {
  Search, X, Save, Filter,
  ChevronLeft, ChevronRight, MapPin, BookOpen, Smartphone
} from "lucide-react";

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

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [stats, setStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  /* ================= FETCH DATA (PAGINATED) ================= */
  const fetchMyLeads = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const counselorId = storedUser?._id || storedUser?.id;
      if (!counselorId) return;

      const params = {
        id: counselorId,
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchTerm.trim(),
        status: filterStatus || undefined,
      };

      if (filterMonth) params.fromDate = `${filterYear}-${filterMonth}-01`;

      const res = await api.get("/api/v1/counselor-leads", { params });
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
  }, [currentPage, searchTerm, filterStatus, filterMonth, filterYear]);

  useEffect(() => {
    fetchMyLeads();
  }, [fetchMyLeads]);

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const counselorId = storedUser?._id || storedUser?.id;
      
      const params = {
        id: counselorId,
        limit: "all",
        searchTerm: searchTerm.trim(),
        status: filterStatus || undefined,
      };

      if (filterMonth) params.fromDate = `${filterYear}-${filterMonth}-01`;

      const res = await api.get("/api/v1/counselor-leads", { params });
      
      if (res.data.success && res.data.data.length > 0) {
        const allLeads = res.data.data;

        const dataToExport = allLeads.map((lead) => ({
          "Lead Name": lead.name || "",
          "Phone Number": lead.phone || lead.mobile || lead.contactNo || "",
          "Course": lead.course || "",
          "City": lead.city || "",
          "Status": lead.status === "Not Picked" ? "Dead Lead" : lead.status,
          "Remark History": lead.remark || "",
          "Next Follow-up": lead.followUpDate ? new Date(lead.followUpDate).toLocaleString() : "N/A",
          "Created At": new Date(lead.createdAt).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MyLeads");

        const fileName = `Leads_${filterStatus || "All"}_${filterMonth || "All"}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } else {
        alert("Download ke liye koi data nahi mila!");
      }
    } catch (err) {
      console.error("Export error", err);
      alert("Export failed!");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadAPI = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) {
        fetchMyLeads();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const totalPages = Math.ceil(totalLeads / itemsPerPage);

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">
      {/* Top Bar */}
      <div className="bg-white border p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase">
            <Filter size={14} /> Filters:
          </div>
          <select value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }} className="border p-1.5 rounded bg-gray-50 outline-none cursor-pointer">
            <option value="">All Months</option>
            {MONTHS.map((m) => <option key={m.val} value={m.val}>{m.label}</option>)}
          </select>
          <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }} className="border p-1.5 rounded bg-gray-50 outline-none cursor-pointer">
            <option value="2025">2025</option><option value="2026">2026</option>
          </select>
        </div>

        <button 
          onClick={handleExportExcel}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          <FaFileExcel /> {loading ? "Processing..." : "Export Excel"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-11 gap-2 mb-4">
        <Stat title="Total" value={totalLeads} color="#1d4ed8" isActive={filterStatus === ""} onClick={() => { setFilterStatus(""); setCurrentPage(1); }} />
        {STATUS.map((s) => (
          <Stat 
            key={s} 
            title={s === "Not Picked" ? "Dead Lead" : s} 
            value={stats.find(item => item._id === s)?.count || 0} 
            color={s === "Not Picked" ? "#dc2626" : "#4b5563"} 
            isActive={filterStatus === s} 
            onClick={() => { setFilterStatus(s); setCurrentPage(1); }} 
          />
        ))}
      </div>

      {/* Search & Pagination */}
      <div className="bg-white p-3 rounded shadow-sm mb-4 border flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
           <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
           <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-3 py-1.5 border rounded text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-blue-400" />
        </div>
        <div className="flex items-center gap-2 font-bold text-xs">
           <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 border rounded bg-gray-50 disabled:opacity-30 hover:bg-white transition-colors"><ChevronLeft size={16}/></button>
           <span className="px-2 min-w-[100px] text-center">Page {currentPage} of {totalPages || 1}</span>
           <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 border rounded bg-gray-50 disabled:opacity-30 hover:bg-white transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`bg-white rounded shadow-sm overflow-x-auto border transition-opacity duration-300 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        <table className="w-full min-w-[1100px] border-collapse text-[11px]">
          <thead className="bg-slate-50 text-slate-500 border-b uppercase font-bold">
            <tr>
              <th className="p-3 text-left w-64">Lead Details</th>
              <th className="text-left w-48">Course & Location</th>
              <th className="text-left w-32">Status</th>
              <th className="text-left w-64">Remark & Follow-up</th>
              <th className="text-left w-40">Next Follow-up</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {leads.length > 0 ? (
              leads.map((l) => (
                <LeadRow key={l._id} lead={l} onSave={updateLeadAPI} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400 font-bold text-sm">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const Stat = ({ title, value, color, onClick, isActive }) => (
  <div onClick={onClick} className={`bg-white border-l-4 p-2.5 rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${isActive ? "ring-2 ring-blue-600 scale-105 shadow-md" : "border-gray-200"}`} style={{ borderLeftColor: color }}>
    <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{title}</p>
    <p className="text-lg font-black text-gray-800 leading-none mt-1">{value}</p>
  </div>
);

const LeadRow = ({ lead, onSave }) => {
  const [localStatus, setLocalStatus] = useState(lead.status);
  const [localRemark, setLocalRemark] = useState("");
  const [localDate, setLocalDate] = useState(formatForInput(lead.followUpDate));
  const [showAdmission, setShowAdmission] = useState(false);

  const phoneNumber = lead.phone || lead.mobile || lead.contactNo;
  const hasChange = localStatus !== lead.status || localRemark.trim() !== "" || localDate !== formatForInput(lead.followUpDate);

  const handleUpdate = () => {
    // 1. DEAD LEAD RESTRICTION (Only for "Not Picked")
    if (localStatus === "Not Picked") {
      const createdDate = new Date(lead.createdAt);
      const diffDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 10) {
        alert(` avi 10 days Nahi Huy please follwup kre. CONVERT HOGA APP kra Skte ho`);
        return;
      }
    }

    // 2. REMARK HISTORY (Append new remark to old ones)
    let finalRemark = lead.remark || "";
    if (localRemark.trim() !== "") {
      const timestamp = new Date().toLocaleString();
      finalRemark = finalRemark 
        ? `${finalRemark}\n[${timestamp}]: ${localRemark}` 
        : `[${timestamp}]: ${localRemark}`;
    }

    onSave(lead._id, { 
      status: localStatus, 
      remark: finalRemark, 
      followUpDate: localDate ? new Date(localDate).toISOString() : null 
    }); 
    setLocalRemark(""); 
  };

  return (
    <>
      <tr className={`hover:bg-blue-50/40 transition-colors ${isToday(lead.followUpDate) ? "bg-rose-50/50" : ""}`}>
        <td className="p-3 border-r border-gray-50">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-gray-900 text-[12px] uppercase flex items-center gap-1.5">
              <FaUserAlt size={10} className="text-slate-400" /> {lead.name || ""}
            </span>
            <div className="flex items-center gap-2">
               {phoneNumber && (
                 <>
                  <a href={`tel:${phoneNumber}`} className="text-[10px] text-blue-600 font-bold hover:underline bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <FaPhoneAlt size={9} /> {phoneNumber}
                  </a>
                  <a href={`https://wa.me/${phoneNumber.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:scale-110 transition-transform">
                    <FaWhatsapp size={16} />
                  </a>
                 </>
               )}
            </div>
          </div>
        </td>

        <td className="p-3 border-r border-gray-50">
          <div className="flex flex-col gap-1.5">
            {lead.course && (
              <div className="flex items-center gap-1 text-indigo-700 font-black uppercase text-[10px]">
                <BookOpen size={11} /> {lead.course}
              </div>
            )}
            {lead.city && (
              <div className="flex items-center gap-1 text-slate-500 font-bold uppercase text-[9px]">
                <MapPin size={10} /> {lead.city}
              </div>
            )}
          </div>
        </td>

        <td className="border-r border-gray-50 px-2">
          <select 
            value={localStatus} 
            onChange={(e) => setLocalStatus(e.target.value)} 
            className="border rounded p-1 text-[10px] font-bold w-full bg-white outline-none"
          >
            {STATUS.map(s => <option key={s} value={s}>{s === "Not Picked" ? "Dead Lead" : s}</option>)}
          </select>
        </td>

        <td className="p-2 border-r border-gray-50">
          <div className="flex flex-col gap-1">
            {/* Scrollable Remark History to see all past remarks */}
            <div className="text-[9px] text-blue-800 font-semibold bg-blue-50/50 p-1 rounded border border-blue-100 max-h-12 overflow-y-auto whitespace-pre-wrap">
              {lead.remark || "No remarks"}
            </div>
            <input 
              type="text" 
              value={localRemark} 
              onChange={(e) => setLocalRemark(e.target.value)} 
              placeholder="Add new remark..." 
              className="w-full p-1.5 text-[10px] bg-white border border-gray-300 rounded outline-none" 
            />
          </div>
        </td>

        <td className="border-r border-gray-50 px-2">
          <input 
            type="datetime-local" 
            value={localDate} 
            onChange={(e) => setLocalDate(e.target.value)} 
            className="border rounded p-1 text-[10px] font-semibold w-full outline-none bg-white" 
          />
        </td>

        <td className="p-3 text-center">
          <div className="flex gap-2 justify-center">
            <button 
                disabled={!hasChange} 
                onClick={handleUpdate} 
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold disabled:opacity-20 active:scale-90 shadow-sm"
            >
              <Save size={13}/>
            </button>
            <button onClick={() => setShowAdmission(true)} className="bg-orange-500 text-white px-3 py-1.5 rounded-md font-bold active:scale-90 shadow-sm">
              View
            </button>
          </div>
        </td>
      </tr>

      {showAdmission && (
        <tr>
          <td colSpan="6" className="p-0 border-none">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col relative">
                <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-700 uppercase flex items-center gap-2">
                    <Smartphone size={18} className="text-blue-600" /> Student Profile
                  </h3>
                  <button onClick={() => setShowAdmission(false)} className="text-slate-400 hover:text-red-500">
                    <X size={20}/>
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

export default LeadsPage;