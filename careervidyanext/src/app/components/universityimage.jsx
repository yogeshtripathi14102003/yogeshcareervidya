

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Script from "next/script";
// import api from "@/utlis/api.js";

// const INITIAL_LIMIT = 18;
// const STEP = 6;
// const DETAIL_PAGE_LIMIT = 60;

// let globalUniversitiesCache = null;

// const PRIORITY_UNIS = [
//   "op-jindal-global-online",
//   "gla-online",
//   "dy-patil-university-online-mumbai",
//   "chandigarh-university-online",
//   "kurukshetra-university-online",
//   "amity-university-online",
//   "lovely-professional-university",
//   "chaudhary-charan-singh-university",
//   "noida-international-university",
//   "manipal-university-jaipur",
//   "srm-university",
//   "shoolini-university-online",
//   "sikkim-manipal-university",
//   "amrita-vishwa-vidyapeetham",
//   "lovely-professional-university",
//   "sharda-university",
//   "chitkara-university",
//   "jain-university",
//   "dr-a-p-j-abdul-kalam-university",
//   "gauhati-university",
//   "g-l-bajaj-institute-of-technology-and-management",
//   "integral-university",
//   "galgotias-university",
// ];

// export default function UniversitiesPage() {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

//   const fetchUniversities = async () => {
//     if (globalUniversitiesCache) {
//       setUniversities(globalUniversitiesCache);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await api.get("/api/v1/university");
//       let data = res.data?.data || [];

//       data.sort((a, b) => {
//         const aIndex = PRIORITY_UNIS.indexOf(a.slug);
//         const bIndex = PRIORITY_UNIS.indexOf(b.slug);

//         if (aIndex === -1 && bIndex === -1) return 0;
//         if (aIndex === -1) return 1;
//         if (bIndex === -1) return -1;

//         return aIndex - bIndex;
//       });

//       globalUniversitiesCache = data;
//       setUniversities(data);
//     } catch (err) {
//       console.error("Error fetching universities:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[50vh] text-gray-500">
//         Loading universities...
//       </div>
//     );
//   }

//   const handleViewMore = () => {
//     setDisplayLimit((prev) => prev + STEP);
//   };

//   const handleViewLess = () => {
//     setDisplayLimit(INITIAL_LIMIT);
//   };

//   // JSON-LD Structured Data
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Top Online Universities in India",
//     description:
//       "Explore and compare over 100 online universities in India on 30+ factors at CareerVidya",
//     numberOfItems: universities.length,
//     itemListElement: universities.slice(0, displayLimit).map((uni, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "EducationalOrganization",
//         name: uni.name,
//         url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/university/${uni.slug}`,
//       },
//     })),
//   };

//   return (
//     <>
//       <Script
//         id="universities-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <section className="py-12 bg-white font-sans overflow-hidden" aria-label="Online Universities in India">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">

//           {/* Heading — h2 → h1 fix */}
//           <div className="mb-10 text-left">
//             <h2 className="text-2xl md:text-4xl font-bold text-[#0056B3] leading-tight">
//               Explore over 100 online universities & Compare on 30+ factors
//             </h2>
//             <div className="w-14 h-1 bg-[#0056B3] mt-3 rounded-full"></div>
//           </div>

//           {/* Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
//             {universities.slice(0, displayLimit).map((uni, index) => {

//               const imageUrl = uni.universityImage
//                 ? uni.universityImage.startsWith("http")
//                   ? uni.universityImage
//                   : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
//                 : "/fallback.png";

//               const isClickable =
//                 PRIORITY_UNIS.includes(uni.slug) || index < DETAIL_PAGE_LIMIT;

//               return isClickable ? (
//                 <Link
//                   key={uni._id}
//                   href={`/university/${uni.slug}`}
//                   className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col items-center justify-center w-full h-[140px] cursor-pointer hover:shadow-md"
//                   aria-label={`View details for ${uni.name}`}
//                 >
//                   <div className="relative w-full h-11 mb-1">
//                     <Image
//                       src={imageUrl}
//                       alt={`${uni.name} - Online University`}
//                       fill
//                       className="object-contain"
//                       loading={index < 12 ? "eager" : "lazy"}
//                       sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 16vw"
//                     />
//                   </div>

//                   <p className="text-gray-800 font-semibold text-[12px] text-center leading-tight">
//                     {uni.name}
//                   </p>
//                 </Link>
//               ) : (
//                 <div
//                   key={uni._id}
//                   className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col items-center justify-center w-full h-[140px]"
//                   aria-label={uni.name}
//                 >
//                   <div className="relative w-full h-11 mb-1">
//                     <Image
//                       src={imageUrl}
//                       alt={`${uni.name} - Online University`}
//                       fill
//                       className="object-contain"
//                       loading={index < 12 ? "eager" : "lazy"}
//                       sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 16vw"
//                     />
//                   </div>

//                   <p className="text-gray-800 font-semibold text-[12px] text-center leading-tight">
//                     {uni.name}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Buttons */}
//           <div className="mt-10 flex justify-center gap-4">
//             {displayLimit < universities.length && (
//               <button
//                 onClick={handleViewMore}
//                 className="bg-[#c15304] cursor-pointer text-white px-7 py-2 rounded-lg font-semibold shadow-md"
//                 aria-label="View more universities"
//               >
//                 VIEW MORE →
//               </button>
//             )}

//             {displayLimit > INITIAL_LIMIT && (
//               <button
//                 onClick={handleViewLess}
//                 className="bg-[#c15304] cursor-pointer text-white px-7 py-2 rounded-lg font-semibold shadow-md"
//                 aria-label="View fewer universities"
//               >
//                 VIEW LESS ↑
//               </button>
//             )}
//           </div>

//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utlis/api.js";

const INITIAL_LIMIT = 18;
const STEP = 6;
const DETAIL_PAGE_LIMIT = 60;

const QUERY_KEY = ["universities"];
const CACHE_KEY = "universities_cache_v1";
const ONE_HOUR = 1000 * 60 * 60;

const PRIORITY_UNIS = [
  "op-jindal-global-online",
  "gla-online",
  "dy-patil-university-online-mumbai",
  "chandigarh-university-online",
  "kurukshetra-university-online",
  "amity-university-online",
  "vikrant-university",
  "shoolini-university-online",
  "lovely-professional-university",
  "chaudhary-charan-singh-university",
  "noida-international-university",
  "manipal-university-jaipur",
  "srm-university",
  "sikkim-manipal-university",
  "amrita-vishwa-vidyapeetham",
  "sharda-university",
  "chitkara-university",
  "jain-university",
  "dr-a-p-j-abdul-kalam-university",
  "gauhati-university",
  "g-l-bajaj-institute-of-technology-and-management",
  "integral-university",
  "galgotias-university",
];

const getCourseCount = (uni) =>
  uni.coursesCount ?? uni.totalCourses ?? uni.courses?.length ?? 0;

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, time } = JSON.parse(raw);
    return Array.isArray(data) ? { data, time } : null;
  } catch {
    return null;
  }
};

const fetchUniversities = async () => {
  const res = await api.get("/api/v1/university");
  const data = [...(res.data?.data || [])];

  data.sort((a, b) => {
    const ai = PRIORITY_UNIS.indexOf(a.slug);
    const bi = PRIORITY_UNIS.indexOf(b.slug);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, time: Date.now() })
    );
  } catch {}

  return data;
};

function UniCard({ uni, index, clickable }) {
  const imageUrl = uni.universityImage
    ? uni.universityImage.startsWith("http")
      ? uni.universityImage
      : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
    : "/fallback.png";

  const courseCount = getCourseCount(uni);

  const content = (
    <>
      <div className="relative w-full h-11 mb-1">
        <Image
          src={imageUrl}
          alt={`${uni.name} - Online University`}
          fill
          className="object-contain"
          loading={index < 12 ? "eager" : "lazy"}
          sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 16vw"
        />
      </div>

      <p
        className="font-semibold text-[12px] text-center leading-tight"
        style={{ color: "#0F172A" }}
      >
        {uni.name}
      </p>

      {courseCount > 0 && (
        <p
          className="mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ color: "#1E3A8A", background: "#EFF6FF" }}
        >
          {courseCount} {courseCount === 1 ? "Course" : "Courses"}
        </p>
      )}
    </>
  );

  const baseClass =
    "bg-white rounded-lg p-3 shadow-sm flex flex-col items-center justify-center w-full h-[155px] border border-[#E5E7EB] transition-all duration-200";

  return clickable ? (
    <Link
      href={`/university/${uni.slug}`}
      className={`${baseClass} cursor-pointer hover:border-[#1E3A8A] hover:shadow-[0_4px_12px_rgba(30,58,138,0.15)]`}
      aria-label={`View details for ${uni.name}`}
    >
      {content}
    </Link>
  ) : (
    <div className={baseClass} aria-label={uni.name}>
      {content}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {Array.from({ length: INITIAL_LIMIT }).map((_, i) => (
        <div
          key={i}
          className="h-[155px] rounded-lg border border-[#E5E7EB] bg-slate-100 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function UniversitiesClient() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  // Page load par pehle localStorage se cache React Query mein daalo
  useEffect(() => {
    const cached = readCache();
    if (cached) {
      queryClient.setQueryData(QUERY_KEY, cached.data, {
        updatedAt: cached.time,
      });
    }
    setReady(true);
  }, [queryClient]);

  const { data: universities = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchUniversities,
    enabled: ready, // cache seed hone ke baad hi fetch decide hoga
    staleTime: ONE_HOUR, // 1 ghante tak API dobara hit nahi hogi
    gcTime: ONE_HOUR * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Online Universities in India",
    description:
      "Explore and compare over 100 online universities in India on 30+ factors at CareerVidya",
    numberOfItems: universities.length,
    itemListElement: universities.slice(0, displayLimit).map((uni, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "EducationalOrganization",
        name: uni.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/university/${uni.slug}`,
      },
    })),
  };

  const btnStyle = { background: "linear-gradient(180deg, #ec7425, #c15304)" };
  const btnClass =
    "cursor-pointer text-white px-7 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 hover:-translate-y-px hover:brightness-90";

  return (
    <>
      {universities.length > 0 && (
        <Script
          id="universities-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <section
        className="py-12 bg-white font-sans overflow-hidden"
        aria-label="Online Universities in India"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10 text-left">
            <h2
              className="text-2xl md:text-4xl font-bold leading-tight"
              style={{ color: "#1E3A8A" }}
            >
              Explore over 100 online universities & Compare on 30+ factors
            </h2>
            <div
              className="w-14 h-1 mt-3 rounded-full"
              style={{ background: "#1E3A8A" }}
            />
          </div>

          {!ready || (isLoading && universities.length === 0) ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {universities.slice(0, displayLimit).map((uni, index) => (
                <UniCard
                  key={uni._id}
                  uni={uni}
                  index={index}
                  clickable={
                    PRIORITY_UNIS.includes(uni.slug) ||
                    index < DETAIL_PAGE_LIMIT
                  }
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center gap-4">
            {displayLimit < universities.length && (
              <button
                onClick={() => setDisplayLimit((p) => p + STEP)}
                className={btnClass}
                style={btnStyle}
              >
                VIEW MORE →
              </button>
            )}
            {displayLimit > INITIAL_LIMIT && (
              <button
                onClick={() => setDisplayLimit(INITIAL_LIMIT)}
                className={btnClass}
                style={btnStyle}
              >
                VIEW LESS ↑
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}