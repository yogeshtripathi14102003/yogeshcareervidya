"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { Users, Phone, Mail, ChevronDown, ChevronUp, Eye, Award, Clock, TrendingUp } from "lucide-react";

export default function MyTeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [memberStats, setMemberStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [memberLeads, setMemberLeads] = useState({});
  const [leadsLoading, setLeadsLoading] = useState(false);

  useEffect(() => {
    if (!user?.isTeamLead) {
      setLoading(false);
      return;
    }
    fetchTeam();
  }, [user]);

  const fetchTeam = async () => {
    try {
      const res = await api.get("/api/v1/counselor/team/my-team");
      const members = res.data.data || [];
      setTeam(members);

      // Per-member stats (pending/admissions/conversion + working hours) —
      // small team sizes make N parallel requests fine here.
      const statsEntries = await Promise.all(
        members.map(async (m) => {
          try {
            const [statsRes, hoursRes] = await Promise.all([
              api.get(`/api/v1/counselor/analytics/${m._id}`),
              api.get(`/api/v1/counselor/analytics/hours-summary/${m._id}`),
            ]);
            return [m._id, { ...statsRes.data?.data, hours: hoursRes.data?.data }];
          } catch {
            return [m._id, null];
          }
        })
      );
      setMemberStats(Object.fromEntries(statsEntries));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (memberId) => {
    if (expanded === memberId) {
      setExpanded(null);
      return;
    }
    setExpanded(memberId);

    if (!memberLeads[memberId]) {
      setLeadsLoading(true);
      try {
        const res = await api.get("/api/v1/counselor-leads", {
          params: { id: memberId, limit: 20 },
        });
        setMemberLeads((prev) => ({ ...prev, [memberId]: res.data.data || [] }));
      } catch (err) {
        console.error(err);
      } finally {
        setLeadsLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
  }

  if (!user?.isTeamLead) {
    return (
      <div className="p-8 text-center">
        <Users className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-500 text-sm">
          You're not currently set as a Team Lead. Ask an admin if you believe this is wrong.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Users className="text-indigo-600" size={22} />
        <h1 className="text-xl font-bold text-slate-800">My Team</h1>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        View-only — you can see your team's leads, but editing stays with each counselor (or admin).
      </p>

      {team.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-sm text-gray-400">
          No counselors are assigned to your team yet.
        </div>
      ) : (
        <div className="space-y-3">
          {team.map((member) => (
            <div key={member._id} className="border rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleExpand(member._id)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                    {member.name}
                    <span className={`w-2 h-2 rounded-full ${member.isOnline ? "bg-green-500" : "bg-gray-300"}`} title={member.isOnline ? "Online" : "Offline"} />
                    <span className={`text-[10px] font-medium ${member.isOnline ? "text-green-600" : "text-gray-400"}`}>
                      {member.isOnline ? "Online" : "Offline"}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Mail size={12} /> {member.email}</span>
                    {member.phone && (
                      <span className="flex items-center gap-1"><Phone size={12} /> {member.phone}</span>
                    )}
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        member.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Last login: {member.lastLogin ? new Date(member.lastLogin).toLocaleString() : "—"}
                    {member.lastLogout && ` · Last logout: ${new Date(member.lastLogout).toLocaleString()}`}
                  </p>
                </div>
                {expanded === member._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {memberStats[member._id] && (
                <div className="px-4 pb-3 flex gap-4 text-xs border-t pt-2 bg-slate-50/50 flex-wrap">
                  {memberStats[member._id].hours && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Clock size={12} /> {memberStats[member._id].hours.today}h today
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-amber-600">
                    <Clock size={12} /> {memberStats[member._id].pendingCalls} pending
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <Award size={12} /> {memberStats[member._id].admissions} admissions
                  </span>
                  <span className="flex items-center gap-1 text-indigo-600">
                    <TrendingUp size={12} /> {memberStats[member._id].conversionRate}% conversion
                  </span>
                  <span className="text-gray-400">{memberStats[member._id].totalLeads} total leads</span>
                </div>
              )}

              {expanded === member._id && (
                <div className="border-t bg-slate-50 p-4">
                  {leadsLoading && !memberLeads[member._id] ? (
                    <p className="text-xs text-gray-400">Loading leads…</p>
                  ) : (memberLeads[member._id] || []).length === 0 ? (
                    <p className="text-xs text-gray-400">No leads assigned yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-left text-gray-400 border-b">
                            <th className="py-1.5 pr-3">Name</th>
                            <th className="py-1.5 pr-3">Phone</th>
                            <th className="py-1.5 pr-3">Status</th>
                            <th className="py-1.5 pr-3">City</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberLeads[member._id].map((lead) => (
                            <tr key={lead._id} className="border-b last:border-0">
                              <td className="py-1.5 pr-3">{lead.name}</td>
                              <td className="py-1.5 pr-3">{lead.phone}</td>
                              <td className="py-1.5 pr-3">{lead.status}</td>
                              <td className="py-1.5 pr-3">{lead.city || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
