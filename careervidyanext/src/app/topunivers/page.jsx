




// import UniversitiesClient from "./UniversitiesClient";
// import { serverFetch } from "@/utlis/serverFetch";

// export const revalidate = 3600;

// export const metadata = {
//   metadataBase: new URL("https://careervidya.in"),

//   title: {
//     default:
//       "Top Online Universities & Courses in India | CareerVidya",
//     template: "%s | CareerVidya",
//   },

//   description:
//     "Explore top UGC-recognized online universities and degree programs in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career options for students and working professionals.",

//   keywords: [
//     "top online universities in India",
//     "best online universities in India",
//     "online universities for working professionals",
//     "UGC approved online universities",
//     "UGC recognized online courses",
//     "online degree courses in India",
//     "online MBA universities",
//     "online MCA universities",
//     "online BBA universities",
//     "online BCA universities",
//     "online MCom universities",
//     "online courses for working professionals",
//     "best online degree programs",
//     "online education India",
//   ],

//   alternates: {
//     canonical: "/universities",
//   },

//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//       "max-video-preview": -1,
//     },
//   },

//   openGraph: {
//     type: "website",
//     locale: "en_IN",
//     url: "https://careervidya.in/universities",
//     siteName: "CareerVidya",
//     title:
//       "Top Online Universities & Courses in India | CareerVidya",
//     description:
//       "Compare top UGC-recognized online universities and degree programs in India. Explore MBA, MCA, BBA, BCA, M.Com and other career-focused online courses in india.",
//     images: [
//       {
//         url: "/images/universities-og.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Top Online Universities and Courses in India - CareerVidya",
//       },
//     ],
//   },

//   twitter: {
//     card: "summary_large_image",
//     title:
//       "Top Online Universities & Courses in India | CareerVidya",
//     description:
//       "Explore UGC-recognized online universities, courses, fees, eligibility and career opportunities for students and working professionals.",
//     images: ["/images/universities-og.jpg"],
//   },

//   category: "Education",
// };

// async function getUniversities() {
//   const { ok, data } = await serverFetch("/api/v1/university", {
//     next: {
//       revalidate: 3600,
//       tags: ["universities"],
//     },
//   });

//   if (!ok) {
//     return [];
//   }

//   return data?.data || [];
// }

// function generateUniversitySchema(universities) {
//   const items = universities
//     .filter((university) => university)
//     .slice(0, 100)
//     .map((university, index) => {
//       const name =
//         university.name ||
//         university.universityName ||
//         university.title ||
//         "Online University";

//       const description =
//         university.description ||
//         university.shortDescription ||
//         `Explore online degree programs and courses offered by ${name}.`;

//       const slug =
//         university.slug ||
//         university.universitySlug ||
//         university._id;

//       return {
//         "@type": "ListItem",
//         position: index + 1,
//         name,
//         description,
//         url: slug
//           ? `https://careervidya.in/universities/${slug}`
//           : "https://careervidya.in/universities",
//       };
//     });

//   return {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Top Online Universities in India",
//     description:
//       "List of top online universities and degree programs available for students and working professionals.",
//     numberOfItems: items.length,
//     itemListElement: items,
//   };
// }

// export default async function Page() {
//   const initialData = await getUniversities();

//   const schema = generateUniversitySchema(initialData);

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(schema),
//         }}
//       />

//       <main>
//         <UniversitiesClient initialData={initialData} />
//       </main>
//     </>
//   );
// }


import UniversitiesClient from "./UniversitiesClient";
import { serverFetch } from "@/utlis/serverFetch";

export const revalidate = 3600;

// ✅ SEO FIX: this page's canonical, openGraph.url, and JSON-LD schema URLs
// were all hardcoded to "/universities" — a DIFFERENT URL than the one this
// page actually serves. UniversitiesClient.jsx imports
// `@/app/topunivers/Comparenow.jsx`, confirming this page physically lives
// at /topunivers. A canonical tag should self-reference the page's own URL
// (unless intentionally consolidating a real duplicate page onto another) —
// pointing it at a URL that may not even exist tells Google "don't index
// me, index this other page instead," which can suppress this page from
// search results entirely by mistake.
const PAGE_URL = "https://careervidya.in/topunivers";

export const metadata = {
  metadataBase: new URL("https://careervidya.in"),

  title: {
    default:
      "Top Online Universities & Courses in India | CareerVidya",
    template: "%s | CareerVidya",
  },

  description:
    "Explore top UGC-recognized online universities and degree programs in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career options for students and working professionals.",

  keywords: [
    "top online universities in India",
    "best online universities in India",
    "online universities for working professionals",
    "UGC approved online universities",
    "UGC recognized online courses",
    "online degree courses in India",
    "online MBA universities",
    "online MCA universities",
    "online BBA universities",
    "online BCA universities",
    "online MCom universities",
    "online courses for working professionals",
    "best online degree programs",
    "online education India",
  ],

  alternates: {
    // ✅ FIX: was "/universities" — now correctly self-references this
    // page's real URL.
    canonical: "/topunivers",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    // ✅ FIX: was "https://careervidya.in/universities".
    url: PAGE_URL,
    siteName: "CareerVidya",
    title:
      "Top Online Universities & Courses in India | CareerVidya",
    description:
      "Compare top UGC-recognized online universities and degree programs in India. Explore MBA, MCA, BBA, BCA, M.Com and other career-focused online courses in india.",
    images: [
      {
        url: "/images/universities-og.jpg",
        width: 1200,
        height: 630,
        alt: "Top Online Universities and Courses in India - CareerVidya",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Top Online Universities & Courses in India | CareerVidya",
    description:
      "Explore UGC-recognized online universities, courses, fees, eligibility and career opportunities for students and working professionals.",
    images: ["/images/universities-og.jpg"],
  },

  category: "Education",
};

async function getUniversities() {
  const { ok, data } = await serverFetch("/api/v1/university", {
    next: {
      revalidate: 3600,
      tags: ["universities"],
    },
  });

  if (!ok) {
    return [];
  }

  return data?.data || [];
}

function generateUniversitySchema(universities) {
  const items = universities
    .filter((university) => university)
    .slice(0, 100)
    .map((university, index) => {
      const name =
        university.name ||
        university.universityName ||
        university.title ||
        "Online University";

      const description =
        university.description ||
        university.shortDescription ||
        `Explore online degree programs and courses offered by ${name}.`;

      const slug =
        university.slug ||
        university.universitySlug ||
        university._id;

      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        description,
        // ✅ FIX: was `https://careervidya.in/universities/${slug}` — but
        // the real single-university detail page route is
        // /university/[slug] (singular, confirmed by the generateMetadata
        // canonical in that page: `https://careervidya.in/university/${slug}`).
        // The old URLs here pointed to pages that don't exist, which is
        // exactly the kind of thing that gets structured data flagged or
        // ignored by Google.
        url: slug
          ? `https://careervidya.in/university/${slug}`
          : PAGE_URL,
      };
    });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Online Universities in India",
    description:
      "List of top online universities and degree programs available for students and working professionals.",
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export default async function Page() {
  const initialData = await getUniversities();

  const schema = generateUniversitySchema(initialData);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main>
        <UniversitiesClient initialData={initialData} />
      </main>
    </>
  );
}