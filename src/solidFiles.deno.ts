
import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";


export async function createSolidFiles(codeFiles: any, config: any): Promise<void> {
	await emptyDir(`./.asterjs`);

	const replaceObject = {
		body: [
			`<div id="root"></div>`,
			`<script src="/src/${config.entry}.tsx" type="module"></script>`,
		].join("\n\t"),
		config,
	};

	function replacePropertiesInBrackets(code: string) {
		const getPropertyFromPath = (path: string): any => path.split(".").reduce(
			(obj: any, pathPart: string) => obj[pathPart], replaceObject
		);

		let regex = /(?<all>(\[#(?<propertyPath>([\w\.]+?))\]))/g;

		let groups: RegExpExecArray["groups"];

		while (groups = regex.exec(code)?.groups) {
			code = code.replaceAll(groups.all, getPropertyFromPath(groups.propertyPath));
		}

		return code;
	}

	for (const filePaths of [
		[`./${config.codeFolder}/${config.html}`, `./.asterjs/index.html`],
		[`./src/templates/tsconfig.json`, `./.asterjs/tsconfig.json`],
		[`./src/templates/vite.config.ts`, `./.asterjs/vite.config.ts`],
		[`./src/templates/package.json`, `./.asterjs/package.json`],
	]) {
		let code = await Deno.readTextFile(filePaths[0]);

		await Deno.writeTextFile(
			filePaths[1],
			replacePropertiesInBrackets(code)
		);
	}

	await ensureDir("./.asterjs/src");

	for (const file in codeFiles) {
		await Deno.writeTextFile(
			`./.asterjs/src/${file}.tsx`,
			replacePropertiesInBrackets(await Deno.readTextFile(`./src/templates/App.tsx`)).replace(
				`//#-aster-js-code-here`,
				codeFiles[file].tsx,
			)
		);

		await Deno.writeTextFile(
			`./.asterjs/src/${file}.module.scss`,
			codeFiles[file].scss,
		);
	}

	await emptyDir(`./${config.outDir}`);
}
