
import {
	ensureDir,
	copy,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";

import {
	createSolidFiles,
} from "./src/solidFiles.deno.ts";

import {
	generateJSX,
} from "./src/generateJSX.deno.ts";

{
	await emptyDir(`./.asterjs`);

	await createSolidFiles();

	await generateJSX();

}

