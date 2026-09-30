

// "use client";

// import { useState } from "react";
// import Applicationpopup from "@/app/university/Applictionpopup.jsx";

// // ✅ FIX: was self-fetching /api/v1/university/slug/{slug} again — same
// // data the parent (UniversityDetail) already fetched server-side. Removed
// // useEffect/api call/state for courses+universityName; both now come
// // straight from the `data` prop, so this table renders in the initial
// // SSR HTML instead of appearing only after a client-side fetch resolves.
// export default function FeesStructureSection({ data, courseTitle }) {
//     const courses = data?.courses || [];
//     const universityName = data?.name || "";

//     const [openPopup, setOpenPopup] = useState(false);
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     if (!courses.length) return null;

//     const handleOpenPopup = (course) => {
//         setSelectedCourse(course);
//         setOpenPopup(true);
//     };

//     return (
//         <>
//             <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
//                 {/* Heading */}
//                 <div className="bg-[#0b3a6f] text-white text-center py-4 rounded-t-lg">
//                     <h2 className="text-xl md:text-2xl font-semibold">
//                         {universityName} Fees Structure{" "}
//                         {courseTitle && (
//                             <span className="font-normal">for {courseTitle}</span>
//                         )}
//                     </h2>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto border border-t-0 rounded-b-lg">
//                     <table className="w-full border-collapse">
//                         <thead className="bg-[#eaf4ff]">
//                             <tr>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Course Name
//                                 </th>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Duration
//                                 </th>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Course Fees
//                                 </th>
//                                 <th className="text-center p-4 border text-lg font-semibold">
//                                     Detailed Fee Structure
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {courses.map((course, index) => (
//                                 <tr key={index} className="hover:bg-gray-50">
//                                     {/* Course Name → Popup */}
//                                     <td className="p-4 border">
//                                         <button
//                                             onClick={() => handleOpenPopup(course)}
//                                             className="text-blue-600 font-medium underline text-left block cursor-pointer"
//                                         >
//                                             {course.name}
//                                         </button>
//                                     </td>

//                                     <td className="p-4 border font-medium">
//                                         {course.duration || "N/A"}
//                                     </td>

//                                     <td className="p-4 border font-medium">
//                                         {course.fees || "—"}
//                                     </td>

//                                     <td className="p-4 border text-gray-700">
//                                         {course.details || "—"}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>

//             {/* Application Popup */}
//             {openPopup && (
//                 <Applicationpopup
//                     open={openPopup}
//                     setOpen={setOpenPopup}
//                     course={selectedCourse}
//                     universityName={universityName}
//                 />
//             )}
//         </>
//     );
// }

"use client";

import { useState } from "react";
import {
  GraduationCap,
  Clock,
  IndianRupee,
  FileText,
  ArrowRight,
} from "lucide-react";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";
import { cleanHtml } from "@/utlis/cleanHtml.js";
import AuthModal from "@/app/university/AuthModal.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export default function FeesStructureSection({ data, courseTitle }) {
  const courses = data?.courses || [];
  const universityName = data?.name || "";

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (!courses.length) return null;

  const handleOpenPopup = (course) => {
    if (authLoading) return;
    if (isAuthenticated) {
      setSelectedCourse(course);
      setOpenPopup(true);
    } else {
      setPendingAction(course);
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        setSelectedCourse(pendingAction);
        setOpenPopup(true);
        setPendingAction(null);
      }, 250);
    }
  };

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
            PREMIUM HEADER — Gradient + Icon
        ═══════════════════════════════════════════ */}
      <div
  className="relative overflow-hidden"
  style={{ background: "var(--cv-primary)" }}
>
  {/* Decorative circle — subtle white only */}
  <div
    className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
    style={{ background: "rgba(255,255,255,0.06)" }}
  />

  <div className="relative z-10 px-6 py-6 md:py-8 flex items-center gap-4">
    {/* Icon */}
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
      style={{ background: "rgba(255,255,255,0.15)" }}
    >
      <IndianRupee size={26} style={{ color: "#ffffff" }} />
    </div>

    {/* Text */}
    <div className="flex-1 min-w-0">
      <p
        className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1"
        style={{ color: "rgba(255,255,255,0.75)" }}
      >
        Fees Structure
      </p>
      <h2
        className="text-lg md:text-2xl font-black leading-tight"
        style={{ color: "#ffffff" }}
      >
        {universityName}
        {courseTitle && (
          <span
            className="font-normal ml-2 text-sm md:text-lg"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            • {courseTitle}
          </span>
        )}
      </h2>
    </div>

    {/* Count pill */}
    <span
      className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0"
      style={{
        background: "rgba(255,255,255,0.15)",
        color: "#ffffff",
      }}
    >
      {courses.length} {courses.length === 1 ? "Course" : "Courses"}
    </span>
  </div>
</div>

        {/* ═══════════════════════════════════════════
            PREMIUM TABLE
        ═══════════════════════════════════════════ */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            {/* Table Head */}
            <thead>
              <tr style={{ background: "var(--cv-primary-light)" }}>
                <th
                  className="text-left px-5 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: "var(--cv-primary)",
                    borderBottom: "2px solid var(--cv-primary)",
                    width: "30%",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <GraduationCap size={14} />
                    Course Name
                  </span>
                </th>
                <th
                  className="text-left px-5 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: "var(--cv-primary)",
                    borderBottom: "2px solid var(--cv-primary)",
                    width: "15%",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} />
                    Duration
                  </span>
                </th>
                <th
                  className="text-left px-5 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: "var(--cv-primary)",
                    borderBottom: "2px solid var(--cv-primary)",
                    width: "20%",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <IndianRupee size={14} />
                    Course Fees
                  </span>
                </th>
                <th
                  className="text-left px-5 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: "var(--cv-primary)",
                    borderBottom: "2px solid var(--cv-primary)",
                    width: "25%",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText size={14} />
                    Fee Details
                  </span>
                </th>
                <th
                  className="text-right px-5 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider"
                  style={{
                    color: "var(--cv-primary)",
                    borderBottom: "2px solid var(--cv-primary)",
                    width: "10%",
                  }}
                >
                  Apply
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className="transition-all duration-200 group"
                  style={{
                    background: index % 2 === 0 ? "#ffffff" : "#FAFBFC",
                    borderBottom: "1px solid var(--cv-neutral-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "var(--cv-primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      index % 2 === 0 ? "#ffffff" : "#FAFBFC";
                  }}
                >
                  {/* Course Name */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleOpenPopup(course)}
                      disabled={authLoading}
                      className="font-bold text-sm md:text-[15px] text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      style={{ color: "var(--cv-neutral-dark)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--cv-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--cv-neutral-dark)")
                      }
                    >
                      {course.name}
                    </button>
                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: "var(--cv-neutral-light)",
                        color: "var(--cv-neutral-dark)",
                      }}
                    >
                      <Clock size={11} />
                      {course.duration || "N/A"}
                    </span>
                  </td>

                  {/* Fees */}
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1 text-sm md:text-base font-black whitespace-nowrap"
                      style={{ color: "var(--cv-accent)" }}
                    >
                      <IndianRupee size={14} />
                      {course.fees || "—"}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="px-5 py-4">
                    <div
                      className="text-xs leading-relaxed line-clamp-3"
                      style={{ color: "var(--cv-neutral-mid)" }}
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(course.details || "—"),
                      }}
                    />
                  </td>

                  {/* Apply */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleOpenPopup(course)}
                      disabled={authLoading}
                      aria-label={`Apply for ${course.name}`}
                      className="cursor-pointer inline-flex items-center justify-center w-9 h-9 md:w-auto md:h-auto md:px-3.5 md:py-2 rounded-full md:rounded-full transition-all disabled:opacity-60"
                      style={{
                        background: "var(--cv-grad-cta)",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(193, 83, 4, 0.25)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "var(--cv-grad-cta-hover)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 18px rgba(193, 83, 4, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--cv-grad-cta)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(193, 83, 4, 0.25)";
                      }}
                    >
                      <ArrowRight size={14} />
                      <span className="hidden md:inline ml-1 text-xs font-bold">
                        Apply
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ═══════════════════════════════════════════
            FOOTER — Trust Strip
        ═══════════════════════════════════════════ */}
        <div
          className="px-6 py-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          style={{
            background: "var(--cv-neutral-light)",
            borderTop: "1px solid var(--cv-neutral-border)",
          }}
        >
          {[
            "✅ No-Cost EMI",
            "🎓 Govt-Approved",
            "💼 100% Placement Support",
            "📞 Free Counselling",
          ].map((item, i) => (
            <span
              key={i}
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: "var(--cv-primary)" }}
            >
              {item}
            </span>
          ))}
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
          universityName={universityName}
        />
      )}

      {/* APPLICATION POPUP */}
      {openPopup && (
        <Applicationpopup
          open={openPopup}
          setOpen={setOpenPopup}
          course={selectedCourse}
          universityName={universityName}
        />
      )}
    </>
  );
}