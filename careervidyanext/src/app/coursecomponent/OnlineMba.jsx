"use client";

import Image from "next/image";
import React from "react";
import { Download } from "lucide-react";

export default function OnlineMBA() {
  return (
    <main className="bg-white text-gray-800">
      {/* ---------- Hero Section ---------- */}
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 p-6 border rounded-lg shadow-md mt-8">
        {/* Left Image */}
        <div className="w-full md:w-1/3">
          <Image
            src="/images/online-mba-hero.png"
            alt="Online MBA Course"
            width={400}
            height={400}
            className="rounded-md"
          />
        </div>

        {/* Right Text */}
        <div className="w-full md:w-2/3 space-y-3">
          <h1 className="text-2xl font-bold text-blue-800">
            Online MBA Degree Courses
          </h1>
          <p className="text-sm leading-relaxed text-gray-600">
            An Online MBA or Master of Business Administration is a two-year
            postgraduate degree program that helps you build leadership,
            management, and strategic thinking skills. Designed for working
            professionals, it combines flexibility with academic excellence.
          </p>
          <p className="text-sm text-gray-500">
            Duration: <b>2 Years</b> | Mode: <b>Online</b>
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition">
            <Download size={18} /> Download E-Book
          </button>
        </div>
      </section>

      {/* ---------- Study More Box ---------- */}
      <section className="text-center mt-10">
        <div className="bg-yellow-200 inline-block px-6 py-3 rounded-lg shadow">
          <h2 className="font-semibold text-lg">Want to Study More?</h2>
          <p className="text-sm text-gray-700">
            We Will Pay More! <br />
            Fill the form below to get career advice.
          </p>
        </div>
      </section>

      {/* ---------- Course Details Table ---------- */}
      <section className="max-w-4xl mx-auto mt-10 border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border">Course Duration</th>
              <th className="p-3 border">Eligibility</th>
              <th className="p-3 border">Learning Mode</th>
              <th className="p-3 border">Full Form</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="p-3 border">2 Years</td>
              <td className="p-3 border">Graduation</td>
              <td className="p-3 border">Online</td>
              <td className="p-3 border">Master of Business Administration</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ---------- Overview Section ---------- */}
      <section className="max-w-5xl mx-auto mt-10 px-4 space-y-4">
        <h2 className="text-xl font-bold text-blue-700">
          Online MBA Program Overview
        </h2>
        <p>
          The Online MBA program helps students grasp the key aspects of
          Business Analytics, Finance, Human Resources, Operations, and
          Marketing through a comprehensive online learning experience.
        </p>
        <h3 className="font-semibold text-gray-800">
          Where Will Online MBA Courses Be in 2050?
        </h3>
        <p>
          By 2050, Online MBA programs will become the most preferred mode of
          learning due to digital advancements, global collaborations, and AI-driven 
          personalized learning systems.
        </p>
      </section>

      {/* ---------- Market Chart Section ---------- */}
      <section className="max-w-5xl mx-auto mt-10 px-4">
        <div className="bg-white p-4 rounded-md shadow">
          <Image
            src="/images/mba-market-growth.png"
            alt="India MBA Education Market Graph"
            width={800}
            height={400}
            className="mx-auto"
          />
          <p className="text-center text-sm mt-2 text-gray-600">
            INDIA MBA EDUCATION MARKET: Opportunities & Forecast 2025–2050
          </p>
        </div>
      </section>

      {/* ---------- Salary Insights Section ---------- */}
      <section className="max-w-5xl mx-auto mt-10 px-4 space-y-4">
        <h2 className="text-xl font-bold text-blue-700">
          Online MBA Salary Insights
        </h2>
        <Image
          src="/images/mba-salary-chart.png"
          alt="MBA Salary Chart"
          width={900}
          height={400}
          className="mx-auto rounded-md border"
        />
        <p className="text-center text-gray-600 text-sm">
          Data Source: Payscale 2025
        </p>
      </section>

      {/* ---------- Why MBA Section ---------- */}
      <section className="max-w-5xl mx-auto mt-12 px-4 space-y-3">
        <h2 className="text-xl font-bold text-blue-700">
          Why an Online MBA Course?
        </h2>
        <p>
          The Online MBA is ideal for students and working professionals who
          want to upskill while maintaining work-life balance. It provides
          access to top-quality management education anytime, anywhere.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Flexible learning schedule</li>
          <li>Globally recognized degree</li>
          <li>Affordable and accessible from anywhere</li>
          <li>Career advancement and leadership roles</li>
          <li>Networking opportunities with global professionals</li>
        </ul>
      </section>

      <footer className="mt-16 text-center py-6 text-sm text-gray-500 border-t">
        © 2025 CareerVidya | All Rights Reserved
      </footer>
    </main>
  );
}
