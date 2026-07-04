import JobsClient from "@/app/career/JobsClient.jsx";
import { serverFetch } from "@/utlis/serverFetch.js"; // 👈 adjust this path to wherever serverFetch.js actually lives

export const dynamic = "force-dynamic"; // ✅ build error fix

export const metadata = {
  title: "Career Opportunities at Careervidya | Join Our Team",
  description:
    "Explore the latest job openings at Careervidya. Accelerate your career with us.",
  alternates: { canonical: "https://careervidya.in/career" },
};

// ✅ Uses the shared serverFetch utility so error handling,
// timeout, and env var checks are all centralized in one place.
async function getJobs() {
  const result = await serverFetch("/api/v1/addjob");

  if (!result.ok) {
    console.error("getJobs: failed to load jobs", result.status);
    return [];
  }

  const data = result.data;
  // Handles whichever shape the backend actually returns
  return data?.data || data?.jobs || (Array.isArray(data) ? data : []);
}

export default async function JobsPage() {
  const jobs = await getJobs();
  return <JobsClient initialJobs={jobs} />;
}