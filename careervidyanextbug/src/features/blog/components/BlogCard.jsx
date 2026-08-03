import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { formatBlogDate } from "../services/blogService.js";

/** @param {{ blog: import("../types/blog.types.js").BlogListItem }} props */
export default function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/blog/${blog.slug}`} className="block relative h-[200px] bg-slate-100">
        <Image
          src={blog.image?.url || "/placeholder.jpg"}
          alt={blog.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {blog.category && (
          <span className="absolute top-3 left-3 bg-white/90 text-indigo-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {blog.category}
          </span>
        )}
      </Link>
      <div className="p-5">
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="font-bold text-lg text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
          <span>{blog.author?.name || "CareerVidya Team"}</span>
          <span>·</span>
          <span>{formatBlogDate(blog.createdAt)}</span>
          {typeof blog.reads === "number" && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {blog.reads} reads</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
