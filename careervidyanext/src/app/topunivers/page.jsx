import UniversitiesClient from "./UniversitiesClient";

export const metadata = {
  title: "Top Online Courses & Universities for Students & Working Professionals | CareerVidya",
  description: "Boost your career with UGC-recognized UG, PG, and Executive programs. Compare top universities, check fees, and enroll in job-oriented courses designed for working professionals.",
  keywords: [
    "online degrees for working professionals",
    "top universities for MBA and MCA",
    "UGC recognized online courses",
    "executive education programs india",
    "part time courses for professionals",
  
  ].join(", "),
};

async function getUniversities() {
  try {
    // Note: Direct URL use karein server-side fetch ke liye
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/university`, {
      next: { revalidate: 3600 } // Har 1 ghante mein data refresh hoga (SEO + Speed)
    });
    const data = await res.json();
    return data?.data || [];
  } catch (err) {
    console.error("Server Fetch Error:", err);
    return [];
  }
}

export default async function Page() {
  const initialData = await getUniversities();
  return <UniversitiesClient initialData={initialData} />;
}