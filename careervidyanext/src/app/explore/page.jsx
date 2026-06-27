// import ExploreClient from "./ExploreClient";
// import { serverFetch } from "@/utlis/serverFetch"; // ✅

// export const metadata = {
//   title: "Explore Professional Courses & Top Universities | CareerVidya",
//   description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
// };

// async function getData() {
//   try {
//     const [courseRes, uniRes] = await Promise.all([
//       serverFetch("/api/v1/course", { next: { revalidate: 3600 } }), // ✅
//       serverFetch("/api/v1/university", { next: { revalidate: 3600 } }) // ✅
//     ]);

//     const coursesData = await courseRes.json();
//     const uniData = await uniRes.json();

//     return {
//       initialCourses: coursesData?.courses || [],
//       initialUnis: uniData?.data || []
//     };
//   } catch (error) {
//     console.error("Explore fetch error:", error);
//     return { initialCourses: [], initialUnis: [] };
//   }
// }

// export default async function Page() {
//   const data = await getData();
//   return <ExploreClient initialData={data} />;
// }
import ExploreClient from "./ExploreClient";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

export const metadata = {
  title: "Explore Professional Courses & Top Universities | CareerVidya",
  description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
  alternates: {
    canonical: "https://careervidya.in/explore",
  },
};

async function getData() {
  const [courseResult, uniResult] = await Promise.all([
    serverFetch("/api/v1/course", { next: { revalidate: 3600 } }),
    serverFetch("/api/v1/university", { next: { revalidate: 3600 } }),
  ]);

  const initialCourses = courseResult.ok ? courseResult.data?.courses || [] : [];
  const rawUnis = uniResult.ok ? uniResult.data?.data || [] : [];

  // ✅ Resolve university image URLs here on the server — same pattern as
  // /topunivers — so ExploreClient never needs NEXT_PUBLIC_API_URL or its
  // own URL-building logic.
  const initialUnis = rawUnis.map((uni) => ({
    ...uni,
    universityImageUrl: resolveImageUrl(uni.universityImage, "/fallback-logo.png"),
  }));

  return { initialCourses, initialUnis };
}

export default async function Page() {
  const data = await getData();
  return <ExploreClient initialData={data} />;
}