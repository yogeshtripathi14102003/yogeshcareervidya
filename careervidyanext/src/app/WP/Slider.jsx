// BTechBanner.jsx
import Image from 'next/image';

export default function BTechBanner() {
  return (
    // The main container height is h-96
    <div className="relative w-full text-white overflow-hidden h-96">
      
      {/* 1. Full Background Image (Worker Image) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/OIP.jpg" // CHANGE THIS PATH
          alt="Working Professional"
          layout="fill"
          objectFit="cover"
          // IMPORTANT CHANGE: object-position-right ensures the right side of the image
          // (where the worker is) is prioritized when the image scales to fit the container.
          objectPosition="right" 
        />
      </div>

      {/* 2. Full Dark Overlay */}
      {/* Using a semi-transparent dark gray overlay */}
      <div className="absolute inset-0 bg-gray-700 opacity-90 z-10" /> 

      {/* 3. Main Content Container (Content must be above the overlay, so z-20) */}
      {/* py-10 for vertical compression, h-full to occupy the full banner height */}
      <div className="relative z-20 max-w-7xl mx-auto py-10 px-8 md:px-16 flex flex-col justify-start h-full">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          <span className="text-yellow-400"> Program For Working Professional</span>
          <br />
          For 4x Growth
        </h1>

        <div className="space-y-4">
          
          {/* University Approvals Section */}
          <div>
            <p className="text-gray-300 mb-2 text-sm md:text-base">Universities Approved by:</p>
            <div className="flex flex-wrap items-center space-x-4">
              {/* Approval Logos */}
              <div className="flex flex-col items-center text-xs w-16">
                <Image src="/images/ugc.png" alt="UGC" width={30} height={30} />
                <span className="mt-1 text-center hidden sm:block">University Grant Commission</span>
              </div>
              <div className="flex flex-col items-center text-xs w-16">
                <Image src="/images/aiu.png" alt="AIU" width={30} height={30} />
                <span className="mt-1 text-center hidden sm:block">Association of Indian Universities</span>
              </div>
              <div className="flex flex-col items-center text-xs w-16">
                <Image src="/images/bci.png" alt="BCI" width={30} height={30} />
                <span className="mt-1 text-center hidden sm:block">Bar Council of India</span>
              </div>
            </div>
          </div>

          {/* Growth and Scholarship Info */}
          <div className="pt-2">
            <div className="flex items-center space-x-3">
              <p className="text-xl font-bold text-gray-200">
                <span className="text-green-400">📈</span> 52% Growth
              </p>
              
              {/* Scholarship Left Badge */}
              <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-semibold rounded-full shadow-lg">
                Few Scholarships left
              </div>
            </div>
          </div>
          
          {/* Call to Action Button */}
          <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-300 mt-2 text-base">
            Select Your University
          </button>
        </div>
      </div>
    </div>
  );
}