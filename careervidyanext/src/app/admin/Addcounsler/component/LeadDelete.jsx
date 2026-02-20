"use client";
import React, { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import {
  Upload,
  Users,
  Shuffle,
  Save,
  Loader2,
  Trash2,
} from "lucide-react";

const LeadScheduler = () => {
  /* ================= STATES ================= */
  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [leadAssignments, setLeadAssignments] = useState({});
  const [autoCounts, setAutoCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const [viewCounselor, setViewCounselor] = useState(null);
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchLeads();
    fetchCounselors();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/api/v1/leads");

      if (res.data.success) {
        const all = res.data.data;

        setLeads(all.filter((l) => !l.assignedTo));
        setAssignedLeads(all.filter((l) => l.assignedTo));
      }
    } catch {
      alert("Failed to fetch leads");
    }
  };

  const fetchCounselors = async () => {
    try {
      const res = await api.get("/api/v1/counselor");

      if (res.data.success) {
        setCounselors(res.data.data);
      }
    } catch {
      alert("Failed to fetch counselors");
    }
  };

  /* ================= FILE UPLOAD ================= */
  const handleFile = (e) => setFile(e.target.files[0]);

  const uploadExcel = async () => {
    if (!file) return alert("Please select file");

    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      await api.post("/api/v1/leads/upload", form);

      alert("File uploaded");
      fetchLeads();
      setFile(null);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SELECT LEADS ================= */
  const toggleLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => setSelectedLeads(leads.map((l) => l._id));

  const clearSelection = () => {
    setSelectedLeads([]);
    setLeadAssignments({});
    setAutoCounts({});
  };

  /* ================= AUTO DISTRIBUTE ================= */
  const autoDistribute = () => {
    if (!selectedLeads.length) return alert("Select leads first");
    if (!counselors.length) return alert("No counselors");

    const total = selectedLeads.length;
    let index = 0;
    const newAssign = {};

    const hasCustom = Object.values(autoCounts).some(
      (v) => v && Number(v) > 0
    );

    if (hasCustom) {
      counselors.forEach((c) => {
        const count = Number(autoCounts[c._id] || 0);

        for (let i = 0; i < count; i++) {
          if (index >= total) break;

          newAssign[selectedLeads[index]] = c._id;
          index++;
        }
      });
    }

    while (index < total) {
      const c = counselors[index % counselors.length];

      newAssign[selectedLeads[index]] = c._id;
      index++;
    }

    setLeadAssignments(newAssign);
  };

  /* ================= ASSIGN BY COUNT ================= */
  const assignByCount = () => {
    if (!Object.keys(autoCounts).length)
      return alert("Enter counts first");

    let remaining = [...leads];
    let newAssign = {};

    counselors.forEach((c) => {
      let count = Number(autoCounts[c._id] || 0);

      for (let i = 0; i < count; i++) {
        if (!remaining.length) break;

        const lead = remaining.shift();
        newAssign[lead._id] = c._id;
      }
    });

    if (!Object.keys(newAssign).length)
      return alert("No leads assigned");

    setSelectedLeads(Object.keys(newAssign));
    setLeadAssignments(newAssign);

    alert("Assigned by count. Click Assign to save.");
  };

  const assignLead = (id, cid) => {
    setLeadAssignments((p) => ({ ...p, [id]: cid }));
  };

  /* ================= SAVE ================= */
  const saveDistribution = async () => {
    if (!selectedLeads.length)
      return alert("No leads selected");

    const counts = {};

    Object.values(leadAssignments).forEach((cid) => {
      if (!cid) return;

      counts[cid] = (counts[cid] || 0) + 1;
    });

    if (
      Object.keys(counts).length === 0 ||
      Object.keys(leadAssignments).length !== selectedLeads.length
    ) {
      return alert("Assign all selected leads");
    }

    setLoading(true);

    try {
      await api.post("/api/v1/leads/assign-selected", {
        leadIds: selectedLeads,
        assignments: counts,
      });

      alert("Leads assigned");

      clearSelection();
      fetchLeads();
    } catch {
      alert("Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SINGLE DELETE ================= */
  const handleSingleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;

    try {
      await api.delete(`/api/v1/leads/${id}`);

      alert("Lead deleted");

      fetchLeads();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= GROUP ================= */
  const grouped = assignedLeads.reduce((acc, l) => {
    const cid = l.assignedTo?._id || l.assignedTo;

    if (!cid) return acc;

    if (!acc[cid]) {
      acc[cid] = {
        name: l.assignedTo?.name || "Counselor",
        leads: [],
      };
    }

    acc[cid].leads.push(l);

    return acc;
  }, {});

  const filteredLeads =
    grouped[viewCounselor]?.leads.filter((l) => {
      const leadDate = new Date(l.createdAt);

      const from = filterDates.from
        ? new Date(filterDates.from)
        : null;

      const to = filterDates.to
        ? new Date(filterDates.to)
        : null;

      if (from && leadDate < from) return false;
      if (to && leadDate > to) return false;

      return true;
    }) || [];

  /* ================= UI ================= */
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white p-4 mb-4 rounded shadow flex gap-2 items-center">
          <Users className="text-indigo-600" />
          <h1 className="text-xl font-bold">
            Lead Scheduler
          </h1>
        </div>

        {/* Upload */}
        <div className="bg-white p-4 mb-4 rounded shadow flex gap-3">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFile}
          />

          <button
            onClick={uploadExcel}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            Upload
          </button>
        </div>

        {/* Counselor Summary */}
        {assignedLeads.length > 0 && (
          <div className="bg-white p-4 rounded shadow">

            <h3 className="font-semibold mb-3">
              Counselor Summary
            </h3>

            <div className="space-y-2">
              {Object.entries(grouped).map(
                ([cid, d]) => (
                  <div
                    key={cid}
                    className="flex justify-between items-center border p-3 rounded bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">
                        {d.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        Total: {d.leads.length}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setViewCounselor(cid);
                        setFilterDates({
                          from: "",
                          to: "",
                        });
                      }}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Popup */}
        {viewCounselor && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-xl rounded p-5 max-h-[90vh] flex flex-col">

              <div className="flex justify-between mb-3">

                <h3 className="font-semibold text-lg">
                  {grouped[viewCounselor]?.name}
                </h3>

                <button
                  onClick={() =>
                    setViewCounselor(null)
                  }
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Date Filter */}
              <div className="flex gap-2 mb-3 items-center">

                <label>From:</label>
                <input
                  type="date"
                  value={filterDates.from}
                  onChange={(e) =>
                    setFilterDates((p) => ({
                      ...p,
                      from: e.target.value,
                    }))
                  }
                  className="border px-2 py-1 rounded"
                />

                <label>To:</label>
                <input
                  type="date"
                  value={filterDates.to}
                  onChange={(e) =>
                    setFilterDates((p) => ({
                      ...p,
                      to: e.target.value,
                    }))
                  }
                  className="border px-2 py-1 rounded"
                />

              </div>

              {/* Leads */}
              <div className="flex-1 overflow-y-auto border rounded p-2">

                {filteredLeads.map((l) => (
                  <div
                    key={l._id}
                    className="border-b p-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {l.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {l.phone} | {l.course}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleSingleDelete(l._id)
                      }
                      className="text-red-600 text-sm flex gap-1 items-center hover:underline"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeadScheduler;