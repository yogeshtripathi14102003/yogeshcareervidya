


// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

// /* =========================================================
//    PAGE CONFIG
// ========================================================= */

// export const revalidate = 3600;

// const SITE_URL = "https://careervidya.in";
// const PAGE_URL = `${SITE_URL}/university`;

// const OG_IMAGE = `${SITE_URL}/images/universities-og.jpg`;

// /* =========================================================
//    SEO METADATA
// ========================================================= */

// export const metadata = {
//   title: "Top Online Universities in India | CareerVidya",

//   description:
//     "Explore top UGC-recognized online universities in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career opportunities.",

//   alternates: {
//     canonical: PAGE_URL,
//   },

//   robots: {
//     index: true,
//     follow: true,
//   },

//   openGraph: {
//     title: "Top Online Universities in India | CareerVidya",

//     description:
//       "Explore top UGC-recognized online universities in India. Compare online courses, fees, eligibility, duration, and career opportunities.",

//     url: PAGE_URL,

//     siteName: "CareerVidya",

//     locale: "en_IN",

//     type: "website",

//     images: [
//       {
//         url: OG_IMAGE,
//         width: 1200,
//         height: 630,
//         alt: "Top Online Universities in India - CareerVidya",
//       },
//     ],
//   },

//   twitter: {
//     card: "summary_large_image",

//     title: "Top Online Universities in India | CareerVidya",

//     description:
//       "Explore top online universities and degree programs in India.",

//     images: [OG_IMAGE],
//   },
// };

// /* =========================================================
//    GET UNIVERSITIES
// ========================================================= */

// async function getUniversities() {
//   try {
//     const { ok, data } = await serverFetch(
//       "/api/v1/university",
//       {
//         next: {
//           revalidate: 3600,
//         },
//       }
//     );

//     if (!ok) {
//       return [];
//     }

//     const universities = data?.data || [];

//     return universities
//       .filter((university) => university?.slug)
//       .map((university) => ({
//         ...university,

//         universityImageUrl: resolveImageUrl(
//           university.universityImage,
//           "/fallback-logo.png"
//         ),
//       }));
//   } catch (error) {
//     console.error(
//       "Failed to fetch universities:",
//       error
//     );

//     return [];
//   }
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default async function Page() {
//   const universities = await getUniversities();

//   return (
//     <main>
//       {/* =====================================================
//           SEO H1

//           Only keep this if UniversityDetail does NOT already
//           render an H1.
//       ===================================================== */}

//       <h1 className="sr-only">
//         Top Online Universities in India
//       </h1>

//       <UniversityDetail
//         initialUniversities={universities}
//       />
//     </main>
//   );
// }


import UniversityList from "@/app/university/UniversityList.jsx"; // ✅ New component
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
    metadataBase: new URL(SITE_URL),  // ✅ Added

    title: "Top Online Universities in India 2025 | CareerVidya",

    description:
        "Explore top UGC-recognized online universities in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career opportunities.",

    // ✅ Added keywords
    keywords: [
        "top online universities in India",
        "UGC recognized online universities",
        "online degree programs",
        "best online MBA universities",
        "online MCA",
        "online BBA",
        "online BCA",
        "online education India",
        "distance education universities",
        "CareerVidya universities",
    ],

    alternates: {
        canonical: PAGE_URL,
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    openGraph: {
        title: "Top Online Universities in India 2025 | CareerVidya",
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
        title: "Top Online Universities in India 2025 | CareerVidya",
        description:
            "Explore top online universities and degree programs in India.",
        images: [OG_IMAGE],
    },

    authors: [{ name: "CareerVidya" }],
    publisher: "CareerVidya",
    category: "Education",
};

/* =========================================================
   GET UNIVERSITIES
========================================================= */

async function getUniversities() {
    try {
        const { ok, data } = await serverFetch("/api/v1/university", {
            next: { revalidate: 3600 },
        });

        if (!ok) return [];

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
        console.error("Failed to fetch universities:", error);
        return [];
    }
}

/* =========================================================
   PAGE
========================================================= */

export default async function Page() {
    const universities = await getUniversities();

    // =====================================================
    // ✅ SEO SCHEMAS
    // =====================================================

    // ---------- Breadcrumb Schema ----------
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Universities",
                item: PAGE_URL,
            },
        ],
    };

    // ---------- ItemList Schema (Universities Listing) ----------
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Top Online Universities in India",
        description:
            "List of top UGC-recognized online universities in India offering various online degree programs.",
        numberOfItems: universities.length,
        itemListElement: universities.map((uni, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "EducationalOrganization",
                name: uni.name,
                url: `${SITE_URL}/university/${uni.slug}`,
                logo: uni.universityImageUrl,
            },
        })),
    };

    return (
        <main>
            {/* ✅ SEO SCHEMAS */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(itemListSchema),
                }}
            />

            {/* ✅ H1 for SEO */}
            <h1 className="sr-only">
                Top Online Universities in India
            </h1>

            {/* ✅ Fixed: Alag listing component use karo */}
            <UniversityList universities={universities} />
        </main>
    );
}