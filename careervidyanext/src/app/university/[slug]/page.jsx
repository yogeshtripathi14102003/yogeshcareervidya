

               
import UniversityDetail from "@/app/university/UniversityDetail.jsx"; // अपने पाथ के अनुसार यहाँ सही रखें

async function getUniversityData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/university/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.error("Error fetching university data:", err);
    return null;
  }
}

export default async function Page({ params }) {
  // ✅ Next.js 15+ के लिए params को await करना अनिवार्य है
  const { slug } = await params;
  
  const data = await getUniversityData(slug);

  // यदि डेटा नहीं मिलता है, तो आप यहाँ एक हैंडलिंग जोड़ सकते हैं
  if (!data) {
    return <div className="p-10 text-center text-black">University not found.</div>;
  }

  return <UniversityDetail initialData={data} />;
}

// यह फंक्शन Google सर्च में सही Title और Description दिखाएगा
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getUniversityData(slug); // वही फंक्शन जो आपने बनाया था

  return {
    title: data ? `${data.name} | CareerVidya` : "University | CareerVidya",
    description: data ? data.description?.substring(0, 150) : "Explore professional courses.",
    alternates: {
      canonical: `https://www.careervidya.in/university/${slug}`,
    },
  };
}