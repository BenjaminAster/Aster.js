
export function generateTSX(codeObject: any) {

	let varNames: string[] = [];
	let SCSSCodes: {
		code: string,
		className?: string,
		global?: boolean,
	}[] = [];

	// function replaceVarNames(string: string) {
	// 	for (let varName of varNames) {
	// 		const regex = new RegExp(`(?<varName>(\\B\\$${varName}\\b))`, "g");
	// 		let match = regex.exec(string);
	// 		if (match) {
	// 			string = string.replace(regex, `$${varName}._`);
	// 		}
	// 	}
	// 	return string;
	// }

	function recursiveBlocks(block: any[]) {
		let codeSegments: string[] = [
			`let _A_ElementsArray: JSX.Element[] = [];`,
		];

		for (let segment of block) {
			switch (segment.type) {
				case ("script"): {
					// for (let [i, line] of segment.code.entries()) {
					// 	let groups = line.trim().match(
					// 		/^(?<varLine>(let \$(?<varName>([A-z0-9_]+)).+?=.+;))/
					// 	)?.groups;

					// 	if (groups?.varLine && groups?.varName) {
					// 		varNames.push(groups.varName);
					// 		line = line.replace(groups.varLine, [
					// 			`let $${groups.varName} = _A_createSignalVar((() => {`,
					// 			`${groups.varLine}`,
					// 			`return $${groups.varName};`,
					// 			`})());`,
					// 		].join("\n"));

					// 		segment.code[i] = line;
					// 	} else {
					// 		segment.code[i] = replaceVarNames(line);
					// 	}
					// }

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
													// `{() => (<><Dynamic component={() => (<>{() => {`,
													// ...recursiveBlocks(markupArraySegment.array),
													// `}}</>)} /></>)}`,
													// `<Dynamic component={() => (<>{() => {`,
													// ...recursiveBlocks(markupArraySegment.array),
													// `}}</>)} />`,
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
