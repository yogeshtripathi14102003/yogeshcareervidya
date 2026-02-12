import React from 'react';

// Data for EMI partner logos
const emiPartners = [
  { id: 1, src: '/images/Eduvanz.png', alt: 'Eduvanz Logo' },
  { id: 2, src: '/images/LiquiLoans.png', alt: 'LiquiLoans Logo' },
  { id: 3, src: '/images/GreyQuest.png', alt: 'GreyQuest Logo' },
];

const AdmissionFee = () => {
  return (
    <section className="py-12 bg-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Admission Fee & Financing
        </h2>

        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* --- 1. EMI Options Section --- */}
          <div className="p-6 md:p-8 bg-red-400 text-white">
            <h3 className="text-2xl font-bold mb-2">Easy EMI Options Available</h3>
            <p className="text-gray-100 mb-6">
              Pay in easy monthly installments with our EMI options. No more worrying about finances — start your learning journey today!
            </p>
            
            {/* EMI Partner Logos */}
            <div className="flex flex-wrap items-center space-x-6">
              {emiPartners.map(partner => (
                <div key={partner.id} className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity">
                  <img 
                    src={partner.src} 
                    alt={partner.alt} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- 2. Complete Payment Section --- */}
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Complete Payment</h3>
            <p className="text-gray-600 mb-6">
              Participants can make a one-time payment easily using options such as:
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
            </div>

            {/* Final Note */}
            <p className="text-gray-600 mt-4 pt-4 border-t border-gray-100">
              Learners can pay yearly or semester-wise. Easy financing options available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFee;
