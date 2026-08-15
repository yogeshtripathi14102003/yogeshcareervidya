"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { ShieldAlert, Clock } from "lucide-react";

export default function SecuritySettingsPage() {
  const [minutes, setMinutes] = useState(15);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchConfig = async () => {
    try {
      const res = await api.get("/api/v1/security-config");
      setMinutes(res.data?.data?.inactivityLimitMinutes ?? 15);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      await api.put("/api/v1/security-config", { inactivityLimitMinutes: minutes });
      setMsg("✅ Saved");
    } catch (err) {
      setMsg(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (loading) return <p className="p-6 text-sm text-gray-400">Loading…</p>;

  return (
    <div className="p-4 md:p-6 max-w-lg space-y-5">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldAlert /> Security Settings
      </h1>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-sm flex items-center gap-2 mb-1">
          <Clock size={16} /> Staff Inactivity Timeout
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Admins, sub-admins, and counselors are automatically logged out after this many minutes with no
          activity. Students are not affected by this setting.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={1440}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm w-28"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {msg && <span className="ml-3 text-sm text-indigo-600">{msg}</span>}
      </div>
    </div>
  );
}
