
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
		"logLevel": "info",
		"build": {
			"sourcemap": false
		},
		"css": {
			"preprocessorOptions": {
				"scss": {}
			}
		}
	},
	build: {
		sourcemap: true,
		outDir: "C:/Users/Benja/Documents - SSD/Firebase/Website/public/asterjs/example/build",
		assetsDir: "_",
		target: "esnext",
		polyfillDynamicImport: false,
		polyfillModulePreload: false,
		emptyOutDir: false,
		minify: "terser",
		...{
			"sourcemap": false
		},
	},
});
