// CollegeVidyaAndLearners.jsx
import Image from 'next/image';

// --- Data for "Why choose College Vidya" cards ---
const collegeVidyaReasons = [
  {
    iconSrc: "/images/icon-compare.png", // Replace with actual paths
    title: "Compare",
    stats: "6M+ happy students",
    description: "Compare thousands of courses",
  },
  {
    iconSrc: "/images/icon-counselling.png", // Replace with actual paths
    title: "Counselling",
    stats: "18+ years in sports",
    description: "Expert counselling services",
  },
  {
    iconSrc: "/images/icon-community.png", // Replace with actual paths
    title: "Community",
    stats: "8M+ joined the tribe",
    description: "Vibrant student community",
  },
  {
    iconSrc: "/images/icon-career.png", // Replace with actual paths
    title: "Career",
    stats: "1M+ placed into jobs",
    description: "Dedicated career support",
  },
];

// --- Data for "Learners from the best organizations" ---
const learnersData = [
  {
    imageSrc: "/images/learner-amit.jpg", // Replace with actual paths
    name: "Amit Kumar",
    companyLogoSrc: "/images/logo-samsung.png", // Replace with actual paths
    companyAlt: "Samsung Logo",
  },
  {
    imageSrc: "/images/learner-prabhat.jpg", // Replace with actual paths
    name: "Prabhat",
    companyLogoSrc: "/images/logo-hcl.png", // Replace with actual paths
    companyAlt: "HCL Logo",
  },
  {
    imageSrc: "/images/learner-shankar.jpg", // Replace with actual paths
    name: "Shankar",
    companyLogoSrc: "/images/logo-infosys.png", // Replace with actual paths
    companyAlt: "Infosys Logo",
  },
  {
    imageSrc: "/images/learner-sunil.jpg", // Replace with actual paths
    name: "Sunil",
    companyLogoSrc: "/images/logo-tata.png", // Replace with actual paths
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
    <Image 
      src={imageSrc} 
      alt={name} 
      width={120} 
      height={120} 
      className="rounded-full object-cover mb-4 aspect-square" 
    />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
    <Image 
      src={companyLogoSrc} 
      alt={companyAlt} 
      width={80} 
      height={24} 
      className="object-contain" 
    />
  </div>
);

export default function CollegeVidyaAndLearners() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Section 1: Why choose College Vidya --- */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12">
          Why choose College Vidya
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 md:mb-32">
          {collegeVidyaReasons.map((reason, index) => (
            <ReasonCard key={index} {...reason} />
          ))}
        </div>

        {/* --- Section 2: Learners from the best organizations --- */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-4">
          Learners from the best organizations
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          with diverse background and profile
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