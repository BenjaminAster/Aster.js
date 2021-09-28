
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
					: (await Deno.readTextFile(`${config._asterjs.codeFolderPath}/${groups.filePath}`)).trim()
			);
		}

		return code;
	}

	await emptyDir("./.asterjs");
	await ensureDir("./.asterjs/src");

	const githubTemplateURL = `https://raw.githubusercontent.com/BenjaminAster/Aster.js/main/src/templates`;

	for (const filePaths of [
		{
			local: true,
			from: `${config._asterjs.codeFolderPath}/${config.html}`,
			to: `./.asterjs/index.html`,
		},
		{
			local: false,
			from: `tsconfig.json`,
			to: `./.asterjs/tsconfig.json`,
		},
		{
			local: false,
			from: `vite.config.ts`,
			to: `./.asterjs/vite.config.ts`,
		},
		{
			local: false,
			from: `package.json`,
			to: `./.asterjs/package.json`,
		},
	]) {
		let code = filePaths.local || config.dev.enabled
			? await Deno.readTextFile(filePaths.local
				? filePaths.from
				: `./${config.dev.templatesDir}/${filePaths.from}`
			)
			: await (await globalThis.fetch(
				`${githubTemplateURL}/${filePaths.from}`
			)).text();

		await Deno.writeTextFile(
			filePaths.to,
			await replaceCodeInBrackets(code)
		);
	}

	for (const file in codeFiles) {
		await Deno.writeTextFile(
			`./.asterjs/src/${file}.tsx`,
			(
				await replaceCodeInBrackets(
					config.dev.enabled
						? await Deno.readTextFile(`./${config.dev.templatesDir}/App.tsx`)
						: await (await globalThis.fetch(
							`${githubTemplateURL}/App.tsx`
						)).text()
				)
			).replace(
				`//#asterjs-code-here`,
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
