"use client";

import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function TermsAndConditions() {
  return (
    <>
      <Header />

      {/* Banner Section - Reduced Height */}
      <div className="overflow-hidden w-full md:h-[40vh] h-[20vh]">
        <img
          src="/images/terms&privacy-banner.png"
          alt="Terms and Conditions Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-700">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
            Terms & Conditions
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Meta Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Effective Date:</span>{" "}
            01 November 2025
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Website:</span>{" "}
            www.careervidya.in
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Entity:</span>{" "}
            Career Vidya Edu-Tech Private Limited ("Career Vidya")
          </p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">
          By accessing or using the website www.careervidya.in and our related
          services, you ("user," "you," or "your") agree to comply with and be
          bound by these Terms & Conditions ("Terms"). Please read them carefully
          before using our platform. If you do not agree to these Terms, you must
          discontinue using the website and our services immediately.
        </p>

        <div className="space-y-8">
          {/* 1 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">1</span>
              Use of the Website
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
              <li>The content and information provided on Career Vidya are intended solely for educational and informational purposes.</li>
              <li>You agree not to copy, modify, reproduce, distribute, or republish any material from this website without our prior written consent.</li>
              <li>You must not use the website for any unlawful, misleading, fraudulent, or unauthorized purpose.</li>
              <li>Any attempt to disrupt or interfere with the operation of the website, servers, or networks is strictly prohibited.</li>
            </ul>
          </section>

          {/* 2 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">2</span>
              User Registration and Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
              <li>You may be required to register and provide personal details to access certain features or services.</li>
              <li>You agree to provide accurate, current, and complete information during registration and to update it as needed.</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials and all activities under your account.</li>
              <li>Career Vidya reserves the right to suspend or terminate accounts violating our Terms, Privacy Policy, or applicable laws.</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">3</span>
              Services Offered
            </h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Career Vidya provides educational and career-oriented services including, but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
              <li>Career counselling and mentorship</li>
              <li>Course and college recommendations</li>
              <li>Educational resources, webinars, and guidance tools</li>
            </ul>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We do not guarantee admission, placement, or employment outcomes. All final decisions rest with respective universities, colleges, or institutions. Course information and recommendations are subject to change without notice.
            </p>
          </section>

          {/* 4 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">4</span>
              Third-Party Links
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The website may contain links to external websites, partner institutions, or affiliate services. These links are provided for convenience and do not imply endorsement or responsibility for their content or privacy practices. Please review their respective terms and policies before engaging.
            </p>
          </section>

          {/* 5 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">5</span>
              Intellectual Property Rights
            </h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              All text, graphics, logos, images, videos, designs, and software on this website are the intellectual property of Career Vidya Edu-Tech Private Limited unless otherwise stated. Unauthorized use or distribution is strictly prohibited.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may view and print website content for personal, non-commercial use only.
            </p>
          </section>

          {/* 6 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">6</span>
              Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              Career Vidya shall not be liable for any loss or damage arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
              <li>The use or inability to use our website or services.</li>
              <li>Reliance on information, content, or recommendations provided.</li>
              <li>Technical issues, interruptions, or unauthorized access to user data.</li>
            </ul>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Users are encouraged to verify all information independently before making decisions.
            </p>
          </section>

          {/* 7 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">7</span>
              Disclaimer
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All information provided on Career Vidya is for general guidance. We make no warranties on accuracy, completeness, or reliability. Services are offered "as is" and "as available."
            </p>
          </section>

          {/* 8 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">8</span>
              Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your use of this website is governed by our{" "}
              <a href="/privacy" className="text-blue-600 underline hover:text-blue-800 font-medium">
                Privacy Policy
              </a>
              , which explains how we handle personal information.
            </p>
          </section>

          {/* 9 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">9</span>
              Indemnification
            </h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              You agree to indemnify and hold Career Vidya harmless from any claims, damages, or liabilities arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
              <li>Your use of the website or services.</li>
              <li>Your violation of these Terms or applicable laws.</li>
              <li>Any infringement of third-party rights by your actions or submissions.</li>
            </ul>
          </section>

          {/* 10 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">10</span>
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Career Vidya reserves the right to modify or update these Terms at any time. Continued use of the website after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 11 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">11</span>
              Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India.
            </p>
          </section>

          {/* 12 - Contact */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold">12</span>
              Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For any queries or feedback regarding these Terms, contact us at:
            </p>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">📧</span>
                <a href="mailto:support@careervidya.in" className="text-blue-600 underline hover:text-blue-800 font-medium">
                  support@careervidya.in
                </a>
              </p>
              <p className="flex items-start gap-2 text-gray-700">
                <span className="text-lg">🏢</span>
                <span>
                  <strong>Career Vidya Edu-Tech Private Limited</strong>
                  <br />
                  Corporate Office: H-160, H-BLOCK, SECTOR-63, NOIDA
                </span>
              </p>
            </div>
            <p className="mt-6 text-sm text-gray-500 text-center border-t border-blue-200 pt-4">
              © 2025 Career Vidya Edu-Tech Private Limited. All Rights Reserved.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}