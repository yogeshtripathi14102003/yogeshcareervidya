// components/FilterSidebar.js
import { Search, ChevronRight } from 'lucide-react'; // Example using a react icon library

const FilterSidebar = () => {
  const filterOptions = [
    { name: 'Online MBA', subtext: 'PG Courses' },
    { name: '1 Year MBA Online', subtext: 'PG Courses' },
    { name: 'Distance MBA', subtext: 'PG Courses' },
    { name: 'Executive MBA for Working Professionals', subtext: 'PG Courses' },
    // ... add all other options
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Filter by Course Type</h2>

      {/* Search Input Field */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search "
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Filter Options List */}
      <div className="space-y-1">
        {filterOptions.map((option, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              option.name === 'Online MBA' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            <div>
              <p className="font-medium text-sm">{option.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'inherit' }}>{option.subtext}</p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;