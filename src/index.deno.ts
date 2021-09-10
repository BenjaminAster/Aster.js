
import {
	ensureDir,
	copy,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";

import {
	createSolidFiles,
} from "./solidFiles.deno.ts";

import {
	createApp,
} from "./createApp.deno.ts";

{
	const codeFolder = (await Deno.readTextFile(`./.asterjs/.codeFolder.txt`)).trim();

	const asterConfig = await createSolidFiles(codeFolder);

	if (asterConfig) {
		await createApp({
			...asterConfig,
			codeFolder,
		});
	}
}
