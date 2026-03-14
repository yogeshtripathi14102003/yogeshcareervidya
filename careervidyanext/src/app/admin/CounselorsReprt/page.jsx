"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { FaWhatsapp } from "react-icons/fa";
import { Search, Download, Filter, Calendar, User } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS = {
  "New": "#3b82f6",
  "Not Interested": "#ef4444",
  "Details Shared": "#8b5cf6",
  "Follow-up": "#f59e0b",
  "Hot Lead": "#f43f5e",
  "University Issue": "#64748b",
  "Fee Issue": "#06b6d4",
  "Distance Issue": "#10b981",
  "Language Issue": "#ec4899",
  "Not Picked": "#78350f",
  "Admission Done": "#22c55e",
};

const STATUS_LIST = Object.keys(STATUS_COLORS);

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchLeads();
    fetchCounselors();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) setLeads(res.data.data);
    } catch (err) { console.log(err); }
  };

const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        // Sirf wahi counselors dikhenge jo active hain
        const activeOnly = res.data.data.filter(
          (c) => c.status === "active" || c.isActive === true
        );
        setCounselors(activeOnly);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  /* ================= COUNSELOR FILTER LOGIC ================= */
  
  // Step 1: Pehle Counselor wise leads ko alag karein (Ye base filter hai)
  const baseCounselorLeads = useMemo(() => {
    return leads.filter((l) => {
      if (!selectedCounselor) return true;
      // assignedTo object ho ya string ID, dono handle karega
      return l.assignedTo === selectedCounselor || l.assignedTo?._id === selectedCounselor;
    });
  }, [leads, selectedCounselor]);

  // Step 2: Counselor ke basis par AJ KA DATA (Today's Stats now sync with counselor)
  const todayLeads = useMemo(() => {
    return baseCounselorLeads.filter(l => l.createdAt?.slice(0, 10) === todayStr);
  }, [baseCounselorLeads, todayStr]);

  // Step 3: Global filters (Search + Date Range) on Counselor Data
  const filteredLeads = useMemo(() => {
    return baseCounselorLeads.filter((l) => {
      const leadDate = l.createdAt?.slice(0, 10);
      const search = searchTerm.toLowerCase();

      if (fromDate && leadDate < fromDate) return false;
      if (toDate && leadDate > toDate) return false;

      return !searchTerm || 
        l.name?.toLowerCase().includes(search) || 
        l.phone?.includes(search) || 
        l.city?.toLowerCase().includes(search);
    });
  }, [baseCounselorLeads, fromDate, toDate, searchTerm]);

  // Step 4: Final table list with Status filter
  const finalTableLeads = useMemo(() => {
    return filteredLeads.filter(l => !filterStatus || l.status === filterStatus);
  }, [filteredLeads, filterStatus]);

  // Step 5: Chart data base on counselor + filters
  const chartData = useMemo(() => {
    return STATUS_LIST.map(status => ({
      name: status,
      value: filteredLeads.filter(l => l.status === status).length,
      fill: STATUS_COLORS[status]
    })).filter(item => item.value > 0);
  }, [filteredLeads]);

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* COUNSELOR SELECTION & EXPORT */}
      <div className="bg-white border border-slate-200 p-3 rounded-lg mb-4 flex flex-wrap gap-3 items-center shadow-sm">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
          <User size={16} className="text-blue-600" />
          <select 
            value={selectedCounselor} 
            onChange={(e) => setSelectedCounselor(e.target.value)} 
            className="bg-transparent text-xs font-bold outline-none text-blue-800"
          >
            <option value="">ALL COUNSELORS</option>
            {counselors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1 border rounded px-2 bg-slate-50">
          <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-1.5 bg-transparent text-xs outline-none" />
        </div>

        <div className="flex items-center gap-1 border rounded px-2 bg-slate-50">
          <span className="text-[10px] text-slate-400 font-bold uppercase">To</span>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-1.5 bg-transparent text-xs outline-none" />
        </div>

        <div className="flex-1 min-w-[150px] relative">
          <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-8 pr-2 py-1.5 border rounded text-xs w-full outline-none focus:border-blue-400" 
          />
        </div>
      </div>

      {/* SECTION 1: TODAY'S SUMMARY (Syncs with Counselor) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-slate-500" />
          <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            {selectedCounselor ? "Counselor's Today Activity" : "Team's Today Activity"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <TodayStat title="Today's Leads" value={todayLeads.length} color="#3b82f6" />
          <TodayStat title="Follow-ups" value={todayLeads.filter(l => l.status === "Follow-up").length} color="#f59e0b" />
          <TodayStat title="Hot Leads" value={todayLeads.filter(l => l.status === "Hot Lead").length} color="#f43f5e" />
          <TodayStat title="Not Interested" value={todayLeads.filter(l => l.status === "Not Interested").length} color="#ef4444" />
          <TodayStat title="Admission Done" value={todayLeads.filter(l => l.status === "Admission Done").length} color="#22c55e" />
          <TodayStat title="Not Picked" value={todayLeads.filter(l => l.status === "Not Picked").length} color="#78350f" />
        </div>
      </div>

      {/* DASHBOARD AREA: CHART + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* CHART (Syncs with Counselor + Dates) */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm h-[280px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Status Distribution</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* COMPACT STAT CARDS (Sync with Counselor + Dates) */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 h-fit">
          <Stat title="Overall Result" value={filteredLeads.length} onClick={() => setFilterStatus("")} active={filterStatus === ""} color="#64748b" />
          {STATUS_LIST.map((status) => (
            <Stat
              key={status}
              title={status}
              value={filteredLeads.filter(l => l.status === status).length}
              onClick={() => setFilterStatus(status)}
              active={filterStatus === status}
              color={STATUS_COLORS[status]}
            />
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase text-[10px]">
              <th className="p-3">Date</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">City</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {finalTableLeads.length > 0 ? (
              finalTableLeads.map((l) => (
                <tr key={l._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-3 text-slate-500">{l.createdAt?.slice(0, 10)}</td>
                  <td className="p-3 font-semibold text-slate-700">{l.name}</td>
                  <td className="p-3 flex items-center gap-2">
                    {l.phone}
                    <a href={`https://wa.me/${l.phone}`} target="_blank" className="text-emerald-500 hover:scale-110 transition-transform"><FaWhatsapp size={14}/></a>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${STATUS_COLORS[l.status]}15`, color: STATUS_COLORS[l.status] }}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{l.city}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-10 text-center text-slate-400">No leads found for this counselor/filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= COMPACT UI COMPONENTS ================= */

const TodayStat = ({ title, value, color }) => (
  <div className="bg-white border border-slate-100 p-2 rounded shadow-sm flex flex-col items-center justify-center min-w-[90px] border-b-2" style={{ borderBottomColor: color }}>
    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{title}</p>
    <p className="text-xl font-bold text-slate-800 tracking-tight">{value}</p>
  </div>
);

const Stat = ({ title, value, onClick, active, color }) => (
  <div
    onClick={onClick}
    className={`p-2.5 rounded border transition-all cursor-pointer ${active ? 'bg-white shadow-md ring-1 ring-slate-200' : 'bg-white shadow-sm border-slate-100'}`}
    style={active ? { borderLeft: `4px solid ${color}` } : { borderLeft: `3px solid ${color}` }}
  >
    <p className="text-[9px] font-bold text-slate-400 uppercase truncate mb-0.5">{title}</p>
    <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
  </div>
);

export default LeadsPage;