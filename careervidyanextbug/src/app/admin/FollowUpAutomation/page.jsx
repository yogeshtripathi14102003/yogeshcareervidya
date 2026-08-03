"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Clock, Plus, Trash2, Play, ListChecks, Power } from "lucide-react";

const ACTIONS = [
  { value: "reminder", label: "Counselor Reminder" },
  { value: "manager_notification", label: "Manager Notification" },
  { value: "auto_reassign", label: "Auto Reassign" },
];

const humanizeMinutes = (m) => {
  if (m < 60) return `${m} min`;
  if (m < 1440) return `${(m / 60).toFixed(m % 60 === 0 ? 0 : 1)} hr`;
  return `${(m / 1440).toFixed(m % 1440 === 0 ? 0 : 1)} day`;
};

export default function FollowUpAutomationPage() {
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [configRes, logsRes] = await Promise.all([
        api.get("/api/v1/followup-config"),
        api.get("/api/v1/automation-logs", { params: { limit: 30 } }),
      ]);
      setConfig(configRes.data?.data);
      setLogs(logsRes.data?.data || []);
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
      const res = await api.put("/api/v1/followup-config", config);
      setConfig(res.data?.data);
      setMsg("✅ Saved");
    } catch (err) {
      setMsg(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const runNow = async () => {
    setMsg("Running sweep…");
    try {
      const res = await api.post("/api/v1/followup-config/run-now");
      setMsg(res.data.skipped ? "Automation is disabled" : `✅ Fired ${res.data.totalFired} action(s)`);
      fetchAll();
    } catch (err) {
      setMsg(err.response?.data?.message || "Run failed");
    }
  };

  const updateStep = (idx, field, val) => {
    const steps = [...config.steps];
    steps[idx] = { ...steps[idx], [field]: val };
    setConfig({ ...config, steps });
  };

  const addStep = () => {
    setConfig({
      ...config,
      steps: [...config.steps, { label: "New step", afterMinutes: 60, action: "reminder" }],
    });
  };

  const removeStep = (idx) => {
    setConfig({ ...config, steps: config.steps.filter((_, i) => i !== idx) });
  };

  if (loading || !config) {
    return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock /> Follow-up Automation
        </h1>
        {msg && <span className="text-sm text-indigo-600">{msg}</span>}
      </div>

      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Power size={16} className={config.enabled ? "text-green-500" : "text-gray-300"} />
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            />
            Automation Enabled
          </label>
          <button
            onClick={runNow}
            className="text-xs flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg font-medium"
          >
            <Play size={13} /> Run Sweep Now
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Escalation ladder — a lead with no follow-up activity for the given time triggers the action below.
          Timers reset the moment a counselor updates the lead's status or remark. Runs automatically every 5 minutes.
        </p>

        <div className="space-y-2">
          {config.steps.map((step, idx) => (
            <div key={step._id || idx} className="flex flex-wrap items-center gap-2 border rounded-lg p-3">
              <input
                type="text"
                value={step.label}
                onChange={(e) => updateStep(idx, "label", e.target.value)}
                className="border rounded px-2 py-1 text-sm flex-1 min-w-[140px]"
                placeholder="Label"
              />
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">After</span>
                <input
                  type="number"
                  min={1}
                  value={step.afterMinutes}
                  onChange={(e) => updateStep(idx, "afterMinutes", e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-20"
                />
                <span className="text-xs text-gray-400">min ({humanizeMinutes(step.afterMinutes)})</span>
              </div>
              <select
                value={step.action}
                onChange={(e) => updateStep(idx, "action", e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {ACTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <button onClick={() => removeStep(idx)} className="text-red-500 ml-auto">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addStep}
          className="mt-3 text-xs flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium"
        >
          <Plus size={13} /> Add Step
        </button>

        <button
          onClick={saveConfig}
          disabled={saving}
          className="mt-4 block bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Configuration"}
        </button>
      </div>

      {/* ---- Audit log (Module 15 requirement) ---- */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <ListChecks size={18} /> Automation Audit Log
        </h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">No automation events yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Lead</th>
                  <th className="py-2 pr-4">Step</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-2 pr-4">{log.lead?.name || "—"}</td>
                    <td className="py-2 pr-4">{log.stepLabel}</td>
                    <td className="py-2 pr-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">{log.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
