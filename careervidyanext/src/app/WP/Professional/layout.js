export const metadata = {
  title: "Online Degree Programs",
  description:
    "Compare UGC-approved online degree programs across top universities in India. Get expert guidance, compare fees, and apply with CareerVidya.",
  alternates: { canonical: "/WP/home" },
  openGraph: {
    title: "Online Degree Programs | CareerVidya",
    description: "Compare UGC-approved online degree programs across top universities in India.",
    url: "/WP/home",
    type: "website",
  },
};

export default function WPHomeLayout({ children }) {
  return children;
}
