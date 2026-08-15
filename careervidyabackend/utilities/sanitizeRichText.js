/**
 * Strips the dangerous parts of user-submitted rich-text HTML before it's
 * stored. The editor itself (RichTextEditor.jsx) only ever produces safe
 * output via document.execCommand, but nothing stops someone from posting
 * directly to the API with hand-crafted HTML, so this is the real
 * enforcement point, not the frontend.
 */
export const sanitizeRichText = (html) => {
  if (typeof html !== "string") return "";

  return html
    // <script>...</script> and self-closing/empty variants
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script\b[^>]*\/?>/gi, "")
    // <style>/<iframe>/<object>/<embed> — no legitimate use in a Q&A answer
    .replace(/<(style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(iframe|object|embed)\b[^>]*\/?>/gi, "")
    // inline event handlers: onclick="", onerror='', etc.
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    // javascript:/data: URIs in href/src
    .replace(/(href|src)\s*=\s*"(javascript|data):[^"]*"/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*'(javascript|data):[^']*'/gi, "$1='#'");
};
