/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.postimg.cc"], // ✅ Allow postimg.cc as an external image domain
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
    ],
  },
};

module.exports = nextConfig;
