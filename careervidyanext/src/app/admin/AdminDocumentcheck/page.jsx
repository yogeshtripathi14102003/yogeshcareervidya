
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

export default function AdminPanel() {
  const [tab, setTab] = useState("dashboard");
  const [admissions, setAdmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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

  /* ── Fetch notifications ── */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/ad/notifications");
      if (res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchAdmissions();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchAdmissions, fetchNotifications]);

  /* ── Mark notification read ── */
  const markRead = async (id) => {
    await api.put(`/api/v1/ad/notifications/${id}/read`);
    fetchNotifications();
  };

  /* ── Mark all read ── */
  const markAllRead = async () => {
    await api.put("/api/v1/ad/notifications/read-all");
    fetchNotifications();
    showToast("✅ Saari notifications read mark ho gayi");
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
        showToast(verifyStatus === "done" ? "✅ Document approved!" : "❌ Document rejected, counselor ko notify kiya");
        setVerifyModal(null); setVerifyRemark(""); setVerifyStatus("done");
        fetchAdmissions(); fetchNotifications();
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
        showToast(`✅ ${res.data.updatedCount} docs ${status === "done" ? "approved" : "rejected"}`);
        fetchAdmissions(); fetchNotifications();
        if (selected?._id === admissionId) {
          const r2 = await api.get(`/api/v1/ad/${admissionId}`);
          if (r2.data.success) setSelected(r2.data.data);
        }
      } else showToast("❌ " + res.data.message);
    } catch (e) { showToast("❌ " + (e.response?.data?.message || e.message)); }
  };

  /* ── Derived data ── */
  const counselors = [...new Set(admissions.map((a) => a.counselorName).filter(Boolean))];

  const monthsList = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" }
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
      filterStatus === "not_uploaded" ? (!a.documents || a.documents.length === 0) :
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

  // Stats Calculations
  const totalAdmissions = admissions.length;
  const pendingDocs   = admissions.reduce((s, a) => s + (a.documents?.filter((d) => d.status === "pending").length || 0), 0);
  const totalNotUploaded = admissions.filter((a) => !a.documents || a.documents.length === 0).length;
  
  // न्यू लॉजिक: छात्र जिसके पास कम से कम 1 डॉक्यूमेंट हो और सारे डाक्यूमेंट्स 'done' हों
  const verifiedStudents = admissions.filter((a) => a.documents?.length > 0 && a.documents.every((d) => d.status === "done")).length;

  const counselorStats = counselors.map((name) => {
    const ca = admissions.filter((a) => a.counselorName === name);
    const docs = ca.flatMap((a) => a.documents || []);
    const notUploadedCount = ca.filter((a) => !a.documents || a.documents.length === 0).length;
    return {
      name,
      admissions: ca.length,
      totalDocs: docs.length,
      pending:  docs.filter((d) => d.status === "pending").length,
      done:     docs.filter((d) => d.status === "done").length,
      rejected: docs.filter((d) => d.status === "rejected").length,
      notUploaded: notUploadedCount,
    };
  });

  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={{ fontSize: 28 }}>🛡️</span>
          <div>
            <div style={s.sidebarTitle}>Admin Panel</div>
            <div style={s.sidebarSub}>DocVerify System</div>
          </div>
        </div>
        {[
          { id: "dashboard",     icon: "📊", label: "Dashboard" },
          { id: "admissions",    icon: "👨‍🎓", label: "Admissions" },
          { id: "notifications", icon: "🔔", label: "Notifications", badge: unreadCount },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id); setSelected(null); }}
            style={{ ...s.navBtn, ...(tab === item.id ? s.navBtnActive : {}) }}
          >
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge > 0 && <span style={s.badge}>{item.badge}</span>}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={s.main}>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>Dashboard</h1>
              <button onClick={fetchAdmissions} style={s.refreshBtn}>🔄 Refresh</button>
            </div>
            
            {/* Stats Grid - Total Documents Replaced with Verified Students */}
            <div style={s.statsGrid}>
              {[
                { label: "Total Admissions",  val: totalAdmissions,  color: "#6366F1", icon: "👨‍🎓" },
                { label: "Pending Review",    val: pendingDocs,      color: "#F59E0B", icon: "⏳" },
                { label: "Not Uploaded",      val: totalNotUploaded, color: "#EF4444", icon: "⚠️" },
                { label: "Verified Students", val: verifiedStudents, color: "#10B981", icon: "✅" },
              ].map((st) => (
                <div key={st.label} style={{ ...s.statCard, borderTop: `4px solid ${st.color}` }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{st.icon}</div>
                  <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>Counselor-wise Summary</h2>
              {counselorStats.length === 0 ? (
                <div style={s.empty}>Koi data nahi</div>
              ) : (
                <div style={s.tableWrap}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        {["Counselor", "Admissions", "Total Docs", "Pending", "Approved", "Rejected", "Not Uploaded", "Action"].map((h) => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {counselorStats.map((cs) => (
                        <tr key={cs.name} style={s.tr}>
                          <td style={s.td}>
                            <div style={s.counselorCell}>
                              <div style={s.counselorAvatar}>{cs.name[0]?.toUpperCase()}</div>
                              <span style={{ fontWeight: 600 }}>{cs.name}</span>
                              {cs.notUploaded > 0 && (
                                <span style={s.missingBadge} title={`${cs.notUploaded} Students haven't uploaded documents`}>
                                  ⚠️ Missing {cs.notUploaded}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ ...s.td, textAlign: "center" }}>{cs.admissions}</td>
                          <td style={{ ...s.td, textAlign: "center", fontWeight: 600 }}>{cs.totalDocs}</td>
                          <td style={{ ...s.td, textAlign: "center" }}><span style={{ color: "#F59E0B", fontWeight: 600 }}>{cs.pending}</span></td>
                          <td style={{ ...s.td, textAlign: "center" }}><span style={{ color: "#10B981", fontWeight: 600 }}>{cs.done}</span></td>
                          <td style={{ ...s.td, textAlign: "center" }}><span style={{ color: "#EF4444", fontWeight: 600 }}>{cs.rejected}</span></td>
                          <td style={{ ...s.td, textAlign: "center" }}>
                            <span style={{ color: cs.notUploaded > 0 ? "#EF4444" : "#64748B", fontWeight: 600 }}>
                              {cs.notUploaded}
                            </span>
                          </td>
                          <td style={s.td}>
                            <button onClick={() => { setFilterCounselor(cs.name); setFilterStatus("all"); setFilterMonth("all"); setSearchText(""); setTab("admissions"); setSelected(null); }} style={s.viewBtn}>
                              View →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADMISSIONS LIST TAB ── */}
        {tab === "admissions" && !selected && (
          <div>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>Admissions</h1>
              <button onClick={() => { setFilterCounselor(""); setFilterStatus("all"); setFilterMonth("all"); setSearchText(""); }} style={s.refreshBtn}>
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
                <option value="not_uploaded">No Documents Uploaded</option>
              </select>
              <select style={s.select} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                <option value="all">All Months</option>
                {monthsList.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div style={s.resultCount}>{filteredAdmissions.length} admission(s) found</div>
            {loading ? (
              <div style={s.loading}>Loading...</div>
            ) : filteredAdmissions.length === 0 ? (
              <div style={s.empty}>Koi admission nahi mila</div>
            ) : (
              <div style={s.admissionListStack}>
                {filteredAdmissions.map((adm) => {
                  const docs = adm.documents || [];
                  const pending  = docs.filter((d) => d.status === "pending").length;
                  const done     = docs.filter((d) => d.status === "done").length;
                  const rejected = docs.filter((d) => d.status === "rejected").length;
                  const isMissing = docs.length === 0;

                  return (
                    <div key={adm._id} style={{ ...s.admListItem, borderLeft: isMissing ? "4px solid #EF4444" : "4px solid transparent" }} onClick={() => setSelected(adm)}>
                      <div style={s.admListLeft}>
                        <div style={s.admAvatar}>{adm.studentName?.[0]?.toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={s.admName}>
                            {adm.studentName} 
                            {isMissing && <span style={{ color: "#EF4444", fontSize: "12px", marginLeft: "8px", fontWeight: "normal" }}>(No Docs)</span>}
                          </div>
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
                          <span style={{ ...s.pill, background: isMissing ? "#FEF2F2" : "#EEF2FF", color: isMissing ? "#EF4444" : "#6366F1", fontWeight: isMissing ? "bold" : "normal" }}>📁 {docs.length}</span>
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
        )}

        {/* ── ADMISSION DETAIL TAB ── */}
        {tab === "admissions" && selected && (
          <div>
            <div style={s.pageHeader}>
              <button onClick={() => setSelected(null)} style={s.backBtn}>← Back</button>
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
                  ["Aadhar Status", selected.adhraNumber ? "Provided" : "Not Provided"], // Handle metadata logically without revealing specific dynamic IDs
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
                <div style={{ ...s.empty, color: "#EF4444", fontWeight: "bold" }}>⚠️ Is student ne abhi tak koi document upload nahi kiya hai.</div>
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {tab === "notifications" && (
          <div>
            <div style={s.pageHeader}>
              <h1 style={s.pageTitle}>
                Notifications {unreadCount > 0 && <span style={s.badge}>{unreadCount}</span>}
              </h1>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={s.refreshBtn}>✅ Mark All Read</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={s.empty}>Koi notification nahi hai</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    style={{ ...s.notifCard, background: n.isRead ? "#fff" : "#F0F4FF", borderLeft: `4px solid ${n.type === "doc_approved" ? "#10B981" : n.type === "doc_rejected" ? "#EF4444" : "#6366F1"}` }}
                    onClick={() => !n.isRead && markRead(n._id)}
                  >
                    <div style={s.notifIcon}>
                      {n.type === "doc_approved" ? "✅" : n.type === "doc_rejected" ? "❌" : "📄"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={s.notifMsg}>{n.message}</div>
                      <div style={s.notifMeta}>
                        {n.counselorName} • {new Date(n.createdAt).toLocaleString("hi-IN")}
                        {!n.isRead && <span style={s.unreadDot}> • New</span>}
                      </div>
                    </div>
                    {!n.isRead && <div style={s.notifUnreadBall} />}
                  </div>
                ))}
              </div>
            )}
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
                <label style={s.modalLabel}>Rejection Reason * (counselor ko bheja jaayega)</label>
                <textarea style={s.textarea} rows={3}
                  placeholder="e.g. Card blurry hai, clear photo upload karo"
                  value={verifyRemark} onChange={(e) => setVerifyRemark(e.target.value)} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setVerifyModal(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={verifyDoc} disabled={verifying}
                style={{ ...s.confirmBtn, background: verifyStatus === "done" ? "#10B981" : "#EF4444", opacity: verifying ? 0.7 : 1 }}>
                {verifying ? "Processing..." : verifyStatus === "done" ? "✅ Approve" : "❌ Reject & Notify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Complete CSS Styles Objects
const s = {
  page:                 { display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Outfit', sans-serif" },
  sidebar:              { width: 230, background: "#1E1B4B", display: "flex", flexDirection: "column", gap: 4, padding: "24px 12px", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  sidebarLogo:          { display: "flex", alignItems: "center", gap: 10, padding: "0 8px 24px" },
  sidebarTitle:         { color: "#fff", fontWeight: 700, fontSize: 16 },
  sidebarSub:           { color: "#A5B4FC", fontSize: 11 },
  navBtn:               { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "none", border: "none", color: "#A5B4FC", fontSize: 14, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left", transition: "all 0.2s ease" },
  navBtnActive:         { background: "#312E81", color: "#fff" },
  badge:                { background: "#EF4444", color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 },
  main:                 { flex: 1, padding: "28px 32px", overflowY: "auto", maxWidth: "calc(100% - 230px)" },
  pageHeader:           { display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  pageTitle:            { fontSize: 22, fontWeight: 800, color: "#1E293B", margin: 0, display: "flex", alignItems: "center", gap: 8 },
  refreshBtn:           { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginLeft: "auto", transition: "all 0.2s ease" },
  backBtn:              { background: "#EEF2FF", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, color: "#6366F1", fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s ease" },
  statsGrid:            { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard:             { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  statVal:              { fontSize: 32, fontWeight: 800 },
  statLabel:            { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  card:                 { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 16 },
  cardTitle:            { fontSize: 17, fontWeight: 700, color: "#1E293B", margin: "0 0 16px" },
  tableWrap:            { overflowX: "auto" },
  table:                { width: "100%", borderCollapse: "collapse" },
  th:                   { textAlign: "left", padding: "10px 12px", background: "#F8FAFC", fontSize: 12, fontWeight: 700, color: "#64748B", borderBottom: "2px solid #E5E7EB", whiteSpace: "nowrap" },
  tr:                   { borderBottom: "1px solid #F1F5F9", cursor: "pointer", transition: "background-color 0.15s ease" },
  td:                   { padding: "12px 12px", fontSize: 14, color: "#374151" },
  counselorCell:        { display: "flex", alignItems: "center", gap: 8 },
  counselorAvatar:      { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  missingBadge:         { background: "#EF4444", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", marginLeft: "8px" },
  viewBtn:              { background: "#EEF2FF", color: "#6366F1", border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s ease" },
  filtersRow:           { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  searchInput:          { flex: 2, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "all 0.2s ease" },
  select:               { flex: 1, minWidth: 160, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff", transition: "all 0.2s ease" },
  resultCount:          { fontSize: 13, color: "#94A3B8", marginBottom: 14 },
  admissionListStack:   { display: "flex", flexDirection: "column", gap: 10 },
  admListItem:          { background: "#fff", borderRadius: 12, padding: "14px 20px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, transition: "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease" },
  admListLeft:          { display: "flex", alignItems: "center", gap: 14, flex: "1", minWidth: 200 },
  admListMid:           { display: "flex", gap: 30, flex: "1.5", flexWrap: "wrap" },
  admListInfoItem:      { fontSize: 13, color: "#64748B" },
  admListRight:         { display: "flex", alignItems: "center", gap: 16 },
  listArrow:            { color: "#94A3B8", fontSize: 14, paddingLeft: 4 },
  admAvatar:            { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 },
  admName:              { fontWeight: 700, fontSize: 15, color: "#1E293B" },
  admMeta:              { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  pendingDot:           { background: "#F59E0B", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  docPills:             { display: "flex", gap: 6, flexWrap: "wrap" },
  pill:                 { padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  docRow:               { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" },
  docName:              { fontSize: 14, fontWeight: 500, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  docMeta:              { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  viewFileBtn:          { padding: "6px 12px", background: "#fff", border: "1px solid #CBD5E1", borderRadius: 8, color: "#475569", fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 },
  statusBadge:          { padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  verifyBtn:            { padding: "6px 14px", background: "#6366F1", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  bulkActions:          { background: "#F0FDF4", border: "1px solid #DCFCE7", borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  bulkLabel:            { fontSize: 14, fontWeight: 600, color: "#166534" },
  bulkBtn:              { border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  infoLabel:            { fontSize: 12, color: "#94A3B8", fontWeight: 500, marginBottom: 2 },
  infoVal:              { fontSize: 14, fontWeight: 600, color: "#334155" },
  notifCard:            { display: "flex", gap: 14, padding: 16, borderRadius: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.02)", cursor: "pointer" },
  notifIcon:            { fontSize: 20, display: "flex", alignItems: "center" },
  notifMsg:             { fontSize: 14, color: "#1E293B", fontWeight: 500 },
  notifMeta:            { fontSize: 12, color: "#94A3B8", marginTop: 4 },
  unreadDot:            { color: "#6366F1", fontWeight: 700 },
  notifUnreadBall:      { width: 8, height: 8, background: "#6366F1", borderRadius: "50%", alignSelf: "center" },
  modalOverlay:         { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal:                { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 440, padding: 24, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  statusToggle:         { flex: 1, border: "none", padding: "10px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
  modalLabel:           { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 },
  textarea:             { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0", outline: "none", fontSize: 14, fontFamily: "inherit", resize: "none" },
  cancelBtn:            { flex: 1, background: "#F1F5F9", color: "#64748B", border: "none", padding: "10px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" },
  confirmBtn:           { flex: 2, color: "#fff", border: "none", padding: "10px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" },
  loading:              { textAlign: "center", padding: 40, color: "#64748B", fontSize: 14 },
  empty:                { textAlign: "center", padding: 32, color: "#94A3B8", fontSize: 14 },
  toast:                { position: "fixed", bottom: 24, right: 24, background: "#1E293B", color: "#fff", padding: "12px 20px", borderRadius: 10, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 1100, fontSize: 14, fontWeight: 500 }
};