

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

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(
          `https://api.careervidya.in/api/v1/addjob/${jobId}`
        );

        if (!res.ok) {
          setError("Job not found");
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <Header />
        <div className="h-screen flex items-center justify-center text-xl font-semibold">
          Loading...
        </div>
      </>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <>
        <Header />
        <div className="h-screen flex items-center justify-center text-red-600 text-lg">
          {error}
        </div>
      </>
    );
  }

  /* ================= UI ================= */
  return (
    <>
      <Header />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

        {/* Modal */}
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative">

          {/* Close Button */}
          <button
            onClick={() => router.push("/career")}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg"
          >
            ✕
          </button>

          {/* Header */}
          <div className="bg-[#2B6CB0] text-white px-8 py-7">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
              {job?.title || "Job Title"}
            </h1>

            <div className="flex flex-wrap gap-6 mt-4 text-sm md:text-base opacity-90">
              <span className="flex items-center gap-2">
                👨‍💼 {job?.experience || "1-3 Years"}
              </span>

              <span className="flex items-center gap-2">
                📍 {job?.location || "Noida"}
              </span>

              <span className="flex items-center gap-2">
                💼 Full Time
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto text-gray-700">

            {/* Top Info + Apply Button */}
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">

              <div className="space-y-2 text-[15px] md:text-[16px] leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-900">Company:</span>{" "}
                  {job?.company || "Career Vidya Edu-Tech Private.Limited."}
                </p>

                <p>
                  <span className="font-semibold text-gray-900">Role:</span>{" "}
                  {job?.title}
                </p>

                <p>
                  <span className="font-semibold text-gray-900">Location:</span>{" "}
                  {job?.location}
                </p>

                <p>
                  <span className="font-semibold text-gray-900">Experience:</span>{" "}
                  {job?.experience}
                </p>
              </div>

              {/* Apply Button */}
              <Link href="/applynow">
                <button className=" bg-[#2B6CB0]    hover:bg-[#1E4E8C] text-white px-6 py-3 rounded-lg text-sm md:text-base font-medium shadow">
                  Apply for this Job
                </button>
              </Link>
            </div>

            {/* Description */}
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Job Description
            </h2>
            <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed mb-5">
              {job?.description}
            </p>

            {/* KRAs */}
            {job?.requirements?.length > 0 && (
              <>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  KRAs
                </h2>

                <ul className="list-disc ml-6 space-y-2 text-gray-600 text-[15px] md:text-[16px] leading-relaxed">
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