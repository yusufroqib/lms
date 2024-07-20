import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
	plugins: [react(), removeConsole()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	optimizeDeps: {
		include: ["ckeditor5-custom-build", "postcss-nesting"],
	},
	build: {
		// commonjsOptions: { exclude: ["ckeditor5-custom-build"], include: [] },
		sourcemap: true,
		rollupOptions: {
			onwarn(warning, defaultHandler) {
				if (warning.code === "SOURCEMAP_ERROR") {
					return;
				}
				defaultHandler(warning);
			},
		},
	},
});
