"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import * as XLSX from "xlsx";
import { Download, Loader2 } from "lucide-react";

const Allcounslerreport = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  /* ================= FETCH COUNSELORS ================= */
  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/counselor");
      if (res.data.success) {
        setCounselors(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  /* ================= DOWNLOAD EXCEL (BY COUNSELOR ID) ================= */
  const downloadExcel = async (counselor) => {
    try {
      setDownloadingId(counselor._id);

      // Backend ko 'limit: "all"' bhejna zaroori hai taaki pagination bypass ho jaye
      const res = await api.get(`/api/v1/leads`, {
        params: {
          counselorId: counselor._id, // Filter by specific counselor
          limit: "all",               // Saara data mangwane ke liye
        },
      });

      if (!res.data.success) {
        alert("Server se data nahi mil paya!");
        return;
      }

      // API se aaya hua raw data
      let rawLeads = res.data.data || [];

      // Frontend Filter: Sirf selected month ki leads filter karein
      const filteredLeads = rawLeads.filter((lead) => {
        if (!lead.createdAt) return false;
        // Check if lead date starts with "YYYY-MM"
        return lead.createdAt.startsWith(selectedMonth);
      });

      if (filteredLeads.length === 0) {
        alert(`${counselor.name} ke liye ${selectedMonth} me koi data nahi mila.`);
        return;
      }

      // Latest leads upar rakhne ke liye sort karein
      filteredLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      /* ================= EXCEL DATA PREPARATION ================= */
      const excelData = filteredLeads.map((lead, index) => ({
        "S.No": index + 1,
        "Counselor Name": counselor.name,
        "Student Name": lead?.name || "N/A",
        "Phone": lead?.phone || lead?.mobile || "N/A",
        "Email": lead?.email || "N/A",
        "Course": lead?.course || "N/A",
        "Status": lead?.status || "N/A",
        "Remark": lead?.remark || "N/A",
        "Creation Date": lead?.createdAt
          ? new Date(lead.createdAt).toLocaleDateString()
          : "N/A",
      }));

      /* ================= GENERATE XLSX ================= */
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Counselor Report");

      // Download trigger
      XLSX.writeFile(
        workbook,
        `${counselor.name}_Report_${selectedMonth}.xlsx`
      );

    } catch (err) {
      console.error("Download Error:", err);
      alert("Download fail ho gaya! Kripya backend pagination check karein.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full p-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 gap-4">
        <div>
          <h3 className="font-bold text-indigo-900 text-lg uppercase tracking-tight">
            Counselor Detailed Report
          </h3>
          <p className="text-xs text-indigo-700">
            Counselor ID ke basis par saari leads fetch karein.
          </p>
        </div>

        {/* MONTH PICKER */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-indigo-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm font-semibold"
          />
        </div>
      </div>

      {/* COUNSELOR LIST TABLE */}
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-gray-500 text-sm">Loading counselors...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-bold text-gray-600 uppercase">Counselor Details</th>
                <th className="p-4 text-right text-sm font-bold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>

            <tbody>
              {counselors.map((c) => (
                <tr key={c._id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800 uppercase leading-none">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">
                      ID: {c._id}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => downloadExcel(c)}
                      disabled={downloadingId === c._id}
                      className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all shadow-sm active:scale-95
                        ${
                          downloadingId === c._id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                    >
                      {downloadingId === c._id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Fetching Leads...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          <span>Download Report</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Allcounslerreport;