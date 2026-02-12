

"use client";

import { useRouter } from "next/navigation";

export default function Universityappro({
  universities = [],
  courseName = "",
}) {
  const router = useRouter();

  if (!Array.isArray(universities) || universities.length === 0) return null;

  const handleRowClick = (uniId) => {
    // Navigate to the university detail page, e.g., /universities/[id]
    router.push(`/universities/${uniId}`);
  };

  return (
    <section className="mb-14">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Top Affordable Universities for {courseName}
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-2 bg-[#062e5f] text-white font-semibold">
          <div className="px-6 py-4 text-lg">Universities</div>
          <div className="px-6 py-4 text-lg">Accreditations & Details</div>
        </div>

        {/* Rows */}
        {universities.map((uni, index) => {
          const approvalsText =
            Array.isArray(uni?.approvals) && uni.approvals.length > 0
              ? uni.approvals.map((a) => a.name).join(" | ")
              : "—";

          return (
            <div
              key={index}
              onClick={() => handleRowClick(uni._id)}
              className="grid grid-cols-2 border-t border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <div className="px-6 py-4 text-blue-600 font-medium">
                {uni?.name || "University"}
              </div>
              <div className="px-6 py-4 text-gray-800">
                {approvalsText}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
