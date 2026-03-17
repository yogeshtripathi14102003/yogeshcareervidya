"use client";
import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  Users,
  Loader2,
  Trash2,
  Filter,
  RefreshCw,
  Search
} from "lucide-react";

const LeadScheduler = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters State
  const [selectedCounselorId, setSelectedCounselorId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const statuses = [
    "New", "Not Interested", "Details Shared", "Follow-up", "Hot Lead",
    "University Issue", "Fee Issue", "Distance Issue", "Language Issue",
    "Not Picked", "Admission Done"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resLeads, resCounselors] = await Promise.all([
        api.get("/api/v1/leads"),
        api.get("/api/v1/counselor")
      ]);
      if (resLeads.data.success) setAssignedLeads(resLeads.data.data.filter(l => l.assignedTo));
      if (resCounselors.data.success) setCounselors(resCounselors.data.data);
    } catch (err) {
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const deleteByStatus = async (statusName, counselorId) => {
    if (!confirm(`Delete all "${statusName}" leads for this counselor?`)) return;
    setLoading(true);
    try {
      await api.delete(`/api/v1/leads/bulk-delete`, { params: { status: statusName, counselorId } });
      fetchData();
    } catch (err) { alert("Delete failed"); }
    finally { setLoading(false); }
  };

  /* ================= REAL-TIME FILTER LOGIC ================= */
  const getFilteredData = () => {
    let filtered = [...assignedLeads];

    // 1. Counselor Filter
    if (selectedCounselorId !== "all") {
      filtered = filtered.filter(l => (l.assignedTo?._id || l.assignedTo) === selectedCounselorId);
    }

    // 2. Status Filter (Dropdown se)
    if (selectedStatus !== "all") {
      filtered = filtered.filter(l => l.status === selectedStatus);
    }

    // Grouping for UI
    return filtered.reduce((acc, lead) => {
      const cid = lead.assignedTo?._id || lead.assignedTo;
      if (!acc[cid]) {
        acc[cid] = { name: lead.assignedTo?.name || "Counselor", statusCounts: {}, total: 0 };
      }
      const s = lead.status || "New";
      acc[cid].statusCounts[s] = (acc[cid].statusCounts[s] || 0) + 1;
      acc[cid].total += 1;
      return acc;
    }, {});
  };

  const displayData = getFilteredData();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold">
            <Filter size={20} />
            <h2>Advance Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Counselor Dropdown */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Select Counselor</label>
              <select 
                className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400"
                value={selectedCounselorId}
                onChange={(e) => setSelectedCounselorId(e.target.value)}
              >
                <option value="all">All Counselors</option>
                {counselors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Status Dropdown (JO AAPNE MAANGA) */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Select Status</label>
              <select 
                className="w-full border p-2.5 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses (Sab Dikhao)</option>
                {statuses.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => {setSelectedCounselorId("all"); setSelectedStatus("all");}}
                className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw size={14}/> Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Display Cards */}
        <div className="space-y-6">
          {Object.entries(displayData).map(([cid, data]) => (
            <div key={cid} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="bg-gray-800 p-4 flex justify-between items-center">
                <h3 className="text-white font-bold">{data.name}</h3>
                <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">Leads: {data.total}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {statuses.map(status => {
                  const count = data.statusCounts[status] || 0;
                  // Agar status filter on hai, to sirf wahi status card dikhao ya highlight karo
                  if (selectedStatus !== "all" && status !== selectedStatus) return null;

                  return (
                    <div key={status} className={`p-3 rounded-lg border flex flex-col justify-between ${count > 0 ? 'bg-white border-indigo-100' : 'bg-gray-50 border-transparent opacity-50'}`}>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">{status}</p>
                        <p className="text-xl font-bold text-gray-800">{count}</p>
                      </div>
                      {count > 0 && (
                        <button 
                          onClick={() => deleteByStatus(status, cid)}
                          className="mt-2 text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors self-end"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      )}
    </div>
  );
};

export default LeadScheduler;