
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
	// const [cwd, codeFolder] = (await Deno.readTextFile(`./.asterjs/.codeFolder.txt`)).trim().split("\n");

	// console.log({ cwd, codeFolder });

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
	)}/${denoArgs[0]}`;

	const { default: asterConfig } = await import(`file:///${codeFolderPath.replace(/^\//, "")}/aster.config.ts`);
	// const { default: asterConfig } = await import(`/${Deno.cwd()}/${denoArgs[0]}/aster.config.ts`);

	const config: any = {
		...asterConfig,
		entry: asterConfig.entry || "index.aster",
		html: asterConfig.html || "index.html",
		outDir: `${codeFolderPath}/${asterConfig.outDir || "./build"}`,
		_aster: {
			codeFolderPath,
		},
	};

	return [
		await createAppCode(config),
		config,
	];
}

async function createAppCode(config: any): Promise<any> {
	const asterCode = await Deno.readTextFile(`${config._aster.codeFolderPath}/${config.entry}`);

	const codeObject = changeCodeObject(asterjsParser(asterCode));
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

export async function viteBuild(): Promise<void> {
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

	await afterBuild();
}
