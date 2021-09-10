
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		solidPlugin(),
	],
	base: "./",
	publicDir: "_",
	cacheDir: ".vite",
	build: {
		sourcemap: true,
		outDir: "../build/",
		assetsDir: "_",
		target: "esnext",
		polyfillDynamicImport: false,
	},
});