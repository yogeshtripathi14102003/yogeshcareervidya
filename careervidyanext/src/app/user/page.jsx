"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Copy,
  Check,
  MessageSquare,
  UserCheck,
  Award,
  GraduationCap,
  Share2,
} from "lucide-react";
import GetAdmissionForm from "@/app/user/component/Getadmissionfrom.jsx";

const SHARE_LINK = "https://careervidya.in/explore";

const SOCIAL_LINKS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/company/career-vidya/", img: "/images/i5.png" },
  { name: "X", url: "https://x.com/CareerVidya", img: "/images/i4.png" },
  { name: "Instagram", url: "https://www.instagram.com/career_vidya/", img: "/images/i3.png" },
  { name: "Facebook", url: "https://www.facebook.com/Career-Vidya", img: "/images/i2.png" },
  { name: "YouTube", url: "https://youtube.com/@careervidya02", img: "/images/i1.png" },
];

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  // Modal khula ho to body scroll lock + Escape se close
  useEffect(() => {
    if (!isFormOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setIsFormOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFormOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard title="Total Queries" value="0" Icon={MessageSquare} />
        <StatCard
          title="Profile Completion"
          value="80%"
          Icon={UserCheck}
          progress={80}
        />
        <StatCard title="Certificates" value="0" Icon={Award} />
      </div>

      {/* Continue Learning */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-neutral-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="cv-icon-gradient h-11 w-11 shrink-0">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="m-0 text-base font-semibold text-neutral-dark">
              Continue Learning
            </h2>
            <p className="m-0 mt-0.5 text-sm text-neutral-mid">
              Access your enrolled courses.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="cv-btn-cta min-h-11 w-full px-6 text-sm sm:w-auto"
        >
          Enroll Now
        </button>
      </div>

      {/* Social share */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-primary-light px-4 py-8 sm:p-8">
        <div className="mb-1 flex items-center gap-2 text-primary">
          <Share2 size={17} />
          <h3 className="m-0 text-sm font-semibold">Share CareerVidya</h3>
        </div>
        <p className="m-0 mb-5 text-center text-xs text-neutral-mid">
          Follow us and share the link with your friends.
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="group transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-border bg-white shadow-md transition-shadow group-hover:shadow-lg">
                <Image
                  src={social.img}
                  alt={social.name}
                  width={60}
                  height={60}
                  className="h-7 w-7 object-contain"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Copy box */}
        <div className="flex w-full min-w-0 max-w-sm items-center rounded-lg border border-primary/20 bg-white p-1 pl-3 shadow-sm sm:pl-4">
          <span className="mr-2 min-w-0 flex-1 truncate text-sm text-neutral-mid">
            {SHARE_LINK}
          </span>

          <div className="mx-1 h-8 w-px shrink-0 bg-neutral-border" />

          <button
            type="button"
            onClick={copyToClipboard}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition sm:px-4 ${
              copied
                ? "bg-emerald-50 text-emerald-700"
                : "text-primary hover:bg-primary-light"
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className="pointer-events-none absolute bottom-0 right-4 m-0 hidden text-[40px] md:block">
          😊
        </p>
      </div>

      {/* Admission form modal (body mein render hota hai, header ke upar) */}
      {isFormOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain bg-neutral-dark/50"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeForm();
            }}
          >
            <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6">
              <div className="w-full max-w-3xl">
                <GetAdmissionForm closeForm={closeForm} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, Icon, progress }) {
  return (
    <div className="min-w-0 rounded-xl border border-neutral-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 truncate text-[11px] font-semibold uppercase tracking-wider text-neutral-mid">
            {title}
          </p>
          <p className="m-0 mt-1 text-2xl font-bold leading-none text-primary">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
          <Icon size={19} />
        </div>
      </div>

      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-border">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "var(--cv-grad-horizontal)",
            }}
          />
        </div>
      )}
    </div>
  );
}