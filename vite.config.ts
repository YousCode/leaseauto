import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  optimizeDeps: {
    entries: ["src/main.tsx"],
    exclude: ["src/tempobook"],
  },
  plugins: [react(), tempo()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aggressive size optimization
    chunkSizeWarningLimit: 300,
    // Enable minification with terser
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
      },
    },
    // Optimize asset handling
    assetsInlineLimit: 2048,
    // Aggressive code splitting
    rollupOptions: {
      // Exclude tempobook and large assets from production
      external:
        process.env.NODE_ENV === "production"
          ? ["src/tempobook", /\.mp4$/, /\.webm$/, /\.mov$/]
          : [],
      output: {
        // More granular chunking to stay under size limits
        manualChunks: (id) => {
          // Core React chunks
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-core";
          }
          // Router chunk
          if (id.includes("react-router")) {
            return "router";
          }
          // Radix UI components - split into smaller chunks
          if (id.includes("@radix-ui")) {
            if (id.includes("dialog") || id.includes("alert-dialog")) {
              return "radix-dialogs";
            }
            if (id.includes("select") || id.includes("dropdown")) {
              return "radix-selects";
            }
            return "radix-ui";
          }
          // Supabase
          if (id.includes("@supabase")) {
            return "supabase";
          }
          // Query client
          if (id.includes("@tanstack/react-query")) {
            return "query";
          }
          // Icons
          if (id.includes("lucide-react") || id.includes("react-icons")) {
            return "icons";
          }
          // Animation libraries
          if (id.includes("framer-motion")) {
            return "animations";
          }
          // Utilities
          if (
            id.includes("clsx") ||
            id.includes("class-variance-authority") ||
            id.includes("tailwind-merge")
          ) {
            return "utils";
          }
          // Three.js and related
          if (id.includes("three") || id.includes("@react-three")) {
            return "three";
          }
          // Form libraries
          if (id.includes("react-hook-form") || id.includes("@hookform")) {
            return "forms";
          }
          // Date libraries
          if (id.includes("date-fns") || id.includes("react-day-picker")) {
            return "dates";
          }
          // Other large libraries
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Optimize chunk names and sizes
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop()
            : "chunk";
          return `assets/[name]-[hash].js`;
        },
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
  },
});