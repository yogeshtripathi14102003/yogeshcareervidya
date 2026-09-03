import { notFound } from "next/navigation";
import { serverFetch } from "@/utlis/serverFetch";
import BlogDetailView from "@/features/blog/components/BlogDetailView.jsx";

async function getBlogData(slug) {
  const { ok, data } = await serverFetch(`/api/v1/blog/slug/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!ok) return null;
  return data?.data || null;
}

/* =========================================================
   GENERATE STATIC PARAMS
   ---------------------------------------------------------
   IMPORTANT FIX: Without this function, Next.js has no way of
   knowing which blog slugs exist at build time. That forces
   every /blog/[slug] page to render dynamically on each
   request instead of being pre-built as a static page — which
   is exactly what was causing <title>, canonical, and meta
   tags to stream into <body> instead of <head> (the SEO issue
   flagged by Screaming Frog).

   Adding this tells Next.js all known slugs upfront, so it can
   pre-render (SSG) each blog page at build time, and refresh
   them periodically via ISR (revalidate: 300 above).

   NOTE: This assumes a "/api/v1/blog" endpoint returns the full
   list of blogs (matching the pattern used by /api/v1/course
   and /api/v1/university elsewhere in the app). Double-check
   the exact path/response shape against whatever your blog
   LISTING page (e.g. src/app/blog/page.jsx) already uses to
   fetch all posts, and adjust below if it differs.
========================================================= */
export async function generateStaticParams() {
  const { ok, data } = await serverFetch("/api/v1/blog?limit=200");

  if (!ok) return [];

  const blogs = data?.data || data?.blogs || [];

  return blogs
    .filter((b) => b?.slug)
    .map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      robots: { index: false, follow: true },
    };
  }

  const title = blog.seo?.meta_title || blog.title;
  const description =
    blog.seo?.meta_desc ||
    blog.content?.find((b) => b?.type === "paragraph")?.text?.slice(0, 155) ||
    "Read the latest career and education insights on CareerVidya.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://careervidya.in/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://careervidya.in/blog/${slug}`,
      images: blog.image?.url ? [{ url: blog.image.url }] : undefined,
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.image?.url ? [blog.image.url] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) return notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://careervidya.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://careervidya.in/blog" },
      { "@type": "ListItem", position: 3, name: blog.title, item: `https://careervidya.in/blog/${slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    image: blog.image?.url ? [blog.image.url] : undefined,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: blog.author?.name
      ? { "@type": "Person", name: blog.author.name }
      : undefined,
  };

  // FAQ Schema — only emitted when the blog actually has FAQs, per Google's
  // guidance that FAQPage markup should match real visible page content.
  const faqSchema =
    blog.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blog.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <BlogDetailView slug={slug} initialBlog={blog} />
    </>
  );
}