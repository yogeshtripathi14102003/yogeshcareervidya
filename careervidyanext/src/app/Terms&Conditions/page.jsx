"use client";

import React from "react";
import Header from "../layout/Header" // ✅ Update this import path if your Header is located elsewhere
import Footer from "../layout/Footer";
export default function TermsAndConditions() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Banner Section */}
      <div className="overflow-hidden w-auto md:h-[70vh] h-[30vh]">
        <img
          src="/images/terms&privacy-banner.png"
          alt="Terms and Conditions Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-6 border-b-2 pb-2">
          Terms & Conditions
        </h1>

        <div className="space-y-6">
          <p className="text-sm text-gray-500 italic">
            Effective Date: <strong>01 November 2025</strong>
          </p>
          <p>
            <strong>Website:</strong> www.careervidya.in
          </p>
          <p>
            <strong>Entity:</strong> Career Vidya Edu-Tech Private Limited
            (“Career Vidya”)
          </p>
          <p>
            By accessing or using the website www.careervidya.in and our related
            services, you (“user,” “you,” or “your”) agree to comply with and be
            bound by these Terms & Conditions (“Terms”). Please read them
            carefully before using our platform. If you do not agree to these
            Terms, you must discontinue using the website and our services
            immediately.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              1. Use of the Website
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                The content and information provided on Career Vidya are intended
                solely for educational and informational purposes.
              </li>
              <li>
                You agree not to copy, modify, reproduce, distribute, or republish
                any material from this website without our prior written consent.
              </li>
              <li>
                You must not use the website for any unlawful, misleading,
                fraudulent, or unauthorized purpose.
              </li>
              <li>
                Any attempt to disrupt or interfere with the operation of the
                website, servers, or networks is strictly prohibited.
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              2. User Registration and Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You may be required to register and provide personal details to
                access certain features or services.
              </li>
              <li>
                You agree to provide accurate, current, and complete information
                during registration and to update it as needed.
              </li>
              <li>
                You are solely responsible for maintaining the confidentiality of
                your login credentials and all activities under your account.
              </li>
              <li>
                Career Vidya reserves the right to suspend or terminate accounts
                violating our Terms, Privacy Policy, or applicable laws.
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              3. Services Offered
            </h2>
            <p>
              Career Vidya provides educational and career-oriented services
              including, but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Career counselling and mentorship</li>
              <li>Course and college recommendations</li>
              <li>Educational resources, webinars, and guidance tools</li>
            </ul>
            <p className="mt-2">
              We do not guarantee admission, placement, or employment outcomes.
              All final decisions rest with respective universities, colleges, or
              institutions. Course information and recommendations are subject to
              change without notice.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              4. Third-Party Links
            </h2>
            <p>
              The website may contain links to external websites, partner
              institutions, or affiliate services. These links are provided for
              convenience and do not imply endorsement or responsibility for their
              content or privacy practices. Please review their respective terms
              and policies before engaging.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              5. Intellectual Property Rights
            </h2>
            <p>
              All text, graphics, logos, images, videos, designs, and software on
              this website are the intellectual property of Career Vidya Edu-Tech
              Private Limited unless otherwise stated. Unauthorized use or
              distribution is strictly prohibited.
            </p>
            <p>
              You may view and print website content for personal, non-commercial
              use only.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              Career Vidya shall not be liable for any loss or damage arising from:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The use or inability to use our website or services.</li>
              <li>
                Reliance on information, content, or recommendations provided.
              </li>
              <li>
                Technical issues, interruptions, or unauthorized access to user
                data.
              </li>
            </ul>
            <p>
              Users are encouraged to verify all information independently before
              making decisions.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              7. Disclaimer
            </h2>
            <p>
              All information provided on Career Vidya is for general guidance.
              We make no warranties on accuracy, completeness, or reliability.
              Services are offered “as is” and “as available.”
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              8. Privacy Policy
            </h2>
            <p>
              Your use of this website is governed by our{" "}
              <a href="/privacy" className="text-blue-600 underline">
                Privacy Policy
              </a>
              , which explains how we handle personal information.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              9. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold Career Vidya harmless from any
              claims, damages, or liabilities arising from:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your use of the website or services.</li>
              <li>Your violation of these Terms or applicable laws.</li>
              <li>
                Any infringement of third-party rights by your actions or
                submissions.
              </li>
            </ul>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              10. Changes to Terms
            </h2>
            <p>
              Career Vidya reserves the right to modify or update these Terms at
              any time. Continued use of the website after changes constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              11. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms are governed by the laws of India. Any disputes will be
              subject to the exclusive jurisdiction of the courts in Hyderabad,
              Telangana.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              12. Contact Information
            </h2>
            <p>
              For any queries or feedback regarding these Terms, contact us at:
            </p>
            <p>
              📧{" "}
              <a
                href="mailto:support@careervidya.in"
                className="text-blue-600 underline"
              >
                support@careervidya.in
              </a>
            </p>
            <p className="mt-2">
              🏢 Career Vidya Edu-Tech Private Limited
              <br />
              Corporate Office: H-160, H-BLOCK, SECTOR-63, NOIDA
            </p>
            <p className="mt-6 text-sm text-gray-500">
              © 2025 Career Vidya Edu-Tech Private Limited. All Rights Reserved.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
