// import UniversitiesClient from "./UniversitiesClient";
// import { serverFetch } from "@/utlis/serverFetch"; // ✅ add karo

// export const metadata = {
//   title: "Top Online Courses & Universities for Students & Working Professionals | CareerVidya",
//   description: "Boost your career with UGC-recognized UG, PG, and Executive programs. Compare top universities, check fees, and enroll in job-oriented courses designed for working professionals.",
//   keywords: [
//     "online degrees for working professionals",
//     "top universities for MBA and MCA",
//     "UGC recognized online courses",
//     "executive education programs india",
//     "part time courses for professionals",
//   ].join(", "),
// };

// async function getUniversities() {
//   try {
//     const res = await serverFetch("/api/v1/university", { // ✅ yahi change kiya
//       next: { revalidate: 3600 }
//     });
//     const data = await res.json();
//     return data?.data || [];
//   } catch (err) {
//     console.error("Server Fetch Error:", err);
//     return [];
//   }
// }

// export default async function Page() {
//   const initialData = await getUniversities();
//   return <UniversitiesClient initialData={initialData} />;
// }

import UniversitiesClient from "./UniversitiesClient";
import { serverFetch } from "@/utlis/serverFetch";

export const metadata = {
  title: "Top Online Courses & Universities for Students & Working Professionals | CareerVidya",
  description: "Boost your career with UGC-recognized UG, PG, and Executive programs. Compare top universities, check fees, and enroll in job-oriented courses designed for working professionals.",
  keywords: [
    "online degrees for working professionals",
    "top universities for MBA and MCA",
    "UGC recognized online courses",
    "executive education programs india",
    "part time courses for professionals",
  ].join(", "),
};

async function getUniversities() {
  const { ok, data } = await serverFetch("/api/v1/university", {
    next: { revalidate: 3600 },
  });

  // ✅ serverFetch already catches network/timeout errors internally and
  // returns ok:false — no need for a separate try/catch here anymore.
  if (!ok) return [];

  return data?.data || [];
}

export default async function Page() {
  const initialData = await getUniversities();
  return <UniversitiesClient initialData={initialData} />;
}