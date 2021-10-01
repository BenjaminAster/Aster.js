
import {
	emptyDir,
} from "https://deno.land/std@0.109.0/fs/mod.ts";

import {
	toConsoleCSSArray,
	denoDir,
} from "./utils.deno.ts";

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
					: (await Deno.readTextFile(`./${groups.filePath}`)).trim()
			);
		}

		return code;
	}

	await emptyDir("./.asterjs");
	await Deno.mkdir("./.asterjs/src")

	for (const filePaths of [
		{
			from: `tsconfig.json`,
			to: `./.asterjs/tsconfig.json`,
		},
		{
			from: `vite.config.ts`,
			to: `./.asterjs/vite.config.ts`,
		},
		{
			from: `package.json`,
			to: `./.asterjs/package.json`,
		},
	]) {
		try {
			let code = await Deno.readTextFile(`${denoDir}/.asterjs/templates/${filePaths.from}`);

			await Deno.writeTextFile(
				filePaths.to,
				await replaceCodeInBrackets(code)
			);
		} catch (err) {
			throw new Error(err);
		}
	}

	try {
		await Deno.writeTextFile(
			`./.asterjs/index.html`,
			await replaceCodeInBrackets(
				await Deno.readTextFile(config.html)
			),
		);
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`Error `, { color: "" }],
			[`reading the file `, { color: "lightgray" }],
			[config.html, { color: "orange" }],
			[`, which was specified as `, { color: "lightgray" }],
			[`html `, { color: "deepskyblue" }],
			[`in `, { color: "lightgray" }],
			[`asterjs.config.ts`, { color: "gold" }],
			[`.`, { color: "lightgray" }],
		], {
			fontWeight: "bold", backgroundColor: "black",
		}));
		throw new Error(err);
	}

	for (const file in codeFiles) {
		await Deno.writeTextFile(
			`./.asterjs/src/${file}.tsx`,
			(await replaceCodeInBrackets(
				await Deno.readTextFile(`${denoDir}/.asterjs/templates/app.tsx`)
			)).replace(
				`//#asterjs-code-here`,
				codeFiles[file].tsx,
			)
		);

		await Deno.writeTextFile(
			`./.asterjs/src/${file}.module.scss`,
			codeFiles[file].scss,
		);
	}

	await emptyDir(config.outDir);
}
