import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
 

};
 module.exports = {
  allowedDevOrigins: ['192.168.2.19'],
}

export default nextConfig;
