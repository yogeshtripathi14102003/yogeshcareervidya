"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Globe,
    Headset,
    UserCheck,
    CreditCard,
    GraduationCap,
    Briefcase,
    Users,
    Award,
    FileText,
    BookOpen,
    Search,
    CheckCircle2,
    Download,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

// Auth
import { useAuth } from "@/context/AuthContext.jsx";

// ✅ Popup
import Applicationpopup from "@/app/university/Applictionpopup.jsx";

// =====================================================
// SMART ICON (title ke hisaab se)
// =====================================================
const getSmartIcon = (text) => {
    const t = (text || "").toLowerCase();
    if (t.includes("flexible") || t.includes("university")) return Globe;
    if (t.includes("counselling") || t.includes("expert")) return Headset;
    if (t.includes("one-on-one") || t.includes("advisor")) return UserCheck;
    if (t.includes("emi") || t.includes("payment")) return CreditCard;
    if (t.includes("loan") || t.includes("scholarship")) return GraduationCap;
    if (t.includes("placement") || t.includes("job")) return Briefcase;
    if (t.includes("alumni") || t.includes("network")) return Users;
    if (t.includes("verified") || t.includes("degree")) return Award;
    if (t.includes("admission") || t.includes("documentation")) return FileText;
    if (t.includes("academic") || t.includes("post-admission")) return BookOpen;
    if (t.includes("transparent") || t.includes("unbiased")) return Search;
    return CheckCircle2;
};

export default function CareerVidyaBenefits({ data, title }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // ✅ AUTH
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // ✅ POPUP STATE
    const [openPopup, setOpenPopup] = useState(false);

    const universityName = data?.name || "";
    const benefitsSection = data?.careerVidyaBenefits || {};

    const heading = benefitsSection.heading || "Career Vidya Benefits";
    const subHeading = benefitsSection.subHeading || "";
    const description = benefitsSection.description || "";
    const benefits = benefitsSection.benefits || [];

    const headingText = `${universityName} ${
        title || `With ${heading}`
    }`.trim();

    // =====================================================
    // ✅ SMART POPUP OPENER (Auth-aware)
    // =====================================================
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

    // ✅ Popup close handler
    const closePopup = () => {
        setOpenPopup(false);
    };

    // Agar koi benefit nahi hai to kuch render mat karo
    if (!benefits.length && !description) return null;

    return (
        <>
            <section className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* ============ HEADER ============ */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                                {headingText}
                            </h2>
                            {subHeading && (
                                <p className="text-sm md:text-base text-gray-600 mt-1">
                                    {subHeading}
                                </p>
                            )}
                        </div>

                        {/* ✅ Download Brochure — Applictionpopup */}
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="shrink-0 cursor-pointer flex items-center justify-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Download size={16} />
                            Download Brochure
                        </button>
                    </div>

                    {/* ============ DESCRIPTION ============ */}
                    {description && (
                        <div
                            className="rich-content text-gray-700 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{
                                __html: cleanHtml(description),
                            }}
                        />
                    )}

                    {/* ============ BENEFITS GRID ============ */}
                    {benefits.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {benefits.map((benefit, index) => {
                                const Icon = getSmartIcon(benefit.title);
                                const isHovered = hoveredIndex === index;

                                return (
                                    <div
                                        key={index}
                                        onMouseEnter={() =>
                                            setHoveredIndex(index)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredIndex(null)
                                        }
                                        className={`flex items-start gap-3 p-4 rounded-xl bg-white border transition-all duration-200 ${
                                            isHovered
                                                ? "border-blue-300 shadow-lg -translate-y-0.5"
                                                : "border-gray-200 shadow-sm"
                                        }`}
                                    >
                                        {/* Icon: image ho to image, warna smart icon */}
                                        <div
                                            className="shrink-0 w-9 h-9 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center transition-transform duration-200 overflow-hidden"
                                            style={{
                                                transform: isHovered
                                                    ? "scale(1.1)"
                                                    : "scale(1)",
                                            }}
                                        >
                                            {benefit.icon ? (
                                                <Image
                                                    src={benefit.icon}
                                                    alt={
                                                        benefit.title || "icon"
                                                    }
                                                    width={36}
                                                    height={36}
                                                    className="object-contain w-full h-full p-1"
                                                />
                                            ) : (
                                                <Icon size={16} />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {benefit.title && (
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">
                                                    {benefit.title}
                                                </h4>
                                            )}
                                            {benefit.description && (
                                                <p className="text-sm leading-relaxed text-gray-600">
                                                    {benefit.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* =====================================================
                ✅ AUTH MODAL (if not logged in)
            ===================================================== */}
          
            {/* =====================================================
                ✅ APPLICATION POPUP (if logged in)
            ===================================================== */}
            {openPopup && (
                <Applicationpopup
                    open={openPopup}
                    setOpen={setOpenPopup}
                    onClose={closePopup}
                    universityName={universityName}
                    course={{ name: "General Admission" }}
                />
            )}
        </>
    );
}