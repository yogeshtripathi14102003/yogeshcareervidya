import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Title from "./Title.jsx";

// --- Hero Section ---
const HeroSection = ({ onApplyClick }) => {
  return (
    <div className="bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#F97316] text-white py-24 text-center relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          Online MBA – Chandigarh University
        </h1>

        <p className="text-lg text-gray-100 mb-10 leading-relaxed max-w-3xl mx-auto">
          Reshape your career trajectory with an internationally recognized
          Online MBA Degree, providing in-depth management education and
          leadership skills to transform learners into dynamic leaders of
          tomorrow.
        </p>

        <button
          onClick={onApplyClick}
          className="bg-gradient-to-r from-[#FFA500] to-[#1E90FF] text-white text-xl font-semibold py-3 px-8 rounded-lg shadow-2xl transition duration-300 transform hover:scale-105"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

// --- Top Bar ---
const ApplyTopBar = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1E90FF] to-[#FFA500] text-white py-4 shadow-lg animate-slideDown">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <p className="text-lg font-semibold">
          🎓 Start your MBA journey with Chandigarh University – Apply Now!
        </p>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#1E90FF] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Apply Now
          </a>

          <button
            onClick={onClose}
            className="bg-white/20 border border-white/40 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/30 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Footer (White Background) ---
const KeywordFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 bg-white text-center border-t border-gray-200">
      {/* Two Logos */}
      <div className="flex justify-center items-center gap-8 mb-6">
        <Image
          src="/images/logoUpdated.png" // your logo
          alt="Chandigarh University"
          width={120}
          height={60}
          className="object-contain hover:scale-105 transition-transform duration-300"
        />
        <Image
          src="/images/upgrade.png" // your second logo
          alt="UGC Approved"
          width={120}
          height={60}
          className="object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Text */}
      <p className="text-sm text-gray-800 font-medium">
        © {year} All Rights Reserved | Online MBA Portal
      </p>
    </footer>
  );
};

// --- Main Page ---
const CombinedPage = () => {
  const [showTopBar, setShowTopBar] = useState(false);

  const handleApplyClick = () => setShowTopBar(true);
  const handleCloseBar = () => setShowTopBar(false);

  return (
    <>
      <Head>
        <title>Online MBA - Chandigarh University</title>
      </Head>

      {showTopBar && <ApplyTopBar onClose={handleCloseBar} />}

      <div className="min-h-screen bg-gray-50">
        <HeroSection onApplyClick={handleApplyClick} />
        <KeywordFooter />
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease forwards;
        }
      `}</style>
    </>
  );
};

export default CombinedPage;
