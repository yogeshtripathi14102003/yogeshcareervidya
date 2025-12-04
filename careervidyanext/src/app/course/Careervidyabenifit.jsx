"use client";

import Image from "next/image";
import Link from "next/link";

// Import your logos or place them in the /public folder
const partners = [
  { name: "LIQUILOANS", src: "/logos/liquiloans.png", alt: "LiquiLoans" },
  { name: "EarlySalary", src: "/logos/earlysalary.png", alt: "EarlySalary" },
  { name: "eduvanz", src: "/logos/eduvanz.png", alt: "Eduvanz" },
  { name: "FinancePeer", src: "/logos/financepeer.png", alt: "FinancePeer" },
  { name: "PropelId", src: "/logos/propelid.png", alt: "PropelId" },
  { name: "Credenc", src: "/logos/credenc.png", alt: "Credenc" },
  { name: "Jodo", src: "/logos/jodo.png", alt: "Jodo" },
];

export default function EmiSection() {
  return (
    <section className="bg-blue-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold">
          Education Loan/EMI Facilities for Online MBA
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base max-w-3xl mx-auto">
          Students in educational colleges and universities and banking institutions choose "EMI" as their educational pathway selection option. Through online EMI services, you can enroll in the MBA course program because these payment methods reduce cost rates. Workers can access this service through university finances and regular educational loan programs that many employers provide.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="#" className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg">
            Apply For No Cost EMI →
          </Link>
          <Link href="#" className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg">
            Compare EMI Partners →
          </Link>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.name} className="bg-white p-3 rounded-md flex items-center justify-center w-full h-16">
              <Image
                src={partner.src}
                alt={partner.alt}
                width={100}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
