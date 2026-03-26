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

  /* ================= SAFE MATCH FUNCTION ================= */
  const isSameCounselor = (lead, counselorId) => {
    return (
      String(lead?.counselorId) === String(counselorId) ||
      String(lead?.counselorId?._id) === String(counselorId) ||
      String(lead?.assignedTo) === String(counselorId) ||
      String(lead?.assignedTo?._id) === String(counselorId)
    );
  };

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = async (counselor) => {
    try {
      setDownloadingId(counselor._id);

      console.log("👉 Selected Counselor:", counselor._id);

      const res = await api.get(`/api/v1/leads`, {
        params: {
          counselorId: counselor._id,
          month: selectedMonth,
        },
      });

      if (!res.data.success) {
        alert("API error");
        return;
      }

      let allLeads = res.data.data || [];

      console.log("👉 Total Leads from API:", allLeads.length);

      /* ================= FILTER ================= */
      const filteredLeads = allLeads.filter((lead) =>
        isSameCounselor(lead, counselor._id)
      );

      console.log("✅ Filtered Leads:", filteredLeads.length);

      if (filteredLeads.length === 0) {
        alert("Is counselor ke liye koi lead nahi mili ❌");

        // DEBUG HELP
        console.log("Sample Lead:", allLeads[0]);

        return;
      }

      /* ================= SORT ================= */
      filteredLeads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      /* ================= EXCEL DATA ================= */
      const excelData = filteredLeads.map((lead, index) => ({
        "S.No": index + 1,
        "Counselor Name": counselor.name,
        "Student Name": lead?.name || "N/A",
        "Phone": lead?.phone || "N/A",
        "Email": lead?.email || "N/A",
        "Course": lead?.course || "N/A",
        "Status": lead?.status || "N/A",
        "Remark": lead?.remark || "N/A",
        "Assign Date": lead?.createdAt
          ? new Date(lead.createdAt).toLocaleDateString()
          : "N/A",
      }));

      /* ================= WORKBOOK ================= */
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Report");

      /* ================= DOWNLOAD ================= */
      XLSX.writeFile(
        workbook,
        `${counselor.name}_Detailed_Report_${selectedMonth}.xlsx`
      );
    } catch (err) {
      console.error("Download Error:", err);
      alert("Report download karne me error aayi ❌");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 gap-4">
        <div>
          <h3 className="font-bold text-indigo-900">
            Counselor Detailed Report
          </h3>
          <p className="text-xs text-indigo-700">
            Sirf assigned leads ka Excel download karein
          </p>
        </div>

        {/* MONTH FILTER */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-indigo-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-gray-500 text-sm">
              Counselors load ho rahe hain...
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Counselor
                </th>
                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {counselors.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {c._id}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => downloadExcel(c)}
                      disabled={downloadingId === c._id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                        ${
                          downloadingId === c._id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
                        }`}
                    >
                      {downloadingId === c._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}

                      {downloadingId === c._id
                        ? "Preparing..."
                        : "Download Excel"}
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