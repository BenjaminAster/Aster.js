
import {
	Args as FlagArgs, // type
	parse as parseFlags,
} from "https://deno.land/std@0.109.0/flags/mod.ts";

export const version: string = "0.6.15";

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
			cssObj ? (
				Object.entries({ ...cssObj, ...globalCSSObj }).map(
					(([key, value]) => `${key.replace(
						/[A-Z]/g, ($) => `-${$.toLowerCase()}`
					)}:${value}`)
				).join(";")
			) : ("")
		);
	}
	return [endString, ...cssArray];
}

export const addDotSlash = (inputPath: string): string => (
	inputPath.match(/^\.[\.]?\//) ? inputPath : `./${inputPath}`
);

export const denoArgs: FlagArgs = parseFlags(Deno.args, {});

export const isWindows: boolean = (Deno.build.os === "windows");

export const githubRawURL: string = `https://raw.githubusercontent.com/BenjaminAster/Aster.js/main`;

export const denoDir: string = Deno.execPath().replaceAll("\\", "/").replace(/\/\.deno\/.*$/, "/.deno");

