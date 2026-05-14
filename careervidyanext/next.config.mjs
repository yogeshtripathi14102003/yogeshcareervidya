

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   env: {
//     INTERNAL_API_URL: process.env.INTERNAL_API_URL,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//     ],
//   },

//   async rewrites() {
//     return [
//       // 1. आपका मौजूदा सबडोमेन लॉजिक
//       {
//         source: "/",
//         has: [
//           {
//             type: "host",
//             value: "technical.careervidya.in",
//           },
//         ],
//         destination: "/MBA/home",
//       },

      
//       // 2. API प्रॉक्सी लॉजिक (यहाँ से बैकएंड छुपाएं)
//       {
//         source: "/api/v1/:path*",
//         destination: "https://api.careervidya.in/api/v1/:path*",
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