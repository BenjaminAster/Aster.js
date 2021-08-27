
export function generateTSX(codeObject: any) {

	let varNames: string[] = [];
	let SCSSCodes: any[] = [];
	let dateNow = Date.now();

	function replaceVarNames(string: string) {
		for (let varName of varNames) {
			const regex = new RegExp(`(?<varName>(\\B\\$${varName}\\b))`, "g");
			let match = regex.exec(string);
			if (match) {
				string = string.replace(regex, `$${varName}._`);
			}
		}
		return string;
	}

	function recursiveBlocks(block: any) {
		let codeSegments: string[] = [
			`let _A_ElementsArray: JSX.Element[] = [];`,
		];

		for (let segment of block) {
			switch (segment.type) {
				case ("script"): {
					for (let [i, line] of segment.code.entries()) {
						let groups = line.trim().match(
							/^(?<varLine>(let \$(?<varName>([A-z0-9_]+)).+?=.+;))/
						)?.groups;

						if (groups?.varLine && groups?.varName) {
							varNames.push(groups.varName);
							line = line.replace(groups.varLine, [
								`let $${groups.varName} = _A_createSignalVar((() => {`,
								`${groups.varLine}`,
								`return $${groups.varName}; })());`,
							].join("\n"));

							segment.code[i] = line;
						} else {
							segment.code[i] = replaceVarNames(line);
						}
					}

					codeSegments.push(...segment.code);
					break;
				}
				case ("markupArray"): {
					codeSegments.push(...[
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
													let code = markupArraySegment.code.join("\n");
													let lastGtIndex = code.lastIndexOf(">");
													let className = `_A_${
														dateNow.toString(36)
													}_${
														Math.floor(Math.random() * 36 ** 8).toString(36)
													}`;
													code = [
														code.slice(0, lastGtIndex),
														` class={styles[${JSON.stringify(className)}]}`,
														code.slice(lastGtIndex),
													].join("");
													SCSSCodes.unshift({
														className,
														code: lastBlockStyle.join("\n"),
													});
													return code.split("\n");
												})();
												lastBlockStyle = undefined;
											}
											return markupArraySegment.code.map(replaceVarNames).join("\n");
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
						`</>);`
					]);
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
		SCSSCode: SCSSCodes.map(({className, code}) => (
			`.${className} {\n${code}\n}\n`
		)).join("\n") + [
			``,
			`:root {`,
			`	color-scheme: dark;`,
			`}`,
			``,
			`body {`,
			`	font-family: sans-serif;`,
			`	background-color: #111;`,
			`	color: white;`,
			`}`,
		].join("\n"),
	};
}
