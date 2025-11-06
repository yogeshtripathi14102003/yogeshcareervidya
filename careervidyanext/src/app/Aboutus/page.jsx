"use client";

import React from "react";
import Link from "next/link";
import Getintuch from "../components/getintuch"// ✅ import your Getintuch component
import ContactBanner from "../components/ContactBanner ";

export default function AboutUs() {
  const COMPANY_NAME = "Career Vidya Edu-Tech Pvt. Ltd.";
  const MISSION_STATEMENT =
    "Our mission is to empower students by providing free, personalized, and transparent career guidance to help them choose the right course and college for a bright future.";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white shadow-md rounded-2xl p-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#0056A4] mb-2">About Us</h1>
          <p className="text-gray-600 text-sm">Learn more about who we are and what we do</p>
        </header>

        {/* Main Content */}
        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Welcome to <strong>{COMPANY_NAME}</strong>! We are a passionate team of educators,
            counselors, and tech professionals committed to transforming the way students make
            academic and career decisions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 text-[#0056A4]">Our Mission</h2>
          <p>{MISSION_STATEMENT}</p>

          <h2 className="text-2xl font-semibold mt-8 text-[#0056A4]">What We Do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free career guidance sessions for students across India.</li>
            <li>College and course comparison tools to make informed decisions.</li>
            <li>Personalized counseling from expert education advisors.</li>
            <li>Workshops and webinars on admission, exams, and career planning.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 text-[#0056A4]">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Integrity:</strong> We believe in honest and unbiased guidance for every student.
            </li>
            <li>
              <strong>Empathy:</strong> We listen, understand, and care for each student’s unique journey.
            </li>
            <li>
              <strong>Innovation:</strong> We use technology to simplify complex educational choices.
            </li>
            <li>
              <strong>Excellence:</strong> We strive to deliver accurate, reliable, and actionable insights.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 text-[#0056A4]">Our Team</h2>
          <p>
            Our team consists of experienced academic counselors, career coaches, and software
            professionals who share a single goal — to guide students toward a successful and
            fulfilling future.
          </p>

          <h2 className="text-2xl font-semibold mt-8 text-[#0056A4]">Contact Us</h2>
          <p>
            Have questions or want to connect with our counselors?{" "}
            <Link href="/contact" className="text-blue-600 underline ml-1">
              Visit our Contact Page
            </Link>{" "}
            or fill out the quick form below — we’ll get in touch soon!
          </p>
        </section>
      </div>

      {/* ✅ Added Getintuch Section */}
      <div className="mt-12">
        <ContactBanner  />
        <Getintuch />
      </div>
    </main>
  );
}
