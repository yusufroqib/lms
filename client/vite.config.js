import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
  optimizeDeps: {
    include: ['ckeditor5-custom-build'],
  },
  build: {
    commonjsOptions: { exclude: ['ckeditor5-custom-build'], include: [] },
  },

});
