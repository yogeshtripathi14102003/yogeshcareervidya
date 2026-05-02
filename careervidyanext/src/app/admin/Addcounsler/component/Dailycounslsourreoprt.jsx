

"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Users, Download } from "lucide-react";
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

  /* ================= TOTAL ================= */
  const totalToday = dailyData.reduce((a, b) => a + b.totalLeads, 0);
  const overallTotal = allData.reduce((a, b) => a + b.totalLeads, 0);

  /* ================= EXCEL DOWNLOAD ================= */
  const downloadExcel = () => {
    const sheetData = [];

    // 👉 DAILY SECTION
    sheetData.push({ Section: "DAILY REPORT", Date: date });
    sheetData.push({ Counselor: "", Total: "" });

    dailyData.forEach(c => {
      sheetData.push({
        Counselor: c.name,
        Total: c.totalLeads
      });
    });

    sheetData.push({}); // empty row

    // 👉 ALL COUNSELOR SECTION
    sheetData.push({ Section: "ALL COUNSELORS REPORT" });

    allData.forEach(c => {
      const row = {
        Counselor: c.name,
        Total: c.totalLeads
      };

      STATUS_LIST.forEach(s => {
        row[s] = c.statuses[s];
      });

      sheetData.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(
      workbook,
      `Counselor_Report_${date}.xlsx`
    );
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

      {dailyData.map(c => (
        <div key={c.counselorId} className="flex justify-between border p-2 rounded mb-2">
          <p>{c.name}</p>
          <p>{c.totalLeads}</p>
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
        <p className="text-center text-xs text-gray-400 mt-4">
          Loading full data...
        </p>
      )}
    </div>
  );
};

export default Dailycounslsourreoprt;