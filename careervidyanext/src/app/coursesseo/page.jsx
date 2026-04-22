import CoursesClient from "@/app/coursesseo/CoursesClient.jsx";

export const dynamic = "force-dynamic"; // ✅ build crash fix

export const metadata = {
  title: "Job-Oriented Professional Courses | CareerVidya",
  description:
    "Explore our wide range of professional courses in PG, Executive, UG, and Doctorate categories.",
};

async function getInitialCourses() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/short?limit=24`,
      {
        cache: "no-store",
      }
    );

    // ❌ agar API fail ho
    if (!res.ok) {
      console.error("API Status Error:", res.status);
      return [];
    }

    const contentType = res.headers.get("content-type");

    // ❌ agar JSON nahi hai (HTML aa raha hai)
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("❌ API returned HTML:", text.slice(0, 200));
      return [];
    }

    // ✅ safe JSON parse
    const data = await res.json();
    return data.courses || [];

  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function Page() {
  const courses = await getInitialCourses();

  return <CoursesClient initialCourses={courses} />;
}