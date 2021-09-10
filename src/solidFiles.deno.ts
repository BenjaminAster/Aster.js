
import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";


export async function createSolidFiles(codeFolder: string): Promise<any> {
	const asterConfig = JSON.parse(await Deno.readTextFile(`./${codeFolder}/aster.config.json`));

	if (
		!asterConfig.entry
		||
		!asterConfig.html
	) {
		console.log(`Please specify the "entry" and "html" options in your aster.config.json file.`);
		return;
	}

	await emptyDir(`./.asterjs`);

	await Deno.writeTextFile(
		`./.asterjs/index.html`,
		(await Deno.readTextFile(`./${codeFolder}/${asterConfig.html}`)).replace(
			"[#body]",
			[
				`<div id="root"></div>`,
				`<script src="/src/${asterConfig.entry}.tsx" type="module"></script>`,
			].join("\n\t")
		)
	);

	for (const file of ["tsconfig.json", "vite.config.ts", "package.json"]) {
		await Deno.writeTextFile(
			`./.asterjs/${file}`,
			await Deno.readTextFile(`./src/templates/${file}`)
		);
	}

	await ensureDir("./.asterjs/src");
	await emptyDir("./build");

	return asterConfig;
}
