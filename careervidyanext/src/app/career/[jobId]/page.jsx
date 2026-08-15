import { notFound } from "next/navigation";
import { serverFetch } from "@/utlis/serverFetch";
import JobDetailClient from "@/app/career/JobDetailClient.jsx";

async function getJobData(jobId) {
  const { ok, data } = await serverFetch(`/api/v1/addjob/${jobId}`, {
    next: { revalidate: 120 },
  });
  if (!ok) return null;
  return data?.data || null;
}

export async function generateMetadata({ params }) {
  const { jobId } = await params;
  const job = await getJobData(jobId);

  if (!job) {
    return {
      title: "Job Not Found",
      robots: { index: false, follow: true },
    };
  }

  const title = `${job.title} — Careers at CareerVidya`;
  const description =
    job.description?.slice(0, 155) ||
    `${job.title} opening at CareerVidya, ${job.location || ""}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://careervidya.in/career/${jobId}`,
    },
    openGraph: { title, description, type: "website" },
  };
}

export default async function JobDetailPage({ params }) {
  const { jobId } = await params;
  const job = await getJobData(jobId);

  if (!job) return notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description,
            datePosted: job.createdAt,
            employmentType: "FULL_TIME",
            hiringOrganization: {
              "@type": "Organization",
              name: "Career Vidya Edu-Tech Private Limited",
            },
            jobLocation: job.location
              ? {
                  "@type": "Place",
                  address: { "@type": "PostalAddress", addressLocality: job.location },
                }
              : undefined,
          }),
        }}
      />
      <JobDetailClient job={job} />
    </>
  );
}
