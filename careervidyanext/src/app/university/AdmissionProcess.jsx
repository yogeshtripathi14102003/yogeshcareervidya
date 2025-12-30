"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import { CheckCircle } from "lucide-react";

export default function AdmissionProcess({ slug }) {
  const [admission, setAdmission] = useState({
    admissionHeading: "Admission Process",
    admissionSubHeading: "",
    admissionDescription: "",
    admissionPoints: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/university/slug/${slug}`);
        setAdmission(res.data?.data?.admission || {});
      } catch (err) {
        console.error(err);
        setError("Failed to load admission details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="text-center py-16 text-blue-600 font-medium">
        Loading admission process...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        {error}
      </div>
    );

  if (!admission?.admissionPoints?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
      {/* Heading */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {admission.admissionHeading}
        </h2>

        {admission.admissionSubHeading && (
          <p className="text-xl text-gray-700 mb-3">
            {admission.admissionSubHeading}
          </p>
        )}

        {admission.admissionDescription && (
          <p className="text-gray-600 leading-relaxed max-w-4xl">
            {admission.admissionDescription}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="grid gap-6">
        {admission.admissionPoints.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Step Number */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
              {index + 1}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-gray-800 text-lg leading-relaxed">
                {point}
              </p>
            </div>

            {/* Icon */}
            <CheckCircle className="text-green-500 mt-1" size={22} />
          </div>
        ))}
      </div>
    </section>
  );
}
