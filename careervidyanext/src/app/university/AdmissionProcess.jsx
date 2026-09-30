"use client";

import { useState } from "react";
import { CheckCircle2, Send, ClipboardList, GraduationCap } from "lucide-react";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { cleanHtml } from "@/utlis/cleanHtml.js";
import AuthModal from "@/app/university/AuthModal.jsx";

export default function AdmissionProcess({ data }) {
  const admission = data?.admission || {};
  const universityName = data?.name || "This University";

  const admissionHeading =
    admission.admissionHeading || `${universityName} Admission Process`;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const openActionPopup = (type) => {
    if (authLoading) return;
    if (isAuthenticated) {
      setOpenPopup(true);
    } else {
      setPendingAction(type);
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        setOpenPopup(true);
        setPendingAction(null);
      }, 250);
    }
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  if (
    !admission?.admissionPoints?.length &&
    !admission?.admissionDescription
  )
    return null;

  return (
    <>
      <section
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          background: "#fff",
          border: "1px solid var(--cv-neutral-border)",
        }}
      >
        {/* ═══════════════════════════════════════════
            HEADER — Solid Navy + Apply Now (Orange)
        ═══════════════════════════════════════════ */}
        <div
          className="px-6 md:px-8 py-5"
          style={{ background: "var(--cv-primary)" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: "#ffffff" }}
              >
                {admissionHeading}
              </h2>
              {admission.admissionSubHeading && (
                <p
                  className="text-sm mt-1 leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {admission.admissionSubHeading}
                </p>
              )}
            </div>

            {/* Apply Now — Orange gradient */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-60 group"
            >
              {authLoading ? (
                "Loading..."
              ) : (
                <>
                  Apply Now
                  <Send
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BODY
        ═══════════════════════════════════════════ */}
        <div className="p-6 md:p-8">
          {/* Description */}
          {admission.admissionDescription && (
            <div className="mb-8">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <ClipboardList size={16} />
                How to Apply
              </h3>
              <div
                className="rich-content text-sm leading-relaxed rounded-xl p-5"
                style={{
                  background: "var(--cv-neutral-light)",
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-mid)",
                }}
                dangerouslySetInnerHTML={{
                  __html: cleanHtml(admission.admissionDescription),
                }}
              />
            </div>
          )}

          {/* Admission Steps */}
          {admission.admissionPoints?.length > 0 && (
            <div>
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-4"
                style={{ color: "var(--cv-primary)" }}
              >
                <GraduationCap size={16} />
                Admission Steps
              </h3>

              <div className="grid gap-3">
                {admission.admissionPoints.map((point, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-white transition-all duration-200"
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cv-primary)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(30, 58, 138, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cv-neutral-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Step Number — Navy pill */}
                    <div
                      className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm"
                      style={{
                        background: "var(--cv-primary-light)",
                        border: "1px solid var(--cv-primary-light)",
                        color: "var(--cv-primary)",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 pt-1">
                      <div
                        className="rich-content text-sm leading-relaxed"
                        style={{ color: "var(--cv-neutral-dark)" }}
                        dangerouslySetInnerHTML={{
                          __html: cleanHtml(point),
                        }}
                      />
                    </div>

                    {/* Check icon — Navy, appears on hover */}
                    <div className="shrink-0 pt-1.5 hidden sm:block">
                      <CheckCircle2
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--cv-primary)" }}
                        size={20}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              CTA Buttons — Body (2 unique, no duplicate)
          ═══════════════════════════════════════════ */}
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Primary CTA — Orange gradient */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-60 group"
            >
              Start Your Application
              <Send
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {/* Secondary CTA — Navy outline */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer disabled:opacity-60"
              style={{
                background: "#fff",
                border: "1px solid var(--cv-primary)",
                color: "var(--cv-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cv-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              <ClipboardList size={16} />
              Download Prospectus
            </button>
          </div>
        </div>
      </section>

      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          onClose={() => {
            setAuthOpen(false);
            setPendingAction(null);
          }}
          defaultTab="login"
          onSuccess={handleAuthSuccess}
          universityName={data?.name || ""}
        />
      )}

      {/* APPLICATION POPUP */}
      {openPopup && (
        <Applicationpopup
          open={openPopup}
          setOpen={setOpenPopup}
          onClose={closePopup}
          universityName={universityName}
          course={{ name: "General Admission" }}
        />
      )}
    </>
  );
}