// app/courses/page.jsx

import CoursesClient from "./CoursesClient";

export const metadata = {
  title: "Job-Oriented Professional Courses | CareerVidya",
  description:
    "Explore UG, PG, Executive & Doctorate courses. Boost your career with CareerVidya.",
  keywords:
    "job oriented courses, online courses india, ug pg courses, executive programs, career growth courses",

  // ✅ OPEN GRAPH (Social Sharing)
  openGraph: {
    title: "Job-Oriented Professional Courses | CareerVidya",
    description:
      "Explore career-focused courses designed for job growth.",
    url: "https://www.careervidya.in/courses",
    siteName: "CareerVidya",
    type: "website",
    images: [
      {
        url: "https://www.careervidya.in/og-image.jpg", // 👉 add real image
        width: 1200,
        height: 630,
      },
    ],
  },

  // ✅ TWITTER SEO
  twitter: {
    card: "summary_large_image",
    title: "Job-Oriented Professional Courses | CareerVidya",
    description:
      "Explore career-focused courses designed for job growth.",
    images: ["https://www.careervidya.in/og-image.jpg"],
  },

  // ✅ CANONICAL URL (VERY IMPORTANT)
  alternates: {
    canonical: "https://www.careervidya.in/courses",
  },
};

// ✅ SSR DATA FETCH (SEO friendly)
async function getInitialCourses() {
  try {
    const res = await fetch(
      "https://api.careervidya.in/api/v1/short?page=1&limit=24",
      {
        next: { revalidate: 60 }, // 🔥 ISR (best for SEO + performance)
      }
    );

    const data = await res.json();
    return data?.courses || [];
  } catch (err) {
    return [];
  }
}

export default async function Page() {
  const initialCourses = await getInitialCourses();

  return <CoursesClient initialCourses={initialCourses} />;
}