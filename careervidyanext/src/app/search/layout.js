// // Search results pages are standard practice to keep out of the index
// // (Google's own guidance) — result content varies per query and creates
// // thin/duplicate-content risk if indexed.
// export const metadata = {
//   title: "Search",
//   robots: { index: false, follow: true },
// };

// export default function SearchLayout({ children }) {
//   return children;
// }


import SearchPageClient from "./SearchPageClient";

export const metadata = {
  title: "Search Universities & Courses",
  description:
    "Search and compare online universities, courses, and fees across India. Find UGC-approved MBA, BBA, BCA and more, filtered by budget and approvals.",
  alternates: {
    canonical: "https://careervidya.in/search",
  },
  openGraph: {
    title: "Search Universities & Courses | CareerVidya",
    description:
      "Search and compare online universities, courses, and fees across India.",
    url: "https://careervidya.in/search",
    type: "website",
  },
};

export default function Page() {
  return <SearchPageClient />;
}