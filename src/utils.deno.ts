
export const sleep = async (ms?: number): Promise<void> => (
	new Promise(
		(resolve: () => void) => globalThis.setTimeout(resolve, ms)
	)
);

export function toConsoleCSSArray(segments: [string, string][]): string[] {
	let endString: string = "";
	let cssArray: string[] = [];
	for (const [string, css] of segments) {
		endString += `%c${string}`;
		cssArray.push(css);
	}
	return [endString, ...cssArray];
}

export const addDotSlash = (inputPath: string): string => (
	inputPath.match(/^\.[\.]?\//) ? inputPath : `./${inputPath}`
);

export const isWindows: boolean = (Deno.build.os === "windows");
export const terminalFileExtension: string = (isWindows) ? ".cmd" : ".sh";
export const terminalFileFirstLine: string = isWindows ? "" : "#!/bin/sh";

