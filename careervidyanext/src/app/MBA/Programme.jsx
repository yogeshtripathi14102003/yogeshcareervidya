import React, { useState } from "react";

// Feature cards data
const featureCards = [
  { id: 1, iconSrc: "/icons/export.png", title: "Harvard Certified Modules" },
  { id: 2, iconSrc: "/icons/gudence.png", title: "25% Early Bird Concession" },
  { id: 3, iconSrc: "/icons/Recommendation.png", title: "300+ Hiring Partners" },
  { id: 4, iconSrc: "/icons/Assistance.png", title: "Free Industry Experts Session" },
  { id: 5, iconSrc: "/icons/end.png", title: "24x7 Learner Support" },
  { id: 6, iconSrc: "/icons/callsupport.png", title: "World-Class LMS Platform" },
  { id: 7, iconSrc: "/images/21.png", title: "Career & Placement Assistance" },
  { id: 8, iconSrc: " /images/221.png", title: "Acclaimed Global Faculty" },
];

// You Will Learn cards
const learnCards = [
  {
    id: 1,
    iconSrc: "/images/30.png",
    title: "Leadership & Strategic Thinking",
    // desc: "Develop the ability to lead teams and drive business growth through effective decision-making and innovation.",
  },
  {
    id: 2,
    iconSrc: "/images/29.png",
    title: "Business Analytics & Data Insights",
    // desc: "Learn to interpret and apply data to make informed business decisions in competitive environments.",
  },
  {
    id: 3,
    iconSrc: "/images/28.png",
    title: "Managerial Communication",
    // desc: "Master business communication, presentation, and negotiation skills for leadership success.",
  },
  {
    id: 4,
    iconSrc: "/images/27.png",
    title: "Global Business Perspective",
    // desc: "Gain insights into global market trends and strategies to manage cross-cultural business operations effectively.",
  },
];

// Industry-Led Pedagogy cards
const pedagogyCards = [
  {
    id: 1,
    iconSrc: "/images/26.png",
    title: "Live Interactive Classes",
    // desc: "Engage in real-time discussions and Q&A sessions with faculty to enhance conceptual clarity.",
  },
  {
    id: 2,
    iconSrc: "/images/25.png",
    title: "Industry Projects",
    // desc: "Work on live business problems and real-world case studies from top organizations.",
  },
  {
    id: 3,
    iconSrc: "/images/24.png",
    title: "Expert Mentorship",
    // desc: "Receive guidance and feedback from seasoned industry mentors for career acceleration.",
  },
  {
    id: 4,
    iconSrc: "/images/23.png",
    title: "Continuous Assessment",
    // desc: "Evaluate progress through quizzes, assignments, and capstone projects aligned with learning goals.",
  },
];

const ProgrammeOverview = () => {
  const [activeTab, setActiveTab] = useState("highlights");

  return (
    <section className="py-16 bg-gradient-to-b from-[#F9FAFF] to-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl font-bold text-center text-[#1E90FF] mb-4 relative  mx-auto block w-fit">
          Programme Overview
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#FFA500] w-full rounded-full"></span>
        </h2>

        {/* Description */}
        <p className="text-center text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
          The Online MBA Program is a two-year postgraduate degree offering dual
          specialization options, designed to prepare aspiring leaders and
          managers for dynamic global business environments. Open to graduates
          from any academic background, the program delivers an in-depth blend
          of management theory and practical application through an
          industry-aligned curriculum. Students can pursue two areas of
          specialization to enhance their knowledge and diversify their career
          prospects. The program emphasizes experiential learning through case
          studies, live projects, and real-world business simulations, ensuring
          graduates are job-ready and strategically equipped for leadership
          roles.
        </p>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-center mb-12 space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => setActiveTab("highlights")}
            className={`py-3 px-6 rounded-md text-lg font-medium transition-all duration-300 ${
              activeTab === "highlights"
                ? "bg-[#1E90FF] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-[#E6F3FF]"
            }`}
          >
            Programme Highlights
          </button>

          <button
            onClick={() => setActiveTab("learn")}
            className={`py-3 px-6 rounded-md text-lg font-medium transition-all duration-300 ${
              activeTab === "learn"
                ? "bg-[#1E90FF] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-[#E6F3FF]"
            }`}
          >
            You Will Learn
          </button>

          <button
            onClick={() => setActiveTab("pedagogy")}
            className={`py-3 px-6 rounded-md text-lg font-medium transition-all duration-300 ${
              activeTab === "pedagogy"
                ? "bg-[#1E90FF] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-[#E6F3FF]"
            }`}
          >
            Industry-Led Pedagogy
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* Highlights */}
          {activeTab === "highlights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-[#1E90FF]/40 
                  transition-all duration-500 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-[#E6F3FF] hover:to-[#FFF7E6]"
                >
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <img
                      src={card.iconSrc}
                      alt={card.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E90FF]">
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          )}

          {/* You Will Learn */}
          {activeTab === "learn" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {learnCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start text-left border border-[#1E90FF]/40 
                  transition-all duration-500 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-[#E6F3FF] hover:to-[#FFF7E6]"
                >
                  <div className="w-12 h-12 mb-3 flex items-center justify-center">
                    <img
                      src={card.iconSrc}
                      alt={card.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E90FF] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pedagogy */}
          {activeTab === "pedagogy" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pedagogyCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-start text-left border border-[#1E90FF]/40 
                  transition-all duration-500 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-[#E6F3FF] hover:to-[#FFF7E6]"
                >
                  <div className="w-12 h-12 mb-3 flex items-center justify-center">
                    <img
                      src={card.iconSrc}
                      alt={card.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E90FF] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgrammeOverview;
