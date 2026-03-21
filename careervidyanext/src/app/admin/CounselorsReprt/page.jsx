"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { FaWhatsapp } from "react-icons/fa";
import { Search, Download, Filter, Calendar, User, TrendingUp } from "lucide-react";
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
        const activeOnly = res.data.data.filter(c => c.status === "active" || c.isActive === true);
        setCounselors(activeOnly);
      }
    } catch (err) { console.log(err); }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Base Counselor Filter
  const baseCounselorLeads = useMemo(() => {
    return leads.filter((l) => {
      if (!selectedCounselor) return true;
      return l.assignedTo === selectedCounselor || l.assignedTo?._id === selectedCounselor;
    });
  }, [leads, selectedCounselor]);

  // Assignment Stats (Date Wise Logic)
  const assignmentStats = useMemo(() => {
    const todayCount = baseCounselorLeads.filter(l => l.createdAt?.slice(0, 10) === todayStr).length;
    const yesterdayCount = baseCounselorLeads.filter(l => l.createdAt?.slice(0, 10) === yesterdayStr).length;
    
    // Last 7 Days Logic
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const last7DaysCount = baseCounselorLeads.filter(l => new Date(l.createdAt) >= last7Days).length;

    return { todayCount, yesterdayCount, last7DaysCount };
  }, [baseCounselorLeads, todayStr, yesterdayStr]);

  const filteredLeads = useMemo(() => {
    return baseCounselorLeads.filter((l) => {
      const leadDate = l.createdAt?.slice(0, 10);
      const search = searchTerm.toLowerCase();
      if (fromDate && leadDate < fromDate) return false;
      if (toDate && leadDate > toDate) return false;
      return !searchTerm || l.name?.toLowerCase().includes(search) || l.phone?.includes(search) || l.city?.toLowerCase().includes(search);
    });
  }, [baseCounselorLeads, fromDate, toDate, searchTerm]);

  const finalTableLeads = useMemo(() => {
    return filteredLeads.filter(l => !filterStatus || l.status === filterStatus);
  }, [filteredLeads, filterStatus]);

  const chartData = useMemo(() => {
    return STATUS_LIST.map(status => ({
      name: status,
      value: filteredLeads.filter(l => l.status === status).length,
      fill: STATUS_COLORS[status]
    })).filter(item => item.value > 0);
  }, [filteredLeads]);

  return (
    <div className="p-4 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* FILTER BAR */}
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
          <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-2 py-1.5 border rounded text-xs w-full outline-none focus:border-blue-400" />
        </div>
      </div>

      {/* NEW SECTION: DATE WISE ASSIGNMENT SUMMARY */}
      <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-600" />
          <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Assignment Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase">Yesterday Assigned</p>
              <p className="text-2xl font-black text-blue-700">{assignmentStats.yesterdayCount}</p>
            </div>
            <div className="text-[10px] bg-blue-100 px-2 py-1 rounded font-bold text-blue-600">PREV DAY</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase">Today Assigned</p>
              <p className="text-2xl font-black text-emerald-700">{assignmentStats.todayCount}</p>
            </div>
            <div className="text-[10px] bg-emerald-100 px-2 py-1 rounded font-bold text-emerald-600">REAL TIME</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Last 7 Days Total</p>
              <p className="text-2xl font-black text-slate-700">{assignmentStats.last7DaysCount}</p>
            </div>
            <div className="text-[10px] bg-slate-200 px-2 py-1 rounded font-bold text-slate-500">WEEKLY</div>
          </div>
        </div>
      </div>

      {/* DASHBOARD AREA: CHART + STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
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

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 h-fit">
          <Stat title="Total Result" value={filteredLeads.length} onClick={() => setFilterStatus("")} active={filterStatus === ""} color="#64748b" />
          {STATUS_LIST.map((status) => (
            <Stat key={status} title={status} value={filteredLeads.filter(l => l.status === status).length} onClick={() => setFilterStatus(status)} active={filterStatus === status} color={STATUS_COLORS[status]} />
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
                    {l.phone} <a href={`https://wa.me/${l.phone}`} target="_blank" className="text-emerald-500 hover:scale-110 transition-transform"><FaWhatsapp size={14}/></a>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${STATUS_COLORS[l.status]}15`, color: STATUS_COLORS[l.status] }}>{l.status}</span>
                  </td>
                  <td className="p-3 text-slate-500">{l.city}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-10 text-center text-slate-400">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Stat = ({ title, value, onClick, active, color }) => (
  <div onClick={onClick} className={`p-2.5 rounded border transition-all cursor-pointer ${active ? 'bg-white shadow-md ring-1 ring-slate-200' : 'bg-white shadow-sm border-slate-100'}`} style={active ? { borderLeft: `4px solid ${color}` } : { borderLeft: `3px solid ${color}` }}>
    <p className="text-[9px] font-bold text-slate-400 uppercase truncate mb-0.5">{title}</p>
    <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
  </div>
);

export default LeadsPage;