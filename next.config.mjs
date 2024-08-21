import createJiti from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com", protocol: "https" },
      { hostname: "lh3.googleusercontent.com", protocol: "https" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
