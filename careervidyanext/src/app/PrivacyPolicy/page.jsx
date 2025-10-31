"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  // Replace the placeholders below with your real company name and contact email.
  const COMPANY_NAME = "Your Company Name";
  const CONTACT_EMAIL = "privacy@yourdomain.com";
  const LAST_UPDATED = "October 31, 2025";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white shadow-md rounded-2xl p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600">Last updated: {LAST_UPDATED}</p>
        </header>

        <section className="prose prose-sm sm:prose lg:prose-lg">
          <p>
            {COMPANY_NAME} ("we", "us" or "our") is committed to protecting and respecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and protect your
            information when you use our website and services.
          </p>

          <h2>1. Information we collect</h2>
          <ul>
            <li>
              <strong>Personal information:</strong> name, email address, phone number, billing
              address, and other identifiers you provide when you create an account, purchase, or
              contact us.
            </li>
            <li>
              <strong>Usage data:</strong> information about how you interact with our website and
              services (pages visited, time spent, device and browser details, IP address,
              referring pages).
            </li>
            <li>
              <strong>Cookies and tracking:</strong> small files stored on your device to help us
              remember preferences, analyze traffic, and customize content.
            </li>
          </ul>

          <h2>2. How we use your information</h2>
          <p>We use the information we collect for purposes including:</p>
          <ul>
            <li>Providing, operating, and improving the website and our services.</li>
            <li>Processing transactions and sending order confirmations or receipts.</li>
            <li>Responding to your inquiries and providing customer support.</li>
            <li>Sending marketing communications (where you’ve consented) and updates about our
              services.</li>
            <li>Detecting, preventing, and addressing fraud or security issues.</li>
          </ul>

          <h2>3. Legal bases for processing (if you are subject to GDPR)</h2>
          <p>
            If you are in the European Economic Area (EEA), our legal bases for processing
            personal data include: your consent, fulfillment of a contract with you, our
            legitimate interests (e.g. service improvement, fraud prevention), or compliance with
            legal obligations.
          </p>

          <h2>4. Sharing your information</h2>
          <p>
            We do not sell your personal information. We may share information with:
          </p>
          <ul>
            <li>Service providers who help with payment processing, hosting, analytics, and
              communications.</li>
            <li>When required by law, to comply with legal processes, or to protect our rights and
              users' safety.</li>
            <li>In the event of a merger, acquisition, or sale of assets, user information may be
              transferred as part of that transaction (we will notify you where required by law).
            </li>
          </ul>

          <h2>5. Cookies and tracking technologies</h2>
          <p>
            We use cookies and similar technologies for site functionality, analytics, and
            advertising. You can manage cookie preferences through your browser settings. See our
            Cookie Policy (if you have one) for more details.
          </p>

          <h2>6. Data retention</h2>
          <p>
            We retain personal information only as long as necessary to provide services, comply
            with legal obligations, resolve disputes, and enforce our agreements. Retention periods
            vary depending on the nature of the data and the purposes for which it was collected.
          </p>

          <h2>7. Data security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect personal data
            against unauthorized access, alteration, disclosure, or destruction. However, no
            internet transmission or storage system is completely secure — please take care when
            sharing information online.
          </p>

          <h2>8. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, update, or request
            deletion of your personal information. You may also have the right to object to or
            restrict certain processing and to request data portability. To exercise these rights,
            contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2>9. Children’s privacy</h2>
          <p>
            Our services are not directed to children under 13 (or a higher age where required by
            local law). We do not knowingly collect personal information from children. If you
            believe we have collected data from a child, please contact us and we will take steps
            to delete it.
          </p>

          <h2>10. Third-party links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the
            privacy practices of those sites. We encourage you to review their privacy policies.
          </p>

          <h2>11. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the revised policy on
            this page with an updated "Last updated" date.
          </p>

          <h2>12. Contact us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, contact us at
            <a className="ml-1" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <footer className="mt-8 py-4 border-t">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
            <p className="mt-2 text-sm">Back to <Link href="/">Home</Link></p>
          </footer>
        </section>
      </div>
    </main>
  );
}
