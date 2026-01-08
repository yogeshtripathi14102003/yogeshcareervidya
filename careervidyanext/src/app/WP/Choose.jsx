// CollegeVidyaAndLearners.jsx
import Image from 'next/image';
import {
  GraduationCap,
  Users,
  Headset,
  ShieldCheck,
  University,
  FileText,
  CreditCard,
  Briefcase,
} from "lucide-react";

// --- Data for "Why choose College Vidya" cards ---
const careervidyaVidyaReasons = [
  {
    icon: GraduationCap,
    title: "Academic Assistance",
    stats: "",
    description: "Post-Admission & Academic Assistance",
  },
  {
    icon: Users,
    title: "Counselling",
    stats: "",
    description: "Free Counselling Before Admission",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    stats: "",
    description: "Dedicated Relationship Manager Support",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Process",
    stats: "",
    description: "Cost-Effective & Transparent Process",
  },
  {
    icon: University,
    title: "Trusted Universities",
    stats: "",
    description: "Partnership with Top Recognized Universities",
  },
  {
    icon: FileText,
    title: "Document Support",
    stats: "",
    description: "Complete Documentation & Verification Support",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    stats: "",
    description: "Safe, Secure & Hassle-Free Fee Payments",
  },
  {
    icon: Briefcase,
    title: "Career Guidance",
    stats: "",
    description: "Career & Placement Guidance After Admission",
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

export default function CareervidyaVidyaAndLearners() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Section 1: Why choose College Vidya --- */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12">
          Why Career Vidya Stands Apart
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 md:mb-32">
        {careervidyaVidyaReasons.map((item, index) => {
  const Icon = item.icon;
  return (
    <div key={index} className="p-6 bg-white rounded-xl shadow text-center">
      <Icon className="w-10 h-10 mx-auto text-blue-600 mb-3" />
      <h3 className="font-semibold text-lg">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
  );
})}

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