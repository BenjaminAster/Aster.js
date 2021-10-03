
import {
	generateTSX,
} from "./generateTSX.deno.ts";

import {
	changeCodeObject,
} from "./changeCodeObject.deno.ts";

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
			["GitHub repo: 👉 ", { color: "lightgray" }],
			["https://github.com/BenjaminAster/Aster.js", { color: "orange" }],
		], { fontWeight: "bold" }));
	} else {
		const asterjsConfig: { [key: string]: string } = await (async () => {
			try {
				return (await import(`file://${Deno.cwd()}/asterjs.config.ts`))?.default;
			} catch (err) {
				console.error(...toConsoleCSSArray([
					[`\n❌ No `, { color: "red" }],
					[`asterjs.config.ts `, { color: "deepskyblue" }],
					[`was found `, { color: "red" }],
					[`inside folder 📂 `, { color: "lightgray" }],
					[Deno.cwd(), { color: "orange" }],
					[`. 🧐`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
				throw new Error(err);
			}
		})();

		if (!asterjsConfig || typeof asterjsConfig !== "object") {
			console.error(...toConsoleCSSArray([
				[`❌ asterjs.config.ts `, { color: "deepskyblue" }],
				[`doesn't export 🚀 a valid Aster.js configuration object. 💩`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error();
		}

		const config: any = {
			...asterjsConfig,
			entry: addDotSlash(asterjsConfig.entry || "./index.asterjs"),
			html: addDotSlash(asterjsConfig.html || "./index.html"),
			outDir: addDotSlash(asterjsConfig.outDir || "./build/"),
		};

		console.info(...toConsoleCSSArray([
			["\nAster.js ", { color: "lightgray" }],
			["🔥 started ", { color: "yellow" }],
			["compiling 💾 ", { color: "lightgray" }],
			[config.entry, { color: "aqua" }],
			[" into folder 📂 ", { color: "lightgray" }],
			[config.outDir, { color: "orange" }],
			[". 😎", { color: "lightgray" }],
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
				[`❌ Could not find `, { color: "red" }],
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
		const codeObject: any = changeCodeObject(asterjsParser(asterjsCode));
		const {
			solidJSCode,
			SCSSCode,
		} = generateTSX(codeObject);

		return {
			[config.entry]: {
				tsx: solidJSCode,
				scss: SCSSCode,
			},
		};
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`❌ Something went wrong 🥺 `, { color: "red" }],
			[`while parsing the content of the `, { color: "lightgray" }],
			[config.entry, { color: "orange" }],
			[` file. 💾  `, { color: "lightgray" }],
			[`Please make sure all the `, { color: "lightgray" }],
			[`Aster.js`, { color: "deepskyblue" }],
			[`-syntax is correct. 💪`, { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error(err);
	}
}

export async function viteBuild(config: any): Promise<void> {
	if (!(await (await (async (): Promise<Deno.Process> => {
		const stdout = config.viteLog ? "inherit" : "null";
		if (isWindows) {
			await Deno.writeTextFile(`./.asterjs/vite-build.cmd`, [
				`cd ./.asterjs/`,
				`npm run build`,
				`cd ../`,
			].join("\n"));

			await sleep();

			return Deno.run({
				cmd: [`./.asterjs/vite-build.cmd`],
				cwd: "./",
				stdout,
			});
		} else {
			return Deno.run({
				cmd: [
					`npm`,
					`run`,
					`build`,
				],
				cwd: `./.asterjs`,
				stdout,
			});
		}
	})()).status()).success) {
		console.error(...toConsoleCSSArray([
			["\n❌ Aster.js ", { color: "lightgray" }],
			["failed ", { color: "red" }],
			["compiling 💾 ", { color: "lightgray" }],
			[config.entry, { color: "aqua" }],
			[" into folder ", { color: "lightgray" }],
			[config.outDir, { color: "orange" }],
			[". 🙁\n", { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error();
	}

	await afterBuild(config);
}
