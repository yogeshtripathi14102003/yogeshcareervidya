// src/app/course/JobOpportunities.jsx

import React from 'react';

/**
 * Renders the job roles and estimated wages after completing the course.
 * @param {Array<Object>} jobOpportunities - Array of job role data (jobPost, salary).
 * @param {string} courseTitle - The dynamic name of the course.
 */
export default function JobOpportunities({ jobOpportunities, courseTitle }) {
    
    const dynamicCourseTitle = courseTitle || "Online Course";

    if (!jobOpportunities || jobOpportunities.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 w-full flex justify-center py-10 bg-white">
            {/* Width increased to 1600px */}
            <div className="w-full max-w-[1600px] px-4 md:px-10">

                {/* Main Heading - Updated to theme color #002D62 */}
                <h2 className="text-3xl font-bold mb-4 text-[#002D62]">
                    Job Opportunity after {dynamicCourseTitle}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed max-w-4xl">
                    Aspirants can take several job opportunities from the {dynamicCourseTitle} course; therefore, there are several job roles available with their estimated data. Get through it in detail.
                </p>
                
                <p className="text-sm italic text-gray-500 mb-8">
                    *The salary is estimated, and data can be driven from Naukri or Glassdoor.
                </p>

                {/* --- Job Roles Table --- */}
                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        
                        {/* Table Header - Theme background #002D62 */}
                        <thead className="bg-[#002D62] text-white">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                                >
                                    Job Roles after {dynamicCourseTitle} course
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                                >
                                    Wages in INR (annually)
                                </th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobOpportunities.map((job, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100">
                                        {job.jobPost}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                        {job.salary}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </section>
    );
}