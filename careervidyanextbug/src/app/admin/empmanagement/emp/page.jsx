"use client";

import { useEffect, useState } from "react";
// import { serverFetch } from "@/utlis/serverFetch.js";
import api from "@/utlis/api.js"; // ✅ tumhara existing axios instance

const DEPTS = ["Engineering","CC","Design","Marketing","Sales","HR","Finance","Operations","Legal","Support"];

const EMPTY = {
  empId: "", name: "", email: "", phone: "", department: "",
  designation: "", dob: "", joiningDate: "",
  alertDobDays: 7, alertAnnivDays: 7, active: true,
};

export default function EmployeesPage() {
  const [list,    setList]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [q,       setQ]       = useState("");
  const [dept,    setDept]    = useState("");

  const [modal,    setModal]    = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState("");

  const LIMIT = 50;

  // ── Load ──────────────────────────────────────────────────────
  function load() {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (q)    params.q = q;
    if (dept) params.department = dept;

    api
      .get("/api/v1/employees", { params })
      .then((res) => {
        setList(res.data?.data || []);
        setTotal(res.data?.pagination?.total || 0);
      })
      .catch((e) => console.error("Load failed:", e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [page, q, dept]);
  useEffect(() => { setPage(1); }, [q, dept]);

  // ── Modals ────────────────────────────────────────────────────
  function openAdd()     { setForm(EMPTY); setErr(""); setModal("add"); }
  function openEdit(emp) {
    setSelected(emp);
    setForm({
      ...emp,
      dob:         emp.dob?.split("T")[0]         || "",
      joiningDate: emp.joiningDate?.split("T")[0] || "",
    });
    setErr("");
    setModal("edit");
  }
  function openView(emp) { setSelected(emp); setModal("view"); }
  function closeModal()  { setModal(null); setSelected(null); }

  // ── Save ──────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true); setErr("");
    try {
      if (modal === "edit") {
        await api.put(`/api/v1/employees/${selected._id}`, form);
      } else {
        await api.post("/api/v1/employees", form);
      }
      closeModal();
      load();
    } catch (e) {
      setErr(e?.response?.data?.error || e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  async function handleDelete(emp) {
    if (!confirm(`Delete "${emp.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/v1/employees/${emp._id}`);
      load();
    } catch (e) {
      alert("Delete failed: " + (e?.response?.data?.message || e.message));
    }
  }

  // ── Toggle active ─────────────────────────────────────────────
  async function toggleActive(emp) {
    try {
      await api.patch(`/api/v1/employees/${emp._id}/toggle`);
      load();
    } catch (e) {
      alert("Status update failed: " + (e?.response?.data?.message || e.message));
    }
  }

  const totalPages = Math.ceil(total / LIMIT);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
            <p className="text-sm text-slate-500 mt-0.5">{total} total records</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-black transition"
          >
            + Add Employee
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, ID, email…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-slate-400"
          />
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-slate-400 w-full sm:w-52"
          >
            <option value="">All Departments</option>
            {DEPTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Emp ID","Name","Department","Designation","DOB","Joining","Status","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="py-16 text-center text-slate-400">Loading…</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={8} className="py-16 text-center text-slate-400">No employees found</td></tr>
                ) : list.map((emp) => (
                  <tr key={emp._id} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{emp.empId}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{emp.name}</td>
                    <td className="px-4 py-3 text-slate-600">{emp.department}</td>
                    <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{emp.dob?.split("T")[0]}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{emp.joiningDate?.split("T")[0]}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(emp)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                          emp.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {emp.active ? "● Active" : "○ Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <ActionBtn onClick={() => openView(emp)} title="View"   emoji="👁"  />
                        <ActionBtn onClick={() => openEdit(emp)} title="Edit"   emoji="✏️" cls="hover:bg-blue-50" />
                        <ActionBtn onClick={() => handleDelete(emp)} title="Delete" emoji="🗑" cls="hover:bg-red-50" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages} · {total} records
              </span>
              <div className="flex gap-1.5">
                <PagerBtn disabled={page === 1}          onClick={() => setPage((p) => p - 1)}>← Prev</PagerBtn>
                <PagerBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</PagerBtn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ─────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <Overlay onClose={closeModal}>
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            {modal === "edit" ? `Edit — ${selected?.name}` : "Add New Employee"}
          </h2>
          {err && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {err}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Fld label="Employee ID *">
              <input className={inp} value={form.empId} onChange={(e) => set("empId", e.target.value)}
                placeholder="EMP001" disabled={modal === "edit"} />
            </Fld>
            <Fld label="Full Name *">
              <input className={inp} value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Priya Sharma" />
            </Fld>
            <Fld label="Email *">
              <input className={inp} type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="priya@company.com" />
            </Fld>
            <Fld label="Phone">
              <input className={inp} value={form.phone} onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210" />
            </Fld>
            <Fld label="Department *">
              <select className={inp} value={form.department} onChange={(e) => set("department", e.target.value)}>
                <option value="">Select…</option>
                {DEPTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Fld>
            <Fld label="Designation *">
              <input className={inp} value={form.designation} onChange={(e) => set("designation", e.target.value)}
                placeholder="Software Engineer" />
            </Fld>
            <Fld label="Date of Birth *">
              <input className={inp} type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </Fld>
            <Fld label="Joining Date *">
              <input className={inp} type="date" value={form.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} />
            </Fld>
            <Fld label="Birthday Alert (days)">
              <input className={inp} type="number" min={0} max={90} value={form.alertDobDays}
                onChange={(e) => set("alertDobDays", +e.target.value)} />
            </Fld>
            <Fld label="Anniversary Alert (days)">
              <input className={inp} type="number" min={0} max={90} value={form.alertAnnivDays}
                onChange={(e) => set("alertAnnivDays", +e.target.value)} />
            </Fld>
          </div>
          <label className="flex items-center gap-2 my-4 cursor-pointer text-sm text-slate-700">
            <input type="checkbox" checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="w-4 h-4 accent-yellow-500" />
            Active Employee
          </label>
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 rounded-xl bg-slate-900 text-yellow-400 text-sm font-semibold disabled:opacity-50">
              {saving ? "Saving…" : modal === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </Overlay>
      )}

      {/* ── VIEW MODAL ───────────────────────────────────────── */}
      {modal === "view" && selected && (
        <Overlay onClose={closeModal} maxW={480}>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{selected.name}</h2>
          <p className="text-sm text-slate-400 mb-5">{selected.designation} · {selected.department}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              ["Emp ID",          selected.empId],
              ["Email",           selected.email],
              ["Phone",           selected.phone || "—"],
              ["DOB",             selected.dob?.split("T")[0]],
              ["Joining Date",    selected.joiningDate?.split("T")[0]],
              ["Status",          selected.active ? "Active" : "Inactive"],
              ["Birthday Alert",  `${selected.alertDobDays} days`],
              ["Anniv. Alert",    `${selected.alertAnnivDays} days`],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 rounded-xl px-3 py-2.5">
                <div className="text-xs text-slate-400 mb-0.5">{k}</div>
                <div className="text-sm font-semibold text-slate-800 truncate">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Close
            </button>
            <button onClick={() => { closeModal(); openEdit(selected); }}
              className="px-5 py-2 rounded-xl bg-slate-900 text-yellow-400 text-sm font-semibold">
              Edit
            </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function Overlay({ children, onClose, maxW = 600 }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl w-full shadow-2xl overflow-y-auto"
        style={{ maxWidth: maxW, maxHeight: "90vh", padding: 28 }}>
        {children}
      </div>
    </div>
  );
}

function Fld({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ActionBtn({ onClick, title, emoji, cls = "hover:bg-slate-100" }) {
  return (
    <button onClick={onClick} title={title}
      className={`w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center text-sm transition ${cls}`}>
      {emoji}
    </button>
  );
}

function PagerBtn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition">
      {children}
    </button>
  );
}

const inp = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-slate-400 transition";
