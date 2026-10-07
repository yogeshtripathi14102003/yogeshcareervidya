// src/app/course/TopRecruiters.jsx

import React from "react";

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
    <section
      className="w-full py-8 md:py-10"
      style={{ background: "var(--cv-neutral-light)" }}
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
          Top Recruiters for {dynamicCourseTitle}
        </h2>

        {/* Description — Grey */}
        <p
          className="mb-4 leading-relaxed max-w-5xl text-sm md:text-base"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          Multiple top recruiters of the top MNCs in India and abroad can hire
          online {dynamicCourseTitle} course graduates and offer higher
          packages. However, there is a top company list that provides good
          salary packages yearly to the Online {dynamicCourseTitle} degree
          pursuer who gets through it.
        </p>

        {/* Note */}
        <p
          className="text-xs md:text-sm italic mb-6"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          *The Naukri Jobs or Companies portal can cover the salary data range
          or the top companies that hire the online {dynamicCourseTitle} course
          pursuer.
        </p>

        {/* ═══════════════════════════════════════════
            RECRUITERS TABLE
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
                  Top MNCs hire the {dynamicCourseTitle} Course
                </th>
                <th
                  scope="col"
                  className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider"
                  style={{ color: "#fff" }}
                >
                  Salary Packages (yearly) (in INR)
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody style={{ background: "#fff" }}>
              {topRecruiters.map((recruiter, index) => (
                <tr
                  key={index}
                  className="transition-colors"
                  style={{
                    borderBottom:
                      index !== topRecruiters.length - 1
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
                    {recruiter.companyName}
                  </td>
                  <td
                    className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold break-words"
                    style={{ color: "var(--cv-primary)" }}
                  >
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