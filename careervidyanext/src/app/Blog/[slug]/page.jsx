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
