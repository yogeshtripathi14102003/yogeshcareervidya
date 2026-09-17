"use client";

import { useState } from "react";
import {
    GraduationCap,
    BookOpen,
    CheckCircle2,
    UserCheck,
    ClipboardList,
    Target,
    Award,
    FileText,
    Download,
    Info,
    School,
    Briefcase,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

// =====================================================
// SMART ICON (course name ke hisaab se)
// =====================================================
const getCourseIcon = (courseName) => {
    const t = (courseName || "").toLowerCase();
    if (t.includes("mba") || t.includes("management") || t.includes("bba")) return Briefcase;
    if (t.includes("mca") || t.includes("bca") || t.includes("computer")) return BookOpen;
    if (t.includes("ma") || t.includes("ba") || t.includes("arts")) return FileText;
    if (t.includes("msc") || t.includes("bsc") || t.includes("science")) return Target;
    if (t.includes("mcom") || t.includes("bcom") || t.includes("commerce")) return Award;
    if (t.includes("bed") || t.includes("education")) return School;
    return GraduationCap;
};

export default function EligibilitySection({ data }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const eligibility = data?.eligibility || {};

    const heading = eligibility.heading || "Eligibility Criteria";
    const subHeading = eligibility.subHeading || "";
    const description = eligibility.description || "";
    const criteria = Array.isArray(eligibility.criteria) ? eligibility.criteria : [];
    const points = Array.isArray(eligibility.points) ? eligibility.points : [];

    const hasContent =
        heading ||
        description ||
        criteria.length > 0 ||
        points.length > 0;

    if (!hasContent) return null;

    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* ============ HEADER (Dark Blue - Website Style) ============ */}
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

                    <button className="shrink-0 flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm">
                        <Download size={14} />
                        Download Brochure
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

                {/* Course-wise Criteria */}
                {criteria.length > 0 && (
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                            <ClipboardList size={16} />
                            Course-wise Eligibility
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {criteria.map((item, index) => {
                                const Icon = getCourseIcon(item.courseName);
                                const isHovered = hoveredIndex === index;

                                return (
                                    <div
                                        key={index}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        className={`flex items-start gap-3 p-4 rounded-xl bg-white border transition-all duration-200 ${
                                            isHovered
                                                ? "border-[#0056D2] shadow-md"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center">
                                            <Icon size={18} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {item.courseName && (
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">
                                                    {item.courseName}
                                                </h4>
                                            )}
                                            {item.requirement && (
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    {item.requirement}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Additional Points */}
                {points.length > 0 && (
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                            <Info size={16} />
                            Additional Information
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <ul className="space-y-3">
                                {points.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-blue-50 text-[#0056D2] flex items-center justify-center mt-0.5">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        <p className="text-sm leading-relaxed text-gray-700 flex-1">
                                            {point}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Important Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white text-[#0056D2] flex items-center justify-center">
                        <Info size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[#0056D2] uppercase tracking-wide mb-0.5">
                            Important Note
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Eligibility criteria may vary based on the course and specialization. Please verify the specific requirements for your chosen program before applying.
                        </p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                    <button className="flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                        <UserCheck size={16} />
                        Check Your Eligibility
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-[#0056D2] text-[#0056D2] hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                        <Download size={16} />
                        Download Brochure
                    </button>
                </div>
            </div>
        </section>
    );
}