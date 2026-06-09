


// "use client";

// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Trash2,
//   Edit2,
//   Calendar,
//   Clock,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   UserCheck,
//   Users,
//   Copy,
// } from "lucide-react";
// import api from "@/utlis/api";

// export default function AdminSlots() {
//   const [activeTab, setActiveTab] = useState("manage");

//   const [slots, setSlots] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Form — ab "seats" bhi hai bulk create ke liye
//   const [formData, setFormData] = useState({ date: "", time: "", seats: 1 });
//   const [editingId, setEditingId] = useState(null);
//   const [formSubmitLoading, setFormSubmitLoading] = useState(false);
//   const [bulkProgress, setBulkProgress] = useState(""); // "3/11 created..."

//   // 1. Fetch All Slots
//   const fetchAllSlots = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/slot/admin/all");
//       if (res.data?.success) setSlots(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching slots:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Fetch Booked Slots
//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/v1/slot/admin/all");
//       if (res.data?.success) {
//         const bookedOnly = (res.data.data || []).filter((s) => s.isBooked);
//         setBookings(bookedOnly);
//       }
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "manage") fetchAllSlots();
//     else fetchBookings();
//   }, [activeTab]);

//   // 3. Add / Update Slot — agar seats > 1 hai toh bulk create karo
//   const handleSlotSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.date || !formData.time)
//       return alert("Please fill in both date and time fields.");

//     setFormSubmitLoading(true);
//     setBulkProgress("");

//     try {
//       if (editingId) {
//         // Single slot update
//         const res = await api.put(`/api/v1/slot/admin/update/${editingId}`, {
//           date: formData.date,
//           time: formData.time,
//         });
//         if (res.data?.success) {
//           alert("Slot updated successfully!");
//           setEditingId(null);
//         }
//       } else {
//         const totalSeats = parseInt(formData.seats) || 1;

//         if (totalSeats === 1) {
//           // Single create
//           const res = await api.post("/api/v1/slot/add", {
//             date: formData.date,
//             time: formData.time,
//           });
//           if (res.data?.success) alert("New slot added successfully!");
//         } else {
//           // ── BULK CREATE: same date+time ke liye N slots ──
//           let successCount = 0;
//           for (let i = 0; i < totalSeats; i++) {
//             setBulkProgress(`Creating ${i + 1} / ${totalSeats}...`);
//             try {
//               await api.post("/api/v1/slot/add", {
//                 date: formData.date,
//                 time: formData.time,
//               });
//               successCount++;
//             } catch {
//               // ek fail hua toh skip karo, baaki continue
//             }
//           }
//           setBulkProgress("");
//           alert(`${successCount} / ${totalSeats} slots created successfully!`);
//         }
//       }

//       setFormData({ date: "", time: "", seats: 1 });
//       fetchAllSlots();
//     } catch (err) {
//       alert("Error saving slot.");
//     } finally {
//       setFormSubmitLoading(false);
//       setBulkProgress("");
//     }
//   };

//   // 4. Delete Slot
//   const handleSlotDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this slot?")) return;
//     try {
//       const res = await api.delete(`/api/v1/slot/admin/delete/${id}`);
//       if (res.data?.success) {
//         alert("Slot deleted successfully!");
//         fetchAllSlots();
//       }
//     } catch (err) {
//       alert("Error deleting slot.");
//     }
//   };

//   // 5. Approve / Reject
//   const handleStatusUpdate = async (bookingId, newStatus) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to ${
//           newStatus === "approved" ? "approve" : "reject"
//         } this request?`
//       )
//     )
//       return;

//     try {
//       const res = await api.put(`/api/v1/slot/book/${bookingId}`, {
//         status: newStatus,
//       });
//       if (res.data?.success) {
//         alert(`Booking successfully ${newStatus}!`);
//         fetchBookings();
//       }
//     } catch (err) {
//       console.error("Status update error:", err);
//       alert("Failed to update status.");
//     }
//   };

//   // ── Slots ko group karo: same date+time wale saath dikhao ──
//   const groupedSlots = slots.reduce((acc, slot) => {
//     const key = `${slot.date}__${slot.time}`;
//     if (!acc[key]) {
//       acc[key] = { date: slot.date, time: slot.time, total: 0, booked: 0, ids: [] };
//     }
//     acc[key].total += 1;
//     if (slot.isBooked) acc[key].booked += 1;
//     acc[key].ids.push(slot._id);
//     return acc;
//   }, {});

//   const groupedList = Object.values(groupedSlots);

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
//           <Calendar size={16} /> Manage & Create Slots
//         </button>
//         <button
//           onClick={() => setActiveTab("requests")}
//           className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
//             activeTab === "requests"
//               ? "bg-[#05347f] text-white shadow-sm"
//               : "text-slate-600 hover:bg-slate-50"
//           }`}
//         >
//           <Users size={16} /> Student Booking Requests
//         </button>
//       </div>

//       {/* ─── TAB 1: MANAGE SLOTS ─── */}
//       {activeTab === "manage" && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Create / Edit Form */}
//           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
//             <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
//               <Plus size={18} className="text-[#05347f]" />
//               {editingId ? "Modify Slot" : "Add Counseling Slot"}
//             </h2>

//             <form onSubmit={handleSlotSubmit} className="space-y-4">
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

//               {/* ── Seats / Capacity field — only in create mode ── */}
//               {!editingId && (
//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
//                     <Copy size={12} className="text-[#05347f]" />
//                     Seats / Capacity
//                     <span className="text-slate-400 font-normal ml-1">(kitne students ek baar book kar sakte hain)</span>
//                   </label>
//                   <input
//                     type="number"
//                     min={1}
//                     max={100}
//                     placeholder="e.g., 11"
//                     value={formData.seats}
//                     onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
//                     className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-[#05347f] outline-none"
//                   />
//                   {parseInt(formData.seats) > 1 && (
//                     <p className="text-xs text-[#05347f] bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 mt-1">
//                       {formData.seats} identical slots banaenge — ek baar mein {formData.seats} students book kar sakenge
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Bulk progress indicator */}
//               {bulkProgress && (
//                 <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
//                   ⏳ {bulkProgress}
//                 </div>
//               )}

//               <div className="flex gap-2">
//                 {editingId && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditingId(null);
//                       setFormData({ date: "", time: "", seats: 1 });
//                     }}
//                     className="flex-1 py-2 text-sm border border-slate-200 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={formSubmitLoading}
//                   className="flex-1 py-2 bg-[#05347f] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
//                 >
//                   {formSubmitLoading
//                     ? bulkProgress || "Saving..."
//                     : editingId
//                     ? "Update Now"
//                     : parseInt(formData.seats) > 1
//                     ? `Create ${formData.seats} Slots`
//                     : "Create Slot"}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* ── Grouped Slots Table ── */}
//           <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             {loading ? (
//               <div className="p-8 text-center text-sm text-slate-400">Loading slots...</div>
//             ) : groupedList.length === 0 ? (
//               <div className="p-8 text-center text-sm text-slate-400">No slots available.</div>
//             ) : (
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
//                   <tr>
//                     <th className="p-4">Date</th>
//                     <th className="p-4">Time</th>
//                     <th className="p-4">Seats</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {groupedList.map((group) => {
//                     const available = group.total - group.booked;
//                     return (
//                       <tr key={`${group.date}-${group.time}`} className="hover:bg-slate-50/50">
//                         <td className="p-4 font-semibold text-slate-900">{group.date}</td>
//                         <td className="p-4 text-slate-600">{group.time}</td>

//                         {/* Seat count pill */}
//                         <td className="p-4">
//                           <div className="flex items-center gap-1.5">
//                             <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
//                               {available} free
//                             </span>
//                             <span className="text-xs text-slate-400">/ {group.total}</span>
//                             {group.booked > 0 && (
//                               <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
//                                 {group.booked} booked
//                               </span>
//                             )}
//                           </div>
//                         </td>

//                         <td className="p-4">
//                           {available === 0 ? (
//                             <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">
//                               Full
//                             </span>
//                           ) : (
//                             <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium">
//                               Available
//                             </span>
//                           )}
//                         </td>

//                         <td className="p-4 text-right">
//                           {/* Edit sirf pehle slot ki ID pe — ek hi slot ho tab */}
//                           {group.total === 1 && (
//                             <button
//                               onClick={() => {
//                                 setEditingId(group.ids[0]);
//                                 setFormData({ date: group.date, time: group.time, seats: 1 });
//                               }}
//                               disabled={group.booked > 0}
//                               className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-30 mr-1"
//                             >
//                               <Edit2 size={14} />
//                             </button>
//                           )}
//                           {/* Delete — sirf available (unbooked) slots delete hogi */}
//                           <button
//                             onClick={() => {
//                               const unbookedId = slots.find(
//                                 (s) => s.date === group.date && s.time === group.time && !s.isBooked
//                               )?._id;
//                               if (unbookedId) handleSlotDelete(unbookedId);
//                               else alert("All slots in this group are booked — cannot delete.");
//                             }}
//                             className="p-1 text-slate-400 hover:text-red-600"
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

//       {/* ─── TAB 2: STUDENT BOOKING REQUESTS ─── */}
//       {activeTab === "requests" && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
//             <span className="text-sm font-semibold text-slate-700">
//               Incoming Student Appointments ({bookings.length})
//             </span>
//             <button
//               onClick={fetchBookings}
//               className="p-1.5 text-slate-600 border bg-white rounded-md hover:bg-slate-50"
//             >
//               <RefreshCw size={14} />
//             </button>
//           </div>

//           {loading ? (
//             <div className="p-12 text-center text-sm text-slate-400">
//               Fetching live appointment data...
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="p-12 text-center text-sm text-slate-400">
//               No counseling applications received yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase">
//                   <tr>
//                     <th className="p-4">Student Details</th>
//                     <th className="p-4">Course Info</th>
//                     <th className="p-4">Requested Slot</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4 text-center">Approval Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {bookings.map((req) => (
//                     <tr key={req._id} className="hover:bg-slate-50/50">

//                       <td className="p-4 space-y-0.5">
//                         <div className="font-bold text-slate-900">
//                           {req.studentName || req.name || "Unknown Student"}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           {req.studentEmail || req.email}
//                         </div>
//                         <div className="text-xs font-medium text-slate-700">
//                           {req.studentMobile || req.mobile}
//                         </div>
//                       </td>

//                       <td className="p-4">
//                         <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded border border-blue-100">
//                           {req.course || "General Consultation"}
//                         </span>
//                         {req.branch && (
//                           <div className="text-xs text-slate-500 mt-1">
//                             Branch: {req.branch}
//                           </div>
//                         )}
//                       </td>

//                       <td className="p-4 text-slate-700 space-y-0.5">
//                         <div className="font-semibold text-xs text-[#05347f] flex items-center gap-1">
//                           <Calendar size={12} />
//                           {req.slotDate || req.date || "N/A"}
//                         </div>
//                         <div className="text-xs font-medium flex items-center gap-1 text-slate-500">
//                           <Clock size={12} />
//                           {req.slotTime || req.time || "N/A"}
//                         </div>
//                       </td>

//                       <td className="p-4">
//                         {req.status === "approved" || req.status === "Approved" ? (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
//                             <CheckCircle size={12} /> Approved
//                           </span>
//                         ) : req.status === "rejected" || req.status === "Rejected" ? (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
//                             <XCircle size={12} /> Rejected
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
//                             Pending Admin
//                           </span>
//                         )}
//                       </td>

//                       <td className="p-4">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleStatusUpdate(req._id, "approved")}
//                             disabled={req.status === "approved" || req.status === "Approved"}
//                             className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-40"
//                           >
//                             <UserCheck size={12} /> Approve
//                           </button>
//                           <button
//                             onClick={() => handleStatusUpdate(req._id, "rejected")}
//                             disabled={req.status === "rejected" || req.status === "Rejected"}
//                             className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-medium rounded-md text-xs border border-red-100 transition-all cursor-pointer disabled:opacity-40"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  UserCheck,
  Users,
  Copy,
} from "lucide-react";
import api from "@/utlis/api";

export default function AdminSlots() {
  const [activeTab, setActiveTab] = useState("manage");
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ date: "", time: "", seats: 1 });
  const [editingId, setEditingId] = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");

  // 1. Fetch All Slots
  const fetchAllSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/slot/admin/all");
      if (res.data?.success) setSlots(res.data.data || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Booked Slots
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/slot/admin/all");
      if (res.data?.success) {
        const bookedOnly = (res.data.data || []).filter((s) => s.isBooked);
        setBookings(bookedOnly);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "manage") fetchAllSlots();
    else fetchBookings();
  }, [activeTab]);

  // 3. Add / Update Slot
  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time)
      return alert("Please fill in both date and time fields.");

    setFormSubmitLoading(true);
    setBulkProgress("");

    try {
      if (editingId) {
        const res = await api.put(`/api/v1/slot/admin/update/${editingId}`, {
          date: formData.date,
          time: formData.time,
        });
        if (res.data?.success) {
          alert("Slot updated successfully!");
          setEditingId(null);
        }
      } else {
        const totalSeats = parseInt(formData.seats) || 1;

        if (totalSeats === 1) {
          const res = await api.post("/api/v1/slot/add", {
            date: formData.date,
            time: formData.time,
          });
          if (res.data?.success) alert("New slot added successfully!");
        } else {
          let successCount = 0;
          for (let i = 0; i < totalSeats; i++) {
            setBulkProgress(`Creating ${i + 1} / ${totalSeats}...`);
            try {
              await api.post("/api/v1/slot/add", {
                date: formData.date,
                time: formData.time,
              });
              successCount++;
            } catch {
              // skip failed, continue
            }
          }
          setBulkProgress("");
          alert(`${successCount} / ${totalSeats} slots created successfully!`);
        }
      }

      setFormData({ date: "", time: "", seats: 1 });
      fetchAllSlots();
    } catch (err) {
      alert("Error saving slot.");
    } finally {
      setFormSubmitLoading(false);
      setBulkProgress("");
    }
  };

  // 4. Delete Slot
  const handleSlotDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      const res = await api.delete(`/api/v1/slot/admin/delete/${id}`);
      if (res.data?.success) {
        alert("Slot deleted successfully!");
        fetchAllSlots();
      }
    } catch (err) {
      alert("Error deleting slot.");
    }
  };

  // 5. ✅ FIXED — Approve / Reject with correct API routes
  const handleStatusUpdate = async (bookingId, newStatus, studentName) => {
    const action = newStatus === "approved" ? "approve" : "reject";
    if (
      !window.confirm(
        `Are you sure you want to ${action} ${studentName || "this student"}'s request?`
      )
    )
      return;

    try {
      let res;

      if (newStatus === "approved") {
        // ✅ Approve route — auto email jaayega backend se
        res = await api.put(`/api/v1/slot/admin/approve/${bookingId}`);
      } else {
        // ✅ Reject route — reason optional
        const reason = window.prompt(
          `Rejection reason for ${studentName || "student"}? (optional — student ko email mein dikhega)`
        );
        res = await api.put(`/api/v1/slot/admin/reject/${bookingId}`, {
          rejectionReason: reason || "",
        });
      }

      if (res.data?.success) {
        alert(
          newStatus === "approved"
            ? "✅ Booking approved! Confirmation email sent to student."
            : "❌ Booking rejected. Student has been notified via email."
        );
        fetchBookings();
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  // Group slots by date+time
  const groupedSlots = slots.reduce((acc, slot) => {
    const key = `${slot.date}__${slot.time}`;
    if (!acc[key]) {
      acc[key] = { date: slot.date, time: slot.time, total: 0, booked: 0, ids: [] };
    }
    acc[key].total += 1;
    if (slot.isBooked) acc[key].booked += 1;
    acc[key].ids.push(slot._id);
    return acc;
  }, {});

  const groupedList = Object.values(groupedSlots);

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-800">

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "manage"
              ? "bg-[#05347f] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Calendar size={16} /> Manage & Create Slots
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "requests"
              ? "bg-[#05347f] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users size={16} />
          Student Booking Requests
          {bookings.filter((b) => b.status === "pending").length > 0 && (
            <span className="ml-1 bg-amber-400 text-white text-[10px] font-bold
                             px-1.5 py-0.5 rounded-full">
              {bookings.filter((b) => b.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {/* ─── TAB 1: MANAGE SLOTS ─── */}
      {activeTab === "manage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create / Edit Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus size={18} className="text-[#05347f]" />
              {editingId ? "Modify Slot" : "Add Counseling Slot"}
            </h2>

            <form onSubmit={handleSlotSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">
                  Date (e.g., Wed, Jun 11)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wed, Jun 11"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200
                             rounded-lg focus:border-[#05347f] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">
                  Time (e.g., 11:00 AM)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 11:00 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200
                             rounded-lg focus:border-[#05347f] outline-none"
                />
              </div>

              {!editingId && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Copy size={12} className="text-[#05347f]" />
                    Seats / Capacity
                    <span className="text-slate-400 font-normal ml-1">
                      (kitne students book kar sakte hain)
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="e.g., 11"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200
                               rounded-lg focus:border-[#05347f] outline-none"
                  />
                  {parseInt(formData.seats) > 1 && (
                    <p className="text-xs text-[#05347f] bg-blue-50 border border-blue-100
                                  rounded-lg px-3 py-1.5 mt-1">
                      {formData.seats} identical slots banaenge — ek baar mein{" "}
                      {formData.seats} students book kar sakenge
                    </p>
                  )}
                </div>
              )}

              {bulkProgress && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100
                                rounded-lg px-3 py-2">
                  ⏳ {bulkProgress}
                </div>
              )}

              <div className="flex gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ date: "", time: "", seats: 1 });
                    }}
                    className="flex-1 py-2 text-sm border border-slate-200 rounded-lg
                               hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="flex-1 py-2 bg-[#05347f] text-white rounded-lg text-sm
                             font-semibold disabled:opacity-60 hover:bg-[#03276b]
                             transition-colors"
                >
                  {formSubmitLoading
                    ? bulkProgress || "Saving..."
                    : editingId
                    ? "Update Now"
                    : parseInt(formData.seats) > 1
                    ? `Create ${formData.seats} Slots`
                    : "Create Slot"}
                </button>
              </div>
            </form>
          </div>

          {/* Grouped Slots Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200
                          shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">
                All Slots ({groupedList.length} time slots)
              </span>
              <button
                onClick={fetchAllSlots}
                className="p-1.5 text-slate-600 border bg-white rounded-md hover:bg-slate-50"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Loading slots...
              </div>
            ) : groupedList.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No slots created yet.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b text-xs font-semibold
                                  text-slate-500 uppercase">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Seats</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groupedList.map((group) => {
                    const available = group.total - group.booked;
                    return (
                      <tr
                        key={`${group.date}-${group.time}`}
                        className="hover:bg-slate-50/50"
                      >
                        <td className="p-4 font-semibold text-slate-900">
                          {group.date}
                        </td>
                        <td className="p-4 text-slate-600">{group.time}</td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-green-700
                                            bg-green-50 border border-green-100
                                            rounded-full px-2 py-0.5">
                              {available} free
                            </span>
                            <span className="text-xs text-slate-400">
                              / {group.total}
                            </span>
                            {group.booked > 0 && (
                              <span className="text-xs text-amber-700 bg-amber-50
                                              border border-amber-100 rounded-full
                                              px-2 py-0.5">
                                {group.booked} booked
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          {available === 0 ? (
                            <span className="px-2 py-0.5 bg-red-50 text-red-700
                                            border border-red-100 rounded-full
                                            text-xs font-medium">
                              Full
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700
                                            border border-green-100 rounded-full
                                            text-xs font-medium">
                              Available
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          {group.total === 1 && (
                            <button
                              onClick={() => {
                                setEditingId(group.ids[0]);
                                setFormData({
                                  date: group.date,
                                  time: group.time,
                                  seats: 1,
                                });
                              }}
                              disabled={group.booked > 0}
                              className="p-1 text-slate-500 hover:text-blue-600
                                         disabled:opacity-30 mr-1"
                              title="Edit slot"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const unbookedId = slots.find(
                                (s) =>
                                  s.date === group.date &&
                                  s.time === group.time &&
                                  !s.isBooked
                              )?._id;
                              if (unbookedId) handleSlotDelete(unbookedId);
                              else
                                alert(
                                  "All slots in this group are booked — cannot delete."
                                );
                            }}
                            className="p-1 text-slate-400 hover:text-red-600"
                            title="Delete one free slot"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: STUDENT BOOKING REQUESTS ─── */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                Incoming Student Appointments ({bookings.length})
              </span>
              {bookings.filter((b) => b.status === "pending").length > 0 && (
                <span className="text-xs bg-amber-50 text-amber-700 border
                                 border-amber-100 rounded-full px-2.5 py-0.5 font-medium">
                  {bookings.filter((b) => b.status === "pending").length} pending approval
                </span>
              )}
            </div>
            <button
              onClick={fetchBookings}
              className="p-1.5 text-slate-600 border bg-white rounded-md hover:bg-slate-50"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">
              Fetching live appointment data...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">
              No counseling applications received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b text-xs font-semibold
                                  text-slate-500 uppercase">
                  <tr>
                    <th className="p-4">Student Details</th>
                    <th className="p-4">Course Info</th>
                    <th className="p-4">Requested Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50">

                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-slate-900">
                          {req.studentName || req.name || "Unknown Student"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {req.studentEmail || req.email}
                        </div>
                        <div className="text-xs font-medium text-slate-700">
                          {req.studentMobile || req.mobile}
                        </div>
                        {req.city && (
                          <div className="text-xs text-slate-400">{req.city}</div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="text-xs bg-blue-50 text-blue-700 font-semibold
                                         px-2 py-1 rounded border border-blue-100">
                          {req.course || "General Consultation"}
                        </span>
                        {req.branch && (
                          <div className="text-xs text-slate-500 mt-1">
                            {req.branch}
                          </div>
                        )}
                        {req.description && (
                          <div className="text-xs text-slate-400 mt-1 max-w-[160px]
                                          truncate" title={req.description}>
                            "{req.description}"
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-slate-700 space-y-0.5">
                        <div className="font-semibold text-xs text-[#05347f]
                                        flex items-center gap-1">
                          <Calendar size={12} />
                          {req.date || "N/A"}
                        </div>
                        <div className="text-xs font-medium flex items-center
                                        gap-1 text-slate-500">
                          <Clock size={12} />
                          {req.time || "N/A"}
                        </div>
                      </td>

                      <td className="p-4">
                        {req.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5
                                           rounded-full text-xs font-medium bg-green-50
                                           text-green-700 border border-green-100">
                            <CheckCircle size={12} /> Approved
                          </span>
                        ) : req.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5
                                           rounded-full text-xs font-medium bg-red-50
                                           text-red-700 border border-red-100">
                            <XCircle size={12} /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5
                                           rounded-full text-xs font-medium bg-amber-50
                                           text-amber-700 border border-amber-100
                                           animate-pulse">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ✅ FIXED — correct API routes + studentName passed */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                req._id,
                                "approved",
                                req.studentName || req.name
                              )
                            }
                            disabled={req.status === "approved"}
                            className="flex items-center gap-1 px-2.5 py-1.5
                                       bg-green-600 hover:bg-green-700 text-white
                                       font-medium rounded-md text-xs transition-colors
                                       shadow-sm cursor-pointer disabled:opacity-40
                                       disabled:cursor-not-allowed"
                          >
                            <UserCheck size={12} /> Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                req._id,
                                "rejected",
                                req.studentName || req.name
                              )
                            }
                            disabled={req.status === "rejected"}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600
                                       text-red-600 hover:text-white font-medium
                                       rounded-md text-xs border border-red-100
                                       transition-all cursor-pointer
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Reject
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
      )}
    </div>
  );
}