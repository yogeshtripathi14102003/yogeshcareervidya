import UniversityDetail from "@/app/university/UniversityDetail.jsx";
import { serverFetch } from "@/utlis/serverFetch"; // ✅

export const dynamic = "force-dynamic";

async function getUniversityData(slug) {
  try {
    const res = await serverFetch(`/api/v1/university/slug/${slug}`, { // ✅
      next: { revalidate: 60 }
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      return null;
    }

    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.error("Error fetching university data:", err);
    return null;
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getUniversityData(slug);

  if (!data) {
    return <div className="p-10 text-center text-black">University not found.</div>;
  }

  return <UniversityDetail initialData={data} />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getUniversityData(slug);

  return {
    title: data ? `${data.name} | CareerVidya` : "University | CareerVidya",
    description: data ? data.description?.substring(0, 150) : "Explore professional courses.",
    alternates: {
      canonical: `https://www.careervidya.in/university/${slug}`,
    },
  };
}