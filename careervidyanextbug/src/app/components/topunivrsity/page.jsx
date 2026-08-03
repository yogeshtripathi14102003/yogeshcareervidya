"use client";

import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1>
        <p className="text-lg mb-8">
          Explore our features, manage universities, and create amazing experiences. 
          Get started now to see everything we have to offer.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/admin"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}
