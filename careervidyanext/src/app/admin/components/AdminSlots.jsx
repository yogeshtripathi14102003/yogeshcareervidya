"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Calendar, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import api from "@/utlis/api";

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form States (Add or Update)
  const [formData, setFormData] = useState({ date: "", time: "" });
  const [editingId, setEditingId] = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // 1. Fetch All Slots
  const fetchAllSlots = async () => {
    setLoading(true);
    try {
      // आपके एडमिन/सामान्य स्लॉट गेट एंडपॉइंट के अनुसार (e.g. /api/v1/slots/all या /api/v1/slots)
      const res = await api.get("/api/v1/slots/all");
      if (res.data && res.data.success) {
        setSlots(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      alert("स्लॉट्स लोड करने में विफल!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSlots();
  }, []);

  // 2. Add or Update Slot
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert("कृपया तारीख और समय दोनों चुनें।");
      return;
    }

    setFormSubmitLoading(true);
    try {
      if (editingId) {
        // Update Existing Slot
        const res = await api.put(`/api/v1/slots/update/${editingId}`, formData);
        if (res.data.success) {
          alert("Slot updated successfully!");
          setEditingId(null);
        }
      } else {
        // Create New Slot
        const res = await api.post("/api/v1/slots/create", formData);
        if (res.data.success) {
          alert("New slot added successfully!");
        }
      }
      setFormData({ date: "", time: "" });
      fetchAllSlots(); // Refresh List
    } catch (err) {
      console.error("Error saving slot:", err);
      alert(err.response?.data?.message || "Error saving slot.");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // 3. Delete Slot
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      const res = await api.delete(`/api/v1/slots/delete/${id}`);
      if (res.data.success) {
        alert("Slot deleted successfully!");
        fetchAllSlots();
      }
    } catch (err) {
      console.error("Error deleting slot:", err);
      alert("Error deleting slot.");
    }
  };

  // Set Form to Edit Mode
  const startEdit = (slot) => {
    setEditingId(slot._id);
    setFormData({ date: slot.date, time: slot.time });
  };

  // Cancel Edit Mode
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ date: "", time: "" });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Slot Management Dashboard</h1>
            <p className="text-sm text-slate-500">Manage counseling slots for students</p>
          </div>
          <button 
            onClick={fetchAllSlots} 
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh Slots"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── Form Panel (Add / Edit) ── */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-[#05347f]" />
              {editingId ? "Update Time Slot" : "Add New Slot"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Date/Day Display</label>
                <div className="relative flex items-center">
                  <Calendar size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g., Wed, Jun 11"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] focus:bg-white focus:ring-2 focus:ring-[#05347f]/10 outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Time Slot Display</label>
                <div className="relative flex items-center">
                  <Clock size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g., 11:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] focus:bg-white focus:ring-2 focus:ring-[#05347f]/10 outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 text-sm font-medium text-white bg-[#05347f] hover:bg-[#032357] rounded-lg shadow-sm transition-colors disabled:opacity-70"
                >
                  {editingId ? "Update Slot" : "Create Slot"}
                  {!editingId && <Plus size={16} />}
                </button>
              </div>
            </form>
          </div>

          {/* ── Slots Table/Grid Panel ── */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Total Created Slots ({slots.length})</span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-sm text-slate-400">Loading slots...</div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400">No slots found. Please add a new slot above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {slots.map((slot) => (
                      <tr key={slot._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">{slot.date}</td>
                        <td className="py-3 px-4 text-slate-600">{slot.time}</td>
                        <td className="py-3 px-4">
                          {slot.isBooked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                              <XCircle size={12} /> Booked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              <CheckCircle size={12} /> Available
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Action Button */}
                            <button
                              onClick={() => startEdit(slot)}
                              disabled={slot.isBooked}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                              title={slot.isBooked ? "Booked slots cannot be updated" : "Edit Slot"}
                            >
                              <Edit2 size={14} />
                            </button>
                            {/* Delete Action Button */}
                            <button
                              onClick={() => handleDelete(slot._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Slot"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}