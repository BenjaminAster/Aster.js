
export const sleep = async (ms?: number): Promise<void> => (
	new Promise(
		(resolve: () => void) => globalThis.setTimeout(resolve, ms)
	)
);

export function toConsoleCSSArray(segments: [
	string,
	{ [key: string]: string, }
][]): string[] {
	let endString: string = "";
	let cssArray: string[] = [];
	for (const [string, cssObj] of segments) {
		endString += `%c${string}`;
		cssArray.push(
			Object.entries(cssObj).map(
				(entry) => entry.join(":")
			).join(";")
		);
	}
	return [endString, ...cssArray];
}

export const addDotSlash = (inputPath: string): string => (
	inputPath.match(/^\.[\.]?\//) ? inputPath : `./${inputPath}`
);

export const [denoArgs, denoProps] = (() => {
	let denoArgs: string[] = [];
	let denoProps: string[] = [];
	for (const arg of Deno.args) {
		if (arg.startsWith("-")) {
			denoProps.push(arg);
		} else {
			denoArgs.push(arg);
		}
	}
	return [denoArgs, denoProps];
})();

export const isWindows: boolean = (Deno.build.os === "windows");
