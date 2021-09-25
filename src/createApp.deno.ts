
import {
	parse as parseJSONC,
} from "https://deno.land/x/jsonc@1/main.ts";

import {
	generateTSX,
} from "./generateTSX.deno.ts";

import {
	changeCodeObject,
} from "./changeCodeObject.deno.ts";

import {
	asterParser,
} from "./asterParser.deno.ts";


export async function createApp(): Promise<any> {
	const codeFolder = (await Deno.readTextFile(`./.asterjs/.codeFolder.txt`)).trim();

	const asterConfig = parseJSONC(
		await Deno.readTextFile(`./${codeFolder}/aster.config.jsonc`),
		[],
		{
			disallowComments: false,
			allowTrailingComma: true,
			allowEmptyContent: true,
		},
	);

	const config: any = {
		...asterConfig,
		entry: asterConfig.entry || "index.aster",
		html: asterConfig.html || "index.html",
		outDir: asterConfig.outDir || "build",
		_aster: {
			codeFolder,
		},
	};


	return [
		await createAppFile(config),
		config,
	];
}

async function createAppFile(config: any): Promise<any> {
	const asterCode = await Deno.readTextFile(`./${config._aster.codeFolder}/${config.entry}`);

	const codeObject = changeCodeObject(asterParser(asterCode));
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
		`cd ./.asterjs`,
		`npm run build`,
		`cd ..`,
	].join("\n"));

	setTimeout(async () => {
		await Deno.run({
			cmd: ["./.asterjs/vite-build.bat"],
		}).status();
	}, 100)
}
