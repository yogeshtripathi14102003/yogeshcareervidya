"use client";

import { useState } from "react";
import Image from "next/image";
import {
    MonitorPlay,
    BookOpen,
    Users,
    FileText,
    Video,
    ClipboardList,
    MessageSquare,
    Award,
    CheckCircle2,
    PlayCircle,
    Download,
    Layers,
    Calendar,
    Smartphone,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

// Auth
import { useAuth } from "@/context/AuthContext.jsx";
import AuthModal from "@/app/university/AuthModal.jsx";
// ✅ Popup
import Applictionpopup from "@/app/university/Applictionpopup.jsx";

// =====================================================
// SMART ICON (feature text ke hisaab se)
// =====================================================
const getFeatureIcon = (text) => {
    const t = (text || "").toLowerCase();
    if (t.includes("live") || t.includes("class")) return MonitorPlay;
    if (t.includes("record") || t.includes("video") || t.includes("lecture")) return Video;
    if (t.includes("ebook") || t.includes("e-book") || t.includes("book") || t.includes("material")) return BookOpen;
    if (t.includes("assignment") || t.includes("quiz")) return ClipboardList;
    if (t.includes("discussion") || t.includes("forum") || t.includes("chat")) return MessageSquare;
    if (t.includes("faculty") || t.includes("mentor") || t.includes("teacher")) return Users;
    if (t.includes("certificate") || t.includes("degree")) return Award;
    if (t.includes("pdf") || t.includes("note") || t.includes("content")) return FileText;
    if (t.includes("mobile") || t.includes("app")) return Smartphone;
    if (t.includes("schedule") || t.includes("calendar")) return Calendar;
    if (t.includes("module") || t.includes("course")) return Layers;
    if (t.includes("play") || t.includes("demo")) return PlayCircle;
    return CheckCircle2;
};

export default function LmsSection({ data }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // ✅ AUTH
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // ✅ POPUP STATE
    const [popupOpen, setPopupOpen] = useState(false);

    const lms = data?.lms || {};
    const heading = lms.heading || "Learning Management System (LMS)";
    const subHeading = lms.subHeading || "";
    const description = lms.description || "";
    const features = Array.isArray(lms.features) ? lms.features : [];
    const image = lms.image || null;

    const hasContent = heading || description || features.length > 0 || image;

    // =====================================================
    // ✅ SMART POPUP OPENER (Auth-aware)
    // =====================================================
    const openActionPopup = (type) => {
        if (authLoading) return;

        if (isAuthenticated) {
            // Logged in → direct popup
            setPopupOpen(true);
        } else {
            // Not logged in → show AuthModal first
            setPendingAction(type);
            setAuthOpen(true);
        }
    };

    const handleAuthSuccess = () => {
        setAuthOpen(false);
        if (pendingAction) {
            setTimeout(() => {
                setPopupOpen(true);
                setPendingAction(null);
            }, 250);
        }
    };

    if (!hasContent) return null;

    return (
        <>
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* ============ HEADER (Dark Blue) ============ */}
                <div className="bg-[#0b3a6f] px-6 md:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                {heading}
                            </h2>
                            {subHeading && (
                                <p className="text-blue-100 text-sm mt-1">
                                    {subHeading}
                                </p>
                            )}
                        </div>

                        {/* ✅ Watch Demo — Applictionpopup */}
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="shrink-0 flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
                        >
                            <PlayCircle size={14} />
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* ============ BODY ============ */}
                <div className="p-6 md:p-8">
                    {/* Description */}
                    {description && (
                        <div
                            className="rich-content text-gray-700 text-sm leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{
                                __html: cleanHtml(description),
                            }}
                        />
                    )}

                    {/* LMS Image */}
                    {image && (
                        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white">
                            <Image
                                src={image}
                                alt={heading}
                                width={1400}
                                height={700}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Features Grid */}
                    {features.length > 0 && (
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                                <Layers size={16} />
                                Key Features
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {features.map((feature, index) => {
                                    const Icon = getFeatureIcon(feature);
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
                                                    ? "border-[#0056D2] shadow-md"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center">
                                                <Icon size={15} />
                                            </div>

                                            <p className="text-sm leading-relaxed font-medium text-gray-700 flex-1">
                                                {feature}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ✅ CTA Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
                        >
                            <MonitorPlay size={16} />
                            Explore LMS
                        </button>
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="flex items-center gap-2 bg-white border border-[#0056D2] text-[#0056D2] hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
                        >
                            <Download size={16} />
                            Download Brochure
                        </button>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ✅ AUTH MODAL (if not logged in)
            ===================================================== */}
          
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

            {/* =====================================================
                ✅ APPLICATION POPUP (if logged in)
            ===================================================== */}
            {popupOpen && (
                <Applictionpopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    type="apply"
                    universityName={data?.name || ""}
                />
            )}
        </>
    );
}