

"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { 
  Save, Target, Award, BarChart3, TrendingUp, Users, CheckCircle, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

/* ================= HELPERS ================= */
const formatForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset);
  return local.toISOString().slice(0, 16);
};

const STATUS_LIST = [
  "New", "Not Interested", "Details Shared", "Follow-up", "Hot Lead",
  "University Issue", "Fee Issue", "Distance Issue", "Language Issue",
  "Not Picked", "Admission Done",
];

/* ================= MAIN PAGE ================= */
const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // YYYY-MM format

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCurrentUser(user);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/v1/leads");
      if (res.data.success) setLeads(res.data.data);
    } catch (err) { console.error("API Error", err); }
  };

  const updateLead = async (id, data) => {
    try {
      const res = await api.put(`/api/v1/leads/${id}`, data);
      if (res.data.success) fetchData();
    } catch (err) { alert("Update failed"); }
  };

  const myLeads = useMemo(() => {
    let filtered = leads.filter(l => 
      l.assignedTo === currentUser?._id || l.assignedTo?._id === currentUser?._id
    );
    
    // Filter by month if selected
    if (selectedMonth) {
      filtered = filtered.filter(l => {
        const leadMonth = new Date(l.createdAt).toISOString().slice(0, 7); // YYYY-MM
        return leadMonth === selectedMonth;
      });
    }
    
    return filtered;
  }, [leads, currentUser, selectedMonth]);

  const stats = useMemo(() => {
    const counts = {};
    STATUS_LIST.forEach(s => {
      counts[s] = myLeads.filter(l => (l.status || "New") === s).length;
    });
    return counts;
  }, [myLeads]);

  const chartData = useMemo(() => {
    return STATUS_LIST.map(s => ({ name: s, value: stats[s] }))
      .filter(d => d.value > 0);
  }, [stats]);

  // KPI Calculations
  const totalLeads = myLeads.length;
  const admissions = myLeads.filter(l => l.status === "Admission Done").length;
  const hotLeads = myLeads.filter(l => l.status === "Hot Lead").length;
  const conversionRate = totalLeads ? ((admissions / totalLeads) * 100).toFixed(1) : 0;
  const closureRate = totalLeads ? ((hotLeads / totalLeads) * 100).toFixed(1) : 0;

  const displayLeads = useMemo(() => {
    let filtered = myLeads;
    
    // Filter based on selected card
    if (selectedCard === "total") {
      // Show all leads
    } else if (selectedCard === "admissions") {
      filtered = filtered.filter(l => l.status === "Admission Done");
    } else if (selectedCard === "conversion") {
      // Show all leads for conversion context
    } else if (selectedCard === "hotleads") {
      filtered = filtered.filter(l => l.status === "Hot Lead");
    } else if (selectedCard === null) {
      // Don't show any leads if no card is selected
      filtered = [];
    }
    
    if (activeStatus) filtered = filtered.filter(l => (l.status || "New") === activeStatus);
    if (searchTerm) filtered = filtered.filter(l => 
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.phone?.includes(searchTerm)
    );  
    return filtered;
  }, [myLeads, activeStatus, searchTerm, selectedCard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-blue-600" />
              Performance Dashboard
            </h1>
            <p className="text-gray-600">Track your lead pipeline and performance metrics</p>
          </div>
          <input 
            type="month"
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            title="Filter by month"
          />
        </div>
        {selectedMonth && (
          <p className="text-sm text-blue-600 mt-2">
            📅 Showing data for {new Date(selectedMonth + "-01").toLocaleString("en-US", { month: "long", year: "numeric" })}
          </p>
        )}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {/* Total Leads */}
        <button
          onClick={() => setSelectedCard(selectedCard === "total" ? null : "total")}
          className={`text-left rounded-lg shadow-sm p-3 border-l-2 transition-all ${
            selectedCard === "total"
              ? "bg-blue-50 border-blue-600 shadow-md"
              : "bg-white border-blue-600 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-gray-600 text-xs font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalLeads}</p>
            </div>
            <div className="bg-blue-100 p-1.5 rounded">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          {selectedMonth && <p className="text-[10px] text-blue-500 mt-1">📅 {selectedMonth}</p>}
        </button>

        {/* Conversions */}
        <button
          onClick={() => setSelectedCard(selectedCard === "admissions" ? null : "admissions")}
          className={`text-left rounded-lg shadow-sm p-3 border-l-2 transition-all ${
            selectedCard === "admissions"
              ? "bg-green-50 border-green-600 shadow-md"
              : "bg-white border-green-600 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-gray-600 text-xs font-medium">Admitted</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{admissions}</p>
            </div>
            <div className="bg-green-100 p-1.5 rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          {selectedMonth && <p className="text-[10px] text-green-500 mt-1">✓ {selectedMonth}</p>}
        </button>

        {/* Conversion Rate */}
        <button
          onClick={() => setSelectedCard(selectedCard === "conversion" ? null : "conversion")}
          className={`text-left rounded-lg shadow-sm p-3 border-l-2 transition-all ${
            selectedCard === "conversion"
              ? "bg-purple-50 border-purple-600 shadow-md"
              : "bg-white border-purple-600 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-gray-600 text-xs font-medium">Conv. Rate</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{conversionRate}%</p>
            </div>
            <div className="bg-purple-100 p-1.5 rounded">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          {selectedMonth && <p className="text-[10px] text-purple-500 mt-1">📊 {selectedMonth}</p>}
        </button>

        {/* Hot Leads */}
        <button
          onClick={() => setSelectedCard(selectedCard === "hotleads" ? null : "hotleads")}
          className={`text-left rounded-lg shadow-sm p-3 border-l-2 transition-all ${
            selectedCard === "hotleads"
              ? "bg-orange-50 border-orange-600 shadow-md"
              : "bg-white border-orange-600 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-gray-600 text-xs font-medium">Hot</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{hotLeads}</p>
            </div>
            <div className="bg-orange-100 p-1.5 rounded">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          {selectedMonth && <p className="text-[10px] text-orange-500 mt-1">🔥 {selectedMonth}</p>}
        </button>
      </div>

      {/* MAIN CONTENT */}
      {selectedCard ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* LEFT: Leads Management Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800">
                    {selectedCard === "total" && "All Leads"}
                    {selectedCard === "admissions" && "Admitted Leads"}
                    {selectedCard === "conversion" && "All Leads"}
                    {selectedCard === "hotleads" && "Hot Leads"}
                    {selectedMonth && ` (${new Date(selectedMonth + "-01").toLocaleString("en-US", { month: "short", year: "numeric" })})`}
                  </h3>
                  <input 
                    placeholder="Search..." 
                    className="text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg w-40 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="text-gray-700 font-semibold">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Next Action</th>
                      <th className="p-4 text-center">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayLeads.slice(0, 8).map(l => (
                      <LeadRow key={l._id} lead={l} statuses={STATUS_LIST} onSave={updateLead} />
                    ))}
                    {displayLeads.length === 0 && (
                      <tr><td colSpan="4" className="p-6 text-center text-gray-500">No leads found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: Status Distribution */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Status Distribution</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {STATUS_LIST.map((s) => {
                const count = stats[s] || 0;
                const percentage = totalLeads ? ((count / totalLeads) * 100).toFixed(0) : 0;
                return (
                  <div key={s} 
                    onClick={() => setActiveStatus(activeStatus === s ? null : s)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activeStatus === s 
                      ? "bg-blue-100 border-l-4 border-blue-600" 
                      : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">{s}</p>
                      <p className="text-xs font-bold text-blue-600">{percentage}%</p>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{count} leads</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Card to View Details</h3>
          <p className="text-gray-600">
            {selectedMonth 
              ? `Click on any KPI card to view leads for ${new Date(selectedMonth + "-01").toLocaleString("en-US", { month: "long", year: "numeric" })}`
              : "Click on any KPI card to view the associated leads and details"
            }
          </p>
        </div>
      )}

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Performance Metrics
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Summary */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Conversion Summary
          </h3>
          <div className="space-y-6">
            {/* Conversion Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${Math.min(conversionRate, 100)}%` }}
                />
              </div>
            </div>

            {/* Hot Lead Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Hot Lead Rate</p>
                <p className="text-2xl font-bold text-orange-600">{closureRate}%</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div 
                  className="bg-orange-600 h-3 rounded-full"
                  style={{ width: `${Math.min(closureRate, 100)}%` }}
                />
              </div>
            </div>

            {/* Active Leads Ratio */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Active Leads Ratio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalLeads > 0 ? ((myLeads.filter(l => !["Admission Done"].includes(l.status)).length / totalLeads) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${totalLeads > 0 ? ((myLeads.filter(l => !["Admission Done"].includes(l.status)).length / totalLeads) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadRow = ({ lead, onSave, statuses }) => {
  const [status, setStatus] = useState(lead.status || "New");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState(formatForInput(lead.followUpDate));

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <div className="font-semibold text-gray-800">{lead.name}</div>
        <div className="text-xs text-gray-500 mt-1">{lead.phone}</div>
      </td>
      <td className="p-4">
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="bg-white border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs w-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="p-4">
        <div className="space-y-2">
          <input 
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs w-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <input 
            value={remark} 
            onChange={(e) => setRemark(e.target.value)} 
            placeholder="Add remark..." 
            className="bg-white border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs w-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder-gray-400" 
          />
        </div>
      </td>
      <td className="p-4 text-center">
        <button 
          onClick={() => onSave(lead._id, { status, remark, followUpDate: date })} 
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 shadow hover:shadow-md transition-all active:scale-95"
          title="Save changes"
        >
          <Save size={14} />
        </button>
      </td>
    </tr>
  );
};

export default LeadsPage;