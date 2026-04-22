import JobsClient from "@/app/career/JobsClient.jsx";

export const dynamic = "force-dynamic"; // ✅ build error fix

export const metadata = {
  title: "Career Opportunities at Careervidya | Join Our Team",
  description: "Explore the latest job openings at Careervidya. Accelerate your career with us.",
  alternates: { canonical: "https://careervidya.in/career" },
};

// ✅ SAFE FETCH FUNCTION
async function getJobs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/addjob`,
      {
        cache: "no-store", // ✅ important
      }
    );

    // ❌ API fail
    if (!res.ok) {
      console.error("API Error:", res.status);
      return [];
    }

    // 👇 direct json nahi, pehle text
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return data.data || data.jobs || data || [];
    } catch (err) {
      console.error("JSON Parse Error:", text); // 👈 yaha HTML dikhega
      return [];
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();
  return <JobsClient initialJobs={jobs} />;
}