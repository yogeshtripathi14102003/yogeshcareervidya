"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import {
  GraduationCap, Handshake, IndianRupee, Users,
  Compass, Award, Briefcase, BookOpen, Phone, Mail, Clock,
  School, Landmark, Building2, Globe2, BadgeCheck, Library,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import Signup from "../signup/page.jsx";
import Subheader from "@/app/components/Subheader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import "./headr.css";

// ─── SHARED DATA ────────────────────────────────────────────────────────────
// Edit once → updates both desktop mega-menu and mobile sidebar automatically.

const POPULAR_COURSES = [
  { href: "/course/online-mba-1",                                 label: "Online MBA",          icon: GraduationCap, chip: "chip-blue"    },
    { href: "/course/1-year-online-mba",                          label: " One YearOnline MBA", icon: GraduationCap, chip: "chip-blue"    },

  { href: "/course/online-mca",                                   label: "Online MCA",          icon: BookOpen,      chip: "chip-emerald" },
  { href: "/course/bba-bachelor-of-business-administration",      label: "Online BBA",          icon: Briefcase,     chip: "chip-amber"   },
  { href: "/course/online-bca-bachelor-of-computer-applications", label: "Online BCA",          icon: BookOpen,      chip: "chip-indigo"  },
  { href: "/course/online-ba-bachelors-of-arts",                  label: "Online BA",           icon: GraduationCap, chip: "chip-rose"    },
  { href: "/course/online-ma-masters-of-arts",                    label: "Online MA",           icon: GraduationCap, chip: "chip-purple"  },
  { href: "/course/online-bcom-bachelors-of-commerce",            label: "Online B.Com",        icon: Briefcase,     chip: "chip-orange"  },
  { href: "/course/mcom-master-of-commerce",                      label: "M.Com",               icon: Briefcase,     chip: "chip-blue"    },
  { href: "/course/1-year-online-mba",                            label: "One Year Online MBA", icon: GraduationCap, chip: "chip-emerald" },
  { href: "/course/btech-bachelors-of-technology",                label: "B.Tech",              icon: BookOpen,      chip: "chip-amber"   },
];

const TOP_UNIVERSITIES = [
  { href: "/university/amity-university-online",           label: "Amity University",               icon: Landmark,   chip: "chip-blue"    },
  { href: "/university/lovely-professional-university",    label: "LPU Online",                     icon: Building2,  chip: "chip-emerald" },
  { href: "/university/manipal-university-jaipur",         label: "Manipal University",             icon: School,     chip: "chip-amber"   },
  { href: "/university/chandigarh-university-online",      label: "Chandigarh University",          icon: Landmark,   chip: "chip-indigo"  },
  { href: "/university/srm-university",                    label: "SRM University",                 icon: Building2,  chip: "chip-rose"    },
  { href: "/university/dy-patil-university-online-mumbai", label: "DY Patil University",            icon: School,     chip: "chip-purple"  },
  { href: "/university/chitkara-university",               label: "Chitkara University",            icon: Landmark,   chip: "chip-orange"  },
  { href: "/university/kurukshetra-university-online",     label: "Kurukshetra University",         icon: Building2,  chip: "chip-blue"    },
  { href: "/university/sharda-university",                 label: "Sharda University",              icon: School,     chip: "chip-emerald" },
  { href: "/university/noida-international-university",    label: "Noida International University", icon: Globe2,     chip: "chip-amber"   },
  { href: "/university/gla-online",                        label: "GLA University Online",          icon: Landmark,   chip: "chip-indigo"  },
  { href: "/university/dr-a-p-j-abdul-kalam-university",   label: "Dr. APJ Abdul Kalam University", icon: BadgeCheck, chip: "chip-rose"    },
  { href: "/university/sikkim-manipal-university",         label: "Sikkim Manipal (SMU)",           icon: School,     chip: "chip-purple"  },
  { href: "/university/jaipur-national-university",        label: "Jaipur National University",     icon: Landmark,   chip: "chip-orange"  },
  { href: "/university/jain-university",                   label: "Jain University",                icon: Building2,  chip: "chip-blue"    },
  { href: "/university/birla-institute-of-technology",     label: "Birla Institute of Technology",  icon: Library,    chip: "chip-emerald" },
  { href: "/university/aks-university",                    label: "AKS University",                 icon: School,     chip: "chip-amber"   },
  { href: "/university/era-university",                    label: "Era University",                 icon: Landmark,   chip: "chip-indigo"  },
  { href: "/university/sanskriti-university",              label: "Sanskriti University",           icon: Building2,  chip: "chip-rose"    },
];

const WHY_CAREERVIDYA = [
  { href: "/whycareervidya/careervidya-care",  label: "Continuous Career Guidance",  icon: Compass,   chip: "chip-blue"    },
  { href: "/whycareervidya/placement-support", label: "Expert Placement Cell",        icon: Award,     chip: "chip-emerald" },
  { href: "/WP/home",                          label: "Balance your job and learning", icon: Briefcase, chip: "chip-amber"   },
];

// ─── SMALL REUSABLE PIECES ──────────────────────────────────────────────────

/** Colored dash + heading title — matches screenshot exactly */
function ColHeading({ children, color = "#04458b" }) {
  return (
    <div className="mega-col-heading">
      <span className="mega-col-heading-dash" style={{ backgroundColor: color }} />
      <h4 style={{ color }}>{children}</h4>
    </div>
  );
}

/** Circular icon chip + label row */
function MItem({ href, label, icon: Icon, chip }) {
  return (
    <Link href={href} className="mega-menu-item">
      <span className={`mega-icon-chip ${chip}`}>
        <Icon size={15} strokeWidth={2} />
      </span>
      {label}
    </Link>
  );
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function Header() {
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [showSignup,       setShowSignup]       = useState(false);
  const [dropdownOpen,     setDropdownOpen]     = useState(false);
  const [coursesOpen,      setCoursesOpen]      = useState(false);
  const [universitiesOpen, setUniversitiesOpen] = useState(false);

  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    logout({ redirectTo: "/" });
  };

  return (
    <>
      {/*
        NOTE: H1 must live on each individual page (homepage, course pages, etc.),
        never inside a shared layout component like this Header.
      */}

      <Subheader />

      <header className="header-container">
        <div className="header-inner">

          {/* ── LOGO ── */}
          <Link href="/Home" className="logo-wrapper">
            <div className="logo-box">
              <Image src="/images/n12.png" alt="CareerVidya Logo"
                width={110} height={40} className="logo-img" priority />
              <Image src="/images/Lak.png" alt="Free Counselling"
                width={80} height={45} className="counselling-badge" priority />
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="nav-center desktop-only">

            {/* ══ EXPLORE PROGRAMS ══════════════════════════════════════════ */}
            <div className="mega-menu-wrap">
              <Link href="/explore" className="flex items-center gap-1">
                EXPLORE PROGRAMS <ChevronDown size={13} className="chevron-icon" />
              </Link>

              {/* Fixed full-width panel */}
              <div className="mega-panel">
                <div className="mega-panel-inner">

                  {/* Col 1 — Why Career Vidya */}
                  <div>
                    <ColHeading color="#04458b">Why Career Vidya?</ColHeading>
                    {WHY_CAREERVIDYA.map(item => <MItem key={item.href} {...item} />)}
                    <Link href="/whycareervidya/career-finder" className="mega-career-finder-btn">
                      Career Finder
                      <span className="mega-career-finder-badge">NEW</span>
                    </Link>
                  </div>

                  {/* Col 2 — Our Impact stats */}
                  <div>
                    <ColHeading color="#7e22ce">Our Impact</ColHeading>
                    <div className="mega-stats-grid">
                      {[
                        { Icon: GraduationCap, num: "15K+",   label: "Admissions",  bg: "linear-gradient(135deg,#3b82f6,#1d4ed8)",  cardBg: "#eff6ff", border: "#bfdbfe" },
                        { Icon: Handshake,     num: "150+",   label: "Partners",    bg: "linear-gradient(135deg,#10b981,#059669)",   cardBg: "#ecfdf5", border: "#a7f3d0" },
                        { Icon: IndianRupee,   num: "37 LPA+",label: "Highest Pkg", bg: "linear-gradient(135deg,#f59e0b,#ea580c)",   cardBg: "#fffbeb", border: "#fde68a" },
                        { Icon: Users,         num: "12K+",   label: "Alumni",      bg: "linear-gradient(135deg,#6366f1,#7c3aed)",   cardBg: "#eef2ff", border: "#c7d2fe" },
                      ].map(({ Icon, num, label, bg, cardBg, border }) => (
                        <div key={label} className="mega-stat-card"
                          style={{ backgroundColor: cardBg, borderColor: border }}>
                          <div className="mega-stat-icon" style={{ background: bg }}>
                            <Icon size={18} />
                          </div>
                          <p className="mega-stat-num">{num}</p>
                          <p className="mega-stat-label">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Col 3 — Recognition */}
                  <div>
                    <ColHeading color="#b45309">Recognition</ColHeading>
                    <div className="mega-award-card">
                      <div className="mega-award-badge">AWARD 2025</div>
                      <p className="mega-award-title">Winner: International Business Award 2025</p>
                      <p className="mega-award-sub">Empowering Careers Globally</p>
                    </div>
                    <div className="mega-live-pill">
                      <div className="mega-live-dot" />
                      <span className="mega-live-text">Trusted by 12,000+ alumni</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ══ FREE COUNSELLING ══════════════════════════════════════════ */}
            <div className="mega-menu-wrap">
              <Link href="/teamexpand" className="flex items-center gap-1">
                FREE COUNSELLING <ChevronDown size={13} className="chevron-icon" />
              </Link>

              <div className="mega-panel">
                <div className="mega-panel-inner">

                  {/* Col 1 — Quick Links */}
                  <div>
                    <ColHeading color="#04458b">Quick Links</ColHeading>
                    <MItem href="/career"    label="Career Guidance"   icon={Compass}   chip="chip-blue"    />
                    <MItem href="/blog"      label="Latest Blogs"      icon={BookOpen}  chip="chip-emerald" />
                    <MItem href="/contactus" label="Contact Us"        icon={Phone}     chip="chip-amber"   />
                    <MItem href="/Aboutus"   label="About Our Mission" icon={Award}     chip="chip-indigo"  />
                  </div>

                  {/* Col 2 — Popular Courses (SEO: real <Link> in DOM at all times) */}
                  <div>
                    <ColHeading color="#7e22ce">Popular Courses</ColHeading>
                    {POPULAR_COURSES.slice(0, 8).map(item => <MItem key={item.href} {...item} />)}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                      <Link href="/explore" style={{ fontSize: 13, fontWeight: 700, color: "#04458b", textDecoration: "none" }}>
                        View All Courses →
                      </Link>
                    </div>
                  </div>

                  {/* Col 3 — Get in Touch */}
                  <div>
                    <ColHeading color="#b45309">Get in Touch</ColHeading>
                    <div className="mega-contact-card">
                      <div className="mega-contact-row">
                        <span className="mega-icon-chip chip-emerald"><Phone size={15} /></span>
                        <div>
                          <p className="mega-contact-label">New Admissions</p>
                          <p className="mega-contact-value">+91 93199 98717</p>
                        </div>
                      </div>
                      <div className="mega-contact-divider" />
                      <div className="mega-contact-row">
                        <span className="mega-icon-chip chip-blue"><Mail size={15} /></span>
                        <div>
                          <p className="mega-contact-label">Student Support</p>
                          <p className="mega-contact-value">+91 9289716667</p>
                        </div>
                      </div>
                      <div className="mega-contact-divider" />
                      <div className="mega-contact-row">
                        <span className="mega-icon-chip chip-amber"><Clock size={15} /></span>
                        <p className="mega-contact-note">10 AM to 7 PM</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ══ TOP UNIVERSITIES ══════════════════════════════════════════ */}
            <div className="mega-menu-wrap">
              <Link href="/topunivers" className="flex items-center gap-1">
                TOP UNIVERSITIES <ChevronDown size={13} className="chevron-icon" />
              </Link>

              <div className="mega-panel">
                <div className="mega-panel-inner">

                  {/* Col 1 */}
                  <div>
                    <ColHeading color="#04458b">Top Ranked</ColHeading>
                    {TOP_UNIVERSITIES.slice(0, 7).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  {/* Col 2 */}
                  <div>
                    <ColHeading color="#7e22ce">Most Popular</ColHeading>
                    {TOP_UNIVERSITIES.slice(7, 14).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  {/* Col 3 */}
                  <div>
                    <ColHeading color="#b45309">More Universities</ColHeading>
                    {TOP_UNIVERSITIES.slice(14).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  {/* Footer row spanning all 3 cols */}
                  <div className="mega-panel-footer">
                    <Link href="/topunivers">View All Universities →</Link>
                  </div>

                </div>
              </div>
            </div>

            <Link href="/career">CAREER</Link>

          </nav>

          {/* ── DESKTOP RIGHT: SEARCH + SIGNUP / USER ── */}
          <div className="right-actions desktop-only">
            <Link href="/search" className="search-link">
              <div className="main-search-bar">
                <input type="text" placeholder="Explore Courses"
                  className="main-search-input" readOnly />
                <div className="search-icon-btn">
                  <Search size={16} color="white" />
                </div>
              </div>
            </Link>

            {user ? (
              <div className="user-dropdown-container">
                <button className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <User size={16} />
                  Hi, {user?.name || "User"}
                  <ChevronDown size={13}
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "0.3s" }} />
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    {user.role === "admin" ? (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link href="/user" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        My Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="logout-btn-dropdown">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowSignup(true)} className="btn1-primary">Signup</button>
            )}
          </div>

          {/* ── MOBILE ACTIONS ── */}
          <div className="mobile-actions mobile-only">
            {user ? (
              <Link href={user?.role === "admin" ? "/admin" : "/user"} className="mobile-user-name">
                Hi, {user?.name || "User"}
              </Link>
            ) : (
              <button onClick={() => setShowSignup(true)} className="mobile-signup-btn">Signup</button>
            )}
            <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)}>
              <Menu size={26} />
            </button>
          </div>

        </div>

        {/* ── MOBILE SIDEBAR ── */}
        <div className={`mobile-sidebar-overlay ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}>
          <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}
            onClick={e => e.stopPropagation()}>

            <div className="sidebar-header">
              <span className="sidebar-title">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="menu-toggle-btn">
                <X size={28} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>Explore Programs</Link>

              {/* Popular Courses — collapsible */}
              <button type="button" className="mobile-collapsible-trigger"
                onClick={() => setCoursesOpen(!coursesOpen)} aria-expanded={coursesOpen}>
                <span>Popular Courses</span>
                <ChevronDown size={16}
                  style={{ transform: coursesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {coursesOpen && (
                <div className="mobile-collapsible-panel">
                  <div className="mobile-collapsible-divider" />
                  {POPULAR_COURSES.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
                  ))}
                  <Link href="/explore" onClick={() => setMenuOpen(false)} className="mobile-view-all">
                    View All Courses →
                  </Link>
                </div>
              )}

              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>Free Counselling</Link>

              {/* Top Universities — collapsible */}
              <button type="button" className="mobile-collapsible-trigger"
                onClick={() => setUniversitiesOpen(!universitiesOpen)} aria-expanded={universitiesOpen}>
                <span>Top Universities</span>
                <ChevronDown size={16}
                  style={{ transform: universitiesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {universitiesOpen && (
                <div className="mobile-collapsible-panel">
                  <div className="mobile-collapsible-divider" />
                  {TOP_UNIVERSITIES.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
                  ))}
                  <Link href="/topunivers" onClick={() => setMenuOpen(false)} className="mobile-view-all">
                    View All Universities →
                  </Link>
                </div>
              )}

              <Link href="/search" onClick={() => setMenuOpen(false)}>Search Courses</Link>
              <Link href="/career" onClick={() => setMenuOpen(false)}>Career</Link>

              {user?.role === "admin" ? (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              ) : user ? (
                <Link href="/user" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
              ) : null}
            </nav>

            {user ? (
              <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
            ) : (
              <button onClick={() => { setShowSignup(true); setMenuOpen(false); }}
                className="mobile-sidebar-signup">
                Signup / Login
              </button>
            )}
          </div>
        </div>

      </header>

      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}