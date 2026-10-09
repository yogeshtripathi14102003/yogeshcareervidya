"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  FileCheck2,
  GraduationCap,
  User,
} from "lucide-react";

const STATUS_CONFIG = {
  verified: {
    label: "Approved",
    Icon: CheckCircle2,
    header: "bg-emerald-50 border-emerald-100",
    iconWrap: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-700",
    remarkBox: "border-emerald-200 bg-emerald-50",
    remarkText: "text-emerald-800",
    defaultRemark:
      "Congratulations! Your admission has been approved. Please visit the campus to complete the next steps.",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    header: "bg-red-50 border-red-100",
    iconWrap: "bg-red-100 text-red-600",
    title: "text-red-700",
    remarkBox: "border-red-200 bg-red-50",
    remarkText: "text-red-800",
    defaultRemark:
      "Your application could not be approved. Please contact the admission cell for details.",
  },
  pending: {
    label: "In Progress",
    Icon: Clock,
    header: "bg-accent-light border-orange-100",
    iconWrap: "bg-orange-100 text-accent-dark",
    title: "text-accent-dark",
    remarkBox: "border-neutral-border bg-neutral-light",
    remarkText: "text-neutral-dark",
    defaultRemark:
      "Your application is currently under review. Please check the status regularly.",
  },
};

function getConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

export default function StatusPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await api.get(
        `/api/v1/admissions/status?email=${encodeURIComponent(email.trim())}`
      );
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "There was an issue while checking the status."
      );
    } finally {
      setLoading(false);
    }
  };

  const config = data ? getConfig(data.status) : null;
  const StatusIcon = config?.Icon;

  // Timeline steps: Submitted -> Under Review -> Decision
  const decisionDone = data?.status === "verified" || data?.status === "rejected";
  const steps = [
    { label: "Submitted", state: "done" },
    { label: "Under Review", state: decisionDone ? "done" : "active" },
    {
      label: data?.status === "rejected" ? "Rejected" : "Approved",
      state: decisionDone
        ? data.status === "rejected"
          ? "rejected"
          : "done"
        : "idle",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-light px-3 py-8 sm:px-4 sm:py-14">
      {/* Heading */}
      <div className="mx-auto mb-8 max-w-xl text-center sm:mb-10">
        <div className="cv-icon-gradient mx-auto mb-4 h-12 w-12">
          <FileCheck2 size={22} />
        </div>
        <h1 className="m-0 text-2xl font-bold tracking-tight text-neutral-dark sm:text-3xl">
          Admission Status
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-mid">
          Check the status of the application you submitted with your account
          email.
        </p>
      </div>

      {/* Search card */}
      <div className="mx-auto w-full min-w-0 max-w-md rounded-2xl border border-neutral-border bg-white p-4 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] sm:p-6">
        <form onSubmit={handleCheckStatus} className="space-y-4">
          <div>
            <label
              htmlFor="status-email"
              className="mb-1.5 block text-xs font-medium text-neutral-dark sm:text-sm"
            >
              Registered Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-mid"
              />
              <input
                id="status-email"
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="box-border block h-12 w-full min-w-0 appearance-none rounded-xl border border-neutral-border bg-white pl-10 pr-3 text-base text-neutral-dark outline-none transition placeholder:text-neutral-mid focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm"
              />
            </div>

            <p className="m-0 mt-2 text-[11px] leading-4 text-neutral-mid">
              For your privacy, you can only check status for your own
              registered email.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cv-btn-cta inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Checking...
              </>
            ) : (
              <>
                <Search size={17} />
                Check My Status
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span className="min-w-0">{error}</span>
          </div>
        )}
      </div>

      {/* Result */}
      {data && config && (
        <div className="mx-auto mt-6 w-full min-w-0 max-w-md sm:mt-8">
          <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18)]">
            {/* Status header */}
            <div
              className={`flex items-center gap-3 border-b px-4 py-4 sm:px-6 ${config.header}`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${config.iconWrap}`}
              >
                <StatusIcon size={26} />
              </div>
              <div className="min-w-0">
                <p className="m-0 text-[11px] font-medium uppercase tracking-wider text-neutral-mid">
                  Application Status
                </p>
                <p
                  className={`m-0 mt-0.5 text-lg font-bold leading-tight ${config.title}`}
                >
                  {config.label}
                </p>
              </div>
            </div>

            <div className="space-y-5 px-4 py-5 sm:px-6">
              {/* Timeline */}
              <div className="flex items-start">
                {steps.map((s, i) => {
                  const dot =
                    s.state === "done"
                      ? "bg-emerald-500 text-white"
                      : s.state === "rejected"
                      ? "bg-red-500 text-white"
                      : s.state === "active"
                      ? "bg-accent text-white ring-4 ring-accent/20"
                      : "bg-neutral-border text-neutral-mid";

                  const lineDone =
                    steps[i + 1] &&
                    (steps[i + 1].state === "done" ||
                      steps[i + 1].state === "rejected" ||
                      steps[i + 1].state === "active");

                  return (
                    <div key={s.label} className="flex min-w-0 flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        <div
                          className={`h-0.5 flex-1 ${
                            i === 0
                              ? "bg-transparent"
                              : steps[i].state === "idle"
                              ? "bg-neutral-border"
                              : "bg-emerald-500"
                          }`}
                        />
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${dot}`}
                        >
                          {s.state === "done" ? (
                            <CheckCircle2 size={15} />
                          ) : s.state === "rejected" ? (
                            <XCircle size={15} />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <div
                          className={`h-0.5 flex-1 ${
                            i === steps.length - 1
                              ? "bg-transparent"
                              : lineDone
                              ? "bg-emerald-500"
                              : "bg-neutral-border"
                          }`}
                        />
                      </div>
                      <p
                        className={`m-0 mt-2 w-full truncate text-center text-[10px] sm:text-xs ${
                          s.state === "idle"
                            ? "text-neutral-mid"
                            : "font-semibold text-neutral-dark"
                        }`}
                      >
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Applicant details */}
              <div className="divide-y divide-neutral-border rounded-xl border border-neutral-border">
                <div className="flex items-start gap-3 px-3 py-3 sm:px-4">
                  <User size={17} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="m-0 text-[11px] text-neutral-mid">
                      Applicant Name
                    </p>
                    <p className="m-0 mt-0.5 break-words text-sm font-semibold text-neutral-dark">
                      {data.name || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-3 py-3 sm:px-4">
                  <GraduationCap
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div className="min-w-0">
                    <p className="m-0 text-[11px] text-neutral-mid">
                      Course Applied
                    </p>
                    <p className="m-0 mt-0.5 break-words text-sm font-semibold text-neutral-dark">
                      {data.course || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message from admission cell */}
              <div className={`rounded-xl border p-4 ${config.remarkBox}`}>
                <p className="m-0 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-mid">
                  Message from Admission Cell
                </p>

                <p
                  className={`m-0 break-words text-sm leading-relaxed ${config.remarkText} ${
                    data.adminRemark ? "font-medium" : ""
                  }`}
                >
                  {data.status === "verified"
                    ? config.defaultRemark
                    : data.adminRemark || config.defaultRemark}
                </p>
              </div>

              {data.status === "rejected" && (
                <p className="m-0 text-center text-xs font-medium leading-5 text-red-600">
                  Please re-submit the required documents as per the remarks
                  mentioned above.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="mx-auto mt-10 max-w-md text-center text-xs leading-5 text-neutral-mid sm:mt-12">
        <p className="m-0">
          In case of any issues, our team is here to help.
        </p>
        <div className="mt-2 flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-4">
          <a
            href="mailto:info@careervidya.in"
            className="inline-flex items-center gap-1.5 font-semibold text-neutral-dark hover:text-primary"
          >
            <Mail size={14} />
            info@careervidya.in
          </a>
          <a
            href="tel:+919289712364"
            className="inline-flex items-center gap-1.5 font-semibold text-neutral-dark hover:text-primary"
          >
            <Phone size={14} />
            +91 9289712364
          </a>
        </div>
      </div>
    </div>
  );
}