// src/app/course/CourseWorthIt.jsx

import React from 'react';

/**
 * Renders the "Is the Online Course Worth It?" section, highlighting benefits and topics.
 * * @param {Object} onlineCourseWorthIt - The main data object containing description, topics, and image.
 * @param {string} courseTitle - The dynamic name of the course (e.g., "MBA").
 */
export default function CourseWorthIt({ onlineCourseWorthIt, courseTitle }) {
    
    // Fallback titles
    const dynamicCourseTitle = courseTitle || "Online Course";
    
    if (!onlineCourseWorthIt) {
        return null;
    }
    
    const { description, topics, image } = onlineCourseWorthIt;

    return (
        <section className="mt-12 w-full flex justify-center py-12 bg-white">
            <div className="w-full max-w-6xl px-4">

                {/* Main Heading */}
                <h2 className="text-3xl font-bold mb-10 text-center text-[#002D62]">
                    Is the Online {dynamicCourseTitle} Worth It? 🤔
                </h2>

                {/* Main Description */}
                {description && (
                    <p className="text-lg text-gray-700 mb-10 text-center max-w-4xl mx-auto leading-relaxed">
                        {/* Assuming description can contain bold/rich text */}
                        <span dangerouslySetInnerHTML={{ __html: description }} />
                    </p>
                )}

                {/* --- Content Grid (Topics + Image) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Column 1: Topics (Spans 2/3 of the width) */}
                    <div className="lg:col-span-2 space-y-8">
                        {topics?.map((topic, index) => (
                            <div key={index} className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                
                                {/* Topic Subheading */}
                                <h3 className="text-xl font-semibold mb-3 text-green-700 flex items-center">
                                    <span className="text-2xl mr-3">⭐</span> 
                                    {topic.subHeading || `Topic Highlight ${index + 1}`}
                                </h3>
                                
                                {/* Topic Description */}
                                {topic.description && (
                                    <p className="text-gray-700 leading-relaxed pl-8">
                                        <span dangerouslySetInnerHTML={{ __html: topic.description }} />
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Column 2: Image/Illustration (Spans 1/3 of the width) */}
                    {image?.url && (
                        <div className="lg:col-span-1 flex justify-center items-start">
                            <img
                                src={image.url}
                                alt={`Illustration for ${dynamicCourseTitle} worth`}
                                className="w-full h-auto object-contain rounded-xl shadow-xl max-h-[400px] border-4 border-blue-50"
                            />
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}