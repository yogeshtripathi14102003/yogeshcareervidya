"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";

export default function OnlineExamPattern({ slug }) {
  const [data, setData] = useState({
    universityName: "",
    shareDescription: "",
    cardDescription: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/university/slug/${slug}`);

        setData({
          universityName: res.data?.data?.name || "",
          shareDescription: res.data?.data?.shareDescription || "",
          cardDescription: res.data?.data?.cardDescription || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load online exam pattern");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  /* =======================
     LOADING / ERROR
  ======================== */
  if (loading) {
    return (
      <div className="text-center py-16 text-blue-600 font-medium">
        Loading online exam pattern...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!data.shareDescription && !data.cardDescription) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">

      {/* =======================
          HEADER
      ======================== */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
      Why  {data.universityName} 
      </h2>

      {/* =======================
          CONTENT (VERTICAL)
      ======================== */}
      <div className="space-y-8 text-gray-700 leading-relaxed">

        {/* Exam Overview */}
        {data.shareDescription && (
          <div>
            {/* <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Exam Overview
            </h3> */}

            <div className="space-y-4">
              {data.shareDescription
                .split("\n")
                .filter(p => p.trim() !== "")
                .map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
            </div>
          </div>
        )}

        {/* Key Highlights */}
        {data.cardDescription && (
          <div>
            {/* <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Key Highlights
            </h3> */}

            <div className="space-y-4">
              {data.cardDescription
                .split("\n")
                .filter(p => p.trim() !== "")
                .map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
