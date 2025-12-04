// components/SpecializationsGrid.js

const specializations = [
  { name: 'Finance Management', universities: 27 },
  { name: 'Business Analytics', universities: 11 },
  { name: 'Healthcare Management', universities: 4 },
  { name: 'Hospital Management', universities: 2 },
  { name: 'HR Management', universities: 19 },
  { name: 'Operations Management', universities: 12 },
  // ... and so on
];

const SpecializationsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {specializations.map((spec, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
        >
          {/* Placeholder for Icon (You would use an actual SVG/Icon here) */}
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
             {/* Example icon, replace with your actual icon */}
             <span className="text-blue-600 text-xl">💼</span> 
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">{spec.name}</h3>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center">
              Compare <span className="font-bold mx-1">{spec.universities}</span> Universities
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecializationsGrid;