// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import api from "@/utlis/api";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import TeamSection from "@/app/components/TeamSection.jsx";

// export default function ComparePage() {
//   const router = useRouter();
//   const [universities, setUniversities] = useState([]);

//   useEffect(() => {
//     const query = new URLSearchParams(window.location.search);
//     const ids = query.get("ids");
//     if (!ids) return;

//     const idArray = ids.split(",");

//     const fetchUniversities = async () => {
//       try {
//         const res = await api.get("/api/v1/university");
//         const filtered = res.data.data.filter((u) => idArray.includes(u._id));
//         setUniversities(filtered);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchUniversities();
//   }, []);

//   if (universities.length === 0) {
//     return (
//       <div className="p-8 text-center text-gray-500">
//         No universities selected for comparison.
//       </div>
//     );
//   }

//   const allCourses = Array.from(
//     new Set(
//       universities.flatMap(
//         (u) => u.courses?.map((c) => c.name || "Unnamed Course") || []
//       )
//     )
//   );

//   const formatFees = (fees) => {
//     return fees ? `₹${Number(fees).toLocaleString("en-IN")}` : "-";
//   };

//   return (
//     <>
//       <Header />

//       <div className="p-8 overflow-x-auto">
//         <h1 className="text-3xl font-bold mb-6 text-center">
//           Comparison Result
//         </h1>

//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2 text-left text-blue-700">
//                 Parameters
//               </th>
//               {universities.map((uni) => (
//                 <th key={uni._id} className="border px-4 py-2 text-center">
//                   <div className="flex flex-col items-center">
//                     <img
//                       src={uni.universityImage}
//                       alt={uni.name}
//                       className="w-20 h-20 object-contain mb-2"
//                     />
//                     <span className="font-bold text-sm">{uni.name}</span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {/* Approvals */}
//             <tr className="bg-gray-50">
//               <td className="border px-4 py-2 font-bold text-blue-700">
//                 Approvals
//               </td>
//               {universities.map((uni) => (
//                 <td key={uni._id} className="border px-4 py-2 text-center text-sm">
//                   {uni.approvals
//                     ?.map((a) => (typeof a === "object" ? a.name : a))
//                     .join(", ") || "Verified"}
//                 </td>
//               ))}
//             </tr>

//             {/* Static Fields */}
//             <tr>
//               <td className="border px-4 py-2 font-bold text-blue-700">
//                 Examination Mode
//               </td>
//               {universities.map((uni) => (
//                 <td
//                   key={uni._id}
//                   className="border px-4 py-2 text-center text-green-600 font-semibold"
//                 >
//                   Online
//                 </td>
//               ))}
//             </tr>

//             <tr className="bg-gray-50">
//               <td className="border px-4 py-2 font-bold text-blue-700">
//                 Placement Assistance
//               </td>
//               {universities.map((uni) => (
//                 <td
//                   key={uni._id}
//                   className="border px-4 py-2 text-center text-green-600 font-semibold"
//                 >
//                   Virtual
//                 </td>
//               ))}
//             </tr>

//             <tr>
//               <td className="border px-4 py-2 font-bold text-blue-700">
//                 LMS Support
//               </td>
//               {universities.map((uni) => (
//                 <td
//                   key={uni._id}
//                   className="border px-4 py-2 text-center text-green-600 font-semibold"
//                 >
//                   Yes
//                 </td>
//               ))}
//             </tr>

//             <tr className="bg-gray-50">
//               <td className="border px-4 py-2 font-bold text-blue-700">
//                 EMI Facility
//               </td>
//               {universities.map((uni) => (
//                 <td
//                   key={uni._id}
//                   className="border px-4 py-2 text-center text-green-600 font-semibold"
//                 >
//                   Yes
//                 </td>
//               ))}
//             </tr>

//             <tr>
//               <td className="border px-4 py-2 font-bold text-blue-700">
//                 Loan Facility
//               </td>
//               {universities.map((uni) => (
//                 <td
//                   key={uni._id}
//                   className="border px-4 py-2 text-center text-green-600 font-semibold"
//                 >
//                   Yes
//                 </td>
//               ))}
//             </tr>

//             {/* Courses & Fees */}
//             {allCourses.map((courseName) => (
//               <tr key={courseName} className="bg-gray-50">
//                 <td className="border px-4 py-2 font-bold text-blue-700">
//                   {courseName}
//                 </td>
//                 {universities.map((uni) => {
//                   const course = uni.courses?.find(
//                     (c) => c.name === courseName
//                   );
//                   return (
//                     <td
//                       key={uni._id}
//                       className="border px-4 py-2 text-center text-sm"
//                     >
//                       {course
//                         ? `${course.duration || "-"} | ${formatFees(
//                             course.fees
//                           )}`
//                         : "-"}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <TeamSection />
//       <Footer />
//     </>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utlis/api";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import { Download } from "lucide-react";

export default function ComparePageClient({ teamSection }) {
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ids = query.get("ids");
    if (!ids) return;

    const idArray = ids.split(",");

    const fetchUniversities = async () => {
      try {
        const res = await api.get("/api/v1/university");
        const filtered = res.data.data.filter((u) => idArray.includes(u._id));
        setUniversities(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUniversities();
  }, []);

  if (universities.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No universities selected for comparison.
      </div>
    );
  }

  const allCourses = Array.from(
    new Set(
      universities.flatMap(
        (u) => u.courses?.map((c) => c.name || "Unnamed Course") || []
      )
    )
  );

  const formatFees = (fees) => {
    return fees ? `₹${Number(fees).toLocaleString("en-IN")}` : "-";
  };

  // ---------------------------------------------------------
  // ✅ BEST UNIVERSITY SCORING LOGIC
  // Score = Approvals(40%) + Courses count(30%) + Lower avg fees(30%)
  // ---------------------------------------------------------
  const getUniversityStats = (uni) => {
    const approvalsCount = uni.approvals?.length || 0;
    const coursesCount = uni.courses?.length || 0;

    const feesArray =
      uni.courses?.map((c) => Number(c.fees) || 0).filter((f) => f > 0) || [];

    const avgFees =
      feesArray.length > 0
        ? feesArray.reduce((sum, f) => sum + f, 0) / feesArray.length
        : 0;

    return { approvalsCount, coursesCount, avgFees };
  };

  const allStats = universities.map((uni) => ({
    uni,
    ...getUniversityStats(uni),
  }));

  const maxApprovals = Math.max(...allStats.map((s) => s.approvalsCount), 1);
  const maxCourses = Math.max(...allStats.map((s) => s.coursesCount), 1);
  const maxFees = Math.max(...allStats.map((s) => s.avgFees), 1);

  const scoredStats = allStats.map((s) => {
    const approvalScore = (s.approvalsCount / maxApprovals) * 40;
    const courseScore = (s.coursesCount / maxCourses) * 30;
    const feeScore = s.avgFees > 0 ? (1 - s.avgFees / maxFees) * 30 : 15;
    const totalScore = approvalScore + courseScore + feeScore;
    return { ...s, totalScore };
  });

  const best = scoredStats.reduce((prev, curr) =>
    curr.totalScore > prev.totalScore ? curr : prev
  );

  const bestUniName = best.uni.name;
  const bestReasons = [];

  if (best.approvalsCount > 0) {
    bestReasons.push(`${best.approvalsCount} recognized approval(s)`);
  }
  if (best.coursesCount > 0) {
    bestReasons.push(`${best.coursesCount} course(s) offered`);
  }
  if (best.avgFees > 0) {
    bestReasons.push(`competitive average fees of ${formatFees(best.avgFees)}`);
  }

  const bestDescription =
    bestReasons.length > 0
      ? `${bestUniName} stands out with ${bestReasons.join(", ")}, making it the strongest overall choice among the compared universities.`
      : `${bestUniName} appears to be the most balanced choice based on available comparison data.`;

  // ---------------------------------------------------------
  // ✅ PDF DOWNLOAD HANDLER (pure jsPDF + autoTable, no html2canvas)
  // ---------------------------------------------------------
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable"); // ✅ named import, fix applied

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // ---- Title ----
      doc.setFontSize(18);
      doc.setTextColor(5, 52, 127);
      doc.text("University Comparison Result", 40, 40);

      // ---- Best University Highlight Card ----
      const cardHeight = 65;
      doc.setFillColor(5, 52, 127);
      doc.roundedRect(40, 55, pageWidth - 80, cardHeight, 6, 6, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text(`Best Pick: ${bestUniName}`, 55, 78);

      doc.setFontSize(9.5);
      const splitDesc = doc.splitTextToSize(bestDescription, pageWidth - 110);
      doc.text(splitDesc, 55, 95);

      // ---- Table Data ----
      const tableColumn = ["Parameters", ...universities.map((u) => u.name)];

      const staticRows = [
        [
          "Approvals",
          ...universities.map(
            (u) =>
              u.approvals
                ?.map((a) => (typeof a === "object" ? a.name : a))
                .join(", ") || "Verified"
          ),
        ],
        ["Examination Mode", ...universities.map(() => "Online")],
        ["Placement Assistance", ...universities.map(() => "Virtual")],
        ["LMS Support", ...universities.map(() => "Yes")],
        ["EMI Facility", ...universities.map(() => "Yes")],
        ["Loan Facility", ...universities.map(() => "Yes")],
      ];

      const courseRows = allCourses.map((courseName) => [
        courseName,
        ...universities.map((uni) => {
          const course = uni.courses?.find((c) => c.name === courseName);
          return course
            ? `${course.duration || "-"} | ${formatFees(course.fees)}`
            : "-";
        }),
      ]);

      // ✅ autoTable ab standalone function ki tarah call ho raha hai
      autoTable(doc, {
        startY: 55 + cardHeight + 20,
        head: [tableColumn],
        body: [...staticRows, ...courseRows],
        theme: "grid",
        headStyles: {
          fillColor: [5, 52, 127],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 6,
          valign: "middle",
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: {
          0: { fontStyle: "bold", textColor: [5, 52, 127] },
        },
      });

      // ✅ finalY doc.lastAutoTable se milega
      const finalY = doc.lastAutoTable?.finalY || 400;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-IN")}`,
        40,
        finalY + 25
      );

      doc.save(`university-comparison-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-center flex-grow">
            Comparison Result
          </h1>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#05347f] hover:bg-[#042a66] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        {/* ✅ Best University Recommendation Card */}
        <div className="mb-8 bg-gradient-to-r from-[#05347f] to-[#3498db] text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white text-[#05347f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Best Pick
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{bestUniName}</h2>
          <p className="text-sm md:text-base leading-relaxed opacity-95">
            {bestDescription}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-blue-700">
                  Parameters
                </th>
                {universities.map((uni) => (
                  <th key={uni._id} className="border px-4 py-2 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={uni.universityImage}
                        alt={uni.name}
                        className="w-20 h-20 object-contain mb-2"
                      />
                      <span className="font-bold text-sm">
                        {uni.name}
                        {uni.name === bestUniName && (
                          <span className="ml-1 text-green-600">★</span>
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr className="bg-gray-50">
                <td className="border px-4 py-2 font-bold text-blue-700">
                  Approvals
                </td>
                {universities.map((uni) => (
                  <td key={uni._id} className="border px-4 py-2 text-center text-sm">
                    {uni.approvals
                      ?.map((a) => (typeof a === "object" ? a.name : a))
                      .join(", ") || "Verified"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border px-4 py-2 font-bold text-blue-700">
                  Examination Mode
                </td>
                {universities.map((uni) => (
                  <td
                    key={uni._id}
                    className="border px-4 py-2 text-center text-green-600 font-semibold"
                  >
                    Online
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td className="border px-4 py-2 font-bold text-blue-700">
                  Placement Assistance
                </td>
                {universities.map((uni) => (
                  <td
                    key={uni._id}
                    className="border px-4 py-2 text-center text-green-600 font-semibold"
                  >
                    Virtual
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border px-4 py-2 font-bold text-blue-700">
                  LMS Support
                </td>
                {universities.map((uni) => (
                  <td
                    key={uni._id}
                    className="border px-4 py-2 text-center text-green-600 font-semibold"
                  >
                    Yes
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td className="border px-4 py-2 font-bold text-blue-700">
                  EMI Facility
                </td>
                {universities.map((uni) => (
                  <td
                    key={uni._id}
                    className="border px-4 py-2 text-center text-green-600 font-semibold"
                  >
                    Yes
                  </td>
                ))}
              </tr>

              <tr>
                <td className="border px-4 py-2 font-bold text-blue-700">
                  Loan Facility
                </td>
                {universities.map((uni) => (
                  <td
                    key={uni._id}
                    className="border px-4 py-2 text-center text-green-600 font-semibold"
                  >
                    Yes
                  </td>
                ))}
              </tr>

              {allCourses.map((courseName) => (
                <tr key={courseName} className="bg-gray-50">
                  <td className="border px-4 py-2 font-bold text-blue-700">
                    {courseName}
                  </td>
                  {universities.map((uni) => {
                    const course = uni.courses?.find(
                      (c) => c.name === courseName
                    );
                    return (
                      <td
                        key={uni._id}
                        className="border px-4 py-2 text-center text-sm"
                      >
                        {course
                          ? `${course.duration || "-"} | ${formatFees(
                              course.fees
                            )}`
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {teamSection}
      <Footer />
    </>
  );
}