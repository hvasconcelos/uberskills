import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: [
    "@uberskillz/ui",
    "@uberskillz/db",
    "@uberskillz/skill-engine",
    "@uberskillz/types",
  ],
};

export default nextConfig;
