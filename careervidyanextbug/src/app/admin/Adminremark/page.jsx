"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/utlis/api.js";

import {
  Search,
  RefreshCw,
  Phone,
  MessageSquare,
  Users,
  FileText,
  CalendarDays,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ✅ UTC date ko IST mein convert karo
const toIST = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

// ✅ Aaj ki IST date
const todayIST = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(todayIST());

  // STATS
  const [todayRemarkCount, setTodayRemarkCount] = useState(0);
  const [todayCallCount, setTodayCallCount] = useState(0);
  const [todayFollowupCount, setTodayFollowupCount] = useState(0);
  const [todayAdmissionCount, setTodayAdmissionCount] = useState(0);
  const [notInterestedCount, setNotInterestedCount] = useState(0); // ✅ Not Picked → Not Interested
  const [detailsSharedCount, setDetailsSharedCount] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/v1/leads", {
        params: {
          limit: 3000,
          counselorId: selectedCounselor || undefined,
          searchTerm: searchTerm || undefined,
          date: selectedDate,
        },
      });

      if (res.data.success) {
        const allLeads = res.data.data || [];
        setLeads(allLeads);

        setTodayCallCount(allLeads.length);

        setTodayRemarkCount(
          allLeads.filter((l) => l.remark && l.remark.trim() !== "").length
        );

        setTodayFollowupCount(
          allLeads.filter((l) => l.status === "Follow-up").length
        );

        setTodayAdmissionCount(
          allLeads.filter((l) => l.status === "Admission Done").length
        );

        // ✅ "Not Picked" → "Not Interested"
        setNotInterestedCount(
          allLeads.filter((l) => l.status === "Not Interested").length
        );

        setDetailsSharedCount(
          allLeads.filter((l) => l.status === "Details Shared").length
        );
      }
    } catch (err) {
      console.error("Leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCounselor, searchTerm, selectedDate]);

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        const activeOnly = res.data.data.filter(
          (c) => c.status === "active" || c.isActive === true
        );
        setCounselors(activeOnly);
      }
    } catch (err) {
      console.error("Counselors fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const filteredLeads = leads.filter((l) => {
    if (!searchTerm) return true;
    return (
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm)
    );
  });

  const selectedCounselorName = selectedCounselor
    ? counselors.find((c) => c._id === selectedCounselor)?.name || "Counselor"
    : "All Counselors";

  return (
    <div className="min-h-screen bg-slate-100 p-4">

      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-800">Leads Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Showing data for{" "}
          <span className="font-semibold text-blue-600">{selectedCounselorName}</span>{" "}
          on{" "}
          <span className="font-semibold text-blue-600">{selectedDate}</span>
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-center">

        <select
          value={selectedCounselor}
          onChange={(e) => setSelectedCounselor(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none bg-white"
        >
          <option value="">All Counselors</option>
          {counselors.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
          <CalendarDays size={16} className="text-slate-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-sm"
          />
        </div>

        <button
          onClick={() => setSelectedDate(todayIST())}
          className="border border-blue-300 text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
        >
          Today
        </button>

        <button
          onClick={fetchLeads}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Total Calls</p>
            <Phone size={18} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{todayCallCount}</h2>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Follow-up</p>
            <MessageSquare size={18} className="text-orange-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{todayFollowupCount}</h2>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Remark Updated</p>
            <FileText size={18} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{todayRemarkCount}</h2>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Admission</p>
            <Users size={18} className="text-pink-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{todayAdmissionCount}</h2>
        </div>

        {/* ✅ Not Picked → Not Interested */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Not Interested</p>
            <XCircle size={18} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{notInterestedCount}</h2>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">Details Shared</p>
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{detailsSharedCount}</h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-bold text-slate-700">{selectedCounselorName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedDate}</p>
          </div>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
            {filteredLeads.length} leads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-slate-500">
                <th className="p-4">#</th>
                <th className="p-4">Student</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Counselor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remark</th>
                <th className="p-4">Updated (IST)</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-10 text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((l, index) => (
                  <tr key={l._id} className="border-b hover:bg-slate-50 transition">

                    <td className="p-4 text-slate-400 text-xs">{index + 1}</td>
                    <td className="p-4 font-semibold text-slate-700">{l.name}</td>
                    <td className="p-4 text-slate-600">{l.phone}</td>
                    <td className="p-4 text-slate-600">
                      {l.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          l.status === "Admission Done"
                            ? "bg-green-100 text-green-700"
                            : l.status === "Follow-up"
                            ? "bg-orange-100 text-orange-700"
                            : l.status === "Not Interested"  // ✅ Not Picked → Not Interested
                            ? "bg-red-100 text-red-700"
                            : l.status === "Details Shared"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td className="p-4 max-w-[300px] text-slate-600">
                      {l.remark || (
                        <span className="text-slate-300 italic">No remark</span>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 text-xs">
                      {l.updatedAt
                        ? new Date(l.updatedAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-10">
                    <div className="text-slate-400 text-sm">
                      {selectedDate === todayIST()
                        ? "Aaj abhi tak koi lead update nahi hui"
                        : `${selectedDate} ko koi lead update nahi mili`}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;