


// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch } from "@/utlis/serverFetch";
// import { notFound } from "next/navigation";

// /* =========================================================
//    PAGE CONFIG
// ========================================================= */

// export const revalidate = 90;

// const SITE_URL = "https://careervidya.in";

// /* =========================================================
//    GET UNIVERSITY
// ========================================================= */

// async function getUniversityData(slug) {
//   try {
//     const { ok, data } = await serverFetch(
//       `/api/v1/university/slug/${encodeURIComponent(slug)}`,
//       {
//         next: {
//           revalidate: 90,
//         },
//       }
//     );

//     if (!ok) {
//       return null;
//     }

//     return data?.data || null;
//   } catch (error) {
//     console.error("Failed to fetch university:", error);

//     return null;
//   }
// }

// /* =========================================================
//    GENERATE STATIC PARAMS
//    ---------------------------------------------------------
//    IMPORTANT FIX: Without this function, Next.js has no way of
//    knowing which university slugs exist at build time. That
//    forces every /university/[slug] page to render dynamically
//    on each request instead of being pre-built as a static page
//    — which is exactly what was causing <title>, canonical, and
//    meta tags to stream into <body> instead of <head> (the SEO
//    issue flagged by Screaming Frog).

//    Adding this tells Next.js all known slugs upfront, so it can
//    pre-render (SSG) each university page at build time, and
//    refresh them periodically via ISR (revalidate: 60 above).

//    NOTE: This reuses the same "/api/v1/university" endpoint
//    already used elsewhere in the app (e.g. the /university and
//    /explore listing pages) — adjust the path/limit if your API
//    needs a different query for the full list.
// ========================================================= */
// export async function generateStaticParams() {
//   const { ok, data } = await serverFetch("/api/v1/university");

//   if (!ok) return [];

//   const universities = data?.data || [];

//   return universities
//     .filter((u) => u?.slug)
//     .map((u) => ({ slug: u.slug }));
// }

// /* =========================================================
//    METADATA
// ========================================================= */

// export async function generateMetadata({ params }) {
//   const { slug } = await params;

//   const data = await getUniversityData(slug);

//   /* ---------------------------------------------------------
//      UNIVERSITY NOT FOUND
//   --------------------------------------------------------- */

//   if (!data) {
//     return {
//       title: "University Not Found",

//       robots: {
//         index: false,
//         follow: true,
//       },
//     };
//   }

//   /* ---------------------------------------------------------
//      CLEAN DESCRIPTION
//   --------------------------------------------------------- */

//   const cleanDescription =
//     data?.description
//       ?.replace(/<[^>]*>/g, "")
//       ?.replace(/\s+/g, " ")
//       ?.trim()
//       ?.substring(0, 155) ||
//     `Explore ${data.name} courses, fees, eligibility, admission process, and career opportunities.`;

//   /* ---------------------------------------------------------
//      CANONICAL
//   --------------------------------------------------------- */

//   const canonicalUrl =
//     `${SITE_URL}/university/${encodeURIComponent(slug)}`;

//   /* ---------------------------------------------------------
//      UNIVERSITY IMAGE
//   --------------------------------------------------------- */

//   let ogImage = `${SITE_URL}/images/universities-og.jpg`;

//   if (data?.universityImage) {
//     if (data.universityImage.startsWith("http")) {
//       ogImage = data.universityImage;
//     } else {
//       ogImage =
//         `${SITE_URL}${
//           data.universityImage.startsWith("/")
//             ? ""
//             : "/"
//         }${data.universityImage}`;
//     }
//   }

//   /* ---------------------------------------------------------
//      METADATA
//   --------------------------------------------------------- */

//   return {
//     title: data.name,

//     description: cleanDescription,

//     alternates: {
//       canonical: canonicalUrl,
//     },

//     robots: {
//       index: true,
//       follow: true,
//     },

//     openGraph: {
//       title: data.name,

//       description: cleanDescription,

//       url: canonicalUrl,

//       siteName: "CareerVidya",

//       locale: "en_IN",

//       type: "website",

//       images: [
//         {
//           url: ogImage,
//           width: 1200,
//           height: 630,
//           alt: `${data.name} - CareerVidya`,
//         },
//       ],
//     },

//     twitter: {
//       card: "summary_large_image",

//       title: data.name,

//       description: cleanDescription,

//       images: [ogImage],
//     },
//   };
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default async function Page({ params }) {
//   const { slug } = await params;

//   const data = await getUniversityData(slug);

//   /*
//    * IMPORTANT:
//    * Invalid/deleted university should return a real 404.
//    */

//   if (!data) {
//     notFound();
//   }

//   return <UniversityDetail initialData={data} />;
// }

import UniversityDetail from "@/app/university/UniversityDetail.jsx";
import { serverFetch } from "@/utlis/serverFetch";
import { notFound } from "next/navigation";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const revalidate = 90;
export const dynamicParams = true; // ✅ New slugs bhi render honge

const SITE_URL = "https://careervidya.in";

/* =========================================================
   GET UNIVERSITY
========================================================= */

async function getUniversityData(slug) {
    try {
        const { ok, data } = await serverFetch(
            `/api/v1/university/slug/${encodeURIComponent(slug)}`,
            {
                next: {
                    revalidate: 90,
                },
            }
        );

        if (!ok) return null;

        return data?.data || null;
    } catch (error) {
        console.error("Failed to fetch university:", error);
        return null;
    }
}

/* =========================================================
   GENERATE STATIC PARAMS (SSG)
========================================================= */

export async function generateStaticParams() {
    try {
        const { ok, data } = await serverFetch("/api/v1/university");

        if (!ok) return [];

        const universities = data?.data || [];

        return universities
            .filter((u) => u?.slug)
            .map((u) => ({ slug: u.slug }));
    } catch (error) {
        console.error("generateStaticParams error:", error);
        return [];
    }
}

/* =========================================================
   METADATA (Dynamic)
========================================================= */

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const data = await getUniversityData(slug);

    /* ---------- UNIVERSITY NOT FOUND ---------- */
    if (!data) {
        return {
            title: "University Not Found | CareerVidya",
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    /* ---------- CLEAN DESCRIPTION ---------- */
    const cleanDescription =
        data?.description
            ?.replace(/<[^>]*>/g, "")
            ?.replace(/\s+/g, " ")
            ?.trim()
            ?.substring(0, 155) ||
        `Explore ${data.name} online courses, fees, eligibility, admission process, and career opportunities. Apply now through CareerVidya.`;

    /* ---------- CANONICAL ---------- */
    const canonicalUrl = `${SITE_URL}/university/${encodeURIComponent(slug)}`;

    /* ---------- OG IMAGE ---------- */
    let ogImage = `${SITE_URL}/images/universities-og.jpg`;

    if (data?.universityImage) {
        if (data.universityImage.startsWith("http")) {
            ogImage = data.universityImage;
        } else {
            ogImage = `${SITE_URL}${
                data.universityImage.startsWith("/") ? "" : "/"
            }${data.universityImage}`;
        }
    }

    /* ---------- SEO TITLE ---------- */
    const seoTitle = `${data.name} Online Admission 2026 | Courses, Fees, Eligibility | CareerVidya`;

    /* ---------- METADATA ---------- */
    return {
        // ✅ metadataBase for absolute URLs
        metadataBase: new URL(SITE_URL),

        title: seoTitle,
        description: cleanDescription,

        // ✅ Keywords
        keywords: [
            data.name,
            `${data.name} online`,
            `${data.name} admission`,
            `${data.name} courses`,
            `${data.name} fees`,
            `${data.name} eligibility`,
            `${data.name} online degree`,
            "online degree programs",
            "UGC recognized university",
            "distance education",
            "online MBA",
            "online MCA",
            "online BBA",
            "online BCA",
        ],

        alternates: {
            canonical: canonicalUrl,
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
            title: seoTitle,
            description: cleanDescription,
            url: canonicalUrl,
            siteName: "CareerVidya",
            locale: "en_IN",
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${data.name} - Online Programs | CareerVidya`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: cleanDescription,
            images: [ogImage],
        },

        // ✅ Additional SEO
        authors: [{ name: "CareerVidya" }],
        publisher: "CareerVidya",
        category: "Education",

        // ✅ Format detection
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
    };
}

/* =========================================================
   PAGE
========================================================= */

export default async function Page({ params }) {
    const { slug } = await params;
    const data = await getUniversityData(slug);

    // Invalid/deleted university → 404
    if (!data) {
        notFound();
    }

    return <UniversityDetail initialData={data} />;
}