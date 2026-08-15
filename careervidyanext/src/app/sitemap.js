const SITE_URL = "https://careervidya.in";
const API_URL = process.env.API_URL;

// Fetches every page of a paginated list endpoint, up to a safety cap, and
// never throws — a slow/broken backend section just means fewer sitemap
// entries, not a 500 on /sitemap.xml.
async function fetchAllPages(path, { itemsKey, totalPagesKey, maxPages = 20 }) {
  if (!API_URL) return [];
  const items = [];

  for (let page = 1; page <= maxPages; page++) {
    try {
      const res = await fetch(`${API_URL}${path}?page=${page}&limit=50`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const json = await res.json();
      const pageItems = json[itemsKey] || [];
      items.push(...pageItems);

      const totalPages = json[totalPagesKey] || 1;
      if (page >= totalPages) break;
    } catch {
      break; // don't let one bad page take down the whole sitemap
    }
  }

  return items;
}

async function fetchAll(path, { dataKey = "data" } = {}) {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json[dataKey] || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticRoutes = [
    "",
    "/Aboutus",
    "/contactus",
    "/course",
    "/university",
    "/blog",
    "/career",
    "/explore",
    "/counselling",
    "/OurTeam",
    "/whycareervidya",
    "/PrivacyPolicy",
    "/Terms&Conditions",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [courses, universities, blogs] = await Promise.all([
    fetchAllPages("/api/v1/course", { itemsKey: "courses", totalPagesKey: "totalPages" }),
    fetchAll("/api/v1/university"),
    fetchAll("/api/v1/blog"),
  ]);

  const courseRoutes = courses
    .filter((c) => c?.slug)
    .map((c) => ({
      url: `${SITE_URL}/course/${c.slug}`,
      lastModified: c.createdAt ? new Date(c.createdAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const universityRoutes = universities
    .filter((u) => u?.slug)
    .map((u) => ({
      url: `${SITE_URL}/university/${u.slug}`,
      lastModified: u.updatedAt || u.createdAt ? new Date(u.updatedAt || u.createdAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const blogRoutes = blogs
    .filter((b) => b?.slug)
    .map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt || b.createdAt ? new Date(b.updatedAt || b.createdAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...courseRoutes, ...universityRoutes, ...blogRoutes];
}
