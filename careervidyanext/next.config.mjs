

// // export default nextConfig;  
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//     ],
//   },

//   async rewrites() {
//     // 1. Pehle check karein variable hai ya nahi, nahi toh empty string ya local URL dein
//     const apiUrl = process.env.API_URL || 'https://api.careervidya.in'; 

//     return [
//       {
//         source: "/",
//         has: [{ type: "host", value: "technical.careervidya.in" }],
//         destination: "/MBA/home",
//       },
//       {
//         source: "/api/v1/:path*",
//         destination: `${apiUrl}/api/v1/:path*`, // Ab yeh hamesha valid URL hoga
//       },
//     ];
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // ✅ ADDED — fixes "data reloads every time I go back from a detail page".
  // Your server-side `revalidate: 3600` / `revalidate: 60` (in serverFetch
  // calls) only controls the BACKEND fetch cache. This `staleTimes` setting
  // controls the separate CLIENT router cache — i.e. whether Next.js
  // re-renders a page from scratch when you navigate back to it. Without
  // this, the client cache for dynamic pages (course/[slug], university/[slug])
  // defaults to ~0s, so every back-navigation looked like a fresh load even
  // though the backend data was already cached.
  experimental: {
    staleTimes: {
      dynamic: 300,  // 5 min — /course/[slug], /university/[slug]
      static: 3600,  // 1 hour — /explore and other static-ish pages
    },
  },

  async rewrites() {
    // 1. Pehle check karein variable hai ya nahi, nahi toh empty string ya local URL dein
    const apiUrl = process.env.API_URL || 'https://api.careervidya.in';

    return [
      {
        source: "/",
        has: [{ type: "host", value: "technical.careervidya.in" }],
        destination: "/MBA/home",
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`, // Ab yeh hamesha valid URL hoga
      },
    ];
  },
};

export default nextConfig;