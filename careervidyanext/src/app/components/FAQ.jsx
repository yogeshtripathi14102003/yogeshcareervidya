"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      id: 1,
      question: "Is Career Vidya affiliated with any university?",
      answer:
        "Yes. We are official partners with leading UGC, AICTE, and NAAC-approved universities — including Vikrant University, Glocal University, Dr. Preeti Global University, Chandigarh University, Kurukshetra University, OP Jindal, and more.",
    },
    {
      id: 2,
      question: "Is Career Vidya free to use?",
      answer:
        "Yes, our counselling and guidance services are completely free. You only pay your university’s admission fees — not us.",
    },
    {
      id: 3,
      question: "Which courses can I apply for through Career Vidya?",
      answer:
        "You can explore and apply for B.Tech, M.Tech, BBA, MBA, BCA, MCA, Diploma, and B.Sc programs, with 30+ specializations across online and regular learning modes.",
    },
    {
      id: 4,
      question: "Are these universities and courses government approved?",
      answer:
        "Yes! All universities listed on our platform are UGC-entitled and AICTE, NAAC, or AIU-approved — ensuring full validity for higher studies and government/private jobs.",
    },
    {
      id: 5,
      question: "Do online degrees hold the same value as regular ones?",
      answer:
        "Absolutely. As per UGC-DEB guidelines, online degrees from recognized universities are equally valid as regular degrees for both jobs and further education.",
    },
    {
      id: 6,
      question: "How does the counselling process work?",
      answer:
        "Once you contact us, a Career Vidya counsellor will connect with you via call or Zoom to understand your goals and preferences. We’ll help shortlist universities, explain approvals, and guide you through the admission process.",
    },
    {
      id: 7,
      question: "How does Career Vidya ensure unbiased counselling?",
      answer:
        "Our counsellors are trained to provide data-based, transparent comparisons across 100+ universities and 30+ factors — so your choice is guided by facts, not sales.",
    },
    {
      id: 8,
      question: "Does Career Vidya charge any counselling fee?",
      answer:
        "No. Career Vidya offers free counselling. You only pay the official university fee.",
    },
    {
      id: 9,
      question: "Are EMI or easy payment options available?",
      answer:
        "Yes, we offer low-cost EMI options and low cost instalment plans for many universities, helping students manage education finances easily.",
    },
    {
      id: 10,
      question: "Is my payment safe through Career Vidya?",
      answer:
        "100%. All payments are made directly to the official university accounts through secure portals. We never ask for personal payment details.",
    },
    {
      id: 11,
      question: "How do I verify if a university or course is approved?",
      answer:
        "You can check every university’s approval directly on the UGC-DEB, AICTE, or AIU official websites or ask your counsellor to provide verification links.",
    },
    {
      id: 12,
      question: "Are Career Vidya’s partner universities valid for government jobs?",
      answer:
        "Yes. All our partner universities are recognized under UGC regulations, making their degrees valid for government, PSU, and private sector jobs.",
    },
    {
      id: 13,
      question: "What kind of career support do you provide?",
      answer:
        "We provide career mapping, alumni interaction, resume guidance, and placement awareness through partner universities and webinars.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      {/* ===== Heading ===== */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
        Let’s clear up some doubts
      </h2>

      {/* ===== FAQ List ===== */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="border rounded-lg overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold">
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
              <div className="px-12 pb-4 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== View More Button ===== */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md font-semibold transition">
          View More →
        </button>
      </div>
    </section>
  );
}
