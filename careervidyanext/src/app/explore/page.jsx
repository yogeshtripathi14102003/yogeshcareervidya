

// import ExploreClient from "./ExploreClient";
// import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";


// export const revalidate = 3600;

// const PAGE_URL = "https://careervidya.in/explore";
// // TODO: replace with a real 1200x630 OG image hosted on your domain.
// const OG_IMAGE = "https://careervidya.in/images/og-explore.jpg";

// export const metadata = {
//   // ✅ SEO FIX: was 61 characters, just over Google's ~60-char safe zone
//   // (risked truncation in search results). Shortened to 48 characters
//   // while keeping the primary keyword ("Explore Courses") and brand.
//   title: "Explore Courses & Top Universities | CareerVidya",
//   description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
//   alternates: {
//     canonical: PAGE_URL,
//   },
//   // ✅ SEO FIX: openGraph/twitter blocks were missing entirely, so shares
//   // on WhatsApp, LinkedIn, Facebook, Twitter/X fell back to generic/blank
//   // previews instead of a proper title, description, and image.
//   openGraph: {
//     title: "Explore Courses & Top Universities | CareerVidya",
//     description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
//     url: PAGE_URL,
//     siteName: "CareerVidya",
//     images: [
//       {
//         url: OG_IMAGE,
//         width: 1200,
//         height: 630,
//         alt: "Explore Courses & Top Universities on CareerVidya",
//       },
//     ],
//     locale: "en_IN",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Explore Courses & Top Universities | CareerVidya",
//     description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
//     images: [OG_IMAGE],
//   },
// };

// async function getData() {
//   const [courseResult, uniResult] = await Promise.all([
//     serverFetch("/api/v1/course?limit=40", { next: { revalidate: 3600 } }),
//     serverFetch("/api/v1/university", { next: { revalidate: 3600 } }),
//   ]);

//   const initialCourses = courseResult.ok ? courseResult.data?.courses || [] : [];
//   const rawUnis = uniResult.ok ? uniResult.data?.data || [] : [];

//   // ✅ Resolve university image URLs here on the server — same pattern as
//   // /topunivers — so ExploreClient never needs NEXT_PUBLIC_API_URL or its
//   // own URL-building logic.
//   const initialUnis = rawUnis.map((uni) => ({
//     ...uni,
//     universityImageUrl: resolveImageUrl(uni.universityImage, "/fallback-logo.png"),
//   }));

//   return { initialCourses, initialUnis };
// }

// export default async function Page() {
//   const data = await getData();
//   return <ExploreClient initialData={data} />;
// }


import ExploreClient from "./ExploreClient";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const revalidate = 3600;

const SITE_URL = "https://careervidya.in";
const PAGE_URL = `${SITE_URL}/explore`;

const OG_IMAGE = `${SITE_URL}/images/og-explore.jpg`;

/* =========================================================
   SEO METADATA
========================================================= */

export const metadata = {
  title: "Explore Online Courses & Universities | CareerVidya",

  description:
    "Explore UG, PG, and doctorate courses from recognized universities in India. Compare courses, fees, eligibility, duration, and career opportunities.",

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Explore Online Courses & Universities | CareerVidya",

    description:
      "Explore UG, PG, and doctorate courses from recognized universities in India. Compare courses, fees, eligibility, duration, and career opportunities.",

    url: PAGE_URL,

    siteName: "CareerVidya",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Explore Online Courses and Universities on CareerVidya",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Explore Online Courses & Universities | CareerVidya",

    description:
      "Explore UG, PG, and doctorate courses from recognized universities in India.",

    images: [OG_IMAGE],
  },
};

/* =========================================================
   GET COURSES + UNIVERSITIES
========================================================= */

async function getData() {
  try {
    const [courseResult, uniResult] = await Promise.all([
      serverFetch("/api/v1/course?limit=40", {
        next: {
          revalidate: 3600,
        },
      }),

      serverFetch("/api/v1/university", {
        next: {
          revalidate: 3600,
        },
      }),
    ]);

    const initialCourses = courseResult.ok
      ? courseResult.data?.courses || []
      : [];

    const rawUnis = uniResult.ok
      ? uniResult.data?.data || []
      : [];

    /* =====================================================
       RESOLVE UNIVERSITY IMAGES
    ===================================================== */

    const initialUnis = rawUnis
      .filter((uni) => uni?.slug)
      .map((uni) => ({
        ...uni,

        universityImageUrl: resolveImageUrl(
          uni.universityImage,
          "/fallback-logo.png"
        ),
      }));

    /* =====================================================
       REMOVE INVALID COURSES
    ===================================================== */

    const validCourses = initialCourses.filter(
      (course) => course?.slug
    );

    return {
      initialCourses: validCourses,
      initialUnis,
    };
  } catch (error) {
    console.error("Failed to load Explore data:", error);

    return {
      initialCourses: [],
      initialUnis: [],
    };
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function Page() {
  const data = await getData();

  return (
    <main>
      {/* =====================================================
          SEO H1

          IMPORTANT:
          Keep the H1 in the server-rendered page so search
          engines can see it without depending on client JS.
      ===================================================== */}

      <h1 className="sr-only">
        Explore Online Courses & Universities
      </h1>

      <ExploreClient initialData={data} />
    </main>
  );
}

