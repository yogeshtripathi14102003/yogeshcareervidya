// ProgramHighlights.jsx
import Image from 'next/image';

const features = [
  "Flexible classes for working professionals",
  "No entrance exam required",
  "AICTE & UGC-approved regular degree",
  "Boost your career with promotions & salary hikes",
  "Learn by doing through hands-on, remote-access labs",
  "Get real-world insights from experienced professionals",
];

const FeatureItem = ({ text }) => (
  <div className="flex items-start text-gray-700 mb-2">
    {/* Custom blue checkmark icon (as seen in the image) */}
    <span className="text-blue-600 mr-2 mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
    <p className="text-base leading-relaxed">{text}</p>
  </div>
);

export default function ProgramHighlights() {
  return (
    // Outer section styling: Light blue background and vertical padding
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid */}
        {/* Grid layout for responsiveness (Image on left, Text on right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: Image */}
          <div className="relative w-full h-80 md:h-full flex justify-center md:justify-end">
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/highlight_image.jpg" // CHANGE THIS PATH
                alt="Working professional pointing to futuristic interface"
                width={400} // Set explicit width and height for optimization
                height={400}
                className="object-cover"
                layout="responsive"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Text and Features */}
          <div className="p-4">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              Program Highlights
            </h2>
            
            <div className="space-y-4">
              {features.map((text, index) => (
                <FeatureItem key={index} text={text} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}