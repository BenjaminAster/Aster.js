
import {
	generateTSX,
} from "./generateTSX.deno.ts";

import {
	modifyCodeObject,
} from "./modifyCodeObject.deno.ts";

import {
	asterjsParser,
} from "./asterjsParser.deno.ts";

import {
	createSolidFiles,
} from "./solidFiles.deno.ts";

import {
	sleep,
	addDotSlash,
	toConsoleCSSArray,
	isWindows,
	denoArgs,
	version,
	runCommand,
} from "./utils.deno.ts";

import {
	afterBuild,
} from "./afterBuild/afterBuild.deno.ts";


export async function createApp(): Promise<void> {
	if (denoArgs.version) {
		console.info(...toConsoleCSSArray([
			[version, { color: "lightgray", fontWeight: "bold" }],
		]));
	} else if (denoArgs.help) {
		console.info(...toConsoleCSSArray([
			["Just look at the ", { color: "lightgray" }],
			["Aster.js ", { color: "deepskyblue" }],
			["GitHub repo: š ", { color: "lightgray" }],
			["https://github.com/BenjaminAster/Aster.js", { color: "orange" }],
		], { fontWeight: "bold" }));
	} else {
		const asterjsConfig: { [key: string]: any } = await (async () => {
			try {
				return (await import(`file://${Deno.cwd()}/asterjs.config.ts`))?.default;
			} catch (err) {
				console.error(...toConsoleCSSArray([
					[`\nā No `, { color: "red" }],
					[`asterjs.config.ts `, { color: "deepskyblue" }],
					[`was found `, { color: "red" }],
					[`inside folder š `, { color: "lightgray" }],
					[Deno.cwd(), { color: "orange" }],
					[`. š§`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
				throw new Error(err);
			}
		})();

		if (!asterjsConfig || typeof asterjsConfig !== "object") {
			console.error(...toConsoleCSSArray([
				[`ā asterjs.config.ts `, { color: "deepskyblue" }],
				[`doesn't export š a valid Aster.js configuration object. š©`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error();
		}

		const config: any = {
			...asterjsConfig,
			vite: {
				base: "./",
				publicDir: "./_/",
				...asterjsConfig.vite,
				build: {
					sourcemap: true,
					outDir: `.${addDotSlash(asterjsConfig.outDir)}`,
					assetsDir: "./_/",
					target: "esnext",
					polyfillDynamicImport: false,
					polyfillModulePreload: false,
					emptyOutDir: false,
					...asterjsConfig.vite?.build,
				},
			},
			entry: addDotSlash(asterjsConfig.entry || "./index.asterjs"),
			html: addDotSlash(asterjsConfig.html || "./index.html"),
			outDir: addDotSlash(asterjsConfig.outDir || "./build/"),
		};

		console.info(...toConsoleCSSArray([
			["\nAster.js ", { color: "lightgray" }],
			["š„ started ", { color: "yellow" }],
			["compiling š¾ ", { color: "lightgray" }],
			[config.entry, { color: "aqua" }],
			[" into folder š ", { color: "lightgray" }],
			[config.outDir, { color: "orange" }],
			[". š", { color: "lightgray" }],
		], { fontWeight: "bold" }));

		await createSolidFiles(
			await createAppCode(config),
			config,
		);

		await viteBuild(config);
	}
}

async function createAppCode(config: any): Promise<any> {
	const asterjsCode: string = await (async (): Promise<string> => {
		try {
			return await Deno.readTextFile(`./${config.entry}`);
		} catch (err) {
			console.error(...toConsoleCSSArray([
				[`ā Could not find `, { color: "red" }],
				[`the file `, { color: "lightgray" }],
				[config.entry, { color: "orange" }],
				[`, which was specified as `, { color: "lightgray" }],
				[`entry `, { color: "deepskyblue" }],
				[`in `, { color: "lightgray" }],
				[`asterjs.config.ts`, { color: "gold" }],
				[`.`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error(err);
		}
	})();

	try {
		// const codeObject: any = changeCodeObject(asterjsParser(asterjsCode));
		// const {
		// 	solidJSCode,
		// 	SCSSCode,
		// } = generateTSX(codeObject);

		const {
			solidJSCode,
			SCSSCode,
		} = generateTSX(asterjsCode);

		return {
			[config.entry]: {
				tsx: solidJSCode,
				scss: SCSSCode,
			},
		};
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`ā Something went wrong š„ŗ `, { color: "red" }],
			[`while parsing the content of the `, { color: "lightgray" }],
			[config.entry, { color: "orange" }],
			[` file. š¾  `, { color: "lightgray" }],
			[`Please make sure all the `, { color: "lightgray" }],
			[`Aster.js`, { color: "deepskyblue" }],
			[`-syntax is correct. šŖ`, { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error(err);
	}
}

export async function viteBuild(config: any): Promise<void> {
	try {
		await runCommand([`npm`, `run`, `build`], config.viteLog, "./.asterjs");
	} catch (err) {
		console.error(...toConsoleCSSArray([
			["\nā Aster.js ", { color: "lightgray" }],
			["failed ", { color: "red" }],
			["compiling š¾ ", { color: "lightgray" }],
			[config.entry, { color: "aqua" }],
			[" into folder ", { color: "lightgray" }],
			[config.outDir, { color: "orange" }],
			[". š\n", { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error();
	}

	await afterBuild(config);
}
