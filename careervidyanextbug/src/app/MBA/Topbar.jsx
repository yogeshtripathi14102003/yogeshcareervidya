


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <>
      <header className="bg-white px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* ---------- Left Section: Logos ---------- */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            {/* Logo 1 */}
            {/* <Link href="/" className="flex items-center">
              <Image
                src="/images/LogoUpdated1.png"
                alt="Career Vidya Logo"
                height={48}
                width={130}
                className="object-contain cursor-pointer"
                priority
              />
            </Link> */}

            {/* Logo 2 */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/cu.png"
                alt="Chandigarh University Logo"
                height={48}
                width={130}
                className="object-contain cursor-pointer"
                priority
              />
            </Link>
          </div>

          {/* ---------- Mobile Menu Button (Hidden since no menu) ---------- */}
          <button
            className="md:hidden ml-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* ---------- Animations (kept minimal) ---------- */}
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
