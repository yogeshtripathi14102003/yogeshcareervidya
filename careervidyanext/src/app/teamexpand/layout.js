// Mentor profiles are fetched client-side, but generateMetadata runs
// server-side and has access to params — so we can still give each
// mentor a unique, self-referencing canonical URL even without full
// server-rendered data fetching.
export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: "Our Mentors",
    description:
      "Meet CareerVidya's expert mentors and counselors who guide students toward the right career path.",
    alternates: {
      canonical: `https://careervidya.in/teamexpand/${id}`,
    },
  };
}

export default function TeamExpandLayout({ children }) {
  return children;
}