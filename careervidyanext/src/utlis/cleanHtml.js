// utils/cleanHtml.js

/**
 * Cleans HTML coming from RichTextField / WYSIWYG editors.
 * - Converts &nbsp; (and unicode nbsp) to normal spaces
 * - Removes empty <p></p> tags
 * - Trims trailing whitespace
 *
 * Use this BEFORE dangerouslySetInnerHTML to avoid the
 * visible "&nbsp;" text artifacts and cramped paragraphs.
 */
export const cleanHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    return html
        .replace(/&nbsp;/g, " ")
        .replace(/\u00a0/g, " ")
        .replace(/<p>\s*<\/p>/g, "")
        .replace(/<p>&nbsp;<\/p>/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
};

/**
 * Strips all HTML tags — for meta descriptions and plain-text previews.
 */
export const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    return cleanHtml(html)
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
};