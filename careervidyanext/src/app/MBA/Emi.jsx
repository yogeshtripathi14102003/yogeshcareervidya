import React from 'react';
// import Image from 'next/image'; // For production, use the Next.js Image component

// Data for EMI partner logos (paths must be valid in your public folder)
const emiPartners = [
  { id: 1, src: '/images/Eduvanz.png', alt: 'grayQuest Logo' },
  { id: 2, src: '/images/LiquiLoans.png', alt: 'Eduvanz Logo' },
  { id: 3, src: '/images/GreyQuest.png', alt: 'LiquiLoans Logo' },
];

const AdmissionFee = () => {
  // Define fee variables
  const originalFee = '2,00,000/-';
  const discountedFee = '1,58,000';

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Admission Fee & Financing
        </h2>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* --- 1. EMI Options Section (Dark Background) --- */}
          <div className="p-6 md:p-8 bg-gray-800 text-white">
            <h3 className="text-2xl font-bold mb-2">Easy EMI Options Available</h3>
            <p className="text-gray-300 mb-6">
              Pay in easy monthly installments with our EMI options. No more worrying about finances; start your learning journey today!
            </p>
            
            {/* EMI Partner Logos */}
            <div className="flex flex-wrap items-center space-x-6">
              {emiPartners.map(partner => (
                <div key={partner.id} className="h-8 md:h-10 w-auto opacity-75 hover:opacity-100 transition-opacity">
                  <img 
                    src={partner.src} 
                    alt={partner.alt} 
                    className="max-h-full max-w-full object-contain"
                  />
                  {/* NOTE: Ensure these logo images are in your /public/logos folder */}
                </div>
              ))}
            </div>
          </div>

          {/* --- 2. Complete Payment Section (Light Background) --- */}
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Complete Payment</h3>
            <p className="text-gray-600 mb-6">
              Participants can make one-time payment easily using options such as:
            </p>

            {/* Payment Icons */}
            <div className="flex flex-wrap justify-between md:justify-start gap-8 md:gap-16 mb-8">
              
              {/* Internet Banking */}
              <div className="flex flex-col items-center w-24 text-center">
                <img src="/images/credit.png" alt="Internet Banking" className="w-12 h-12 mb-2" />
                <p className="text-sm text-gray-700">Internet Banking</p>
              </div>

              {/* Credit/Debit Card */}
              <div className="flex flex-col items-center w-24 text-center">
                <img src="/images/bank.png" alt="Credit/Debit Card" className="w-12 h-12 mb-2" />
                <p className="text-sm text-gray-700">Credit/Debit Card</p>
              </div>
              
              {/* Fee Comparison (Styled to match the image) */}
              <div className="flex items-center self-start md:self-auto ml-0 md:ml-auto">
                <span className="relative text-xl font-bold text-gray-600 mr-4">
                  INR {originalFee}
                  {/* Red line through the old price */}
                  <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-600 transform -translate-y-1/2"></span>
                </span>
                <button className="bg-[#FFA500] text-white font-bold py-2 px-4 rounded-lg text-lg hover:bg-red-700 transition duration-300">
                  <span className="line-through">INR {originalFee}</span>
                </button>
              </div>
            </div>
            
            {/* Discounted Fee */}
            <p className="text-2xl md:text-3xl font-bold mt-4">
                After Early Bird Discount of 25% <span className="text-[#FFA500]">INR {discountedFee}</span>
            </p>

            {/* Final Note */}
            <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100">
              Learners can pay by year or semester. Easy financing options available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFee;