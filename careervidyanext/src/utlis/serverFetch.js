



// export const serverFetch = async (path, options = {}) => {
//   const baseURL = process.env.API_URL || "https://api.careervidya.in";

//   const res = await fetch(`${baseURL}${path}`, {
//     ...options,
//   });

//   return res;
// };


// utlis/serverFetch.js

/**
 * Server-only fetch helper.
 * Returns { ok, status, data } — NOT a raw Response object.
 * Do NOT call .json() on the result of this function; the body is
 * already parsed and available on `.data`.
 */
export const serverFetch = async (path, options = {}) => {
  const baseURL = process.env.API_URL;

  if (!baseURL) {
    throw new Error(
      "serverFetch: API_URL environment variable is not set. " +
        "Set it in your .env / deployment environment config."
    );
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 8000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Strip our custom option before spreading into native fetch,
  // since fetch() doesn't understand `timeoutMs`.
  const { timeoutMs: _omit, ...fetchOptions } = options;

  try {
    const res = await fetch(`${baseURL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`serverFetch: ${path} returned ${res.status}`);
      return { ok: false, status: res.status, data: null };
    }

    let data = null;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error(`serverFetch: ${path} returned non-JSON body`, parseErr.message);
      return { ok: false, status: res.status, data: null };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    clearTimeout(timeoutId);
    const reason = err.name === "AbortError" ? "timeout" : err.message;
    console.error(`serverFetch: ${path} failed — ${reason}`);
    return { ok: false, status: 0, data: null };
  }
};

export const resolveImageUrl = (path, fallback = "/fallback.png") => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;

  const baseURL = process.env.API_URL;
  if (!baseURL) {
    console.error(
      "resolveImageUrl: API_URL environment variable is not set — cannot resolve:",
      path
    );
    return fallback;
  }

  return `${baseURL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};