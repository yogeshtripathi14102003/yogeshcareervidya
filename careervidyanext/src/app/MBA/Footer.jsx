import React, { useState } from 'react';
import Head from 'next/head';
import Title from './Title.jsx';

// --- Hero Section ---
const HeroSection = ({ onApplyClick }) => {
  return (
    <div className="bg-gray-900 text-white py-24 text-center relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Online MBA – Chandigarh University
        </h1>

        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
          Reshape your career trajectory with an internationally recognized Online MBA Degree, 
          providing in-depth management education and leadership skills to transform learners into 
          dynamic leaders of tomorrow.
        </p>

        <button
          onClick={onApplyClick}
          className="bg-gradient-to-r from-[#FFA500] to-[#1E90FF] text-white text-xl font-semibold py-3 px-8 rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

// --- Top Bar with Close + Apply Now Link ---
const ApplyTopBar = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1E90FF] to-[#FFA500] text-white py-4 shadow-lg animate-slideDown">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <p className="text-lg font-semibold">
          🎓 Start your MBA journey with Chandigarh University – Apply Now!
        </p>

        <div className="flex items-center gap-3">
          {/* Apply Now Link */}
          <a
            href="/" // <-- Change this to your real application page URL
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#1E90FF] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Apply Now
          </a>

          {/* Close Button */}
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

// --- Footer Section ---
const KeywordFooter = () => {
  const keywords = `
    Chandigarh University Online MBA Fees Structure || Chandigarh University MBA Online Fees ||
    CU Online MBA Fees || Online CU || Chandigarh University Online || CU Online MBA Degree ||
    Chandigarh Online University || Chandigarh University Online MBA Fees || CU Online Courses ||
    Chandigarh University MBA || Best MBA Specialization || Most Affordable Online MBA || 
    MBA in Marketing || MBA in Finance || MBA in HR Management || MBA in Information Technology ||
    MBA in Digital Marketing || MBA in Banking & Finance || MBA in Business Analytics ||
    MBA in Data Science || MBA in Operation Management || Chandigarh University MBA Fees ||
    Chandigarh University Online MBA || Chandigarh University Online Courses || Online MBA From 
    Chandigarh University || Online MBA Chandigarh University || CU Online || Chandigarh University 
    Apply Online || Chandigarh University Admission || MBA in Chandigarh University || 
    CU Distance MBA Fees || CU Online MBA || Chandigarh Online MBA || Chandigarh University Programs ||
    Chandigarh University Courses And Fees || Chandigarh University Online Degree || 
    Chandigarh University MBA Course Fee || Chandigarh University For MBA Fees || Chandigarh MBA University ||
    Chandigarh University MBA Eligibility || Chandigarh University MBA Online || Online MBA In Chandigarh University ||
    Chandigarh University MBA Program || Chandigarh Distance Learning || Chandigarh University Online MBA Specialization ||
    CU MBA Fee || MBA Chandigarh University Fees
  `;

  return (
    <footer className="py-12 bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600 leading-relaxed text-justify">
          {keywords.trim().replace(/\s*\|\|\s*/g, ' || ')}
        </p>
      </div>
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

      {/* Animation */}
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
