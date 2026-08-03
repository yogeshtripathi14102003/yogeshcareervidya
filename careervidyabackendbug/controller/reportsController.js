import XLSX from "xlsx";
import PDFDocument from "pdfkit";
import { generateReport } from "../utilities/reportGenerator.js";

const VALID_PERIODS = ["daily", "weekly", "monthly", "yearly"];

const parseReportParams = (query) => {
  const { period, from, to } = query;
  if (from && to) return { from, to };
  if (!VALID_PERIODS.includes(period)) {
    throw new Error("period must be one of daily/weekly/monthly/yearly, or provide from & to");
  }
  return { period };
};

export const getReportPreview = async (req, res) => {
  try {
    const params = parseReportParams(req.query);
    const report = await generateReport(params);
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN");

/* ---------------- Excel / CSV ---------------- */
export const exportReportSpreadsheet = async (req, res) => {
  try {
    const params = parseReportParams(req.query);
    const format = req.query.format === "csv" ? "csv" : "xlsx";
    const report = await generateReport(params);

    const wb = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([
      { Metric: "Period", Value: report.periodLabel },
      { Metric: "From", Value: fmtDate(report.range.from) },
      { Metric: "To", Value: fmtDate(report.range.to) },
      { Metric: "Total Leads", Value: report.summary.totalLeads },
      { Metric: "Admissions", Value: report.summary.admissions },
      { Metric: "Lost Leads", Value: report.summary.lostLeads },
      { Metric: "Conversion Rate (%)", Value: report.summary.conversionRate },
      { Metric: "Total Visitors", Value: report.summary.totalVisitors },
    ]);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    if (format === "xlsx") {
      // CSV can only hold one sheet — the extra breakdown sheets are an
      // Excel-only bonus, not available in the CSV export.
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.leadsBySource), "By Source");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.leadsByStatus), "By Status");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.topCounselors), "Top Counselors");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.topCourses), "Top Courses");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.trafficSources), "Traffic Sources");
    }

    const filename = `report-${params.period || "custom"}-${Date.now()}.${format === "csv" ? "csv" : "xlsx"}`;

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(summarySheet);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.send(csv);
    }

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------------- PDF ---------------- */
export const exportReportPDF = async (req, res) => {
  try {
    const params = parseReportParams(req.query);
    const report = await generateReport(params);

    const doc = new PDFDocument({ margin: 40 });
    const filename = `report-${params.period || "custom"}-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    doc.fontSize(18).text(`CareerVidya — ${report.periodLabel} Report`, { align: "center" });
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(`${fmtDate(report.range.from)} – ${fmtDate(report.range.to)}`, { align: "center" });
    doc.moveDown(1.5);

    doc.fillColor("#000").fontSize(13).text("Summary");
    doc.moveDown(0.3);
    doc.fontSize(10);
    [
      ["Total Leads", report.summary.totalLeads],
      ["Admissions", report.summary.admissions],
      ["Lost Leads", report.summary.lostLeads],
      ["Conversion Rate", `${report.summary.conversionRate}%`],
      ["Total Visitors", report.summary.totalVisitors],
    ].forEach(([label, value]) => {
      doc.text(`${label}: ${value}`);
    });
    doc.moveDown(1);

    const renderTable = (title, rows, columns) => {
      if (!rows.length) return;
      doc.fontSize(13).text(title);
      doc.moveDown(0.3);
      doc.fontSize(10);
      rows.forEach((row) => {
        doc.text(columns.map((c) => `${c.label}: ${row[c.key]}`).join("   |   "));
      });
      doc.moveDown(1);
    };

    renderTable("Leads by Source", report.leadsBySource, [
      { key: "source", label: "Source" },
      { key: "count", label: "Count" },
    ]);
    renderTable("Leads by Status", report.leadsByStatus, [
      { key: "status", label: "Status" },
      { key: "count", label: "Count" },
    ]);
    renderTable("Top Counselors", report.topCounselors, [
      { key: "name", label: "Name" },
      { key: "totalLeads", label: "Leads" },
      { key: "admissions", label: "Admissions" },
    ]);
    renderTable("Top Courses", report.topCourses, [
      { key: "course", label: "Course" },
      { key: "count", label: "Leads" },
    ]);
    renderTable("Traffic Sources", report.trafficSources, [
      { key: "source", label: "Source" },
      { key: "count", label: "Count" },
    ]);

    doc.fontSize(8).fillColor("#999").text(`Generated ${new Date(report.generatedAt).toLocaleString("en-IN")}`, {
      align: "center",
    });

    doc.end();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
