
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
	terminalFileExtension,
	terminalFileFirstLine,
} from "./utils.deno.ts";

import {
	afterBuild,
} from "./afterBuild/afterBuild.deno.ts";


export async function createApp(): Promise<any> {
	const [denoArgs, denoProps] = (() => {
		let denoArgs: string[] = [];
		let denoProps: string[] = [];
		for (const arg of Deno.args) {
			if (arg.startsWith("--")) {
				denoProps.push(arg);
			} else {
				denoArgs.push(arg);
			}
		}
		return [denoArgs, denoProps];
	})();

	const { default: asterjsConfig } = await import(`file://${Deno.cwd()}/asterjs.config.ts`);

	const config: any = {
		...asterjsConfig,
		entry: addDotSlash(asterjsConfig.entry || "./index.asterjs"),
		html: addDotSlash(asterjsConfig.html || "./index.html"),
		outDir: addDotSlash(asterjsConfig.outDir || "./build/"),
	};

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
	await Deno.writeTextFile(`./.asterjs/vite-build${terminalFileExtension}`, [
		terminalFileFirstLine,
		`cd ./.asterjs/`,
		`npm run build`,
		`cd ../`,
	].join("\n").trim());

	await sleep();

	await Deno.run({
		cmd: [`./.asterjs/vite-build${terminalFileExtension}`],
		cwd: "./",
	}).status();

	await afterBuild(config);
}
