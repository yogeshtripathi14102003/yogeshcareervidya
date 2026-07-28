"use client";

import {
  Compass,
  Bot,
  Wallet,
  FileText,
  Users,
  Building2,
  Briefcase,
  BookOpen,
} from "lucide-react";

// ---- Quick action strip (Free Counselling / AI Career Test / Resume Builder / Need Help) ----
const QUICK_ACTIONS = [
  {
    icon: Compass,
    img: "/images/a1.png",
    title: "Free Career Counselling",
    titleAccent: "Free Career Counselling",
    desc: "Book a free 1:1 session",
    cta: "Book Now",
    color: "#0d9488",
    tint: "#e3f4f1",
    href: "/counselling",
  },
  {
    icon: Bot,
    img: "/images/a2.png",
    title: "AI Career Test",
    desc: "Discover the best career for you in 2 minutes",
    cta: "Start Test",
    color: "#2563eb",
    tint: "#e6eef6",
    href: "/career-test",
  },
  {
    icon: Wallet,
    img: "/images/a3.png",
    title: "Scholarship Checker",
    desc: "Check your eligibility and save on tuition",
    cta: "Check Now",
    color: "#c15304",
    tint: "#fef3e2",
    href: "/scholarships",
  },
  {
    icon: FileText,
    img: "/images/b9.jpg",
    title: "Resume Builder",
    desc: "Create a professional resume that gets you hired",
    cta: "Build Now",
    color: "#8b5cf6",
    tint: "#efe9fd",
    href: `${process.env.NEXT_PUBLIC_CAREER_URL || "http://localhost:3000"}/resume-builder`,
  },
];

// ---- Features strip ----
const FEATURES = [
  { icon: Compass, title: "Career assessment", desc: "Discover the right career for you.", color: "#0d9488", tint: "#e3f4f1" },
  { icon: Building2, title: "Top universities", desc: "Explore and compare top universities.", color: "#2f5c8a", tint: "#e6eef6" },
  { icon: BookOpen, title: "Popular courses", desc: "Find trending, future-ready courses.", color: "#2f5c8a", tint: "#e6eef6" },
  { icon: Wallet, title: "Scholarships", desc: "Apply for scholarships and save more.", color: "#f5a623", tint: "#fef3e2" },
  { icon: Users, title: "Expert counsellors", desc: "Connect with experienced career experts.", color: "#e8935a", tint: "#fbeadf" },
  { icon: BookOpen, title: "Resources", desc: "Guides, blogs and career tips.", color: "#8b5cf6", tint: "#efe9fd" },
];

export default function QuickActionsSection() {
  return (
    <>
      {/* quick action strip */}
      <div className="cv-quick-actions">
        <div className="cv-quickgrid">
          {QUICK_ACTIONS.filter((a) => a.title !== "Scholarship Checker").map((a) => (
            <div className="cv-quick-card" key={a.title}>
              <div className="cv-quick-card-copy">
                <div className="cv-quick-title">{a.title}</div>
                <p className="cv-quick-desc">{a.desc}</p>
              </div>
              <div className="cv-quick-image">
                <img src={a.img} alt={a.title} />
              </div>
              <button className="cv-quick-cta" style={{ background: a.color }} onClick={() => (window.location.href = a.href)}>
                {a.cta}
              </button>
            </div>
          ))}
          <div className="cv-quick-card help">
            <div>
              <div className="cv-quick-title">Need Help? Talk to an Expert</div>
              <div className="cv-quick-desc">Get instant guidance for your career</div>
            </div>
            <div className="cv-quick-help-row">
              <a className="cv-quick-help-link" href="tel:9289716667"><span>9289716667</span></a>
              <a className="cv-btn-whatsapp" href="https://wa.me/9289716667" target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>
            <div className="cv-quick-image">
              <img src="/images/a5.png" alt="Support agent" />
            </div>
          </div>
        </div>
      </div>

      {/* stats bar */}
      <div className="cv-container cv-stats-bar">
        <div className="cv-stats-box cv-animate" style={{ animationDelay: "0.25s" }}>
          <div className="cv-stat">
            <div className="cv-stat-icon"><Users size={18} /></div>
            <div>
              <div className="cv-stat-num">1,00000+</div>
              <div className="cv-stat-label">Students guided</div>
            </div>
          </div>
          <div className="cv-stat">
            <div className="cv-stat-icon"><Building2 size={18} /></div>
            <div>
              <div className="cv-stat-num">1,500+</div>
              <div className="cv-stat-label">Universities & colleges</div>
            </div>
          </div>
          <div className="cv-stat">
            <div className="cv-stat-icon"><Briefcase size={18} /></div>
            <div>
              <div className="cv-stat-num">10,000+</div>
              <div className="cv-stat-label">Job opportunities</div>
            </div>
          </div>
          <div className="cv-stat">
            <div className="cv-stat-icon"><Users size={18} /></div>
            <div>
              <div className="cv-stat-num">15000+</div>
              <div className="cv-stat-label">Happy professionals</div>
            </div>
          </div>
        </div>
      </div>

      {/* features strip */}
      <div className="cv-container cv-features">
        <div className="cv-features-box">
          <div className="cv-features-head">
            <div className="cv-features-kicker">Everything you need, all in one place</div>
          </div>
          <div className="cv-features-grid">
            {FEATURES.map((f) => (
              <div className="cv-feature" key={f.title}>
                <div className="cv-feature-icon" style={{ background: f.tint, color: f.color }}>
                  <f.icon size={18} />
                </div>
                <div className="cv-feature-title">{f.title}</div>
                <div className="cv-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}