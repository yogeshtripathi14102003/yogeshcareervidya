

import ExploreClient from "./ExploreClient";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

// ✅ SEO FIX: was `export const dynamic = "force-dynamic"`, which disabled
// static generation / ISR entirely on every request — even though the
// fetch calls below already use `revalidate: 3600`. Having both meant the
// page was always fully re-rendered on the server per-request (slower
// TTFB), while the revalidate value on the fetches was effectively wasted.
// `export const revalidate` lets Next.js serve a cached, statically
// generated page and only regenerate it in the background once per hour —
// faster for both users and crawlers. Remove this and go back to
// force-dynamic only if this page ever needs per-request/user-specific data.
export const revalidate = 3600;

const PAGE_URL = "https://careervidya.in/explore";
// TODO: replace with a real 1200x630 OG image hosted on your domain.
const OG_IMAGE = "https://careervidya.in/images/og-explore.jpg";

export const metadata = {
  // ✅ SEO FIX: was 61 characters, just over Google's ~60-char safe zone
  // (risked truncation in search results). Shortened to 48 characters
  // while keeping the primary keyword ("Explore Courses") and brand.
  title: "Explore Courses & Top Universities | CareerVidya",
  description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
  alternates: {
    canonical: PAGE_URL,
  },
  // ✅ SEO FIX: openGraph/twitter blocks were missing entirely, so shares
  // on WhatsApp, LinkedIn, Facebook, Twitter/X fell back to generic/blank
  // previews instead of a proper title, description, and image.
  openGraph: {
    title: "Explore Courses & Top Universities | CareerVidya",
    description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
    url: PAGE_URL,
    siteName: "CareerVidya",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Explore Courses & Top Universities on CareerVidya",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Courses & Top Universities | CareerVidya",
    description: "Search through hundreds of UG, PG, and Doctorate courses from top recognized universities in India.",
    images: [OG_IMAGE],
  },
};

async function getData() {
  const [courseResult, uniResult] = await Promise.all([
    serverFetch("/api/v1/course?limit=40", { next: { revalidate: 3600 } }),
    serverFetch("/api/v1/university", { next: { revalidate: 3600 } }),
  ]);

  const initialCourses = courseResult.ok ? courseResult.data?.courses || [] : [];
  const rawUnis = uniResult.ok ? uniResult.data?.data || [] : [];

  // ✅ Resolve university image URLs here on the server — same pattern as
  // /topunivers — so ExploreClient never needs NEXT_PUBLIC_API_URL or its
  // own URL-building logic.
  const initialUnis = rawUnis.map((uni) => ({
    ...uni,
    universityImageUrl: resolveImageUrl(uni.universityImage, "/fallback-logo.png"),
  }));

  return { initialCourses, initialUnis };
}

export default async function Page() {
  const data = await getData();
  return <ExploreClient initialData={data} />;
}