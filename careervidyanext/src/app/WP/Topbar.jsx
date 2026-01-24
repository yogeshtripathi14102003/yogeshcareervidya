"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Applynow from "@/app/WP/Applynow.jsx"; // Your popup

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);

  const contentPadding = "px-4 sm:px-6 lg:px-8";

  return (
    <header className="w-full shadow-sm bg-white">
      <div className={`max-w-7xl mx-auto flex items-center justify-between py-1 ${contentPadding}`}>
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/WP.webp"
            alt="Logo"
            width={140}
            height={30}
            className="object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <Link href="#about" className="hover:text-blue-600 duration-200">About Course</Link>
          <Link href="#university" className="hover:text-blue-600 duration-200">University</Link>
          <Link href="#highlights" className="hover:text-blue-600 duration-200">Highlights</Link>
          <button
            onClick={() => setEnquireOpen(true)}
            className="hover:text-blue-600 duration-200 font-medium cursor-pointer "
          >
            Enquire Now
          </button>
        </nav>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`md:hidden bg-white shadow-md py-3 space-y-3 text-gray-700 ${contentPadding}`}>
          <Link href="#about" className="block">About Course</Link>
          <Link href="#university" className="block">Top Universities</Link>
          <Link href="#highlights" className="block">Highlights</Link>
          <button
            onClick={() => {
              setEnquireOpen(true);
              setMenuOpen(false); // close mobile menu when popup opens
            }}
            className="block text-left w-full cursor-pointer "
          >
            Enquire Now
          </button>
        </div>
      )}

      {/* Enquire Now Popup */}
      {enquireOpen && (
        <Applynow
          isOpen={enquireOpen}
          onClose={() => setEnquireOpen(false)}
        />
      )}
    </header>
  );
}
