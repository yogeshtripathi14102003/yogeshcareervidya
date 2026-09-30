"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MonitorPlay,
  BookOpen,
  Users,
  FileText,
  Video,
  ClipboardList,
  MessageSquare,
  Award,
  CheckCircle2,
  PlayCircle,
  Download,
  Layers,
  Calendar,
  Smartphone,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

import { useAuth } from "@/context/AuthContext.jsx";
import AuthModal from "@/app/university/AuthModal.jsx";
import Applictionpopup from "@/app/university/Applictionpopup.jsx";

/* ═══════════════════════════════════════════════
   SMART ICON — Feature text ke hisaab se
═══════════════════════════════════════════════ */
const getFeatureIcon = (text) => {
  const t = (text || "").toLowerCase();
  if (t.includes("live") || t.includes("class")) return MonitorPlay;
  if (t.includes("record") || t.includes("video") || t.includes("lecture"))
    return Video;
  if (
    t.includes("ebook") ||
    t.includes("e-book") ||
    t.includes("book") ||
    t.includes("material")
  )
    return BookOpen;
  if (t.includes("assignment") || t.includes("quiz")) return ClipboardList;
  if (t.includes("discussion") || t.includes("forum") || t.includes("chat"))
    return MessageSquare;
  if (t.includes("faculty") || t.includes("mentor") || t.includes("teacher"))
    return Users;
  if (t.includes("certificate") || t.includes("degree")) return Award;
  if (t.includes("pdf") || t.includes("note") || t.includes("content"))
    return FileText;
  if (t.includes("mobile") || t.includes("app")) return Smartphone;
  if (t.includes("schedule") || t.includes("calendar")) return Calendar;
  if (t.includes("module") || t.includes("course")) return Layers;
  if (t.includes("play") || t.includes("demo")) return PlayCircle;
  return CheckCircle2;
};

export default function LmsSection({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [popupOpen, setPopupOpen] = useState(false);

  const lms = data?.lms || {};
  const heading = lms.heading || "Learning Management System (LMS)";
  const subHeading = lms.subHeading || "";
  const description = lms.description || "";
  const features = Array.isArray(lms.features) ? lms.features : [];
  const image = lms.image || null;

  const hasContent = heading || description || features.length > 0 || image;

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
            HEADER — Solid Navy + Watch Demo (Orange)
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

            {/* ✅ Watch Demo — Orange gradient (UNIQUE) */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta shrink-0 flex items-center gap-2 px-4 py-2 text-xs cursor-pointer disabled:opacity-60"
            >
              <PlayCircle size={14} />
              Watch Demo
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

          {/* LMS Image */}
          {image && (
            <div
              className="mb-6 rounded-xl overflow-hidden"
              style={{
                border: "1px solid var(--cv-neutral-border)",
                background: "#fff",
              }}
            >
              <Image
                src={image}
                alt={heading}
                width={1400}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Features Grid */}
          {features.length > 0 && (
            <div>
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <Layers size={16} />
                Key Features
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature, index) => {
                  const Icon = getFeatureIcon(feature);
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
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <Icon size={15} />
                      </div>

                      <p
                        className="text-sm leading-relaxed font-medium flex-1"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        {feature}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              CTA Buttons — NO DUPLICATE
              - Explore LMS (Orange gradient)
              - Download Brochure (Navy outline) — UNIQUE
          ═══════════════════════════════════════════ */}
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Explore LMS — Orange gradient */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-60"
            >
              <MonitorPlay size={16} />
              Explore LMS
            </button>

            {/* Download Brochure — Navy outline (UNIQUE) */}
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
              <Download size={16} />
              Download Brochure
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