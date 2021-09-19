
import {
	generateTSX,
} from "./generateTSX.deno.ts";

import {
	asterParser,
} from "./asterParser.deno.ts";

export async function createApp(): Promise<any> {
	const codeFolder = (await Deno.readTextFile(`./.asterjs/.codeFolder.txt`)).trim();

	const asterConfig = JSON.parse(await Deno.readTextFile(`./${codeFolder}/aster.config.json`));

	const config: any = {
		entry: asterConfig.entry || "index.aster",
		html: asterConfig.html || "index.html",
		outDir: asterConfig.outDir || "build",
		codeFolder,
	};

	return [
		await createAppFile(config),
		config,
	];
}

async function createAppFile(config: any): Promise<any> {
	const asterCode = await Deno.readTextFile(`./${config.codeFolder}/${config.entry}`);

	const codeObject = asterParser(asterCode)
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
