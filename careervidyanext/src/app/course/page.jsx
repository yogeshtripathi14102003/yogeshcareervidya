

import Link from "next/link";

async function getCourses() {
  const res = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/course`, { cache: 'no-store' });
  const data = await res.json();
  return data.courses || [];
}

export default async function CourseCardSection() {
  const courses = await getCourses();
  const filteredCourses = courses.slice(0, 10);

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
        {filteredCourses.map((course) => (
          <Link key={course._id} href={`/course/${course.slug}`} className="...">
            <img src={course.courseLogo?.url} alt={course.name} className="w-full h-40 object-contain" />
            <h2 className="text-lg font-semibold">{course.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}