"use client";

import Image from "next/image";

// ✅ Make sure these images are in: public/images/ 
const highlightsData = [
  { img: "/images/b1.jpg", description: "Free Expert Counselling" },
  { img: "/images/b2.jpg", description: "Personalized Guidance" },
  { img: "/images/b3.jpg", description: "No-Cost EMI & Loan Support" },
  { img: "/images/b4.jpg", description: "100% Placement Assistance" },
  { img: "/images/b5.jpg", description: "Access To 10,000+ Alumni Network" },
  { img: "/images/b6.jpg", description: "Globally Recognized Degrees" },
  { img: "/images/b7.jpg", description: "Admission Documentation Support" },
  { img: "/images/b8.jpg", description: "Post Admission Academic Help" },
  { img: "/images/b9.jpg", description: "Transparent University Guidance" },
  { img: "/images/b10.jpg", description: "End To End Career Support" },
];

// ✅ Highlight card component
const HighlightCard = ({ img, description }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg h-full transition duration-300 hover:shadow-xl transform hover:scale-[1.02]">
    
    {/* Image Icon Area */}
    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-50 rounded-lg overflow-hidden">
      <Image 
        src={img} 
        alt={description} 
        width={48} 
        height={48} 
        className="object-contain"
        priority={true} // ✅ ensures images load quickly
      />
    </div>
    
    {/* Description Text */}
    <p className="text-center text-gray-700 font-bold text-xs leading-snug">
      {description}
    </p>
  </div>
);

// ✅ Main component
export default function KeyHighlights() {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12 md:mb-16 uppercase tracking-tight">
           CAREER VIDYA BENEFITS 
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6 lg:gap-8">
          {highlightsData.map((item, index) => (
            <HighlightCard 
              key={index} 
              img={item.img} 
              description={item.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
