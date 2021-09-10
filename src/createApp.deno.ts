
import {
	generateTSX,
} from "./generateTSX.deno.ts";

import {
	asterParser,
} from "./asterParser.deno.ts";

export async function createApp(options: any): Promise<void> {
	await createAppFile(options);

	await viteBuild();
}

async function createAppFile(options: any): Promise<void> {
	const asterCode = await Deno.readTextFile(`./${options.codeFolder}/${options.entry}`);

	const codeObject = asterParser(asterCode)
	const {
		solidJSCode,
		SCSSCode,
	} = generateTSX(codeObject);

	const code = (
		await Deno.readTextFile(`./src/templates/App.tsx`)
	).replace(
		`//#-aster-js-code-here`,
		solidJSCode,
	).replace(
		`[#entry]`,
		options.entry,
	);
	await Deno.writeTextFile(`./.asterjs/src/${options.entry}.tsx`, code);

	await Deno.writeTextFile(`./.asterjs/src/${options.entry}.module.scss`, SCSSCode);
}

async function viteBuild(): Promise<void> {
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
