"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Define consistent horizontal padding for the content area
  const contentPadding = "px-4 sm:px-6 lg:px-8";

  return (
    // FIX: Removed 'sticky top-0 z-50' to allow the header to scroll with the page.
    <header className="w-full shadow-sm bg-white">
      
      {/* Main Content Wrapper - Uses the defined padding */}
      <div className={`max-w-7xl mx-auto flex items-center justify-between py-3 ${contentPadding}`}>

        {/* LEFT SIDE - Logo */}
        <div className="flex items-center">
          <Image
            src="/images/LogoUpdated1.png" // <-- Replace with your logo
            alt="Logo"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <Link href="#about" className="hover:text-blue-600 duration-200">
            About Course
          </Link>
          <Link href="#university" className="hover:text-blue-600 duration-200">
            University
          </Link>
          <Link href="#highlights" className="hover:text-blue-600 duration-200">
            Highlights
          </Link>
          <Link href="#enquire" className="hover:text-blue-600 duration-200">
            Enquire Now
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={`md:hidden bg-white shadow-md py-3 space-y-3 text-gray-700 ${contentPadding}`}>
          {/* Note: Added menu text for the first link */}
          <Link href="#about" className="block">About Course</Link> 
          <Link href="#university" className="block">Top Universities</Link>
          <Link href="#highlights" className="block">Highlights</Link>
          <Link href="#enquire" className="block">Enquire Now</Link>
        </div>
      )}
    </header>
  );
}