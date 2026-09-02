

// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch } from "@/utlis/serverFetch";

// export const dynamic = "force-dynamic";

// async function getUniversities() {
//   const { ok, data } = await serverFetch("/api/v1/university", {
//     next: { revalidate: 60 },
//   });

//   if (!ok) return [];
//   return data?.data || [];
// }

// // ✅ This listing page had no metadata at all before — it was inheriting
// // the generic root layout title/description for every visit.
// export const metadata = {
//   title: "Top Online Universities & Courses in India | CareerVidya",

//   description:
//     "Explore top UGC-recognized online universities and degree programs in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career options for students and working professionals.in india",

//   alternates: {
//     canonical: "https://careervidya.in/university",
//   },
// };

// export default async function Page() {
//   const list = await getUniversities();
//   return <UniversityDetail initialUniversities={list} />;
// }



import UniversityDetail from "@/app/university/UniversityDetail.jsx";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const revalidate = 3600;

const SITE_URL = "https://careervidya.in";
const PAGE_URL = `${SITE_URL}/university`;

const OG_IMAGE = `${SITE_URL}/images/universities-og.jpg`;

/* =========================================================
   SEO METADATA
========================================================= */

export const metadata = {
  title: "Top Online Universities in India | CareerVidya",

  description:
    "Explore top UGC-recognized online universities in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career opportunities.",

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Top Online Universities in India | CareerVidya",

    description:
      "Explore top UGC-recognized online universities in India. Compare online courses, fees, eligibility, duration, and career opportunities.",

    url: PAGE_URL,

    siteName: "CareerVidya",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Top Online Universities in India - CareerVidya",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Top Online Universities in India | CareerVidya",

    description:
      "Explore top online universities and degree programs in India.",

    images: [OG_IMAGE],
  },
};

/* =========================================================
   GET UNIVERSITIES
========================================================= */

async function getUniversities() {
  try {
    const { ok, data } = await serverFetch(
      "/api/v1/university",
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!ok) {
      return [];
    }

    const universities = data?.data || [];

    return universities
      .filter((university) => university?.slug)
      .map((university) => ({
        ...university,

        universityImageUrl: resolveImageUrl(
          university.universityImage,
          "/fallback-logo.png"
        ),
      }));
  } catch (error) {
    console.error(
      "Failed to fetch universities:",
      error
    );

    return [];
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function Page() {
  const universities = await getUniversities();

  return (
    <main>
      {/* =====================================================
          SEO H1

          Only keep this if UniversityDetail does NOT already
          render an H1.
      ===================================================== */}

      <h1 className="sr-only">
        Top Online Universities in India
      </h1>

      <UniversityDetail
        initialUniversities={universities}
      />
    </main>
  );
}

