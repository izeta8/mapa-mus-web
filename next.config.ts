import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/tournament/:path*',
        destination: '/torneo/:path*',
        permanent: true, // Esto aplica un estado HTTP 308 (Redirección permanente)
      },
    ];
  },
};

export default nextConfig;
