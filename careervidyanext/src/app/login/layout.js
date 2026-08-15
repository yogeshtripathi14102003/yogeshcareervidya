// Login is a transactional app page, not content — standard practice to
// keep account/auth pages out of search results.
export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return children;
}
