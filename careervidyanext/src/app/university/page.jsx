// import UniversityDetail from "@/app/university/UniversityDetail.jsx";
// import { serverFetch } from "@/utlis/serverFetch"; // ✅

// async function getUniversities() {
//   const res = await serverFetch("/api/v1/university", { // ✅
//     next: { revalidate: 60 }
//   });
//   const data = await res.json();
//   return data.data || [];
// }

// export default async function Page() {
//   const list = await getUniversities();
//   return <UniversityDetail initialUniversities={list} />;
// }


import UniversityDetail from "@/app/university/UniversityDetail.jsx";
import { serverFetch } from "@/utlis/serverFetch";

export const dynamic = "force-dynamic";

async function getUniversities() {
  const { ok, data } = await serverFetch("/api/v1/university", {
    next: { revalidate: 60 },
  });

  if (!ok) return [];
  return data?.data || [];
}

// ✅ This listing page had no metadata at all before — it was inheriting
// the generic root layout title/description for every visit.
export const metadata = {
  title: "Top Online Universities & Courses in India | CareerVidya",

  description:
    "Explore top UGC-recognized online universities and degree programs in India. Compare MBA, MCA, BBA, BCA, M.Com, and other online courses, fees, eligibility, and career options for students and working professionals.in india",

  alternates: {
    canonical: "https://careervidya.in/university",
  },
};

export default async function Page() {
  const list = await getUniversities();
  return <UniversityDetail initialUniversities={list} />;
}
