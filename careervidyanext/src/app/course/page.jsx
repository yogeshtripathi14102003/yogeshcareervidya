



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

