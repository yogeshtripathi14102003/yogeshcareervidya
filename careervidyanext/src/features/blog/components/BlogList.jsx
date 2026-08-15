"use client";

import { useState } from "react";
import BlogHeader from "@/app/layout/BlogHeader.jsx";
import Footer from "@/app/layout/Footer.jsx";
import { useBlogs } from "../hooks/useBlogs.js";
import BlogCard from "./BlogCard.jsx";
import { SearchBox, Pagination, EmptyState, ErrorState, SkeletonCard } from "@/components/ui";

/** @param {{ initialData: import("../types/blog.types.js").BlogListResponse }} props */
export default function BlogList({ initialData }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useBlogs({ page, search, initialData });

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <BlogHeader />
      <div className="w-full bg-slate-50">
        <section className="bg-slate-100 py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Explore the Latest Blogs on Technology and Innovation
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Discover blogs that bring you the latest insights, trends, and strategies to stay ahead in the digital
            world.
          </p>
          <SearchBox onSearch={handleSearch} placeholder="Search blog posts…" className="mt-8 max-w-xl mx-auto" />
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          {isError ? (
            <ErrorState message="We couldn't load the blog posts." onRetry={refetch} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : !data?.data?.length ? (
            <EmptyState
              title="No blog posts found"
              message={search ? `Nothing matched "${search}" — try a different search.` : "Check back soon for new posts."}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.data.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={page} totalPages={data.totalPages || 1} onChange={setPage} />
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
