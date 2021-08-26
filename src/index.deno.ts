
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
	await emptyDir(`./.asterjs`);

	await createSolidFiles();

	await createApp();
}
