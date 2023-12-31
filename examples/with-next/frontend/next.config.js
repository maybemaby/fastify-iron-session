/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      destination: "http://localhost:5000/:path*",
      source: "/api/:path*",
    },
  ],
};

module.exports = nextConfig;
