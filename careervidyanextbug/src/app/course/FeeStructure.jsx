// src/app/course/FeeStructure.jsx

import React from 'react';

/**
 * Renders the complete Fee Structure section.
 */
export default function FeeStructure({ 
    courseTitle, 
    feeStructureSidebar, 
    detailedFees 
}) {
    
    const dynamicCourseTitle = courseTitle || "Online Course";

    return (
        <section className="mt-12 w-full flex justify-center py-10 bg-gray-50">
            {/* Width updated to 1600px */}
            <div className="w-full max-w-[1600px] px-4">

                {/* --- Main Grid Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* === COLUMN 1: Detailed Fee Table === */}
                    <div className="lg:col-span-2 space-y-10">
                        {detailedFees?.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                                    {section.heading || `Fee Structure Details ${sectionIndex + 1}`}
                                </h3>
                                
                                {section.description && (
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {section.description}
                                    </p>
                                )}

                                {section.table?.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-300">
                                            <thead>
                                                <tr className="bg-[#002D62] text-white">
                                                    <th colSpan={3} className="text-center py-3 text-lg font-semibold">
                                                        Top Universities of {dynamicCourseTitle} Course Fees
                                                    </th>
                                                </tr>
                                                <tr className="bg-[#E8F4FF] border-b border-gray-300 text-gray-800">
                                                    <th className="p-3 text-left font-semibold border-r border-gray-300">List of Universities</th>
                                                    <th className="p-3 text-left font-semibold border-r border-gray-300">Course Fees</th>
                                                    <th className="p-3 text-left font-semibold">Detailed Fee Structure</th>
                                                </tr>
                                            </thead>
                                            
                                            <tbody>
                                                {section.table.map((row, rowIndex) => (
                                                    <tr key={rowIndex} className="border-b border-gray-300 hover:bg-gray-50">
                                                        <td className="p-4 border-r border-gray-300">
                                                            <a href="#" className="text-blue-700 underline cursor-pointer hover:text-blue-500">
                                                                {row.universityName}
                                                            </a>
                                                        </td>
                                                        <td className="p-4 border-r border-gray-300 font-medium">{row.courseFees}</td>
                                                        <td className="p-4 text-sm text-gray-700">{row.detailedFeeStructure}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* === COLUMN 2: Sidebar === */}
                    <div className="lg:col-span-1 space-y-8 h-fit sticky top-4">
                        
                        {/* 2. Benefits of learning from us - ACTIVE */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">
                                Benefits of learning from us
                            </h3>
                            <ul className="list-none space-y-3">
                                <li>{renderSidebarPoint("Soft Community for peers")}</li>
                                <li>{renderSidebarPoint("Get placement support via webinars")}</li>
                                <li>{renderSidebarPoint("Dedicated buddy for doubt solving")}</li>
                                <li>{renderSidebarPoint("A career advisor for life")}</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// Helper for rendering a sidebar point
const renderSidebarPoint = (text) => (
    <div className="flex items-start text-gray-700 space-x-2 text-sm">
        <span className="text-blue-500 mt-0.5">☑️</span>
        <p className="leading-snug flex-1">{text}</p>
    </div>
);