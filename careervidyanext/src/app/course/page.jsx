// import Link from "next/link";
// import Image from "next/image";
// import { serverFetch } from "@/utlis/serverFetch";

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: "Explore Courses",
//   description:
//     "Browse top online MBA, BBA, BCA and specialization courses from leading universities. Compare fees, duration, and eligibility to find the right course for you.",
//   alternates: { canonical: "/course" },
//   openGraph: {
//     title: "Explore Courses | CareerVidya",
//     description: "Browse top online MBA, BBA, BCA and specialization courses from leading universities.",
//     url: "/course",
//     type: "website",
//   },
// };

// async function getCourses() {
//   const { ok, data } = await serverFetch("/api/v1/course", { cache: "no-store" });
//   if (!ok) return [];
//   return data?.courses || [];
// }

// export default async function CourseCardSection() {
//   const courses = await getCourses();
//   const filteredCourses = courses.slice(0, 10);

//   return (
//     <div className="container mx-auto px-4">
//       <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
//         {filteredCourses.map((course) => (
//           <Link key={course._id} href={`/course/${course.slug}`} className="...">
//             <div className="relative w-full h-40">
//               <Image
//                 src={course.courseLogo?.url || "/fallback.png"}
//                 alt={course.name}
//                 fill
//                 sizes="(min-width: 768px) 33vw, 50vw"
//                 className="object-contain"
//               />
//             </div>
//             <h2 className="text-lg font-semibold">{course.name}</h2>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }


// import Link from "next/link";
// import Image from "next/image";
// import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

// // ✅ SEO FIX: was `export const dynamic = "force-dynamic"` combined with
// // `cache: "no-store"` on the fetch — this forced a fully fresh server
// // render + fresh API call on every single request, with zero caching.
// // Slower TTFB for users and crawlers alike, with no real benefit since this
// // course list doesn't need to be second-by-second fresh. Switched to ISR:
// // the page is cached and regenerated in the background once per hour.
// export const revalidate = 3600;

// const PAGE_URL = "https://careervidya.in/course";
// // TODO: replace with a real 1200x630 OG image hosted on your domain.
// const OG_IMAGE = "https://careervidya.in/images/og-course.jpg";

// export const metadata = {
//   // ✅ Differentiated from /explore on purpose: this page is a curated
//   // "top picks" view of courses + partner universities together (no
//   // search/filter), while /explore is the full searchable directory.
//   // Distinct wording here avoids both pages targeting the identical
//   // search intent/title.
//   title: " Flexible Online MBA for Working Professionals ",
//   description:
//     "A quick look at our top-rated online courses and partner universities. Compare fees, duration, and eligibility, or search the full directory on our Explore page.",
//   alternates: { canonical: PAGE_URL },
//   openGraph: {
//     title: "Top Courses & Partner Universities | CareerVidya",
//     description: "A quick look at our top-rated online courses and partner universities.",
//     // ✅ SEO FIX: was a relative "/course" URL — Open Graph consumers
//     // (WhatsApp, LinkedIn, Facebook) expect an absolute URL here.
//     url: PAGE_URL,
//     siteName: "CareerVidya",
//     images: [
//       {
//         url: OG_IMAGE,
//         width: 1200,
//         height: 630,
//         alt: "Top Courses & Partner Universities on CareerVidya",
//       },
//     ],
//     locale: "en_IN",
//     type: "website",
//   },
//   // ✅ SEO FIX: Twitter card metadata was missing entirely.
//   twitter: {
//     card: "summary_large_image",
//     title: "Top Courses & Partner Universities | CareerVidya",
//     description: "A quick look at our top-rated online courses and partner universities.",
//     images: [OG_IMAGE],
//   },
// };

// async function getCourses() {
//   // Matches the `revalidate: 3600` above instead of `cache: "no-store"`.
//   const { ok, data } = await serverFetch("/api/v1/course", { next: { revalidate: 3600 } });
//   if (!ok) return [];
//   return data?.courses || [];
// }

// // ✅ Added: this page's distinct purpose (vs /explore) is showing courses
// // AND universities together as a curated preview, so it needs university
// // data too — previously it only fetched courses.
// async function getUniversities() {
//   const { ok, data } = await serverFetch("/api/v1/university", { next: { revalidate: 3600 } });
//   if (!ok) return [];
//   const rawUnis = data?.data || [];
//   return rawUnis.map((uni) => ({
//     ...uni,
//     universityImageUrl: resolveImageUrl(uni.universityImage, "/fallback-logo.png"),
//   }));
// }

// export default async function CourseCardSection() {
//   const [courses, universities] = await Promise.all([getCourses(), getUniversities()]);
//   const filteredCourses = courses.slice(0, 10);
//   const filteredUniversities = universities.slice(0, 10);

//   return (
//     <div className="container mx-auto px-4">
//       {/* ✅ SEO FIX: this page had NO <h1> at all anywhere in the code —
//           every indexable page needs exactly one. Added a real, keyword-
//           relevant H1 above the grid. Wording reflects the combined
//           courses + universities purpose. */}
//       <h1 className="text-2xl md:text-3xl font-bold text-[#002147] mt-10 mb-2">
//         Top Courses & Partner Universities
//       </h1>

//       <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
//         {filteredCourses.map((course) => (
//           <Link
//             key={course._id}
//             href={`/course/${course.slug}`}
//             // ✅ FIX: className was literally the string "..." — an
//             // unfinished placeholder left in the code, not real classes.
//             // Filled in with real card styling.
//             className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition p-4 block"
//           >
//             <div className="relative w-full h-40">
//               <Image
//                 src={course.courseLogo?.url || "/fallback.png"}
//                 alt={course.name}
//                 fill
//                 sizes="(min-width: 768px) 33vw, 50vw"
//                 className="object-contain"
//               />
//             </div>
//             {/* ✅ SEO FIX: was <h2>. With ~10 of these repeated per page,
//                 each one being a full heading creates many low-value,
//                 near-identical headings right after the page's own H1 —
//                 same reasoning as the course-card fix on /explore. Changed
//                 to <p>; the page's single H1 above remains the only
//                 top-level heading here. */}
//             <p className="text-lg font-semibold">{course.name}</p>
//           </Link>
//         ))}
//       </div>

//       {/* ✅ Added: universities section — this is the part that actually
//           makes this page distinct from /explore (courses + universities
//           together, curated, no search UI) instead of a near-duplicate. */}
//       {filteredUniversities.length > 0 && (
//         <>
//           <h2 className="text-2xl md:text-3xl font-bold text-[#002147] mt-16 mb-2">
//             Our Partner Universities
//           </h2>
//           <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
//             {filteredUniversities.map((uni) => (
//               <Link
//                 key={uni._id}
//                 href={`/university/${uni.slug || uni._id}`}
//                 className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition p-4 block"
//               >
//                 <div className="relative w-full h-40">
//                   <Image
//                     src={uni.universityImageUrl}
//                     alt={uni.name}
//                     fill
//                     sizes="(min-width: 768px) 33vw, 50vw"
//                     className="object-contain"
//                   />
//                 </div>
//                 <p className="text-lg font-semibold">{uni.name}</p>
//               </Link>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Internal link to the full searchable directory — reinforces to
//           both users and crawlers that this page is a curated subset, and
//           /explore is the canonical full listing. */}
//       <div className="text-center mt-12 mb-16">
//         <Link href="/explore" className="text-[#04458b] font-bold underline">
//           Browse the full course & university directory →
//         </Link>
//       </div>
//     </div>
//   );
// }



import Link from "next/link";
import Image from "next/image";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const revalidate = 3600;

const SITE_URL = "https://careervidya.in";
const PAGE_URL = `${SITE_URL}/course`;

const OG_IMAGE = `${SITE_URL}/images/og-course.jpg`;

/* =========================================================
   SEO METADATA
========================================================= */

export const metadata = {
  title: "Top Online Courses & Partner Universities | CareerVidya",

  description:
    "Explore top online courses and partner universities. Compare fees, duration, eligibility, and career opportunities at CareerVidya.",

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Top Online Courses & Partner Universities | CareerVidya",

    description:
      "Explore top online courses and partner universities. Compare fees, duration, eligibility, and career opportunities at CareerVidya.",

    url: PAGE_URL,

    siteName: "CareerVidya",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Top Online Courses and Partner Universities on CareerVidya",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Top Online Courses & Partner Universities | CareerVidya",

    description:
      "Explore top online courses and partner universities at CareerVidya.",

    images: [OG_IMAGE],
  },
};

/* =========================================================
   GET COURSES
========================================================= */

async function getCourses() {
  try {
    const { ok, data } = await serverFetch("/api/v1/course", {
      next: {
        revalidate: 3600,
      },
    });

    if (!ok) {
      return [];
    }

    return data?.courses || [];
  } catch (error) {
    console.error("Failed to fetch courses:", error);

    return [];
  }
}

/* =========================================================
   GET UNIVERSITIES
========================================================= */

async function getUniversities() {
  try {
    const { ok, data } = await serverFetch("/api/v1/university", {
      next: {
        revalidate: 3600,
      },
    });

    if (!ok) {
      return [];
    }

    const rawUniversities = data?.data || [];

    return rawUniversities
      .filter((uni) => uni?.slug)
      .map((uni) => ({
        ...uni,

        universityImageUrl: resolveImageUrl(
          uni.universityImage,
          "/fallback-logo.png"
        ),
      }));
  } catch (error) {
    console.error("Failed to fetch universities:", error);

    return [];
  }
}

/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({ course }) {
  if (!course?.slug) {
    return null;
  }

  const courseName = course?.name?.trim() || "Online Course";

  const courseImage =
    course?.courseLogo?.url || "/fallback.png";

  return (
    <Link
      href={`/course/${encodeURIComponent(course.slug)}`}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 block"
      aria-label={`View ${courseName}`}
    >
      <div className="relative w-full h-40 overflow-hidden rounded-lg">
        <Image
          src={courseImage}
          alt={`${courseName} course`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      <h2 className="text-lg font-semibold text-[#002147] mt-4">
        {courseName}
      </h2>
    </Link>
  );
}

/* =========================================================
   UNIVERSITY CARD
========================================================= */

function UniversityCard({ university }) {
  if (!university?.slug) {
    return null;
  }

  const universityName =
    university?.name?.trim() || "Partner University";

  return (
    <Link
      href={`/university/${encodeURIComponent(university.slug)}`}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 block"
      aria-label={`View ${universityName}`}
    >
      <div className="relative w-full h-40 overflow-hidden rounded-lg">
        <Image
          src={university.universityImageUrl}
          alt={`${universityName} logo`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      <h3 className="text-lg font-semibold text-[#002147] mt-4">
        {universityName}
      </h3>
    </Link>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function CourseCardSection() {
  const [courses, universities] = await Promise.all([
    getCourses(),
    getUniversities(),
  ]);

  const filteredCourses = courses
    .filter((course) => course?.slug)
    .slice(0, 10);

  const filteredUniversities = universities
    .filter((university) => university?.slug)
    .slice(0, 10);

  return (
    <main className="container mx-auto px-4 pt-10 pb-16">

      {/* =====================================================
          MAIN H1
      ===================================================== */}

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#002147]">
          Top Online Courses & Partner Universities
        </h1>

        <p className="mt-3 text-gray-600 max-w-3xl">
          Explore online courses and trusted partner universities.
          Compare programs, eligibility, duration, fees, and career
          opportunities to find the right option for your goals.
        </p>
      </header>

      {/* =====================================================
          COURSES
      ===================================================== */}

      {filteredCourses.length > 0 && (
        <section aria-labelledby="top-courses-heading">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2
              id="top-courses-heading"
              className="text-2xl md:text-3xl font-bold text-[#002147]"
            >
              Top Online Courses
            </h2>

            <Link
              href="/explore"
              className="text-[#04458b] font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          PARTNER UNIVERSITIES
      ===================================================== */}

      {filteredUniversities.length > 0 && (
        <section
          aria-labelledby="partner-universities-heading"
          className="mt-16"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2
              id="partner-universities-heading"
              className="text-2xl md:text-3xl font-bold text-[#002147]"
            >
              Our Partner Universities
            </h2>

            <Link
              href="/university"
              className="text-[#04458b] font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {filteredUniversities.map((university) => (
              <UniversityCard
                key={university._id}
                university={university}
              />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          EXPLORE CTA
      ===================================================== */}

      <section className="text-center mt-14">
        <Link
          href="/explore"
          className="inline-flex items-center justify-center rounded-lg bg-[#04458b] px-6 py-3 font-semibold text-white hover:opacity-90 transition"
        >
          Browse All Courses & Universities
        </Link>
      </section>
    </main>
  );
}

