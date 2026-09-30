"use client";

import { useState } from "react";
import Image from "next/image";
import Signup from "@/app/signup/page.jsx";

/* ═══════════════════════════════════════════════
   LOGIN CHECK
═══════════════════════════════════════════════ */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

/* Partner logos - EMI/Loan partners */
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

  /* ═══════════════════════════════════════════════
     HANDLE BUTTON CLICK
  ═══════════════════════════════════════════════ */
  const handleActionClick = (action) => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }

    const target =
      document.getElementById("apply") || document.getElementById("signup");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.hash = "#apply";
    }
  };

  return (
    <>
      <section
        className="py-10 sm:py-14 md:py-16 px-4 sm:px-6"
        style={{ background: "var(--cv-primary)", color: "#fff" }}
      >
        <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* ═══════════════════════════════════════════
              TITLE — White
          ═══════════════════════════════════════════ */}
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug px-2"
            style={{ color: "#fff" }}
          >
            Career Vidya Benefits for {courseTitle}
          </h2>

          {/* ═══════════════════════════════════════════
              BENEFIT LIST
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 text-left">
            {courseBenifit.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4 sm:p-6 transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.1)";
                }}
              >
                {typeof item === "string" ? (
                  <p
                    className="text-sm sm:text-base font-medium leading-relaxed break-words"
                    style={{ color: "#fff" }}
                  >
                    {item}
                  </p>
                ) : (
                  <>
                    {item.title && (
                      <h3
                        className="text-base sm:text-lg font-bold mb-2 break-words"
                        style={{ color: "#fff" }}
                      >
                        {item.title}
                      </h3>
                    )}
                    <div
                      className="text-sm sm:text-base font-medium leading-relaxed prose prose-sm prose-invert max-w-none break-words"
                      style={{ color: "rgba(255, 255, 255, 0.9)" }}
                      dangerouslySetInnerHTML={{
                        __html: item.description || "",
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ═══════════════════════════════════════════
              ACTION BUTTONS — Navy outline style (on navy bg)
              Since background is navy, buttons should be WHITE or ORANGE
          ═══════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
            {/* Primary CTA — Orange gradient */}
            <button
              type="button"
              onClick={() => handleActionClick("no-cost-emi")}
              className="cv-btn-cta w-full sm:w-auto py-3 px-6 text-sm sm:text-base cursor-pointer"
            >
              Apply For No Cost EMI →
            </button>

            {/* Secondary CTA — White outline on navy */}
            <button
              type="button"
              onClick={() => handleActionClick("compare-emi")}
              className="w-full sm:w-auto py-3 px-6 rounded-lg font-semibold text-sm sm:text-base transition-colors cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid #fff",
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "var(--cv-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
            >
              Compare EMI Partners →
            </button>
          </div>

          {/* ═══════════════════════════════════════════
              PARTNER LOGOS
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mt-6 sm:mt-8 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="p-2 sm:p-3 rounded-md flex items-center justify-center w-full h-12 sm:h-14 md:h-16"
                style={{ background: "#fff" }}
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