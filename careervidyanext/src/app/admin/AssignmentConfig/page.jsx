"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Settings2, Plus, Trash2, RefreshCw, Zap } from "lucide-react";

const STRATEGIES = [
  { value: "round_robin", label: "Round Robin" },
  { value: "state_wise", label: "State Wise" },
  { value: "city_wise", label: "City Wise" },
  { value: "course_wise", label: "Course Wise" },
  { value: "university_wise", label: "University Wise" },
  { value: "workload_based", label: "Counselor Workload" },
  { value: "priority_based", label: "Priority Based" },
];

const MAP_KEY_BY_STRATEGY = {
  state_wise: "stateMap",
  city_wise: "cityMap",
  course_wise: "courseMap",
  university_wise: "universityMap",
};

export default function AssignmentConfigPage() {
  const [config, setConfig] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [configRes, counselorsRes] = await Promise.all([
        api.get("/api/v1/assignment-config"),
        api.get("/api/v1/counselor"),
      ]);
      setConfig(configRes.data?.data);
      setCounselors(counselorsRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await api.put("/api/v1/assignment-config", config);
      setConfig(res.data?.data);
      setMsg("✅ Saved");
    } catch (err) {
      setMsg(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const runAction = async (path, label) => {
    setActionMsg(`Running ${label}…`);
    try {
      const res = await api.post(path);
      setActionMsg(res.data?.message || "Done");
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Action failed");
    }
  };

  if (loading || !config) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
  }

  const mapKey = MAP_KEY_BY_STRATEGY[config.activeStrategy];

  const updateMapArray = (key, next) => setConfig((prev) => ({ ...prev, [key]: next }));

  const addMapRow = (key) =>
    updateMapArray(key, [...(config[key] || []), { value: "", counselors: [] }]);

  const removeMapRow = (key, idx) =>
    updateMapArray(key, config[key].filter((_, i) => i !== idx));

  const updateMapRow = (key, idx, field, val) =>
    updateMapArray(
      key,
      config[key].map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );

  const toggleCounselorInRow = (key, idx, counselorId) => {
    const row = config[key][idx];
    const ids = row.counselors.map(String);
    const next = ids.includes(counselorId)
      ? ids.filter((id) => id !== counselorId)
      : [...ids, counselorId];
    updateMapRow(key, idx, "counselors", next);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings2 /> Smart Lead Assignment
        </h1>
        {msg && <span className="text-sm text-indigo-600">{msg}</span>}
      </div>

      {/* ---- Strategy ---- */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-3">Active Strategy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STRATEGIES.map((s) => (
            <button
              key={s.value}
              onClick={() => setConfig({ ...config, activeStrategy: s.value })}
              className={`text-xs px-3 py-2 rounded-lg font-medium border ${
                config.activeStrategy === s.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.autoAssignOnCreate}
              onChange={(e) => setConfig({ ...config, autoAssignOnCreate: e.target.checked })}
            />
            Auto-assign new leads
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.considerWorkload}
              onChange={(e) => setConfig({ ...config, considerWorkload: e.target.checked })}
            />
            Prefer least-busy counselor (workload tie-break)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.fallbackToRoundRobin}
              onChange={(e) => setConfig({ ...config, fallbackToRoundRobin: e.target.checked })}
            />
            Fallback to round robin if no rule matches
          </label>
        </div>
      </div>

      {/* ---- Mapping editor (state/city/course/university) ---- */}
      {mapKey && (
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">
              {STRATEGIES.find((s) => s.value === config.activeStrategy)?.label} Mapping
            </h2>
            <button
              onClick={() => addMapRow(mapKey)}
              className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium"
            >
              <Plus size={13} /> Add Row
            </button>
          </div>

          <div className="space-y-3">
            {(config[mapKey] || []).map((row, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={row.value}
                    onChange={(e) => updateMapRow(mapKey, idx, "value", e.target.value)}
                    className="border rounded px-2 py-1 text-sm flex-1"
                  />
                  <button onClick={() => removeMapRow(mapKey, idx)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {counselors.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => toggleCounselorInRow(mapKey, idx, c._id)}
                      className={`text-[11px] px-2 py-1 rounded-full border ${
                        row.counselors.map(String).includes(c._id)
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {(!config[mapKey] || config[mapKey].length === 0) && (
              <p className="text-xs text-gray-400">No rows yet — add one above.</p>
            )}
          </div>
        </div>
      )}

      {/* ---- Priority map ---- */}
      {config.activeStrategy === "priority_based" && (
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-3">Priority Tier Routing</h2>
          {["priority", "hot", "warm", "cold"].map((tier) => (
            <div key={tier} className="mb-3">
              <p className="text-xs font-medium uppercase text-gray-500 mb-1">{tier} leads</p>
              <div className="flex flex-wrap gap-1.5">
                {counselors.map((c) => {
                  const ids = (config.priorityMap?.[tier] || []).map(String);
                  const active = ids.includes(c._id);
                  return (
                    <button
                      key={c._id}
                      onClick={() => {
                        const next = active ? ids.filter((id) => id !== c._id) : [...ids, c._id];
                        setConfig({
                          ...config,
                          priorityMap: { ...config.priorityMap, [tier]: next },
                        });
                      }}
                      className={`text-[11px] px-2 py-1 rounded-full border ${
                        active ? "bg-amber-500 text-white border-amber-500" : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={saveConfig}
        disabled={saving}
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Configuration"}
      </button>

      {/* ---- Manual actions ---- */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-3">Manual Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => runAction("/api/v1/leads/bulk-auto-assign", "bulk auto-assign")}
            className="text-sm flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg font-medium"
          >
            <Zap size={15} /> Auto-Assign Unassigned Leads
          </button>
          <button
            onClick={() => runAction("/api/v1/leads/reassign-inactive", "reassign from inactive counselors")}
            className="text-sm flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg font-medium"
          >
            <RefreshCw size={15} /> Reassign Leads From Inactive Counselors
          </button>
        </div>
        {actionMsg && <p className="text-xs text-indigo-600 mt-3">{actionMsg}</p>}
      </div>
    </div>
  );
}
