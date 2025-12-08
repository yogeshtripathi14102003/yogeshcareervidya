// // src/app/course/OnlineCourseEligibility.jsx

// import React from 'react';

// /**
//  * Renders the eligibility requirements and duration for an online course.
//  * @param {Array<Object>} onlineEligibility - Array of eligibility and duration data.
//  * @param {string} courseTitle - The general name of the course (e.g., "MBA").
//  * @param {string} fullDegreeName - The full name of the degree (e.g., "Master of Business Administration").
//  */
// export default function OnlineCourseEligibility({ onlineEligibility, courseTitle, fullDegreeName }) {
//     // Default to generic names if props are not provided
//     const dynamicCourseTitle = courseTitle || "Online Course";
//     const dynamicFullDegreeName = fullDegreeName || "Program";

//     if (!onlineEligibility || onlineEligibility.length === 0) {
//         return null; 
//     }

//     // Helper function to render a single requirement list item
//     const renderRequirement = (text) => (
//         <li className="flex items-start text-gray-700 space-x-2">
//             <span className="text-blue-500 mt-1">☑️</span>
//             <p className="leading-relaxed flex-1">{text}</p>
//         </li>
//     );

//     return (
//         <section className="mt-10 w-full flex justify-center py-10">
//             <div className="w-full max-w-4xl px-4">
                
//                 {/* Main Section Title (Uses dynamic courseTitle) */}
//                 <h2 className="text-3xl font-bold mb-8 text-gray-800">
//                     Online {dynamicCourseTitle} Eligibility & Duration
//                 </h2>
                
//                 {/* Introductory Description (Updated for dynamic courseTitle) */}
//                 <p className="text-gray-600 mb-8 leading-relaxed">
//                     Get through the online {dynamicCourseTitle} course eligibility before enrolling, and when it's completed, throughout the below-mentioned requirements and its duration, read it merely.
//                 </p>

//                 {/* Requirements that necessitate an online course: */}
//                 <h3 className="text-xl font-bold mb-3 text-gray-800">
//                     Requirements that necessitate an online {dynamicCourseTitle} course:
//                 </h3>
                
//                 {/* --- Requirements List (Based on the structure from the image) --- */}
//                 <ul className="list-none space-y-3 pl-0 mb-8">
//                     {/* Requirement 1: 50% Graduation */}
//                     {renderRequirement(
//                         <>Having a **graduation degree with a score of more than 50% marks** in any discipline</>
//                     )}
                    
//                     {/* Requirement 2: Work Experience */}
//                     {renderRequirement(
//                         <>It's not mandatory to have any work experience, but having it must be useful and impactful in understanding or getting the best opportunities.</>
//                     )}
                    
//                     {/* Requirement 3: Entrance Exam */}
//                     {renderRequirement(
//                         <>For learning the online {dynamicCourseTitle} course, not all colleges require the CAT, MAT, XAT, or GMAT exams, but some will.</>
//                     )}
//                 </ul>

                
//                 {/* --- Duration Section (Uses dynamic fullDegreeName) --- */}
//                 <h3 className="text-xl font-bold mt-8 mb-3 text-gray-800">
//                     Duration of the Online {dynamicCourseTitle} Course
//                 </h3>
                
//                 <p className="text-gray-700 leading-relaxed">
//                     The **online {dynamicFullDegreeName} course can be completed within 24 months**. It is offered at most universities at a reasonable cost, and students can enroll twice as per the UGC guidelines.
//                     <br />
                    
//                 </p>

//             </div>
//         </section>
//     );
// }

// src/app/course/OnlineCourseEligibility.jsx

import React from 'react';

/**
 * Renders the eligibility requirements and duration for an online course, 
 * driven entirely by the provided data array.
 * * @param {Array<Object>} onlineEligibility - Array of content objects.
 * @param {string} courseTitle - The general name of the course (e.g., "MBA").
 */
export default function OnlineCourseEligibility({ onlineEligibility, courseTitle }) {
    
    const dynamicCourseTitle = courseTitle || "Online Course";

    if (!onlineEligibility || onlineEligibility.length === 0) {
        return null; 
    }

    // This helper renders a bullet point if the text is present.
    // We assume any item meant to be a bullet point will be placed in `description` or `subDescription`.
    const renderRequirement = (text) => (
        <li className="flex items-start text-gray-700 space-x-2">
            {/* Using a bullet icon for list items */}
            <span className="text-blue-500 mt-1">☑️</span> 
            <p className="leading-relaxed flex-1">{text}</p>
        </li>
    );

    return (
        <section className="mt-10 w-full flex justify-center py-10">
            <div className="w-full max-w-4xl px-4">
                
                {/* Main Section Title (Still needs courseTitle for dynamic branding) */}
                <h2 className="text-3xl font-bold mb-8 text-gray-800">
                    Online {dynamicCourseTitle} Eligibility & Duration
                </h2>
                
                {/* Iterate over the entire array. Each object from the backend 
                    will generate a content block (Title, Subtitle, Text, or Bullet).
                */}
                {onlineEligibility.map((item, index) => (
                    <div key={index} className="mb-6">
                        
                        {/* 1. Main Heading (e.g., "Requirements that necessitate...") */}
                        {item.heading && (
                            <h3 className="text-xl font-bold mb-3 text-gray-800">
                                {item.heading}
                            </h3>
                        )}
                        
                        {/* 2. Sub Heading (Used for internal organization, like "Duration") */}
                        {item.subHeading && (
                            <h4 className="text-lg font-semibold mt-4 mb-3 text-gray-700">
                                {item.subHeading}
                            </h4>
                        )}

                        {/* 3. Description (Used for paragraphs/general text) */}
                        {item.description && (
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {/* Allows Markdown/bolding from the backend */}
                                <span dangerouslySetInnerHTML={{ __html: item.description }} /> 
                            </p>
                        )}
                        
                        {/* 4. SubDescription (Assuming this is used for bullet points) */}
                        {item.subDescription && (
                            <ul className="list-none space-y-3 pl-0">
                                {/* If subDescription is a comma-separated list or an array 
                                    of strings from the backend, you would split/map here.
                                    Assuming simple string for now: 
                                */}
                                {renderRequirement(
                                    <span dangerouslySetInnerHTML={{ __html: item.subDescription }} />
                                )}
                            </ul>
                        )}
                        
                    </div>
                ))}

            </div>
        </section>
    );
}