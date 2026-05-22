"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/utlis/api.js";
import { 
  FileText, CheckCircle, XCircle, AlertCircle, 
  Clock, Eye, Search, ArrowRight, Download 
} from "lucide-react";

// Status styles mapping as per your logic
const statusStyles = {
  approved: { color: "#10B981", bg: "#ECFDF5", label: "Approved" },
  rejected: { color: "#EF4444", bg: "#FEF2F2", label: "Rejected" },
  pending: { color: "#F59E0B", bg: "#FFFBEB", label: "Pending" },
};

const getStatusColor = (status) => statusStyles[status?.toLowerCase()] || { color: "#6B7280", bg: "#F3F4F6", label: status };

const getFileIcon = (fileName) => {
  if (!fileName) return <FileText size={16} />;
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png'].includes(ext)) return <Eye size={16} />;
  return <Download size={16} />;
};

export default function AdmissionsOnlyPanel() {
  // ── AUTHENTICATION STATES ──
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passError, setPassError] = useState("");

  // ── DATA & UI STATES ──
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  // ── PASSWORD HANDLER ──
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // ⚠️ Yahan apna secret password set karein
    if (passwordInput === "Careervidya@2026") { 
      setIsAuthenticated(true);
      setPassError("");
    } else {
      setPassError("❌ Galat password! Koshish dubara karein.");
    }
  };

  // ── FETCH DATA (Only runs if authenticated) ──
  const fetchAdmissions = useCallback(async () => {
    if (!isAuthenticated) return; 
    setLoading(true);
    try {
      const res = await api.get("/api/v1/ad", { params: { limit: 5000 } });
      if (res.data.success) {
        setAdmissions(res.data.data || []);
      }
    } catch (e) {
      console.error("Error fetching admissions:", e);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  // ── FILTER LOGIC ──
  const filteredAdmissions = admissions.filter((item) => {
    const matchesSearch = 
      item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicationId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // ── 1. LOCK SCREEN UI (Agar authenticated nahi hai) ──
  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F1F5F9", fontFamily: "sans-serif" }}>
        <form onSubmit={handlePasswordSubmit} style={{ background: "#ffffff", padding: "40px 32px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "380px", textAlign: "center" }}>
          <div style={{ background: "#EEF2FF", width: "56px", height: "56px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px" }}>
            <span style={{ fontSize: "24px" }}>🔒</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", color: "#1E293B" }}>Admin Access Only</h2>
          <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>Is restricted dashboard ko dekhne ke liye password enter karein.</p>
          
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #E2E8F0", fontSize: "15px", outline: "none", marginBottom: "12px", boxSizing: "border-box", transition: "border-color 0.2s" }}
            required
          />
          
          {passError && <p style={{ color: "#EF4444", fontSize: "13px", margin: "0 0 16px", fontWeight: "500" }}>{passError}</p>}
          
          <button type="submit" style={{ width: "100%", background: "#4F46E5", color: "#ffffff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}>
            Verify & Unlock
          </button>
        </form>
      </div>
    );
  }

  // ── 2. REAL DASHBOARD UI (Password sahi hone ke baad) ──
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admissions Management</h1>
          <p style={s.subtitle}>Total Applications: {filteredAdmissions.length}</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} style={s.lockBtn}>
          Lock Panel
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div style={s.controlsRow}>
        <div style={s.searchWrapper}>
          <Search size={18} style={s.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by Name, Course or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={s.searchInput}
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={s.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Main Content Split Layout */}
      <div style={s.contentGrid}>
        {/* Left Side: List */}
        <div style={s.listContainer}>
          {loading ? (
            <div style={s.centerMsg}>Loading applications...</div>
          ) : filteredAdmissions.length === 0 ? (
            <div style={s.centerMsg}>No admissions found matching the criteria.</div>
          ) : (
            filteredAdmissions.map((ad) => {
              const status = getStatusColor(ad.status);
              return (
                <div 
                  key={ad._id} 
                  style={{...s.card, borderLeft: `4px solid ${status.color}`, background: selectedAdmission?._id === ad._id ? "#F8FAFC" : "#FFFFFF"}}
                  onClick={() => setSelectedAdmission(ad)}
                >
                  <div style={s.cardHeader}>
                    <span style={s.appId}>{ad.applicationId || "N/A"}</span>
                    <span style={{...s.badge, color: status.color, backgroundColor: status.bg}}>{status.label}</span>
                  </div>
                  <h3 style={s.studentName}>{ad.studentName}</h3>
                  <p style={s.courseName}>{ad.courseName}</p>
                  <div style={s.cardFooter}>
                    <Clock size={14} style={{marginRight: 4}} />
                    <span>{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "Date N/A"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed View */}
        <div style={s.detailContainer}>
          {selectedAdmission ? (
            <div style={s.detailView}>
              <h2 style={s.detailTitle}>Application Details</h2>
              <hr style={s.divider} />
              
              <div style={s.infoGroup}>
                <label style={s.infoLabel}>Student Name</label>
                <div style={s.infoValue}>{selectedAdmission.studentName}</div>
              </div>

              <div style={s.infoGroup}>
                <label style={s.infoLabel}>Course Opted</label>
                <div style={s.infoValue}>{selectedAdmission.courseName}</div>
              </div>

              <div style={s.infoGroup}>
                <label style={s.infoLabel}>Email & Contact</label>
                <div style={s.infoValue}>{selectedAdmission.email || "N/A"} | {selectedAdmission.phone || "N/A"}</div>
              </div>

              <div style={s.infoGroup}>
                <label style={s.infoLabel}>Documents Attached</label>
                <div style={s.docList}>
                  {selectedAdmission.documents && selectedAdmission.documents.length > 0 ? (
                    selectedAdmission.documents.map((doc, idx) => (
                      <a key={idx} href={doc.url} target="_blank" rel="noreferrer" style={s.docLink}>
                        {getFileIcon(doc.name)}
                        <span style={{marginLeft: 8}}>{doc.name || `Document-${idx+1}`}</span>
                        <ArrowRight size={14} style={{marginLeft: "auto"}} />
                      </a>
                    ))
                  ) : (
                    <p style={{color: "#94A3B8", fontSize: 13, margin: 0}}>No documents uploaded.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={s.emptyDetail}>
              <AlertCircle size={24} style={{marginBottom: 8, color: "#94A3B8"}} />
              <p>Kisi bhi application par click karke uski full details yahan dekhin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MINIMAL INLINE UI STYLES (Clean & Modern Dashboard Look) ──
const s = {
  page: { padding: "24px", maxWidth: "1280px", margin: "0 auto", fontFamily: "system-ui, sans-serif", color: "#334155", background: "#F8FAFC", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#0F172A" },
  subtitle: { fontSize: "14px", color: "#64748B", margin: "4px 0 0 0" },
  lockBtn: { background: "#EF4444", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  controlsRow: { display: "flex", gap: "12px", marginBottom: "20px" },
  searchWrapper: { position: "relative", flex: 1 },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" },
  searchInput: { width: "100%", padding: "10px 12px 10px 38px", borderRadius: "8px", border: "1.5px solid #E2E8F0", outline: "none", boxSizing: "border-box" },
  filterSelect: { padding: "10px 16px", borderRadius: "8px", border: "1.5px solid #E2E8F0", background: "#fff", outline: "none", cursor: "pointer" },
  contentGrid: { display: "flex", gap: "20px", alignItems: "flex-start" },
  listContainer: { flex: "1", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "calc(100vh - 180px)", overflowY: "auto" },
  card: { padding: "16px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.15s" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  appId: { fontSize: "12px", fontWeight: "600", color: "#64748B" },
  badge: { fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "12px" },
  studentName: { fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0", color: "#1E293B" },
  courseName: { fontSize: "14px", color: "#64748B", margin: "0 0 12px 0" },
  cardFooter: { display: "flex", alignItems: "center", fontSize: "12px", color: "#94A3B8" },
  detailContainer: { flex: "1", background: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "sticky", top: "24px", minHeight: "400px" },
  emptyDetail: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", color: "#64748B", padding: "24px", textAlign: "center", fontSize: "14px" },
  detailView: { padding: "24px" },
  detailTitle: { fontSize: "18px", fontWeight: "700", margin: "0 0 12px 0" },
  divider: { border: "none", borderTop: "1.5px solid #F1F5F9", margin: "0 0 20px 0" },
  infoGroup: { marginBottom: "16px" },
  infoLabel: { fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", display: "block", marginBottom: "4px" },
  infoValue: { fontSize: "15px", color: "#334155", fontWeight: "500" },
  docList: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" },
  docLink: { display: "flex", alignItems: "center", padding: "10px 14px", background: "#F8FAFC", borderRadius: "8px", color: "#4F46E5", textDecoration: "none", fontSize: "13px", fontWeight: "500", border: "1px solid #E2E8F0" },
  centerMsg: { textAlign: "center", color: "#64748B", padding: "40px 0", fontSize: "14px" }
};