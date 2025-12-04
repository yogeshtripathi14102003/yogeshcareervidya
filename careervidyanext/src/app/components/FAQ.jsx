"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqs = [
    {
      id: 1,
      question: "What is Career Vidya?",
      answer:
        "Career Vidya is an Edu-Tech platform that provides students and working professionals with unbiased personalized career counselling, online course guidance, and admission support for top universities and institutes across India and abroad.",
    },
    {
      id: 2,
      question: "What services does Career Vidya offer?",
      answer:
        "We offer career counselling, university/course selection assistance, admission guidance, scholarship information, and placement preparation support. Our goal is to help learners make informed career decisions and achieve their professional goals.",
    },
    {
      id: 3,
      question: "Are your counselling services free?",
      answer:
        "We offer both free initial counselling sessions and premium guidance packages depending on the level of support required — including one-on-one expert counselling and complete admission assistance.",
    },
    {
      id: 4,
      question: "How can I book a counselling session?",
      answer:
        "You can easily book a session through our website’s “Book Counselling” form or by contacting our support team via WhatsApp, email, or phone. Our counsellor will reach out to confirm your slot.",
    },
    {
      id: 5,
      question: "Does Career Vidya guarantee admission or placement?",
      answer:
        "No, we do not guarantee admission, internship, or job placement. Final decisions depend on respective universities, institutions, and employers. However, we ensure you receive the best possible guidance to maximize your success chances.",
    },
    {
      id: 6,
      question: "Which courses and universities do you guide for?",
      answer:
        "We provide guidance for UG, PG, Diploma, and Online Learning Programs including MBA, BBA, B.Tech, MCA, M.Com, BA, B.Sc, and more — across UGC-approved universities and AICTE-recognized institutes in India and abroad.",
    },
    {
      id: 7,
      question: "How does Career Vidya ensure authenticity and transparency?",
      answer:
        "We only partner with verified universities and share accurate, up-to-date information regarding courses, eligibility, and fees. Our recommendations are unbiased and based on your academic profile and goals.",
    },
    {
      id: 8,
      question: "Can working professionals also get counselling?",
      answer:
        "Absolutely. We specialize in helping working professionals choose the right online or distance learning programs to upgrade their skills and career prospects.",
    },
    {
      id: 9,
      question: "How can I contact Career Vidya?",
      answer:
        "You can reach us via:\n📧 Email: info@careervidya.in\n📞 Phone/WhatsApp: +91-9289712364\n🌐 Website: www.careervidya.in",
    },
    {
      id: 10,
      question: "Is my personal information safe with Career Vidya?",
      answer:
        "Yes, your data is completely safe. We follow strict privacy policies and do not share your personal information with third parties without consent.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 7);

  if (!mounted) return <div className="min-h-[200px]" />;

  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {visibleFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-[#0057A0] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold">
                    {faq.id}
                  </span>
                  <span className="text-gray-900 font-medium">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-12 pb-4 text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {faqs.length > 7 && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 text-white bg-[#0057A0] hover:bg-[#00447f] rounded-md font-semibold transition"
            >
              {showAll ? "View Less ↑" : "View All ↓"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
