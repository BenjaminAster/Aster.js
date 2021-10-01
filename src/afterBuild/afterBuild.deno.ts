
import { toConsoleCSSArray } from "../utils.deno.ts";

export async function afterBuild(config: any) {
	if (!config.keepAsterjsFolder) {
		await Deno.remove("./.asterjs", { recursive: true });
	}

	console.log(...toConsoleCSSArray([
		["Aster.js ", { color: "lightgray" }],
		["finished ", { color: "lime" }],
		["compiling ", { color: "lightgray" }],
		[config.entry, { color: "aqua" }],
		[" into folder ", { color: "lightgray" }],
		[config.outDir, { color: "orange" }],
		[".", { color: "lightgray" }],
	], {
		fontWeight: "bold",
	}));
}

