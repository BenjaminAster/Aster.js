
import {
	Args as FlagArgs, // type
	parse as parseFlags,
} from "https://deno.land/std@0.109.0/flags/mod.ts";

export const version: string = "0.6.22";

export const sleep = async (ms?: number): Promise<void> => (
	new Promise(
		(resolve: () => void) => globalThis.setTimeout(resolve, ms)
	)
);

export function toConsoleCSSArray(
	segments: [
		string,
		{ [key: string]: string, }?,
	][],
	globalCSSObj?: { [key: string]: string },
): string[] {
	let endString: string = "";
	let cssArray: string[] = [];
	for (const [string, cssObj] of segments) {
		endString += `%c${string}`;
		cssArray.push(
			Object.entries({ ...globalCSSObj, ...cssObj }).map(
				(([key, value]) => `${key.replace(
					/[A-Z]/g, (str) => `-${str.toLowerCase()}`
				)}:${value}`)
			).join(";")
		);
	}
	return [endString, ...cssArray];
}

export const addDotSlash = (inputPath: string): string => (
	inputPath.match(/^\.[\.]?\//) ? inputPath : `./${inputPath}`
);

export const randomStr = (length: number) => (
	Math.floor(Math.random() * 36 ** length).toString(36).padStart(length, "0")
);

export async function runCommand(command: string[], output?: boolean, folder?: string): Promise<void> {

	const stdout: Deno.RunOptions["stdout"] = output ? "inherit" : "null";
	const tmpName: string = `.tmp-${randomStr(10)}`;

	try {
		if (!(await (async (): Promise<Deno.ProcessStatus> => {
			if (isWindows) {

				await Deno.mkdir(tmpName, { recursive: true });

				await Deno.writeTextFile(`./${tmpName}/${tmpName}.cmd`, [
					...(folder ? [`cd ${JSON.stringify(folder)}`] : []),
					command.join(" "),
				].join("\n"));

				return await Deno.run({
					cmd: [`./${tmpName}/${tmpName}.cmd`],
					cwd: "./",
					stdout,
				}).status();
			} else {
				if (output) {
					console.info(...toConsoleCSSArray([
						[`Running command "`, { color: "lightgray" }],
						[command.join(" "), { color: "deepskyblue", fontStyle: "italic" }],
						[`" ... 💻`, { color: "lightgray" }],
					], { fontWeight: "bold" }));
				}
				return await Deno.run({
					cmd: command,
					cwd: folder || "./",
					stdout,
				}).status();
			}
		})()).success) {
			if (output) {
				console.error(...toConsoleCSSArray([
					[`❌ Failed `, { color: "red" }],
					[`to run command "`, { color: "lightgray" }],
					[command.join(" "), { color: "deepskyblue", fontStyle: "italic" }],
					[`". 🤔`, { color: "lightgray" }],
				], { fontWeight: "bold" }))
			}
			throw new Error();
		}
	} catch (err) {
		throw new Error(err);
	} finally {
		if (isWindows) {
			await Deno.remove(tmpName, { recursive: true });
		}
	}
}

export const denoArgs: FlagArgs = parseFlags(Deno.args, {});

export const isWindows: boolean = (Deno.build.os === "windows");

export const githubRawURL: string = `https://raw.githubusercontent.com/BenjaminAster/Aster.js/main`;

export const denoDir: string = Deno.execPath().replaceAll("\\", "/").replace(/\/bin\/[^\/]+$/, "");

export const homeDir: string = Deno.cwd().replaceAll("\\", "/").split("/").slice(0, 3).join("/");

