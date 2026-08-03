// NOTE: mentor profiles are fetched entirely client-side (see [id]/page.jsx),
// so this can only provide the same metadata to every mentor profile —
// not truly unique per-mentor titles. That needs converting the detail
// page to server-rendered data fetching with generateMetadata, same
// pattern already used for blog/course/university. Flagged as follow-up;
// this is still a real improvement over inheriting the homepage's title
// and canonical URL, which is what every mentor page was doing before.
export const metadata = {
  title: "Our Mentors",
  description: "Meet CareerVidya's expert mentors and counselors who guide students toward the right career path.",
};

export default function TeamExpandLayout({ children }) {
  return children;
}
