"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Globe,
  Headset,
  UserCheck,
  CreditCard,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  FileText,
  BookOpen,
  Search,
  CheckCircle2,
  Download,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

import { useAuth } from "@/context/AuthContext.jsx";
import AuthModal from "@/app/university/AuthModal.jsx";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";

/* ═══════════════════════════════════════════════
   SMART ICON — Title ke hisaab se
═══════════════════════════════════════════════ */
const getSmartIcon = (text) => {
  const t = (text || "").toLowerCase();
  if (t.includes("flexible") || t.includes("university")) return Globe;
  if (t.includes("counselling") || t.includes("expert")) return Headset;
  if (t.includes("one-on-one") || t.includes("advisor")) return UserCheck;
  if (t.includes("emi") || t.includes("payment")) return CreditCard;
  if (t.includes("loan") || t.includes("scholarship")) return GraduationCap;
  if (t.includes("placement") || t.includes("job")) return Briefcase;
  if (t.includes("alumni") || t.includes("network")) return Users;
  if (t.includes("verified") || t.includes("degree")) return Award;
  if (t.includes("admission") || t.includes("documentation")) return FileText;
  if (t.includes("academic") || t.includes("post-admission")) return BookOpen;
  if (t.includes("transparent") || t.includes("unbiased")) return Search;
  return CheckCircle2;
};

export default function CareerVidyaBenefits({ data, title }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const universityName = data?.name || "";
  const benefitsSection = data?.careerVidyaBenefits || {};

  const heading = benefitsSection.heading || "Career Vidya Benefits";
  const subHeading = benefitsSection.subHeading || "";
  const description = benefitsSection.description || "";
  const benefits = benefitsSection.benefits || [];

  const headingText = `${universityName} ${
    title || `With ${heading}`
  }`.trim();

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

  if (!benefits.length && !description) return null;

  return (
    <>
      <section
        className="rounded-2xl p-6 md:p-8 shadow-sm"
        style={{
          background: "var(--cv-neutral-light)",
          border: "1px solid var(--cv-neutral-border)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* ═══════════════════════════════════════════
              HEADER — Navy heading + Orange button
          ═══════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-xl md:text-3xl font-extrabold leading-tight"
                style={{ color: "var(--cv-primary)" }}
              >
                {headingText}
              </h2>
              {subHeading && (
                <p
                  className="text-sm md:text-base mt-1"
                  style={{ color: "var(--cv-neutral-mid)" }}
                >
                  {subHeading}
                </p>
              )}
            </div>

            {/* Download Brochure — Orange gradient */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-60"
              style={{ borderRadius: "9999px" }}
            >
              <Download size={16} />
              Download Brochure
            </button>
          </div>

          {/* ═══════════════════════════════════════════
              DESCRIPTION
          ═══════════════════════════════════════════ */}
          {description && (
            <div
              className="rich-content leading-relaxed mb-6"
              style={{ color: "var(--cv-neutral-mid)" }}
              dangerouslySetInnerHTML={{
                __html: cleanHtml(description),
              }}
            />
          )}

          {/* ═══════════════════════════════════════════
              BENEFITS GRID
          ═══════════════════════════════════════════ */}
          {benefits.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {benefits.map((benefit, index) => {
                const Icon = getSmartIcon(benefit.title);
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
                        ? "0 12px 24px rgba(30, 58, 138, 0.15)"
                        : "0 1px 3px rgba(0, 0, 0, 0.04)",
                      transform: isHovered
                        ? "translateY(-2px)"
                        : "translateY(0)",
                    }}
                  >
                    {/* Icon — Navy bg */}
                    <div
                      className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-200"
                      style={{
                        background: "var(--cv-primary)",
                        color: "#ffffff",
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {benefit.icon ? (
                        <Image
                          src={benefit.icon}
                          alt={benefit.title || "icon"}
                          width={36}
                          height={36}
                          className="object-contain w-full h-full p-1"
                        />
                      ) : (
                        <Icon size={16} />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      {benefit.title && (
                        <h4
                          className="text-sm font-bold mb-1"
                          style={{ color: "var(--cv-neutral-dark)" }}
                        >
                          {benefit.title}
                        </h4>
                      )}
                      {benefit.description && (
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--cv-neutral-mid)" }}
                        >
                          {benefit.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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