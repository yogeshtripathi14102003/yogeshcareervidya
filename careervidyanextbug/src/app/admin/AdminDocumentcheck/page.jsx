

"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";

import {
  Award,
  Calendar,
  Search,
  Download,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FinalAdmissionReport = () => {
  const [admissions, setAdmissions] = useState([]);
  const [activeCounselors, setActiveCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [admRes, cRes] = await Promise.all([
        api.get("/api/v1/ad"),
        api.get("/api/v1/counselor", { params: { status: "active", limit: 1000 } }),
      ]);
      if (admRes.data.success) setAdmissions(admRes.data.data);
      if (cRes.data.success)
        setActiveCounselors(
          cRes.data.data
            .filter((c) => c.status === "active" || c.status === "Active")
            .map((c) => c.name)
            .filter(Boolean)
        );
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const {
    finalReport,
    uniList,
    grandTotals,
    currentMonthName,
  } = useMemo(() => {

    const selDateObj = new Date(selectedDate);
    const selMonth = selDateObj.getMonth();
    const selYear = selDateObj.getFullYear();
    const monthName = selDateObj.toLocaleString("default", { month: "long" });

    /* Use active counselors from API — inactive wale yahan nahi aayenge */
    const allCounselors = activeCounselors.length
      ? [...new Set(activeCounselors)].sort()
      : [...new Set(admissions.map((i) => i.counselorName).filter(Boolean))].sort();

    const dateWiseUnis = new Set();
    admissions.forEach((item) => {
      const itemDate = new Date(item.admissionDate || item.createdAt).toISOString().split("T")[0];
      if (itemDate === selectedDate && item.universityName) {
        dateWiseUnis.add(item.universityName.toUpperCase());
      }
    });

    let allUnis = [...dateWiseUnis].sort();
    if (searchTerm) {
      allUnis = allUnis.filter((u) => u.includes(searchTerm.toUpperCase()));
    }

    const counselorMap = {};
    const counselorUniversities = {};

    allCounselors.forEach((name) => {
      counselorMap[name] = {
        name,
        dailyStats: {},
        dailyRowTotal: 0,
        monthlyTotal: 0,
        leadTotal: 0,
        referralTotal: 0,
        totalDocs: 0,
        verifiedDocs: 0,
        pendingDocs: 0,
        rejectedDocs: 0,
      };
      counselorUniversities[name] = new Set();
      allUnis.forEach((u) => {
        counselorMap[name].dailyStats[u] = 0;
      });
    });

    admissions.forEach((item) => {
      const dateObj = new Date(item.admissionDate || item.createdAt);
      const itemDate = dateObj.toISOString().split("T")[0];
      const itemMonth = dateObj.getMonth();
      const itemYear = dateObj.getFullYear();
      const counselor = item.counselorName;
      const uni = item.universityName?.toUpperCase();

      if (!counselor || !counselorMap[counselor]) return;

      if (uni) counselorUniversities[counselor].add(uni);

      const isReferral = item.refrelname && item.refrelname.trim() !== "";

      /* Doc counts — scoped to admission date month (not createdAt) */
      const admDateObj   = new Date(item.admissionDate || item.createdAt);
      const admItemMonth = admDateObj.getMonth();
      const admItemYear  = admDateObj.getFullYear();
      const docs         = item.documents || [];

      if (admItemMonth === selMonth && admItemYear === selYear) {
        counselorMap[counselor].monthlyTotal++;

        /* 1 admission = 1 unit — chahe kitni bhi images/files hon */
        const hasAnyDoc    = docs.length > 0;
        const allVerified  = hasAnyDoc && docs.every((d) => d.status === "done");
        const hasPending   = docs.some((d) => d.status === "pending");
        const hasRejected  = docs.some((d) => d.status === "rejected");

        if (hasAnyDoc)   counselorMap[counselor].totalDocs++;
        if (allVerified) counselorMap[counselor].verifiedDocs++;
        if (hasPending)  counselorMap[counselor].pendingDocs++;
        if (hasRejected) counselorMap[counselor].rejectedDocs++;
      }

      if (itemDate === selectedDate && uni && counselorMap[counselor].dailyStats[uni] !== undefined) {
        counselorMap[counselor].dailyStats[uni]++;
        counselorMap[counselor].dailyRowTotal++;
        if (isReferral) counselorMap[counselor].referralTotal++;
        else            counselorMap[counselor].leadTotal++;
      }
    });

    const finalData = Object.values(counselorMap)
      .map((row) => ({
        ...row,
        universities: counselorUniversities[row.name] ? [...counselorUniversities[row.name]] : [],
      }))
      .filter(() => true); // show all counselors including 0 admissions

    const grandDaily    = finalData.reduce((s, r) => s + r.dailyRowTotal,  0);
    const grandMonthly  = finalData.reduce((s, r) => s + r.monthlyTotal,   0);
    const grandLead     = finalData.reduce((s, r) => s + r.leadTotal,      0);
    const grandReferral = finalData.reduce((s, r) => s + r.referralTotal,  0);
    const grandTotal    = finalData.reduce((s, r) => s + r.totalDocs,      0);
    const grandVerified = finalData.reduce((s, r) => s + r.verifiedDocs,   0);
    const grandPending  = finalData.reduce((s, r) => s + r.pendingDocs,    0);
    const grandRejected = finalData.reduce((s, r) => s + r.rejectedDocs,   0);

    return {
      finalReport: finalData,
      uniList: allUnis,
      currentMonthName: monthName,
      grandTotals: {
        daily: grandDaily, monthly: grandMonthly,
        lead: grandLead, referral: grandReferral,
        totalDocs: grandTotal, verifiedDocs: grandVerified,
        pendingDocs: grandPending, rejectedDocs: grandRejected,
      },
    };
  }, [admissions, activeCounselors, selectedDate, searchTerm]);

  const downloadExcel = () => {
    const data = [];
    finalReport.forEach((row, index) => {
      const rowData = {
        Sr: index + 1,
        Counselor: row.name,
        Universities: row.universities.join(", "),
        "Total Lead": row.leadTotal,
        "Total Referral": row.referralTotal,
      };
      uniList.forEach((u) => {
        rowData[`${u} (L/R)`] = row.dailyStats[u] || 0;
      });
      rowData["Daily Total"]    = row.dailyRowTotal;
      rowData["Monthly Total"]  = row.monthlyTotal;
      rowData["Total Docs"]     = row.totalDocs;
      rowData["Verified Docs"]  = row.verifiedDocs;
      rowData["Pending Docs"]   = row.pendingDocs;
      rowData["Rejected Docs"]  = row.rejectedDocs;
      data.push(rowData);
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daily Report");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Admission_Report_${selectedDate}.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-emerald-700 animate-pulse">
        Loading Report...
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-md overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#1e3a1e] p-4 flex flex-wrap gap-3 justify-between">
          <h1 className="text-white font-bold flex items-center gap-2">
            <Award className="text-yellow-400" size={20} />
            Performance - {currentMonthName}
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search University"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs rounded"
              />
            </div>
            <div className="flex items-center bg-white/10 px-2 py-1 rounded">
              <Calendar size={14} className="text-white mr-1" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs outline-none"
              />
            </div>
            <button
              onClick={downloadExcel}
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
            >
              <Download size={14} />
              Excel
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto max-h-[75vh]">
          <table className="w-full text-center border-collapse min-w-max">
            <thead className="sticky top-0 bg-green-100 z-10">
              <tr className="text-xs font-bold">
                <th className="border p-2">Sr</th>
                <th className="border p-2 text-left">Counselor</th>
                <th className="border p-2 text-left bg-blue-100">Universities</th>
                {uniList.map((u) => (
                  <th key={u} className="border p-2">{u} (L/R)</th>
                ))}
                <th className="border p-2 bg-blue-200">Lead</th>
                <th className="border p-2 bg-purple-200">Referral</th>
                <th className="border p-2 bg-green-200">Daily</th>
                <th className="border p-2 bg-orange-200">Month</th>
                {/* NEW DOC COLUMNS */}
                <th className="border p-2 bg-slate-200">Total Docs</th>
                <th className="border p-2 bg-emerald-200">✅ Verified</th>
                <th className="border p-2 bg-yellow-200">⏳ Pending</th>
                <th className="border p-2 bg-red-200">❌ Rejected</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold">
              {finalReport.map((row, i) => (
                <tr key={i} className="hover:bg-yellow-50">
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1 text-left font-bold text-emerald-800">{row.name}</td>
                  <td className="border p-1 text-left text-[10px] text-blue-700">
                    {row.universities.length ? row.universities.join(", ") : "-"}
                  </td>
                  {uniList.map((u) => (
                    <td key={u} className="border p-1 text-indigo-700 font-bold">
                      {row.dailyStats[u] || 0}
                    </td>
                  ))}
                  <td className="border p-1 bg-blue-50 font-bold">{row.leadTotal}</td>
                  <td className="border p-1 bg-purple-50 font-bold">{row.referralTotal}</td>
                  <td className="border p-1 bg-green-50 font-bold">{row.dailyRowTotal}</td>
                  <td className="border p-1 bg-orange-50 font-bold">{row.monthlyTotal}</td>
                  {/* NEW DOC CELLS */}
                  <td className="border p-1 bg-slate-50 font-bold text-slate-700">{row.totalDocs}</td>
                  <td className="border p-1 bg-emerald-50 font-bold text-emerald-700">{row.verifiedDocs}</td>
                  <td className="border p-1 bg-yellow-50 font-bold text-yellow-600">
                    {row.pendingDocs > 0
                      ? <span className="inline-flex items-center gap-1">{row.pendingDocs} <span className="text-[9px] text-yellow-500">●</span></span>
                      : 0}
                  </td>
                  <td className="border p-1 bg-red-50 font-bold text-red-600">{row.rejectedDocs}</td>
                </tr>
              ))}
            </tbody>

            {/* GRAND TOTAL ROW */}
            {finalReport.length > 0 && (
              <tfoot>
                <tr className="text-xs font-bold bg-[#1e3a1e] text-white sticky bottom-0">
                  <td className="border p-2" colSpan={3 + uniList.length}>GRAND TOTAL</td>
                  <td className="border p-2 bg-blue-800">{grandTotals.lead}</td>
                  <td className="border p-2 bg-purple-800">{grandTotals.referral}</td>
                  <td className="border p-2 bg-green-800">{grandTotals.daily}</td>
                  <td className="border p-2 bg-orange-800">{grandTotals.monthly}</td>
                  <td className="border p-2 bg-slate-700">{grandTotals.totalDocs}</td>
                  <td className="border p-2 bg-emerald-800">{grandTotals.verifiedDocs}</td>
                  <td className="border p-2 bg-yellow-700">{grandTotals.pendingDocs}</td>
                  <td className="border p-2 bg-red-800">{grandTotals.rejectedDocs}</td>
                </tr>
              </tfoot>
            )}

          </table>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mt-5">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xs text-gray-400">Today Lead</p>
          <h2 className="text-2xl font-bold text-blue-600">{grandTotals.lead}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xs text-gray-400">Today Referral</p>
          <h2 className="text-2xl font-bold text-purple-600">{grandTotals.referral}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xs text-gray-400">Today Total</p>
          <h2 className="text-2xl font-bold text-emerald-700">{grandTotals.daily}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-xs text-gray-400">{currentMonthName}</p>
          <h2 className="text-2xl font-bold text-orange-600">{grandTotals.monthly}</h2>
        </div>
      </div>

      {/* DOC STATS */}
      <div className="grid md:grid-cols-4 gap-4 mt-3">
        <div className="bg-white p-4 shadow rounded border-l-4 border-slate-400">
          <p className="text-xs text-gray-400">Total Docs (Month)</p>
          <h2 className="text-2xl font-bold text-slate-700">{grandTotals.totalDocs}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded border-l-4 border-emerald-500">
          <p className="text-xs text-gray-400">✅ Verified</p>
          <h2 className="text-2xl font-bold text-emerald-600">{grandTotals.verifiedDocs}</h2>
          {grandTotals.totalDocs > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {Math.round((grandTotals.verifiedDocs / grandTotals.totalDocs) * 100)}% complete
            </p>
          )}
        </div>
        <div className="bg-white p-4 shadow rounded border-l-4 border-yellow-400">
          <p className="text-xs text-gray-400">⏳ Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{grandTotals.pendingDocs}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded border-l-4 border-red-500">
          <p className="text-xs text-gray-400">❌ Rejected</p>
          <h2 className="text-2xl font-bold text-red-600">{grandTotals.rejectedDocs}</h2>
        </div>
      </div>

    </div>
  );
};

export default FinalAdmissionReport;