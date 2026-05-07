

import CourseDetailClient from "@/app/course/CourseDetailClient.jsx";

async function getCourseData(slug) {
  const res = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/course/slug/${slug}`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  return data?.course || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseData(slug);
  return {
    title: course ? `${course.name} | CareerVidya` : "Course Not Found",
    description: course?.overview?.[0]?.description?.substring(0, 150) || "Explore this course.",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const course = await getCourseData(slug);

  if (!course) return <p className="p-8 text-center">Course not found.</p>;

  return <CourseDetailClient course={course} />;
}