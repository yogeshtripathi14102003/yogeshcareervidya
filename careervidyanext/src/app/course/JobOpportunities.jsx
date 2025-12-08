// src/app/course/JobOpportunities.jsx

import React from 'react';

/**
 * Renders the job roles and estimated wages after completing an Online MBA course.
 * @param {Array<Object>} jobOpportunities - Array of job role data (heading, jobPost, salary).
 * @param {string} courseTitle - The dynamic name of the course (e.g., "MBA").
 */
export default function JobOpportunities({ jobOpportunities, courseTitle }) {
    
    const dynamicCourseTitle = courseTitle || "Online MBA";

    if (!jobOpportunities || jobOpportunities.length === 0) {
        return null;
    }

    // Assuming the main data is structured as an array of job-salary pairs
    // The model provided has redundant fields (heading, description) for a simple table, 
    // so we'll focus on `jobPost` (Job Roles) and `salary` (Wages in INR).

    return (
        <section className="mt-12 w-full flex justify-center py-10 bg-white">
            <div className="w-full max-w-6xl px-4">

                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    Job Opportunity after  {dynamicCourseTitle}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Aspirants can take several job opportunities from the  {dynamicCourseTitle} course; therefore, there are several job roles available with their estimated data. Get through it in detail.
                </p>
                <p className="text-sm italic text-gray-500 mb-8">
                    *The salary is estimated, and data can be driven from Naukri or Glassdoor.
                </p>

                {/* --- Job Roles Table --- */}
                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        
                        {/* Table Header */}
                        <thead className="bg-[#002D62] text-white">
                            <tr>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                                >
                                    Job Roles after  {dynamicCourseTitle} course
                                </th>
                                <th 
                                    scope="col" 
                                    className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider"
                                >
                                    Wages in INR (annually)
                                </th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobOpportunities.map((job, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {job.jobPost}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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