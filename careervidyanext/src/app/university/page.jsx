

import UniversityDetail from "@/app/university/UniversityDetail.jsx";

async function getUniversities() {
  const res = await fetch(`${process.env.INTERNAL_API_URLL}/api/v1/university`, { next: { revalidate: 60 } });
  const data = await res.json();
  return data.data || [];
}

export default async function Page() {
  const list = await getUniversities();
  return <UniversityDetail initialUniversities={list} />;
}