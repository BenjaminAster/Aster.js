
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

	const codeFolderPath: string = `${(
		Deno.cwd().replaceAll("\\", "/")
	)}${denoArgs[0] ? `/${denoArgs[0]}` : ""}`;

	const { default: asterjsConfig } = await import(`file:///${codeFolderPath.replace(/^\//, "")}/asterjs.config.ts`);

	const config: any = {
		...asterjsConfig,
		entry: asterjsConfig.entry || "index.asterjs",
		html: asterjsConfig.html || "index.html",
		outDir: `${codeFolderPath}/${asterjsConfig.outDir || "./build"}`.replaceAll("/./", "/"),
		_asterjs: {
			codeFolderPath,
		},
	};

	return [
		await createAppCode(config),
		config,
	];
}

async function createAppCode(config: any): Promise<any> {
	const asterjsCode = await Deno.readTextFile(`${config._asterjs.codeFolderPath}/${config.entry}`);

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
	await Deno.writeTextFile(`./.asterjs/vite-build.bat`, [
		`@REM This file gets executed from the root of this repository (not from .asterjs)!`,
		`cd ./.asterjs/`,
		`npm run build`,
		`cd ../`,
	].join("\n"));

	await sleep();

	await Deno.run({
		cmd: ["./.asterjs/vite-build.bat"],
		cwd: "./",
	}).status();

	await afterBuild(config);
}
