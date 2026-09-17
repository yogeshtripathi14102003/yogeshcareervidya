"use client";

import { useState } from "react";
import {
    FileText,
    Clock,
    Award,
    CheckCircle2,
    MonitorPlay,
    Percent,
    ClipboardList,
    ListChecks,
    BookOpenCheck,
    Target,
    ShieldCheck,
    Download,
} from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function ExamPatternSection({ data }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const exam = data?.examPattern || {};

    const heading = exam.heading || "Examination Pattern";
    const subHeading = exam.subHeading || "";
    const description = exam.description || "";
    const mode = exam.mode || "";
    const duration = exam.duration || "";
    const totalMarks = exam.totalMarks || "";
    const passingMarks = exam.passingMarks || "";
    const questionTypes = Array.isArray(exam.questionTypes) ? exam.questionTypes : [];
    const points = Array.isArray(exam.points) ? exam.points : [];

    const hasContent =
        heading ||
        description ||
        mode ||
        duration ||
        totalMarks ||
        passingMarks ||
        questionTypes.length > 0 ||
        points.length > 0;

    if (!hasContent) return null;

    // ---------- Highlight Cards ----------
    const highlightCards = [
        mode && {
            icon: MonitorPlay,
            label: "Exam Mode",
            value: mode,
        },
        duration && {
            icon: Clock,
            label: "Duration",
            value: duration,
        },
        totalMarks && {
            icon: Target,
            label: "Total Marks",
            value: totalMarks,
        },
        passingMarks && {
            icon: Award,
            label: "Passing Marks",
            value: passingMarks,
        },
    ].filter(Boolean);

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
                        Download Syllabus
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

                {/* Highlight Cards */}
                {highlightCards.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {highlightCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#0056D2] transition-all duration-200"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center mb-2">
                                        <Icon size={18} />
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                                        {card.label}
                                    </p>
                                    <p className="text-sm md:text-base font-bold text-gray-900 mt-0.5 leading-tight">
                                        {card.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Question Types */}
                {questionTypes.length > 0 && (
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                            <ListChecks size={16} />
                            Question Types
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {questionTypes.map((type, index) => (
                                <span
                                    key={index}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-100 text-[#0056D2] text-xs font-bold rounded-full hover:border-[#0056D2] transition-all"
                                >
                                    <BookOpenCheck size={12} />
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Points */}
                {points.length > 0 && (
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                            <ClipboardList size={16} />
                            Key Highlights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {points.map((point, index) => {
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
                                        <div className="shrink-0 w-7 h-7 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <p className="text-sm leading-relaxed text-gray-700 flex-1">
                                            {point}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Passing Criteria */}
                {(totalMarks || passingMarks) && (
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                            <Percent size={16} />
                            Passing Criteria
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                                {totalMarks && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center">
                                            <Target size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                                                Total Marks
                                            </p>
                                            <p className="text-base font-bold text-gray-900">
                                                {totalMarks}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {totalMarks && passingMarks && (
                                    <div className="hidden md:block w-px h-10 bg-gray-300" />
                                )}

                                {passingMarks && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#c15304] flex items-center justify-center">
                                            <Award size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                                                Passing Marks
                                            </p>
                                            <p className="text-base font-bold text-gray-900">
                                                {passingMarks}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {totalMarks && passingMarks && (
                                    <div className="hidden md:block w-px h-10 bg-gray-300" />
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                                            Evaluation
                                        </p>
                                        <p className="text-base font-bold text-gray-900">
                                            Fair & Transparent
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                    <button className="flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                        <FileText size={16} />
                        Download Syllabus
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-[#0056D2] text-[#0056D2] hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                        <ClipboardList size={16} />
                        View Sample Paper
                    </button>
                </div>
            </div>
        </section>
    );
}