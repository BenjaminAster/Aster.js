
import {
	toConsoleCSSArray,
} from "./utils.deno.ts";

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

	try {
		await Deno.run({
			cmd: [
				`deno`,
				`install`,
				`--unstable`,
				`--allow-run`,
				`--allow-net`,
				`--force`,
				`--quiet`,
				`--reload`,
				`--allow-read${(readAndWrite)}`,
				`--allow-write${(readAndWrite)}`,
				`--name=asterjs`,
				`${(
					isDev ? "." : "https://benjaminaster.github.io/Aster.js"
				)}/${(isDev && denoArgs[0]) || "src"}/index.deno.ts`
			],
			cwd: "./",
		}).status();

		console.log(...toConsoleCSSArray([
			[
				`\nInstallation successful! `,
				`font-weight: bold; color: lime;`,
			],
			[
				`You now have access to the "asterjs" command.`,
				`font-weight: bold; color: white;`,
			],
		]));
	} catch (err) {
		console.error(err)
	}
})();
