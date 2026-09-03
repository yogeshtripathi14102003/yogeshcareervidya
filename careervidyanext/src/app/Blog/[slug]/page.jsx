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
   RETRY HELPER
   ---------------------------------------------------------
   Build-time backend hiccups (e.g. the API restarting at the
   exact moment `npm run build` runs) previously caused a 502,
   which made generateStaticParams silently return an empty
   list — so /blog/[slug] fell back to full dynamic rendering,
   which is what was pushing <title>/<canonical> tags into
   <body> instead of <head>.

   This wraps a fetch attempt with a few retries + backoff so a
   transient 502/503 during build doesn't permanently break SSG
   for this route. It does NOT fix a backend that's genuinely
   down for the whole build — only smooths over brief blips.
========================================================= */
async function fetchWithRetry(fn, { attempts = 4, delayMs = 3000 } = {}) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const result = await fn();
      if (result?.ok) return result;
      console.warn(
        `[generateStaticParams:blog] attempt ${i}/${attempts} failed (not ok), retrying in ${delayMs}ms...`
      );
    } catch (err) {
      console.warn(
        `[generateStaticParams:blog] attempt ${i}/${attempts} threw: ${err?.message}, retrying in ${delayMs}ms...`
      );
    }
    if (i < attempts) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  return { ok: false, data: null };
}

/* =========================================================
   GENERATE STATIC PARAMS
========================================================= */
export async function generateStaticParams() {
  const { ok, data } = await fetchWithRetry(() =>
    serverFetch("/api/v1/blog?page=1&limit=200")
  );

  if (!ok) {
    console.error(
      "[generateStaticParams:blog] All retry attempts failed — falling back to dynamic rendering for /blog/[slug]. Fix backend availability at build time and rebuild."
    );
    return [];
  }

  const blogs = data?.data || [];

  return blogs.filter((b) => b?.slug).map((b) => ({ slug: b.slug }));
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