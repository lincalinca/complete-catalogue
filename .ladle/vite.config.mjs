import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "..") },
      { find: "@/components", replacement: path.resolve(__dirname, "../../crescender-core/components") },
      { find: "@/lib", replacement: path.resolve(__dirname, "../../crescender-core/lib") },
      { find: "next/link", replacement: path.resolve(__dirname, "../stories/mocks/next-link.tsx") },
      { find: "next/navigation", replacement: path.resolve(__dirname, "../stories/mocks/next-navigation.ts") },
      { find: "next/image", replacement: path.resolve(__dirname, "../stories/mocks/next-image.tsx") },
    ],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, ".."), // complete-catalogue
        path.resolve(__dirname, "../../crescender-core"), // core app components
      ],
    },
  },
});
