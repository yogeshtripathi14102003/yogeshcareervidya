"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../api/blogApi.js";
import { BLOG_PAGE_SIZE, BLOG_QUERY_KEYS } from "../constants/blogConstants.js";

/**
 * @param {{ page?: number, search?: string, category?: string, initialData?: import("../types/blog.types.js").BlogListResponse }} params
 */
export function useBlogs({ page = 1, search = "", category = "", initialData } = {}) {
  const params = { page, limit: BLOG_PAGE_SIZE, search, category };

  return useQuery({
    queryKey: BLOG_QUERY_KEYS.list(params),
    queryFn: () => fetchBlogs(params),
    // Only the very first page with no search/category matches what the
    // server component already fetched — everything else is a real fetch.
    initialData: page === 1 && !search && !category ? initialData : undefined,
    placeholderData: (previous) => previous, // keep old page visible while the next one loads, instead of flashing empty
  });
}
