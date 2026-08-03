// src/app/course/OnlineCourseEligibility.jsx
import React from 'react';

export default function OnlineCourseEligibility({ onlineEligibility, courseTitle }) {
    
    const dynamicCourseTitle = courseTitle || "Online Course";

    if (!onlineEligibility || onlineEligibility.length === 0) {
        return null; 
    }

    // Helper to render a single bullet point
    const renderRequirement = (text, index) => (
        <li key={index} className="flex items-start text-gray-700 space-x-2">
            <span className="text-blue-500 mt-1">☑️</span> 
            <p className="leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: text }} />
        </li>
    );

    // Helper to split text into points (array or string) and clean extra dots or bullets
    const getPoints = (text) => {
        if (!text) return [];
        if (Array.isArray(text)) return text.map(cleanPoint).filter(p => p);
        return text
            .split(/\r?\n|,/) // split by newline or comma
            .map(point => cleanPoint(point))
            .filter(point => point.length > 0);
    };

    // Helper to remove leading dots, bullets, or spaces
    const cleanPoint = (point) => {
        return point.replace(/^(\s*[\.\•\-\*]+\s*)/, '').trim();
    };

    return (
        <section className="mt-10 w-full flex justify-center py-10 bg-white">
            <div className="w-full max-w-[1600px] px-4 md:px-10">
                
                <h2 className="text-2xl font-bold mb-8 text-[#002D62]">
                    {dynamicCourseTitle} Eligibility & Duration
                </h2>
                
                <div className="space-y-6">
                    {onlineEligibility.map((item, index) => (
                        <div key={index} className="mb-6">
                            
                            {item.heading && (
                                <h3 className="text-xl font-bold mb-3 text-[#002D62]">
                                    {item.heading}
                                </h3>
                            )}
                            
                            {item.subHeading && (
                                <h4 className="text-lg font-semibold mt-4 mb-3 text-[#002D62]">
                                    {item.subHeading}
                                </h4>
                            )}

                            {/* Render description as bullet points */}
                            {item.description && (
                                <ul className="list-none space-y-3 pl-0 mb-4">
                                    {getPoints(item.description).map((point, i) =>
                                        renderRequirement(point, i)
                                    )}
                                </ul>
                            )}
                            
                            {/* Render subDescription as bullet points */}
                            {item.subDescription && (
                                <ul className="list-none space-y-3 pl-0">
                                    {getPoints(item.subDescription).map((point, i) =>
                                        renderRequirement(point, i)
                                    )}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
