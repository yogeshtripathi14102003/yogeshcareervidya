"use client";

import { useState } from "react";
import { ArrowRight, MessageCircle, HelpCircle } from "lucide-react";
import TalkToUniversity from "@/app/university/TalkToUniversity.jsx";

// Simple utility to clean HTML
const cleanHtml = (html) => {
    if (!html) return "";
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
};

// Strip HTML tags for schema
const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
};

export default function FaqSection({ data }) {
    const [openIndex, setOpenIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const [openTalkPopup, setOpenTalkPopup] = useState(false);

    const faqs = data?.faqs || [];
    const universityName = data?.name || "this university";

    // Agar koi FAQ nahi hai to section render hi na karo
    if (faqs.length === 0) return null;

    // Initially sirf 5 questions dikhao, baaki "View More" pe
    const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // =====================================================
    // ✅ SEO: FAQ Schema (JSON-LD) — ALL FAQs (not just visible)
    // =====================================================
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question || "",
            acceptedAnswer: {
                "@type": "Answer",
                text: stripHtml(faq.answer || ""),
            },
        })),
    };

    return (
        <section
            className="w-full bg-white py-12 md:py-16 px-4 md:px-8"
            aria-labelledby="faq-heading"
        >
            {/* ✅ FAQ SCHEMA FOR SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-5xl mx-auto">
                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <p className="text-sm text-[#0056D2] font-semibold mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                            <HelpCircle size={14} aria-hidden="true" />
                            FAQs
                        </p>
                        <h2
                            id="faq-heading"
                            className="text-2xl md:text-3xl font-bold text-[#0b3a6f]"
                        >
                            Let&apos;s clear up some doubts
                        </h2>
                    </div>

                    {/* Talk to Expert Button */}
                    <button
                        onClick={() => setOpenTalkPopup(true)}
                        className="flex items-center gap-2 bg-blue-50 text-[#0056D2] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors w-fit group border border-blue-100 cursor-pointer"
                        aria-label="Talk to an expert counsellor"
                    >
                        <MessageCircle size={18} aria-hidden="true" />
                        Talk to Expert
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {visibleFaqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        const panelId = `faq-panel-${index}`;
                        const buttonId = `faq-button-${index}`;

                        return (
                            <div
                                key={index}
                                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? "border-blue-200 bg-blue-50/50 shadow-sm"
                                        : "border-transparent bg-blue-50/50 hover:bg-blue-50"
                                }`}
                            >
                                {/* Question Header */}
                                <button
                                    id={buttonId}
                                    onClick={() => toggle(index)}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                                >
                                    <h3 className="font-bold text-[#0b3a6f] text-base md:text-lg leading-snug">
                                        {faq.question || "Question"}
                                    </h3>

                                    {/* Plus/Minus Icon */}
                                    <span
                                        className="shrink-0 mt-1 text-[#0056D2]"
                                        aria-hidden="true"
                                    >
                                        {isOpen ? (
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        )}
                                    </span>
                                </button>

                                {/* Answer Section */}
                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        isOpen
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-6 pt-0">
                                            <div
                                                className="faq-answer text-sm md:text-base text-gray-600 leading-relaxed break-words whitespace-normal"
                                                dangerouslySetInnerHTML={{
                                                    __html: cleanHtml(faq.answer || ""),
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View More Button */}
                {faqs.length > 5 && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            aria-expanded={showAll}
                            className="flex items-center gap-2 bg-blue-50 text-[#0056D2] px-6 py-2.5 rounded-lg border border-blue-100 font-semibold text-sm hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                            {showAll ? "VIEW LESS" : "VIEW MORE"}
                            <ArrowRight
                                size={16}
                                className={`transition-transform ${
                                    showAll ? "rotate-90" : ""
                                }`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* Talk to Expert Popup */}
            {openTalkPopup && (
                <TalkToUniversity
                    open={openTalkPopup}
                    onClose={() => setOpenTalkPopup(false)}
                    universityName={universityName}
                    phone={data?.contactNumber || "+919319998717"}
                    whatsapp={data?.whatsappNumber || "+919319998717"}
                />
            )}

            {/* Global CSS for FAQ answer styling */}
            <style jsx global>{`
                .faq-answer p {
                    margin-bottom: 0.75rem;
                    line-height: 1.6;
                }
                .faq-answer p:last-child {
                    margin-bottom: 0;
                }
                .faq-answer ul,
                .faq-answer ol {
                    padding-left: 1.25rem;
                    margin-bottom: 0.75rem;
                }
                .faq-answer ul {
                    list-style-type: disc;
                }
                .faq-answer ol {
                    list-style-type: decimal;
                }
                .faq-answer li {
                    margin-bottom: 0.25rem;
                }
                .faq-answer strong,
                .faq-answer b {
                    font-weight: 600;
                    color: #1e293b;
                }
                .faq-answer a {
                    color: #2563eb;
                    text-decoration: underline;
                    font-weight: 500;
                }
            `}</style>
        </section>
    );
}