"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function FaqSection({ data }) {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = data?.faqs || [];
    const universityName = data?.name || "this university";

    // Agar koi FAQ nahi hai to section render hi na karo
    if (faqs.length === 0) return null;

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Heading */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                    Frequently Asked Questions
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                    Common questions about {universityName}
                </p>
            </div>

            {/* FAQ List */}
            <div className="divide-y divide-gray-100">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div key={index}>
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-800 text-base leading-relaxed flex-1">
                                    {faq.question || "Question"}
                                </span>

                                <span
                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isOpen
                                            ? "bg-indigo-600 text-white rotate-180"
                                            : "bg-indigo-50 text-indigo-600"
                                    }`}
                                >
                                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                                </span>
                            </button>

                            {isOpen && (
                                <div className="px-6 pb-6 pt-1 bg-gray-50/50">
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: cleanHtml(faq.answer || ""),
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}