// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ allow Cloudinary images
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "technical.careervidya.in", // ✅ subdomain condition
          },
        ],
        destination: "/MBA/home", // ✅ show this page
      },
    ];
  },
};

export default nextConfig;

