import { defineConfig } from "vite";

export default defineConfig({
  server: {
    fs: {
      // cints-core is linked from the parent directory (`file:..`).
      allow: [".."],
    },
  },
});
