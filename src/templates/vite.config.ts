
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		solidPlugin(),
	],
	base: "./",
	publicDir: "_",
	cacheDir: ".vite",
	//[#aster.stringifiedViteConfig.all],
	build: {
		sourcemap: true,
		outDir: "../[#config.outDir]/",
		assetsDir: "_",
		target: "esnext",
		polyfillDynamicImport: false,
		polyfillModulePreload: false,
		emptyOutDir: true,
		minify: "terser",
		//[#aster.stringifiedViteConfig.build],
	},
});
