
import JobsClient from "@/app/career/JobsClient.jsx";

export const metadata = {
  title: "Career Opportunities at Careervidya | Join Our Team",
  description: "Explore the latest job openings at Careervidya. Accelerate your career with us.",
  alternates: { canonical: "https://careervidya.in/career" },
};

async function getJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/addjob`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return data.data || data.jobs || data || [];
}

export default async function JobsPage() {
  const jobs = await getJobs();
  return <JobsClient initialJobs={jobs} />;
}