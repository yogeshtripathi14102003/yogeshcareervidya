


// import CourseDetailClient from "@/app/course/CourseDetailClient.jsx";
// import { serverFetch } from "@/utlis/serverFetch"; // ✅ import

// async function getCourseData(slug) {
//   const res = await serverFetch(`/api/v1/course/slug/${slug}`, {
//     next: { revalidate: 60 }
//   });
//   const data = await res.json();
//   return data?.course || null;
// }

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const course = await getCourseData(slug);
//   return {
//     title: course ? `${course.name} | CareerVidya` : "Course Not Found",
//     description: course?.overview?.[0]?.description?.substring(0, 150) || "Explore this course.",
//   };
// }

// export default async function Page({ params }) {
//   const { slug } = await params;
//   const course = await getCourseData(slug);

//   if (!course) return <p className="p-8 text-center">Course not found.</p>;

//   return <CourseDetailClient course={course} />;
// }

import CourseDetailClient from "@/app/course/CourseDetailClient.jsx";
import { serverFetch } from "@/utlis/serverFetch";
import { notFound } from "next/navigation";

async function getCourseData(slug) {
  const { ok, data } = await serverFetch(`/api/v1/course/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!ok) return null;
  return data?.course || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourseData(slug);

  // ✅ If the course genuinely doesn't exist OR the API call failed,
  // this still returns a clean, real title — never "Loading".
  if (!course) {
    return {
      title: "Course Not Found",
      robots: { index: false, follow: true }, // don't index dead/broken pages
    };
  }

  return {
    title: `${course.name} | CareerVidya`,
    description:
      course?.overview?.[0]?.description?.substring(0, 150) ||
      "Explore this course.",
    alternates: {
      canonical: `https://careervidya.in/course/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const course = await getCourseData(slug);

  // ✅ Using notFound() instead of returning plain text triggers Next's
  // proper 404 page (and a real 404 HTTP status) instead of a 200 OK
  // page with "Course not found" text — which is bad for SEO because
  // Google would otherwise index a "soft 404" as if it were valid content.
  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}