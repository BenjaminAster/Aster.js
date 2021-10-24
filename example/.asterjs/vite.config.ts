
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		solidPlugin(),
	],
	...{
		"base": "./",
		"publicDir": "./_/",
		"build": {
			"sourcemap": true,
			"outDir": "../build",
			"assetsDir": "./_/",
			"target": "esnext",
			"polyfillDynamicImport": false,
			"polyfillModulePreload": false,
			"emptyOutDir": false
		},
		"css": {
			"preprocessorOptions": {
				"scss": {}
			}
		}
	},
});
