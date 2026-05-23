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
  PhoneMissed,
} from "lucide-react";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // DATE
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // STATS
  const [todayRemarkCount, setTodayRemarkCount] = useState(0);
  const [todayCallCount, setTodayCallCount] = useState(0);
  const [todayFollowupCount, setTodayFollowupCount] = useState(0);
  const [todayAdmissionCount, setTodayAdmissionCount] = useState(0);
  const [notPickedCount, setNotPickedCount] = useState(0);
  const [detailsSharedCount, setDetailsSharedCount] = useState(0);

  // FETCH LEADS
  const fetchLeads = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/v1/leads", {
        params: {
          limit: 5000,
          counselorId: selectedCounselor,
          searchTerm,
        },
      });

      if (res.data.success) {
        const allLeads = res.data.data || [];

        setLeads(allLeads);

        const selected = selectedDate;

        // REMARK UPDATED
        const remarksUpdated = allLeads.filter(
          (l) =>
            l.remark &&
            l.updatedAt &&
            l.updatedAt.slice(0, 10) === selected
        ).length;

        // TOTAL CALLS
        const calls = allLeads.filter(
          (l) =>
            l.updatedAt &&
            l.updatedAt.slice(0, 10) === selected
        ).length;

        // FOLLOWUP
        const followups = allLeads.filter(
          (l) =>
            l.status === "Follow-up" &&
            l.updatedAt &&
            l.updatedAt.slice(0, 10) === selected
        ).length;

        // ADMISSION
        const admissions = allLeads.filter(
          (l) =>
            l.status === "Admission Done" &&
            l.updatedAt &&
            l.updatedAt.slice(0, 10) === selected
        ).length;

        // NOT PICKED
        const notPicked = allLeads.filter(
          (l) =>
            l.status === "Not Picked" &&
            l.updatedAt &&
            l.updatedAt.slice(0, 10) === selected
        ).length;

        // DETAILS SHARED
        const detailsShared = allLeads.filter(
          (l) =>
            l.status === "Details Shared" &&
            l.updatedAt &&
            l.updatedAt.slice(0, 10) === selected
        ).length;

        // SET STATE
        setTodayRemarkCount(remarksUpdated);
        setTodayCallCount(calls);
        setTodayFollowupCount(followups);
        setTodayAdmissionCount(admissions);
        setNotPickedCount(notPicked);
        setDetailsSharedCount(detailsShared);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCounselor, searchTerm, selectedDate]);

  // FETCH COUNSELORS
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
      console.log(err);
    }
  };

  // USE EFFECT
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      
      {/* FILTER BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-center">

        {/* COUNSELOR */}
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

        {/* SEARCH */}
        <div className="relative flex-1 min-w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm outline-none"
          />
        </div>

        {/* DATE */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
          <CalendarDays size={16} className="text-slate-500" />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-sm"
          />
        </div>

        {/* REFRESH */}
        <button
          onClick={fetchLeads}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">

        {/* TOTAL CALL */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Total Calls
            </p>

            <Phone size={18} className="text-blue-600" />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {todayCallCount}
          </h2>
        </div>

        {/* FOLLOWUP */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Follow-up
            </p>

            <MessageSquare size={18} className="text-orange-500" />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {todayFollowupCount}
          </h2>
        </div>

        {/* REMARK UPDATED */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Updated Remark
            </p>

            <FileText size={18} className="text-emerald-600" />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {todayRemarkCount}
          </h2>
        </div>

        {/* ADMISSION */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Admission
            </p>

            <Users size={18} className="text-pink-600" />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {todayAdmissionCount}
          </h2>
        </div>

        {/* NOT PICKED */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Not Picked
            </p>

            <PhoneMissed size={18} className="text-red-500" />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {notPickedCount}
          </h2>
        </div>

        {/* DETAILS SHARED */}
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase">
              Details Shared
            </p>

            <CheckCircle size={18} className="text-green-600" />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {detailsSharedCount}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-slate-500">
                <th className="p-4">Student</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Counselor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remark</th>
                <th className="p-4">Updated</th>
              </tr>
            </thead>

            <tbody>
              {leads.length > 0 ? (
                leads.map((l) => (
                  <tr
                    key={l._id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-4 font-semibold text-slate-700">
                      {l.name}
                    </td>

                    <td className="p-4 text-slate-600">
                      {l.phone}
                    </td>

                    <td className="p-4">
                      {l.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold">
                        {l.status}
                      </span>
                    </td>

                    <td className="p-4 max-w-[300px] text-slate-600">
                      {l.remark || "N/A"}
                    </td>

                    <td className="p-4 text-slate-500">
                      {l.updatedAt?.slice(0, 10)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-10 text-slate-400"
                  >
                    No Data Found
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