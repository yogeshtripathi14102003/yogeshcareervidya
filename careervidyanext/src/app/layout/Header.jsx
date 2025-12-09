"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Bell, Mail, User, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import Signup from "../signup/page.jsx";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [topHeaderVisible, setTopHeaderVisible] = useState(true);
  const router = useRouter();

  const primaryBtn =
    "hover-btn bg-white text-gray-600 px-4 py-2 rounded-md transition text-sm font-semibold cursor-pointer";

  const outlineBtn =
    "hover-btn bg-white text-gray-600 px-4 py-2 rounded-md transition text-sm font-semibold cursor-pointer border border-gray-300";

  const iconBtn = "icon-btn p-1.5 rounded-md text-gray-600 transition";

  return (
    <>
      {/* TOP DESKTOP HEADER */}
      {topHeaderVisible && (
        <div className="hidden md:flex bg-white text-gray-700 text-sm border-b border-gray-200 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1 w-full">
            {/* Contact Info */}
            <div className="flex items-center gap-4">
              {/* <span>📞   +91 9289712364</span>
              <span>✉️  Info@careervidya.in</span> */}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <Link href="https://x.com/CareerVidya" target="_blank" rel="noopener noreferrer">
                <Twitter size={24} className={iconBtn} />
              </Link>
              <Link href="https://www.instagram.com/career_vidya" target="_blank" rel="noopener noreferrer">
                <Instagram size={24} className={iconBtn} />
              </Link>
              <Link href="https://www.facebook.com/careervidya" target="_blank" rel="noopener noreferrer">
                <Facebook size={24} className={iconBtn} />
              </Link>
              <Link href="https://www.linkedin.com/company/careervidya" target="_blank" rel="noopener noreferrer">
                <Linkedin size={24} className={iconBtn} />
              </Link>
              {/* <Link href="/profile">
                <User size={24} className={iconBtn} />
              </Link> */}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setTopHeaderVisible(false)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* MAIN HEADER */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm text-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-2">

          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between w-full md:hidden">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/LogoUpdated1.png"
                alt="Career Vidya Logo"
                width={130}
                height={60}
                className="object-contain transition-all duration-300"
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSignup(true)}
                className="bg-gray-400 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition text-sm font-semibold"
              >
                Signup
              </button>

              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* DESKTOP LOGO */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/LogoUpdated1.png"
                alt="Career Vidya Logo"
                width={130}
                height={60}
                className="object-contain transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div
              onClick={() => router.push("/explore")}
              className="relative w-full max-w-xl cursor-pointer"
            >
              <input
                type="text"
                placeholder="Search universities, courses & more..."
                readOnly
                className="w-full border border-gray-300 rounded-full py-2.5 pl-10 pr-3 text-gray-700 text-sm focus:outline-blue-500 hover:shadow-md transition bg-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* DESKTOP BUTTONS */}
          <nav className="hidden md:flex items-center gap-3 header-desktop">
            <Link href="/explore">
              <button className={primaryBtn}>Explore Programs</button>
            </Link>

            <Link href="/counselling">
              <button className={outlineBtn}>Free Counselling</button>
            </Link>

            <Link href="/counselling">
              <button className={outlineBtn}>Top University</button>
            </Link>

            <button onClick={() => setShowSignup(true)} className={primaryBtn}>
              Signup
            </button>
          </nav>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 shadow animate-slideDown text-gray-700">
            <div className="flex flex-col gap-3">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>
                <button className="w-full py-2.5 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition shadow-md">
                  Explore Programs
                </button>
              </Link>

              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                <button className="w-full py-2.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                  Free Counselling
                </button>
              </Link>

              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                <button className="w-full py-2.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                  Top University
                </button>
              </Link>

              <button
                onClick={() => {
                  setShowSignup(true);
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full text-white bg-blue-700 hover:bg-blue-800 transition shadow-md"
              >
                Signup
              </button>
            </div>
          </div>
        )}
      </header>

      {showSignup && <Signup onClose={() => setShowSignup(false)} />}

      <style jsx global>{`
        .header-desktop .hover-btn {
          background-color: white;
          color: #4b5563;
        }
        .header-desktop .hover-btn:hover,
        .header-desktop .hover-btn:focus {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        .header-desktop .icon-btn {
          color: #4b5563;
        }
        .header-desktop .icon-btn:hover,
        .header-desktop .icon-btn:focus {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
        .header-desktop .icon-btn:hover {
          padding: 0.35rem !important;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
