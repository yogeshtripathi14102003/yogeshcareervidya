"use client";

import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { X, Star, Users, Check } from "lucide-react";

export default function TeamLeadManager({ counselors, onClose, onChanged }) {
  const [teamLeads, setTeamLeads] = useState([]);
  const [selectedTL, setSelectedTL] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchTeamLeads = async () => {
    try {
      const res = await api.get("/api/v1/counselor/team/leads");
      setTeamLeads(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeamLeads();
  }, []);

  const toggleTeamLead = async (counselor) => {
    setLoading(true);
    setMsg("");
    try {
      await api.patch(`/api/v1/counselor/${counselor._id}/team-lead`, {
        isTeamLead: !counselor.isTeamLead,
      });
      setMsg(`✅ ${counselor.name} ${!counselor.isTeamLead ? "promoted to" : "removed from"} Team Lead`);
      await fetchTeamLeads();
      onChanged?.();
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openRoster = async (tl) => {
    setSelectedTL(tl);
    try {
      const res = await api.get(`/api/v1/counselor/${tl._id}`);
      const currentTeam = counselors.filter(
        (c) => String(c.reportsTo) === String(tl._id)
      );
      setRoster(currentTeam.map((c) => c._id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRosterMember = (id) => {
    setRoster((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const saveRoster = async () => {
    if (!selectedTL) return;
    setLoading(true);
    setMsg("");
    try {
      await api.put(`/api/v1/counselor/${selectedTL._id}/team`, {
        counselorIds: roster,
      });
      setMsg("✅ Team roster updated");
      setSelectedTL(null);
      onChanged?.();
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const eligibleForRoster = counselors.filter(
    (c) => !c.isTeamLead && String(c._id) !== String(selectedTL?._id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Star size={18} className="text-amber-500" /> Team Lead Management
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={18} />
          </button>
        </div>

        {msg && (
          <div className="mx-4 mt-3 text-sm px-3 py-2 rounded bg-blue-50 text-blue-700">
            {msg}
          </div>
        )}

        {!selectedTL ? (
          <div className="p-4 space-y-2">
            <p className="text-xs text-gray-500 mb-2">
              Promote a counselor to Team Lead, or manage an existing Team Lead's roster.
              A Team Lead can view (not edit) their team's leads, admissions, and tickets.
            </p>
            {counselors.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {c.isTeamLead && (
                    <button
                      onClick={() => openRoster(c)}
                      className="text-xs px-3 py-1.5 rounded bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <Users size={13} /> Manage Team
                    </button>
                  )}
                  <button
                    disabled={loading}
                    onClick={() => toggleTeamLead(c)}
                    className={`text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1 ${
                      c.isTeamLead
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <Star size={13} />
                    {c.isTeamLead ? "Remove TL" : "Make TL"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <button
              onClick={() => setSelectedTL(null)}
              className="text-xs text-gray-500 mb-3"
            >
              ← Back to list
            </button>
            <h3 className="font-semibold mb-1">Team for {selectedTL.name}</h3>
            <p className="text-xs text-gray-500 mb-3">
              Select the counselors who report to this Team Lead.
            </p>
            <div className="space-y-1 max-h-[45vh] overflow-y-auto">
              {eligibleForRoster.map((c) => (
                <label
                  key={c._id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={roster.includes(c._id)}
                    onChange={() => toggleRosterMember(c._id)}
                  />
                  {c.name} <span className="text-xs text-gray-400">({c.email})</span>
                </label>
              ))}
            </div>
            <button
              disabled={loading}
              onClick={saveRoster}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Check size={15} /> Save Team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
