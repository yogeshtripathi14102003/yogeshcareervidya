


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api";
import Image from "next/image";
import Head from "next/head"; // SEO ke liye
import BlogHeader from "@/app/layout/BlogHeader.jsx"; // Blog header component

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/api/v1/blog/slug/${slug}`);
      setBlog(res.data.data);
    } catch (err) {
      console.error("Blog detail error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-40 text-center text-lg">Loading blog...</div>;
  if (!blog) return <div className="py-40 text-center text-red-500">Blog not found</div>;

  return (
    <>
      <BlogHeader />
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* ===== SEO Metadata (Browser tab ke liye) ===== */}
      <title>{blog.seo?.meta_title || blog.title}</title>
      <meta name="description" content={blog.seo?.meta_desc} />

      {/* ===== Category & Status ===== */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
          {blog.category}
        </span>
        {blog.is_verified && (
          <span className="text-green-600 text-xs font-medium flex items-center">
            ✓ Verified Content
          </span>
        )}
      </div>

      {/* ===== Title ===== */}
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
        {blog.title}
      </h1>

      {/* ===== Author Info (Detailed) ===== */}
      <div className="mt-6 flex items-center gap-4 border-b pb-8">
        {blog.author?.profile_img?.url && (
          <div className="relative w-14 h-14 rounded-full overflow-hidden">
            <Image src={blog.author.profile_img.url} alt={blog.author.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-bold text-slate-900">{blog.author?.name}</p>
          <p className="text-sm text-slate-500">
            {blog.author?.designation} • {blog.author?.specialization}
          </p>
          <p className="text-xs text-slate-400">{new Date(blog.createdAt).toDateString()} • {blog.reads} Reads</p>
        </div>
      </div>

      {/* ===== Main Cover Image ===== */}
      <div className="relative w-full h-[450px] mt-8 rounded-2xl overflow-hidden shadow-lg">
        <Image src={blog.image?.url || "/placeholder.jpg"} alt={blog.title} fill className="object-cover" priority />
      </div>

      {/* ===== Overview Section ===== */}
      {blog.overview?.points?.length > 0 && (
        <div className="mt-10 bg-blue-50 p-8 rounded-2xl border border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">{blog.overview.heading}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {blog.overview.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="text-blue-500 font-bold">•</span> {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== Second Section (Missing Field) ===== */}
      {blog.second_section?.heading && (
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">{blog.second_section.heading}</h2>
          <p className="text-slate-600 italic">{blog.second_section.description}</p>
          <ul className="list-decimal ml-6 space-y-2">
             {blog.second_section.points?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          {/* Second Section Table */}
          {blog.second_section.table?.length > 0 && (
             <div className="mt-4 overflow-hidden rounded-lg border">
                <table className="w-full text-left">
                   <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 border">Info 1</th>
                        <th className="p-3 border">Info 2</th>
                        <th className="p-3 border">Info 3</th>
                      </tr>
                   </thead>
                   <tbody>
                      {blog.second_section.table.map((row, i) => (
                        <tr key={i}>
                          <td className="p-3 border">{row.column1}</td>
                          <td className="p-3 border">{row.column2}</td>
                          <td className="p-3 border">{row.column3}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
          <p className="text-slate-700 mt-4">{blog.second_section.sub_description}</p>
        </div>
      )}

      {/* ===== Dynamic Content (Text, Image, Video, Table) ===== */}
      <div className="mt-12 space-y-8">
        {blog.content?.map((block, index) => {
          if (block.block_type === "text") return <p key={index} className="text-lg text-slate-700 leading-relaxed">{block.value}</p>;
          if (block.block_type === "image") return (
            <div key={index} className="my-8">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <Image src={block.media?.url} alt={block.media?.caption || "Content image"} fill className="object-cover" />
              </div>
              {block.media?.caption && <p className="text-center text-sm text-slate-500 mt-3 italic">{block.media.caption}</p>}
            </div>
          );
          if (block.block_type === "video") return (
            <div key={index} className="my-8 rounded-xl overflow-hidden shadow-xl">
              <video controls className="w-full" src={block.media?.url} />
            </div>
          );
          if (block.block_type === "table") return (
            <div key={index} className="overflow-x-auto my-8">
              <table className="w-full border-collapse border border-slate-200">
                <tbody className="divide-y divide-slate-200">
                  {block.value?.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="border p-4 text-slate-700">{row.column1}</td>
                      <td className="border p-4 text-slate-700">{row.column2}</td>
                      <td className="border p-4 text-slate-700">{row.column3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          return null;
        })}
      </div>

      {/* ===== FAQs ===== */}
      {blog.faqs?.length > 0 && (
        <div className="mt-20 border-t pt-10">
          <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
          <div className="grid gap-6">
            {blog.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900 mb-2">Q: {faq.question}</h4>
                <p className="text-slate-600">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Keywords/SEO Tags ===== */}
      {blog.seo?.keywords?.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-2">
          {blog.seo.keywords.map((tag, i) => (
            <span key={i} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">#{tag}</span>
          ))}
        </div>
      )}
    </div>
    </>
  );
}