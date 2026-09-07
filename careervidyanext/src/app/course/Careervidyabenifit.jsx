"use client";

import Image from "next/image";
import Link from "next/link";

// Partner logos - EMI/Loan partners
const partners = [
  { name: "LIQUILOANS", src: "/logos/liquiloans.png", alt: "LiquiLoans" },
  { name: "EarlySalary", src: "/logos/earlysalary.png", alt: "EarlySalary" },
  { name: "eduvanz", src: "/logos/eduvanz.png", alt: "Eduvanz" },
  { name: "FinancePeer", src: "/logos/financepeer.png", alt: "FinancePeer" },
  { name: "PropelId", src: "/logos/propelid.png", alt: "PropelId" },
  { name: "Credenc", src: "/logos/credenc.png", alt: "Credenc" },
  { name: "Jodo", src: "/logos/jodo.png", alt: "Jodo" },
];

export default function Careervidyabenifit({ courseBenifit = [], courseTitle }) {
  if (!courseBenifit || courseBenifit.length === 0) return null;

  return (
    <section className="bg-blue-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold">
          Career Vidya Benefits for {courseTitle}
        </h2>

        {/* Benefit List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 text-left">
          {courseBenifit.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors"
            >
              {typeof item === "string" ? (
                <p className="text-sm md:text-base font-medium leading-relaxed">
                  {item}
                </p>
              ) : (
                <>
                  {item.title && (
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  )}
                  <p className="text-sm md:text-base font-medium leading-relaxed text-white/90">
                    {item.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            href="#"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg"
          >
            Apply For No Cost EMI →
          </Link>
          <Link
            href="#"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg"
          >
            Compare EMI Partners →
          </Link>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white p-3 rounded-md flex items-center justify-center w-full h-16"
            >
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