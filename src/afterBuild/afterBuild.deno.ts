
import { ssr } from "./ssr.deno.ts";

(async () => {
	console.log("finished!");

	await ssr();
})();
