import React from "react";

export default function CourseFAQ({ faqs, courseTitle }) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  /* ═══════════════════════════════════════════════
     SEO: FAQPage JSON-LD Schema
  ═══════════════════════════════════════════════ */
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
        className="w-full py-16 md:py-20 font-sans"
        style={{ background: "#fff" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10">
          {/* ═══════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════ */}
          <header className="mb-10 md:mb-12 text-left">
            <span
              className="inline-block font-bold text-xs md:text-sm uppercase tracking-widest"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              📝 FAQ's
            </span>

            <h2
              id="faq-heading"
              className="text-3xl md:text-4xl lg:text-[42px] font-extrabold mt-3 leading-[1.15] tracking-tight"
              style={{ color: "var(--cv-primary)" }}
            >
              {/* Uncomment agar chahiye */}
              {/* <span style={{ color: "var(--cv-accent)" }}>Let's clear up</span>{" "}
              <span style={{ color: "var(--cv-primary)" }}>some doubts</span> */}
            </h2>
          </header>

          {/* ═══════════════════════════════════════════
              FAQ LIST
          ═══════════════════════════════════════════ */}
          <div className="space-y-5 md:space-y-6">
            {faqs.map((faq, index) => (
              <article
                key={index}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="rounded-2xl px-6 py-6 md:px-8 md:py-7 transition-colors duration-200"
                style={{ background: "var(--cv-primary-light)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#DBEAFE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--cv-primary-light)";
                }}
              >
                {/* Question — Navy */}
                <h3
                  itemProp="name"
                  className="text-[17px] md:text-[19px] font-bold mb-3.5 md:mb-4 leading-snug tracking-tight"
                  style={{
                    color: "var(--cv-primary)",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {faq.question}
                </h3>

                {/* Answer — Dark grey */}
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className="text-[15px] md:text-[16px] leading-[1.7]"
                  style={{
                    color: "var(--cv-neutral-dark)",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
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