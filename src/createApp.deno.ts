
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
	sleep,
	addDotSlash,
	toConsoleCSSArray,
	isWindows,
	denoArgs,
} from "./utils.deno.ts";

import {
	afterBuild,
} from "./afterBuild/afterBuild.deno.ts";


export async function createApp(): Promise<any> {


	// const a = await Deno.readTextFile(`/Users/Benja/.deno/.asterjs/test.txt`);

	// const a = (await import(`file:///C:/Users/Benja/.deno/.asterjs/test.ts`)).default;

	// console.log({ a });

	const asterjsConfig: { [key: string]: string } = await (async () => {
		try {
			return (await import(`file://${Deno.cwd()}/asterjs.config.ts`)).default;
		} catch (err) {
			console.error(...toConsoleCSSArray([
				[`\nasterjs.config.ts was not found inside folder `, { color: "red" }],
				[Deno.cwd(), { color: "orange" }],
			], { fontWeight: "bold" }));
			throw new Error(err);
		}
	})();

	if (typeof asterjsConfig !== "object") {
		console.error(...toConsoleCSSArray([
			[`asterjs.config.ts doesn't export a valid Aster.js configuration object.`, { color: "red" }],
		], { fontWeight: "bold" }));
		throw new Error();
	}

	const config: any = {
		...asterjsConfig,
		entry: addDotSlash(asterjsConfig.entry || "./index.asterjs"),
		html: addDotSlash(asterjsConfig.html || "./index.html"),
		outDir: addDotSlash(asterjsConfig.outDir || "./build/"),
	};

	console.log(...toConsoleCSSArray([
		["\nAster.js ", { color: "lightgray", fontWeight: "bold" }],
		["started ", { color: "yellow", fontWeight: "bold" }],
		["compiling ", { color: "lightgray", fontWeight: "bold" }],
		[config.entry, { color: "aqua", fontWeight: "bold" }],
		[" into folder ", { color: "lightgray", fontWeight: "bold" }],
		[config.outDir, { color: "orange", fontWeight: "bold" }],
		[".\n", { color: "lightgray", fontWeight: "bold" }],
	], { fontWeight: "bold" }));

	return [
		await createAppCode(config),
		config,
	];
}

async function createAppCode(config: any): Promise<any> {
	const asterjsCode = await Deno.readTextFile(`./${config.entry}`);

	const codeObject = changeCodeObject(asterjsParser(asterjsCode));
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
			["\nAster.js ", { color: "lightgray" }],
			["failed ", { color: "red" }],
			["compiling ", { color: "lightgray" }],
			[config.entry, { color: "aqua" }],
			[" into folder ", { color: "lightgray" }],
			[config.outDir, { color: "orange" }],
			[".\n", { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error();
	}

	await afterBuild(config);
}
