import Link from "next/link";

{/* Course Cards */}
<div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
  {filteredCourses.map((course) => (
    <Link
      key={course._id}
      href={`/course/${course.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
    >
      <img
        src={course.courseLogo?.url || "/placeholder.jpg"}
        alt={course.name}
        className="w-full h-40 object-contain mb-3"
      />
      <h2 className="text-lg font-semibold text-gray-800">
        {course.name}
      </h2>
      <p className="text-sm text-gray-600">{course.category}</p>
      <p className="text-sm text-gray-500">{course.duration}</p>
      <div className="text-xs text-blue-600 mt-1">
        {course.specialization?.join(", ")}
      </div>
    </Link>
  ))}
</div>
