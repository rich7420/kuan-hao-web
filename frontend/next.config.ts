import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Required for Docker/Cloud Run (produces .next/standalone and server.js)
  // /api/backend/* is handled by app/api/backend/[...path]/route.ts (forwards headers, no CORS)
};

export default nextConfig;
