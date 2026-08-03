"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Compass,
  BookOpen,
  Sparkles,
  Wallet,
  FileText,
  Users,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Cloud,
  Megaphone,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Award,
  BriefcaseBusiness,
  MapPin,
  Clock,
  Zap,
  Phone,
  MessageCircle,
} from "lucide-react";
import FAQ from "../app/components/FAQ";
import Quickaction from "@/app/components/Quickaction";
import Quickaction1 from "@/app/components/Quickaction1";
import Footer from "@/app/layout/Footer";
import Header from "@/app/layout/Header";

const VIDYA_URL = "/Home";
const CAREER_URL = "http://localhost:3001";
const LOGO_SRC = "/images/n12.png";
const HERO_BG_IMG = "/images/testing4.jpeg";
const VIDYA_IMG = "/images/test3.jpeg";
const CAREER_IMG = "/images/test2.jpeg";
const COUNSELLING_IMG = "/images/career1.jpeg";

const COURSES = [
  { icon: TrendingUp, name: "Data science", unis: "120+ universities", color: "#2f6fed" },
  { icon: Cpu, name: "Artificial intelligence", unis: "95+ universities", color: "#06b6d4" },
  { icon: ShieldCheck, name: "Cyber security", unis: "85+ universities", color: "#f5a623" },
  { icon: Cloud, name: "Cloud computing", unis: "75+ universities", color: "#3b82f6" },
  { icon: Megaphone, name: "Digital marketing", unis: "60+ universities", color: "#a855f7" },
];

const PARTNER_LOGOS = [
  {
    name: "Amity University",
    image: "/images/w2.webp",
  },
  {
    name: "LPU Online",
    image: "/images/w1.webp",
  },
  {
    name: "Manipal University",
    image: "/images/w3.webp",
  },
  {
    name: "Chandigarh University",
    image: "/images/w4.webp",
  },
  {
    name: "SRM University",
    image: "/image/w5.webp",
  },
  {
    name: "DY Patil University",
    image: "/universities/dy-patil.png",
  },
];

const TRENDING_JOBS = [
  {
    title: "Software Engineer",
    company: "HCL Technologies",
    short: "HCL",
    logo: "/images/hcl2.jpeg",
    mono: "#e11d48",
    location: "Bangalore",
    workMode: "Full-time",
    exp: "2-5 Yrs",
    salary: "₹6 - 12 LPA",
    isNew: true,
    href: `${CAREER_URL}/jobs/software-engineer`,
  },
  {
    title: "System Engineer",
    company: "Infosys Limited",
    short: "IN",
    logo: "/images/inf1.jpeg",
    mono: "#2563eb",
    location: "Hyderabad",
    workMode: "Full-time",
    exp: "1-3 Yrs",
    salary: "₹4 - 8 LPA",
    isNew: true,
    href: `${CAREER_URL}/jobs/system-engineer`,
  },
  {
    title: "Associate Product Manager",
    company: "samsung",
    short: "a",
    logo: "/images/sum.jpeg",
    mono: "#f59e0b",
    location: "Delhi NCR",
    workMode: "Full-time",
    exp: "3-6 Yrs",
    salary: "₹12 - 20 LPA",
    isNew: false,
    href: `${CAREER_URL}/jobs/associate-product-manager`,
  },
];

const TRENDING_COURSES_HOME = [
  {
    title: "MBA",
    sub: "Master of Business Administration",
    university: "Amity University",
    short: "AU",
    mono: "#8b5cf6",
    duration: "2 Years",
    fee: "₹2.5 - 15 LPA",
    href: "/course/online-mba-1",
  },
  {
    title: "B.Tech Computer Science",
    sub: "Bachelor of Technology",
    university: "LPU Online",
    short: "LPU",
    mono: "#0d9488",
    duration: "4 Years",
    fee: "₹1.2 - 6 LPA",
    href: "/course/btech-bachelors-of-technology",
  },
  {
    title: "BCA",
    sub: "Bachelor of Computer Applications",
    university: "Chandigarh University",
    short: "CU",
    mono: "#2563eb",
    duration: "3 Years",
    fee: "₹80K - 3 LPA",
    href: "/course/online-bca-bachelor-of-computer-applications",
  },
];

export default function CareerVidyaHome() {
  const [hovered, setHovered] = useState(null); // 'vidya' | 'career' | null
  const [jobFilter, setJobFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  return (
    <div className="cv-root">
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .cv-root {
          --ink: #0d1b2e;
          --muted: #5b677e;
          --line: rgba(13,27,46,0.1);
          --teal: #0056B3;
          --teal-deep: #0056B3;
          --teal-tint: #e3f4f1;
          --gold: #c15304;
          --gold-deep: #c15304;
          --gold-tint: #fef3e2;
          --surface: #ffffff;
          --panel: #ffffff;
          font-family: 'Inter', sans-serif;
          color: var(--ink);
          background: var(--surface);
        }

        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }

        .cv-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
        @media (min-width: 640px) { .cv-container { padding: 0 32px; } }

        /* hero */
        .cv-hero {
          padding: 32px 0 24px; text-align: center; position: relative; overflow: hidden;
        }
        @media (min-width: 640px) { .cv-hero { padding: 44px 0 32px; } }
        .cv-hero-bg {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 100vw; height: 100%;
          object-fit: cover; object-position: center top;
          opacity: 0.68; pointer-events: none; z-index: 0;
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
        .cv-hero-top { position: relative; }
        .cv-hero-top > * { position: relative; z-index: 1; }
        .cv-path-wrap { z-index: 1; }
        .cv-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-deep);
          margin-bottom: 14px;
        }
        .cv-h1 {
          font-family: 'Inter', sans-serif; font-size: clamp(28px, 6.4vw, 44px); font-weight: 600;
          line-height: 1.18; letter-spacing: -0.6px; margin: 0 0 16px; color: var(--ink);
        } 
        .cv-h1 em { font-style: italic; color: var(--teal); }
        .cv-hero-sub {
          color: var(--muted); font-size: 14.5px; line-height: 1.7; max-width: 560px;
          margin: 0 auto 32px;
        }
        @media (min-width: 640px) { .cv-hero-sub { font-size: 15.5px; margin: 0 auto 40px; } }

        @keyframes cv-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cv-animate { animation: cv-rise 0.6s cubic-bezier(.2,.8,.2,1) both; }

        /* choose your path — two side-by-side panels with a logo divider */
        .cv-path-wrap { position: relative; max-width: 980px; margin: 0 auto; }
        .cv-path-grid {
          display: grid; grid-template-columns: 1fr; gap: 16px; text-align: left; align-items: stretch;
        }
        @media (min-width: 860px) { .cv-path-grid { grid-template-columns: 1fr 1fr; gap: 88px; } }

        .cv-path-or {
          display: flex; align-items: center; justify-content: center;
          position: relative; margin: 0 auto; z-index: 3; overflow: visible; padding: 0;
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(155deg, #ffffff 0%, var(--teal-tint) 55%, var(--gold-tint) 100%);
          border: 3px solid #ffffff;
          box-shadow:
            0 14px 28px -12px rgba(13,27,46,0.3),
            0 6px 14px -6px rgba(0,86,179,0.18),
            0 0 0 1px var(--line);
          transition: transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease;
        }
        .cv-path-or::before {
          content: "";
          position: absolute; inset: -8px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,86,179,0.10) 0%, rgba(193,83,4,0.08) 55%, transparent 75%);
          z-index: -1;
        }
        .cv-path-or-inner {
          width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          background: #fff; padding: 5px;
          box-shadow: inset 0 0 0 1px var(--line);
        }
        @media (min-width: 860px) {
          .cv-path-or {
            position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            width: 98px; height: 98px;
          }
          .cv-path-or:hover {
            transform: translate(-50%, -50%) scale(1.06);
            box-shadow:
              0 28px 54px -14px rgba(13,27,46,0.4),
              0 10px 22px -6px rgba(0,86,179,0.24),
              0 0 0 1px var(--line);
          }
          .cv-path-or-inner { padding: 6px; }
        }
        .cv-path-or img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }

        .cv-path-card {
          border-radius: 16px; padding: 20px 20px; border: 1px solid var(--line); background: #fff;
          display: flex; flex-direction: row; align-items: center; gap: 16px;
          position: relative; overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .cv-path-card.is-hover { transform: translateY(-3px); }
        .cv-path-card.vidya.is-hover {
          box-shadow: 0 16px 32px -18px rgba(13,148,136,0.3);
          background: linear-gradient(135deg, var(--teal-tint) 0%, #ffffff 45%, var(--gold-tint) 100%);
          border-color: rgba(0,86,179,0.55);
        }
        .cv-path-card.career.is-hover {
          box-shadow: 0 16px 32px -18px rgba(245,166,35,0.35);
          background: linear-gradient(135deg, var(--gold-tint) 0%, #ffffff 45%, var(--teal-tint) 100%);
          border-color: rgba(193,83,4,0.55);
        }

        .cv-path-content { flex: 1; min-width: 0; display: flex; flex-direction: column; position: relative; z-index: 1; }

        .cv-path-media {
          flex: 0 0 clamp(120px, 30%, 190px);
          align-self: flex-end;
          display: flex; align-items: flex-end; justify-content: center;
          order: -1;
        }
        .cv-path-card.career .cv-path-media { order: 2; }

        .cv-path-media img {
          width: 100%;
          height: auto;
          max-height: 190px;
          object-fit: contain;
          display: block;
        }
        @media (max-width: 480px) {
          .cv-path-media { flex-basis: 90px; }
          .cv-path-media img { max-height: 120px; }
        }

        .cv-path-kicker {
          font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;
        }
        .cv-path-card.vidya .cv-path-kicker { color: var(--teal); }
        .cv-path-card.career .cv-path-kicker { color: var(--gold-deep); }

        .cv-path-title { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 700; margin: 0 0 8px; color: var(--ink); }
        .cv-path-desc { color: var(--muted); font-size: 12.5px; line-height: 1.6; margin: 0 0 14px; max-width: 300px; }

        .cv-path-list { list-style: none; margin: 0 0 16px; padding: 12px 0 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 8px; }
        .cv-path-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; color: var(--ink); }
        .cv-path-list .cv-path-list-icon {
          width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .cv-path-card.vidya .cv-path-list-icon { background: var(--teal-tint); color: var(--teal); }
        .cv-path-card.career .cv-path-list-icon { background: var(--gold-tint); color: var(--gold-deep); }

        .cv-path-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; font-size: 13px;
          padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer; margin-top: auto;
        }
        .cv-path-card.vidya .cv-path-cta { background: var(--teal); color: #fff; }
        .cv-path-card.career .cv-path-cta { background: var(--gold); color: #2a1804; }

        /* ============ Trending jobs / trending courses section ============ */
        .cv-trending { padding: 30px 0 12px; }
        .cv-trending-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 900px) { .cv-trending-grid { grid-template-columns: 1fr 1fr; gap: 22px; } }

        .cv-trending-col {
          border: 1px solid var(--line); border-radius: 18px; padding: 18px;
          background: var(--panel);
          display: flex; flex-direction: column;
        }

        .cv-trending-headrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
        .cv-trending-headrow-icon {
          width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .cv-trending-col.jobs .cv-trending-headrow-icon { background: var(--gold-tint); color: var(--gold-deep); }
        .cv-trending-col.courses .cv-trending-headrow-icon { background: var(--teal-tint); color: var(--teal-deep); }
        .cv-trending-headtext { flex: 1; min-width: 0; }
        .cv-trending-title-lg { font-family: 'Inter', sans-serif; font-size: 17.5px; font-weight: 600; color: var(--ink); }
        .cv-trending-title-lg .accent-gold { color: var(--gold-deep); }
        .cv-trending-title-lg .accent-teal { color: var(--teal-deep); }
        .cv-trending-caption { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .cv-trending-viewall {
          font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; padding-top: 8px;
          display: inline-flex; align-items: center; gap: 3px;
        }
        .cv-trending-viewall:hover { color: var(--ink); }

        /* fire label */
        .cv-trending-firelabel {
          font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 10px;
        }

        .cv-trending-stack { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
        .cv-trending-card {
          display: flex; align-items: center; gap: 12px; padding: 12px;
          border: 1px solid var(--line); border-radius: 14px; transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cv-trending-card:hover { border-color: rgba(13,27,46,0.2); transform: translateY(-2px); box-shadow: 0 10px 22px -16px rgba(13,27,46,0.35); }
        .cv-trending-logo {
          width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-weight: 700; font-size: 13px; text-transform: uppercase; overflow: hidden;
        }
        .cv-trending-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .cv-trending-info { flex: 1; min-width: 0; }
        .cv-trending-title-row { display: flex; align-items: center; gap: 6px; }
        .cv-trending-title { font-size: 13.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cv-new-badge {
          font-size: 9.5px; font-weight: 700; color: #0d9488; background: #e3f4f1; border-radius: 999px;
          padding: 1.5px 7px; flex-shrink: 0;
        }
        .cv-trending-org { font-size: 12px; color: var(--muted); margin-top: 1px; }
        .cv-trending-sub { font-size: 11px; color: var(--muted); margin-top: 3px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .cv-trending-sub .dot::before { content: "·"; margin: 0 1px; }
        .cv-trending-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
        .cv-trending-price { font-size: 12.5px; font-weight: 700; }
        .cv-trending-col.jobs .cv-trending-price { color: #0d9488; }
        .cv-trending-col.courses .cv-trending-price { color: var(--teal-deep); }
        .cv-trending-cta {
          font-size: 11.5px; font-weight: 700; padding: 7px 13px; border-radius: 8px; border: none;
          display: inline-flex; align-items: center; gap: 4px; cursor: pointer; white-space: nowrap; flex-shrink: 0;
        }
        .cv-trending-col.jobs .cv-trending-cta { background: var(--teal); color: #fff; }
        .cv-trending-col.courses .cv-trending-cta { background: var(--gold); color: #2a1804; }

        .cv-trending-more {
          width: 100%; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink);
          padding: 11px; border-radius: 10px; border: 1px dashed var(--line); background: #fff; cursor: pointer;
          margin-top: auto;
        }
        .cv-trending-more:hover { border-color: var(--ink); }

        /* quick action strip (used by Quickaction / Quickaction1 components) */
        .cv-quick-actions {
          max-width: 1440px;
          margin: 0 auto;
          padding: 20px 20px 30px;
        }
        @media (min-width: 640px) { .cv-quick-actions { padding: 24px 32px 36px; } }
        .cv-quickgrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        @media (min-width: 640px) {
          .cv-quickgrid { gap: 16px; }
        }
        @media (min-width: 900px) {
          .cv-quickgrid {
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 18px;
          }
        }
        .cv-quick-card {
          position: relative;
          overflow: hidden;
          min-height: 108px;
          background: linear-gradient(150deg, #ffffff 0%, #f5f9ff 100%);
          border: 1px solid rgba(13, 27, 46, 0.07);
          border-radius: 18px;
          padding: 18px 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 4px;
          transition: transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .cv-quick-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 34px -20px rgba(13,27,46,0.28);
          border-color: rgba(0,86,179,0.22);
        }
        @media (min-width: 640px) {
          .cv-quick-card { padding: 20px 22px 18px; min-height: 116px; }
        }
        .cv-quick-card-copy { position: relative; z-index: 1; max-width: 78%; }
        .cv-quick-card .cv-quick-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          flex-shrink: 0;
        }
        .cv-quick-card .cv-quick-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .cv-quick-title {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
          margin: 0 0 4px;
        }
        .cv-quick-desc {
          font-size: 12px;
          color: #5b677e;
          line-height: 1.5;
          margin: 0;
        }
        .cv-quick-cta {
          align-self: flex-start;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 10px;
          border: none;
          color: #fff;
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .cv-quick-cta:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .cv-quick-image {
          position: absolute;
          bottom: -6px;
          right: -4px;
          width: 74px;
          height: 74px;
          pointer-events: none;
          opacity: 0.95;
        }
        .cv-quick-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .cv-quick-card.help {
          background: linear-gradient(150deg, #0c2e5c 0%, #0a2447 100%);
          color: #fff;
          border-color: transparent;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
        .cv-quick-card.help .cv-quick-title { color: #fff; }
        .cv-quick-card.help .cv-quick-desc { color: rgba(255,255,255,0.82); }
        .cv-quick-card.help .cv-quick-icon {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .cv-quick-help-row {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
          position: relative;
          z-index: 1;
        }
        .cv-quick-help-link,
        .cv-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 10px;
          text-decoration: none;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .cv-quick-help-link:hover,
        .cv-btn-whatsapp:hover { transform: translateY(-1px); filter: brightness(1.05); }
        .cv-quick-help-link {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .cv-btn-whatsapp {
          background: #10b981;
          color: #0f172a;
        }

        /* partners — wide auto-scrolling logo slider */
        .cv-partners-marquee {
          width: 100%; overflow: hidden; position: relative;
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }
        .cv-partners-track {
          display: flex; align-items: center; gap: 16px; width: max-content;
          animation: cv-marquee 32s linear infinite;
        }
        .cv-partners-track:hover { animation-play-state: paused; }
        @keyframes cv-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .cv-partner-logo {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0; white-space: nowrap;
          padding: 12px 22px; border: 1px solid var(--line); border-radius: 14px; background: #fff;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .cv-partner-logo:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 26px -16px rgba(13,27,46,0.3);
          border-color: rgba(0,86,179,0.3);
        }

        /* footer (used by imported Footer component) */
        .cv-footer { border-top: 1px solid var(--line); padding: 44px 0 28px; }
        .cv-footer-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }
        @media (min-width: 760px) { .cv-footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1.2fr; } }
        .cv-footer-desc { font-size: 13.5px; color: var(--muted); line-height: 1.6; margin: 14px 0 16px; max-width: 260px; }
        .cv-footer-social { display: flex; gap: 10px; }
        .cv-footer-social a {
          width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center; color: var(--muted);
        }
        .cv-footer-social a:hover { color: var(--teal); border-color: var(--teal); }
        .cv-footer-h4 { font-size: 13px; font-weight: 700; margin-bottom: 14px; color: var(--ink); }
        .cv-footer-links { display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--muted); }
        .cv-footer-links a:hover { color: var(--teal); }
        .cv-newsletter-row { display: flex; gap: 8px; margin-top: 4px; }
        .cv-newsletter-row input {
          flex: 1; min-width: 0; font-size: 13px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line);
          background: var(--panel); color: var(--ink);
        }
        .cv-newsletter-row input::placeholder { color: var(--muted); }
        .cv-newsletter-row button {
          width: 40px; height: 40px; border-radius: 8px; border: none; background: var(--teal); color: #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .cv-footer-bottom {
          display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid var(--line);
          font-size: 12.5px; color: var(--muted);
        }
        @media (min-width: 760px) { .cv-footer-bottom { flex-direction: row; justify-content: space-between; } }
      `}</style>

    {/* Hero */}
<div className="cv-hero">
  <img
    className="cv-hero-bg"
    src={HERO_BG_IMG}
    alt=""
    aria-hidden="true"
  />

  <div className="cv-hero-top">
    <div className="cv-animate">
      <div className="cv-badge">Choose Your Path</div>

      <h1 className="cv-h1">
        Every Journey Needs the <em>Right</em> Direction
      </h1>

      <p className="cv-hero-sub">
        One platform, two powerful experiences. Choose the path that’s right
        for you and take the next step toward your future.
      </p>
    </div>
  </div>

  <div
    className="cv-path-wrap cv-animate"
    style={{ animationDelay: "0.15s" }}
  >
    <div className="cv-path-grid">

      {/* Career */}
      <div
        className={`cv-path-card career ${
          hovered === "career" ? "is-hover" : ""
        }`}
        onMouseEnter={() => setHovered("career")}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="cv-path-content">
          <div className="cv-path-kicker">For Professionals</div>

          <h2 className="cv-path-title">Career</h2>

          <p className="cv-path-desc">
            Find the right opportunities, connect with top employers, and take
            the next step in your career.
          </p>

          <ul className="cv-path-list">
            <li>
              <span className="cv-path-list-icon">
                <Briefcase size={13} />
              </span>
              Latest Job Openings
            </li>

            <li>
              <span className="cv-path-list-icon">
                <Sparkles size={13} />
              </span>
              AI Job Recommendations
            </li>

            <li>
              <span className="cv-path-list-icon">
                <GraduationCap size={13} />
              </span>
              AI Course Suggestions
            </li>

            <li>
              <span className="cv-path-list-icon">
                <FileText size={13} />
              </span>
              AI Resume Analysis
            </li>

            <li>
              <span className="cv-path-list-icon">
                <ShieldCheck size={13} />
              </span>
              Placement Assistance
            </li>
          </ul>

          <button
            className="cv-path-cta"
            onClick={() => (window.location.href = CAREER_URL)}
          >
            Go to Career <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Logo */}
      <div className="cv-path-or">
        <div className="cv-path-or-inner">
          <img src={LOGO_SRC} alt="CareerVidya Logo" />
        </div>
      </div>

      {/* Vidya */}
      <div
        className={`cv-path-card vidya ${
          hovered === "vidya" ? "is-hover" : ""
        }`}
        onMouseEnter={() => setHovered("vidya")}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="cv-path-content">
          <div className="cv-path-kicker">For Students</div>

          <h2 className="cv-path-title">Vidya</h2>

          <p className="cv-path-desc">
            Explore courses, compare universities, get expert guidance, and
            build your dream career.
          </p>

          <ul className="cv-path-list">
            <li>
              <span className="cv-path-list-icon">
                <Compass size={13} />
              </span>
              Free Career Counselling
            </li>

            <li>
              <span className="cv-path-list-icon">
                <BookOpen size={13} />
              </span>
              24×7 LMS Access
            </li>

            <li>
              <span className="cv-path-list-icon">
                <Award size={13} />
              </span>
              Free Certificate
            </li>

            <li>
              <span className="cv-path-list-icon">
                <Wallet size={13} />
              </span>
              No-Cost EMI Available
            </li>

            <li>
              <span className="cv-path-list-icon">
                <BriefcaseBusiness size={13} />
              </span>
              100% Job Assistance
            </li>
          </ul>

          <button
            className="cv-path-cta"
            onClick={() => (window.location.href = VIDYA_URL)}
          >
            Enter Vidya <ArrowRight size={15} />
          </button>
        </div>
      </div>

    </div>
  </div>
</div>
      <div className="cv-container cv-trending">
  <div className="cv-trending-grid">
    {/* JOBS COLUMN */}
    <div className="cv-trending-col jobs">
      <div className="cv-trending-headrow">
        <div className="cv-trending-headrow-icon"><Briefcase size={17} /></div>
        <div className="cv-trending-headtext">
          <div className="cv-trending-title-lg">
            Explore Top <span className="accent-gold">Job Opportunities</span>
          </div>
          <div className="cv-trending-caption">Find the perfect job that matches your skills and build your dream career.</div>
        </div>
        <a href={`${CAREER_URL}/jobs`} className="cv-trending-viewall">View all jobs <ArrowUpRight size={12} /></a>
      </div>

      <div className="cv-trending-firelabel">🔥 Trending Jobs</div>

      <div className="cv-trending-stack">
        {TRENDING_JOBS?.map((j) => (
          <div className="cv-trending-card" key={j.title}>
            <div className="cv-trending-logo" style={{ background: `${j.mono}1a`, color: j.mono }}>
              {j.logo ? <img src={j.logo} alt={j.company} /> : j.short}
            </div>
            <div className="cv-trending-info">
              <div className="cv-trending-title-row">
                <span className="cv-trending-title">{j.title}</span>
                {j.isNew && <span className="cv-new-badge">New</span>}
              </div>
              <div className="cv-trending-org">{j.company}</div>
              <div className="cv-trending-sub">
                <span><MapPin size={11} style={{ verticalAlign: "-2px" }} /> {j.location}</span>
                <span className="dot"></span>
                <span>{j.workMode}</span>
                <span className="dot"></span>
                <span><Clock size={11} style={{ verticalAlign: "-2px" }} /> {j.exp}</span>
              </div>
            </div>
            <div className="cv-trending-right">
              <span className="cv-trending-price">{j.salary}</span>
              <button className="cv-trending-cta" onClick={() => (window.location.href = CAREER_URL)}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="cv-trending-more" onClick={() => (window.location.href = `${CAREER_URL}/`)}>
        View all jobs <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
      </button>
    </div>

    {/* COURSES COLUMN */}
    <div className="cv-trending-col courses">
      <div className="cv-trending-headrow">
        <div className="cv-trending-headrow-icon"><GraduationCap size={17} /></div>
        <div className="cv-trending-headtext">
          <div className="cv-trending-title-lg">
            Explore Top <span className="accent-teal">Courses &amp; Universities</span>
          </div>
          <div className="cv-trending-caption">Discover the best courses and top universities to shape your future.</div>
        </div>
        <a href="/explore" className="cv-trending-viewall">View all courses <ArrowUpRight size={12} /></a>
      </div>

      <div className="cv-trending-firelabel">🔥 Trending Courses</div>

      <div className="cv-trending-stack">
        {TRENDING_COURSES_HOME?.map((c) => (
          <div className="cv-trending-card" key={c.title}>
            <div className="cv-trending-logo" style={{ background: `${c.mono}1a`, color: c.mono }}>{c.short}</div>
            <div className="cv-trending-info">
              <div className="cv-trending-title-row">
                <span className="cv-trending-title">{c.title}</span>
              </div>
              <div className="cv-trending-org">{c.sub}</div>
              <div className="cv-trending-sub">
                <span>{c.university}</span>
                <span className="dot"></span>
                <span><Clock size={11} style={{ verticalAlign: "-2px" }} /> {c.duration}</span>
              </div>
            </div>
            <div className="cv-trending-right">
              <span className="cv-trending-price">{c.fee}</span>
              <button className="cv-trending-cta" onClick={() => (window.location.href = c.href)}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="cv-trending-more" onClick={() => (window.location.href = "/courses")}>
        View all courses <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
      </button>
    </div>
  </div>
</div>

      <Quickaction />
      <Quickaction1 />
     <div className="cv-partners-marquee">
  <div className="cv-partners-track">
    {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
      <div
        className="cv-partner-logo flex items-center justify-center"
        key={`${p.name}-${i}`}
      >
        <img
          src={p.image}
          alt={`${p.name} logo`}
          className="w-[152px] h-[152px] object-contain"
        />
      </div>
    ))}
  </div>
</div>
 <FAQ />
      <Footer />
    </div>
  );
}