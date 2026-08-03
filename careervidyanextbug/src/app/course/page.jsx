import Link from "next/link";
import Image from "next/image";
import { serverFetch } from "@/utlis/serverFetch";

export const metadata = {
  title: "Explore Courses",
  description:
    "Browse top online MBA, BBA, BCA and specialization courses from leading universities. Compare fees, duration, and eligibility to find the right course for you.",
  alternates: { canonical: "/course" },
  openGraph: {
    title: "Explore Courses | CareerVidya",
    description: "Browse top online MBA, BBA, BCA and specialization courses from leading universities.",
    url: "/course",
    type: "website",
  },
};

async function getCourses() {
  const { ok, data } = await serverFetch("/api/v1/course", { cache: "no-store" });
  if (!ok) return [];
  return data?.courses || [];
}

export default async function CourseCardSection() {
  const courses = await getCourses();
  const filteredCourses = courses.slice(0, 10);

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
        {filteredCourses.map((course) => (
          <Link key={course._id} href={`/course/${course.slug}`} className="...">
            <div className="relative w-full h-40">
              <Image
                src={course.courseLogo?.url || "/fallback.png"}
                alt={course.name}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-contain"
              />
            </div>
            <h2 className="text-lg font-semibold">{course.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
