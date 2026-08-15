// Query-param-driven comparison tool — content varies per visit, so this
// follows standard practice for dynamic comparison/results pages: keep it
// out of the index rather than risk thin/duplicate-content pages piling up.
export const metadata = {
  title: "Compare Universities",
  robots: { index: false, follow: true },
};

export default function CompareDetailLayout({ children }) {
  return children;
}
