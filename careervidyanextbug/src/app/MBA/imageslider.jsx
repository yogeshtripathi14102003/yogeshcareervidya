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

  if (loading) return <div className="py-10 text-center text-gray-500">Loading...</div>;
  if (logos.length === 0) return null;

  return (
    <div className="bg-white py-10 overflow-hidden">
      <div className="relative flex items-center">
        {/* Slider Container */}
        <div className="flex gap-8 animate-scroll whitespace-nowrap">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-xl w-40 h-20 flex items-center justify-center shadow-sm overflow-hidden p-2"
            >
              {/* Image wrapper to ensure it stays inside */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={
                    logo.logo?.startsWith("http")
                      ? logo.logo
                      : `${process.env.NEXT_PUBLIC_BASE_URL}${logo.logo}`
                  }
                  alt={logo.company || "Company Logo"}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-1"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}