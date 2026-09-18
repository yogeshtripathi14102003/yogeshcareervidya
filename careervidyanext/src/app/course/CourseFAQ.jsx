import React from "react";

export default function CourseFAQ({ faqs, courseTitle }) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  // SEO: FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section
        aria-labelledby="faq-heading"
        className="w-full py-16 md:py-20 bg-white font-sans"
      >
        {/* Wider container: max-w-[1600px] */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10">

          {/* Header */}
          <header className="mb-10 md:mb-12 text-left">
            <span className="inline-block text-gray-500 font-bold text-xs md:text-sm uppercase tracking-widest">
              📝 FAQ's
            </span>

            <h2
              id="faq-heading"
              className="text-3xl md:text-4xl lg:text-[42px] font-extrabold mt-3 leading-[1.15] tracking-tight"
            >
              {/* <span className="text-blue-600">Let's clear up</span>{" "}
              <span className="text-[#0B1B3D]">some doubts</span> */}
            </h2>
          </header>

          {/* FAQ List */}
          <div className="space-y-5 md:space-y-6">
            {faqs.map((faq, index) => (
              <article
                key={index}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="bg-[#F2F7FB] rounded-2xl px-6 py-6 md:px-8 md:py-7 transition-colors duration-200 hover:bg-[#E8F0F9]"
              >
                {/* Question */}
                <h3
                  itemProp="name"
                  className="text-[17px] md:text-[19px] font-bold text-[#0B1B3D] mb-3.5 md:mb-4 leading-snug tracking-tight"
                  style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                >
                  {faq.question}
                </h3>

                {/* Answer */}
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className="text-gray-700 text-[15px] md:text-[16px] leading-[1.7]"
                  style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                >
                  <span
                    itemProp="text"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}