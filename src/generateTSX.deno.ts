
export function generateTSX(codeObject: any) {

	let varNames: string[] = [];

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
						...segment.array.map((markupArraySegment: any) => {
							switch (markupArraySegment.type) {
								case ("markup"): {
									return markupArraySegment.code.map(replaceVarNames).join("\n");
								}
								case ("block"): {
									return (
										[
											`{() => {`,
											...recursiveBlocks(markupArraySegment.array),
											`}}`,
										].join("\n")
									);
								}
							}
						}),
						`</>);`
					]);
					break;
				}
			}
		}

		codeSegments.push(`return _A_ElementsArray;`);
		return codeSegments;
	}

	return [
		``,
		...recursiveBlocks(codeObject),
		``,
	].join("\n");
}
