// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch } from "@/utlis/serverFetch";
// import { notFound } from "next/navigation";

// export const dynamic = "force-dynamic";

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
//       title: "University Not Found | CareerVidya",
//       robots: { index: false, follow: true },
//     };
//   }

//   return {
//     title: `${data.name} | CareerVidya`,
//     description: data.description?.replace(/<[^>]*>/g, "").substring(0, 150) || "Explore professional courses.",
//     alternates: {
//       canonical: `https://careervidya.in/university/${slug}`,
//     },
//   };
// }

import UniversityDetail from "@/app/university/UniversityDetail.jsx";
import { serverFetch } from "@/utlis/serverFetch";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUniversityData(slug) {
  const { ok, data } = await serverFetch(`/api/v1/university/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  // ✅ serverFetch already returns ok:false for non-2xx responses and for
  // network/timeout failures — no need to manually inspect res.headers
  // (res is no longer a raw Response object, so .headers doesn't exist).
  if (!ok) return null;

  return data?.data || null;
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getUniversityData(slug);

  // ✅ notFound() returns a real 404 status instead of a 200 OK page with
  // "University not found" text, which Google would otherwise treat as
  // a soft 404 (indexed as if it were valid content).
  if (!data) {
    notFound();
  }

  return <UniversityDetail initialData={data} />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getUniversityData(slug);

  if (!data) {
    return {
      // ✅ FIX: was "University Not Found | CareerVidya" — root layout.js
      // already has title.template: "%s | CareerVidya", which wraps every
      // page title automatically. Adding "| CareerVidya" here too produced
      // "University Not Found | CareerVidya | CareerVidya".
      title: "University Not Found",
      robots: { index: false, follow: true },
    };
  }

  return {
    // ✅ FIX: was `${data.name} | CareerVidya` — same double-suffix issue.
    // Confirmed live on /university/manipal-university-jaipur, which was
    // rendering "Manipal University Jaipur | CareerVidya | CareerVidya".
    // The root layout's title.template already appends "| CareerVidya" to
    // every page, so this just needs to be the bare university name.
    title: data.name,
    // ✅ Improved fallback: was a generic "Explore professional courses."
    // with no university name, which would be identical across every
    // university page that has no `data.description` — a duplicate-meta-
    // description risk. Now includes the university name.
    description:
      data.description?.replace(/<[^>]*>/g, "").substring(0, 150) ||
      `Explore ${data.name} courses, fees, eligibility criteria, and the admission process.`,
    alternates: {
      canonical: `https://careervidya.in/university/${slug}`,
    },
  };
}