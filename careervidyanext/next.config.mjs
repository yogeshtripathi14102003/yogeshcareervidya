


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // ✅ Hide tech stack from attackers
//   poweredByHeader: false,

//   // ✅ Enable gzip compression
//   compress: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/dgiqwmopv/**",
//       },
//       {
//         protocol: "https",
//         hostname: "api.careervidya.in",
//       },
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//       },
//     ],
//   },

//   experimental: {
//     staleTimes: {
//       dynamic: 300,  // 5 min — /course/[slug], /university/[slug]
//       static: 3600,  // 1 hour — /explore and other static-ish pages
//     },
//   },

//   // ✅ Security Headers
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//           {
//             key: "Strict-Transport-Security",
//             value: "max-age=63072000; includeSubDomains; preload",
//           },
//           {
//             key: "Permissions-Policy",
//             value: "camera=(), microphone=(), geolocation=()",
//           },
//           {
//             key: "Content-Security-Policy",
//             value: [
//               "default-src 'self'",
//               "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
//               "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//               "font-src 'self' https://fonts.gstatic.com data:",
//               "img-src 'self' data: blob: https://res.cloudinary.com https://api.careervidya.in https://images.unsplash.com https://upload.wikimedia.org",
//               "connect-src 'self' https://api.careervidya.in wss://api.careervidya.in",
//               "frame-ancestors 'none'",
//               "base-uri 'self'",
//               "object-src 'none'",
//             ].join("; "),
//           },
//         ],
//       },
//     ];
//   },

//   async rewrites() {
//     const apiUrl = process.env.API_URL || "https://api.careervidya.in"; // Default to localhost if not set

//     return [
//       // {
//       //   source: "/",
//       //   has: [{ type: "host", value: "technical.careervidya.in" }],
//       //   destination: "/MBA/home",
//       // },
//       {
//         source: "/api/v1/:path*",
//         destination: `${apiUrl}/api/v1/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // ✅ Hide tech stack from attackers
//   poweredByHeader: false,

//   // ✅ Enable gzip compression
//   compress: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/dgiqwmopv/**",
//       },
//       {
//         protocol: "https",
//         hostname: "api.careervidya.in",
//       },
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//       },
//     ],
//   },

//   experimental: {
//     staleTimes: {
//       dynamic: 300,  // 5 min — /course/[slug], /university/[slug]
//       static: 3600,  // 1 hour — /explore and other static-ish pages
//     },
//   },

//   // ✅ Security Headers
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//           {
//             key: "Strict-Transport-Security",
//             value: "max-age=63072000; includeSubDomains; preload",
//           },
//           {
//             key: "Permissions-Policy",
//             value: "camera=(), microphone=(), geolocation=()",
//           },
//           {
//             key: "Content-Security-Policy",
//             value: [
//               "default-src 'self'",
//               "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
//               "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//               "font-src 'self' https://fonts.gstatic.com data:",
//               "img-src 'self' data: blob: https://res.cloudinary.com https://api.careervidya.in https://images.unsplash.com https://upload.wikimedia.org",
//               "connect-src 'self' https://api.careervidya.in wss://api.careervidya.in",
//               "frame-ancestors 'none'",
//               "base-uri 'self'",
//               "object-src 'none'",
//             ].join("; "),
//           },
//         ],
//       },
//     ];
//   },

//   // ✅ SEO fix — /Home was a duplicate of / (duplicate H1 + meta description
//   // in Search Console). 308 permanent redirect merges ranking signals into /
//   async redirects() {
//     return [
//       // ✅ SEO fix — www.careervidya.in and careervidya.in were both serving
//       // identical content with no redirect (confirmed duplicate: same HTML,
//       // separate 200 OK on both hosts). This was splitting ranking signals
//       // and risking duplicate-content treatment in Search Console.
//       // 308 (permanent) redirect merges www → non-www, matching the
//       // canonical tag already set via metadataBase in layout.js.
//       {
//         source: "/:path*",
//         has: [{ type: "host", value: "www.careervidya.in" }],
//         destination: "https://careervidya.in/:path*",
//         permanent: true,
//       },
//       {
//         source: "/Home",
//         destination: "/",
//         permanent: true,
//       },
//       // extra safety: catches lowercase/uppercase variants some crawlers hit
//       {
//         source: "/home",
//         destination: "/",
//         permanent: true,
//       },
//     ];
//   },

//   async rewrites() {
//     const apiUrl = process.env.API_URL || "https://api.careervidya.in"; // Default to localhost if not set

//     return [
//       // {
//       //   source: "/",
//       //   has: [{ type: "host", value: "technical.careervidya.in" }],
//       //   destination: "/MBA/home",
//       // },
//       {
//         source: "/api/v1/:path*",
//         destination: `${apiUrl}/api/v1/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide tech stack
  poweredByHeader: false,

  // Enable compression
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dgiqwmopv/**",
      },
      {
        protocol: "https",
        hostname: "api.careervidya.in",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  experimental: {
    staleTimes: {
      dynamic: 300,
      static: 3600,
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",

              // JavaScript
              "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",

              // CSS
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // Fonts
              "font-src 'self' https://fonts.gstatic.com data:",

              // Images
              "img-src 'self' data: blob: https://res.cloudinary.com https://api.careervidya.in https://images.unsplash.com https://upload.wikimedia.org",

              // API / WebSocket
              "connect-src 'self' https://api.careervidya.in wss://api.careervidya.in",

              // ✅ IFRAME SOURCES
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",

              // Prevent other websites from embedding CareerVidya
              "frame-ancestors 'none'",

              // Security
              "base-uri 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // SEO redirects
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.careervidya.in",
          },
        ],
        destination: "https://careervidya.in/:path*",
        permanent: true,
      },
      {
        source: "/Home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    const apiUrl =
      process.env.API_URL || "https://api.careervidya.in";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;