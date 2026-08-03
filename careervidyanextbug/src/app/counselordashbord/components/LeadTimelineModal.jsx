"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  X, MapPin, UserPlus, MessageSquare, Trophy, XCircle, LogIn,
  Eye, GraduationCap, FileCheck, Download, Zap, Clock,
} from "lucide-react";

const ICONS = {
  lead_created: MapPin,
  assigned: UserPlus,
  follow_up: MessageSquare,
  admission: Trophy,
  lost: XCircle,
  lead_logged_in: LogIn,
  lead_revisited: Eye,
  page_visit: Eye,
  course_view: GraduationCap,
  applied: FileCheck,
  registered: FileCheck,
  brochure: Download,
  automation: Zap,
};

export default function LeadTimelineModal({ leadId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leadId) return;
    api
      .get(`/api/v1/leads/${leadId}/timeline`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [leadId]);

  const fmt = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-700 uppercase flex items-center gap-2 text-sm">
            <Clock size={16} className="text-indigo-600" /> Activity Timeline
            {data?.lead?.name && <span className="text-gray-400 font-medium">— {data.lead.name}</span>}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
          ) : !data?.timeline?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">No activity recorded yet.</p>
          ) : (
            <>
              {!data.matchedStudent && (
                <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg p-2 mb-3">
                  This lead hasn't matched a website account yet, so only CRM-side events (assignment,
                  follow-ups, status changes) are shown — no page-visit history.
                </p>
              )}
              <ol className="relative border-l-2 border-slate-100 ml-2 space-y-4">
                {data.timeline.map((event, i) => {
                  const Icon = ICONS[event.type] || Clock;
                  return (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-[9px] bg-indigo-600 w-4 h-4 rounded-full flex items-center justify-center">
                        <Icon size={9} className="text-white" />
                      </span>
                      <p className="text-[11px] text-gray-400 font-mono">{fmt(event.time)}</p>
                      <p className="text-sm text-slate-700 font-medium">{event.label}</p>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
