import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@repo/ui"],
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/account/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
