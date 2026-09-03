

// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch } from "@/utlis/serverFetch";
// import { notFound } from "next/navigation";

// // ✅ SEO FIX: was `export const dynamic = "force-dynamic"`, which forces a
// // full server re-render on every request with no caching — even though the
// // fetch below already uses `revalidate: 60`. Removed in favor of ISR so
// // Next.js can serve a cached page and regenerate it in the background.
// export const revalidate = 60;

// async function getUniversityData(slug) {
//   const { ok, data } = await serverFetch(`/api/v1/university/slug/${slug}`, {
//     next: { revalidate: 60 },
//   });

//   // ✅ serverFetch already returns ok:false for non-2xx responses and for
//   // network/timeout failures — no need to manually inspect res.headers
//   // (res is no longer a raw Response object, so .headers doesn't exist).
//   if (!ok) return null;

//   return data?.data || null;
// }

// export default async function Page({ params }) {
//   const { slug } = await params;
//   const data = await getUniversityData(slug);

//   // ✅ notFound() returns a real 404 status instead of a 200 OK page with
//   // "University not found" text, which Google would otherwise treat as
//   // a soft 404 (indexed as if it were valid content).
//   if (!data) {
//     notFound();
//   }

//   return <UniversityDetail initialData={data} />;
// }

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const data = await getUniversityData(slug);

//   if (!data) {
//     return {
//       // ✅ FIX: was "University Not Found | CareerVidya" — root layout.js
//       // already has title.template: "%s | CareerVidya", which wraps every
//       // page title automatically. Adding "| CareerVidya" here too produced
//       // "University Not Found | CareerVidya | CareerVidya".
//       title: "University Not Found",
//       robots: { index: false, follow: true },
//     };
//   }

//   const cleanDescription =
//     data.description?.replace(/<[^>]*>/g, "").substring(0, 150) ||
//     `Explore ${data.name} courses, fees, eligibility criteria, and the admission process.`;

//   const canonicalUrl = `https://careervidya.in/university/${slug}`;
//   const ogImage = data.universityImage?.startsWith("http")
//     ? data.universityImage
//     : `https://careervidya.in${data.universityImage?.startsWith("/") ? "" : "/"}${data.universityImage || "images/universities-og.jpg"}`;

//   return {
//     // ✅ FIX: was `${data.name} | CareerVidya` — same double-suffix issue.
//     // Confirmed live on /university/manipal-university-jaipur, which was
//     // rendering "Manipal University Jaipur | CareerVidya | CareerVidya".
//     // The root layout's title.template already appends "| CareerVidya" to
//     // every page, so this just needs to be the bare university name.
//     title: data.name,
//     // ✅ Improved fallback: was a generic "Explore professional courses."
//     // with no university name, which would be identical across every
//     // university page that has no `data.description` — a duplicate-meta-
//     // description risk. Now includes the university name.
//     description: cleanDescription,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     // ✅ SEO FIX: openGraph/twitter were missing entirely on this page —
//     // meaning every individual university page (this template covers all
//     // of them) fell back to generic/blank previews when shared on
//     // WhatsApp, LinkedIn, Facebook, Twitter/X. /universities (the listing
//     // page) already has these; added here for consistency across the site.
//     openGraph: {
//       title: data.name,
//       description: cleanDescription,
//       url: canonicalUrl,
//       siteName: "CareerVidya",
//       images: [
//         {
//           url: ogImage,
//           width: 1200,
//           height: 630,
//           alt: `${data.name} - CareerVidya`,
//         },
//       ],
//       locale: "en_IN",
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: data.name,
//       description: cleanDescription,
//       images: [ogImage],
//     },
//   };
// }



import UniversityDetail from "@/app/university/UniversityDetail.jsx";
import { serverFetch } from "@/utlis/serverFetch";
import { notFound } from "next/navigation";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const revalidate = 90;

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

    if (!ok) {
      return null;
    }

    return data?.data || null;
  } catch (error) {
    console.error("Failed to fetch university:", error);

    return null;
  }
}

/* =========================================================
   GENERATE STATIC PARAMS
   ---------------------------------------------------------
   IMPORTANT FIX: Without this function, Next.js has no way of
   knowing which university slugs exist at build time. That
   forces every /university/[slug] page to render dynamically
   on each request instead of being pre-built as a static page
   — which is exactly what was causing <title>, canonical, and
   meta tags to stream into <body> instead of <head> (the SEO
   issue flagged by Screaming Frog).

   Adding this tells Next.js all known slugs upfront, so it can
   pre-render (SSG) each university page at build time, and
   refresh them periodically via ISR (revalidate: 60 above).

   NOTE: This reuses the same "/api/v1/university" endpoint
   already used elsewhere in the app (e.g. the /university and
   /explore listing pages) — adjust the path/limit if your API
   needs a different query for the full list.
========================================================= */
export async function generateStaticParams() {
  const { ok, data } = await serverFetch("/api/v1/university");

  if (!ok) return [];

  const universities = data?.data || [];

  return universities
    .filter((u) => u?.slug)
    .map((u) => ({ slug: u.slug }));
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const data = await getUniversityData(slug);

  /* ---------------------------------------------------------
     UNIVERSITY NOT FOUND
  --------------------------------------------------------- */

  if (!data) {
    return {
      title: "University Not Found",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  /* ---------------------------------------------------------
     CLEAN DESCRIPTION
  --------------------------------------------------------- */

  const cleanDescription =
    data?.description
      ?.replace(/<[^>]*>/g, "")
      ?.replace(/\s+/g, " ")
      ?.trim()
      ?.substring(0, 155) ||
    `Explore ${data.name} courses, fees, eligibility, admission process, and career opportunities.`;

  /* ---------------------------------------------------------
     CANONICAL
  --------------------------------------------------------- */

  const canonicalUrl =
    `${SITE_URL}/university/${encodeURIComponent(slug)}`;

  /* ---------------------------------------------------------
     UNIVERSITY IMAGE
  --------------------------------------------------------- */

  let ogImage = `${SITE_URL}/images/universities-og.jpg`;

  if (data?.universityImage) {
    if (data.universityImage.startsWith("http")) {
      ogImage = data.universityImage;
    } else {
      ogImage =
        `${SITE_URL}${
          data.universityImage.startsWith("/")
            ? ""
            : "/"
        }${data.universityImage}`;
    }
  }

  /* ---------------------------------------------------------
     METADATA
  --------------------------------------------------------- */

  return {
    title: data.name,

    description: cleanDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: data.name,

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
          alt: `${data.name} - CareerVidya`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: data.name,

      description: cleanDescription,

      images: [ogImage],
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function Page({ params }) {
  const { slug } = await params;

  const data = await getUniversityData(slug);

  /*
   * IMPORTANT:
   * Invalid/deleted university should return a real 404.
   */

  if (!data) {
    notFound();
  }

  return <UniversityDetail initialData={data} />;
}