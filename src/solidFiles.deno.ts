
import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";


export async function createSolidFiles(codeFiles: any, config: any): Promise<any> {
	// const config: any = {
	// 	...JSON.parse(await Deno.readTextFile(`./${codeFolder}/aster.config.json`)),
	// 	codeFolder,
	// };


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

	// await Deno.writeTextFile(
	// 	`./.asterjs/index.html`,
	// 	(await Deno.readTextFile(`./${codeFolder}/${asterConfig.html}`)).replace(
	// 		"[#body]",

	// 	)
	// );


	// for (const file of ["tsconfig.json", "vite.config.ts", "package.json"]) {
	// 	let code = await Deno.readTextFile(`./src/templates/${file}`);

	// 	// code.replaceAll(/\[#config\.(?<path>(.+?))\]/g, )

	// 	// "".bold

	// 	// String.

	// 	// let a😀 = 0;

	// 	// let ӏI

	// 	// [ᅠ] [ᅟ] [ㅤ]

	// 	let _ߡ_ = 6;

	// 	// [].

	// 	let ᅠ = 42; // alles drei verschiedene whitespace-Zeichen, die gar kein whitespace sind
	// 	let ᅟ = 42;
	// 	let ㅤ = 42;

	// 	console.log({ ᅠ, ᅟ, ㅤ })

	// 	let ߡ = 5; // right-to-left Zeichen (dreht die Zeile um)

	// 	let シ = 42;
	// 	let ツ = 42;
	// 	let ッ = 42;
	// 	let ㇱ = 42;

	// 	let 𒐫 = 42;
	// 	let 𒐹 = 42;
	// 	let ↈ = 42;
	// 	let 𒐇 = 42;
	// 	let 𒐔 = 42;

	// 	let ßäöüÄÖÜ = 42;

	// 	let ˋԁˋ = 42;
	// 	let ˋdˋ = 42;

	// 	let ಠ_ಠ = 42;

	// 	// const شa = 5;

	// 	await Deno.writeTextFile(
	// 		`./.asterjs/${file}`,
	// 		code,
	// 	);
	// }

	await emptyDir(`./${config.outDir}`);

	// return asterConfig;
	return;
}
