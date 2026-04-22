import BlogListClient from "@/app/Blog/BlogListClient.jsx";

// SEO के लिए मेटाडेटा
export const metadata = {
  title: "Explore the Latest Blogs on Technology and Innovation",
  description: "Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital world.",
};

async function fetchBlogs() {
  // ध्यान दें: यहाँ अपना API URL इस्तेमाल करें
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog`, {
    next: { revalidate: 60 }, // हर 60 सेकंड में अपडेट होगा (ISR)
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default async function BlogPage() {
  const blogs = await fetchBlogs();
  return <BlogListClient initialBlogs={blogs} />;
}