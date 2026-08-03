import { WORDS_PER_MINUTE } from "../constants/blogConstants.js";

/** Strips HTML tags for a plain-text word count / excerpt source. */
const stripHtml = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** Estimated reading time in minutes from a blog's content blocks. */
export const estimateReadingTime = (contentBlocks = []) => {
  const text = contentBlocks
    .filter((b) => b?.type === "paragraph" || b?.type === "quote")
    .map((b) => b.text || "")
    .join(" ");
  const wordCount = stripHtml(text).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

/** First ~155 characters of plain text, for a meta-description-style excerpt. */
export const getExcerpt = (contentBlocks = [], maxLength = 155) => {
  const firstParagraph = contentBlocks.find((b) => b?.type === "paragraph");
  const text = stripHtml(firstParagraph?.text || "");
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
};

export const formatBlogDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** True if this blog was updated meaningfully after publishing (not just a
 * timestamp jitter from an unrelated re-save). */
export const wasEdited = (blog) => {
  if (!blog?.createdAt || !blog?.updatedAt) return false;
  return new Date(blog.updatedAt).getTime() - new Date(blog.createdAt).getTime() > 60_000;
};
