import api from "@/utlis/api.js";

/** @returns {Promise<import("../types/blog.types.js").BlogListResponse>} */
export const fetchBlogs = async ({ page, limit, search, category } = {}) => {
  const res = await api.get("/api/v1/blog", {
    params: { page, limit, search: search || undefined, category: category || undefined },
  });
  return res.data;
};

export const fetchBlogBySlug = async (slug) => {
  const res = await api.get(`/api/v1/blog/slug/${slug}`);
  return res.data;
};

export const createBlog = async (formData) => {
  const res = await api.post("/api/v1/blog", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateBlog = async (id, formData) => {
  const res = await api.put(`/api/v1/blog/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/api/v1/blog/${id}`);
  return res.data;
};
