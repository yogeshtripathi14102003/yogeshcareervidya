// src/app/course/TopRecruiters.jsx

import React from 'react';

/**
 * Renders the section detailing the top recruiters for the online course.
 * @param {Array<Object>} topRecruiters - Array of recruiter data (companyName, packageOffered).
 * @param {string} courseTitle - The dynamic name of the course (e.g., "MBA").
 */
export default function TopRecruiters({ topRecruiters, courseTitle }) {
    
    const dynamicCourseTitle = courseTitle || "Online MBA";

    if (!topRecruiters || topRecruiters.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 w-full flex justify-center py-10 bg-gray-50">
            {/* Width increased to 1600px as requested */}
            <div className="w-full max-w-[1600px] px-4 md:px-10">

                {/* Main Heading - Updated to #002D62 */}
                <h2 className="text-3xl font-bold mb-4 text-[#002D62]">
                    Top Recruiters for Online {dynamicCourseTitle}
                </h2>
                
                {/* Introductory Description */}
                <p className="text-gray-600 mb-6 leading-relaxed max-w-5xl">
                    Multiple top recruiters of the top MNCs in India and abroad can hire online {dynamicCourseTitle} course graduates and offer higher packages. However, there is a top company list that provides good salary packages yearly to the Online {dynamicCourseTitle} degree pursuer who gets through it.
                </p>
                <p className="text-sm italic text-gray-500 mb-8">
                    *The Naukri Jobs or Companies portal can cover the salary data range or the top companies that hire the online {dynamicCourseTitle} course pursuer.
                </p>

                {/* --- Recruiters Table --- */}
                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        
                        {/* Table Header */}
                        <thead className="bg-[#002D62] text-white">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                                >
                                    Top MNCs hire the {dynamicCourseTitle} Course 
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                                >
                                    Salary Packages (yearly) (in INR)
                                </th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topRecruiters.map((recruiter, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-100">
                                        {recruiter.companyName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                        {recruiter.packageOffered}
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