"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  Award,
  CheckCircle2,
  MonitorPlay,
  Percent,
  ClipboardList,
  ListChecks,
  BookOpenCheck,
  Target,
  ShieldCheck,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";
import AuthModal from "@/app/university/AuthModal.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import Applictionpopup from "@/app/university/Applictionpopup.jsx";

export default function ExamPatternSection({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [popupOpen, setPopupOpen] = useState(false);

  const exam = data?.examPattern || {};

  const heading = exam.heading || "Examination Pattern";
  const subHeading = exam.subHeading || "";
  const description = exam.description || "";
  const mode = exam.mode || "";
  const duration = exam.duration || "";
  const totalMarks = exam.totalMarks || "";
  const passingMarks = exam.passingMarks || "";
  const questionTypes = Array.isArray(exam.questionTypes)
    ? exam.questionTypes
    : [];
  const points = Array.isArray(exam.points) ? exam.points : [];

  const hasContent =
    heading ||
    description ||
    mode ||
    duration ||
    totalMarks ||
    passingMarks ||
    questionTypes.length > 0 ||
    points.length > 0;

  const openActionPopup = (type) => {
    if (authLoading) return;
    if (isAuthenticated) {
      setPopupOpen(true);
    } else {
      setPendingAction(type);
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        setPopupOpen(true);
        setPendingAction(null);
      }, 250);
    }
  };

  if (!hasContent) return null;

  const highlightCards = [
    mode && { icon: MonitorPlay, label: "Exam Mode", value: mode },
    duration && { icon: Clock, label: "Duration", value: duration },
    totalMarks && { icon: Target, label: "Total Marks", value: totalMarks },
    passingMarks && {
      icon: Award,
      label: "Passing Marks",
      value: passingMarks,
    },
  ].filter(Boolean);

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
            HEADER — View Sample Paper (Unique)
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

            {/* View Sample Paper — Orange gradient */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta shrink-0 flex items-center gap-2 px-4 py-2 text-xs cursor-pointer disabled:opacity-60"
            >
              <ClipboardList size={14} />
              View Sample Paper
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

          {/* Highlight Cards */}
          {highlightCards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {highlightCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl p-4 shadow-sm transition-all duration-200"
                    style={{
                      background: "#fff",
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
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                      style={{
                        background: "var(--cv-primary-light)",
                        color: "var(--cv-primary)",
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wide"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      {card.label}
                    </p>
                    <p
                      className="text-sm md:text-base font-bold mt-0.5 leading-tight"
                      style={{ color: "var(--cv-neutral-dark)" }}
                    >
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Question Types */}
          {questionTypes.length > 0 && (
            <div className="mb-8">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <ListChecks size={16} />
                Question Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {questionTypes.map((type, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-all"
                    style={{
                      background: "var(--cv-primary-light)",
                      border: "1px solid var(--cv-primary-light)",
                      color: "var(--cv-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cv-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cv-primary-light)";
                    }}
                  >
                    <BookOpenCheck size={12} />
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Points */}
          {points.length > 0 && (
            <div className="mb-6">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <ClipboardList size={16} />
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {points.map((point, index) => {
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
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <CheckCircle2 size={14} />
                      </div>
                      <p
                        className="text-sm leading-relaxed flex-1"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        {point}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Passing Criteria */}
          {(totalMarks || passingMarks) && (
            <div className="mb-6">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <Percent size={16} />
                Passing Criteria
              </h3>
              <div
                className="rounded-xl p-5"
                style={{
                  background: "var(--cv-neutral-light)",
                  border: "1px solid var(--cv-neutral-border)",
                }}
              >
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  {totalMarks && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <Target size={18} />
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase font-bold tracking-wide"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          Total Marks
                        </p>
                        <p
                          className="text-base font-bold"
                          style={{ color: "var(--cv-neutral-dark)" }}
                        >
                          {totalMarks}
                        </p>
                      </div>
                    </div>
                  )}

                  {totalMarks && passingMarks && (
                    <div
                      className="hidden md:block w-px h-10"
                      style={{ background: "var(--cv-neutral-border)" }}
                    />
                  )}

                  {passingMarks && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <Award size={18} />
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase font-bold tracking-wide"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          Passing Marks
                        </p>
                        <p
                          className="text-base font-bold"
                          style={{ color: "var(--cv-neutral-dark)" }}
                        >
                          {passingMarks}
                        </p>
                      </div>
                    </div>
                  )}

                  {totalMarks && passingMarks && (
                    <div
                      className="hidden md:block w-px h-10"
                      style={{ background: "var(--cv-neutral-border)" }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: "var(--cv-primary-light)",
                        color: "var(--cv-primary)",
                      }}
                    >
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wide"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        Evaluation
                      </p>
                      <p
                        className="text-base font-bold"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        Fair & Transparent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              CTA — Sirf 1 button (no duplicate)
          ═══════════════════════════════════════════ */}
          <div className="pt-2">
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-60"
            >
              <FileText size={16} />
              Download Syllabus
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
      {popupOpen && (
        <Applictionpopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          type="apply"
          universityName={data?.name || ""}
        />
      )}
    </>
  );
}