"use client";

import { useRouter } from "next/navigation";
import { X, Phone, MessageCircle, ExternalLink, MapPin, Clock, GraduationCap, LogIn } from "lucide-react";

export default function ReturningVisitorAlert({ notification, onClose }) {
  const router = useRouter();
  const meta = notification.meta || {};

  const fmt = (d) => (d ? new Date(d).toLocaleString() : "First visit — no prior record");

  const openCRM = () => {
    router.push("/counselordashbord/lead");
    onClose();
  };

  const phone = meta.phone?.replace(/\D/g, "");

  return (
    <div className="fixed bottom-6 right-6 bg-white border-2 border-amber-400 shadow-2xl rounded-xl w-96 z-[100] overflow-hidden">
      <div className="bg-amber-400 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
          🔔 Returning Visitor — Live Now
        </span>
        <button onClick={onClose} className="text-amber-900">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <p className="text-lg font-bold text-slate-800">{meta.leadName || "Unknown Lead"}</p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <ExternalLink size={12} /> {meta.currentPage || "—"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {fmt(meta.currentTime)}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap size={12} /> {meta.courseInterested || "—"}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {meta.location || "Unknown"}
          </span>
          <span className="flex items-center gap-1 col-span-2">
            <LogIn size={12} /> {meta.loginStatus || "—"}
          </span>
        </div>

        <p className="text-[11px] text-gray-400 pt-1 border-t">
          Last visit: {fmt(meta.lastVisit)}
        </p>

        <div className="flex gap-2 pt-2">
          {phone && (
            <>
              <a
                href={`tel:${phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-semibold"
              >
                <Phone size={13} /> Call
              </a>
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-xs font-semibold"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </>
          )}
          <button
            onClick={openCRM}
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2 rounded-lg text-xs font-semibold"
          >
            Open CRM
          </button>
        </div>
      </div>
    </div>
  );
}
