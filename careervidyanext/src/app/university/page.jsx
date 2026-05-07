

// import UniversityDetail from "@/app/university/UniversityDetail.jsx";

// async function getUniversities() {
//   const res = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/university`, { next: { revalidate: 60 } });
//   const data = await res.json();
//   return data.data || [];
// }

// export default async function Page() {
//   const list = await getUniversities();
//   return <UniversityDetail initialUniversities={list} />;
// }


import UniversityDetail from "@/app/university/UniversityDetail.jsx";

// 1. पेज को Dynamic रेंडरिंग पर सेट करें ताकि बिल्ड के समय URL की टेंशन न रहे
export const dynamic = "force-dynamic";

async function getUniversities() {
  // 2. एक Fallback URL दें ताकि अगर Env Variable न मिले तो 'undefined' न आए
  const baseUrl = process.env.INTERNAL_API_URL || "https://api.careervidya.in/api/v1";
  
  try {
    const res = await fetch(`${baseUrl}/university`, { 
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    // 3. अगर नेटवर्क एरर आए तो खाली एरे भेजें, बिल्ड क्रैश न होने दें
    console.error("University fetch error:", error.message);
    return [];
  }
}

export default async function Page() {
  const list = await getUniversities();
  return <UniversityDetail initialUniversities={list} />;
}