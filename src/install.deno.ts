
import {
	toConsoleCSSArray,
	githubRawURL,
	denoDir,
} from "./utils.deno.ts";

(async () => {
	console.log(...toConsoleCSSArray([[
		`\nInstalling Aster.js...\n`,
		{ fontWeight: "bold", color: "yellow" },
	]]));

	const isDev: boolean = (new URL(import.meta.url).protocol === "file:");
	const readAndWrite: string = isDev ? `` : `=".",${(
		JSON.stringify(`${denoDir}/.asterjs`)
	)}`;

	const templatesDir: string = `${denoDir}/.asterjs/templates`

	await Deno.mkdir(templatesDir, { recursive: true });

	const srcFolderPath: string = isDev ? (
		/^\/(?<folderPath>(.+?))\/[^\/]+$/.exec(globalThis.decodeURI(
			new URL(import.meta.url).pathname
		))?.groups?.folderPath as string
	) : (
		`${githubRawURL}/src`
	);

	if (!srcFolderPath) {
		console.error(...toConsoleCSSArray([
			["Failed ", { color: "red" }],
			["to calculate the path of the ", { color: "lightgray" }],
			["src", { color: "deepskyblue" }],
			["-folder.", { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error();
	}

	const templateFiles: [string, string][] = await (async () => {
		try {
			return (await Promise.all([
				`app.tsx`,
				`package.json`,
				`tsconfig.json`,
				`vite.config.ts`,
			].map(async (fileName: string): Promise<[string, string]> => {
				return [fileName, await (async () => {
					const filePath = `${srcFolderPath}/templates/${fileName}`;
					if (isDev) {
						try {
							return await Deno.readTextFile(filePath);
						} catch (err) {
							console.error(...toConsoleCSSArray([
								[`Could not find `, { color: "red" }],
								[`local file `, { color: "lightgray" }],
								[filePath, { color: "deepskyblue" }],
								[`.`, { color: "lightgray" }],
							], { fontWeight: "bold" }));
							throw new Error(err);
						}
					} else {
						const response = await globalThis.fetch(filePath, { cache: "reload" });
						if (!response.ok) {
							console.error(...toConsoleCSSArray([
								[`Failed `, { color: "red" }],
								[`to download `, { color: "lightgray" }],
								[filePath, { color: "deepskyblue" }],
								[`: Server gave a response of `, { color: "lightgray" }],
								[`${response.status} (${response.statusText})`, { color: "red" }],
							], { fontWeight: "bold" }));
							throw new Error();
						}
						return await response.text();
					}
				})()];
			})));
		} catch (err) {
			console.error(...toConsoleCSSArray([
				["Failed ", { color: "red" }],
				["to get template files.", { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error(err);
		}
	})();

	try {
		for (const [filePath, file] of templateFiles) {
			try {
				await Deno.writeTextFile(`${templatesDir}/${filePath}`, file);
			} catch (err) {
				console.error(...toConsoleCSSArray([
					[`Failed `, { color: "red" }],
					[`to write file `, { color: "lightgray" }],
					[filePath, { color: "deepskyblue" }],
					[` into location `, { color: "lightgray" }],
					[templatesDir, { color: "limegreen" }],
				], { fontWeight: "bold" }));
				throw new Error(err);
			}
		}
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`Failed `, { color: "red" }],
			[`to copy template files into folder `, { color: "lightgray" }],
			[templatesDir, { color: "deepskyblue" }],
		], { fontWeight: "bold" }));
		throw new Error(err);
	}

	try {
		if (!(await Deno.run({
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
				`${srcFolderPath}/index.deno.ts`,
			],
			cwd: "./",
			stdout: "null",
		}).status()).success) {
			console.error(...toConsoleCSSArray([
				[`Something `, { color: "lightgray" }],
				[`went wrong `, { color: "red" }],
				[`with installing `, { color: "lightgray" }],
				[`Aster.js`, { color: "orange" }],
				[`.`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error();
		}

		console.log(...toConsoleCSSArray([
			[
				`Installation successful! `,
				{ color: "lime" },
			],
			[
				`You (should) now have global access to the "asterjs" command.`,
				{ color: "lightgray" },
			],
		], {
			fontWeight: "bold",
		}));
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`Aster.js failed installing with error:`, { color: "red" }],
		]));
		throw new Error(err);
	}
})();
