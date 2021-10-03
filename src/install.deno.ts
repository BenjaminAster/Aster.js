
import {
	toConsoleCSSArray,
	githubRawURL,
	denoArgs,
	denoDir,
	isWindows,
	sleep,
	version,
	runCommand,
	homeDir,
} from "./utils.deno.ts";

(async () => {
	if (denoArgs.help) {
		console.info(...toConsoleCSSArray([
			[`\n[TODO: Add install help]`, { color: "yellow" }],
		], { fontWeight: "bold", fontStyle: "italic" }));
	} else {
		console.info(...toConsoleCSSArray([
			[`\nInstalling Aster.js... ✌`, { color: "yellow" }],
		], { fontWeight: "bold" }));

		if (denoArgs.log) {
			console.info(...toConsoleCSSArray([
				[`\nAster.js `, { color: "yellow" }],
				[`is currently at version `, { color: "lightgray" }],
				[version, { color: "deepskyblue" }],
				[`.`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
		}

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

		if (denoArgs.debug) {
			console.log({
				denoArgs,
				isDev,
				readAndWrite,
				templatesDir,
			});
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

		try {
			if (denoArgs.log) {
				console.info(...toConsoleCSSArray([
					[`\nChecking if `, { color: "lightgray" }],
					[`npm `, { color: "deepskyblue" }],
					[`is installed... 🧐`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
			}
			await runCommand([`npm`, `--version`], denoArgs.log);
		} catch (err) {
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
			throw new Error(err);
		}

		try {
			if (denoArgs.log) {
				console.info(...toConsoleCSSArray([
					[`\nChecking if `, { color: "lightgray" }],
					[`deno 🦕 `, { color: "deepskyblue" }],
					[`is installed... 🧐`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
			}
			await runCommand([`deno`, `--version`], denoArgs.log);
		} catch (err) {
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

		{
			const packageJSON: { [key: string]: any } = await (
				async (): Promise<{ [key: string]: any }> => {
					try {
						return JSON.parse(await Deno.readTextFile(`${homeDir}/package.json`));
					} catch {
						await Deno.writeTextFile(`${homeDir}/package.json`, JSON.stringify({
							dependencies: {},
						}, null, "\t"));
						return {};
					}
				}
			)();

			const dependencies: string[] = [
				`solid-js`,
				`vite`,
				`vite-plugin-solid`,
				`sass`,
			];

			const dependenciesToInstall: string[] = dependencies.filter((dependency: string) => !Object.keys(
				{ ...packageJSON.dependencies, ...packageJSON.devDependencies }
			).includes(dependency));

			if (dependenciesToInstall.length) {
				try {
					if (denoArgs.log) {
						console.info(...toConsoleCSSArray([
							[`\nInstalling `, { color: "gold" }],
							[`npm package${dependenciesToInstall.length > 1 ? "s" : ""} `, { color: "lightgray" }],
							[dependenciesToInstall.join(", "), { color: "deepskyblue" }],
							[`... 💻`, { color: "lightgray" }],
						], { fontWeight: "bold" }));
					}
					await runCommand([`npm`, `install`, `--save`, ...dependenciesToInstall], denoArgs.log, homeDir);
				} catch (err) {
					console.error(...toConsoleCSSArray([
						[`❌ Something `, { color: "lightgray" }],
						[`went wrong `, { color: "red" }],
						[`while installing npm packages (`, { color: "lightgray" }],
						[dependenciesToInstall.join(", "), { color: "deepskyblue" }],
						[`). 😥`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
					throw new Error(err);
				}
			} else {
				if (denoArgs.log) {
					console.info(...toConsoleCSSArray([
						[`\nAll npm packages (`, { color: "lightgray" }],
						[dependencies.join(", "), { color: "deepskyblue" }],
						[`) are already installed! 👍`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}
			}
		}

		try {
			if (denoArgs.log) {
				console.info(...toConsoleCSSArray([
					[`\nRunning the `, { color: "lightgray" }],
					[`deno 🦕 install `, { color: "deepskyblue" }],
					[`command... 💻`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
			}

			const indexDenoPath: string = isDev ? (
				JSON.stringify(`${srcFolderPath}/index.deno.ts`)
			) : (
				`${srcFolderPath}/index.deno.ts`
			);

			await runCommand([
				`deno`,
				`install`,
				`--unstable`,
				`--allow-run`,
				`--allow-net`,
				`--force`,
				`--reload`,
				`--prompt`,
				`--allow-read${(readAndWrite)}`,
				`--allow-write${(readAndWrite)}`,
				`--name=asterjs`,
				denoArgs.debug ? `--log-level=info` : `--quiet`,
				indexDenoPath,
			], denoArgs.log);
		} catch (err) {
			console.error(...toConsoleCSSArray([
				[`❌ Something `, { color: "lightgray" }],
				[`went wrong `, { color: "red" }],
				[`while installing `, { color: "lightgray" }],
				[`Aster.js`, { color: "orange" }],
				[`. 😥`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error(err);
		}

		try {
			if (denoArgs.log) {
				console.info(...toConsoleCSSArray([
					[`\nChecking if the "`, { color: "lightgray" }],
					[`asterjs`, { color: "deepskyblue" }],
					[`" command is working... 💻`, { color: "lightgray" }],
				], { fontWeight: "bold" }));
			}
			await runCommand([`asterjs`, `--version`], denoArgs.log);
		} catch (err) {
			console.error(...toConsoleCSSArray([
				[`❌ Failed `, { color: "red" }],
				[`to install `, { color: "lightgray" }],
				[`Aster.js`, { color: "orange" }],
				[`: The command "`, { color: "lightgray" }],
				[`asterjs`, { color: "deepskyblue" }],
				[`" doesn't work 😥.`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
			throw new Error(err);
		}

		console.info(...toConsoleCSSArray([
			[`\n✔ Installation successful! 🤴 🏆 `, { color: "lime" },],
			[`You now have global access to the "`, { color: "lightgray" },],
			[`asterjs`, { color: "deepskyblue" },],
			[`" command. 🥳🎈🎊🎉🎇🧨😎`, { color: "lightgray" },],
		], { fontWeight: "bold", }));
	}
})();
