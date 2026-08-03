"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { FileSpreadsheet, FileText, FileDown, Calendar } from "lucide-react";

const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("monthly");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/reports/preview", { params: { period } });
      setReport(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const downloadFile = async (url, filenameFallback) => {
    try {
      const res = await api.get(url, { params: { period }, responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;

      const disposition = res.headers["content-disposition"];
      const match = disposition?.match(/filename="(.+)"/);
      a.download = match?.[1] || filenameFallback;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-IN");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar /> Reports
        </h1>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                period === p.value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !report ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <>
          <p className="text-xs text-gray-500">
            {report.periodLabel} report — {fmt(report.range.from)} to {fmt(report.range.to)}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <SummaryCard label="Total Leads" value={report.summary.totalLeads} />
            <SummaryCard label="Admissions" value={report.summary.admissions} accent="text-green-600" />
            <SummaryCard label="Lost Leads" value={report.summary.lostLeads} accent="text-red-500" />
            <SummaryCard label="Conversion" value={`${report.summary.conversionRate}%`} accent="text-indigo-600" />
            <SummaryCard label="Visitors" value={report.summary.totalVisitors} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportTable title="Leads by Source" rows={report.leadsBySource} columns={[["source", "Source"], ["count", "Count"]]} />
            <ReportTable title="Leads by Status" rows={report.leadsByStatus} columns={[["status", "Status"], ["count", "Count"]]} />
            <ReportTable
              title="Top Counselors"
              rows={report.topCounselors}
              columns={[["name", "Name"], ["totalLeads", "Leads"], ["admissions", "Admissions"]]}
            />
            <ReportTable title="Top Courses" rows={report.topCourses} columns={[["course", "Course"], ["count", "Leads"]]} />
          </div>

          <div className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold text-sm mb-3">Export</h2>
            <div className="flex flex-wrap gap-3">
              <ExportButton
                icon={<FileSpreadsheet size={15} />}
                label="Excel"
                loading={exporting === "xlsx"}
                onClick={() => {
                  setExporting("xlsx");
                  downloadFile("/api/v1/reports/export/spreadsheet?format=xlsx", `report-${period}.xlsx`);
                }}
              />
              <ExportButton
                icon={<FileDown size={15} />}
                label="CSV"
                loading={exporting === "csv"}
                onClick={() => {
                  setExporting("csv");
                  downloadFile("/api/v1/reports/export/spreadsheet?format=csv", `report-${period}.csv`);
                }}
              />
              <ExportButton
                icon={<FileText size={15} />}
                label="PDF"
                loading={exporting === "pdf"}
                onClick={() => {
                  setExporting("pdf");
                  downloadFile("/api/v1/reports/export/pdf", `report-${period}.pdf`);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const SummaryCard = ({ label, value, accent = "text-slate-800" }) => (
  <div className="bg-white border rounded-xl p-3">
    <p className="text-[11px] text-gray-400">{label}</p>
    <p className={`text-xl font-bold ${accent}`}>{value}</p>
  </div>
);

const ReportTable = ({ title, rows, columns }) => (
  <div className="bg-white border rounded-xl p-4">
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    {rows.length === 0 ? (
      <p className="text-xs text-gray-400">No data.</p>
    ) : (
      <table className="w-full text-xs">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {columns.map(([key, label], colIdx) => (
                <td key={key} className="py-1.5 pr-3">
                  {colIdx === 0 ? <span className="font-medium">{row[key]}</span> : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

const ExportButton = ({ icon, label, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
  >
    {icon} {loading ? "Exporting…" : label}
  </button>
);
