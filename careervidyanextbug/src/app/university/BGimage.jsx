"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";
import Image from "next/image";

export default function UniversityBackground() {
  const { slug } = useParams();

  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchUniversity = async () => {
      try {
        const res = await api.get(`/api/v1/university/slug/${slug}`);
        const uni = res.data?.data;

        setBackground(uni?.background || null);
      } catch (err) {
        setError("Failed to load background data");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  if (error || !background) return null;

  return (
    <section className="w-full mt-8">
      <div className="relative w-full h-[220px] md:h-[320px] rounded-xl overflow-hidden">
        {background.backgroundImage && (
          <Image
            src={background.backgroundImage}
            alt="University Background"
            fill
            priority
            className="object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        {background.backgroundDescription && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <p className="max-w-3xl text-center text-white text-sm md:text-base leading-relaxed">
              {background.backgroundDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
