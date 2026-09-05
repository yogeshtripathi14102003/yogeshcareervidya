export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: "Our Mentors | CareerVidya",

    description:
      "Meet CareerVidya's expert mentors and counselors who guide students toward the right career path.",

    alternates: {
      canonical: `https://careervidya.in/teamexpand/${id}`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: "Our Mentors | CareerVidya",
      description:
        "Meet CareerVidya's expert mentors and counselors who guide students toward the right career path.",
      url: `https://careervidya.in/teamexpand/${id}`,
      type: "profile",
    },
  };
}

export default function TeamExpandDetailLayout({ children }) {
  return children;
}