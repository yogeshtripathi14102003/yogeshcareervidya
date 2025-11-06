"use client";

import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactBanner() {
  // ✅ Fix hydration mismatch by rendering client-side only dynamic parts
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-16 px-6 md:px-20 
                 flex flex-col md:flex-row items-center justify-between gap-10 
                 bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#f97316] text-white"
    >
      {/* Optional soft pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-cover bg-center" />

      {/* Left Section */}
      <div className="max-w-2xl relative z-10">
        <div className="flex items-start">
          <div className="w-1 bg-white h-24 mr-4"></div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-snug">
              Ready to Transform Your Ideas? <br /> Let’s Discuss this!
            </h2>
          </div>
        </div>

        <p className="mt-6 text-lg text-gray-100 leading-relaxed">
         Get free personalized guidance from our experts to find the right course, college, or career path.
        </p>
      </div>

      {/* Right Section */}
      {isClient && (
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <PhoneCall size={48} className="text-white mb-4" />
          <p className="text-lg font-medium text-gray-100">Reach Out Now</p>
          <p className="text-2xl font-bold mt-1"> +91 12018447695</p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center bg-white text-[#1e3a8a] 
                       px-8 py-3 rounded-full font-semibold hover:bg-gray-100 
                       transition duration-300"
          >
            Contact Us <span className="ml-2 text-lg">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
