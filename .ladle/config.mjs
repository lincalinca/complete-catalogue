import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@ladle/react').Config} */
const config = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  // Point to a Vite config file so Ladle doesn't try to treat the object as a path.
  viteConfig: path.resolve(__dirname, "./vite.config.mjs"),
};

export default config;
