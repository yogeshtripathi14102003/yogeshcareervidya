// import UniversitiesClient from "./UniversitiesClient";
// import { serverFetch } from "@/utlis/serverFetch";

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: "Top Online Courses & Universities for Students & Working Professionals | CareerVidya",
//   description: "Boost your career with UGC-recognized UG, PG, and Executive programs. Compare top universities, check fees, and enroll in job-oriented courses designed for working professionals.",
//   keywords: [
//     "online degrees for working professionals",
//     "top universities for MBA and MCA",
//     "UGC recognized online courses",
//     "executive education programs india",
//     "part time courses for professionals",
//   ].join(", "),
// };

// async function getUniversities() {
//   const { ok, data } = await serverFetch("/api/v1/university", {
//     next: { revalidate: 3600 },
//   });

//   // ✅ serverFetch already catches network/timeout errors internally and
//   // returns ok:false — no need for a separate try/catch here anymore.
//   if (!ok) return [];

//   return data?.data || [];
// }

// export default async function Page() {
//   const initialData = await getUniversities();
//   return <UniversitiesClient initialData={initialData} />;
// }




import UniversitiesClient from "./UniversitiesClient";
import { serverFetch } from "@/utlis/serverFetch";

export const revalidate = 3600;

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
    canonical: "/universities",
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
    url: "https://careervidya.in/universities",
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
        url: slug
          ? `https://careervidya.in/universities/${slug}`
          : "https://careervidya.in/universities",
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