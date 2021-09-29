
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

	const isDev: boolean = import.meta.url.startsWith("file://");
	const readAndWrite = isDev ? "" : "=.";
	const randomStr: string = Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, "0");

	await emptyDir(`./.asterjs-install-${randomStr}`);

	await Deno.writeTextFile(`./.asterjs-install-${randomStr}/install-asterjs${terminalFileExtension}`, [
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
		cmd: [`./.asterjs-install-${randomStr}/install-asterjs${terminalFileExtension}`],
		cwd: "./",
	}).status();

	await Deno.remove(`./.asterjs-install-${randomStr}`, { recursive: true });
})();
