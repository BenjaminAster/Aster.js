
import { toConsoleCSSArray } from "../utils.deno.ts";

export async function afterBuild(config: any) {
	if (!config.keepAsterjsFolder) {
		await Deno.remove("./.asterjs", { recursive: true });
	}

	console.log(...toConsoleCSSArray([
		["\nAster.js ", "color: white; font-weight: bold"],
		["finished ", "color: lime; font-weight: bold"],
		["compiling ", "color: white; font-weight: bold"],
		[config.entry, "color: aqua; font-weight: bold"],
		[" into folder ", "color: white; font-weight: bold"],
		[config.outDir, "color: orange; font-weight: bold"],
		[".", "color: white; font-weight: bold"],
	]));
}

