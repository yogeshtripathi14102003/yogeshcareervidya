"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const COMPANY_NAME = "Career Vidya Edu-Tech Private Limited";
  const CONTACT_EMAIL = "info@careervidya.in";
  const SUPPORT_EMAIL = "support@careervidya.in";
  const LAST_UPDATED = "01-11-2025";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white shadow-lg rounded-2xl p-10 border border-gray-100">
        {/* ---------- HEADER ---------- */}
        <header className="mb-8 text-center border-b pb-6">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            🔒 Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600">
            Effective Date: <strong>{LAST_UPDATED}</strong>
          </p>
          <p className="text-gray-600">
            Website: <strong>www.careervidya.in</strong>
          </p>
          <p className="text-gray-600">
            Entity: <strong>{COMPANY_NAME}</strong>
          </p>
        </header>

        {/* ---------- BODY ---------- */}
        <section className="space-y-8 text-gray-800 leading-relaxed">
          <p>
            <strong>Career Vidya</strong> is committed to protecting your
            privacy and handling your personal information responsibly. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your data when you visit our website or use our services.
          </p>
          <p>
            By accessing our website or providing your information, you consent
            to the practices described in this Privacy Policy.
          </p>

          {/* SECTION 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              1️⃣ Information We Collect
            </h2>
            <p>We may collect the following types of information from you:</p>

            <h3 className="text-lg font-medium mt-3">a. Personal Information</h3>
            <p>Information that can identify you personally, such as:</p>
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Educational qualifications</li>
              <li>City, state, or location</li>
              <li>Preferences and interests related to courses or careers</li>
            </ul>

            <h3 className="text-lg font-medium mt-4">b. Non-Personal Information</h3>
            <p>Information automatically collected when you visit our website, such as:</p>
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address and general geolocation</li>
              <li>Cookies and usage data</li>
            </ul>
          </section>

          {/* SECTION 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              2️⃣ How We Use Your Information
            </h2>
            <p>We use your information to provide and improve our services, including:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>
                Delivering personalized career counselling, guidance, and course recommendations.
              </li>
              <li>Responding to your queries, feedback, or support requests.</li>
              <li>
                Sending relevant updates, newsletters, or promotional materials (only with your consent).
              </li>
              <li>Improving website functionality, security, and user experience.</li>
              <li>Complying with legal obligations and resolving disputes.</li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              3️⃣ Data Sharing and Disclosure
            </h2>
            <p>
              We respect your privacy and do not sell, rent, or trade your
              personal information. However, we may share your information in
              the following limited circumstances:
            </p>
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>
                With trusted partners or educational institutions to facilitate
                counselling or admission processes, only with your consent.
              </li>
              <li>
                With service providers who assist in operating our website,
                analytics, or communication — all bound by confidentiality
                obligations.
              </li>
              <li>
                When required by law or government authorities, to comply with
                legal or regulatory requirements.
              </li>
            </ul>
          </section>

          {/* SECTION 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              4️⃣ Cookies and Tracking Technologies
            </h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-8 mt-2 space-y-1">
              <li>Enhance website performance and security</li>
              <li>Understand user behaviour and preferences</li>
              <li>Personalize content and improve your browsing experience</li>
            </ul>
            <p className="mt-2">
              You can manage or disable cookies through your browser settings.
              However, some features of the website may not function properly if
              cookies are disabled.
            </p>
          </section>

          {/* SECTION 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              5️⃣ Data Retention
            </h2>
            <p>
              We retain your personal data only as long as necessary to fulfil
              the purposes outlined in this policy or as required by law. When
              data is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          {/* SECTION 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              6️⃣ Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, please note that
              no online platform can guarantee absolute security.
            </p>
          </section>

          {/* SECTION 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              7️⃣ Your Rights
            </h2>
            <p>
              Under the Digital Personal Data Protection Act, 2023, you have the
              following rights:
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li>
                <strong>Right to Access:</strong> Request details of personal
                data we hold about you.
              </li>
              <li>
                <strong>Right to Correction:</strong> Request correction or
                updating of inaccurate data.
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your
                personal data when it is no longer required.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Opt out of receiving
                marketing communications or revoke consent for data processing.
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, you can contact us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-blue-600 font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>

          {/* SECTION 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              8️⃣ Third-Party Links
            </h2>
            <p>
              Our website may contain links to external websites or partner
              institutions. <strong>Career Vidya</strong> is not responsible for
              the privacy practices, content, or policies of such third-party
              sites. We recommend reviewing their privacy policies before
              sharing any personal data.
            </p>
          </section>

          {/* SECTION 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              9️⃣ Children’s Privacy
            </h2>
            <p>
              Our services are intended for users above the age of 13. We do not
              knowingly collect personal data from children. If you believe a
              child has provided us with personal information, please contact us
              so we can take appropriate action.
            </p>
          </section>

          {/* SECTION 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              🔄 10. Updates to This Policy
            </h2>
            <p>
              Career Vidya may update this Privacy Policy from time to time to
              reflect legal, operational, or technological changes. All updates
              will be posted on this page with a revised “Effective Date.”
              Continued use of the website after such updates constitutes your
              acceptance of the revised policy.
            </p>
          </section>

          {/* SECTION 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-3 mb-3">
              📬 11. Contact Us
            </h2>
            <p>
              For any questions, concerns, or complaints regarding this Privacy
              Policy or data handling practices, please contact:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>
                📧 <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-600 font-medium"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>🏢 {COMPANY_NAME}</li>
              <li>📍 H-160, H-BLOCK, SECTOR-63, NOIDA</li>
            </ul>
          </section>

          {/* ---------- FOOTER ---------- */}
          <footer className="mt-10 pt-6 border-t text-center text-gray-600 text-sm">
            <p>
              © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
            </p>
            <p className="mt-2">
              ⬅️ Back to{" "}
              <Link href="/" className="text-blue-600 font-medium">
                Home
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
