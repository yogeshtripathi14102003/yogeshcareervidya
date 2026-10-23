"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/utlis/api";

const errMsg = (e) => e?.response?.data?.message || e?.message || "Something went wrong";

const toArray = (v) => (Array.isArray(v) ? v : []);

const initialForm = {
  course: "",
  university: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountAmount: "",
  usageLimit: "",
  perUserLimit: 1,
};

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AddCoupon() {
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [coupons, setCoupons] = useState([]);
  const [listCourse, setListCourse] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [usage, setUsage] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  // Course + university dropdown data
  useEffect(() => {
    (async () => {
      try {
        // Explore page jaisi hi APIs: course -> { courses: [...] }, university -> { data: [...] }
        const [c, u] = await Promise.all([
          api.get("/api/v1/course", { params: { limit: 500 } }),
          api.get("/api/v1/university"),
        ]);
        setCourses(toArray(c.data?.courses ?? c.data?.data));
        setUniversities(toArray(u.data?.data ?? u.data?.universities));
      } catch (e) {
        showToast("error", `Courses/universities load nahi hue: ${errMsg(e)}`);
      }
    })();
  }, []);

  const loadCoupons = async (courseId) => {
    if (!courseId) return setCoupons([]);
    try {
      const res = await api.get(`/api/v1/coupons/course/${courseId}`);
      setCoupons(toArray(res.data?.data));
    } catch (e) {
      showToast("error", errMsg(e));
    }
  };

  useEffect(() => {
    loadCoupons(listCourse);
  }, [listCourse]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Validity preview (backend bhi 7 din auto set karta hai)
  const validity = useMemo(() => {
    const from = new Date();
    const until = new Date(from.getTime() + 27 * 24 * 60 * 60 * 1000);
    return { from, until };
  }, []);

  const errors = useMemo(() => {
    const e = {};
    if (form.discountValue !== "") {
      const v = Number(form.discountValue);
      if (v <= 0) e.discountValue = "Discount 0 se zyada hona chahiye";
      if (form.discountType === "percentage" && v > 100) e.discountValue = "Percentage 100 se zyada nahi ho sakta";
    }
    return e;
  }, [form]);

  const canSubmit =
    form.course &&
    form.university &&
    form.discountValue !== "" &&
    Object.keys(errors).length === 0 &&
    !saving;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      const body = {
        course: form.course,
        university: form.university,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        perUserLimit: Number(form.perUserLimit) || 1,
      };
      if (form.maxDiscountAmount !== "") body.maxDiscountAmount = Number(form.maxDiscountAmount);
      if (form.usageLimit !== "") body.usageLimit = Number(form.usageLimit);

      const res = await api.post("/api/v1/coupons", body);
      showToast("success", `Coupon ${res.data?.data?.code || ""} ban gaya`);
      setListCourse(form.course);
      await loadCoupons(form.course);
      setForm({ ...initialForm, course: form.course });
    } catch (err) {
      showToast("error", errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id) => {
    try {
      await api.patch(`/api/v1/coupons/${id}/toggle`);
      loadCoupons(listCourse);
    } catch (e) {
      showToast("error", errMsg(e));
    }
  };

  const openUsage = async (id) => {
    try {
      const res = await api.get(`/api/v1/coupons/${id}/usage`);
      setUsage(res.data?.data);
    } catch (e) {
      showToast("error", errMsg(e));
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast("success", `${code} copy ho gaya`);
    } catch {
      showToast("error", "Copy nahi hua, code ko select karke copy karo");
    }
  };

  const uniName = (id) => universities.find((u) => u._id === id)?.name;

  return (
    <div className="cp">
      <style>{css}</style>

      <header className="cp-head">
        <h1 className="cv-underline-gradient">Coupons</h1>
        <p>Course aur university ke hisaab se coupon banao. Har coupon 7 din valid rehta hai.</p>
      </header>

      <div className="cp-grid">
        {/* ---------- FORM ---------- */}
        <form className="cp-panel" onSubmit={submit} noValidate>
          <h2>Naya coupon</h2>

          <div className="row two">
            <label>
              Course
              <select value={form.course} onChange={set("course")}>
                <option value="">Course chuno</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title || c.name}</option>
                ))}
              </select>
            </label>
            <label>
              University
              <select value={form.university} onChange={set("university")}>
                <option value="">University chuno</option>
                {universities.map((u) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </label>
          </div>

          <p className="hint">Coupon code apne aap ban jayega (jaise CV7K2M9Q). Save karne ke baad list me dikhega.</p>

          <div className="field">
            <span className="lbl">Discount kaise do</span>
            <div className="seg" role="group" aria-label="Discount type">
              <button
                type="button"
                className={form.discountType === "percentage" ? "on" : ""}
                aria-pressed={form.discountType === "percentage"}
                onClick={() => setForm((f) => ({ ...f, discountType: "percentage", discountValue: "" }))}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                className={form.discountType === "flat" ? "on" : ""}
                aria-pressed={form.discountType === "flat"}
                onClick={() => setForm((f) => ({ ...f, discountType: "flat", discountValue: "", maxDiscountAmount: "" }))}
              >
                Flat amount (₹)
              </button>
            </div>
          </div>

          <label>
            {form.discountType === "percentage" ? "Discount (%)" : "Discount amount (₹)"}
            <input
              type="number"
              min="1"
              value={form.discountValue}
              onChange={set("discountValue")}
              placeholder={form.discountType === "percentage" ? "20" : "4000"}
            />
            {form.discountType === "flat" && !errors.discountValue && (
              <small className="hint-inline">Course fee me se itne rupay seedhe kam ho jayenge, jaise 4000</small>
            )}
            {errors.discountValue && <span className="err">{errors.discountValue}</span>}
          </label>

          {form.discountType === "percentage" && (
            <label>
              Max discount (₹) <small>optional</small>
              <input type="number" min="1" value={form.maxDiscountAmount} onChange={set("maxDiscountAmount")} placeholder="1000" />
            </label>
          )}

          <div className="row two">
            <label>
              Total usage limit <small>khali = unlimited</small>
              <input type="number" min="1" value={form.usageLimit} onChange={set("usageLimit")} placeholder="100" />
            </label>
            <label>
              Ek user kitni baar
              <input type="number" min="1" value={form.perUserLimit} onChange={set("perUserLimit")} />
            </label>
          </div>

          <div className="validity">
            <span>Valid</span>
            <strong>{fmt(validity.from)} se {fmt(validity.until)} tak</strong>
            <em>7 din, create hone ke time se</em>
          </div>

          <button className="primary cv-btn-cta" type="submit" disabled={!canSubmit}>
            {saving ? "Save ho raha hai..." : "Coupon add karo"}
          </button>
        </form>

        {/* ---------- LIST ---------- */}
        <section className="cp-panel">
          <div className="list-head">
            <h2>Course ke coupons</h2>
            <select value={listCourse} onChange={(e) => setListCourse(e.target.value)}>
              <option value="">Course chuno</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title || c.name}</option>
              ))}
            </select>
          </div>

          {!listCourse && <p className="empty">Upar se course chuno, uske saare university coupons yahan dikhenge.</p>}
          {listCourse && coupons.length === 0 && (
            <p className="empty">Is course ka abhi koi coupon nahi hai. Left side se pehla coupon bana lo.</p>
          )}

          <ul className="coupons">
            {coupons.map((c) => {
              const pct = c.usageLimit ? Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100)) : null;
              return (
                <li key={c._id} className={`coupon ${c.status}`}>
                  <div className="coupon-top">
                    <div>
                      <span className="code mono">{c.code}</span>
                      <span className="uni">{c.university?.name || uniName(c.university)}</span>
                    </div>
                    <span className={`badge ${c.status}`}>
                      {c.status === "active" ? "Active" : c.status === "expired" ? "Expired" : "Band"}
                    </span>
                  </div>

                  <div className="meta">
                    <span>
                      {c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                      {c.maxDiscountAmount ? ` (max ₹${c.maxDiscountAmount})` : ""}
                    </span>
                    <span>
                      {c.status === "expired" ? `Expire hua ${fmt(c.validUntil)}` : `${c.daysLeft} din bache, ${fmt(c.validUntil)} tak`}
                    </span>
                  </div>

                  <div className="usage">
                    <div className="usage-line">
                      <strong>{c.usedCount}</strong> logo ne use kiya
                      {c.usageLimit ? ` / ${c.usageLimit}` : " (unlimited)"}
                    </div>
                    {pct !== null && (
                      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                    )}
                  </div>

                  <div className="actions">
                    <button type="button" onClick={() => copyCode(c.code)}>Code copy karo</button>
                    <button type="button" onClick={() => openUsage(c._id)}>Kisne use kiya</button>
                    <button type="button" onClick={() => toggle(c._id)}>
                      {c.isActive ? "Band karo" : "Chalu karo"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* ---------- USAGE MODAL ---------- */}
      {usage && (
        <div className="overlay" onClick={() => setUsage(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="mono">{usage.code}</h3>
            <p className="sub">
              {usage.university?.name} · {usage.usedCount} baar use hua
            </p>
            {usage.usedBy?.length ? (
              <table>
                <thead>
                  <tr><th>User</th><th>Email</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {usage.usedBy.map((u, i) => (
                    <tr key={i}>
                      <td>{u.user?.name || "-"}</td>
                      <td>{u.user?.email || "-"}</td>
                      <td>{fmt(u.usedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty">Abhi tak kisi ne use nahi kiya.</p>
            )}
            <button className="primary cv-btn-cta" onClick={() => setUsage(null)}>Band karo</button>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`} role="status">{toast.text}</div>}
    </div>
  );
}

const css = `
.cp { min-height: 100vh; background: var(--cv-neutral-light); color: var(--cv-neutral-dark); font-family: var(--font-poppins), ui-sans-serif, system-ui, sans-serif; padding: 32px 20px 64px; }
.cp * { box-sizing: border-box; }
.cp-head { max-width: 1120px; margin: 0 auto 32px; }
.cp-head h1 { font-size: 1.9rem; margin: 0 0 14px; font-weight: 700; color: var(--cv-primary); }
.cp-head p { margin: 0; color: var(--cv-neutral-mid); max-width: 60ch; font-size: 0.95rem; }

.cp-grid { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 420px) minmax(0, 1fr); gap: 20px; align-items: start; }
@media (max-width: 860px) { .cp-grid { grid-template-columns: 1fr; } }

.cp-panel { background: var(--cv-neutral-white); border: 1px solid var(--cv-neutral-border); border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.cp-panel h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--cv-primary); }

.cp label { display: flex; flex-direction: column; gap: 5px; font-size: 0.85rem; font-weight: 500; color: var(--cv-neutral-dark); }
.cp label small { color: var(--cv-neutral-mid); font-weight: 400; margin-left: 4px; }
.row.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 520px) { .row.two { grid-template-columns: 1fr; } }

.cp input, .cp select {
  font: inherit; font-size: 0.9rem; border: 1px solid var(--cv-neutral-border);
  border-radius: 8px; padding: 9px 10px; width: 100%;
}
.cp input:focus-visible, .cp select:focus-visible, .cp button:focus-visible {
  outline: 2px solid var(--cv-primary); outline-offset: 2px;
}
.mono { font-family: var(--font-mono); letter-spacing: 0.04em; }
.cp .field { display: flex; flex-direction: column; gap: 5px; }
.cp .lbl { font-size: 0.85rem; font-weight: 500; }
.cp .hint { margin: 0; font-size: 0.84rem; color: var(--cv-neutral-mid); padding: 9px 12px; background: var(--cv-primary-light); border-radius: 8px; }
.cp .hint-inline { color: var(--cv-neutral-mid); font-weight: 400; margin: 0; font-size: 0.78rem; }
.cp .seg { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--cv-neutral-border); border-radius: 8px; overflow: hidden; }
.cp .seg button { border: none; border-radius: 0; padding: 10px; background: var(--cv-neutral-white); color: var(--cv-primary); }
.cp .seg button + button { border-left: 1px solid var(--cv-neutral-border); }
.cp .seg button.on { background: var(--cv-primary); color: #fff; font-weight: 600; }
.err { color: #b3261e; font-size: 0.78rem; font-weight: 400; }

.validity { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-left: 3px solid var(--cv-accent); background: var(--cv-accent-light); border-radius: 0 8px 8px 0; font-size: 0.88rem; }
.validity span { color: var(--cv-neutral-mid); font-size: 0.78rem; }
.validity em { color: var(--cv-neutral-mid); font-style: normal; font-size: 0.78rem; }

.cp button { font: inherit; font-size: 0.88rem; cursor: pointer; border-radius: 8px; border: 1px solid var(--cv-neutral-border); background: var(--cv-neutral-white); color: var(--cv-primary); padding: 7px 12px; font-weight: 500; }
.cp button:hover { background: var(--cv-primary-light); }
.cp button.primary { padding: 12px 14px; font-size: 0.95rem; }
.cp button.primary:hover { background: var(--cv-grad-cta-hover); }
.cp button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.list-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.list-head select { width: auto; min-width: 200px; }
.empty { color: var(--cv-neutral-mid); margin: 8px 0; font-size: 0.9rem; }

.coupons { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.coupon { border: 1px solid var(--cv-neutral-border); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.coupon.expired, .coupon.disabled { background: var(--cv-neutral-light); }
.coupon-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.code { font-weight: 700; font-size: 1.05rem; display: block; color: var(--cv-primary); }
.uni { color: var(--cv-neutral-mid); font-size: 0.85rem; }
.badge { font-size: 0.75rem; padding: 3px 10px; border-radius: 999px; font-weight: 600; }
.badge.active { background: var(--cv-primary-light); color: var(--cv-primary); }
.badge.expired { background: var(--cv-accent-light); color: var(--cv-accent-dark); }
.badge.disabled { background: var(--cv-neutral-light); color: var(--cv-neutral-mid); border: 1px solid var(--cv-neutral-border); }
.meta { display: flex; flex-wrap: wrap; gap: 4px 16px; color: var(--cv-neutral-mid); font-size: 0.84rem; }
.usage-line { font-size: 0.88rem; }
.usage-line strong { font-size: 1.1rem; color: var(--cv-neutral-dark); }
.bar { height: 6px; background: var(--cv-neutral-border); border-radius: 999px; overflow: hidden; margin-top: 6px; }
.bar i { display: block; height: 100%; background: var(--cv-grad-horizontal); border-radius: 999px; }
.actions { display: flex; gap: 8px; flex-wrap: wrap; }

.overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); display: grid; place-items: center; padding: 20px; z-index: 50; }
.modal { background: var(--cv-neutral-white); color: var(--cv-neutral-dark); border-radius: 12px; padding: 22px; width: 100%; max-width: 560px; max-height: 80vh; overflow: auto; display: flex; flex-direction: column; gap: 12px; }
.modal h3 { margin: 0; font-size: 1.25rem; color: var(--cv-primary); }
.modal .sub { margin: 0; color: var(--cv-neutral-mid); font-size: 0.9rem; }
.modal table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
.modal th, .modal td { text-align: left; padding: 8px 6px; border-bottom: 1px solid var(--cv-neutral-border); }
.modal th { color: var(--cv-neutral-mid); font-weight: 500; }

.toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 11px 18px; border-radius: 8px; font-weight: 500; font-size: 0.9rem; z-index: 60; max-width: 90vw; color: #fff; }
.toast.success { background: var(--cv-primary); }
.toast.error { background: #b3261e; }

@media (prefers-reduced-motion: no-preference) {
  .bar i { transition: width 0.4s ease; }
}
`;