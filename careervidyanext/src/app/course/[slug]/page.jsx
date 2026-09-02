// import CourseDetailClient from "@/app/course/CourseDetailClient.jsx";
// import { serverFetch } from "@/utlis/serverFetch";
// import { notFound } from "next/navigation";

// async function getCourseData(slug) {
//   const { ok, data } = await serverFetch(`/api/v1/course/slug/${slug}`, {
//     next: { revalidate: 60 },
//   });

//   if (!ok) return null;
//   return data?.course || null;
// }

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const course = await getCourseData(slug);

//   // ✅ If the course genuinely doesn't exist OR the API call failed,
//   // this still returns a clean, real title — never "Loading".
//   if (!course) {
//     return {
//       title: "Course Not Found",
//       robots: { index: false, follow: true }, // don't index dead/broken pages
//     };
//   }

//   return {
//     title: `${course.name} | CareerVidya`,
//     description:
//       course?.overview?.[0]?.description?.substring(0, 150) ||
//       "Explore this course.",
//     alternates: {
//       canonical: `https://careervidya.in/course/${slug}`,
//     },
//   };
// }

// export default async function Page({ params }) {
//   const { slug } = await params;
//   const course = await getCourseData(slug);

//   // ✅ Using notFound() instead of returning plain text triggers Next's
//   // proper 404 page (and a real 404 HTTP status) instead of a 200 OK
//   // page with "Course not found" text — which is bad for SEO because
//   // Google would otherwise index a "soft 404" as if it were valid content.
//   if (!course) {
//     notFound();
//   }

//   return <CourseDetailClient course={course} />;
// }

import CourseDetailClient from "@/app/course/CourseDetailClient.jsx";
import { serverFetch } from "@/utlis/serverFetch";
import { notFound } from "next/navigation";

const SITE_URL = "https://careervidya.in";

async function getCourseData(slug) {
  const { ok, data } = await serverFetch(
    `/api/v1/course/slug/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!ok) return null;

  return data?.course || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const course = await getCourseData(slug);

  // Course does not exist
  if (!course) {
    return {
      title: "Course Not Found | CareerVidya",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const courseName = course.name?.trim() || "Online Course";

  const description =
    course?.overview?.[0]?.description
      ?.replace(/<[^>]*>/g, "")
      ?.replace(/\s+/g, " ")
      ?.trim()
      ?.slice(0, 155) ||
    `Explore ${courseName}, including eligibility, fees, duration, and career opportunities at CareerVidya.`;

  const canonicalUrl = `${SITE_URL}/course/${slug}`;

  return {
    title: `${courseName} | CareerVidya`,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${courseName} | CareerVidya`,
      description,
      url: canonicalUrl,
      siteName: "CareerVidya",
      type: "website",
      locale: "en_IN",
      images: course?.courseLogo?.url
        ? [
            {
              url: course.courseLogo.url,
              alt: courseName,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${courseName} | CareerVidya`,
      description,
      images: course?.courseLogo?.url
        ? [course.courseLogo.url]
        : undefined,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const course = await getCourseData(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}