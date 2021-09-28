
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		solidPlugin(),
	],
	base: "./",
	publicDir: "_",
	cacheDir: ".vite",
	//[#`...${JSON.stringify(config.vite || {}, null, "\t").replaceAll("\n", "\n\t")}`],
	build: {
		sourcemap: true,
		outDir: "[#config.outDir]",
		assetsDir: "_",
		target: "esnext",
		polyfillDynamicImport: false,
		polyfillModulePreload: false,
		emptyOutDir: false,
		minify: "terser",
		//[#`...${JSON.stringify(config.vite?.build || {}, null, "\t").replaceAll("\n", "\n\t\t")}`],
	},
});
