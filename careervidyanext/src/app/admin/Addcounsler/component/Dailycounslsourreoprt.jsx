"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Users, Download, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

const STATUS_LIST = [
  "New", "Not Interested", "Details Shared", "Follow-up", "Hot Lead",
  "University Issue", "Fee Issue", "Distance Issue", "Language Issue",
  "Not Picked", "Admission Done"
];

const Dailycounslsourreoprt = () => {
  const [dailyData, setDailyData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ALL ================= */
  const fetchAllLeads = async (params = {}) => {
    let allLeads = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await api.get("/api/v1/leads", {
        params: { page, limit: 500, ...params }
      });

      const data = res.data.data || [];
      allLeads = [...allLeads, ...data];

      if (data.length < 500) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allLeads;
  };

  /* ================= GROUP ================= */
  const groupLeads = (leads) => {
    const assigned = leads.filter(l => l.assignedTo);
    const grouped = {};

    assigned.forEach((l) => {
      const id = l.assignedTo._id;

      if (!grouped[id]) {
        const emptyStatuses = {};
        STATUS_LIST.forEach(s => emptyStatuses[s] = 0);

        grouped[id] = {
          counselorId: id,
          name: l.assignedTo.name,
          totalLeads: 0,
          statuses: { ...emptyStatuses }
        };
      }

      grouped[id].totalLeads += 1;

      if (grouped[id].statuses[l.status] !== undefined) {
        grouped[id].statuses[l.status] += 1;
      }
    });

    return Object.values(grouped);
  };

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const dailyLeads = await fetchAllLeads({ fromDate: date, toDate: date });
      setDailyData(groupLeads(dailyLeads));

      const allLeads = await fetchAllLeads();
      setAllData(groupLeads(allLeads));

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  /* ================= DELETE LOGIC (WITHOUT SPECIFIC ENDPOINT) ================= */
  const deleteTodayLeads = async (counselorId, counselorName) => {
    const confirmAction = window.confirm(
      `Are you sure? This will delete all ${dailyData.find(c => c.counselorId === counselorId)?.totalLeads} leads assigned to ${counselorName} on ${date}.`
    );
    
    if (!confirmAction) return;

    setLoading(true);
    try {
      // 1. Pehle filter karke wahi leads nikalo jo delete karni hain
      const leadsToDelete = await fetchAllLeads({ 
        fromDate: date, 
        toDate: date, 
        assignedTo: counselorId 
      });

      if (leadsToDelete.length === 0) {
        alert("No leads found to delete for today.");
        return;
      }

      // 2. Ek-ek karke delete karo (Agar backend bulk delete support nahi karta)
      const deletePromises = leadsToDelete.map(lead => 
        api.delete(`/api/v1/leads/${lead._id}`)
      );

      await Promise.all(deletePromises);
      
      alert(`Successfully deleted today's leads for ${counselorName}`);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Error deleting leads. Make sure you have a delete route like /api/v1/leads/:id");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOTAL ================= */
  const totalToday = dailyData.reduce((a, b) => a + b.totalLeads, 0);
  const overallTotal = allData.reduce((a, b) => a + b.totalLeads, 0);

  /* ================= EXCEL DOWNLOAD ================= */
  const downloadExcel = () => {
    const sheetData = [];
    sheetData.push({ Section: "DAILY REPORT", Date: date });
    sheetData.push({ Counselor: "", Total: "" });

    dailyData.forEach(c => {
      sheetData.push({ Counselor: c.name, Total: c.totalLeads });
    });

    sheetData.push({}); 
    sheetData.push({ Section: "ALL COUNSELORS REPORT" });

    allData.forEach(c => {
      const row = { Counselor: c.name, Total: c.totalLeads };
      STATUS_LIST.forEach(s => { row[s] = c.statuses[s]; });
      sheetData.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `Counselor_Report_${date}.xlsx`);
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-blue-600" />
          <h2 className="font-bold">Daily Counselor Report</h2>
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1 rounded text-xs"
          />

          <button
            onClick={downloadExcel}
            className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-1"
          >
            <Download size={14} /> Excel
          </button>
        </div>
      </div>

      {/* TOP */}
      <div className="bg-blue-50 p-3 rounded mb-4">
        <p className="text-xs">Today Total</p>
        <p className="text-2xl font-bold text-blue-700">{totalToday}</p>
      </div>

      {/* DAILY LIST WITH DELETE */}
      {dailyData.map(c => (
        <div key={c.counselorId} className="flex justify-between items-center border p-2 rounded mb-2">
          <div>
            <p className="font-medium text-sm">{c.name}</p>
            <p className="text-xs text-gray-500">Today's Leads: {c.totalLeads}</p>
          </div>
          <button 
            onClick={() => deleteTodayLeads(c.counselorId, c.name)}
            disabled={loading}
            className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
            title="Delete today's leads"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* BOTTOM */}
      <h3 className="mt-6 font-bold">All Counselors</h3>

      <div className="bg-green-50 p-3 rounded mb-3">
        <p className="text-xs">Overall Total</p>
        <p className="text-2xl font-bold text-green-700">{overallTotal}</p>
      </div>

      {allData.map(c => (
        <div key={c.counselorId} className="border p-3 rounded mb-3">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">{c.name}</p>
            <p>Total: {c.totalLeads}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_LIST.map(s => (
              <span key={s} className="text-xs bg-slate-100 px-2 py-1 rounded">
                {s}: {c.statuses[s]}
              </span>
            ))}
          </div>
        </div>
      ))}

      {loading && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-xs">
          Processing, please wait...
        </div>
      )}
    </div>
  );
};

export default Dailycounslsourreoprt;