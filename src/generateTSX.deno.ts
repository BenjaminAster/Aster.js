

import {
	asterjsParser
} from "./asterjsParser.deno.ts";

import {
	modifyCodeObject,
} from "./modifyCodeObject.deno.ts";

export function generateTSX(asterjsCode: string) {
	const codeObject: any = modifyCodeObject(asterjsParser(asterjsCode));

	let SCSSCodes: {
		code: string,
		className?: string,
		global?: boolean,
	}[] = [];

	function recursiveBlocks(block: any[]) {
		let codeSegments: string[] = [
			`let _A_ElementsArray: JSX.Element[] = [];`,
		];

		for (let segment of block) {
			switch (segment.type) {
				case ("script"): {
					codeSegments.push(...segment.code);
					break;
				}
				case ("markupArray"): {
					codeSegments.push(
						`_A_ElementsArray.push(<>`,
						...(() => {
							let returnArray = [];
							let lastBlockStyle;
							for (let i = segment.array.length - 1; i >= 0; i--) {
								let markupArraySegment = segment.array[i];
								returnArray.push((() => {
									switch (markupArraySegment.type) {
										case ("markup"): {
											if (lastBlockStyle) {
												markupArraySegment.code = (() => {
													let code: string = markupArraySegment.code.join("\n");
													let lastGtIndex = code.lastIndexOf(">");
													let className = `_A_${SCSSCodes.length}`;
													code = [
														code.slice(0, lastGtIndex),
														` class={_A_S_styles[${JSON.stringify(className)}]}`,
														code.slice(lastGtIndex),
													].join("");
													SCSSCodes.push({
														className,
														code: lastBlockStyle.join("\n"),
													});
													return code.split("\n");
												})();
												lastBlockStyle = undefined;
											}
											{
												markupArraySegment.code = markupArraySegment.code.map((line: string) => {
													// find class names
													{
														// class names written as array:
														const match = /\b(?<all>(class=\{\s*(?<array>(\[[^\]]+\]))\s*\}))/.exec(line);

														if (match?.groups) {
															return [
																line.slice(0, match.index),
																`class={${match.groups.array}.map((_A_className: string) => _A_S_styles[_A_className]).join(" ")}`,
																line.slice(match.index + match.groups.all.length),
															].join("");
														}
													}
													{
														// class names written as string:
														const match = /\b(?<all>(class=\{?\s*(?<string>(("[^"]+")|('[^']+')|(`[^`]+`)))\s*\}?))/.exec(line);

														if (match?.groups) {
															return [
																line.slice(0, match.index),
																`class={${match.groups.string}.split(" ").map((_A_className: string) => _A_S_styles[_A_className]).join(" ")}`,
																line.slice(match.index + match.groups.all.length),
															].join("");
														}
													}
													return line;
												});
											}
											// return markupArraySegment.code.map(replaceVarNames).join("\n");
											return markupArraySegment.code.join("\n");
										}
										case ("block"): {
											if (markupArraySegment.style) {
												lastBlockStyle = markupArraySegment.style;
											}
											return (
												[
													`{() => {`,
													...recursiveBlocks(markupArraySegment.array),
													`}}`,
												].join("\n")
											);
										}
									}
								})());
							}
							return returnArray.reverse();
						})(),
						`</>);`,
					);
					break;
				}
				case ("globalStyle"): {
					SCSSCodes.push({
						code: segment.code.join("\n"),
						global: true,
					});
					break;
				}
			}
		}

		codeSegments.push(`return _A_ElementsArray;`);
		return codeSegments;
	}

	return {
		solidJSCode: [
			``,
			...recursiveBlocks(codeObject),
			``,
		].join("\n"),

		SCSSCode: SCSSCodes.map(({ className, code, global }) => (
			global ? code : `.${className} {\n\t${code.replaceAll("\n", "\n\t")}\n}`
		)).join("\n\n"),
	};
}

