



import CoursesClient from "@/app/coursesseo/CoursesClient.jsx";

export const metadata = {
  title: "Job-Oriented Professional Courses | CareerVidya",
  description: "Explore our wide range of professional courses in PG, Executive, UG, and Doctorate categories.",
};

async function getInitialCourses() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/short?limit=24`);
  const data = await res.json();
  return data.courses || [];
}

export default async function Page() {
  const courses = await getInitialCourses();
  return <CoursesClient initialCourses={courses} />;
}