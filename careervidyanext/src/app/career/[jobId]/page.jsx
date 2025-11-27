"use client";
 import Link from "next/link";
import Header from "@/app/layout/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
         const res = await fetch(`https://api.careervidya.in/api/v1/addjob/${jobId}`);
            // const res = await fetch(`http://localhost:8080/api/v1/addjob/${jobId}`);

        if (!res.ok) {
          setError("Job not found");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setJob(data.data);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading)
    return <div className="p-10 text-center text-lg font-semibold">Loading...</div>;

  if (error)
    return <div className="p-10 text-center text-red-600 text-lg">{error}</div>;

  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto p-6">

      {/* Back Button */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => router.push("/career")}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          ← Back to Jobs
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">{job.title}</h1>

      {/* Emoji Pin */}
      <p className="text-2xl mb-6">📍</p>

      {/* Description Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {job.description}
        </p>
      </section>

      {/* Requirements */}
      {job.requirements?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Requirements</h2>

          <ul className="list-disc ml-5 text-gray-700 text-lg space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Apply Button */}
  <Link href="/applynow">
  <button className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
    Apply Now
  </button>
</Link>

    </div>
    </>
  );
}
