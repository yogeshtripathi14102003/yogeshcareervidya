

//updated blog 
import BlogList from "@/features/blog/components/BlogList.jsx";
import { serverFetch } from "@/utlis/serverFetch";
import { BLOG_PAGE_SIZE } from "@/features/blog/constants/blogConstants.js";

async function fetchInitialBlogs() {
  try {
    const res = await serverFetch(`/api/v1/blog?page=1&limit=${BLOG_PAGE_SIZE}`, {
      next: { revalidate: 60 },
    });
    return res?.data || { success: true, data: [], total: 0, totalPages: 1 };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { success: false, data: [], total: 0, totalPages: 1 };
  }
}

export const metadata = {
  title: "Explore the Latest Blogs on Technology and Innovation | CareerVidya",
  description:
    "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.careervidya.in"
  ),

  openGraph: {
    title: "Explore the Latest Blogs on Technology and Innovation | CareerVidya",
    description:
      "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",
    url: "/blog",
    siteName: "CareerVidya",
    type: "website",
    images: [
      {
        url: "/og/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "CareerVidya Blog — Latest Career & Education Insights",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Explore the Latest Blogs on Technology and Innovation | CareerVidya",
    description:
      "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",
    images: [
      {
        url: "/og/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "CareerVidya Blog — Latest Career & Education Insights",
      },
    ],
  },

  alternates: {
    canonical: "/blog",
  },
};
export default async function BlogPage() {
  const initialData = await fetchInitialBlogs();
  return <BlogList initialData={initialData} />;
}