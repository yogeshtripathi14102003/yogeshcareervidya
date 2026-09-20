"use client";

import { useState } from "react";
import Image from "next/image";
import Signup from "@/app/signup/page.jsx";

/* ================= LOGIN CHECK ================= */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

// Partner logos - EMI/Loan partners
const partners = [
  { name: "LIQUILOANS", src: "/logos/liquiloans.png", alt: "LiquiLoans" },
  { name: "EarlySalary", src: "/logos/earlysalary.png", alt: "EarlySalary" },
  { name: "eduvanz", src: "/logos/eduvanz.png", alt: "Eduvanz" },
  { name: "FinancePeer", src: "/logos/financepeer.png", alt: "FinancePeer" },
  { name: "PropelId", src: "/logos/propelid.png", alt: "PropelId" },
  { name: "Credenc", src: "/logos/credenc.png", alt: "Credenc" },
  { name: "Jodo", src: "/logos/jodo.png", alt: "Jodo" },
];

export default function Careervidyabenifit({
  courseBenifit = [],
  courseTitle,
}) {
  const [showSignup, setShowSignup] = useState(false);

  if (!courseBenifit || courseBenifit.length === 0) return null;

  /* ================= HANDLE BUTTON CLICK ================= */
  const handleActionClick = (action) => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }

    // Logged in → scroll to apply section (or perform action)
    const target =
      document.getElementById("apply") ||
      document.getElementById("signup");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.hash = "#apply";
    }
  };

  return (
    <>
      <section className="bg-blue-900 text-white py-10 sm:py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug px-2">
            Career Vidya Benefits for {courseTitle}
          </h2>

          {/* Benefit List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 text-left">
            {courseBenifit.map((item, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-colors"
              >
                {typeof item === "string" ? (
                  <p className="text-sm sm:text-base font-medium leading-relaxed break-words">
                    {item}
                  </p>
                ) : (
                  <>
                    {item.title && (
                      <h3 className="text-base sm:text-lg font-bold mb-2 break-words">
                        {item.title}
                      </h3>
                    )}
                    <div
                      className="text-sm sm:text-base font-medium leading-relaxed text-white/90 prose prose-sm prose-invert max-w-none break-words"
                      dangerouslySetInnerHTML={{
                        __html: item.description || "",
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
            <button
              type="button"
              onClick={() => handleActionClick("no-cost-emi")}
              className="w-full sm:w-auto bg-[#c15304] hover:bg-[#a34403] transition text-white font-semibold py-3 px-6 rounded-lg text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Apply For No Cost EMI →
            </button>

            <button
              type="button"
              onClick={() => handleActionClick("compare-emi")}
              className="w-full sm:w-auto bg-[#c15304] hover:bg-[#a34403] transition text-white font-semibold py-3 px-6 rounded-lg text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Compare EMI Partners →
            </button>
          </div>

          {/* Partner Logos */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mt-6 sm:mt-8 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="bg-white p-2 sm:p-3 rounded-md flex items-center justify-center w-full h-12 sm:h-14 md:h-16"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={100}
                  height={40}
                  className="object-contain w-full h-full max-w-[80px] sm:max-w-[100px]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNUP MODAL */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={courseTitle}
        />
      )}
    </>
  );
}