
import {
	createSolidFiles,
} from "./solidFiles.deno.ts";

import {
	createApp,
	viteBuild,
} from "./createApp.deno.ts";

{
	const [codeFiles, config] = await createApp();

	await createSolidFiles(codeFiles, config);

	await viteBuild();
}
