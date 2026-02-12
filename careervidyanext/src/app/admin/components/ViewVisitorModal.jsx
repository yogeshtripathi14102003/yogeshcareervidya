"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";

export default function ViewVisitorModal({ visitorId, onClose }) {
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    if (!visitorId) return;
    api.get(`/api/v1/${visitorId}`)
      .then(res => setVisitor(res.data.visitor))
      .catch(err => console.error(err));
  }, [visitorId]);

  if (!visitor) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow rounded w-[500px] max-w-full relative max-h-[80vh] overflow-auto">
        <button onClick={onClose} className="absolute top-2 right-3 text-red-600 font-bold">X</button>
        <h2 className="font-semibold text-xl mb-3">Visitor Detail</h2>
        <p><b>IP:</b> {visitor.ip}</p>
        <p><b>Total Visits:</b> {visitor.visits}</p>
        <p><b>Last Visited:</b> {new Date(visitor.lastVisitedAt).toLocaleString()}</p>
        <h3 className="mt-4 font-semibold">Pages Visited</h3>
        <ul className="list-disc pl-5">
          {visitor.pages.map((p, i) => <li key={i}>{p.page} — {p.count} times</li>)}
        </ul>
      </div>
    </div>
  );
}
