export const BLOG_PAGE_SIZE = 9;

// Average adult silent reading speed, used by blogService's reading-time
// estimate — the "Reading time" feature the CMS spec calls for.
export const WORDS_PER_MINUTE = 200;

export const BLOG_QUERY_KEYS = {
  list: (params) => ["blogs", "list", params],
  detail: (slug) => ["blogs", "detail", slug],
};
