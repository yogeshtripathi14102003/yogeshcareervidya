"use client";
import Link from "next/link";
import Header from "@/app/layout/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.jobId;
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;

    async function fetchJob() {
      try {
        setLoading(true);
        const res = await fetch(`https://api.careervidya.in/api/v1/addjob/${jobId}`);

        if (!res.ok) throw new Error("Job details could not be loaded.");

        const data = await res.json();
        setJob(data.data || data); // Adjust according to your API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  if (loading) return <div className="h-screen flex items-center justify-center text-lg">Loading job details...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-600 text-lg">{error}</div>;

  return (
    <>
      <Header />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
          
          {/* Close Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 w-9 h-9 rounded-full flex items-center justify-center z-10"
          >
            ✕
          </button>

          {/* Header */}
          <div className="bg-[#2B6CB0] text-white px-8 py-7 flex-shrink-0">
            <h1 className="text-3xl font-semibold">{job?.title || "Job Title"}</h1>
            <div className="flex flex-wrap gap-6 mt-4 text-sm opacity-90">
              <span>👨‍💼 {job?.experience || "Not specified"}</span>
              <span>📍 {job?.location || "Noida"}</span>
              <span>💼 Full Time</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
              <div className="space-y-2 text-[16px] text-gray-700">
                <p><span className="font-semibold text-gray-900">Company:</span> {job?.company || "Career Vidya"}</p>
                <p><span className="font-semibold text-gray-900">Role:</span> {job?.title}</p>
                <p><span className="font-semibold text-gray-900">Salary:</span> ₹{job?.salaryRange || "Competitive"}</p>
              </div>
              <Link href="/applynow">
                <button className="bg-[#2B6CB0] hover:bg-[#1E4E8C] text-white px-6 py-3 rounded-lg font-medium shadow transition-all">
                  Apply for this Job
                </button>
              </Link>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Description</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{job?.description}</p>

            {Array.isArray(job?.requirements) && job.requirements.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Key Responsibilities (KRAs)</h2>
                <ul className="list-disc ml-6 space-y-2 text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}