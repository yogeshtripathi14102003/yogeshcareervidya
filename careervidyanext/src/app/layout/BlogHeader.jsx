"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 relative">
      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/n12.png"
            alt="Logo"
            width={140}
            height={40}
            priority
            className="object-contain"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/services" className="hover:text-blue-600">Services</Link>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="bg-[#04458b] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE TOGGLE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-700 text-2xl focus:outline-none"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link href="/" onClick={() => setOpen(false)} className="block">
              Home
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block">
              About
            </Link>
            <Link href="/services" onClick={() => setOpen(false)} className="block">
              Services
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="block">
              Blog
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="block">
              Contact
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block text-center bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
