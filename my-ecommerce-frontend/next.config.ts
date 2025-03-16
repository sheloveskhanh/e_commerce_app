/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', 
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
