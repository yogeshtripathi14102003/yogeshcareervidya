// src/app/course/CourseWorthIt.jsx
import React from "react";

export default function CourseWorthIt({ onlineCourseWorthIt, courseTitle }) {
  const dynamicCourseTitle = courseTitle || "Online Course";

  // Agar data nahi hai toh kuch render nahi hoga
  if (!onlineCourseWorthIt) {
    return null;
  }

  // Destructuring as per your model
  const { description, topics, image } = onlineCourseWorthIt;

  return (
    <section className="w-full flex justify-center py-12 bg-white font-sans">
      {/* Max width */}
      <div className="w-full max-w-[1600px] px-4 md:px-10">
        {/* Heading */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-[#002147] leading-tight">
            Is {dynamicCourseTitle} Worth It?
          </h2>
          <div className="w-16 h-1 bg-blue-600 mt-4 rounded-full"></div>
        </div>

        {/* Description */}
        {description && (
          <div className="text-base md:text-lg text-gray-600 mb-12 text-left max-w-5xl leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        )}

        {/* Topics + Image */}
        <div className="space-y-6">
          {/* Topics */}
          {topics?.map((topic, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                <div className="text-left">
                  <h3 className="text-lg md:text-xl font-bold text-[#002147] mb-2">
                    {topic.subHeading}
                  </h3>

                  {topic.description && (
                    <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: topic.description,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Image BELOW points */}
          {image?.url && (
            <div className="w-full mt-12">
              <img
                src={image.url}
                alt={courseTitle || "Course Illustration"}
  className="w-full max-h-[450px] object-contain rounded-2xl shadow-lg border border-gray-100 bg-white"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
