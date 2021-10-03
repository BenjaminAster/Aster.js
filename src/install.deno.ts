
import {
	toConsoleCSSArray,
	githubRawURL,
	denoArgs,
	denoDir,
	isWindows,
	sleep,
} from "./utils.deno.ts";

(async () => {
	console.info(...toConsoleCSSArray([[
		`\nInstalling Aster.js... ✌`,
		{ fontWeight: "bold", color: "yellow" },
	]]));

	const isDev: boolean = (new URL(import.meta.url).protocol === "file:");
	const readAndWrite: string = (isWindows && !isDev) ? `=".",${JSON.stringify(denoDir)}` : ``;

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
			["❌ Failed ", { color: "red" }],
			["to calculate 🧮 the path of the ", { color: "lightgray" }],
			["src", { color: "deepskyblue" }],
			["-folder. 📂", { color: "lightgray" }],
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
								[`❌ Could not find `, { color: "red" }],
								[`local file `, { color: "lightgray" }],
								[filePath, { color: "deepskyblue" }],
								[`. 💾`, { color: "lightgray" }],
							], { fontWeight: "bold" }));
							throw new Error(err);
						}
					} else {
						const response = await globalThis.fetch(filePath, { cache: "reload" });
						if (!response.ok) {
							console.error(...toConsoleCSSArray([
								[`❌ Failed `, { color: "red" }],
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
				["❌ Failed ", { color: "red" }],
				["to get template files. 🌐", { color: "lightgray" }],
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
					[`❌ Failed `, { color: "red" }],
					[`to write file `, { color: "lightgray" }],
					[filePath, { color: "deepskyblue" }],
					[` into location `, { color: "lightgray" }],
					[templatesDir, { color: "limegreen" }],
					[`. 😮`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
				throw new Error(err);
			}
		}
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`❌ Failed `, { color: "red" }],
			[`to copy template files into folder 😞`, { color: "lightgray" }],
			[templatesDir, { color: "deepskyblue" }],
		], { fontWeight: "bold" }));
		throw new Error(err);
	}

	await Deno.mkdir(`./.asterjs-install/`, { recursive: true });

	const stdout = denoArgs.log ? "inherit" : "null";

	try {
		if (!(await (await (async (): Promise<Deno.Process> => {
			if (isWindows) {
				await Deno.writeTextFile(`./.asterjs-install/test-npm.cmd`, [
					`npm --version`,
				].join("\n"));

				await sleep();

				return Deno.run({
					cmd: [`./.asterjs-install/test-npm.cmd`],
					cwd: "./",
					stdout,
				});
			} else {
				return Deno.run({
					cmd: [
						`npm`,
						`--version`,
					],
					cwd: `./.asterjs-install/`,
					stdout,
				});
			}
		})()).status()).success) {
			console.error(...toConsoleCSSArray([
				[`❌ Failed `, { color: "red" }],
				[`to install `, { color: "lightgray" }],
				[`Aster.js`, { color: "orange" }],
				[`: Please make sure you have `, { color: "lightgray" }],
				[`npm `, { color: "deepskyblue" }],
				[`installed on your system, and that it is available via the "`, { color: "lightgray" }],
				[`npm`, { color: "deepskyblue" }],
				[`" command. 💻`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error();
		}

		if (!(await (await (async (): Promise<Deno.Process> => {
			if (isWindows) {
				await Deno.writeTextFile(`./.asterjs-install/test-deno.cmd`, [
					`deno --version`,
				].join("\n"));

				await sleep();

				return Deno.run({
					cmd: [`./.asterjs-install/test-deno.cmd`],
					cwd: "./",
					stdout,
				});
			} else {
				return Deno.run({
					cmd: [
						`deno`,
						`--version`,
					],
					cwd: `./.asterjs-install/`,
					stdout,
				});
			}
		})()).status()).success) {
			console.error(...toConsoleCSSArray([
				[`❌ Failed `, { color: "red" }],
				[`to install `, { color: "lightgray" }],
				[`Aster.js`, { color: "orange" }],
				[`: Please make sure that `, { color: "lightgray" }],
				[`deno `, { color: "deepskyblue" }],
				[`is available via the "`, { color: "lightgray" }],
				[`deno`, { color: "deepskyblue" }],
				[`" command. 🦕`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error();
		}
	} catch (err) {
		await Deno.remove(`./.asterjs-install/`, { recursive: true });
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
				`--reload`,
				`--prompt`,
				`--quiet`,
				`--allow-read${(readAndWrite)}`,
				`--allow-write${(readAndWrite)}`,
				`--name=asterjs`,
				`${srcFolderPath}/index.deno.ts`,
			],
			cwd: "./",
			stdout,
		}).status()).success) {
			throw new Error();
		}
	} catch (err) {
		console.error(...toConsoleCSSArray([
			[`❌ Something `, { color: "lightgray" }],
			[`went wrong `, { color: "red" }],
			[`with installing `, { color: "lightgray" }],
			[`Aster.js`, { color: "orange" }],
			[`. 😥`, { color: "lightgray" }],
		], { fontWeight: "bold" }));
		throw new Error(err);
	}

	try {
		if (!(await (await (async (): Promise<Deno.Process> => {
			if (isWindows) {
				await Deno.writeTextFile(`./.asterjs-install/test-asterjs.cmd`, [
					`asterjs --version`,
				].join("\n"));

				await sleep();

				return Deno.run({
					cmd: [`./.asterjs-install/test-asterjs.cmd`],
					cwd: "./",
					stdout,
				});
			} else {
				return Deno.run({
					cmd: [
						`asterjs`,
						`--version`,
					],
					cwd: `./.asterjs-install/`,
					stdout,
				});
			}
		})()).status()).success) {
			console.error(...toConsoleCSSArray([
				[`❌ Failed `, { color: "red" }],
				[`to install `, { color: "lightgray" }],
				[`Aster.js`, { color: "orange" }],
				[`: The command "`, { color: "lightgray" }],
				[`asterjs`, { color: "deepskyblue" }],
				[`" doesn't work 😥.`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error();
		}

		console.info(...toConsoleCSSArray([
			[`\n✔ Installation successful! 🤴 🏆 `, { color: "lime" },],
			[`You now have global access to the "`, { color: "lightgray" },],
			[`asterjs`, { color: "deepskyblue" },],
			[`" command. 🥳🎈🎊🎉🎇🧨😎`, { color: "lightgray" },],
		], { fontWeight: "bold", }));
	} catch (err) {
		throw new Error(err);
	} finally {
		await Deno.remove(`./.asterjs-install/`, { recursive: true });
	}
})();
