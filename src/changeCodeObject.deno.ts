
export function changeCodeObject(codeObject: any): any {

	let varNames: string[] = [];
	let SCSSCodes: {
		code: string,
		className?: string,
		global?: boolean,
	}[] = [];

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

	function recursiveNested(block: any[]) {
		for (let [i, segment] of block.entries()) {
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
								`return $${groups.varName};`,
								`})());`,
							].join(" "));

							segment.code[i] = line;
						} else {
							segment.code[i] = replaceVarNames(line);
						}
					}
					break;
				}
				case ("markupArray"): {
					for (let i = segment.array.length - 1; i >= 0; i--) {

						segment.array[i] = ((markupArraySegment) => {
							switch (markupArraySegment.type) {
								case ("markup"): {
									markupArraySegment.code = markupArraySegment.code.map(replaceVarNames);
									break;
								}
								case ("block"): {
									markupArraySegment.array = recursiveNested(markupArraySegment.array);
									break;
								}
							}
							return markupArraySegment;
						})(segment.array[i]);

					}

					break;
				}
			}
			block[i] = segment;
		}
		return block;
	}

	codeObject = recursiveNested(codeObject);

	// Deno.writeTextFile("./codeObject.json", JSON.stringify(codeObject, null, "\t"));

	return codeObject;
}

