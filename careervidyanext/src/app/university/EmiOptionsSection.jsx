// "use client";

// import { useState } from "react";
// import {
//     CreditCard,
//     Clock,
//     Landmark,
//     BadgeCheck,
//     CheckCircle2,
//     IndianRupee,
//     Wallet,
//     ShieldCheck,
//     Percent,
//     Building2,
// } from "lucide-react";
// import { cleanHtml } from "@/utlis/cleanHtml.js";

// // Auth
// import { useAuth } from "@/context/AuthContext.jsx";


// // ✅ Popup
// import Applicationpopup from "@/app/university/Applictionpopup.jsx";

// export default function EmiOptions({ data }) {
//     const [hoveredIndex, setHoveredIndex] = useState(null);

//     // ✅ AUTH
//     const { isAuthenticated, isLoading: authLoading } = useAuth();
//     const [authOpen, setAuthOpen] = useState(false);
//     const [pendingAction, setPendingAction] = useState(null);

//     // ✅ POPUP STATE
//     const [openPopup, setOpenPopup] = useState(false);

//     const emi = data?.emiOptions || {};

//     const heading = emi.heading || "EMI & Education Loan Support";
//     const subHeading = emi.subHeading || "";
//     const description = emi.description || "";
//     const lendersCount = emi.lendersCount || "";
//     const approvalTime = emi.approvalTime || "";
//     const noBankVisit = emi.noBankVisit === true;
//     const emiStartingFrom = emi.emiStartingFrom || "";
//     const points = Array.isArray(emi.points) ? emi.points : [];
//     const partners = Array.isArray(emi.partners) ? emi.partners : [];

//     const hasContent =
//         heading ||
//         description ||
//         lendersCount ||
//         approvalTime ||
//         emiStartingFrom ||
//         points.length > 0 ||
//         partners.length > 0;

//     // =====================================================
//     // ✅ SMART POPUP OPENER (Auth-aware)
//     // =====================================================
//     const openActionPopup = (type) => {
//         if (authLoading) return;

//         if (isAuthenticated) {
//             setOpenPopup(true);
//         } else {
//             setPendingAction(type);
//             setAuthOpen(true);
//         }
//     };

//     const handleAuthSuccess = () => {
//         setAuthOpen(false);
//         if (pendingAction) {
//             setTimeout(() => {
//                 setOpenPopup(true);
//                 setPendingAction(null);
//             }, 250);
//         }
//     };

//     // ✅ Popup close handler
//     const closePopup = () => {
//         setOpenPopup(false);
//     };

//     if (!hasContent) return null;

//     // Highlight cards
//     const highlightCards = [
//         lendersCount && {
//             icon: Landmark,
//             label: "Lenders",
//             value: lendersCount,
//         },
//         approvalTime && {
//             icon: Clock,
//             label: "Approval Time",
//             value: approvalTime,
//         },
//         emiStartingFrom && {
//             icon: IndianRupee,
//             label: "EMI Starting From",
//             value: emiStartingFrom,
//         },
//         noBankVisit && {
//             icon: ShieldCheck,
//             label: "No Bank Visit",
//             value: "100% Online Process",
//         },
//     ].filter(Boolean);

//     return (
//         <>
//             <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//                 {/* ============ HEADER (Dark Blue) — Top button HATAYA ============ */}
//                 <div className="bg-[#0b3a6f] px-6 md:px-8 py-5">
//                     <div>
//                         <h2 className="text-xl md:text-2xl font-bold text-white">
//                             {heading}
//                         </h2>
//                         {subHeading && (
//                             <p className="text-blue-100 text-sm mt-1">
//                                 {subHeading}
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 {/* ============ BODY ============ */}
//                 <div className="p-6 md:p-8">
//                     {/* Description */}
//                     {description && (
//                         <div
//                             className="rich-content text-gray-700 text-sm leading-relaxed mb-6"
//                             dangerouslySetInnerHTML={{
//                                 __html: cleanHtml(description),
//                             }}
//                         />
//                     )}

//                     {/* Highlight Cards */}
//                     {highlightCards.length > 0 && (
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//                             {highlightCards.map((card, index) => {
//                                 const Icon = card.icon;
//                                 return (
//                                     <div
//                                         key={index}
//                                         className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#0056D2] transition-all"
//                                     >
//                                         <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center mb-2">
//                                             <Icon size={16} />
//                                         </div>
//                                         <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
//                                             {card.label}
//                                         </p>
//                                         <p className="text-sm font-bold text-gray-900 mt-0.5">
//                                             {card.value}
//                                         </p>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}

//                     {/* Partners */}
//                     {partners.length > 0 && (
//                         <div className="mb-6">
//                             <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
//                                 <Building2 size={16} />
//                                 Our Loan Partners
//                             </h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {partners.map((partner, index) => (
//                                     <span
//                                         key={index}
//                                         className="px-4 py-1.5 bg-blue-50 border border-blue-100 text-[#0056D2] text-xs font-semibold rounded-full hover:border-[#0056D2] transition"
//                                     >
//                                         {partner}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Points */}
//                     {points.length > 0 && (
//                         <div>
//                             <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
//                                 <BadgeCheck size={16} />
//                                 Key Benefits
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {points.map((point, index) => {
//                                     const isHovered = hoveredIndex === index;
//                                     return (
//                                         <div
//                                             key={index}
//                                             onMouseEnter={() => setHoveredIndex(index)}
//                                             onMouseLeave={() => setHoveredIndex(null)}
//                                             className={`flex items-start gap-3 p-4 rounded-xl bg-white border transition-all duration-200 ${
//                                                 isHovered
//                                                     ? "border-[#0056D2] shadow-md"
//                                                     : "border-gray-200"
//                                             }`}
//                                         >
//                                             <div className="shrink-0 w-7 h-7 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center">
//                                                 <CheckCircle2 size={14} />
//                                             </div>
//                                             <p className="text-sm leading-relaxed text-gray-700 flex-1">
//                                                 {point}
//                                             </p>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}

//                     {/* ✅ CTA Buttons — dono me Applictionpopup */}
//                     <div className="mt-6 flex flex-wrap gap-3">
//                         <button
//                             onClick={() => openActionPopup("apply")}
//                             disabled={authLoading}
//                             className="cursor-pointer flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             <CreditCard size={16} />
//                             Check EMI Options
//                         </button>
//                         <button
//                             onClick={() => openActionPopup("apply")}
//                             disabled={authLoading}
//                             className="cursor-pointer flex items-center gap-2 bg-white border border-[#0056D2] text-[#0056D2] hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             <Percent size={16} />
//                             Apply for Loan
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* =====================================================
//                 ✅ AUTH MODAL (if not logged in)
//             ===================================================== */}
         

//             {/* =====================================================
//                 ✅ APPLICATION POPUP (if logged in)
//             ===================================================== */}
//             {openPopup && (
//                 <Applicationpopup
//                     open={openPopup}
//                     setOpen={setOpenPopup}
//                     onClose={closePopup}
//                     universityName={data?.name || ""}
//                     course={{ name: "General Admission" }}
//                 />
//             )}
//         </>
//     );
// }



"use client";

import { useState } from "react";
import {
  CreditCard,
  Clock,
  Landmark,
  BadgeCheck,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Percent,
  Building2,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

import { useAuth } from "@/context/AuthContext.jsx";
import AuthModal from "@/app/university/AuthModal.jsx";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";

export default function EmiOptions({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const emi = data?.emiOptions || {};

  const heading = emi.heading || "EMI & Education Loan Support";
  const subHeading = emi.subHeading || "";
  const description = emi.description || "";
  const lendersCount = emi.lendersCount || "";
  const approvalTime = emi.approvalTime || "";
  const noBankVisit = emi.noBankVisit === true;
  const emiStartingFrom = emi.emiStartingFrom || "";
  const points = Array.isArray(emi.points) ? emi.points : [];
  const partners = Array.isArray(emi.partners) ? emi.partners : [];

  const hasContent =
    heading ||
    description ||
    lendersCount ||
    approvalTime ||
    emiStartingFrom ||
    points.length > 0 ||
    partners.length > 0;

  const openActionPopup = (type) => {
    if (authLoading) return;

    if (isAuthenticated) {
      setOpenPopup(true);
    } else {
      setPendingAction(type);
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        setOpenPopup(true);
        setPendingAction(null);
      }, 250);
    }
  };

  const closePopup = () => {
    setOpenPopup(false);
  };

  if (!hasContent) return null;

  const highlightCards = [
    lendersCount && {
      icon: Landmark,
      label: "Lenders",
      value: lendersCount,
    },
    approvalTime && {
      icon: Clock,
      label: "Approval Time",
      value: approvalTime,
    },
    emiStartingFrom && {
      icon: IndianRupee,
      label: "EMI Starting From",
      value: emiStartingFrom,
    },
    noBankVisit && {
      icon: ShieldCheck,
      label: "No Bank Visit",
      value: "100% Online Process",
    },
  ].filter(Boolean);

  return (
    <>
      <section
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          background: "#fff",
          border: "1px solid var(--cv-neutral-border)",
        }}
      >
        {/* ═══════════════════════════════════════════
            HEADER — Solid Navy
        ═══════════════════════════════════════════ */}
        <div
          className="px-6 md:px-8 py-5"
          style={{ background: "var(--cv-primary)" }}
        >
          <div>
            <h2
              className="text-xl md:text-2xl font-bold"
              style={{ color: "#ffffff" }}
            >
              {heading}
            </h2>
            {subHeading && (
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {subHeading}
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BODY
        ═══════════════════════════════════════════ */}
        <div className="p-6 md:p-8">
          {/* Description */}
          {description && (
            <div
              className="rich-content text-sm leading-relaxed mb-6"
              style={{ color: "var(--cv-neutral-mid)" }}
              dangerouslySetInnerHTML={{
                __html: cleanHtml(description),
              }}
            />
          )}

          {/* Highlight Cards */}
          {highlightCards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {highlightCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl p-4 shadow-sm transition-all hover:shadow-md"
                    style={{
                      background: "#fff",
                      border: "1px solid var(--cv-neutral-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cv-primary)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(30, 58, 138, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cv-neutral-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{
                        background: "var(--cv-primary-light)",
                        color: "var(--cv-primary)",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wide"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      {card.label}
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5"
                      style={{ color: "var(--cv-neutral-dark)" }}
                    >
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Partners */}
          {partners.length > 0 && (
            <div className="mb-6">
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <Building2 size={16} />
                Our Loan Partners
              </h3>
              <div className="flex flex-wrap gap-2">
                {partners.map((partner, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 text-xs font-semibold rounded-full transition-all"
                    style={{
                      background: "var(--cv-primary-light)",
                      border: "1px solid var(--cv-primary-light)",
                      color: "var(--cv-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cv-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--cv-primary-light)";
                    }}
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Points */}
          {points.length > 0 && (
            <div>
              <h3
                className="flex items-center gap-2 text-sm font-bold mb-3"
                style={{ color: "var(--cv-primary)" }}
              >
                <BadgeCheck size={16} />
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {points.map((point, index) => {
                  const isHovered = hoveredIndex === index;
                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200"
                      style={{
                        background: "#fff",
                        border: `1px solid ${
                          isHovered
                            ? "var(--cv-primary)"
                            : "var(--cv-neutral-border)"
                        }`,
                        boxShadow: isHovered
                          ? "0 8px 20px rgba(30, 58, 138, 0.12)"
                          : "none",
                      }}
                    >
                      <div
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: "var(--cv-primary-light)",
                          color: "var(--cv-primary)",
                        }}
                      >
                        <CheckCircle2 size={14} />
                      </div>
                      <p
                        className="text-sm leading-relaxed flex-1"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        {point}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              CTA Buttons — Global CSS
          ═══════════════════════════════════════════ */}
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Primary CTA — Orange Gradient (cv-btn-cta) */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cv-btn-cta cursor-pointer flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CreditCard size={16} />
              Check EMI Options
            </button>

            {/* Secondary CTA — Navy Outline */}
            <button
              onClick={() => openActionPopup("apply")}
              disabled={authLoading}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "#fff",
                border: "1px solid var(--cv-primary)",
                color: "var(--cv-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cv-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              <Percent size={16} />
              Apply for Loan
            </button>
          </div>
        </div>
      </section>

      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          onClose={() => {
            setAuthOpen(false);
            setPendingAction(null);
          }}
          defaultTab="login"
          onSuccess={handleAuthSuccess}
          universityName={data?.name || ""}
        />
      )}

      {/* APPLICATION POPUP */}
      {openPopup && (
        <Applicationpopup
          open={openPopup}
          setOpen={setOpenPopup}
          onClose={closePopup}
          universityName={data?.name || ""}
          course={{ name: "General Admission" }}
        />
      )}
    </>
  );
}