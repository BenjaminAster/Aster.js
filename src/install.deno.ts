
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
	randomStr,
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

		for (const permission of ["read", "write", "run", "net"] as const) {
			if ((await Deno.permissions.query({ name: permission })).state !== "granted") {
				console.error(...toConsoleCSSArray([
					["❌ Aster.js is ", { color: "lightgray" }],
					["missing ", { color: "red" }],
					["permissions. 🙉  Please run again with the ", { color: "lightgray" }],
					["-A ", { color: "deepskyblue", fontStyle: "italic" }],
					["flag. 🚩", { color: "lightgray" }],
				], { fontWeight: "bold" }));
				throw new Error();
			}
		}

		const noLog: boolean = denoArgs["no-log"] || denoArgs.L;

		const isDev: boolean = (new URL(import.meta.url).protocol === "file:");

		const readAndWrite: string = (isWindows && !isDev) ? `=".",${JSON.stringify(denoDir)}` : ``;

		const templatesDir: string = `${denoDir}/.asterjs/templates`

		if (!noLog) {
			console.info(...toConsoleCSSArray([
				[`\nAster.js `, { color: "yellow" }],
				[`is currently at version `, { color: "lightgray" }],
				[version, { color: "deepskyblue" }],
				[`.`, { color: "lightgray" }],
			], { fontWeight: "bold" }));
		}

		await Deno.mkdir(templatesDir, { recursive: true });

		const srcFolderPath: string = isDev ? (
			new RegExp(`^${isWindows ? "/" : ""}(?<folderPath>(.+?))/[^/]+$`).exec(
				globalThis.decodeURI(new URL(import.meta.url).pathname)
			)?.groups?.folderPath as string
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
				version,
				homeDir,
				denoDir,
				srcFolderPath,
				noLog,
				importMeta: import.meta,
			});
		}

		{ // template files

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
								const response = await globalThis.fetch(`${filePath}?anti-cache=${randomStr(10)}`, { cache: "reload" });
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
		}

		{ // check if deno & npm are installed

			try {
				if (!noLog) {
					console.info(...toConsoleCSSArray([
						[`\nChecking if `, { color: "lightgray" }],
						[`npm `, { color: "deepskyblue" }],
						[`is installed... 🧐`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}
				await runCommand([`npm`, `--version`], !noLog);
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
				if (!noLog) {
					console.info(...toConsoleCSSArray([
						[`\nChecking if `, { color: "lightgray" }],
						[`deno 🦕 `, { color: "deepskyblue" }],
						[`is installed... 🧐`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}
				await runCommand([`deno`, `--version`], !noLog);
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
		}

		{ // install npm dependencies

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

			const npmDependencies: string[] = [
				`solid-js`,
				`vite`,
				`vite-plugin-solid`,
				`sass`,
			];

			const dependenciesToInstall: string[] = npmDependencies.filter((dependency: string) => !Object.keys(
				{ ...packageJSON.dependencies, ...packageJSON.devDependencies }
			).includes(dependency));

			const toConsoleDependencyList = (dependencies: string[], color?: string): [string, { [key: string]: string }][] => (
				[].concat(...(dependencies.map((dependency: string) => [
					[dependency, { color: color || "deepskyblue" }],
					[", ", { color: "lightgray" }],
				])) as any).slice(0, -1)
			);

			if (dependenciesToInstall.length) {
				try {
					if (!noLog) {
						console.info(...toConsoleCSSArray([
							[`\nInstalling `, { color: "gold" }],
							[`npm package${dependenciesToInstall.length > 1 ? "s" : ""} `, { color: "lightgray" }],
							...toConsoleDependencyList(dependenciesToInstall),
							[`... 💻`, { color: "lightgray" }],
						], { fontWeight: "bold" }));
					}
					await runCommand([`npm`, `install`, `--save`, ...dependenciesToInstall], !noLog, homeDir);
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
				if (!noLog) {
					console.info(...toConsoleCSSArray([
						[`\nAll required npm packages (`, { color: "lightgray" }],
						...toConsoleDependencyList(npmDependencies),
						[`) are already installed! 👍`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}
			}
		}

		{ // actually installing Aster.js

			try {
				if (!noLog) {
					console.info(...toConsoleCSSArray([
						[`\nRunning the `, { color: "lightgray" }],
						[`deno 🦕 install `, { color: "deepskyblue" }],
						[`command... 💻`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}

				const indexDenoPath: string = (isDev && isWindows) ? (
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
				], !noLog);
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
		}

		{ // checking if "asterjs" is recognized as a command

			try {
				if (!noLog) {
					console.info(...toConsoleCSSArray([
						[`\nChecking if the "`, { color: "lightgray" }],
						[`asterjs`, { color: "deepskyblue" }],
						[`" command is working... 💻`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}
				await runCommand([`asterjs`, `--version`], !noLog);
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
		}

		{ // if Deno has come to this point without any error, everything must have worked

			console.info(...toConsoleCSSArray([
				[`\n✔ Installation successful! 🤴 🏆  `, { color: "lime" },],
				[`You now have global access to the "`, { color: "lightgray" },],
				[`asterjs`, { color: "deepskyblue" },],
				[`" command. 🥳🎈🎊🎉🎇🧨😎`, { color: "lightgray" },],
			], { fontWeight: "bold", }));
		}
	}
})();
