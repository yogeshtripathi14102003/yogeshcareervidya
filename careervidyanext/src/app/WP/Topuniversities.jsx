// UniversitySelector.jsx
import Image from 'next/image';

// Placeholder data structure based on the image
const universityData = [
  {
    id: 1,
    name: "Kalinga University",
    logoSrc: "/images/kalinga_logo.png", // Update path
    rating: 4.5,
    specializations: ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Computer Science Engineering", "Electronics & Communication Engineering"],
    duration: "3 Year",
    emi: "7,000",
  },
  {
    id: 2,
    name: "Sanskriti University",
    logoSrc: "/images/sanskriti_logo.png", // Update path
    rating: 4.6,
    specializations: ["Computer Science Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    duration: "3 Year",
    emi: "6,000",
  },
  {
    id: 3,
    name: "Jawaharlal Nehru University",
    logoSrc: "/images/jnu_logo.png", // Update path (Placeholder: JNU is used for the third card)
    rating: 4.5,
    specializations: ["Civil Engineering", "Computer Science Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
    duration: "3 Year",
    emi: "7,000",
  },
  {
    id: 4,
    name: "Lingaya's University",
    logoSrc: "/images/lingayas_logo.png", // Update path
    rating: 4.3,
    specializations: ["Civil Engineering", "Computer Science Engineering", "Electronics & Communication Engineering", "Mechanical Engineering"],
    duration: "3 Year",
    emi: "8,000",
  },
];

// Reusable University Card Component
const UniversityCard = ({ data }) => {
  // Take only the first 3 specializations to show initially, as per the image design
  const visibleSpecializations = data.specializations.slice(0, 3);
  
  // Determine if there are more specializations hidden by the scrollbar
  const hasMoreSpecs = data.specializations.length > visibleSpecializations.length;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
      
      {/* Top Section: Logo and Rating */}
      <div className="flex justify-between items-start mb-4">
        {/* University Logo Area */}
        <div className="w-2/3 h-16 relative border border-gray-200 rounded-lg p-2 flex items-center justify-center">
          <Image
            src={data.logoSrc}
            alt={data.name}
            width={120}
            height={40}
            objectFit="contain"
          />
        </div>
        
        {/* Rating Badge */}
        <div className="bg-yellow-100 text-yellow-800 font-bold px-2 py-1 rounded-md text-sm flex items-center">
          ⭐️ {data.rating}/5
        </div>
      </div>

      {/* Specializations Section */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800 mb-2 text-sm">Specialization Offered</p>
        <div className="relative border border-gray-300 p-2 rounded-lg max-h-24 overflow-y-auto custom-scrollbar">
          
          {visibleSpecializations.map((spec, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700 leading-relaxed">
              <span className="text-blue-600 mr-2">■</span> {spec}
            </div>
          ))}
          
          {/* Visual cue for scrollbar/more content (as seen in the image) */}
          {hasMoreSpecs && (
             <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 opacity-70 cursor-pointer">
                ▲<br/>▼
             </div>
          )}
        </div>
      </div>

      {/* Details (Duration & EMI) */}
      <div className="flex justify-between text-sm mt-4 border-t pt-4">
        <div>
          <p className="text-gray-500">Duration:</p>
          <p className="font-bold text-gray-800">{data.duration}</p>
        </div>
        <div>
          <p className="text-gray-500">EMI Starting:</p>
          <p className="font-bold text-blue-600">₹ {data.emi}/Month</p>
        </div>
      </div>
    </div>
  );
};


export default function UniversitySelector() {
  return (
    // Section Container with light gray background
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12">
          Universities You Can Choose From
        </h2>

        {/* Grid Container for Cards (Responsive 2-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {universityData.map((university) => (
            <UniversityCard key={university.id} data={university} />
          ))}
        </div>
        
      </div>
    </section>
  );
}