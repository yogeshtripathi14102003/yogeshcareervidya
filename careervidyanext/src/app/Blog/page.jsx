

// import Link from "next/link";
// import BlogListClient from "@/app/blog/BlogListClient.jsx";
// import { serverFetch } from "@/utlis/serverFetch"; // ✅ Import your utility

// // SEO के लिए मेटाडेटा
// export const metadata = {
//   title: "Explore the Latest Blogs on Technology and Innovation",
//   description: "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",
// };

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
//     return data.data || []; // आपके original API response handle करने के लिए
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     return [];
//   }
// }

// export default async function BlogPage() {
//   const blogs = await fetchBlogs();
//   return <BlogListClient initialBlogs={blogs} />;
// }


import Link from "next/link";
import BlogListClient from "@/app/blog/BlogListClient.jsx";
import { serverFetch } from "@/utlis/serverFetch";

async function fetchBlogs() {
  try {
    const res = await serverFetch("/api/v1/blog", {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch blogs: Status ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
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
        url: "/og/blog-og.jpg",  // ← exact 1200x630 image rakho, crop nahi hogi
        width: 1200,
        height: 630,
        alt: "CareerVidya Blog — Latest Career & Education Insights",
        // ✅ type specify karo — platform sahi render karega
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