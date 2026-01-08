


"use client";

import { useState, useEffect } from "react";
import { Phone, X } from "lucide-react";
import Login from "@/app/components/LoginModal.jsx";

export default function BottomOfferBanner() {
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ESC key close */
  useEffect(() => {
    if (!showLogin) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowLogin(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showLogin]);

  if (!show) return null;

  return (
    <>
      {/* ================= BOTTOM BANNER ================= */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-gradient-to-r from-[#001a4d] to-[#002b80] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Text */}
          <div className="flex items-center gap-2 text-sm md:text-base">
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
              href="tel:+9289712364"
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-sm"
            >
              <Phone size={16} />
              Call Now
            </a>

            <button
              onClick={() => setShowLogin(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1.5 rounded-md text-sm"
            >
              Enroll Now
            </button>

            <button onClick={() => setShow(false)} className="ml-1 hover:text-red-400">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowLogin(false)} // ✅ outside click
        >
          <div
            className="bg-white w-[95%] max-w-xl rounded-xl relative"
            onClick={(e) => e.stopPropagation()} // ❌ prevent inner click close
          >
            {/* ❌ Close */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 z-10 text-gray-500 hover:text-red-500"
            >
              <X size={22} />
            </button>

            {/* 🔥 Login Component */}
            <Login onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}
