
import { ssr } from "./ssr.deno.ts";

export async function afterBuild() {
	console.log("finished!");

	await ssr();
}

