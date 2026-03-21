"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api";
import Image from "next/image";
import Head from "next/head";
import BlogHeader from "@/app/layout/BlogHeader.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Blogget from "@/app/components/Blogget.jsx";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/api/v1/blog/slug/${slug}`);
      const data = res.data?.data || res.data;
      setBlog(data);
    } catch (err) {
      console.log("Blog fetch error", err);
    }
    setLoading(false);
  };

  const safeImage = (url) => (url ? url : "/placeholder.jpg");

  if (loading)
    return <div className="py-10 text-center text-lg">Loading blog...</div>;
  if (!blog)
    return (
      <div className="py-10 text-center text-red-500">Blog not found</div>
    );

  return (
    <>
      <Head>
        <title>{blog?.seo?.meta_title || blog.title}</title>
        <meta name="description" content={blog?.seo?.meta_desc || ""} />
      </Head>

      <BlogHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE: MAIN CONTENT */}
          <main className="lg:col-span-8">
            <div className="flex gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs uppercase font-bold">
                {blog.category}
              </span>
              {blog.is_verified && (
                <span className="text-green-600 text-xs">✓ Verified</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">
              {blog.title}
            </h1>

            <div className="mt-2 flex flex-wrap justify-start md:justify-between items-center text-xs text-gray-400 gap-2">
              <span>Published: {new Date(blog.createdAt).toDateString()}</span>
              <span>Updated: {new Date(blog.updatedAt).toDateString()}</span>
              <span className="bg-slate-100 px-2 py-1 rounded">
                {blog.reads} Reads
              </span>
            </div>

            {/* MAIN BLOG IMAGE */}
            <div className="relative w-full aspect-[16/9] md:h-[450px] mt-4 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={safeImage(blog.image?.url)}
                alt={blog.title}
                fill
                className="object-contain md:object-cover"
              />
            </div>

            {/* DYNAMIC CONTENT BLOCKS */}
            <div className="mt-6 space-y-6">
              {blog.content?.map((block, i) => {
                if (!block) return null;

                if (block.type === "heading") {
                  const Tag = `h${block.level || 2}`;
                  return (
                    <Tag
                      key={i}
                      style={{ color: block.color, textAlign: block.align }}
                      className="font-bold text-2xl"
                    >
                      {block.text}
                    </Tag>
                  );
                }

                if (block.type === "paragraph") {
                  return (
                    <p
                      key={i}
                      style={{ color: block.color, textAlign: block.align }}
                      className="text-lg leading-relaxed text-slate-700"
                    >
                      {block.text}
                    </p>
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul
                      key={i}
                      className="list-disc ml-6 space-y-1 text-slate-700"
                    >
                      {block.list_items?.map((li, index) => (
                        <li key={index}>{li}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "number_list") {
                  return (
                    <ol
                      key={i}
                      className="list-decimal ml-6 space-y-1 text-slate-700"
                    >
                      {block.list_items?.map((li, index) => (
                        <li key={index}>{li}</li>
                      ))}
                    </ol>
                  );
                }

                if (block.type === "image") {
                  return (
                    <div key={i} className="mt-4">
                      <div className="relative w-full aspect-[16/9] md:h-[400px] rounded-xl overflow-hidden">
                        <Image
                          src={safeImage(block.media?.url)}
                          alt={block.media?.caption || "blog image"}
                          fill
                          className="object-contain md:object-cover"
                        />
                      </div>
                      {block.media?.caption && (
                        <p className="text-center text-sm text-gray-500 mt-2 italic">
                          {block.media.caption}
                        </p>
                      )}
                    </div>
                  );
                }

                if (block.type === "video") {
                  return (
                    <div key={i} className="mt-4">
                      <video
                        controls
                        src={block.media?.url}
                        className="w-full rounded-xl shadow-md"
                      />
                      {block.media?.caption && (
                        <p className="text-center text-sm text-gray-500 mt-1">
                          {block.media.caption}
                        </p>
                      )}
                    </div>
                  );
                }

                if (block.type === "table") {
                  return (
                    <div key={i} className="overflow-x-auto mt-4">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            {block.table?.headers?.map((h, index) => (
                              <th
                                key={index}
                                className="p-2 border border-gray-300 text-left"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.table?.rows?.map((row, r) => (
                            <tr key={r}>
                              {row.map((cell, c) => (
                                <td
                                  key={c}
                                  className="p-2 border border-gray-300"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={i}
                      className="border-l-4 border-blue-500 pl-4 italic text-lg text-gray-700 mt-4 bg-blue-50 py-2 pr-4"
                    >
                      {block.text}
                    </blockquote>
                  );
                }

                if (block.type === "code") {
                  return (
                    <pre
                      key={i}
                      className="bg-slate-900 text-green-400 p-3 rounded-lg overflow-x-auto mt-4 font-mono text-sm"
                    >
                      <code>{block.text}</code>
                    </pre>
                  );
                }

                return null;
              })}
            </div>

            {/* FAQ SECTION */}
            {blog.faqs?.length > 0 && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-900 border-b pb-2">
                  Common Questions
                </h2>
                <div className="space-y-4">
                  {blog.faqs.map((faq, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-lg text-slate-800 flex gap-2">
                        <span className="text-blue-600">Q.</span> {faq.question}
                      </h4>
                      <p className="text-slate-600 mt-1 pl-4">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AUTHOR DETAILS */}
            <div className="mt-6 flex flex-col md:flex-row items-center md:items-start gap-4 p-6 bg-white border rounded-2xl shadow-sm">
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-50 shadow-sm">
                <Image
                  src={safeImage(blog.author?.profile_img?.url)}
                  alt={blog.author?.name || "author"}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Written By
                </p>
                <p className="font-bold text-xl md:text-2xl text-slate-900">
                  {blog.author?.name}
                </p>
                <p className="text-sm md:text-md text-slate-500 italic mb-2">
                  {blog.author?.designation} • {blog.author?.specialization}
                </p>
                {blog.author?.description && (
                  <p className="text-slate-600 leading-relaxed">
                    {blog.author.description}
                  </p>
                )}
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Blogget />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}