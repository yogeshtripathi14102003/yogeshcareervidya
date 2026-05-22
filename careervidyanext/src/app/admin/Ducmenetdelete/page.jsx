
"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/utlis/api.js";

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

export default function AdmissionsOnlyPanel() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [verifyModal, setVerifyModal] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState("done");
  const [verifyRemark, setVerifyRemark] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [filterCounselor, setFilterCounselor] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* ── Fetch admissions ── */
  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/ad", { params: { limit: 5000 } });
      if (res.data.success) setAdmissions(res.data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  /* ── Delete Document/Image ── */
  const deleteDoc = async (admissionId, docId) => {
    if (!window.confirm("Kya aap sach me is document/image ko delete karna chahte hain?")) return;
    try {
      const res = await api.delete(`/api/v1/ad/${admissionId}/documents/${docId}`);
      if (res.data.success) {
        showToast("🗑️ Document successfully delete ho gaya");
        fetchAdmissions();
        if (selected && selected._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else {
        showToast("❌ " + res.data.message);
      }
    } catch (e) { 
      showToast("❌ " + (e.response?.data?.message || e.message)); 
    }
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
        showToast(verifyStatus === "done" ? "✅ Document approved!" : "❌ Document rejected");
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
        showToast(`✅ Docs updated successfully`);
        fetchAdmissions();
        if (selected?._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
  };

  const counselors = [...new Set(admissions.map((a) => a.counselorName).filter(Boolean))];

  const monthsList = [
    { value: "0", label: "January" }, { value: "1", label: "February" },
    { value: "2", label: "March" }, { value: "3", label: "April" },
    { value: "4", label: "May" }, { value: "5", label: "June" },
    { value: "6", label: "July" }, { value: "7", label: "August" },
    { value: "8", label: "September" }, { value: "9", label: "October" },
    { value: "10", label: "November" }, { value: "11", label: "December" }
  ];

  const filteredAdmissions = admissions.filter((a) => {
    const matchCounselor = filterCounselor ? a.counselorName === filterCounselor : true;
    const matchSearch = searchText
      ? a.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.phone?.includes(searchText)
      : true;
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "has_pending"  ? (a.documents || []).some((d) => d.status === "pending") :
      filterStatus === "all_done"     ? (a.documents?.length > 0 && (a.documents || []).every((d) => d.status === "done")) :
      filterStatus === "has_rejected" ? (a.documents || []).some((d) => d.status === "rejected") :
      true;

    let matchMonth = true;
    if (filterMonth !== "all") {
      const firstDocDate = a.documents && a.documents[0]?.uploadedAt ? new Date(a.documents[0].uploadedAt) : (a.createdAt ? new Date(a.createdAt) : null);
      if (firstDocDate) {
        matchMonth = firstDocDate.getMonth().toString() === filterMonth;
      } else {
        matchMonth = false;
      }
    }
    return matchCounselor && matchSearch && matchStatus && matchMonth;
  });

  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      <div style={s.mainFull}>
        {/* ── LIST VIEW ── */}
        {!selected ? (
          <div>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>👨‍🎓 Admissions Management</h1>
              <button onClick={fetchAdmissions} style={s.refreshBtn}>🔄 Refresh</button>
              <button onClick={() => { setFilterCounselor(""); setFilterStatus("all"); setFilterMonth("all"); setSearchText(""); }} style={s.clearBtn}>
                Clear Filters
              </button>
            </div>

            <div style={s.filtersRow}>
              <input style={s.searchInput} placeholder="🔍 Student name, email, phone..."
                value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              <select style={s.select} value={filterCounselor} onChange={(e) => setFilterCounselor(e.target.value)}>
                <option value="">All Counselors</option>
                {counselors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select style={s.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="has_pending">Has Pending Docs</option>
                <option value="all_done">All Approved</option>
                <option value="has_rejected">Has Rejected</option>
              </select>
              <select style={s.select} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                <option value="all">All Months</option>
                {monthsList.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <div style={s.resultCount}>{filteredAdmissions.length} admission(s) found</div>

            {loading ? (
              <div style={s.loading}>Loading Admissions Data...</div>
            ) : filteredAdmissions.length === 0 ? (
              <div style={s.empty}>Koi admission nahi mila</div>
            ) : (
              <div style={s.admissionListStack}>
                {filteredAdmissions.map((adm) => {
                  const docs = adm.documents || [];
                  const pending  = docs.filter((d) => d.status === "pending").length;
                  const done     = docs.filter((d) => d.status === "done").length;
                  const rejected = docs.filter((d) => d.status === "rejected").length;
                  return (
                    <div key={adm._id} style={s.admListItem} onClick={() => setSelected(adm)}>
                      <div style={s.admListLeft}>
                        <div style={s.admAvatar}>{adm.studentName?.[0]?.toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={s.admName}>{adm.studentName}</div>
                          <div style={s.admMeta}>Counselor: <span style={{fontWeight:600, color: "#475569"}}>{adm.counselorName}</span></div>
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
          /* ── DETAIL VIEW WITH ADHAR AND DELETE IMAGE ── */
          <div>
            <div style={s.pageHeader}>
              <button onClick={() => setSelected(null)} style={s.backBtn}>← Back To List</button>
              <h1 style={s.pageTitle}>{selected.studentName}</h1>
            </div>

            <div style={{ ...s.card, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  ["Course", selected.course],
                  ["University", selected.universityName],
                  ["Branch", selected.branch],
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Counselor", selected.counselorName],
                  ["Aadhar Number", selected.adhraNumber],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ minWidth: 150 }}>
                    <div style={s.infoLabel}>{k}</div>
                    <div style={s.infoVal}>{v}</div>
                  </div>
                ) : null)}
              </div>
            </div>

            {(selected.documents || []).some((d) => d.status === "pending") && (
              <div style={s.bulkActions}>
                <span style={s.bulkLabel}>Bulk Action:</span>
                <button onClick={() => verifyAll(selected._id, "done")}
                  style={{ ...s.bulkBtn, background: "#10B981", color: "#fff" }}>
                  ✅ Approve All Pending
                </button>
              </div>
            )}

            <div style={s.card}>
              <h2 style={s.cardTitle}>Documents ({(selected.documents || []).length})</h2>
              {(selected.documents || []).length === 0 ? (
                <div style={s.empty}>Koi document nahi hai</div>
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
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={s.viewFileBtn}>
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
                          {/* Image/Document Delete Button */}
                          <button
                            onClick={() => deleteDoc(selected._id, doc._id)}
                            style={s.deleteBtn}
                          >
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

      {/* ── VERIFY MODAL ── */}
      {verifyModal && (
        <div style={s.modalOverlay} onClick={() => setVerifyModal(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Document Verify Karo</h3>
            <p style={{ margin: "0 0 16px", color: "#94A3B8", fontSize: 13 }}>📄 {verifyModal.fileName}</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {["done", "rejected"].map((st) => (
                <button key={st} onClick={() => setVerifyStatus(st)}
                  style={{ ...s.statusToggle, background: verifyStatus === st ? (st === "done" ? "#10B981" : "#EF4444") : "#F1F5F9", color: verifyStatus === st ? "#fff" : "#64748B" }}>
                  {st === "done" ? "✅ Approve" : "❌ Reject"}
                </button>
              ))}
            </div>
            {verifyStatus === "rejected" && (
              <div style={{ marginBottom: 16 }}>
                <label style={s.modalLabel}>Rejection Reason *</label>
                <textarea style={s.textarea} rows={3}
                  placeholder="e.g. Image blurry hai..."
                  value={verifyRemark} onChange={(e) => setVerifyRemark(e.target.value)} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setVerifyModal(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={verifyDoc} disabled={verifying}
                style={{ ...s.confirmBtn, background: verifyStatus === "done" ? "#10B981" : "#EF4444", opacity: verifying ? 0.7 : 1 }}>
                {verifying ? "Processing..." : verifyStatus === "done" ? "✅ Approve" : "❌ Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:            { display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Outfit', sans-serif" },
  mainFull:        { flex: 1, padding: "32px 40px", overflowY: "auto", width: "100%" },
  pageHeader:      { display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  pageTitle:       { fontSize: 24, fontWeight: 800, color: "#1E293B", margin: 0 },
  refreshBtn:      { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginLeft: "auto" },
  clearBtn:        { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" },
  backBtn:         { background: "#EEF2FF", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: "#6366F1", fontWeight: 600, fontFamily: "inherit" },
  card:            { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 16 },
  cardTitle:       { fontSize: 17, fontWeight: 700, color: "#1E293B", margin: "0 0 16px" },
  filtersRow:      { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  searchInput:     { flex: 2, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit" },
  select:          { flex: 1, minWidth: 160, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" },
  resultCount:     { fontSize: 13, color: "#94A3B8", marginBottom: 14 },
  
  admissionListStack: { display: "flex", flexDirection: "column", gap: 10 },
  admListItem:     { background: "#fff", borderRadius: 12, padding: "16px 24px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 },
  admListLeft:     { display: "flex", alignItems: "center", gap: 14, flex: "1", minWidth: 200 },
  admListMid:      { display: "flex", gap: 40, flex: "1.5", flexWrap: "wrap" },
  admListInfoItem: { fontSize: 14, color: "#64748B" },
  admListRight:    { display: "flex", alignItems: "center", gap: 16 },
  listArrow:       { color: "#94A3B8", fontSize: 14, paddingLeft: 4 },

  admAvatar:       { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 },
  admName:         { fontWeight: 700, fontSize: 16, color: "#1E293B" },
  admMeta:         { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  pendingDot:      { background: "#F59E0B", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  docPills:        { display: "flex", gap: 6, flexWrap: "wrap" },
  pill:            { padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  docRow:          { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" },
  docName:         { fontSize: 14, fontWeight: 500, color: "#1E293B" },
  docMeta:         { fontSize: 12, color: "#94A3B8", marginTop: 3 },
  statusBadge:     { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" },
  verifyBtn:       { background: "#6366F1", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", flexShrink: 0 },
  deleteBtn:       { background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", flexShrink: 0 },
  viewFileBtn:     { background: "#F1F5F9", color: "#374151", borderRadius: 8, padding: "5px 10px", fontSize: 12, textDecoration: "none", flexShrink: 0 },
  bulkActions:     { display: "flex", alignItems: "center", gap: 12, background: "#FFF8E1", borderRadius: 10, padding: "12px 16px", marginBottom: 16 },
  bulkLabel:       { fontSize: 14, fontWeight: 600, color: "#92400E" },
  bulkBtn:         { border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" },
  infoLabel:       { fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  infoVal:         { fontSize: 14, color: "#1E293B", fontWeight: 500, marginTop: 2 },
  empty:           { textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 15 },
  loading:         { textAlign: "center", padding: "40px 20px", color: "#94A3B8" },
  toast:           { position: "fixed", bottom: 24, right: 24, background: "#1E293B", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  modalOverlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal:           { background: "#fff", borderRadius: 16, padding: 28, width: "90%", maxWidth: 420, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
  modalLabel:      { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  textarea:        { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" },
  statusToggle:    { flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" },
  cancelBtn:       { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit" },
  confirmBtn:      { flex: 2, padding: 10, borderRadius: 10, border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};