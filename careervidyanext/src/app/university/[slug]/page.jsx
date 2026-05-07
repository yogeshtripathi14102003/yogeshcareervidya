import UniversityDetail from "@/app/university/UniversityDetail.jsx";

// यह लाइन सबसे ज़रूरी है ताकि बिल्ड के समय पेज क्रैश न हो
export const dynamic = "force-dynamic";

async function getUniversityData(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.careervidya.in";
  
  try {
    const res = await fetch(`${baseUrl}/api/v1/university/slug/${slug}`, {
      next: { revalidate: 60 }
    });

    // चेक करें कि रिस्पॉन्स JSON है या HTML एरर
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