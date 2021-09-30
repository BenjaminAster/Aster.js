
import {
	toConsoleCSSArray,
	denoArgs,
	isWindows,
} from "./utils.deno.ts";

(async () => {
	const isDev: boolean = import.meta.url.startsWith("file://");
	const readAndWrite = isDev ? "" : "=.";

	console.log(...toConsoleCSSArray([
		[
			`\nInstalling Aster.js...\n`,
			{ "font-weight": "bold", color: "yellow" },
		],
	]));

	try {
		await Deno.run({
			cmd: [
				isWindows ? `deno` : `~/.deno/bin/deno`,
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
				{ "font-weight": "bold", color: "lime" },
			],
			[
				`You now have global access to the "asterjs" command.`,
				{ "font-weight": "bold", color: "white" },
			],
		]));
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`Aster.js failed installing with error:`, { color: "red" }],
		]));
		console.error(err);
	}
})();
