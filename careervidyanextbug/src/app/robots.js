const SITE_URL = "https://careervidya.in";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/user",
          "/user/",
          "/counselordashbord",
          "/counselordashbord/",
          "/api/",
          "/components/", // embeddable UI fragments, accidentally routable — not real pages
          "/newsletter/confirm",
          "/newsletter/unsubscribed",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
