  "use client";
  import { useState, useRef, useCallback, useEffect } from "react";
  import api from "@/utlis/api.js";

  const statusColor = {
    pending:  { bg: "#FFF8E1", text: "#F59E0B", border: "#FDE68A", label: "Pending" },
    done:     { bg: "#ECFDF5", text: "#10B981", border: "#6EE7B7", label: "Approved ✓" },
    rejected: { bg: "#FEF2F2", text: "#EF4444", border: "#FECACA", label: "Rejected ✗" },
  };

  const fileIcon = (type) => {
    if (!type) return "📎";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("doc")) return "📝";
    return "🖼️";
  };

  const isPreviewable = (fileType, fileName) => {
    if (!fileType && !fileName) return false;
    const ext = fileName?.split(".").pop()?.toLowerCase();
    return (
      fileType?.includes("image") ||
      fileType?.includes("pdf") ||
      ["jpg", "jpeg", "png", "webp", "pdf"].includes(ext)
    );
  };

  const isPdf = (fileType, fileName) => {
    return fileType?.includes("pdf") || fileName?.toLowerCase().endsWith(".pdf");
  };

  const isImage = (fileType, fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    return fileType?.includes("image") || ["jpg", "jpeg", "png", "webp"].includes(ext);
  };

  const getCounselorInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        id:   user._id || user.id || null,
        name: user.name || user.counselorName || null,
      };
    } catch {
      return { id: null, name: null };
    }
  };

  const getCounselorParams = (extra = {}) => {
    const { name: counselorName } = getCounselorInfo();
    const params = { ...extra };
    if (counselorName) params.counselorName = counselorName;
    return params;
  };

  export default function CounselorPortal() {
    const [step, setStep]               = useState(1);
    const [aadhar, setAadhar]           = useState("");
    const [studentName, setStudentName] = useState("");
    const [admission, setAdmission]     = useState(null);
    const [docs, setDocs]               = useState([]);
    const [files, setFiles]             = useState([]);
    const [dragging, setDragging]       = useState(false);
    const [loading, setLoading]         = useState(false);
    const [uploading, setUploading]     = useState(false);
    const [error, setError]             = useState("");
    const [success, setSuccess]         = useState("");
    const [previewDoc, setPreviewDoc]   = useState(null);
    const [pdfError, setPdfError]       = useState(false);

    const [allStudents, setAllStudents] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [filterTab, setFilterTab]     = useState("all");
    const [monthFilter, setMonthFilter] = useState("");

    const fileRef = useRef();

    useEffect(() => { fetchAllStudents(); }, []);

    const fetchAllStudents = async () => {
      setListLoading(true);
      try {
        const params = getCounselorParams({ limit: 5000 });
        const res = await api.get("/api/v1/ad", { params });
        if (res.data?.success) setAllStudents(res.data.data || []);
      } catch (e) {
        console.error("Error fetching student list:", e);
      }
      setListLoading(false);
    };

    const reset = () => {
      setStep(1); setAadhar(""); setStudentName("");
      setAdmission(null); setDocs([]); setFiles([]);
      setError(""); setSuccess(""); setPreviewDoc(null); setPdfError(false);
      fetchAllStudents();
    };

    const handleSelectStudent = (student) => {
      setError(""); setSuccess("");
      setAdmission(student);
      setDocs(student.documents || []);
      setStep(2);
    };

   const searchStudent = async () => {
  if (!aadhar.trim() && !studentName.trim()) {
    setError(" fill the  Aadhar number or name  ");
    return;
  }
  setLoading(true); setError("");
  try {
    const params = getCounselorParams({ limit: 5000 });
    const res = await api.get("/api/v1/ad", { params });
    const data = res.data;
    if (!data.success) throw new Error(data.message);

    const found = data.data.find((a) => {
      const aadharMatch = aadhar.trim()
        ? a.adhraNumber?.toString().trim() === aadhar.trim()
        : false;
      const nameMatch = studentName.trim()
        ? a.studentName?.toLowerCase().trim() === studentName.toLowerCase().trim()
        : false;
      return aadharMatch || nameMatch;
    });

    if (!found) {
      setError("no student found in this record please  add currect information.");
      setLoading(false); return;
    }
    setAdmission(found);
    setDocs(found.documents || []);
    setStep(2);
  } catch (e) {
    setError(e.response?.data?.message || e.message);
  }
  setLoading(false);
};

    const onDrop = useCallback((e) => {
      e.preventDefault(); setDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    }, []);

    const addFiles = (newFiles) => {
      const allowed = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];
      const valid = newFiles.filter((f) =>
        allowed.includes(f.name.split(".").pop().toLowerCase())
      );
      if (valid.length !== newFiles.length)
        setError("Kuch files invalid hain — sirf PDF, DOC, JPG, PNG allowed");
      else setError("");
      setFiles((prev) => [...prev, ...valid]);
    };

    const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

    const uploadDocs = async () => {
      if (!files.length) { setError("Koi file select nahi ki"); return; }
      setUploading(true); setError(""); setSuccess("");
      const fd = new FormData();
      files.forEach((f) => fd.append("documents", f));
      try {
        const res = await api.post(`/api/v1/ad/${admission._id}/documents`, fd);
        const data = res.data;
        if (!data.success) throw new Error(data.message);
        setDocs(data.allDocuments || []);
        setFiles([]);
        setSuccess(`✅ ${data.uploadedDocuments?.length || files.length} documents successfully uploaded.`);
        setStep(3);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      }
      setUploading(false);
    };

    const openPreview = (doc) => {
      setPdfError(false);
      setPreviewDoc(doc);
      console.log("Preview fileUrl:", doc.fileUrl);
    };

    const summary = {
      total:    docs.length,
      pending:  docs.filter((d) => d.status === "pending").length,
      done:     docs.filter((d) => d.status === "done").length,
      rejected: docs.filter((d) => d.status === "rejected").length,
    };

    const rejectedDocs = docs.filter((d) => d.status === "rejected");

    const getStudentDocStatus = (student) => {
      const sDocs = student.documents || [];
      if (sDocs.length === 0)
        return { label: "No Docs", color: "#64748B", bg: "#F1F5F9", type: "unverified" };
      if (sDocs.some((d) => d.status === "rejected"))
        return { label: "Action Required ⚠️", color: "#EF4444", bg: "#FEF2F2", type: "rejected" };
      if (sDocs.some((d) => d.status === "pending"))
        return { label: "Pending Admin", color: "#F59E0B", bg: "#FFF8E1", type: "unverified" };
      if (sDocs.every((d) => d.status === "done"))
        return { label: "Verified ✓", color: "#10B981", bg: "#ECFDF5", type: "verified" };
      return { label: "Partial", color: "#6366F1", bg: "#EEF2FF", type: "unverified" };
    };

    const filteredStudents = allStudents.filter((student) => {
      const s = getStudentDocStatus(student);

      // Tab filter
      if (filterTab === "verified"       && s.type !== "verified")  return false;
      if (filterTab === "unverified"     && s.type !== "unverified") return false;
      if (filterTab === "actionRequired" && s.type !== "rejected")  return false;

      // Month filter — koi bhi document us month mein upload hua ho
      if (monthFilter) {
        const studentDocs = student.documents || [];
        const hasDocInMonth = studentDocs.some((d) => {
          if (!d.uploadedAt) return false;
          const date = new Date(d.uploadedAt);
          const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          return ym === monthFilter;
        });
        if (!hasDocInMonth) return false;
      }

      return true;
    });

    /* ── Doc Item renderer ── */
    const renderDocItem = (doc) => {
      const sc         = statusColor[doc.status] || statusColor.pending;
      const isRejected = doc.status === "rejected";
      const canPreview = isPreviewable(doc.fileType, doc.fileName) && doc.fileUrl;

    return (
      <div
        key={doc._id}
        style={{
          ...styles.docItem,
          border:     isRejected ? "1.5px dashed #EF4444" : "1px solid #F1F5F9",
          background: isRejected ? "#FFF5F5" : "#F8FAFC",
        }}
      >
        <span style={styles.docFileIcon}>{fileIcon(doc.fileType)}</span>
        <div style={styles.docInfo}>
          <div style={{ ...styles.docName, fontWeight: isRejected ? "700" : "500" }}>
            {doc.fileName} {isRejected && "⚠️"}
          </div>
          <div style={styles.docDate}>
            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("hi-IN") : ""}
          </div>
          {doc.adminRemark && (
            <div style={{ ...styles.remark, color: isRejected ? "#DC2626" : "#EF4444" }}>
              <strong>Reason:</strong> {doc.adminRemark}
            </div>
          )}
        </div>

        {canPreview && (
          <button onClick={() => openPreview(doc)} style={styles.previewBtn}>
            👁 Preview
          </button>
        )}

        <span style={{
          ...styles.statusBadge,
          background: sc.bg,
          color:      sc.text,
          border:     `1px solid ${sc.border}`,
        }}>
          {sc.label}
        </span>
      </div>
    );
  };

  /* ── PDF Preview content ── */
  const renderPdfPreview = (url) => {
    if (pdfError) {
      return (
        <div style={{ textAlign: "center", padding: "30px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <p style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>
            PDF directly preview nahi ho pa raha. Neeche options try karo:
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.altBtn}
            >
              🔍 Google Docs mein dekho
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.altBtn}
            >
              ↗ New tab mein kholo
            </a>
          </div>
        </div>
      );
    }

    return (
      <iframe
        key={pdfError ? "error" : "normal"}
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        title="PDF Preview"
        style={{ width: "100%", height: "70vh", border: "none", borderRadius: 8 }}
        onError={() => setPdfError(true)}
      />
    );
  };

  // Helper: format "YYYY-MM" to "Month YYYY" for display
  const formatMonthLabel = (ym) => {
    if (!ym) return "";
    const [y, m] = ym.split("-");
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    return `${monthNames[parseInt(m, 10) - 1]} ${y}`;
  };

  return (
    <div style={styles.page}>

      {/* ── PREVIEW MODAL ── */}
      {previewDoc && (
        <div style={styles.modalOverlay} onClick={() => setPreviewDoc(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 18 }}>{fileIcon(previewDoc.fileType)}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {previewDoc.fileName}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.modalDownloadSmall}
                >
                  ⬇ Download
                </a>
                <button onClick={() => setPreviewDoc(null)} style={styles.modalClose}>✕</button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {isImage(previewDoc.fileType, previewDoc.fileName) ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.fileName}
                  style={{ maxWidth: "100%", maxHeight: "75vh", borderRadius: 8, objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : isPdf(previewDoc.fileType, previewDoc.fileName) ? (
                renderPdfPreview(previewDoc.fileUrl)
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📎</div>
                  <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 16 }}>
                    Is file type ka preview available nahi hai
                  </p>
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.altBtn}
                  >
                    ↗ File open karo
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>📋</span>
            <div>
              <div style={styles.logoTitle}>DocPortal</div>
              <div style={styles.logoSub}>Counselor Panel</div>
            </div>
          </div>
          {admission && (
            <button onClick={reset} style={styles.logoutBtn}>← Back to Dashboard</button>
          )}
        </div>
      </div>

      <div style={styles.container}>
        {/* Steps */}
        <div style={styles.stepsRow}>
          {["Student Search & List", "Upload Documents", "Status"].map((s, i) => (
            <div key={i} style={styles.stepWrap}>
              <div style={{
                ...styles.stepCircle,
                background: step > i + 1 ? "#10B981" : step === i + 1 ? "#6366F1" : "#E5E7EB",
                color: step >= i + 1 ? "#fff" : "#9CA3AF",
              }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, color: step === i + 1 ? "#6366F1" : "#9CA3AF" }}>{s}</span>
              {i < 2 && <div style={{ ...styles.stepLine, background: step > i + 1 ? "#10B981" : "#E5E7EB" }} />}
            </div>
          ))}
        </div>

        {error   && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {step > 1 && rejectedDocs.length > 0 && (
          <div style={styles.notificationBanner}>
            <div style={{ fontSize: 20 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 14 }}>
                Attention Required: {rejectedDocs.length} Document(s) Verification Failed!
              </div>
              <div style={{ fontSize: 12, color: "#7F1D1D", marginTop: 4 }}>
                Your document has been rejected during the admin verification process. Please review the remarks below and re-upload the correct document.
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Find Student</h2>
              <p style={styles.cardSub}>Aadhar number aur student name fill karo</p>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aadhar Number *</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. 1234 5678 9012"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchStudent()}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Student Name *</label>
                  <input
                    style={styles.input}
                    placeholder="Student Full Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchStudent()}
                  />
                </div>
              </div>
              <button
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
                onClick={searchStudent}
                disabled={loading}
              >
                {loading ? "Dhoondh raha hai..." : "Search Student →"}
              </button>
            </div>

            <div style={styles.card}>
              {/* List Header with Tabs + Month Filter */}
              <div style={styles.listHeaderStack}>

                {/* Top row: Title + Month Filter */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: 12 }}>
                  <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Student Management Directory</h3>

                  {/* Month Filter */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", whiteSpace: "nowrap" }}>
                      📅 Month:
                    </label>
                    <input
                      type="month"
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 8,
                        border: "1.5px solid #E5E7EB",
                        fontSize: 13,
                        color: "#374151",
                        fontFamily: "inherit",
                        outline: "none",
                        cursor: "pointer",
                        background: "#fff",
                      }}
                    />
                    {monthFilter && (
                      <button
                        onClick={() => setMonthFilter("")}
                        style={{
                          background: "#FEE2E2",
                          color: "#EF4444",
                          border: "none",
                          borderRadius: 6,
                          padding: "4px 10px",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        ✕ Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Active month badge */}
                {monthFilter && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#EEF2FF",
                    color: "#6366F1",
                    border: "1px solid #C7D2FE",
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    📅 Showing: {formatMonthLabel(monthFilter)}
                    &nbsp;·&nbsp; {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
                  </div>
                )}

                {/* Tabs */}
                <div style={styles.tabContainer}>
                  {[
                    { id: "all",            label: `All (${allStudents.length})` },
                    { id: "verified",       label: "Verified ✓" },
                    { id: "unverified",     label: "Unverified / Pending" },
                    { id: "actionRequired", label: "Action Required ⚠️" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterTab(tab.id)}
                      style={{
                        ...styles.tabBtn,
                        background: filterTab === tab.id ? "#6366F1" : "transparent",
                        color:      filterTab === tab.id ? "#fff"    : "#64748B",
                        fontWeight: filterTab === tab.id ? "600"     : "400",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

              </div>

              {listLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                  List load ho rahi hai...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                  {monthFilter
                    ? `${formatMonthLabel(monthFilter)} mein koi student nahi mila`
                    : "Is category mein koi student nahi mila"}
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Course &amp; Uni</th>
                        <th style={styles.th}>Verification Status</th>
                        <th style={styles.th}>Notification Alert</th>
                        <th style={styles.thAction}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => {
                        const statusInfo    = getStudentDocStatus(student);
                        const rejectedCount = (student.documents || []).filter(
                          (d) => d.status === "rejected"
                        ).length;

                        // Docs uploaded in selected month (for month filter badge)
                        const docsInMonth = monthFilter
                          ? (student.documents || []).filter((d) => {
                              if (!d.uploadedAt) return false;
                              const date = new Date(d.uploadedAt);
                              const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                              return ym === monthFilter;
                            })
                          : [];

                        return (
                          <tr key={student._id} style={styles.tr}>
                            <td style={styles.td}>
                              <div style={{ fontWeight: 600, color: "#1E293B" }}>{student.studentName}</div>
                              <div style={{ fontSize: 11, color: "#94A3B8" }}>Aadhar: [Protected]</div>
                              {monthFilter && docsInMonth.length > 0 && (
                                <div style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  marginTop: 4,
                                  background: "#EEF2FF",
                                  color: "#6366F1",
                                  borderRadius: 4,
                                  padding: "2px 6px",
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}>
                                  📅 {docsInMonth.length} doc{docsInMonth.length !== 1 ? "s" : ""} this month
                                </div>
                              )}
                            </td>
                            <td style={styles.td}>
                              <div style={{ fontSize: 13, color: "#334155" }}>{student.course || "N/A"}</div>
                              <div style={{ fontSize: 11, color: "#64748B" }}>{student.universityName || "N/A"}</div>
                            </td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.statusBadge,
                                background: statusInfo.bg,
                                color:      statusInfo.color,
                                border:     `1px solid ${statusInfo.color}40`,
                              }}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {rejectedCount > 0 ? (
                                <div style={styles.inlineNotification}>
                                  <span style={{ marginRight: 4 }}>🚨</span>
                                  <strong>{rejectedCount} Doc Rejected</strong>
                                </div>
                              ) : (
                                <span style={{ fontSize: 12, color: "#94A3B8" }}>All Clear</span>
                              )}
                            </td>
                            <td style={styles.tdAction}>
                              <button
                                onClick={() => handleSelectStudent(student)}
                                style={styles.rowActionBtn}
                              >
                                View / Fix
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && admission && (
          <div>
            <div style={styles.studentCard}>
              <div style={styles.studentAvatar}>
                {admission.studentName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={styles.studentName}>{admission.studentName}</div>
                <div style={styles.studentMeta}>{admission.course} • {admission.universityName}</div>
                <div style={styles.studentMeta}>📱 {admission.phone} &nbsp;|&nbsp; ✉️ {admission.email}</div>
              </div>
              <div style={styles.docBadge}>{summary.total} Docs</div>
            </div>

            {docs.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Already Uploaded Documents ({docs.length})</h3>
                <div style={styles.docList}>
                  {docs.map((doc) => renderDocItem(doc))}
                </div>
              </div>
            )}

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>New Documents Upload Karo</h3>
              <div
                style={{
                  ...styles.dropZone,
                  borderColor: dragging ? "#6366F1" : "#D1D5DB",
                  background:  dragging ? "#EEF2FF" : "#FAFAFA",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <div style={styles.dropIcon}>📁</div>
                <div style={styles.dropText}>Files yahan drop karo ya click karo</div>
                <div style={styles.dropSub}>PDF, DOC, DOCX, JPG, PNG, WEBP • Max 10MB each</div>
                <input
                  ref={fileRef} type="file" multiple hidden
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => addFiles(Array.from(e.target.files))}
                />
              </div>

              {files.length > 0 && (
                <div style={styles.selectedFiles}>
                  <div style={styles.sectionTitle}>Selected Files ({files.length})</div>
                  {files.map((f, i) => (
                    <div key={i} style={styles.selectedFileItem}>
                      <span>{fileIcon(f.type)}</span>
                      <span style={{ flex: 1, fontSize: 13 }}>{f.name}</span>
                      <span style={styles.fileSize}>{(f.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => removeFile(i)} style={styles.removeBtn}>✕</button>
                    </div>
                  ))}
                  <button
                    style={{ ...styles.btn, marginTop: 12, opacity: uploading ? 0.7 : 1 }}
                    onClick={uploadDocs}
                    disabled={uploading}
                  >
                    {uploading ? "Upload ho raha hai..." : `Upload ${files.length} File(s) →`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div style={styles.card}>
            <div style={styles.successHeader}>
              <div style={styles.successIcon}>✅</div>
              <h2 style={styles.cardTitle}>Documents Uploaded!</h2>
              <p style={styles.cardSub}>
                Aapke documents admin ko verification ke liye bhej diye gaye hain.
              </p>
            </div>

            <div style={styles.summaryRow}>
              {[
                { label: "Total",    val: summary.total,    color: "#6366F1" },
                { label: "Pending",  val: summary.pending,  color: "#F59E0B" },
                { label: "Approved", val: summary.done,     color: "#10B981" },
                { label: "Rejected", val: summary.rejected, color: "#EF4444" },
              ].map((s) => (
                <div key={s.label} style={{ ...styles.summaryCard, borderColor: s.color }}>
                  <div style={{ ...styles.summaryVal, color: s.color }}>{s.val}</div>
                  <div style={styles.summaryLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={styles.docList}>
              {docs.map((doc) => renderDocItem(doc))}
            </div>

            <button
              onClick={reset}
              style={{ ...styles.btn, background: "#fff", color: "#6366F1", border: "2px solid #6366F1", marginTop: 16 }}
            >
              ← Back to Main Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:               { minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Outfit', sans-serif" },
  header:             { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 },
  headerInner:        { maxWidth: 1000, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo:               { display: "flex", alignItems: "center", gap: 12 },
  logoIcon:           { fontSize: 28 },
  logoTitle:          { fontWeight: 700, fontSize: 18, color: "#1E293B" },
  logoSub:            { fontSize: 11, color: "#94A3B8" },
  logoutBtn:          { background: "none", border: "1px solid #E5E7EB", borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: "#64748B", fontSize: 13 },
  container:          { maxWidth: 1000, margin: "0 auto", padding: "32px 24px" },
  stepsRow:           { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, gap: 0 },
  stepWrap:           { display: "flex", alignItems: "center", gap: 8 },
  stepCircle:         { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  stepLabel:          { fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" },
  stepLine:           { width: 60, height: 2, margin: "0 8px" },
  card:               { background: "#fff", borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  cardTitle:          { fontSize: 20, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" },
  cardSub:            { fontSize: 14, color: "#94A3B8", margin: "0 0 20px" },
  formGrid:           { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  formGroup:          { display: "flex", flexDirection: "column", gap: 6 },
  label:              { fontSize: 13, fontWeight: 600, color: "#374151" },
  input:              { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit" },
  btn:                { background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" },
  errorBox:           { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14 },
  successBox:         { background: "#ECFDF5", color: "#059669", border: "1px solid #6EE7B7", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14 },
  studentCard:        { background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  studentAvatar:      { width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22, flexShrink: 0 },
  studentName:        { fontWeight: 700, fontSize: 17, color: "#1E293B" },
  studentMeta:        { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  docBadge:           { marginLeft: "auto", background: "#EEF2FF", color: "#6366F1", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600 },
  sectionTitle:       { fontSize: 15, fontWeight: 700, color: "#374151", margin: "0 0 12px" },
  docList:            { display: "flex", flexDirection: "column", gap: 8 },
  docItem:            { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" },
  docFileIcon:        { fontSize: 22, flexShrink: 0 },
  docInfo:            { flex: 1, minWidth: 0 },
  docName:            { fontSize: 13, fontWeight: 500, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  docDate:            { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  remark:             { fontSize: 12, color: "#EF4444", marginTop: 3 },
  statusBadge:        { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, textAlign: "center", display: "inline-block" },
  previewBtn:         { background: "#EEF2FF", color: "#6366F1", border: "1px solid #C7D2FE", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer", marginRight: 6, flexShrink: 0 },
  dropZone:           { border: "2px dashed", borderRadius: 12, padding: "40px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" },
  dropIcon:           { fontSize: 36, marginBottom: 8 },
  dropText:           { fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 4 },
  dropSub:            { fontSize: 12, color: "#9CA3AF" },
  selectedFiles:      { marginTop: 16, padding: 16, background: "#F8FAFC", borderRadius: 10 },
  selectedFileItem:   { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 14 },
  fileSize:           { fontSize: 12, color: "#94A3B8" },
  removeBtn:          { background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16, padding: "0 4px" },
  successHeader:      { textAlign: "center", marginBottom: 24 },
  successIcon:        { fontSize: 48, marginBottom: 8 },
  summaryRow:         { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 },
  summaryCard:        { textAlign: "center", padding: "16px 8px", borderRadius: 12, border: "2px solid", background: "#fff" },
  summaryVal:         { fontSize: 28, fontWeight: 800 },
  summaryLabel:       { fontSize: 12, color: "#94A3B8", fontWeight: 500, marginTop: 2 },
  notificationBanner: { display: "flex", alignItems: "start", gap: 14, background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 12, padding: "16px", marginBottom: 20 },
  listHeaderStack:    { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, marginBottom: 20 },
  tabContainer:       { display: "flex", background: "#F1F5F9", padding: 4, borderRadius: 10, gap: 4, flexWrap: "wrap" },
  tabBtn:             { padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", transition: "all 0.2s" },
  tableWrapper:       { overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: 12 },
  table:              { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow:              { background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" },
  th:                 { padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748B" },
  thAction:           { padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748B", textAlign: "right" },
  tr:                 { borderBottom: "1px solid #F1F5F9", transition: "background 0.2s" },
  td:                 { padding: "14px 16px", verticalAlign: "middle" },
  tdAction:           { padding: "14px 16px", verticalAlign: "middle", textAlign: "right" },
  rowActionBtn:       { background: "#6366F1", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer" },
  inlineNotification: { display: "inline-flex", alignItems: "center", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5", borderRadius: 6, padding: "4px 8px", fontSize: 12 },
  modalOverlay:       { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modalBox:           { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 860, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  modalHeader:        { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #E5E7EB", gap: 12 },
  modalClose:         { background: "#F1F5F9", border: "none", fontSize: 16, cursor: "pointer", color: "#64748B", lineHeight: 1, width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  modalDownloadSmall: { background: "#EEF2FF", color: "#6366F1", border: "1px solid #C7D2FE", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center" },
  modalBody:          { flex: 1, overflow: "auto", padding: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", minHeight: 300 },
  altBtn:             { display: "inline-block", background: "#6366F1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", textDecoration: "none", margin: 4 },
};