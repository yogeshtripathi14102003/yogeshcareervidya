// "use client";
// import React, { useState, useEffect } from "react";
// import api from "@/utlis/api.js";
// import { Send, CheckCircle, Clock, User, Trash2, Bell, Radio } from "lucide-react";

// export default function AdminTiket() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeNote, setActiveNote] = useState({ id: "", text: "" });
//   const [notifyAllText, setNotifyAllText] = useState("");
//   const [sending, setSending] = useState(false);
//   const [sendingAll, setSendingAll] = useState(false);

//   // ─── Fetch Tickets ───────────────────────────────────────────────
//   const fetchTickets = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/tickat");
//       if (res.data.success) setTickets(res.data.data);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   // ─── Notify Single Counselor (ticket-specific) ───────────────────
//   const handleNotify = async (ticketId) => {
//     if (!activeNote.text.trim()) return alert("Please type a message");
//     try {
//       setSending(true);
//       const res = await api.patch(`/api/v1/tickat/${ticketId}/notify`, {
//         message: activeNote.text,
//       });
//       if (res.data.success) {
//         alert("Message sent to counselor!");
//         setActiveNote({ id: "", text: "" });
//         fetchTickets();
//       }
//     } catch (err) {
//       alert("Failed to send message");
//     } finally {
//       setSending(false);
//     }
//   };

//   // ─── Notify All Counselors (global broadcast) ────────────────────
//   // Uses a dedicated broadcast endpoint so it's stored separately
//   // from per-ticket adminMessages.
//   // If you don't have that endpoint yet, fall back to patching every ticket.
//   const handleNotifyAll = async () => {
//     if (!notifyAllText.trim()) return alert("Please type a message");
//     try {
//       setSendingAll(true);

//       await api.post("/api/v1/tickat/notify-all", { message: notifyAllText });

//       alert("Broadcast sent to all counselors!");
//       setNotifyAllText("");
//       fetchTickets();
//     } catch (err) {
//       alert("Failed to broadcast message");
//     } finally {
//       setSendingAll(false);
//     }
//   };

//   // ─── Resolve Ticket ──────────────────────────────────────────────
//   const handleResolve = async (ticketId) => {
//     const summary = prompt("Enter resolution summary:");
//     if (!summary) return;
//     try {
//       const res = await api.put(`/api/v1/tickat/${ticketId}/resolve`, {
//         summary,
//         status: "Resolved",
//       });
//       if (res.data.success) {
//         alert("Ticket marked as Resolved");
//         fetchTickets();
//       }
//     } catch (err) {
//       alert("Error resolving ticket");
//     }
//   };

//   // ─── Delete Ticket ───────────────────────────────────────────────
//   const handleDelete = async (ticketId) => {
//     if (!confirm("Are you sure you want to delete this ticket?")) return;
//     try {
//       const res = await api.delete(`/api/v1/tickat/${ticketId}`);
//       if (res.data.success) {
//         alert("Ticket deleted successfully");
//         fetchTickets();
//       }
//     } catch (err) {
//       alert("Error deleting ticket");
//     }
//   };

//   // ─── Loading state ───────────────────────────────────────────────
//   if (loading)
//     return (
//       <div className="p-20 text-center text-gray-500 animate-pulse">
//         Loading tickets...
//       </div>
//     );

//   return (
//     <div className="w-full space-y-6">

//       {/* ── Page header ────────────────────────────────────────────── */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-800">Counselor Tickets</h2>
//         <button
//           onClick={fetchTickets}
//           className="text-sm text-blue-600 hover:underline"
//         >
//           Refresh List
//         </button>
//       </div>

//       {/* ── BROADCAST — Notify ALL counselors ──────────────────────── */}
//       {/* This message goes into globalMessages (shown in ALL counselor
//           dashboards as a top banner, separate from ticket replies) */}
//       <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
//         <div className="flex items-center gap-2 mb-2">
//           <Radio size={15} className="text-amber-700" />
//           <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
//             Broadcast to All Counselors
//           </p>
//         </div>
//         <p className="text-[11px] text-amber-600 mb-3">
//           This message will appear as a top notification banner for every counselor.
//         </p>
//         <textarea
//           className="w-full border border-amber-200 p-2 text-sm rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
//           placeholder="Type broadcast message..."
//           rows="3"
//           value={notifyAllText}
//           onChange={(e) => setNotifyAllText(e.target.value)}
//         />
//         <button
//           onClick={handleNotifyAll}
//           disabled={sendingAll}
//           className="mt-2 w-full bg-amber-500 text-white py-2 rounded text-xs font-bold hover:bg-amber-600 disabled:bg-gray-300 flex items-center justify-center gap-2"
//         >
//           <Bell size={13} />
//           {sendingAll ? "Sending..." : "Send Broadcast to All"}
//         </button>
//       </div>

//       {/* ── Tickets list ───────────────────────────────────────────── */}
//       <div className="grid gap-6">
//         {tickets.length === 0 ? (
//           <div className="p-10 text-center border-2 border-dashed rounded-xl text-gray-400">
//             No tickets found.
//           </div>
//         ) : (
//           tickets.map((ticket) => (
//             <div
//               key={ticket._id}
//               className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
//             >
//               {/* Header */}
//               <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                   {ticket.status === "Resolved" ? (
//                     <CheckCircle className="text-green-500" size={20} />
//                   ) : (
//                     <Clock className="text-amber-500 animate-pulse" size={20} />
//                   )}
//                   <div>
//                     <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
//                     <span className="text-[10px] text-gray-400">
//                       ID: {ticket._id?.slice(-6)}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(ticket._id)}
//                   className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold"
//                 >
//                   <Trash2 size={14} />
//                   Delete
//                 </button>
//               </div>

//               {/* Body */}
//               <div className="p-4 grid md:grid-cols-2 gap-6">
//                 {/* Left — issue details */}
//                 <div className="space-y-3">
//                   <p className="text-sm text-gray-700 leading-relaxed">
//                     {ticket.description?.issue}
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                       <User size={13} />
//                       Counselor:{" "}
//                       <strong className="ml-1">
//                         {ticket.counselorId?.name || ticket.counselor?.name || "N/A"}
//                       </strong>
//                     </div>
//                     <span
//                       className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
//                         ticket.description?.urgency === "Urgent"
//                           ? "bg-red-100 text-red-700 animate-pulse"
//                           : ticket.description?.urgency === "High"
//                           ? "bg-orange-100 text-orange-700"
//                           : "bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       {ticket.description?.urgency || "Medium"}
//                     </span>
//                   </div>

//                   {/* Previous admin messages on this ticket */}
//                   {ticket.adminMessages?.length > 0 && (
//                     <div className="mt-2 space-y-2">
//                       <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">
//                         Previous replies on this ticket
//                       </p>
//                       <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
//                         {ticket.adminMessages.map((msg, idx) => (
//                           <div
//                             key={idx}
//                             className="bg-indigo-50 border border-indigo-100 rounded p-2"
//                           >
//                             <p className="text-xs text-indigo-800">{msg.message}</p>
//                             <p className="text-[9px] text-gray-400 mt-0.5">
//                               {new Date(
//                                 msg.timestamp || ticket.updatedAt
//                               ).toLocaleString()}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Right — send reply to THIS counselor (ticket-specific) */}
//                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
//                   <p className="text-[10px] font-bold text-blue-700 uppercase mb-2 flex items-center gap-1">
//                     <Send size={11} />
//                     Reply to this counselor only
//                   </p>
//                   <textarea
//                     className="w-full border p-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
//                     placeholder="Send message to this counselor..."
//                     rows="3"
//                     value={activeNote.id === ticket._id ? activeNote.text : ""}
//                     onChange={(e) =>
//                       setActiveNote({ id: ticket._id, text: e.target.value })
//                     }
//                   />
//                   <button
//                     disabled={ticket.status === "Resolved" || sending}
//                     onClick={() => handleNotify(ticket._id)}
//                     className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded text-xs font-bold hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-1"
//                   >
//                     <Send size={12} />
//                     {sending && activeNote.id === ticket._id
//                       ? "Sending..."
//                       : "Send Ping"}
//                   </button>
//                   {ticket.status === "Resolved" && (
//                     <p className="text-[10px] text-gray-400 text-center mt-1">
//                       Ticket resolved — replies disabled
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
//                 <span className="text-[10px] text-gray-400">
//                   Created: {new Date(ticket.createdAt).toLocaleDateString()}
//                 </span>
//                 {ticket.status !== "Resolved" ? (
//                   <button
//                     onClick={() => handleResolve(ticket._id)}
//                     className="bg-green-600 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-green-700"
//                   >
//                     Resolve Ticket
//                   </button>
//                 ) : (
//                   <div className="text-green-600 font-bold text-xs flex items-center gap-1">
//                     <CheckCircle size={13} /> Resolved
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { Send, CheckCircle, Clock, User, Trash2, Bell, Radio, RefreshCw } from "lucide-react";

export default function AdminTiket() {
  const [tickets, setTickets] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);
  const [activeNote, setActiveNote] = useState({ id: "", text: "" });
  const [notifyAllText, setNotifyAllText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);

  // ─── 1. FETCH TICKETS (सारे टिकट्स लाना) ──────────────────────────────────
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/tickat");
      if (res.data.success) {
        setTickets(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Tickets Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. FETCH BROADCASTS (सारे ब्रॉडकास्ट संदेश लाना) ───────────────────────
  const fetchBroadcasts = async () => {
    try {
      setLoadingBroadcasts(true);
      // यह आपके नए router.get('/notify-all') रूट को कॉल करेगा
      const res = await api.get("/api/v1/tickat/notify-all"); 
      if (res.data && res.data.success) {
        setBroadcasts(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Broadcasts Error:", err);
    } finally {
      setLoadingBroadcasts(false);
    }
  };

  // कंपोनेंट लोड होते ही टिकट्स और ब्रॉडकास्ट दोनों फेच होंगे
  useEffect(() => {
    fetchTickets();
    fetchBroadcasts();
  }, []);

  // ─── 3. BROADCAST TO ALL (सभी काउंसलर्स को मैसेज भेजना) ────────────────────
  const handleNotifyAll = async () => {
    if (!notifyAllText.trim()) return alert("Please type a message");
    try {
      setSendingAll(true);
      const res = await api.post("/api/v1/tickat/notify-all", { message: notifyAllText });

      if (res.data.success) {
        alert("Broadcast sent to all counselors!");
        setNotifyAllText("");
        fetchBroadcasts(); // नया ब्रॉडकास्ट भेजने के बाद लिस्ट को तुरंत अपडेट करें
      }
    } catch (err) {
      console.error("Broadcast Post Error:", err);
      alert("Failed to broadcast message.");
    } finally {
      setSendingAll(false);
    }
  };

  // ─── 4. DELETE BROADCAST (ब्रॉडकास्ट मैसेज डिलीट करना) ──────────────────────
  const handleDeleteBroadcast = async (broadcastId) => {
    if (!confirm("Are you sure you want to delete this broadcast notification?")) return;
    try {
      // यह आपके नए router.delete('/notify-all/:id') रूट को कॉल करेगा
      const res = await api.delete(`/api/v1/tickat/notify-all/${broadcastId}`);
      if (res.data.success) {
        alert("Broadcast deleted successfully");
        fetchBroadcasts(); // डिलीट होने के बाद लिस्ट को तुरंत रीलोड करें
      }
    } catch (err) {
      console.error("Delete Broadcast Error:", err);
      alert("Failed to delete broadcast.");
    }
  };

  // ─── 5. REPLY TO SINGLE COUNSELOR (सिर्फ एक स्पेसिफिक टिकट पर रिप्लाई) ─────────
  const handleNotify = async (ticketId) => {
    if (!activeNote.text.trim()) return alert("Please type a message");
    try {
      setSending(true);
      const res = await api.patch(`/api/v1/tickat/${ticketId}/notify`, {
        message: activeNote.text,
      });
      if (res.data.success) {
        alert("Message sent to counselor!");
        setActiveNote({ id: "", text: "" });
        fetchTickets(); // रिप्लाई दिखने के लिए टिकट लिस्ट रीलोड करें
      }
    } catch (err) {
      console.error("Single Notify Error:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ─── 6. RESOLVE TICKET (टिकट क्लोज करना) ──────────────────────────────────
  const handleResolve = async (ticketId) => {
    const summary = prompt("Enter resolution summary:");
    if (!summary) return;
    try {
      const res = await api.put(`/api/v1/tickat/${ticketId}/resolve`, {
        summary,
        status: "Resolved",
      });
      if (res.data.success) {
        alert("Ticket marked as Resolved");
        fetchTickets();
      }
    } catch (err) {
      console.error("Resolve Error:", err);
      alert("Error resolving ticket");
    }
  };

  // ─── 7. DELETE TICKET (टिकट को पूरी तरह डिलीट करना) ─────────────────────────
  const handleDelete = async (ticketId) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await api.delete(`/api/v1/tickat/${ticketId}`);
      if (res.data.success) {
        alert("Ticket deleted successfully");
        fetchTickets();
      }
    } catch (err) {
      console.error("Delete Ticket Error:", err);
      alert("Error deleting ticket");
    }
  };

  // ─── LOADING STATE ────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="p-20 text-center text-gray-500 flex flex-col items-center justify-center gap-2 animate-pulse">
        <RefreshCw className="animate-spin text-blue-500" size={30} />
        <span className="font-medium">Loading Counselor Dashboard...</span>
      </div>
    );

  return (
    <div className="w-full space-y-8 p-4 max-w-6xl mx-auto">

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Control Panel</h2>
          <p className="text-xs text-gray-500">Manage counselor tickets and global broadcasts</p>
        </div>
        <button
          onClick={() => { fetchTickets(); fetchBroadcasts(); }}
          className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-semibold transition-all"
        >
          <RefreshCw size={13} />
          Refresh Dashboard
        </button>
      </div>

      {/* ── BROADCAST SECTION (फॉर्म और हिस्ट्री साथ में) ───────────────────── */}
      <div className="grid md:grid-cols-5 gap-6">
        
        {/* Left: Broadcast Form */}
        <div className="md:col-span-2 bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio size={16} className="text-amber-700 animate-pulse" />
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                New Global Broadcast
              </p>
            </div>
            <p className="text-[11px] text-amber-600 mb-3 leading-relaxed">
              This message will appear instantly as a top notification banner on every counselor's dashboard.
            </p>
            <textarea
              className="w-full border border-amber-200 p-2 text-sm rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[100px] resize-none shadow-sm"
              placeholder="Type urgent notice or broadcast message here..."
              value={notifyAllText}
              onChange={(e) => setNotifyAllText(e.target.value)}
            />
          </div>
          <button
            onClick={handleNotifyAll}
            disabled={sendingAll}
            className="mt-3 w-full bg-amber-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-amber-600 disabled:bg-gray-300 flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Bell size={13} />
            {sendingAll ? "Publishing..." : "Send Broadcast to All"}
          </button>
        </div>

        {/* Right: Active Broadcast History List */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-gray-700 flex items-center gap-2 mb-3 uppercase tracking-wide">
            <Bell size={15} className="text-amber-500" />
            Active Broadcast History
          </h3>
          
          {loadingBroadcasts ? (
            <div className="text-xs text-gray-400 py-8 text-center animate-pulse">Loading active broadcasts...</div>
          ) : broadcasts.length === 0 ? (
            <div className="text-xs text-gray-400 border-2 border-dashed rounded-lg p-8 text-center my-auto">
              No active broadcast announcements found.
            </div>
          ) : (
            <div className="space-y-2 max-h-[185px] overflow-y-auto pr-1 flex-1">
              {broadcasts.map((b) => (
                <div 
                  key={b._id} 
                  className="flex justify-between items-start bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs hover:border-amber-200 transition-colors"
                >
                  <div className="space-y-1 flex-1 mr-4">
                    <p className="text-gray-800 font-medium leading-relaxed">{b.message}</p>
                    <span className="text-[10px] text-gray-400 block">
                      Sent: {b.createdAt ? new Date(b.createdAt).toLocaleString() : "Just now"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteBroadcast(b._id)}
                    className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors shrink-0"
                    title="Delete Broadcast Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <hr className="border-gray-200" />

      {/* ── TICKETS LIST SECTION ───────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800">Active Counselor Tickets</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {tickets.length}
          </span>
        </div>

        <div className="grid gap-6">
          {tickets.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed rounded-xl text-gray-400 font-medium bg-gray-50/50">
              🎉 No open support tickets found from counselors.
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${
                  ticket.status === "Resolved" ? "border-gray-200 opacity-80" : "border-blue-100 hover:border-blue-300"
                }`}
              >
                {/* Ticket Header */}
                <div className="p-4 bg-gray-50/70 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {ticket.status === "Resolved" ? (
                      <CheckCircle className="text-green-500 shrink-0" size={20} />
                    ) : (
                      <Clock className="text-amber-500 animate-pulse shrink-0" size={20} />
                    )}
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-base">{ticket.subject}</h4>
                      <span className="text-[10px] text-gray-400 font-mono block">
                        TICKET ID: {ticket._id}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold bg-white border border-red-100 px-2.5 py-1 rounded-md shadow-sm transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>

                {/* Ticket Body */}
                <div className="p-4 grid md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Details & Previous Replies */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {ticket.description?.issue || "No description provided."}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                          <User size={12} className="text-gray-400" />
                          Counselor: <strong className="text-gray-800">{ticket.counselorId?.name || ticket.counselor?.name || "Unknown"}</strong>
                        </div>
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                            ticket.description?.urgency === "Urgent"
                              ? "bg-red-100 text-red-700 animate-pulse"
                              : ticket.description?.urgency === "High"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ticket.description?.urgency || "Medium"} Priority
                        </span>
                      </div>
                    </div>

                    {/* Chat Logs/Previous admin messages */}
                    {ticket.adminMessages && ticket.adminMessages.length > 0 && (
                      <div className="mt-2 space-y-2 border-t pt-3">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                          Reply Thread Logs
                        </p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                          {ticket.adminMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-2.5 text-xs"
                            >
                              <p className="text-indigo-950 font-medium">{msg.message}</p>
                              <p className="text-[9px] text-gray-400 mt-1 font-mono">
                                {new Date(msg.timestamp || ticket.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Send Private Ping/Reply */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-blue-700 uppercase mb-2 flex items-center gap-1 tracking-wide">
                        <Send size={12} />
                        Direct Response to this Counselor
                      </p>
                      <textarea
                        className="w-full border border-blue-100 p-2.5 text-sm rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] resize-none shadow-inner"
                        placeholder={ticket.status === "Resolved" ? "Replies are locked for resolved tickets." : "Send internal alert or resolution progress updates..."}
                        disabled={ticket.status === "Resolved"}
                        value={activeNote.id === ticket._id ? activeNote.text : ""}
                        onChange={(e) =>
                          setActiveNote({ id: ticket._id, text: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <button
                        disabled={ticket.status === "Resolved" || sending}
                        onClick={() => handleNotify(ticket._id)}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Send size={12} />
                        {sending && activeNote.id === ticket._id ? "Sending Alert..." : "Send Private Ping"}
                      </button>
                      {ticket.status === "Resolved" && (
                        <p className="text-[10px] text-gray-400 text-center mt-1.5 italic">
                          Ticket is resolved. Replies are disabled.
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Ticket Footer */}
                <div className="px-4 py-3 bg-gray-50/70 border-t flex justify-between items-center text-xs">
                  <span className="text-[10px] text-gray-400 font-medium">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                  {ticket.status !== "Resolved" ? (
                    <button
                      onClick={() => handleResolve(ticket._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                      Resolve Ticket
                    </button>
                  ) : (
                    <div className="text-green-600 font-bold text-xs bg-green-50 border border-green-200 px-3 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <CheckCircle size={13} /> Resolved & Closed
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}