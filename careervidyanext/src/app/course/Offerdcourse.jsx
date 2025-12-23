// src/app/course/Offerdcourse.jsx

import React from 'react';

/**
 * Displays the offered courses section.
 * @param {Array<Object>} offeredCourses - An array of objects: [{ heading: string, points: string[] }]
 * @param {string} courseName - The name of the main course.
 */
export default function Offerdcourse({ offeredCourses, courseName = "Programs" }) {
  if (!offeredCourses || offeredCourses.length === 0) {
    return null; // Don't render the section if no data is present
  }

  return (
    <section className="w-full flex justify-center bg-gray-50 py-10">
      {/* Width changed to 1600px as requested */}
      <div className="w-full max-w-[1600px] px-4">
        {/* Main Heading */}
        <h2 className="text-2xl font-bold mb-8 text-center text-[#002D62]">
          Offered {courseName} Programs & Courses
        </h2>

        {/* Grid for Offered Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offeredCourses.map((offer, i) => (
            <div
              key={i}
              className="
                bg-white
                p-6
                rounded-xl
                shadow-lg
                hover:shadow-xl
                transition-shadow
                border border-blue-100
                h-full 
                flex flex-col
              "
            >
              {/* Course Heading */}
          <h3 className="text-xl font-semibold mb-4 text-[#002D62] border-b pb-2">
                {offer.heading}
              </h3>

              {/* List of Points */}
              {offer.points?.length > 0 ? (
                <ul className="list-none space-y-3 flex-grow">
                  {offer.points.map((point, j) => (
                    <li key={j} className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 text-lg mt-0.5">
                        ✅
                      </span>
                      <p className="leading-relaxed flex-1">{point}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic mt-4">No specific points listed for this section.</p>
              )}
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}