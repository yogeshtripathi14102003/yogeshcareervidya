    // components/SpecializationsPage.js
import FilterSidebar  from  "./components/FilterSidebar.jsx";
import SpecializationsGrid from "./components/SpecializationsGrid.jsx";

const SpecializationsPage = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* 1. Sidebar Container (fixed width) */}
      <aside className="w-80 border-r border-gray-200 bg-white p-6 shadow-xl">
        <FilterSidebar />
      </aside>

      {/* 2. Main Content Container (takes remaining space) */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Online MBA Specialisations</h1>
        <SpecializationsGrid />
      </main>
      
    </div>
  );
};

export default SpecializationsPage;