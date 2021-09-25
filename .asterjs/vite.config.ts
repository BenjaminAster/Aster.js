
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		solidPlugin(),
	],
	base: "./",
	publicDir: "_",
	cacheDir: ".vite",
	...{
		"build": {}
	},
	build: {
		sourcemap: true,
		outDir: "../build/",
		assetsDir: "_",
		target: "esnext",
		polyfillDynamicImport: false,
		polyfillModulePreload: false,
		emptyOutDir: true,
		minify: "terser",
		...{},
	},
});
