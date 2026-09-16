



// "use client";

// import Image from "next/image";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

// const getImagePath = (path) => {
//     if (!path) return "/fallback-logo.png";
//     if (path.startsWith("http")) return path;
//     if (!BASE_URL) return "/fallback-logo.png";
//     return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
// };

// // ✅ FIX: was self-fetching the same /api/v1/university/slug/{slug} data that
// // UniversityDetail (parent) already fetched server-side. That meant this
// // section's content only appeared after a client-side fetch resolved —
// // invisible to SSR HTML and to Googlebot's first pass, plus a wasted
// // extra network call. Now takes `data` as a prop instead of `slug`.
// //
// // ✅ FIX: heading was hardcoded "Accreditations & Approvals" with zero
// // variation — identical text on every /university/[slug] page, which is
// // exactly what triggers a "duplicate H2 across pages" SEO flag. Now
// // includes the university name so each page's H2 text is unique.
// export default function Approvel({ data }) {
//     const approvals = data?.approvals || [];
//     const universityName = data?.name || "This University";

//     if (!approvals.length) return null;

//     return (
//         <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
//             <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-[#0b3a6f] mb-2 uppercase tracking-wide">
//                     {universityName} Accreditations & Approvals
//                 </h2>
//                 <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//                 {approvals.map((approval, index) => (
//                     <div
//                         key={index}
//                         className="group flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
//                     >
//                         <div className="relative w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-110">
//                             <Image
//                                 src={getImagePath(approval.logo)}
//                                 alt={approval.name || "Approval"}
//                                 fill
//                                 className="object-contain"
//                             />
//                         </div>
//                         <span className="text-[10px] md:text-xs font-bold text-center text-gray-800 uppercase tracking-tighter">
//                             {approval.name}
//                         </span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

const getImagePath = (path) => {
    if (!path) return "/fallback-logo.png";
    if (path.startsWith("http")) return path;
    if (!BASE_URL) return "/fallback-logo.png";
    return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

export default function Approvel({ data }) {
    const approvals = data?.approvals || [];
    const universityName = data?.name || "This University";

    if (!approvals.length) return null;

    return (
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#0b3a6f] mb-2 uppercase tracking-wide">
                    {universityName} Accreditations & Approvals
                </h2>
                <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {approvals.map((approval, index) => (
                    <div
                        key={index}
                        className="group flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100"
                    >
                        <div className="relative w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src={getImagePath(approval.logo)}
                                alt={approval.name || "Approval"}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-center text-gray-800 uppercase tracking-tighter">
                            {approval.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}