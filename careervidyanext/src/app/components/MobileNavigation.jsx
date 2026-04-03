"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gift, LayoutGrid, User, MoreHorizontal } from "lucide-react";

export default function MobileNavigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll Tracking Logic (Hide on Scroll Down, Show on Scroll Up)
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Offers", href: "/", icon: Gift },
    { name: "Tools", href: "/signup", icon: LayoutGrid },
    { name: "Profile", href: "/login", icon: User },
    // 5th Item: More
    { name: "More", href: "#", icon: MoreHorizontal },
  ];

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-[999] transition-transform duration-300 ease-in-out
      ${isVisible ? "translate-y-0" : "translate-y-full"}`}
    >
      {/* --- Main Navigation Bar --- */}
      <div className="relative bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] min-h-[70px] flex items-center justify-between">
        
        {/* Nav Items Container */}
        <div className="flex justify-around w-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div className={`${isActive ? "bg-blue-50 p-1 rounded-lg" : ""}`}>
                   <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* GAP FIXER: Background color extension for safe areas */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white w-full"></div>
    </div>
  );
}