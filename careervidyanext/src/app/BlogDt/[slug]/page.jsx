"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/utlis/api";
import BlogHeader from "../layout/BlogHeader.jsx"; // path check kar lena

export default function BlogDetailPage() {
  const { slug } = useParams(); // ✅ App Router way
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/blog/slug/${slug}`);
        setBlog(res.data.data);
      } catch (error) {
        console.error("Blog fetch error:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  /* ------------------ STATES ------------------ */

  if (loading) {
    return (
      <>
        <BlogHeader />
        <div className="py-40 text-center text-lg font-semibold">
          Loading Blog Content...
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <BlogHeader />
        <div className="py-40 text-center">
          <h2 className="text-3xl font-bold mb-2">404 - Blog Not Found</h2>
          <p className="text-gray-500">
            The blog you are looking for does not exist.
          </p>
        </div>
      </>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <>
      <BlogHeader />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
          {blog.title}
        </h1>

        {/* Main Image */}
        {blog.image?.url && (
          <div className="relative w-full h-[420px] mb-10 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={blog.image.url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Overview */}
        {blog.overview && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">
              {blog.overview.heading}
            </h2>

            <ul className="space-y-2">
              {blog.overview.points?.map((point, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-slate-700 leading-relaxed"
                >
                  <span className="text-blue-600 font-bold">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Blocks */}
        <div className="prose prose-lg max-w-none text-slate-800">
          {blog.content?.map((block, index) => {
            if (block.block_type === "text") {
              return (
                <div
                  key={index}
                  className="mb-8"
                  dangerouslySetInnerHTML={{ __html: block.value }}
                />
              );
            }

            if (block.block_type === "image") {
              return (
                <figure key={index} className="my-10">
                  <img
                    src={block.media?.url}
                    alt={block.media?.caption || "Blog image"}
                    className="rounded-2xl w-full shadow-md"
                  />
                  {block.media?.caption && (
                    <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                      {block.media.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            return null;
          })}
        </div>

        {/* FAQ Section */}
        {blog.faqs?.length > 0 && (
          <div className="mt-20 border-t pt-10">
            <h2 className="text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {blog.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-6 rounded-xl border"
                >
                  <p className="font-bold text-lg mb-2">
                    Q. {faq.question}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
