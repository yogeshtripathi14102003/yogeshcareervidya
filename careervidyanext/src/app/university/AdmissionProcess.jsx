"use client";

import { useState } from "react";
import { CheckCircle2, Send, ClipboardList, GraduationCap } from "lucide-react";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function AdmissionProcess({ data }) {
    const admission = data?.admission || {};
    const universityName = data?.name || "This University";

    const admissionHeading =
        admission.admissionHeading || `${universityName} Admission Process`;

    const [openPopup, setOpenPopup] = useState(false);

    // Dono me se kuch bhi nahi → section hide
    if (
        !admission?.admissionPoints?.length &&
        !admission?.admissionDescription
    )
        return null;

    return (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* ============ HEADER (Dark Blue - Website Style) ============ */}
            <div className="bg-[#0b3a6f] px-6 md:px-8 py-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                            {admissionHeading}
                        </h2>
                        {admission.admissionSubHeading && (
                            <p className="text-blue-100 text-sm mt-1 leading-relaxed">
                                {admission.admissionSubHeading}
                            </p>
                        )}
                    </div>

                    {/* Apply Now Button */}
                    <button
                        onClick={() => setOpenPopup(true)}
                        className="shrink-0 cursor-pointer bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 group"
                    >
                        Apply Now
                        <Send
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </div>
            </div>

            {/* ============ BODY ============ */}
            <div className="p-6 md:p-8">
                {/* Description */}
                {admission.admissionDescription && (
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                            <ClipboardList size={16} />
                            How to Apply
                        </h3>
                        <div
                            className="rich-content text-gray-700 text-sm leading-relaxed bg-gray-50 border border-gray-100 rounded-xl p-5"
                            dangerouslySetInnerHTML={{
                                __html: cleanHtml(admission.admissionDescription),
                            }}
                        />
                    </div>
                )}

                {/* Steps List */}
                {admission.admissionPoints?.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-4">
                            <GraduationCap size={16} />
                            Admission Steps
                        </h3>

                        <div className="grid gap-3">
                            {admission.admissionPoints.map((point, index) => (
                                <div
                                    key={index}
                                    className="group flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-[#0056D2] hover:shadow-md transition-all duration-200"
                                >
                                    {/* Step Number */}
                                    <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-[#0056D2] font-bold text-sm border border-blue-100">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <div
                                            className="rich-content text-gray-700 text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: cleanHtml(point),
                                            }}
                                        />
                                    </div>

                                    {/* Check Icon */}
                                    <div className="shrink-0 pt-1.5 hidden sm:block">
                                        <CheckCircle2
                                            className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            size={20}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={() => setOpenPopup(true)}
                        className="cursor-pointer flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm group"
                    >
                        Start Your Application
                        <Send
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-[#0056D2] text-[#0056D2] hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
                        <ClipboardList size={16} />
                        Download Prospectus
                    </button>
                </div>
            </div>

            {/* Popup */}
            {openPopup && (
                <Applicationpopup
                    open={openPopup}
                    setOpen={setOpenPopup}
                    universityName={universityName}
                    course={{ name: "General Admission" }}
                />
            )}
        </section>
    );
}