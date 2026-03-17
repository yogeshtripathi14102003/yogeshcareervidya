

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

  if (loading) return <div className="py-40 text-center text-lg">Loading blog...</div>;
  if (!blog) return <div className="py-40 text-center text-red-500">Blog not found</div>;

  return (
    <>
      <Head>
        <title>{blog?.seo?.meta_title || blog.title}</title>
        <meta name="description" content={blog?.seo?.meta_desc || ""} />
      </Head>

      <BlogHeader />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: MAIN CONTENT */}
          <main className="lg:col-span-8">
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs uppercase font-bold">
                {blog.category}
              </span>
              {blog.is_verified && <span className="text-green-600 text-xs">✓ Verified</span>}
            </div>

            <h1 className="text-4xl font-bold leading-tight text-slate-900">{blog.title}</h1>
            {/* <p className="text-xs text-gray-400 mt-2">ID: {blog.custom_id} • Slug: {blog.slug}</p> */}
             <div className="mt-6 pt-4 border-t flex flex-wrap justify-center md:justify-between items-center text-xs text-gray-400 gap-4">
                    <span>Published: {new Date(blog.createdAt).toDateString()}</span>
                    <span>Updated: {new Date(blog.updatedAt).toDateString()}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">{blog.reads} Reads</span>
                </div>

            <div className="relative w-full h-[300px] md:h-[450px] mt-8 rounded-xl overflow-hidden shadow-lg">
              <Image src={safeImage(blog.image?.url)} alt={blog.title} fill className="object-cover" />
            </div>

            {/* DYNAMIC CONTENT BLOCKS (Sari Fields) */}
            <div className="mt-12 space-y-8">
              {blog.content?.map((block, i) => {
                if (!block) return null;

                if (block.type === "heading") {
                  const Tag = `h${block.level || 2}`;
                  return <Tag key={i} style={{ color: block.color, textAlign: block.align }} className="font-bold text-2xl">{block.text}</Tag>;
                }

                if (block.type === "paragraph") {
                  return <p key={i} style={{ color: block.color, textAlign: block.align }} className="text-lg leading-relaxed text-slate-700">{block.text}</p>;
                }

                if (block.type === "list") {
                  return (
                    <ul key={i} className="list-disc ml-6 space-y-2 text-slate-700">
                      {block.list_items?.map((li, index) => <li key={index}>{li}</li>)}
                    </ul>
                  );
                }

                if (block.type === "number_list") {
                  return (
                    <ol key={i} className="list-decimal ml-6 space-y-2 text-slate-700">
                      {block.list_items?.map((li, index) => <li key={index}>{li}</li>)}
                    </ol>
                  );
                }

                if (block.type === "image") {
                  return (
                    <div key={i} className="my-10">
                      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                        <Image src={safeImage(block.media?.url)} alt={block.media?.caption || "blog image"} fill className="object-cover" />
                      </div>
                      {block.media?.caption && <p className="text-center text-sm text-gray-500 mt-3 italic">{block.media.caption}</p>}
                    </div>
                  );
                }

                if (block.type === "video") {
                  return (
                    <div key={i} className="my-10">
                      <video controls src={block.media?.url} className="w-full rounded-xl shadow-md" />
                      {block.media?.caption && <p className="text-center text-sm text-gray-500 mt-2">{block.media.caption}</p>}
                    </div>
                  );
                }

                if (block.type === "table") {
                  return (
                    <div key={i} className="overflow-x-auto my-8">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            {block.table?.headers?.map((h, index) => (
                              <th key={index} className="p-3 border border-gray-300 text-left">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.table?.rows?.map((row, r) => (
                            <tr key={r}>
                              {row.map((cell, c) => (
                                <td key={c} className="p-3 border border-gray-300">{cell}</td>
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
                    <blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-xl text-gray-700 my-8 bg-blue-50 py-4 pr-4">
                      {block.text}
                    </blockquote>
                  );
                }

                if (block.type === "code") {
                  return (
                    <pre key={i} className="bg-slate-900 text-green-400 p-5 rounded-lg overflow-x-auto my-6 font-mono text-sm">
                      <code>{block.text}</code>
                    </pre>
                  );
                }

                return null;
              })}
            </div>

            {/* --- FAQ SECTION (BOX) --- */}
            {blog.faqs?.length > 0 && (
              <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">Common Questions</h2>
                <div className="space-y-6">
                  {blog.faqs.map((faq, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-lg text-slate-800 flex gap-2">
                        <span className="text-blue-600">Q.</span> {faq.question}
                      </h4>
                      <p className="text-slate-600 mt-2 pl-7">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- AUTHOR DETAILS (BOTTOM) --- */}
            <div className="mt-12 flex flex-col md:flex-row items-center md:items-start gap-6 p-8 bg-white border rounded-2xl shadow-sm">
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-50 shadow-sm">
                <Image src={safeImage(blog.author?.profile_img?.url)} alt={blog.author?.name || "author"} fill className="object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Written By</p>
                <p className="font-bold text-2xl text-slate-900">{blog.author?.name}</p>
                <p className="text-md text-slate-500 italic mb-3">
                  {blog.author?.designation} • {blog.author?.specialization}
                </p>
                {blog.author?.description && <p className="text-slate-600 leading-relaxed">{blog.author.description}</p>}
                
                <div className="mt-6 pt-4 border-t flex flex-wrap justify-center md:justify-between items-center text-xs text-gray-400 gap-4">
                    <span>Published: {new Date(blog.createdAt).toDateString()}</span>
                    <span>Updated: {new Date(blog.updatedAt).toDateString()}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">{blog.reads} Reads</span>
                </div>
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR: BLOGGET */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Blogget />
               </div>
               
               {/* SEO KEYWORDS */}
               {/* {blog?.seo?.keywords?.length > 0 && (
                <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold mb-4 text-slate-800 text-sm uppercase">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.seo.keywords.map((k, i) => (
                      <span key={i} className="bg-slate-50 border border-slate-100 text-slate-500 text-xs px-3 py-1.5 rounded-full">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
               )} */}
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </>
  );
}