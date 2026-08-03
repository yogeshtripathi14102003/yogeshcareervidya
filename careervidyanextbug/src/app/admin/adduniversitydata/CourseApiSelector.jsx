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
    try {
      const response = await api.get("/api/v1/course");
      const fetchedData = Array.isArray(response.data)
        ? response.data
        : response.data.courses || [];
      setCourseApiData(fetchedData);
      
      const preSelected = {};
      fetchedData.forEach((item, index) => {
        const itemID = item._id?.toString() || item.id?.toString();
        if (courses.some(c => c.courseId === itemID)) {
          preSelected[index] = true;
        }
      });
      setSelectedCoursesFromApi(preSelected);
    } catch (error) {
      setMessage("❌ Error fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelection = (course, index, isChecked) => {
    setSelectedCoursesFromApi((prev) => ({ ...prev, [index]: isChecked }));

    const extractedId = course._id?.toString() || course.id?.toString();

    if (isChecked) {
      const newCourseEntry = {
        courseId: extractedId, 
        courseSlug: course.slug || "", // Added course slug here
        name: course.name || "",
        duration: course.duration || "N/A",
        logo: course.courseLogo?.url || course.logo || null, 
        fees: "", 
        details: "", 
      };

      setCourses((prev) => {
        const exists = prev.find((c) => c.courseId === extractedId);
        return exists ? prev : [...prev, newCourseEntry];
      });
    } else {
      setCourses((prev) => prev.filter((c) => c.courseId !== extractedId));
    }
  };

  const handleInputChange = (index, field, value) => {
    setCourses((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-700">Select Courses from Master API</h4>
        <button
          type="button"
          onClick={fetchCoursesFromApi}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Fetch Courses"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 max-h-40 overflow-y-auto">
        {courseApiData.map((course, index) => (
          <label key={course._id || index} className="flex items-center space-x-2 p-2 bg-white border rounded cursor-pointer">
            <input
              type="checkbox"
              checked={!!selectedCoursesFromApi[index]}
              onChange={(e) => handleCourseSelection(course, index, e.target.checked)}
              className="accent-blue-600"
            />
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs truncate font-medium">{course.name}</span>
                <span className="text-[10px] text-gray-400 truncate">{course.slug}</span>
            </div>
          </label>
        ))}
      </div>

      {courses.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Fees</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={course.courseId || idx} className="border-t">
                  <td className="px-4 py-2 font-medium">
                    {course.name}
                    <div className="text-[10px] text-blue-500">{course.courseSlug}</div>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={course.fees}
                      onChange={(e) => handleInputChange(idx, "fees", e.target.value)}
                      className="border rounded w-full p-1"
                      placeholder="50k/year"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={course.details}
                      onChange={(e) => handleInputChange(idx, "details", e.target.value)}
                      className="border rounded w-full p-1"
                      placeholder="Highlights..."
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