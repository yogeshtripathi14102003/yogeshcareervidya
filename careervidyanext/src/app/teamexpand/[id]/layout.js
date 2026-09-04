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

export default function TeamExpandDetailLayout({ children }) {
  return children;
}