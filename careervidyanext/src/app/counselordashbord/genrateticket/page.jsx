"use client";
import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { AlertCircle, Send, CheckCircle2, Clock, MessageSquare, Tag } from "lucide-react";

export default function RaiseTicketPage() {
  const [formData, setFormData] = useState({
    subject: "",
    issue: "",
    goals: "",
    urgency: "Medium",
  });

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  // Fetch tickets
  const fetchMyTickets = async () => {
    try {
      const res = await api.get("/api/v1/tickat"); 
      if (res.data.success) {
        setMyTickets(res.data.data);
      }
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        subject: formData.subject,
        description: {
          issue: formData.issue,
          goals: formData.goals,
          urgency: formData.urgency,
        },
      };

      const res = await api.post("/api/v1/tickat", payload);

      if (res.data.success) {
        setStatus({ type: "success", msg: "Ticket raised successfully!" });
        setFormData({ subject: "", issue: "", goals: "", urgency: "Medium" });
        fetchMyTickets();
      }
    } catch (err) {
      setStatus({ 
        type: "error", 
        msg: err.response?.data?.message || "Failed to submit ticket." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT: COMPACT FORM */}
        <div className="w-full md:max-w-md bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-white border-b border-gray-100 p-5">
            <h1 className="text-lg font-semibold text-gray-800">Support Ticket</h1>
            <p className="text-xs text-gray-500 mt-0.5">Contact administration for assistance</p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {status.msg && (
              <div className={`flex items-center gap-2 p-3 rounded text-xs font-medium border ${
                status.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
              }`}>
                {status.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {status.msg}
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Subject</label>
              <input 
                type="text" 
                name="subject" 
                required 
                placeholder="Brief summary..."
                value={formData.subject} 
                onChange={handleChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Urgency Level</label>
              <select 
                name="urgency" 
                value={formData.urgency} 
                onChange={handleChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm bg-white outline-none focus:border-indigo-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Detailed Issue</label>
              <textarea 
                name="issue" 
                required 
                rows="4" 
                placeholder="Explain the problem in detail..."
                value={formData.issue} 
                onChange={handleChange} 
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all disabled:bg-gray-300"
            >
              {loading ? "Processing..." : <><Send size={15} /> Submit Ticket</>}
            </button>
          </form>
        </div>

        {/* RIGHT: TICKET FEED */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Clock size={16} /> Recent Activity
            </h2>
            <span className="text-[11px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              Total: {myTickets.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {myTickets.length === 0 ? (
              <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                No active tickets found.
              </div>
            ) : (
              myTickets.map((ticket) => (
                <div key={ticket._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-hover hover:shadow-md">
                  
                  {/* Ticket Header: Subject + Counselor + Status */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-indigo-400" />
                      <h3 className="text-[15px] font-semibold text-gray-800">{ticket.subject}</h3>
                      <span className="text-[12px] text-gray-500 ml-2">
                        by {ticket.counselor?.name || "Unknown"}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                    {ticket.description?.issue}
                  </p>

                  {/* Admin Note Section */}
                  {(ticket.status === 'Resolved' || ticket.adminMessages?.length > 0) && (
                    <div className="pt-3 border-t border-gray-50 space-y-2">
                      {ticket.adminMessages?.slice(-1).map((msg, i) => (
                        <div key={i} className="flex gap-2 items-start text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-600">
                          <MessageSquare size={13} className="mt-0.5 shrink-0" />
                          <span className="italic">{msg.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
