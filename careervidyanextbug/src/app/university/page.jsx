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
  title: "Top Online Universities in India | CareerVidya",
  description:
    "Browse UGC-approved online universities in India. Compare fees, courses, accreditation, and admission process before you apply.",
  alternates: {
    canonical: "https://careervidya.in/university",
  },
};

export default async function Page() {
  const list = await getUniversities();
  return <UniversityDetail initialUniversities={list} />;
}