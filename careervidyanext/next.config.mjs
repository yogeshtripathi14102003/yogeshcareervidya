// // /** @type {import('next').NextConfig} */
// // const nextConfig = {};

// // export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com", // ✅ allow Cloudinary images
//       },
//     ],
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/",
//         has: [
//           {
//             type: "host",
//             value: "technical.careervidya.in", // ✅ subdomain condition
//           },
//         ],
//         destination: "/MBA/home", // ✅ show this page
//       },
//     ];
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return [
      // 1. आपका मौजूदा सबडोमेन लॉजिक
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "technical.careervidya.in",
          },
        ],
        destination: "/MBA/home",
      },

      
      // 2. API प्रॉक्सी लॉजिक (यहाँ से बैकएंड छुपाएं)
      {
        source: "/api/v1/:path*",
        destination: "https://api.careervidya.in/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;  