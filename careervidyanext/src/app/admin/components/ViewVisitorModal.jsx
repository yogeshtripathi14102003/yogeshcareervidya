"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import { X, MapPin, Monitor, Clock, Tag } from "lucide-react";

export default function ViewVisitorModal({ visitorId, onClose }) {
  const [visitor, setVisitor] = useState(null);
  const [journey, setJourney] = useState([]);
  const [journeyLoading, setJourneyLoading] = useState(false);

  useEffect(() => {
    if (!visitorId) return;
    api
      .get(`/api/v1/visitor/${visitorId}`)
      .then((res) => setVisitor(res.data.visitor))
      .catch((err) => console.error(err));
  }, [visitorId]);

  useEffect(() => {
    if (!visitor?.sessionId) return;
    setJourneyLoading(true);
    api
      .get(`/api/v1/analytics/visitor-journey/${visitor.sessionId}`)
      .then((res) => setJourney(res.data?.timeline || []))
      .catch((err) => console.error(err))
      .finally(() => setJourneyLoading(false));
  }, [visitor?.sessionId]);

  if (!visitor) return null;

  const fmtTime = (d) => (d ? new Date(d).toLocaleString() : "—");
  const fmtSecs = (s) => (s ? `${s}s` : "—");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 shadow rounded w-[640px] max-w-full relative max-h-[85vh] overflow-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-600">
          <X size={18} />
        </button>
        <h2 className="font-semibold text-xl mb-4">Visitor Detail</h2>

        {/* ---- Module 1: Identity & Location ---- */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
          <p><b>IP:</b> {visitor.ip || "—"}</p>
          <p className="flex items-center gap-1"><MapPin size={13} /> {[visitor.city, visitor.state, visitor.country].filter(Boolean).join(", ") || "Unknown"}</p>
          <p className="flex items-center gap-1"><Monitor size={13} /> {visitor.browser} · {visitor.os} · {visitor.device}</p>
          <p><b>Screen:</b> {visitor.screenResolution || "—"}</p>
          <p><b>Guest:</b> {visitor.isGuest ? "Yes" : "No (logged in)"}</p>
          <p><b>Total Visits:</b> {visitor.visits}</p>
        </div>

        {/* ---- Acquisition ---- */}
        <div className="text-sm mb-4 border-t pt-3">
          <p className="flex items-center gap-1"><Tag size={13} /> <b>Source:</b> {visitor.referralSource || "direct"}</p>
          <p><b>Landing Page:</b> {visitor.landingPage || "—"}</p>
          {(visitor.utmSource || visitor.utmCampaign) && (
            <p className="text-xs text-gray-500 mt-1">
              UTM: {visitor.utmSource || "—"} / {visitor.utmMedium || "—"} / {visitor.utmCampaign || "—"}
            </p>
          )}
        </div>

        {/* ---- Session lifecycle ---- */}
        <div className="text-sm mb-4 border-t pt-3 grid grid-cols-2 gap-x-6 gap-y-1">
          <p className="flex items-center gap-1"><Clock size={13} /> <b>Login:</b> {fmtTime(visitor.loginTime)}</p>
          <p className="flex items-center gap-1"><Clock size={13} /> <b>Logout:</b> {fmtTime(visitor.logoutTime)}</p>
          <p><b>Session Duration:</b> {fmtSecs(visitor.sessionDuration)}</p>
          <p><b>Last Active:</b> {fmtTime(visitor.lastActiveTime)}</p>
        </div>

        {/* ---- Module 2: Journey timeline ---- */}
        <h3 className="mt-4 font-semibold border-t pt-3">Journey Timeline</h3>
        {journeyLoading ? (
          <p className="text-xs text-gray-400 mt-2">Loading…</p>
        ) : journey.length === 0 ? (
          <p className="text-xs text-gray-400 mt-2">No detailed page-journey data for this session yet.</p>
        ) : (
          <ol className="mt-2 space-y-2 text-sm">
            {journey.map((p, i) => (
              <li key={p._id || i} className="border rounded-lg p-2">
                <div className="flex justify-between">
                  <span className="font-medium">{p.page}</span>
                  <span className="text-xs text-gray-400">{fmtTime(p.enterTime)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex gap-3">
                  <span>⏱ {fmtSecs(p.timeSpent)}</span>
                  <span>📜 {p.scrollPercentage || 0}% scrolled</span>
                  <span>🖱 {p.clickCount || 0} clicks</span>
                </div>
                {p.events?.length > 0 && (
                  <div className="text-xs text-indigo-600 mt-1">
                    {p.events.map((e, j) => (
                      <span key={j} className="inline-block mr-2">• {e.type}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}

        {/* ---- Legacy page counts (kept for backward compatibility) ---- */}
        {visitor.pages?.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold border-t pt-3">Pages Visited (all-time counts)</h3>
            <ul className="list-disc pl-5 text-sm">
              {visitor.pages.map((p, i) => (
                <li key={i}>{p.page} — {p.count} times</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
