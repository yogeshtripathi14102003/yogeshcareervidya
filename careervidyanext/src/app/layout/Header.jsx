"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Signup from "../signup/page.jsx"; // ✅ import your popup

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSignup, setShowSignup] = useState(false); // ✅ popup visibility

  // ✅ Handle scroll visibility for mobile search bar
  useEffect(() => {
    const handleScroll = () => {
      if (!menuOpen) setShowSearch(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // ✅ Close both menu and search
  const handleClose = () => {
    setMenuOpen(false);
    setShowSearch(false);
  };

  // ✅ Close popup (used by Signup)
  const handleSignupClose = () => {
    setShowSignup(false);
  };

  // ✅ Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
        handleSignupClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="bg-white px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* ---------- Left Section: Logo + Tagline ---------- */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <Link href="/" onClick={handleClose} className="flex items-center">
              <Image
                src="/images/LogoUpdated1.png"
                alt="Career Vidya Logo"
                height={48}
                width={130}
                className="object-contain cursor-pointer"
                priority
              />
            </Link>
            <span className="text-sm sm:text-base font-medium text-gray-600 whitespace-nowrap cursor-default">
              #Vidya hai to Success hai
            </span>
          </div>

          {/* ---------- Mobile Menu Button ---------- */}
          <button
            className="md:hidden ml-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* ---------- Desktop Search Bar ---------- */}
        <div className="hidden md:flex items-center justify-center flex-1 px-2">
          <div className="relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]">
            <input
              type="text"
              placeholder="Search universities, courses & more..."
              className="border border-[#87CEEB] rounded-full py-2 pl-9 pr-3 w-full text-gray-700 text-sm focus:outline-none focus:border-[#0056B3] hover:shadow-md transition cursor-text"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer">
              🔍
            </span>
          </div>
        </div>

        {/* ---------- Navigation Buttons ---------- */}
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0 transition-all duration-300`}
        >
          <Link href="/explore1" onClick={handleClose}>
            <button className="bg-[#0056B3] hover:bg-[#0046a1] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition">
              Explore Programs
            </button>
          </Link>

          <Link href="/counselling" onClick={handleClose}>
            <button className="hover:bg-[#e65c00] text-black font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition">
              Free Counselling
            </button>
          </Link>

          {/* ---------- Signup Button triggers popup ---------- */}
          <button
            onClick={() => setShowSignup(true)}
            className="bg-gradient-to-r from-[#0056B3] to-[#FF6600] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Signup
          </button>
        </nav>

        {/* ---------- Mobile Search on Scroll ---------- */}
        {showSearch && (
          <div className="md:hidden w-full mt-3 px-2 animate-slideDown">
            <div className="flex items-center bg-white border border-[#87CEEB] rounded-full px-3 py-2 shadow-sm">
              <span className="text-gray-500 text-lg mr-2 cursor-pointer">🔍</span>
              <input
                type="text"
                placeholder="Search universities, courses & more..."
                className="flex-1 text-sm text-gray-700 focus:outline-none"
              />
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-700 ml-2 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ---------- Signup Popup ---------- */}
      {showSignup && <Signup onClose={handleSignupClose} />}

      {/* ---------- Animations ---------- */}
      <style jsx global>{`
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
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
