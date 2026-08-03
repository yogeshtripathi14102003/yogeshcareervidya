"use client";

import Image from "next/image";

const learnersData = [
  { imageSrc: "/images/GyanenduSundarRana.png", name: "Amit Kumar", companyLogoSrc: "/images/sum.jpeg" },
  { imageSrc: "/images/Praveensingh.png", name: "Prabhat", companyLogoSrc: "/images/hcl2.jpeg" },
  { imageSrc: "/images/GopalSharma.png", name: "Shankar", companyLogoSrc: "/images/inf1.jpeg" },
  { imageSrc: "/images/AtulKumar.png", name: "Sunil", companyLogoSrc: "/images/lt.png" },
  { imageSrc: "/images/teti1.png", name: "Vishal", companyLogoSrc: "/images/webkul.jpeg" },
];

const LearnerCard = ({ imageSrc, name, companyLogoSrc }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-w-[240px] mx-3">
    {/* Learner Image - No Crop */}
    <div className="w-24 h-24 mb-4 relative overflow-hidden rounded-full border border-gray-100 bg-gray-50">
      <Image 
        src={imageSrc} 
        alt={name} 
        fill 
        sizes="96px"
        className="object-contain p-1" // object-contain se photo crop nahi hogi
      />
    </div>

    <h3 className="font-bold text-gray-800 text-lg">{name}</h3>

    {/* Company Logo - Colorful */}
    <div className="relative w-24 h-10 mt-3 flex items-center justify-center">
      <Image 
        src={companyLogoSrc} 
        alt="company" 
        fill 
        sizes="100px"
        className="object-contain" // Grayscale hata diya hai, ab ye colorful dikhega
      />
    </div>
  </div>
);

export default function LearnersSlider() {
  return (
    <section className="bg-slate-50 py-16 overflow-hidden">
      <style jsx>{`
        .slider-track {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite; 
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        /* Mouse le jaane par slider ruk jayega */
        .slider-wrapper:hover .slider-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
          Professionals Who Choose to Grow
        </h2>
        <p className="text-gray-600 mb-12 italic">
          Representing experience across domains and industries
        </p>

        <div className="slider-wrapper relative">
          {/* Side Fading Effects */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 hidden md:block"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 hidden md:block"></div>

          <div className="slider-track">
            {/* Seamless loop setup */}
            {[...learnersData, ...learnersData, ...learnersData].map((learner, i) => (
              <LearnerCard key={i} {...learner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}