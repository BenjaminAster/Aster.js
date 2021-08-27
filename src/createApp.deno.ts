
import {
	generateTSX,
} from "./generateTSX.deno.ts";

import {
	asterParser,
} from "./asterParser.deno.ts";

export async function createApp() {
	await createAppFile();

	await viteBuild();
}

async function createAppFile() {
	const asterCode = await Deno.readTextFile(`./src/files/test.aster`);
	const codeObject = asterParser(asterCode)
	const {
		solidJSCode,
		SCSSCode,
	} = generateTSX(codeObject);

	let code = await Deno.readTextFile(`./src/files/appTemplate.tsx`);
	code = code.replace(`//@-aster-js-code-here`, solidJSCode);
	await Deno.writeTextFile(`./.asterjs/src/App.tsx`, code);

	await Deno.writeTextFile(`./.asterjs/src/App.module.scss`, SCSSCode);
}

async function viteBuild() {
	await Deno.run({
		cmd: ["./src/files/vite-build.bat"],
	}).status();
}
