"use client";
import api from "@/utlis/api.js";

export default function CourseApiSelector({
  courseApiData,
  setCourseApiData,
  selectedCoursesFromApi,
  setSelectedCoursesFromApi,
  courses,
  setCourses,
  loading,
  setLoading,
  setMessage,
}) {
  
  const fetchCoursesFromApi = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await api.get("/api/v1/course");
      const fetchedData = Array.isArray(response.data)
        ? response.data
        : response.data.courses || [];

      setCourseApiData(fetchedData);
      setSelectedCoursesFromApi({});
      setMessage(`✅ ${fetchedData.length} courses fetched successfully.`);
    } catch (error) {
      setMessage("❌ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelection = (course, index, isChecked) => {
    // Checkbox state update
    setSelectedCoursesFromApi((prev) => ({ ...prev, [index]: isChecked }));

    if (isChecked) {
      // Naya course object jo database schema se match karta hai
      const newCourseEntry = {
        name: course.name || "",
        duration: course.duration || "",
        logo: course.logo || null,
        fees: "",    // Initial value empty string, null nahi
        details: "", // Initial value empty string, null nahi
      };

      // Sirf tab add karein agar pehle se list mein na ho
      setCourses((prev) => {
        const exists = prev.find((c) => c.name === course.name);
        return exists ? prev : [...prev, newCourseEntry];
      });
    } else {
      // Uncheck karne par array se delete karein taaki empty data na jaye
      setCourses((prev) => prev.filter((c) => c.name !== course.name));
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...courses];
    if (updatedCourses[index]) {
      updatedCourses[index][field] = value;
      setCourses(updatedCourses);
    }
  };

  return (
    <div className="mb-6 space-y-4 bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
      <h4 className="font-bold text-purple-800 text-lg">Course Selection</h4>

      <button
        type="button"
        onClick={fetchCoursesFromApi}
        disabled={loading}
        className="bg-[#6A0DAD] text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-medium"
      >
        {loading ? "Fetching..." : "Fetch Master Courses"}
      </button>

      {/* Grid for Selection */}
      {courseApiData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-xl border">
          {courseApiData.map((course, index) => (
            <label key={index} className="flex items-center space-x-2 border p-3 rounded-lg bg-white cursor-pointer hover:border-purple-500 transition shadow-sm">
              <input
                type="checkbox"
                checked={!!selectedCoursesFromApi[index]}
                onChange={(e) => handleCourseSelection(course, index, e.target.checked)}
                className="w-4 h-4 accent-purple-700"
              />
              <span className="text-sm font-semibold truncate">{course.name}</span>
            </label>
          ))}
        </div>
      )}

      {/* Input Table - Sirf tab dikhega jab length > 0 ho */}
      {courses.length > 0 && (
        <div className="mt-4 border rounded-xl overflow-hidden border-purple-200">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-50 text-purple-900 font-bold">
              <tr>
                <th className="p-4 text-left">Selected Course</th>
                <th className="p-4 text-left">Fees</th>
                <th className="p-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 bg-white">
              {courses.map((course, idx) => (
                <tr key={idx}>
                  <td className="p-4 font-bold text-gray-800">{course.name}</td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={course.fees || ""} 
                      onChange={(e) => handleInputChange(idx, "fees", e.target.value)}
                      placeholder="Enter amount"
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={course.details || ""} 
                      onChange={(e) => handleInputChange(idx, "details", e.target.value)}
                      placeholder="Enter notes"
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}