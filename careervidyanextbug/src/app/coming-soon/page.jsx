"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-white text-white px-4 relative">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-white border border-white/30 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
      >
        ← Back
      </button>

      <div className="text-center max-w-xl">
        {/* Optional Logo */}
        {/* <Image src="/logo.png" alt="Logo" width={120} height={120} className="mx-auto mb-6" /> */}

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Coming Soon 🚀
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-8">
          We’re working hard to launch something amazing.  
          Stay tuned for updates!
        </p>

        <div className="w-24 h-1 bg-white mx-auto mb-8 rounded"></div>

        <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
          Notify Me
        </button>

        <p className="text-sm text-gray-800 mt-6">
          © {new Date().getFullYear()} Careervidya.in
        </p>
      </div>
    </main>
  );
}
