"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBlogBySlug } from "../api/blogApi.js";
import { BLOG_QUERY_KEYS } from "../constants/blogConstants.js";

export function useBlogDetail(slug, initialData) {
  return useQuery({
    queryKey: BLOG_QUERY_KEYS.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
    initialData,
    enabled: !!slug,
  });
}
