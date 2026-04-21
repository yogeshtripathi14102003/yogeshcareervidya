

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/utlis/api.js";
import { FaWhatsapp } from "react-icons/fa";
import { Search, Download, User, TrendingUp, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import * as XLSX from "xlsx";

const STATUS_COLORS = {
  "New": "#3b82f6", "Not Interested": "#ef4444", "Details Shared": "#8b5cf6",
  "Follow-up": "#f59e0b", "Hot Lead": "#f43f5e", "University Issue": "#64748b",
  "Fee Issue": "#06b6d4", "Distance Issue": "#10b981", "Language Issue": "#ec4899",
  "Not Picked": "#78350f", "Admission Done": "#22c55e",
};

const STATUS_LIST = Object.keys(STATUS_COLORS);
const ITEMS_PER_PAGE = 40;

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState([]); 
  const [totalLeads, setTotalLeads] = useState(0);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // FETCH DATA FROM BACKEND
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/leads", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerm,
          status: filterStatus,
          counselorId: selectedCounselor,
          fromDate,
          toDate
        }
      });
      if (res.data.success) {
        setLeads(res.data.data);
        setTotalLeads(res.data.total);
        setStats(res.data.stats || []); 
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, selectedCounselor, fromDate, toDate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        const activeOnly = res.data.data.filter(c => c.status === "active" || c.isActive === true);
        setCounselors(activeOnly);
      }
    } catch (err) { console.log(err); }
  };

  // EXCEL DOWNLOAD
  const downloadExcel = async () => {
    try {
      const res = await api.get("/api/v1/leads", {
        params: { limit: 2000, status: filterStatus, counselorId: selectedCounselor, searchTerm }
      });
      const dataToExport = res.data.data.map(l => ({
        "Date": l.createdAt?.slice(0, 10),
        "Name": l.name,
        "Phone": l.phone,
        "email": l.email || "N/A",
        "Status": l.status,
        "Course": l.course || "N/A",  // Course field added
      "Remark": l.remark || "N/A",
        "Counselor": l.assignedTo?.name || "Unassigned",
        "City": l.city || ""
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `Leads_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) { alert("Export failed"); }
  };

  const totalPages = Math.ceil(totalLeads / ITEMS_PER_PAGE);

  // Chart Data preparation
  const chartData = useMemo(() => {
    return stats
      .map(s => ({
        name: s._id,
        value: s.count,
        fill: STATUS_COLORS[s._id] || "#cbd5e1"
      }))
      .filter(i => i.value > 0);
  }, [stats]);

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 p-3 rounded-lg mb-4 flex flex-wrap gap-3 items-center shadow-sm">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
          <User size={16} className="text-blue-600" />
          <select 
            value={selectedCounselor} 
            onChange={(e) => { setSelectedCounselor(e.target.value); setCurrentPage(1); }} 
            className="bg-transparent text-xs font-bold outline-none text-blue-800"
          >
            <option value="">ALL COUNSELORS</option>
            {counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1 border rounded px-2 bg-slate-50">
          <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
          <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} className="p-1.5 bg-transparent text-xs outline-none" />
        </div>

        <div className="flex items-center gap-1 border rounded px-2 bg-slate-50">
          <span className="text-[10px] text-slate-400 font-bold uppercase">To</span>
          <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }} className="p-1.5 bg-transparent text-xs outline-none" />
        </div>

        <div className="flex-1 min-w-[150px] relative">
          <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name, phone, city..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            className="pl-8 pr-2 py-1.5 border rounded text-xs w-full outline-none focus:border-blue-400" 
          />
        </div>
        
        <button onClick={downloadExcel} className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-900 transition-colors">
          <Download size={14} /> EXCEL
        </button>
        <button onClick={fetchLeads} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* DASHBOARD AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* PIE CHART */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm h-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-500" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* STAT CARDS */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 h-fit">
          <Stat 
            title="Total Results" 
            value={totalLeads} 
            onClick={() => { setFilterStatus(""); setCurrentPage(1); }} 
            active={filterStatus === ""} 
            color="#64748b" 
          />
          {STATUS_LIST.map((statusName) => {
            const statusObj = stats.find(s => s._id === statusName);
            const count = statusObj ? statusObj.count : 0;
            return (
              <Stat 
                key={statusName} 
                title={statusName} 
                value={count} 
                onClick={() => { setFilterStatus(statusName); setCurrentPage(1); }} 
                active={filterStatus === statusName} 
                color={STATUS_COLORS[statusName]} 
              />
            )
          })}
        </div>
      </div>

      {/* TABLE */}
      <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Counselor</th>
                <th className="p-4">Status</th>
                <th className="p-4">City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length > 0 ? (
                leads.map((l) => (
                  <tr key={l._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="p-4 text-slate-500">{l.createdAt?.slice(0, 10)}</td>
                    <td className="p-4 font-semibold text-slate-700">{l.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {l.phone}
                        <a 
                          href={`https://wa.me/${l.phone?.replace(/\D/g,'')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        >
                          <FaWhatsapp size={16}/>
                        </a>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${l.assignedTo?.name ? 'text-blue-600' : 'text-slate-400 italic'}`}>
                        {l.assignedTo?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span 
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold" 
                        style={{ backgroundColor: `${STATUS_COLORS[l.status]}15`, color: STATUS_COLORS[l.status] }}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{l.city || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={32} strokeWidth={1} />
                      <p className="text-sm">No leads found for the selected criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-[11px] text-slate-500 font-medium">
            Total Records: <span className="text-slate-900 font-bold">{totalLeads}</span>
          </div>
          
          <div className="flex gap-3 items-center">
            <button 
              disabled={currentPage === 1 || loading} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="p-1.5 border rounded-lg bg-white disabled:opacity-30 hover:bg-slate-50 shadow-sm transition-all"
            >
              <ChevronLeft size={18} className="text-slate-600"/>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                Page {currentPage}
              </span>
              <span className="text-xs text-slate-400">of</span>
              <span className="text-xs font-bold text-slate-600 bg-white border px-3 py-1 rounded-md">
                {totalPages || 1}
              </span>
            </div>

            <button 
              disabled={currentPage >= totalPages || loading} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="p-1.5 border rounded-lg bg-white disabled:opacity-30 hover:bg-slate-50 shadow-sm transition-all"
            >
              <ChevronRight size={18} className="text-slate-600"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, onClick, active, color }) => (
  <div 
    onClick={onClick} 
    className={`p-3 rounded-xl border transition-all cursor-pointer bg-white group ${
      active ? 'shadow-md ring-2 ring-blue-100 border-transparent' : 'shadow-sm border-slate-100 hover:border-slate-300'
    }`} 
    style={{ borderLeft: `4px solid ${color}` }}
  >
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 group-hover:text-slate-600 transition-colors">{title}</p>
    <p className="text-xl font-black text-slate-800 leading-tight">{value.toLocaleString()}</p>
  </div>
);

export default LeadsPage;