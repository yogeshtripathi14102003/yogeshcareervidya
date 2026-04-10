// app/courses/page.jsx

import CoursesClient from "./CoursesClient";

export const metadata = {
  title: "Job-Oriented Professional Courses | CareerVidya",
  description:
    "Explore UG, PG, Executive & Doctorate courses. Boost your career with CareerVidya.",
  keywords:
    "courses, job oriented courses, pg courses, ug courses, executive education",
  openGraph: {
    title: "Job-Oriented Professional Courses | CareerVidya",
    description:
      "Explore career-focused courses designed for job growth.",
    type: "website",
  },
};

async function getInitialCourses() {
  try {
    const res = await fetch(
      "https://api.careervidya.in/api/v1/short?page=1&limit=12",
      { cache: "no-store" }
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