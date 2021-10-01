
import {
	createSolidFiles,
} from "./solidFiles.deno.ts";

import {
	createApp,
	viteBuild,
} from "./createApp.deno.ts";

(async () => {
	const [codeFiles, config] = await createApp();

	await createSolidFiles(codeFiles, config);

	await viteBuild(config);
})();

