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
      className="mt-12 w-full flex justify-center py-10"
      style={{ background: "var(--cv-neutral-light)" }}
    >
      <div className="w-full max-w-[1600px] px-4 md:px-10">
        {/* ═══════════════════════════════════════════
            MAIN HEADING — Navy
        ═══════════════════════════════════════════ */}
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--cv-primary)" }}
        >
          Top Recruiters for {dynamicCourseTitle}
        </h2>

        {/* Description — Grey */}
        <p
          className="mb-6 leading-relaxed max-w-5xl"
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
          className="text-sm italic mb-8"
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
          className="overflow-x-auto shadow-xl rounded-xl"
          style={{ border: "1px solid var(--cv-neutral-border)" }}
        >
          <table className="min-w-full">
            {/* Table Header — Navy */}
            <thead style={{ background: "var(--cv-primary)" }}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
                  style={{ color: "#fff" }}
                >
                  Top MNCs hire the {dynamicCourseTitle} Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider"
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
                    e.currentTarget.style.background = "var(--cv-primary-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-bold"
                    style={{
                      color: "var(--cv-neutral-dark)",
                      borderRight: "1px solid var(--cv-neutral-border)",
                    }}
                  >
                    {recruiter.companyName}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-semibold"
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