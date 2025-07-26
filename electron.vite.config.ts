import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node16",
    outDir: "dist-electron",
    emptyOutDir: false,
    lib: {
      entry: {
        main: "electron/main.ts",
        preload: "electron/preload.ts"
      },
      formats: ["cjs"]
    },
    rollupOptions: {
      external: ["electron"],
      output: {
        entryFileNames: "[name].cjs"
      }
    },
    minify: false
  }
});
