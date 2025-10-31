"use client";

import { useState } from 'react';
import Link from 'next/link';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: 1, title: 'IIT Delhi', type: 'College', description: 'Top engineering college in India', location: 'Delhi' },
    { id: 2, title: 'JEE Main 2024', type: 'Exam', description: 'Joint Entrance Examination Main', date: 'Jan 2024' },
    { id: 3, title: 'Delhi Public School', type: 'School', description: 'CBSE affiliated school', location: 'Delhi' },
    { id: 4, title: 'NEET 2024', type: 'Exam', description: 'National Eligibility cum Entrance Test', date: 'May 2024' },
    { id: 5, title: 'BITS Pilani', type: 'College', description: 'Premier institute of technology', location: 'Pilani' },
    { id: 6, title: 'St. Xavier\'s School', type: 'School', description: 'ICSE affiliated school', location: 'Mumbai' },
  ]);
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const filteredResults = searchResults.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(result => 
    filterType === 'all' || result.type.toLowerCase() === filterType
  );

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-[#F5F5F5] p-4 border-b border-[#333333]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link href="/">
              <img src="/CV LOGO BACKGROUND.jpg" alt="Logo" className="h-16 w-auto" />
            </Link>
          </div>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search Colleges, Exams, Schools & more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#1E90FF] rounded-full p-2 pl-10 w-full text-[#333333] focus:outline-none text-sm shadow-md hover:shadow-lg"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-[#1E90FF] mb-4">Filters</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="filterType"
                  value="all"
                  checked={filterType === 'all'}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mr-2"
                />
                All
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="filterType"
                  value="college"
                  checked={filterType === 'college'}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mr-2"
                />
                Colleges
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="filterType"
                  value="exam"
                  checked={filterType === 'exam'}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mr-2"
                />
                Exams
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="filterType"
                  value="school"
                  checked={filterType === 'school'}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mr-2"
                />
                Schools
              </label>
            </div>
            <div className="mt-6">
              <button className="w-full bg-[#FFA500] text-white py-2 rounded-md hover:bg-[#87CEEB]">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#1E90FF]">
                  Search Results for "{searchQuery || 'everything'}"
                </h2>
                <span className="text-gray-600">
                  {filteredResults.length} results found
                </span>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {currentResults.length > 0 ? (
                  currentResults.map((result) => (
                    <Link href={`/search/${result.id}`} key={result.id} className="block">
                      <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#333333]">{result.title}</h3>
                            <span className="inline-block bg-[#1E90FF] text-white px-2 py-1 rounded-full text-sm mt-1">
                              {result.type}
                            </span>
                            <p className="text-gray-600 mt-2">{result.description}</p>
                            {result.location && (
                              <p className="text-gray-500 text-sm mt-1">📍 {result.location}</p>
                            )}
                            {result.date && (
                              <p className="text-gray-500 text-sm mt-1">📅 {result.date}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            <button className="bg-[#FFA500] text-white px-3 py-1 rounded-full text-sm hover:bg-[#87CEEB]">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                    <p className="text-gray-500">Try adjusting your search terms</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? 'bg-[#1E90FF] text-white'
                          : 'border border-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#333333] text-white py-4 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Career Vidya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;