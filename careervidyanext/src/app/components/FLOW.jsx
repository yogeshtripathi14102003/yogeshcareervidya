"use client";

import Image from "next/image";
import Link from "next/link";

export default function AdmissionProcess() {
  return (
    <section className="w-full flex flex-col items-center text-center py-12 bg-white">
      {/* ===== Heading ===== */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Admission Process{" "}
        <span className="text-blue-600">With Online Universities</span>
      </h2>

      {/* ===== Subheading ===== */}
      <p className="text-gray-600 mt-3 max-w-2xl">
        Follow these simple steps to get admission in accredited online universities
        across India.
      </p>

      {/* ===== Image Section ===== */}
      <div className="relative w-full max-w-5xl mt-10 px-4">
        <Image
          src="/images/Process.png" // ✅ Replace with your uploaded image path
          alt="Admission Process Flow"
          width={1200}
          height={600}
          className="rounded-lg object-contain mx-auto"
        />
      </div>

      {/* ===== Button ===== */}
      <Link
        href="/counselling"
        className="mt-10 inline-block bg-[#0057A0] text-white font-medium px-6 py-3 rounded-md  transition"
      >
        Apply Now
      </Link>
    </section>
  );
}
