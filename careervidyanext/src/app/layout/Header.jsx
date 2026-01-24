"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import Signup from "../signup/page.jsx";
import Subheader from "@/app/components/Subheader.jsx";
import "./headr.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Get user dynamically from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <Subheader />

      <header className="header-container">
        <div className="header-inner">

          {/* ================= LOGO ================= */}
          <Link href="/" className="logo-wrapper">
            <div className="logo-box">
              <Image
                src="/images/n12.png"
                alt="Logo"
                width={110}
                height={40}
                className="logo-img"
                priority
              />
              <Image
                src="/images/Lak.png"
                alt="Free Counselling Done"
                width={80}
                height={45}
                className="counselling-badge"
                priority
              />
            </div>
          </Link>

          {/* ================= DESKTOP SEARCH ================= */}
          <Link href="/serarch" className="header-search-container desktop-only">
            <div className="main-search-bar">
              <input
                type="text"
                placeholder="Explore Courses"
                className="main-search-input"
                readOnly
              />
              <div className="search-icon-btn">
                <Search size={22} color="white" />
              </div>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="nav-right desktop-only">
            <Link href="/explore">Explore Programs</Link>
            <Link href="/teamexpand">Free Counselling</Link>
            <Link href="/coming-soon">Top University</Link>
            

            {/* ===== USER / SIGNUP ===== */}
            {user ? (
              <div className="user-dropdown">
                <User size={18} />
                <span className="username-text">
                  Hi, {user.name}
                </span>

                <div className="user-dropdown-menu">
                  <Link href="/profile">My Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSignup(true)}
                className="btn1-primary"
              >
                Signup
              </button>
            )}
          </nav>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="mobile-actions mobile-only">
            {user ? (
              <span className="mobile-user-name">
                Hi, {user.name}
              </span>
            ) : (
              <button
                onClick={() => setShowSignup(true)}
                className="mobile-signup-btn"
              >
                Signup
              </button>
            )}

            <button
              className="menu-toggle-btn"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
        <div
          className={`mobile-sidebar-overlay ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className={`mobile-sidebar ${menuOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-header">
              <span className="sidebar-title">Menu</span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={30} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>
                Explore Programs
              </Link>
              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>
                Free Counselling
              </Link>
              <Link href="/coming-soon" onClick={() => setMenuOpen(false)}>
                Top University
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSignup(true);
                    setMenuOpen(false);
                  }}
                  className="mobile-sidebar-signup"
                >
                  Signup
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ================= SIGNUP MODAL ================= */}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}
