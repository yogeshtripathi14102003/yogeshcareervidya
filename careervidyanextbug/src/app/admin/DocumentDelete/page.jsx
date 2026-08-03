"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/utlis/api.js";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

/* ── Normalize counselor name: trim + lowercase + collapse spaces ── */
const normName = (str) => (str || "").trim().toLowerCase().replace(/\s+/g, " ");

const statusColor = {
  pending:  { bg: "#FFF8E1", text: "#F59E0B", border: "#FDE68A", label: "Pending" },
  done:     { bg: "#ECFDF5", text: "#10B981", border: "#6EE7B7", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#EF4444", border: "#FECACA", label: "Rejected" },
};

const fileIcon = (type) => {
  if (!type) return "📎";
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("doc")) return "📝";
  return "🖼️";
};

const toSecureUrl = (url) => {
  if (!url) return url;
  return url.replace(/^http:\/\//i, "https://");
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatMonthLabel = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
};

const getAdmissionMonth = (adm) => {
  // admissionDate = actual admission date (schema field)
  // fallback to createdAt only if admissionDate missing
  const raw  = adm.admissionDate || adm.createdAt;
  const date = raw ? new Date(raw) : null;
  if (!date || isNaN(date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export default function AdmissionsOnlyPanel() {
  const [admissions, setAdmissions]         = useState([]);
  const [loading, setLoading]               = useState(false);
  const [selected, setSelected]             = useState(null);
  const [verifyModal, setVerifyModal]       = useState(null);
  const [verifyStatus, setVerifyStatus]     = useState("done");
  const [verifyRemark, setVerifyRemark]     = useState("");
  const [verifying, setVerifying]           = useState(false);
  const [toast, setToast]                   = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  /* ── Drill-down filter state ── */
  const [filterCounselor, setFilterCounselor] = useState("");
  const [filterMonth, setFilterMonth]         = useState("all");
  const [filterStatus, setFilterStatus]       = useState("all");
  const [searchText, setSearchText]           = useState("");
  const [calendarOpen, setCalendarOpen]       = useState(false);

  const calendarRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* ── Close calendar on outside click ── */
  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  /* ── Fetch admissions ── */
  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/ad", { params: { limit: 5000 } });
      if (res.data.success) setAdmissions(res.data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  /* ── Download ALL Docs As A Single Merged PDF ── */
  const downloadAllDocsAsSinglePDF = async (studentName, documents) => {
    const allFiles = (documents || []).filter((d) => d.fileUrl);
    if (allFiles.length === 0) { showToast("❌ Koi document nahi mila!"); return; }
    setDownloadingPdf(true);
    showToast("📄 Documents merge ho rahe hain...");
    try {
      const masterPdf = await PDFDocument.create();
      let successfulFiles = 0;
      for (const doc of allFiles) {
        try {
          const secureUrl = toSecureUrl(doc.fileUrl);
          const response  = await fetch(secureUrl);
          if (!response.ok) throw new Error("Fetch failed");
          const arrayBuffer = await response.arrayBuffer();
          const fileType    = doc.fileType?.toLowerCase() || "";
          const isPdf       = fileType.includes("pdf") || doc.fileName.toLowerCase().endsWith(".pdf");
          const isImage     = fileType.includes("image") || doc.fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/);
          if (isPdf) {
            const srcPdf      = await PDFDocument.load(arrayBuffer);
            const copiedPages = await masterPdf.copyPages(srcPdf, srcPdf.getPageIndices());
            copiedPages.forEach((page) => masterPdf.addPage(page));
            successfulFiles++;
          } else if (isImage) {
            const image = doc.fileName.toLowerCase().endsWith(".png") || fileType.includes("png")
              ? await masterPdf.embedPng(arrayBuffer)
              : await masterPdf.embedJpg(arrayBuffer);
            const page = masterPdf.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            successfulFiles++;
          }
        } catch (err) { console.error(`Skipped: ${doc.fileName}`, err); }
      }
      if (successfulFiles === 0) throw new Error("Koi file process nahi ho saki.");
      const pdfBytes = await masterPdf.save();
      const blob     = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `${studentName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_combined_documents.pdf`);
      showToast(`✅ ${successfulFiles} files merge karke download ho gaya!`);
    } catch (err) {
      showToast("❌ Merge fail: " + err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  /* ── Delete Document ── */
  const deleteDoc = async (admissionId, docId) => {
    if (!window.confirm("Is document ko delete karna chahte hain?")) return;
    try {
      const res = await api.delete(`/api/v1/ad/${admissionId}/documents/${docId}`);
      if (res.data.success) {
        showToast("🗑️ Document delete ho gaya");
        fetchAdmissions();
        if (selected?._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
  };

  /* ── Verify single doc ── */
  const verifyDoc = async () => {
    if (verifyStatus === "rejected" && !verifyRemark.trim()) {
      showToast("❌ Rejection reason zaroori hai"); return;
    }
    setVerifying(true);
    try {
      const res = await api.put(
        `/api/v1/ad/${verifyModal.admissionId}/documents/${verifyModal.docId}/verify`,
        { status: verifyStatus, adminRemark: verifyRemark }
      );
      if (res.data.success) {
        showToast(verifyStatus === "done" ? "✅ Approved!" : "❌ Rejected");
        setVerifyModal(null); setVerifyRemark(""); setVerifyStatus("done");
        fetchAdmissions();
        if (selected) {
          const r2 = await api.get(`/api/v1/ad/${selected._id}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
    setVerifying(false);
  };

  /* ── Verify all pending ── */
  const verifyAll = async (admissionId, status, remark = "") => {
    if (status === "rejected" && !remark.trim()) { showToast("Remark zaroori hai"); return; }
    try {
      const res = await api.put(
        `/api/v1/ad/${admissionId}/documents/verify-all`,
        { status, adminRemark: remark }
      );
      if (res.data.success) {
        showToast("✅ Docs updated!");
        fetchAdmissions();
        if (selected?._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
  };

  /* ══════════════════════════════════════════════════
     DRILL-DOWN FILTER HANDLERS
     Step 1 → Counselor  (resets month + status)
     Step 2 → Month      (resets status only)
     Step 3 → Status     (stacks on top)

     normName() used everywhere so "Rahul " == "Rahul"
  ══════════════════════════════════════════════════ */
  const handleCounselorChange = (val) => {
    setFilterCounselor(val.trim());   // store trimmed
    setFilterMonth("all");
    setFilterStatus("all");
    setSearchText("");
    setCalendarOpen(false);
  };

  const handleMonthChange = (val) => {
    setFilterMonth(val);
    setFilterStatus("all");
    setCalendarOpen(false);
  };

  const handleStatusChange = (val) => setFilterStatus(val);

  const clearAllFilters = () => {
    setFilterCounselor("");
    setFilterMonth("all");
    setFilterStatus("all");
    setSearchText("");
    setCalendarOpen(false);
  };

  /* ══════════════════════════════════════════════════
     DERIVED DATA — three-stage pipeline
     afterCounselor → afterMonth → filteredAdmissions
     normName() used for ALL counselor comparisons
  ══════════════════════════════════════════════════ */

  /* Unique counselors — trim display names for dropdown */
  const counselors = [...new Map(
    admissions
      .filter((a) => a.counselorName?.trim())
      .map((a) => [normName(a.counselorName), a.counselorName.trim()])
  ).values()];

  /* Stage 1: filter by counselor (normalized match) */
  const afterCounselor = filterCounselor
    ? admissions.filter((a) => normName(a.counselorName) === normName(filterCounselor))
    : admissions;

  /* Stage 2: filter by month (within counselor pool) */
  const afterMonth = filterMonth !== "all"
    ? afterCounselor.filter((a) => getAdmissionMonth(a) === filterMonth)
    : afterCounselor;

  /* Stage 3: filter by status + search (within month pool) */
  const filteredAdmissions = afterMonth.filter((a) => {
    if (searchText) {
      const q   = searchText.toLowerCase();
      const hit = a.studentName?.toLowerCase().includes(q) ||
                  a.email?.toLowerCase().includes(q) ||
                  a.phone?.includes(searchText);
      if (!hit) return false;
    }
    const docs = a.documents || [];
    if (filterStatus === "has_pending"  && !docs.some((d) => d.status === "pending"))                    return false;
    if (filterStatus === "all_done"     && !(docs.length > 0 && docs.every((d) => d.status === "done"))) return false;
    if (filterStatus === "has_rejected" && !docs.some((d) => d.status === "rejected"))                   return false;
    if (filterStatus === "no_docs"      && docs.length !== 0)                                            return false;
    return true;
  });

  /* Status counts — scoped to afterMonth so numbers are accurate per counselor+month */
  const statusCounts = {
    total:        afterMonth.length,
    has_pending:  afterMonth.filter((a) => (a.documents||[]).some((d) => d.status === "pending")).length,
    all_done:     afterMonth.filter((a) => (a.documents||[]).length > 0 && (a.documents||[]).every((d) => d.status === "done")).length,
    has_rejected: afterMonth.filter((a) => (a.documents||[]).some((d) => d.status === "rejected")).length,
    no_docs:      afterMonth.filter((a) => (a.documents||[]).length === 0).length,
  };

  /* Month options — scoped to afterCounselor so only relevant months appear */
  const admissionMonths = [...new Set(
    afterCounselor.map((a) => getAdmissionMonth(a)).filter(Boolean)
  )].sort().reverse();

  /* Group months by year for calendar grid */
  const monthsByYear = admissionMonths.reduce((acc, ym) => {
    const [y] = ym.split("-");
    if (!acc[y]) acc[y] = [];
    acc[y].push(ym);
    return acc;
  }, {});

  /* Stats strip */
  const primaryStats = {
    totalAdmissions:  afterMonth.length,
    totalPendingDocs: afterMonth.reduce((acc, a) => acc + (a.documents||[]).filter((d) => d.status === "pending").length, 0),
    totalDocs:        afterMonth.reduce((acc, a) => acc + (a.documents||[]).length, 0),
    verifiedStudents: afterMonth.filter((a) => (a.documents||[]).length > 0 && (a.documents||[]).every((d) => d.status === "done")).length,
  };

  const monthDisabled       = !filterCounselor;
  const statusDisabled      = filterMonth === "all";
  const activeFiltersExist  = filterCounselor || filterStatus !== "all" || filterMonth !== "all" || searchText;

  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      <div style={s.mainFull}>

        {/* ════════════ LIST VIEW ════════════ */}
        {!selected ? (
          <div>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>👨‍🎓 Admissions Management</h1>
              <button onClick={fetchAdmissions} style={s.refreshBtn}>🔄 Refresh</button>
            </div>

            {/* Drill-down hint bar */}
            <div style={s.drillHint}>
              <span style={{ ...s.drillStep, background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE" }}>
                1 · Select Counselor
              </span>
              <span style={s.drillArrow}>→</span>
              <span style={{
                ...s.drillStep,
                background: monthDisabled ? "#F1F5F9" : "#ECFDF5",
                color: monthDisabled ? "#94A3B8" : "#059669",
                border: `1px solid ${monthDisabled ? "#E2E8F0" : "#6EE7B7"}`,
              }}>
                2 · Pick Month
              </span>
              <span style={s.drillArrow}>→</span>
              <span style={{
                ...s.drillStep,
                background: statusDisabled ? "#F1F5F9" : "#FFF8E1",
                color: statusDisabled ? "#94A3B8" : "#D97706",
                border: `1px solid ${statusDisabled ? "#E2E8F0" : "#FDE68A"}`,
              }}>
                3 · Filter Status
              </span>
            </div>

            {/* Filter row */}
            <div style={s.filtersRow}>

              {/* Search */}
              <input
                style={s.searchInput}
                placeholder="🔍 Student name, email, phone..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {/* STEP 1: Counselor */}
              <select
                style={{
                  ...s.select,
                  borderColor: filterCounselor ? "#6366F1" : "#E5E7EB",
                  fontWeight:  filterCounselor ? 600 : 400,
                }}
                value={filterCounselor}
                onChange={(e) => handleCounselorChange(e.target.value)}
              >
                <option value="">👤 All Counselors</option>
                {counselors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* STEP 2: Month Calendar */}
              <div ref={calendarRef} style={{ position: "relative", flex: 1, minWidth: 185 }}>
                <button
                  disabled={monthDisabled}
                  onClick={() => !monthDisabled && setCalendarOpen((o) => !o)}
                  style={{
                    ...s.select,
                    width: "100%",
                    textAlign: "left",
                    cursor:      monthDisabled ? "not-allowed" : "pointer",
                    borderColor: filterMonth !== "all" ? "#10B981" : monthDisabled ? "#F1F5F9" : "#E5E7EB",
                    fontWeight:  filterMonth !== "all" ? 600 : 400,
                    background:  monthDisabled ? "#F8FAFC" : "#fff",
                    color:       monthDisabled ? "#94A3B8" : "#111827",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    userSelect: "none",
                  }}
                >
                  <span>
                    {filterMonth !== "all"
                      ? `📅 ${formatMonthLabel(filterMonth)}`
                      : monthDisabled ? "📅 Pick counselor first" : "📅 All Months"}
                  </span>
                  <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 8 }}>▾</span>
                </button>

                {calendarOpen && !monthDisabled && (
                  <div style={s.calendarDropdown}>
                    <div style={s.calendarHeader}>
                      📅 {filterCounselor} — select month
                    </div>

                    {admissionMonths.length === 0 ? (
                      <div style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", padding: "16px 0" }}>
                        No admissions for this counselor
                      </div>
                    ) : (
                      Object.keys(monthsByYear).sort().reverse().map((year) => (
                        <div key={year} style={{ marginBottom: 14 }}>
                          <div style={s.calendarYear}>{year}</div>
                          <div style={s.calendarGrid}>
                            {monthsByYear[year].map((ym) => {
                              const mIdx     = parseInt(ym.split("-")[1], 10) - 1;
                              const isActive = filterMonth === ym;
                              /* Count admissions in this month for this counselor */
                              const cnt = afterCounselor.filter((a) => getAdmissionMonth(a) === ym).length;
                              return (
                                <button
                                  key={ym}
                                  onClick={() => handleMonthChange(ym)}
                                  style={{
                                    ...s.calendarCell,
                                    borderColor: isActive ? "#10B981" : "#E5E7EB",
                                    background:  isActive ? "#ECFDF5" : "#fff",
                                    color:       isActive ? "#059669" : "#374151",
                                    fontWeight:  isActive ? 700 : 400,
                                  }}
                                >
                                  <div>{MONTH_SHORT[mIdx]}</div>
                                  <div style={{ fontSize: 10, color: isActive ? "#059669" : "#94A3B8", marginTop: 2 }}>{cnt}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}

                    {filterMonth !== "all" && (
                      <button onClick={() => handleMonthChange("all")} style={s.calendarClearBtn}>
                        Clear month ✕
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3: Status */}
              <select
                disabled={statusDisabled}
                style={{
                  ...s.select,
                  borderColor: filterStatus !== "all" ? "#F59E0B" : statusDisabled ? "#F1F5F9" : "#E5E7EB",
                  fontWeight:  filterStatus !== "all" ? 600 : 400,
                  cursor:      statusDisabled ? "not-allowed" : "pointer",
                  background:  statusDisabled ? "#F8FAFC" : "#fff",
                  color:       statusDisabled ? "#94A3B8" : "#111827",
                }}
                value={filterStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="all">📋 All Status ({statusCounts.total})</option>
                <option value="has_pending">⏳ Pending Docs ({statusCounts.has_pending})</option>
                <option value="all_done">✅ All Approved ({statusCounts.all_done})</option>
                <option value="has_rejected">❌ Has Rejected ({statusCounts.has_rejected})</option>
                <option value="no_docs">📭 No Docs Yet ({statusCounts.no_docs})</option>
              </select>
            </div>

            {/* Active filter chips */}
            {activeFiltersExist && (
              <div style={s.activeFiltersRow}>
                <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Active:</span>

                {filterCounselor && (
                  <span style={s.filterChipPrimary}>
                    👤 {filterCounselor}
                    <button onClick={() => handleCounselorChange("")} style={s.chipX}>✕</button>
                  </span>
                )}
                {filterMonth !== "all" && (
                  <span style={s.filterChipGreen}>
                    📅 {formatMonthLabel(filterMonth)}
                    <button onClick={() => handleMonthChange("all")} style={s.chipX}>✕</button>
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span style={s.filterChipSecondary}>
                    {filterStatus === "has_pending"  ? "⏳ Pending"
                   : filterStatus === "all_done"     ? "✅ Approved"
                   : filterStatus === "has_rejected" ? "❌ Rejected"
                   :                                   "📭 No Docs"}
                    <button onClick={() => handleStatusChange("all")} style={s.chipX}>✕</button>
                  </span>
                )}
                {searchText && (
                  <span style={s.filterChipSecondary}>
                    🔍 "{searchText}"
                    <button onClick={() => setSearchText("")} style={s.chipX}>✕</button>
                  </span>
                )}
                <button onClick={clearAllFilters} style={s.clearAllChip}>Clear All ✕</button>
              </div>
            )}

            {/* Stats strip — visible when counselor + month both selected */}
            {filterCounselor && filterMonth !== "all" && (
              <div style={s.monthStatStrip}>
                <div style={s.monthStatItem}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#6366F1" }}>{primaryStats.totalAdmissions}</span>
                  <span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Total Admissions</span>
                </div>
                <div style={s.monthStatDivider} />
                <div style={s.monthStatItem}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{primaryStats.totalPendingDocs}</span>
                  <span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Pending Docs</span>
                </div>
                <div style={s.monthStatDivider} />
                <div style={s.monthStatItem}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{primaryStats.verifiedStudents}</span>
                  <span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Fully Verified</span>
                </div>
                <div style={s.monthStatDivider} />
                <div style={s.monthStatItem}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#334155" }}>{primaryStats.totalDocs}</span>
                  <span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Total Docs</span>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ ...s.monthBadge, background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE" }}>
                    👤 {filterCounselor}
                  </span>
                  <span style={{ ...s.monthBadge, background: "#ECFDF5", color: "#059669", border: "1px solid #6EE7B7" }}>
                    📅 {formatMonthLabel(filterMonth)}
                  </span>
                </div>
              </div>
            )}

            <div style={s.resultCount}>
              {filteredAdmissions.length} admission(s) found
              {activeFiltersExist && <span style={{ color: "#6366F1", fontWeight: 600 }}> (filtered)</span>}
            </div>

            {loading ? (
              <div style={s.loading}>Loading Admissions Data...</div>
            ) : filteredAdmissions.length === 0 ? (
              <div style={s.empty}>
                {filterCounselor && filterMonth !== "all"
                  ? `"${filterCounselor}" ke liye ${formatMonthLabel(filterMonth)} mein koi admission nahi mila`
                  : filterCounselor
                  ? `"${filterCounselor}" counselor ke liye koi admission nahi mila`
                  : "Koi admission nahi mila — filters clear karo"}
              </div>
            ) : (
              <div style={s.admissionListStack}>
                {filteredAdmissions.map((adm) => {
                  const docs     = adm.documents || [];
                  const pending  = docs.filter((d) => d.status === "pending").length;
                  const done     = docs.filter((d) => d.status === "done").length;
                  const rejected = docs.filter((d) => d.status === "rejected").length;
                  return (
                    <div key={adm._id} style={s.admListItem} onClick={() => setSelected(adm)}>
                      <div style={s.admListLeft}>
                        <div style={s.admAvatar}>{adm.studentName?.[0]?.toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={s.admName}>{adm.studentName}</div>
                          <div style={s.admMeta}>
                            Counselor: <span style={{ fontWeight: 600, color: "#475569" }}>{adm.counselorName?.trim()}</span>
                          </div>
                          {(adm.admissionDate || adm.createdAt) && (
                            <div style={s.admMonthTag}>
                              📅 {new Date(adm.admissionDate || adm.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={s.admListMid}>
                        <div style={s.admListInfoItem}><span>📚 Course:</span> <strong>{adm.course || "—"}</strong></div>
                        <div style={s.admListInfoItem}><span>📱 Phone:</span> <strong>{adm.phone}</strong></div>
                      </div>

                      <div style={s.admListRight}>
                        <div style={s.docPills}>
                          <span style={{ ...s.pill, background: "#FFF8E1", color: "#F59E0B" }}>⏳ {pending}</span>
                          <span style={{ ...s.pill, background: "#ECFDF5", color: "#10B981" }}>✅ {done}</span>
                          <span style={{ ...s.pill, background: "#FEF2F2", color: "#EF4444" }}>❌ {rejected}</span>
                          <span style={{ ...s.pill, background: "#EEF2FF", color: "#6366F1" }}>📁 {docs.length}</span>
                        </div>
                        {pending > 0 && <span style={s.pendingDot}>{pending}</span>}
                        <span style={s.listArrow}>➔</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        ) : (
          /* ════════════ DETAIL VIEW ════════════ */
          <div>
            <div style={s.pageHeader}>
              <button onClick={() => setSelected(null)} style={s.backBtn}>← Back To List</button>
              <h1 style={s.pageTitle}>{selected.studentName}</h1>
            </div>

            <div style={{ ...s.card, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  ["Course",        selected.course],
                  ["University",    selected.universityName],
                  ["Branch",        selected.branch],
                  ["Email",         selected.email],
                  ["Phone",         selected.phone],
                  ["Counselor",     selected.counselorName],
                  ["Aadhar Number", selected.adhraNumber],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ minWidth: 150 }}>
                    <div style={s.infoLabel}>{k}</div>
                    <div style={s.infoVal}>{v}</div>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* Actions Bar */}
            <div style={s.bulkActions}>
              <span style={s.bulkLabel}>Actions:</span>
              {(selected.documents || []).some((d) => d.status === "pending") && (
                <button
                  onClick={() => verifyAll(selected._id, "done")}
                  style={{ ...s.bulkBtn, background: "#10B981", color: "#fff" }}
                >
                  ✅ Approve All Pending
                </button>
              )}
              <button
                onClick={() => downloadAllDocsAsSinglePDF(selected.studentName, selected.documents)}
                disabled={downloadingPdf}
                style={{
                  ...s.bulkBtn, background: "#6366F1", color: "#fff",
                  opacity: downloadingPdf ? 0.7 : 1,
                  cursor:  downloadingPdf ? "not-allowed" : "pointer",
                }}
              >
                📥 {downloadingPdf ? "Merging..." : "Download Combined PDF"}
              </button>
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>
                Documents ({(selected.documents || []).length})
                {(selected.documents || []).filter((d) => d.status === "pending").length > 0 && (
                  <span style={s.pendingInlineTag}>
                    ⏳ {(selected.documents || []).filter((d) => d.status === "pending").length} pending
                  </span>
                )}
              </h2>

              {(selected.documents || []).length === 0 ? (
                <div style={s.noDocState}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                  <div style={{ fontWeight: 600, color: "#94A3B8", fontSize: 15 }}>Koi document upload nahi hua</div>
                  <div style={{ fontSize: 13, color: "#CBD5E1", marginTop: 4 }}>
                    Is student ne abhi tak koi bhi file submit nahi ki hai.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(selected.documents || []).map((doc) => {
                    const sc = statusColor[doc.status] || statusColor.pending;
                    return (
                      <div key={doc._id} style={s.docRow}>
                        <span style={{ fontSize: 24 }}>{fileIcon(doc.fileType)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={s.docName}>{doc.fileName}</div>
                          <div style={s.docMeta}>
                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString("hi-IN") : ""}
                            {doc.adminRemark ? ` • 💬 ${doc.adminRemark}` : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {doc.fileUrl && (
                            <a href={toSecureUrl(doc.fileUrl)} target="_blank" rel="noreferrer" style={s.viewFileBtn}>
                              👁️ View
                            </a>
                          )}
                          <span style={{ ...s.statusBadge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                            {sc.label}
                          </span>
                          {doc.status !== "done" && (
                            <button
                              onClick={() => {
                                setVerifyModal({ admissionId: selected._id, docId: doc._id, fileName: doc.fileName });
                                setVerifyStatus("done"); setVerifyRemark("");
                              }}
                              style={s.verifyBtn}
                            >
                              Verify
                            </button>
                          )}
                          <button onClick={() => deleteDoc(selected._id, doc._id)} style={s.deleteBtn}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════════════ VERIFY MODAL ════════════ */}
      {verifyModal && (
        <div style={s.modalOverlay} onClick={() => setVerifyModal(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Document Verify Karo</h3>
            <p style={{ margin: "0 0 16px", color: "#94A3B8", fontSize: 13 }}>📄 {verifyModal.fileName}</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {["done", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setVerifyStatus(st)}
                  style={{
                    ...s.statusToggle,
                    background: verifyStatus === st ? (st === "done" ? "#10B981" : "#EF4444") : "#F1F5F9",
                    color:      verifyStatus === st ? "#fff" : "#64748B",
                  }}
                >
                  {st === "done" ? "✅ Approve" : "❌ Reject"}
                </button>
              ))}
            </div>
            {verifyStatus === "rejected" && (
              <div style={{ marginBottom: 16 }}>
                <label style={s.modalLabel}>Rejection Reason *</label>
                <textarea
                  style={s.textarea}
                  rows={3}
                  placeholder="e.g. Image blurry hai..."
                  value={verifyRemark}
                  onChange={(e) => setVerifyRemark(e.target.value)}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setVerifyModal(null)} style={s.cancelBtn}>Cancel</button>
              <button
                onClick={verifyDoc}
                disabled={verifying}
                style={{
                  ...s.confirmBtn,
                  background: verifyStatus === "done" ? "#10B981" : "#EF4444",
                  opacity:    verifying ? 0.7 : 1,
                }}
              >
                {verifying ? "Processing..." : verifyStatus === "done" ? "✅ Approve" : "❌ Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const s = {
  page:                { display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Outfit', sans-serif" },
  mainFull:            { flex: 1, padding: "32px 40px", overflowY: "auto", width: "100%" },
  pageHeader:          { display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  pageTitle:           { fontSize: 24, fontWeight: 800, color: "#1E293B", margin: 0 },
  refreshBtn:          { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginLeft: "auto" },
  backBtn:             { background: "#EEF2FF", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: "#6366F1", fontWeight: 600, fontFamily: "inherit" },

  drillHint:           { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  drillStep:           { fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "4px 12px" },
  drillArrow:          { fontSize: 12, color: "#CBD5E1" },

  filtersRow:          { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  searchInput:         { flex: 2, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit" },
  select:              { flex: 1, minWidth: 160, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" },

  calendarDropdown:    { position: "absolute", top: "110%", left: 0, zIndex: 200, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", padding: "16px", minWidth: 290 },
  calendarHeader:      { fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #F1F5F9" },
  calendarYear:        { fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 6, letterSpacing: 1 },
  calendarGrid:        { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 4 },
  calendarCell:        { padding: "7px 4px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "center" },
  calendarClearBtn:    { marginTop: 10, width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 },

  activeFiltersRow:    { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" },
  filterChipPrimary:   { display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  filterChipGreen:     { display: "inline-flex", alignItems: "center", gap: 6, background: "#ECFDF5", color: "#059669", border: "1px solid #6EE7B7", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  filterChipSecondary: { display: "inline-flex", alignItems: "center", gap: 6, background: "#FFF8E1", color: "#D97706", border: "1px solid #FDE68A", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  chipX:               { background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "inherit", padding: "0 2px", lineHeight: 1, opacity: 0.7 },
  clearAllChip:        { marginLeft: "auto", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },

  resultCount:         { fontSize: 13, color: "#94A3B8", marginBottom: 14 },

  monthStatStrip:      { display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 20px", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  monthStatItem:       { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90, padding: "0 16px" },
  monthStatDivider:    { width: 1, height: 36, background: "#E2E8F0", flexShrink: 0 },
  monthBadge:          { borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600 },

  admissionListStack:  { display: "flex", flexDirection: "column", gap: 10 },
  admListItem:         { background: "#fff", borderRadius: 12, padding: "16px 24px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 },
  admListLeft:         { display: "flex", alignItems: "center", gap: 14, flex: "1", minWidth: 200 },
  admListMid:          { display: "flex", gap: 40, flex: "1.5", flexWrap: "wrap" },
  admListInfoItem:     { fontSize: 14, color: "#64748B" },
  admListRight:        { display: "flex", alignItems: "center", gap: 16 },
  listArrow:           { color: "#94A3B8", fontSize: 14, paddingLeft: 4 },
  admAvatar:           { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 },
  admName:             { fontWeight: 700, fontSize: 16, color: "#1E293B" },
  admMeta:             { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  admMonthTag:         { display: "inline-flex", alignItems: "center", marginTop: 4, background: "#EEF2FF", color: "#6366F1", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 600 },
  pendingDot:          { background: "#F59E0B", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  docPills:            { display: "flex", gap: 6, flexWrap: "wrap" },
  pill:                { padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 600 },

  card:                { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 16 },
  cardTitle:           { fontSize: 17, fontWeight: 700, color: "#1E293B", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 },
  docRow:              { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" },
  docName:             { fontSize: 14, fontWeight: 500, color: "#1E293B" },
  docMeta:             { fontSize: 12, color: "#94A3B8", marginTop: 3 },
  statusBadge:         { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" },
  verifyBtn:           { background: "#6366F1", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", flexShrink: 0 },
  deleteBtn:           { background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", flexShrink: 0 },
  viewFileBtn:         { background: "#F1F5F9", color: "#374151", borderRadius: 8, padding: "5px 10px", fontSize: 12, textDecoration: "none", flexShrink: 0 },
  bulkActions:         { display: "flex", alignItems: "center", gap: 12, background: "#FFF8E1", borderRadius: 10, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap" },
  bulkLabel:           { fontSize: 14, fontWeight: 600, color: "#92400E" },
  bulkBtn:             { border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
  infoLabel:           { fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  infoVal:             { fontSize: 14, color: "#1E293B", fontWeight: 500, marginTop: 2 },
  noDocState:          { textAlign: "center", padding: "36px 20px", background: "#F8FAFC", borderRadius: 10, border: "1.5px dashed #E2E8F0" },
  pendingInlineTag:    { background: "#FFF8E1", color: "#D97706", border: "1px solid #FDE68A", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 },

  modalOverlay:        { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal:               { background: "#fff", borderRadius: 16, padding: 28, width: "90%", maxWidth: 420, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
  modalLabel:          { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  textarea:            { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" },
  statusToggle:        { flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" },
  cancelBtn:           { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit" },
  confirmBtn:          { flex: 2, padding: 10, borderRadius: 10, border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
  empty:               { textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 15 },
  loading:             { textAlign: "center", padding: "40px 20px", color: "#94A3B8" },
  toast:               { position: "fixed", bottom: 24, right: 24, background: "#1E293B", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
};