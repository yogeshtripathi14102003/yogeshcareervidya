"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

export default function LogoSlider() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await api.get("/api/v1/ourstudent");

        // 🧩 Adjust this based on your actual backend response
        const data = res.data?.data || res.data || [];

        const uniqueCompanies = [];
        const seen = new Set();

        data.forEach((student) => {
          if (student.companyLogo && !seen.has(student.companyLogo)) {
            uniqueCompanies.push({
              logo: student.companyLogo,
              company: student.company,
            });
            seen.add(student.companyLogo);
          }
        });

        setLogos(uniqueCompanies);
      } catch (error) {
        console.error("Error fetching company logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading logos...</div>
    );
  }

  if (logos.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        No logos found. Check your API response.
      </div>
    );
  }

  // 🧠 Tailwind + custom scroll animation
  return (
    <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 py-8 overflow-hidden">
      <div className="relative flex items-center">
        <div className="flex gap-6 animate-scroll whitespace-nowrap">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white border rounded-xl w-40 h-20 flex items-center justify-center shadow-sm hover:shadow-md transition"
            >
              <Image
                src={
                  logo.logo?.startsWith("http")
                    ? logo.logo
                    : `${process.env.NEXT_PUBLIC_BASE_URL}${logo.logo}`
                }
                alt={logo.company || `Logo ${index}`}
                width={120}
                height={60}
                className="object-contain"
                unoptimized // useful for external URLs (Cloudinary)
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom smooth scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
