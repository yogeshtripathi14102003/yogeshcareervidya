



export const serverFetch = async (path, options = {}) => {
  const baseURL = process.env.API_URL || "https://api.careervidya.in";

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
  });

  return res;
};



// export const serverFetch = async (path, options = {}) => {
//   const baseURL = process.env.API_URL;

//   // ✅ Fail loud and fast if the env var is missing, instead of silently
//   // building an "undefined/api/v1/..." URL that fails confusingly later.
//   // This surfaces a clear, actionable error in deployment/build logs.
//   if (!baseURL) {
//     throw new Error(
//       "serverFetch: API_URL environment variable is not set. " +
//         "Set it in your .env / deployment environment config."
//     );
//   }

//   // ✅ Abort the request if the backend doesn't respond in time.
//   // Without this, a slow/hanging API can stall page render indefinitely —
//   // and crawlers (Googlebot) that time out mid-request end up indexing
//   // a blank/loading state instead of real content.
//   const controller = new AbortController();
//   const timeoutMs = options.timeoutMs || 8000; // 8s default, tune as needed
//   const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const res = await fetch(`${baseURL}${path}`, {
//       ...options,
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     // ✅ fetch() does NOT throw on 4xx/5xx — only on network failure.
//     // Without this check, a 404/500 response gets silently parsed as JSON
//     // (or crashes on .json()), bubbling up as an uncaught error with no
//     // error.js boundary to catch it gracefully.
//     if (!res.ok) {
//       console.error(`serverFetch: ${path} returned ${res.status}`);
//       return { ok: false, status: res.status, data: null };
//     }

//     const data = await res.json();
//     return { ok: true, status: res.status, data };
//   } catch (err) {
//     clearTimeout(timeoutId);

//     // ✅ Catches network failures, DNS errors, and our own timeout abort.
//     // This is what prevents an uncaught exception from crashing the page
//     // render and falling back to Next.js's generic error/loading state.
//     const reason = err.name === "AbortError" ? "timeout" : err.message;
//     console.error(`serverFetch: ${path} failed — ${reason}`);
//     return { ok: false, status: 0, data: null };
//   }
// };

// // ✅ Centralized image-URL resolver — this is the ONLY place BASE_URL
// // logic for images should live. Call this on the server (e.g. right
// // after serverFetch returns data) to turn relative paths into full URLs
// // before passing data down to client components. Client components then
// // never need process.env.NEXT_PUBLIC_API_URL or their own getFullImageUrl.
// export const resolveImageUrl = (path, fallback = "/fallback.png") => {
//   if (!path) return fallback;
//   if (path.startsWith("http")) return path;

//   const baseURL = process.env.API_URL;
//   if (!baseURL) {
//     console.error("resolveImageUrl: API_URL environment variable is not set — cannot resolve:", path);
//     return fallback;
//   }

//   return `${baseURL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };