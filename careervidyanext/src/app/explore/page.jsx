import ExploreClient from "./ExploreClient";

export const metadata = {
  title: "Explore Professional Courses & Top Universities | CareerVidya",
  description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
};

async function getData() {
  try {
    const [courseRes, uniRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course`, { next: { revalidate: 3600 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/university`, { next: { revalidate: 3600 } })
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