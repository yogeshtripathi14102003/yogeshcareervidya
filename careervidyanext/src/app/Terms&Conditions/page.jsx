"use client";

import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* ✅ Page Header */}
        <h1 className="text-4xl font-bold mb-6 text-[#0056B3]">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Effective Date: <strong>31 October 2025</strong>
        </p>

        {/* ✅ 1. Use of the Website */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Use of the Website</h2>
          <p className="leading-relaxed mb-3">
            Welcome to Career Vidya (“we,” “our,” “us”). By accessing or using
            our website{" "}
            <Link
              href="https://www.careervidya.in"
              className="text-[#0056B3] hover:underline"
            >
              www.careervidya.in
            </Link>{" "}
            (“Site”) and associated services, you agree to comply with and be
            bound by these Terms & Conditions. Please read them carefully before
            using our platform.
          </p>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              The content and information available on Career Vidya are provided
              for educational and informational purposes only.
            </li>
            <li>
              You agree not to copy, distribute, modify, or reproduce any
              material from the Site without prior written permission.
            </li>
            <li>
              You must not use the website for any unlawful, misleading, or
              unauthorized activity.
            </li>
          </ul>
        </section>

        {/* ✅ 2. User Information & Registration */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            2. User Information & Registration
          </h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              By providing your personal information, you confirm that it is
              accurate, current, and complete.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials and all activities that occur under your
              account.
            </li>
            <li>
              Career Vidya reserves the right to suspend or terminate accounts
              found to be violating our terms or policies.
            </li>
          </ul>
        </section>

        {/* ✅ 3. Services & Content */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Services & Content</h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              Career Vidya offers career guidance, counselling, and course
              recommendation services to help students and professionals make
              informed education and career decisions.
            </li>
            <li>
              We do not guarantee admission, placement, or employment outcomes
              as final decisions rest with respective universities or
              institutions.
            </li>
            <li>
              All information, course details, and eligibility criteria are
              subject to change without prior notice.
            </li>
          </ul>
        </section>

        {/* ✅ 4. Third-Party Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Links</h2>
          <p className="leading-relaxed">
            Our website may contain links to third-party websites or partner
            institutions. Career Vidya is not responsible for the content,
            accuracy, or privacy practices of any external sites. Users are
            advised to review the terms and privacy policies of those websites
            before engaging with them.
          </p>
        </section>

        {/* ✅ 5. Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
          <p className="leading-relaxed">
            All text, images, graphics, videos, logos, and other materials on
            this website are the intellectual property of{" "}
            <strong>Career Vidya Pvt. Ltd.</strong> Unauthorized use,
            duplication, or distribution of any material without written consent
            is strictly prohibited.
          </p>
        </section>

        {/* ✅ 6. Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p className="leading-relaxed">
            Career Vidya shall not be liable for any direct, indirect,
            incidental, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-6 leading-relaxed space-y-2 mt-2">
            <li>The use or inability to use our website or services.</li>
            <li>
              Reliance on information, recommendations, or third-party links
              provided.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed">
            Users are encouraged to verify all information independently before
            making any admission or financial decisions.
          </p>
        </section>

        {/* ✅ 7. Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Privacy</h2>
          <p className="leading-relaxed">
            Your use of this website is also governed by our{" "}
            <Link
              href="/privacy-policy"
              className="text-[#0056B3] hover:underline"
            >
              Privacy Policy
            </Link>
            , which explains how we collect, use, and protect your personal
            data.
          </p>
        </section>

        {/* ✅ 8. Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
          <p className="leading-relaxed">
            We may update or modify these Terms & Conditions from time to time
            without prior notice. Your continued use of the website after any
            such update will signify your acceptance of the revised terms.
          </p>
        </section>

        {/* ✅ 9. Contact Us */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
          <p className="leading-relaxed mb-2">
            For any questions, feedback, or concerns regarding these Terms,
            please contact:
          </p>
          <p>
            📧 <strong>Email:</strong>{" "}
            <Link
              href="mailto:privacy@careervidya.in"
              className="text-[#0056B3] hover:underline"
            >
              privacy@careervidya.in
            </Link>
          </p>
          <p className="mt-2">
            🏢 <strong>Career Vidya Pvt. Ltd.</strong>
            <br />
            SF 27, Plot No-GH 01, Gaur City Center, Sector-4, Greater Noida
            West, Gautam Buddha Nagar, Uttar Pradesh - 201318, India
          </p>
        </section>

        {/* ✅ Footer */}
        <p className="text-center text-gray-500 mt-12">
          © 2025 <strong>Career Vidya Pvt. Ltd.</strong> All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
