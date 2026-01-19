"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Eye, CheckCircle, XCircle, Clock, Search, Loader2 } from "lucide-react";

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [remark, setRemark] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false); // New: Loading state for buttons

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/api/v1/admissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmissions(res.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed Status Update Logic
  const handleStatusUpdate = async (adm, newStatus) => {
    if (!adm?._id) return;
    
    // Agar reject kar rahe hain toh remark check karein
    if (newStatus === "rejected" && !remark.trim()) {
      alert("Please enter a remark for rejection.");
      return;
    }

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      
      const payload = {
        status: newStatus, 
        adminRemark: remark.trim() || (newStatus === "verified" ? "All documents verified." : "")
      };

      const res = await api.patch(
        `/api/v1/admissions/${adm._id}/verify`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success || res.status === 200) {
        const updatedItem = res.data.data;
        
        // State update bina refresh kiye
        setAdmissions(prev => prev.map(a => a._id === adm._id ? updatedItem : a));
        setSelected(updatedItem);
        
        if(newStatus === "verified") setRemark(""); 
        alert(`Application marked as ${newStatus} successfully!`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Error updating status. Check connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = admissions.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = (a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" ? true : a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admission Management</h1>
        <button onClick={fetchAdmissions} className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-100">Refresh Data</button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border px-4 py-2 rounded-lg bg-white outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="verified">✅ Verified</option>
          <option value="rejected">❌ Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400">No applications found.</td></tr>
            ) : filtered.map((adm) => (
              <tr key={adm._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800">{adm.name}</p>
                  <p className="text-xs text-gray-500">{adm.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{adm.course}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit
                    ${adm.status === "verified" ? "bg-green-100 text-green-700" : 
                      adm.status === "rejected" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                    {adm.status === "verified" ? <CheckCircle size={12}/> : adm.status === "rejected" ? <XCircle size={12}/> : <Clock size={12}/>}
                    {adm.status || "pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => { setSelected(adm); setRemark(adm.adminRemark || ""); }} 
                    className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
              <button onClick={() => setSelected(null)} className="text-2xl hover:text-red-500">✕</button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(selected).map(([key, value]) => {
                if (["_id", "__v", "adminRemark", "status", "verifiedBy", "verifiedAt", "updatedAt"].includes(key)) return null;
                const isImg = typeof value === "string" && (value.startsWith("http") || value.startsWith("/uploads")) && 
                             (key.match(/photo|sign|aadhaar|pan/i));

                return (
                  <div key={key} className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{key.replace(/([A-Z])/g, " $1")}</p>
                    {isImg ? (
                      <img src={value} alt={key} className="h-32 w-auto rounded-lg border cursor-zoom-in hover:scale-105 transition-transform" onClick={() => setImagePreview(value)} />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{value?.toString() || "—"}</p>
                    )}
                  </div>
                );
              })}

              {selected.status === "verified" && (
                <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700"><strong>Verified By:</strong> {selected.verifiedBy?.name || "System Admin"}</p>
                  <p className="text-xs text-blue-700"><strong>Date:</strong> {selected.verifiedAt ? new Date(selected.verifiedAt).toLocaleString() : "N/A"}</p>
                </div>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="p-6 border-t bg-gray-50 mt-auto">
              <h3 className="font-bold text-sm mb-3 text-gray-700">Admin Response</h3>
              
              <div className="space-y-4">
                <textarea
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  placeholder="Enter reason if rejecting or special instructions..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
                
                <div className="flex gap-3">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selected, "verified")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-100 disabled:opacity-50"
                  >
                    {isUpdating ? "Processing..." : "Approve Admission"}
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selected, "rejected")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-100 disabled:opacity-50"
                  >
                    Reject & Send Remark
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selected, "pending")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    Hold
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL IMAGE VIEW */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4" onClick={() => setImagePreview(null)}>
          <img src={imagePreview} className="max-h-full max-w-full rounded shadow-2xl animate-in zoom-in-95" alt="Preview" />
        </div>
      )}
    </div>
  );
}