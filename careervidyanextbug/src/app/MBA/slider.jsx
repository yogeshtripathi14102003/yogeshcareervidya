import React from 'react';
// import Image from 'next/image'; // For production, use the Next.js Image component

// Dummy data representing the logos
const logos = [
  // NOTE: Ensure these images are placed in your public folder (e.g., public/logos/acca.png)
  { id: 1, src: '/images/DEB.png', alt: 'ACCA Accredited Program' },
  { id: 2, src: '/images/HBP.png', alt: 'NIRF' },
  { id: 3, src: '/images/AIU.png', alt: 'UGC Dedo Approved Program' },
  { id: 4, src: '/images/AICTE.png', alt: 'No. 1 by World University Rankings' },
  { id: 5, src: '/images/ACCA.png', alt: 'Harvard Business Publishing Education' },
  { id: 6, src: '/images/NIRF.png', alt: 'WES' },
];

const LogoSlider = () => {
  return (
    <section className="py-12 bg-gray-50">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-8 px-4">
        Our Online MBA Programs are Globally Accredited
      </h2>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/*
          Horizontal Scroll Wrapper:
          - overflow-x-auto enables manual horizontal scrolling.
          - scrollbar-hide (if configured) hides the scrollbar.
          - whitespace-nowrap forces all logos onto a single line.
          - min-w-full helps center the logos when they fit on one line.
        */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex justify-center items-center space-x-8 md:space-x-12 py-4 whitespace-nowrap min-w-full">
            {logos.map((logo) => (
              <div
                key={logo.id}
                // flex-shrink-0 is crucial to prevent the logo boxes from shrinking
                className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 bg-white border border-gray-200 rounded-lg shadow-sm p-2 flex items-center justify-center transition duration-300 hover:shadow-lg" 
              >
                {/* Standard <img> tag is used */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain"
                  style={{ minWidth: '80px', minHeight: '40px' }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;