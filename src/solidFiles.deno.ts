
import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";


export async function createSolidFiles(codeFiles: any, config: any): Promise<void> {
	await emptyDir(`./.asterjs`);

	const replaceObject = {
		html: {
			body: [
				`<div id="root"></div>`,
				`<script src="/src/${config.entry}.tsx" type="module"></script>`,
			].join("\n\t"),
		},
		aster: {
			stringifiedViteConfig: {
				all: config.vite &&
					`...${JSON.stringify(config.vite, null, "\t").replaceAll("\n", "\n\t")}`,
				build: config.vite?.build &&
					`...${JSON.stringify(config.vite.build, null, "\t").replaceAll("\n", "\n\t\t")}`,
			},
		},
		config,
	};

	async function replacePropertiesInBrackets(code: string) {
		const getPropertyFromPath = (path: string): any => path.split(".").reduce(
			(obj: any, pathPart: string) => obj?.[pathPart], replaceObject
		);

		let regex = /(?<all>((\/\/)?\[#((?<propertyPath>([\w\.]+?))|(?<filePath>(\.\.?\/[\w\. ]+)))\]))/;

		let groups: RegExpExecArray["groups"];

		while (groups = regex.exec(code)?.groups) {
			code = code.replace(
				groups.all,
				groups.propertyPath
					? (getPropertyFromPath(groups.propertyPath) ?? "")
					: (await Deno.readTextFile(`./${config._aster.codeFolder}/${groups.filePath}`)).trim()
			);
		}

		return code;
	}

	for (const filePaths of [
		[`./${config._aster.codeFolder}/${config.html}`, `./.asterjs/index.html`],
		[`./src/templates/tsconfig.json`, `./.asterjs/tsconfig.json`],
		[`./src/templates/vite.config.ts`, `./.asterjs/vite.config.ts`],
		[`./src/templates/package.json`, `./.asterjs/package.json`],
	]) {
		let code = await Deno.readTextFile(filePaths[0]);

		await Deno.writeTextFile(
			filePaths[1],
			await replacePropertiesInBrackets(code)
		);
	}

	await ensureDir("./.asterjs/src");

	for (const file in codeFiles) {
		await Deno.writeTextFile(
			`./.asterjs/src/${file}.tsx`,
			(await replacePropertiesInBrackets(await Deno.readTextFile(`./src/templates/App.tsx`))).replace(
				`//#aster-code-here`,
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
