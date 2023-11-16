import svgr from "vite-plugin-svgr";
import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [svgr({
    exportAsDefault: false
  })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        'raw.js': resolve(__dirname, "src/raw.js"),
        'index.js': resolve(__dirname, "src/main.js"),
        'components.js': resolve(__dirname, "src/components.js")
      },
      name: "MyLib",
      // the proper extensions will be added
      fileName: (format, entryName) => entryName,
      formats: ['es']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      // external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
      },
    },
  },
};
