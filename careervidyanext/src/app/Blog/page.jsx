

// import Link from "next/link";
// import BlogListClient from "@/app/blog/BlogListClient.jsx";
// import { serverFetch } from "@/utlis/serverFetch";

// async function fetchBlogs() {
//   try {
//     const res = await serverFetch("/api/v1/blog", {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch blogs: Status ${res.status}`);
//       return [];
//     }

//     const data = await res.json();
//     return data.data || [];
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     return [];
//   }
// }

// export const metadata = {
//   title: "Explore the Latest Blogs on Technology and Innovation | CareerVidya",
//   description:
//     "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",

//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_SITE_URL || "https://www.careervidya.in"
//   ),

//   openGraph: {
//     title: "Explore the Latest Blogs on Technology and Innovation | CareerVidya",
//     description:
//       "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",
//     url: "/blog",
//     siteName: "CareerVidya",
//     type: "website",
//     images: [
//       {
//         url: "/og/blog-og.jpg",  // ← exact 1200x630 image rakho, crop nahi hogi
//         width: 1200,
//         height: 630,
//         alt: "CareerVidya Blog — Latest Career & Education Insights",
//         // ✅ type specify karo — platform sahi render karega
//         type: "image/jpeg",
//       },
//     ],
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "Explore the Latest Blogs on Technology and Innovation | CareerVidya",
//     description:
//       "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",
//     images: [
//       {
//         url: "/og/blog-og.jpg",
//         width: 1200,
//         height: 630,
//         alt: "CareerVidya Blog — Latest Career & Education Insights",
//       },
//     ],
//   },

//   alternates: {
//     canonical: "/blog",
//   },
// };

// export default async function BlogPage() {
//   const blogs = await fetchBlogs();
//   return <BlogListClient initialBlogs={blogs} />;
// }

import Link from "next/link";
import BlogListClient from "@/app/blog/BlogListClient.jsx";
import { serverFetch } from "@/utlis/serverFetch";

/**
 * OPTION A — use this if serverFetch is built on axios
 * (i.e. it already parses JSON and returns { data, status, ... })
 */
async function fetchBlogs() {
  try {
    const res = await serverFetch("/api/v1/blog", {
      next: { revalidate: 60 },
    });

    // axios-style: parsed body lives on res.data
    const data = res?.data?.data || res?.data || [];
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

/**
 * OPTION B — use this if serverFetch is a thin wrapper around native fetch
 * (i.e. it returns a real Response object with .ok / .json())
 *
 * async function fetchBlogs() {
 *   try {
 *     const res = await serverFetch("/api/v1/blog", {
 *       next: { revalidate: 60 },
 *     });
 *
 *     if (!res.ok) {
 *       console.error(`Failed to fetch blogs: Status ${res.status}`);
 *       return [];
 *     }
 *
 *     const data = await res.json();
 *     return data.data || [];
 *   } catch (error) {
 *     console.error("Error fetching blogs:", error);
 *     return [];
 *   }
 * }
 */

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
  const blogs = await fetchBlogs();
  return <BlogListClient initialBlogs={blogs} />;
}