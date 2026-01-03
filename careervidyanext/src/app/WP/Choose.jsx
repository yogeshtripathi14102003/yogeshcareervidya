// CollegeVidyaAndLearners.jsx
import Image from 'next/image';

// --- Data for "Why choose College Vidya" cards ---
const collegeVidyaReasons = [
  {
    iconSrc: "/icons/end.png", 
    title: "Academic Assistance",
    stats: "",
    description: "Post-Admission & Academic Assistance ",
  },
  {
    iconSrc: "/icons/gudence.png", 
    title: "Counselling",
    stats: "",
    description: " Free Counselling Before Admission",
  },
  {
    iconSrc: "/icons/callsupport.png", 
    title: "Dedicated Support",
    stats: "",
    description: "Dedicated Relationship Manager Support ",
  },
  {
    iconSrc: "/icons/all.jpg", 
    title: "Transparent Process",
    stats: "",
    description: "Cost-Effective & Transparent Process ",
  },
];

// --- Data for "Learners from the best organizations" ---
const learnersData = [
  {
    imageSrc: "/images/GyanenduSundarRana.png", 
    name: "Amit Kumar",
    companyLogoSrc: "/images/sum.jpeg", 
    companyAlt: "Samsung Logo",
  },
  {
    imageSrc: "/images/Praveensingh.png", 
    name: "Prabhat",
    companyLogoSrc: "/images/hcl2.jpeg", 
    companyAlt: "HCL Logo",
  },
  {
    imageSrc: "/images/GopalSharma.png", 
    name: "Shankar",
    companyLogoSrc: "/images/inf1.jpeg",   
    companyAlt: "Infosys Logo",
  },
  {
    imageSrc: "/images/AtulKumar.png", 
    name: "Sunil",
    companyLogoSrc: "/images/t1.png", 
    companyAlt: "Tata Logo",
  },
];

// Reusable Card for "Why choose College Vidya" section
const ReasonCard = ({ iconSrc, title, stats, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 h-full text-center">
    <Image src={iconSrc} alt={title} width={48} height={48} className="mb-4 object-contain" />
    <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-600 mb-2">{stats}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

// Reusable Card for "Learners from the best organizations" section
const LearnerCard = ({ imageSrc, name, companyLogoSrc, companyAlt }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 h-full text-center">
    {/* Image Container: "object-top" aur "object-contain" cropping ko prevent karta hai */}
    <div className="relative w-[120px] h-[120px] mb-4">
      <Image 
        src={imageSrc} 
        alt={name} 
        width={120} 
        height={120} 
        className="rounded-full object-contain object-top aspect-square border border-gray-50" 
      />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
    <div className="h-6 flex items-center justify-center">
      <Image 
        src={companyLogoSrc} 
        alt={companyAlt} 
        width={80} 
        height={24} 
        className="object-contain" 
      />
    </div>
  </div>
);

export default function CollegeVidyaAndLearners() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Section 1: Why choose College Vidya --- */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12">
          Why Career Vidya Stands Apart
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 md:mb-32">
          {collegeVidyaReasons.map((reason, index) => (
            <ReasonCard key={index} {...reason} />
          ))}
        </div>

        {/* --- Section 2: Learners from the best organizations --- */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-4">
          Professionals Who Choose to Grow
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Representing experience across domains and industries 
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {learnersData.map((learner, index) => (
            <LearnerCard key={index} {...learner} />
          ))}
        </div>
      </div>
    </section>
  );
}