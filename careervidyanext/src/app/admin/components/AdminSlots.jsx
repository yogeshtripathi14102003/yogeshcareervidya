// "use client";

// import { useState, useEffect } from "react";
// import {
//   Plus, Trash2, Edit2, Calendar, Clock,
//   CheckCircle, XCircle, RefreshCw, UserCheck,
//   Users, ChevronDown, ChevronUp,
// } from "lucide-react";
// import api from "@/utlis/api";

// export default function AdminSlots() {
//   const [activeTab, setActiveTab]           = useState("manage");
//   const [slots, setSlots]                   = useState([]);
//   const [loading, setLoading]               = useState(false);
//   const [formData, setFormData]             = useState({ date: "", time: "", totalSeats: 1 });
//   const [editingId, setEditingId]           = useState(null);
//   const [formSubmitLoading, setFormSubmitLoading] = useState(false);
//   const [expandedSlot, setExpandedSlot]     = useState(null); // which slot's bookings are open

//   // ─── Fetch all slots ────────────────────────────────────────────────────────
//   const fetchAllSlots = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/slot/admin/all");
//       if (res.data?.success) setSlots(res.data.data || []);
//     } catch (err) {
//       console.error("fetchAllSlots error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAllSlots(); }, [activeTab]);

//   // ─── Add / Edit slot ────────────────────────────────────────────────────────
//   const handleSlotSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.date || !formData.time)
//       return alert("Please fill in both date and time.");

//     setFormSubmitLoading(true);
//     try {
//       if (editingId) {
//         // ✅ Only date/time editable — totalSeats protected via controller
//         const res = await api.put(`/api/v1/slot/admin/update/${editingId}`, {
//           date: formData.date,
//           time: formData.time,
//           totalSeats: parseInt(formData.totalSeats) || 1,
//         });
//         if (res.data?.success) {
//           alert("Slot updated successfully!");
//           setEditingId(null);
//         }
//       } else {
//         // ✅ Single document with totalSeats — new model
//         const res = await api.post("/api/v1/slot/add", {
//           date:       formData.date,
//           time:       formData.time,
//           totalSeats: parseInt(formData.totalSeats) || 1,
//         });
//         if (res.data?.success) alert(`Slot created with ${formData.totalSeats} seats!`);
//       }

//       setFormData({ date: "", time: "", totalSeats: 1 });
//       fetchAllSlots();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error saving slot.");
//     } finally {
//       setFormSubmitLoading(false);
//     }
//   };

//   // ─── Delete slot ────────────────────────────────────────────────────────────
//   const handleSlotDelete = async (id, bookedSeats) => {
//     if (bookedSeats > 0)
//       return alert("Cannot delete — this slot has active bookings.");
//     if (!window.confirm("Delete this slot permanently?")) return;
//     try {
//       const res = await api.delete(`/api/v1/slot/admin/delete/${id}`);
//       if (res.data?.success) { alert("Slot deleted!"); fetchAllSlots(); }
//     } catch (err) {
//       alert("Error deleting slot.");
//     }
//   };

//   // ─── Approve / Reject a booking ─────────────────────────────────────────────
//   const handleStatusUpdate = async (slotId, bookingId, newStatus, studentName) => {
//     const action = newStatus === "approved" ? "approve" : "reject";
//     if (!window.confirm(`${action} booking for ${studentName || "this student"}?`)) return;

//     try {
//       let res;
//       if (newStatus === "approved") {
//         res = await api.put(`/api/v1/slot/admin/approve/${slotId}`, { bookingId });
//       } else {
//         const reason = window.prompt(`Rejection reason for ${studentName}? (optional)`);
//         res = await api.put(`/api/v1/slot/admin/reject/${slotId}`, {
//           bookingId,
//           rejectionReason: reason || "",
//         });
//       }

//       if (res.data?.success) {
//         alert(newStatus === "approved"
//           ? "✅ Approved! Confirmation email sent."
//           : "❌ Rejected. Student notified via email.");
//         fetchAllSlots();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update status.");
//     }
//   };

//   // ─── Derived data ───────────────────────────────────────────────────────────
//   // All slots with pending bookings count (for tab badge)
//   const pendingCount = slots.reduce((acc, slot) => {
//     const pending = (slot.bookings || []).filter((b) => b.status === "pending").length;
//     return acc + pending;
//   }, 0);

//   // Slots that have at least one booking (for "requests" tab)
//   const slotsWithBookings = slots.filter((s) => s.bookings?.length > 0);

//   return (
//     <div className="max-w-7xl mx-auto space-y-6 text-slate-800">

//       {/* Tab Navigation */}
//       <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2">
//         <button
//           onClick={() => setActiveTab("manage")}
//           className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
//             activeTab === "manage"
//               ? "bg-[#05347f] text-white shadow-sm"
//               : "text-slate-600 hover:bg-slate-50"
//           }`}
//         >
//           <Calendar size={16} /> Manage &amp; Create Slots
//         </button>
//         <button
//           onClick={() => setActiveTab("requests")}
//           className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
//             activeTab === "requests"
//               ? "bg-[#05347f] text-white shadow-sm"
//               : "text-slate-600 hover:bg-slate-50"
//           }`}
//         >
//           <Users size={16} />
//           Student Booking Requests
//           {pendingCount > 0 && (
//             <span className="ml-1 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
//               {pendingCount}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* ══════════════════════════════════════════════
//           TAB 1 — MANAGE SLOTS
//       ══════════════════════════════════════════════ */}
//       {activeTab === "manage" && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Create / Edit Form */}
//           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
//             <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
//               <Plus size={18} className="text-[#05347f]" />
//               {editingId ? "Modify Slot" : "Add Counseling Slot"}
//             </h2>

//             <form onSubmit={handleSlotSubmit} className="space-y-4">
//               {/* Date */}
//               <div className="space-y-1">
//                 <label className="text-xs font-medium text-slate-500">
//                   Date (e.g., Wed, Jun 11)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Wed, Jun 11"
//                   value={formData.date}
//                   onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] outline-none"
//                 />
//               </div>

//               {/* Time */}
//               <div className="space-y-1">
//                 <label className="text-xs font-medium text-slate-500">
//                   Time (e.g., 11:00 AM)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., 11:00 AM"
//                   value={formData.time}
//                   onChange={(e) => setFormData({ ...formData, time: e.target.value })}
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] outline-none"
//                 />
//               </div>

//               {/* Total Seats */}
//               <div className="space-y-1">
//                 <label className="text-xs font-medium text-slate-500">
//                   Total Seats (kitne students book kar sakte hain)
//                 </label>
//                 <input
//                   type="number"
//                   min={1}
//                   max={200}
//                   value={formData.totalSeats}
//                   onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] outline-none"
//                 />
//                 {parseInt(formData.totalSeats) > 1 && (
//                   <p className="text-xs text-[#05347f] bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 mt-1">
//                     ✅ Ek document banegi — {formData.totalSeats} students ek saath book kar sakte hain
//                   </p>
//                 )}
//               </div>

//               <div className="flex gap-2">
//                 {editingId && (
//                   <button
//                     type="button"
//                     onClick={() => { setEditingId(null); setFormData({ date: "", time: "", totalSeats: 1 }); }}
//                     className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={formSubmitLoading}
//                   className="flex-1 py-2 bg-[#05347f] text-white rounded-lg text-sm font-semibold disabled:opacity-60 hover:bg-[#03276b] transition-colors"
//                 >
//                   {formSubmitLoading ? "Saving..." : editingId ? "Update Slot" : "Create Slot"}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Slots Table */}
//           <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
//               <span className="text-sm font-semibold text-slate-700">
//                 All Slots ({slots.length})
//               </span>
//               <button onClick={fetchAllSlots} className="p-1.5 text-slate-600 border bg-white rounded-md hover:bg-slate-50">
//                 <RefreshCw size={14} />
//               </button>
//             </div>

//             {loading ? (
//               <div className="p-8 text-center text-sm text-slate-400">Loading slots...</div>
//             ) : slots.length === 0 ? (
//               <div className="p-8 text-center text-sm text-slate-400">No slots created yet.</div>
//             ) : (
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
//                   <tr>
//                     <th className="p-4">Date</th>
//                     <th className="p-4">Time</th>
//                     <th className="p-4">Seats</th>
//                     <th className="p-4">Bookings</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {slots.map((slot) => {
//                     const remaining = slot.totalSeats - slot.bookedSeats;
//                     const isFull    = remaining <= 0;
//                     return (
//                       <tr key={slot._id} className="hover:bg-slate-50/50">
//                         <td className="p-4 font-semibold text-slate-900">{slot.date}</td>
//                         <td className="p-4 text-slate-600">{slot.time}</td>

//                         {/* Seats */}
//                         <td className="p-4">
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
//                               {remaining} free
//                             </span>
//                             <span className="text-xs text-slate-400">/ {slot.totalSeats}</span>
//                             {slot.bookedSeats > 0 && (
//                               <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
//                                 {slot.bookedSeats} booked
//                               </span>
//                             )}
//                           </div>
//                           {/* Seat fill bar */}
//                           <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full w-24 overflow-hidden">
//                             <div
//                               className="h-full bg-[#05347f] rounded-full transition-all"
//                               style={{ width: `${Math.min(100, (slot.bookedSeats / slot.totalSeats) * 100)}%` }}
//                             />
//                           </div>
//                         </td>

//                         {/* Bookings count */}
//                         <td className="p-4">
//                           {slot.bookings?.length > 0 ? (
//                             <span className="text-xs font-semibold text-[#05347f] bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
//                               {slot.bookings.length} student{slot.bookings.length > 1 ? "s" : ""}
//                             </span>
//                           ) : (
//                             <span className="text-xs text-slate-300">—</span>
//                           )}
//                         </td>

//                         {/* Status */}
//                         <td className="p-4">
//                           {isFull ? (
//                             <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">Full</span>
//                           ) : (
//                             <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium">Available</span>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td className="p-4 text-right">
//                           <button
//                             onClick={() => {
//                               setEditingId(slot._id);
//                               setFormData({ date: slot.date, time: slot.time, totalSeats: slot.totalSeats });
//                             }}
//                             className="p-1 text-slate-500 hover:text-blue-600 mr-1"
//                             title="Edit slot"
//                           >
//                             <Edit2 size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleSlotDelete(slot._id, slot.bookedSeats)}
//                             className="p-1 text-slate-400 hover:text-red-600"
//                             title="Delete slot"
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════
//           TAB 2 — STUDENT BOOKING REQUESTS
//       ══════════════════════════════════════════════ */}
//       {activeTab === "requests" && (
//         <div className="space-y-4">
//           {/* Header */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
//             <div className="p-4 bg-slate-50 border-b flex justify-between items-center rounded-t-xl">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-semibold text-slate-700">
//                   Slots with Bookings ({slotsWithBookings.length})
//                 </span>
//                 {pendingCount > 0 && (
//                   <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-0.5 font-medium">
//                     {pendingCount} pending approval
//                   </span>
//                 )}
//               </div>
//               <button onClick={fetchAllSlots} className="p-1.5 text-slate-600 border bg-white rounded-md hover:bg-slate-50">
//                 <RefreshCw size={14} />
//               </button>
//             </div>

//             {loading ? (
//               <div className="p-12 text-center text-sm text-slate-400">
//                 Fetching booking data...
//               </div>
//             ) : slotsWithBookings.length === 0 ? (
//               <div className="p-12 text-center text-sm text-slate-400">
//                 No student bookings received yet.
//               </div>
//             ) : (
//               <div className="divide-y divide-slate-100">
//                 {slotsWithBookings.map((slot) => {
//                   const isExpanded   = expandedSlot === slot._id;
//                   const pendingHere  = slot.bookings.filter((b) => b.status === "pending").length;
//                   const remaining    = slot.totalSeats - slot.bookedSeats;

//                   return (
//                     <div key={slot._id}>
//                       {/* Slot header row — click to expand */}
//                       <button
//                         onClick={() => setExpandedSlot(isExpanded ? null : slot._id)}
//                         className="w-full flex items-center justify-between p-4 hover:bg-slate-50/70 transition-colors text-left"
//                       >
//                         <div className="flex items-center gap-4">
//                           {/* Date + Time */}
//                           <div>
//                             <div className="font-bold text-slate-900 flex items-center gap-1.5">
//                               <Calendar size={14} className="text-[#05347f]" />
//                               {slot.date}
//                             </div>
//                             <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
//                               <Clock size={11} />
//                               {slot.time}
//                             </div>
//                           </div>

//                           {/* Seats summary */}
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             <span className="text-xs font-semibold text-[#05347f] bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
//                               {slot.bookings.length} booking{slot.bookings.length > 1 ? "s" : ""}
//                             </span>
//                             {pendingHere > 0 && (
//                               <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5 animate-pulse">
//                                 {pendingHere} pending
//                               </span>
//                             )}
//                             <span className="text-xs text-slate-400">
//                               {remaining} seat{remaining !== 1 ? "s" : ""} left / {slot.totalSeats} total
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-2 text-slate-400">
//                           <span className="text-xs text-slate-500">
//                             {isExpanded ? "Collapse" : "View Students"}
//                           </span>
//                           {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </div>
//                       </button>

//                       {/* Expanded student bookings */}
//                       {isExpanded && (
//                         <div className="border-t border-slate-100 bg-slate-50/40">
//                           <table className="w-full text-left text-sm">
//                             <thead className="bg-slate-100 text-xs font-semibold text-slate-500 uppercase">
//                               <tr>
//                                 <th className="px-6 py-3">Student</th>
//                                 <th className="px-4 py-3">Course</th>
//                                 <th className="px-4 py-3">Booked At</th>
//                                 <th className="px-4 py-3">Status</th>
//                                 <th className="px-4 py-3 text-center">Action</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-100 bg-white">
//                               {slot.bookings.map((booking) => (
//                                 <tr key={booking._id} className="hover:bg-slate-50/60">
//                                   {/* Student details */}
//                                   <td className="px-6 py-3 space-y-0.5">
//                                     <div className="font-bold text-slate-900">{booking.studentName}</div>
//                                     <div className="text-xs text-slate-500">{booking.studentEmail}</div>
//                                     <div className="text-xs font-medium text-slate-700">{booking.studentMobile}</div>
//                                     {booking.city && (
//                                       <div className="text-xs text-slate-400">{booking.city}</div>
//                                     )}
//                                   </td>

//                                   {/* Course info */}
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded border border-blue-100">
//                                       {booking.course || "General"}
//                                     </span>
//                                     {booking.branch && (
//                                       <div className="text-xs text-slate-500 mt-1">{booking.branch}</div>
//                                     )}
//                                     {booking.description && (
//                                       <div className="text-xs text-slate-400 mt-1 max-w-[160px] truncate" title={booking.description}>
//                                         "{booking.description}"
//                                       </div>
//                                     )}
//                                   </td>

//                                   {/* Booked at */}
//                                   <td className="px-4 py-3 text-xs text-slate-500">
//                                     {booking.bookedAt
//                                       ? new Date(booking.bookedAt).toLocaleString("en-IN", {
//                                           day: "2-digit", month: "short",
//                                           hour: "2-digit", minute: "2-digit",
//                                         })
//                                       : "—"}
//                                   </td>

//                                   {/* Status badge */}
//                                   <td className="px-4 py-3">
//                                     {booking.status === "approved" ? (
//                                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
//                                         <CheckCircle size={11} /> Approved
//                                       </span>
//                                     ) : booking.status === "rejected" ? (
//                                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
//                                         <XCircle size={11} /> Rejected
//                                       </span>
//                                     ) : (
//                                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
//                                         Pending
//                                       </span>
//                                     )}
//                                   </td>

//                                   {/* Approve / Reject actions */}
//                                   <td className="px-4 py-3">
//                                     <div className="flex items-center justify-center gap-2">
//                                       <button
//                                         onClick={() =>
//                                           handleStatusUpdate(slot._id, booking._id, "approved", booking.studentName)
//                                         }
//                                         disabled={booking.status === "approved"}
//                                         className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
//                                       >
//                                         <UserCheck size={11} /> Approve
//                                       </button>
//                                       <button
//                                         onClick={() =>
//                                           handleStatusUpdate(slot._id, booking._id, "rejected", booking.studentName)
//                                         }
//                                         disabled={booking.status === "rejected"}
//                                         className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-medium rounded-md text-xs border border-red-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
//                                       >
//                                         Reject
//                                       </button>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit2, Calendar, Clock,
  CheckCircle, XCircle, RefreshCw, UserCheck,
  Users, ChevronDown, ChevronUp,
} from "lucide-react";
import api from "@/utlis/api";

export default function AdminSlots() {
  const [activeTab, setActiveTab]           = useState("manage");
  const [slots, setSlots]                   = useState([]);
  const [loading, setLoading]               = useState(false);
  const [formData, setFormData]             = useState({
    date: "",         // "YYYY-MM-DD"
    time: "",         // "HH:mm"
    totalSeats: 1,
  });
  const [editingId, setEditingId]           = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [expandedSlot, setExpandedSlot]     = useState(null);
  const [, setTick]                         = useState(0); // live expiry ticker

  // ─── Helpers: Formatting ────────────────────────────────────────────────────
  const formatSlotDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatSlotTime = (timeStr) => {
    if (!timeStr) return "—";
    try {
      const [h, m] = timeStr.split(":");
      const d = new Date();
      d.setHours(parseInt(h), parseInt(m));
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeStr;
    }
  };

  // ─── Helper: Check if slot has expired ──────────────────────────────────────
  const isSlotExpired = (slot) => {
    if (!slot?.slotDateTime) return false;
    return new Date(slot.slotDateTime).getTime() < Date.now();
  };

  // ─── Fetch all slots ────────────────────────────────────────────────────────
  const fetchAllSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/slot/admin/all");
      if (res.data?.success) setSlots(res.data.data || []);
    } catch (err) {
      console.error("fetchAllSlots error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllSlots(); }, [activeTab]);

  // ─── Live ticker: refresh expiry state every minute ─────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // ─── Add / Edit slot ────────────────────────────────────────────────────────
  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time)
      return alert("Please select both date and time.");

    // ✅ Build ISO datetime
    const slotDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    setFormSubmitLoading(true);
    try {
      if (editingId) {
        const res = await api.put(`/api/v1/slot/admin/update/${editingId}`, {
          date: formData.date,
          time: formData.time,
          slotDateTime,
          totalSeats: parseInt(formData.totalSeats) || 1,
        });
        if (res.data?.success) {
          alert("Slot updated successfully!");
          setEditingId(null);
        }
      } else {
        const res = await api.post("/api/v1/slot/add", {
          date: formData.date,
          time: formData.time,
          slotDateTime,
          totalSeats: parseInt(formData.totalSeats) || 1,
        });
        if (res.data?.success) alert(`Slot created with ${formData.totalSeats} seats!`);
      }

      setFormData({ date: "", time: "", totalSeats: 1 });
      fetchAllSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving slot.");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // ─── Delete slot (Admin full authority — any slot, any state) ───────────────
  const handleSlotDelete = async (id, bookedSeats, isExpired) => {
    let confirmMsg = "Delete this slot permanently?";

    if (isExpired && bookedSeats > 0) {
      confirmMsg = `⚠️ This slot is EXPIRED and has ${bookedSeats} booking(s).\n\nDelete permanently (including old bookings)?`;
    } else if (bookedSeats > 0) {
      confirmMsg = `⚠️ WARNING: This slot has ${bookedSeats} active booking(s)!\n\nDeleting will remove all student bookings. Continue?`;
    } else if (isExpired) {
      confirmMsg = "This slot is EXPIRED. Delete permanently?";
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.delete(`/api/v1/slot/admin/delete/${id}`);
      if (res.data?.success) {
        alert(res.data.message || "Slot deleted!");
        fetchAllSlots();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting slot.");
    }
  };

  // ─── Approve / Reject a booking ─────────────────────────────────────────────
  const handleStatusUpdate = async (slotId, bookingId, newStatus, studentName) => {
    const action = newStatus === "approved" ? "approve" : "reject";
    if (!window.confirm(`${action} booking for ${studentName || "this student"}?`)) return;

    try {
      let res;
      if (newStatus === "approved") {
        res = await api.put(`/api/v1/slot/admin/approve/${slotId}`, { bookingId });
      } else {
        const reason = window.prompt(`Rejection reason for ${studentName}? (optional)`);
        res = await api.put(`/api/v1/slot/admin/reject/${slotId}`, {
          bookingId,
          rejectionReason: reason || "",
        });
      }

      if (res.data?.success) {
        alert(newStatus === "approved"
          ? "✅ Approved! Confirmation email sent."
          : "❌ Rejected. Student notified via email.");
        fetchAllSlots();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  // ─── Derived data ───────────────────────────────────────────────────────────
  const pendingCount = slots.reduce((acc, slot) => {
    if (isSlotExpired(slot)) return acc;
    const pending = (slot.bookings || []).filter((b) => b.status === "pending").length;
    return acc + pending;
  }, 0);

  const slotsWithBookings = slots.filter((s) => s.bookings?.length > 0);

  // ✅ Today's date for min attribute (past dates disabled)
  const todayISO = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-neutral-dark">

      {/* ══════════════════════════════════════════════
          TAB NAVIGATION
      ══════════════════════════════════════════════ */}
      <div className="flex border-b border-neutral-border bg-white p-2 rounded-xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "manage"
              ? "text-white shadow-sm cv-btn-cta"
              : "text-neutral-mid hover:bg-neutral-light"
          }`}
        >
          <Calendar size={16} /> Manage &amp; Create Slots
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "requests"
              ? "text-white shadow-sm cv-btn-cta"
              : "text-neutral-mid hover:bg-neutral-light"
          }`}
        >
          <Users size={16} />
          Student Booking Requests
          {pendingCount > 0 && (
            <span className="ml-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          TAB 1 — MANAGE SLOTS
      ══════════════════════════════════════════════ */}
      {activeTab === "manage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create / Edit Form */}
          <div className="bg-white p-5 rounded-xl border border-neutral-border shadow-sm h-fit space-y-4">
            <h2 className="text-base font-bold text-neutral-dark flex items-center gap-2">
              <span className="cv-icon-gradient w-7 h-7">
                <Plus size={14} />
              </span>
              {editingId ? "Modify Slot" : "Add Counseling Slot"}
            </h2>

            <div className="cv-divider-gradient w-16" />

            <form onSubmit={handleSlotSubmit} className="space-y-4 pt-2">
              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-mid">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  min={todayISO}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-light border border-neutral-border rounded-lg focus:border-accent outline-none transition-colors"
                />
                <p className="text-[11px] text-neutral-mid">
                  Past dates select nahi ho sakti
                </p>
              </div>

              {/* Time */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-mid">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-light border border-neutral-border rounded-lg focus:border-accent outline-none transition-colors"
                />
              </div>

              {/* Total Seats */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-mid">
                  Total Seats (kitne students book kar sakte hain)
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-light border border-neutral-border rounded-lg focus:border-accent outline-none transition-colors"
                />
                {parseInt(formData.totalSeats) > 1 && (
                  <p className="text-xs text-accent-dark bg-accent-light border border-accent/20 rounded-lg px-3 py-1.5 mt-1">
                    ✅ Ek document banegi — {formData.totalSeats} students ek saath book kar sakte hain
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ date: "", time: "", totalSeats: 1 });
                    }}
                    className="flex-1 py-2 text-sm border border-neutral-border rounded-lg hover:bg-neutral-light transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex-1 py-2 cv-btn-cta rounded-lg text-sm font-semibold disabled:opacity-60"
                >
                  {formSubmitLoading ? "Saving..." : editingId ? "Update Slot" : "Create Slot"}
                </button>
              </div>
            </form>
          </div>

          {/* Slots Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-border shadow-sm overflow-hidden">
            <div className="p-4 bg-neutral-light border-b border-neutral-border flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-dark">
                All Slots ({slots.length})
              </span>
              <button
                onClick={fetchAllSlots}
                className="p-1.5 text-neutral-mid border border-neutral-border bg-white rounded-md hover:bg-neutral-light transition-colors"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-neutral-mid">Loading slots...</div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-sm text-neutral-mid">No slots created yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-light border-b border-neutral-border text-xs font-semibold text-neutral-mid uppercase">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Seats</th>
                      <th className="p-4">Bookings</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-border">
                    {slots.map((slot) => {
                      const expired   = isSlotExpired(slot);
                      const remaining = slot.totalSeats - slot.bookedSeats;
                      const isFull    = remaining <= 0;
                      return (
                        <tr
                          key={slot._id}
                          className={`hover:bg-neutral-light/60 transition-colors ${
                            expired ? "opacity-60 bg-neutral-light/40" : ""
                          }`}
                        >
                          <td className="p-4 font-semibold text-neutral-dark whitespace-nowrap">
                            {formatSlotDate(slot.date)}
                          </td>
                          <td className="p-4 text-neutral-mid whitespace-nowrap">
                            {formatSlotTime(slot.time)}
                          </td>

                          {/* Seats */}
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                                {remaining} free
                              </span>
                              <span className="text-xs text-neutral-mid">/ {slot.totalSeats}</span>
                              {slot.bookedSeats > 0 && (
                                <span className="text-xs text-accent-dark bg-accent-light border border-accent/20 rounded-full px-2 py-0.5">
                                  {slot.bookedSeats} booked
                                </span>
                              )}
                            </div>
                            <div className="mt-1.5 h-1.5 bg-neutral-border rounded-full w-24 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, (slot.bookedSeats / slot.totalSeats) * 100)}%`,
                                  background: "var(--cv-grad-horizontal)",
                                }}
                              />
                            </div>
                          </td>

                          {/* Bookings count */}
                          <td className="p-4">
                            {slot.bookings?.length > 0 ? (
                              <span className="text-xs font-semibold text-primary bg-primary-light border border-primary/10 rounded-full px-2 py-0.5">
                                {slot.bookings.length} student{slot.bookings.length > 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-mid">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {expired ? (
                              <span className="px-2 py-0.5 bg-slate-200 text-neutral-mid border border-neutral-border rounded-full text-xs font-medium">
                                Expired
                              </span>
                            ) : isFull ? (
                              <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">
                                Full
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium">
                                Available
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingId(slot._id);
                                setFormData({
                                  date: slot.date,
                                  time: slot.time,
                                  totalSeats: slot.totalSeats,
                                });
                              }}
                              disabled={expired}
                              className="p-1.5 text-neutral-mid hover:text-primary rounded-md hover:bg-primary-light mr-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title={expired ? "Expired slot cannot be edited" : "Edit slot"}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleSlotDelete(slot._id, slot.bookedSeats, expired)}
                              className="p-1.5 text-neutral-mid hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                              title={expired ? "Delete expired slot" : "Delete slot"}
                            >
                              <Trash2 size={14} />
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
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 2 — STUDENT BOOKING REQUESTS
      ══════════════════════════════════════════════ */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-border shadow-sm">
            <div className="p-4 bg-neutral-light border-b border-neutral-border flex justify-between items-center rounded-t-xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-neutral-dark">
                  Slots with Bookings ({slotsWithBookings.length})
                </span>
                {pendingCount > 0 && (
                  <span className="text-xs bg-accent-light text-accent-dark border border-accent/20 rounded-full px-2.5 py-0.5 font-medium">
                    {pendingCount} pending approval
                  </span>
                )}
              </div>
              <button
                onClick={fetchAllSlots}
                className="p-1.5 text-neutral-mid border border-neutral-border bg-white rounded-md hover:bg-neutral-light transition-colors"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-neutral-mid">
                Fetching booking data...
              </div>
            ) : slotsWithBookings.length === 0 ? (
              <div className="p-12 text-center text-sm text-neutral-mid">
                No student bookings received yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-border">
                {slotsWithBookings.map((slot) => {
                  const isExpanded  = expandedSlot === slot._id;
                  const expired     = isSlotExpired(slot);
                  const pendingHere = expired
                    ? 0
                    : slot.bookings.filter((b) => b.status === "pending").length;
                  const remaining   = slot.totalSeats - slot.bookedSeats;

                  return (
                    <div key={slot._id}>
                      {/* Slot header row */}
                      <button
                        onClick={() => setExpandedSlot(isExpanded ? null : slot._id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-neutral-light/70 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <div className="font-bold text-neutral-dark flex items-center gap-1.5">
                              <Calendar size={14} className="text-accent" />
                              {formatSlotDate(slot.date)}
                            </div>
                            <div className="text-xs text-neutral-mid flex items-center gap-1 mt-0.5">
                              <Clock size={11} />
                              {formatSlotTime(slot.time)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-primary bg-primary-light border border-primary/10 rounded-full px-2 py-0.5">
                              {slot.bookings.length} booking{slot.bookings.length > 1 ? "s" : ""}
                            </span>

                            {expired ? (
                              <span className="text-xs font-semibold text-neutral-mid bg-slate-200 border border-neutral-border rounded-full px-2 py-0.5">
                                Expired
                              </span>
                            ) : (
                              pendingHere > 0 && (
                                <span className="text-xs font-semibold text-accent-dark bg-accent-light border border-accent/20 rounded-full px-2 py-0.5 animate-pulse">
                                  {pendingHere} pending
                                </span>
                              )
                            )}

                            <span className="text-xs text-neutral-mid">
                              {remaining} seat{remaining !== 1 ? "s" : ""} left / {slot.totalSeats} total
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-neutral-mid shrink-0">
                          <span className="text-xs text-neutral-mid hidden sm:inline">
                            {isExpanded ? "Collapse" : "View Students"}
                          </span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* Expanded student bookings */}
                      {isExpanded && (
                        <div className="border-t border-neutral-border bg-neutral-light/40">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-neutral-light text-xs font-semibold text-neutral-mid uppercase">
                                <tr>
                                  <th className="px-6 py-3">Student</th>
                                  <th className="px-4 py-3">Course</th>
                                  <th className="px-4 py-3">Booked At</th>
                                  <th className="px-4 py-3">Status</th>
                                  <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-border bg-white">
                                {slot.bookings.map((booking) => (
                                  <tr key={booking._id} className="hover:bg-neutral-light/60 transition-colors">
                                    {/* Student details */}
                                    <td className="px-6 py-3 space-y-0.5">
                                      <div className="font-bold text-neutral-dark">{booking.studentName}</div>
                                      <div className="text-xs text-neutral-mid">{booking.studentEmail}</div>
                                      <div className="text-xs font-medium text-neutral-dark">{booking.studentMobile}</div>
                                      {booking.city && (
                                        <div className="text-xs text-neutral-mid">{booking.city}</div>
                                      )}
                                    </td>

                                    {/* Course info */}
                                    <td className="px-4 py-3">
                                      <span className="text-xs bg-primary-light text-primary font-semibold px-2 py-1 rounded border border-primary/10">
                                        {booking.course || "General"}
                                      </span>
                                      {booking.branch && (
                                        <div className="text-xs text-neutral-mid mt-1">{booking.branch}</div>
                                      )}
                                      {booking.description && (
                                        <div
                                          className="text-xs text-neutral-mid mt-1 max-w-[160px] truncate"
                                          title={booking.description}
                                        >
                                          "{booking.description}"
                                        </div>
                                      )}
                                    </td>

                                    {/* Booked at */}
                                    <td className="px-4 py-3 text-xs text-neutral-mid whitespace-nowrap">
                                      {booking.bookedAt
                                        ? new Date(booking.bookedAt).toLocaleString("en-IN", {
                                            day: "2-digit", month: "short",
                                            hour: "2-digit", minute: "2-digit",
                                          })
                                        : "—"}
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-4 py-3">
                                      {expired ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-neutral-mid border border-neutral-border">
                                          Expired
                                        </span>
                                      ) : booking.status === "approved" ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                          <CheckCircle size={11} /> Approved
                                        </span>
                                      ) : booking.status === "rejected" ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                          <XCircle size={11} /> Rejected
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent-dark border border-accent/20 animate-pulse">
                                          Pending
                                        </span>
                                      )}
                                    </td>

                                    {/* Approve / Reject actions — hidden for expired */}
                                    <td className="px-4 py-3">
                                      {expired ? (
                                        <div className="text-center text-xs text-neutral-mid italic">
                                          Slot expired — no action
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center gap-2">
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(slot._id, booking._id, "approved", booking.studentName)
                                            }
                                            disabled={booking.status === "approved"}
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                          >
                                            <UserCheck size={11} /> Approve
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(slot._id, booking._id, "rejected", booking.studentName)
                                            }
                                            disabled={booking.status === "rejected"}
                                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-medium rounded-md text-xs border border-red-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                          >
                                            Reject
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}