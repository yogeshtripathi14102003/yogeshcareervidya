"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CAREER_URL = "https://jobportal.careervidya.in";

const LINKS = [
  { label: "Latest Jobs", href: `${CAREER_URL}/jobs` },
  { label: "Top Companies", href: `${CAREER_URL}/companies` },
  { label: "Resume Builder", href: `${CAREER_URL}/resume-builder` },
];

export default function CareerHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="career-navbar">
      {/* Logo */}
      <Link
        href="/"
        className="logo-wrapper"
        onClick={() => setOpen(false)}
      >
        <div className="logo-box">
          <Image
            src="/images/n12.png"
            alt="CareerVidya Logo"
            width={70}
            height={40}
            className="logo-img"
            priority
          />
        </div>
      </Link>

      {/* Desktop links */}
      <div className="career-navlinks">
        <span className="career-nav-badge">🔥 350+ Active Jobs</span>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} className="career-nav-link">
            {l.label}
          </a>
        ))}
      </div>

      {/* Mobile hamburger button */}
      <button
        className={`career-burger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu */}
      <div className={`career-mobile-menu ${open ? "show" : ""}`}>
        <span className="career-nav-badge">🔥 350+ Active Jobs</span>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="career-mobile-link"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>

      <style jsx>{`
        .career-navbar {
          background: #ffffff;
          border-bottom: 1px solid var(--cv-neutral-border);
          padding: 8px 8%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          font-family: var(--font-poppins), "Poppins", sans-serif;
        }

        /* Logo */
        .career-navbar :global(.logo-wrapper) {
          flex-shrink: 0;
          z-index: 2;
          text-decoration: none;
        }

        .logo-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-box :global(.logo-img) {
          width: 90px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .career-navlinks {
          display: flex;
          align-items: center;
          gap: 24px;
          animation: navFadeIn 0.35s ease-out;
        }

        @keyframes navFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .career-nav-badge {
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          background: var(--cv-primary-light);
          color: var(--cv-primary);
          border-radius: 20px;
          white-space: nowrap;
          width: fit-content;
        }

        .career-nav-link {
          color: var(--cv-neutral-dark);
          font-weight: 700;
          font-size: 14px;
          transition: color 0.2s ease;
          text-decoration: none;
        }

        .career-nav-link:hover {
          color: var(--cv-primary);
        }

        /* Hamburger (hidden on desktop) */
        .career-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .career-burger span {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--cv-neutral-dark);
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }

        .career-burger.is-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .career-burger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .career-burger.is-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Mobile dropdown (hidden on desktop) */
        .career-mobile-menu {
          display: none;
        }

        @media (max-width: 900px) {
          .career-navbar {
            padding: 8px 5%;
          }

          .career-navlinks {
            display: none;
          }

          .logo-box :global(.logo-img) {
            width: 80px;
          }

          .career-burger {
            display: flex;
          }

          .career-mobile-menu {
            display: flex;
            flex-direction: column;
            gap: 4px;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #ffffff;
            border-bottom: 1px solid var(--cv-neutral-border);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
            padding: 0 5%;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.25s ease,
              padding 0.3s ease;
          }

          .career-mobile-menu.show {
            max-height: 320px;
            opacity: 1;
            padding: 16px 5%;
          }

          .career-mobile-link {
            color: var(--cv-neutral-dark);
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            padding: 12px 4px;
            border-bottom: 1px solid var(--cv-neutral-border);
          }

          .career-mobile-link:last-child {
            border-bottom: none;
          }

          .career-mobile-link:hover {
            color: var(--cv-primary);
          }
        }
      `}</style>
    </nav>
  );
}