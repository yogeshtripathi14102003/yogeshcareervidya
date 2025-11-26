"use client";

import { useState } from 'react';

// --- Data for FAQs ---
const faqData = [
  {
    question: "Is there any entrance exam to take admission in the B.Tech program?",
    answer: "No, applicants do not have to take an entrance exam for admission to B.Tech (Lateral Entry) Program with Flexible Timing program. You just have to fill up the application form for the same.",
  },
  {
    question: "Is B.Tech (Lateral Entry) Program with Flexible Timing approved by AICTE?",
    answer: "Yes, the B.Tech (Lateral Entry) Program with Flexible Timing is generally approved by relevant statutory bodies like AICTE and UGC. Please verify the approval status for your chosen university.",
  },
  {
    question: "How will I get the study material for the B.Tech (Lateral Entry) Program with Flexible Timing program?",
    answer: "The study material is usually provided online through the university's Learning Management System (LMS). Some programs may also offer physical material depending on the university's policy.",
  },
  {
    question: "What is the duration of the B.Tech (Lateral Entry) Program with Flexible Timing program?",
    answer: "The duration for the B.Tech (Lateral Entry) program is typically 3 years, as it allows entry directly into the second year after a diploma or equivalent qualification.",
  },
  {
    question: "What should I expect from the program?",
    answer: "You can expect flexible scheduling, remote lab access, industry-relevant curriculum, and dedicated placement assistance to boost your career growth.",
  },
  {
    question: "Why B.Tech (Lateral Entry) Program with Flexible Timing?",
    answer: "This program is ideal for working professionals who want to upgrade their skills and qualifications without quitting their jobs, offering 3x to 4x career growth potential.",
  },
];

const FAQItem = ({ question, answer, isOpen, toggleFAQ }) => (
  <div className="border-b border-gray-200">
    {/* Question Header */}
    <button
      className={`flex justify-between items-center w-full text-left py-4 px-4 transition duration-300 ${isOpen ? 'bg-blue-50 text-blue-800' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      onClick={toggleFAQ}
    >
      <span className="flex items-center font-medium text-base md:text-lg">
        {/* Star Icon */}
        <span className="text-yellow-500 mr-3">⭐️</span>
        {question}
      </span>
      {/* Chevron Icon */}
      <svg
        className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {/* Answer Content */}
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0'}`}
    >
      <p className="px-4 text-gray-600 text-sm md:text-base pb-4 pl-10">
        {answer}
      </p>
    </div>
  </div>
);

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // Start with the first item open, as in the image

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 border-b-2 border-blue-600 inline-block pb-1">
          Frequently Asked Questions
        </h2>

        {/* Accordion Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleFAQ={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}