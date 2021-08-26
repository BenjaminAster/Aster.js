
import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";


export async function createSolidFiles() {
	await Deno.writeTextFile("./.asterjs/index.html", indexHTML);
	await Deno.writeTextFile("./.asterjs/tsconfig.json", tsConfig);
	await Deno.writeTextFile("./.asterjs/vite.config.ts", viteConfig);
	await Deno.writeTextFile("./.asterjs/package.json", packageJSON);

	await ensureDir("./.asterjs/src");
	await emptyDir("./build");
}

// ####################

const indexHTML = [
	`<!DOCTYPE html>`,
	`<html lang="en">`,
	``,
	`<head>`,
	`	<meta charset="utf-8" />`,
	`	<meta name="viewport" content="width=device-width, initial-scale=1" />`,
	`	<meta name="theme-color" content="#000000" />`,
	`	<title>Solid App</title>`,
	`</head>`,
	``,
	`<body>`,
	`	<noscript>You need to enable JavaScript to run this app.</noscript>`,
	`	<div id="root"></div>`,
	``,
	`	<script src="/src/App.tsx" type="module"></script>`,
	`	<style>`,
	`		:root { color-scheme: dark; }`,
	`		body { font-family: sans-serif; background-color: #111; color: white; }`,
	`	</style>`,
	`</body>`,
	``,
	`</html>`,
].join("\n");

const tsConfig = JSON.stringify(
	{
		compilerOptions: {
			target: "ESNext",
			module: "ESNext",
			moduleResolution: "node",
			allowSyntheticDefaultImports: true,
			esModuleInterop: true,
			jsx: "preserve",
			jsxImportSource: "solid-js",
			types: [
				"viteclient",
			],
		},
	},
	null, "\t"
);

const viteConfig = [
	`import { defineConfig } from "vite";`,
	`import solidPlugin from "vite-plugin-solid";`,
	``,
	`// Please install the following npm packages:`,
	`//   solid-js`,
	`//   vite`,
	`//   vite-plugin-solid`,
	``,
	`export default defineConfig({`,
	`	plugins: [`,
	`		solidPlugin(),`,
	`	],`,
	`	base: "./",`,
	`	publicDir: "_",`,
	`	cacheDir: ".vite",`,
	`	build: {`,
	`		sourcemap: true,`,
	`		outDir: "../build/",`,
	`		assetsDir: "_",`,
	`		target: "esnext",`,
	`		polyfillDynamicImport: false,`,
	`	},`,
	`});`,
].join("\n");


const packageJSON = JSON.stringify(
	{
		scripts: {
			build: "vite build",
		},
	},
	null, "\t"
);
