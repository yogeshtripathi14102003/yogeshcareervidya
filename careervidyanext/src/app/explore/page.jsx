import ExploreClient from "./ExploreClient";
import { serverFetch } from "@/utlis/serverFetch"; // ✅

export const metadata = {
  title: "Explore Professional Courses & Top Universities | CareerVidya",
  description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
};

async function getData() {
  try {
    const [courseRes, uniRes] = await Promise.all([
      serverFetch("/api/v1/course", { next: { revalidate: 3600 } }), // ✅
      serverFetch("/api/v1/university", { next: { revalidate: 3600 } }) // ✅
    ]);

    const coursesData = await courseRes.json();
    const uniData = await uniRes.json();

    return {
      initialCourses: coursesData?.courses || [],
      initialUnis: uniData?.data || []
    };
  } catch (error) {
    console.error("Explore fetch error:", error);
    return { initialCourses: [], initialUnis: [] };
  }
}

export default async function Page() {
  const data = await getData();
  return <ExploreClient initialData={data} />;
}