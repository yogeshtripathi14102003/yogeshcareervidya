"use client";

import React from "react";
import Link from "next/link";

export default function AboutUs() {
  const COMPANY_NAME = "Your Company Name";
  const MISSION_STATEMENT =
    "Our mission is to empower individuals and businesses through innovative digital solutions that drive success and create lasting impact.";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white shadow-md rounded-2xl p-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">About Us</h1>
          <p className="text-gray-600 text-sm">Learn more about who we are and what we do</p>
        </header>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Welcome to {COMPANY_NAME}! We are a passionate team of creators, designers, and
            developers dedicated to delivering high-quality digital experiences that help our
            clients grow and thrive in the modern world.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
          <p>{MISSION_STATEMENT}</p>

          <h2 className="text-2xl font-semibold mt-8">What We Do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Web design and development that focuses on performance and usability.</li>
            <li>Brand strategy and identity design to help businesses stand out.</li>
            <li>Custom software and mobile app development tailored to your needs.</li>
            <li>Digital marketing and SEO to grow your online presence.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Integrity:</strong> We believe in honesty, transparency, and accountability.</li>
            <li><strong>Innovation:</strong> We continuously seek creative solutions and embrace new technologies.</li>
            <li><strong>Collaboration:</strong> We work closely with our clients and team to achieve shared goals.</li>
            <li><strong>Excellence:</strong> We are committed to delivering the highest quality in everything we do.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Our Team</h2>
          <p>
            Our talented team comes from diverse backgrounds in design, technology, and business.
            Together, we bring creativity and technical expertise to every project, ensuring your
            success from start to finish.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
          <p>
            Have questions or want to work with us? We'd love to hear from you! Reach out through our
            <Link href="/contact" className="text-blue-600 ml-1 underline">Contact page</Link>.
          </p>
        </section>

        <footer className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/">Home</Link> | <Link href="/privacy-policy">Privacy Policy</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
