"use client";

import { useState, useEffect } from "react";
import { Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= LOGIN CHECK ================= */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("usertoken"); 
  // agar cookies use karte ho to:
  // return !!Cookies.get("token");
};

export default function BottomOfferBanner() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  /* ================= SHOW / HIDE BANNER ================= */
  useEffect(() => {
    // ✅ agar user logged in hai → banner kabhi mat dikhao
    if (isLoggedIn()) {
      setShow(false);
      return;
    }

    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setShow(true); // mobile me always show (guest only)
      } else {
        setShow(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= SAFETY CHECK ================= */
  if (!show || isLoggedIn()) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#001a4d] to-[#002b80] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Text */}
        <div className="flex items-center gap-2 text-sm md:text-base text-center md:text-left">
          <span className="text-lg">🎁</span>
          <span>
            You are eligible for{" "}
            <strong className="text-yellow-300">
              Upto ₹2000 Career Vidya Subsidy* Cashback
            </strong>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <a
            href="https://wa.me/9289712364"
            target="_blank"
            className="bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md text-sm"
          >
            WhatsApp
          </a>

          <a
            href="tel:+919289712364"
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-sm"
          >
            <Phone size={16} />
            Call Now
          </a>

          {/* Signup */}
          <button
            onClick={() => router.push("/signup")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1.5 rounded-md text-sm"
          >
            Enroll Now
          </button>

          {/* Close */}
          <button
            onClick={() => setShow(false)}
            className="ml-1 hover:text-red-400"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
