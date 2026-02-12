"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
    const disableCopyKeys = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", disableCopyKeys);
    return () => {
      document.removeEventListener("keydown", disableCopyKeys);
    };
  }, []);

  const faqs = [
    { id: 1, question: "What is Career Vidya?", answer: "Career Vidya is an Edu-Tech platform that provides students and working professionals with unbiased personalized career counselling, online course guidance, and admission support for top universities and institutes across India and abroad." },
    { id: 2, question: "What services does Career Vidya offer?", answer: "We offer career counselling, university/course selection assistance, admission guidance, scholarship information, and placement preparation support." },
    { id: 3, question: "Are your counselling services free?", answer: "We offer both free initial counselling sessions and premium guidance packages." },
    { id: 4, question: "How can I book a counselling session?", answer: "You can book a session via our website or contact our support team." },
    { id: 5, question: "Does Career Vidya guarantee admission or placement?", answer: "No, final decisions depend on universities and employers." },
    { id: 6, question: "Which courses and universities do you guide for?", answer: "UG, PG, Diploma, and Online Programs across UGC-approved universities." },
    { id: 7, question: "How does Career Vidya ensure transparency?", answer: "We only partner with verified universities and provide accurate data." },
    { id: 8, question: "Can working professionals get counselling?", answer: "Yes, we specialize in counselling for working professionals." },
    { id: 9, question: "How can I contact Career Vidya?", answer: "📧 info@careervidya.in\n📞 +91-9289712364" },
    { id: 10, question: "Is my personal information safe?", answer: "Yes, we follow strict privacy policies." },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 8); // Slice 8 so it looks balanced in 2 columns

  if (!mounted) return null;

  return (
    <div className="bg-white h-auto" onCopy={(e) => e.preventDefault()}>
      {/* Container width badha di hai landscape look ke liye */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16"> 
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
          Frequently Asked Questions
        </h2>

        {/* 🛠️ Grid Layout: Mobile pe 1 column, Tablets/Laptops pe 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {visibleFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border rounded-lg bg-white shadow-sm hover:shadow-md transition self-start"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-[#0057A0] text-white w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs">
                    {faq.id}
                  </span>
                  <span className="font-medium text-sm md:text-base">{faq.question}</span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-gray-700 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-4 md:px-12 pb-4 text-gray-600 text-sm whitespace-pre-line leading-relaxed border-t pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {faqs.length > 8 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-2.5  bg-[#c15304] text-white rounded-md font-semibold hover: bg-[#c15304] transition-all shadow-md"
            >
              {showAll ? "View Less ↑" : "View All FAQ ↓"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}