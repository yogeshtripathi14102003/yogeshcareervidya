// KeyHighlights.jsx

const highlightsData = [
  {
    icon: '⚙️', // Using emojis as placeholder icons; replace with actual SVG/Image components if needed.
    title: 'Flexible Classes',
    description: 'Flexible Classes', // Description is the same as the title in the image
    // You can use a dedicated icon component here: <IconGear className="w-8 h-8 text-blue-600" />
  },
  {
    icon: '⌚',
    title: 'Direct 2nd Year Lateral Entry',
    description: 'Direct 2nd Year Lateral Entry',
  },
  {
    icon: '💰',
    title: '15% Scholarship',
    description: '15% Scholarship',
  },
  {
    icon: '⚖️',
    title: '100% Placement assistance',
    description: '100% Placement assistance',
  },
  {
    icon: '🔄',
    title: '100% Easy EMI Option',
    description: '100% Easy EMI Option',
  },
];

const HighlightCard = ({ icon, title }) => (
  // Card styling: White background, rounded corners, shadow, and large padding
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg h-full transition duration-300 hover:shadow-xl transform hover:scale-[1.02]">
    
    {/* Icon Area: Blue background circle and blue icon */}
    <div className="flex items-center justify-center w-14 h-14 mb-4 bg-blue-50 rounded-lg">
      {/* NOTE: In a real Next.js project, you would replace this emoji with an
        actual SVG icon component or a dedicated Image component pointing to your icon file.
      */}
      <span className="text-3xl text-blue-600">{icon}</span> 
    </div>
    
    {/* Title */}
    <p className="text-center text-gray-700 font-medium text-sm md:text-base">
      {title}
    </p>
  </div>
);

export default function KeyHighlights() {
  return (
    // Outer section styling: Light blue background and vertical padding
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-12 md:mb-16">
          Key Highlights
        </h2>

        {/* Cards Grid Container */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6 lg:gap-8">
          {highlightsData.map((item, index) => (
            <HighlightCard 
              key={index} 
              icon={item.icon} 
              title={item.title} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}