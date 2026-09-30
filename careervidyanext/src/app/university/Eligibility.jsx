"use client";

import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  UserCheck,
  ClipboardList,
  Target,
  Award,
  FileText,
  Download,
  Info,
  School,
  Briefcase,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";
import AuthModal from "@/app/university/AuthModal.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";

/* ═══════════════════════════════════════════════
   SMART ICON — Course name ke hisaab se
═══════════════════════════════════════════════ */
const getCourseIcon = (courseName) => {
  const t = (courseName || "").toLowerCase();
  if (t.includes("mba") || t.includes("management") || t.includes("bba"))
    return Briefcase;
  if (t.includes("mca") || t.includes("bca") || t.includes("computer"))
    return BookOpen;
  if (t.includes("ma") || t.includes("ba") || t.includes("arts"))
    return FileText;
  if (t.includes("msc") || t.includes("bsc") || t.includes("science"))
    return Target;
  if (t.includes("mcom") || t.includes("bcom") || t.includes("commerce"))
    return Award;
  if (t.includes("bed") || t.includes("education")) return School;
  return GraduationCap;
};

export default function EligibilitySection({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const eligibility = data?.eligibility || {};

  const heading = eligibility.heading || "Eligibility Criteria";
  const subHeading = eligibility.subHeading || "";
  const description = eligibility.description || "";
  const criteria = Array.isArray(eligibility.criteria)
    ? eligibility.criteria
    : [];
  const points = Array.isArray(eligibility.points) ? eligibility.points : [];

  const hasContent =
    heading || description || criteria.length > 0 || points.length > 0;

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

  if (!hasContent) return null;

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
            HEADER — Solid Navy + Download CTA
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
                {heading}
              </h2>
              {subHeading && (
                <p
                  className="text-sm mt-1"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {subHeading}
                </p>
              )}
            </div>

            {/* Download Brochure — Orange gradient */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta shrink-0 cursor-pointer flex items-center gap-2 px-4 py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download size={14} />
              Download Brochure
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BODY
        ═══════════════════════════════════════════ */}
        <div className="p-6 md:p-8">
          {/* Description */}
          {description && (
            <div
              className="rich-content text-sm leading-relaxed mb-6"
              style={{ color: "var(--cv-neutral-mid)" }}
              dangerouslySetInnerHTML={{
                __html: cleanHtml(description),
              }}
            />
          )}

          {/* Course-wise Criteria */}
          {criteria.length > 0 && (
            <div className="mb-8">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <ClipboardList size={16} />
                Course-wise Eligibility
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {criteria.map((item, index) => {
                  const Icon = getCourseIcon(item.courseName);
                  const isHovered = hoveredIndex === index;

                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200"
                      style={{
                        background: "#fff",
                        border: `1px solid ${
                          isHovered
                            ? "var(--cv-primary)"
                            : "var(--cv-neutral-border)"
                        }`,
                        boxShadow: isHovered
                          ? "0 8px 20px rgba(30, 58, 138, 0.12)"
                          : "none",
                      }}
                    >
                      <div
                        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {item.courseName && (
                          <h4
                            className="text-sm font-bold mb-1"
                            style={{ color: "var(--cv-neutral-dark)" }}
                          >
                            {item.courseName}
                          </h4>
                        )}
                        {item.requirement && (
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "var(--cv-neutral-mid)" }}
                          >
                            {item.requirement}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Points */}
          {points.length > 0 && (
            <div className="mb-6">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <Info size={16} />
                Additional Information
              </h3>

              <div
                className="rounded-xl p-5"
                style={{
                  background: "var(--cv-neutral-light)",
                  border: "1px solid var(--cv-neutral-border)",
                }}
              >
                <ul className="space-y-3">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <CheckCircle2 size={12} />
                      </div>
                      <p
                        className="text-sm leading-relaxed flex-1"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Important Note */}
          <div
            className="rounded-xl p-4 mb-6 flex items-start gap-3"
            style={{
              background: "var(--cv-primary-light)",
              border: "1px solid var(--cv-primary-light)",
            }}
          >
            <div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "#fff",
                color: "var(--cv-primary)",
              }}
            >
              <Info size={16} />
            </div>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wide mb-0.5"
                style={{ color: "var(--cv-primary)" }}
              >
                Important Note
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--cv-neutral-dark)" }}
              >
                Eligibility criteria may vary based on the course and
                specialization. Please verify the specific requirements for
                your chosen program before applying.
              </p>
            </div>
          </div>

          {/* ✅ SINGLE CTA — No Duplicate */}
          <div className="pt-2">
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta cursor-pointer flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserCheck size={16} />
              Check Your Eligibility
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
          universityName={data?.name || ""}
          course={{ name: "General Admission" }}
        />
      )}
    </>
  );
}