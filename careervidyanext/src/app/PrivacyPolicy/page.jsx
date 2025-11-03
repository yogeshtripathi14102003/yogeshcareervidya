"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const COMPANY_NAME = "Career Vidya Edu-Tech Private Limited";
  const CONTACT_EMAIL = "info@careervidya.in";
  const LAST_UPDATED = "November 01, 2025";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white shadow-md rounded-2xl p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Effective Date: {LAST_UPDATED}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Website: <strong>www.careervidya.in</strong>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Entity: <strong>{COMPANY_NAME}</strong>
          </p>
        </header>

        <section className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
          <p>
            Career Vidya is committed to protecting your privacy and handling
            your personal information responsibly. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your data when you
            visit our website or use our services.
          </p>

          <p>
            By accessing our website or providing your information, you consent
            to the practices described in this Privacy Policy.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>a. Personal Information</h3>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Mobile number</li>
            <li>Educational qualifications</li>
            <li>City, state, or location</li>
            <li>Preferences and interests related to courses or careers</li>
          </ul>

          <h3>b. Non-Personal Information</h3>
          <ul>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>IP address and general geolocation</li>
            <li>Cookies and usage data</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>
              Delivering personalized career counselling, guidance, and course
              recommendations.
            </li>
            <li>Responding to your queries, feedback, or support requests.</li>
            <li>
              Sending relevant updates, newsletters, or promotional materials
              (only with your consent).
            </li>
            <li>
              Improving website functionality, security, and user experience.
            </li>
            <li>
              Complying with legal obligations and resolving disputes.
            </li>
          </ul>

          <h2>3. Data Sharing and Disclosure</h2>
          <p>
            We respect your privacy and do not sell, rent, or trade your
            personal information. However, we may share your information in the
            following limited circumstances:
          </p>
          <ul>
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

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance website
            performance, understand user behaviour, and personalize your
            browsing experience. You can manage or disable cookies through your
            browser settings. However, some features of the website may not
            function properly if cookies are disabled.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary to fulfil the
            purposes outlined in this policy or as required by law. When data is
            no longer needed, we securely delete or anonymize it.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, please note that no
            online platform can guarantee absolute security.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Under the Digital Personal Data Protection Act, 2023, you have the
            following rights:
          </p>
          <ul>
            <li>
              <strong>Right to Access:</strong> Request details of personal data
              we hold about you.
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
          <p>
            To exercise these rights, you can contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600">
              {CONTACT_EMAIL}
            </a>
            .
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            Our website may contain links to external websites or partner
            institutions. Career Vidya is not responsible for the privacy
            practices, content, or policies of such third-party sites. We
            recommend reviewing their privacy policies before sharing any
            personal data.
          </p>

          <h2>9. Children’s Privacy</h2>
          <p>
            Our services are intended for users above the age of 13. We do not
            knowingly collect personal data from children. If you believe a
            child has provided us with personal information, please contact us
            so we can take appropriate action.
          </p>

          <h2>10. Updates to This Policy</h2>
          <p>
            Career Vidya may update this Privacy Policy from time to time to
            reflect legal, operational, or technological changes. All updates
            will be posted on this page with a revised “Effective Date.” Use of
            the website after such updates constitutes your acceptance of the
            revised policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            For any questions, concerns, or complaints regarding this Privacy
            Policy or data handling practices, please contact:
          </p>
          <ul>
            <li>
              📧 Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-blue-600 font-medium"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>🏢 {COMPANY_NAME}</li>
            <li>H-160, H-BLOCK, SECTOR-63, NOIDA</li>
          </ul>

          <footer className="mt-8 py-4 border-t">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
            </p>
            <p className="mt-2 text-sm">
              Back to <Link href="/">Home</Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
