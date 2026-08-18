import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^node:module$/,
        path.resolve(process.cwd(), "lib/node-module-shim.ts"),
      ),
    );

    return config;
  },
};

export default nextConfig;
