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
          Effective Date: <strong>01 November 2025</strong>
        </p>

        <p className="leading-relaxed mb-4">
          <strong>Website:</strong>{" "}
          <Link
            href="https://www.careervidya.in"
            className="text-[#0056B3] hover:underline"
          >
            www.careervidya.in
          </Link>
        </p>
        <p className="leading-relaxed mb-6">
          <strong>Entity:</strong> Career Vidya Edu-Tech Private Limited (“Career Vidya”)
        </p>

        <p className="leading-relaxed mb-6">
          By accessing or using the website{" "}
          <strong>www.careervidya.in</strong> and our related services, you
          (“user,” “you,” or “your”) agree to comply with and be bound by these
          Terms & Conditions (“Terms”). Please read them carefully before using
          our platform. If you do not agree to these Terms, you must discontinue
          using the website and our services immediately.
        </p>

        {/* ✅ 1. Use of the Website */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Use of the Website</h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
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

        {/* ✅ 2. User Registration and Responsibilities */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            2. User Registration and Responsibilities
          </h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
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
              your login credentials and for all activities conducted under your
              account.
            </li>
            <li>
              Career Vidya reserves the right to suspend or terminate accounts
              found to be violating our Terms, Privacy Policy, or applicable
              laws.
            </li>
          </ul>
        </section>

        {/* ✅ 3. Services Offered */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Services Offered</h2>
          <p className="leading-relaxed mb-3">
            Career Vidya provides educational and career-oriented services
            including, but not limited to:
          </p>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>Career counselling and mentorship</li>
            <li>Course and college recommendations</li>
            <li>Educational resources, webinars, and guidance tools</li>
          </ul>
          <p className="leading-relaxed mt-3">
            <strong>Please note:</strong>
          </p>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              We do not guarantee admission, placement, or employment outcomes.
              All final decisions rest with respective universities, colleges,
              or institutions.
            </li>
            <li>
              All details such as course information, eligibility criteria, and
              recommendations are subject to change without prior notice.
            </li>
          </ul>
        </section>

        {/* ✅ 4. Third-Party Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Links</h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              The website may contain links to external websites, partner
              institutions, or affiliate services.
            </li>
            <li>
              These links are provided for convenience and do not imply
              endorsement or responsibility for the content, accuracy, or
              privacy practices of such third-party websites.
            </li>
            <li>
              Users are advised to review the terms and privacy policies of any
              linked websites before engaging with them.
            </li>
          </ul>
        </section>

        {/* ✅ 5. Intellectual Property Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            5. Intellectual Property Rights
          </h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              All text, graphics, logos, images, videos, designs, software, and
              other materials on this website are the intellectual property of{" "}
              <strong>Career Vidya Edu-Tech Private Limited</strong> unless
              otherwise stated.
            </li>
            <li>
              Unauthorized use, copying, modification, or distribution of any
              material from the website is strictly prohibited and may result in
              legal action.
            </li>
            <li>
              You may view and print content from the website for personal,
              non-commercial use only.
            </li>
          </ul>
        </section>

        {/* ✅ 6. Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>The use or inability to use our website or services.</li>
            <li>
              Reliance on information, content, or recommendations provided.
            </li>
            <li>
              Technical issues, interruptions, or unauthorized access to user
              data.
            </li>
          </ul>
          <p className="leading-relaxed mt-3">
            Users are encouraged to verify information independently before
            making educational, financial, or career decisions.
          </p>
        </section>

        {/* ✅ 7. Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Disclaimer</h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>
              The information provided on the Career Vidya platform is based on
              sources believed to be reliable. However, we make no warranties
              regarding its completeness, accuracy, or reliability.
            </li>
            <li>
              Services are provided on an “as is” and “as available” basis
              without any express or implied warranties.
            </li>
          </ul>
        </section>

        {/* ✅ 8. Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Privacy Policy</h2>
          <p className="leading-relaxed">
            Your use of this website is governed by our{" "}
            <Link
              href="/privacy-policy"
              className="text-[#0056B3] hover:underline"
            >
              Privacy Policy
            </Link>
            , which explains how we collect, use, and safeguard your personal
            information. By using our website, you acknowledge that you have
            read and agreed to our Privacy Policy.
          </p>
        </section>

        {/* ✅ 9. Indemnification */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">9. Indemnification</h2>
          <ul className="list-disc pl-6 leading-relaxed space-y-2">
            <li>Your use of the website or services.</li>
            <li>Your violation of these Terms or any applicable laws.</li>
            <li>
              Any infringement of third-party rights by your actions or
              submissions.
            </li>
          </ul>
        </section>

        {/* ✅ 10. Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
          <p className="leading-relaxed">
            Career Vidya reserves the right to modify, update, or replace these
            Terms & Conditions at any time without prior notice. Your continued
            use of the website following any changes constitutes your acceptance
            of the revised Terms.
          </p>
        </section>

        {/* ✅ 11. Governing Law and Jurisdiction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            11. Governing Law and Jurisdiction
          </h2>
          <p className="leading-relaxed">
            These Terms are governed by and construed in accordance with the
            laws of India. Any disputes arising out of or in connection with
            these Terms shall be subject to the exclusive jurisdiction of the
            courts in <strong>Hyderabad, Telangana</strong>.
          </p>
        </section>

        {/* ✅ 12. Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
          <p className="leading-relaxed mb-2">
            For any questions, concerns, or feedback regarding these Terms &
            Conditions, please contact us at:
          </p>
          <p>
            📧 <strong>Email:</strong>{" "}
            <Link
              href="mailto:support@careervidya.in"
              className="text-[#0056B3] hover:underline"
            >
              support@careervidya.in
            </Link>
          </p>
          <p className="mt-2">
            🏢 <strong>Career Vidya Edu-Tech Private Limited</strong>
            <br />
            Corporate Office: H-160, H-BLOCK, SECTOR-63, NOIDA
          </p>
        </section>

        {/* ✅ Footer */}
        <p className="text-center text-gray-500 mt-12">
          © 2025 <strong>Career Vidya Edu-Tech Private Limited</strong>. All
          Rights Reserved.
        </p>
      </div>
    </div>
  );
}
