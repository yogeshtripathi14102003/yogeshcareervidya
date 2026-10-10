"use client";

import { useEffect, useState } from "react";
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
  { name: "LIQUILOANS", src: "/images/benifit1.jpg", alt: "LiquiLoans" },
  { name: "EarlySalary", src: "/images/benifit2.jpg", alt: "EarlySalary" },
  { name: "eduvanz", src: "/images/benifit3.jpg", alt: "Eduvanz" },
  { name: "FinancePeer", src: "/images/benifit4.jpg", alt: "FinancePeer" },
  { name: "PropelId", src: "/images/benifit5.jpg", alt: "PropelId" },
  { name: "Credenc", src: "/images/benifit6.jpg", alt: "Credenc" },
];

export default function Careervidyabenifit({
  courseBenifit = [],
  courseTitle,
}) {
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  /* LOGIN STATE — Live update */
  useEffect(() => {
    const check = () => setLoggedIn(isLoggedIn());
    check();

    window.addEventListener("storage", check);
    window.addEventListener("focus", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
    };
  }, []);

  if (!courseBenifit || courseBenifit.length === 0) return null;

  /* HANDLE BUTTON CLICK */
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
      {/* ✅ Section — WHITE bg */}
      <section className="py-8 md:py-10 bg-white">
        {/* ✅ Container — NAVY bg + rounded */}
        <div
          className="max-w-[1800px] lg:w-[90%] mx-auto px-4 sm:px-6 py-8 md:py-10 rounded-xl text-center space-y-6 sm:space-y-8"
          style={{ background: "var(--cv-primary)", color: "#fff" }}
        >
          {/* TITLE */}
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug px-2"
            style={{ color: "#fff" }}
          >
            Career Vidya Benefits for {courseTitle}
          </h2>

          {/* BENEFIT LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5 sm:mt-6 text-left">
            {courseBenifit.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4 sm:p-5 transition-colors"
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

          {/* ACTION BUTTONS — sirf logged out */}
          {!loggedIn && (
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-5 sm:mt-6 w-full">
              <button
                type="button"
                onClick={() => handleActionClick("no-cost-emi")}
                className="cv-btn-cta w-full sm:w-auto py-3 px-6 text-sm sm:text-base cursor-pointer"
              >
                Apply For No Cost EMI →
              </button>

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
          )}

          {/* PARTNER LOGOS — image fits the box size */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-5 sm:mt-6 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="relative rounded-md overflow-hidden w-full h-16 sm:h-20 md:h-24"
                style={{ background: "#fff" }}
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                  className="object-contain p-1"
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