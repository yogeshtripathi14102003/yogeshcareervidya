// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch } from "@/utlis/serverFetch"; // ✅

// export const dynamic = "force-dynamic";

// async function getUniversityData(slug) {
//   try {
//     const res = await serverFetch(`/api/v1/university/slug/${slug}`, { // ✅
//       next: { revalidate: 60 }
//     });

//     const contentType = res.headers.get("content-type");
//     if (!res.ok || !contentType || !contentType.includes("application/json")) {
//       return null;
//     }

//     const data = await res.json();
//     return data?.data || null;
//   } catch (err) {
//     console.error("Error fetching university data:", err);
//     return null;
//   }
// }

// export default async function Page({ params }) {
//   const { slug } = await params;
//   const data = await getUniversityData(slug);

//   if (!data) {
//     return <div className="p-10 text-center text-black">University not found.</div>;
//   }

//   return <UniversityDetail initialData={data} />;
// }

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const data = await getUniversityData(slug);

//   return {
//     title: data ? `${data.name} | CareerVidya` : "University | CareerVidya",
//     description: data ? data.description?.substring(0, 150) : "Explore professional courses.",
//     alternates: {
//       canonical: `https://www.careervidya.in/university/${slug}`,
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
      title: "University Not Found | CareerVidya",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${data.name} | CareerVidya`,
    description: data.description?.replace(/<[^>]*>/g, "").substring(0, 150) || "Explore professional courses.",
    alternates: {
      canonical: `https://careervidya.in/university/${slug}`,
    },
  };
}