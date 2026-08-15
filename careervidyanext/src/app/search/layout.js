// Search results pages are standard practice to keep out of the index
// (Google's own guidance) — result content varies per query and creates
// thin/duplicate-content risk if indexed.
export const metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }) {
  return children;
}
