// // src/app/course/FeeStructure.jsx

// import React from 'react';

// /**
//  * Renders the complete Fee Structure section.
//  */
// export default function FeeStructure({ 
//     courseTitle, 
//     feeStructureSidebar, 
//     detailedFees 
// }) {
    
//     const dynamicCourseTitle = courseTitle || "Online Course";

//     return (
//         <section className="mt-12 w-full flex justify-center py-10 bg-gray-50">
//             {/* Width updated to 1600px */}
//             <div className="w-full max-w-[1600px] px-4">

//                 {/* --- Main Grid Layout --- */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//                     {/* === COLUMN 1: Detailed Fee Table === */}
//                     <div className="lg:col-span-2 space-y-10">
//                         {detailedFees?.map((section, sectionIndex) => (
//                             <div key={sectionIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                
//                                 <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//                                     {section.heading || `Fee Structure Details ${sectionIndex + 1}`}
//                                 </h3>
                                
//                                 {section.description && (
//                                     <p className="text-gray-600 mb-6 leading-relaxed">
//                                         {section.description}
//                                     </p>
//                                 )}

//                                 {section.table?.length > 0 && (
//                                     <div className="overflow-x-auto">
//                                         <table className="min-w-full border border-gray-300">
//                                             <thead>
//                                                 <tr className="bg-[#002D62] text-white">
//                                                     <th colSpan={3} className="text-center py-3 text-lg font-semibold">
//                                                         Top Universities of {dynamicCourseTitle} Course Fees
//                                                     </th>
//                                                 </tr>
//                                                 <tr className="bg-[#E8F4FF] border-b border-gray-300 text-gray-800">
//                                                     <th className="p-3 text-left font-semibold border-r border-gray-300">List of Universities</th>
//                                                     <th className="p-3 text-left font-semibold border-r border-gray-300">Course Fees</th>
//                                                     <th className="p-3 text-left font-semibold">Detailed Fee Structure</th>
//                                                 </tr>
//                                             </thead>
                                            
//                                             <tbody>
//                                                 {section.table.map((row, rowIndex) => (
//                                                     <tr key={rowIndex} className="border-b border-gray-300 hover:bg-gray-50">
//                                                         <td className="p-4 border-r border-gray-300">
//                                                             <a href="#" className="text-blue-700 underline cursor-pointer hover:text-blue-500">
//                                                                 {row.universityName}
//                                                             </a>
//                                                         </td>
//                                                         <td className="p-4 border-r border-gray-300 font-medium">{row.courseFees}</td>
//                                                         <td className="p-4 text-sm text-gray-700">{row.detailedFeeStructure}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* === COLUMN 2: Sidebar === */}
//                     <div className="lg:col-span-1 space-y-8 h-fit sticky top-4">
                        
//                         {/* 2. Benefits of learning from us - ACTIVE */}
//                         <div className="bg-white p-6 rounded-xl shadow-lg border">
//                             <h3 className="text-xl font-bold mb-4 text-gray-800">
//                                 Benefits of learning from us
//                             </h3>
//                             <ul className="list-none space-y-3">
//                                 <li>{renderSidebarPoint("Soft Community for peers")}</li>
//                                 <li>{renderSidebarPoint("Get placement support via webinars")}</li>
//                                 <li>{renderSidebarPoint("Dedicated buddy for doubt solving")}</li>
//                                 <li>{renderSidebarPoint("A career advisor for life")}</li>
//                             </ul>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// }

// // Helper for rendering a sidebar point
// const renderSidebarPoint = (text) => (
//     <div className="flex items-start text-gray-700 space-x-2 text-sm">
//         <span className="text-blue-500 mt-0.5">☑️</span>
//         <p className="leading-snug flex-1">{text}</p>
//     </div>
// );

// src/app/course/FeeStructure.jsx


"use client";

import React from "react";

/* =========================================================
   HTML ENTITY DECODER
   IMPORTANT:
   Do NOT use window/document/DOMParser here.

   This function is SSR + Client safe, so hydration mismatch
   nahi hoga.
========================================================= */
function decodeHtmlEntities(value) {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value !== "string") {
        return String(value);
    }

    let result = value;

    // Decode common named entities
    const namedEntities = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&apos;": "'",
        "&cent;": "¢",
        "&pound;": "£",
        "&yen;": "¥",
        "&euro;": "€",
        "&copy;": "©",
        "&reg;": "®",
        "&trade;": "™",
    };

    // Decode repeatedly because some old database records
    // may have been encoded more than once.
    for (let round = 0; round < 3; round++) {
        const previous = result;

        Object.entries(namedEntities).forEach(([entity, character]) => {
            result = result.split(entity).join(character);
        });

        // Numeric decimal entities: &#160;
        result = result.replace(/&#(\d+);/g, (_, code) => {
            const number = Number(code);

            if (
                Number.isNaN(number) ||
                number < 0 ||
                number > 0x10ffff
            ) {
                return _;
            }

            try {
                return String.fromCodePoint(number);
            } catch {
                return _;
            }
        });

        // Numeric hexadecimal entities: &#xA0;
        result = result.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
            const number = parseInt(code, 16);

            if (
                Number.isNaN(number) ||
                number < 0 ||
                number > 0x10ffff
            ) {
                return _;
            }

            try {
                return String.fromCodePoint(number);
            } catch {
                return _;
            }
        });

        if (result === previous) {
            break;
        }
    }

    return result;
}

/* =========================================================
   BASIC HTML CLEANER
   Database me editor content aa raha hai.

   Dangerous tags remove kar rahe hain.
========================================================= */
function sanitizeHtml(html) {
    if (!html) {
        return "";
    }

    return html
        // script
        .replace(
            /<script\b[^>]*>[\s\S]*?<\/script>/gi,
            ""
        )

        // iframe
        .replace(
            /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
            ""
        )

        // object
        .replace(
            /<object\b[^>]*>[\s\S]*?<\/object>/gi,
            ""
        )

        // embed
        .replace(
            /<embed\b[^>]*>/gi,
            ""
        )

        // form
        .replace(
            /<form\b[^>]*>[\s\S]*?<\/form>/gi,
            ""
        )

        // inline event handlers
        .replace(
            /\s(on[a-z]+)\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi,
            ""
        )

        // javascript:
        .replace(
            /javascript\s*:/gi,
            ""
        )

        // vbscript:
        .replace(
            /vbscript\s*:/gi,
            ""
        );
}

/* =========================================================
   RICH TEXT RENDERER

   Supports:
   - Old plain text
   - ReactQuill HTML
   - Encoded HTML
   - &nbsp;
   - Double/triple encoded HTML
========================================================= */
function RichText({
    content,
    className = "",
}) {
    if (
        content === null ||
        content === undefined
    ) {
        return null;
    }

    if (typeof content !== "string") {
        return (
            <span className={className}>
                {String(content)}
            </span>
        );
    }

    if (!content.trim()) {
        return null;
    }

    // Decode database content
    let decoded = decodeHtmlEntities(content);

    // Decode again if required
    decoded = decodeHtmlEntities(decoded);

    // Clean dangerous HTML
    const cleanHtml = sanitizeHtml(decoded);

    // Check whether actual HTML exists
    const hasHtml =
        /<\/?[a-z][\s\S]*>/i.test(cleanHtml);

    /* =====================================================
       OLD PLAIN TEXT
    ===================================================== */
    if (!hasHtml) {
        return (
            <p className={className}>
                {decoded}
            </p>
        );
    }

    /* =====================================================
       RICH HTML
    ===================================================== */
    return (
        <div
            className={`course-rich-text ${className}`}
            dangerouslySetInnerHTML={{
                __html: cleanHtml,
            }}
        />
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function FeeStructure({
    courseTitle,
    feeStructureSidebar,
    detailedFees,
}) {
    const dynamicCourseTitle =
        courseTitle || "Online Course";

    const hasDetailedFees =
        Array.isArray(detailedFees) &&
        detailedFees.length > 0;

    const hasSidebar =
        Array.isArray(feeStructureSidebar) &&
        feeStructureSidebar.length > 0;

    // If absolutely no data, don't render empty section
    if (!hasDetailedFees && !hasSidebar) {
        return null;
    }

    return (
        <section className="mt-12 w-full flex justify-center py-10 bg-gray-50">
            <div className="w-full max-w-[1600px] px-4 md:px-6">

                {/* =====================================================
                    SECTION HEADING
                ====================================================== */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#002147] mb-8">
                    {dynamicCourseTitle} Fee Structure
                </h2>

                {/* =====================================================
                    MAIN GRID
                ====================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* =================================================
                        LEFT - DETAILED FEES
                    ================================================== */}
                    <div className="lg:col-span-2 space-y-10">

                        {hasDetailedFees &&
                            detailedFees.map(
                                (section, sectionIndex) => {

                                    if (!section) {
                                        return null;
                                    }

                                    const table =
                                        Array.isArray(section.table)
                                            ? section.table
                                            : [];

                                    return (
                                        <div
                                            key={
                                                section._id ||
                                                section.id ||
                                                sectionIndex
                                            }
                                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-w-0"
                                        >

                                            {/* =========================
                                                SECTION HEADING
                                            ========================== */}
                                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                                                {decodeHtmlEntities(
                                                    section.heading ||
                                                    `Fee Structure Details ${
                                                        sectionIndex + 1
                                                    }`
                                                )}
                                            </h3>

                                            {/* =========================
                                                DESCRIPTION
                                            ========================== */}
                                            {section.description && (
                                                <RichText
                                                    content={
                                                        section.description
                                                    }
                                                    className="text-gray-600 mb-6 leading-relaxed"
                                                />
                                            )}

                                            {/* =========================
                                                TABLE
                                            ========================== */}
                                            {table.length > 0 && (
                                                <div className="w-full overflow-x-auto rounded-lg">
                                                    <table className="w-full min-w-[850px] border-collapse border border-gray-300 bg-white">

                                                        <thead>

                                                            {/* Main table heading */}
                                                            <tr className="bg-[#002D62] text-white">
                                                                <th
                                                                    colSpan={3}
                                                                    className="text-center py-3 px-4 text-lg font-semibold border border-[#002D62]"
                                                                >
                                                                    Top Universities of{" "}
                                                                    {dynamicCourseTitle}{" "}
                                                                    Course Fees
                                                                </th>
                                                            </tr>

                                                            {/* Column headings */}
                                                            <tr className="bg-[#E8F4FF] border-b border-gray-300 text-gray-800">

                                                                <th className="p-3 text-left font-semibold border-r border-gray-300">
                                                                    List of Universities
                                                                </th>

                                                                <th className="p-3 text-left font-semibold border-r border-gray-300">
                                                                    Course Fees
                                                                </th>

                                                                <th className="p-3 text-left font-semibold">
                                                                    Detailed Fee Structure
                                                                </th>

                                                            </tr>
                                                        </thead>

                                                        <tbody>

                                                            {table.map(
                                                                (
                                                                    row,
                                                                    rowIndex
                                                                ) => {

                                                                    if (!row) {
                                                                        return null;
                                                                    }

                                                                    const universityName =
                                                                        decodeHtmlEntities(
                                                                            row.universityName ||
                                                                            "University"
                                                                        );

                                                                    const courseFees =
                                                                        decodeHtmlEntities(
                                                                            row.courseFees ||
                                                                            "-"
                                                                        );

                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                row._id ||
                                                                                row.id ||
                                                                                rowIndex
                                                                            }
                                                                            className="border-b border-gray-300 hover:bg-gray-50 transition-colors"
                                                                        >

                                                                            {/* UNIVERSITY */}
                                                                            <td className="p-4 border-r border-gray-300 align-top">

                                                                                <span className="text-blue-700 font-medium">
                                                                                    {
                                                                                        universityName
                                                                                    }
                                                                                </span>

                                                                            </td>

                                                                            {/* COURSE FEES */}
                                                                            <td className="p-4 border-r border-gray-300 font-medium text-gray-800 align-top whitespace-nowrap">

                                                                                {
                                                                                    courseFees
                                                                                }

                                                                            </td>

                                                                            {/* DETAILED FEE */}
                                                                            <td className="p-4 text-sm text-gray-700 align-top min-w-0">

                                                                                {row.detailedFeeStructure ? (
                                                                                    <RichText
                                                                                        content={
                                                                                            row.detailedFeeStructure
                                                                                        }
                                                                                        className="leading-relaxed"
                                                                                    />
                                                                                ) : (
                                                                                    <span>
                                                                                        -
                                                                                    </span>
                                                                                )}

                                                                            </td>

                                                                        </tr>
                                                                    );
                                                                }
                                                            )}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            )}

                    </div>

                    {/* =================================================
                        RIGHT SIDEBAR
                    ================================================== */}
                    <div className="lg:col-span-1 space-y-8 h-fit lg:sticky lg:top-24">

                        {/* =================================================
                            BENEFITS
                        ================================================== */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">

                            <h3 className="text-xl font-bold mb-5 text-gray-800">
                                Benefits of learning from us
                            </h3>

                            <ul className="list-none space-y-4">

                                <li>
                                    <SidebarPoint>
                                        Soft Community for peers
                                    </SidebarPoint>
                                </li>

                                <li>
                                    <SidebarPoint>
                                        Get placement support via webinars
                                    </SidebarPoint>
                                </li>

                                <li>
                                    <SidebarPoint>
                                        Dedicated buddy for doubt solving
                                    </SidebarPoint>
                                </li>

                                <li>
                                    <SidebarPoint>
                                        A career advisor for life
                                    </SidebarPoint>
                                </li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================================================
                RICH TEXT GLOBAL CSS
            ========================================================== */}
            <style jsx global>{`

                .course-rich-text {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;

                    overflow-wrap: anywhere;
                    word-break: break-word;

                    white-space: normal;

                    line-height: 1.7;
                }

                .course-rich-text p {
                    margin: 0 0 10px 0;
                }

                .course-rich-text p:last-child {
                    margin-bottom: 0;
                }

                .course-rich-text strong,
                .course-rich-text b {
                    font-weight: 700;
                }

                .course-rich-text em,
                .course-rich-text i {
                    font-style: italic;
                }

                .course-rich-text u {
                    text-decoration: underline;
                }

                .course-rich-text s,
                .course-rich-text strike {
                    text-decoration: line-through;
                }

                /* =========================
                   LISTS
                ========================== */

                .course-rich-text ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 10px 0;
                }

                .course-rich-text ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin: 10px 0;
                }

                .course-rich-text li {
                    margin-bottom: 5px;
                }

                .course-rich-text li:last-child {
                    margin-bottom: 0;
                }

                /* =========================
                   HEADINGS
                ========================== */

                .course-rich-text h1,
                .course-rich-text h2,
                .course-rich-text h3,
                .course-rich-text h4,
                .course-rich-text h5,
                .course-rich-text h6 {
                    font-weight: 700;
                    line-height: 1.4;
                    margin-top: 12px;
                    margin-bottom: 8px;
                }

                .course-rich-text h1 {
                    font-size: 1.8rem;
                }

                .course-rich-text h2 {
                    font-size: 1.5rem;
                }

                .course-rich-text h3 {
                    font-size: 1.25rem;
                }

                .course-rich-text h4 {
                    font-size: 1.1rem;
                }

                .course-rich-text h5 {
                    font-size: 1rem;
                }

                .course-rich-text h6 {
                    font-size: 0.95rem;
                }

                /* =========================
                   LINKS
                ========================== */

                .course-rich-text a {
                    color: #2563eb;
                    text-decoration: underline;

                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                /* =========================
                   IMAGES
                ========================== */

                .course-rich-text img {
                    display: block;

                    max-width: 100%;
                    width: auto;
                    height: auto;

                    margin: 10px 0;

                    border-radius: 8px;
                }

                /* =========================
                   TABLES
                ========================== */

                .course-rich-text table {
                    width: 100%;
                    max-width: 100%;

                    border-collapse: collapse;

                    margin: 12px 0;
                }

                .course-rich-text th,
                .course-rich-text td {
                    border: 1px solid #d1d5db;

                    padding: 8px;

                    text-align: left;

                    word-break: break-word;
                }

                /* =========================
                   BLOCKQUOTE
                ========================== */

                .course-rich-text blockquote {
                    border-left: 4px solid #002147;

                    padding-left: 12px;

                    margin: 12px 0;

                    color: #4b5563;
                }

                /* =========================
                   CODE
                ========================== */

                .course-rich-text pre {
                    max-width: 100%;

                    overflow-x: auto;

                    white-space: pre-wrap;

                    word-break: break-word;

                    padding: 10px;

                    background: #f3f4f6;

                    border-radius: 8px;
                }

                .course-rich-text code {
                    word-break: break-word;
                }

                /* =========================
                   MOBILE
                ========================== */

                @media (max-width: 640px) {

                    .course-rich-text {
                        font-size: 14px;
                        line-height: 1.65;
                    }

                    .course-rich-text h1 {
                        font-size: 1.5rem;
                    }

                    .course-rich-text h2 {
                        font-size: 1.3rem;
                    }

                    .course-rich-text h3 {
                        font-size: 1.15rem;
                    }

                    .course-rich-text h4 {
                        font-size: 1rem;
                    }

                    .course-rich-text ul,
                    .course-rich-text ol {
                        padding-left: 1.25rem;
                    }

                    .course-rich-text table {
                        display: block;

                        width: 100%;

                        overflow-x: auto;

                        -webkit-overflow-scrolling: touch;
                    }

                    .course-rich-text img {
                        max-width: 100%;
                        height: auto;
                    }

                    .course-rich-text iframe,
                    .course-rich-text video {
                        width: 100%;
                        max-width: 100%;
                    }
                }

                /* =========================
                   EXTRA PROTECTION
                ========================== */

                .course-rich-text span,
                .course-rich-text div {
                    max-width: 100%;

                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

            `}</style>
        </section>
    );
}

/* =========================================================
   SIDEBAR POINT
========================================================= */
function SidebarPoint({ children }) {
    return (
        <div className="flex items-start text-gray-700 space-x-3 text-sm">

            <span className="text-blue-500 mt-0.5 flex-shrink-0">
                ☑️
            </span>

            <p className="leading-snug flex-1">
                {children}
            </p>

        </div>
    );
}