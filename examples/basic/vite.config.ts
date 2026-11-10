import { defineConfig } from "vite";

export default defineConfig({
  server: {
    fs: {
      // @metacrud/core is linked from the workspace (`packages/core`).
      allow: ["../.."],
    },
  },
});
