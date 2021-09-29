
import {
	sleep,
	terminalFileExtension,
	terminalFileFirstLine,
} from "./utils.deno.ts";

import {
	ensureDir,
	emptyDir,
} from "https://deno.land/std@0.106.0/fs/mod.ts";

(async () => {
	const [denoArgs, denoProps] = (() => {
		let denoArgs: string[] = [];
		let denoProps: string[] = [];
		for (const arg of Deno.args) {
			if (arg.startsWith("--")) {
				denoProps.push(arg);
			} else {
				denoArgs.push(arg);
			}
		}
		return [denoArgs, denoProps];
	})();

	const isDev = denoProps.includes("--dev");
	const readAndWrite = isDev ? "" : "=.";

	await emptyDir("./.asterjs");


	await Deno.writeTextFile(`./.asterjs/install-asterjs${terminalFileExtension}`, [
		terminalFileFirstLine,
		`deno install --unstable --allow-run --allow-net --force --reload --allow-read${(
			readAndWrite
		)} --allow-write${(
			readAndWrite
		)} --name="asterjs" ${(
			isDev ? "." : "https://benjaminaster.github.io/Aster.js"
		)}/${(isDev && denoArgs[0]) || "src"}/index.deno.ts`,
	].join("\n").trim());

	await sleep();

	await Deno.run({
		cmd: [`./.asterjs/install-asterjs${terminalFileExtension}`],
		cwd: "./",
	}).status();

	await Deno.remove("./.asterjs", { recursive: true });
})();
