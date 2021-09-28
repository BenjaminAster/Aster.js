
import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";


export async function createSolidFiles(codeFiles: any, config: any): Promise<void> {
	await emptyDir(`./.asterjs`);

	const replaceObject: { [key: string]: any } = {
		html: {
			body: [
				`<section id="root"></section>`,
				`<script src="./src/${config.entry}.tsx" type="module"></script>`,
			].join("\n\t"),
		},
		config,
	};

	function evalCode(codeString: string): any {
		const code = [
			`(() => {`,
			...(() => {
				let stringArray: string[] = [];
				for (const [key, value] of Object.entries(replaceObject)) {
					stringArray.push(
						`\tconst ${key} = ${(
							JSON.stringify(value, null, "\t").replaceAll("\n", "\n\t")
						)};`
					)
				}
				return stringArray;
			})(),
			`\treturn ${codeString};`,
			`\t//     ${"^".repeat(codeString.length)}`,
			`})()`,
		].join("\n");

		try {
			return globalThis.eval(code);
		} catch (err) {
			throw new Error([
				`Aster.js failed to evaluate code ${JSON.stringify(codeString)} with error:`,
				err,
				`The code evaluated by Deno was:`,
				code
			].join("\n"));
		}
	}

	async function replaceCodeInBrackets(code: string) {
		let regex = /(?<all>((\/\/)?\[#((?<filePath>(\.\.?\/[\w\. ]+))|(?<code>([^\]]+?)))\]))/;

		let groups: RegExpExecArray["groups"];

		while (groups = regex.exec(code)?.groups) {
			code = code.replace(
				groups.all,
				groups.code
					? (evalCode(groups.code) ?? "")
					: (await Deno.readTextFile(`${config._aster.codeFolderPath}/${groups.filePath}`)).trim()
			);
		}

		return code;
	}

	for (const filePaths of [
		[`${config._aster.codeFolderPath}/${config.html}`, `./.asterjs/index.html`],
		[`./src/templates/tsconfig.json`, `./.asterjs/tsconfig.json`],
		[`./src/templates/vite.config.ts`, `./.asterjs/vite.config.ts`],
		[`./src/templates/package.json`, `./.asterjs/package.json`],
	]) {
		let code = await Deno.readTextFile(filePaths[0]);

		await Deno.writeTextFile(
			filePaths[1],
			await replaceCodeInBrackets(code)
		);
	}

	await ensureDir("./.asterjs/src");

	for (const file in codeFiles) {
		await Deno.writeTextFile(
			`./.asterjs/src/${file}.tsx`,
			(
				await replaceCodeInBrackets(
					await Deno.readTextFile(`./src/templates/App.tsx`)
				)
			).replace(
				`//#aster-code-here`,
				codeFiles[file].tsx,
			)
		);

		await Deno.writeTextFile(
			`./.asterjs/src/${file}.module.scss`,
			codeFiles[file].scss,
		);
	}

	await emptyDir(`${config.outDir}`);
}
