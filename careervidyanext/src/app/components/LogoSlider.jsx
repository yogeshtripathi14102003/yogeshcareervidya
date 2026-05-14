// src/components/LogoSlider.jsx
// Server Component — fetches on server, renders client UI inline, no NEXT_PUBLIC URL

import Image from "next/image";
import { serverFetch } from "@/utlis/serverFetch";

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/${path}`;
};

export default async function LogoSlider() {
  let logos = [];

  try {
    const res = await serverFetch("/api/v1/ourstudent", {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const json = await res.json();
      const data = json?.data || json || [];

      const seen = new Set();
      data.forEach((student) => {
        if (student.companyLogo && !seen.has(student.companyLogo)) {
          logos.push({
            logo: student.companyLogo,
            company: student.company,
          });
          seen.add(student.companyLogo);
        }
      });
    }
  } catch (err) {
    console.error("LogoSlider: fetch failed →", err);
  }

  if (logos.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto px-4 overflow-hidden">
        <div className="relative flex items-center">
          <div className="flex gap-6 animate-logo-scroll whitespace-nowrap">
            {/* Duplicate for seamless infinite scroll */}
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 h-24 bg-white rounded-xl shadow-md border flex items-center justify-center p-3 hover:shadow-lg transition"
              >
                <Image
                  src={getFullUrl(logo.logo)}
                  alt={logo.company || `Logo ${index}`}
                  width={120}
                  height={60}
                  className="object-contain max-w-full max-h-full"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes logo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-logo-scroll {
          display: flex;
          animation: logo-scroll 25s linear infinite;
        }
      `}</style>
    </section>
  );
}