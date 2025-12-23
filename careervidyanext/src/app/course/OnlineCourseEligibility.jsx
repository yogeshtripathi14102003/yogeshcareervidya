


// src/app/course/OnlineCourseEligibility.jsx
import React from 'react';

/**
 * Renders the eligibility requirements and duration for an online course, 
 * driven entirely by the provided data array.
 * @param {Array<Object>} onlineEligibility - Array of content objects.
 * @param {string} courseTitle - The general name of the course (e.g., "MBA").
 */
export default function OnlineCourseEligibility({ onlineEligibility, courseTitle }) {
    
    const dynamicCourseTitle = courseTitle || "Online Course";

    if (!onlineEligibility || onlineEligibility.length === 0) {
        return null; 
    }

    // This helper renders a bullet point if the text is present.
    const renderRequirement = (text) => (
        <li className="flex items-start text-gray-700 space-x-2">
            <span className="text-blue-500 mt-1">☑️</span> 
            <p className="leading-relaxed flex-1">{text}</p>
        </li>
    );

    return (
        <section className="mt-10 w-full flex justify-center py-10 bg-white">
            {/* Width increased to 1600px */}
            <div className="w-full max-w-[1600px] px-4 md:px-10">
                
                {/* Main Section Title - Color updated to #002D62 */}
                <h2 className="text-2xl font-bold mb-8 text-[#002D62]">
                    Online {dynamicCourseTitle} Eligibility & Duration
                </h2>
                
                {/* Content blocks */}
                <div className="space-y-6">
                    {onlineEligibility.map((item, index) => (
                        <div key={index} className="mb-6">
                            
                            {/* 1. Main Heading - Color updated to #002D62 */}
                            {item.heading && (
                                <h3 className="text-xl font-bold mb-3 text-[#002D62]">
                                    {item.heading}
                                </h3>
                            )}
                            
                            {/* 2. Sub Heading - Color updated to #002D62 */}
                            {item.subHeading && (
                                <h4 className="text-lg font-semibold mt-4 mb-3 text-[#002D62]">
                                    {item.subHeading}
                                </h4>
                            )}

                            {/* 3. Description */}
                            {item.description && (
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    <span dangerouslySetInnerHTML={{ __html: item.description }} /> 
                                </p>
                            )}
                            
                            {/* 4. SubDescription (Bullet Points) */}
                            {item.subDescription && (
                                <ul className="list-none space-y-3 pl-0">
                                    {renderRequirement(
                                        <span dangerouslySetInnerHTML={{ __html: item.subDescription }} />
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