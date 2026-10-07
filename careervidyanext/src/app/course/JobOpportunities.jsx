// src/app/course/JobOpportunities.jsx

import React from "react";

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
    <section
      className="w-full py-8 md:py-10"
      style={{ background: "#fff" }}
    >
      {/* ✅ CONTAINER — Same as Overview */}
      <div className="max-w-[1800px] lg:w-[90%] mx-auto px-4 sm:px-6">
        {/* ═══════════════════════════════════════════
            MAIN HEADING — Navy
        ═══════════════════════════════════════════ */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "var(--cv-primary)" }}
        >
          Job Opportunity after {dynamicCourseTitle}
        </h2>

        {/* Description — Grey */}
        <p
          className="mb-4 leading-relaxed max-w-4xl text-sm md:text-base"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          Aspirants can take several job opportunities from the{" "}
          {dynamicCourseTitle} course; therefore, there are several job roles
          available with their estimated data. Get through it in detail.
        </p>

        {/* Note — Light grey */}
        <p
          className="text-xs md:text-sm italic mb-6"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          *The salary is estimated, and data can be driven from Naukri or
          Glassdoor.
        </p>

        {/* ═══════════════════════════════════════════
            JOB ROLES TABLE
        ═══════════════════════════════════════════ */}
        <div
          className="overflow-x-auto shadow-sm rounded-xl"
          style={{ border: "1px solid var(--cv-neutral-border)" }}
        >
          <table className="min-w-full">
            {/* Table Header — Navy */}
            <thead style={{ background: "var(--cv-primary)" }}>
              <tr>
                <th
                  scope="col"
                  className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider"
                  style={{ color: "#fff" }}
                >
                  Job Roles after {dynamicCourseTitle} course
                </th>
                <th
                  scope="col"
                  className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider"
                  style={{ color: "#fff" }}
                >
                  Wages in INR (annually)
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody style={{ background: "#fff" }}>
              {jobOpportunities.map((job, index) => (
                <tr
                  key={index}
                  className="transition-colors"
                  style={{
                    borderBottom:
                      index !== jobOpportunities.length - 1
                        ? "1px solid var(--cv-neutral-border)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "var(--cv-primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <td
                    className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold break-words"
                    style={{
                      color: "var(--cv-neutral-dark)",
                      borderRight: "1px solid var(--cv-neutral-border)",
                    }}
                  >
                    {job.jobPost}
                  </td>
                  <td
                    className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold break-words"
                    style={{ color: "var(--cv-primary)" }}
                  >
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