// "use client";

// import Image from "next/image";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// /**
//  * Convert relative image path to full URL
//  */
// const getImagePath = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http")) return path;
//   return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// /**
//  * Universityappro Component
//  * Props:
//  * universities: [
//  *   {
//  *     name: "University Name",
//  *     approvals: [
//  *       { name: "UGC", logo: "/uploads/ugc.png" }
//  *     ]
//  *   }
//  * ]
//  */
// export default function Universityappro({ universities = [] }) {
//   // Safety check
//   if (!Array.isArray(universities) || universities.length === 0) return null;

//   return (
//     <section className="mb-12">
//       <h2 className="text-3xl font-bold text-gray-800 mb-4 pt-4">
//         Regulatory Approvals
//       </h2>

//       <p className="text-lg text-gray-600 mb-6">
//         The universities are officially approved and recognized by the following
//         regulatory bodies.
//       </p>

//       {universities.map((uni, uniIndex) => (
//         <div key={uniIndex} className="mb-10">
//           {/* University Name */}
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             {uni?.name || "University"}
//           </h3>

//           {/* Approvals */}
//           {Array.isArray(uni?.approvals) && uni.approvals.length > 0 ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//               {uni.approvals.map((approval, idx) => {
//                 const approvalName = approval?.name || "Approval";
//                 const approvalLogo = approval?.logo || null;

//                 return (
//                   <div
//                     key={idx}
//                     className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg h-32 text-center bg-white"
//                   >
//                     {approvalLogo ? (
//                       <div className="w-16 h-16 relative mb-2">
//                         <Image
//                           src={getImagePath(approvalLogo)}
//                           alt={approvalName}
//                           fill
//                           className="object-contain"
//                         />
//                       </div>
//                     ) : (
//                       <div className="w-16 h-16 mb-2 flex items-center justify-center text-xs text-gray-400 border rounded">
//                         No Logo
//                       </div>
//                     )}

//                     <div className="text-xs font-medium text-gray-700">
//                       {approvalName}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">
//               No approvals available
//             </p>
//           )}
//         </div>
//       ))}
//     </section>
//   );
// }


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
