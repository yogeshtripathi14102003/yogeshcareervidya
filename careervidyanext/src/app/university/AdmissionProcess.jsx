"use client";

import { useState } from "react";
import { CheckCircle2, Send, ClipboardList, GraduationCap } from "lucide-react";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { cleanHtml } from "@/utlis/cleanHtml.js";

export default function AdmissionProcess({ data }) {
    const admission = data?.admission || {};
    const universityName = data?.name || "This University";

    const admissionHeading =
        admission.admissionHeading || `${universityName} Admission Process`;

    // ✅ AUTH
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // ✅ POPUP STATE
    const [openPopup, setOpenPopup] = useState(false);

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

    if (
        !admission?.admissionPoints?.length &&
        !admission?.admissionDescription
    )
        return null;

    return (
        <>
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* ============ HEADER (Dark Blue) ============ */}
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

                        {/* ✅ Apply Now — cursor-pointer added */}
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="shrink-0 cursor-pointer bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {authLoading ? (
                                "Loading..."
                            ) : (
                                <>
                                    Apply Now
                                    <Send
                                        size={14}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ============ BODY ============ */}
                <div className="p-6 md:p-8">
                    {admission.admissionDescription && (
                        <div className="mb-8">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-3">
                                <ClipboardList size={16} />
                                How to Apply
                            </h3>
                            <div
                                className="rich-content text-gray-700 text-sm leading-relaxed bg-gray-50 border border-gray-100 rounded-xl p-5"
                                dangerouslySetInnerHTML={{
                                    __html: cleanHtml(
                                        admission.admissionDescription
                                    ),
                                }}
                            />
                        </div>
                    )}

                    {admission.admissionPoints?.length > 0 && (
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0056D2] mb-4">
                                <GraduationCap size={16} />
                                Admission Steps
                            </h3>

                            <div className="grid gap-3">
                                {admission.admissionPoints.map(
                                    (point, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-[#0056D2] hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-[#0056D2] font-bold text-sm border border-blue-100">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>

                                            <div className="flex-1 pt-1">
                                                <div
                                                    className="rich-content text-gray-700 text-sm leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: cleanHtml(
                                                            point
                                                        ),
                                                    }}
                                                />
                                            </div>

                                            <div className="shrink-0 pt-1.5 hidden sm:block">
                                                <CheckCircle2
                                                    className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    size={20}
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* ✅ Bottom CTA Buttons — cursor-pointer added */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="cursor-pointer flex items-center gap-2 bg-[#c15304] hover:bg-[#a04503] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Start Your Application
                            <Send
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </button>
                        <button
                            onClick={() => openActionPopup("apply")}
                            disabled={authLoading}
                            className="cursor-pointer flex items-center gap-2 bg-white border border-[#0056D2] text-[#0056D2] hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <ClipboardList size={16} />
                            Download Prospectus
                        </button>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ✅ AUTH MODAL
            ===================================================== */}
           

            {/* =====================================================
                ✅ APPLICATION POPUP — with proper close
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