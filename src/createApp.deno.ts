
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
} from "./utils.deno.ts";

import {
	afterBuild,
} from "./afterBuild/afterBuild.deno.ts";


export async function createApp(): Promise<any> {
	const { default: asterjsConfig } = await import(`file://${Deno.cwd()}/asterjs.config.ts`);

	const config: any = {
		...asterjsConfig,
		entry: addDotSlash(asterjsConfig.entry || "./index.asterjs"),
		html: addDotSlash(asterjsConfig.html || "./index.html"),
		outDir: addDotSlash(asterjsConfig.outDir || "./build/"),
	};

	console.log(...toConsoleCSSArray([
		["\nAster.js ", { color: "white", "font-weight": "bold" }],
		["started ", { color: "yellow", "font-weight": "bold" }],
		["compiling ", { color: "white", "font-weight": "bold" }],
		[config.entry, { color: "aqua", "font-weight": "bold" }],
		[" into folder ", { color: "white", "font-weight": "bold" }],
		[config.outDir, { color: "orange", "font-weight": "bold" }],
		[".", { color: "white", "font-weight": "bold" }],
	]));

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
	if (isWindows) {
		await Deno.writeTextFile(`./.asterjs/vite-build.cmd`, [
			`cd ./.asterjs/`,
			`npm run build`,
			`cd ../`,
		].join("\n").trim());

		await sleep();

		await Deno.run({
			cmd: [`./.asterjs/vite-build.cmd`],
			cwd: "./",
		}).status();
	} else {
		await Deno.run({
			cmd: [
				`npm`,
				`run`,
				`build`,
			],
			cwd: `./.asterjs`,
		}).status();
	}

	await afterBuild(config);
}
